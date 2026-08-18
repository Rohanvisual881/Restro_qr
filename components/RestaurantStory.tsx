"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  MotionValue,
} from "framer-motion";

const GREEN = "#22c55e";

function QRCode() {
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
    <div className="qr">
      {blocks.map((x, i) => (
        <span
          key={i}
          className={x ? "qr-block active" : "qr-block"}
        />
      ))}
    </div>
  );
}

function Phone({
  children,
  progress,
}: {
  children: React.ReactNode;
  progress?: MotionValue<number>;
}) {
  return (
    <motion.div
      className="phone"
      style={
        progress
          ? {
              y: useTransform(progress, [0, 1], [30, -30]),
            }
          : undefined
      }
    >
      <div className="phone-notch" />
      <div className="phone-screen">{children}</div>
    </motion.div>
  );
}

function Person() {
  return (
    <div className="person">
      <div className="person-head" />
      <div className="person-body" />
      <div className="person-arm left" />
      <div className="person-arm right" />
    </div>
  );
}

function Table() {
  return (
    <div className="table-area">
      <div className="table-top">
        <div className="table-qr">
          <QRCode />
          <span>TABLE 12</span>
        </div>
      </div>
      <div className="table-leg" />
    </div>
  );
}

function MenuScreen() {
  return (
    <>
      <div className="status-bar">
        <span>9:41</span>
        <span>5G ▮▮</span>
      </div>

      <div className="browser-bar">
        🔒 storemagic.restro.in
      </div>

      <div className="menu-title">
        <div>
          <strong>Store Magic</strong>
          <small>Table 12</small>
        </div>
        <span className="avatar">SM</span>
      </div>

      <div className="categories">
        <span>Popular</span>
        <span>Pizza</span>
        <span>Drinks</span>
      </div>

      {[
        ["Paneer Tikka", "₹220"],
        ["Butter Naan", "₹60"],
        ["Cold Drink", "₹50"],
        ["Veg Pizza", "₹260"],
      ].map(([name, price], i) => (
        <div className="food-item" key={i}>
          <div className={`food-image food-${i}`} />
          <div className="food-info">
            <strong>{name}</strong>
            <small>Freshly prepared</small>
          </div>
          <div>
            <b>{price}</b>
            <button>ADD</button>
          </div>
        </div>
      ))}
    </>
  );
}

