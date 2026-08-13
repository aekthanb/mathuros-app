import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CreateOrderItemInput } from "../../order";

export type CartItem = {
  id: string;
  /**
   * products.id ที่ POST /orders ต้องใช้ — null สำหรับรายการที่ไม่มีอยู่จริงในฐานข้อมูล
   * เช่น "กล่องคัดพิเศษของสัปดาห์นี้" ที่เป็นชุดจัดหน้าร้านล้วน ๆ
   */
  productId: string | null;
  sku: string;
  name: string;
  label: string;
  /** product_sizes.id ที่ POST /orders ใช้คิดราคา — null เมื่อ productId เป็น null */
  sizeId: string | null;
  sizeLabel: string;
  unitPrice: number;
  qty: number;
};

type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Omit<CartItem, "id">>) {
      const { sku, sizeLabel, qty } = action.payload;
      const id = `${sku}::${sizeLabel}`;
      const existing = state.items.find((item) => item.id === id);
      if (existing) {
        existing.qty += qty;
      } else {
        state.items.push({ id, ...action.payload });
      }
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateCartQty(state, action: PayloadAction<{ id: string; qty: number }>) {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) item.qty = Math.max(1, action.payload.qty);
    },
  },
});

/**
 * แปลงตะกร้าเป็น `items` ของ POST /orders — ราคาคิดฝั่ง API จาก product_sizes
 * ของ sizeId ที่ส่งไป
 *
 * ตะกร้าแยกบรรทัดตาม sku + ขนาดอยู่แล้ว ปกติจึงแมปหนึ่งต่อหนึ่ง แต่ยังรวม qty
 * เผื่อไว้เพราะ API ห้ามส่งคู่ productId+sizeId ซ้ำในออเดอร์เดียว (ตอบ 400)
 * รายการที่ไม่มีอยู่จริงในฐานข้อมูล (กล่องคัดพิเศษ) จะถูกข้าม
 */
export function toOrderItems(items: CartItem[]): CreateOrderItemInput[] {
  const merged = new Map<string, CreateOrderItemInput>();
  for (const item of items) {
    if (!item.productId || !item.sizeId) continue;
    const key = `${item.productId}:${item.sizeId}`;
    const line = merged.get(key);
    if (line) line.qty += item.qty;
    else merged.set(key, { productId: item.productId, sizeId: item.sizeId, qty: item.qty });
  }
  return [...merged.values()];
}

export const { addToCart, removeFromCart, updateCartQty } = cartSlice.actions;
export default cartSlice.reducer;
