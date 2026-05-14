// Drag-and-drop board — drag unassigned articles into an issue
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { adminGetAllArticlesApi } from "../../api/article.api.js";
import {
  assignArticlesToIssueApi,
  unassignArticleFromIssueApi,
} from "../../api/issue.api.js";

const ArticleAssignmentBoard = ({ issue }) => {
  const [unassigned, setUnassigned] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load articles for the issue's magazine — both assigned to this issue and unassigned
  const refresh = async () => {
    if (!issue) return;
    try {
      setLoading(true);
      const magId = issue.magazine?._id || issue.magazine;

      const [allRes, assignedRes] = await Promise.all([
        adminGetAllArticlesApi({ magazine: magId, limit: 200 }),
        adminGetAllArticlesApi({ issue: issue._id, limit: 200 }),
      ]);

      const all = allRes.data.data.articles || [];
      const inIssue = assignedRes.data.data.articles || [];
      const inIssueIds = new Set(inIssue.map((a) => a._id));
      setAssigned(inIssue);
      // Unassigned = same magazine, not in this issue, and not assigned elsewhere
      setUnassigned(all.filter((a) => !inIssueIds.has(a._id) && !a.issue));
    } catch {
      toast.error("Failed to load articles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issue?._id]);

  // ─── react-beautiful-dnd handler ───
  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;

    try {
      if (destination.droppableId === "assigned") {
        // Move from unassigned → assigned
        const moved = unassigned.find((a) => a._id === draggableId);
        setUnassigned((prev) => prev.filter((a) => a._id !== draggableId));
        setAssigned((prev) => [...prev, moved]);
        await assignArticlesToIssueApi(issue._id, [draggableId]);
        toast.success("Article assigned.");
      } else {
        // Move from assigned → unassigned
        const moved = assigned.find((a) => a._id === draggableId);
        setAssigned((prev) => prev.filter((a) => a._id !== draggableId));
        setUnassigned((prev) => [...prev, moved]);
        await unassignArticleFromIssueApi(issue._id, draggableId);
        toast.success("Article unassigned.");
      }
    } catch {
      toast.error("Update failed.");
      refresh(); // rollback by re-fetching
    }
  };

  if (loading) return <p className="text-muted">Loading articles...</p>;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Column
          droppableId="unassigned"
          title="Unassigned Articles"
          items={unassigned}
          accent="charcoal"
        />
        <Column
          droppableId="assigned"
          title={`In This Issue (${assigned.length})`}
          items={assigned}
          accent="crimson"
        />
      </div>
    </DragDropContext>
  );
};

const Column = ({ droppableId, title, items, accent }) => (
  <div className="card-mz overflow-hidden">
    <div
      className={`px-5 py-3 border-b border-line ${
        accent === "crimson" ? "bg-crimson/5" : "bg-cream/40"
      }`}
    >
      <h4 className="font-display text-base text-charcoal">{title}</h4>
    </div>
    <Droppable droppableId={droppableId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`min-h-105 p-3 transition-colors ${
            snapshot.isDraggingOver ? "bg-cream" : ""
          }`}
        >
          {items.length === 0 && (
            <p className="text-xs text-muted text-center py-10">
              Drop articles here.
            </p>
          )}
          {items.map((a, idx) => (
            <Draggable key={a._id} draggableId={a._id} index={idx}>
              {(p, snap) => (
                <motion.div
                  ref={p.innerRef}
                  {...p.draggableProps}
                  {...p.dragHandleProps}
                  className={`p-3 mb-2 border border-line bg-paper rounded transition-shadow ${
                    snap.isDragging ? "shadow-lg" : "shadow-sm"
                  }`}
                >
                  <p className="font-medium text-sm text-charcoal line-clamp-1">
                    {a.title}
                  </p>
                  <p className="text-xs text-muted line-clamp-1 mt-0.5">
                    By {a.author} · {a.status}
                  </p>
                </motion.div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </div>
);

export default ArticleAssignmentBoard;
