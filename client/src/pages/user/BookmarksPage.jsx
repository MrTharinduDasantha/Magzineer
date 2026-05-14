// Saved articles — remove + go-read links
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IoTrashOutline, IoArrowForwardOutline } from "react-icons/io5";
import {
  fetchMyBookmarks,
  removeBookmark,
} from "../../app/features/bookmarkSlice.js";
import Loader from "../../components/common/Loader.jsx";
import Breadcrumb from "../../components/common/Breadcrumb.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import CategoryBadge from "../../components/user/CategoryBadge.jsx";
import { formatReadingTime } from "../../utils/formatReadingTime.js";
import { staggerContainer, fadeUp } from "../../utils/motionVariants.js";
import emptyBookmarks from "../../assets/empty-bookmarks.png";

const BookmarksPage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((s) => s.bookmarks);

  useEffect(() => {
    dispatch(fetchMyBookmarks());
  }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <div className="container-mz py-10 lg:py-14 pb-20">
      <Breadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Bookmarks" }]}
      />

      <div className="mt-6 mb-10">
        <p className="eyebrow mb-3">My Account</p>
        <h1 className="heading-rule font-display text-3xl sm:text-4xl text-charcoal">
          Saved Articles
        </h1>
      </div>

      {items.length === 0 ? (
        <EmptyState
          image={emptyBookmarks}
          title="No bookmarks yet"
          message="Save articles you love and revisit them anytime."
          ctaLabel="Discover Articles"
          ctaTo="/magazines"
        />
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col divide-y divide-line"
        >
          {items.map((b) => {
            const a = b.article;
            if (!a) return null;
            return (
              <motion.div
                key={b._id}
                variants={fadeUp}
                className="flex flex-col sm:flex-row gap-5 py-6 first:pt-0 group"
              >
                <Link
                  to={`/articles/${a._id}`}
                  className="sm:w-44 shrink-0 aspect-4/3 overflow-hidden bg-cream"
                >
                  <img
                    src={a.featuredImage?.url}
                    alt={a.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  {a.category && (
                    <div className="mb-2">
                      <CategoryBadge category={a.category} />
                    </div>
                  )}
                  <Link to={`/articles/${a._id}`}>
                    <h3 className="font-display text-xl lg:text-2xl text-charcoal group-hover:text-crimson transition-colors mb-2 line-clamp-2">
                      {a.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-charcoal-soft line-clamp-2 mb-3">
                    {a.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                    <span className="text-charcoal">By {a.author}</span>
                    <span>·</span>
                    <span>{formatReadingTime(a.readingTime)}</span>
                    {a.magazine?.title && (
                      <>
                        <span>·</span>
                        <Link
                          to={`/magazines/${a.magazine._id}`}
                          className="hover:text-crimson"
                        >
                          {a.magazine.title}
                        </Link>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2 sm:items-end">
                  <Link
                    to={`/articles/${a._id}`}
                    className="inline-flex items-center gap-2 text-sm text-charcoal hover:text-crimson transition-colors group"
                  >
                    Read
                    <IoArrowForwardOutline
                      size={13}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                  <button
                    onClick={() => dispatch(removeBookmark(b._id))}
                    className="text-xs text-muted hover:text-crimson inline-flex items-center gap-1 transition-colors"
                  >
                    <IoTrashOutline size={13} /> Remove
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default BookmarksPage;
