import Link from "next/link";

export default function StoryPage() {
  return (
    <main>
      <section className="story-hero section">
        <p className="eyebrow">เรื่องราวของมธุรส</p>
        <h1>เราเริ่มจากรถกระบะคันเดียว<br />กับสวนส้มของลุงคำ</h1>
        <p>เพราะผลไม้ที่อร่อยที่สุด ไม่ได้อยู่บนชั้นวางนานพอให้คนส่วนใหญ่ได้รู้จัก เราจึงออกตามหามันถึงสวน</p>
      </section>
      <div className="story-photo placeholder"><span>ภาพทีมมธุรสกับเกษตรกร — เชียงใหม่ ๒๕๖๖</span></div>
      <section className="story-copy section">
        <div><p className="eyebrow">จุดเริ่มต้น / ๒๕๖๖</p><h2>รสชาติที่หายไประหว่างทาง</h2></div>
        <div>
          <p>ครั้งแรกที่เราได้ชิมส้มจากต้นในสวนลุงคำ เราเพิ่งเข้าใจว่ารสชาติของผลไม้สดจริง ๆ เป็นอย่างไร หวาน เปรี้ยว และมีกลิ่นที่ไม่เคยเจอในซูเปอร์มาร์เก็ต</p>
          <p>มธุรสจึงเกิดขึ้นเพื่อย่นระยะทางระหว่างคนปลูกกับคนกิน เรารับผลไม้ในราคาที่เป็นธรรม คัดด้วยมาตรฐานเดียวกันทุกล็อต และส่งออกในวันที่รสชาติดีที่สุด</p>
        </div>
      </section>
      <section className="values section">
        <article><span>๑๘</span><h3>สวนที่เราเดินเข้าไปหา</h3><p>ทุกแห่งรู้จักกันด้วยชื่อ ไม่ใช่เพียงรหัสซัพพลายเออร์</p></article>
        <article><span>ทุกล็อต</span><h3>ต้องวัดความหวาน</h3><p>ตัวเลขบนหน้าสินค้ามาจากผลไม้ที่คุณจะได้รับจริง</p></article>
        <article><span>๒๔ ชม.</span><h3>คือเวลาที่เราให้สัญญา</h3><p>จากห้องคัดถึงหน้าบ้าน เพื่อรักษารสชาติของวันเก็บเกี่ยว</p></article>
      </section>
      <section className="story-cta">
        <p className="eyebrow">ผลผลิตสัปดาห์นี้</p>
        <h2>ลองชิมสิ่งที่เราพยายามรักษาไว้</h2>
        <Link className="button button--light pill" href="/list">เลือกซื้อผลไม้ตามฤดู</Link>
      </section>
    </main>
  );
}
