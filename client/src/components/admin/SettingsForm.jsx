// Site settings form — logo, address, phone, email, social media links
import { useEffect, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { getSettingsApi, updateSettingsApi } from "../../api/settings.api.js";

const SettingsForm = () => {
  const [form, setForm] = useState({
    siteName: "",
    address: "",
    phone: "",
    email: "",
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    youtube: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // Load existing settings on mount
  useEffect(() => {
    (async () => {
      try {
        const { data } = await getSettingsApi();
        const s = data.data.settings;
        if (!s) return;
        setForm({
          siteName: s.siteName || "",
          address: s.address || "",
          phone: s.phone || "",
          email: s.email || "",
          facebook: s.socialLinks?.facebook || "",
          twitter: s.socialLinks?.twitter || "",
          instagram: s.socialLinks?.instagram || "",
          linkedin: s.socialLinks?.linkedin || "",
          youtube: s.socialLinks?.youtube || "",
        });
        setLogoPreview(s.logo?.url || "");
      } catch {
        toast.error("Failed to load settings.");
      }
    })();
  }, []);

  const handleLogo = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setLogoFile(f);
    setLogoPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (logoFile) fd.append("logo", logoFile);

      await updateSettingsApi(fd);
      toast.success("Settings saved.");
    } catch {
      toast.error("Save failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Logo */}
      <div>
        <label className="block text-xs uppercase tracking-widest text-muted font-medium mb-2">
          Logo
        </label>
        <div className="flex gap-4 items-start">
          {logoPreview && (
            <img
              src={logoPreview}
              alt="Logo"
              className="w-20 h-20 object-contain border border-line p-2 bg-paper rounded"
            />
          )}
          <label className="flex-1 border-2 border-dashed border-line rounded p-5 text-center cursor-pointer hover:bg-cream transition-colors">
            <IoCloudUploadOutline
              size={24}
              className="mx-auto text-muted mb-1"
            />
            <p className="text-sm text-charcoal-soft">
              {logoFile ? logoFile.name : "Click to upload new logo"}
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogo}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <Field label="Site Name">
        <input
          type="text"
          value={form.siteName}
          onChange={(e) => setForm({ ...form, siteName: e.target.value })}
          className="input-mz"
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Email">
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input-mz"
          />
        </Field>
        <Field label="Phone">
          <input
            type="text"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="input-mz"
          />
        </Field>
      </div>

      <Field label="Address">
        <textarea
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="input-mz min-h-17.5 resize-y"
        />
      </Field>

      <div>
        <p className="text-xs uppercase tracking-widest text-muted font-medium mb-3">
          Social Media
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SocialField
            icon={<FaFacebookF />}
            label="Facebook"
            value={form.facebook}
            onChange={(v) => setForm({ ...form, facebook: v })}
          />
          <SocialField
            icon={<FaTwitter />}
            label="Twitter"
            value={form.twitter}
            onChange={(v) => setForm({ ...form, twitter: v })}
          />
          <SocialField
            icon={<FaInstagram />}
            label="Instagram"
            value={form.instagram}
            onChange={(v) => setForm({ ...form, instagram: v })}
          />
          <SocialField
            icon={<FaLinkedinIn />}
            label="LinkedIn"
            value={form.linkedin}
            onChange={(v) => setForm({ ...form, linkedin: v })}
          />
          <SocialField
            icon={<FaYoutube />}
            label="YouTube"
            value={form.youtube}
            onChange={(v) => setForm({ ...form, youtube: v })}
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-line">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
};

const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs uppercase tracking-widest text-muted font-medium mb-2">
      {label}
    </label>
    {children}
  </div>
);

const SocialField = ({ icon, label, value, onChange }) => (
  <div className="flex items-center gap-2">
    <span className="w-9 h-9 flex items-center justify-center bg-cream rounded text-charcoal">
      {icon}
    </span>
    <input
      type="url"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={`${label} URL`}
      className="input-mz flex-1"
    />
  </div>
);

export default SettingsForm;
