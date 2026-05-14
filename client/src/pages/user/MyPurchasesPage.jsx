// Purchased single issues — direct link to read each
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IoArrowForwardOutline } from "react-icons/io5";
import { getMyPurchasesApi } from "../../api/purchase.api.js";
import Loader from "../../components/common/Loader.jsx";
import Breadcrumb from "../../components/common/Breadcrumb.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { formatDate } from "../../utils/formatDate.js";
import { formatCurrency } from "../../utils/formatCurrency.js";
import { staggerContainer, fadeUp } from "../../utils/motionVariants.js";
import emptyPurchases from "../../assets/empty-purchases.png";

const MyPurchasesPage = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getMyPurchasesApi();
        setPurchases(data.data.purchases || []);
      } catch {
        setPurchases([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container-mz py-10 lg:py-14 pb-20">
      <Breadcrumb
        items={[{ label: "Home", to: "/" }, { label: "My Purchases" }]}
      />

      <div className="mt-6 mb-10">
        <p className="eyebrow mb-3">My Account</p>
        <h1 className="heading-rule font-display text-3xl sm:text-4xl text-charcoal">
          Purchased Issues
        </h1>
      </div>

      {purchases.length === 0 ? (
        <EmptyState
          image={emptyPurchases}
          title="No purchased issues yet"
          message="Buy single issues to read their full content — or subscribe for unlimited access."
          ctaLabel="Browse Magazines"
          ctaTo="/magazines"
        />
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {purchases.map((p) => (
            <motion.div
              key={p._id}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="card-mz overflow-hidden flex flex-col"
            >
              <Link
                to={`/issues/${p.issue?._id}`}
                className="block aspect-3/4 overflow-hidden bg-cream"
              >
                <img
                  src={p.issue?.cover?.url}
                  alt={p.issue?.issueNumber}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </Link>
              <div className="p-5 flex flex-col flex-1">
                <p className="eyebrow text-[10px] mb-2">
                  {p.issue?.magazine?.title}
                </p>
                <h3 className="font-display text-lg text-charcoal mb-1 line-clamp-1">
                  {p.issue?.title || `Issue ${p.issue?.issueNumber}`}
                </h3>
                <p className="text-xs text-muted mb-3">
                  Purchased {formatDate(p.createdAt)} ·{" "}
                  {formatCurrency(p.amount)}
                </p>
                <Link
                  to={`/issues/${p.issue?._id}`}
                  className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-charcoal hover:text-crimson transition-colors group"
                >
                  Read Issue
                  <IoArrowForwardOutline
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default MyPurchasesPage;
