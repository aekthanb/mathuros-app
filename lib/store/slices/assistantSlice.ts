import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Message } from "../../data";
import { getReply } from "../../assistant";

type AssistantState = {
  chatOpen: boolean;
  query: string;
  messages: Message[];
};

const initialState: AssistantState = {
  chatOpen: false,
  query: "",
  messages: [
    {
      role: "assistant",
      text: "สวัสดีค่ะ บอกได้เลยว่าจะกินกันกี่คน งบเท่าไหร่ หรือซื้อให้ใคร แล้วเราจะคัดผลไม้ที่สวนตัดได้ในสัปดาห์นี้ให้",
    },
  ],
};

const assistantSlice = createSlice({
  name: "assistant",
  initialState,
  reducers: {
    setChatOpen(state, action: PayloadAction<boolean>) {
      state.chatOpen = action.payload;
    },
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    askAssistant(state, action: PayloadAction<string>) {
      const trimmed = action.payload.trim();
      if (!trimmed) return;
      state.messages.push({ role: "user", text: trimmed });
      state.messages.push(getReply(trimmed));
      state.query = "";
      state.chatOpen = true;
    },
  },
});

export const { setChatOpen, setQuery, askAssistant } = assistantSlice.actions;
export default assistantSlice.reducer;
