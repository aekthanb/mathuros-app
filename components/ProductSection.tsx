import Link from "next/link";
import type { Product } from "../lib/data";
import ProductCard from "./ProductCard";

export default function ProductSection({ products }: { products: Product[] }) {
  return (
    <section className="section product-section">
      <div className="section-heading">
        <div><p className="eyebrow">สินค้าฤดูกาล</p><h2>ที่สวนกำลังให้ผลตอนนี้</h2></div>
        <Link href="/list">ดูทั้งหมด ๙ รายการ →</Link>
      </div>
      <div className="product-grid">{products.map((product) => <ProductCard key={product.sku} product={product} />)}</div>
    </section>
  );
}
