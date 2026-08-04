"use client";

import { useState } from "react";

export default function AddressesPage() {
  const [adding, setAdding] = useState(false);

  return (
    <main className="section page-section address-page">
      <p className="eyebrow">บัญชีของฉัน</p>
      <div className="page-heading">
        <div><h1>ที่อยู่จัดส่งที่บันทึกไว้</h1><p>เลือกและจัดการที่อยู่สำหรับการจัดส่งครั้งต่อไป</p></div>
        <button className="button button--dark" onClick={() => setAdding(true)}>+ เพิ่มที่อยู่ใหม่</button>
      </div>
      <article className="address-card">
        <div>
          <span className="address-tag">บ้าน</span>
          <h3>ปิยะดา ส. · 081-234-5678</h3>
          <p>128/45 ซ.สุขุมวิท 31 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ 10110</p>
        </div>
        <div><button>แก้ไข</button><button className="muted">ลบ</button></div>
      </article>
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
