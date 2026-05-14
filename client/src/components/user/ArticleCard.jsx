// Article card — featured image, category badge, title, author, reading time, lock badge
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IoLockClosed, IoTimeOutline } from "react-icons/io5";
import CategoryBadge from "./CategoryBadge.jsx";
import { formatReadingTime } from "../../utils/formatReadingTime.js";

const ArticleCard = ({ article, variant = "default" }) => {
  if (!article) return null;
  const isPremium = article.accessLevel === "premium";

  // Horizontal "compact" variant — for related-articles sidebars
  if (variant === "compact") {
    return (
      <Link to={`/articles/${article._id}`} className="flex gap-3 group">
        <div className="w-24 h-24 shrink-0 overflow-hidden bg-cream">
          <img
            src={article.featuredImage?.url}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="flex-1 min-w-0">
          {article.category && (
            <CategoryBadge category={article.category} linked={false} />
          )}
          <h4 className="font-display text-sm text-charcoal mt-1 line-clamp-2 group-hover:text-crimson transition-colors">
            {article.title}
          </h4>
          <p className="text-xs text-muted mt-1">
            {formatReadingTime(article.readingTime)}
          </p>
        </div>
      </Link>
    );
  }

  // Default — large card
  return (
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group flex flex-col h-full"
    >
      <Link
        to={`/articles/${article._id}`}
        className="block relative overflow-hidden aspect-4/3 bg-cream"
      >
        <motion.img
          src={article.featuredImage?.url}
          alt={article.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
        />
        {isPremium && (
          <div className="absolute top-3 right-3 bg-charcoal/85 text-ivory text-[10px] px-2.5 py-1 flex items-center gap-1 uppercase tracking-widest backdrop-blur-sm">
            <IoLockClosed size={11} /> Premium
          </div>
        )}
      </Link>

      <div className="pt-4 flex flex-col flex-1">
        {article.category && (
          <div className="mb-2">
            <CategoryBadge category={article.category} />
          </div>
        )}

        <Link to={`/articles/${article._id}`}>
          <h3 className="font-display text-xl text-charcoal group-hover:text-crimson transition-colors line-clamp-2 mb-2">
            {article.title}
          </h3>
        </Link>

        <p className="text-sm text-charcoal-soft line-clamp-2 mb-3 leading-relaxed">
          {article.excerpt}
        </p>

        <div className="flex items-center gap-3 text-xs text-muted mt-auto pt-2 font-sans">
          <span className="font-medium text-charcoal-soft">
            {article.author}
          </span>
          <span className="text-line">·</span>
          <span className="flex items-center gap-1">
            <IoTimeOutline size={12} />
            {formatReadingTime(article.readingTime)}
          </span>
        </div>
      </div>
    </motion.article>
  );
};

export default ArticleCard;
