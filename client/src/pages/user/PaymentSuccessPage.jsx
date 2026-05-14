// Stripe redirects here after a successful checkout
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { IoCheckmarkCircle, IoArrowForwardOutline } from "react-icons/io5";
import { fetchMySubscription } from "../../app/features/subscriptionSlice.js";

const PaymentSuccessPage = () => {
  const dispatch = useDispatch();

  // Refresh subscription state so the user sees their new access right away (the webhook may take a moment, so we retry briefly)
  useEffect(() => {
    const timers = [500, 2000, 5000].map((delay) =>
      setTimeout(() => dispatch(fetchMySubscription()), delay),
    );
    return () => timers.forEach(clearTimeout);
  }, [dispatch]);

  return (
    <div className="container-mz py-20 lg:py-28 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 220,
            damping: 18,
            delay: 0.2,
          }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-100 text-emerald-600 mb-6"
        >
          <IoCheckmarkCircle size={56} />
        </motion.div>

        <p className="eyebrow mb-3">Payment Successful</p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-charcoal mb-5">
          Welcome to Magzineer
        </h1>
        <p className="text-charcoal-soft mb-10 leading-relaxed">
          Your payment has been confirmed and your access is being activated.
          You may see your new subscription or purchased issue appear
          momentarily.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary group">
            Start Reading
            <IoArrowForwardOutline
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
          <Link to="/my-subscriptions" className="btn-outline">
            Manage Account
          </Link>
        </div>

        <p className="text-xs text-muted mt-8">
          A receipt has been sent to your email.
        </p>
      </motion.div>
    </div>
  );
};

export default PaymentSuccessPage;
