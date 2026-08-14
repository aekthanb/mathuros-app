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

export function formatThaiPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function normalizeAddressCoordinate(value: unknown): number | null {
  const coordinate = Number(value);
  return Number.isFinite(coordinate) ? Number(coordinate.toFixed(4)) : null;
}

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
  if (String(input.recipientPhone).replace(/\D/g, "").length !== 10) {
    return "เบอร์โทรศัพท์ต้องเป็นตัวเลข ๑๐ หลัก";
  }
  return null;
}

/**
 * รับเฉพาะฟิลด์ที่ใช้จริง ไม่ผูกกับ SavedAddress ทั้งก้อน เพราะที่อยู่บนออเดอร์
 * (OrderShipping) เป็นสำเนาที่คัดลอกไว้ตอนสั่ง ไม่มี id / isDefault / label
 */
export type AddressLineFields = Pick<
  SavedAddress,
  | "recipientName"
  | "recipientPhone"
  | "addressLine"
  | "subDistrict"
  | "district"
  | "province"
  | "postalCode"
>;

export function addressLines(address: AddressLineFields): string[] {
  return [
    `${address.recipientName} · ${address.recipientPhone}`,
    [address.addressLine, address.subDistrict].filter(Boolean).join(" "),
    [address.district, address.province, address.postalCode].filter(Boolean).join(" "),
  ].filter((line) => line.trim().length > 0);
}

export function addressCoords(address: SavedAddress): string {
  const latitude = normalizeAddressCoordinate(address.latitude);
  const longitude = normalizeAddressCoordinate(address.longitude);
  if (latitude == null || longitude == null) return "ยังไม่ได้ปักหมุดบนแผนที่";
  return `${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`;
}

/** ที่อยู่หลักมาก่อน จากนั้นเรียงตามวันที่บันทึก — ให้ตรงกับลำดับที่ GET /addresses ส่งมา */
export function sortAddresses(addresses: SavedAddress[]): SavedAddress[] {
  return [...addresses].sort((a, b) => {
    if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1;
    return a.createdAt.localeCompare(b.createdAt);
  });
}
