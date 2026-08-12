"use client";

import { useCallback, useState } from "react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import {
  loadFacebookSdk,
  type FacebookAuthResponse,
} from "../lib/facebook";
import {
  loginWithFacebookRequest,
  loginWithGoogleRequest,
} from "../api/auth";
import { setAuthSession, setUserSession, type SessionUser } from "../lib/auth/session";
import { useAppDispatch, useAppSelector } from "../lib/store/hooks";
import { setUser } from "../lib/store/slices/authSlice";
import { setAuthOpen } from "../lib/store/slices/authModalSlice";

type GoogleLoginButtonProps = {
  loading: boolean;
  onSuccess: (response: CredentialResponse) => void;
  onError: () => void;
};

function GoogleLoginButton({ loading, onSuccess, onError }: GoogleLoginButtonProps) {
  return (
    <div className={`auth-alt-button auth-google-custom-button${loading ? " auth-provider-loading" : ""}`}>
      <span className="auth-google-button-visual">
        <svg className="auth-provider-icon" viewBox="0 0 18 18" aria-hidden="true">
          <path fill="#4285f4" d="M17.64 9.205c0-.638-.057-1.252-.164-1.841H9v3.482h4.844a4.14 4.14 0 0 1-1.797 2.716v2.258h2.909c1.702-1.567 2.684-3.875 2.684-6.615Z" />
          <path fill="#34a853" d="M9 18c2.43 0 4.468-.806 5.956-2.18l-2.909-2.258c-.806.54-1.836.859-3.047.859-2.344 0-4.328-1.585-5.037-3.714H.956v2.332A9 9 0 0 0 9 18Z" />
          <path fill="#fbbc05" d="M3.963 10.707A5.41 5.41 0 0 1 3.681 9c0-.593.102-1.169.282-1.707V4.961H.956A9.003 9.003 0 0 0 0 9c0 1.452.347 2.827.956 4.039l3.007-2.332Z" />
          <path fill="#ea4335" d="M9 3.579c1.321 0 2.507.454 3.441 1.346l2.581-2.581C13.464.892 11.426 0 9 0A9 9 0 0 0 .956 4.961l3.007 2.332C4.672 5.164 6.656 3.579 9 3.579Z" />
        </svg>
        {loading ? "กำลังเข้าสู่ระบบด้วย Google..." : "ดำเนินการต่อโดยใช้ Google"}
      </span>
      {!loading && (
        <div className="auth-google-button-hitbox">
          <GoogleLogin
            onSuccess={onSuccess}
            onError={onError}
            theme="outline"
            size="large"
            shape="rectangular"
            text="continue_with"
            width="352"
          />
        </div>
      )}
    </div>
  );
}

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const facebookAppId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;

const BENEFITS = [
  "จองรอบตัดผลไม้ล่วงหน้าได้ก่อนใคร",
  "เก็บที่อยู่และรายการโปรด สั่งซ้ำได้ในคลิกเดียว",
  "ติดตามพัสดุแบบควบคุมอุณหภูมิได้ตลอดทาง",
  "สะสมแต้มทุก ฿100 แลกกล่องของขวัญได้",
];

