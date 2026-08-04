import Image from "next/image";
import type { Product } from "../lib/data";

export default function ProductImage({ product, large = false }: { product: Product; large?: boolean }) {
  return (
    <div className={`product-image ${large ? "product-image--large" : ""}`}>
      {product.badge && <span className={`badge ${product.badge === "ขายดี" ? "badge--orange" : ""}`}>{product.badge}</span>}
      {product.image ? (
        <Image src={product.image} alt={product.name} fill sizes={large ? "(max-width: 820px) 100vw, 600px" : "(max-width: 820px) 50vw, 33vw"} style={{ objectFit: "cover" }} />
      ) : (
        <span className="image-label">{product.label}</span>
      )}
    </div>
  );
}
