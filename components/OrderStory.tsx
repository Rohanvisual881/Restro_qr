"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

/* =========================================================
   DATA
========================================================= */

const GREEN = "#22c55e";

const steps = [
  "Scan & Order",
  "Menu",
  "Cart",
  "Order",
  "Kitchen",
  "Preparing",
  "Ready",
  "Payment",
];

/* =========================================================
   QR CODE
========================================================= */

function QRCode({ small = false }: { small?: boolean }) {
  const blocks = [
    1, 1, 0, 1, 1, 0, 1,
    1, 0, 1, 0, 1, 1, 0,
    0, 1, 1, 1, 0, 0, 1,
    1, 0, 1, 1, 1, 0, 1,
    0, 1, 0, 1, 0, 1, 0,
    1, 1, 1, 0, 1, 0, 1,
    0, 1, 0, 1, 1, 1, 0,
  ];

  return (
    <div className={small ? "qr qr-small" : "qr"}>
      {blocks.map((active, i) => (
        <span
          key={i}
          className={active ? "qr-block active" : "qr-block"}
        />
      ))}
    </div>
  );
}

/* =========================================================
   PHONE
========================================================= */

function Phone({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`phone ${className}`}>
      <div className="phone-notch" />
      <div className="phone-screen">
        {children}
      </div>
    </div>
  );
}

/* =========================================================
   CUSTOMER
========================================================= */

function Customer() {
  return (
    <div className="customer">
      <div className="customer-head" />
      <div className="customer-body" />
      <div className="customer-arm customer-arm-left" />
      <div className="customer-arm customer-arm-right" />
    </div>
  );
}

/* =========================================================
   TABLE
========================================================= */

function Table() {
  return (
    <div className="table-wrap">
      <div className="table-top">
        <div className="table-qr">
          <QRCode small />
          <span>TABLE 12</span>
        </div>
      </div>

      <div className="table-leg" />
    </div>
  );
}

/* =========================================================
   SCAN SCREEN
========================================================= */

function ScanScreen() {
  return (
    <div className="scan-screen">
      <div className="scan-brand">
        STORE MAGIC
      </div>

      <QRCode />

      <strong>
        SCANNING TABLE QR
      </strong>

      <span className="table-pill">
        TABLE 12
      </span>
    </div>
  );
}

/* =========================================================
   MENU SCREEN
========================================================= */

