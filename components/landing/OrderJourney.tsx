"use client";

import { useEffect, useState } from "react";

const steps = [
  {
    number: "01",
    label: "SCAN QR",
    title: "Scan the table QR",
    description:
      "The customer scans the QR placed on the restaurant table.",
  },
  {
    number: "02",
    label: "MENU",
    title: "Restaurant menu opens",
    description:
      "The digital menu opens instantly with food, prices and categories.",
  },
  {
    number: "03",
    label: "ORDER",
    title: "Customer places order",
    description:
      "The customer selects dishes, reviews the cart and places the order.",
  },
  {
    number: "04",
    label: "KITCHEN",
    title: "Kitchen receives order",
    description:
      "The new order appears instantly on the restaurant dashboard.",
  },
  {
    number: "05",
    label: "ACCEPTED",
    title: "Restaurant accepts",
    description:
      "The kitchen accepts the order and preparation begins.",
  },
  {
    number: "06",
    label: "PREPARING",
    title: "Food is being prepared",
    description:
      "The customer can see the live preparation status.",
  },
  {
    number: "07",
    label: "READY",
    title: "Food is ready",
    description:
      "The kitchen marks the order ready for serving.",
  },
  {
    number: "08",
    label: "SERVED",
    title: "Order is served",
    description:
      "The food reaches the customer's table.",
  },
  {
    number: "09",
    label: "PAYMENT",
    title: "Customer pays",
    description:
      "The final bill appears and the customer completes payment.",
  },
  {
    number: "10",
    label: "COMPLETE",
    title: "Order completed",
    description:
      "The order and payment are recorded in the restaurant system.",
  },
];

