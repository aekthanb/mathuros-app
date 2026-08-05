"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "./StoreProvider";

export default function Header() {
  const router = useRouter();
  const {
    user,
    logout,
    menuOpen,
    setMenuOpen,
    cartCount,
    setAuthMode,
    setAuthOpen,
  } = useStore();

  return (
    <header className="header">
      <div className="header-inner">
        <nav className="nav nav--left" aria-label="เมนูหลัก">
          <Link href="/">หน้าแรก</Link>
          <Link href="/list">ผลไม้ตามฤดู</Link>
          <Link href="/story">เรื่องราวของสวน</Link>
        </nav>
        <Link className="brand" href="/" aria-label="มธุรส หน้าแรก">
          <strong>มธุรส</strong>
          <small>MATHUROS</small>
        </Link>
        <div className="header-actions">
          {user ? (
            <div className="account">
              <button
                className="account-button"
                onClick={() => setMenuOpen((open) => !open)}
              >
                <i /> {user}
                {/* <span>⌄</span> */}
              </button>
              {menuOpen && (
                <div className="account-menu">
                  <div>
                    <strong>{user}</strong>
                    <small>แต้มคงเหลือ ๗๓</small>
                  </div>
                  <Link href="/orders">ประวัติการสั่งซื้อ</Link>
                  <Link href="/track">ติดตามคำสั่งซื้อล่าสุด</Link>
                  <Link href="/addresses">ที่อยู่จัดส่งที่บันทึกไว้</Link>
                  <button
                    className="muted"
                    onClick={() => {
                      logout();
                      router.push("/");
                    }}
                  >
                    ออกจากระบบ
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="login-link"
              onClick={() => {
                setAuthMode("login");
                setAuthOpen(true);
              }}
            >
              เข้าสู่ระบบ
            </button>
          )}
          <Link className="cart-button" href="/cart">
            ตะกร้า <span>{cartCount}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
