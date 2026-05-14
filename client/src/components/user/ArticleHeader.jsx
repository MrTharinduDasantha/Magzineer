// Editorial article header — category, title, excerpt, byline, hero image
import { motion } from "framer-motion";
import CategoryBadge from "./CategoryBadge.jsx";
import AuthorByline from "./AuthorByline.jsx";
import { formatDateLong } from "../../utils/formatDate.js";
import { formatReadingTime } from "../../utils/formatReadingTime.js";

const ArticleHeader = ({ article }) => {
  if (!article) return null;

  return (
    <header className="text-center max-w-3xl mx-auto pt-10 lg:pt-14 pb-10">
      {/* Category */}
      {article.category && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5 flex justify-center"
        >
          <CategoryBadge category={article.category} size="md" />
        </motion.div>
      )}

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-display text-3xl sm:text-4xl lg:text-6xl leading-tight text-charcoal mb-5"
      >
        {article.title}
      </motion.h1>

      {/* Excerpt */}
      {article.excerpt && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg lg:text-xl font-display italic text-charcoal-soft leading-relaxed mb-8"
        >
          {article.excerpt}
        </motion.p>
      )}

      {/* Byline + reading time */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex justify-center mb-10"
      >
        <AuthorByline
          author={article.author}
          publishedAt={formatDateLong(article.createdAt)}
          readingTime={formatReadingTime(article.readingTime)}
        />
      </motion.div>

      {/* Featured image */}
      {article.featuredImage?.url && (
        <motion.figure
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="aspect-video overflow-hidden bg-cream"
        >
          <img
            src={article.featuredImage.url}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </motion.figure>
      )}
    </header>
  );
};

export default ArticleHeader;
