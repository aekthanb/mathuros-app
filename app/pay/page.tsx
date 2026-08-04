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
    <main className="center-page section">
      <p className="eyebrow">ขั้นตอนสุดท้าย</p>
      <h1>สแกนเพื่อชำระเงิน</h1>
      <p>เปิดแอปธนาคาร แล้วสแกน QR PromptPay ด้านล่าง</p>
      <div className="payment-card">
        <div className="promptpay">PROMPT<span>PAY</span></div>
        <div className="qr" aria-label="ตัวอย่าง QR code"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
        <strong>{baht(grandTotal)}</strong>
        <span>มธุรส ฟรุตส์ · MTR-26080412</span>
      </div>
      <Link className="button button--dark" href="/done">ฉันชำระเงินแล้ว</Link>
      <Link className="text-link" href="/cart">กลับไปแก้ไขตะกร้า</Link>
    </main>
  );
}
