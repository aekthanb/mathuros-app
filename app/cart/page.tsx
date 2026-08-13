"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { PRODUCTS, baht } from "../../lib/data";
import {
  addressLines,
  formatThaiPhoneNumber,
  normalizeAddressCoordinate,
  validateAddressInput,
  type CreateAddressInput,
} from "../../lib/address";
import CartLine from "../../components/CartLine";
import AddressSearch, { type AddressSearchResult } from "../../components/AddressSearch";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import { removeFromCart, toOrderItems, updateCartQty } from "../../lib/store/slices/cartSlice";
import { createAddress, fetchAddresses } from "../../lib/store/slices/addressSlice";
import { placeOrder } from "../../lib/store/slices/orderSlice";
import { newIdempotencyKey } from "../../api/orders";
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
  const authHydrated = useAppSelector((state) => state.auth.hydrated);
  const cartCount = items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
  const shipping = items.length ? SHIPPING : 0;
  const grandTotal = subtotal + shipping;

  const savedAddresses = useAppSelector((state) => state.address.items);
  const savingAddress = useAppSelector((state) => state.address.saving);

  const [selectedAddress, setSelectedAddress] = useState("");
  const [useNewAddress, setUseNewAddress] = useState(false);
  const showAddressForm = !user || useNewAddress || savedAddresses.length === 0;

  const [coords, setCoords] = useState(DEFAULT_COORDS);
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState<string | null>(null);

  const [addressLabel, setAddressLabel] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [addressText, setAddressText] = useState("");
  const [subDistrict, setSubDistrict] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");
  const [postcode, setPostcode] = useState("");
  const [addressNote, setAddressNote] = useState("");
  const [saveError, setSaveError] = useState<string | null>(null);

  const placing = useAppSelector((state) => state.order.placing);
  const idempotencyKey = useRef<string | null>(null);

  useEffect(() => {
    if (authHydrated && user) dispatch(fetchAddresses());
  }, [authHydrated, dispatch, user]);

  // ยังไม่ได้เลือกเอง ให้ตกไปที่ตัวแรกของรายการ ซึ่ง GET /addresses การันตีว่าเป็นที่อยู่หลัก
  const activeAddressId = savedAddresses.some((address) => address.id === selectedAddress)
    ? selectedAddress
    : savedAddresses[0]?.id ?? "";

  function handleAddressSearchSelect(result: AddressSearchResult) {
    setCoords({ lat: result.lat, lng: result.lng });
    if (result.addressLine) setAddressText(result.addressLine);
    if (result.subDistrict) setSubDistrict(result.subDistrict);
    if (result.district) setDistrict(result.district);
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

  function resetAddressForm() {
    setAddressLabel("");
    setRecipientName("");
    setRecipientPhone("");
    setAddressText("");
    setSubDistrict("");
    setDistrict("");
    setProvince("");
    setPostcode("");
    setAddressNote("");
    setCoords(DEFAULT_COORDS);
    setLocateError(null);
    setSaveError(null);
  }

  async function saveShippingAddress() {
    if (!user) {
      dispatch(setAuthMode("register"));
      dispatch(setAuthOpen(true));
      return;
    }

    const latitude = normalizeAddressCoordinate(coords.lat);
    const longitude = normalizeAddressCoordinate(coords.lng);
    if (latitude == null || longitude == null) {
      setSaveError("พิกัดที่อยู่ไม่ถูกต้อง กรุณาเลือกตำแหน่งบนแผนที่อีกครั้ง");
      return;
    }

    const payload: CreateAddressInput = {
      label: addressLabel.trim(),
      recipientName: recipientName.trim(),
      recipientPhone: recipientPhone.trim(),
      addressLine: addressText.trim(),
      subDistrict: subDistrict.trim(),
      district: district.trim(),
      province: province.trim(),
      postalCode: postcode.trim(),
      latitude,
      longitude,
      note: addressNote.trim(),
      isDefault: savedAddresses.length === 0,
    };

    const invalid = validateAddressInput(payload);
    if (invalid) {
      setSaveError(invalid);
      return;
    }

    const result = await dispatch(createAddress(payload));
    if (!createAddress.fulfilled.match(result)) {
      setSaveError(typeof result.payload === "string" ? result.payload : "บันทึกที่อยู่ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      return;
    }

    setSelectedAddress(result.payload.id);
    setUseNewAddress(false);
    resetAddressForm();
  }

  async function checkout() {
    if (!user) {
      dispatch(setAuthMode("register"));
      dispatch(setAuthOpen(true));
      return;
    }

    if (showAddressForm || !activeAddressId) {
      setSaveError("กรุณาบันทึกที่อยู่จัดส่งก่อนดำเนินการต่อ");
      return;
    }

    // กล่องคัดพิเศษยังไม่มีในฐานข้อมูล เลยสั่งผ่าน API ไม่ได้ — บอกให้เอาออกดีกว่า
    // ปล่อยให้หลุดไปเงียบ ๆ แล้วลูกค้าจ่ายเงินโดยไม่ได้ของ
    const orderItems = toOrderItems(items);
    const unorderable = items.filter((item) => !item.productId || !item.sizeId);
    if (unorderable.length) {
      setSaveError(
        `${unorderable.map((item) => item.name).join(" · ")} ยังสั่งซื้อผ่านระบบไม่ได้ กรุณานำออกจากตะกร้าก่อน`,
      );
      return;
    }
    if (!orderItems.length) {
      setSaveError("ไม่มีรายการที่สั่งซื้อได้ในตะกร้า");
      return;
    }

    // คีย์เดิมตลอดการกดสั่งซื้อรอบนี้ ถ้าเน็ตหลุดแล้วกดใหม่ API จะคืนออเดอร์ใบเดิม
    // แทนที่จะตัดสต็อกซ้ำ ล้างคีย์ก็ต่อเมื่อสั่งสำเร็จแล้วเท่านั้น
    idempotencyKey.current ??= newIdempotencyKey();

    const result = await dispatch(
      placeOrder({
        input: { addressId: activeAddressId, items: orderItems },
        idempotencyKey: idempotencyKey.current,
      }),
    );

    if (!placeOrder.fulfilled.match(result)) {
      setSaveError(typeof result.payload === "string" ? result.payload : "สั่งซื้อไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      return;
    }

    idempotencyKey.current = null;
    setSaveError(null);
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
                image={PRODUCTS.find((product) => product.sku === item.sku)?.image ?? (item.sku === "special-box" ? "/img/index/fruit-premium-1.png" : undefined)}
                name={item.name}
                detail={`${item.sizeLabel} · ส่งพรุ่งนี้`}
                price={baht(item.unitPrice * item.qty)}
                qty={item.qty}
                setQty={(value) => dispatch(updateCartQty({ id: item.id, qty: value }))}
                onRemove={() => dispatch(removeFromCart(item.id))}
              />
            ))
          )}
          {/*
          <div className="gift-note"><span>ส่งเป็นของขวัญ</span><p>เพิ่มการ์ดเขียนมือและห่อริบบิ้นให้ฟรี</p><button>เพิ่มข้อความในการ์ด</button></div>
          */}

          {items.length > 0 && (
            <div className="address-section">
              <div className="address-section__head">
                <h2>ที่อยู่จัดส่ง</h2>
                {savedAddresses.length > 0 && <span>ที่อยู่ที่บันทึกไว้ {savedAddresses.length} รายการ</span>}
              </div>

              {savedAddresses.length > 0 && (
                <div className="address-picker">
                  {savedAddresses.map((address) => (
                    <button
                      key={address.id}
                      type="button"
                      className={`address-option ${!useNewAddress && activeAddressId === address.id ? "address-option--active" : ""}`}
                      onClick={() => { setSelectedAddress(address.id); setUseNewAddress(false); }}
                    >
                      <span className="address-option__dot" />
                      <span className="address-option__body">
                        <span className="address-option__name">
                          <span>{address.label}</span>
                          {address.isDefault && <span className="address-tag">ที่อยู่หลัก</span>}
                        </span>
                        <span className="address-option__line">{addressLines(address).join(" ")}</span>
                      </span>
                      <span className="address-option__edit">{activeAddressId === address.id && !useNewAddress ? "จัดส่งที่นี่" : "เลือก"}</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    className={`address-option address-option--new ${useNewAddress ? "address-option--active" : ""}`}
                    onClick={() => { resetAddressForm(); setUseNewAddress(true); }}
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
                <div className="address-form">
                  <h2>เพิ่มที่อยู่ใหม่</h2>
                  <AddressSearch onSelect={handleAddressSearchSelect} />
                  <div className="form-grid">
                    <label>
                      ชื่อผู้รับ
                      <input value={recipientName} onChange={(event) => setRecipientName(event.target.value)} placeholder="ชื่อ–นามสกุล" />
                    </label>
                    <label>
                      เบอร์โทร
                      <input
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        maxLength={12}
                        value={recipientPhone}
                        onChange={(event) => setRecipientPhone(formatThaiPhoneNumber(event.target.value))}
                        placeholder="08X-XXX-XXXX"
                      />
                    </label>
                    <label className="full">
                      ที่อยู่
                      <input
                        value={addressText}
                        onChange={(event) => setAddressText(event.target.value)}
                        placeholder="บ้านเลขที่ อาคาร ซอย ถนน"
                      />
                    </label>
                    <label>
                      แขวง / ตำบล
                      <input value={subDistrict} onChange={(event) => setSubDistrict(event.target.value)} placeholder="คลองตันเหนือ" />
                    </label>
                    <label>
                      เขต / อำเภอ
                      <input value={district} onChange={(event) => setDistrict(event.target.value)} placeholder="วัฒนา" />
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
                  <div className="form-grid address-form__details">
                    <label>
                      ชื่อเรียกที่อยู่
                      <input value={addressLabel} onChange={(event) => setAddressLabel(event.target.value)} placeholder="บ้าน / ออฟฟิศ" />
                    </label>
                    <label>
                      หมายเหตุการจัดส่ง
                      <input value={addressNote} onChange={(event) => setAddressNote(event.target.value)} placeholder="ฝากไว้กับนิติบุคคลได้" />
                    </label>
                  </div>
                  {saveError && <p className="address-map__error">{saveError}</p>}
                  <div className="button-row">
                    <button className="button button--dark" onClick={saveShippingAddress} disabled={savingAddress}>
                      {savingAddress ? "กำลังบันทึก…" : "บันทึกที่อยู่"}
                    </button>
                    {savedAddresses.length > 0 && (
                      <button
                        className="button button--outline"
                        onClick={() => { resetAddressForm(); setUseNewAddress(false); }}
                        disabled={savingAddress}
                      >
                        ยกเลิก
                      </button>
                    )}
                  </div>
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
          {saveError && !showAddressForm && <p className="address-map__error">{saveError}</p>}
          <button
            className="button button--dark"
            onClick={checkout}
            disabled={items.length === 0 || savingAddress || placing}
          >
            {placing
              ? "กำลังสั่งซื้อ…"
              : savingAddress
                ? "กำลังบันทึกที่อยู่…"
                : user
                  ? "ยืนยันคำสั่งซื้อ"
                  : "สมัครสมาชิกเพื่อสั่งซื้อ"}
          </button>
          <small>ชำระผ่าน PromptPay · ข้อมูลถูกเข้ารหัสอย่างปลอดภัย</small>
        </aside>
      </div>
    </main>
  );
}
