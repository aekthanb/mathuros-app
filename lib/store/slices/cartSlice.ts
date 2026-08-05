import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type CartState = {
  count: number;
};

const initialState: CartState = {
  count: 2,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<number>) {
      state.count += action.payload;
    },
  },
});

export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;
