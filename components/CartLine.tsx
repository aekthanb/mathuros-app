export default function CartLine({
  label,
  name,
  detail,
  price,
  qty = 1,
  setQty,
}: {
  label: string;
  name: string;
  detail: string;
  price: string;
  qty?: number;
  setQty?: (qty: number) => void;
}) {
  return (
    <article className="cart-line">
      <div className="cart-thumb"><span>{label}</span></div>
      <div>
        <h3>{name}</h3>
        <p>{detail}</p>
        <button className="remove">นำออก</button>
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
