// Admin issues page — list with magazine filter, create, edit, delete, + drag-and-drop article assignment when an issue is selected
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoAddOutline, IoCloseOutline } from "react-icons/io5";
import { adminGetAllIssuesApi } from "../../api/issue.api.js";
import { adminGetAllMagazinesApi } from "../../api/magazine.api.js";
import IssueTable from "../../components/admin/IssueTable.jsx";
import IssueForm from "../../components/admin/IssueForm.jsx";
import ArticleAssignmentBoard from "../../components/admin/ArticleAssignmentBoard.jsx";
import Modal from "../../components/common/Modal.jsx";
import Loader from "../../components/common/Loader.jsx";
import Pagination from "../../components/common/Pagination.jsx";

const PAGE_SIZE = 10;

const AdminIssuesPage = () => {
  const [issues, setIssues] = useState([]);
  const [magazines, setMagazines] = useState([]);
  const [filter, setFilter] = useState({ magazine: "", status: "" });
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [assignIssue, setAssignIssue] = useState(null); // issue selected for DnD assignment

  const [page, setPage] = useState(1);

  const refresh = async () => {
    try {
      setLoading(true);
      const { data } = await adminGetAllIssuesApi(filter);
      setIssues(data.data.issues || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await adminGetAllMagazinesApi();
        setMagazines(data.data.magazines || []);
      } catch {
        /* ignore */
      }
    })();
  }, []);

  useEffect(() => {
    setPage(1);
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const totalPages = Math.max(1, Math.ceil(issues.length / PAGE_SIZE));
  const paginatedIssues = issues.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (issue) => {
    setEditing(issue);
    setFormOpen(true);
  };
  const handleSuccess = () => {
    setFormOpen(false);
    setEditing(null);
    refresh();
  };
  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
            Issues
          </h1>
        </div>
        <button
          onClick={openCreate}
          className="btn-primary inline-flex items-center gap-2"
        >
          <IoAddOutline size={18} /> New Issue
        </button>
      </motion.header>

      {/* Filter bar */}
      <div className="card-mz p-4 mb-4 flex flex-wrap gap-3">
        <select
          value={filter.magazine}
          onChange={(e) => setFilter({ ...filter, magazine: e.target.value })}
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
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className="px-3 py-2 bg-cream border border-line rounded text-sm"
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="unpublished">Unpublished</option>
        </select>
      </div>

      {/* Issue list — with an inline "Assign Articles" link on each row via onEdit hijack */}
      {loading ? (
        <Loader fullScreen={false} />
      ) : (
        <>
          <IssueTable
            issues={paginatedIssues}
            onEdit={openEdit}
            onRefresh={refresh}
          />

          {issues.length > PAGE_SIZE && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}

          {/* Quick links to open the drag-and-drop assignment board */}
          <div className="mt-5 flex flex-wrap gap-2">
            <p className="text-xs uppercase tracking-widest text-muted self-center mr-2">
              Quick Assign Articles:
            </p>
            {issues.slice(0, 6).map((i) => (
              <button
                key={i._id}
                onClick={() => setAssignIssue(i)}
                className="text-xs px-3 py-1.5 border border-line bg-paper rounded hover:bg-charcoal hover:text-ivory transition-colors"
              >
                {i.issueNumber}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Create/edit modal */}
      <Modal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "Edit Issue" : "Create Issue"}
        size="lg"
      >
        <IssueForm
          issue={editing}
          onSuccess={handleSuccess}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>

      {/* Drag-and-drop assignment modal */}
      <Modal
        isOpen={!!assignIssue}
        onClose={() => setAssignIssue(null)}
        title={`Assign Articles · ${assignIssue?.issueNumber || ""}`}
        size="xl"
      >
        {assignIssue && <ArticleAssignmentBoard issue={assignIssue} />}
      </Modal>
    </div>
  );
};

export default AdminIssuesPage;
