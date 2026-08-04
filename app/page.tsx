import Link from "next/link";
import { PRODUCTS } from "../lib/data";
import ProductSection from "../components/ProductSection";

const BENEFITS: [string, string, string][] = [
  ["๐๑", "ตัดเช้า ส่งเย็น", "ผลไม้ออกจากสวนในวันเดียวกับที่คุณสั่ง ไม่ผ่านห้องเย็นค้างคืน"],
  ["๐๒", "คัดเกรดพรีเมียม", "วัดค่าความหวานทุกล็อต คัดผิว คัดขนาด ทีละลูกด้วยมือคน"],
  ["๐๓", "ห่อเป็นของขวัญ", "กล่องกระดาษรีไซเคิล ซับกันกระแทก พร้อมการ์ดเขียนมือ"],
];

export default function HomePage() {
  return (
    <main>
      <section className="hero section">
        <div className="hero-copy">
          <p className="eyebrow">ฤดูกาล ๒๕๖๙ / คัดด้วยมือ</p>
          <h1>ผลไม้ที่ดีที่สุด<br />ของสวน ส่งตรงถึงบ้านคุณ</h1>
          <p className="lead">เราคัดผลไม้ทีละลูกจากสวนที่เราไปเยือนด้วยตัวเอง วัดความหวานทุกล็อต และห่อด้วยมือก่อนออกเดินทาง คุณจึงได้รสชาติของวันที่เก็บเกี่ยว ไม่ใช่ของวันที่วางขาย</p>
          <div className="button-row">
            <Link className="button button--dark pill" href="/list">เลือกซื้อผลไม้ฤดูนี้</Link>
            <Link className="text-link" href="/story">ชมเรื่องราวของสวน</Link>
          </div>
          <div className="stats">
            <div><strong>๑๘</strong><span>สวนพันธมิตร</span></div>
            <div><strong>๒๔ ชม.</strong><span>จากต้นถึงหน้าบ้าน</span></div>
            <div><strong>๙๘%</strong><span>ลูกค้าสั่งซ้ำ</span></div>
          </div>
        </div>
        <div className="hero-collage">
          <div className="placeholder placeholder--wide"><span>hero — ตะกร้าผลไม้จัดพรีเมียม 1200×600</span></div>
          <div className="placeholder"><span>พรีเซนเตอร์ — ครึ่งตัว</span></div>
          <div className="placeholder"><span>มือคัดผลไม้ close-up</span></div>
        </div>
      </section>
      <section className="benefits section">
        {BENEFITS.map(([number, title, text]) => (
          <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>
        ))}
      </section>
      <ProductSection products={PRODUCTS.slice(0, 6)} />
      <section className="editorial section">
        <div className="placeholder"><span>สวนส้มฝาง — เช้าก่อนเก็บเกี่ยว</span></div>
        <div>
          <p className="eyebrow">จากสวนถึงมือคุณ</p>
          <h2>เราไม่ได้เลือกแค่ผลไม้<br />เราเลือกคนที่ปลูกมันด้วย</h2>
          <p>ทุกสวนที่ร่วมงานกับมธุรส เราเข้าไปดูด้วยตัวเอง ตั้งแต่วิธีดูแลดิน วันที่เก็บ ไปจนถึงเวลาที่รถออกจากสวน</p>
          <Link className="text-link" href="/story">อ่านเรื่องราวของเรา →</Link>
        </div>
      </section>
    </main>
  );
}
