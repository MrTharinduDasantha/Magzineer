// Search results list — shows matching magazines first, then articles, with pagination
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import MagazineCard from "./MagazineCard.jsx";
import ArticleCard from "./ArticleCard.jsx";
import Pagination from "../common/Pagination.jsx";
import Loader from "../common/Loader.jsx";
import { setPage } from "../../app/features/searchSlice.js";
import { staggerContainer, fadeUp } from "../../utils/motionVariants.js";

const SearchResultsList = ({ onPageChange }) => {
  const dispatch = useDispatch();
  const { query, magazines, articles, pagination, loading } = useSelector(
    (s) => s.search,
  );

  const handlePage = (page) => {
    dispatch(setPage(page));
    onPageChange?.(page);
  };

  if (loading) return <Loader fullScreen={false} />;

  if (!query) {
    return (
      <div className="text-center py-20">
        <p className="text-muted">Enter a search term to begin.</p>
      </div>
    );
  }

  if (!magazines.length && !articles.length) {
    return (
      <div className="text-center py-20">
        <p className="font-display text-2xl text-charcoal mb-2">
          No results found
        </p>
        <p className="text-muted">
          We couldn't find anything matching "{query}". Try a different search
          or clear your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      {/* Magazines */}
      {magazines.length > 0 && (
        <section>
          <h2 className="eyebrow mb-4">Matching Magazines</h2>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {magazines.map((m) => (
              <motion.div key={m._id} variants={fadeUp}>
                <MagazineCard magazine={m} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Articles */}
      {articles.length > 0 && (
        <section>
          <div className="flex items-end justify-between mb-4">
            <h2 className="eyebrow">Matching Articles</h2>
            <p className="text-xs text-muted">
              {pagination.total} {pagination.total === 1 ? "result" : "results"}
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {articles.map((a) => (
              <motion.div key={a._id} variants={fadeUp}>
                <ArticleCard article={a} />
              </motion.div>
            ))}
          </motion.div>

          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePage}
          />
        </section>
      )}
    </div>
  );
};

export default SearchResultsList;
