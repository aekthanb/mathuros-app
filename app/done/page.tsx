import Link from "next/link";

export default function DonePage() {
  return (
    <main className="center-page section success-page">
      <div className="success-mark">✓</div>
      <p className="eyebrow">รับคำสั่งซื้อแล้ว</p>
      <h1>ได้รับการชำระเงินแล้ว</h1>
      <p>เรากำลังส่งรายการไปยังห้องคัด ผลไม้ของคุณจะออกจากสวนเช้าวันพรุ่งนี้</p>
      <div className="order-number"><span>หมายเลขคำสั่งซื้อ</span><strong>MTR-26080412</strong></div>
      <div className="button-row">
        <Link className="button button--dark" href="/track">ติดตามคำสั่งซื้อ</Link>
        <Link className="button button--outline" href="/">กลับหน้าแรก</Link>
      </div>
    </main>
  );
}
