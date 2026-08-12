import { api } from "./client";
import type { ChatResponse } from "../lib/data";

export const sendChatMessageRequest = async (params: {
  message: string;
  sessionId?: string;
}) => {
  const res = await api.post<ChatResponse>("/chat", {
    message: params.message,
    // ครั้งแรกไม่ส่ง sessionId — ฝั่ง API จะสร้างให้แล้วส่งกลับมาใน response
    ...(params.sessionId ? { sessionId: params.sessionId } : {}),
  });
  return res.data;
};
