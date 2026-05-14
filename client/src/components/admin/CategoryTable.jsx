// Category list — edit, delete
import { useState } from "react";
import { IoCreateOutline, IoTrashOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { deleteCategoryApi } from "../../api/category.api.js";
import ConfirmDialog from "../common/ConfirmDialog.jsx";

const CategoryTable = ({ categories = [], onEdit, onRefresh }) => {
  const [confirm, setConfirm] = useState({ open: false, id: null });

  const handleDelete = async () => {
    try {
      await deleteCategoryApi(confirm.id);
      toast.success("Category deleted.");
      onRefresh?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed.");
    }
  };

  return (
    <>
      <div className="card-mz overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream/50">
              <tr className="text-left text-xs uppercase tracking-widest text-muted">
                <th className="px-5 py-3 font-medium">Image</th>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Description</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-muted">
                    No categories yet.
                  </td>
                </tr>
              )}
              {categories.map((c) => (
                <tr
                  key={c._id}
                  className="border-t border-line hover:bg-cream/40"
                >
                  <td className="px-5 py-3">
                    {c.image?.url ? (
                      <img
                        src={c.image.url}
                        alt={c.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-cream rounded flex items-center justify-center text-muted text-xs">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3 font-medium text-charcoal">
                    {c.name}
                  </td>
                  <td className="px-5 py-3 text-xs text-muted max-w-lg">
                    {c.description || "—"}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit?.(c)}
                        className="w-8 h-8 flex items-center justify-center rounded border border-line bg-paper hover:bg-charcoal hover:text-ivory transition-colors"
                      >
                        <IoCreateOutline size={16} />
                      </button>
                      <button
                        onClick={() => setConfirm({ open: true, id: c._id })}
                        className="w-8 h-8 flex items-center justify-center rounded border border-line bg-paper text-crimson hover:bg-crimson hover:text-ivory hover:border-crimson transition-colors"
                      >
                        <IoTrashOutline size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirm.open}
        onClose={() => setConfirm({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Category?"
        message="Categories with assigned articles cannot be deleted."
        confirmText="Delete"
        variant="danger"
      />
    </>
  );
};

export default CategoryTable;
