// Subscription plans management page
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoAddOutline } from "react-icons/io5";
import { adminGetAllPlansApi } from "../../api/subscriptionPlan.api.js";
import PlanTable from "../../components/admin/PlanTable.jsx";
import PlanForm from "../../components/admin/PlanForm.jsx";
import Modal from "../../components/common/Modal.jsx";
import Loader from "../../components/common/Loader.jsx";

const AdminSubscriptionPlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const refresh = async () => {
    try {
      setLoading(true);
      const { data } = await adminGetAllPlansApi();
      setPlans(data.data.plans || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div>
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-3 mb-8"
      >
        <div>
          <p className="eyebrow mb-2">Monetization</p>
          <h1 className="font-display text-3xl lg:text-4xl text-charcoal">
            Subscription Plans
          </h1>
          <p className="text-sm text-muted mt-1">
            Plans automatically sync with Stripe Products + Prices.
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="btn-primary inline-flex items-center gap-2"
        >
          <IoAddOutline size={18} /> New Plan
        </button>
      </motion.header>

      {loading ? (
        <Loader fullScreen={false} />
      ) : (
        <PlanTable
          plans={plans}
          onEdit={(p) => {
            setEditing(p);
            setModalOpen(true);
          }}
          onRefresh={refresh}
        />
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Plan" : "Create Plan"}
        size="lg"
      >
        <PlanForm
          plan={editing}
          onSuccess={() => {
            setModalOpen(false);
            setEditing(null);
            refresh();
          }}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default AdminSubscriptionPlansPage;
