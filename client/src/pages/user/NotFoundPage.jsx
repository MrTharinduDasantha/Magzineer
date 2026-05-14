// 404 — themed illustration + back home CTA
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IoArrowBackOutline } from "react-icons/io5";
import notFound from "../../assets/not-found.png";

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-lg"
      >
        <img
          src={notFound}
          alt="Page not found"
          className="w-56 h-56 sm:w-64 sm:h-64 object-contain mx-auto mb-6"
        />
        <p className="eyebrow mb-3">404</p>
        <h1 className="font-display text-4xl sm:text-5xl text-charcoal mb-4 leading-tight">
          This page has gone to print.
        </h1>
        <p className="text-charcoal-soft mb-8">
          The page you're looking for doesn't exist, or it's been moved to a new
          issue. Let's get you back on track.
        </p>
        <Link
          to="/"
          className="btn-primary inline-flex items-center gap-2 group"
        >
          <IoArrowBackOutline
            size={14}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Return Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
