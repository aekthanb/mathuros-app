"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { bahtAmount } from "../lib/data";
import { useAppDispatch, useAppSelector } from "../lib/store/hooks";
import { askAssistant, resetChat, setChatOpen, setQuery } from "../lib/store/slices/assistantSlice";

const QUICK_PROMPTS: [string, string][] = [
  ["gift", "ของฝากผู้ใหญ่"],
  ["sweet", "หวานที่สุดตอนนี้"],
  ["budget", "งบไม่เกิน ฿1,000"],
  ["kids", "เด็กกินง่าย"],
];

export default function AssistantChat() {
  const dispatch = useAppDispatch();
  const chatOpen = useAppSelector((state) => state.assistant.chatOpen);
  const query = useAppSelector((state) => state.assistant.query);
  const messages = useAppSelector((state) => state.assistant.messages);
  const sending = useAppSelector((state) => state.assistant.sending);
  const error = useAppSelector((state) => state.assistant.error);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending, chatOpen]);

  return (
    <aside className={`assistant ${chatOpen ? "assistant--open" : ""}`}>
      <button className="assistant-trigger" onClick={() => dispatch(setChatOpen(true))} tabIndex={chatOpen ? -1 : 0} aria-hidden={chatOpen}>
        <span className="assistant-head__dot" />
        <span>ให้ AI ช่วยเลือกผลไม้</span>
      </button>
      <div className="assistant-panel" aria-hidden={!chatOpen}>
        <div className="assistant-head">
          <span className="assistant-head__dot" />
          <div className="assistant-head__title"><strong>ผู้ช่วยเลือกผลไม้</strong><small>MATHUROS AI</small></div>
          <button className="assistant-close" onClick={() => dispatch(setChatOpen(false))} tabIndex={chatOpen ? 0 : -1} aria-label="ปิด">×</button>
        </div>
        <div className="messages" ref={chatRef}>
          {messages.map((message, index) => (
            <div className={`message message--${message.role}`} key={`${message.role}-${index}`}>
              <p>{message.text.trim()}</p>
              {message.products?.map((product) => (
                <Link className="pick" key={product.id || product.sku} href={`/product/${product.sku}`} tabIndex={chatOpen ? 0 : -1}>
                  <span className="pick-thumb">
                    {product.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.imageUrl} alt={product.name} />
                    ) : null}
                  </span>
                  <span className="pick-info">
                    <strong>{product.name}</strong>
                    <small>{[product.unit, product.brix, product.origin].filter(Boolean).join(" · ")}</small>
                  </span>
                  <b>{bahtAmount(product.price)}</b>
                </Link>
              ))}
            </div>
          ))}
          {sending && (
            <div className="message message--assistant">
              <p className="message-typing">กำลังคัดผลไม้ให้อยู่…</p>
            </div>
          )}
        </div>
        <div className="assistant-footer">
          {error && (
            <div className="chat-error" role="alert">
              <span>{error}</span>
              <button onClick={() => dispatch(resetChat())} tabIndex={chatOpen ? 0 : -1}>เริ่มบทสนทนาใหม่</button>
            </div>
          )}
          <div className="quick-prompts">
            {QUICK_PROMPTS.map(([key, text]) => (
              <button key={key} onClick={() => dispatch(askAssistant(text))} disabled={sending} tabIndex={chatOpen ? 0 : -1}>{text}</button>
            ))}
          </div>
          <div className="chat-input">
            <input
              value={query}
              onChange={(event) => dispatch(setQuery(event.target.value))}
              onKeyDown={(event) => { if (event.key === "Enter") dispatch(askAssistant(query)); }}
              placeholder="พิมพ์สิ่งที่ต้องการ…"
              disabled={sending}
              tabIndex={chatOpen ? 0 : -1}
            />
            <button onClick={() => dispatch(askAssistant(query))} disabled={sending} tabIndex={chatOpen ? 0 : -1}>
              {sending ? "กำลังส่ง…" : "ส่ง"}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