export default function OrderJourney() {
  const [active, setActive] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setActive((current) =>
        current >= steps.length - 1 ? 0 : current + 1
      );
    }, 4800);

    return () => clearInterval(timer);
  }, [autoPlay]);

  const selectStep = (index: number) => {
    setActive(index);
    setAutoPlay(false);
  };

  return (
    <section
      id="order-journey"
      className="scroll-mt-32 relative overflow-hidden bg-[#071108] px-5 pb-28 pt-32 text-white md:px-8 md:pb-40 md:pt-40"
    >
      {/* BACKGROUND */}

      <div className="pointer-events-none absolute inset-0">

        <div className="absolute left-1/2 top-[20%] h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-[#56c132]/[0.08] blur-[140px]" />

        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-[#0d6f24]/[0.08] blur-[140px]" />

        <div className="absolute inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:64px_64px]" />

      </div>

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mx-auto max-w-3xl text-center">

          <div className="inline-flex items-center gap-2 rounded-full border border-[#56c132]/20 bg-[#56c132]/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#a4ef93]">

            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#56c132]" />

            Live restaurant workflow

          </div>

          <h2 className="mt-7 text-5xl font-black leading-[0.92] tracking-[-0.065em] md:text-7xl">

            From QR scan
            <br />

            <span className="text-[#56c132]">
              to payment.
            </span>

          </h2>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/45">
            Watch a real restaurant order move through the complete RESTRO
            system.
          </p>

        </div>

        {/* STEP NAVIGATION */}

        <div className="mx-auto mt-12 max-w-6xl">

          <div className="grid grid-cols-5 gap-2 md:grid-cols-10">

            {steps.map((step, index) => {

              const selected = active === index;
              const completed = index < active;

              return (
                <button
                  key={step.number}
                  onClick={() => selectStep(index)}
                  className={`group relative rounded-xl border px-2 py-3 text-center transition-all duration-300 ${
                    selected
                      ? "border-[#56c132]/50 bg-[#56c132]/10"
                      : completed
                      ? "border-white/10 bg-white/[0.035]"
                      : "border-white/[0.06] bg-white/[0.015]"
                  }`}
                >

                  <div
                    className={`text-[8px] font-black ${
                      selected
                        ? "text-[#7ee96c]"
                        : completed
                        ? "text-white/50"
                        : "text-white/20"
                    }`}
                  >
                    {completed ? "✓" : step.number}
                  </div>

                  <div
                    className={`mt-1 text-[7px] font-black tracking-wide ${
                      selected
                        ? "text-white"
                        : "text-white/30"
                    }`}
                  >
                    {step.label}
                  </div>

                  {selected && (
                    <div className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-[#56c132]" />
                  )}

                </button>
              );
            })}

          </div>

        </div>

        {/* MAIN DEMO */}

        <div className="mt-8 overflow-hidden rounded-[34px] border border-white/[0.08] bg-[#0b130d] shadow-[0_45px_120px_rgba(0,0,0,.45)]">

          {/* BROWSER HEADER */}

          <div className="flex h-14 items-center justify-between border-b border-white/[0.07] px-5 md:px-7">

            <div className="flex items-center gap-3">

              <div className="flex gap-1.5">

                <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b6b]" />

                <span className="h-2.5 w-2.5 rounded-full bg-[#ffd166]" />

                <span className="h-2.5 w-2.5 rounded-full bg-[#56c132]" />

              </div>

              <div className="hidden rounded-lg bg-white/[0.04] px-3 py-1.5 text-[8px] font-bold text-white/25 sm:block">
                restro.in / live-demo
              </div>

            </div>

            <div className="flex items-center gap-2 text-[8px] font-black text-white/35">

              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#56c132]" />

              LIVE

            </div>

          </div>

          {/* SHOWCASE */}

          <div className="relative min-h-[670px] overflow-hidden bg-[radial-gradient(circle_at_50%_45%,#17321b_0%,#0b130d_55%,#071008_100%)] px-5 py-12 md:min-h-[680px] md:px-12">

            {/* SOFT FLOOR */}

            <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-gradient-to-t from-black/20 to-transparent" />

            {/* CONNECTION */}

            <div className="absolute left-[34%] right-[34%] top-[47%] hidden md:block">

              <div className="relative h-px bg-gradient-to-r from-[#56c132]/5 via-[#56c132]/30 to-[#56c132]/5">

                <div
                  className={`absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-[#56c132] shadow-[0_0_22px_#56c132] transition-all duration-1000 ${
                    active >= 3
                      ? "left-full"
                      : "left-0"
                  }`}
                />

              </div>

              <div className="absolute left-1/2 top-[-18px] -translate-x-1/2 rounded-full border border-[#56c132]/20 bg-[#0d1b0f] px-3 py-1 text-[7px] font-black text-[#74d964]">
                REAL-TIME
              </div>

            </div>

            {/* CUSTOMER */}

            <CustomerPanel active={active} />

            {/* CENTER TABLE */}

            <div className="absolute left-1/2 top-[45%] hidden -translate-x-1/2 -translate-y-1/2 md:block">

              <div
                className={`relative flex h-28 w-52 items-center justify-center rounded-[50%] border-[5px] border-[#452a1c] bg-gradient-to-b from-[#b8794e] to-[#8e5436] shadow-[0_18px_0_#4f2d1d] transition-all duration-700 ${
                  active === 0
                    ? "scale-110"
                    : "scale-100"
                }`}
              >

                {/* QR */}

                <div
                  className={`relative flex h-16 w-16 items-center justify-center rounded-xl bg-white p-2 shadow-xl transition-all duration-500 ${
                    active === 0
                      ? "scale-110 ring-4 ring-[#56c132]/30"
                      : ""
                  }`}
                >

                  <QR />

                  {active === 0 && (
                    <div className="animate-scan absolute left-1 right-1 h-0.5 bg-[#56c132] shadow-[0_0_10px_#56c132]" />
                  )}

                </div>

              </div>

              <div className="mt-7 text-center">

                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[8px] font-black text-white/30">
                  TABLE 12
                </span>

              </div>

            </div>

            {/* KITCHEN */}

            <KitchenPanel active={active} />

            {/* ORDER TRAVEL */}

            {active >= 3 && active <= 5 && (
              <div className="absolute left-[34%] top-[45%] hidden md:block">

                <div className="animate-travel rounded-xl border border-[#56c132]/30 bg-[#0d1d10] px-4 py-2 shadow-[0_0_30px_rgba(86,193,50,.15)]">

                  <div className="flex items-center gap-2">

                    <span className="h-2 w-2 rounded-full bg-[#56c132]" />

                    <span className="text-[8px] font-black text-[#9bef88]">
                      ORDER #1042
                    </span>

                  </div>

                </div>

              </div>
            )}

            {/* STEP DESCRIPTION */}

            <div className="absolute bottom-6 left-5 right-5 md:bottom-8 md:left-10 md:right-10">

              <div className="flex flex-col gap-5 rounded-2xl border border-white/[0.08] bg-[#071008]/90 p-5 shadow-2xl backdrop-blur-xl md:flex-row md:items-center md:justify-between md:p-6">

                <div className="flex gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#56c132]/10 text-xs font-black text-[#8fe57d]">
                    {steps[active].number}
                  </div>

                  <div>

                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#56c132]">
                      {steps[active].label}
                    </p>

                    <h3 className="mt-1 text-lg font-black">
                      {steps[active].title}
                    </h3>

                    <p className="mt-1 max-w-xl text-xs leading-5 text-white/40">
                      {steps[active].description}
                    </p>

                  </div>

                </div>

                <button
                  onClick={() => {
                    setActive(
                      active >= steps.length - 1
                        ? 0
                        : active + 1
                    );
                    setAutoPlay(false);
                  }}
                  className="shrink-0 rounded-xl bg-[#56c132] px-5 py-3 text-[9px] font-black text-black transition hover:scale-[1.03]"
                >
                  {active === steps.length - 1
                    ? "REPLAY JOURNEY ↻"
                    : "NEXT STEP →"}
                </button>

              </div>

            </div>

          </div>

        </div>

        {/* BOTTOM BENEFITS */}

        <div className="mt-8 grid gap-3 md:grid-cols-3">

          <Benefit
            title="Customer experience"
            text="QR menu, ordering, live tracking and payment from one phone."
          />

          <Benefit
            title="Kitchen control"
            text="Every new order appears instantly with clear preparation status."
          />

          <Benefit
            title="Owner visibility"
            text="Orders, payments and sales stay connected in one system."
          />

        </div>

      </div>

      <style jsx>{`

        @keyframes scan {
          0% {
            top: 8%;
            opacity: .4;
          }

          50% {
            opacity: 1;
          }

          100% {
            top: 88%;
            opacity: .4;
          }
        }

        @keyframes travel {
          0% {
            transform: translateX(-20px);
            opacity: 0;
          }

          20% {
            opacity: 1;
          }

          80% {
            opacity: 1;
          }

          100% {
            transform: translateX(260px);
            opacity: 0;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-scan {
          animation: scan 1.4s ease-in-out infinite;
        }

        .animate-travel {
          animation: travel 2.2s ease-in-out infinite;
        }

        .animate-fade {
          animation: fadeIn .35s ease-out;
        }

      `}</style>

    </section>
  );
}

