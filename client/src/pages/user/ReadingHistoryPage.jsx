// Reading history — recent articles + clear button
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  IoTimeOutline,
  IoArrowForwardOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { toast } from "react-toastify";
import {
  getMyHistoryApi,
  clearHistoryApi,
} from "../../api/readingHistory.api.js";
import Loader from "../../components/common/Loader.jsx";
import Breadcrumb from "../../components/common/Breadcrumb.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import { formatRelative } from "../../utils/formatDate.js";
import { formatReadingTime } from "../../utils/formatReadingTime.js";
import { staggerContainer, fadeUp } from "../../utils/motionVariants.js";
import emptyHistory from "../../assets/empty-history.png";

const ReadingHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmClear, setConfirmClear] = useState(false);

  const load = async () => {
    try {
      const { data } = await getMyHistoryApi();
      setHistory(data.data.history || []);
    } catch {
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleClear = async () => {
    try {
      await clearHistoryApi();
      toast.success("Reading history cleared.");
      setHistory([]);
    } catch {
      toast.error("Failed to clear.");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container-mz py-10 lg:py-14 pb-20">
      <Breadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Reading History" }]}
      />

      <div className="mt-6 mb-10 flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="eyebrow mb-3">My Account</p>
          <h1 className="heading-rule font-display text-3xl sm:text-4xl text-charcoal">
            Reading History
          </h1>
        </div>
        {history.length > 0 && (
          <button
            onClick={() => setConfirmClear(true)}
            className="inline-flex items-center gap-2 text-sm text-crimson hover:underline"
          >
            <IoTrashOutline size={15} /> Clear history
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <EmptyState
          image={emptyHistory}
          title="No reading history yet"
          message="Articles you read will appear here so you can easily return to them."
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
          {history.map((h) => {
            const a = h.article;
            if (!a) return null;
            return (
              <motion.div
                key={h._id}
                variants={fadeUp}
                className="flex flex-col sm:flex-row gap-5 py-5 first:pt-0 group"
              >
                <Link
                  to={`/articles/${a._id}`}
                  className="sm:w-32 shrink-0 aspect-4/3 overflow-hidden bg-cream"
                >
                  <img
                    src={a.featuredImage?.url}
                    alt={a.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/articles/${a._id}`}>
                    <h3 className="font-display text-lg text-charcoal group-hover:text-crimson transition-colors mb-1 line-clamp-2">
                      {a.title}
                    </h3>
                  </Link>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted mt-1">
                    <span className="flex items-center gap-1 text-charcoal">
                      <IoTimeOutline size={13} /> Read{" "}
                      {formatRelative(h.lastReadAt)}
                    </span>
                    {a.author && (
                      <>
                        <span>·</span>
                        <span>By {a.author}</span>
                      </>
                    )}
                    <span>·</span>
                    <span>{formatReadingTime(a.readingTime)}</span>
                  </div>
                </div>
                <Link
                  to={`/articles/${a._id}`}
                  className="inline-flex items-center gap-2 text-sm text-charcoal hover:text-crimson transition-colors group self-start sm:self-center"
                >
                  Continue
                  <IoArrowForwardOutline
                    size={13}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      <ConfirmDialog
        isOpen={confirmClear}
        onClose={() => setConfirmClear(false)}
        onConfirm={handleClear}
        title="Clear Reading History?"
        message="This will permanently remove all entries from your reading history."
        confirmText="Clear All"
        variant="danger"
      />
    </div>
  );
};

export default ReadingHistoryPage;
