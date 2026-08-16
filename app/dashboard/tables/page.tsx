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
};

type RestaurantTable = {
  id: string;
  restaurant_id: string;
  table_number: number;
  qr_token: string;
  is_active: boolean;
  created_at?: string;
};

type TableOrder = {
  id: string;
  table_id: string;
  status: string;
  total_amount: number;
  customer_name: string;
  created_at: string;
};

const ACTIVE_ORDER_STATUSES = [
  "pending",
  "accepted",
  "preparing",
  "ready",
];

export default function TablesPage() {
  const router = useRouter();
  const supabase = createClient();

  const pageRef =
    useRef<HTMLDivElement>(null);

  const gridRef =
    useRef<HTMLDivElement>(null);

  const [restaurant, setRestaurant] =
    useState<Restaurant | null>(null);

  const [tables, setTables] =
    useState<RestaurantTable[]>([]);

  const [orders, setOrders] =
    useState<TableOrder[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [tableNumber, setTableNumber] =
    useState("");

  const [capacity, setCapacity] =
    useState("4");

  const [addOpen, setAddOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [activeFilter, setActiveFilter] =
    useState<
      "all" | "active" | "inactive" | "occupied"
    >("all");

  const [selectedTable, setSelectedTable] =
    useState<RestaurantTable | null>(
      null
    );

  const [qrOpen, setQrOpen] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState<"success" | "error">(
      "success"
    );

  const [origin, setOrigin] =
    useState("");

  /*
  ==========================================================
  LOAD
  ==========================================================
  */

  useEffect(() => {
    setOrigin(
      window.location.origin
    );

    loadTables();
  }, []);

  async function loadTables(
    silent = false
  ) {
    if (!silent) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const {
      data: restaurantData,
      error: restaurantError,
    } = await supabase
      .from("restaurants")
      .select(
        "id, name, slug"
      )
      .eq("owner_id", user.id)
      .limit(1)
      .maybeSingle();

    if (restaurantError) {
      showError(
        restaurantError.message
      );
      setLoading(false);
      setRefreshing(false);
      return;
    }

    if (!restaurantData) {
      router.push(
        "/dashboard/setup"
      );
      return;
    }

    setRestaurant(
      restaurantData
    );

    const {
      data: tableData,
      error: tableError,
    } = await supabase
      .from("restaurant_tables")
      .select(
        "id, restaurant_id, table_number, qr_token, is_active, created_at"
      )
      .eq(
        "restaurant_id",
        restaurantData.id
      )
      .order("table_number", {
        ascending: true,
      });

    if (tableError) {
      showError(
        tableError.message
      );
      setLoading(false);
      setRefreshing(false);
      return;
    }

    setTables(tableData || []);

    /*
     * Active orders are used only for the
     * table dashboard/occupied indicator.
     */
    const {
      data: orderData,
      error: orderError,
    } = await supabase
      .from("orders")
      .select(
        "id, table_id, status, total_amount, customer_name, created_at"
      )
      .eq(
        "restaurant_id",
        restaurantData.id
      )
      .in(
        "status",
        ACTIVE_ORDER_STATUSES
      )
      .order("created_at", {
        ascending: false,
      });

    if (orderError) {
      console.error(
        "Table orders:",
        orderError
      );
    }

    setOrders(
      orderData || []
    );

    setLoading(false);
    setRefreshing(false);
  }

  /*
  ==========================================================
  ENTRANCE ANIMATION
  ==========================================================
  */

  useLayoutEffect(() => {
    if (
      loading ||
      !pageRef.current
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".table-reveal",
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

  /*
  ==========================================================
  GRID ANIMATION
  ==========================================================
  */

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
          "[data-table-card]"
        )
      );

    gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 14,
        scale: 0.985,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.32,
        stagger: 0.035,
        ease: "power2.out",
      }
    );
  }, [
    loading,
    activeFilter,
    search,
    tables.length,
  ]);

  /*
  ==========================================================
  MESSAGE
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

  /*
  ==========================================================
  QR TOKEN
  ==========================================================
  */

  function createQrToken() {
    if (
      typeof crypto !==
        "undefined" &&
      "randomUUID" in crypto
    ) {
      return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 12)}`;
  }

  /*
  ==========================================================
  ADD TABLE
  ==========================================================
  */

  async function addTable(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!restaurant) {
      return;
    }

    const number =
      Number(tableNumber);

    if (
      !Number.isInteger(number) ||
      number <= 0
    ) {
      showError(
        "Enter a valid table number."
      );
      return;
    }

    const exists =
      tables.some(
        (table) =>
          table.table_number ===
            number &&
          table.is_active
      );

    if (exists) {
      showError(
        `Table ${number} already exists.`
      );
      return;
    }

    setSaving(true);

    const {
      data,
      error,
    } = await supabase
      .from(
        "restaurant_tables"
      )
      .insert({
        restaurant_id:
          restaurant.id,
        table_number:
          number,
        qr_token:
          createQrToken(),
        is_active: true,
      })
      .select(
        "id, restaurant_id, table_number, qr_token, is_active, created_at"
      )
      .single();

    if (error) {
      showError(
        error.message
      );
      setSaving(false);
      return;
    }

    setTables(
      (current) =>
        [
          ...current,
          data,
        ].sort(
          (a, b) =>
            a.table_number -
            b.table_number
        )
    );

    setTableNumber("");
    setCapacity("4");
    setAddOpen(false);
    setSaving(false);

    showSuccess(
      `Table ${number} created successfully.`
    );

    requestAnimationFrame(() => {
      const element =
        document.querySelector(
          `[data-table-card="${data.id}"]`
        );

      if (element) {
        gsap.fromTo(
          element,
          {
            opacity: 0,
            scale: 0.92,
            y: 18,
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.45,
            ease: "back.out(1.3)",
          }
        );
      }
    });
  }

  /*
  ==========================================================
  TOGGLE TABLE
  ==========================================================
  */

  async function toggleTable(
    table: RestaurantTable
  ) {
    const next =
      !table.is_active;

    setTables(
      (current) =>
        current.map(
          (item) =>
            item.id === table.id
              ? {
                  ...item,
                  is_active:
                    next,
                }
              : item
        )
    );

    const { error } =
      await supabase
        .from(
          "restaurant_tables"
        )
        .update({
          is_active: next,
        })
        .eq(
          "id",
          table.id
        );

    if (error) {
      setTables(
        (current) =>
          current.map(
            (item) =>
              item.id ===
              table.id
                ? {
                    ...item,
                    is_active:
                      !next,
                  }
                : item
          )
      );

      showError(
        error.message
      );
      return;
    }

    showSuccess(
      next
        ? `Table ${table.table_number} activated.`
        : `Table ${table.table_number} disabled.`
    );
  }

  /*
  ==========================================================
  QR URL
  ==========================================================
  */

  function getCustomerUrl(
    table: RestaurantTable
  ) {
    const base =
      origin ||
      window.location.origin;

    return `${base}/menu/${table.qr_token}/browse`;
  }

  function getQrImageUrl(
    table: RestaurantTable,
    size = 600
  ) {
    const customerUrl =
      getCustomerUrl(table);

    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=12&data=${encodeURIComponent(
      customerUrl
    )}`;
  }

  /*
  ==========================================================
  COPY LINK
  ==========================================================
  */

  async function copyCustomerLink(
    table: RestaurantTable
  ) {
    try {
      await navigator.clipboard.writeText(
        getCustomerUrl(table)
      );

      showSuccess(
        `Table ${table.table_number} ordering link copied.`
      );
    } catch {
      showError(
        "Could not copy the link."
      );
    }
  }

  /*
  ==========================================================
  PRINT QR
  ==========================================================
  */

  function printQr(
    table: RestaurantTable
  ) {
    const qrUrl =
      getQrImageUrl(
        table,
        800
      );

    const customerUrl =
      getCustomerUrl(table);

    const printWindow =
      window.open(
        "",
        "_blank",
        "width=650,height=800"
      );

    if (!printWindow) {
      showError(
        "Please allow popups to print the QR."
      );
      return;
    }

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Table ${table.table_number} QR</title>
          <style>
            * { box-sizing: border-box; }
            body {
              margin: 0;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #f7f7f5;
              font-family: Arial, sans-serif;
            }
            .card {
              width: 520px;
              padding: 42px;
              background: white;
              border-radius: 28px;
              text-align: center;
              box-shadow: 0 10px 35px rgba(0,0,0,.08);
            }
            .brand {
              color: #0c831f;
              font-size: 14px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: .14em;
            }
            h1 {
              margin: 10px 0 5px;
              font-size: 34px;
            }
            p {
              color: #6b7280;
              line-height: 1.5;
            }
            img {
              width: 330px;
              height: 330px;
              object-fit: contain;
              margin: 24px auto;
              display: block;
            }
            .scan {
              font-size: 18px;
              font-weight: 800;
            }
            .url {
              margin-top: 16px;
              padding: 12px;
              background: #f7f7f5;
              border-radius: 12px;
              word-break: break-all;
              font-size: 11px;
              color: #6b7280;
            }
            .footer {
              margin-top: 24px;
              color: #0c831f;
              font-weight: 800;
            }
            @media print {
              body {
                background: white;
              }
              .card {
                box-shadow: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="brand">
              ${restaurant?.name || "Restaurant"}
            </div>
            <h1>Table ${table.table_number}</h1>
            <p>Scan the QR code to view the menu and place your order.</p>
            <img src="${qrUrl}" alt="Table ${table.table_number} QR Code" />
            <div class="scan">📱 Scan to Order</div>
            <div class="url">${customerUrl}</div>
            <div class="footer">Thank you!</div>
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

  /*
  ==========================================================
  DOWNLOAD QR
  ==========================================================
  */

  function downloadQr(
    table: RestaurantTable
  ) {
    const qrUrl =
      getQrImageUrl(
        table,
        1200
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = qrUrl;
    link.target = "_blank";
    link.rel = "noopener";

    /*
     * The QR endpoint may not send a
     * downloadable content disposition.
     * Opening it is the reliable fallback.
     */
    link.click();

    showSuccess(
      "QR image opened. Save it from your browser."
    );
  }

  /*
  ==========================================================
  OCCUPIED ORDER DATA
  ==========================================================
  */

  function getTableOrders(
    tableId: string
  ) {
    return orders.filter(
      (order) =>
        order.table_id ===
        tableId
    );
  }

  function getTableTotal(
    tableId: string
  ) {
    return getTableOrders(
      tableId
    ).reduce(
      (sum, order) =>
        sum +
        Number(
          order.total_amount ||
            0
        ),
      0
    );
  }

  /*
  ==========================================================
  FILTER
  ==========================================================
  */

  const filteredTables =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return tables.filter(
        (table) => {
          const matchesSearch =
            !query ||
            String(
              table.table_number
            ).includes(query);

          const occupied =
            getTableOrders(
              table.id
            ).length > 0;

          const matchesFilter =
            activeFilter ===
              "all" ||
            (activeFilter ===
              "active" &&
              table.is_active) ||
            (activeFilter ===
              "inactive" &&
              !table.is_active) ||
            (activeFilter ===
              "occupied" &&
              occupied);

          return (
            matchesSearch &&
            matchesFilter
          );
        }
      );
    }, [
      tables,
      orders,
      search,
      activeFilter,
    ]);

  const activeTables =
    tables.filter(
      (table) =>
        table.is_active
    ).length;

  const occupiedTables =
    tables.filter(
      (table) =>
        getTableOrders(
          table.id
        ).length > 0
    ).length;

  const inactiveTables =
    tables.length -
    activeTables;

  const totalLiveSales =
    orders.reduce(
      (sum, order) =>
        sum +
        Number(
          order.total_amount ||
            0
        ),
      0
    );

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

        <header className="table-reveal overflow-hidden rounded-[22px] border border-[#E9E9E7] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)]">

          <div className="bg-[#0C831F] px-5 py-5 text-white sm:px-7">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">
                  Restaurant Admin
                </p>

                <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                  Tables & QR
                </h1>

                <p className="mt-1 text-sm text-white/75">
                  Manage tables and customer ordering QR codes.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">

                <button
                  type="button"
                  onClick={() =>
                    loadTables(true)
                  }
                  className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#0C831F]"
                >
                  {refreshing
                    ? "Refreshing..."
                    : "↻ Refresh"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setAddOpen(
                      !addOpen
                    )
                  }
                  className="rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-bold text-white"
                >
                  ＋ Add Table
                </button>

              </div>

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
              className="rounded-xl bg-[#0C831F] px-4 py-2.5 text-sm font-bold text-white"
            >
              🪑 Tables & QR
            </button>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/dashboard/orders"
                )
              }
              className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-bold"
            >
              📜 Order History
            </button>

          </nav>

        </header>

        {/* MESSAGE */}

        {message && (
          <div
            className={`table-reveal mt-4 rounded-2xl border px-4 py-3 text-sm font-semibold ${
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

          <div className="table-reveal rounded-[18px] border border-[#E9E9E7] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
            <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">
              Total Tables
            </p>
            <p className="mt-2 text-3xl font-bold">
              {tables.length}
            </p>
            <p className="mt-1 text-xs text-[#6B7280]">
              Created tables
            </p>
          </div>

          <div className="table-reveal rounded-[18px] border border-[#E9E9E7] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
            <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">
              Active
            </p>
            <p className="mt-2 text-3xl font-bold text-[#0C831F]">
              {activeTables}
            </p>
            <p className="mt-1 text-xs text-[#6B7280]">
              QR ordering enabled
            </p>
          </div>

          <div className="table-reveal rounded-[18px] border border-[#E9E9E7] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
            <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">
              Occupied
            </p>
            <p className="mt-2 text-3xl font-bold text-[#7041C8]">
              {occupiedTables}
            </p>
            <p className="mt-1 text-xs text-[#6B7280]">
              Tables with live orders
            </p>
          </div>

          <div className="table-reveal rounded-[18px] border border-[#E9E9E7] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
            <p className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">
              Live Order Value
            </p>
            <p className="mt-2 text-3xl font-bold text-[#0C831F]">
              ₹
              {totalLiveSales.toFixed(
                0
              )}
            </p>
            <p className="mt-1 text-xs text-[#6B7280]">
              Active orders
            </p>
          </div>

        </section>

        {/* ADD TABLE */}

        {addOpen && (
          <section className="table-reveal mt-5 rounded-[22px] border border-[#CDE8C5] bg-white p-5 shadow-[0_8px_25px_rgba(12,131,31,0.07)] sm:p-6">

            <div className="flex items-start justify-between gap-4">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#54B226]">
                  New table
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Create Table
                </h2>

                <p className="mt-1 text-sm text-[#6B7280]">
                  A unique customer ordering QR will be created automatically.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setAddOpen(
                    false
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F5F5] text-xl text-[#6B7280]"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={addTable}
              className="mt-5 grid gap-4 sm:grid-cols-[1fr_1fr_auto]"
            >

              <div>
                <label className="text-sm font-bold">
                  Table Number
                </label>

                <input
                  autoFocus
                  type="number"
                  min="1"
                  step="1"
                  value={
                    tableNumber
                  }
                  onChange={(e) =>
                    setTableNumber(
                      e.target.value
                    )
                  }
                  placeholder="1"
                  className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 outline-none focus:border-[#0C831F] focus:ring-2 focus:ring-[#0C831F]/10"
                />
              </div>

              <div>
                <label className="text-sm font-bold">
                  Capacity
                </label>

                <select
                  value={capacity}
                  onChange={(e) =>
                    setCapacity(
                      e.target.value
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 outline-none focus:border-[#0C831F] focus:ring-2 focus:ring-[#0C831F]/10"
                >
                  <option value="2">
                    2 seats
                  </option>
                  <option value="4">
                    4 seats
                  </option>
                  <option value="6">
                    6 seats
                  </option>
                  <option value="8">
                    8 seats
                  </option>
                  <option value="10">
                    10 seats
                  </option>
                  <option value="12">
                    12 seats
                  </option>
                </select>

                <p className="mt-1 text-[11px] text-[#9CA3AF]">
                  Display-only for now; your current table schema does not expose a capacity field.
                </p>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={
                    saving
                  }
                  className="w-full rounded-xl bg-[#0C831F] px-5 py-3.5 text-sm font-bold text-white disabled:opacity-50 sm:w-auto"
                >
                  {saving
                    ? "Creating..."
                    : "Create Table"}
                </button>
              </div>

            </form>

          </section>
        )}

        {/* TOOLBAR */}

        <section className="table-reveal mt-5 rounded-[22px] border border-[#E9E9E7] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)] sm:p-5">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h2 className="text-xl font-bold">
                Your Tables
              </h2>

              <p className="mt-1 text-sm text-[#6B7280]">
                Manage QR ordering and live table activity.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">

              <input
                type="search"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search table..."
                className="rounded-xl border border-[#E5E7EB] bg-[#FAFAF9] px-4 py-2.5 text-sm outline-none focus:border-[#0C831F] sm:w-56"
              />

              <div className="flex gap-1 rounded-xl bg-[#F7F7F5] p-1">

                {[
                  [
                    "all",
                    `All ${tables.length}`,
                  ],
                  [
                    "active",
                    `Active ${activeTables}`,
                  ],
                  [
                    "occupied",
                    `Busy ${occupiedTables}`,
                  ],
                  [
                    "inactive",
                    `Off ${inactiveTables}`,
                  ],
                ].map(
                  (item) => (
                    <button
                      key={
                        item[0]
                      }
                      type="button"
                      onClick={() =>
                        setActiveFilter(
                          item[0] as
                            | "all"
                            | "active"
                            | "inactive"
                            | "occupied"
                        )
                      }
                      className={`rounded-lg px-3 py-2 text-xs font-bold ${
                        activeFilter ===
                        item[0]
                          ? "bg-white text-[#0C831F] shadow-sm"
                          : "text-[#6B7280]"
                      }`}
                    >
                      {item[1]}
                    </button>
                  )
                )}

              </div>

            </div>

          </div>

        </section>

        {/* TABLE GRID */}

        <section
          ref={gridRef}
          className="mt-5"
        >

          {filteredTables.length ===
          0 ? (
            <div className="table-reveal rounded-[22px] border border-[#E9E9E7] bg-white p-12 text-center shadow-sm">

              <div className="text-5xl">
                {tables.length ===
                0
                  ? "🪑"
                  : "🔎"}
              </div>

              <h3 className="mt-4 text-xl font-bold">
                {tables.length ===
                0
                  ? "No tables yet"
                  : "No matching tables"}
              </h3>

              <p className="mt-2 text-sm text-[#6B7280]">
                {tables.length ===
                0
                  ? "Create your first table to generate its ordering QR."
                  : "Try another search or filter."}
              </p>

              {tables.length ===
                0 && (
                <button
                  type="button"
                  onClick={() =>
                    setAddOpen(
                      true
                    )
                  }
                  className="mt-5 rounded-xl bg-[#0C831F] px-5 py-3 text-sm font-bold text-white"
                >
                  ＋ Create First Table
                </button>
              )}

            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {filteredTables.map(
                (table) => {
                  const tableOrders =
                    getTableOrders(
                      table.id
                    );

                  const occupied =
                    tableOrders.length >
                    0;

                  const total =
                    getTableTotal(
                      table.id
                    );

                  return (
                    <article
                      key={
                        table.id
                      }
                      data-table-card={
                        table.id
                      }
                      className="group overflow-hidden rounded-[22px] border border-[#E9E9E7] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
                    >

                      {/* TOP */}

                      <div className="relative overflow-hidden bg-[#F4FBF2] p-5">

                        <div className="flex items-start justify-between gap-3">

                          <div>

                            <p className="text-xs font-bold uppercase tracking-wider text-[#54B226]">
                              Dining Table
                            </p>

                            <h3 className="mt-1 text-3xl font-bold">
                              {table.table_number}
                            </h3>

                          </div>

                          <span
                            className={`rounded-full px-3 py-1.5 text-[10px] font-bold ${
                              !table.is_active
                                ? "bg-white text-[#B42318]"
                                : occupied
                                ? "bg-purple-100 text-purple-700"
                                : "bg-[#E9F8E5] text-[#0C831F]"
                            }`}
                          >
                            {!table.is_active
                              ? "OFF"
                              : occupied
                              ? "OCCUPIED"
                              : "AVAILABLE"}
                          </span>

                        </div>

                        <div className="mt-5 flex items-center justify-between">

                          <div>
                            <p className="text-xs text-[#6B7280]">
                              Live orders
                            </p>
                            <p className="mt-1 text-lg font-bold">
                              {
                                tableOrders.length
                              }
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-xs text-[#6B7280]">
                              Live value
                            </p>
                            <p className="mt-1 text-lg font-bold text-[#0C831F]">
                              ₹
                              {total.toFixed(
                                0
                              )}
                            </p>
                          </div>

                        </div>

                      </div>

                      {/* QR */}

                      <div className="p-4">

                        <div className="overflow-hidden rounded-2xl border border-[#EEEEEE] bg-white p-3">

                          <img
                            src={getQrImageUrl(
                              table,
                              500
                            )}
                            alt={`QR code for table ${table.table_number}`}
                            className={`mx-auto aspect-square w-full max-w-[210px] object-contain ${
                              !table.is_active
                                ? "opacity-35 grayscale"
                                : ""
                            }`}
                          />

                        </div>

                        <p className="mt-3 text-center text-xs font-semibold text-[#6B7280]">
                          Scan to open menu
                        </p>

                      </div>

                      {/* ACTIONS */}

                      <div className="space-y-2 border-t border-[#EEEEEE] bg-[#FAFAF9] p-4">

                        <div className="grid grid-cols-2 gap-2">

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTable(
                                table
                              );
                              setQrOpen(
                                true
                              );
                            }}
                            className="rounded-xl bg-[#0C831F] px-3 py-2.5 text-xs font-bold text-white"
                          >
                            View QR
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              printQr(
                                table
                              )
                            }
                            className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-xs font-bold"
                          >
                            🖨 Print
                          </button>

                        </div>

                        <div className="grid grid-cols-2 gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              copyCustomerLink(
                                table
                              )
                            }
                            className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-xs font-bold"
                          >
                            🔗 Copy Link
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              toggleTable(
                                table
                              )
                            }
                            className={`rounded-xl px-3 py-2.5 text-xs font-bold ${
                              table.is_active
                                ? "border border-red-200 bg-white text-[#B42318]"
                                : "bg-[#0C831F] text-white"
                            }`}
                          >
                            {table.is_active
                              ? "Disable"
                              : "Activate"}
                          </button>

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
          QR MODAL
      ================================================== */}

      {qrOpen &&
        selectedTable && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

            <div className="w-full max-w-md overflow-hidden rounded-[26px] bg-white shadow-2xl">

              <div className="bg-[#0C831F] p-5 text-white">

                <div className="flex items-start justify-between gap-4">

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-white/70">
                      Customer Ordering QR
                    </p>

                    <h2 className="mt-1 text-2xl font-bold">
                      Table{" "}
                      {
                        selectedTable.table_number
                      }
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setQrOpen(
                        false
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-xl"
                  >
                    ×
                  </button>

                </div>

              </div>

              <div className="p-6">

                <div className="rounded-2xl border border-[#EEEEEE] bg-white p-4">

                  <img
                    src={getQrImageUrl(
                      selectedTable,
                      900
                    )}
                    alt={`Table ${selectedTable.table_number} QR code`}
                    className="mx-auto aspect-square w-full max-w-[310px] object-contain"
                  />

                </div>

                <div className="mt-4 rounded-xl bg-[#F7F7F5] p-3">

                  <p className="text-[11px] font-bold uppercase tracking-wide text-[#9CA3AF]">
                    Customer Link
                  </p>

                  <p className="mt-1 break-all text-xs text-[#4B5563]">
                    {getCustomerUrl(
                      selectedTable
                    )}
                  </p>

                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      printQr(
                        selectedTable
                      )
                    }
                    className="rounded-xl bg-[#0C831F] px-3 py-3 text-xs font-bold text-white"
                  >
                    🖨 Print
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      copyCustomerLink(
                        selectedTable
                      )
                    }
                    className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-3 text-xs font-bold"
                  >
                    🔗 Copy
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      downloadQr(
                        selectedTable
                      )
                    }
                    className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-3 text-xs font-bold"
                  >
                    ↗ Open
                  </button>

                </div>

                <p className="mt-4 text-center text-xs text-[#6B7280]">
                  Customers scan this QR to open the restaurant menu and place orders for this table.
                </p>

              </div>

            </div>

          </div>
        )}

    </main>
  );
}