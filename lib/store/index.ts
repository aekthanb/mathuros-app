import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import authModalReducer from "./slices/authModalSlice";
import assistantReducer from "./slices/assistantSlice";
import addressReducer from "./slices/addressSlice";
import orderReducer from "./slices/orderSlice";

export const store = configureStore({
  reducer: {
    product: productReducer,
    cart: cartReducer,
    auth: authReducer,
    ui: uiReducer,
    authModal: authModalReducer,
    assistant: assistantReducer,
    address: addressReducer,
    order: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
