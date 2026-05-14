// Combined payments page — all payment types with full filter bar
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { adminGetAllPaymentsApi } from "../../api/payment.api.js";
import PaymentTable from "../../components/admin/PaymentTable.jsx";
import Loader from "../../components/common/Loader.jsx";

const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 0 });
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    from: "",
    to: "",
    page: 1,
    limit: 20,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await adminGetAllPaymentsApi(filters);
        setPayments(data.data.payments || []);
        setPagination(data.data.pagination || { page: 1, totalPages: 0 });
      } finally {
        setLoading(false);
      }
    })();
  }, [filters]);

  return (
    <div>
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="eyebrow mb-2">Monetization</p>
        <h1 className="font-display text-3xl lg:text-4xl text-charcoal">
          All Payments
        </h1>
        <p className="text-sm text-muted mt-1">
          Combined ledger of subscription renewals and one-time purchases.
        </p>
      </motion.header>

      {loading && payments.length === 0 ? (
        <Loader fullScreen={false} />
      ) : (
        <PaymentTable
          payments={payments}
          pagination={pagination}
          filters={filters}
          onFilterChange={setFilters}
          onPageChange={(page) => setFilters({ ...filters, page })}
        />
      )}
    </div>
  );
};

export default AdminPaymentsPage;
