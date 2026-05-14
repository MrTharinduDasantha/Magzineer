// Admin magazine list — search, sort, publish toggle, edit, delete
import { useState } from "react";
import { motion } from "framer-motion";
import {
  IoSearchOutline,
  IoCreateOutline,
  IoTrashOutline,
  IoEyeOutline,
  IoEyeOffOutline,
} from "react-icons/io5";
import { toast } from "react-toastify";
import {
  toggleMagazineStatusApi,
  deleteMagazineApi,
} from "../../api/magazine.api.js";
import ConfirmDialog from "../common/ConfirmDialog.jsx";
import { formatDate } from "../../utils/formatDate.js";

const MagazineTable = ({ magazines = [], onEdit, onRefresh }) => {
  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState({ open: false, id: null });

  const filtered = magazines.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase()),
  );

  const handleToggle = async (id) => {
    try {
      await toggleMagazineStatusApi(id);
      toast.success("Status updated.");
      onRefresh?.();
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMagazineApi(confirm.id);
      toast.success("Magazine deleted.");
      onRefresh?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed.");
    }
  };

  return (
    <>
      <div className="card-mz overflow-hidden">
        {/* Search bar */}
        <div className="p-4 border-b border-line">
          <div className="relative max-w-sm">
            <IoSearchOutline
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search magazines..."
              className="w-full pl-9 pr-3 py-2 bg-cream border border-line rounded text-sm focus:outline-none focus:border-charcoal"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream/50">
              <tr className="text-left text-xs uppercase tracking-widest text-muted">
                <th className="px-5 py-3 font-medium">Cover</th>
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Featured</th>
                <th className="px-5 py-3 font-medium">Created</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-muted">
                    No magazines found.
                  </td>
                </tr>
              )}
              {filtered.map((m) => (
                <motion.tr
                  key={m._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-t border-line hover:bg-cream/40 transition-colors"
                >
                  <td className="px-5 py-3">
                    <img
                      src={m.cover?.url}
                      alt={m.title}
                      className="w-12 h-16 object-cover border border-line"
                    />
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-charcoal">{m.title}</p>
                    <p className="text-xs text-muted line-clamp-1 max-w-xs">
                      {m.description}
                    </p>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${
                        m.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-charcoal/10 text-charcoal"
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {m.isFeatured ? (
                      <span className="text-crimson text-xs">★ Featured</span>
                    ) : (
                      <span className="text-muted text-xs">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-xs text-muted">
                    {formatDate(m.createdAt)}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <IconBtn
                        title={
                          m.status === "active" ? "Deactivate" : "Activate"
                        }
                        onClick={() => handleToggle(m._id)}
                      >
                        {m.status === "active" ? (
                          <IoEyeOffOutline size={16} />
                        ) : (
                          <IoEyeOutline size={16} />
                        )}
                      </IconBtn>
                      <IconBtn title="Edit" onClick={() => onEdit?.(m)}>
                        <IoCreateOutline size={16} />
                      </IconBtn>
                      <IconBtn
                        title="Delete"
                        danger
                        onClick={() => setConfirm({ open: true, id: m._id })}
                      >
                        <IoTrashOutline size={16} />
                      </IconBtn>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirm.open}
        onClose={() => setConfirm({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Magazine?"
        message="This will permanently remove the magazine. If it has issues or articles, you'll need to delete those first."
        confirmText="Delete"
        variant="danger"
      />
    </>
  );
};

const IconBtn = ({ children, danger, ...rest }) => (
  <button
    {...rest}
    className={`w-8 h-8 flex items-center justify-center rounded border border-line bg-paper transition-colors ${
      danger
        ? "text-crimson hover:bg-crimson hover:text-ivory hover:border-crimson"
        : "text-charcoal hover:bg-charcoal hover:text-ivory hover:border-charcoal"
    }`}
  >
    {children}
  </button>
);

export default MagazineTable;
