// Compact author byline used in article headers and lists
import { motion } from "framer-motion";

const AuthorByline = ({ author, publishedAt, readingTime }) => {
  if (!author) return null;
  // Initials for the avatar circle
  const initials = author
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-3"
    >
      <div className="w-11 h-11 rounded-full bg-charcoal text-ivory flex items-center justify-center font-display text-sm shrink-0">
        {initials}
      </div>
      <div>
        <p className="text-sm font-medium text-charcoal">By {author}</p>
        <p className="text-xs text-muted flex items-center gap-2 mt-0.5">
          {publishedAt && <span>{publishedAt}</span>}
          {publishedAt && readingTime && <span>·</span>}
          {readingTime && <span>{readingTime}</span>}
        </p>
      </div>
    </motion.div>
  );
};

export default AuthorByline;
