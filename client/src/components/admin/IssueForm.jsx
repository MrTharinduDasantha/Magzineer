// Add / edit issue form — magazine, issue number, title, date, cover, price, status
import { useEffect, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { createIssueApi, updateIssueApi } from "../../api/issue.api.js";
import { adminGetAllMagazinesApi } from "../../api/magazine.api.js";

const IssueForm = ({ issue = null, onSuccess, onCancel }) => {
  const [magazines, setMagazines] = useState([]);
  const [form, setForm] = useState({
    magazine: "",
    issueNumber: "",
    title: "",
    publicationDate: "",
    price: 0,
    status: "unpublished",
  });
  const [coverFile, setCoverFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // Load all magazines for the dropdown
  useEffect(() => {
    (async () => {
      try {
        const { data } = await adminGetAllMagazinesApi();
        setMagazines(data.data.magazines || []);
      } catch {
        toast.error("Failed to load magazines.");
      }
    })();
  }, []);

  // Hydrate when editing
  useEffect(() => {
    if (issue) {
      setForm({
        magazine: issue.magazine?._id || issue.magazine || "",
        issueNumber: issue.issueNumber || "",
        title: issue.title || "",
        publicationDate: issue.publicationDate
          ? issue.publicationDate.split("T")[0]
          : "",
        price: issue.price || 0,
        status: issue.status || "unpublished",
      });
      setPreview(issue.cover?.url || "");
    }
  }, [issue]);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.magazine || !form.issueNumber || !form.publicationDate) {
      return toast.error("Magazine, issue number, and date are required.");
    }
    if (!issue && !coverFile)
      return toast.error("Please select a cover image.");

    try {
      setLoading(true);
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (coverFile) fd.append("cover", coverFile);

      if (issue) {
        await updateIssueApi(issue._id, fd);
        toast.success("Issue updated.");
      } else {
        await createIssueApi(fd);
        toast.success("Issue created.");
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

      <Field label="Magazine *">
        <select
          value={form.magazine}
          onChange={(e) => setForm({ ...form, magazine: e.target.value })}
          className="input-mz"
          required
          disabled={!!issue} // can't switch an existing issue between magazines
        >
          <option value="">Select a magazine</option>
          {magazines.map((m) => (
            <option key={m._id} value={m._id}>
              {m.title}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Issue Number *">
          <input
            type="text"
            value={form.issueNumber}
            onChange={(e) => setForm({ ...form, issueNumber: e.target.value })}
            placeholder="Vol 04, No 01"
            className="input-mz"
            required
          />
        </Field>
        <Field label="Publication Date *">
          <input
            type="date"
            value={form.publicationDate}
            onChange={(e) =>
              setForm({ ...form, publicationDate: e.target.value })
            }
            className="input-mz"
            required
          />
        </Field>
      </div>

      <Field label="Issue Title (optional)">
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="On Attention"
          className="input-mz"
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Single-Issue Price (USD) — 0 for free">
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="input-mz"
          />
        </Field>
        <Field label="Status">
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="input-mz"
          >
            <option value="unpublished">Unpublished</option>
            <option value="published">Published</option>
          </select>
        </Field>
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
          {loading ? "Saving..." : issue ? "Update Issue" : "Create Issue"}
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

export default IssueForm;