/* ========================================================= */
/* CUSTOMER PANEL */
/* ========================================================= */

function CustomerPanel({
  active,
}: {
  active: number;
}) {
  return (
    <div className="absolute left-5 top-10 w-[42%] max-w-[330px] md:left-[7%] md:top-[8%] md:w-[27%]">

      <div className="mb-3 flex items-center justify-between">

        <div>

          <p className="text-[8px] font-black uppercase tracking-[.2em] text-white/25">
            CUSTOMER
          </p>

          <p className="mt-1 text-xs font-bold text-white/70">
            Table 12
          </p>

        </div>

        <span className="rounded-full bg-white/[.04] px-2.5 py-1 text-[7px] font-black text-white/30">
          MOBILE
        </span>

      </div>

      {/* PHONE */}

      <div className="mx-auto rounded-[32px] border-[6px] border-[#252825] bg-[#e9ebe7] p-1.5 shadow-[0_30px_80px_rgba(0,0,0,.5)]">

        <div className="relative h-[440px] overflow-hidden rounded-[25px] bg-white">

          {/* DYNAMIC CONTENT */}

          {active === 0 && <ScanScreen />}

          {active === 1 && <MenuScreen />}

          {active === 2 && <CartScreen />}

          {active >= 3 && active <= 6 && (
            <TrackingScreen active={active} />
          )}

          {active === 7 && <ServedScreen />}

          {active === 8 && <PaymentScreen />}

          {active === 9 && <CompleteScreen />}

        </div>

      </div>

    </div>
  );
}

/* ========================================================= */
/* SCAN SCREEN */
/* ========================================================= */

