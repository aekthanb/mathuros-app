"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ADDRESSES, baht } from "../../lib/data";
import CartLine from "../../components/CartLine";
import AddressSearch, { type AddressSearchResult } from "../../components/AddressSearch";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import { removeFromCart, updateCartQty } from "../../lib/store/slices/cartSlice";
import { setAuthMode, setAuthOpen } from "../../lib/store/slices/authModalSlice";

const AddressMap = dynamic(() => import("../../components/AddressMap"), {
  ssr: false,
  loading: () => <div className="address-map__loading">กำลังโหลดแผนที่…</div>,
});

const SHIPPING = 120;
const DEFAULT_COORDS = { lat: 13.7563, lng: 100.5018 };

function formatCoords(lat: number, lng: number) {
  return `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`;
}

export default function CartPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const user = useAppSelector((state) => state.auth.user);
  const cartCount = items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
  const shipping = items.length ? SHIPPING : 0;
  const grandTotal = subtotal + shipping;

  const [selectedAddress, setSelectedAddress] = useState(() => ADDRESSES.find((addr) => addr.primary)?.name ?? ADDRESSES[0]?.name ?? "");
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [saveNewAddress, setSaveNewAddress] = useState(false);
  const showAddressForm = !user || useNewAddress;

  const [coords, setCoords] = useState(DEFAULT_COORDS);
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState<string | null>(null);

  const [addressText, setAddressText] = useState("");
  const [province, setProvince] = useState("");
  const [postcode, setPostcode] = useState("");

  function handleAddressSearchSelect(result: AddressSearchResult) {
    setCoords({ lat: result.lat, lng: result.lng });
    if (result.addressLine) setAddressText(result.addressLine);
    if (result.province) setProvince(result.province);
    if (result.postcode) setPostcode(result.postcode);
  }

  function locateMe() {
    if (!navigator.geolocation) {
      setLocateError("เบราว์เซอร์นี้ไม่รองรับการระบุตำแหน่ง");
      return;
    }
    setLocating(true);
    setLocateError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocating(false);
      },
      () => {
        setLocateError("ไม่สามารถเข้าถึงตำแหน่งได้ กรุณาอนุญาตการเข้าถึงตำแหน่ง");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

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
          {items.length === 0 ? (
            <p className="cart-empty">ยังไม่มีสินค้าในตะกร้า</p>
          ) : (
            items.map((item) => (
              <CartLine
                key={item.id}
                label={item.label}
                name={item.name}
                detail={`${item.sizeLabel} · ส่งพรุ่งนี้`}
                price={baht(item.unitPrice * item.qty)}
                qty={item.qty}
                setQty={(value) => dispatch(updateCartQty({ id: item.id, qty: value }))}
                onRemove={() => dispatch(removeFromCart(item.id))}
              />
            ))
          )}
          <div className="gift-note"><span>ส่งเป็นของขวัญ</span><p>เพิ่มการ์ดเขียนมือและห่อริบบิ้นให้ฟรี</p><button>เพิ่มข้อความในการ์ด</button></div>

          {items.length > 0 && (
            <div className="address-section">
              <div className="address-section__head">
                <h2>ที่อยู่จัดส่ง</h2>
                {user && <span>ที่อยู่ที่บันทึกไว้ {ADDRESSES.length} รายการ</span>}
              </div>

              {user && (
                <div className="address-picker">
                  {ADDRESSES.map((addr) => (
                    <button
                      key={addr.name}
                      type="button"
                      className={`address-option ${!useNewAddress && selectedAddress === addr.name ? "address-option--active" : ""}`}
                      onClick={() => { setSelectedAddress(addr.name); setUseNewAddress(false); }}
                    >
                      <span className="address-option__dot" />
                      <span className="address-option__body">
                        <span className="address-option__name">
                          <span>{addr.name}</span>
                          {addr.tag && <span className={`address-tag ${addr.tagVariant === "muted" ? "address-tag--muted" : ""}`}>{addr.tag}</span>}
                        </span>
                        <span className="address-option__line">{addr.lines.join(" ")}</span>
                      </span>
                      <span className="address-option__edit">แก้ไข</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    className={`address-option address-option--new ${useNewAddress ? "address-option--active" : ""}`}
                    onClick={() => setUseNewAddress(true)}
                  >
                    <span className="address-option__dot" />
                    <span className="address-option__body">
                      <span className="address-option__name">ใช้ที่อยู่ใหม่</span>
                    </span>
                    <span className="address-option__edit">กรอกเอง</span>
                  </button>
                </div>
              )}

              {showAddressForm && (
                <div className="address-form address-form--inline">
                  <AddressSearch onSelect={handleAddressSearchSelect} />
                  <div className="form-grid">
                    <label>ชื่อผู้รับ<input placeholder="ชื่อ–นามสกุล" /></label>
                    <label>เบอร์โทร<input placeholder="08X-XXX-XXXX" /></label>
                    <label className="full">
                      ที่อยู่
                      <input
                        value={addressText}
                        onChange={(event) => setAddressText(event.target.value)}
                        placeholder="บ้านเลขที่ ถนน แขวง/ตำบล เขต/อำเภอ"
                      />
                    </label>
                    <label>
                      จังหวัด
                      <input value={province} onChange={(event) => setProvince(event.target.value)} placeholder="เลือกจังหวัด" />
                    </label>
                    <label>
                      รหัสไปรษณีย์
                      <input inputMode="numeric" value={postcode} onChange={(event) => setPostcode(event.target.value)} placeholder="10XXX" />
                    </label>
                  </div>
                  <div className="address-map address-map--picker">
                    <AddressMap
                      lat={coords.lat}
                      lng={coords.lng}
                      onMove={(lat, lng) => setCoords({ lat, lng })}
                    />
                    <span>{formatCoords(coords.lat, coords.lng)} · คลิกหรือลากหมุดเพื่อเลือกจุด · คลิกแผนที่แล้วเลื่อนล้อเมาส์เพื่อซูม</span>
                    <button type="button" className="address-map__locate" onClick={locateMe} disabled={locating}>
                      {locating ? "กำลังค้นหา…" : "ใช้ตำแหน่งปัจจุบัน"}
                    </button>
                  </div>
                  {locateError && <p className="address-map__error">{locateError}</p>}
                  <label className="checkbox-row">
                    <input type="checkbox" checked={saveNewAddress} onChange={(event) => setSaveNewAddress(event.target.checked)} />
                    <span>บันทึกที่อยู่นี้ไว้ใช้ครั้งหน้า</span>
                  </label>
                </div>
              )}
            </div>
          )}
        </div>
        <aside className="summary">
          <h2>สรุปคำสั่งซื้อ</h2>
          <div><span>ยอดสินค้า</span><strong>{baht(subtotal)}</strong></div>
          <div><span>ค่าจัดส่งควบคุมอุณหภูมิ</span><strong>{baht(shipping)}</strong></div>
          <div className="discount"><span>ส่วนลดสมาชิก</span><strong>—</strong></div>
          <div className="summary-total"><span>ยอดรวม</span><strong>{baht(grandTotal)}</strong></div>
          <button className="button button--dark" onClick={checkout} disabled={items.length === 0}>{user ? "ไปหน้าสแกน QR" : "สมัครสมาชิกเพื่อสั่งซื้อ"}</button>
          <small>ชำระผ่าน PromptPay · ข้อมูลถูกเข้ารหัสอย่างปลอดภัย</small>
        </aside>
      </div>
    </main>
  );
}
