// Full plan card with feature list and CTA — handles both anonymous (redirect to register)
// and authenticated checkout flows.
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { IoCheckmarkOutline, IoStar } from "react-icons/io5";
import { toast } from "react-toastify";
import { createSubscriptionCheckoutApi } from "../../api/subscription.api.js";
import { formatCurrency } from "../../utils/formatCurrency.js";

const PlanCard = ({ plan, popular = false }) => {
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useSelector((s) => s.auth);
  const navigate = useNavigate();

  if (!plan) return null;

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      toast.info("Please log in to subscribe.");
      navigate("/login", { state: { from: { pathname: "/plans" } } });
      return;
    }

    try {
      setLoading(true);
      const { data } = await createSubscriptionCheckoutApi(plan._id);
      window.location.href = data.data.url; // redirect to Stripe Checkout
    } catch (err) {
      toast.error(err.response?.data?.message || "Checkout failed.");
      setLoading(false);
    }
  };

  // Human-readable billing cycle
  const cycleLabel =
    plan.durationMonths === 1
      ? "/month"
      : plan.durationMonths === 12
        ? "/year"
        : ` / ${plan.durationMonths} months`;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className={`relative card-mz p-7 lg:p-9 flex flex-col h-full ${
        popular ? "border-2 border-crimson" : ""
      }`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-crimson text-ivory text-[10px] tracking-widest uppercase px-4 py-1.5 flex items-center gap-1.5">
          <IoStar size={12} /> Most Popular
        </div>
      )}

      <h3 className="font-display text-2xl lg:text-3xl text-charcoal mb-2">
        {plan.name}
      </h3>
      {plan.description && (
        <p className="text-sm text-muted mb-6 min-h-10">{plan.description}</p>
      )}

      <div className="flex items-baseline gap-1 mb-8 pb-6 border-b border-line">
        <span className="font-display text-5xl text-charcoal">
          {formatCurrency(plan.price).replace(/\.00$/, "")}
        </span>
        <span className="text-muted text-sm">{cycleLabel}</span>
      </div>

      <ul className="flex flex-col gap-3 mb-8 flex-1">
        {plan.features?.map((feature, idx) => (
          <li key={idx} className="flex gap-3 text-sm text-charcoal-soft">
            <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-crimson/10 text-crimson flex items-center justify-center">
              <IoCheckmarkOutline size={13} />
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <button
        onClick={handleSubscribe}
        disabled={loading}
        className={`w-full ${
          popular ? "btn-accent" : "btn-primary"
        } disabled:opacity-60 disabled:cursor-not-allowed`}
      >
        {loading ? "Processing..." : "Subscribe Now"}
      </button>
    </motion.div>
  );
};

export default PlanCard;
