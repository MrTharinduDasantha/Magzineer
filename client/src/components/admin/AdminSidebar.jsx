// Standalone admin sidebar component — note: the actual rendered sidebar in
// AdminLayout.jsx is already wired up internally. This file exports a reusable sidebar in case it's needed elsewhere (e.g. a settings page-level layout).
import { NavLink, Link } from "react-router-dom";
import {
  IoGridOutline,
  IoNewspaperOutline,
  IoBookOutline,
  IoDocumentTextOutline,
  IoPricetagOutline,
  IoCardOutline,
  IoPeopleOutline,
  IoReceiptOutline,
  IoBagCheckOutline,
  IoAnalyticsOutline,
  IoSettingsOutline,
  IoMailUnreadOutline,
} from "react-icons/io5";
import logo from "../../assets/logo.png";

const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard", icon: <IoGridOutline /> },
  { to: "/admin/magazines", label: "Magazines", icon: <IoNewspaperOutline /> },
  { to: "/admin/issues", label: "Issues", icon: <IoBookOutline /> },
  { to: "/admin/articles", label: "Articles", icon: <IoDocumentTextOutline /> },
  { to: "/admin/categories", label: "Categories", icon: <IoPricetagOutline /> },
  { to: "/admin/plans", label: "Subscription Plans", icon: <IoCardOutline /> },
  { to: "/admin/users", label: "Users", icon: <IoPeopleOutline /> },
  {
    to: "/admin/subscriptions",
    label: "Subscriptions",
    icon: <IoReceiptOutline />,
  },
  { to: "/admin/purchases", label: "Purchases", icon: <IoBagCheckOutline /> },
  { to: "/admin/payments", label: "Payments", icon: <IoReceiptOutline /> },
  { to: "/admin/analytics", label: "Analytics", icon: <IoAnalyticsOutline /> },
  { to: "/admin/messages", label: "Messages", icon: <IoMailUnreadOutline /> },
  { to: "/admin/settings", label: "Settings", icon: <IoSettingsOutline /> },
];

const AdminSidebar = ({ onNavigate }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-line">
        <Link
          to="/admin/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-2"
        >
          <img src={logo} alt="Magzineer" className="h-8 w-auto" />
          <span className="font-display text-lg text-charcoal">Magzineer</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        {adminLinks.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 my-0.5 rounded text-sm font-medium transition-colors ${
                isActive
                  ? "bg-charcoal text-ivory"
                  : "text-charcoal-soft hover:bg-cream"
              }`
            }
          >
            <span className="text-lg">{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