function ScanScreen() {
  return (
    <div className="animate-fade flex h-full flex-col items-center justify-center bg-[#f7faf6] px-7 text-center">

      <div className="mb-2 text-[9px] font-black tracking-widest text-[#14912a]">
        RESTRO
      </div>

      <h3 className="text-2xl font-black tracking-tight text-[#111]">
        Scan to order
      </h3>

      <p className="mt-2 text-[9px] leading-4 text-gray-400">
        Scan the QR code on your table
        <br />
        to view the menu.
      </p>

      <div className="relative mt-8 h-40 w-40 rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_15px_40px_rgba(0,0,0,.08)]">

        <QR />

        <div className="animate-scan absolute left-3 right-3 h-0.5 bg-[#35bb43] shadow-[0_0_15px_#35bb43]" />

        <div className="absolute -left-1 -top-1 h-6 w-6 border-l-2 border-t-2 border-[#35bb43]" />

        <div className="absolute -right-1 -top-1 h-6 w-6 border-r-2 border-t-2 border-[#35bb43]" />

        <div className="absolute -bottom-1 -left-1 h-6 w-6 border-b-2 border-l-2 border-[#35bb43]" />

        <div className="absolute -bottom-1 -right-1 h-6 w-6 border-b-2 border-r-2 border-[#35bb43]" />

      </div>

      <div className="mt-7 flex items-center gap-2 rounded-full bg-[#e9f7e6] px-3 py-2 text-[8px] font-black text-[#16892a]">

        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#35bb43]" />

        Scanning table QR...

      </div>

    </div>
  );
}

/* ========================================================= */
/* MENU SCREEN */
/* ========================================================= */

function MenuScreen() {
  return (
    <div className="animate-fade h-full overflow-hidden bg-[#f7faf6] px-3 pb-4 pt-7">

      <PhoneTop />

      <div className="mt-5 rounded-2xl bg-[#eaf6e7] p-3">

        <p className="text-[7px] font-black uppercase tracking-widest text-[#42a94b]">
          Welcome to
        </p>

        <p className="mt-1 text-xl font-black text-[#102313]">
          Store Magic
        </p>

        <p className="mt-1 text-[8px] text-[#658067]">
          Good food. Simple ordering.
        </p>

      </div>

      <div className="mt-4 flex gap-2">

        <Category active>
          Popular
        </Category>

        <Category>
          Starters
        </Category>

        <Category>
          Main
        </Category>

      </div>

      <p className="mt-5 text-[8px] font-black uppercase tracking-wider text-gray-400">
        Popular today
      </p>

      <div className="mt-2 space-y-2">

        <FoodCard
          name="Paneer Tikka"
          price="₹220"
          image="orange"
        />

        <FoodCard
          name="Butter Naan"
          price="₹60"
          image="gold"
        />

        <FoodCard
          name="Cold Drink"
          price="₹50"
          image="blue"
        />

      </div>

    </div>
  );
}

/* ========================================================= */
/* CART SCREEN */
/* ========================================================= */

function CartScreen() {
  return (
    <div className="animate-fade h-full bg-[#f7faf6] px-3 pb-4 pt-7">

      <PhoneTop />

      <div className="mt-7">

        <p className="text-[8px] font-black uppercase tracking-wider text-gray-400">
          Your order
        </p>

        <h3 className="mt-1 text-2xl font-black text-[#111]">
          3 items
        </h3>

        <div className="mt-4 rounded-2xl bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,.06)]">

          <CartItem
            name="Paneer Tikka"
            qty="1"
            price="₹220"
            image="orange"
          />

          <CartItem
            name="Butter Naan"
            qty="2"
            price="₹120"
            image="gold"
          />

          <CartItem
            name="Cold Drink"
            qty="2"
            price="₹100"
            image="blue"
          />

          <div className="my-4 h-px bg-gray-100" />

          <div className="flex items-center justify-between">

            <span className="text-[9px] font-bold text-gray-400">
              Total
            </span>

            <span className="text-2xl font-black text-[#111]">
              ₹440
            </span>

          </div>

        </div>

        <button className="mt-4 w-full rounded-xl bg-[#118c25] py-3.5 text-[9px] font-black text-white shadow-[0_10px_25px_rgba(17,140,37,.18)]">
          PLACE ORDER · ₹440
        </button>

      </div>

    </div>
  );
}

/* ========================================================= */
/* TRACKING SCREEN */
/* ========================================================= */

