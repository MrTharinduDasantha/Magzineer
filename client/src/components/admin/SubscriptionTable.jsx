// Subscription list — derived from the payments ledger filtered by type=subscription
import { formatDate } from "../../utils/formatDate.js";
import { formatCurrency } from "../../utils/formatCurrency.js";

const SubscriptionTable = ({ payments = [] }) => {
  return (
    <div className="card-mz overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-cream/50">
            <tr className="text-left text-xs uppercase tracking-widest text-muted">
              <th className="px-5 py-3 font-medium">Order ID</th>
              <th className="px-5 py-3 font-medium">User</th>
              <th className="px-5 py-3 font-medium">Amount</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-muted">
                  No subscription payments yet.
                </td>
              </tr>
            )}
            {payments.map((p) => (
              <tr
                key={p._id}
                className="border-t border-line hover:bg-cream/40"
              >
                <td className="px-5 py-3 font-mono text-xs text-charcoal">
                  {p.orderId}
                </td>
                <td className="px-5 py-3 text-charcoal">
                  {p.user?.name}
                  <span className="block text-xs text-muted">
                    {p.user?.email}
                  </span>
                </td>
                <td className="px-5 py-3 font-medium text-charcoal">
                  {formatCurrency(p.amount)}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${
                      p.status === "succeeded"
                        ? "bg-emerald-100 text-emerald-700"
                        : p.status === "failed"
                          ? "bg-crimson/10 text-crimson"
                          : "bg-charcoal/10 text-charcoal"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-xs text-muted">
                  {formatDate(p.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubscriptionTable;
