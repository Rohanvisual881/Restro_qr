"use client";

import {
  useEffect,
  useLayoutEffect,
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

const statusMeta: Record<
  string,
  {
    label: string;
    bg: string;
    text: string;
    dot: string;
    icon: string;
  }
> = {
  pending: {
    label: "New Order",
    bg: "bg-[#FFF7D6]",
    text: "text-[#8A6500]",
    dot: "bg-[#F8CB45]",
    icon: "🔔",
  },
  accepted: {
    label: "Accepted",
    bg: "bg-[#EAF3FF]",
    text: "text-[#1769AA]",
    dot: "bg-[#3B82F6]",
    icon: "✓",
  },
  preparing: {
    label: "Preparing",
    bg: "bg-[#F1EAFE]",
    text: "text-[#7041C8]",
    dot: "bg-[#8B5CF6]",
    icon: "👨‍🍳",
  },
  ready: {
    label: "Ready",
    bg: "bg-[#E9F8E5]",
    text: "text-[#0C831F]",
    dot: "bg-[#54B226]",
    icon: "🍽️",
  },
  completed: {
    label: "Completed",
    bg: "bg-[#F1F2F4]",
    text: "text-[#4B5563]",
    dot: "bg-[#6B7280]",
    icon: "✓",
  },
  rejected: {
    label: "Rejected",
    bg: "bg-[#FEECEC]",
    text: "text-[#B42318]",
    dot: "bg-[#EF4444]",
    icon: "×",
  },
};

export default function Dashboard() {
  const router = useRouter();
  const supabase = createClient();

  const pageRef =
    useRef<HTMLDivElement>(null);

  const previousOrderIds =
    useRef<string[]>([]);

  // Browser audio requires a user interaction before sound can play.
  const notificationAudioRef =
    useRef<AudioContext | null>(null);

  const notificationReadyRef =
    useRef(false);

  const ordersInitializedRef =
    useRef(false);

  const [soundEnabled, setSoundEnabled] =
    useState(false);

  // New orders that are currently ringing.
  // The alarm stops only after the order is acted on.
  const [alertingOrderIds, setAlertingOrderIds] =
    useState<string[]>([]);

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

  const [payingOrder, setPayingOrder] =
    useState<string | null>(null);

  const [
    selectedPaymentMethod,
    setSelectedPaymentMethod,
  ] = useState<Record<string, string>>({});

  const [upiQrOrder, setUpiQrOrder] =
    useState<Order | null>(null);

  function enableOrderSound() {
    try {
      if (!notificationAudioRef.current) {
        notificationAudioRef.current =
          new AudioContext();
      }

      const audio =
        notificationAudioRef.current;

      if (audio.state === "suspended") {
        void audio.resume();
      }

      notificationReadyRef.current = true;
      setSoundEnabled(true);

      // If a new order is already waiting, the alarm will start
      // immediately through the alertingOrderIds effect.

      // Small silent warm-up so the browser treats the audio context as user-enabled.
      const oscillator =
        audio.createOscillator();
      const gain =
        audio.createGain();

      gain.gain.setValueAtTime(
        0.0001,
        audio.currentTime
      );

      oscillator.connect(gain);
      gain.connect(audio.destination);
      oscillator.start();
      oscillator.stop(
        audio.currentTime + 0.01
      );
    } catch (error) {
      console.error(
        "Could not enable order sound:",
        error
      );
    }
  }

  function playOrderNotification() {
    if (!notificationReadyRef.current) {
      return;
    }

    const audio =
      notificationAudioRef.current;

    if (!audio) return;

    if (audio.state === "suspended") {
      void audio.resume();
    }

    const now =
      audio.currentTime;

    // Two-note restaurant order chime.
    const notes = [
      {
        frequency: 880,
        start: 0,
        duration: 0.18,
      },
      {
        frequency: 1175,
        start: 0.14,
        duration: 0.3,
      },
    ];

    notes.forEach(
      ({
        frequency,
        start,
        duration,
      }) => {
        const oscillator =
          audio.createOscillator();

        const gain =
          audio.createGain();

        oscillator.type = "sine";

        oscillator.frequency.setValueAtTime(
          frequency,
          now + start
        );

        gain.gain.setValueAtTime(
          0.0001,
          now + start
        );

        gain.gain.exponentialRampToValueAtTime(
          0.22,
          now + start + 0.02
        );

        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          now + start + duration
        );

        oscillator.connect(gain);
        gain.connect(audio.destination);

        oscillator.start(
          now + start
        );

        oscillator.stop(
          now + start + duration
        );
      }
    );
  }

  useEffect(() => {
    return () => {
      if (
        notificationAudioRef.current
      ) {
        void notificationAudioRef.current.close();
        notificationAudioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    async function loadDashboard() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

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
        .eq("owner_id", user.id)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error(error);
      }

      setRestaurant(data);
      setLoading(false);
    }

    loadDashboard();
  }, [router, supabase]);

  useEffect(() => {
    if (!restaurant) return;

    loadOrders();

    const interval = setInterval(
      loadOrders,
      10000
    );

    return () =>
      clearInterval(interval);
  }, [restaurant]);

  /*
   * IMPORTANT:
   * Do not animate opacity on dashboard content.
   * This keeps every text/color fully visible.
   */
  useLayoutEffect(() => {
    if (loading || !pageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".dashboard-reveal",
        {
          y: 12,
        },
        {
          y: 0,
          duration: 0.3,
          stagger: 0.04,
          ease: "power2.out",
          clearProps: "transform",
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [loading]);

  useEffect(() => {
    // First successful load establishes the baseline.
    // Existing orders do NOT start an alarm.
    if (!ordersInitializedRef.current) {
      previousOrderIds.current =
        orders.map(
          (order) => order.id
        );

      ordersInitializedRef.current =
        true;

      return;
    }

    const previous = new Set(
      previousOrderIds.current
    );

    const newOrderIds =
      orders
        .filter(
          (order) =>
            order.status === "pending"
        )
        .map((order) => order.id)
        .filter(
          (id) => !previous.has(id)
        );

    if (newOrderIds.length > 0) {
      setAlertingOrderIds(
        (current) =>
          Array.from(
            new Set([
              ...current,
              ...newOrderIds,
            ])
          )
      );

      requestAnimationFrame(() => {
        newOrderIds.forEach((id) => {
          const element =
            document.querySelector(
              `[data-order-id="${id}"]`
            );

          if (!element) return;

          gsap.fromTo(
            element,
            {
              y: 16,
              scale: 0.99,
            },
            {
              y: 0,
              scale: 1,
              duration: 0.3,
              ease: "power2.out",
              clearProps:
                "transform",
            }
          );
        });
      });
    }

    // Stop ringing for orders that are no longer pending.
    setAlertingOrderIds(
      (current) =>
        current.filter((id) => {
          const order =
            orders.find(
              (item) =>
                item.id === id
            );

          return (
            order &&
            order.status ===
              "pending"
          );
        })
    );

    previousOrderIds.current =
      orders.map(
        (order) => order.id
      );
  }, [orders]);

  // Keep the alarm ringing while at least one new/pending order
  // is waiting for staff action.
  useEffect(() => {
    if (
      !soundEnabled ||
      alertingOrderIds.length === 0
    ) {
      return;
    }

    // Play immediately, then repeat until all alerting orders
    // have been accepted/rejected/otherwise acted on.
    playOrderNotification();

    const interval = window.setInterval(
      () => {
        playOrderNotification();
      },
      1400
    );

    return () =>
      window.clearInterval(
        interval
      );
  }, [
    alertingOrderIds,
    soundEnabled,
  ]);

  async function loadOrders() {
    if (!restaurant) return;

    setOrdersLoading(true);

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
      setOrdersLoading(false);
      return;
    }

    const tableIds =
      (orderData || [])
        .map(
          (order) => order.table_id
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
      } = await supabase
        .from("restaurant_tables")
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
          tableMap[table.id] =
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
      formattedOrders.length > 0
    ) {
      const orderIds =
        formattedOrders.map(
          (order) => order.id
        );

      const {
        data: itemData,
        error: itemError,
      } = await supabase
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
                      item.price ||
                        0
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
    } else {
      setOrderItems([]);
    }

    setOrdersLoading(false);
  }

  function stopOrderAlarm(
    orderId: string
  ) {
    setAlertingOrderIds(
      (current) =>
        current.filter(
          (id) => id !== orderId
        )
    );
  }

  async function updateOrderStatus(
    orderId: string,
    status: string
  ) {
    const { error } =
      await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId);

    if (error) {
      alert(error.message);
      return;
    }

    setOrders(
      (currentOrders) =>
        currentOrders.map(
          (order) =>
            order.id === orderId
              ? {
                  ...order,
                  status,
                }
              : order
        )
    );

    // Accept, reject, prepare, ready, complete, etc.
    // all count as staff action, so stop this order's alarm.
    stopOrderAlarm(orderId);
  }

  async function markOrderPaid(
    orderId: string,
    paymentMethod: string
  ) {
    setPayingOrder(
      orderId
    );

    const order =
      orders.find(
        (item) =>
          item.id ===
          orderId
      );

    if (!order) {
      setPayingOrder(null);
      return;
    }

    const paidAt =
      new Date().toISOString();

    const { error } =
      await supabase
        .from("orders")
        .update({
          payment_status:
            "paid",
          payment_method:
            paymentMethod,
          paid_at:
            paidAt,
        })
        .eq(
          "id",
          orderId
        );

    if (error) {
      alert(
        "Payment error: " +
          error.message
      );

      setPayingOrder(null);
      return;
    }

    setOrders(
      (currentOrders) =>
        currentOrders.map(
          (item) =>
            item.id ===
            orderId
              ? {
                  ...item,
                  payment_status:
                    "paid",
                  payment_method:
                    paymentMethod,
                  paid_at:
                    paidAt,
                }
              : item
        )
    );

    setPayingOrder(null);
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
      statusMeta[status]?.label ||
      status
    );
  }

  function printBill(
    order: Order
  ) {
    const items =
      getOrderItems(
        order.id
      );

    const billWindow =
      window.open(
        "",
        "_blank",
        "width=500,height=700"
      );

    if (!billWindow) {
      alert(
        "Please allow popups to print the bill."
      );
      return;
    }

    const itemRows =
      items
        .map(
          (item) => `
            <tr>
              <td>${item.item_name}</td>
              <td>${item.quantity}</td>
              <td>₹${(
                Number(
                  item.price
                ) *
                item.quantity
              ).toFixed(0)}</td>
            </tr>
          `
        )
        .join("");

    billWindow.document.write(`
      <html>
        <head>
          <title>Bill - ${
            restaurant?.name ||
            "Restaurant"
          }</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 30px;
              max-width: 500px;
              margin: auto;
            }
            h1 {
              text-align: center;
              margin-bottom: 5px;
            }
            .center {
              text-align: center;
            }
            .line {
              border-top: 1px dashed #999;
              margin: 15px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              padding: 8px 0;
              text-align: left;
            }
            th:last-child,
            td:last-child {
              text-align: right;
            }
            .total {
              font-size: 20px;
              font-weight: bold;
            }
            .paid {
              text-align: center;
              margin-top: 20px;
              font-size: 18px;
              font-weight: bold;
            }
            @media print {
              button {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <h1>${
            restaurant?.name ||
            "Restaurant"
          }</h1>
          <div class="center">
            Table ${
              order.table_number ??
              "Unknown"
            }
          </div>
          <div class="center">
            Customer: ${
              order.customer_name
            }
          </div>
          <div class="center">
            ${new Date(
              order.created_at
            ).toLocaleString()}
          </div>
          <div class="line"></div>
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
          <div class="line"></div>
          <table>
            <tr>
              <td>Subtotal</td>
              <td>₹${order.subtotal.toFixed(
                0
              )}</td>
            </tr>
            <tr>
              <td>Tax</td>
              <td>₹${order.tax.toFixed(
                0
              )}</td>
            </tr>
            <tr>
              <td>Discount</td>
              <td>₹${order.discount.toFixed(
                0
              )}</td>
            </tr>
            <tr class="total">
              <td>Total</td>
              <td>₹${order.total_amount.toFixed(
                0
              )}</td>
            </tr>
          </table>
          <div class="line"></div>
          <div class="center">
            Payment:
            ${
              order.payment_method
                ? order.payment_method.toUpperCase()
                : "UNPAID"
            }
          </div>
          ${
            order.payment_status ===
            "paid"
              ? `<div class="paid">✓ PAID</div>`
              : ""
          }
          <br />
          <button onclick="window.print()">
            Print Bill
          </button>
        </body>
      </html>
    `);

    billWindow.document.close();
    billWindow.focus();
  }

  const newOrders =
    orders.filter(
      (order) =>
        order.status ===
        "pending"
    ).length;

  const activeOrders =
    orders.filter((order) =>
      [
        "accepted",
        "preparing",
        "ready",
      ].includes(
        order.status
      )
    ).length;

  const totalSales =
    orders.reduce(
      (sum, order) =>
        sum +
        Number(
          order.total_amount ||
            0
        ),
      0
    );

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F7F5]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#DCEED8] border-t-[#0C831F]" />
          <p className="text-sm font-semibold text-[#6B7280]">
            Loading dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      ref={pageRef}
      className="min-h-screen bg-[#F7F7F5] px-4 py-4 text-[#1F1F1F] sm:px-6 sm:py-6"
    >
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <header className="dashboard-reveal overflow-hidden rounded-[22px] border border-[#E9E9E7] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)]">

          <div className="bg-[#0C831F] px-5 py-5 text-white sm:px-7">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div className="min-w-0">

                <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/80">
                  Restaurant Dashboard
                </p>

                <h1 className="mt-1 truncate text-2xl font-bold sm:text-3xl">
                  {restaurant?.name ||
                    "Welcome back"}{" "}
                  👋
                </h1>

                {restaurant && (
                  <p className="mt-1 text-sm text-white/85">
                    Manage your restaurant,
                    orders and payments.
                  </p>
                )}

              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={enableOrderSound}
                  className={`rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm ${
                    soundEnabled
                      ? "bg-[#E9F8E5] text-[#0C831F]"
                      : "bg-[#FFF7D6] text-[#8A6500]"
                  }`}
                  title={
                    soundEnabled
                      ? "Order notifications are enabled"
                      : "Click to enable order notification sound"
                  }
                >
                  {soundEnabled
                    ? alertingOrderIds.length > 0
                      ? "🔔 ORDER WAITING"
                      : "🔔 Sound On"
                    : "🔕 Enable Sound"}
                </button>

                <button
                  type="button"
                  onClick={loadOrders}
                  className="w-fit rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#0C831F] shadow-sm"
                >
                  {ordersLoading
                    ? "Refreshing..."
                    : "↻ Refresh Orders"}
                </button>
              </div>

            </div>

          </div>

          {/* NOTE:
              Navigation is provided by app/dashboard/layout.tsx.
              Do not duplicate it here.
          */}

        </header>

        {!restaurant ? (
          <section className="dashboard-reveal mt-5 rounded-[22px] border border-[#E9E9E7] bg-white p-10 text-center shadow-[0_2px_10px_rgba(0,0,0,0.03)]">

            <div className="text-5xl">
              🍽️
            </div>

            <h2 className="mt-4 text-xl font-bold text-[#1F1F1F]">
              Welcome! 👋
            </h2>

            <p className="mt-2 text-sm text-[#6B7280]">
              You haven't created your restaurant yet.
            </p>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/dashboard/setup"
                )
              }
              className="mt-6 rounded-xl bg-[#0C831F] px-6 py-3 text-sm font-bold text-white"
            >
              Create Restaurant
            </button>

          </section>
        ) : (
          <div className="mt-5">

            {/* LIVE OPERATIONS */}

            <section className="dashboard-reveal rounded-[22px] border border-[#E9E9E7] bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] sm:p-6">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-[#54B226]">
                    Live operations
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-[#1F1F1F] sm:text-2xl">
                    Today's orders
                  </h2>

                  <p className="mt-1 text-sm text-[#6B7280]">
                    New orders are checked automatically every 10 seconds.
                  </p>
                </div>

                <div className="w-fit rounded-full bg-[#E9F8E5] px-4 py-2 text-xs font-bold text-[#0C831F]">
                  • Live
                </div>

              </div>

            </section>

            {/* STATS */}

            <section className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">

              <div className="dashboard-reveal rounded-[18px] border border-[#E9E9E7] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
                <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">
                  Total Orders
                </p>
                <p className="mt-2 text-3xl font-bold text-[#1F1F1F]">
                  {orders.length}
                </p>
                <p className="mt-1 text-xs text-[#6B7280]">
                  Loaded orders
                </p>
              </div>

              <div className="dashboard-reveal rounded-[18px] border border-[#E9E9E7] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
                <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">
                  New Orders
                </p>
                <p className="mt-2 text-3xl font-bold text-[#8A6500]">
                  {newOrders}
                </p>
                <p className="mt-1 text-xs text-[#6B7280]">
                  Need attention
                </p>
              </div>

              <div className="dashboard-reveal rounded-[18px] border border-[#E9E9E7] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
                <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">
                  Active
                </p>
                <p className="mt-2 text-3xl font-bold text-[#7041C8]">
                  {activeOrders}
                </p>
                <p className="mt-1 text-xs text-[#6B7280]">
                  In progress
                </p>
              </div>

              <div className="dashboard-reveal rounded-[18px] border border-[#E9E9E7] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
                <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">
                  Sales
                </p>
                <p className="mt-2 text-3xl font-bold text-[#0C831F]">
                  ₹{totalSales.toFixed(0)}
                </p>
                <p className="mt-1 text-xs text-[#6B7280]">
                  Loaded orders
                </p>
              </div>

            </section>

            {/* ORDERS TITLE */}

            <section className="dashboard-reveal mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

              <div>
                <h2 className="text-2xl font-bold text-[#1F1F1F]">
                  Live Orders
                </h2>

                <p className="mt-1 text-sm text-[#6B7280]">
                  Accept, prepare, complete and collect payment.
                </p>
              </div>

              <span className="w-fit rounded-full bg-[#FFF7D6] px-4 py-2 text-xs font-bold text-[#8A6500]">
                {newOrders} waiting
              </span>

            </section>

            {/* ORDERS */}

            {orders.length === 0 ? (
              <section className="dashboard-reveal mt-4 rounded-[22px] border border-[#E9E9E7] bg-white p-12 text-center shadow-sm">

                <div className="text-5xl">
                  🍽️
                </div>

                <h3 className="mt-4 text-xl font-bold text-[#1F1F1F]">
                  No orders yet
                </h3>

                <p className="mt-2 text-sm text-[#6B7280]">
                  Orders from customers will appear here automatically.
                </p>

              </section>
            ) : (
              <section className="mt-4 grid gap-5 lg:grid-cols-2">

                {orders.map(
                  (order) => {
                    const items =
                      getOrderItems(
                        order.id
                      );

                    const isPaid =
                      order.payment_status ===
                      "paid";

                    const meta =
                      statusMeta[
                        order.status
                      ] ||
                      statusMeta.pending;

                    const nextAction =
                      order.status ===
                      "pending"
                        ? {
                            label: "Accept Order",
                            status: "accepted",
                          }
                        : order.status ===
                          "accepted"
                        ? {
                            label: "Start Preparing",
                            status: "preparing",
                          }
                        : order.status ===
                          "preparing"
                        ? {
                            label: "Mark Ready",
                            status: "ready",
                          }
                        : order.status ===
                          "ready"
                        ? {
                            label: "Complete Order",
                            status: "completed",
                          }
                        : null;

                    return (
                      <article
                        key={order.id}
                        data-order-id={
                          order.id
                        }
                        className="dashboard-reveal overflow-hidden rounded-[20px] border border-[#E9E9E7] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                      >

                        {/* ORDER HEADER */}

                        <div className="border-b border-[#EEEEEE] p-5">

                          <div className="flex items-start justify-between gap-4">

                            <div className="min-w-0">

                              <div className="flex items-center gap-2">

                                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9CA3AF]">
                                  Order
                                </span>

                                <span className="font-mono text-xs font-bold text-[#1F1F1F]">
                                  #
                                  {order.id
                                    .slice(
                                      0,
                                      8
                                    )
                                    .toUpperCase()}
                                </span>

                              </div>

                              <h3 className="mt-2 text-xl font-bold text-[#1F1F1F]">
                                Table{" "}
                                {order.table_number ??
                                  "Unknown"}
                              </h3>

                              <p className="mt-1 text-sm text-[#6B7280]">
                                {order.customer_name}
                                {order.customer_phone
                                  ? ` • ${order.customer_phone}`
                                  : ""}
                              </p>

                              <p className="mt-2 text-[11px] text-[#9CA3AF]">
                                {new Date(
                                  order.created_at
                                ).toLocaleString()}
                              </p>

                            </div>

                            <div className="flex shrink-0 flex-col items-end gap-2">

                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${meta.bg} ${meta.text}`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${meta.dot}`}
                                />
                                {meta.label}
                              </span>

                              <span
                                className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                                  isPaid
                                    ? "bg-[#E9F8E5] text-[#0C831F]"
                                    : "bg-[#FFF1E8] text-[#B54708]"
                                }`}
                              >
                                {isPaid
                                  ? "✓ PAID"
                                  : "UNPAID"}
                              </span>

                            </div>

                          </div>

                        </div>

                        {/* ITEMS */}

                        <div className="p-5">

                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-[#1F1F1F]">
                              Order Items
                            </h4>

                            <span className="text-xs font-semibold text-[#6B7280]">
                              {items.length}{" "}
                              {items.length === 1
                                ? "item"
                                : "items"}
                            </span>
                          </div>

                          {items.length === 0 ? (
                            <p className="mt-4 text-sm text-[#6B7280]">
                              No items found.
                            </p>
                          ) : (
                            <div className="mt-3 space-y-2">

                              {items.map(
                                (item) => (
                                  <div
                                    key={
                                      item.id
                                    }
                                    className="flex items-center justify-between rounded-xl bg-[#F7F7F5] px-3 py-3"
                                  >

                                    <div className="min-w-0">

                                      <p className="truncate text-sm font-bold text-[#1F1F1F]">
                                        {
                                          item.item_name
                                        }
                                      </p>

                                      <p className="mt-0.5 text-xs text-[#6B7280]">
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

                                    <p className="ml-4 text-sm font-bold text-[#1F1F1F]">
                                      ₹
                                      {(
                                        Number(
                                          item.price
                                        ) *
                                        item.quantity
                                      ).toFixed(
                                        0
                                      )}
                                    </p>

                                  </div>
                                )
                              )}

                            </div>
                          )}

                        </div>

                        {/* BILL */}

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
                            <span className="text-base font-bold text-[#1F1F1F]">
                              Total
                            </span>

                            <span className="text-2xl font-bold text-[#1F1F1F]">
                              ₹
                              {order.total_amount.toFixed(
                                0
                              )}
                            </span>
                          </div>

                        </div>

                        {/* PAYMENT */}

                        <div className="p-5">

                          <div className="rounded-2xl border border-[#EEEEEE] p-4">

                            <div className="flex items-center justify-between gap-3">

                              <div>
                                <p className="text-sm font-bold text-[#1F1F1F]">
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
                                  ].map(
                                    (
                                      method
                                    ) => {
                                      const selected =
                                        selectedPaymentMethod[
                                          order.id
                                        ] ===
                                        method.id;

                                      return (
                                        <button
                                          key={
                                            method.id
                                          }
                                          type="button"
                                          onClick={() => {
                                            setSelectedPaymentMethod(
                                              (
                                                current
                                              ) => ({
                                                ...current,
                                                [order.id]:
                                                  method.id,
                                              })
                                            );

                                            if (
                                              method.id ===
                                              "upi"
                                            ) {
                                              setUpiQrOrder(
                                                order
                                              );
                                            }
                                          }}
                                          className={`rounded-xl border px-2 py-3 text-xs font-bold ${
                                            selected
                                              ? "border-[#0C831F] bg-[#E9F8E5] text-[#0C831F]"
                                              : "border-[#E5E7EB] bg-white text-[#1F1F1F]"
                                          }`}
                                        >
                                          <span className="block text-lg">
                                            {
                                              method.icon
                                            }
                                          </span>
                                          <span className="mt-1 block">
                                            {
                                              method.label
                                            }
                                          </span>
                                        </button>
                                      );
                                    }
                                  )}

                                </div>

                                {selectedPaymentMethod[
                                  order.id
                                ] && (
                                  <button
                                    type="button"
                                    disabled={
                                      payingOrder ===
                                      order.id
                                    }
                                    onClick={() => {
                                      const method =
                                        selectedPaymentMethod[
                                          order.id
                                        ];

                                      markOrderPaid(
                                        order.id,
                                        method
                                      );

                                      setSelectedPaymentMethod(
                                        (
                                          current
                                        ) => {
                                          const updated =
                                            {
                                              ...current,
                                            };

                                          delete updated[
                                            order.id
                                          ];

                                          return updated;
                                        }
                                      );
                                    }}
                                    className="mt-3 w-full rounded-xl bg-[#0C831F] px-5 py-3 font-bold text-white disabled:opacity-60"
                                  >
                                    {payingOrder ===
                                    order.id
                                      ? "Saving Payment..."
                                      : selectedPaymentMethod[
                                          order.id
                                        ] ===
                                        "upi"
                                      ? "✅ Done — Mark UPI Payment as Paid"
                                      : "✅ Done — Mark as Paid"}
                                  </button>
                                )}

                              </div>
                            )}

                          </div>

                        </div>

                        {/* ACTIONS */}

                        <div className="flex flex-col gap-2 border-t border-[#EEEEEE] bg-[#FAFAF9] p-5 sm:flex-row">

                          {nextAction && (
                            <button
                              type="button"
                              onClick={() =>
                                updateOrderStatus(
                                  order.id,
                                  nextAction.status
                                )
                              }
                              className="flex-1 rounded-xl bg-[#0C831F] px-5 py-3.5 text-sm font-bold text-white"
                            >
                              {meta.icon}{" "}
                              {
                                nextAction.label
                              }
                            </button>
                          )}

                          {order.status ===
                            "pending" && (
                            <button
                              type="button"
                              onClick={() =>
                                updateOrderStatus(
                                  order.id,
                                  "rejected"
                                )
                              }
                              className="rounded-xl border border-[#F1B8B8] bg-white px-5 py-3.5 text-sm font-bold text-[#B42318]"
                            >
                              Reject
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              printBill(order)
                            }
                            className="rounded-xl border border-[#E5E7EB] bg-white px-5 py-3.5 text-sm font-bold text-[#1F1F1F]"
                          >
                            🧾 Print Bill
                          </button>

                        </div>

                      </article>
                    );
                  }
                )}

              </section>
            )}

          </div>
        )}

      </div>

      {/* UPI MODAL */}

      {upiQrOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() =>
            setUpiQrOrder(null)
          }
        >

          <div
            className="w-full max-w-sm rounded-[22px] bg-white p-6 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="flex items-start justify-between gap-4">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#54B226]">
                  UPI Payment
                </p>

                <h3 className="mt-1 text-xl font-bold text-[#1F1F1F]">
                  Customer pays
                </h3>

                <p className="mt-1 text-sm text-[#6B7280]">
                  Table{" "}
                  {upiQrOrder.table_number ??
                    "Unknown"}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setUpiQrOrder(null)
                }
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F5F5] text-xl text-[#6B7280]"
                aria-label="Close UPI QR"
              >
                ×
              </button>

            </div>

            <div className="mt-5 text-center">

              <p className="text-3xl font-bold text-[#1F1F1F]">
                ₹
                {Number(
                  upiQrOrder.total_amount ||
                    0
                ).toFixed(0)}
              </p>

              {restaurant?.upi_qr_url ? (
                <div className="mt-5 flex justify-center">
                  <div className="rounded-2xl border border-[#EEEEEE] bg-white p-3 shadow-sm">
                    <img
                      src={
                        restaurant.upi_qr_url
                      }
                      alt="Restaurant UPI QR Code"
                      className="h-64 w-64 object-contain"
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-xl border border-orange-200 bg-orange-50 p-4 text-left">
                  <p className="font-bold text-orange-800">
                    Restaurant UPI QR is not configured.
                  </p>

                  <p className="mt-1 text-sm text-orange-700">
                    Add the restaurant UPI QR image in your restaurant/payment settings first.
                  </p>
                </div>
              )}

              <p className="mt-4 text-sm text-[#6B7280]">
                Customer scans the QR and
                pays from any UPI app.
              </p>

              <button
                type="button"
                onClick={() =>
                  setUpiQrOrder(null)
                }
                className="mt-5 w-full rounded-xl bg-[#0C831F] px-5 py-3.5 font-bold text-white"
              >
                Payment Received — Continue
              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}