function TrackingScreen({
  active,
}: {
  active: number;
}) {
  const accepted = active >= 4;
  const preparing = active >= 5;
  const ready = active >= 6;

  return (
    <div className="animate-fade h-full bg-[#f7faf6] px-3 pb-4 pt-7">

      <PhoneTop />

      <div className="mt-7">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-[8px] font-bold text-gray-400">
              ORDER #1042
            </p>

            <h3 className="mt-1 text-xl font-black text-[#111]">
              {ready
                ? "Food is ready"
                : preparing
                ? "Preparing your food"
                : accepted
                ? "Order accepted"
                : "Order received"}
            </h3>

          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f7e5] text-[#118c25]">

            {ready ? "✓" : "•"}

          </div>

        </div>

        <div className="mt-6 rounded-2xl bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,.05)]">

          <Tracking
            label="Order placed"
            done
          />

          <Tracking
            label="Restaurant accepted"
            done={accepted}
            active={active === 4}
          />

          <Tracking
            label="Preparing"
            done={ready}
            active={active === 5}
          />

          <Tracking
            label="Food ready"
            done={ready}
            active={active === 6}
            last
          />

        </div>

        <div className="mt-4 rounded-2xl bg-[#e9f7e6] p-4">

          <p className="text-[8px] font-black uppercase tracking-wider text-[#19882b]">
            LIVE UPDATE
          </p>

          <p className="mt-2 text-[9px] leading-4 text-[#4f7653]">

            {active === 3 &&
              "Restaurant received your order."}

            {active === 4 &&
              "Kitchen accepted your order."}

            {active === 5 &&
              "Chef is preparing your food."}

            {active === 6 &&
              "Your food is ready to serve."}

          </p>

        </div>

      </div>

    </div>
  );
}

/* ========================================================= */
/* SERVED */
/* ========================================================= */

function ServedScreen() {
  return (
    <div className="animate-fade flex h-full flex-col items-center justify-center bg-[#f7faf6] px-6 text-center">

      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e8f7e5] text-3xl text-[#118c25]">
        ✓
      </div>

      <h3 className="mt-6 text-2xl font-black text-[#111]">
        Order served
      </h3>

      <p className="mt-2 text-[9px] leading-4 text-gray-400">
        Your food has been delivered
        <br />
        to Table 12.
      </p>

      <div className="mt-7 w-full rounded-2xl bg-white p-4 text-left shadow-sm">

        <div className="flex justify-between text-[9px]">

          <span className="text-gray-400">
            Order
          </span>

          <b>
            #1042
          </b>

        </div>

        <div className="mt-3 flex justify-between text-[9px]">

          <span className="text-gray-400">
            Table
          </span>

          <b>
            12
          </b>

        </div>

      </div>

    </div>
  );
}

/* ========================================================= */
/* PAYMENT */
/* ========================================================= */

function PaymentScreen() {
  return (
    <div className="animate-fade h-full bg-[#f7faf6] px-3 pb-4 pt-7">

      <PhoneTop />

      <div className="mt-7">

        <p className="text-[8px] font-black uppercase tracking-wider text-gray-400">
          Final bill
        </p>

        <h3 className="mt-1 text-2xl font-black text-[#111]">
          Payment
        </h3>

        <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">

          <Bill
            name="Paneer Tikka"
            price="₹220"
          />

          <Bill
            name="Butter Naan × 2"
            price="₹120"
          />

          <Bill
            name="Cold Drink × 2"
            price="₹100"
          />

          <div className="my-4 h-px bg-gray-100" />

          <div className="flex items-end justify-between">

            <span className="text-[9px] font-bold text-gray-400">
              TOTAL
            </span>

            <span className="text-2xl font-black">
              ₹440
            </span>

          </div>

        </div>

        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#118c25] py-4 text-[9px] font-black text-white shadow-[0_10px_25px_rgba(17,140,37,.18)]">

          Pay ₹440

          <span>
            →
          </span>

        </button>

        <p className="mt-3 text-center text-[7px] text-gray-400">
          Secure payment · UPI · Card · Cash
        </p>

      </div>

    </div>
  );
}

/* ========================================================= */
/* COMPLETE */
/* ========================================================= */

