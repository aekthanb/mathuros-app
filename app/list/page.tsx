"use client";

import { useRouter } from "next/navigation";
import { PRODUCTS } from "../../lib/data";
import ProductCard from "../../components/ProductCard";
import { useAppDispatch } from "../../lib/store/hooks";
import { addToCart } from "../../lib/store/slices/cartSlice";

export default function ListPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

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
      <div className="special-box">
        <div>
          <h2>กล่องคัดพิเศษของสัปดาห์นี้</h2>
          <p>ทีมคัดเกรดจัดให้เองจากผลไม้ที่ดีที่สุดของสัปดาห์ ส่งฟรีทุกกล่อง</p>
        </div>
        <button className="button button--dark pill" onClick={() => { dispatch(addToCart(1)); router.push("/cart"); }}>สั่งกล่องนี้ ฿1,490</button>
      </div>
    </main>
  );
}
