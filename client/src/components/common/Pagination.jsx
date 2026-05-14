// Animated pagination — shows up to 5 numbered pages with first/prev/next/last
import { motion } from "framer-motion";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  // Build a windowed list of page numbers around the current page
  const buildPages = () => {
    const pages = [];
    const max = 5;
    let start = Math.max(1, page - Math.floor(max / 2));
    let end = Math.min(totalPages, start + max - 1);
    if (end - start + 1 < max) start = Math.max(1, end - max + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const pages = buildPages();

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 py-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="px-3 py-2 rounded border border-line bg-paper text-charcoal disabled:opacity-40 disabled:cursor-not-allowed hover:bg-charcoal hover:text-ivory transition-colors"
        aria-label="Previous page"
      >
        <IoChevronBack size={16} />
      </button>

      {pages[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3.5 py-2 rounded border border-line bg-paper text-sm hover:bg-charcoal hover:text-ivory transition-colors"
          >
            1
          </button>
          {pages[0] > 2 && <span className="text-muted px-1">…</span>}
        </>
      )}

      {pages.map((p) => (
        <motion.button
          key={p}
          whileTap={{ scale: 0.92 }}
          onClick={() => onPageChange(p)}
          className={`px-3.5 py-2 rounded border text-sm transition-colors ${
            p === page
              ? "bg-charcoal text-ivory border-charcoal"
              : "bg-paper text-charcoal border-line hover:bg-charcoal hover:text-ivory"
          }`}
        >
          {p}
        </motion.button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="text-muted px-1">…</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3.5 py-2 rounded border border-line bg-paper text-sm hover:bg-charcoal hover:text-ivory transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="px-3 py-2 rounded border border-line bg-paper text-charcoal disabled:opacity-40 disabled:cursor-not-allowed hover:bg-charcoal hover:text-ivory transition-colors"
        aria-label="Next page"
      >
        <IoChevronForward size={16} />
      </button>
    </div>
  );
};

export default Pagination;
