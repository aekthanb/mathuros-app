"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { bahtAmount } from "../../lib/data";
import {
  formatOrderDate,
  isCancellable,
  orderItemsSummary,
  orderProgressNote,
  orderReference,
  orderStatusTone,
  ORDER_STATUS_LABELS,
  type Order,
  type OrderStatus,
} from "../../lib/order";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import { cancelOrder, fetchMoreOrders, fetchOrders } from "../../lib/store/slices/orderSlice";
import { setAuthMode, setAuthOpen } from "../../lib/store/slices/authModalSlice";

type Filter = { key: string; label: string; statuses?: OrderStatus[] };

const FILTERS: Filter[] = [
  { key: "all", label: "ทั้งหมด" },
  { key: "pending", label: "รอชำระเงิน", statuses: ["PENDING"] },
  { key: "paid", label: "ชำระเงินแล้ว", statuses: ["PAID"] },
  { key: "closed", label: "ยกเลิก / หมดอายุ", statuses: ["CANCELLED", "EXPIRED", "REFUNDED"] },
];

const thaiCount = new Intl.NumberFormat("th-TH-u-nu-thai");

function OrderThumbs({ order }: { order: Order }) {
  return (
    <div className="order-thumbs">
      {order.items.slice(0, 2).map((item) => (
        <div className="order-thumb" key={item.id}>
          {item.imageUrl && (
            <Image src={item.imageUrl} alt={item.productName} fill sizes="52px" unoptimized />
          )}
        </div>
      ))}
    </div>
  );
}

function OrderActions({ order }: { order: Order }) {
  const dispatch = useAppDispatch();
  const pendingId = useAppSelector((state) => state.order.pendingId);
  const busy = pendingId === order.id;

  async function requestCancel() {
    if (!window.confirm(`ยกเลิกคำสั่งซื้อ ${orderReference(order)} ใช่หรือไม่`)) return;
    await dispatch(cancelOrder(order.id));
  }

  if (isCancellable(order)) {
    return (
      <div className="order-actions">
        <Link className="button button--dark" href="/pay">ชำระเงิน</Link>
        <button className="button button--outline" onClick={requestCancel} disabled={busy}>
          {busy ? "กำลังยกเลิก…" : "ยกเลิก"}
        </button>
      </div>
    );
  }

  return (
    <div className="order-actions">
      {order.status === "PAID" && (
        <Link className="button button--dark" href={`/track?order=${order.id}`}>ติดตามสถานะ</Link>
      )}
      <Link className="button button--outline" href="/cart">สั่งซ้ำ</Link>
    </div>
  );
}

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const { items, nextCursor, loading, loaded, loadingMore, unauthorized, error } = useAppSelector(
    (state) => state.order,
  );
  const user = useAppSelector((state) => state.auth.user);
  const authHydrated = useAppSelector((state) => state.auth.hydrated);
  const [filterKey, setFilterKey] = useState("all");

  useEffect(() => {
    if (authHydrated && user) dispatch(fetchOrders());
  }, [authHydrated, dispatch, user]);

  const paidTotal = useMemo(
    () =>
      items
        .filter((order) => order.status === "PAID")
        .reduce((sum, order) => sum + Number.parseFloat(order.total), 0),
    [items],
  );

  const visible = useMemo(() => {
    const statuses = FILTERS.find((filter) => filter.key === filterKey)?.statuses;
    return statuses ? items.filter((order) => statuses.includes(order.status)) : items;
  }, [filterKey, items]);

  if (unauthorized || (authHydrated && !user)) {
    return (
      <main className="account-page page-section">
        <div className="page-heading">
          <div>
            <p className="eyebrow">บัญชีของฉัน</p>
            <h1>ประวัติการสั่งซื้อ</h1>
            <div className="heading-meta">เข้าสู่ระบบเพื่อดูคำสั่งซื้อทั้งหมดในบัญชีของคุณ</div>
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
          <h1>ประวัติการสั่งซื้อ</h1>
          <div className="heading-meta">
            {loaded
              ? `สั่งทั้งหมด ${thaiCount.format(items.length)} ครั้ง · ยอดที่ชำระแล้ว ${bahtAmount(paidTotal)}`
              : "กำลังดึงคำสั่งซื้อจากระบบ…"}
          </div>
        </div>
        <div className="order-filters">
          {FILTERS.map((filter) => (
            <button
              key={filter.key}
              className={filter.key === filterKey ? "active" : undefined}
              onClick={() => setFilterKey(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="address-map__error">{error}</p>}
      {loading && !loaded && <p className="cart-empty">กำลังโหลดคำสั่งซื้อ…</p>}
      {loaded && !visible.length && !error && (
        <p className="cart-empty">
          {items.length ? "ไม่มีคำสั่งซื้อในหมวดนี้" : "ยังไม่มีคำสั่งซื้อ ลองเลือกผลไม้ที่ชอบดูก่อนได้เลย"}
        </p>
      )}

      <div className="orders">
        {visible.map((order) => (
          <article className="order-card" key={order.id}>
            <div className="order-head">
              <span>
                <strong>{orderReference(order)}</strong>
                <small>{formatOrderDate(order.createdAt)}</small>
                <b className={`status status--${orderStatusTone(order.status)}`}>
                  {ORDER_STATUS_LABELS[order.status]}
                </b>
              </span>
              <b>{bahtAmount(order.total)}</b>
            </div>
            <div className="order-body">
              <div className="order-body__info">
                <OrderThumbs order={order} />
                <span>
                  <strong>{orderItemsSummary(order)}</strong>
                  <small>{orderProgressNote(order)}</small>
                </span>
              </div>
              <OrderActions order={order} />
            </div>
          </article>
        ))}
      </div>

      {nextCursor && (
        <div className="orders-more">
          <button
            className="button button--outline pill"
            onClick={() => dispatch(fetchMoreOrders())}
            disabled={loadingMore}
          >
            {loadingMore ? "กำลังโหลด…" : "ดูคำสั่งซื้อเก่ากว่านี้"}
          </button>
        </div>
      )}
    </main>
  );
}
