import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AuthMode = "register" | "login";

type AuthModalState = {
  open: boolean;
  mode: AuthMode;
  name: string;
};

const initialState: AuthModalState = {
  open: false,
  mode: "register",
  name: "",
};

const authModalSlice = createSlice({
  name: "authModal",
  initialState,
  reducers: {
    setAuthOpen(state, action: PayloadAction<boolean>) {
      state.open = action.payload;
    },
    setAuthMode(state, action: PayloadAction<AuthMode>) {
      state.mode = action.payload;
    },
    setAuthName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
  },
});

export const { setAuthOpen, setAuthMode, setAuthName } = authModalSlice.actions;
export default authModalSlice.reducer;
