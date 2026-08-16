"use client";

import {
  ReactNode,
  useEffect,
  useRef,
} from "react";
import gsap from "gsap";

type AnimatedDrawerProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
};

export default function AnimatedDrawer({
  open,
  onClose,
  children,
  title = "Your Cart",
}: AnimatedDrawerProps) {
  const backdropRef =
    useRef<HTMLDivElement>(null);

  const drawerRef =
    useRef<HTMLDivElement>(null);

  const firstOpen =
    useRef(true);

  useEffect(() => {
    const backdrop =
      backdropRef.current;

    const drawer =
      drawerRef.current;

    if (!backdrop || !drawer) return;

    if (open) {
      document.body.style.overflow =
        "hidden";

      gsap.set(backdrop, {
        display: "block",
      });

      gsap.set(drawer, {
        display: "block",
      });

      const tl =
        gsap.timeline();

      tl.fromTo(
        backdrop,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.2,
          ease: "power2.out",
        }
      ).fromTo(
        drawer,
        {
          y: "100%",
        },
        {
          y: "0%",
          duration: 0.3,
          ease: "power2.out",
        },
        0
      );

      firstOpen.current = false;
    } else {
      document.body.style.overflow =
        "";

      const tl =
        gsap.timeline({
          onComplete: () => {
            gsap.set(backdrop, {
              display: "none",
            });

            gsap.set(drawer, {
              display: "none",
            });
          },
        });

      tl.to(
        drawer,
        {
          y: "100%",
          duration: 0.22,
          ease: "power2.in",
        }
      ).to(
        backdrop,
        {
          opacity: 0,
          duration: 0.18,
          ease: "power1.in",
        },
        0
      );
    }

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [open]);

  if (!open && firstOpen.current) {
    return null;
  }

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[100] hidden"
    >
      {/* BACKDROP */}

      <button
        type="button"
        aria-label="Close cart"
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-black/45"
      />

      {/* DRAWER */}

      <div
        ref={drawerRef}
        className="
          absolute
          bottom-0
          left-0
          right-0
          mx-auto
          max-h-[92vh]
          w-full
          max-w-2xl
          overflow-hidden
          rounded-t-[24px]
          bg-white
          shadow-2xl
        "
      >
        {/* HANDLE */}

        <div className="flex justify-center pt-3">
          <div className="h-1 w-10 rounded-full bg-[#D1D5DB]" />
        </div>

        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-[#EEEEEE] px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-[#1F1F1F]">
              {title}
            </h2>

            <p className="text-xs text-[#6B7280]">
              Review your order
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F5F5] text-xl text-[#1F1F1F]"
          >
            ×
          </button>
        </div>

        {/* CONTENT */}

        <div className="max-h-[calc(92vh-90px)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}