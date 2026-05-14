// Detailed view of a single user — subscription, purchases, bookmark count
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { IoArrowBackOutline } from "react-icons/io5";
import { getUserDetailApi } from "../../api/admin.api.js";
import UserDetailView from "../../components/admin/UserDetailView.jsx";
import Loader from "../../components/common/Loader.jsx";

const AdminUserDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getUserDetailApi(id);
        setData(data.data);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Loader />;
  if (!data?.user) return <p className="text-muted">User not found.</p>;

  return (
    <div>
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <button
          onClick={() => navigate("/admin/users")}
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-charcoal mb-3 transition-colors"
        >
          <IoArrowBackOutline size={15} /> Back to Users
        </button>
        <p className="eyebrow mb-2">Community</p>
        <h1 className="font-display text-3xl lg:text-4xl text-charcoal">
          User Detail
        </h1>
      </motion.header>

      <UserDetailView
        user={data.user}
        subscription={data.subscription}
        purchases={data.purchases}
        bookmarksCount={data.bookmarksCount}
      />
    </div>
  );
};

export default AdminUserDetailPage;
