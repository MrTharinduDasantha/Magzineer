// Issue card — cover, magazine name, volume/number, publication date, price, CTA
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IoCalendarOutline, IoArrowForwardOutline } from "react-icons/io5";
import { formatDate } from "../../utils/formatDate.js";
import { formatCurrency } from "../../utils/formatCurrency.js";

const IssueCard = ({ issue, showMagazine = true }) => {
  if (!issue) return null;
  const isFree = !issue.price || issue.price === 0;

  return (
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="card-mz overflow-hidden flex flex-col h-full"
    >
      <Link
        to={`/issues/${issue._id}`}
        className="block relative overflow-hidden aspect-3/4 bg-cream"
      >
        <motion.img
          src={issue.cover?.url}
          alt={`Issue ${issue.issueNumber}`}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
        />
        {/* Price badge */}
        <div
          className={`absolute top-3 right-3 px-3 py-1 text-xs font-medium tracking-wider uppercase ${
            isFree ? "bg-gold text-charcoal" : "bg-charcoal text-ivory"
          }`}
        >
          {isFree ? "Free" : formatCurrency(issue.price)}
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-1">
        {showMagazine && issue.magazine?.title && (
          <p className="eyebrow text-[10px] mb-2">{issue.magazine.title}</p>
        )}

        <h3 className="font-display text-lg text-charcoal mb-1 line-clamp-2">
          {issue.title || `Issue ${issue.issueNumber}`}
        </h3>
        <p className="text-xs text-muted font-medium mb-3">
          {issue.issueNumber}
        </p>

        <div className="flex items-center gap-2 text-xs text-muted mb-4">
          <IoCalendarOutline size={14} />
          {formatDate(issue.publicationDate)}
        </div>

        <Link
          to={`/issues/${issue._id}`}
          className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-charcoal hover:text-crimson transition-colors group"
        >
          {isFree ? "Read Issue" : "View & Purchase"}
          <IoArrowForwardOutline
            size={14}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>
    </motion.article>
  );
};

export default IssueCard;
