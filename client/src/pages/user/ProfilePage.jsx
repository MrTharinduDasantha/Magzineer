// User profile page — edit name/email/photo + change password (2 tabs)
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  IoPersonOutline,
  IoLockClosedOutline,
  IoCloudUploadOutline,
  IoEyeOutline,
  IoEyeOffOutline,
} from "react-icons/io5";
import { toast } from "react-toastify";
import { updateProfileApi, changePasswordApi } from "../../api/user.api.js";
import { updateUser } from "../../app/features/authSlice.js";
import Breadcrumb from "../../components/common/Breadcrumb.jsx";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [tab, setTab] = useState("profile");

  const [profile, setProfile] = useState({ name: "", email: "" });
  const [photoFile, setPhotoFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  const [pwd, setPwd] = useState({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [showPwdFields, setShowPwdFields] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Hydrate when the auth user becomes available
  useEffect(() => {
    if (user) {
      setProfile({ name: user.name || "", email: user.email || "" });
      setPreview(user.profilePhoto?.url || "");
    }
  }, [user]);

  const handlePhoto = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPhotoFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const submitProfile = async (e) => {
    e.preventDefault();
    try {
      setProfileLoading(true);
      const fd = new FormData();
      fd.append("name", profile.name);
      fd.append("email", profile.email);
      if (photoFile) fd.append("profilePhoto", photoFile);

      const { data } = await updateProfileApi(fd);
      dispatch(updateUser(data.data.user));
      toast.success("Profile updated.");
      setPhotoFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed.");
    } finally {
      setProfileLoading(false);
    }
  };

  const toggleVisibility = (field) => {
    setShowPwdFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    if (!pwd.currentPassword || !pwd.newPassword) {
      return toast.error("Both fields are required.");
    }
    if (pwd.newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters.");
    }
    if (pwd.newPassword !== pwd.confirm) {
      return toast.error("New password and confirmation don't match.");
    }
    try {
      setPwdLoading(true);
      await changePasswordApi({
        currentPassword: pwd.currentPassword,
        newPassword: pwd.newPassword,
      });
      toast.success("Password changed successfully.");
      setPwd({ currentPassword: "", newPassword: "", confirm: "" });
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="container-mz py-10 lg:py-14 pb-20">
      <Breadcrumb
        items={[{ label: "Home", to: "/" }, { label: "My Profile" }]}
      />

      <div className="mt-6 mb-10">
        <p className="eyebrow mb-3">My Account</p>
        <h1 className="heading-rule font-display text-3xl sm:text-4xl text-charcoal">
          Profile Settings
        </h1>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-line mb-8">
        <TabBtn active={tab === "profile"} onClick={() => setTab("profile")}>
          <IoPersonOutline size={16} /> Profile
        </TabBtn>
        <TabBtn active={tab === "password"} onClick={() => setTab("password")}>
          <IoLockClosedOutline size={16} /> Password
        </TabBtn>
      </div>

      {tab === "profile" ? (
        <motion.form
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={submitProfile}
          className="max-w-2xl flex flex-col gap-5"
        >
          {/* Profile photo */}
          <div className="flex items-center gap-5">
            {preview ? (
              <img
                src={preview}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover ring-2 ring-line"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-cream flex items-center justify-center text-muted">
                <IoPersonOutline size={36} />
              </div>
            )}
            <label className="cursor-pointer">
              <span className="inline-flex items-center gap-2 text-sm btn-outline py-2!">
                <IoCloudUploadOutline size={16} />
                Change Photo
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhoto}
                className="hidden"
              />
            </label>
          </div>

          <Field label="Name">
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="input-mz"
              required
            />
          </Field>

          <Field label="Email">
            <input
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              className="input-mz"
              required
            />
          </Field>

          <button
            type="submit"
            disabled={profileLoading}
            className="btn-primary self-start mt-3 disabled:opacity-60"
          >
            {profileLoading ? "Saving..." : "Save Changes"}
          </button>
        </motion.form>
      ) : (
        <motion.form
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={submitPassword}
          className="max-w-md flex flex-col gap-5"
        >
          <Field label="Current Password">
            <div className="relative">
              <input
                type={showPwdFields.current ? "text" : "password"}
                value={pwd.currentPassword}
                onChange={(e) =>
                  setPwd({ ...pwd, currentPassword: e.target.value })
                }
                placeholder="••••••••"
                className="input-mz pr-10"
                required
              />
              <button
                type="button"
                onClick={() => toggleVisibility("current")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal"
              >
                {showPwdFields.current ? (
                  <IoEyeOffOutline size={18} />
                ) : (
                  <IoEyeOutline size={18} />
                )}
              </button>
            </div>
          </Field>
          <Field label="New Password">
            <div className="relative">
              <input
                type={showPwdFields.new ? "text" : "password"}
                value={pwd.newPassword}
                onChange={(e) =>
                  setPwd({ ...pwd, newPassword: e.target.value })
                }
                placeholder="••••••••"
                className="input-mz pr-10"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => toggleVisibility("new")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal"
              >
                {showPwdFields.new ? (
                  <IoEyeOffOutline size={18} />
                ) : (
                  <IoEyeOutline size={18} />
                )}
              </button>
            </div>
          </Field>
          <Field label="Confirm New Password">
            <div className="relative">
              <input
                type={showPwdFields.confirm ? "text" : "password"}
                value={pwd.confirm}
                onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })}
                placeholder="••••••••"
                className="input-mz pr-10"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => toggleVisibility("confirm")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal"
              >
                {showPwdFields.confirm ? (
                  <IoEyeOffOutline size={18} />
                ) : (
                  <IoEyeOutline size={18} />
                )}
              </button>
            </div>
          </Field>

          <button
            type="submit"
            disabled={pwdLoading}
            className="btn-primary self-start mt-3 disabled:opacity-60"
          >
            {pwdLoading ? "Updating..." : "Change Password"}
          </button>
        </motion.form>
      )}
    </div>
  );
};

const TabBtn = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
      active
        ? "border-crimson text-crimson"
        : "border-transparent text-muted hover:text-charcoal"
    }`}
  >
    {children}
  </button>
);

const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs uppercase tracking-widest text-muted font-medium mb-2">
      {label}
    </label>
    {children}
  </div>
);

export default ProfilePage;
