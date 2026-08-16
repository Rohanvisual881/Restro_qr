import gsap from "gsap";

export const motion = {
  fast: 0.15,
  normal: 0.22,
  smooth: 0.3,
  page: 0.5,
};

export const ease = {
  standard: "power2.out",
  fast: "power1.out",
  spring: "back.out(1.4)",
  tap: "back.out(3)",
};

export function fadeUp(
  element: gsap.TweenTarget,
  options?: {
    delay?: number;
    duration?: number;
    distance?: number;
  }
) {
  return gsap.fromTo(
    element,
    {
      opacity: 0,
      y: options?.distance ?? 20,
    },
    {
      opacity: 1,
      y: 0,
      duration:
        options?.duration ?? motion.page,
      delay: options?.delay ?? 0,
      ease: ease.standard,
    }
  );
}

export function tap(
  element: gsap.TweenTarget
) {
  return gsap.fromTo(
    element,
    {
      scale: 0.94,
    },
    {
      scale: 1,
      duration: motion.fast,
      ease: ease.tap,
    }
  );
}

export function press(
  element: gsap.TweenTarget
) {
  return gsap.to(element, {
    scale: 0.96,
    duration: motion.fast,
    ease: ease.fast,
  });
}

export function release(
  element: gsap.TweenTarget
) {
  return gsap.to(element, {
    scale: 1,
    duration: motion.normal,
    ease: ease.spring,
  });
}