"use client";

import Link from "next/link";
import { baht, priceFor } from "../../lib/data";
import { useAppSelector } from "../../lib/store/hooks";

const PROGRESS: [string, string, boolean, boolean][] = [
  ["รับคำสั่งซื้อ", "๑๐:๑๒", true, false],
  ["ตัดจากสวน", "๐๖:๐๐", true, false],
  ["คัดเกรดและแพ็ก", "กำลังดำเนินการ", true, true],
  ["จัดส่งถึงบ้าน", "รอดำเนินการ", false, false],
];

export default function TrackPage() {
  const { sku, size, qty } = useAppSelector((state) => state.product);
  const { product, sizes, unitPrice } = priceFor(sku, size);
  const subtotal = unitPrice * qty + 420;
  const grandTotal = subtotal + 120;

  return (
    <main className="account-page page-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">MTR-26080412</p>
          <h1>กำลังคัดผลไม้ให้คุณ</h1>
          <div className="heading-meta">สั่งเมื่อ ๔ ส.ค. ๒๕๖๙ ๑๐:๑๒ · คาดว่าถึงบ้าน ๕ ส.ค. ก่อน ๑๘:๐๐</div>
        </div>
        <div className="tracking-number">
          <div>เลขติดตามพัสดุ</div>
          <div>TH-COLD-4471902</div>
        </div>
      </div>

      <div className="tracking-grid">
        <div>
          <div className="progress-steps">
            {PROGRESS.map(([label, note, complete, current]) => (
              <div className={`progress-step ${complete ? "complete" : ""} ${current ? "current" : ""}`} key={label}>
                <i />
                <strong>{label}</strong>
                <small>{note}</small>
              </div>
            ))}
          </div>

          <div className="activity-log timeline-list">
            <div className="timeline-row">
              <time>วันนี้ ๐๙:๔๐</time>
              <div><h3>กำลังคัดเกรดในห้องควบคุมอุณหภูมิ</h3><p>ป้าสมทรงกำลังคัดผลและวัดค่าความหวานทีละลูก ก่อนห่อกระดาษและลงกล่อง</p></div>
            </div>
            <div className="timeline-row">
              <time>วันนี้ ๐๖:๐๐</time>
              <div><h3>ตัดจากสวน อ.ฝาง เชียงใหม่</h3><p>ลุงคำเก็บให้ในรอบเช้าตรู่ อุณหภูมิสวน ๑๙°C</p></div>
            </div>
            <div className="timeline-row">
              <time>๔ ส.ค. ๑๐:๑๔</time>
              <div><h3>ได้รับการชำระเงินแล้ว</h3><p>พร้อมเพย์ · {baht(grandTotal)} · ใบเสร็จส่งเข้าอีเมลเรียบร้อย</p></div>
            </div>
            <div className="timeline-row">
              <time>๔ ส.ค. ๑๐:๑๒</time>
              <div><h3>รับคำสั่งซื้อเข้าระบบ</h3><p>จัดคิวเข้ารอบตัดผลไม้เช้าถัดไปให้อัตโนมัติ</p></div>
            </div>
          </div>
        </div>

        <aside className="tracking-aside">
          <div className="order-summary-card">
            <h2>รายการในกล่อง</h2>
            <div className="summary-lines">
              <div className="summary-line">
                <div className="summary-thumb" />
                <div><strong>{product.name}</strong><small>{sizes[size].label} × {qty}</small></div>
                <b>{baht(unitPrice * qty)}</b>
              </div>
              <div className="summary-line">
                <div className="summary-thumb" />
                <div><strong>ส้มสายน้ำผึ้ง ฝาง</strong><small>ตะกร้า ๒ กก. × 1</small></div>
                <b>฿420</b>
              </div>
            </div>
            <div className="summary-total"><span>ยอดชำระ</span><b>{baht(grandTotal)}</b></div>
          </div>

          <div className="delivery-info-card">
            <p>จัดส่งถึง</p>
            <p>บ้าน</p>
            <address>ปิยะดา ส. · 081-234-5678<br />128/45 ซ.สุขุมวิท 31 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ 10110</address>
            <div className="button-row">
              <button className="button button--outline">แจ้งปัญหาการจัดส่ง</button>
              <Link className="button button--outline" href="/cart">สั่งซ้ำรายการนี้</Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
