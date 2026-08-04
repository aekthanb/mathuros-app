import type { Product } from "../lib/data";

export default function ProductImage({ product, large = false }: { product: Product; large?: boolean }) {
  return (
    <div className={`product-image ${large ? "product-image--large" : ""}`}>
      {product.badge && <span className={`badge ${product.badge === "ขายดี" ? "badge--orange" : ""}`}>{product.badge}</span>}
      <span className="image-label">{product.label}</span>
    </div>
  );
}
