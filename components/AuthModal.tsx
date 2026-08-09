"use client";

import { useCallback, useState } from "react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../lib/store/hooks";
import { setUser } from "../lib/store/slices/authSlice";
import { setAuthOpen } from "../lib/store/slices/authModalSlice";

type GoogleJwtPayload = JwtPayload & {
  name?: string;
  email?: string;
  picture?: string;
};

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

const BENEFITS = [
  "จองรอบตัดผลไม้ล่วงหน้าได้ก่อนใคร",
  "เก็บที่อยู่และรายการโปรด สั่งซ้ำได้ในคลิกเดียว",
  "ติดตามพัสดุแบบควบคุมอุณหภูมิได้ตลอดทาง",
  "สะสมแต้มทุก ฿100 แลกกล่องของขวัญได้",
];

export default function AuthModal() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const authOpen = useAppSelector((state) => state.authModal.open);
  const [googleError, setGoogleError] = useState<string | null>(null);

  const loginWithGoogle = useCallback((credentialResponse: CredentialResponse) => {
    setGoogleError(null);

    if (!credentialResponse.credential) {
      setGoogleError("ไม่ได้รับข้อมูลจาก Google");
      return;
    }

    try {
      const decoded = jwtDecode<GoogleJwtPayload>(credentialResponse.credential);

      if (!decoded.sub || !decoded.name || !decoded.email) {
        throw new Error("ข้อมูลบัญชี Google ไม่ครบถ้วน");
      }

      dispatch(setUser({
        provider: "google",
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
      }));
      dispatch(setAuthOpen(false));
      router.push("/cart");
    } catch {
      setGoogleError("ไม่สามารถอ่านข้อมูลบัญชี Google ได้ กรุณาลองใหม่");
    }
  }, [dispatch, router]);

  return (
    <div className={`modal-backdrop${authOpen ? " modal-backdrop--open" : ""}`} role="presentation" aria-hidden={!authOpen} onMouseDown={(event) => { if (event.target === event.currentTarget) dispatch(setAuthOpen(false)); }}>
      <div className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <div className="auth-modal__intro">
          <p className="eyebrow">สมาชิกมธุรส</p>
          <h2 id="auth-title">สมัครก่อนสั่งซื้อ เพื่อให้เราตัดผลไม้ให้ถูกรอบ</h2>
          <div className="auth-benefits">
            {BENEFITS.map((text) => (
              <div key={text}><span>—</span><span>{text}</span></div>
            ))}
          </div>
        </div>
        <div className="auth-modal__form">
          <button className="modal-close" onClick={() => dispatch(setAuthOpen(false))} aria-label="ปิด">×</button>
          {/* ปิดระบบสมัครสมาชิก/เข้าสู่ระบบด้วยเบอร์โทรไว้ชั่วคราว
          <div className="auth-tabs">
            <button className={authMode === "register" ? "active" : ""} onClick={() => dispatch(setAuthMode("register"))}>สมัครสมาชิก</button>
            <button className={authMode === "login" ? "active" : ""} onClick={() => dispatch(setAuthMode("login"))}>เข้าสู่ระบบ</button>
          </div>
          <div className="auth-fields">
            <div className={`auth-field-collapse${authMode === "register" ? "" : " auth-field-collapse--closed"}`}>
              <div className="auth-field-collapse__inner">
                <label className="auth-field">
                  <span>ชื่อ–นามสกุล</span>
                  <input
                    value={authName}
                    onChange={(event) => dispatch(setAuthName(event.target.value))}
                    placeholder="เช่น ปิยะดา ส."
                    tabIndex={authMode === "register" ? 0 : -1}
                    aria-hidden={authMode !== "register"}
                  />
                </label>
              </div>
            </div>
            <label className="auth-field">
              <span>เบอร์โทรศัพท์</span>
              <input inputMode="tel" placeholder="08X-XXX-XXXX" />
            </label>
            <label className="auth-field">
              <span>รหัสผ่าน</span>
              <input type="password" placeholder="อย่างน้อย ๘ ตัวอักษร" />
            </label>
          </div>
          <button className="button button--dark" onClick={submit}>{authMode === "register" ? "สมัครสมาชิกและสั่งซื้อต่อ" : "เข้าสู่ระบบ"}</button>
          <div className="auth-divider"><span /> หรือ <span /></div>
          */}
          {googleClientId ? (
            <div className="auth-google-button">
              <GoogleLogin
                onSuccess={loginWithGoogle}
                onError={() => setGoogleError("เข้าสู่ระบบด้วย Google ไม่สำเร็จ กรุณาลองใหม่")}
                theme="outline"
                size="large"
                shape="rectangular"
                text="continue_with"
                logo_alignment="left"
                width="352"
              />
            </div>
          ) : (
            <button className="auth-alt-button" disabled>ยังไม่ได้ตั้งค่า Google Client ID</button>
          )}
          {googleError && <p className="auth-google-error" role="alert">{googleError}</p>}
          <small>การสมัครถือว่ายอมรับเงื่อนไขการใช้งานและนโยบายความเป็นส่วนตัว</small>
        </div>
      </div>
    </div>
  );
}
