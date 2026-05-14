// Admin articles list page — filterable + paginated table
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IoAddOutline } from "react-icons/io5";
import { adminGetAllArticlesApi } from "../../api/article.api.js";
import { adminGetAllMagazinesApi } from "../../api/magazine.api.js";
import ArticleTable from "../../components/admin/ArticleTable.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import Loader from "../../components/common/Loader.jsx";
import useDebounce from "../../hooks/useDebounce.js";

const AdminArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [magazines, setMagazines] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    magazine: "",
    status: "",
    author: "",
    page: 1,
    limit: 10,
  });
  // Debounce the typed filters so we don't spam the API on every keystroke
  const debouncedFilters = useDebounce(filters, 400);

  // Load magazines once for the filter dropdown
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
    (async () => {
      try {
        setLoading(true);
        const { data } = await adminGetAllArticlesApi(debouncedFilters);
        setArticles(data.data.articles || []);
        setPagination(data.data.pagination || { page: 1, totalPages: 0 });
      } finally {
        setLoading(false);
      }
    })();
  }, [debouncedFilters]);

  const refresh = () => setFilters({ ...filters }); // trigger a re-fetch

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
            Articles
          </h1>
        </div>
        <Link
          to="/admin/articles/new"
          className="btn-primary inline-flex items-center gap-2"
        >
          <IoAddOutline size={18} /> New Article
        </Link>
      </motion.header>

      {loading && articles.length === 0 ? (
        <Loader fullScreen={false} />
      ) : (
        <>
          <ArticleTable
            articles={articles}
            filters={filters}
            magazines={magazines}
            onFilterChange={setFilters}
            onRefresh={refresh}
          />
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(p) => setFilters({ ...filters, page: p })}
          />
        </>
      )}
    </div>
  );
};

export default AdminArticlesPage;
