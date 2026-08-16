"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

type OrderItem = {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  item_name: string;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  table_id: string;
  table_number: number | null;
  customer_name: string;
  customer_phone: string | null;
  status: string;
  total_amount: number;
  subtotal: number;
  tax: number;
  discount: number;
  payment_status: string;
  payment_method: string | null;
  paid_at: string | null;
  created_at: string;
};

type OrderCardProps = {
  order: Order;
  items: OrderItem[];
  selectedPaymentMethod?: string;
  paying: boolean;
  onStatusChange: (
    orderId: string,
    status: string
  ) => void;
  onPaymentMethodChange: (
    orderId: string,
    method: string
  ) => void;
  onMarkPaid: (
    orderId: string,
    method: string
  ) => void;
  onPrintBill?: (
    order: Order,
    items: OrderItem[]
  ) => void;
};

function statusConfig(status: string) {
  switch (status) {
    case "pending":
      return {
        label: "New Order",
        bg: "bg-[#FFF7D6]",
        text: "text-[#8A6500]",
        dot: "bg-[#F8CB45]",
        icon: "🔔",
      };

    case "accepted":
      return {
        label: "Accepted",
        bg: "bg-[#EAF3FF]",
        text: "text-[#1769AA]",
        dot: "bg-[#3B82F6]",
        icon: "✓",
      };

    case "preparing":
      return {
        label: "Preparing",
        bg: "bg-[#F1EAFE]",
        text: "text-[#7041C8]",
        dot: "bg-[#8B5CF6]",
        icon: "👨‍🍳",
      };

    case "ready":
      return {
        label: "Ready",
        bg: "bg-[#E9F8E5]",
        text: "text-[#0C831F]",
        dot: "bg-[#54B226]",
        icon: "🍽️",
      };

    case "completed":
      return {
        label: "Completed",
        bg: "bg-[#F1F2F4]",
        text: "text-[#4B5563]",
        dot: "bg-[#6B7280]",
        icon: "✓",
      };

    case "rejected":
      return {
        label: "Rejected",
        bg: "bg-[#FEECEC]",
        text: "text-[#B42318]",
        dot: "bg-[#EF4444]",
        icon: "×",
      };

    default:
      return {
        label: status,
        bg: "bg-gray-100",
        text: "text-gray-700",
        dot: "bg-gray-500",
        icon: "•",
      };
  }
}

function nextAction(status: string) {
  switch (status) {
    case "pending":
      return {
        label: "Accept Order",
        next: "accepted",
      };

    case "accepted":
      return {
        label: "Start Preparing",
        next: "preparing",
      };

    case "preparing":
      return {
        label: "Mark Ready",
        next: "ready",
      };

    case "ready":
      return {
        label: "Complete Order",
        next: "completed",
      };

    default:
      return null;
  }
}

