// Reader login page — split layout with editorial poster on the right
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  IoMailOutline,
  IoLockClosedOutline,
  IoEyeOutline,
  IoEyeOffOutline,
} from "react-icons/io5";
import { toast } from "react-toastify";
import { loginUser, clearAuthError } from "../../app/features/authSlice.js";
import authBg from "../../assets/auth-bg.jpg";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, error } = useSelector((s) => s.auth);

  const from = location.state?.from?.pathname || "/";

  // Redirect away if already logged in
  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, from, navigate]);

  // Clear any stale auth error on mount
  useEffect(() => {
    return () => dispatch(clearAuthError());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password)
      return toast.error("Enter your email and password.");

    try {
      setLoading(true);
      const action = await dispatch(loginUser(form));
      if (loginUser.fulfilled.match(action)) {
        toast.success("Welcome back.");
        navigate(from, { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] grid grid-cols-1 lg:grid-cols-2">
      {/* ─── Left: form ─── */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center p-6 sm:p-10 lg:p-16 bg-ivory"
      >
        <div className="w-full max-w-md">
          <p className="eyebrow mb-3">Welcome Back</p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-charcoal mb-3 leading-tight">
            Sign in to read.
          </h1>
          <p className="text-charcoal-soft mb-10">
            Continue your subscription, manage your account, and pick up where
            you left off.
          </p>

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
            <Field label="Email" icon={<IoMailOutline />}>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
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
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-sm text-muted text-center mt-8">
            New to Magzineer?{" "}
            <Link
              to="/register"
              className="text-crimson font-medium hover:underline!"
            >
              Create an account
            </Link>
          </p>

          {/* Admin portal link */}
          <p className="text-sm text-center mt-4">
            <Link
              to="/admin/login"
              className="text-gold! hover:underline! transition"
            >
              Admin sign in →
            </Link>
          </p>
        </div>
      </motion.div>

      {/* ─── Right: editorial poster ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="hidden lg:block relative"
      >
        <img
          src={authBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-charcoal/30 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 text-ivory">
          <p className="eyebrow text-gold-soft! mb-3">Magzineer</p>
          <p className="font-display text-3xl leading-tight">
            Editorial excellence, delivered.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

// Reusable labeled field with leading icon
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

export default LoginPage;
