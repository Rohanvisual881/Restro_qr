"use client";

import {
  ReactNode,
  useLayoutEffect,
  useRef,
} from "react";
import gsap from "gsap";
import { fadeUp } from "@/components/animations/gsap";

type PageRevealProps = {
  children: ReactNode;
  className?: string;
};

export default function PageReveal({
  children,
  className = "",
}: PageRevealProps) {
  const ref =
    useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;

    if (!element) return;

    const ctx = gsap.context(() => {
      fadeUp(element, {
        distance: 16,
        duration: 0.45,
      });
    }, element);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
    >
      {children}
    </div>
  );
}