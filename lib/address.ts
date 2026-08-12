export type SavedAddress = {
  id: string;
  label: string;
  recipientName: string;
  recipientPhone: string;
  addressLine: string;
  subDistrict: string;
  district: string;
  province: string;
  postalCode: string;
  latitude: number | null;
  longitude: number | null;
  note: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateAddressInput = {
  label: string;
  recipientName: string;
  recipientPhone: string;
  addressLine: string;
  subDistrict: string;
  district: string;
  province: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  note?: string;
  isDefault?: boolean;
};

/** PATCH /addresses/:id ไม่รับ isDefault — ต้องใช้ PATCH /addresses/:id/default แทน */
export type UpdateAddressInput = Partial<Omit<CreateAddressInput, "isDefault">>;

export const ADDRESS_FIELD_LABELS: Record<keyof CreateAddressInput, string> = {
  label: "ชื่อเรียกที่อยู่",
  recipientName: "ชื่อผู้รับ",
  recipientPhone: "เบอร์โทรศัพท์",
  addressLine: "ที่อยู่",
  subDistrict: "แขวง / ตำบล",
  district: "เขต / อำเภอ",
  province: "จังหวัด",
  postalCode: "รหัสไปรษณีย์",
  latitude: "ละติจูด",
  longitude: "ลองจิจูด",
  note: "หมายเหตุการจัดส่ง",
  isDefault: "ที่อยู่หลัก",
};

const REQUIRED_FIELDS: (keyof CreateAddressInput)[] = [
  "label",
  "recipientName",
  "recipientPhone",
  "addressLine",
  "subDistrict",
  "district",
  "province",
  "postalCode",
];

/** คืนข้อความ error ถ้ากรอกไม่ครบตาม CreateAddressDto, คืน null ถ้าผ่าน */
export function validateAddressInput(input: Partial<CreateAddressInput>): string | null {
  const missing = REQUIRED_FIELDS.filter((field) => !String(input[field] ?? "").trim());
  if (missing.length) {
    return `กรุณากรอก ${missing.map((field) => ADDRESS_FIELD_LABELS[field]).join(" · ")}`;
  }
  if (!/^\d{5}$/.test(String(input.postalCode).trim())) {
    return "รหัสไปรษณีย์ต้องเป็นตัวเลข ๕ หลัก";
  }
  return null;
}

export function addressLines(address: SavedAddress): string[] {
  return [
    `${address.recipientName} · ${address.recipientPhone}`,
    [address.addressLine, address.subDistrict].filter(Boolean).join(" "),
    [address.district, address.province, address.postalCode].filter(Boolean).join(" "),
  ].filter((line) => line.trim().length > 0);
}

export function addressCoords(address: SavedAddress): string {
  if (address.latitude == null || address.longitude == null) return "ยังไม่ได้ปักหมุดบนแผนที่";
  return `${address.latitude.toFixed(4)}° N, ${address.longitude.toFixed(4)}° E`;
}

/** ที่อยู่หลักมาก่อน จากนั้นเรียงตามวันที่บันทึก — ให้ตรงกับลำดับที่ GET /addresses ส่งมา */
export function sortAddresses(addresses: SavedAddress[]): SavedAddress[] {
  return [...addresses].sort((a, b) => {
    if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1;
    return a.createdAt.localeCompare(b.createdAt);
  });
}
