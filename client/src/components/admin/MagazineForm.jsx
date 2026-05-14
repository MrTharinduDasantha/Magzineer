// Add / edit magazine form — title, description, cover image, featured + status toggles
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoCloudUploadOutline, IoCheckmark } from "react-icons/io5";
import { toast } from "react-toastify";
import {
  createMagazineApi,
  updateMagazineApi,
} from "../../api/magazine.api.js";

const MagazineForm = ({ magazine = null, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    isFeatured: false,
    status: "active",
  });
  const [coverFile, setCoverFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // Hydrate the form when editing an existing magazine
  useEffect(() => {
    if (magazine) {
      setForm({
        title: magazine.title || "",
        description: magazine.description || "",
        isFeatured: !!magazine.isFeatured,
        status: magazine.status || "active",
      });
      setPreview(magazine.cover?.url || "");
    }
  }, [magazine]);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      return toast.error("Title and description are required.");
    }
    if (!magazine && !coverFile) {
      return toast.error("Please select a cover image.");
    }

    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("isFeatured", form.isFeatured);
      fd.append("status", form.status);
      if (coverFile) fd.append("cover", coverFile);

      if (magazine) {
        await updateMagazineApi(magazine._id, fd);
        toast.success("Magazine updated.");
      } else {
        await createMagazineApi(fd);
        toast.success("Magazine created.");
      }
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Cover image */}
      <div>
        <label className="block text-xs uppercase tracking-widest text-muted font-medium mb-2">
          Cover Image *
        </label>
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-44 object-cover border border-line"
            />
          )}
          <label className="flex-1 border-2 border-dashed border-line rounded p-6 text-center cursor-pointer hover:bg-cream transition-colors">
            <IoCloudUploadOutline
              size={28}
              className="mx-auto text-muted mb-2"
            />
            <p className="text-sm text-charcoal-soft">
              {coverFile
                ? coverFile.name
                : "Click to upload (3:4 ratio recommended)"}
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Title */}
      <Field label="Title *">
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="input-mz"
          placeholder="The Quarterly"
          required
        />
      </Field>

      {/* Description */}
      <Field label="Description *">
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="input-mz min-h-27.5 resize-y"
          placeholder="A thoughtful quarterly devoted to long-form essays on culture, ideas, and the lives that shape our age. Each issue is a slow read worth lingering over."
          required
        />
      </Field>

      {/* Status + Featured */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Status">
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="input-mz"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </Field>

        <div className="flex items-center">
          <label className="flex items-center gap-3 cursor-pointer pt-7">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) =>
                setForm({ ...form, isFeatured: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-cream rounded-full border border-line peer-checked:bg-crimson transition-colors relative">
              <motion.div
                className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow"
                animate={{ x: form.isFeatured ? 20 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </div>
            <span className="text-sm text-charcoal">Featured on homepage</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-line">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-outline">
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary disabled:opacity-60"
        >
          {loading
            ? "Saving..."
            : magazine
              ? "Update Magazine"
              : "Create Magazine"}
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

export default MagazineForm;
