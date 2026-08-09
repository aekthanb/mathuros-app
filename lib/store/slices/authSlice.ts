import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AuthUser = {
  provider: "local" | "google";
  id?: string;
  name: string;
  email?: string;
  picture?: string;
};

type AuthState = {
  user: AuthUser | null;
};

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<string>) {
      state.user = {
        provider: "local",
        name: action.payload,
      };
    },
    setUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
    },
  },
});

export const { login, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
