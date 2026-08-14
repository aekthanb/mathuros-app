"use client";

import { useEffect } from "react";
import Link from "next/link";
import { bahtAmount } from "../../lib/data";
import { formatOrderDateTime, orderReference } from "../../lib/order";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import { fetchOrders } from "../../lib/store/slices/orderSlice";
import { clearCart } from "../../lib/store/slices/cartSlice";

export default function PayPage() {
  const dispatch = useAppDispatch();
  const { items, lastPlacedId, loaded, loading } = useAppSelector((state) => state.order);
  const user = useAppSelector((state) => state.auth.user);
  const authHydrated = useAppSelector((state) => state.auth.hydrated);

  // รีเฟรชหน้านี้แล้ว store จะว่าง — ดึงรายการมาใหม่เพื่อหาใบที่เพิ่งสั่ง
  useEffect(() => {
    if (authHydrated && user && !loaded) dispatch(fetchOrders());
  }, [authHydrated, dispatch, loaded, user]);

  const order = items.find((item) => item.id === lastPlacedId) ?? items.find((item) => item.status === "PENDING");

  if (!order) {
    return (
      <main className="account-page page-section">
        <div className="page-heading">
          <div>
            <p className="eyebrow">พร้อมเพย์ / THAI QR PAYMENT</p>
            <h1>ไม่พบคำสั่งซื้อที่รอชำระ</h1>
            <div className="heading-meta">
              {loading ? "กำลังตรวจสอบคำสั่งซื้อ…" : "คำสั่งซื้ออาจถูกยกเลิกหรือหมดเวลาชำระไปแล้ว"}
            </div>
          </div>
          <Link className="text-link" href="/cart">กลับไปที่ตะกร้า</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="account-page page-section">
      <div className="checkout-steps">
        <Link href="/cart">ตะกร้า</Link><span>—</span>
        <span className="current">ชำระเงิน</span><span>—</span>
        <span>ยืนยันคำสั่งซื้อ</span>
      </div>

      <div className="pay-grid">
        <div>
          <p className="eyebrow">พร้อมเพย์ / THAI QR PAYMENT</p>
          <h1>สแกนเพื่อชำระเงิน</h1>
          <p>เปิดแอปธนาคารของคุณ เลือกสแกน QR แล้วตรวจสอบยอดให้ตรงกับ {bahtAmount(order.total)} ก่อนกดยืนยัน ระบบจะตัดผลไม้ให้หลังได้รับเงินทันที</p>

          <div className="pay-details">
            <div><span>ผู้รับเงิน</span><span>บจก. มธุรส ฟรุ๊ต</span></div>
            <div><span>เลขอ้างอิง</span><span>{orderReference(order)}</span></div>
            <div><span>ค่าสินค้า</span><span>{bahtAmount(order.itemsTotal)}</span></div>
            <div><span>ค่าจัดส่งควบคุมอุณหภูมิ</span><span>{bahtAmount(order.shippingFee)}</span></div>
            <div className="pay-details__total"><span>ยอดที่ต้องชำระ</span><span>{bahtAmount(order.total)}</span></div>
          </div>

          <div className="pay-steps">
            <div>ขั้นตอนการชำระเงิน</div>
            <ol>
              <li><b>๐๑</b><span>บันทึกภาพ QR หรือเปิดค้างไว้บนหน้าจอ</span></li>
              <li><b>๐๒</b><span>เข้าแอปธนาคาร เลือกสแกน แล้วเลือกภาพหรือสแกนหน้าจอ</span></li>
              <li><b>๐๓</b><span>ตรวจยอดและชื่อผู้รับเงิน แล้วยืนยันการโอน</span></li>
              <li><b>๐๔</b><span>กลับมาหน้านี้แล้วกดปุ่มยืนยัน ระบบตรวจสอบให้ภายใน ๑ นาที</span></li>
            </ol>
          </div>
        </div>

        <div className="qr-card">
          <div className="qr-card__head"><span>THAI QR PAYMENT</span><span>พร้อมเพย์</span></div>
          <div className="qr-card__body">
            <div className="qr-frame">
              <div className="qr-frame__inner"><span>QR CODE<br />(สร้างจริงตอนต่อระบบชำระเงิน)</span></div>
            </div>
            <div className="qr-card__amount">{bahtAmount(order.total)}</div>
            <div className="qr-card__expiry">ชำระภายใน <b>{formatOrderDateTime(order.expiresAt)}</b> ไม่งั้นระบบจะคืนผลไม้เข้าสต็อก</div>
            <div className="qr-card__actions">
              {/* ของในตะกร้ากลายเป็นออเดอร์จริงไปแล้ว ปล่อยค้างไว้ลูกค้าจะเผลอสั่งซ้ำ */}
              <Link className="button button--dark" href="/done" onClick={() => dispatch(clearCart())}>
                ฉันชำระเงินแล้ว
              </Link>
              <button className="button button--outline">บันทึกภาพ QR</button>
            </div>
            <p className="qr-card__note">ชำระผ่านทุกธนาคารในไทย ไม่มีค่าธรรมเนียม · ใบเสร็จส่งเข้าอีเมลอัตโนมัติ</p>
          </div>
        </div>
      </div>
    </main>
  );
}
