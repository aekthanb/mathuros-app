"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../lib/store/hooks";
import { login } from "../lib/store/slices/authSlice";
import { setAuthMode, setAuthName, setAuthOpen } from "../lib/store/slices/authModalSlice";

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
  const authMode = useAppSelector((state) => state.authModal.mode);
  const authName = useAppSelector((state) => state.authModal.name);

  function submit() {
    dispatch(login(authName.trim() || "คุณลูกค้า"));
    dispatch(setAuthOpen(false));
    router.push("/cart");
  }

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
          <button className="auth-alt-button" onClick={submit}>ดำเนินการต่อด้วย Google</button>
          <small>การสมัครถือว่ายอมรับเงื่อนไขการใช้งานและนโยบายความเป็นส่วนตัว</small>
        </div>
      </div>
    </div>
  );
}
