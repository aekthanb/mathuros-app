"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { baht, priceFor } from "../../../lib/data";
import ProductImage from "../../../components/ProductImage";
import { useStore } from "../../../components/StoreProvider";

export default function ProductPageClient({ sku }: { sku: string }) {
  const router = useRouter();
  const { setSku, size, setSize, qty, setQty, addToCart } = useStore();

  useEffect(() => {
    setSku(sku);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sku]);

  const { product, sizes, unitPrice } = priceFor(sku, size);

  return (
    <main className="section product-page">
      <div className="breadcrumbs">
        <Link href="/list">ผลไม้ตามฤดู</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>
      <div className="product-detail">
        <div className="product-gallery">
          <ProductImage product={product} large />
          <div className="thumbs"><div className="placeholder" /><div className="placeholder" /><div className="placeholder" /></div>
        </div>
        <div className="product-info">
          <p className="eyebrow">พร้อมส่งจากสวนพรุ่งนี้</p>
          <h1>{product.name}</h1>
          <p className="product-unit">{product.unit}</p>
          <div className="price"><strong>{baht(unitPrice)}</strong><del>{baht(product.oldPrice)}</del></div>
          <p className="description">{product.description}</p>
          <dl className="facts">
            <div><dt>แหล่งปลูก</dt><dd>{product.origin}</dd></div>
            <div><dt>ความหวาน</dt><dd>{product.brix}</dd></div>
            <div><dt>เก็บได้นาน</dt><dd>{product.keep}</dd></div>
            <div><dt>น้ำหนัก</dt><dd>{product.weight}</dd></div>
          </dl>
          <div className="option-title"><span>เลือกขนาด</span><small>ราคาต่อชุด</small></div>
          <div className="size-options">
            {sizes.map(([label, value], index) => (
              <button className={index === size ? "active" : ""} key={label} onClick={() => setSize(index)}>
                <span>{label}</span><strong>{baht(value)}</strong>
              </button>
            ))}
          </div>
          <div className="purchase-row">
            <div className="quantity">
              <button onClick={() => setQty((value) => Math.max(1, value - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((value) => value + 1)}>＋</button>
            </div>
            <button className="button button--dark" onClick={() => { addToCart(qty); router.push("/cart"); }}>ใส่ตะกร้า · {baht(unitPrice * qty)}</button>
          </div>
          <p className="shipping-note">จัดส่งแบบควบคุมอุณหภูมิ · ถึงมือภายใน ๒๔ ชั่วโมง</p>
        </div>
      </div>
    </main>
  );
}
