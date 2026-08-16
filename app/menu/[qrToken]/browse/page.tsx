"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";
import gsap from "gsap";
import ProductCard from "@/components/ui/ProductCard";

type Category = {
  id: string;
  name: string;
};

type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string;
  is_available: boolean;
  image_url: string | null;
};

type Restaurant = {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
};

type CartItem = MenuItem & {
  quantity: number;
};

type CustomerData = {
  name: string;
  phone: string;
  tableId: string;
  tableNumber: number;
  restaurantId: string;
};

type CurrentOrder = {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
};

const STATUS_STEPS = [
  {
    number: 1,
    label: "Order Received",
    text: "We've received your order",
    icon: "🧾",
  },
  {
    number: 2,
    label: "Accepted",
    text: "Restaurant accepted your order",
    icon: "✓",
  },
  {
    number: 3,
    label: "Preparing",
    text: "Your food is being prepared",
    icon: "👨‍🍳",
  },
  {
    number: 4,
    label: "Ready",
    text: "Your order is ready",
    icon: "🍽️",
  },
  {
    number: 5,
    label: "Completed",
    text: "Enjoy your meal!",
    icon: "🎉",
  },
];

function getStatusStep(status: string) {
  switch (status) {
    case "pending":
      return 1;
    case "accepted":
      return 2;
    case "preparing":
      return 3;
    case "ready":
      return 4;
    case "completed":
      return 5;
    default:
      return 0;
  }
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: "Order Received",
    accepted: "Accepted",
    preparing: "Preparing",
    ready: "Ready",
    completed: "Completed",
    rejected: "Rejected",
  };

  return labels[status] || status;
}

function getStatusTone(status: string) {
  switch (status) {
    case "pending":
      return "bg-[#FFF4D6] text-[#9A6700]";
    case "accepted":
      return "bg-[#E8F0FF] text-[#2856A6]";
    case "preparing":
      return "bg-[#F0E9FF] text-[#7041C8]";
    case "ready":
      return "bg-[#E5F7FB] text-[#087A8C]";
    case "completed":
      return "bg-[#E9F8E5] text-[#0C831F]";
    case "rejected":
      return "bg-[#FDECEC] text-[#B42318]";
    default:
      return "bg-[#F3F4F6] text-[#6B7280]";
  }
}

