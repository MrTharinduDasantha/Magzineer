// Paywall CTA — shown when a premium article's content is hidden
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  IoLockClosed,
  IoSparklesOutline,
  IoArrowForwardOutline,
} from "react-icons/io5";
import { toast } from "react-toastify";
import { createPurchaseCheckoutApi } from "../../api/purchase.api.js";
import { formatCurrency } from "../../utils/formatCurrency.js";

const ArticlePaywall = ({ article }) => {
  const { isAuthenticated } = useSelector((s) => s.auth);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const issuePrice = article?.issue?.price;
  const canBuyIssue = !!article?.issue && issuePrice > 0;

  const handleBuyIssue = async () => {
    if (!isAuthenticated) {
      toast.info("Please log in to purchase this issue.");
      return navigate("/login");
    }
    try {
      setLoading(true);
      const { data } = await createPurchaseCheckoutApi(
        article.issue._id || article.issue,
      );
      window.location.href = data.data.url; // → Stripe Checkout
    } catch (err) {
      toast.error(err.response?.data?.message || "Checkout failed.");
      setLoading(false);
    }
  };

  return (
    <motion.aside
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative my-10"
    >
      {/* Soft top fade — visually suggests the cut-off */}
      <div className="absolute -top-32 left-0 right-0 h-32 bg-linear-to-b from-transparent to-ivory pointer-events-none" />

      <div className="bg-paper border border-line p-8 lg:p-12 text-center relative overflow-hidden">
        {/* Decorative gold corner */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-gold/12 rounded-full" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-charcoal text-ivory px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] mb-6">
            <IoLockClosed size={12} /> Premium Article
          </div>

          <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl text-charcoal mb-4">
            Continue Reading with Magzineer
          </h3>
          <p className="text-muted max-w-xl mx-auto mb-8 leading-relaxed">
            This story is part of our premium library. Subscribe for unlimited
            access to every magazine, or buy this single issue to keep reading
            now.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <Link to="/plans" className="btn-accent w-full sm:w-auto group">
              <IoSparklesOutline size={16} />
              Subscribe Now
              <IoArrowForwardOutline
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>

            {canBuyIssue && (
              <button
                onClick={handleBuyIssue}
                disabled={loading}
                className="btn-outline w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Processing..."
                  : `Buy Issue · ${formatCurrency(issuePrice)}`}
              </button>
            )}
          </div>

          {!isAuthenticated && (
            <p className="text-xs text-muted mt-6">
              Already a subscriber?{" "}
              <Link to="/login" className="text-crimson hover:underline">
                Log in
              </Link>
            </p>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export default ArticlePaywall;
