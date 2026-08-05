"use client";

import { useEffect } from "react";
import Link from "next/link";
import { PRODUCTS, baht, priceFor } from "../../../lib/data";
import ProductImage from "../../../components/ProductImage";
import { useAppDispatch, useAppSelector } from "../../../lib/store/hooks";
import { setQty, setSize, setSku } from "../../../lib/store/slices/productSlice";
import { addToCart } from "../../../lib/store/slices/cartSlice";

export default function ProductPageClient({ sku }: { sku: string }) {
  const dispatch = useAppDispatch();
  const size = useAppSelector((state) => state.product.size);
  const qty = useAppSelector((state) => state.product.qty);

  useEffect(() => {
    dispatch(setSku(sku));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sku]);

  const { product, sizes, unitPrice } = priceFor(sku, size);

  const currentIndex = PRODUCTS.findIndex((item) => item.sku === product.sku);
  const relatedProducts = Array.from({ length: 4 }, (_, offset) => PRODUCTS[(currentIndex + offset + 1) % PRODUCTS.length]);

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
              <button className={index === size ? "active" : ""} key={label} onClick={() => dispatch(setSize(index))}>
                <span>{label}</span><strong>{baht(value)}</strong>
              </button>
            ))}
          </div>
          <div className="purchase-row">
            <div className="quantity">
              <button onClick={() => dispatch(setQty(Math.max(1, qty - 1)))}>−</button>
              <span>{qty}</span>
              <button onClick={() => dispatch(setQty(qty + 1))}>＋</button>
            </div>
            <button
              className="button button--dark"
              onClick={() =>
                dispatch(
                  addToCart({
                    sku: product.sku,
                    name: product.name,
                    label: product.label,
                    sizeLabel: sizes[size][0],
                    unitPrice,
                    qty,
                  })
                )
              }
            >
              ใส่ตะกร้า · {baht(unitPrice * qty)}
            </button>
          </div>
          <p className="shipping-note">จัดส่งแบบควบคุมอุณหภูมิ · ถึงมือภายใน ๒๔ ชั่วโมง</p>
        </div>
      </div>

      <section className="related-products">
        <h2>ลูกค้ามักซื้อคู่กับ</h2>
        <div className="related-products__grid">
          {relatedProducts.map((item) => (
            <Link key={item.sku} href={`/product/${item.sku}`} className="related-product">
              <ProductImage product={item} />
              <div className="related-product__name">{item.name}</div>
              <div className="related-product__price">{baht(item.price)}</div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