export default function BrowseMenu({
  params,
}: {
  params: Promise<{ qrToken: string }>;
}) {
  const pageRef = useRef<HTMLDivElement>(null);
  const menuGridRef =
    useRef<HTMLDivElement>(null);

  const [restaurant, setRestaurant] =
    useState<Restaurant | null>(null);

  const [tableNumber, setTableNumber] =
    useState<number | null>(null);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [items, setItems] =
    useState<MenuItem[]>([]);

  const [cart, setCart] =
    useState<CartItem[]>([]);

  const [orders, setOrders] =
    useState<CurrentOrder[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [activeCategory, setActiveCategory] =
    useState("all");

  const [cartOpen, setCartOpen] =
    useState(false);

  const [trackingOpen, setTrackingOpen] =
    useState(false);

  const [selectedOrderId, setSelectedOrderId] =
    useState<string | null>(null);

  const [placingOrder, setPlacingOrder] =
    useState(false);

  const [orderMessage, setOrderMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [menuRefreshing, setMenuRefreshing] =
    useState(false);

  /*
  ==========================================================
  LOAD MENU
  ==========================================================
  */

  useEffect(() => {
    async function loadMenu() {
      try {
        const { qrToken } =
          await params;

        const supabase =
          createClient();

        const {
          data: table,
          error: tableError,
        } = await supabase
          .from("restaurant_tables")
          .select(
            "id, restaurant_id, table_number"
          )
          .eq(
            "qr_token",
            qrToken
          )
          .eq(
            "is_active",
            true
          )
          .maybeSingle();

        if (tableError) {
          setError(
            tableError.message
          );
          setLoading(false);
          return;
        }

        if (!table) {
          setError(
            "Table not found."
          );
          setLoading(false);
          return;
        }

        setTableNumber(
          table.table_number
        );

        const existingCustomer =
          sessionStorage.getItem(
            "restaurant_customer"
          );

        if (existingCustomer) {
          try {
            const customer:
              CustomerData =
              JSON.parse(
                existingCustomer
              );

            sessionStorage.setItem(
              "restaurant_customer",
              JSON.stringify({
                ...customer,
                tableId:
                  table.id,
                tableNumber:
                  table.table_number,
                restaurantId:
                  table.restaurant_id,
              })
            );
          } catch {
            // Keep the current session intact.
          }
        }

        const {
          data: restaurantData,
          error: restaurantError,
        } = await supabase
          .from("restaurants")
          .select(
            "id, name, description, logo_url"
          )
          .eq(
            "id",
            table.restaurant_id
          )
          .maybeSingle();

        if (restaurantError) {
          setError(
            restaurantError.message
          );
          setLoading(false);
          return;
        }

        if (!restaurantData) {
          setError(
            "Restaurant not found."
          );
          setLoading(false);
          return;
        }

        setRestaurant(
          restaurantData
        );

        const {
          data: categoryData,
          error: categoryError,
        } = await supabase
          .from("categories")
          .select(
            "id, name"
          )
          .eq(
            "restaurant_id",
            table.restaurant_id
          )
          .order("name");

        if (categoryError) {
          setError(
            categoryError.message
          );
          setLoading(false);
          return;
        }

        setCategories(
          categoryData || []
        );

        const {
          data: menuData,
          error: menuError,
        } = await supabase
          .from("menu_items")
          .select(
            "id, name, description, price, category_id, is_available, image_url"
          )
          .eq(
            "restaurant_id",
            table.restaurant_id
          )
          .eq(
            "is_available",
            true
          )
          .order("name");

        if (menuError) {
          setError(
            menuError.message
          );
          setLoading(false);
          return;
        }

        setItems(
          menuData || []
        );

        loadSavedOrders();

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(
          "Unable to load menu."
        );
        setLoading(false);
      }
    }

    loadMenu();
  }, [params]);

  /*
  ==========================================================
  SAVED ORDERS
  ==========================================================
  */

  function loadSavedOrders() {
    const saved =
      sessionStorage.getItem(
        "restaurant_orders"
      );

    if (!saved) {
      return;
    }

    try {
      const parsed =
        JSON.parse(saved);

      if (
        Array.isArray(parsed)
      ) {
        setOrders(
          parsed.filter(
            (order) =>
              order &&
              order.id
          )
        );
      }
    } catch {
      sessionStorage.removeItem(
        "restaurant_orders"
      );
    }
  }

  /*
  ==========================================================
  LIVE ORDER TRACKING
  ==========================================================
  */

  useEffect(() => {
    if (
      orders.length === 0
    ) {
      return;
    }

    let cancelled = false;

    async function checkOrders() {
      const supabase =
        createClient();

      const orderIds =
        orders.map(
          (order) =>
            order.id
        );

      if (
        orderIds.length === 0
      ) {
        return;
      }

      const {
        data,
        error: trackingError,
      } = await supabase
        .from("orders")
        .select(
          "id, status, total_amount, created_at"
        )
        .in(
          "id",
          orderIds
        );

      if (
        trackingError ||
        !data ||
        cancelled
      ) {
        return;
      }

      const latest =
        new Map(
          data.map(
            (order) => [
              order.id,
              {
                id: order.id,
                status:
                  order.status,
                total_amount:
                  Number(
                    order.total_amount ||
                      0
                  ),
                created_at:
                  order.created_at,
              },
            ]
          )
        );

      setOrders(
        (current) => {
          const updated =
            current.map(
              (saved) =>
                latest.get(
                  saved.id
                ) || saved
            );

          sessionStorage.setItem(
            "restaurant_orders",
            JSON.stringify(
              updated
            )
          );

          return updated;
        }
      );
    }

    checkOrders();

    const interval =
      window.setInterval(
        checkOrders,
        5000
      );

    return () => {
      cancelled = true;
      window.clearInterval(
        interval
      );
    };
  }, [orders.length]);

  /*
  ==========================================================
  PAGE ANIMATION
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
          ".customer-reveal",
          {
            opacity: 0,
            y: 16,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.42,
            stagger: 0.045,
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
      !menuGridRef.current
    ) {
      return;
    }

    const cards =
      Array.from(
        menuGridRef.current.querySelectorAll(
          ".product-card"
        )
      );

    gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 16,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.32,
        stagger: 0.035,
        ease: "power2.out",
      }
    );
  }, [
    loading,
    activeCategory,
    search,
    items.length,
  ]);

  /*
  ==========================================================
  CART
  ==========================================================
  */

  function updateCartQuantity(
    itemId: string,
    quantity: number
  ) {
    setCart(
      (current) => {
        if (
          quantity <= 0
        ) {
          return current.filter(
            (item) =>
              item.id !==
              itemId
          );
        }

        const exists =
          current.some(
            (item) =>
              item.id ===
              itemId
          );

        if (!exists) {
          const menuItem =
            items.find(
              (item) =>
                item.id ===
                itemId
            );

          if (!menuItem) {
            return current;
          }

          return [
            ...current,
            {
              ...menuItem,
              quantity,
            },
          ];
        }

        return current.map(
          (item) =>
            item.id === itemId
              ? {
                  ...item,
                  quantity,
                }
              : item
        );
      }
    );
  }

  function getCartQuantity(
    itemId: string
  ) {
    return (
      cart.find(
        (item) =>
          item.id === itemId
      )?.quantity || 0
    );
  }

  function addToCart(
    item: MenuItem
  ) {
    setOrderMessage("");
    setSuccessMessage("");

    const next =
      getCartQuantity(
        item.id
      ) + 1;

    updateCartQuantity(
      item.id,
      next
    );

    const cartButton =
      document.querySelector(
        "[data-cart-button]"
      );

    if (cartButton) {
      gsap.fromTo(
        cartButton,
        {
          scale: 0.96,
        },
        {
          scale: 1,
          duration: 0.2,
          ease: "back.out(3)",
        }
      );
    }
  }

  function increaseQuantity(
    itemId: string
  ) {
    updateCartQuantity(
      itemId,
      getCartQuantity(
        itemId
      ) + 1
    );
  }

  function decreaseQuantity(
    itemId: string
  ) {
    updateCartQuantity(
      itemId,
      getCartQuantity(
        itemId
      ) - 1
    );
  }

  const cartCount =
    cart.reduce(
      (sum, item) =>
        sum + item.quantity,
      0
    );

  const cartTotal =
    cart.reduce(
      (sum, item) =>
        sum +
        Number(item.price) *
          item.quantity,
      0
    );

  /*
  ==========================================================
  FILTER
  ==========================================================
  */

  const filteredItems =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return items.filter(
        (item) => {
          const categoryMatch =
            activeCategory ===
              "all" ||
            item.category_id ===
              activeCategory;

          const searchMatch =
            !query ||
            item.name
              .toLowerCase()
              .includes(query) ||
            (
              item.description ||
              ""
            )
              .toLowerCase()
              .includes(query);

          return (
            categoryMatch &&
            searchMatch
          );
        }
      );
    }, [
      items,
      search,
      activeCategory,
    ]);

  /*
  ==========================================================
  PLACE ORDER
  ==========================================================
  */

  async function placeOrder() {
    if (
      cart.length === 0
    ) {
      setOrderMessage(
        "Your cart is empty."
      );
      return;
    }

    setPlacingOrder(true);
    setOrderMessage("");
    setSuccessMessage("");

    try {
      const customerData =
        sessionStorage.getItem(
          "restaurant_customer"
        );

      if (!customerData) {
        setOrderMessage(
          "Customer information not found. Please scan the QR again."
        );
        setPlacingOrder(false);
        return;
      }

      const customer:
        CustomerData =
        JSON.parse(
          customerData
        );

      if (
        !customer.restaurantId ||
        !customer.tableId
      ) {
        setOrderMessage(
          "Restaurant or table information is missing."
        );
        setPlacingOrder(false);
        return;
      }

      const supabase =
        createClient();

      const {
        data: order,
        error: orderError,
      } = await supabase
        .from("orders")
        .insert({
          restaurant_id:
            customer.restaurantId,
          table_id:
            customer.tableId,
          customer_name:
            customer.name,
          customer_phone:
            customer.phone ||
            null,
          status:
            "pending",
          total_amount:
            cartTotal,
        })
        .select(
          "id, status, total_amount, created_at"
        )
        .single();

      if (
        orderError ||
        !order
      ) {
        setOrderMessage(
          orderError?.message ||
            "Unable to create the order."
        );
        setPlacingOrder(false);
        return;
      }

      const orderItems =
        cart.map(
          (item) => ({
            order_id:
              order.id,
            menu_item_id:
              item.id,
            item_name:
              item.name,
            price:
              Number(
                item.price
              ),
            quantity:
              item.quantity,
          })
        );

      const {
        error:
          orderItemsError,
      } = await supabase
        .from("order_items")
        .insert(
          orderItems
        );

      if (
        orderItemsError
      ) {
        setOrderMessage(
          orderItemsError.message
        );
        setPlacingOrder(false);
        return;
      }

      const newOrder:
        CurrentOrder = {
        id: order.id,
        status:
          order.status,
        total_amount:
          Number(
            order.total_amount ||
              cartTotal
          ),
        created_at:
          order.created_at,
      };

      setOrders(
        (current) => {
          const updated = [
            ...current,
            newOrder,
          ];

          sessionStorage.setItem(
            "restaurant_orders",
            JSON.stringify(
              updated
            )
          );

          return updated;
        }
      );

      setSelectedOrderId(
        newOrder.id
      );

      setCart([]);
      setCartOpen(false);
      setTrackingOpen(true);

      setSuccessMessage(
        "Order placed successfully! 🎉"
      );

      window.setTimeout(
        () =>
          setSuccessMessage(
            ""
          ),
        4000
      );
    } catch (err) {
      console.error(err);

      setOrderMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong while placing the order."
      );
    }

    setPlacingOrder(false);
  }

  /*
  ==========================================================
  ORDER HELPERS
  ==========================================================
  */

  const selectedOrder =
    orders.find(
      (order) =>
        order.id ===
        selectedOrderId
    ) ||
    orders[
      orders.length - 1
    ] ||
    null;

  const activeOrders =
    orders.filter(
      (order) =>
        ![
          "completed",
          "rejected",
        ].includes(
          order.status
        )
    );

  function openTracking(
    orderId?: string
  ) {
    setSelectedOrderId(
      orderId ||
        selectedOrderId ||
        orders[
          orders.length - 1
        ]?.id ||
        null
    );
    setTrackingOpen(
      true
    );

    requestAnimationFrame(() => {
      gsap.fromTo(
        ".tracking-panel",
        {
          opacity: 0,
          y: 24,
          scale: 0.98,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.28,
          ease: "power2.out",
        }
      );
    });
  }

  function closeTracking() {
    gsap.to(
      ".tracking-panel",
      {
        opacity: 0,
        y: 18,
        duration: 0.16,
        ease: "power1.in",
        onComplete: () =>
          setTrackingOpen(
            false
          ),
      }
    );
  }

  /*
  ==========================================================
  LOADING
  ==========================================================
  */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F7F7F5] px-4 py-5">
        <div className="mx-auto max-w-5xl space-y-4">
          <div className="h-20 animate-pulse rounded-[22px] bg-white" />
          <div className="h-14 animate-pulse rounded-2xl bg-white" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({
              length: 8,
            }).map(
              (_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-[18px] bg-white"
                >
                  <div className="aspect-square animate-pulse bg-[#ECEDEA]" />
                  <div className="space-y-2 p-3">
                    <div className="h-4 animate-pulse rounded bg-[#ECEDEA]" />
                    <div className="h-3 w-2/3 animate-pulse rounded bg-[#ECEDEA]" />
                    <div className="h-4 w-1/3 animate-pulse rounded bg-[#ECEDEA]" />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </main>
    );
  }

  /*
  ==========================================================
  ERROR
  ==========================================================
  */

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F7F5] p-5">
        <div className="w-full max-w-md rounded-[26px] border border-[#E9E9E7] bg-white p-7 text-center shadow-[0_12px_35px_rgba(0,0,0,0.07)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-3xl">
            ⚠️
          </div>

          <h1 className="mt-5 text-xl font-bold">
            Menu unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#6B7280]">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="mt-5 rounded-xl bg-[#0C831F] px-5 py-3 text-sm font-bold text-white"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  /*
  ==========================================================
  MAIN
  ==========================================================
  */

  return (
    <main
      ref={pageRef}
      className="min-h-screen bg-[#F7F7F5] pb-28 text-[#1F1F1F]"
    >
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <header className="customer-reveal sticky top-0 z-40 border-b border-[#E9E9E7] bg-white/95 px-4 py-3 backdrop-blur sm:px-5">

          <div className="flex items-center justify-between gap-3">

            <div className="flex min-w-0 items-center gap-3">

              {restaurant?.logo_url ? (
                <img
                  src={
                    restaurant.logo_url
                  }
                  alt={
                    restaurant.name
                  }
                  className="h-11 w-11 shrink-0 rounded-xl border border-[#EEEEEE] bg-white object-contain p-1"
                />
              ) : (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E9F8E5] text-xl">
                  🍽️
                </div>
              )}

              <div className="min-w-0">
                <h1 className="truncate text-base font-bold sm:text-lg">
                  {
                    restaurant?.name
                  }
                </h1>

                <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[#6B7280]">
                  <span className="rounded-full bg-[#E9F8E5] px-2 py-0.5 font-bold text-[#0C831F]">
                    TABLE{" "}
                    {
                      tableNumber
                    }
                  </span>

                  <span>
                    Order from your table
                  </span>
                </div>
              </div>

            </div>

            <div className="flex shrink-0 items-center gap-2">

              {orders.length >
                0 && (
                <button
                  type="button"
                  onClick={() =>
                    openTracking()
                  }
                  className="relative flex h-10 items-center gap-1.5 rounded-xl border border-[#DCEBD8] bg-[#F4FBF2] px-3 text-xs font-bold text-[#0C831F]"
                >
                  <span>
                    📦
                  </span>
                  <span className="hidden sm:inline">
                    Orders
                  </span>

                  {activeOrders.length >
                    0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0C831F] px-1 text-[9px] text-white">
                      {
                        activeOrders.length
                      }
                    </span>
                  )}
                </button>
              )}

              <button
                data-cart-button
                type="button"
                onClick={() =>
                  setCartOpen(
                    true
                  )
                }
                className="relative flex h-10 items-center gap-1.5 rounded-xl bg-[#0C831F] px-3 text-xs font-bold text-white shadow-[0_4px_12px_rgba(12,131,31,0.2)]"
              >
                <span>
                  🛒
                </span>

                <span className="hidden sm:inline">
                  Cart
                </span>

                {cartCount >
                  0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[9px] font-bold text-[#0C831F]">
                    {
                      cartCount
                    }
                  </span>
                )}
              </button>

            </div>

          </div>

        </header>

        {/* HERO */}

        <section className="customer-reveal px-4 pt-5 sm:px-5">

          <div className="overflow-hidden rounded-[24px] bg-[#0C831F] p-5 text-white shadow-[0_10px_28px_rgba(12,131,31,0.12)] sm:p-7">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

              <div className="max-w-2xl">

                <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/70">
                  Welcome
                </p>

                <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
                  What would you like to order?
                </h2>

                {restaurant?.description && (
                  <p className="mt-2 max-w-xl text-sm leading-6 text-white/75">
                    {
                      restaurant.description
                    }
                  </p>
                )}

              </div>

              <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">

                <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                  Dining at
                </p>

                <p className="mt-1 text-sm font-bold">
                  Table{" "}
                  {
                    tableNumber
                  }
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* SUCCESS */}

        {successMessage && (
          <div className="customer-reveal mx-4 mt-4 rounded-2xl border border-[#CDE8C5] bg-[#E9F8E5] px-4 py-3 text-sm font-bold text-[#0C831F] sm:mx-5">
            {successMessage}
          </div>
        )}

        {/* SEARCH */}

        <section className="customer-reveal px-4 pt-5 sm:px-5">

          <div className="relative">

            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
              🔎
            </span>

            <input
              type="search"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search dishes..."
              className="h-12 w-full rounded-2xl border border-[#E5E7EB] bg-white pl-11 pr-11 text-sm outline-none shadow-[0_2px_8px_rgba(0,0,0,0.03)] focus:border-[#0C831F] focus:ring-2 focus:ring-[#0C831F]/10"
            />

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-[#F1F1EF] text-sm text-[#6B7280]"
              >
                ×
              </button>
            )}

          </div>

        </section>

        {/* CATEGORIES */}

        <section className="customer-reveal sticky top-[65px] z-30 mt-4 border-y border-[#E9E9E7] bg-[#F7F7F5]/95 px-4 py-3 backdrop-blur sm:px-5">

          <div className="flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

            <button
              type="button"
              onClick={() =>
                setActiveCategory(
                  "all"
                )
              }
              className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-bold ${
                activeCategory ===
                "all"
                  ? "bg-[#0C831F] text-white shadow-sm"
                  : "border border-[#E5E7EB] bg-white text-[#6B7280]"
              }`}
            >
              All
            </button>

            {categories.map(
              (category) => (
                <button
                  key={
                    category.id
                  }
                  type="button"
                  onClick={() =>
                    setActiveCategory(
                      category.id
                    )
                  }
                  className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-bold ${
                    activeCategory ===
                    category.id
                      ? "bg-[#0C831F] text-white shadow-sm"
                      : "border border-[#E5E7EB] bg-white text-[#6B7280]"
                  }`}
                >
                  {
                    category.name
                  }
                </button>
              )
            )}

          </div>

        </section>

        {/* MENU */}

        <section
          ref={menuGridRef}
          className="px-4 pb-6 pt-5 sm:px-5"
        >

          <div className="mb-4 flex items-end justify-between gap-3">

            <div>
              <h2 className="text-lg font-bold">
                {search
                  ? "Search results"
                  : activeCategory ===
                    "all"
                  ? "Popular choices"
                  : categories.find(
                      (category) =>
                        category.id ===
                        activeCategory
                    )?.name ||
                    "Menu"}
              </h2>

              <p className="mt-1 text-xs text-[#6B7280]">
                {
                  filteredItems.length
                }{" "}
                {filteredItems.length ===
                1
                  ? "item"
                  : "items"}{" "}
                available
              </p>
            </div>

            {items.length >
              0 && (
              <button
                type="button"
                onClick={async () => {
                  setMenuRefreshing(
                    true
                  );

                  const {
                    data,
                  } =
                    await createClient()
                      .from(
                        "menu_items"
                      )
                      .select(
                        "id, name, description, price, category_id, is_available, image_url"
                      )
                      .eq(
                        "restaurant_id",
                        restaurant?.id
                      )
                      .eq(
                        "is_available",
                        true
                      )
                      .order(
                        "name"
                      );

                  if (data) {
                    setItems(
                      data
                    );
                  }

                  setMenuRefreshing(
                    false
                  );
                }}
                className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-bold text-[#6B7280]"
              >
                {menuRefreshing
                  ? "..."
                  : "↻ Refresh"}
              </button>
            )}

          </div>

          {filteredItems.length ===
          0 ? (
            <div className="customer-reveal rounded-[22px] border border-[#E9E9E7] bg-white p-10 text-center">

              <div className="text-5xl">
                {search
                  ? "🔎"
                  : "🍽️"}
              </div>

              <h3 className="mt-4 text-lg font-bold">
                {search
                  ? "No dishes found"
                  : "Menu is empty"}
              </h3>

              <p className="mt-2 text-sm text-[#6B7280]">
                {search
                  ? "Try another dish name or clear the search."
                  : "There are no available dishes right now."}
              </p>

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch(
                      ""
                    )
                  }
                  className="mt-4 rounded-xl bg-[#0C831F] px-4 py-2.5 text-xs font-bold text-white"
                >
                  Clear Search
                </button>
              )}

            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

              {filteredItems.map(
                (item) => (
                  <div
                    key={
                      item.id
                    }
                    className="product-card"
                  >
                    <ProductCard
  key={item.id}
  image={
    item.image_url ||
    "/placeholder-food.png"
  }
  name={item.name}
  unit={
    item.description ||
    "Freshly prepared"
  }
  price={Number(item.price)}
  mrp={undefined}
  discountPercent={undefined}
  deliveryTime="10 MINS"

  quantity={getCartQuantity(item.id)}

  onAdd={() =>
    addToCart(item)
  }

  onIncrease={() =>
    increaseQuantity(item.id)
  }

  onDecrease={() =>
    decreaseQuantity(item.id)
  }
/>

                    <div className="pointer-events-none -mt-1 h-0" />
                  </div>
                )
              )}

            </div>
          )}

        </section>

        {/* FLOATING CART */}

        {cartCount >
          0 && (
          <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-xl">

            <button
              data-cart-button
              type="button"
              onClick={() =>
                setCartOpen(
                  true
                )
              }
              className="flex w-full items-center justify-between rounded-2xl bg-[#0C831F] px-4 py-3.5 text-white shadow-[0_12px_30px_rgba(12,131,31,0.25)]"
            >

              <div className="flex items-center gap-3">

                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                  🛒
                </span>

                <div className="text-left">

                  <p className="text-xs font-bold text-white/70">
                    {cartCount}{" "}
                    {cartCount ===
                    1
                      ? "item"
                      : "items"}
                  </p>

                  <p className="text-sm font-bold">
                    View Cart
                  </p>

                </div>

              </div>

              <span className="text-base font-bold">
                ₹
                {cartTotal.toFixed(
                  0
                )}{" "}
                →
              </span>

            </button>

          </div>
        )}

        {/* ==================================================
            CART MODAL
        ================================================== */}

        {cartOpen && (
          <div
            className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-5"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                setCartOpen(
                  false
                );
              }
            }}
          >

            <div className="cart-panel max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-[28px] bg-white p-5 shadow-2xl sm:rounded-[28px] sm:p-6">

              <div className="flex items-center justify-between gap-4">

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#54B226]">
                    Your selection
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    Your Cart
                  </h2>

                  <p className="mt-1 text-xs text-[#6B7280]">
                    Table{" "}
                    {
                      tableNumber
                    }
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setCartOpen(
                      false
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F5F5] text-xl text-[#6B7280]"
                >
                  ×
                </button>

              </div>

              {cart.length ===
              0 ? (
                <div className="py-12 text-center">

                  <div className="text-5xl">
                    🛒
                  </div>

                  <h3 className="mt-4 font-bold">
                    Your cart is empty
                  </h3>

                  <p className="mt-1 text-sm text-[#6B7280]">
                    Add something delicious from the menu.
                  </p>

                </div>
              ) : (
                <>
                  <div className="mt-5 space-y-3">

                    {cart.map(
                      (item) => (
                        <div
                          key={
                            item.id
                          }
                          className="flex gap-3 rounded-2xl border border-[#EEEEEE] p-3"
                        >

                          {item.image_url ? (
                            <img
                              src={
                                item.image_url
                              }
                              alt={
                                item.name
                              }
                              className="h-16 w-16 shrink-0 rounded-xl bg-[#F7F7F5] object-contain p-1"
                            />
                          ) : (
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#F7F7F5] text-2xl">
                              🍽️
                            </div>
                          )}

                          <div className="min-w-0 flex-1">

                            <p className="line-clamp-2 text-sm font-bold">
                              {
                                item.name
                              }
                            </p>

                            <p className="mt-1 text-xs text-[#6B7280]">
                              ₹
                              {Number(
                                item.price
                              ).toFixed(
                                0
                              )}{" "}
                              each
                            </p>

                            <div className="mt-2 inline-flex items-center overflow-hidden rounded-lg bg-[#54B226] text-white">

                              <button
                                type="button"
                                onClick={() =>
                                  decreaseQuantity(
                                    item.id
                                  )
                                }
                                className="flex h-8 w-8 items-center justify-center text-lg font-bold"
                              >
                                −
                              </button>

                              <span className="w-7 text-center text-xs font-bold">
                                {
                                  item.quantity
                                }
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  increaseQuantity(
                                    item.id
                                  )
                                }
                                className="flex h-8 w-8 items-center justify-center text-lg font-bold"
                              >
                                +
                              </button>

                            </div>

                          </div>

                          <p className="shrink-0 pt-1 text-sm font-bold">
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

                  <div className="mt-5 rounded-2xl bg-[#F7F7F5] p-4">

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6B7280]">
                        Items
                      </span>

                      <span className="font-bold">
                        {
                          cartCount
                        }
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between">

                      <span className="font-bold">
                        Total
                      </span>

                      <span className="text-xl font-bold">
                        ₹
                        {cartTotal.toFixed(
                          0
                        )}
                      </span>

                    </div>

                  </div>

                  {orderMessage && (
                    <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">
                      {
                        orderMessage
                      }
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={
                      placingOrder
                    }
                    onClick={
                      placeOrder
                    }
                    className="mt-4 flex w-full items-center justify-center rounded-xl bg-[#0C831F] py-4 text-sm font-bold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {placingOrder
                      ? "Placing Order..."
                      : `Place Order • ₹${cartTotal.toFixed(
                          0
                        )}`}
                  </button>
                </>
              )}

            </div>

          </div>
        )}

        {/* ==================================================
            TRACKING MODAL
        ================================================== */}

        {trackingOpen &&
          selectedOrder && (
          <div
            className="fixed inset-0 z-[80] flex items-end justify-center bg-black/55 p-0 sm:items-center sm:p-5"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                closeTracking();
              }
            }}
          >

            <div className="tracking-panel max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-[28px] bg-white p-5 shadow-2xl sm:rounded-[28px] sm:p-6">

              <div className="flex items-start justify-between gap-4">

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#54B226]">
                    Order Tracking
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    Your Orders
                  </h2>

                  <p className="mt-1 text-xs text-[#6B7280]">
                    Table{" "}
                    {
                      tableNumber
                    }{" "}
                    •{" "}
                    {
                      orders.length
                    }{" "}
                    total order
                    {orders.length ===
                    1
                      ? ""
                      : "s"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    closeTracking
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F5F5] text-xl text-[#6B7280]"
                >
                  ×
                </button>

              </div>

              {/* ORDER SELECTOR */}

              {orders.length >
                1 && (
                <div className="mt-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

                  {orders.map(
                    (order, index) => (
                      <button
                        key={
                          order.id
                        }
                        type="button"
                        onClick={() =>
                          setSelectedOrderId(
                            order.id
                          )
                        }
                        className={`shrink-0 rounded-xl border px-3 py-2 text-left ${
                          selectedOrderId ===
                          order.id
                            ? "border-[#0C831F] bg-[#E9F8E5]"
                            : "border-[#E5E7EB] bg-white"
                        }`}
                      >
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                          Order{" "}
                          {index +
                            1}
                        </p>

                        <p className="mt-0.5 text-xs font-bold">
                          ₹
                          {Number(
                            order.total_amount
                          ).toFixed(
                            0
                          )}
                        </p>

                        <span
                          className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold ${getStatusTone(
                            order.status
                          )}`}
                        >
                          {getStatusLabel(
                            order.status
                          )}
                        </span>
                      </button>
                    )
                  )}

                </div>
              )}

              {/* SELECTED ORDER */}

              <div className="mt-6 rounded-2xl border border-[#E9E9E7] bg-[#FAFAF9] p-4">

                <div className="flex items-center justify-between gap-3">

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                      Selected Order
                    </p>

                    <p className="mt-1 text-xs font-bold">
                      #
                      {selectedOrder.id.slice(
                        0,
                        8
                      )}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1.5 text-[10px] font-bold ${getStatusTone(
                      selectedOrder.status
                    )}`}
                  >
                    {getStatusLabel(
                      selectedOrder.status
                    )}
                  </span>

                </div>

                <div className="mt-5 space-y-4">

                  {STATUS_STEPS.map(
                    (step) => {
                      const active =
                        getStatusStep(
                          selectedOrder.status
                        ) >=
                        step.number;

                      const current =
                        getStatusStep(
                          selectedOrder.status
                        ) ===
                        step.number;

                      return (
                        <div
                          key={
                            step.number
                          }
                          className="flex items-center gap-3"
                        >

                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm ${
                              active
                                ? "bg-[#54B226] text-white"
                                : "bg-[#EDEDEB] text-[#9CA3AF]"
                            } ${
                              current
                                ? "ring-4 ring-[#54B226]/10"
                                : ""
                            }`}
                          >
                            {
                              step.icon
                            }
                          </div>

                          <div className="min-w-0">

                            <p
                              className={`text-sm font-bold ${
                                active
                                  ? "text-[#1F1F1F]"
                                  : "text-[#9CA3AF]"
                              }`}
                            >
                              {
                                step.label
                              }
                            </p>

                            <p className="text-xs text-[#6B7280]">
                              {
                                step.text
                              }
                            </p>

                          </div>

                          {current && (
                            <span className="ml-auto h-2 w-2 rounded-full bg-[#54B226]" />
                          )}

                        </div>
                      );
                    }
                  )}

                </div>

                {selectedOrder.status ===
                  "rejected" && (
                  <div className="mt-5 rounded-xl bg-red-50 p-3 text-sm font-semibold text-[#B42318]">
                    This order was rejected by the restaurant.
                  </div>
                )}

                <div className="mt-6 rounded-xl bg-white p-4">

                  <div className="flex items-center justify-between">

                    <span className="text-sm text-[#6B7280]">
                      Order total
                    </span>

                    <span className="text-xl font-bold">
                      ₹
                      {Number(
                        selectedOrder.total_amount
                      ).toFixed(
                        0
                      )}
                    </span>

                  </div>

                  <p className="mt-2 text-[10px] text-[#9CA3AF]">
                    Order placed{" "}
                    {new Date(
                      selectedOrder.created_at
                    ).toLocaleString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>

                </div>

              </div>

              {orders.length >
                1 && (
                <p className="mt-4 text-center text-xs text-[#6B7280]">
                  You have{" "}
                  {
                    orders.length
                  }{" "}
                  orders linked to this table. Tap an order above to track it.
                </p>
              )}

            </div>

          </div>
        )}

      </div>
    </main>
  );
}