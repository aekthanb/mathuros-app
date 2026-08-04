"use client";

import { StoreProvider } from "./StoreProvider";
import Header from "./Header";
import Footer from "./Footer";
import AssistantChat from "./AssistantChat";
import AuthModal from "./AuthModal";
import BackToTop from "./BackToTop";

export default function StoreShell({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <div className="store-layout">
        <div className="store-main">
          <div className="announcement">จัดส่งฟรีทั่วประเทศ เมื่อสั่งครบ ฿1,500 — ตัดจากสวนเช้านี้ ถึงมือคุณพรุ่งนี้</div>
          <Header />
          {children}
          <Footer />
        </div>
        <AssistantChat />
        <AuthModal />
        <BackToTop />
      </div>
    </StoreProvider>
  );
}
