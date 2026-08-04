import Link from "next/link";
import { ORDER_HISTORY } from "../../lib/data";

export default function OrdersPage() {
  return (
    <main className="section page-section">
      <p className="eyebrow">บัญชีของฉัน</p>
      <div className="page-heading">
        <div><h1>ประวัติการสั่งซื้อ</h1><p>รายการทั้งหมดที่สั่งผ่านมธุรส</p></div>
        <span>๔ คำสั่งซื้อ</span>
      </div>
      <div className="orders">
        {ORDER_HISTORY.map(([id, date, status, items, total], index) => (
          <article key={id}>
            <div className="order-head">
              <span><small>{date}</small><strong>{id}</strong></span>
              <b className={`status status--${index}`}>{status}</b>
            </div>
            <div className="order-body">
              <div className="cart-thumb"><span>ผลไม้คัดพิเศษ</span></div>
              <span><strong>{items}</strong><small>{index === 0 ? "คาดว่าถึงบ้าน ๕ ส.ค. ก่อน ๑๘:๐๐" : "จัดส่งเรียบร้อย"}</small></span>
              <b>{total}</b>
              {index === 0 ? (
                <Link className="button button--dark" href="/track">ติดตามสถานะ</Link>
              ) : (
                <button className="button button--outline">ดูใบเสร็จ</button>
              )}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