function MenuScreen() {
  const products = [
    ["Paneer Tikka", "₹220", "Popular"],
    ["Butter Naan", "₹60", "Fresh"],
    ["Cold Drink", "₹50", "Chilled"],
    ["Veg Pizza", "₹260", "Wood fired"],
    ["Gulab Jamun", "₹90", "Dessert"],
  ];

  return (
    <>
      <div className="phone-status">
        <span>9:41</span>
        <span>5G ▮▮</span>
      </div>

      <div className="browser">
        🔒 storemagic.restro.in
      </div>

      <div className="menu-header">
        <div>
          <strong>Store Magic</strong>
          <small>Table 12</small>
        </div>

        <span className="cart-icon">
          🛒 0
        </span>
      </div>

      <div className="categories">
        <span>Pizza</span>
        <span>Burger</span>
        <span className="active">Paneer</span>
        <span>Drinks</span>
        <span>Dessert</span>
      </div>

      <div className="products">
        {products.map(([name, price, label], i) => (
          <div className="product" key={name}>
            <div className={`product-image product-${i}`} />

            <div className="product-info">
              <strong>{name}</strong>
              <small>{label}</small>
              <b>{price}</b>
            </div>

            <button>
              ADD
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

/* =========================================================
   CART SCREEN
========================================================= */

function CartScreen() {
  return (
    <>
      <div className="phone-status">
        <span>9:41</span>
        <span>5G ▮▮</span>
      </div>

      <div className="browser">
        🔒 storemagic.restro.in/cart
      </div>

      <h3 className="screen-title">
        Your Cart
      </h3>

      <div className="cart-items">
        <div>
          <span>Paneer Tikka × 2</span>
          <b>₹440</b>
        </div>

        <div>
          <span>Butter Naan × 2</span>
          <b>₹120</b>
        </div>

        <div>
          <span>Cold Drink × 1</span>
          <b>₹50</b>
        </div>
      </div>

      <div className="cart-summary">
        <div>
          <span>Subtotal</span>
          <span>₹610</span>
        </div>

        <div>
          <span>Table discount</span>
          <span>- ₹160</span>
        </div>

        <div>
          <span>Tax</span>
          <span>₹30</span>
        </div>

        <hr />

        <div className="cart-total">
          <strong>Total</strong>
          <strong>₹480</strong>
        </div>
      </div>

      <button className="place-order">
        PLACE ORDER · ₹480
      </button>
    </>
  );
}

/* =========================================================
   ORDER SCREEN
========================================================= */

function OrderScreen() {
  return (
    <>
      <div className="order-success-icon">
        ✓
      </div>

      <div className="order-placed">
        ORDER PLACED
      </div>

      <strong className="order-number">
        #104
      </strong>

      <div className="sent-pill">
        <span />
        SENT TO KITCHEN
      </div>

      <div className="mini-order">
        <span>Paneer Tikka × 2</span>
        <span>Butter Naan × 2</span>
        <span>Cold Drink × 1</span>
      </div>
    </>
  );
}

/* =========================================================
   KITCHEN CARD
========================================================= */

function KitchenCard() {
  return (
    <div className="kitchen-card">

      <div className="kitchen-header">
        <span>NEW ORDER</span>
        <b>NEW</b>
      </div>

      <h3>
        ORDER #104
      </h3>

      <small>
        Table 12 · Dine-in
      </small>

      <div className="kitchen-items">
        <div>
          <span>Paneer Tikka</span>
          <b>×2</b>
        </div>

        <div>
          <span>Butter Naan</span>
          <b>×2</b>
        </div>

        <div>
          <span>Cold Drink</span>
          <b>×1</b>
        </div>
      </div>

      <div className="kitchen-total">
        <span>TOTAL</span>
        <strong>₹480</strong>
      </div>

      <button>
        ACCEPT ORDER
      </button>

    </div>
  );
}

/* =========================================================
   PREPARING PHONE
========================================================= */

function PreparingScreen() {
  return (
    <>
      <div className="live-label">
        LIVE STATUS
      </div>

      <div className="status-message purple">
        <strong>
          Your food is being prepared 👨‍🍳
        </strong>

        <small>
          Kitchen is working on your order
        </small>
      </div>

      <div className="phone-progress">
        <span />
      </div>

      <div className="phone-order-status">
        <strong>
          ORDER #104
        </strong>

        <b>
          PREPARING
        </b>
      </div>
    </>
  );
}

/* =========================================================
   READY PHONE
========================================================= */

function ReadyScreen() {
  return (
    <>
      <div className="ready-icon">
        ✓
      </div>

      <h3 className="ready-phone-title">
        Your order is ready!
      </h3>

      <p className="ready-phone-text">
        Please collect your food.
      </p>

      <div className="ready-pill">
        🍽️ READY TO SERVE
      </div>
    </>
  );
}

/* =========================================================
   PAYMENT PHONE
========================================================= */

function PaymentScreen() {
  return (
    <>
      <div className="pay-title">
        SCAN TO PAY
      </div>

      <QRCode />

      <strong className="pay-amount">
        ₹450
      </strong>

      <div className="payment-success">
        ✓ PAYMENT SUCCESSFUL
      </div>
    </>
  );
}

/* =========================================================
   STEP INDICATOR
========================================================= */

function ProgressItem({
  label,
  index,
  progress,
}: {
  label: string;
  index: number;
  progress: number;
}) {
  const sceneStart = index / steps.length;
  const sceneEnd = (index + 1) / steps.length;
  const active = progress >= sceneStart && progress < sceneEnd;
  const opacity = active ? 1 : 0.35;
  const scale = active ? 1.15 : 1;

  return (
    <div
      className="progress-item"
      style={{
        opacity,
        transform: `scale(${scale})`,
        transition: "opacity .2s ease, transform .2s ease",
      }}
    >
      <small>{label}</small>
      <span className="progress-dot" />
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function OrderStory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setProgress(Math.min(1, Math.max(0, latest)));
  });

  const activeScene = Math.min(
    steps.length - 1,
    Math.floor(progress * steps.length)
  );

  const sceneStyle = (index: number) => ({
    opacity: activeScene === index ? 1 : 0,
    visibility:
      activeScene === index
        ? ("visible" as const)
        : ("hidden" as const),
    pointerEvents: "none" as const,
    transition: "opacity 180ms ease",
    willChange: "opacity",
  });

  const interpolate = (
    value: number,
    input: number[],
    output: number[]
  ) => {
    if (value <= input[0]) return output[0];

    for (let i = 1; i < input.length; i++) {
      if (value <= input[i]) {
        const t =
          (value - input[i - 1]) /
          (input[i] - input[i - 1]);

        return (
          output[i - 1] +
          (output[i] - output[i - 1]) * t
        );
      }
    }

    return output[output.length - 1];
  };

  const phoneY = interpolate(
    progress,
    [0, 0.15, 0.30, 0.45, 0.60, 0.75, 0.90, 1],
    [30, 0, -20, 0, 20, 0, -15, 0]
  );

  const phoneScale = interpolate(
    progress,
    [0, 0.5, 1],
    [0.96, 1, 0.98]
  );

  const orderProgress = Math.min(
    1,
    Math.max(0, (progress - 0.42) / 0.11)
  );

  const orderX = `${orderProgress * 100}%`;

  const titleOpacity = activeScene === 0 ? 1 : 0;

  /* -------------------------------------------------------
     RETURN
  ------------------------------------------------------- */

  return (
    <section
      ref={sectionRef}
      id="restro-experience"
      className="order-story"
    >

      <div className="story-sticky">

        {/* BACKGROUND */}

        <div className="glow glow-1" />
        <div className="glow glow-2" />

        {/* =================================================
            MAIN INTRO
        ================================================= */}

        <motion.div
          className="story-intro"
          style={{ opacity: titleOpacity }}
        >
          <span>
            RESTRO EXPERIENCE
          </span>

          <h2>
            Everything starts
            <br />
            with <em>one scan.</em>
          </h2>

          <p>
            Follow one real restaurant order from QR scan
            to payment — completely live.
          </p>
        </motion.div>

        {/* =================================================
            STEP 1 — SCAN
        ================================================= */}

        <motion.div
          className="story-scene scan-scene"
          style={sceneStyle(0)}
        >

          <div className="customer-area">
            <Customer />
            <Table />
          </div>

          <motion.div
            className="scan-phone"
            style={{
              y: phoneY,
              scale: phoneScale,
            }}
          >
            <Phone>
              <ScanScreen />
            </Phone>
          </motion.div>

        </motion.div>

        {/* =================================================
            STEP 2 — MENU
        ================================================= */}

        <motion.div
          className="story-scene"
          style={sceneStyle(1)}
        >

          <div className="customer-area">
            <Customer />
            <Table />
          </div>

          <motion.div
            className="menu-phone"
            style={{
              y: phoneY,
              scale: phoneScale,
            }}
          >
            <Phone>
              <MenuScreen />
            </Phone>
          </motion.div>

          <div className="floating-message">
            <span>
              LIVE MENU
            </span>

            <strong>
              Browse · Tap · Add
            </strong>
          </div>

        </motion.div>

        {/* =================================================
            STEP 3 — CART
        ================================================= */}

        <motion.div
          className="story-scene"
          style={sceneStyle(2)}
        >

          <div className="copy-left">
            <span>
              03 · CUSTOMER
            </span>

            <h2>
              One tap and
              <br />
              the order is live.
            </h2>

            <p>
              The customer reviews the cart and places
              the order directly from the table.
            </p>
          </div>

          <motion.div
            className="cart-phone"
            style={{
              y: phoneY,
              scale: phoneScale,
            }}
          >
            <Phone>
              <CartScreen />
            </Phone>
          </motion.div>

        </motion.div>

        {/* =================================================
            STEP 4 — ORDER TRAVEL
        ================================================= */}

        <motion.div
          className="story-scene dark-scene"
          style={sceneStyle(3)}
        >

          <div className="transfer-title">
            <span>
              04 · REAL-TIME
            </span>

            <h2>
              Your order is already
              <br />
              on its way to the kitchen.
            </h2>
          </div>

          <div className="transfer">

            <div className="tiny-phone">
              <Phone>
                <OrderScreen />
              </Phone>
            </div>

            <div className="travel-track">

              <motion.div
                className="travel-fill"
                style={{
                  width: orderX,
                }}
              />

              <motion.div
                className="flying-order"
                style={{
                  left: orderX,
                }}
              >
                <strong>
                  ORDER #104
                </strong>

                <small>
                  ₹480
                </small>
              </motion.div>

            </div>

            <div className="kitchen-monitor">
              <span>
                KITCHEN DISPLAY
              </span>

              <strong>
                LIVE
              </strong>

              <div>
                ORDER #104
              </div>
            </div>

          </div>

        </motion.div>

        {/* =================================================
            STEP 5 — KITCHEN
        ================================================= */}

        <motion.div
          className="story-scene kitchen-scene"
          style={sceneStyle(4)}
        >

          <div className="chef">
            <div className="chef-hat">
              CHEF
            </div>

            <div className="chef-head" />
            <div className="chef-body" />
          </div>

          <div className="kitchen-copy">

            <span>
              05 · KITCHEN
            </span>

            <h2>
              The kitchen knows.
              <br />
              <em>Instantly.</em>
            </h2>

            <p>
              No waiter. No shouting across the room.
              The order appears directly on the kitchen display.
            </p>

          </div>

          <KitchenCard />

        </motion.div>

        {/* =================================================
            STEP 6 — PREPARING
        ================================================= */}

        <motion.div
          className="story-scene preparing-scene"
          style={sceneStyle(5)}
        >

          <div className="preparing-copy">

            <span>
              06 · PREPARING
            </span>

            <h2>
              Preparing —
              <br />
              and the guest can
              see it happen.
            </h2>

          </div>

          <div className="cooking-area">

            <div className="chef cooking-chef">

              <div className="chef-hat">
                CHEF
              </div>

              <div className="chef-head" />
              <div className="chef-body" />

            </div>

            <div className="counter">
              <span>🥕</span>
              <span>🍳</span>
              <span>🍽️</span>
            </div>

          </div>

          <motion.div
            className="status-phone"
            style={{
              y: phoneY,
              scale: phoneScale,
            }}
          >
            <Phone>
              <PreparingScreen />
            </Phone>
          </motion.div>

        </motion.div>

        {/* =================================================
            STEP 7 — READY
        ================================================= */}

        <motion.div
          className="story-scene ready-scene"
          style={sceneStyle(6)}
        >

          <div className="food-area">

            <div className="big-plate">
              🍽️
            </div>

            <motion.div
              className="food food-1"
              style={{
                y: interpolate(progress, [0.80, 0.88], [30, -30]),
              }}
            >
              🥗
            </motion.div>

            <motion.div
              className="food food-2"
              style={{
                y: interpolate(progress, [0.80, 0.88], [50, -20]),
              }}
            >
              🍅
            </motion.div>

            <motion.div
              className="food food-3"
              style={{
                y: interpolate(progress, [0.80, 0.88], [40, -40]),
              }}
            >
              🥕
            </motion.div>

          </div>

          <div className="ready-copy">

            <span>
              07 · READY
            </span>

            <h2>
              Order ready.
              <br />
              Nobody had to ask.
            </h2>

            <p>
              The customer gets the live status immediately.
            </p>

          </div>

          <motion.div
            className="ready-phone"
            style={{
              y: phoneY,
              scale: phoneScale,
            }}
          >
            <Phone>
              <ReadyScreen />
            </Phone>
          </motion.div>

        </motion.div>

        {/* =================================================
            STEP 8 — PAYMENT
        ================================================= */}

        <motion.div
          className="story-scene payment-scene"
          style={sceneStyle(7)}
        >

          <div className="payment-title">

            <span>
              08 · PAYMENT
            </span>

            <h2>
              Customer → RESTRO →
              <br />
              Restaurant. In seconds.
            </h2>

            <p>
              One connected system from the first scan
              to the final payment.
            </p>

          </div>

          <div className="bill">

            <span>
              BILL · ORDER #104
            </span>

            <h3>
              ₹450
            </h3>

            <div>
              <span>Food</span>
              <b>₹420</b>
            </div>

            <div>
              <span>Tax</span>
              <b>₹30</b>
            </div>

            <hr />

            <strong>
              Total ₹450
            </strong>

            <div className="method selected">
              📱 UPI
            </div>

            <div className="method">
              💳 Card
            </div>

            <div className="method">
              💵 Cash
            </div>

          </div>

          <motion.div
            className="payment-phone"
            style={{
              y: phoneY,
              scale: phoneScale,
            }}
          >
            <Phone>
              <PaymentScreen />
            </Phone>
          </motion.div>

          <div className="payment-dashboard">

            <span>
              PAYMENTS · LIVE
            </span>

            <h3>
              Payment received
            </h3>

            <strong>
              ₹450
            </strong>

            <small>
              ORDER #104 · UPI · PAID
            </small>

            <div className="dashboard-check">
              ✓
            </div>

          </div>

        </motion.div>

        {/* =================================================
            RIGHT SIDE PROGRESS
        ================================================= */}

        <div className="story-progress">

          {steps.map((step, i) => (
            <ProgressItem
              key={step}
              label={step}
              index={i}
              progress={progress}
            />
          ))}

        </div>

        {/* SCROLL HINT */}

        <div className="scroll-hint">
          ↓ SCROLL TO EXPLORE
        </div>

      </div>

      {/* ===================================================
          CSS
      =================================================== */}

      <style jsx global>{`

        * {
          box-sizing: border-box;
        }

        .order-story {
          position: relative;
          display: block;
          width: 100%;
          height: 900vh;
          background: #f8f6ef;
        }

        .story-sticky {
          position: sticky;
          top: 0;
          width: 100%;
          height: 100vh;
          min-height: 700px;
          overflow: hidden;
          color: #17211b;
        }

        /* =================================================
           BACKGROUND
        ================================================= */

        .glow {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: #22c55e;
          filter: blur(120px);
          opacity: .12;
          pointer-events: none;
        }

        .glow-1 {
          right: -100px;
          top: 10%;
        }

        .glow-2 {
          left: -200px;
          bottom: -200px;
        }

        /* =================================================
           INTRO
        ================================================= */

        .story-intro {
          position: absolute;
          left: 10%;
          top: 14%;
          z-index: 20;
          max-width: 600px;
          transition: opacity 220ms ease;
        }

        .story-intro > span,
        .copy-left > span,
        .transfer-title > span,
        .kitchen-copy > span,
        .preparing-copy > span,
        .ready-copy > span,
        .payment-title > span {
          color: #16a34a;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .18em;
        }

        .story-intro h2 {
          margin: 15px 0;
          font-size: clamp(48px, 6vw, 78px);
          line-height: .94;
          letter-spacing: -.06em;
          font-weight: 900;
        }

        .story-intro em,
        .kitchen-copy em {
          color: #22c55e;
          font-style: normal;
        }

        .story-intro p {
          max-width: 460px;
          color: #717a74;
          font-size: 16px;
          line-height: 1.6;
        }

        /* =================================================
           SCENE
        ================================================= */

        .story-scene {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          isolation: isolate;
          transition: opacity 220ms ease;
        }

        /* =================================================
           CUSTOMER
        ================================================= */

        .customer-area {
          position: absolute;
          left: 14%;
          bottom: 15%;
          width: 300px;
          height: 300px;
        }

        .customer {
          position: absolute;
          left: 75px;
          top: 10px;
          width: 90px;
          height: 170px;
        }

        .customer-head {
          position: absolute;
          left: 13px;
          top: 0;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #efbd91;
        }

        .customer-body {
          position: absolute;
          left: 5px;
          top: 58px;
          width: 80px;
          height: 90px;
          border-radius: 30px 30px 12px 12px;
          background: #17899b;
        }

        .customer-arm {
          position: absolute;
          top: 75px;
          width: 16px;
          height: 60px;
          border-radius: 20px;
          background: #efbd91;
        }

        .customer-arm-left {
          left: 0;
        }

        .customer-arm-right {
          right: 0;
        }

        /* =================================================
           TABLE
        ================================================= */

        .table-wrap {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 280px;
        }

        .table-top {
          position: relative;
          height: 24px;
          border-radius: 50%;
          background: #b77b4f;
          box-shadow: 0 8px 0 rgba(80,50,30,.2);
        }

        .table-leg {
          width: 15px;
          height: 85px;
          margin: auto;
          background: #805536;
        }

        .table-qr {
          position: absolute;
          right: 42px;
          bottom: 12px;
          padding: 7px;
          background: white;
          border-radius: 9px;
          box-shadow: 0 10px 30px rgba(0,0,0,.15);
        }

        .table-qr span {
          display: block;
          margin-top: 3px;
          text-align: center;
          font-size: 6px;
          font-weight: 900;
        }

        /* =================================================
           QR
        ================================================= */

        .qr {
          width: 115px;
          height: 115px;
          padding: 10px;
          display: grid;
          grid-template-columns: repeat(7,1fr);
          gap: 3px;
          background: white;
          border: 3px solid #22c55e;
          border-radius: 12px;
        }

        .qr-small {
          width: 62px;
          height: 62px;
          padding: 6px;
          gap: 2px;
          border: 2px solid #17211b;
          border-radius: 6px;
        }

        .qr-block.active {
          background: #17211b;
        }

        .qr-block {
          background: transparent;
          border-radius: 1px;
        }

        /* =================================================
           PHONE
        ================================================= */

        .phone {
          position: relative;
          width: 270px;
          height: 550px;
          padding: 10px;
          border: 2px solid #27312d;
          border-radius: 42px;
          background: #111820;
          box-shadow:
            0 35px 80px rgba(0,0,0,.2),
            0 0 55px rgba(34,197,94,.15);
        }

        .phone-screen {
          position: relative;
          width: 100%;
          height: 100%;
          padding: 20px 14px;
          overflow: hidden;
          border-radius: 34px;
          background: white;
          color: #17211b;
        }

        .phone-notch {
          position: absolute;
          z-index: 10;
          top: 14px;
          left: 50%;
          width: 85px;
          height: 22px;
          border-radius: 20px;
          background: #0d1115;
          transform: translateX(-50%);
        }

        .scan-phone {
          position: absolute;
          right: 17%;
          bottom: 8%;
        }

        .menu-phone {
          position: absolute;
          right: 15%;
          bottom: 9%;
        }

        .cart-phone {
          position: absolute;
          right: 18%;
          bottom: 9%;
        }

        /* =================================================
           SCAN
        ================================================= */

        .scan-screen {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }

        .scan-brand {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .15em;
          color: #737b75;
        }

        .scan-screen strong {
          font-size: 12px;
          letter-spacing: .08em;
        }

        .table-pill {
          padding: 8px 18px;
          border-radius: 50px;
          background: #e6f8eb;
          color: #159447;
          font-size: 11px;
          font-weight: 900;
        }

        /* =================================================
           PHONE UI
        ================================================= */

        .phone-status {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          color: #59625c;
          font-size: 8px;
          font-weight: 900;
        }

        .browser {
          margin-bottom: 13px;
          padding: 7px 9px;
          border-radius: 20px;
          background: #f1f2ef;
          color: #737b75;
          font-size: 8px;
        }

        .menu-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .menu-header strong {
          display: block;
          font-size: 15px;
        }

        .menu-header small {
          color: #929992;
          font-size: 8px;
        }

        .cart-icon {
          padding: 7px 9px;
          border-radius: 20px;
          background: #f3f4f0;
          font-size: 8px;
        }

        .categories {
          display: flex;
          gap: 4px;
          margin: 13px 0 9px;
          overflow: hidden;
        }

        .categories span {
          flex-shrink: 0;
          padding: 5px 8px;
          border-radius: 20px;
          background: #f2f3ef;
          font-size: 7px;
        }

        .categories .active {
          background: #d8f4df;
          color: #159447;
          font-weight: 900;
        }

        .product {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 6px;
          padding: 7px;
          border: 1px solid #eceee9;
          border-radius: 12px;
        }

        .product-image {
          width: 38px;
          height: 38px;
          flex-shrink: 0;
          border-radius: 9px;
          background: #ffc461;
        }

        .product-1 {
          background: #f4d89b;
        }

        .product-2 {
          background: #62c6e5;
        }

        .product-3 {
          background: #ff9c63;
        }

        .product-4 {
          background: #edb09c;
        }

        .product-info {
          flex: 1;
        }

        .product-info strong {
          display: block;
          font-size: 8px;
        }

        .product-info small {
          display: block;
          color: #969e99;
          font-size: 6px;
        }

        .product-info b {
          color: #20a950;
          font-size: 8px;
        }

        .product button {
          border: 0;
          border-radius: 7px;
          padding: 5px 8px;
          background: #20b957;
          color: white;
          font-size: 7px;
          font-weight: 900;
        }

        /* =================================================
           FLOATING
        ================================================= */

        .floating-message {
          position: absolute;
          right: 42%;
          top: 48%;
          padding: 15px 20px;
          border-radius: 15px;
          background: white;
          box-shadow: 0 20px 50px rgba(0,0,0,.1);
        }

        .floating-message span {
          display: block;
          color: #16a34a;
          font-size: 8px;
          font-weight: 900;
        }

        .floating-message strong {
          display: block;
          margin-top: 5px;
          font-size: 12px;
        }

        /* =================================================
           CART
        ================================================= */

        .copy-left {
          position: absolute;
          left: 10%;
          top: 32%;
          width: 420px;
        }

        .copy-left h2,
        .transfer-title h2,
        .kitchen-copy h2,
        .preparing-copy h2,
        .ready-copy h2 {
          margin: 15px 0;
          font-size: clamp(40px, 4.5vw, 65px);
          line-height: .96;
          letter-spacing: -.055em;
          font-weight: 900;
        }

        .copy-left p,
        .kitchen-copy p,
        .ready-copy p {
          max-width: 400px;
          color: #707a74;
          line-height: 1.6;
        }

        .screen-title {
          margin: 15px 0;
          font-size: 20px;
        }

        .cart-items,
        .cart-summary {
          margin-bottom: 10px;
          padding: 12px;
          border-radius: 14px;
          background: #f7f8f4;
        }

        .cart-items div,
        .cart-summary div {
          display: flex;
          justify-content: space-between;
          padding: 7px 0;
          font-size: 9px;
        }

        .cart-summary {
          background: #efeee8;
        }

        .cart-summary hr {
          border: 0;
          border-top: 1px solid #ddd;
        }

        .cart-total {
          font-size: 13px !important;
        }

        .place-order {
          width: 100%;
          border: 0;
          padding: 13px;
          border-radius: 12px;
          background: #22b957;
          color: white;
          font-size: 9px;
          font-weight: 900;
        }

        /* =================================================
           DARK TRANSFER
        ================================================= */

        .dark-scene {
          background:
            radial-gradient(
              circle at 20% 60%,
              rgba(34,197,94,.14),
              transparent 30%
            ),
            #101923;
          color: white;
        }

        .transfer-title {
          position: absolute;
          top: 11%;
          left: 50%;
          width: 850px;
          text-align: center;
          transform: translateX(-50%);
        }

        .transfer-title h2 {
          color: white;
        }

        .transfer {
          position: absolute;
          left: 9%;
          right: 9%;
          top: 45%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 35px;
        }

        .tiny-phone .phone {
          width: 150px;
          height: 300px;
          border-radius: 25px;
        }

        .tiny-phone .phone-screen {
          border-radius: 19px;
          padding: 10px;
        }

        .travel-track {
          position: relative;
          flex: 1;
          height: 4px;
          border-radius: 20px;
          background: rgba(255,255,255,.12);
        }

        .travel-fill {
          position: absolute;
          inset: 0 auto 0 0;
          border-radius: 20px;
          background: #22c55e;
        }

        .flying-order {
          position: absolute;
          top: -28px;
          padding: 9px 14px;
          border-radius: 12px;
          background: white;
          color: #17211b;
          transform: translateX(-50%);
          white-space: nowrap;
          font-size: 9px;
          box-shadow: 0 10px 30px rgba(0,0,0,.2);
        }

        .flying-order small {
          margin-left: 10px;
          color: #16a34a;
        }

        .kitchen-monitor {
          width: 190px;
          height: 125px;
          padding: 18px;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 20px;
          background: rgba(255,255,255,.04);
        }

        .kitchen-monitor span {
          font-size: 7px;
          color: #9ca8a0;
        }

        .kitchen-monitor strong {
          display: block;
          margin-top: 6px;
          color: #22c55e;
          font-size: 10px;
        }

        .kitchen-monitor div {
          margin-top: 22px;
          color: white;
          font-size: 12px;
          font-weight: 900;
        }

        /* =================================================
           KITCHEN
        ================================================= */

        .kitchen-scene {
          background:
            linear-gradient(
              #edf7f4,
              #eaf4f1
            );
        }

        .kitchen-copy {
          position: absolute;
          left: 10%;
          top: 25%;
          width: 500px;
        }

        .chef {
          position: absolute;
          left: 10%;
          bottom: 15%;
          width: 170px;
          height: 250px;
        }

        .chef-head {
          width: 70px;
          height: 70px;
          margin: auto;
          border-radius: 50%;
          background: #efbd91;
        }

        .chef-body {
          width: 130px;
          height: 130px;
          margin: -3px auto;
          border-radius: 30px 30px 10px 10px;
          background: white;
        }

        .chef-hat {
          position: absolute;
          z-index: 2;
          top: -20px;
          left: 35px;
          padding: 8px 12px;
          border-radius: 30px;
          background: white;
          font-size: 8px;
          font-weight: 900;
        }

        .kitchen-card {
          position: absolute;
          right: 12%;
          top: 30%;
          width: 360px;
          padding: 25px;
          border-radius: 22px;
          background: white;
          color: #17211b;
          box-shadow: 0 25px 60px rgba(0,0,0,.13);
        }

        .kitchen-header {
          display: flex;
          justify-content: space-between;
          color: #ef4444;
          font-size: 9px;
          font-weight: 900;
        }

        .kitchen-header b {
          padding: 5px 10px;
          border-radius: 20px;
          background: #fef3c7;
          color: #a16207;
        }

        .kitchen-card h3 {
          margin: 18px 0 4px;
          font-size: 22px;
        }

        .kitchen-card > small {
          color: #9aa19c;
        }

        .kitchen-items {
          margin: 20px 0;
          padding: 12px 0;
          border-top: 1px solid #eceeea;
          border-bottom: 1px solid #eceeea;
        }

        .kitchen-items div {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          font-size: 12px;
        }

        .kitchen-total {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .kitchen-total strong {
          font-size: 22px;
          color: #16a34a;
        }

        .kitchen-card button {
          width: 100%;
          margin-top: 18px;
          padding: 13px;
          border: 0;
          border-radius: 10px;
          background: #22c55e;
          color: white;
          font-weight: 900;
        }

        /* =================================================
           PREPARING
        ================================================= */

        .preparing-scene {
          background:
            radial-gradient(
              circle at 75% 50%,
              rgba(34,197,94,.12),
              transparent 30%
            ),
            #fffaf0;
        }

        .preparing-copy {
          position: absolute;
          left: 10%;
          top: 16%;
          width: 700px;
        }

        .cooking-area {
          position: absolute;
          left: 25%;
          bottom: 17%;
          width: 430px;
          height: 200px;
        }

        .cooking-chef {
          left: 0;
          bottom: 0;
          transform: scale(.8);
          transform-origin: bottom center;
        }

        .counter {
          position: absolute;
          left: 100px;
          bottom: 15px;
          width: 350px;
          height: 18px;
          border-radius: 20px;
          background: #a7c6c5;
        }

        .counter span {
          margin-left: 35px;
          font-size: 40px;
        }

        .status-phone {
          position: absolute;
          right: 13%;
          bottom: 10%;
        }

        .live-label {
          margin-top: 35px;
          color: #777;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .12em;
        }

        .status-message {
          margin-top: 20px;
          padding: 15px;
          border-radius: 15px;
        }

        .status-message.purple {
          background: #f0ddff;
        }

        .status-message strong,
        .status-message small {
          display: block;
        }

        .status-message strong {
          font-size: 11px;
        }

        .status-message small {
          margin-top: 7px;
          color: #7c7085;
          font-size: 8px;
        }

        .phone-progress {
          height: 5px;
          margin-top: 20px;
          border-radius: 20px;
          background: #eee;
        }

        .phone-progress span {
          display: block;
          width: 72%;
          height: 100%;
          border-radius: 20px;
          background: #22c55e;
        }

        .phone-order-status {
          display: flex;
          justify-content: space-between;
          margin-top: 18px;
          font-size: 8px;
        }

        .phone-order-status b {
          padding: 6px 8px;
          border-radius: 20px;
          background: #eadbff;
          color: #8054a0;
        }

        /* =================================================
           READY
        ================================================= */

        .ready-scene {
          background:
            radial-gradient(
              circle at 80% 50%,
              rgba(34,197,94,.14),
              transparent 32%
            ),
            #f7faef;
        }

        .food-area {
          position: absolute;
          left: 15%;
          bottom: 20%;
          width: 330px;
          height: 240px;
        }

        .big-plate {
          position: absolute;
          bottom: 0;
          font-size: 150px;
        }

        .food {
          position: absolute;
          font-size: 45px;
        }

        .food-1 {
          left: 85px;
          bottom: 100px;
        }

        .food-2 {
          left: 145px;
          bottom: 85px;
        }

        .food-3 {
          left: 120px;
          bottom: 125px;
        }

        .ready-copy {
          position: absolute;
          left: 43%;
          top: 28%;
        }

        .ready-phone {
          position: absolute;
          right: 10%;
          bottom: 10%;
        }

        .ready-icon {
          width: 70px;
          height: 70px;
          display: grid;
          place-items: center;
          margin: 45px auto 20px;
          border-radius: 50%;
          background: #d9f6df;
          color: #16a34a;
          font-size: 35px;
          font-weight: 900;
        }

        .ready-phone-title {
          text-align: center;
          font-size: 19px;
        }

        .ready-phone-text {
          text-align: center;
          color: #7a827d;
          font-size: 9px;
        }

        .ready-pill {
          margin-top: 20px;
          padding: 9px;
          border-radius: 30px;
          background: #dff7e5;
          color: #159447;
          text-align: center;
          font-size: 8px;
          font-weight: 900;
        }

        /* =================================================
           PAYMENT
        ================================================= */

        .payment-scene {
          background:
            radial-gradient(
              circle at 50% 50%,
              rgba(34,197,94,.1),
              transparent 30%
            ),
            #111923;
          color: white;
        }

        .payment-title {
          position: absolute;
          top: 9%;
          left: 50%;
          width: 800px;
          text-align: center;
          transform: translateX(-50%);
        }

        .payment-title h2 {
          margin: 15px 0;
          font-size: clamp(42px, 5vw, 72px);
          line-height: .96;
          letter-spacing: -.055em;
        }

        .payment-title p {
          color: #89928d;
        }

        .payment-phone {
          position: absolute;
          left: 50%;
          bottom: 8%;
          transform: translateX(-50%);
        }

        .pay-title {
          margin-top: 55px;
          text-align: center;
          font-size: 9px;
          letter-spacing: .15em;
          font-weight: 900;
        }

        .payment-scene .qr {
          margin: 35px auto 20px;
        }

        .pay-amount {
          display: block;
          text-align: center;
          font-size: 28px;
        }

        .payment-success {
          margin-top: 20px;
          text-align: center;
          color: #16a34a;
          font-size: 9px;
          font-weight: 900;
        }

        .bill {
          position: absolute;
          left: 10%;
          top: 36%;
          width: 300px;
          padding: 25px;
          border-radius: 20px;
          background: white;
          color: #17211b;
        }

        .bill > span {
          font-size: 9px;
          font-weight: 900;
        }

        .bill h3 {
          margin: 15px 0;
          font-size: 32px;
        }

        .bill > div:not(.method) {
          display: flex;
          justify-content: space-between;
          margin: 8px 0;
          font-size: 12px;
        }

        .bill hr {
          border: 0;
          border-top: 1px solid #ddd;
        }

        .method {
          margin-top: 8px;
          padding: 11px;
          border: 1px solid #e5e8e3;
          border-radius: 10px;
          font-size: 11px;
        }

        .method.selected {
          border-color: #22c55e;
          background: #e7f8eb;
        }

        .payment-dashboard {
          position: absolute;
          right: 10%;
          top: 38%;
          width: 300px;
          padding: 25px;
          border-radius: 20px;
          background: white;
          color: #17211b;
        }

        .payment-dashboard > span {
          color: #16a34a;
          font-size: 9px;
          font-weight: 900;
        }

        .payment-dashboard h3 {
          margin: 15px 0 5px;
        }

        .payment-dashboard > strong {
          font-size: 30px;
          color: #16a34a;
        }

        .payment-dashboard small {
          display: block;
          margin-top: 10px;
          color: #7b837e;
        }

        .dashboard-check {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 35px;
          height: 35px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #d9f6df;
          color: #16a34a;
          font-weight: 900;
        }

        /* =================================================
           PROGRESS
        ================================================= */

        .story-progress {
          position: absolute;
          z-index: 50;
          right: 28px;
          top: 50%;
          display: flex;
          flex-direction: column;
          gap: 13px;
          transform: translateY(-50%);
        }

        .progress-item {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
        }

        .progress-item small {
          color: #69736d;
          font-size: 8px;
          font-weight: 800;
        }

        .progress-dot {
          width: 7px;
          height: 7px;
          display: block;
          border-radius: 50%;
          background: #aeb8b1;
        }

        .progress-item:first-child .progress-dot {
          background: #22c55e;
        }

        .scroll-hint {
          position: absolute;
          z-index: 60;
          bottom: 22px;
          left: 50%;
          color: #89928d;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .15em;
          transform: translateX(-50%);
        }

        /* =================================================
           RESPONSIVE
        ================================================= */

        @media (max-width: 1000px) {

          .story-intro {
            left: 6%;
          }

          .customer-area {
            left: 4%;
            transform: scale(.75);
            transform-origin: bottom left;
          }

          .scan-phone,
          .menu-phone,
          .cart-phone {
            right: 6%;
            transform-origin: bottom right;
          }

          .copy-left {
            left: 6%;
            width: 40%;
          }

          .copy-left h2,
          .kitchen-copy h2,
          .preparing-copy h2,
          .ready-copy h2 {
            font-size: 40px;
          }

          .kitchen-card {
            right: 5%;
            transform: scale(.75);
            transform-origin: right center;
          }

          .payment-title {
            width: 90%;
          }

          .bill {
            left: 4%;
            transform: scale(.75);
            transform-origin: left center;
          }

          .payment-dashboard {
            right: 4%;
            transform: scale(.75);
            transform-origin: right center;
          }

        }

        @media (max-width: 700px) {

          .order-story {
            height: 800vh;
          }

          .story-intro {
            left: 7%;
            top: 10%;
            max-width: 80%;
          }

          .story-intro h2 {
            font-size: 42px;
          }

          .story-intro p {
            font-size: 13px;
          }

          .customer-area {
            left: -20px;
            bottom: 10%;
            transform: scale(.55);
          }

          .scan-phone,
          .menu-phone,
          .cart-phone {
            right: 5%;
            bottom: 8%;
            transform: scale(.62);
          }

          .floating-message {
            display: none;
          }

          .copy-left {
            left: 7%;
            top: 25%;
            width: 45%;
          }

          .copy-left h2,
          .kitchen-copy h2,
          .preparing-copy h2,
          .ready-copy h2 {
            font-size: 32px;
          }

          .transfer {
            left: 5%;
            right: 5%;
            gap: 10px;
          }

          .tiny-phone .phone {
            width: 100px;
            height: 210px;
          }

          .kitchen-monitor {
            width: 120px;
            height: 100px;
          }

          .kitchen-copy {
            left: 6%;
            top: 15%;
            width: 45%;
          }

          .kitchen-card {
            right: -15%;
            transform: scale(.55);
          }

          .preparing-copy {
            left: 7%;
            top: 12%;
            width: 60%;
          }

          .cooking-area {
            left: 2%;
            transform: scale(.65);
            transform-origin: bottom left;
          }

          .status-phone {
            right: -3%;
            transform: scale(.58);
            transform-origin: bottom right;
          }

          .food-area {
            left: 2%;
            transform: scale(.6);
            transform-origin: bottom left;
          }

          .ready-copy {
            left: 40%;
            top: 20%;
            width: 45%;
          }

          .ready-phone {
            right: -5%;
            transform: scale(.55);
            transform-origin: bottom right;
          }

          .payment-title {
            top: 7%;
          }

          .payment-title h2 {
            font-size: 38px;
          }

          .bill {
            left: -5%;
            top: 45%;
            transform: scale(.55);
          }

          .payment-phone {
            bottom: 5%;
            transform: translateX(-50%) scale(.55);
            transform-origin: bottom center;
          }

          .payment-dashboard {
            right: -5%;
            top: 45%;
            transform: scale(.55);
          }

          .story-progress {
            right: 8px;
          }

          .progress-item small {
            display: none;
          }

        }

      `}</style>

    </section>
  );
}