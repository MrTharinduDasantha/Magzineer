// Global search results page — sidebar filters + paginated results
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { IoSearchOutline } from "react-icons/io5";
import {
  performSearch,
  setQuery,
  setPage,
} from "../../app/features/searchSlice.js";
import FilterSidebar from "../../components/user/FilterSidebar.jsx";
import SearchResultsList from "../../components/user/SearchResultsList.jsx";
import Breadcrumb from "../../components/common/Breadcrumb.jsx";
import useDebounce from "../../hooks/useDebounce.js";
import { useState } from "react";

const SearchResultsPage = () => {
  const dispatch = useDispatch();
  const [params, setParams] = useSearchParams();
  const { query, filters, pagination } = useSelector((s) => s.search);
  const [localQuery, setLocalQuery] = useState(params.get("q") || query || "");
  const debouncedQuery = useDebounce(localQuery, 400);

  // Sync URL query string with local state
  useEffect(() => {
    const urlQ = params.get("q") || "";
    if (urlQ !== localQuery) setLocalQuery(urlQ);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  // Persist the latest query to Redux as the user types
  useEffect(() => {
    dispatch(setQuery(debouncedQuery));
  }, [debouncedQuery, dispatch]);

  // Whenever query, filters, or page changes — re-run the search
  useEffect(() => {
    if (!debouncedQuery) return;
    dispatch(
      performSearch({
        q: debouncedQuery,
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      }),
    );
  }, [dispatch, debouncedQuery, filters, pagination.page, pagination.limit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (localQuery.trim()) {
      setParams({ q: localQuery.trim() });
      dispatch(setPage(1));
    }
  };

  return (
    <div className="container-mz py-10 lg:py-14">
      <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Search" }]} />

      <div className="mt-6 mb-8">
        <p className="eyebrow mb-3">Discover</p>
        <h1 className="heading-rule font-display text-3xl sm:text-4xl text-charcoal mb-6">
          Search Magzineer
        </h1>

        <form onSubmit={handleSubmit} className="relative max-w-2xl">
          <IoSearchOutline
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search magazines, articles, authors..."
            className="w-full pl-12 pr-5 py-4 bg-paper border border-line rounded-md text-base focus:outline-none focus:border-charcoal"
          />
        </form>

        {query && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-muted mt-3"
          >
            Showing results for{" "}
            <span className="text-charcoal font-medium">"{query}"</span>
          </motion.p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-8 lg:items-start">
        <div className="min-w-0">
          <FilterSidebar />
        </div>

        <div className="min-w-0">
          <SearchResultsList onPageChange={(p) => dispatch(setPage(p))} />
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
