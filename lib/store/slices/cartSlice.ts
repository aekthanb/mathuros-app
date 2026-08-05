import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  id: string;
  sku: string;
  name: string;
  label: string;
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

export const { addToCart, removeFromCart, updateCartQty } = cartSlice.actions;
export default cartSlice.reducer;
