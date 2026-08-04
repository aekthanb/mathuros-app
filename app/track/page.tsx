const STEPS: [string, string][] = [
  ["รับคำสั่งซื้อแล้ว", "๔ ส.ค. · ๑๐:๔๒"],
  ["กำลังคัดเกรด", "ทีมคัดกำลังตรวจผิวและวัดความหวาน"],
  ["กำลังแพ็ก", "คาดว่า ๔ ส.ค. · ๑๖:๐๐"],
  ["ออกเดินทาง", "คาดว่า ๔ ส.ค. · ๑๘:๐๐"],
  ["ถึงบ้านคุณ", "๕ ส.ค. ก่อน ๑๘:๐๐"],
];

export default function TrackPage() {
  return (
    <main className="section page-section track-page">
      <p className="eyebrow">MTR-26080412</p>
      <h1>กำลังคัดผลไม้ให้คุณ</h1>
      <p className="lead">สวนส่งผลไม้ถึงห้องคัดแล้ว ทีมของเรากำลังตรวจทุกลูกก่อนแพ็ก</p>
      <div className="tracking-grid">
        <div className="timeline">
          {STEPS.map(([title, note], index) => (
            <div className={index < 2 ? "complete" : ""} key={title}>
              <i>{index === 0 ? "✓" : index + 1}</i>
              <span><strong>{title}</strong><small>{note}</small></span>
            </div>
          ))}
        </div>
        <aside className="delivery-card">
          <p className="eyebrow">กำหนดส่ง</p>
          <h2>พรุ่งนี้<br />ก่อน ๑๘:๐๐</h2>
          <p>128/45 ซ.สุขุมวิท 31<br />แขวงคลองตันเหนือ เขตวัฒนา<br />กรุงเทพฯ 10110</p>
          <hr />
          <span>สินค้า ๒ รายการ</span>
          <strong>ยอดชำระ ฿1,430</strong>
        </aside>
      </div>
    </main>
  );
}
