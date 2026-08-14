import { api } from "./client";
import type {
  CreateOrderInput,
  ListOrdersParams,
  Order,
  OrderPage,
  OrderTracking,
} from "../lib/order";

/**
 * POST /orders บังคับ header นี้ ยาว ๘–๑๒๘ ตัวอักษร ถ้าส่งซ้ำด้วยคีย์เดิม
 * API จะคืนออเดอร์ใบเดิมแทนที่จะตัดสต็อกรอบสอง
 */
export function newIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `mtr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

export const listOrdersRequest = async (params: ListOrdersParams = {}) => {
  const res = await api.get<OrderPage>("/orders", { params });
  return res.data;
};

export const getOrderRequest = async (id: string) => {
  const res = await api.get<Order>(`/orders/${id}`);
  return res.data;
};

/** คืนทุกอย่างที่หน้าติดตามพัสดุต้องใช้ในครั้งเดียว — ออเดอร์ + ขั้นตอน + ไทม์ไลน์ */
export const getOrderTrackingRequest = async (id: string) => {
  const res = await api.get<OrderTracking>(`/orders/${id}/tracking`);
  return res.data;
};

export const createOrderRequest = async (
  body: CreateOrderInput,
  idempotencyKey: string = newIdempotencyKey(),
) => {
  const res = await api.post<Order>("/orders", body, {
    headers: { "Idempotency-Key": idempotencyKey },
  });
  return res.data;
};

export const cancelOrderRequest = async (id: string) => {
  const res = await api.post<Order>(`/orders/${id}/cancel`);
  return res.data;
};
