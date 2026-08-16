"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type CustomerHeaderProps = {
  restaurantName: string;
  logoUrl?: string | null;
  tableNumber?: number | null;
  cartCount: number;
  orderCount: number;
  onCartClick: () => void;
  onOrdersClick: () => void;
};

export default function CustomerHeader({
  restaurantName,
  logoUrl,
  tableNumber,
  cartCount,
  orderCount,
  onCartClick,
  onOrdersClick,
}: CustomerHeaderProps) {
  const headerRef =
    useRef<HTMLElement>(null);

  const cartRef =
    useRef<HTMLButtonElement>(null);

  const cartCountRef =
    useRef<HTMLSpanElement>(null);

  const previousCartCount =
    useRef(cartCount);

  /*
  ==========================================================
  HEADER ENTRANCE
  ==========================================================
  */

  useEffect(() => {
    if (!headerRef.current) return;

    gsap.fromTo(
      headerRef.current,
      {
        opacity: 0,
        y: -18,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      }
    );
  }, []);

  /*
  ==========================================================
  CART COUNT ANIMATION
  ==========================================================
  */

  useEffect(() => {
    if (
      cartCount !==
      previousCartCount.current
    ) {
      if (cartCountRef.current) {
        gsap.fromTo(
          cartCountRef.current,
          {
            scale: 0.65,
          },
          {
            scale: 1,
            duration: 0.2,
            ease: "back.out(3)",
          }
        );
      }

      if (cartRef.current) {
        gsap.fromTo(
          cartRef.current,
          {
            scale: 0.97,
          },
          {
            scale: 1,
            duration: 0.22,
            ease: "back.out(2)",
          }
        );
      }
    }

    previousCartCount.current =
      cartCount;
  }, [cartCount]);

  /*
  ==========================================================
  CART BUTTON
  ==========================================================
  */

  function handleCartClick() {
    if (!cartRef.current) {
      onCartClick();
      return;
    }

    gsap.to(cartRef.current, {
      scale: 0.94,
      duration: 0.08,
      ease: "power1.out",
      onComplete: () => {
        gsap.to(cartRef.current, {
          scale: 1,
          duration: 0.18,
          ease: "back.out(2)",
        });

        onCartClick();
      },
    });
  }

  return (
    <header
      ref={headerRef}
      className="
        sticky
        top-0
        z-40
        border-b
        border-[#EEEEEE]
        bg-white/95
        backdrop-blur-xl
      "
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">

        {/* ==================================================
            RESTAURANT
        ================================================== */}

        <div className="flex min-w-0 items-center gap-3">

          {logoUrl ? (
            <img
              src={logoUrl}
              alt={restaurantName}
              className="
                h-11
                w-11
                shrink-0
                rounded-xl
                border
                border-[#EEEEEE]
                bg-white
                object-cover
              "
            />
          ) : (
            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-[#F8CB45]
                text-xl
              "
            >
              🍽️
            </div>
          )}

          <div className="min-w-0">

            <h1 className="truncate text-[15px] font-bold text-[#1F1F1F] sm:text-lg">
              {restaurantName}
            </h1>

            <div className="mt-0.5 flex items-center gap-1.5">

              <span className="text-xs text-[#6B7280]">
                Table {tableNumber ?? "—"}
              </span>

              <span className="h-1 w-1 rounded-full bg-[#D1D5DB]" />

              <span className="text-[10px] font-bold text-[#0C831F]">
                ORDER ONLINE
              </span>

            </div>

          </div>
        </div>

        {/* ==================================================
            ACTIONS
        ================================================== */}

        <div className="flex shrink-0 items-center gap-2">

          {/* ORDERS */}

          {orderCount > 0 && (
            <button
              type="button"
              onClick={onOrdersClick}
              className="
                hidden
                items-center
                gap-1.5
                rounded-xl
                border
                border-[#E5E7EB]
                bg-white
                px-3
                py-2
                text-xs
                font-bold
                text-[#1F1F1F]
                shadow-sm
                sm:inline-flex
              "
            >
              <span>📦</span>

              <span>
                {orderCount === 1
                  ? "Track Order"
                  : `${orderCount} Orders`}
              </span>
            </button>
          )}

          {/* CART */}

          <button
            ref={cartRef}
            type="button"
            onClick={handleCartClick}
            className="
              relative
              flex
              items-center
              gap-1.5
              rounded-xl
              bg-[#0C831F]
              px-3
              py-2.5
              text-xs
              font-bold
              text-white
              shadow-sm
              sm:px-4
            "
          >
            <span className="text-base">
              🛒
            </span>

            <span className="hidden sm:inline">
              Cart
            </span>

            {cartCount > 0 && (
              <span
                ref={cartCountRef}
                className="
                  min-w-[19px]
                  rounded-full
                  bg-[#F8CB45]
                  px-1.5
                  py-0.5
                  text-center
                  text-[10px]
                  font-extrabold
                  text-[#1F1F1F]
                "
              >
                {cartCount}
              </span>
            )}
          </button>

        </div>

      </div>
    </header>
  );
}