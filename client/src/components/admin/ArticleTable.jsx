// Admin article list — filter by magazine/issue/status/author, edit, delete
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  IoCreateOutline,
  IoTrashOutline,
  IoLockClosed,
  IoSearchOutline,
} from "react-icons/io5";
import { toast } from "react-toastify";
import { deleteArticleApi } from "../../api/article.api.js";
import ConfirmDialog from "../common/ConfirmDialog.jsx";
import { formatDate } from "../../utils/formatDate.js";

const statusPalette = {
  draft: "bg-charcoal/10 text-charcoal",
  published: "bg-emerald-100 text-emerald-700",
  scheduled: "bg-gold/15 text-gold",
};

const ArticleTable = ({
  articles = [],
  filters,
  onFilterChange,
  magazines = [],
  onRefresh,
}) => {
  const [confirm, setConfirm] = useState({ open: false, id: null });

  const handleDelete = async () => {
    try {
      await deleteArticleApi(confirm.id);
      toast.success("Article deleted.");
      onRefresh?.();
    } catch {
      toast.error("Delete failed.");
    }
  };

  const setFilter = (key, value) =>
    onFilterChange?.({ ...filters, [key]: value, page: 1 });

  return (
    <>
      {/* Filter bar */}
      <div className="card-mz p-4 mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-50">
          <IoSearchOutline
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            value={filters?.search || ""}
            onChange={(e) => setFilter("search", e.target.value)}
            placeholder="Search by title..."
            className="w-full pl-9 pr-3 py-2 bg-cream border border-line rounded text-sm focus:outline-none focus:border-charcoal"
          />
        </div>

        <select
          value={filters?.magazine || ""}
          onChange={(e) => setFilter("magazine", e.target.value)}
          className="px-3 py-2 bg-cream border border-line rounded text-sm"
        >
          <option value="">All magazines</option>
          {magazines.map((m) => (
            <option key={m._id} value={m._id}>
              {m.title}
            </option>
          ))}
        </select>

        <select
          value={filters?.status || ""}
          onChange={(e) => setFilter("status", e.target.value)}
          className="px-3 py-2 bg-cream border border-line rounded text-sm"
        >
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="scheduled">Scheduled</option>
        </select>

        <input
          type="text"
          value={filters?.author || ""}
          onChange={(e) => setFilter("author", e.target.value)}
          placeholder="Author"
          className="px-3 py-2 bg-cream border border-line rounded text-sm w-40"
        />
      </div>

      <div className="card-mz overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream/50">
              <tr className="text-left text-xs uppercase tracking-widest text-muted">
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Magazine</th>
                <th className="px-5 py-3 font-medium">Author</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Access</th>
                <th className="px-5 py-3 font-medium">Views</th>
                <th className="px-5 py-3 font-medium">Created</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-muted">
                    No articles found.
                  </td>
                </tr>
              )}
              {articles.map((a) => (
                <tr
                  key={a._id}
                  className="border-t border-line hover:bg-cream/40"
                >
                  <td className="px-5 py-3">
                    <p className="font-medium text-charcoal line-clamp-1 max-w-xs">
                      {a.title}
                    </p>
                    <p className="text-xs text-muted line-clamp-1 max-w-xs">
                      {a.excerpt}
                    </p>
                  </td>
                  <td className="px-5 py-3 text-charcoal text-xs">
                    {a.magazine?.title}
                  </td>
                  <td className="px-5 py-3 text-charcoal-soft text-xs">
                    {a.author}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${statusPalette[a.status]}`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {a.accessLevel === "premium" ? (
                      <span className="inline-flex items-center gap-1 text-xs text-crimson">
                        <IoLockClosed size={12} /> Premium
                      </span>
                    ) : (
                      <span className="text-xs text-muted">Free</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-xs text-charcoal">
                    {a.views || 0}
                  </td>
                  <td className="px-5 py-3 text-xs text-muted">
                    {formatDate(a.createdAt)}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/articles/edit/${a._id}`}
                        className="w-8 h-8 flex items-center justify-center rounded border border-line bg-paper text-charcoal hover:bg-charcoal hover:text-ivory! transition-colors"
                        title="Edit"
                      >
                        <IoCreateOutline size={16} />
                      </Link>
                      <button
                        onClick={() => setConfirm({ open: true, id: a._id })}
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
        title="Delete Article?"
        message="This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </>
  );
};

export default ArticleTable;
