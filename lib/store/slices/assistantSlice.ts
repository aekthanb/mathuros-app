import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ChatResponse, Message } from "../../data";
import { sendChatMessageRequest } from "../../../api/chat";
import { ApiError } from "../../../api/client";

type AssistantState = {
  chatOpen: boolean;
  query: string;
  messages: Message[];
  sessionId: string | null;
  sending: boolean;
  error: string | null;
};

const GREETING: Message = {
  role: "assistant",
  text: "สวัสดีครับ! ยินดีต้อนรับสู่ร้านมธุรสครับ วันนี้สนใจหาผลไม้พรีเมียมแบบไหนเป็นพิเศษไหมครับ? ไม่ว่าจะเป็นทานเองหรือซื้อเป็นของฝาก ยินดีแนะนำเลยครับ 🍊🍇🍈",
};

const initialState: AssistantState = {
  chatOpen: false,
  query: "",
  messages: [GREETING],
  sessionId: null,
  sending: false,
  error: null,
};

export const askAssistant = createAsyncThunk<
  ChatResponse,
  string,
  { state: { assistant: AssistantState }; rejectValue: string }
>(
  "assistant/ask",
  async (text, { getState, rejectWithValue }) => {
    const { sessionId } = getState().assistant;

    try {
      // ครั้งแรก sessionId เป็น null จึงไม่ถูกส่งไป ครั้งถัดไปใช้ค่าที่ API ตอบกลับมา
      return await sendChatMessageRequest({
        message: text.trim(),
        sessionId: sessionId ?? undefined,
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 429) {
        return rejectWithValue("บทสนทนานี้ยาวเกินไปแล้ว กดเริ่มบทสนทนาใหม่เพื่อคุยต่อได้เลยค่ะ");
      }
      if (error instanceof ApiError && error.status === 503) {
        return rejectWithValue("ผู้ช่วยไม่พร้อมใช้งานชั่วคราว ลองใหม่อีกครั้งในสักครู่นะคะ");
      }
      return rejectWithValue(
        error instanceof Error ? error.message : "ส่งข้อความไม่สำเร็จ",
      );
    }
  },
  {
    condition: (text, { getState }) => {
      const { assistant } = getState();
      return Boolean(text.trim()) && !assistant.sending;
    },
  },
);

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
    resetChat(state) {
      state.messages = [GREETING];
      state.sessionId = null;
      state.query = "";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(askAssistant.pending, (state, action) => {
        state.messages.push({ role: "user", text: action.meta.arg.trim() });
        state.query = "";
        state.chatOpen = true;
        state.sending = true;
        state.error = null;
      })
      .addCase(askAssistant.fulfilled, (state, action) => {
        state.sessionId = action.payload.sessionId;
        state.messages.push({
          role: "assistant",
          text: action.payload.reply,
          products: action.payload.products,
        });
        state.sending = false;
      })
      .addCase(askAssistant.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload ?? "ส่งข้อความไม่สำเร็จ";
      });
  },
});

export const { setChatOpen, setQuery, resetChat } = assistantSlice.actions;
export default assistantSlice.reducer;
