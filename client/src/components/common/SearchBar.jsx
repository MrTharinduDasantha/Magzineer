// Global search input — used in the Navbar. Submits to /search?q=...
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";

const SearchBar = ({ onSubmit, compact = false }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setQuery("");
    onSubmit?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative ${compact ? "w-full" : "w-full max-w-md"}`}
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search magazines, articles..."
        className="w-full pl-11 pr-4 py-2.5 bg-cream border border-line rounded-full text-sm text-charcoal placeholder-muted focus:outline-none focus:border-charcoal focus:bg-paper transition-all"
        aria-label="Search"
      />
      <button
        type="submit"
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal transition-colors"
        aria-label="Submit search"
      >
        <IoSearchOutline size={18} />
      </button>
    </form>
  );
};

export default SearchBar;
