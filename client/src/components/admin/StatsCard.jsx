// Dashboard summary card — large number with icon, label, and optional delta
import { motion } from "framer-motion";

const StatsCard = ({
  icon,
  label,
  value,
  delta,
  deltaLabel,
  accentColor = "crimson",
  index = 0,
}) => {
  const accents = {
    crimson: "bg-crimson/10 text-crimson",
    gold: "bg-gold/15 text-gold",
    charcoal: "bg-charcoal/10 text-charcoal",
    green: "bg-emerald-100 text-emerald-700",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -3 }}
      className="card-mz p-6 flex flex-col gap-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${accents[accentColor]}`}
        >
          {icon}
        </div>
        {delta !== undefined && delta !== null && (
          <span
            className={`text-xs font-medium ${
              delta >= 0 ? "text-emerald-600" : "text-crimson"
            }`}
          >
            {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}%
            {deltaLabel && ` ${deltaLabel}`}
          </span>
        )}
      </div>

      <div>
        <p className="font-display text-3xl text-charcoal mb-1">{value}</p>
        <p className="text-xs uppercase tracking-widest text-muted">{label}</p>
      </div>
    </motion.div>
  );
};

export default StatsCard;
