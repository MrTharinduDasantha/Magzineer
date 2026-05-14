// Stripe redirects here if the user cancels checkout
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IoCloseCircleOutline } from "react-icons/io5";

const PaymentCancelPage = () => {
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
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-cream text-charcoal mb-6"
        >
          <IoCloseCircleOutline size={56} />
        </motion.div>

        <p className="eyebrow mb-3">Payment Cancelled</p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-charcoal mb-5">
          No Charge Was Made
        </h1>
        <p className="text-charcoal-soft mb-10 leading-relaxed">
          You closed the checkout before completing payment. Your card has not
          been charged. Whenever you're ready, you can return to subscribe or
          buy a single issue.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/plans" className="btn-primary">
            Back to Plans
          </Link>
          <Link to="/" className="btn-outline">
            Return Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentCancelPage;
