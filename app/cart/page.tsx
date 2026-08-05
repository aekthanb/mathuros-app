"use client";

import { useRouter } from "next/navigation";
import { baht, priceFor } from "../../lib/data";
import CartLine from "../../components/CartLine";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import { setQty } from "../../lib/store/slices/productSlice";
import { setAuthMode, setAuthOpen } from "../../lib/store/slices/authModalSlice";

export default function CartPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sku, size, qty } = useAppSelector((state) => state.product);
  const cartCount = useAppSelector((state) => state.cart.count);
  const user = useAppSelector((state) => state.auth.user);
  const { product, sizes, unitPrice } = priceFor(sku, size);
  const subtotal = unitPrice * qty + 420;
  const grandTotal = subtotal + 120;

  function checkout() {
    if (!user) {
      dispatch(setAuthMode("register"));
      dispatch(setAuthOpen(true));
      return;
    }
    router.push("/pay");
  }

  return (
    <main className="section page-section cart-page">
      <div className="page-heading">
        <div><p className="eyebrow">ตรวจสอบรายการ</p><h1>ตะกร้าของคุณ</h1></div>
        <span>{cartCount} ชิ้น</span>
      </div>
      <div className="checkout-grid">
        <div className="cart-items">
          <CartLine label={product.label} name={product.name} detail={`${sizes[size][0]} · ส่งพรุ่งนี้`} price={baht(unitPrice * qty)} qty={qty} setQty={(value) => dispatch(setQty(value))} />
          <CartLine label="ส้มสายน้ำผึ้ง 800×1000" name="ส้มสายน้ำผึ้ง ฝาง" detail="ตะกร้า ๒ กก. · ส่งพรุ่งนี้" price="฿420" />
          <div className="gift-note"><span>ส่งเป็นของขวัญ</span><p>เพิ่มการ์ดเขียนมือและห่อริบบิ้นให้ฟรี</p><button>เพิ่มข้อความในการ์ด</button></div>
        </div>
        <aside className="summary">
          <h2>สรุปคำสั่งซื้อ</h2>
          <div><span>ยอดสินค้า</span><strong>{baht(subtotal)}</strong></div>
          <div><span>ค่าจัดส่งควบคุมอุณหภูมิ</span><strong>฿120</strong></div>
          <div className="discount"><span>ส่วนลดสมาชิก</span><strong>—</strong></div>
          <div className="summary-total"><span>ยอดรวม</span><strong>{baht(grandTotal)}</strong></div>
          <button className="button button--dark" onClick={checkout}>{user ? "ไปหน้าสแกน QR" : "สมัครสมาชิกเพื่อสั่งซื้อ"}</button>
          <small>ชำระผ่าน PromptPay · ข้อมูลถูกเข้ารหัสอย่างปลอดภัย</small>
        </aside>
      </div>
    </main>
  );
}
