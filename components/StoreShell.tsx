"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { StoreProvider } from "./StoreProvider";
import Header from "./Header";
import Footer from "./Footer";
import AssistantChat from "./AssistantChat";
import AuthModal from "./AuthModal";
import BackToTop from "./BackToTop";

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function StoreShell({ children }: { children: React.ReactNode }) {
  const store = (
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

  if (!googleClientId) return store;

  return (
    <GoogleOAuthProvider clientId={googleClientId} locale="th">
      {store}
    </GoogleOAuthProvider>
  );
}
