// Admin magazines page — list, create, edit, delete
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoAddOutline } from "react-icons/io5";
import { adminGetAllMagazinesApi } from "../../api/magazine.api.js";
import MagazineTable from "../../components/admin/MagazineTable.jsx";
import MagazineForm from "../../components/admin/MagazineForm.jsx";
import Modal from "../../components/common/Modal.jsx";
import Loader from "../../components/common/Loader.jsx";

const AdminMagazinesPage = () => {
  const [magazines, setMagazines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const refresh = async () => {
    try {
      setLoading(true);
      const { data } = await adminGetAllMagazinesApi();
      setMagazines(data.data.magazines || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (magazine) => {
    setEditing(magazine);
    setModalOpen(true);
  };
  const handleSuccess = () => {
    setModalOpen(false);
    setEditing(null);
    refresh();
  };

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
            Magazines
          </h1>
        </div>
        <button
          onClick={openCreate}
          className="btn-primary inline-flex items-center gap-2"
        >
          <IoAddOutline size={18} /> New Magazine
        </button>
      </motion.header>

      {loading ? (
        <Loader fullScreen={false} />
      ) : (
        <MagazineTable
          magazines={magazines}
          onEdit={openEdit}
          onRefresh={refresh}
        />
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Magazine" : "Create Magazine"}
        size="lg"
      >
        <MagazineForm
          magazine={editing}
          onSuccess={handleSuccess}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default AdminMagazinesPage;
