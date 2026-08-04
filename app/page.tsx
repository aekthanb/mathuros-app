import Image from "next/image";
import Link from "next/link";
import { PRODUCTS } from "../lib/data";
import ProductSection from "../components/ProductSection";
import VideoPromo from "../components/VideoPromo";

const BENEFITS: [string, string, string][] = [
  ["๐๑", "ตัดเช้า ส่งเย็น", "ผลไม้ออกจากสวนในวันเดียวกับที่คุณสั่ง ไม่ผ่านห้องเย็นค้างคืน"],
  ["๐๒", "คัดเกรดพรีเมียม", "วัดค่าความหวานทุกล็อต คัดผิว คัดขนาด ทีละลูกด้วยมือคน"],
  ["๐๓", "ห่อเป็นของขวัญ", "กล่องกระดาษรีไซเคิล ซับกันกระแทก พร้อมการ์ดเขียนมือ"],
];

const FARMERS: { label: string; name: string; role: string; quote: string; img: string }[] = [
  { label: "พอร์ตเทรตชาวสวน ๙๐๐×๑๒๐๐", name: "ลุงคำ อินต๊ะ", role: "สวนส้ม อ.ฝาง เชียงใหม่ · ปลูกมา ๓๒ ปี", quote: "“ส้มที่หวานจริงต้องรอให้มันสุกบนต้น ไม่ใช่สุกบนรถ”", img: "/img/index/uncle-presenter.png" },
  { label: "พอร์ตเทรตพรีเซนเตอร์ ๙๐๐×๑๒๐๐", name: "ป้าสมทรง วงศ์แก้ว", role: "หัวหน้าฝ่ายคัดเกรด · ๑๒ ปีกับเรา", quote: "“ลูกไหนที่ฉันไม่ให้ลูกตัวเองกิน ฉันก็ไม่ส่งให้ลูกค้า”", img: "/img/index/aun-presenter.png" },
  { label: "พอร์ตเทรตทีมแพ็ก ๙๐๐×๑๒๐๐", name: "พี่นัท ธนวัฒน์", role: "ห้องแพ็กกรุงเทพฯ · ดูแลทุกกล่องก่อนออก", quote: "“ผมนับลูกซ้ำสองรอบเสมอ กล่องหนึ่งคือความตั้งใจของคนสิบคน”", img: "/img/index/girl-presenter.png" },
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
          {/* <div className="placeholder placeholder--wide"><span>hero — ตะกร้าผลไม้จัดพรีเมียม 1200×600</span></div> */}
          <div className="hero-image">
            <Image src="/img/index/hero_img.png" alt="ตะกร้าผลไม้จัดพรีเมียม" fill sizes="(max-width: 820px) 100vw, 720px" style={{ objectFit: "cover" }} priority />
          </div>
          {/* <div className="placeholder"><span>พรีเซนเตอร์ — ครึ่งตัว</span></div> */}
          <div className="hero-collage-photo">
            <Image src="/img/index/half-presenter.png" alt="พรีเซนเตอร์ — ครึ่งตัว" fill sizes="(max-width: 820px) 50vw, 353px" style={{ objectFit: "cover" }} />
          </div>
          {/* <div className="placeholder"><span>มือคัดผลไม้ close-up</span></div> */}
          <div className="hero-collage-photo">
            <Image src="/img/index/close-up.png" alt="มือคัดผลไม้ close-up" fill sizes="(max-width: 820px) 50vw, 353px" style={{ objectFit: "cover" }} />
          </div>
        </div>
      </section>
      <section className="benefits section">
        {BENEFITS.map(([number, title, text]) => (
          <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>
        ))}
      </section>
      <ProductSection products={PRODUCTS.slice(0, 6)} />
      <VideoPromo />
      <section className="farmers section">
        <div className="farmers-heading">
          <p className="eyebrow">คนที่อยู่เบื้องหลัง</p>
          <h2>เราซื้อจากคนที่เรารู้จักชื่อ</h2>
        </div>
        <div className="farmer-grid">
          {FARMERS.map((farmer) => (
            <div className="farmer" key={farmer.name}>
              {/* <div className="placeholder"><span>{farmer.label}</span></div> */}
              <div className="farmer-photo">
                <Image src={farmer.img} alt={farmer.name} fill sizes="(max-width: 820px) 100vw, 33vw" style={{ objectFit: "cover" }} />
              </div>
              <h3>{farmer.name}</h3>
              <small>{farmer.role}</small>
              <p>{farmer.quote}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="testimonial">
        <div className="testimonial-inner">
          <p>“สั่งให้แม่ที่ต่างจังหวัดครั้งแรกเพราะไปหาไม่ได้ ตอนนี้กลายเป็นของประจำเดือน แม่บอกว่าส้มกล่องนี้หวานเหมือนสมัยยังเด็ก”</p>
          <span>ปิยะดา ส. — ลูกค้าตั้งแต่ปี ๒๕๖๖</span>
        </div>
      </section>
      <section className="membership section">
        <div className="membership-inner">
          {/* <div className="placeholder"><span>กล่องของขวัญเปิดฝา ๑๒๐๐×๙๖๐</span></div> */}
          <div className="membership-photo">
            <Image src="/img/index/fruit-premium-1.png" alt="กล่องของขวัญเปิดฝา" fill sizes="(max-width: 820px) 100vw, 50vw" style={{ objectFit: "cover" }} />
          </div>
          <div>
            <p className="eyebrow">สมาชิกรายเดือน</p>
            <h2>ให้เราเลือกของดีที่สุดของเดือนให้คุณ</h2>
            <p>ทุกต้นเดือนเราจะจัดกล่องจากผลไม้ที่ดีที่สุดในฤดูนั้น พร้อมจดหมายเล่าว่ามาจากสวนไหน ใครเป็นคนปลูก ยกเลิกได้ทุกเมื่อ</p>
            <div className="membership-price"><strong>฿1,490</strong><span>/ เดือน · ส่งฟรี</span></div>
            <button className="button button--green pill">สมัครสมาชิก</button>
          </div>
        </div>
      </section>
    </main>
  );
}
