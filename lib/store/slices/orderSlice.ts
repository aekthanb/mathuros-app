import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { CreateOrderInput, Order, OrderPage } from "../../order";
import {
  cancelOrderRequest,
  createOrderRequest,
  listOrdersRequest,
  newIdempotencyKey,
} from "../../../api/orders";
import { ApiError } from "../../../api/client";
import { logout } from "./authSlice";

type OrderState = {
  items: Order[];
  nextCursor: string | null;
  loading: boolean;
  loaded: boolean;
  loadingMore: boolean;
  placing: boolean;
  /** ออเดอร์ที่เพิ่งสั่งสำเร็จ — หน้าชำระเงินหยิบไปแสดงยอดจริง */
  lastPlacedId: string | null;
  /** id ของออเดอร์ที่กำลังยกเลิก */
  pendingId: string | null;
  unauthorized: boolean;
  error: string | null;
  fetchRequestId: string | null;
};

const initialState: OrderState = {
  items: [],
  nextCursor: null,
  loading: false,
  loaded: false,
  loadingMore: false,
  placing: false,
  lastPlacedId: null,
  pendingId: null,
  unauthorized: false,
  error: null,
  fetchRequestId: null,
};

function toMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    if (error.status === 401) return "กรุณาเข้าสู่ระบบก่อนดูคำสั่งซื้อ";
    if (error.status === 404) return "ไม่พบคำสั่งซื้อนี้แล้ว";
    if (error.status === 409) return "สถานะคำสั่งซื้อเปลี่ยนไปแล้ว กรุณารีเฟรชหน้านี้";
  }
  return error instanceof Error ? error.message : fallback;
}

const isUnauthorized = (error: unknown) => error instanceof ApiError && error.status === 401;

export const fetchOrders = createAsyncThunk<
  OrderPage,
  number | undefined,
  { rejectValue: { message: string; unauthorized: boolean } }
>("order/fetch", async (limit, { rejectWithValue }) => {
  try {
    return await listOrdersRequest(limit ? { limit } : {});
  } catch (error) {
    return rejectWithValue({
      message: toMessage(error, "โหลดคำสั่งซื้อไม่สำเร็จ"),
      unauthorized: isUnauthorized(error),
    });
  }
});

/** หน้าถัดไปแบบ keyset — ส่ง nextCursor ที่ได้จากหน้าก่อนกลับไป */
export const fetchMoreOrders = createAsyncThunk<
  OrderPage,
  void,
  { state: { order: OrderState }; rejectValue: string }
>(
  "order/fetchMore",
  async (_, { getState, rejectWithValue }) => {
    const cursor = getState().order.nextCursor;
    if (!cursor) return { orders: [], nextCursor: null };
    try {
      return await listOrdersRequest({ cursor });
    } catch (error) {
      return rejectWithValue(toMessage(error, "โหลดคำสั่งซื้อเพิ่มไม่สำเร็จ"));
    }
  },
  {
    condition: (_, { getState }) => {
      const { nextCursor, loading, loadingMore } = getState().order;
      return Boolean(nextCursor) && !loading && !loadingMore;
    },
  },
);

/**
 * คีย์ idempotency สร้างครั้งเดียวต่อการกดสั่งซื้อหนึ่งครั้ง ถ้ากดซ้ำเพราะเน็ตหลุด
 * ให้ส่ง idempotencyKey เดิมกลับมาด้วย จะได้ออเดอร์ใบเดิมแทนใบใหม่
 */
export const placeOrder = createAsyncThunk<
  Order,
  { input: CreateOrderInput; idempotencyKey?: string },
  { rejectValue: string }
>("order/place", async ({ input, idempotencyKey }, { rejectWithValue }) => {
  try {
    return await createOrderRequest(input, idempotencyKey ?? newIdempotencyKey());
  } catch (error) {
    if (error instanceof ApiError) {
      // 404 ตอนสั่งซื้อไม่ได้แปลว่า "ไม่พบออเดอร์" แบบ endpoint อื่น แต่คือที่อยู่
      // ถูกลบไปแล้ว หรือสินค้า/ขนาดที่ส่งไปไม่มีขายแล้ว
      if (error.status === 404) {
        return rejectWithValue("ที่อยู่หรือสินค้าบางรายการไม่พร้อมขายแล้ว กรุณารีเฟรชหน้านี้แล้วลองใหม่");
      }
      if (error.status === 409) {
        return rejectWithValue("สินค้าบางรายการมีไม่พอในรอบตัดผลไม้ถัดไป กรุณาปรับจำนวนแล้วลองใหม่");
      }
    }
    return rejectWithValue(toMessage(error, "สั่งซื้อไม่สำเร็จ"));
  }
});

export const cancelOrder = createAsyncThunk<Order, string, { rejectValue: string }>(
  "order/cancel",
  async (id, { rejectWithValue }) => {
    try {
      return await cancelOrderRequest(id);
    } catch (error) {
      return rejectWithValue(toMessage(error, "ยกเลิกคำสั่งซื้อไม่สำเร็จ"));
    }
  },
);

function applyOrder(state: OrderState, order: Order) {
  const index = state.items.findIndex((item) => item.id === order.id);
  if (index >= 0) state.items[index] = order;
  // ออเดอร์ใหม่ขึ้นหัวรายการ เพราะ API เรียงใหม่สุดก่อน
  else state.items.unshift(order);
}

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrderError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout, () => ({ ...initialState }))
      .addCase(fetchOrders.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.fetchRequestId = action.meta.requestId;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        if (state.fetchRequestId !== action.meta.requestId) return;
        state.items = action.payload.orders;
        state.nextCursor = action.payload.nextCursor;
        state.loading = false;
        state.loaded = true;
        state.unauthorized = false;
        state.fetchRequestId = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        if (state.fetchRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.loaded = true;
        state.unauthorized = action.payload?.unauthorized ?? false;
        state.fetchRequestId = null;
        if (state.unauthorized) {
          state.items = [];
          state.nextCursor = null;
        }
        state.error = action.payload?.unauthorized
          ? null
          : action.payload?.message ?? "โหลดคำสั่งซื้อไม่สำเร็จ";
      })
      .addCase(fetchMoreOrders.pending, (state) => {
        state.loadingMore = true;
        state.error = null;
      })
      .addCase(fetchMoreOrders.fulfilled, (state, action) => {
        const seen = new Set(state.items.map((item) => item.id));
        state.items.push(...action.payload.orders.filter((order) => !seen.has(order.id)));
        state.nextCursor = action.payload.nextCursor;
        state.loadingMore = false;
      })
      .addCase(fetchMoreOrders.rejected, (state, action) => {
        state.loadingMore = false;
        state.error = action.payload ?? "โหลดคำสั่งซื้อเพิ่มไม่สำเร็จ";
      })
      .addCase(placeOrder.pending, (state) => {
        state.placing = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        applyOrder(state, action.payload);
        state.lastPlacedId = action.payload.id;
        state.placing = false;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.placing = false;
        state.error = action.payload ?? "สั่งซื้อไม่สำเร็จ";
      })
      .addCase(cancelOrder.pending, (state, action) => {
        state.pendingId = action.meta.arg;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        if (state.pendingId !== action.meta.arg) return;
        applyOrder(state, action.payload);
        state.pendingId = null;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.pendingId = null;
        state.error = action.payload ?? "ยกเลิกคำสั่งซื้อไม่สำเร็จ";
      });
  },
});

export const { clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;
