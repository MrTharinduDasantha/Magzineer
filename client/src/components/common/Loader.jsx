// Centered loader — used during page/route data fetches
import { motion } from "framer-motion";

const Loader = ({ fullScreen = true, label = "Loading" }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${
        fullScreen ? "min-h-[60vh]" : "py-12"
      }`}
    >
      <div className="spinner-mz" />
      <motion.p
        className="eyebrow"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {label}
      </motion.p>
    </div>
  );
};

export default Loader;
