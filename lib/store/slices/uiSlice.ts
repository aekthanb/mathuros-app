import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type UiState = {
  menuOpen: boolean;
};

const initialState: UiState = {
  menuOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setMenuOpen(state, action: PayloadAction<boolean>) {
      state.menuOpen = action.payload;
    },
    toggleMenu(state) {
      state.menuOpen = !state.menuOpen;
    },
  },
});

export const { setMenuOpen, toggleMenu } = uiSlice.actions;
export default uiSlice.reducer;
