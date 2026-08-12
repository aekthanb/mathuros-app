"use client";

import { useEffect, useState } from "react";
import {
  addressCoords,
  addressLines,
  validateAddressInput,
  type CreateAddressInput,
  type SavedAddress,
} from "../../lib/address";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import {
  createAddress,
  deleteAddress,
  fetchAddresses,
  makeAddressDefault,
  updateAddress,
} from "../../lib/store/slices/addressSlice";
import { setAuthMode, setAuthOpen } from "../../lib/store/slices/authModalSlice";

type FormState = CreateAddressInput & { note: string };

const EMPTY_FORM: FormState = {
  label: "",
  recipientName: "",
  recipientPhone: "",
  addressLine: "",
  subDistrict: "",
  district: "",
  province: "",
  postalCode: "",
  note: "",
};

function toForm(address: SavedAddress): FormState {
  return {
    label: address.label,
    recipientName: address.recipientName,
    recipientPhone: address.recipientPhone,
    addressLine: address.addressLine,
    subDistrict: address.subDistrict,
    district: address.district,
    province: address.province,
    postalCode: address.postalCode,
    note: address.note ?? "",
  };
}

export default function AddressesPage() {
  const dispatch = useAppDispatch();
  const { items, loading, loaded, saving, pendingId, unauthorized, error } = useAppSelector((state) => state.address);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const setField = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setForm((current) => (current ? { ...current, [field]: event.target.value } : current));

  function openCreate() {
    setEditingId(null);
    setFormError(null);
    setForm({ ...EMPTY_FORM });
  }

  function openEdit(address: SavedAddress) {
    setEditingId(address.id);
    setFormError(null);
    setForm(toForm(address));
  }

  function closeForm() {
    setForm(null);
    setEditingId(null);
    setFormError(null);
  }

  async function submitForm() {
    if (!form) return;

    const invalid = validateAddressInput(form);
    if (invalid) {
      setFormError(invalid);
      return;
    }
    setFormError(null);

    const payload: CreateAddressInput = {
      label: form.label.trim(),
      recipientName: form.recipientName.trim(),
      recipientPhone: form.recipientPhone.trim(),
      addressLine: form.addressLine.trim(),
      subDistrict: form.subDistrict.trim(),
      district: form.district.trim(),
      province: form.province.trim(),
      postalCode: form.postalCode.trim(),
      ...(form.note.trim() ? { note: form.note.trim() } : {}),
    };

    const result = editingId
      ? await dispatch(updateAddress({ id: editingId, changes: payload }))
      : await dispatch(createAddress(payload));

    if (result.meta.requestStatus === "fulfilled") closeForm();
  }

  async function removeAddress(address: SavedAddress) {
    if (!window.confirm(`ลบที่อยู่ "${address.label}" ใช่หรือไม่`)) return;
    const result = await dispatch(deleteAddress(address.id));
    if (result.meta.requestStatus === "fulfilled" && editingId === address.id) closeForm();
  }

  if (unauthorized) {
    return (
      <main className="account-page page-section">
        <div className="page-heading">
          <div>
            <p className="eyebrow">บัญชีของฉัน</p>
            <h1>ที่อยู่จัดส่งที่บันทึกไว้</h1>
            <div className="heading-meta">เข้าสู่ระบบเพื่อดูและจัดการที่อยู่ที่บันทึกไว้ในบัญชีของคุณ</div>
          </div>
          <button
            className="text-link"
            onClick={() => { dispatch(setAuthMode("login")); dispatch(setAuthOpen(true)); }}
          >
            เข้าสู่ระบบ
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="account-page page-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">บัญชีของฉัน</p>
          <h1>ที่อยู่จัดส่งที่บันทึกไว้</h1>
          <div className="heading-meta">เลือกที่อยู่หลักไว้ล่วงหน้า เวลาสั่งซื้อจะข้ามขั้นตอนกรอกได้เลย</div>
        </div>
        <button className="text-link" onClick={openCreate}>เพิ่มที่อยู่ใหม่</button>
      </div>

      {error && <p className="address-map__error">{error}</p>}
      {loading && !loaded && <p className="cart-empty">กำลังโหลดที่อยู่…</p>}

      <div className="address-grid">
        {items.map((address) => {
          const busy = pendingId === address.id;
          return (
            <article className={`address-card ${address.isDefault ? "address-card--primary" : ""}`} key={address.id}>
              <div className="address-card__head">
                <div className="address-card__name">
                  <span>{address.label}</span>
                  {address.isDefault && <span className="address-tag">ที่อยู่หลัก</span>}
                </div>
                <button className="address-card__edit" onClick={() => openEdit(address)}>แก้ไข</button>
              </div>
              <p className="address-card__text">
                {addressLines(address).map((line, index, all) => (
                  <span key={line}>{line}{index < all.length - 1 && <br />}</span>
                ))}
              </p>
              <div className="address-map"><i /><span>{addressCoords(address)}</span></div>
              <div className="address-card__foot">
                <span>{address.note || "ไม่มีหมายเหตุการจัดส่ง"}</span>
                <span className="address-card__actions">
                  {!address.isDefault && (
                    <button onClick={() => dispatch(makeAddressDefault(address.id))} disabled={busy}>
                      {busy ? "กำลังบันทึก…" : "ตั้งเป็นที่อยู่หลัก"}
                    </button>
                  )}
                  <button onClick={() => removeAddress(address)} disabled={busy}>ลบ</button>
                </span>
              </div>
            </article>
          );
        })}
        <button className="address-add-card" onClick={openCreate}>
          <span>+</span>
          <strong>เพิ่มที่อยู่ใหม่</strong>
          <small>ปักหมุดบนแผนที่หรือกรอกที่อยู่เอง บันทึกได้ไม่จำกัดจำนวน</small>
        </button>
      </div>

      {form && (
        <div className="address-form">
          <h2>{editingId ? "แก้ไขที่อยู่" : "เพิ่มที่อยู่ใหม่"}</h2>
          <div className="form-grid">
            <label>ชื่อเรียกที่อยู่<input value={form.label} onChange={setField("label")} placeholder="บ้าน / ออฟฟิศ" /></label>
            <label>ชื่อผู้รับ<input value={form.recipientName} onChange={setField("recipientName")} placeholder="ชื่อ–นามสกุล" /></label>
            <label>เบอร์โทรศัพท์<input value={form.recipientPhone} onChange={setField("recipientPhone")} placeholder="08X-XXX-XXXX" /></label>
            <label>จังหวัด<input value={form.province} onChange={setField("province")} placeholder="กรุงเทพมหานคร" /></label>
            <label className="full">ที่อยู่<input value={form.addressLine} onChange={setField("addressLine")} placeholder="บ้านเลขที่ อาคาร ซอย ถนน" /></label>
            <label>แขวง / ตำบล<input value={form.subDistrict} onChange={setField("subDistrict")} /></label>
            <label>เขต / อำเภอ<input value={form.district} onChange={setField("district")} /></label>
            <label>รหัสไปรษณีย์<input inputMode="numeric" value={form.postalCode} onChange={setField("postalCode")} placeholder="10110" /></label>
            <label>หมายเหตุการจัดส่ง<input value={form.note} onChange={setField("note")} placeholder="ฝากไว้กับนิติบุคคลได้" /></label>
          </div>
          {formError && <p className="address-map__error">{formError}</p>}
          <div className="button-row">
            <button className="button button--dark" onClick={submitForm} disabled={saving}>
              {saving ? "กำลังบันทึก…" : "บันทึกที่อยู่"}
            </button>
            <button className="button button--outline" onClick={closeForm} disabled={saving}>ยกเลิก</button>
          </div>
        </div>
      )}
    </main>
  );
}
