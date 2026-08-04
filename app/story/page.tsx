import Image from "next/image";
import Link from "next/link";

const TIMELINE: [string, string, string][] = [
  [
    "๒๕๖๐",
    "สวนแรก อ.ฝาง",
    "ขับรถขึ้นเชียงใหม่เพื่อขอซื้อส้มโดยตรง เริ่มส่ง ๒๐ ตะกร้าแรกให้เพื่อนและเพื่อนของเพื่อน",
  ],
  [
    "๒๕๖๓",
    "ห้องคัดเกรดของเราเอง",
    "เปิดห้องคัดควบคุมอุณหภูมิที่กรุงเทพฯ เริ่มวัดค่าความหวานทุกล็อตก่อนแพ็ก",
  ],
  [
    "๒๕๖๖",
    "ส่งทั่วประเทศใน ๒๔ ชม.",
    "ร่วมกับขนส่งควบคุมอุณหภูมิ ทำให้ผลไม้ถึงบ้านลูกค้าในสภาพเดียวกับตอนออกจากสวน",
  ],
  [
    "๒๕๖๙",
    "๑๘ สวน ๙ จังหวัด",
    "ทุกสวนได้รับเงินล่วงหน้าก่อนฤดูเก็บเกี่ยว เพื่อให้ลงทุนดูแลต้นได้เต็มที่",
  ],
];

export default function StoryPage() {
  return (
    <main>
      <section className="story-hero section">
        <p className="eyebrow">ตั้งแต่ ๒๕๖๐</p>
        <h1>เราเริ่มจากรถกระบะคันเดียว กับสวนส้มของลุงคำ</h1>
        <p>
          วันนี้เรามีสวนพันธมิตร ๑๘ แห่งทั่วประเทศ แต่กติกาเดิมยังไม่เปลี่ยน —
          เราไปเห็นสวนด้วยตาตัวเองก่อนเสมอ และจ่ายให้ชาวสวนก่อนที่ผลไม้จะขายออก
        </p>
        {/* <div className="placeholder story-hero-image"><span>ภาพกว้างสวนตอนเช้า ๒๑๐๐×๙๐๐</span></div> */}
        <div className="story-hero-photo">
          <Image
            src="/img/story/story-hero.png"
            alt="ภาพกว้างสวนตอนเช้า"
            fill
            sizes="(max-width: 820px) 100vw, 1440px"
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      </section>

      <section className="story-timeline">
        <div className="timeline-list">
          {TIMELINE.map(([year, title, text]) => (
            <div className="timeline-row" key={year}>
              <time>{year}</time>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="story-gallery section">
        <div className="story-gallery-grid">
          {/* <div className="placeholder"><span>ชาวสวนกับตะกร้า</span></div> */}
          <div className="story-gallery-photo">
            <Image
              src="/img/story/framer.png"
              alt="ทีมงานยิ้มกับกล่อง"
              fill
              sizes="(max-width: 820px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
            />
          </div>
          {/* <div className="placeholder"><span>ห้องคัดเกรด</span></div> */}
          <div className="story-gallery-photo">
            <Image
              src="/img/story/room.png"
              alt="ห้องคัดเกรด"
              fill
              sizes="(max-width: 820px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
            />
          </div>
          {/* <div className="placeholder"><span>ทีมงานยิ้มกับกล่อง</span></div> */}
          <div className="story-gallery-photo">
            <Image
              src="/img/story/team.png"
              alt="ทีมงานยิ้มกับกล่อง"
              fill
              sizes="(max-width: 820px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
        <div className="story-cta">
          <Link className="button button--dark pill" href="/list">
            เลือกซื้อผลไม้จากสวนเหล่านี้
          </Link>
        </div>
      </section>
    </main>
  );
}
