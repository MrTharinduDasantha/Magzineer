// Recent orders table — most recent succeeded payments on the dashboard
import { formatCurrency } from "../../utils/formatCurrency.js";
import { formatRelative } from "../../utils/formatDate.js";

const RecentOrdersTable = ({ orders = [] }) => {
  return (
    <div className="card-mz overflow-hidden">
      <div className="p-5 lg:p-6 border-b border-line">
        <h3 className="font-display text-lg text-charcoal">Recent Orders</h3>
        <p className="text-xs text-muted mt-0.5">
          Latest 10 successful transactions
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-cream/50">
            <tr className="text-left text-xs uppercase tracking-widest text-muted">
              <th className="px-5 py-3 font-medium">Order</th>
              <th className="px-5 py-3 font-medium">User</th>
              <th className="px-5 py-3 font-medium">Type</th>
              <th className="px-5 py-3 font-medium">Amount</th>
              <th className="px-5 py-3 font-medium">When</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-muted">
                  No recent orders yet.
                </td>
              </tr>
            )}

            {orders.map((o) => (
              <tr
                key={o._id}
                className="border-t border-line hover:bg-cream/40 transition-colors"
              >
                <td className="px-5 py-3 font-mono text-xs text-charcoal">
                  {o.orderId}
                </td>
                <td className="px-5 py-3 text-charcoal">
                  {o.user?.name || "—"}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${
                      o.type === "subscription"
                        ? "bg-crimson/10 text-crimson"
                        : "bg-gold/15 text-gold"
                    }`}
                  >
                    {o.type}
                  </span>
                </td>
                <td className="px-5 py-3 font-medium text-charcoal">
                  {formatCurrency(o.amount)}
                </td>
                <td className="px-5 py-3 text-muted text-xs">
                  {formatRelative(o.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrdersTable;
