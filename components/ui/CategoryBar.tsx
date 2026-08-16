"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type Category = {
  id: string;
  name: string;
};

type CategoryBarProps = {
  categories: Category[];
};

export default function CategoryBar({
  categories,
}: CategoryBarProps) {
  const [active, setActive] =
    useState(categories[0]?.id || "");

  const indicatorRef =
    useRef<HTMLDivElement>(null);

  const buttonsRef =
    useRef<Record<string, HTMLAnchorElement | null>>(
      {}
    );

  /*
  ==========================================================
  ENTRANCE
  ==========================================================
  */

  useEffect(() => {
    const buttons = Object.values(
      buttonsRef.current
    ).filter(Boolean);

    gsap.fromTo(
      buttons,
      {
        opacity: 0,
        x: 14,
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.3,
        stagger: 0.04,
        ease: "power2.out",
      }
    );
  }, []);

  /*
  ==========================================================
  ACTIVE INDICATOR
  ==========================================================
  */

  useEffect(() => {
    const button =
      buttonsRef.current[active];

    const indicator =
      indicatorRef.current;

    if (!button || !indicator) return;

    const parent =
      button.parentElement;

    if (!parent) return;

    const parentRect =
      parent.getBoundingClientRect();

    const buttonRect =
      button.getBoundingClientRect();

    gsap.to(indicator, {
      x:
        buttonRect.left -
        parentRect.left,
      width: buttonRect.width,
      duration: 0.22,
      ease: "power2.out",
    });
  }, [active]);

  function handleClick(
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) {
    event.preventDefault();

    setActive(id);

    const target =
      document.getElementById(
        `category-${id}`
      );

    if (target) {
      window.scrollTo({
        top:
          target.getBoundingClientRect()
            .top +
          window.scrollY -
          130,
        behavior: "smooth",
      });
    }
  }

  return (
    <div
      className="
        sticky
        top-[69px]
        z-30
        border-y
        border-[#EEEEEE]
        bg-[#F7F7F7]/95
        backdrop-blur-xl
      "
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        <div className="relative flex gap-1 overflow-x-auto py-2 scrollbar-none">

          {/* ACTIVE INDICATOR */}

          <div
            ref={indicatorRef}
            className="
              pointer-events-none
              absolute
              bottom-1
              left-0
              h-[2px]
              rounded-full
              bg-[#0C831F]
            "
          />

          {categories.map(
            (category) => {
              const isActive =
                active ===
                category.id;

              return (
                <a
                  key={category.id}
                  ref={(element) => {
                    buttonsRef.current[
                      category.id
                    ] = element;
                  }}
                  href={`#category-${category.id}`}
                  onClick={(event) =>
                    handleClick(
                      event,
                      category.id
                    )
                  }
                  className={`
                    relative
                    shrink-0
                    rounded-xl
                    px-4
                    py-2.5
                    text-xs
                    font-bold
                    ${
                      isActive
                        ? "text-[#0C831F]"
                        : "text-[#6B7280]"
                    }
                  `}
                >
                  {category.name}
                </a>
              );
            }
          )}

        </div>
      </div>
    </div>
  );
}