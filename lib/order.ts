/** ตรงกับ enum OrderStatus ของ Prisma ฝั่ง API — บอกว่า "เงิน" อยู่ตรงไหน */
export type OrderStatus = "PENDING" | "PAID" | "EXPIRED" | "REFUNDED" | "CANCELLED";

/** ตรงกับ enum FulfillmentStage — บอกว่า "ผลไม้" อยู่ตรงไหน แยกอิสระจากสถานะเงิน */
export type FulfillmentStage = "RECEIVED" | "HARVESTED" | "PACKING" | "SHIPPED" | "DELIVERED";

export type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  imageUrl: string | null;
  sizeId: string;
  /** ขนาดที่ซื้อ เช่น "๑๐ ลูก" — ราคาต่อหน่วยคิดจากขนาดนี้ ไม่ใช่ products.price */
  sizeLabel: string;
  harvestRoundName: string;
  cutDate: string;
  qty: number;
  /** ทศนิยม ๒ ตำแหน่งในรูป string — API ไม่ส่งเป็น number เพราะ float ปัดค่าเงินเพี้ยน */
  unitPrice: string;
  lineTotal: string;
};

export type OrderShipping = {
  /** ชื่อเรียกที่อยู่ตอนสั่ง เช่น "บ้าน" — null สำหรับออเดอร์เก่าที่สั่งก่อนมีฟิลด์นี้ */
  label: string | null;
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
};

export type Order = {
  id: string;
  status: OrderStatus;
  fulfillmentStage: FulfillmentStage;
  /** เฉพาะค่าสินค้า ไม่รวมค่าส่ง */
  itemsTotal: string;
  shippingFee: string;
  /** ยอดที่ต้องจ่ายจริง = itemsTotal + shippingFee */
  total: string;
  /** ได้เลขพัสดุเมื่อส่งของให้ขนส่งแล้วเท่านั้น */
  trackingNumber: string | null;
  estimatedDeliveryAt: string | null;
  /** เวลาที่ order PENDING จะคืนสต็อก — ไม่มีความหมายเมื่อจ่ายเงินหรือยกเลิกแล้ว */
  expiresAt: string;
  createdAt: string;
  paidAt: string | null;
  shipping: OrderShipping;
  items: OrderItem[];
};

export type TrackingStepStatus = "complete" | "current" | "pending";

export type OrderTrackingStep = {
  stage: FulfillmentStage;
  status: TrackingStepStatus;
  /** null ระหว่างที่ยังไม่ถึงขั้นนี้ */
  at: string | null;
};

/** บันทึกที่ทีมหลังบ้านเขียนเอง ไม่ได้ generate จากฟิลด์ของออเดอร์ */
export type OrderEvent = {
  id: string;
  stage: FulfillmentStage | null;
  title: string;
  detail: string | null;
  occurredAt: string;
};

export type OrderTracking = Order & {
  /** เรียงจากเก่าไปใหม่ — DELIVERED ไม่ใช่ขั้นแยก แต่ทำให้ SHIPPED เป็น complete */
  steps: OrderTrackingStep[];
  /** เรียงจากใหม่ไปเก่า */
  events: OrderEvent[];
};

export type OrderPage = {
  orders: Order[];
  /** ส่งกลับเป็น cursor ของหน้าถัดไป, null คือหน้าสุดท้าย */
  nextCursor: string | null;
};

export type ListOrdersParams = {
  limit?: number;
  cursor?: string;
};

export type CreateOrderItemInput = {
  productId: string;
  /** product_sizes.id ที่ลูกค้าเลือก — API คิดราคาจากตัวนี้ */
  sizeId: string;
  qty: number;
};

export type CreateOrderInput = {
  addressId: string;
  items: CreateOrderItemInput[];
  deviceHash?: string;
};

export const MAX_ITEMS_PER_ORDER = 20;
export const MAX_QTY_PER_ITEM = 50;
export const DEFAULT_ORDER_PAGE_SIZE = 20;

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "รอชำระเงิน",
  PAID: "ชำระเงินแล้ว",
  EXPIRED: "หมดเวลาชำระ",
  REFUNDED: "คืนเงินแล้ว",
  CANCELLED: "ยกเลิกแล้ว",
};

