"use client";

import { Suspense, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { bahtAmount } from "../../lib/data";
import { addressLines } from "../../lib/address";
import {
  formatOrderDateTime,
  orderReference,
  FULFILLMENT_STAGE_HEADLINES,
  FULFILLMENT_STAGE_LABELS,
  ORDER_STATUS_LABELS,
  type OrderTracking,
  type OrderTrackingStep,
} from "../../lib/order";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import { fetchOrderTracking, fetchOrders } from "../../lib/store/slices/orderSlice";
import { setAuthMode, setAuthOpen } from "../../lib/store/slices/authModalSlice";

function stepNote(step: OrderTrackingStep): string {
  if (step.at) return formatOrderDateTime(step.at);
  return step.status === "current" ? "กำลังดำเนินการ" : "รอดำเนินการ";
}

function TrackShell({ children }: { children: React.ReactNode }) {
  return <main className="account-page page-section">{children}</main>;
}

function TrackHeading({ title, meta, action }: { title: string; meta: string; action?: React.ReactNode }) {
  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow">ติดตามคำสั่งซื้อ</p>
        <h1>{title}</h1>
        <div className="heading-meta">{meta}</div>
      </div>
      {action}
    </div>
  );
}

function TrackingView({ order }: { order: OrderTracking }) {
  // ที่อยู่บนออเดอร์เป็นสำเนาที่คัดลอกไว้ตอนสั่ง ไม่ใช่ที่อยู่ปัจจุบันในบัญชี
  const shipTo = order.shipping;

  return (
    <>
      <TrackHeading
        title={FULFILLMENT_STAGE_HEADLINES[order.fulfillmentStage]}
        meta={[
          `${orderReference(order)} · สั่งเมื่อ ${formatOrderDateTime(order.createdAt)}`,
          order.estimatedDeliveryAt && `คาดว่าถึงบ้าน ${formatOrderDateTime(order.estimatedDeliveryAt)}`,
          order.status !== "PAID" && ORDER_STATUS_LABELS[order.status],
        ]
          .filter(Boolean)
          .join(" · ")}
        action={
          order.trackingNumber ? (
            <div className="tracking-number">
              <div>เลขติดตามพัสดุ</div>
              <div>{order.trackingNumber}</div>
            </div>
          ) : undefined
        }
      />

      <div className="tracking-grid">
        <div>
          <div className="progress-steps">
            {order.steps.map((step) => (
              <div
                className={`progress-step ${step.status === "complete" ? "complete" : ""} ${step.status === "current" ? "current" : ""}`}
                key={step.stage}
              >
                <i />
                <strong>{FULFILLMENT_STAGE_LABELS[step.stage]}</strong>
                <small>{stepNote(step)}</small>
              </div>
            ))}
          </div>

          <div className="activity-log timeline-list">
            {order.events.map((event) => (
              <div className="timeline-row" key={event.id}>
                <time>{formatOrderDateTime(event.occurredAt)}</time>
                <div>
                  <h3>{event.title}</h3>
                  {event.detail && <p>{event.detail}</p>}
                </div>
              </div>
            ))}
            {/* API ส่งเฉพาะบันทึกที่พนักงานเขียนเอง สองรายการนี้จึงประกอบจากฟิลด์ของออเดอร์ */}
            {order.paidAt && (
              <div className="timeline-row">
                <time>{formatOrderDateTime(order.paidAt)}</time>
                <div>
                  <h3>ได้รับการชำระเงินแล้ว</h3>
                  <p>พร้อมเพย์ · {bahtAmount(order.total)} · ใบเสร็จส่งเข้าอีเมลเรียบร้อย</p>
                </div>
              </div>
            )}
            <div className="timeline-row">
              <time>{formatOrderDateTime(order.createdAt)}</time>
              <div>
                <h3>รับคำสั่งซื้อเข้าระบบ</h3>
                <p>จัดคิวเข้ารอบตัดผลไม้เช้าถัดไปให้อัตโนมัติ</p>
              </div>
            </div>
          </div>
        </div>

        <aside className="tracking-aside">
          <div className="order-summary-card">
            <h2>รายการในกล่อง</h2>
            <div className="summary-lines">
              {order.items.map((item) => (
                <div className="summary-line" key={item.id}>
                  <div className="summary-thumb">
                    {item.imageUrl && (
                      <Image src={item.imageUrl} alt={item.productName} fill sizes="48px" unoptimized />
                    )}
                  </div>
                  <div>
                    <strong>{item.productName}</strong>
                    <small>{item.sizeLabel} × {item.qty}</small>
                  </div>
                  <b>{bahtAmount(item.lineTotal)}</b>
                </div>
              ))}
            </div>
            <div className="summary-line summary-line--fee">
              <span>ค่าจัดส่งควบคุมอุณหภูมิ</span>
              <b>{bahtAmount(order.shippingFee)}</b>
            </div>
            <div className="summary-total"><span>ยอดชำระ</span><b>{bahtAmount(order.total)}</b></div>
          </div>

          <div className="delivery-info-card">
            <p>จัดส่งถึง</p>
            <p>{shipTo.label ?? "ที่อยู่จัดส่ง"}</p>
            <address>
              {addressLines(shipTo).map((line, index, all) => (
                <span key={line}>{line}{index < all.length - 1 && <br />}</span>
              ))}
            </address>
            {order.shipping.note && <address>หมายเหตุ: {order.shipping.note}</address>}
            <div className="button-row">
              <Link className="button button--outline" href="/orders">ดูคำสั่งซื้อทั้งหมด</Link>
              <Link className="button button--outline" href="/cart">สั่งซ้ำรายการนี้</Link>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

function TrackPageInner() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const requestedId = searchParams.get("order");

  const { items, tracking, trackingLoading, trackingError, loaded, loading, unauthorized } =
    useAppSelector((state) => state.order);
  const user = useAppSelector((state) => state.auth.user);
  const authHydrated = useAppSelector((state) => state.auth.hydrated);

  // ไม่ได้ระบุใบไหนมา ให้ตกไปที่ใบที่จ่ายเงินแล้วและใหม่ที่สุด ซึ่งเป็นใบที่ลูกค้า
  // น่าจะอยากติดตามมากที่สุด — ต้องรอลิสต์โหลดเสร็จก่อนถึงจะรู้ว่าใบไหน
  const fallbackId = items.find((order) => order.status === "PAID")?.id ?? items[0]?.id;
  const orderId = requestedId ?? fallbackId;

  useEffect(() => {
    if (authHydrated && user && !loaded && !loading) dispatch(fetchOrders());
  }, [authHydrated, dispatch, loaded, loading, user]);

  useEffect(() => {
    if (authHydrated && user && orderId) dispatch(fetchOrderTracking(orderId));
  }, [authHydrated, dispatch, orderId, user]);

  if (unauthorized || (authHydrated && !user)) {
    return (
      <TrackShell>
        <TrackHeading
          title="ติดตามคำสั่งซื้อ"
          meta="เข้าสู่ระบบเพื่อดูสถานะการจัดส่งของคุณ"
          action={
            <button
              className="text-link"
              onClick={() => { dispatch(setAuthMode("login")); dispatch(setAuthOpen(true)); }}
            >
              เข้าสู่ระบบ
            </button>
          }
        />
      </TrackShell>
    );
  }

  if (tracking && tracking.id === orderId) {
    return (
      <TrackShell>
        <TrackingView order={tracking} />
      </TrackShell>
    );
  }

  if (trackingLoading || loading || !authHydrated) {
    return (
      <TrackShell>
        <TrackHeading title="ติดตามคำสั่งซื้อ" meta="กำลังโหลดสถานะการจัดส่ง…" />
      </TrackShell>
    );
  }

  return (
    <TrackShell>
      <TrackHeading
        title="ไม่พบคำสั่งซื้อ"
        meta={trackingError ?? (orderId ? "คำสั่งซื้อนี้อาจถูกลบไปแล้ว" : "ยังไม่มีคำสั่งซื้อให้ติดตาม")}
        action={<Link className="text-link" href="/orders">ดูคำสั่งซื้อทั้งหมด</Link>}
      />
    </TrackShell>
  );
}

export default function TrackPage() {
  // useSearchParams ต้องอยู่ใต้ Suspense ไม่งั้น Next จะบังคับให้ทั้งหน้าเป็น dynamic
  return (
    <Suspense
      fallback={
        <TrackShell>
          <TrackHeading title="ติดตามคำสั่งซื้อ" meta="กำลังโหลด…" />
        </TrackShell>
      }
    >
      <TrackPageInner />
    </Suspense>
  );
}
