// Centralized Framer-Motion variants reused across the site for consistency

// Fade-in upward — most common reveal animation
export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// Fade-in (no movement)
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

// Scale-in — for cards and small entrances
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Stagger container — apply to a parent, children should use fadeUp/scaleIn
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Slide in from left
export const slideLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// Slide in from right
export const slideRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// Page transition wrapper (used in route-level page components)
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

// Hero parallax — slow Y drift on scroll
export const heroParallax = {
  initial: { y: 0 },
  animate: { y: -20, transition: { duration: 1.2, ease: "easeOut" } },
};

// Card hover — gentle lift
export const cardHover = {
  rest: { y: 0, boxShadow: "0 4px 20px rgba(26, 26, 26, 0.06)" },
  hover: {
    y: -6,
    boxShadow: "0 16px 40px rgba(26, 26, 26, 0.12)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
};
