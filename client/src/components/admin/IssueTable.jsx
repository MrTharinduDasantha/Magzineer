// Admin issue list — filter by magazine + status, bulk publish, edit, delete
import { useState } from "react";
import { motion } from "framer-motion";
import {
  IoCreateOutline,
  IoTrashOutline,
  IoCheckmarkCircle,
  IoEllipsisHorizontal,
} from "react-icons/io5";
import { toast } from "react-toastify";
import {
  deleteIssueApi,
  bulkUpdateIssueStatusApi,
} from "../../api/issue.api.js";
import ConfirmDialog from "../common/ConfirmDialog.jsx";
import { formatDate } from "../../utils/formatDate.js";
import { formatCurrency } from "../../utils/formatCurrency.js";

const IssueTable = ({ issues = [], onEdit, onRefresh }) => {
  const [selected, setSelected] = useState([]);
  const [confirm, setConfirm] = useState({ open: false, id: null });

  const toggleOne = (id) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );

  const toggleAll = () => {
    if (selected.length === issues.length) setSelected([]);
    else setSelected(issues.map((i) => i._id));
  };

  const handleBulk = async (status) => {
    if (!selected.length) return toast.info("Select at least one issue.");
    try {
      await bulkUpdateIssueStatusApi({ issueIds: selected, status });
      toast.success(
        `Issues ${status === "published" ? "published" : "unpublished"}.`,
      );
      setSelected([]);
      onRefresh?.();
    } catch {
      toast.error("Bulk update failed.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteIssueApi(confirm.id);
      toast.success("Issue deleted.");
      onRefresh?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed.");
    }
  };

  return (
    <>
      {/* Bulk action toolbar */}
      {selected.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 bg-charcoal text-ivory rounded"
        >
          <span className="text-sm">{selected.length} selected</span>
          <div className="flex gap-2">
            <button
              onClick={() => handleBulk("published")}
              className="text-xs px-3 py-1.5 bg-ivory text-charcoal hover:bg-gold transition-colors"
            >
              Publish
            </button>
            <button
              onClick={() => handleBulk("unpublished")}
              className="text-xs px-3 py-1.5 bg-ivory/20 text-ivory hover:bg-ivory hover:text-charcoal transition-colors"
            >
              Unpublish
            </button>
          </div>
        </motion.div>
      )}

      <div className="card-mz overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream/50">
              <tr className="text-left text-xs uppercase tracking-widest text-muted">
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={
                      selected.length === issues.length && issues.length > 0
                    }
                    onChange={toggleAll}
                  />
                </th>
                <th className="px-5 py-3 font-medium">Cover</th>
                <th className="px-5 py-3 font-medium">Magazine / Issue</th>
                <th className="px-5 py-3 font-medium">Publication</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {issues.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-muted">
                    No issues found.
                  </td>
                </tr>
              )}
              {issues.map((i) => (
                <tr
                  key={i._id}
                  className="border-t border-line hover:bg-cream/40"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(i._id)}
                      onChange={() => toggleOne(i._id)}
                    />
                  </td>
                  <td className="px-5 py-3">
                    <img
                      src={i.cover?.url}
                      alt={i.issueNumber}
                      className="w-10 h-14 object-cover border border-line"
                    />
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-charcoal">
                      {i.magazine?.title}
                    </p>
                    <p className="text-xs text-muted">
                      {i.issueNumber}
                      {i.title && ` — ${i.title}`}
                    </p>
                  </td>
                  <td className="px-5 py-3 text-xs text-muted">
                    {formatDate(i.publicationDate)}
                  </td>
                  <td className="px-5 py-3 font-medium text-charcoal">
                    {i.price > 0 ? formatCurrency(i.price) : "Free"}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${
                        i.status === "published"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-charcoal/10 text-charcoal"
                      }`}
                    >
                      {i.status === "published" ? (
                        <span className="inline-flex items-center gap-1">
                          <IoCheckmarkCircle size={11} /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          <IoEllipsisHorizontal size={11} /> Draft
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit?.(i)}
                        className="w-8 h-8 flex items-center justify-center rounded border border-line bg-paper text-charcoal hover:bg-charcoal hover:text-ivory transition-colors"
                        title="Edit"
                      >
                        <IoCreateOutline size={16} />
                      </button>
                      <button
                        onClick={() => setConfirm({ open: true, id: i._id })}
                        className="w-8 h-8 flex items-center justify-center rounded border border-line bg-paper text-crimson hover:bg-crimson hover:text-ivory hover:border-crimson transition-colors"
                        title="Delete"
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
        title="Delete Issue?"
        message="Articles inside this issue will be unassigned but not deleted."
        confirmText="Delete"
        variant="danger"
      />
    </>
  );
};

export default IssueTable;
