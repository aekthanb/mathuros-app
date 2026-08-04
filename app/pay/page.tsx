"use client";

import Link from "next/link";
import { baht, priceFor } from "../../lib/data";
import { useStore } from "../../components/StoreProvider";

export default function PayPage() {
  const { sku, size, qty } = useStore();
  const { unitPrice } = priceFor(sku, size);
  const subtotal = unitPrice * qty + 420;
  const grandTotal = subtotal + 120;

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
          <p>เปิดแอปธนาคารของคุณ เลือกสแกน QR แล้วตรวจสอบยอดให้ตรงกับ {baht(grandTotal)} ก่อนกดยืนยัน ระบบจะตัดผลไม้ให้หลังได้รับเงินทันที</p>

          <div className="pay-details">
            <div><span>ผู้รับเงิน</span><span>บจก. มธุรส ฟรุ๊ต</span></div>
            <div><span>เลขอ้างอิง</span><span>MTR-26080412</span></div>
            <div className="pay-details__total"><span>ยอดที่ต้องชำระ</span><span>{baht(grandTotal)}</span></div>
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
            <div className="qr-card__amount">{baht(grandTotal)}</div>
            <div className="qr-card__expiry">QR หมดอายุใน <b>14:52</b> นาที</div>
            <div className="qr-card__actions">
              <Link className="button button--dark" href="/done">ฉันชำระเงินแล้ว</Link>
              <button className="button button--outline">บันทึกภาพ QR</button>
            </div>
            <p className="qr-card__note">ชำระผ่านทุกธนาคารในไทย ไม่มีค่าธรรมเนียม · ใบเสร็จส่งเข้าอีเมลอัตโนมัติ</p>
          </div>
        </div>
      </div>
    </main>
  );
}
