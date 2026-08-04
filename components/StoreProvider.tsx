"use client";

import { createContext, useContext, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { usePathname } from "next/navigation";
import type { Message } from "../lib/data";
import { getReply } from "../lib/assistant";

type AuthMode = "register" | "login";

type StoreContextValue = {
  sku: string;
  setSku: (sku: string) => void;
  size: number;
  setSize: Dispatch<SetStateAction<number>>;
  qty: number;
  setQty: Dispatch<SetStateAction<number>>;
  cartCount: number;
  addToCart: (qty: number) => void;

  user: string | null;
  login: (name: string) => void;
  logout: () => void;
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
  authOpen: boolean;
  setAuthOpen: Dispatch<SetStateAction<boolean>>;
  authMode: AuthMode;
  setAuthMode: Dispatch<SetStateAction<AuthMode>>;
  authName: string;
  setAuthName: Dispatch<SetStateAction<string>>;

  chatOpen: boolean;
  setChatOpen: Dispatch<SetStateAction<boolean>>;
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  messages: Message[];
  askAssistant: (text?: string) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used within a StoreProvider");
  return value;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [sku, setSkuRaw] = useState("fuji");
  const [size, setSize] = useState(0);
  const [qty, setQty] = useState(1);
  const [cartCount, setCartCount] = useState(2);

  const [user, setUser] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("register");
  const [authName, setAuthName] = useState("");

  const [chatOpen, setChatOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "สวัสดีค่ะ บอกได้เลยว่าจะกินกันกี่คน งบเท่าไหร่ หรือซื้อให้ใคร แล้วเราจะคัดผลไม้ที่สวนตัดได้ในสัปดาห์นี้ให้",
    },
  ]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  function setSku(next: string) {
    setSkuRaw(next);
    setSize(0);
    setQty(1);
  }

  function addToCart(quantity: number) {
    setCartCount((value) => value + quantity);
  }

  function login(name: string) {
    setUser(name);
  }

  function logout() {
    setUser(null);
  }

  function askAssistant(text = query) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((current) => [...current, { role: "user", text: trimmed }, getReply(trimmed)]);
    setQuery("");
    setChatOpen(true);
  }

  return (
    <StoreContext.Provider
      value={{
        sku,
        setSku,
        size,
        setSize,
        qty,
        setQty,
        cartCount,
        addToCart,
        user,
        login,
        logout,
        menuOpen,
        setMenuOpen,
        authOpen,
        setAuthOpen,
        authMode,
        setAuthMode,
        authName,
        setAuthName,
        chatOpen,
        setChatOpen,
        query,
        setQuery,
        messages,
        askAssistant,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}
