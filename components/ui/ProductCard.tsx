"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type ProductCardProps = {
  image: string | null;
  name: string;
  unit: string;
  price: number;
  mrp?: number;
  discountPercent?: number;
  deliveryTime?: string;

  quantity: number;
  onAdd: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
};

export default function ProductCard({
  image,
  name,
  unit,
  price,
  mrp,
  discountPercent,
  deliveryTime,
  quantity,
  onAdd,
  onIncrease,
  onDecrease,
}: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  /*
   * CARD ANIMATION
   */
  useLayoutEffect(() => {
    const card = cardRef.current;
    const imageEl = imageRef.current;
    const badge = badgeRef.current;

    if (!card) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 24,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );

      const hover = gsap.timeline({
        paused: true,
        defaults: {
          ease: "power2.out",
        },
      });

      hover.to(
        card,
        {
          y: -6,
          boxShadow: "0 16px 28px rgba(0,0,0,0.12)",
          duration: 0.22,
        },
        0
      );

      if (imageEl) {
        hover.to(
          imageEl,
          {
            scale: 1.06,
            duration: 0.3,
          },
          0
        );
      }

      const enter = () => {
        hover.play();

        if (badge) {
          gsap.fromTo(
            badge,
            { scale: 1 },
            {
              scale: 1.12,
              duration: 0.15,
              yoyo: true,
              repeat: 1,
              ease: "power1.inOut",
            }
          );
        }
      };

      const leave = () => {
        hover.reverse();
      };

      card.addEventListener("mouseenter", enter);
      card.addEventListener("mouseleave", leave);

      return () => {
        card.removeEventListener("mouseenter", enter);
        card.removeEventListener("mouseleave", leave);
        hover.kill();
      };
    }, card);

    return () => ctx.revert();
  }, []);

  /*
   * ADD
   */
  function handleAdd() {
    console.log("ADD CLICKED:", name);

    // THIS IS THE IMPORTANT PART.
    // This adds the item to the REAL cart in browse/page.tsx.
    onAdd();
  }

  /*
   * PLUS
   */
  function handlePlus(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    gsap.fromTo(
      event.currentTarget,
      { scale: 0.7 },
      {
        scale: 1,
        duration: 0.2,
        ease: "back.out(3)",
      }
    );

    onIncrease();
  }

  /*
   * MINUS
   */
  function handleMinus(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    gsap.fromTo(
      event.currentTarget,
      { scale: 0.7 },
      {
        scale: 1,
        duration: 0.2,
        ease: "back.out(3)",
      }
    );

    onDecrease();
  }

  const hasDiscount =
    discountPercent !== undefined &&
    discountPercent > 0;

  return (
    <article
      ref={cardRef}
      className="product-card relative overflow-visible rounded-[14px] border border-[#EEEEEE] bg-white"
      style={{
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      {/* IMAGE */}
      <div className="relative aspect-square overflow-hidden rounded-t-[14px] bg-[#F7F7F7]">
        {image ? (
          <img
            ref={imageRef}
            src={image}
            alt={name}
            draggable={false}
            className="product-image h-full w-full object-contain p-4"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl">
            🍽️
          </div>
        )}

        {/* DISCOUNT */}
        {hasDiscount && (
          <div
            ref={badgeRef}
            className="absolute left-2 top-2 rounded-md bg-[#54B226] px-2 py-1 text-[10px] font-bold text-white"
          >
            {discountPercent}% OFF
          </div>
        )}

        {/* DELIVERY */}
        {deliveryTime && (
          <div className="absolute right-2 top-2 rounded-md bg-white px-2 py-1 text-[9px] font-bold text-[#6B7280] shadow-sm">
            🕐 {deliveryTime}
          </div>
        )}

        {/* ADD / STEPPER */}
        <div className="absolute bottom-[-1px] right-2">
          {quantity === 0 ? (
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex h-9 items-center justify-center rounded-lg border-[1.5px] border-[#54B226] bg-white px-4 text-xs font-bold text-[#54B226]"
              style={{
                boxShadow:
                  "0 2px 5px rgba(0,0,0,0.08)",
              }}
            >
              ADD
            </button>
          ) : (
            <div className="flex h-9 w-[84px] items-center justify-between overflow-hidden rounded-lg bg-[#54B226] text-white">
              <button
                type="button"
                onClick={handleMinus}
                className="flex h-full w-7 items-center justify-center text-lg font-bold"
              >
                −
              </button>

              <span className="min-w-[20px] text-center text-xs font-bold">
                {quantity}
              </span>

              <button
                type="button"
                onClick={handlePlus}
                className="flex h-full w-7 items-center justify-center text-lg font-bold"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>

      {/* INFO */}
      <div className="min-h-[104px] p-3">
        <h3
          className="line-clamp-2 min-h-[38px] text-[14px] font-semibold leading-[19px] text-[#1F1F1F]"
          title={name}
        >
          {name}
        </h3>

        <p className="mt-1 min-h-[16px] text-[12px] text-[#6B7280]">
          {unit}
        </p>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-[15px] font-bold text-[#1F1F1F]">
            ₹{price}
          </span>

          {mrp !== undefined && mrp > price && (
            <span className="text-[12px] text-[#6B7280] line-through">
              ₹{mrp}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}