function CartScreen() {
  return (
    <>
      <div className="status-bar">
        <span>9:41</span>
        <span>5G ▮▮</span>
      </div>

      <div className="browser-bar">
        🔒 storemagic.restro.in/cart
      </div>

      <h3 className="screen-heading">Your Cart</h3>

      <div className="cart-box">
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

      <div className="bill">
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
        <div className="total">
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

function OrderScreen() {
  return (
    <>
      <div className="status-bar">
        <span>9:41</span>
        <span>5G ▮▮</span>
      </div>

      <div className="success-icon">✓</div>

      <h3 className="order-success">
        Order placed!
      </h3>

      <div className="order-number">
        ORDER #104
      </div>

      <div className="order-status">
        <span className="live-dot" />
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

function PreparingScreen() {
  return (
    <>
      <div className="status-bar">
        <span>9:41</span>
        <span>5G ▮▮</span>
      </div>

      <div className="status-card purple">
        👨‍🍳
        <strong>Your food is being prepared</strong>
        <small>Kitchen is working on your order</small>
      </div>

      <div className="progress-line">
        <span />
      </div>

      <div className="live-order">
        <strong>ORDER #104</strong>
        <span>PREPARING</span>
      </div>
    </>
  );
}

function ReadyScreen() {
  return (
    <>
      <div className="status-bar">
        <span>9:41</span>
        <span>5G ▮▮</span>
      </div>

      <div className="ready-big">
        ✓
      </div>

      <h3 className="ready-title">
        Your order is ready!
      </h3>

      <p className="ready-text">
        Please collect your food from the server.
      </p>

      <div className="ready-badge">
        🍽️ READY TO SERVE
      </div>
    </>
  );
}

function PaymentScreen() {
  return (
    <>
      <div className="status-bar">
        <span>9:41</span>
        <span>5G ▮▮</span>
      </div>

      <div className="payment-title">
        SCAN TO PAY
      </div>

      <QRCode />

      <strong className="payment-amount">
        ₹450
      </strong>

      <div className="payment-success">
        ✓ PAYMENT SUCCESSFUL
      </div>
    </>
  );
}

function KitchenCard() {
  return (
    <div className="kitchen-card">
      <div className="kitchen-top">
        <span>NEW ORDER</span>
        <span className="new-pill">NEW</span>
      </div>

      <h3>ORDER #104</h3>

      <small>Table 12 · Dine-in</small>

      <div className="kitchen-items">
        <div>Paneer Tikka <b>×2</b></div>
        <div>Butter Naan <b>×2</b></div>
        <div>Cold Drink <b>×1</b></div>
      </div>

      <div className="kitchen-total">
        <span>Total</span>
        <strong>₹480</strong>
      </div>

      <button>ACCEPT ORDER</button>
    </div>
  );
}

export default function OrderStory() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // ----------------------------
  // SCENE OPACITY
  // ----------------------------

  const scanOpacity = useTransform(
    scrollYProgress,
    [0, 0.09, 0.13],
    [1, 1, 0]
  );

  const menuOpacity = useTransform(
    scrollYProgress,
    [0.10, 0.16, 0.25, 0.30],
    [0, 1, 1, 0]
  );

  const cartOpacity = useTransform(
    scrollYProgress,
    [0.26, 0.32, 0.40, 0.44],
    [0, 1, 1, 0]
  );

  const orderOpacity = useTransform(
    scrollYProgress,
    [0.40, 0.46, 0.52, 0.56],
    [0, 1, 1, 0]
  );

  const kitchenOpacity = useTransform(
    scrollYProgress,
    [0.52, 0.58, 0.65, 0.69],
    [0, 1, 1, 0]
  );

  const preparingOpacity = useTransform(
    scrollYProgress,
    [0.65, 0.70, 0.77, 0.81],
    [0, 1, 1, 0]
  );

  const readyOpacity = useTransform(
    scrollYProgress,
    [0.76, 0.82, 0.87, 0.90],
    [0, 1, 1, 0]
  );

  const paymentOpacity = useTransform(
    scrollYProgress,
    [0.86, 0.92, 0.97, 1],
    [0, 1, 1, 1]
  );

  // ----------------------------
  // ORDER TRAVEL LINE
  // ----------------------------

  const orderX = useTransform(
    scrollYProgress,
    [0.42, 0.52],
    ["0%", "100%"]
  );

  // ----------------------------
  // PHONE MOVEMENT
  // ----------------------------

  const phoneY = useTransform(
    scrollYProgress,
    [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9],
    [50, 0, -20, 0, 20, 0, -10]
  );

  // ----------------------------
  // TITLE CHANGES
  // ----------------------------

  const titleOpacity = useTransform(
    scrollYProgress,
    [0, 0.10, 0.12, 0.28, 0.30, 0.43, 0.45, 0.58, 0.60, 0.73, 0.75, 0.88, 0.90],
    [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
  );

  // ----------------------------
  // STEP DOTS
  // ----------------------------

  const steps = [
    "Scan & Order",
    "Menu",
    "Cart",
    "Kitchen",
    "Preparing",
    "Ready",
    "Payment",
  ];

  return (
    <section
      ref={sectionRef}
      className="order-story"
    >
      <div className="story-sticky">

        {/* BACKGROUND GLOW */}
        <div className="green-glow glow-one" />
        <div className="green-glow glow-two" />

        {/* TITLE */}

        <motion.div
          className="story-title"
          style={{ opacity: titleOpacity }}
        >
          <span>RESTRO EXPERIENCE</span>
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

        {/* =========================
            STEP 1 — SCAN
        ========================= */}

        <motion.div
          className="scene"
          style={{ opacity: scanOpacity }}
        >
          <div className="customer-side">
            <Person />
            <Table />
          </div>

          <motion.div
            className="scan-phone-wrap"
            style={{ y: phoneY }}
          >
            <Phone>
              <div className="scan-screen">
                <small>STORE MAGIC</small>
                <QRCode />
                <strong>SCANNING TABLE QR</strong>
                <span>TABLE 12</span>
              </div>
            </Phone>
          </motion.div>
        </motion.div>

        {/* =========================
            STEP 2 — MENU
        ========================= */}

        <motion.div
          className="scene"
          style={{ opacity: menuOpacity }}
        >
          <div className="customer-side">
            <Person />
            <Table />
          </div>

          <motion.div
            className="phone-right"
            style={{ y: phoneY }}
          >
            <Phone>
              <MenuScreen />
            </Phone>
          </motion.div>

          <div className="floating-label">
            <span>LIVE MENU</span>
            <b>Browse · Tap · Add</b>
          </div>
        </motion.div>

        {/* =========================
            STEP 3 — CART
        ========================= */}

        <motion.div
          className="scene"
          style={{ opacity: cartOpacity }}
        >
          <div className="scene-copy left-copy">
            <span>03 · CUSTOMER</span>
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
            className="phone-center-right"
            style={{ y: phoneY }}
          >
            <Phone>
              <CartScreen />
            </Phone>
          </motion.div>
        </motion.div>

        {/* =========================
            STEP 4 — ORDER TRAVEL
        ========================= */}

        <motion.div
          className="scene dark-scene"
          style={{ opacity: orderOpacity }}
        >
          <div className="transfer-title">
            <span>04 · REAL-TIME</span>
            <h2>
              Your order is already
              <br />
              on its way to the kitchen.
            </h2>
          </div>

          <div className="transfer-area">

            <div className="small-phone">
              <Phone>
                <OrderScreen />
              </Phone>
            </div>

            <div className="travel-line">
              <motion.div
                className="travel-progress"
                style={{ width: orderX }}
              />

              <motion.div
                className="order-flying"
                style={{ left: orderX }}
              >
                ORDER #104
                <small>₹480</small>
              </motion.div>
            </div>

            <div className="mini-kitchen">
              <div className="monitor">
                KITCHEN
                <strong>LIVE</strong>
              </div>
            </div>

          </div>
        </motion.div>

        {/* =========================
            STEP 5 — KITCHEN
        ========================= */}

        <motion.div
          className="scene kitchen-scene"
          style={{ opacity: kitchenOpacity }}
        >
          <div className="chef">
            <div className="chef-hat">CHEF</div>
            <div className="chef-head" />
            <div className="chef-body" />
          </div>

          <div className="kitchen-copy">
            <span>05 · KITCHEN</span>
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

        {/* =========================
            STEP 6 — PREPARING
        ========================= */}

        <motion.div
          className="scene preparing-scene"
          style={{ opacity: preparingOpacity }}
        >
          <div className="chef cooking">
            <div className="chef-hat">CHEF</div>
            <div className="chef-head" />
            <div className="chef-body" />
          </div>

          <div className="counter">
            <div className="pan">
              🍳
            </div>
            <div className="plate">
              🍽️
            </div>
          </div>

          <div className="preparing-copy">
            <span>06 · PREPARING</span>
            <h2>
              Preparing —
              <br />
              and the guest can see it happen.
            </h2>
          </div>

          <Phone>
            <PreparingScreen />
          </Phone>
        </motion.div>

        {/* =========================
            STEP 7 — READY
        ========================= */}

        <motion.div
          className="scene ready-scene"
          style={{ opacity: readyOpacity }}
        >
          <div className="food-animation">
            <div className="plate-big">🍽️</div>
            <div className="food-pop">🥗</div>
            <div className="food-pop second">🍅</div>
            <div className="food-pop third">🥕</div>
          </div>

          <div className="ready-copy">
            <span>07 · READY</span>
            <h2>
              Order ready.
              <br />
              Nobody had to ask.
            </h2>
            <p>
              The customer gets the live status immediately.
            </p>
          </div>

          <Phone>
            <ReadyScreen />
          </Phone>
        </motion.div>

        {/* =========================
            STEP 8 — PAYMENT
        ========================= */}

        <motion.div
          className="scene payment-scene"
          style={{ opacity: paymentOpacity }}
        >
          <div className="payment-bill">
            <span>BILL · ORDER #104</span>

            <h3>₹450</h3>

            <div>Food <b>₹420</b></div>
            <div>Tax <b>₹30</b></div>

            <hr />

            <strong>Total ₹450</strong>

            <div className="payment-method selected">
              📱 UPI
            </div>

            <div className="payment-method">
              💳 Card
            </div>

            <div className="payment-method">
              💵 Cash
            </div>
          </div>

          <Phone>
            <PaymentScreen />
          </Phone>

          <div className="payment-dashboard">
            <span>PAYMENTS</span>
            <h3>Payment received</h3>
            <strong>₹450</strong>
            <small>ORDER #104 · UPI · PAID</small>
            <div className="payment-check">✓</div>
          </div>

          <div className="final-message">
            <span>RESTRO</span>
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
        </motion.div>

        {/* =========================
            RIGHT PROGRESS
        ========================= */}

        <div className="story-progress">
          {steps.map((step, i) => {
            const start = i / steps.length;
            const end = (i + 1) / steps.length;

            const opacity = useTransform(
              scrollYProgress,
              [start, end],
              [0.35, 1]
            );

            return (
              <motion.div
                className="progress-item"
                key={step}
                style={{ opacity }}
              >
                <span className="progress-dot" />
                <small>{step}</small>
              </motion.div>
            );
          })}
        </div>

        <div className="scroll-hint">
          ↓ SCROLL TO EXPLORE
        </div>

      </div>

      {/* =========================
          STYLES
      ========================= */}

      <style jsx>{`
        .order-story {
          position: relative;
          height: 900vh;
          background:
            radial-gradient(
              circle at 70% 35%,
              rgba(34, 197, 94, 0.13),
              transparent 30%
            ),
            #f8f6ef;
        }

        .story-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          min-height: 700px;
          overflow: hidden;
          color: #17211b;
        }

        .green-glow {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.15;
          background: #22c55e;
          pointer-events: none;
        }

        .glow-one {
          right: 8%;
          top: 15%;
        }

        .glow-two {
          left: 5%;
          bottom: -20%;
        }

        .story-title {
          position: absolute;
          top: 8%;
          left: 8%;
          z-index: 5;
          max-width: 620px;
        }

        .story-title span,
        .scene-copy span,
        .transfer-title span,
        .kitchen-copy span,
        .preparing-copy span,
        .ready-copy span {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.18em;
          color: #16a34a;
        }

        .story-title h2 {
          font-size: clamp(42px, 5vw, 76px);
          line-height: 0.98;
          letter-spacing: -0.055em;
          margin: 15px 0;
          font-weight: 800;
        }

        .story-title em,
        .kitchen-copy em {
          color: #22c55e;
          font-style: normal;
        }

        .story-title p {
          max-width: 470px;
          color: #69736d;
          font-size: 16px;
          line-height: 1.6;
        }

        .scene {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .customer-side {
          position: absolute;
          left: 15%;
          bottom: 14%;
          width: 300px;
          height: 300px;
        }

        .person {
          position: absolute;
          left: 80px;
          top: 10px;
          width: 90px;
          height: 150px;
        }

        .person-head {
          position: absolute;
          width: 65px;
          height: 65px;
          border-radius: 50%;
          background: #efbd91;
          left: 12px;
          top: 0;
        }

        .person-body {
          position: absolute;
          left: 4px;
          top: 58px;
          width: 80px;
          height: 90px;
          border-radius: 35px 35px 12px 12px;
          background: #17899b;
        }

        .person-arm {
          position: absolute;
          width: 16px;
          height: 65px;
          border-radius: 20px;
          background: #efbd91;
          top: 72px;
        }

        .person-arm.left {
          left: -3px;
          transform: rotate(12deg);
        }

        .person-arm.right {
          right: -3px;
          transform: rotate(-12deg);
        }

        .table-area {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 280px;
        }

        .table-top {
          height: 25px;
          border-radius: 50%;
          background: #b77b4f;
          box-shadow: 0 8px 0 rgba(100, 65, 40, 0.2);
          position: relative;
        }

        .table-leg {
          width: 16px;
          height: 90px;
          margin: auto;
          background: #805536;
        }

        .table-qr {
          position: absolute;
          right: 45px;
          bottom: 15px;
          background: white;
          border-radius: 10px;
          padding: 7px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .table-qr span {
          display: block;
          font-size: 6px;
          font-weight: 800;
          text-align: center;
          margin-top: 4px;
        }

        .qr {
          width: 110px;
          height: 110px;
          padding: 10px;
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 3px;
          background: white;
          border: 3px solid #22c55e;
          border-radius: 10px;
          margin: auto;
        }

        .table-qr .qr {
          width: 65px;
          height: 65px;
          padding: 6px;
          gap: 2px;
          border: 2px solid #18221c;
          border-radius: 5px;
        }

        .qr-block {
          background: transparent;
          border-radius: 1px;
        }

        .qr-block.active {
          background: #17211b;
        }

        .phone {
          position: relative;
          width: 270px;
          height: 550px;
          border-radius: 42px;
          background: #121922;
          padding: 10px;
          box-shadow:
            0 35px 80px rgba(0, 0, 0, 0.18),
            0 0 50px rgba(34, 197, 94, 0.14);
          border: 2px solid #26312d;
        }

        .phone-screen {
          width: 100%;
          height: 100%;
          border-radius: 34px;
          background: white;
          overflow: hidden;
          color: #17211b;
          padding: 20px 14px;
        }

        .phone-notch {
          position: absolute;
          z-index: 10;
          top: 15px;
          left: 50%;
          transform: translateX(-50%);
          width: 85px;
          height: 22px;
          border-radius: 20px;
          background: #10151a;
        }

        .scan-phone-wrap {
          position: absolute;
          right: 17%;
          bottom: 8%;
        }

        .scan-screen {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }

        .scan-screen small {
          font-weight: 800;
          letter-spacing: 0.12em;
          color: #6d756f;
        }

        .scan-screen strong {
          font-size: 13px;
          letter-spacing: 0.08em;
        }

        .scan-screen span {
          background: #e9f9ed;
          color: #159447;
          padding: 8px 18px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 800;
        }

        .phone-right {
          position: absolute;
          right: 15%;
          bottom: 9%;
        }

        .phone-center-right {
          position: absolute;
          right: 18%;
          bottom: 9%;
        }

        .status-bar {
          display: flex;
          justify-content: space-between;
          font-size: 9px;
          font-weight: 800;
          margin-bottom: 14px;
          color: #5b645e;
        }

        .browser-bar {
          background: #f1f2ef;
          border-radius: 20px;
          padding: 7px 10px;
          font-size: 8px;
          color: #6c756f;
          margin-bottom: 14px;
        }

        .menu-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .menu-title strong {
          display: block;
          font-size: 16px;
        }

        .menu-title small {
          display: block;
          font-size: 8px;
          color: #8a928c;
          margin-top: 3px;
        }

        .avatar {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #e7f7eb;
          color: #159447;
          font-size: 9px;
          font-weight: 800;
        }

        .categories {
          display: flex;
          gap: 5px;
          margin: 15px 0 10px;
        }

        .categories span {
          font-size: 8px;
          padding: 6px 10px;
          border-radius: 20px;
          background: #f3f4ef;
        }

        .categories span:first-child {
          background: #d9f5df;
          color: #159447;
          font-weight: 800;
        }

        .food-item {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px;
          border: 1px solid #eceee9;
          border-radius: 13px;
          margin-bottom: 7px;
        }

        .food-image {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #ffc461;
        }

        .food-1 {
          background: #f4d89b;
        }

        .food-2 {
          background: #67c7e8;
        }

        .food-3 {
          background: #ff9e65;
        }

        .food-info {
          flex: 1;
        }

        .food-info strong {
          display: block;
          font-size: 9px;
        }

        .food-info small {
          font-size: 7px;
          color: #9aa19c;
        }

        .food-item b {
          display: block;
          font-size: 9px;
          margin-bottom: 4px;
        }

        .food-item button {
          border: 0;
          background: #20b957;
          color: white;
          font-size: 7px;
          font-weight: 800;
          border-radius: 6px;
          padding: 4px 8px;
        }

        .floating-label {
          position: absolute;
          right: 45%;
          top: 50%;
          background: white;
          border-radius: 15px;
          padding: 15px 20px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
        }

        .floating-label span {
          display: block;
          font-size: 8px;
          color: #16a34a;
          font-weight: 800;
        }

        .floating-label b {
          display: block;
          margin-top: 4px;
        }

        .scene-copy {
          position: absolute;
          left: 12%;
          top: 35%;
          width: 420px;
        }

        .scene-copy h2,
        .transfer-title h2,
        .kitchen-copy h2,
        .preparing-copy h2,
        .ready-copy h2 {
          font-size: clamp(38px, 4.5vw, 65px);
          line-height: 0.98;
          letter-spacing: -0.05em;
          margin: 14px 0;
        }

        .scene-copy p,
        .kitchen-copy p,
        .ready-copy p {
          color: #707a74;
          line-height: 1.6;
          max-width: 400px;
        }

        .dark-scene {
          background:
            radial-gradient(
              circle at 20% 60%,
              rgba(34, 197, 94, 0.14),
              transparent 30%
            ),
            #101923;
          color: white;
        }

        .transfer-title {
          position: absolute;
          top: 10%;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          width: 800px;
        }

        .transfer-title h2 {
          color: white;
        }

        .transfer-area {
          position: absolute;
          left: 10%;
          right: 10%;
          top: 43%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .small-phone .phone {
          width: 150px;
          height: 300px;
          border-radius: 25px;
        }

        .small-phone .phone-screen {
          border-radius: 19px;
          padding: 10px;
        }

        .travel-line {
          position: relative;
          width: 55%;
          height: 4px;
          background: rgba(255,255,255,0.12);
          border-radius: 20px;
        }

        .travel-progress {
          position: absolute;
          height: 100%;
          left: 0;
          top: 0;
          background: #22c55e;
          border-radius: 20px;
        }

        .order-flying {
          position: absolute;
          top: -30px;
          transform: translateX(-50%);
          background: white;
          color: #17211b;
          padding: 10px 15px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 800;
          white-space: nowrap;
          box-shadow: 0 10px 30px rgba(0,0,0,.2);
        }

        .order-flying small {
          color: #16a34a;
          margin-left: 10px;
        }

        .mini-kitchen {
          width: 180px;
          height: 130px;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 20px;
          display: grid;
          place-items: center;
        }

        .monitor {
          background: #f4f7f2;
          color: #17211b;
          width: 130px;
          height: 90px;
          border-radius: 10px;
          padding: 10px;
          font-size: 10px;
          font-weight: 800;
        }

        .monitor strong {
          display: block;
          color: #22c55e;
          margin-top: 8px;
        }

        .kitchen-scene {
          background: #eef7f4;
        }

        .kitchen-copy {
          position: absolute;
          left: 10%;
          top: 25%;
          max-width: 500px;
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
          border-radius: 50%;
          background: #efbd91;
          margin: auto;
        }

        .chef-body {
          width: 130px;
          height: 130px;
          background: white;
          border-radius: 30px 30px 10px 10px;
          margin: -3px auto;
        }

        .chef-hat {
          position: absolute;
          top: -20px;
          left: 35px;
          z-index: 2;
          background: white;
          padding: 8px 12px;
          border-radius: 30px;
          font-size: 8px;
          font-weight: 800;
        }

        .kitchen-card {
          position: absolute;
          right: 12%;
          top: 30%;
          width: 360px;
          background: white;
          padding: 25px;
          border-radius: 22px;
          box-shadow: 0 25px 60px rgba(0,0,0,.13);
        }

        .kitchen-top {
          display: flex;
          justify-content: space-between;
          color: #ef4444;
          font-size: 9px;
          font-weight: 800;
        }

        .new-pill {
          color: #a16207;
          background: #fef3c7;
          padding: 5px 10px;
          border-radius: 20px;
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
          border-top: 1px solid #eceeea;
          border-bottom: 1px solid #eceeea;
          padding: 12px 0;
        }

        .kitchen-items div {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          font-size: 12px;
        }

        .kitchen-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .kitchen-total strong {
          font-size: 22px;
        }

        .kitchen-card button {
          width: 100%;
          margin-top: 18px;
          padding: 13px;
          border: 0;
          border-radius: 10px;
          background: #22c55e;
          color: white;
          font-weight: 800;
        }

        .preparing-scene {
          background: #fffaf0;
        }

        .preparing-copy {
          position: absolute;
          top: 14%;
          left: 10%;
          max-width: 700px;
        }

        .preparing-scene .phone {
          position: absolute;
          right: 13%;
          bottom: 10%;
          width: 240px;
          height: 480px;
        }

        .counter {
          position: absolute;
          left: 25%;
          bottom: 20%;
          width: 430px;
          height: 20px;
          background: #a7c6c5;
          border-radius: 20px;
        }

        .pan {
          position: absolute;
          right: 40px;
          bottom: 10px;
          font-size: 60px;
        }

        .plate {
          position: absolute;
          left: 130px;
          bottom: 0;
          font-size: 60px;
        }

        .status-card {
          margin-top: 70px;
          background: #f0ddff;
          padding: 20px;
          border-radius: 15px;
        }

        .status-card strong,
        .status-card small {
          display: block;
          margin-top: 8px;
        }

        .progress-line {
          height: 5px;
          background: #eee;
          margin-top: 20px;
          border-radius: 10px;
        }

        .progress-line span {
          display: block;
          width: 70%;
          height: 100%;
          background: #22c55e;
          border-radius: 10px;
        }

        .live-order {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          font-size: 10px;
        }

        .live-order span {
          background: #eadbff;
          padding: 6px;
          border-radius: 20px;
        }

        .ready-scene {
          background: #f7faef;
        }

        .food-animation {
          position: absolute;
          left: 18%;
          bottom: 25%;
          width: 300px;
          height: 220px;
        }

        .plate-big {
          position: absolute;
          font-size: 150px;
          bottom: 0;
        }

        .food-pop {
          position: absolute;
          font-size: 45px;
          left: 80px;
          bottom: 95px;
        }

        .food-pop.second {
          left: 145px;
          bottom: 80px;
        }

        .food-pop.third {
          left: 115px;
          bottom: 120px;
        }

        .ready-copy {
          position: absolute;
          left: 45%;
          top: 25%;
        }

        .ready-scene .phone {
          position: absolute;
          right: 10%;
          bottom: 10%;
          width: 230px;
          height: 460px;
        }

        .ready-big {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: #d9f6df;
          color: #16a34a;
          font-size: 35px;
          font-weight: 800;
          margin: 50px auto 20px;
        }

        .ready-title {
          text-align: center;
          font-size: 20px;
        }

        .ready-text {
          text-align: center;
          color: #7a827d;
          font-size: 10px;
        }

        .ready-badge {
          text-align: center;
          background: #dff7e5;
          color: #159447;
          border-radius: 30px;
          padding: 9px;
          margin-top: 20px;
          font-size: 9px;
          font-weight: 800;
        }

        .payment-scene {
          background: #121a25;
          color: white;
        }

        .payment-scene .phone {
          position: absolute;
          left: 50%;
          bottom: 10%;
          transform: translateX(-50%);
        }

        .payment-title {
          text-align: center;
          margin-top: 70px;
          font-size: 10px;
          letter-spacing: .15em;
          font-weight: 800;
        }

        .payment-scene .qr {
          margin: 35px auto 20px;
        }

        .payment-amount {
          display: block;
          text-align: center;
          font-size: 28px;
        }

        .payment-success {
          margin-top: 20px;
          text-align: center;
          color: #16a34a;
          font-size: 10px;
          font-weight: 800;
        }

        .payment-bill {
          position: absolute;
          left: 12%;
          top: 32%;
          width: 300px;
          background: white;
          color: #17211b;
          border-radius: 20px;
          padding: 25px;
        }

        .payment-bill > span {
          font-size: 9px;
          font-weight: 800;
        }

        .payment-bill h3 {
          font-size: 32px;
          margin: 15px 0;
        }

        .payment-bill > div:not(.payment-method) {
          display: flex;
          justify-content: space-between;
          margin: 8px 0;
          font-size: 12px;
        }

        .payment-method {
          border: 1px solid #e5e8e3;
          padding: 11px;
          border-radius: 10px;
          margin-top: 8px;
          font-size: 11px;
        }

        .payment-method.selected {
          border-color: #22c55e;
          background: #e7f8eb;
        }

        .payment-dashboard {
          position: absolute;
          right: 10%;
          top: 36%;
          background: white;
          color: #17211b;
          padding: 25px;
          width: 300px;
          border-radius: 20px;
        }

        .payment-dashboard span {
          font-size: 9px;
          font-weight: 800;
          color: #16a34a;
        }

        .payment-dashboard h3 {
          margin: 15px 0 5px;
        }

        .payment-dashboard > strong {
          font-size: 30px;
        }

        .payment-dashboard small {
          display: block;
          color: #7b837e;
          margin-top: 10px;
        }

        .payment-check {
          position: absolute;
          right: 20px;
          top: 20px;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          background: #d9f6df;
          color: #16a34a;
          display: grid;
          place-items: center;
          font-weight: 800;
        }

        .final-message {
          position: absolute;
          top: 10%;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          width: 800px;
        }

        .final-message span {
          color: #22c55e;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .2em;
        }

        .final-message h2 {
          font-size: clamp(42px, 5vw, 72px);
          line-height: .98;
          letter-spacing: -.055em;
          margin: 15px 0;
        }

        .final-message p {
          color: #89928d;
        }

        .story-progress {
          position: absolute;
          right: 35px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 14px;
          z-index: 20;
        }

        .progress-item {
          display: flex;
          align-items: center;
          gap: 9px;
          justify-content: flex-end;
        }

        .progress-item small {
          font-size: 9px;
          color: #5c665f;
          font-weight: 700;
        }

        .progress-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #aeb8b1;
        }

        .progress-item:first-child .progress-dot {
          background: #22c55e;
          box-shadow: 0 0 15px #22c55e;
        }

        .scroll-hint {
          position: absolute;
          bottom: 25px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 9px;
          letter-spacing: .15em;
          font-weight: 800;
          color: #8a938d;
        }

        .order-success {
          text-align: center;
          margin-top: 10px;
        }

        .success-icon {
          width: 65px;
          height: 65px;
          margin: 60px auto 20px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #d9f6df;
          color: #16a34a;
          font-size: 35px;
          font-weight: 800;
        }

        .order-number {
          text-align: center;
          font-weight: 800;
          margin-top: 20px;
        }

        .order-status {
          margin: 20px auto;
          width: fit-content;
          background: #e7f8eb;
          color: #159447;
          padding: 7px 12px;
          border-radius: 30px;
          font-size: 8px;
          font-weight: 800;
        }

        .live-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          background: #22c55e;
          border-radius: 50%;
          margin-right: 5px;
        }

        .mini-order {
          background: #f5f6f2;
          padding: 12px;
          border-radius: 12px;
          font-size: 8px;
          line-height: 2;
        }

        .screen-heading {
          font-size: 20px;
          margin: 15px 0;
        }

        .cart-box,
        .bill {
          background: #f7f8f4;
          padding: 13px;
          border-radius: 14px;
          margin-bottom: 10px;
        }

        .cart-box div,
        .bill div {
          display: flex;
          justify-content: space-between;
          padding: 7px 0;
          font-size: 9px;
        }

        .bill {
          background: #efeee8;
        }

        .bill hr {
          border: 0;
          border-top: 1px solid #ddd;
        }

        .bill .total {
          font-size: 13px;
        }

        .place-order {
          width: 100%;
          border: 0;
          background: #22b957;
          color: white;
          padding: 14px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 9px;
        }

        @media (max-width: 900px) {
          .story-title {
            left: 7%;
            top: 7%;
          }

          .story-title h2 {
            font-size: 42px;
          }

          .customer-side {
            left: 5%;
            transform: scale(.75);
            transform-origin: bottom left;
          }

          .scan-phone-wrap,
          .phone-right,
          .phone-center-right {
            right: 7%;
            transform: scale(.75);
            transform-origin: bottom right;
          }

          .story-progress {
            right: 10px;
          }

          .progress-item small {
            display: none;
          }

          .scene-copy,
          .kitchen-copy,
          .preparing-copy {
            left: 7%;
            top: 25%;
            width: 42%;
          }

          .scene-copy h2,
          .kitchen-copy h2,
          .preparing-copy h2,
          .ready-copy h2 {
            font-size: 38px;
          }

          .kitchen-card {
            right: 7%;
            transform: scale(.75);
            transform-origin: right center;
          }

          .payment-bill {
            left: 5%;
            transform: scale(.7);
            transform-origin: left center;
          }

          .payment-dashboard {
            right: 5%;
            transform: scale(.7);
            transform-origin: right center;
          }

          .final-message {
            width: 90%;
          }
        }
      `}</style>
    </section>
  );
}