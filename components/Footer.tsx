import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-brand">
          <strong>มธุรส</strong>
          <p>ผลไม้คัดเกรดพรีเมียม ส่งตรงจากสวนพันธมิตร ๑๘ แห่งทั่วประเทศไทย</p>
        </div>
        <div>
          <strong>สินค้า</strong>
          <Link href="/list">ผลไม้ตามฤดู</Link>
          <Link href="/list">กล่องของขวัญ</Link>
          <span>สมาชิกรายเดือน</span>
        </div>
        <div>
          <strong>ช่วยเหลือ</strong>
          <button>การจัดส่ง</button>
          <button>คืนสินค้า</button>
          <button>ติดต่อเรา</button>
        </div>
        <div>
          <strong>ติดตาม</strong>
          <span>LINE @mathuros</span>
          <span>Instagram</span>
          <span>Facebook</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© ๒๕๖๙ MATHUROS FRUIT CO., LTD.</span>
        <span>นโยบายความเป็นส่วนตัว · เงื่อนไขการใช้งาน</span>
      </div>
    </footer>
  );
}
