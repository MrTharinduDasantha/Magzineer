// Reusable empty-state component with an illustration + message + optional CTA
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const EmptyState = ({ image, title, message, ctaLabel, ctaTo, onCta }) => {
  return (
    <motion.div
      className="flex flex-col items-center text-center py-16 px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {image && (
        <img
          src={image}
          alt={title}
          className="w-48 h-48 sm:w-56 sm:h-56 object-contain mb-6 opacity-90"
        />
      )}
      <h3 className="text-2xl font-display text-charcoal mb-2">{title}</h3>
      {message && (
        <p className="text-muted max-w-md mb-6 font-sans">{message}</p>
      )}
      {ctaLabel &&
        (ctaTo ? (
          <Link to={ctaTo} className="btn-primary">
            {ctaLabel}
          </Link>
        ) : (
          <button onClick={onCta} className="btn-primary">
            {ctaLabel}
          </button>
        ))}
    </motion.div>
  );
};

export default EmptyState;
