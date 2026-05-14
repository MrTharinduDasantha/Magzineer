// Reader registration — profile photo + name + email + password
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  IoMailOutline,
  IoLockClosedOutline,
  IoPersonOutline,
  IoCloudUploadOutline,
  IoEyeOutline,
  IoEyeOffOutline,
} from "react-icons/io5";
import { toast } from "react-toastify";
import { registerUser, clearAuthError } from "../../app/features/authSlice.js";
import authBg from "../../assets/auth-bg.jpg";

const RegisterPage = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [photoFile, setPhotoFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, error } = useSelector((s) => s.auth);

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

  const handlePhoto = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPhotoFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      return toast.error("Please fill in all required fields.");
    }
    if (form.password.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }

    try {
      setLoading(true);
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (photoFile) fd.append("profilePhoto", photoFile);

      const action = await dispatch(registerUser(fd));
      if (registerUser.fulfilled.match(action)) {
        toast.success("Welcome to Magzineer!");
        navigate("/", { replace: true });
      } else {
        toast.error(action.payload || "Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] grid grid-cols-1 lg:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center p-6 sm:p-10 lg:p-16 bg-ivory"
      >
        <div className="w-full max-w-md">
          <p className="eyebrow mb-3">Join Magzineer</p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-charcoal mb-3 leading-tight">
            Create an account.
          </h1>
          <p className="text-charcoal-soft mb-8">
            Bookmark articles, manage subscriptions, and access purchased issues
            anytime.
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
            {/* Profile photo */}
            <div className="flex items-center gap-4">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile preview"
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-line"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center text-muted">
                  <IoPersonOutline size={28} />
                </div>
              )}
              <label className="flex-1 cursor-pointer">
                <span className="text-xs uppercase tracking-widest text-muted font-medium block mb-1">
                  Profile Photo (optional)
                </span>
                <span className="inline-flex items-center gap-2 text-sm text-crimson hover:underline">
                  <IoCloudUploadOutline size={16} />
                  {photoFile ? "Change photo" : "Upload photo"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhoto}
                  className="hidden"
                />
              </label>
            </div>

            <Field label="Full Name" icon={<IoPersonOutline />}>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Jane Doe"
                className="input-mz pl-10"
                required
              />
            </Field>

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
                placeholder="At least 6 characters"
                className="input-mz pl-10 pr-11"
                required
                minLength={6}
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
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-sm text-muted text-center mt-8">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-crimson font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>

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
          <p className="eyebrow text-gold-soft! mb-3">Membership</p>
          <p className="font-display text-3xl leading-tight">
            Stories worth lingering over.
          </p>
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

export default RegisterPage;
