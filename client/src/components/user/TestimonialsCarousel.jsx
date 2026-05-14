// Testimonials carousel — auto-advancing, with manual dot navigation
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoStar } from "react-icons/io5";
import { FaQuoteLeft } from "react-icons/fa";
import avatar1 from "../../assets/testimonials/avatar-1.jpg";
import avatar2 from "../../assets/testimonials/avatar-2.jpg";
import avatar3 from "../../assets/testimonials/avatar-3.jpg";
import avatar4 from "../../assets/testimonials/avatar-4.jpg";

const testimonials = [
  {
    avatar: avatar1,
    name: "James Whitfield",
    role: "Architecture Critic",
    quote:
      "Magzineer feels like a love letter to print, reimagined for the digital age. The depth and design of every issue is genuinely impressive.",
  },
  {
    avatar: avatar2,
    name: "Priya Raghavan",
    role: "Creative Director",
    quote:
      "I subscribe to a lot of magazines. Magzineer is the only one I read cover to cover. The writing is sharp, the curation is impeccable.",
  },
  {
    avatar: avatar3,
    name: "Adaora Okafor",
    role: "Cultural Editor",
    quote:
      "Finally, a publication platform that respects its readers' time and intelligence. Every piece feels carefully chosen and beautifully made.",
  },
  {
    avatar: avatar4,
    name: "Daichi Tanaka",
    role: "Design Researcher",
    quote:
      "The aesthetic is gorgeous, the journalism is rigorous. Magzineer has become my most-read source for ideas in design and culture.",
  },
];

const TestimonialsCarousel = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  const t = testimonials[index];

  return (
    <section className="py-16 lg:py-24 bg-cream/40">
      <div className="container-mz">
        <div className="text-center mb-12">
          <p className="eyebrow mb-3">Reader Voices</p>
          <h2 className="heading-rule center font-display text-3xl sm:text-4xl lg:text-5xl text-charcoal mx-auto">
            What Our Readers Say
          </h2>
        </div>

        <div className="max-w-3xl mx-auto relative">
          <FaQuoteLeft
            size={60}
            className="absolute -top-4 left-2 text-crimson/12 hidden sm:block"
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center px-4 sm:px-10"
            >
              <div className="flex justify-center gap-1 text-gold mb-6">
                {[...Array(5)].map((_, i) => (
                  <IoStar key={i} size={18} />
                ))}
              </div>

              <p className="font-display italic text-xl sm:text-2xl lg:text-3xl text-charcoal leading-snug mb-8">
                "{t.quote}"
              </p>

              <div className="flex flex-col items-center">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-16 h-16 rounded-full object-cover mb-3 ring-4 ring-paper"
                />
                <p className="font-medium text-charcoal">{t.name}</p>
                <p className="text-xs text-muted uppercase tracking-widest mt-1">
                  {t.role}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-10">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-8 bg-charcoal"
                    : "w-3 bg-charcoal/25 hover:bg-charcoal/50"
                }`}
                aria-label={`Show testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
