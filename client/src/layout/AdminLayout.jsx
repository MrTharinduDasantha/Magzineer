// Admin panel layout — fixed sidebar (desktop) + collapsible drawer (mobile/tablet)
import { useState } from "react";
import { Outlet, NavLink, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
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
  IoLogOutOutline,
  IoMenuOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { toast } from "react-toastify";
import { logoutUser } from "../app/features/authSlice.js";
import logo from "../assets/logo.png";

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
  { to: "/admin/settings", label: "Settings", icon: <IoSettingsOutline /> },
];

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success("Logged out successfully.");
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-ivory">
      {/* ─── Desktop sidebar ─── */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-64 bg-paper border-r border-line z-30">
        <SidebarContent
          user={user}
          onNavigate={() => {}}
          onLogout={handleLogout}
        />
      </aside>

      {/* ─── Mobile / tablet drawer ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-charcoal/50 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-72 bg-paper z-50 lg:hidden flex flex-col"
            >
              <SidebarContent
                user={user}
                onNavigate={() => setMobileOpen(false)}
                onLogout={handleLogout}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ─── Main area ─── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        {/* Top bar (mobile menu trigger) */}
        <header className="lg:hidden bg-paper border-b border-line px-4 py-3 flex items-center justify-between sticky top-0 z-20">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <img src={logo} alt="Magzineer" className="h-7 w-auto" />
            <span className="font-display text-lg text-charcoal">Admin</span>
          </Link>
          <button
            onClick={() => setMobileOpen(true)}
            className="text-charcoal p-2"
            aria-label="Open menu"
          >
            <IoMenuOutline size={24} />
          </button>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Reusable sidebar content (used in both desktop fixed sidebar and mobile drawer)
const SidebarContent = ({ user, onNavigate, onLogout }) => (
  <>
    <div className="px-5 py-5 border-b border-line flex items-center justify-between">
      <Link to="/admin/dashboard" onClick={onNavigate}>
        <img src={logo} alt="Magzineer" className="h-9 w-auto" />
      </Link>
      <button
        onClick={onNavigate}
        className="lg:hidden text-charcoal p-1"
        aria-label="Close menu"
      >
        <IoCloseOutline size={22} />
      </button>
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
                ? "bg-charcoal text-ivory!"
                : "text-charcoal-soft hover:bg-cream"
            }`
          }
        >
          <span className="text-lg">{l.icon}</span>
          {l.label}
        </NavLink>
      ))}
    </nav>

    <div className="border-t border-line p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-cream flex items-center justify-center font-display text-charcoal">
          {user?.name?.charAt(0).toUpperCase() || "A"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-charcoal truncate">
            {user?.name || "Admin"}
          </p>
          <p className="text-xs text-muted truncate">{user?.email}</p>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded text-sm text-crimson border border-crimson hover:bg-crimson hover:text-ivory transition-colors"
      >
        <IoLogOutOutline size={16} />
        Logout
      </button>
    </div>
  </>
);

export default AdminLayout;
