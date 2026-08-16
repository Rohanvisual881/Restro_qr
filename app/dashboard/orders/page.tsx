"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import gsap from "gsap";

type Restaurant = {
  id: string;
  name: string;
  slug: string;
  phone: string | null;
  address: string | null;
  upi_qr_url: string | null;
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

type OrderItem = {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  item_name: string;
  price: number;
  quantity: number;
};

type DateFilter =
  | "all"
  | "today"
  | "yesterday"
  | "7days";

const STATUS_LABELS: Record<string, string> = {
  pending: "New Order",
  accepted: "Accepted",
  preparing: "Preparing",
  ready: "Ready",
  completed: "Completed",
  rejected: "Rejected",
};

const STATUS_CLASSES: Record<string, string> = {
  pending:
    "bg-[#FFF4D6] text-[#9A6700]",
  accepted:
    "bg-[#E8F0FF] text-[#2856A6]",
  preparing:
    "bg-[#F0E9FF] text-[#7041C8]",
  ready:
    "bg-[#E5F7FB] text-[#087A8C]",
  completed:
    "bg-[#E9F8E5] text-[#0C831F]",
  rejected:
    "bg-[#FDECEC] text-[#B42318]",
};

export default function OrderHistoryPage() {
  const router = useRouter();
  const supabase = createClient();

  const pageRef =
    useRef<HTMLDivElement>(null);

  const gridRef =
    useRef<HTMLDivElement>(null);

  const [restaurant, setRestaurant] =
    useState<Restaurant | null>(null);

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [orderItems, setOrderItems] =
    useState<OrderItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [ordersLoading, setOrdersLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [paymentFilter, setPaymentFilter] =
    useState("all");

  const [dateFilter, setDateFilter] =
    useState<DateFilter>("all");

  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  const [detailOpen, setDetailOpen] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState<"success" | "error">(
      "success"
    );

  const [upiQrOrder, setUpiQrOrder] =
    useState<Order | null>(null);

  /*
  ==========================================================
  LOAD RESTAURANT
  ==========================================================
  */

  useEffect(() => {
    async function loadRestaurant() {
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const {
        data,
        error,
      } = await supabase
        .from("restaurants")
        .select(
          "id, name, slug, phone, address, upi_qr_url"
        )
        .eq(
          "owner_id",
          user.id
        )
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error(error);
        showError(error.message);
      }

      if (!data) {
        router.push(
          "/dashboard/setup"
        );
        return;
      }

      setRestaurant(data);
      setLoading(false);
    }

    loadRestaurant();
  }, [router]);

  /*
  ==========================================================
  LOAD ORDERS
  ==========================================================
  */

  useEffect(() => {
    if (!restaurant) return;

    loadOrders();

    const interval =
      setInterval(
        () => loadOrders(true),
        10000
      );

    return () =>
      clearInterval(interval);
  }, [restaurant]);

  async function loadOrders(
    silent = false
  ) {
    if (!restaurant) return;

    if (!silent) {
      setOrdersLoading(true);
    }

    const {
      data: orderData,
      error: orderError,
    } = await supabase
      .from("orders")
      .select(
        `
        id,
        table_id,
        customer_name,
        customer_phone,
        status,
        total,
        subtotal,
        tax,
        discount,
        payment_status,
        payment_method,
        paid_at,
        created_at
        `
      )
      .eq(
        "restaurant_id",
        restaurant.id
      )
      .order("created_at", {
        ascending: false,
      });

    if (orderError) {
      console.error(
        "Orders error:",
        orderError
      );
      showError(
        orderError.message
      );
      setOrdersLoading(false);
      return;
    }

    const tableIds =
      (orderData || [])
        .map(
          (order) =>
            order.table_id
        )
        .filter(Boolean);

    let tableMap: Record<
      string,
      number
    > = {};

    if (tableIds.length > 0) {
      const {
        data: tableData,
        error: tableError,
      } =
        await supabase
          .from(
            "restaurant_tables"
          )
          .select(
            "id, table_number"
          )
          .in(
            "id",
            tableIds
          );

      if (tableError) {
        console.error(
          "Table error:",
          tableError
        );
      }

      (tableData || []).forEach(
        (table) => {
          tableMap[
            table.id
          ] =
            table.table_number;
        }
      );
    }

    const formattedOrders: Order[] =
      (orderData || []).map(
        (order) => ({
          id: order.id,
          table_id:
            order.table_id,
          table_number:
            tableMap[
              order.table_id
            ] ?? null,
          customer_name:
            order.customer_name,
          customer_phone:
            order.customer_phone,
          status:
            order.status,
          total_amount:
            Number(
              order.total || 0
            ),
          subtotal:
            Number(
              order.subtotal ||
                order.total ||
                0
            ),
          tax:
            Number(
              order.tax || 0
            ),
          discount:
            Number(
              order.discount || 0
            ),
          payment_status:
            order.payment_status ||
            "unpaid",
          payment_method:
            order.payment_method ||
            null,
          paid_at:
            order.paid_at ||
            null,
          created_at:
            order.created_at,
        })
      );

    setOrders(
      formattedOrders
    );

    if (
      formattedOrders.length ===
      0
    ) {
      setOrderItems([]);
      setOrdersLoading(false);
      return;
    }

    const orderIds =
      formattedOrders.map(
        (order) => order.id
      );

    const {
      data: itemData,
      error: itemError,
    } =
      await supabase
        .from("order_items")
        .select(
          "id, order_id, menu_item_id, item_name, price, quantity"
        )
        .in(
          "order_id",
          orderIds
        );

    if (itemError) {
      console.error(
        "Order items error:",
        itemError
      );
    }

    const loadedItems =
      itemData || [];

    setOrderItems(
      loadedItems
    );

    /*
     * Keep the same safe fallback used by the
     * working dashboard: if total is 0 but
     * order_items contain prices, calculate it.
     */
    setOrders(
      (currentOrders) =>
        currentOrders.map(
          (currentOrder) => {
            const itemsForOrder =
              loadedItems.filter(
                (item) =>
                  item.order_id ===
                  currentOrder.id
              );

            const calculatedSubtotal =
              itemsForOrder.reduce(
                (
                  sum,
                  item
                ) =>
                  sum +
                  Number(
                    item.price || 0
                  ) *
                    Number(
                      item.quantity ||
                        0
                    ),
                0
              );

            if (
              currentOrder.total_amount >
                0 ||
              calculatedSubtotal <=
                0
            ) {
              return currentOrder;
            }

            const calculatedTotal =
              calculatedSubtotal +
              Number(
                currentOrder.tax ||
                  0
              ) -
              Number(
                currentOrder.discount ||
                  0
              );

            return {
              ...currentOrder,
              subtotal:
                calculatedSubtotal,
              total_amount:
                calculatedTotal,
            };
          }
        )
    );

    setOrdersLoading(false);
  }

  /*
  ==========================================================
  ANIMATIONS
  ==========================================================
  */

  useLayoutEffect(() => {
    if (
      loading ||
      !pageRef.current
    ) {
      return;
    }

    const ctx =
      gsap.context(() => {
        gsap.fromTo(
          ".history-reveal",
          {
            opacity: 0,
            y: 18,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.42,
            stagger: 0.05,
            ease: "power2.out",
          }
        );
      }, pageRef);

    return () =>
      ctx.revert();
  }, [loading]);

  useEffect(() => {
    if (
      loading ||
      !gridRef.current
    ) {
      return;
    }

    const cards =
      Array.from(
        gridRef.current.querySelectorAll(
          "[data-order-card]"
        )
      );

    gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 14,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.3,
        stagger: 0.035,
        ease: "power2.out",
      }
    );
  }, [
    loading,
    statusFilter,
    paymentFilter,
    dateFilter,
    search,
    orders.length,
  ]);

  /*
  ==========================================================
  HELPERS
  ==========================================================
  */

  function showSuccess(
    text: string
  ) {
    setMessage(text);
    setMessageType("success");

    window.setTimeout(() => {
      setMessage("");
    }, 3500);
  }

  function showError(
    text: string
  ) {
    setMessage(text);
    setMessageType("error");
  }

  function getOrderItems(
    orderId: string
  ) {
    return orderItems.filter(
      (item) =>
        item.order_id ===
        orderId
    );
  }

  function getStatusLabel(
    status: string
  ) {
    return (
      STATUS_LABELS[status] ||
      status
    );
  }

  function formatDate(
    value: string
  ) {
    return new Date(
      value
    ).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  function isSameDay(
    date: Date,
    compare: Date
  ) {
    return (
      date.getFullYear() ===
        compare.getFullYear() &&
      date.getMonth() ===
        compare.getMonth() &&
      date.getDate() ===
        compare.getDate()
    );
  }

  function matchesDateFilter(
    createdAt: string
  ) {
    if (
      dateFilter === "all"
    ) {
      return true;
    }

    const orderDate =
      new Date(createdAt);

    const now =
      new Date();

    if (
      dateFilter === "today"
    ) {
      return isSameDay(
        orderDate,
        now
      );
    }

    if (
      dateFilter ===
      "yesterday"
    ) {
      const yesterday =
        new Date(now);

      yesterday.setDate(
        yesterday.getDate() -
          1
      );

      return isSameDay(
        orderDate,
        yesterday
      );
    }

    const sevenDaysAgo =
      new Date(now);

    sevenDaysAgo.setDate(
      sevenDaysAgo.getDate() -
        7
    );

    return (
      orderDate >=
      sevenDaysAgo
    );
  }

  function getOrderTotal(
    order: Order
  ) {
    if (
      order.total_amount > 0
    ) {
      return order.total_amount;
    }

    const calculated =
      getOrderItems(
        order.id
      ).reduce(
        (sum, item) =>
          sum +
          Number(
            item.price || 0
          ) *
            Number(
              item.quantity ||
                0
            ),
        0
      );

    return (
      calculated +
      Number(
        order.tax || 0
      ) -
      Number(
        order.discount || 0
      )
    );
  }

  /*
  ==========================================================
  FILTERED ORDERS
  ==========================================================
  */

  const filteredOrders =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return orders.filter(
        (order) => {
          const matchesSearch =
            !query ||
            order.id
              .toLowerCase()
              .includes(query) ||
            order.customer_name
              .toLowerCase()
              .includes(query) ||
            String(
              order.table_number ??
                ""
            ).includes(query) ||
            (
              order.customer_phone ||
              ""
            ).includes(query);

          const matchesStatus =
            statusFilter ===
              "all" ||
            order.status ===
              statusFilter;

          const matchesPayment =
            paymentFilter ===
              "all" ||
            order.payment_status ===
              paymentFilter;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesPayment &&
            matchesDateFilter(
              order.created_at
            )
          );
        }
      );
    }, [
      orders,
      orderItems,
      search,
      statusFilter,
      paymentFilter,
      dateFilter,
    ]);

  /*
  ==========================================================
  STATS
  ==========================================================
  */

  const totalOrders =
    orders.length;

  const completedOrders =
    orders.filter(
      (order) =>
        order.status ===
        "completed"
    ).length;

  const rejectedOrders =
    orders.filter(
      (order) =>
        order.status ===
        "rejected"
    ).length;

  const paidOrders =
    orders.filter(
      (order) =>
        order.payment_status ===
        "paid"
    ).length;

  const historicalSales =
    orders
      .filter(
        (order) =>
          order.status ===
          "completed"
      )
      .reduce(
        (sum, order) =>
          sum +
          getOrderTotal(
            order
          ),
        0
      );

  /*
  ==========================================================
  STATUS UPDATE
  ==========================================================
  */

  async function updateOrderStatus(
    orderId: string,
    status: string
  ) {
    const { error } =
      await supabase
        .from("orders")
        .update({
          status,
        })
        .eq(
          "id",
          orderId
        );

    if (error) {
      showError(
        error.message
      );
      return;
    }

    setOrders(
      (currentOrders) =>
        currentOrders.map(
          (order) =>
            order.id ===
            orderId
              ? {
                  ...order,
                  status,
                }
              : order
        )
    );

    if (
      selectedOrder?.id ===
      orderId
    ) {
      setSelectedOrder(
        (current) =>
          current
            ? {
                ...current,
                status,
              }
            : null
      );
    }

    showSuccess(
      `Order marked ${getStatusLabel(
        status
      )}.`
    );
  }

  /*
  ==========================================================
  PAYMENT
  ==========================================================
  */

  async function markOrderPaid(
    orderId: string,
    paymentMethod: string
  ) {
    const { error } =
      await supabase
        .from("orders")
        .update({
          payment_status:
            "paid",
          payment_method:
            paymentMethod,
          paid_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          orderId
        );

    if (error) {
      showError(
        "Payment error: " +
          error.message
      );
      return;
    }

    setOrders(
      (currentOrders) =>
        currentOrders.map(
          (order) =>
            order.id ===
            orderId
              ? {
                  ...order,
                  payment_status:
                    "paid",
                  payment_method:
                    paymentMethod,
                  paid_at:
                    new Date().toISOString(),
                }
              : order
        )
    );

    if (
      selectedOrder?.id ===
      orderId
    ) {
      setSelectedOrder(
        (current) =>
          current
            ? {
                ...current,
                payment_status:
                  "paid",
                payment_method:
                  paymentMethod,
                paid_at:
                  new Date().toISOString(),
              }
            : null
      );
    }

    showSuccess(
      `Payment marked ${paymentMethod.toUpperCase()}.`
    );
  }

  /*
  ==========================================================
  PRINT BILL
  ==========================================================
  */

  function printBill(
    order: Order
  ) {
    const items =
      getOrderItems(
        order.id
      );

    const total =
      getOrderTotal(
        order
      );

    const printWindow =
      window.open(
        "",
        "_blank",
        "width=700,height=850"
      );

    if (!printWindow) {
      showError(
        "Please allow popups to print the bill."
      );
      return;
    }

    const itemRows =
      items
        .map(
          (item) => `
            <tr>
              <td>${escapeHtml(
                item.item_name
              )}</td>
              <td>${item.quantity}</td>
              <td>₹${(
                Number(
                  item.price
                ) *
                Number(
                  item.quantity
                )
              ).toFixed(2)}</td>
            </tr>
          `
        )
        .join("");

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Bill ${order.id.slice(
            0,
            8
          )}</title>
          <style>
            * { box-sizing: border-box; }
            body {
              margin: 0;
              padding: 28px;
              font-family: Arial, sans-serif;
              color: #1f1f1f;
              background: #fff;
            }
            .bill {
              max-width: 620px;
              margin: 0 auto;
            }
            .brand {
              color: #0c831f;
              font-size: 13px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: .12em;
            }
            h1 {
              margin: 8px 0;
              font-size: 28px;
            }
            .meta {
              color: #6b7280;
              font-size: 13px;
              line-height: 1.6;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 24px;
            }
            th, td {
              padding: 10px 0;
              border-bottom: 1px solid #eee;
              text-align: left;
              font-size: 13px;
            }
            th:last-child,
            td:last-child {
              text-align: right;
            }
            .total {
              display: flex;
              justify-content: space-between;
              margin-top: 18px;
              font-size: 20px;
              font-weight: 800;
            }
            .paid {
              margin-top: 16px;
              color: #0c831f;
              font-weight: 800;
            }
            .footer {
              margin-top: 32px;
              text-align: center;
              color: #9ca3af;
              font-size: 11px;
            }
          </style>
        </head>
        <body>
          <div class="bill">
            <div class="brand">
              ${escapeHtml(
                restaurant?.name ||
                  "Restaurant"
              )}
            </div>
            <h1>Order Bill</h1>
            <div class="meta">
              Order ID: ${escapeHtml(
                order.id
              )}<br>
              Table: ${
                order.table_number ??
                "Unknown"
              }<br>
              Customer: ${escapeHtml(
                order.customer_name
              )}<br>
              ${
                order.customer_phone
                  ? `Phone: ${escapeHtml(
                      order.customer_phone
                    )}<br>`
                  : ""
              }
              Date: ${escapeHtml(
                formatDate(
                  order.created_at
                )
              )}
            </div>

            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemRows}
              </tbody>
            </table>

            <div class="total">
              <span>Total</span>
              <span>₹${total.toFixed(
                2
              )}</span>
            </div>

            ${
              order.payment_status ===
              "paid"
                ? `<div class="paid">
                    PAID • ${
                      order.payment_method ||
                      "Payment"
                    }
                  </div>`
                : `<div class="meta" style="margin-top:16px">
                    Payment: Unpaid
                  </div>`
            }

            <div class="footer">
              Thank you for dining with us.
            </div>
          </div>

          <script>
            window.onload = function () {
              window.print();
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  }

  function escapeHtml(
    value: string
  ) {
    return value
      .replace(
        /&/g,
        "&amp;"
      )
      .replace(
        /</g,
        "&lt;"
      )
      .replace(
        />/g,
        "&gt;"
      )
      .replace(
        /"/g,
        "&quot;"
      )
      .replace(
        /'/g,
        "&#039;"
      );
  }

  /*
  ==========================================================
  OPEN DETAILS
  ==========================================================
  */

  function openDetails(
    order: Order
  ) {
    setSelectedOrder(
      order
    );
    setDetailOpen(true);

    requestAnimationFrame(() => {
      gsap.fromTo(
        ".order-detail-panel",
        {
          opacity: 0,
          y: 20,
          scale: 0.98,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.25,
          ease: "power2.out",
        }
      );
    });
  }

  /*
  ==========================================================
  LOADING
  ==========================================================
  */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F7F5]">
        <div className="w-full max-w-5xl px-5">
          <div className="space-y-4">
            <div className="h-28 animate-pulse rounded-[22px] bg-white" />
            <div className="grid gap-4 sm:grid-cols-4">
              {Array.from({
                length: 4,
              }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="h-24 animate-pulse rounded-[18px] bg-white"
                  />
                )
              )}
            </div>
            <div className="h-64 animate-pulse rounded-[22px] bg-white" />
          </div>
        </div>
      </main>
    );
  }

  /*
  ==========================================================
  PAGE
  ==========================================================
  */

  return (
    <main
      ref={pageRef}
      className="min-h-screen bg-[#F7F7F5] text-[#1F1F1F]"
    >
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6">

        {/* HEADER */}

        <header className="history-reveal overflow-hidden rounded-[22px] border border-[#E9E9E7] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)]">

          <div className="bg-[#0C831F] px-5 py-5 text-white sm:px-7">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">
                  Restaurant Admin
                </p>

                <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                  Order History
                </h1>

                <p className="mt-1 text-sm text-white/75">
                  Search, review and manage every customer order.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  loadOrders()
                }
                className="w-fit rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#0C831F]"
              >
                {ordersLoading
                  ? "Refreshing..."
                  : "↻ Refresh"}
              </button>

            </div>

          </div>

          <nav className="flex flex-wrap gap-2 border-t border-[#EEEEEE] p-4">

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/dashboard"
                )
              }
              className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-bold"
            >
              📊 Dashboard
            </button>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/dashboard/menu"
                )
              }
              className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-bold"
            >
              🍽️ Menu
            </button>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/dashboard/tables"
                )
              }
              className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-bold"
            >
              🪑 Tables & QR
            </button>

            <button
              type="button"
              className="rounded-xl bg-[#0C831F] px-4 py-2.5 text-sm font-bold text-white"
            >
              📜 Order History
            </button>

          </nav>

        </header>

        {/* MESSAGE */}

        {message && (
          <div
            className={`history-reveal mt-4 rounded-2xl border px-4 py-3 text-sm font-semibold ${
              messageType ===
              "success"
                ? "border-[#CDE8C5] bg-[#E9F8E5] text-[#0C831F]"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* STATS */}

        <section className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">

          <div className="history-reveal rounded-[18px] border border-[#E9E9E7] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
            <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">
              Total Orders
            </p>
            <p className="mt-2 text-3xl font-bold">
              {totalOrders}
            </p>
            <p className="mt-1 text-xs text-[#6B7280]">
              All recorded orders
            </p>
          </div>

          <div className="history-reveal rounded-[18px] border border-[#E9E9E7] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
            <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">
              Completed
            </p>
            <p className="mt-2 text-3xl font-bold text-[#0C831F]">
              {completedOrders}
            </p>
            <p className="mt-1 text-xs text-[#6B7280]">
              Successfully served
            </p>
          </div>

          <div className="history-reveal rounded-[18px] border border-[#E9E9E7] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
            <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">
              Paid
            </p>
            <p className="mt-2 text-3xl font-bold text-[#7041C8]">
              {paidOrders}
            </p>
            <p className="mt-1 text-xs text-[#6B7280]">
              Payment received
            </p>
          </div>

          <div className="history-reveal rounded-[18px] border border-[#E9E9E7] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
            <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">
              Completed Sales
            </p>
            <p className="mt-2 text-3xl font-bold text-[#0C831F]">
              ₹
              {historicalSales.toFixed(
                0
              )}
            </p>
            <p className="mt-1 text-xs text-[#6B7280]">
              From completed orders
            </p>
          </div>

        </section>

        {/* FILTERS */}

        <section className="history-reveal mt-5 rounded-[22px] border border-[#E9E9E7] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)] sm:p-5">

          <div className="flex flex-col gap-4">

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <h2 className="text-xl font-bold">
                  All Orders
                </h2>

                <p className="mt-1 text-sm text-[#6B7280]">
                  Showing{" "}
                  {
                    filteredOrders.length
                  }{" "}
                  of{" "}
                  {orders.length}
                </p>
              </div>

              <input
                type="search"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search order, customer, phone or table..."
                className="w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAF9] px-4 py-3 text-sm outline-none focus:border-[#0C831F] lg:w-[360px]"
              />

            </div>

            <div className="grid gap-2 sm:grid-cols-3">

              <select
                value={
                  dateFilter
                }
                onChange={(e) =>
                  setDateFilter(
                    e.target.value as DateFilter
                  )
                }
                className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-[#0C831F]"
              >
                <option value="all">
                  All Dates
                </option>
                <option value="today">
                  Today
                </option>
                <option value="yesterday">
                  Yesterday
                </option>
                <option value="7days">
                  Last 7 Days
                </option>
              </select>

              <select
                value={
                  statusFilter
                }
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
                className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-[#0C831F]"
              >
                <option value="all">
                  All Statuses
                </option>
                <option value="pending">
                  New Order
                </option>
                <option value="accepted">
                  Accepted
                </option>
                <option value="preparing">
                  Preparing
                </option>
                <option value="ready">
                  Ready
                </option>
                <option value="completed">
                  Completed
                </option>
                <option value="rejected">
                  Rejected
                </option>
              </select>

              <select
                value={
                  paymentFilter
                }
                onChange={(e) =>
                  setPaymentFilter(
                    e.target.value
                  )
                }
                className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-[#0C831F]"
              >
                <option value="all">
                  All Payments
                </option>
                <option value="paid">
                  Paid
                </option>
                <option value="unpaid">
                  Unpaid
                </option>
              </select>

            </div>

            <div className="flex flex-wrap gap-2">

              {[
                [
                  "all",
                  `All ${orders.length}`,
                ],
                [
                  "completed",
                  `Completed ${completedOrders}`,
                ],
                [
                  "rejected",
                  `Rejected ${rejectedOrders}`,
                ],
                [
                  "paid",
                  `Paid ${paidOrders}`,
                ],
              ].map(
                ([key, label]) => {
                  const isPayment =
                    key ===
                    "paid";

                  const active =
                    isPayment
                      ? paymentFilter ===
                        "paid"
                      : key ===
                        "all"
                      ? statusFilter ===
                        "all"
                      : statusFilter ===
                        key;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        if (
                          isPayment
                        ) {
                          setPaymentFilter(
                            "paid"
                          );
                          return;
                        }

                        setStatusFilter(
                          key
                        );
                      }}
                      className={`rounded-full px-4 py-2 text-xs font-bold ${
                        active
                          ? "bg-[#0C831F] text-white"
                          : "border border-[#E5E7EB] bg-white text-[#6B7280]"
                      }`}
                    >
                      {label}
                    </button>
                  );
                }
              )}

            </div>

          </div>

        </section>

        {/* ORDER LIST */}

        <section
          ref={gridRef}
          className="mt-5"
        >

          {filteredOrders.length ===
          0 ? (
            <div className="history-reveal rounded-[22px] border border-[#E9E9E7] bg-white p-12 text-center shadow-sm">

              <div className="text-5xl">
                {orders.length ===
                0
                  ? "📜"
                  : "🔎"}
              </div>

              <h3 className="mt-4 text-xl font-bold">
                {orders.length ===
                0
                  ? "No orders yet"
                  : "No matching orders"}
              </h3>

              <p className="mt-2 text-sm text-[#6B7280]">
                {orders.length ===
                0
                  ? "Customer orders will appear here."
                  : "Change your filters or search."}
              </p>

            </div>
          ) : (
            <div className="space-y-4">

              {filteredOrders.map(
                (order) => {
                  const items =
                    getOrderItems(
                      order.id
                    );

                  const total =
                    getOrderTotal(
                      order
                    );

                  const statusClass =
                    STATUS_CLASSES[
                      order.status
                    ] ||
                    "bg-gray-100 text-gray-700";

                  return (
                    <article
                      key={
                        order.id
                      }
                      data-order-card
                      className="group overflow-hidden rounded-[22px] border border-[#E9E9E7] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
                    >

                      <div className="p-5 sm:p-6">

                        {/* HEADER */}

                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                          <div className="min-w-0">

                            <div className="flex flex-wrap items-center gap-2">

                              <span className="text-xl font-bold">
                                Table{" "}
                                {order.table_number ??
                                  "Unknown"}
                              </span>

                              <span
                                className={`rounded-full px-3 py-1 text-[10px] font-bold ${statusClass}`}
                              >
                                {
                                  getStatusLabel(
                                    order.status
                                  )
                                }
                              </span>

                              <span
                                className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                                  order.payment_status ===
                                  "paid"
                                    ? "bg-[#E9F8E5] text-[#0C831F]"
                                    : "bg-[#FFF4D6] text-[#9A6700]"
                                }`}
                              >
                                {order.payment_status ===
                                "paid"
                                  ? "✓ PAID"
                                  : "UNPAID"}
                              </span>

                            </div>

                            <p className="mt-2 text-sm font-semibold text-[#4B5563]">
                              {order.customer_name}
                            </p>

                            {order.customer_phone && (
                              <p className="mt-1 text-xs text-[#6B7280]">
                                {
                                  order.customer_phone
                                }
                              </p>
                            )}

                            <p className="mt-2 text-xs text-[#9CA3AF]">
                              {formatDate(
                                order.created_at
                              )}
                            </p>

                          </div>

                          <div className="flex items-center justify-between gap-4 lg:justify-end">

                            <div className="text-left lg:text-right">

                              <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">
                                Total
                              </p>

                              <p className="mt-1 text-2xl font-bold">
                                ₹
                                {total.toFixed(
                                  0
                                )}
                              </p>

                              {order.payment_method && (
                                <p className="mt-1 text-xs font-semibold text-[#6B7280]">
                                  via{" "}
                                  {order.payment_method.toUpperCase()}
                                </p>
                              )}

                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                openDetails(
                                  order
                                )
                              }
                              className="rounded-xl bg-[#0C831F] px-4 py-2.5 text-xs font-bold text-white"
                            >
                              View Details
                            </button>

                          </div>

                        </div>

                        {/* ITEMS */}

                        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">

                          {items
                            .slice(
                              0,
                              6
                            )
                            .map(
                              (
                                item
                              ) => (
                                <div
                                  key={
                                    item.id
                                  }
                                  className="flex items-center justify-between rounded-xl bg-[#F7F7F5] px-3 py-2.5"
                                >
                                  <div className="min-w-0 pr-3">

                                    <p className="truncate text-sm font-semibold">
                                      {
                                        item.item_name
                                      }
                                    </p>

                                    <p className="text-xs text-[#6B7280]">
                                      ₹
                                      {Number(
                                        item.price
                                      ).toFixed(
                                        0
                                      )}{" "}
                                      ×{" "}
                                      {
                                        item.quantity
                                      }
                                    </p>

                                  </div>

                                  <span className="shrink-0 text-sm font-bold">
                                    ₹
                                    {(
                                      Number(
                                        item.price
                                      ) *
                                      Number(
                                        item.quantity
                                      )
                                    ).toFixed(
                                      0
                                    )}
                                  </span>

                                </div>
                              )
                            )}

                        </div>

                        {items.length >
                          6 && (
                          <p className="mt-2 text-xs text-[#9CA3AF]">
                            +{" "}
                            {items.length -
                              6}{" "}
                            more items
                          </p>
                        )}

                        {/* ACTIONS */}

                        <div className="mt-5 flex flex-wrap gap-2 border-t border-[#EEEEEE] pt-4">

                          <button
                            type="button"
                            onClick={() =>
                              printBill(
                                order
                              )
                            }
                            className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-xs font-bold"
                          >
                            🖨 Print Bill
                          </button>

                          {order.payment_status !==
                            "paid" && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  markOrderPaid(
                                    order.id,
                                    "cash"
                                  )
                                }
                                className="rounded-xl border border-[#D9EAD5] bg-[#F4FBF2] px-4 py-2.5 text-xs font-bold text-[#0C831F]"
                              >
                                💵 Cash Paid
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  setUpiQrOrder(
                                    order
                                  )
                                }
                                className="rounded-xl border border-purple-200 bg-purple-50 px-4 py-2.5 text-xs font-bold text-purple-700"
                              >
                                📱 UPI
                              </button>
                            </>
                          )}

                          {order.status !==
                            "completed" &&
                            order.status !==
                              "rejected" && (
                            <button
                              type="button"
                              onClick={() =>
                                updateOrderStatus(
                                  order.id,
                                  "completed"
                                )
                              }
                              className="rounded-xl bg-[#0C831F] px-4 py-2.5 text-xs font-bold text-white"
                            >
                              ✓ Complete
                            </button>
                          )}

                        </div>

                      </div>

                    </article>
                  );
                }
              )}

            </div>
          )}

        </section>

      </div>

      {/* ==================================================
          ORDER DETAIL MODAL
      ================================================== */}

      {detailOpen &&
        selectedOrder && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                setDetailOpen(
                  false
                );
              }
            }}
          >

            <div className="order-detail-panel max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[26px] bg-white shadow-2xl">

              <div className="sticky top-0 z-10 bg-[#0C831F] p-5 text-white">

                <div className="flex items-start justify-between gap-4">

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-white/70">
                      Order Details
                    </p>

                    <h2 className="mt-1 text-2xl font-bold">
                      Table{" "}
                      {
                        selectedOrder.table_number ??
                        "Unknown"
                      }
                    </h2>

                    <p className="mt-1 text-xs text-white/75">
                      {
                        selectedOrder.id
                      }
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setDetailOpen(
                        false
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-xl"
                  >
                    ×
                  </button>

                </div>

              </div>

              <div className="space-y-5 p-5 sm:p-6">

                {/* CUSTOMER */}

                <div className="rounded-2xl bg-[#F7F7F5] p-4">

                  <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">
                    Customer
                  </p>

                  <p className="mt-2 font-bold">
                    {
                      selectedOrder.customer_name
                    }
                  </p>

                  {selectedOrder.customer_phone && (
                    <p className="mt-1 text-sm text-[#6B7280]">
                      {
                        selectedOrder.customer_phone
                      }
                    </p>
                  )}

                  <p className="mt-1 text-xs text-[#9CA3AF]">
                    {formatDate(
                      selectedOrder.created_at
                    )}
                  </p>

                </div>

                {/* ITEMS */}

                <div>

                  <h3 className="text-lg font-bold">
                    Items
                  </h3>

                  <div className="mt-3 space-y-2">

                    {getOrderItems(
                      selectedOrder.id
                    ).map(
                      (item) => (
                        <div
                          key={
                            item.id
                          }
                          className="flex items-center justify-between rounded-xl border border-[#EEEEEE] px-4 py-3"
                        >

                          <div>
                            <p className="font-semibold">
                              {
                                item.item_name
                              }
                            </p>

                            <p className="mt-1 text-xs text-[#6B7280]">
                              ₹
                              {Number(
                                item.price
                              ).toFixed(
                                0
                              )}{" "}
                              ×{" "}
                              {
                                item.quantity
                              }
                            </p>
                          </div>

                          <p className="font-bold">
                            ₹
                            {(
                              Number(
                                item.price
                              ) *
                              Number(
                                item.quantity
                              )
                            ).toFixed(
                              0
                            )}
                          </p>

                        </div>
                      )
                    )}

                  </div>

                </div>

                {/* TOTAL */}

                <div className="rounded-2xl bg-[#F7F7F5] p-4">

                  <div className="flex justify-between text-sm">
                    <span className="text-[#6B7280]">
                      Subtotal
                    </span>
                    <span className="font-semibold">
                      ₹
                      {Number(
                        selectedOrder.subtotal
                      ).toFixed(
                        0
                      )}
                    </span>
                  </div>

                  {Number(
                    selectedOrder.tax
                  ) > 0 && (
                    <div className="mt-2 flex justify-between text-sm">
                      <span className="text-[#6B7280]">
                        Tax
                      </span>
                      <span className="font-semibold">
                        ₹
                        {Number(
                          selectedOrder.tax
                        ).toFixed(
                          0
                        )}
                      </span>
                    </div>
                  )}

                  {Number(
                    selectedOrder.discount
                  ) > 0 && (
                    <div className="mt-2 flex justify-between text-sm">
                      <span className="text-[#6B7280]">
                        Discount
                      </span>
                      <span className="font-semibold text-[#0C831F]">
                        -₹
                        {Number(
                          selectedOrder.discount
                        ).toFixed(
                          0
                        )}
                      </span>
                    </div>
                  )}

                  <div className="mt-4 flex justify-between border-t border-[#DDDDD8] pt-4">

                    <span className="font-bold">
                      Total
                    </span>

                    <span className="text-xl font-bold">
                      ₹
                      {getOrderTotal(
                        selectedOrder
                      ).toFixed(
                        0
                      )}
                    </span>

                  </div>

                </div>

                {/* PAYMENT */}

                <div className="rounded-2xl border border-[#EEEEEE] p-4">

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">
                        Payment
                      </p>

                      <p className="mt-1 font-bold">
                        {selectedOrder.payment_status ===
                        "paid"
                          ? `Paid via ${
                              selectedOrder.payment_method ||
                              "payment"
                            }`
                          : "Payment pending"}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                        selectedOrder.payment_status ===
                        "paid"
                          ? "bg-[#E9F8E5] text-[#0C831F]"
                          : "bg-[#FFF4D6] text-[#9A6700]"
                      }`}
                    >
                      {selectedOrder.payment_status ===
                      "paid"
                        ? "PAID"
                        : "UNPAID"}
                    </span>

                  </div>

                  {selectedOrder.payment_status !==
                    "paid" && (
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">

                      <button
                        type="button"
                        onClick={() =>
                          markOrderPaid(
                            selectedOrder.id,
                            "cash"
                          )
                        }
                        className="rounded-xl bg-[#0C831F] px-4 py-3 text-sm font-bold text-white"
                      >
                        💵 Mark Cash Paid
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setUpiQrOrder(
                            selectedOrder
                          )
                        }
                        className="rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 text-sm font-bold text-purple-700"
                      >
                        📱 Show UPI QR
                      </button>

                    </div>
                  )}

                </div>

                {/* STATUS */}

                <div>

                  <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">
                    Order Status
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">

                    {[
                      "accepted",
                      "preparing",
                      "ready",
                      "completed",
                    ].map(
                      (status) => (
                        <button
                          key={
                            status
                          }
                          type="button"
                          onClick={() =>
                            updateOrderStatus(
                              selectedOrder.id,
                              status
                            )
                          }
                          className={`rounded-xl px-3 py-2 text-xs font-bold ${
                            selectedOrder.status ===
                            status
                              ? "bg-[#0C831F] text-white"
                              : "border border-[#E5E7EB] bg-white"
                          }`}
                        >
                          {getStatusLabel(
                            status
                          )}
                        </button>
                      )
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        updateOrderStatus(
                          selectedOrder.id,
                          "rejected"
                        )
                      }
                      className={`rounded-xl px-3 py-2 text-xs font-bold ${
                        selectedOrder.status ===
                        "rejected"
                          ? "bg-[#B42318] text-white"
                          : "border border-red-200 bg-red-50 text-[#B42318]"
                      }`}
                    >
                      Reject
                    </button>

                  </div>

                </div>

                {/* FOOTER ACTIONS */}

                <div className="grid gap-2 sm:grid-cols-2">

                  <button
                    type="button"
                    onClick={() =>
                      printBill(
                        selectedOrder
                      )
                    }
                    className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-bold"
                  >
                    🖨 Print Bill
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setDetailOpen(
                        false
                      )
                    }
                    className="rounded-xl bg-[#0C831F] px-4 py-3 text-sm font-bold text-white"
                  >
                    Done
                  </button>

                </div>

              </div>

            </div>

          </div>
        )}

      {/* ==================================================
          UPI MODAL
      ================================================== */}

      {upiQrOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">

          <div className="w-full max-w-md overflow-hidden rounded-[26px] bg-white shadow-2xl">

            <div className="bg-[#0C831F] p-5 text-white">

              <div className="flex items-start justify-between gap-4">

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-white/70">
                    UPI Payment
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    Collect ₹
                    {getOrderTotal(
                      upiQrOrder
                    ).toFixed(
                      0
                    )}
                  </h2>

                  <p className="mt-1 text-sm text-white/75">
                    Table{" "}
                    {
                      upiQrOrder.table_number ??
                      "Unknown"
                    }
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setUpiQrOrder(
                      null
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-xl"
                >
                  ×
                </button>

              </div>

            </div>

            <div className="p-6">

              {restaurant?.upi_qr_url ? (
                <img
                  src={
                    restaurant.upi_qr_url
                  }
                  alt="Restaurant UPI QR"
                  className="mx-auto aspect-square w-full max-w-[310px] rounded-2xl border border-[#EEEEEE] object-contain p-3"
                />
              ) : (
                <div className="rounded-2xl border border-dashed border-[#D9D9D6] bg-[#F7F7F5] p-8 text-center">

                  <div className="text-5xl">
                    📱
                  </div>

                  <h3 className="mt-3 font-bold">
                    UPI QR not configured
                  </h3>

                  <p className="mt-2 text-sm text-[#6B7280]">
                    Add your restaurant UPI QR in the restaurant settings before collecting UPI payments.
                  </p>

                </div>
              )}

              <div className="mt-5 rounded-2xl bg-[#F7F7F5] p-4 text-center">

                <p className="text-xs text-[#6B7280]">
                  Ask the customer to scan and pay
                </p>

                <p className="mt-1 text-2xl font-bold">
                  ₹
                  {getOrderTotal(
                    upiQrOrder
                  ).toFixed(
                    0
                  )}
                </p>

              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">

                <button
                  type="button"
                  onClick={() => {
                    markOrderPaid(
                      upiQrOrder.id,
                      "upi"
                    );
                    setUpiQrOrder(
                      null
                    );
                  }}
                  className="rounded-xl bg-[#0C831F] px-4 py-3 text-sm font-bold text-white"
                >
                  ✓ Mark UPI Paid
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setUpiQrOrder(
                      null
                    )
                  }
                  className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-bold"
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}