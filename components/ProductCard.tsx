import Link from "next/link";
import type { Product } from "../lib/data";
import { baht } from "../lib/data";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link className="product-card" href={`/product/${product.sku}`}>
      <ProductImage product={product} />
      <span className="product-card__title"><strong>{product.name}</strong><b>{baht(product.price)}</b></span>
      <small>{product.unit}</small>
    </Link>
  );
}
