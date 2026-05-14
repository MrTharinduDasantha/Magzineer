// User management page — search, paginate, block/unblock
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAllUsersApi } from "../../api/admin.api.js";
import UserTable from "../../components/admin/UserTable.jsx";
import Loader from "../../components/common/Loader.jsx";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState({ search: "", page: 1, limit: 20 });

  const fetchUsers = async (p = params) => {
    try {
      setLoading(true);
      const { data } = await getAllUsersApi(p);
      setUsers(data.data.users || []);
      setPagination(data.data.pagination || { page: 1, totalPages: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <div>
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="eyebrow mb-2">Community</p>
        <h1 className="font-display text-3xl lg:text-4xl text-charcoal">
          Users
        </h1>
        <p className="text-sm text-muted mt-1">
          {pagination.total
            ? `${pagination.total} total readers registered.`
            : "Manage your readership."}
        </p>
      </motion.header>

      {loading && users.length === 0 ? (
        <Loader fullScreen={false} />
      ) : (
        <UserTable
          users={users}
          pagination={pagination}
          onSearch={(search) => setParams({ ...params, search, page: 1 })}
          onPageChange={(page) => setParams({ ...params, page })}
          onRefresh={() => fetchUsers(params)}
        />
      )}
    </div>
  );
};

export default AdminUsersPage;