function CompleteScreen() {
  return (
    <div className="animate-fade flex h-full flex-col items-center justify-center bg-[#f7faf6] px-6 text-center">

      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#118c25] text-3xl text-white shadow-[0_15px_40px_rgba(17,140,37,.2)]">
        ✓
      </div>

      <p className="mt-6 text-[8px] font-black uppercase tracking-widest text-[#118c25]">
        RESTRO
      </p>

      <h3 className="mt-2 text-2xl font-black text-[#111]">
        Payment successful
      </h3>

      <p className="mt-2 text-[9px] text-gray-400">
        Order #1042 completed successfully.
      </p>

      <div className="mt-7 rounded-2xl bg-white px-10 py-5 shadow-sm">

        <p className="text-[8px] font-bold text-gray-400">
          AMOUNT PAID
        </p>

        <p className="mt-1 text-3xl font-black text-[#111]">
          ₹440
        </p>

      </div>

    </div>
  );
}

/* ========================================================= */
/* KITCHEN */
/* ========================================================= */

function KitchenPanel({
  active,
}: {
  active: number;
}) {
  const visible = active >= 3;
  const accepted = active >= 4;
  const preparing = active >= 5;
  const ready = active >= 6;
  const served = active >= 7;
  const paid = active >= 9;

  return (
    <div
      className={`absolute right-5 top-10 w-[42%] max-w-[390px] transition-all duration-700 md:right-[7%] md:top-[8%] md:w-[30%] ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-5 opacity-35"
      }`}
    >

      <div className="mb-3 flex items-center justify-between">

        <div>

          <p className="text-[8px] font-black uppercase tracking-[.2em] text-white/25">
            RESTAURANT
          </p>

          <p className="mt-1 text-xs font-bold text-white/70">
            Kitchen dashboard
          </p>

        </div>

        <span className="flex items-center gap-1.5 rounded-full bg-[#56c132]/10 px-2.5 py-1 text-[7px] font-black text-[#8fe57d]">

          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#56c132]" />

          LIVE

        </span>

      </div>

      <div className="rounded-[25px] border border-white/[.08] bg-[#111a12] p-4 shadow-2xl">

        <div className="flex items-center justify-between border-b border-white/[.06] pb-4">

          <div>

            <p className="text-[7px] font-bold text-white/25">
              ACTIVE ORDERS
            </p>

            <p className="mt-1 text-base font-black">
              Kitchen queue
            </p>

          </div>

          <span className="rounded-lg bg-white/[.04] px-2 py-1.5 text-[7px] font-bold text-white/30">
            05 ACTIVE
          </span>

        </div>

        {/* NEW NOTIFICATION */}

        {active === 3 && (
          <div className="animate-notification mt-3 rounded-xl border border-[#f4c84d]/30 bg-[#f4c84d]/10 p-3">

            <div className="flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f4c84d] text-sm font-black text-[#201c09]">
                !
              </div>

              <div>

                <p className="text-[8px] font-black text-[#ffe78b]">
                  NEW ORDER
                </p>

                <p className="mt-1 text-[7px] text-white/30">
                  Table 12 · Order #1042
                </p>

              </div>

            </div>

          </div>
        )}

        {/* ORDER */}

        <div className="mt-3 rounded-2xl border border-white/[.07] bg-white/[.025] p-4">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-black">
                #1042
              </p>

              <p className="mt-1 text-[7px] text-white/25">
                Table 12 · Just now
              </p>

            </div>

            <Status
              active={active}
              accepted={accepted}
              preparing={preparing}
              ready={ready}
              served={served}
              paid={paid}
            />

          </div>

          <div className="mt-5 space-y-3">

            <KitchenItem
              name="Paneer Tikka"
              qty="1"
              price="₹220"
            />

            <KitchenItem
              name="Butter Naan"
              qty="2"
              price="₹120"
            />

            <KitchenItem
              name="Cold Drink"
              qty="2"
              price="₹100"
            />

          </div>

          <div className="my-4 h-px bg-white/[.06]" />

          <div className="flex items-center justify-between">

            <span className="text-[8px] font-bold text-white/25">
              TOTAL
            </span>

            <span className="text-xl font-black">
              ₹440
            </span>

          </div>

          <div className="mt-4">

            {!visible && (
              <div className="rounded-xl bg-white/[.04] py-3 text-center text-[8px] font-black text-white/25">
                WAITING FOR ORDER
              </div>
            )}

            {visible && !accepted && (
              <div className="rounded-xl bg-[#56c132] py-3 text-center text-[8px] font-black text-black shadow-[0_0_25px_rgba(86,193,50,.12)]">
                ACCEPT ORDER
              </div>
            )}

            {accepted && !preparing && (
              <div className="rounded-xl bg-[#4b8ef7]/10 py-3 text-center text-[8px] font-black text-[#8db8ff]">
                ✓ ORDER ACCEPTED
              </div>
            )}

            {preparing && !ready && (
              <div className="relative overflow-hidden rounded-xl bg-[#f0a23b]/10 py-3 text-center text-[8px] font-black text-[#ffc16f]">
                <span className="relative z-10">
                  PREPARING ORDER...
                </span>
              </div>
            )}

            {ready && !served && (
              <div className="rounded-xl bg-[#56c132] py-3 text-center text-[8px] font-black text-black">
                ✓ FOOD READY
              </div>
            )}

            {served && !paid && (
              <div className="rounded-xl bg-[#4b8ef7]/10 py-3 text-center text-[8px] font-black text-[#8db8ff]">
                ✓ SERVED TO TABLE
              </div>
            )}

            {paid && (
              <div className="rounded-xl bg-[#56c132] py-3 text-center text-[8px] font-black text-black">
                ✓ ORDER COMPLETED
              </div>
            )}

          </div>

        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">

          <Stat value="05" label="ACTIVE" />

          <Stat value="12" label="TODAY" />

          <Stat value="₹6.3K" label="SALES" />

        </div>

      </div>

    </div>
  );
}

