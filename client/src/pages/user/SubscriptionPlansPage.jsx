// Plans comparison page — all active plans side by side
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fetchActivePlans } from "../../app/features/subscriptionSlice.js";
import PlanCard from "../../components/user/PlanCard.jsx";
import Loader from "../../components/common/Loader.jsx";
import Breadcrumb from "../../components/common/Breadcrumb.jsx";
import { staggerContainer, fadeUp } from "../../utils/motionVariants.js";

const SubscriptionPlansPage = () => {
  const dispatch = useDispatch();
  const { plans, plansLoading } = useSelector((s) => s.subscription);

  useEffect(() => {
    dispatch(fetchActivePlans());
  }, [dispatch]);

  // Mark the middle plan (or only/best plan) as the "most popular" recommendation
  const popularIdx = plans.length >= 3 ? 1 : Math.max(0, plans.length - 1);

  return (
    <div className="pb-20">
      <section className="bg-cream/40 py-14 lg:py-20">
        <div className="container-mz">
          <Breadcrumb
            items={[
              { label: "Home", to: "/" },
              { label: "Subscription Plans" },
            ]}
          />

          <div className="text-center max-w-2xl mx-auto mt-8">
            <p className="eyebrow mb-3">Membership</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-charcoal leading-tight mb-5">
              Become a Magzineer Member
            </h1>
            <p className="text-charcoal-soft leading-relaxed">
              Unlimited access to every premium article across our entire
              library. No ads. No clutter. Just stories worth your time.
            </p>
          </div>
        </div>
      </section>

      <div className="container-mz py-14 lg:py-20">
        {plansLoading ? (
          <Loader fullScreen={false} />
        ) : plans.length === 0 ? (
          <p className="text-center text-muted py-12">No plans available.</p>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-6xl mx-auto"
          >
            {plans.map((plan, idx) => (
              <motion.div key={plan._id} variants={fadeUp}>
                <PlanCard plan={plan} popular={idx === popularIdx} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* FAQ teaser */}
        <div className="text-center mt-16 max-w-2xl mx-auto">
          <p className="eyebrow mb-3">Trusted by readers worldwide</p>
          <h2 className="font-display text-2xl text-charcoal mb-3">
            Cancel anytime · No long-term commitment
          </h2>
          <p className="text-sm text-muted">
            All subscriptions are processed securely through Stripe. You can
            manage or cancel your plan from your account at any time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlansPage;
