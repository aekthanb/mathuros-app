import { PRODUCTS } from "../../lib/data";
import ProductCard from "../../components/ProductCard";

export default function ListPage() {
  return (
    <main className="section page-section">
      <p className="eyebrow">เก็บเกี่ยวประจำสัปดาห์</p>
      <div className="page-heading">
        <div><h1>ผลไม้ตามฤดู</h1><p>ล็อตที่ผ่านการคัดเกรดและพร้อมออกจากสวนในสัปดาห์นี้</p></div>
        <span>๙ รายการ</span>
      </div>
      <div className="filters">
        <button className="active">ทั้งหมด</button>
        <button>ผลไม้ไทย</button>
        <button>ผลไม้นำเข้า</button>
        <button>กล่องของขวัญ</button>
        <button>ไม่เกิน ฿1,000</button>
      </div>
      <div className="product-grid product-grid--all">
        {PRODUCTS.map((item) => <ProductCard key={item.sku} product={item} />)}
      </div>
    </main>
  );
}
