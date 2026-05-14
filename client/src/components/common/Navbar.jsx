// Editorial Navbar — responsive, animated, with mobile drawer
import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoMenuOutline,
  IoCloseOutline,
  IoPersonCircleOutline,
  IoLogOutOutline,
  IoBookmarkOutline,
  IoTimeOutline,
  IoCardOutline,
  IoReceiptOutline,
} from "react-icons/io5";
import { toast } from "react-toastify";
import { logoutUser } from "../../app/features/authSlice.js";
import SearchBar from "./SearchBar.jsx";
import logo from "../../assets/logo.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/magazines", label: "Magazines" },
  { to: "/plans", label: "Subscribe" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Shrink + add shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success("Logged out successfully.");
    setProfileOpen(false);
    setMobileOpen(false);
    navigate("/");
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-ivory/95 backdrop-blur-md shadow-sm" : "bg-ivory"
      }`}
    >
      <div className="container-mz">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/">
            <img src={logo} alt="Magzineer" className="h-8 lg:h-10 w-auto" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `relative text-sm uppercase tracking-wider font-medium transition-colors hover:text-crimson ${
                    isActive ? "text-charcoal" : "text-charcoal-soft"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {l.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-crimson"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Desktop right side — search + profile */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="w-64">
              <SearchBar />
            </div>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-2 group"
                >
                  {user?.profilePhoto?.url ? (
                    <img
                      src={user.profilePhoto.url}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover border-2 border-line group-hover:border-crimson transition-colors"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-cream flex items-center justify-center border-2 border-line group-hover:border-crimson transition-colors">
                      <IoPersonCircleOutline
                        size={22}
                        className="text-charcoal-soft"
                      />
                    </div>
                  )}
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setProfileOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-64 bg-paper border border-line rounded-md shadow-lg z-40 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-line bg-cream">
                          <p className="font-medium text-charcoal truncate">
                            {user?.name}
                          </p>
                          <p className="text-xs text-muted truncate">
                            {user?.email}
                          </p>
                        </div>
                        <ProfileMenuItem
                          to="/profile"
                          icon={<IoPersonCircleOutline />}
                          label="Profile"
                          onClick={() => setProfileOpen(false)}
                        />
                        <ProfileMenuItem
                          to="/my-subscriptions"
                          icon={<IoCardOutline />}
                          label="My Subscriptions"
                          onClick={() => setProfileOpen(false)}
                        />
                        <ProfileMenuItem
                          to="/my-purchases"
                          icon={<IoReceiptOutline />}
                          label="My Purchases"
                          onClick={() => setProfileOpen(false)}
                        />
                        <ProfileMenuItem
                          to="/bookmarks"
                          icon={<IoBookmarkOutline />}
                          label="Bookmarks"
                          onClick={() => setProfileOpen(false)}
                        />
                        <ProfileMenuItem
                          to="/reading-history"
                          icon={<IoTimeOutline />}
                          label="Reading History"
                          onClick={() => setProfileOpen(false)}
                        />
                        <ProfileMenuItem
                          to="/payment-history"
                          icon={<IoReceiptOutline />}
                          label="Payment History"
                          onClick={() => setProfileOpen(false)}
                        />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-crimson hover:bg-cream transition-colors border-t border-line"
                        >
                          <IoLogOutOutline size={18} />
                          Logout
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm uppercase tracking-wider text-charcoal-soft hover:text-crimson transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary py-2! px-5! text-xs!"
                >
                  Subscribe
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <button
            className="lg:hidden text-charcoal p-2"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <IoMenuOutline size={26} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-charcoal/50 z-50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85%] bg-ivory z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-5 border-b border-line flex items-center justify-between">
                <Link to="/" onClick={() => setMobileOpen(false)}>
                  <img src={logo} alt="Magzineer" className="h-8 w-auto" />
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                >
                  <IoCloseOutline size={26} className="text-charcoal" />
                </button>
              </div>

              <div className="p-5">
                <SearchBar onSubmit={() => setMobileOpen(false)} compact />
              </div>

              <nav className="flex flex-col px-2 pb-4">
                {navLinks.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.to === "/"}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `px-4 py-3 rounded text-base font-medium transition-colors ${
                        isActive
                          ? "bg-cream text-crimson"
                          : "text-charcoal hover:bg-cream"
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}
              </nav>

              <div className="px-5 py-4 border-t border-line">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      {user?.profilePhoto?.url ? (
                        <img
                          src={user.profilePhoto.url}
                          alt={user.name}
                          className="w-11 h-11 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-cream flex items-center justify-center">
                          <IoPersonCircleOutline
                            size={26}
                            className="text-charcoal-soft"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-charcoal truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-muted truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <ProfileMenuItem
                        to="/profile"
                        icon={<IoPersonCircleOutline />}
                        label="Profile"
                        onClick={() => setMobileOpen(false)}
                      />
                      <ProfileMenuItem
                        to="/my-subscriptions"
                        icon={<IoCardOutline />}
                        label="My Subscriptions"
                        onClick={() => setMobileOpen(false)}
                      />
                      <ProfileMenuItem
                        to="/my-purchases"
                        icon={<IoReceiptOutline />}
                        label="My Purchases"
                        onClick={() => setMobileOpen(false)}
                      />
                      <ProfileMenuItem
                        to="/bookmarks"
                        icon={<IoBookmarkOutline />}
                        label="Bookmarks"
                        onClick={() => setMobileOpen(false)}
                      />
                      <ProfileMenuItem
                        to="/reading-history"
                        icon={<IoTimeOutline />}
                        label="Reading History"
                        onClick={() => setMobileOpen(false)}
                      />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-crimson hover:bg-cream rounded transition-colors text-left"
                      >
                        <IoLogOutOutline size={18} /> Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="btn-outline"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileOpen(false)}
                      className="btn-primary"
                    >
                      Subscribe
                    </Link>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

// Small helper component used in both the dropdown and the mobile drawer
const ProfileMenuItem = ({ to, icon, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-2.5 text-sm text-charcoal hover:bg-cream rounded transition-colors"
  >
    <span className="text-muted">{icon}</span>
    {label}
  </Link>
);

export default Navbar;
