// Editorial breadcrumb — accepts an array of { label, to? } items
import { Link } from "react-router-dom";
import { IoChevronForward } from "react-icons/io5";

const Breadcrumb = ({ items = [] }) => {
  if (!items.length) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-2 text-xs text-muted font-sans"
    >
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <span key={idx} className="flex items-center gap-2">
            {item.to && !isLast ? (
              <Link
                to={item.to}
                className="hover:text-crimson transition-colors uppercase tracking-wider"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={`uppercase tracking-wider ${
                  isLast ? "text-charcoal font-medium" : ""
                }`}
              >
                {item.label}
              </span>
            )}
            {!isLast && <IoChevronForward size={11} />}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
