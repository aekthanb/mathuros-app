import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SessionUser } from "../../auth/session";

export type AuthUser = SessionUser;

type AuthState = {
  user: AuthUser | null;
  hydrated: boolean;
};

const initialState: AuthState = {
  user: null,
  hydrated: false,
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
      state.hydrated = true;
    },
    setUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      state.hydrated = true;
    },
    hydrateAuth(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
      state.hydrated = true;
    },
    logout(state) {
      state.user = null;
      state.hydrated = true;
    },
  },
});

export const { hydrateAuth, login, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
