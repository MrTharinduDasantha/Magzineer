// Categories CRUD page
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoAddOutline } from "react-icons/io5";
import { getAllCategoriesApi } from "../../api/category.api.js";
import CategoryTable from "../../components/admin/CategoryTable.jsx";
import CategoryForm from "../../components/admin/CategoryForm.jsx";
import Modal from "../../components/common/Modal.jsx";
import Loader from "../../components/common/Loader.jsx";

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const refresh = async () => {
    try {
      setLoading(true);
      const { data } = await getAllCategoriesApi();
      setCategories(data.data.categories || []);
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
          <p className="eyebrow mb-2">Content</p>
          <h1 className="font-display text-3xl lg:text-4xl text-charcoal">
            Categories
          </h1>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="btn-primary inline-flex items-center gap-2"
        >
          <IoAddOutline size={18} /> New Category
        </button>
      </motion.header>

      {loading ? (
        <Loader fullScreen={false} />
      ) : (
        <CategoryTable
          categories={categories}
          onEdit={(c) => {
            setEditing(c);
            setModalOpen(true);
          }}
          onRefresh={refresh}
        />
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Category" : "Create Category"}
        size="md"
      >
        <CategoryForm
          category={editing}
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

export default AdminCategoriesPage;
