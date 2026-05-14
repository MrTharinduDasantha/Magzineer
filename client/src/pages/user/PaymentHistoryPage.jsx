// Payment history — invoices/receipts for both subscriptions and single-issue purchases
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getMyPaymentsApi } from "../../api/payment.api.js";
import Loader from "../../components/common/Loader.jsx";
import Breadcrumb from "../../components/common/Breadcrumb.jsx";
import { formatDateTime } from "../../utils/formatDate.js";
import { formatCurrency } from "../../utils/formatCurrency.js";

const statusPalette = {
  succeeded: "bg-emerald-100 text-emerald-700",
  pending: "bg-charcoal/10 text-charcoal",
  failed: "bg-crimson/10 text-crimson",
  refunded: "bg-gold/15 text-gold",
};

const PaymentHistoryPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getMyPaymentsApi();
        setPayments(data.data.payments || []);
      } catch {
        setPayments([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container-mz py-10 lg:py-14 pb-20">
      <Breadcrumb
        items={[{ label: "Home", to: "/" }, { label: "Payment History" }]}
      />

      <div className="mt-6 mb-10">
        <p className="eyebrow mb-3">My Account</p>
        <h1 className="heading-rule font-display text-3xl sm:text-4xl text-charcoal">
          Payment History
        </h1>
      </div>

      {payments.length === 0 ? (
        <p className="text-muted py-12 text-center">No payments yet.</p>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-mz overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream/50">
                <tr className="text-left text-xs uppercase tracking-widest text-muted">
                  <th className="px-5 py-3 font-medium">Order ID</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr
                    key={p._id}
                    className="border-t border-line hover:bg-cream/40"
                  >
                    <td className="px-5 py-3 font-mono text-xs text-charcoal">
                      {p.orderId}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${
                          p.type === "subscription"
                            ? "bg-crimson/10 text-crimson"
                            : "bg-gold/15 text-gold"
                        }`}
                      >
                        {p.type === "subscription"
                          ? "Subscription"
                          : "Single Issue"}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-medium text-charcoal">
                      {formatCurrency(
                        p.amount,
                        (p.currency || "usd").toUpperCase(),
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${statusPalette[p.status]}`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-muted">
                      {formatDateTime(p.paidAt || p.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PaymentHistoryPage;