export const FULFILLMENT_STAGE_LABELS: Record<FulfillmentStage, string> = {
  RECEIVED: "รับคำสั่งซื้อ",
  HARVESTED: "ตัดจากสวน",
  PACKING: "คัดเกรดและแพ็ก",
  SHIPPED: "จัดส่งถึงบ้าน",
  DELIVERED: "ส่งถึงแล้ว",
};

/** พาดหัวหน้าติดตามพัสดุ — บอกสิ่งที่กำลังเกิดขึ้นกับผลไม้ ไม่ใช่สถานะเงิน */
export const FULFILLMENT_STAGE_HEADLINES: Record<FulfillmentStage, string> = {
  RECEIVED: "รับคำสั่งซื้อแล้ว",
  HARVESTED: "ตัดจากสวนแล้ว",
  PACKING: "กำลังคัดผลไม้ให้คุณ",
  SHIPPED: "กำลังจัดส่งถึงบ้าน",
  DELIVERED: "ส่งถึงแล้ว",
};

/**
 * เลข modifier ของคลาส .status ใน globals.css — 0 = ส้ม (ต้องรีบทำอะไรบางอย่าง),
 * 3 = เทา (จบไปแล้ว), ที่เหลือใช้สีเขียวเริ่มต้น
 */
export function orderStatusTone(status: OrderStatus): 0 | 1 | 3 {
  if (status === "PENDING") return 0;
  if (status === "PAID") return 1;
  return 3;
}

/** ยกเลิกได้เฉพาะตอน PENDING เท่านั้น — สถานะอื่น API ตอบ 409 */
export function isCancellable(order: Order): boolean {
  return order.status === "PENDING";
}

const THAI_DATE = new Intl.DateTimeFormat("th-TH-u-nu-thai-ca-buddhist", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const THAI_DATE_TIME = new Intl.DateTimeFormat("th-TH-u-nu-thai-ca-buddhist", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatOrderDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : THAI_DATE.format(date);
}

export function formatOrderDateTime(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : THAI_DATE_TIME.format(date);
}

/** เลขที่ออเดอร์เป็น UUIDv7 ยาวเกินจะโชว์ทั้งเส้น — ตัดเหลือท่อนแรกให้อ่านออก */
export function orderReference(order: Order): string {
  return `MTR-${order.id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export function orderItemsSummary(order: Order): string {
  if (!order.items.length) return "ไม่มีรายการสินค้า";
  return order.items
    .map((item) => `${item.productName} (${item.sizeLabel})${item.qty > 1 ? ` ×${item.qty}` : ""}`)
    .join(" · ");
}

/** ข้อความบรรทัดรองใต้รายการสินค้า บอกว่าลูกค้าต้องทำอะไรต่อ */
export function orderProgressNote(order: Order): string {
  switch (order.status) {
    case "PENDING":
      return `กรุณาชำระเงินภายใน ${formatOrderDateTime(order.expiresAt)}`;
    // จ่ายเงินแล้วลูกค้าสนใจว่าผลไม้ไปถึงไหน ไม่ใช่ว่าจ่ายไปแล้ว
    case "PAID":
      if (order.fulfillmentStage === "DELIVERED") return "ส่งถึงแล้ว";
      if (order.estimatedDeliveryAt) {
        return `${FULFILLMENT_STAGE_LABELS[order.fulfillmentStage]} · คาดว่าถึงบ้าน ${formatOrderDateTime(order.estimatedDeliveryAt)}`;
      }
      return `${FULFILLMENT_STAGE_LABELS[order.fulfillmentStage]} · จัดส่งรอบ ${order.items[0]?.harvestRoundName ?? "ถัดไป"}`;
    case "EXPIRED":
      return "หมดเวลาชำระเงิน สต็อกถูกคืนเข้าระบบแล้ว";
    case "REFUNDED":
      return "คืนเงินเรียบร้อยแล้ว";
    case "CANCELLED":
      return "ยกเลิกคำสั่งซื้อแล้ว";
  }
}