/* ========================================================= */
/* SMALL COMPONENTS */
/* ========================================================= */

function PhoneTop() {
  return (
    <div className="flex items-center justify-between">

      <div>

        <p className="text-[7px] font-bold text-gray-400">
          storemagic.restro.in
        </p>

        <p className="mt-1 text-sm font-black text-[#111]">
          Store Magic
        </p>

      </div>

      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8f7e5] text-[8px] font-black text-[#118c25]">
        SM
      </div>

    </div>
  );
}

function Category({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <span
      className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[7px] font-black ${
        active
          ? "bg-[#118c25] text-white"
          : "bg-gray-100 text-gray-400"
      }`}
    >
      {children}
    </span>
  );
}

function FoodCard({
  name,
  price,
  image,
}: {
  name: string;
  price: string;
  image: "orange" | "gold" | "blue";
}) {
  const bg =
    image === "orange"
      ? "from-orange-200 to-orange-50"
      : image === "gold"
      ? "from-yellow-200 to-yellow-50"
      : "from-blue-200 to-blue-50";

  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-2.5 shadow-sm">

      <div className="flex items-center gap-2">

        <div
          className={`h-10 w-10 rounded-xl bg-gradient-to-br ${bg}`}
        />

        <div>

          <p className="text-[8px] font-black text-[#111]">
            {name}
          </p>

          <p className="mt-0.5 text-[7px] text-gray-400">
            Freshly prepared
          </p>

        </div>

      </div>

      <div className="text-right">

        <p className="text-[8px] font-black">
          {price}
        </p>

        <span className="mt-1 inline-block rounded-md bg-[#e8f7e5] px-2 py-1 text-[6px] font-black text-[#118c25]">
          ADD
        </span>

      </div>

    </div>
  );
}

function CartItem({
  name,
  qty,
  price,
  image,
}: {
  name: string;
  qty: string;
  price: string;
  image: "orange" | "gold" | "blue";
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-3 last:border-0">

      <div className="flex items-center gap-2">

        <div
          className={`h-9 w-9 rounded-lg ${
            image === "orange"
              ? "bg-orange-100"
              : image === "gold"
              ? "bg-yellow-100"
              : "bg-blue-100"
          }`}
        />

        <div>

          <p className="text-[8px] font-black">
            {name}
          </p>

          <p className="mt-0.5 text-[7px] text-gray-400">
            Qty {qty}
          </p>

        </div>

      </div>

      <span className="text-[9px] font-black">
        {price}
      </span>

    </div>
  );
}

function Tracking({
  label,
  done,
  active,
  last,
}: {
  label: string;
  done?: boolean;
  active?: boolean;
  last?: boolean;
}) {
  return (
    <div className="flex gap-3">

      <div className="flex flex-col items-center">

        <div
          className={`flex h-5 w-5 items-center justify-center rounded-full text-[7px] font-black ${
            done
              ? "bg-[#118c25] text-white"
              : active
              ? "border-2 border-[#118c25] text-[#118c25]"
              : "border border-gray-200 text-gray-300"
          }`}
        >
          {done ? "✓" : ""}
        </div>

        {!last && (
          <div
            className={`h-7 w-px ${
              done
                ? "bg-[#118c25]"
                : "bg-gray-200"
            }`}
          />
        )}

      </div>

      <div className="pb-3">

        <p
          className={`text-[9px] font-black ${
            done || active
              ? "text-[#111]"
              : "text-gray-300"
          }`}
        >
          {label}
        </p>

        {active && (
          <p className="mt-0.5 text-[7px] text-[#118c25]">
            In progress
          </p>
        )}

      </div>

    </div>
  );
}

function Bill({
  name,
  price,
}: {
  name: string;
  price: string;
}) {
  return (
    <div className="flex justify-between py-2">

      <span className="text-[8px] font-bold text-gray-400">
        {name}
      </span>

      <span className="text-[8px] font-black">
        {price}
      </span>

    </div>
  );
}

function KitchenItem({
  name,
  qty,
  price,
}: {
  name: string;
  qty: string;
  price: string;
}) {
  return (
    <div className="flex items-center justify-between">

      <div>

        <p className="text-[8px] font-bold text-white/65">
          {name}
        </p>

        <p className="mt-0.5 text-[7px] text-white/20">
          Quantity {qty}
        </p>

      </div>

      <span className="text-[8px] font-black text-white/50">
        {price}
      </span>

    </div>
  );
}

function Status({
  active,
  accepted,
  preparing,
  ready,
  served,
  paid,
}: {
  active: number;
  accepted: boolean;
  preparing: boolean;
  ready: boolean;
  served: boolean;
  paid: boolean;
}) {
  let text = "WAITING";
  let style = "bg-white/5 text-white/30";

  if (paid) {
    text = "COMPLETED";
    style = "bg-[#56c132]/10 text-[#8fe57d]";
  } else if (served) {
    text = "SERVED";
    style = "bg-blue-400/10 text-blue-300";
  } else if (ready) {
    text = "READY";
    style = "bg-[#56c132]/10 text-[#8fe57d]";
  } else if (preparing) {
    text = "PREPARING";
    style = "bg-orange-400/10 text-orange-300";
  } else if (accepted) {
    text = "ACCEPTED";
    style = "bg-blue-400/10 text-blue-300";
  } else if (active >= 3) {
    text = "NEW ORDER";
    style = "bg-yellow-400/10 text-yellow-300";
  }

  return (
    <span className={`rounded-full px-2.5 py-1 text-[7px] font-black ${style}`}>
      {text}
    </span>
  );
}

function Stat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.025] p-2.5">

      <p className="text-xs font-black">
        {value}
      </p>

      <p className="mt-1 text-[6px] font-black tracking-widest text-white/20">
        {label}
      </p>

    </div>
  );
}

function QR() {
  return (
    <div className="grid h-full w-full grid-cols-9 gap-[2px] bg-white">

      {Array.from({ length: 81 }).map((_, index) => {

        const x = index % 9;
        const y = Math.floor(index / 9);

        const corner =
          (x < 3 && y < 3) ||
          (x > 5 && y < 3) ||
          (x < 3 && y > 5);

        const insideCorner =
          (x === 1 && y === 1) ||
          (x === 7 && y === 1) ||
          (x === 1 && y === 7);

        const filled =
          insideCorner
            ? false
            : corner
            ? true
            : (x * 7 + y * 11 + index) % 3 !== 0;

        return (
          <div
            key={index}
            className={filled ? "bg-[#111]" : "bg-white"}
          />
        );
      })}

    </div>
  );
}

function Benefit({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">

      <div className="h-2 w-2 rounded-full bg-[#56c132]" />

      <h3 className="mt-4 text-sm font-black">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-white/30">
        {text}
      </p>

    </div>
  );
}