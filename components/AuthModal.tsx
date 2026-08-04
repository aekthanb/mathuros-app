"use client";

import { useRouter } from "next/navigation";
import { useStore } from "./StoreProvider";

export default function AuthModal() {
  const router = useRouter();
  const { authOpen, setAuthOpen, authMode, setAuthMode, authName, setAuthName, login } = useStore();

  if (!authOpen) return null;

  function submit() {
    login(authName.trim() || "คุณลูกค้า");
    setAuthOpen(false);
    router.push("/cart");
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setAuthOpen(false); }}>
      <div className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button className="modal-close" onClick={() => setAuthOpen(false)}>×</button>
        <p className="eyebrow">สมาชิกมธุรส</p>
        <h2 id="auth-title">{authMode === "register" ? "สมัครสมาชิกก่อนสั่งซื้อ" : "ยินดีต้อนรับกลับมา"}</h2>
        <p>รับแต้มทุกการสั่งซื้อ บันทึกที่อยู่ และติดตามสถานะได้ง่ายขึ้น</p>
        <div className="auth-tabs">
          <button className={authMode === "register" ? "active" : ""} onClick={() => setAuthMode("register")}>สมัครสมาชิก</button>
          <button className={authMode === "login" ? "active" : ""} onClick={() => setAuthMode("login")}>เข้าสู่ระบบ</button>
        </div>
        {authMode === "register" && (
          <label>
            ชื่อที่ใช้เรียก
            <input value={authName} onChange={(event) => setAuthName(event.target.value)} placeholder="เช่น ปิยะดา" />
          </label>
        )}
        <label>เบอร์โทรศัพท์<input inputMode="tel" placeholder="08X-XXX-XXXX" /></label>
        <label>รหัสผ่าน<input type="password" placeholder="อย่างน้อย 8 ตัวอักษร" /></label>
        <button className="button button--dark" onClick={submit}>{authMode === "register" ? "สมัครสมาชิกและสั่งซื้อต่อ" : "เข้าสู่ระบบ"}</button>
        <small>การดำเนินการต่อถือว่าคุณยอมรับเงื่อนไขการใช้งานและนโยบายความเป็นส่วนตัว</small>
      </div>
    </div>
  );
}