export default function OrderCard({
  order,
  items,
  selectedPaymentMethod,
  paying,
  onStatusChange,
  onPaymentMethodChange,
  onMarkPaid,
  onPrintBill,
}: OrderCardProps) {
  const cardRef =
    useRef<HTMLDivElement>(null);

  const previousStatus =
    useRef(order.status);

  useLayoutEffect(() => {
    const card = cardRef.current;

    if (!card) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 18,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        }
      );
    }, card);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (
      previousStatus.current ===
      order.status
    ) {
      return;
    }

    const card = cardRef.current;

    if (!card) return;

    gsap.fromTo(
      card,
      {
        y: -4,
      },
      {
        y: 0,
        duration: 0.25,
        ease: "back.out(1.5)",
      }
    );

    previousStatus.current =
      order.status;
  }, [order.status]);

  const status =
    statusConfig(order.status);

  const action =
    nextAction(order.status);

  const isPaid =
    order.payment_status === "paid";

  const itemCount =
    items.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  return (
    <article
      ref={cardRef}
      className="
        overflow-hidden
        rounded-[18px]
        border
        border-[#E9E9E7]
        bg-white
        shadow-[0_2px_8px_rgba(0,0,0,0.04)]
      "
    >
      {/* ==================================================
          ORDER HEADER
      ================================================== */}

      <div className="border-b border-[#EEEEEE] p-5">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

          <div>

            <div className="flex items-center gap-2">

              <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                Order
              </span>

              <span className="font-mono text-xs font-bold text-[#1F1F1F]">
                #{order.id.slice(0, 8).toUpperCase()}
              </span>

            </div>

            <h3 className="mt-2 text-xl font-bold text-[#1F1F1F]">
              Table{" "}
              {order.table_number ??
                "Unknown"}
            </h3>

            <p className="mt-1 text-sm text-[#6B7280]">
              Customer:{" "}
              <span className="font-semibold text-[#1F1F1F]">
                {order.customer_name}
              </span>
            </p>

            {order.customer_phone && (
              <p className="mt-1 text-xs text-[#6B7280]">
                {order.customer_phone}
              </p>
            )}

            <p className="mt-2 text-[11px] text-[#9CA3AF]">
              {new Date(
                order.created_at
              ).toLocaleString()}
            </p>

          </div>

          <div className="flex items-center gap-2">

            <span
              className={`
                inline-flex
                items-center
                gap-1.5
                rounded-full
                px-3
                py-1.5
                text-xs
                font-bold
                ${status.bg}
                ${status.text}
              `}
            >
              <span
                className={`
                  h-1.5
                  w-1.5
                  rounded-full
                  ${status.dot}
                `}
              />

              {status.label}
            </span>

            <span
              className={`
                rounded-full
                px-3
                py-1.5
                text-xs
                font-bold
                ${
                  isPaid
                    ? "bg-[#E9F8E5] text-[#0C831F]"
                    : "bg-[#FFF1E6] text-[#B54708]"
                }
              `}
            >
              {isPaid
                ? "✓ PAID"
                : "UNPAID"}
            </span>

          </div>

        </div>

      </div>

      {/* ==================================================
          QUICK SUMMARY
      ================================================== */}

      <div className="grid grid-cols-2 border-b border-[#EEEEEE] sm:grid-cols-3">

        <div className="p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
            Items
          </p>

          <p className="mt-1 text-lg font-bold">
            {itemCount}
          </p>
        </div>

        <div className="border-l border-[#EEEEEE] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
            Total
          </p>

          <p className="mt-1 text-lg font-bold">
            ₹
            {order.total_amount.toFixed(
              0
            )}
          </p>
        </div>

        <div className="col-span-2 border-t border-[#EEEEEE] p-4 sm:col-span-1 sm:border-l sm:border-t-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
            Payment
          </p>

          <p className="mt-1 text-sm font-bold capitalize">
            {isPaid
              ? order.payment_method ||
                "Paid"
              : "Pending"}
          </p>
        </div>

      </div>

      {/* ==================================================
          ITEMS
      ================================================== */}

      <div className="p-5">

        <div className="mb-3 flex items-center justify-between">

          <h4 className="text-sm font-bold">
            Order Items
          </h4>

          <span className="text-xs text-[#9CA3AF]">
            {itemCount} item
            {itemCount !== 1
              ? "s"
              : ""}
          </span>

        </div>

        {items.length === 0 ? (
          <div className="rounded-xl bg-[#F7F7F5] p-4 text-center text-sm text-[#6B7280]">
            No items found.
          </div>
        ) : (
          <div className="space-y-2">

            {items.map((item) => (
              <div
                key={item.id}
                className="
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  bg-[#F7F7F5]
                  px-3
                  py-3
                "
              >

                <div className="min-w-0">

                  <p className="truncate text-sm font-semibold">
                    {item.item_name}
                  </p>

                  <p className="mt-0.5 text-xs text-[#6B7280]">
                    ₹
                    {Number(
                      item.price
                    ).toFixed(0)}
                    {" "}×{" "}
                    {item.quantity}
                  </p>

                </div>

                <p className="ml-4 text-sm font-bold">
                  ₹
                  {(
                    Number(
                      item.price
                    ) *
                    item.quantity
                  ).toFixed(0)}
                </p>

              </div>
            ))}

          </div>
        )}

      </div>

      {/* ==================================================
          BILL
      ================================================== */}

      <div className="mx-5 rounded-2xl bg-[#F7F7F5] p-4">

        <div className="flex justify-between py-1 text-sm text-[#6B7280]">
          <span>Subtotal</span>

          <span>
            ₹
            {order.subtotal.toFixed(
              0
            )}
          </span>
        </div>

        <div className="flex justify-between py-1 text-sm text-[#6B7280]">
          <span>Tax</span>

          <span>
            ₹
            {order.tax.toFixed(
              0
            )}
          </span>
        </div>

        <div className="flex justify-between py-1 text-sm text-[#6B7280]">
          <span>Discount</span>

          <span>
            - ₹
            {order.discount.toFixed(
              0
            )}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-[#E5E7EB] pt-3">

          <span className="font-bold">
            Total
          </span>

          <span className="text-xl font-bold">
            ₹
            {order.total_amount.toFixed(
              0
            )}
          </span>

        </div>

      </div>

      {/* ==================================================
          PAYMENT
      ================================================== */}

      <div className="p-5">

        <div className="rounded-2xl border border-[#EEEEEE] p-4">

          <div className="flex items-center justify-between gap-3">

            <div>
              <p className="text-sm font-bold">
                Payment
              </p>

              <p className="mt-1 text-xs text-[#6B7280]">
                {isPaid
                  ? `Paid via ${order.payment_method}`
                  : "Payment not received yet"}
              </p>
            </div>

            {isPaid && (
              <span className="rounded-full bg-[#E9F8E5] px-3 py-1.5 text-xs font-bold text-[#0C831F]">
                ✓ PAID
              </span>
            )}

          </div>

          {!isPaid && (
            <div className="mt-4">

              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                Select payment method
              </p>

              <div className="grid grid-cols-3 gap-2">

                {[
                  {
                    id: "cash",
                    label: "Cash",
                    icon: "💵",
                  },
                  {
                    id: "upi",
                    label: "UPI",
                    icon: "📱",
                  },
                  {
                    id: "card",
                    label: "Card",
                    icon: "💳",
                  },
                ].map((method) => {

                  const selected =
                    selectedPaymentMethod ===
                    method.id;

                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() =>
                        onPaymentMethodChange(
                          order.id,
                          method.id
                        )
                      }
                      className={`
                        rounded-xl
                        border
                        px-2
                        py-3
                        text-xs
                        font-bold
                        ${
                          selected
                            ? "border-[#0C831F] bg-[#E9F8E5] text-[#0C831F]"
                            : "border-[#E5E7EB] bg-white text-[#4B5563]"
                        }
                      `}
                    >
                      <span className="block text-lg">
                        {method.icon}
                      </span>

                      <span className="mt-1 block">
                        {method.label}
                      </span>
                    </button>
                  );
                })}

              </div>

              {selectedPaymentMethod && (
                <button
                  type="button"
                  disabled={paying}
                  onClick={() =>
                    onMarkPaid(
                      order.id,
                      selectedPaymentMethod
                    )
                  }
                  className="
                    mt-3
                    w-full
                    rounded-xl
                    bg-[#0C831F]
                    px-5
                    py-3.5
                    text-sm
                    font-bold
                    text-white
                    shadow-sm
                    disabled:opacity-60
                  "
                >
                  {paying
                    ? "Saving Payment..."
                    : "✓ Done — Mark as Paid"}
                </button>
              )}

            </div>
          )}

        </div>

      </div>

      {/* ==================================================
          ACTIONS
      ================================================== */}

      <div className="border-t border-[#EEEEEE] bg-[#FAFAF9] p-5">

        <div className="flex flex-col gap-2 sm:flex-row">

          {action && (
            <button
              type="button"
              onClick={() =>
                onStatusChange(
                  order.id,
                  action.next
                )
              }
              className="
                flex-1
                rounded-xl
                bg-[#0C831F]
                px-5
                py-3.5
                text-sm
                font-bold
                text-white
                shadow-sm
              "
            >
              {status.icon}{" "}
              {action.label}
            </button>
          )}

          {order.status ===
            "pending" && (
            <button
              type="button"
              onClick={() =>
                onStatusChange(
                  order.id,
                  "rejected"
                )
              }
              className="
                rounded-xl
                border
                border-[#F1B8B8]
                bg-white
                px-5
                py-3.5
                text-sm
                font-bold
                text-[#B42318]
              "
            >
              Reject
            </button>
          )}

          {onPrintBill && (
            <button
              type="button"
              onClick={() =>
                onPrintBill(
                  order,
                  items
                )
              }
              className="
                rounded-xl
                border
                border-[#E5E7EB]
                bg-white
                px-5
                py-3.5
                text-sm
                font-bold
                text-[#1F1F1F]
              "
            >
              🧾 Bill
            </button>
          )}

        </div>

      </div>

    </article>
  );
}