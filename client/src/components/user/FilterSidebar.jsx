// Search filter sidebar — magazine, issue, category, date range
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoFunnelOutline,
  IoCloseOutline,
  IoRefreshOutline,
} from "react-icons/io5";
import { setFilters, resetFilters } from "../../app/features/searchSlice.js";
import { getAllMagazinesApi } from "../../api/magazine.api.js";
import { getAllCategoriesApi } from "../../api/category.api.js";
import { getIssuesByMagazineApi } from "../../api/issue.api.js";

const FilterSidebar = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((s) => s.search);
  const [magazines, setMagazines] = useState([]);
  const [issues, setIssues] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Load magazines + categories once
  useEffect(() => {
    (async () => {
      try {
        const [mRes, cRes] = await Promise.all([
          getAllMagazinesApi(),
          getAllCategoriesApi(),
        ]);
        setMagazines(mRes.data.data.magazines || []);
        setCategories(cRes.data.data.categories || []);
      } catch {
        /* ignore */
      }
    })();
  }, []);

  // When magazine filter changes, load that magazine's issues for the issue dropdown
  useEffect(() => {
    if (!filters.magazine) {
      setIssues([]);
      return;
    }
    (async () => {
      try {
        const { data } = await getIssuesByMagazineApi(filters.magazine);
        setIssues(data.data.issues || []);
      } catch {
        setIssues([]);
      }
    })();
  }, [filters.magazine]);

  const update = (key, value) => {
    // Clear issue if magazine changes
    if (key === "magazine") {
      dispatch(setFilters({ magazine: value, issue: "" }));
    } else {
      dispatch(setFilters({ [key]: value }));
    }
  };

  const handleReset = () => dispatch(resetFilters());

  // ─── Filter form (reused for desktop + mobile drawer) ───
  const FormBody = () => (
    <div className="flex flex-col gap-5">
      <FilterGroup label="Magazine">
        <select
          value={filters.magazine}
          onChange={(e) => update("magazine", e.target.value)}
          className="input-mz"
        >
          <option value="">All magazines</option>
          {magazines.map((m) => (
            <option key={m._id} value={m._id}>
              {m.title}
            </option>
          ))}
        </select>
      </FilterGroup>

      <FilterGroup label="Issue">
        <select
          value={filters.issue}
          onChange={(e) => update("issue", e.target.value)}
          disabled={!filters.magazine}
          className="input-mz disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">All issues</option>
          {issues.map((i) => (
            <option key={i._id} value={i._id}>
              {i.issueNumber} {i.title && `— ${i.title}`}
            </option>
          ))}
        </select>
      </FilterGroup>

      <FilterGroup label="Category">
        <select
          value={filters.category}
          onChange={(e) => update("category", e.target.value)}
          className="input-mz"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </FilterGroup>

      <FilterGroup label="From">
        <input
          type="date"
          value={filters.from}
          onChange={(e) => update("from", e.target.value)}
          className="input-mz"
        />
      </FilterGroup>

      <FilterGroup label="To">
        <input
          type="date"
          value={filters.to}
          onChange={(e) => update("to", e.target.value)}
          className="input-mz"
        />
      </FilterGroup>

      <button
        onClick={handleReset}
        className="flex items-center justify-center gap-2 text-sm text-crimson border border-crimson py-2.5 hover:bg-crimson hover:text-ivory transition-colors"
      >
        <IoRefreshOutline size={16} />
        Reset Filters
      </button>
    </div>
  );

  return (
    <>
      {/* ─── Desktop ─── */}
      <aside className="hidden lg:block sticky top-24 self-start">
        <div className="bg-paper border border-line p-6">
          <h3 className="font-display text-lg text-charcoal mb-5 flex items-center gap-2">
            <IoFunnelOutline /> Filters
          </h3>
          <FormBody />
        </div>
      </aside>

      {/* ─── Mobile trigger button ─── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden! inline-flex items-center gap-2 btn-outline py-2! px-4! text-xs! mb-4"
      >
        <IoFunnelOutline size={15} /> Filters
      </button>

      {/* ─── Mobile drawer ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-charcoal/50 z-50"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="lg:hidden fixed top-0 right-0 bottom-0 w-80 max-w-[85%] bg-ivory z-50 overflow-y-auto"
            >
              <div className="p-5 border-b border-line flex items-center justify-between">
                <h3 className="font-display text-lg text-charcoal flex items-center gap-2">
                  <IoFunnelOutline /> Filters
                </h3>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close filters"
                >
                  <IoCloseOutline size={24} />
                </button>
              </div>
              <div className="p-5">
                <FormBody />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const FilterGroup = ({ label, children }) => (
  <div>
    <label className="block text-xs uppercase tracking-widest text-muted font-medium mb-2">
      {label}
    </label>
    {children}
  </div>
);

export default FilterSidebar;
