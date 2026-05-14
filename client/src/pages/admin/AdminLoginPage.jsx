// Admin login — credentials checked against .env via /api/auth/admin-login
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  IoMailOutline,
  IoLockClosedOutline,
  IoShieldCheckmarkOutline,
  IoEyeOutline,
  IoEyeOffOutline,
} from "react-icons/io5";
import { toast } from "react-toastify";
import { adminLogin, clearAuthError } from "../../app/features/authSlice.js";
import logo from "../../assets/logo.png";

const AdminLoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, error } = useSelector((s) => s.auth);

  // Redirect away if already logged in as admin
  useEffect(() => {
    if (isAuthenticated && isAdmin)
      navigate("/admin/dashboard", { replace: true });
  }, [isAuthenticated, isAdmin, navigate]);

  useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password)
      return toast.error("Enter your credentials.");

    try {
      setLoading(true);
      const action = await dispatch(adminLogin(form));
      if (adminLogin.fulfilled.match(action)) {
        toast.success("Welcome back, admin.");
        navigate("/admin/dashboard", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 bg-pattern opacity-5" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-crimson/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md bg-ivory p-8 lg:p-10 rounded-md shadow-2xl"
      >
        {/* Logo + heading */}
        <div className="text-center mb-8">
          <img src={logo} alt="Magzineer" className="h-12 mx-auto mb-4" />
          <div className="inline-flex items-center gap-2 bg-charcoal text-ivory px-3 py-1 text-[10px] uppercase tracking-[0.2em] mb-4">
            <IoShieldCheckmarkOutline size={12} /> Admin Access
          </div>
          <h1 className="font-display text-3xl text-charcoal">Admin Portal</h1>
          <p className="text-sm text-muted mt-2">
            Restricted access. Credentials required.
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-3 bg-crimson/10 border border-crimson/30 text-crimson text-sm rounded"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Admin Email" icon={<IoMailOutline />}>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="admin@magzineer.com"
              className="input-mz pl-10"
              required
            />
          </Field>

          <Field label="Password" icon={<IoLockClosedOutline />}>
            <input
              type={showPwd ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="input-mz pl-10 pr-11"
              required
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal"
            >
              {showPwd ? (
                <IoEyeOffOutline size={18} />
              ) : (
                <IoEyeOutline size={18} />
              )}
            </button>
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-3 disabled:opacity-60"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-muted mt-8">
          Authorised personnel only · All access is logged
        </p>

        {/* ─── Link back to reader login ─── */}
        <div className="text-center mt-4">
          <Link
            to="/login"
            className="text-crimson! text-sm hover:underline! transition"
          >
            ← Back to reader sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

const Field = ({ label, icon, children }) => (
  <div>
    <label className="block text-xs uppercase tracking-widest text-muted font-medium mb-2">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
        {icon}
      </span>
      {children}
    </div>
  </div>
);

export default AdminLoginPage;
