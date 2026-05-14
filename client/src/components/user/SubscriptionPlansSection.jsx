// Homepage — 3-up overview of subscription plans
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IoArrowForwardOutline } from "react-icons/io5";
import { fetchActivePlans } from "../../app/features/subscriptionSlice.js";
import PlanCard from "./PlanCard.jsx";
import { staggerContainer, fadeUp } from "../../utils/motionVariants.js";

const SubscriptionPlansSection = () => {
  const dispatch = useDispatch();
  const { plans } = useSelector((s) => s.subscription);

  useEffect(() => {
    if (!plans?.length) dispatch(fetchActivePlans());
  }, [dispatch, plans?.length]);

  if (!plans?.length) return null;

  // Show up to 3 plans on homepage; middle one is highlighted as "most popular"
  const top = plans.slice(0, 3);
  const popularIdx = top.length >= 3 ? 1 : top.length - 1;

  return (
    <section className="py-16 lg:py-24 bg-paper relative overflow-hidden">
      {/* Decorative pattern background */}
      <div className="absolute inset-0 bg-pattern opacity-30 pointer-events-none" />

      <div className="container-mz relative">
        <div className="text-center mb-12 lg:mb-16">
          <p className="eyebrow mb-3">Membership</p>
          <h2 className="heading-rule center font-display text-3xl sm:text-4xl lg:text-5xl text-charcoal mx-auto">
            Choose Your Plan
          </h2>
          <p className="text-muted mt-5 max-w-2xl mx-auto">
            Unlimited access to every premium article across our entire library
            — no ads, no clutter, just stories that matter.
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8 max-w-5xl mx-auto"
        >
          {top.map((plan, idx) => (
            <motion.div key={plan._id} variants={fadeUp}>
              <PlanCard plan={plan} popular={idx === popularIdx} />
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <Link
            to="/plans"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-wider text-charcoal hover:text-crimson transition-colors group"
          >
            Compare All Plans
            <IoArrowForwardOutline
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionPlansSection;
