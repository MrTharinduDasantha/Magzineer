// Combined payment table — used on the admin Payments page with filters
import Pagination from "../common/Pagination.jsx";
import { formatDate } from "../../utils/formatDate.js";
import { formatCurrency } from "../../utils/formatCurrency.js";

const PaymentTable = ({
  payments = [],
  pagination,
  filters,
  onFilterChange,
  onPageChange,
}) => {
  const setF = (key, value) =>
    onFilterChange?.({ ...filters, [key]: value, page: 1 });

  return (
    <>
      <div className="card-mz p-4 mb-4 flex flex-wrap gap-3">
        <select
          value={filters?.type || ""}
          onChange={(e) => setF("type", e.target.value)}
          className="px-3 py-2 bg-cream border border-line rounded text-sm"
        >
          <option value="">All types</option>
          <option value="subscription">Subscription</option>
          <option value="purchase">Single Issue</option>
        </select>

        <select
          value={filters?.status || ""}
          onChange={(e) => setF("status", e.target.value)}
          className="px-3 py-2 bg-cream border border-line rounded text-sm"
        >
          <option value="">All statuses</option>
          <option value="succeeded">Succeeded</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>

        <input
          type="date"
          value={filters?.from || ""}
          onChange={(e) => setF("from", e.target.value)}
          className="px-3 py-2 bg-cream border border-line rounded text-sm"
        />
        <input
          type="date"
          value={filters?.to || ""}
          onChange={(e) => setF("to", e.target.value)}
          className="px-3 py-2 bg-cream border border-line rounded text-sm"
        />
      </div>

      <div className="card-mz overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream/50">
              <tr className="text-left text-xs uppercase tracking-widest text-muted">
                <th className="px-5 py-3 font-medium">Order ID</th>
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-muted">
                    No payments found.
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
                  <td className="px-5 py-3">
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${
                        p.type === "subscription"
                          ? "bg-crimson/10 text-crimson"
                          : "bg-gold/15 text-gold"
                      }`}
                    >
                      {p.type}
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

      <Pagination
        page={pagination?.page || 1}
        totalPages={pagination?.totalPages || 0}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default PaymentTable;
