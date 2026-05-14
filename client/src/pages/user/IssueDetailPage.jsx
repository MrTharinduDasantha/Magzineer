// Issue detail — cover + meta on the left, article listing on the right
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { IoCalendarOutline, IoLockClosed } from "react-icons/io5";
import { toast } from "react-toastify";
import { getIssueByIdApi } from "../../api/issue.api.js";
import { createPurchaseCheckoutApi } from "../../api/purchase.api.js";
import { getMyPurchasesApi } from "../../api/purchase.api.js";
import Loader from "../../components/common/Loader.jsx";
import Breadcrumb from "../../components/common/Breadcrumb.jsx";
import CategoryBadge from "../../components/user/CategoryBadge.jsx";
import { formatDate } from "../../utils/formatDate.js";
import { formatCurrency } from "../../utils/formatCurrency.js";
import { formatReadingTime } from "../../utils/formatReadingTime.js";
import { staggerContainer, fadeUp } from "../../utils/motionVariants.js";

const IssueDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((s) => s.auth);
  const { current: subscription } = useSelector((s) => s.subscription);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Active subscription gives access to every article
  const hasSubscription =
    subscription?.status === "active" &&
    new Date(subscription.endDate).getTime() > Date.now();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getIssueByIdApi(id);
        setData(data.data);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Check if the logged-in reader has already purchased this single issue
  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      try {
        const { data } = await getMyPurchasesApi();
        const owned = (data.data.purchases || []).some(
          (p) => p.issue?._id === id || p.issue === id,
        );
        setHasPurchased(owned);
      } catch {
        /* ignore */
      }
    })();
  }, [isAuthenticated, id]);

  const handleBuy = async () => {
    if (!isAuthenticated) {
      toast.info("Please log in to purchase this issue.");
      return navigate("/login");
    }
    try {
      setCheckoutLoading(true);
      const { data } = await createPurchaseCheckoutApi(id);
      window.location.href = data.data.url;
    } catch (err) {
      toast.error(err.response?.data?.message || "Checkout failed.");
      setCheckoutLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (!data?.issue) {
    return (
      <div className="container-mz py-20 text-center">
        <p className="font-display text-2xl text-charcoal">Issue not found.</p>
      </div>
    );
  }

  const { issue, articles = [] } = data;
  const isFree = !issue.price || issue.price === 0;
  const hasIssueAccess = isFree || hasSubscription || hasPurchased;

  return (
    <div className="container-mz py-10 lg:py-14">
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Magazines", to: "/magazines" },
          {
            label: issue.magazine?.title,
            to: `/magazines/${issue.magazine?._id}`,
          },
          { label: issue.issueNumber },
        ]}
      />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[320px_1fr] xl:grid-cols-[360px_1fr] gap-10 lg:gap-14">
        {/* ─── Cover + meta sidebar ─── */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:sticky lg:top-24 self-start"
        >
          <img
            src={issue.cover?.url}
            alt={issue.issueNumber}
            className="w-full aspect-3/4 object-cover shadow-xl mb-6"
          />
          <p className="eyebrow mb-2">{issue.magazine?.title}</p>
          <h1 className="font-display text-2xl lg:text-3xl text-charcoal mb-2 leading-tight">
            {issue.title || `Issue ${issue.issueNumber}`}
          </h1>
          <p className="text-sm text-muted mb-4">{issue.issueNumber}</p>
          <p className="flex items-center gap-2 text-sm text-charcoal-soft mb-6">
            <IoCalendarOutline /> {formatDate(issue.publicationDate)}
          </p>

          {hasIssueAccess ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded">
              ✓ Full access — read every article below
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <button
                onClick={handleBuy}
                disabled={checkoutLoading}
                className="btn-primary w-full disabled:opacity-60"
              >
                {checkoutLoading
                  ? "Processing..."
                  : `Buy Issue · ${formatCurrency(issue.price)}`}
              </button>
              <Link to="/plans" className="btn-outline w-full">
                Or Subscribe for All Access
              </Link>
            </div>
          )}
        </motion.aside>

        {/* ─── Article list ─── */}
        <section>
          <p className="eyebrow mb-3">In This Issue</p>
          <h2 className="heading-rule font-display text-2xl lg:text-3xl text-charcoal mb-10">
            {articles.length} {articles.length === 1 ? "Article" : "Articles"}
          </h2>

          {articles.length === 0 ? (
            <p className="text-muted">No articles in this issue yet.</p>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex flex-col divide-y divide-line"
            >
              {articles.map((a) => {
                const locked = a.accessLevel === "premium" && !hasIssueAccess;
                return (
                  <motion.article
                    key={a._id}
                    variants={fadeUp}
                    className="flex flex-col sm:flex-row gap-5 py-6 first:pt-0 group"
                  >
                    <Link
                      to={`/articles/${a._id}`}
                      className="sm:w-48 shrink-0 aspect-4/3 overflow-hidden bg-cream"
                    >
                      <img
                        src={a.featuredImage?.url}
                        alt={a.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {a.category && <CategoryBadge category={a.category} />}
                        {locked && (
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-crimson">
                            <IoLockClosed size={10} /> Premium
                          </span>
                        )}
                      </div>
                      <Link to={`/articles/${a._id}`}>
                        <h3 className="font-display text-xl lg:text-2xl text-charcoal group-hover:text-crimson transition-colors mb-2 line-clamp-2">
                          {a.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-charcoal-soft line-clamp-2 mb-3">
                        {a.excerpt}
                      </p>
                      <div className="text-xs text-muted">
                        By <span className="text-charcoal">{a.author}</span> ·{" "}
                        {formatReadingTime(a.readingTime)}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
};

export default IssueDetailPage;
