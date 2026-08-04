import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-brand">
          <strong>มธุรส</strong>
          <small>MATHUROS</small>
          <p>ผลไม้คัดพิเศษ จากสวนที่เราไว้ใจ ส่งตรงถึงบ้านคุณ</p>
        </div>
        <div>
          <strong>เลือกซื้อ</strong>
          <Link href="/list">ผลไม้ตามฤดู</Link>
          <Link href="/list">กล่องของขวัญ</Link>
          <Link href="/track">ติดตามคำสั่งซื้อ</Link>
        </div>
        <div>
          <strong>รู้จักเรา</strong>
          <Link href="/story">เรื่องราวของสวน</Link>
          <button>มาตรฐานการคัด</button>
          <button>คำถามที่พบบ่อย</button>
        </div>
        <div>
          <strong>ติดต่อ</strong>
          <span>LINE @mathuros</span>
          <span>02-123-4567</span>
          <span>ทุกวัน 08:00–20:00</span>
        </div>
        <p className="copyright">© ๒๕๖๙ มธุรส ฟรุตส์ · กรุงเทพฯ ประเทศไทย</p>
      </div>
    </footer>
  );
}