export default function AuthModal() {
  const dispatch = useAppDispatch();
  const authOpen = useAppSelector((state) => state.authModal.open);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookError, setFacebookError] = useState<string | null>(null);
  const [facebookLoading, setFacebookLoading] = useState(false);

  const loginWithGoogle = useCallback(
    async (credentialResponse: CredentialResponse) => {
      setGoogleError(null);
      setGoogleLoading(true);

      try {
        if (!credentialResponse.credential) throw new Error("ไม่ได้รับ ID token จาก Google");

        const session = await loginWithGoogleRequest({
          idToken: credentialResponse.credential,
        });

        setAuthSession(session);

        const user: SessionUser = {
          provider: "google",
          id: session.user.id,
          name: session.user.name || session.user.email,
          email: session.user.email,
          picture: session.user.avatarUrl || undefined,
        };
        setUserSession(user);

        dispatch(setUser(user));
        dispatch(setAuthOpen(false));
      } catch (error) {
        setGoogleError(error instanceof Error ? error.message : "เข้าสู่ระบบด้วย Google ไม่สำเร็จ");
      } finally {
        setGoogleLoading(false);
      }
    },
    [dispatch],
  );

  const loginWithFacebook = useCallback(async () => {
    setFacebookError(null);

    if (!facebookAppId) {
      setFacebookError("ยังไม่ได้ตั้งค่า Facebook App ID");
      return;
    }

    setFacebookLoading(true);

    try {
      const facebookSdk = await loadFacebookSdk(facebookAppId);
      const authResponse = await new Promise<FacebookAuthResponse>(
        (resolve, reject) => {
          facebookSdk.login(
            (response) => {
              if (response.authResponse) resolve(response.authResponse);
              else reject(new Error("ยกเลิกการเข้าสู่ระบบด้วย Facebook"));
            },
            { scope: "public_profile,email" },
          );
        },
      );

      const session = await loginWithFacebookRequest({
        accessToken: authResponse.accessToken,
      });

      setAuthSession(session);

      const user: SessionUser = {
        provider: "facebook",
        id: session.user.id,
        name: session.user.name || session.user.email,
        email: session.user.email,
        picture: session.user.avatarUrl || undefined,
      };
      setUserSession(user);

      dispatch(setUser(user));
      dispatch(setAuthOpen(false));
    } catch (error) {
      setFacebookError(
        error instanceof Error
          ? error.message
          : "ไม่สามารถเข้าสู่ระบบด้วย Facebook ได้",
      );
    } finally {
      setFacebookLoading(false);
    }
  }, [dispatch]);

  return (
    <div
      className={`modal-backdrop${authOpen ? " modal-backdrop--open" : ""}`}
      role="presentation"
      aria-hidden={!authOpen}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) dispatch(setAuthOpen(false));
      }}
    >
      <div
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-heading"
      >
        <div className="auth-modal__intro">
          <p className="eyebrow">สมาชิกมธุรส</p>
          <h2>สั่งง่าย ได้ผลไม้สดตรงรอบทุกครั้ง</h2>
          <div className="auth-benefits">
            {BENEFITS.map((text) => (
              <div key={text}>
                <span>✓</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="auth-modal__form">
          <button
            className="modal-close"
            onClick={() => dispatch(setAuthOpen(false))}
            aria-label="ปิด"
          >
            ×
          </button>
          <div className="auth-form-heading">
            <p className="eyebrow">เริ่มต้นกับมธุรส</p>
            <h2 id="auth-heading">สมัครหรือเข้าสู่ระบบ</h2>
            <p>
              เลือกบัญชีที่ต้องการใช้ หากยังไม่เคยสมัคร
              เราจะสร้างบัญชีสมาชิกให้โดยอัตโนมัติ
            </p>
          </div>
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
          <div className="auth-social-buttons">
            <div className="auth-provider">
              {googleClientId ? (
                <GoogleLoginButton
                  loading={googleLoading}
                  onSuccess={loginWithGoogle}
                  onError={() => setGoogleError("เข้าสู่ระบบด้วย Google ไม่สำเร็จ กรุณาลองใหม่")}
                />
              ) : (
                <button className="auth-alt-button" disabled>
                  ยังไม่ได้ตั้งค่า Google Client ID
                </button>
              )}
              {googleError && (
                <p className="auth-provider-error" role="alert">
                  {googleError}
                </p>
              )}
            </div>
            <div className="auth-provider">
              <button
                className="auth-alt-button auth-facebook-button"
                onClick={loginWithFacebook}
                disabled={!facebookAppId || facebookLoading}
              >
                <svg
                  className="auth-provider-icon"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="12" fill="#1877f2" />
                  <path
                    fill="#fff"
                    d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.2-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.3v3h2.8v8h3.4Z"
                  />
                </svg>
                {facebookAppId
                  ? facebookLoading
                    ? "กำลังเข้าสู่ระบบด้วย Facebook..."
                    : "ดำเนินการต่อด้วย Facebook"
                  : "ยังไม่ได้ตั้งค่า Facebook App ID"}
              </button>
              {facebookError && (
                <p className="auth-provider-error" role="alert">
                  {facebookError}
                </p>
              )}
            </div>
          </div>
          <div className="auth-privacy-note">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 3 5.5 5.7v5.7c0 4.2 2.7 7.9 6.5 9.6 3.8-1.7 6.5-5.4 6.5-9.6V5.7L12 3Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="m9.2 12 1.8 1.8 3.8-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p>
              ข้อมูลบัญชีของคุณจะใช้สำหรับสมัครและเข้าสู่ระบบมธุรสเท่านั้น
              <small>
                เมื่อดำเนินการต่อ
                ถือว่าคุณยอมรับเงื่อนไขการใช้งานและนโยบายความเป็นส่วนตัว
              </small>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
