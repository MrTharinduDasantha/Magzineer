// User's subscription dashboard — current plan, cancel, upgrade/downgrade
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  fetchMySubscription,
  fetchActivePlans,
} from "../../app/features/subscriptionSlice.js";
import {
  cancelSubscriptionApi,
  changeSubscriptionApi,
} from "../../api/subscription.api.js";
import Loader from "../../components/common/Loader.jsx";
import Breadcrumb from "../../components/common/Breadcrumb.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";
import { formatDateLong } from "../../utils/formatDate.js";
import { formatCurrency } from "../../utils/formatCurrency.js";
import emptySub from "../../assets/empty-subscriptions.png";

const statusPalette = {
  active: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-charcoal/10 text-charcoal",
  expired: "bg-crimson/10 text-crimson",
  pending: "bg-gold/15 text-gold",
};

const MySubscriptionsPage = () => {
  const dispatch = useDispatch();
  const {
    current: subscription,
    plans,
    loading,
  } = useSelector((s) => s.subscription);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [changing, setChanging] = useState("");

  useEffect(() => {
    dispatch(fetchMySubscription());
    dispatch(fetchActivePlans());
  }, [dispatch]);

  const handleCancel = async () => {
    try {
      await cancelSubscriptionApi();
      toast.success("Your subscription will end at the current period end.");
      dispatch(fetchMySubscription());
    } catch {
      toast.error("Failed to cancel.");
    }
  };

  const handleChange = async (planId) => {
    try {
      setChanging(planId);
      await changeSubscriptionApi(planId);
      toast.success("Plan updated.");
      dispatch(fetchMySubscription());
    } catch (err) {
      toast.error(err.response?.data?.message || "Plan change failed.");
    } finally {
      setChanging("");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container-mz py-10 lg:py-14 pb-20">
      <Breadcrumb
        items={[{ label: "Home", to: "/" }, { label: "My Subscriptions" }]}
      />

      <div className="mt-6 mb-10">
        <p className="eyebrow mb-3">My Account</p>
        <h1 className="heading-rule font-display text-3xl sm:text-4xl text-charcoal">
          My Subscription
        </h1>
      </div>

      {!subscription ? (
        <EmptyState
          image={emptySub}
          title="No active subscription"
          message="Become a Magzineer member to read every premium article across our entire library."
          ctaLabel="View Plans"
          ctaTo="/plans"
        />
      ) : (
        <>
          {/* Current subscription card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card-mz p-6 lg:p-8 mb-12"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-line">
              <div>
                <p className="eyebrow mb-2">Current Plan</p>
                <h2 className="font-display text-2xl lg:text-3xl text-charcoal">
                  {subscription.plan?.name}
                </h2>
              </div>
              <span
                className={`self-start text-xs uppercase tracking-widest px-3 py-1 ${statusPalette[subscription.status]}`}
              >
                {subscription.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-sm mb-6">
              <Info label="Price">
                {formatCurrency(subscription.plan?.price || 0)}
              </Info>
              <Info label="Started">
                {formatDateLong(subscription.startDate)}
              </Info>
              <Info
                label={
                  subscription.cancelAtPeriodEnd ? "Access Until" : "Renews On"
                }
              >
                {formatDateLong(subscription.endDate)}
              </Info>
            </div>

            {subscription.cancelAtPeriodEnd && (
              <div className="p-3 bg-gold/10 border border-gold/30 text-charcoal-soft text-sm rounded mb-5">
                ⚠ Your subscription is set to end at the current period end.
                You'll keep access until {formatDateLong(subscription.endDate)}.
              </div>
            )}

            {subscription.status === "active" &&
              !subscription.cancelAtPeriodEnd && (
                <button
                  onClick={() => setConfirmCancel(true)}
                  className="btn-outline text-crimson! border-crimson! hover:bg-crimson! hover:text-ivory!"
                >
                  Cancel Subscription
                </button>
              )}
          </motion.div>

          {/* Change plan */}
          {subscription.status === "active" && (
            <section>
              <h3 className="font-display text-2xl text-charcoal mb-2">
                Change Plan
              </h3>
              <p className="text-muted text-sm mb-8">
                Switching plans is prorated — you'll only be charged the
                difference.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans
                  .filter((p) => p._id !== subscription.plan?._id)
                  .map((plan) => (
                    <div key={plan._id} className="card-mz p-6">
                      <h4 className="font-display text-xl text-charcoal mb-2">
                        {plan.name}
                      </h4>
                      <p className="font-display text-3xl text-charcoal mb-1">
                        {formatCurrency(plan.price).replace(/\.00$/, "")}
                        <span className="text-sm text-muted font-sans">
                          {plan.durationMonths === 1
                            ? " /month"
                            : plan.durationMonths === 12
                              ? " /year"
                              : ` / ${plan.durationMonths}m`}
                        </span>
                      </p>
                      <p className="text-sm text-muted mb-5 line-clamp-2 min-h-10">
                        {plan.description}
                      </p>
                      <button
                        onClick={() => handleChange(plan._id)}
                        disabled={changing === plan._id}
                        className="btn-outline w-full disabled:opacity-60"
                      >
                        {changing === plan._id
                          ? "Switching..."
                          : "Switch to This Plan"}
                      </button>
                    </div>
                  ))}
              </div>

              <p className="text-center mt-8">
                <Link
                  to="/plans"
                  className="text-sm text-crimson hover:underline"
                >
                  Compare all plans →
                </Link>
              </p>
            </section>
          )}
        </>
      )}

      <ConfirmDialog
        isOpen={confirmCancel}
        onClose={() => setConfirmCancel(false)}
        onConfirm={handleCancel}
        title="Cancel Subscription?"
        message={`You'll keep access until ${
          subscription ? formatDateLong(subscription.endDate) : "the period end"
        }. You can resubscribe anytime.`}
        confirmText="Yes, Cancel"
        cancelText="Keep Subscription"
        variant="danger"
      />
    </div>
  );
};

const Info = ({ label, children }) => (
  <div>
    <p className="text-[10px] uppercase tracking-widest text-muted font-medium mb-1">
      {label}
    </p>
    <p className="text-charcoal font-medium">{children}</p>
  </div>
);

export default MySubscriptionsPage;
