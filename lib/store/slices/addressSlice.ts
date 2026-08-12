import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  sortAddresses,
  type CreateAddressInput,
  type SavedAddress,
  type UpdateAddressInput,
} from "../../address";
import {
  createAddressRequest,
  deleteAddressRequest,
  listAddressesRequest,
  setDefaultAddressRequest,
  updateAddressRequest,
} from "../../../api/addresses";
import { ApiError } from "../../../api/client";

type AddressState = {
  items: SavedAddress[];
  loading: boolean;
  loaded: boolean;
  saving: boolean;
  /** id ของที่อยู่ที่กำลังลบ / กำลังตั้งเป็นที่อยู่หลัก */
  pendingId: string | null;
  unauthorized: boolean;
  error: string | null;
};

const initialState: AddressState = {
  items: [],
  loading: false,
  loaded: false,
  saving: false,
  pendingId: null,
  unauthorized: false,
  error: null,
};

function toMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    if (error.status === 401) return "กรุณาเข้าสู่ระบบก่อนใช้งานที่อยู่จัดส่ง";
    if (error.status === 404) return "ไม่พบที่อยู่นี้แล้ว อาจถูกลบไปก่อนหน้านี้";
  }
  return error instanceof Error ? error.message : fallback;
}

const isUnauthorized = (error: unknown) => error instanceof ApiError && error.status === 401;

export const fetchAddresses = createAsyncThunk<
  SavedAddress[],
  void,
  { rejectValue: { message: string; unauthorized: boolean } }
>("address/fetch", async (_, { rejectWithValue }) => {
  try {
    return await listAddressesRequest();
  } catch (error) {
    return rejectWithValue({
      message: toMessage(error, "โหลดที่อยู่ไม่สำเร็จ"),
      unauthorized: isUnauthorized(error),
    });
  }
});

export const createAddress = createAsyncThunk<
  SavedAddress,
  CreateAddressInput,
  { rejectValue: string }
>("address/create", async (input, { rejectWithValue }) => {
  try {
    return await createAddressRequest(input);
  } catch (error) {
    return rejectWithValue(toMessage(error, "บันทึกที่อยู่ไม่สำเร็จ"));
  }
});

export const updateAddress = createAsyncThunk<
  SavedAddress,
  { id: string; changes: UpdateAddressInput },
  { rejectValue: string }
>("address/update", async ({ id, changes }, { rejectWithValue }) => {
  try {
    return await updateAddressRequest(id, changes);
  } catch (error) {
    return rejectWithValue(toMessage(error, "แก้ไขที่อยู่ไม่สำเร็จ"));
  }
});

export const makeAddressDefault = createAsyncThunk<
  SavedAddress,
  string,
  { rejectValue: string }
>("address/makeDefault", async (id, { rejectWithValue }) => {
  try {
    return await setDefaultAddressRequest(id);
  } catch (error) {
    return rejectWithValue(toMessage(error, "ตั้งที่อยู่หลักไม่สำเร็จ"));
  }
});

/** ลบแล้วดึงรายการใหม่ เพราะฝั่ง API จะเลื่อนที่อยู่เก่าสุดขึ้นเป็นค่าเริ่มต้นให้เอง */
export const deleteAddress = createAsyncThunk<
  SavedAddress[],
  string,
  { rejectValue: string }
>("address/delete", async (id, { rejectWithValue }) => {
  try {
    await deleteAddressRequest(id);
    return await listAddressesRequest();
  } catch (error) {
    return rejectWithValue(toMessage(error, "ลบที่อยู่ไม่สำเร็จ"));
  }
});

function applySaved(state: AddressState, saved: SavedAddress) {
  if (saved.isDefault) {
    state.items.forEach((item) => {
      item.isDefault = false;
    });
  }
  const index = state.items.findIndex((item) => item.id === saved.id);
  if (index >= 0) state.items[index] = saved;
  else state.items.push(saved);
  state.items = sortAddresses(state.items);
}

function startSaving(state: AddressState) {
  state.saving = true;
  state.error = null;
}

function finishSaving(state: AddressState, action: { payload: SavedAddress }) {
  applySaved(state, action.payload);
  state.saving = false;
}

function failSaving(state: AddressState, action: { payload?: string }) {
  state.saving = false;
  state.error = action.payload ?? "บันทึกที่อยู่ไม่สำเร็จ";
}

function startPending(state: AddressState, action: { meta: { arg: string } }) {
  state.pendingId = action.meta.arg;
  state.error = null;
}

function failPending(state: AddressState, action: { payload?: string }) {
  state.pendingId = null;
  state.error = action.payload ?? "ทำรายการไม่สำเร็จ";
}

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    clearAddressError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.items = sortAddresses(action.payload);
        state.loading = false;
        state.loaded = true;
        state.unauthorized = false;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.unauthorized = action.payload?.unauthorized ?? false;
        state.error = action.payload?.unauthorized ? null : action.payload?.message ?? "โหลดที่อยู่ไม่สำเร็จ";
      })
      .addCase(createAddress.pending, startSaving)
      .addCase(createAddress.fulfilled, finishSaving)
      .addCase(createAddress.rejected, failSaving)
      .addCase(updateAddress.pending, startSaving)
      .addCase(updateAddress.fulfilled, finishSaving)
      .addCase(updateAddress.rejected, failSaving)
      .addCase(makeAddressDefault.pending, startPending)
      .addCase(makeAddressDefault.fulfilled, (state, action) => {
        applySaved(state, action.payload);
        state.pendingId = null;
      })
      .addCase(makeAddressDefault.rejected, failPending)
      .addCase(deleteAddress.pending, startPending)
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.items = sortAddresses(action.payload);
        state.pendingId = null;
      })
      .addCase(deleteAddress.rejected, failPending);
  },
});

export const { clearAddressError } = addressSlice.actions;
export default addressSlice.reducer;
