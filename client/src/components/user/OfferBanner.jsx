// Wide offer banner — strong CTA over the cta-banner.jpg image
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IoArrowForwardOutline } from "react-icons/io5";
import ctaBanner from "../../assets/cta-banner.jpg";

const OfferBanner = ({
  eyebrow = "Limited Offer",
  title = "First Month, 50% Off.",
  subtitle = "Subscribe today and step into the full Magzineer library — every issue, every article, every voice.",
  ctaLabel = "Become a Subscriber",
  ctaTo = "/plans",
}) => {
  return (
    <section className="relative w-full overflow-hidden bg-charcoal">
      <div className="relative aspect-21/9 md:aspect-3/1 min-h-85 sm:min-h-105">
        <motion.img
          src={ctaBanner}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4 }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-charcoal/85 via-charcoal/40 to-transparent" />

        <div className="absolute inset-0 flex items-center">
          <div className="container-mz">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="max-w-xl"
            >
              <p className="eyebrow text-gold-soft! mb-3">{eyebrow}</p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-ivory! leading-tight mb-4">
                {title}
              </h2>
              <p className="text-ivory/85 text-sm sm:text-base mb-7 max-w-md leading-relaxed">
                {subtitle}
              </p>
              <Link
                to={ctaTo}
                className="inline-flex items-center gap-2 bg-ivory text-charcoal px-7 py-3.5 text-sm uppercase tracking-wider font-medium hover:bg-crimson hover:text-ivory transition-colors group"
              >
                {ctaLabel}
                <IoArrowForwardOutline
                  size={15}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferBanner;
