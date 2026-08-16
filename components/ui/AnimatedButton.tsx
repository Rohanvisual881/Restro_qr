"use client";

import {
  ButtonHTMLAttributes,
  useRef,
} from "react";
import gsap from "gsap";

type AnimatedButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "danger";
  };

export default function AnimatedButton({
  children,
  variant = "primary",
  className = "",
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  ...props
}: AnimatedButtonProps) {
  const ref =
    useRef<HTMLButtonElement>(null);

  const colors = {
    primary:
      "bg-[#0C831F] text-white",
    secondary:
      "bg-white text-[#1F1F1F] border border-[#E5E7EB]",
    danger:
      "bg-red-600 text-white",
  };

  function down(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    if (ref.current) {
      gsap.to(ref.current, {
        scale: 0.96,
        duration: 0.1,
        ease: "power1.out",
      });
    }

    onMouseDown?.(event);
  }

  function up(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    if (ref.current) {
      gsap.to(ref.current, {
        scale: 1,
        duration: 0.2,
        ease: "back.out(2)",
      });
    }

    onMouseUp?.(event);
  }

  function leave(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    if (ref.current) {
      gsap.to(ref.current, {
        scale: 1,
        duration: 0.15,
        ease: "power1.out",
      });
    }

    onMouseLeave?.(event);
  }

  return (
    <button
      ref={ref}
      {...props}
      onMouseDown={down}
      onMouseUp={up}
      onMouseLeave={leave}
      className={`
        inline-flex
        items-center
        justify-center
        rounded-xl
        px-4
        py-2.5
        text-sm
        font-bold
        shadow-sm
        ${colors[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}