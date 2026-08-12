import Image from "next/image";

export default function CartLine({
  label,
  image,
  name,
  detail,
  price,
  qty = 1,
  setQty,
  onRemove,
}: {
  label: string;
  image?: string;
  name: string;
  detail: string;
  price: string;
  qty?: number;
  setQty?: (qty: number) => void;
  onRemove?: () => void;
}) {
  return (
    <article className="cart-line">
      <div className="cart-thumb">
        {image ? (
          <Image src={image} alt={name} fill sizes="(max-width: 540px) 90px, 130px" />
        ) : (
          <span>{label}</span>
        )}
      </div>
      <div>
        <h3>{name}</h3>
        <p>{detail}</p>
        <button className="remove" onClick={onRemove}>นำออก</button>
      </div>
      <div className="cart-line__end">
        {setQty && (
          <div className="quantity quantity--small">
            <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
            <span>{qty}</span>
            <button onClick={() => setQty(qty + 1)}>＋</button>
          </div>
        )}
        <strong>{price}</strong>
      </div>
    </article>
  );
}
