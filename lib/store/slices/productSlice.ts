import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ProductState = {
  sku: string;
  size: number;
  qty: number;
};

const initialState: ProductState = {
  sku: "fuji",
  size: 0,
  qty: 1,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setSku(state, action: PayloadAction<string>) {
      state.sku = action.payload;
      state.size = 0;
      state.qty = 1;
    },
    setSize(state, action: PayloadAction<number>) {
      state.size = action.payload;
    },
    setQty(state, action: PayloadAction<number>) {
      state.qty = action.payload;
    },
  },
});

export const { setSku, setSize, setQty } = productSlice.actions;
export default productSlice.reducer;
