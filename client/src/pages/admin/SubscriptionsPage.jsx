// Admin subscription payments — list of all subscription-type payments
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { adminGetAllPaymentsApi } from "../../api/payment.api.js";
import SubscriptionTable from "../../components/admin/SubscriptionTable.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import Loader from "../../components/common/Loader.jsx";

const AdminSubscriptionsPage = () => {
  const [payments, setPayments] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await adminGetAllPaymentsApi({
          type: "subscription",
          page,
          limit: 20,
        });
        setPayments(data.data.payments || []);
        setPagination(data.data.pagination || { page: 1, totalPages: 0 });
      } finally {
        setLoading(false);
      }
    })();
  }, [page]);

  return (
    <div>
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="eyebrow mb-2">Monetization</p>
        <h1 className="font-display text-3xl lg:text-4xl text-charcoal">
          Subscription Payments
        </h1>
      </motion.header>

      {loading && payments.length === 0 ? (
        <Loader fullScreen={false} />
      ) : (
        <>
          <SubscriptionTable payments={payments} />
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};

export default AdminSubscriptionsPage;
