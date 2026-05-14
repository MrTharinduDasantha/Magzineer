// Small editorial category badge — used on article cards, headers, etc.
import { Link } from "react-router-dom";

const CategoryBadge = ({ category, linked = true, size = "sm" }) => {
  if (!category) return null;
  const name = typeof category === "string" ? category : category.name;
  const id = typeof category === "object" ? category._id : null;

  const sizes = {
    sm: "text-[10px] px-2 py-0.5",
    md: "text-xs px-3 py-1",
  };

  const className = `inline-block uppercase tracking-[0.18em] font-medium text-crimson bg-crimson/8 border border-crimson/20 ${sizes[size]} transition-colors hover:bg-crimson hover:text-ivory`;

  if (linked && id) {
    return (
      <Link to={`/search?category=${id}`} className={className}>
        {name}
      </Link>
    );
  }
  return <span className={className}>{name}</span>;
};

export default CategoryBadge;
