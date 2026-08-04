import type { Transition, Variants } from "framer-motion";

export const transitions = {
  spring: { type: "spring", stiffness: 400, damping: 30 } as Transition,
  gentle: { type: "spring", stiffness: 300, damping: 25 } as Transition,
  snappy: { type: "spring", stiffness: 500, damping: 35 } as Transition,
  fade: { duration: 0.15, ease: "easeOut" } as Transition,
  slow: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } as Transition,
  /**
   * The CHROME slide: the primary sidebar's width, the secondary sidebar's
   * gutter, and by ricochet everything to their right — header, breadcrumb,
   * content. All of them MUST share this curve, otherwise their edges drift
   * apart during the trip instead of gliding as one block.
   *
   * A duration rather than a spring: a spring overshoots its target, and a
   * layout width that overshoots makes the whole right half of the screen
   * judder. The curve leaves fast and settles softly.
   */
  shell: { duration: 0.32, ease: [0.32, 0.72, 0, 1] } as Transition,
};

export const variants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  } satisfies Variants,

  slideUp: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  } satisfies Variants,

  slideRight: {
    initial: { opacity: 0, x: -12 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 12 },
  } satisfies Variants,

  scaleIn: {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.96 },
  } satisfies Variants,

  staggerContainer: {
    animate: {
      transition: { staggerChildren: 0.04 },
    },
  } satisfies Variants,

  staggerItem: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
  } satisfies Variants,
};

export const pageTransition = {
  initial: { opacity: 0, y: 6 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
  },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
} satisfies Variants;

export const listStagger = {
  animate: { transition: { staggerChildren: 0.04 } },
} satisfies Variants;

export const overlayVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
} satisfies Variants;

export const modalVariants = {
  initial: { opacity: 0, scale: 0.97, y: 8 },
  animate: { opacity: 1, scale: 1, y: 0, transition: transitions.gentle },
  exit: { opacity: 0, scale: 0.97, y: 4 },
} satisfies Variants;

export const sidebarCollapse = {
  expanded: { width: 240 },
  collapsed: { width: 56 },
} satisfies Variants;

export const skeletonPulse = {
  animate: {
    opacity: [0.4, 0.7, 0.4],
    transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
  },
} satisfies Variants;

export const cardHover = {
  whileHover: { y: -2, transition: transitions.spring },
  whileTap: { scale: 0.98, transition: transitions.snappy },
};

export const buttonTap = {
  whileTap: { scale: 0.97, transition: transitions.snappy },
};
