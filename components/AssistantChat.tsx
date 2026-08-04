"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { PRODUCTS, baht } from "../lib/data";
import { useStore } from "./StoreProvider";

const QUICK_PROMPTS: [string, string][] = [
  ["gift", "ของฝากผู้ใหญ่"],
  ["sweet", "หวานที่สุดตอนนี้"],
  ["budget", "งบไม่เกิน ฿1,000"],
  ["kids", "เด็กกินง่าย"],
];

export default function AssistantChat() {
  const { chatOpen, setChatOpen, query, setQuery, messages, askAssistant } = useStore();
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, chatOpen]);

  return (
    <aside className={`assistant ${chatOpen ? "assistant--open" : ""}`}>
      {chatOpen ? (
        <div className="assistant-head">
          <span className="assistant-head__dot" />
          <div className="assistant-head__title"><strong>ผู้ช่วยเลือกผลไม้</strong><small>MATHUROS AI</small></div>
          <button className="assistant-close" onClick={() => setChatOpen(false)} aria-label="ปิด">×</button>
        </div>
      ) : (
        <button className="assistant-head" onClick={() => setChatOpen(true)}>
          <span className="assistant-head__dot" />
          <span>ให้ AI ช่วยเลือกผลไม้</span>
        </button>
      )}
      {chatOpen && (
        <>
          <div className="messages" ref={chatRef}>
            {messages.map((message, index) => (
              <div className={`message message--${message.role}`} key={`${message.role}-${index}`}>
                <p>{message.text}</p>
                {message.picks?.map((pick) => {
                  const item = PRODUCTS.find((candidate) => candidate.sku === pick.sku)!;
                  return (
                    <Link className="pick" key={pick.sku} href={`/product/${pick.sku}`}>
                      <span className="pick-thumb" />
                      <span className="pick-info"><strong>{item.name}</strong><small>{pick.reason}</small></span>
                      <b>{baht(item.price)}</b>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="assistant-footer">
            <div className="quick-prompts">
              {QUICK_PROMPTS.map(([key, text]) => (
                <button key={key} onClick={() => askAssistant(text)}>{text}</button>
              ))}
            </div>
            <div className="chat-input">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => { if (event.key === "Enter") askAssistant(); }}
                placeholder="พิมพ์สิ่งที่ต้องการ…"
              />
              <button onClick={() => askAssistant()}>ส่ง</button>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
