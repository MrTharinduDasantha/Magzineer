// Editorial hero carousel — full-width, auto-rotating, with Framer Motion crossfade, editorial copy overlay, slide indicators, and prev/next controls.
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import hero1 from "../../assets/hero/hero-1.jpg";
import hero2 from "../../assets/hero/hero-2.jpg";
import hero3 from "../../assets/hero/hero-3.jpg";

const slides = [
  {
    image: hero1,
    eyebrow: "The Editorial Issue",
    title: "Stories Worth Lingering Over",
    subtitle:
      "Premium long-form journalism, beautifully designed and thoughtfully curated for the discerning reader.",
    cta: { label: "Explore Magazines", to: "/magazines" },
  },
  {
    image: hero2,
    eyebrow: "Volume 12 · No. 04",
    title: "A Quiet Revolution in Print",
    subtitle:
      "Discover our latest issues across art, culture, design, and ideas — delivered every month.",
    cta: { label: "Browse Latest Issues", to: "/magazines" },
  },
  {
    image: hero3,
    eyebrow: "Become a Subscriber",
    title: "Unlimited Access. One Library.",
    subtitle:
      "Join Magzineer and unlock every premium article across our entire publication network.",
    cta: { label: "View Plans", to: "/plans" },
  },
];

const HeroSlider = () => {
  const [index, setIndex] = useState(0);

  // Auto-advance every 6 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  const go = (dir) =>
    setIndex((i) => (i + dir + slides.length) % slides.length);

  const slide = slides[index];

  return (
    <section className="relative w-full h-[90vh] min-h-140 max-h-205 overflow-hidden bg-charcoal">
      {/* Image layer with crossfade */}
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          {/* Soft warm overlay so text reads cleanly */}
          <div className="absolute inset-0 bg-linear-to-r from-charcoal/70 via-charcoal/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Copy overlay */}
      <div className="relative h-full container-mz flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-2xl text-ivory"
          >
            <p className="eyebrow text-gold-soft! mb-4">{slide.eyebrow}</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl leading-tight text-ivory! mb-6">
              {slide.title}
            </h1>
            <p className="text-base sm:text-lg text-ivory/80 mb-8 max-w-xl">
              {slide.subtitle}
            </p>
            <Link
              to={slide.cta.to}
              className="inline-flex items-center gap-2 bg-ivory text-charcoal! px-7 py-3.5 text-sm uppercase tracking-wider font-medium hover:bg-crimson hover:text-ivory! transition-colors"
            >
              {slide.cta.label}
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Prev / next buttons */}
      <button
        onClick={() => go(-1)}
        className="hidden sm:flex absolute left-5 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-ivory/15 hover:bg-ivory text-ivory hover:text-charcoal backdrop-blur-sm transition-colors"
        aria-label="Previous slide"
      >
        <IoChevronBack size={20} />
      </button>
      <button
        onClick={() => go(1)}
        className="hidden sm:flex absolute right-5 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-ivory/15 hover:bg-ivory text-ivory hover:text-charcoal backdrop-blur-sm transition-colors"
        aria-label="Next slide"
      >
        <IoChevronForward size={20} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex gap-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === index
                ? "w-10 bg-ivory"
                : "w-5 bg-ivory/40 hover:bg-ivory/70"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
