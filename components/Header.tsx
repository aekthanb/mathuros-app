"use client";

import { useEffect, useState } from "react";
import { googleLogout } from "@react-oauth/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutRequest } from "../api/auth";
import {
  clearAuthSession,
  getRefreshToken,
} from "../lib/auth/session";
import { useAppDispatch, useAppSelector } from "../lib/store/hooks";
import { logout } from "../lib/store/slices/authSlice";
import { setMenuOpen, toggleMenu } from "../lib/store/slices/uiSlice";
import { setAuthMode, setAuthOpen } from "../lib/store/slices/authModalSlice";

export default function Header() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [loggingOut, setLoggingOut] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const authHydrated = useAppSelector((state) => state.auth.hydrated);
  const menuOpen = useAppSelector((state) => state.ui.menuOpen);
  const cartCount = useAppSelector((state) => state.cart.items.reduce((sum, item) => sum + item.qty, 0));

  useEffect(() => {
    dispatch(setMenuOpen(false));
  }, [pathname, dispatch]);

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);
    const refreshToken = getRefreshToken();

    try {
      if (refreshToken) {
        await logoutRequest({ refreshToken });
      }
    } catch {
      // The server session may already be expired; local logout must still finish.
    } finally {
      clearAuthSession();
      if (user?.provider === "google") googleLogout();
      dispatch(logout());
      dispatch(setMenuOpen(false));
      setLoggingOut(false);
    }
  };

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
          {!authHydrated ? (
            <span className="login-status" role="status" aria-label="กำลังโหลดข้อมูลผู้ใช้" />
          ) : user ? (
            <div className="account">
              <button
                className="account-button"
                onClick={() => dispatch(toggleMenu())}
              >
                <span className="account-avatar" aria-hidden="true">
                  {user.picture && (
                    // Google profile images are tiny, external, and already optimized.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.picture} alt="" referrerPolicy="no-referrer" />
                  )}
                </span>
                {user.name}
                {/* <span>⌄</span> */}
              </button>
              {menuOpen && (
                <div className="account-menu">
                  <div>
                    <strong>{user.name}</strong>
                    <small>{user.email ?? "แต้มคงเหลือ ๗๓"}</small>
                  </div>
                  <Link href="/orders">ประวัติการสั่งซื้อ</Link>
                  <Link href="/track">ติดตามคำสั่งซื้อล่าสุด</Link>
                  <Link href="/addresses">ที่อยู่จัดส่งที่บันทึกไว้</Link>
                  <button
                    className="muted"
                    onClick={handleLogout}
                    disabled={loggingOut}
                  >
                    {loggingOut ? "กำลังออกจากระบบ..." : "ออกจากระบบ"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="login-link"
              onClick={() => {
                dispatch(setAuthMode("login"));
                dispatch(setAuthOpen(true));
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
