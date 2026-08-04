import Link from "next/link";
import { ORDER_HISTORY } from "../../lib/data";

export default function OrdersPage() {
  return (
    <main className="account-page page-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">บัญชีของฉัน</p>
          <h1>ประวัติการสั่งซื้อ</h1>
          <div className="heading-meta">สั่งทั้งหมด ๖ ครั้ง · ยอดสะสม ฿7,340 · แต้มคงเหลือ ๗๓ แต้ม</div>
        </div>
        <div className="order-filters">
          <button className="active">ทั้งหมด</button>
          <button>กำลังจัดส่ง</button>
          <button>ส่งถึงแล้ว</button>
        </div>
      </div>
      <div className="orders">
        {ORDER_HISTORY.map(([id, date, status, items, total], index) => (
          <article className="order-card" key={id}>
            <div className="order-head">
              <span><strong>{id}</strong><small>{date}</small><b className={`status status--${index}`}>{status}</b></span>
              <b>{total}</b>
            </div>
            <div className="order-body">
              <div className="order-body__info">
                <div className="order-thumbs"><div className="order-thumb" /><div className="order-thumb" /></div>
                <span><strong>{items}</strong><small>{index === 0 ? "คาดว่าถึงบ้าน ๕ ส.ค. ก่อน ๑๘:๐๐" : "จัดส่งเรียบร้อย"}</small></span>
              </div>
              <div className="order-actions">
                {index === 0 ? (
                  <Link className="button button--dark" href="/track">ติดตามสถานะ</Link>
                ) : (
                  <button className="button button--outline">ดูใบเสร็จ</button>
                )}
                <Link className="button button--outline" href="/cart">สั่งซ้ำ</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="orders-more">
        <button className="button button--outline pill">ดูคำสั่งซื้อเก่ากว่านี้</button>
      </div>
    </main>
  );
}
