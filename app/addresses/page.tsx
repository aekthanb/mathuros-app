"use client";

import { useState } from "react";

type Address = {
  name: string;
  tag?: string;
  tagVariant?: "primary" | "muted";
  primary?: boolean;
  lines: string[];
  coords: string;
  note: string;
};

const ADDRESSES: Address[] = [
  {
    name: "บ้าน",
    tag: "ที่อยู่หลัก",
    tagVariant: "primary",
    primary: true,
    lines: ["ปิยะดา ส. · 081-234-5678", "128/45 ซ.สุขุมวิท 31 แขวงคลองตันเหนือ", "เขตวัฒนา กรุงเทพฯ 10110"],
    coords: "13.7402° N, 100.5623° E",
    note: "ส่งได้ทุกวัน · ฝากไว้กับนิติบุคคลได้",
  },
  {
    name: "ออฟฟิศ",
    lines: ["ปิยะดา ส. · 081-234-5678", "999 อาคารเอ ชั้น 12 ถ.พระราม 4", "แขวงสีลม เขตบางรัก กรุงเทพฯ 10500"],
    coords: "13.7248° N, 100.5340° E",
    note: "รับพัสดุได้ จ.–ศ. ๙:๐๐–๑๘:๐๐",
  },
  {
    name: "ส่งให้คุณแม่",
    tag: "ต่างจังหวัด",
    tagVariant: "muted",
    lines: ["สมทรง ส. · 089-876-5432", "44/2 ต.ในเมือง อ.เมือง", "นครราชสีมา 30000"],
    coords: "14.9799° N, 102.0978° E",
    note: "ใช้เวลาส่ง ๑–๒ วัน",
  },
];

export default function AddressesPage() {
  const [adding, setAdding] = useState(false);

  return (
    <main className="account-page page-section">
      <div className="page-heading">
        <div>
          <p className="eyebrow">บัญชีของฉัน</p>
          <h1>ที่อยู่จัดส่งที่บันทึกไว้</h1>
          <div className="heading-meta">เลือกที่อยู่หลักไว้ล่วงหน้า เวลาสั่งซื้อจะข้ามขั้นตอนกรอกได้เลย</div>
        </div>
        <button className="text-link" onClick={() => setAdding(true)}>เพิ่มที่อยู่ใหม่</button>
      </div>

      <div className="address-grid">
        {ADDRESSES.map((addr) => (
          <article className={`address-card ${addr.primary ? "address-card--primary" : ""}`} key={addr.name}>
            <div className="address-card__head">
              <div className="address-card__name">
                <span>{addr.name}</span>
                {addr.tag && <span className={`address-tag ${addr.tagVariant === "muted" ? "address-tag--muted" : ""}`}>{addr.tag}</span>}
              </div>
              <button className="address-card__edit">แก้ไข</button>
            </div>
            <p className="address-card__text">
              {addr.lines.map((line, index) => (
                <span key={line}>{line}{index < addr.lines.length - 1 && <br />}</span>
              ))}
            </p>
            <div className="address-map"><i /><span>{addr.coords}</span></div>
            <div className="address-card__foot">
              <span>{addr.note}</span>
              {!addr.primary && <button>ตั้งเป็นที่อยู่หลัก</button>}
            </div>
          </article>
        ))}
        <button className="address-add-card" onClick={() => setAdding(true)}>
          <span>+</span>
          <strong>เพิ่มที่อยู่ใหม่</strong>
          <small>ปักหมุดบนแผนที่หรือกรอกที่อยู่เอง บันทึกได้ไม่จำกัดจำนวน</small>
        </button>
      </div>

      {adding && (
        <div className="address-form">
          <h2>เพิ่มที่อยู่ใหม่</h2>
          <div className="form-grid">
            <label>ชื่อผู้รับ<input placeholder="ชื่อ–นามสกุล" /></label>
            <label>เบอร์โทรศัพท์<input placeholder="08X-XXX-XXXX" /></label>
            <label className="full">ที่อยู่<input placeholder="บ้านเลขที่ อาคาร ซอย ถนน" /></label>
            <label>เขต / อำเภอ<input /></label>
            <label>รหัสไปรษณีย์<input inputMode="numeric" /></label>
          </div>
          <div className="button-row">
            <button className="button button--dark" onClick={() => setAdding(false)}>บันทึกที่อยู่</button>
            <button className="button button--outline" onClick={() => setAdding(false)}>ยกเลิก</button>
          </div>
        </div>
      )}
    </main>
  );
}
