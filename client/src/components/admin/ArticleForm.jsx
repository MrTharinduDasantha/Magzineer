// Article create/edit — React Quill rich-text editor with all article fields
import { useEffect, useMemo, useState } from "react";
import ReactQuill from "react-quill";
import { IoCloudUploadOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { createArticleApi, updateArticleApi } from "../../api/article.api.js";
import { adminGetAllMagazinesApi } from "../../api/magazine.api.js";
import { adminGetAllIssuesApi } from "../../api/issue.api.js";
import { getAllCategoriesApi } from "../../api/category.api.js";

const ArticleForm = ({ article = null, onSuccess, onPreview }) => {
  const [magazines, setMagazines] = useState([]);
  const [issues, setIssues] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    magazine: "",
    issue: "",
    category: "",
    accessLevel: "free",
    status: "draft",
    scheduledAt: "",
    readingTime: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // Quill toolbar config
  const quillModules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        [{ align: [] }],
        ["clean"],
      ],
    }),
    [],
  );

  // Load magazines + categories
  useEffect(() => {
    (async () => {
      try {
        const [mRes, cRes] = await Promise.all([
          adminGetAllMagazinesApi(),
          getAllCategoriesApi(),
        ]);
        setMagazines(mRes.data.data.magazines || []);
        setCategories(cRes.data.data.categories || []);
      } catch {
        toast.error("Failed to load reference data.");
      }
    })();
  }, []);

  // Hydrate when editing
  useEffect(() => {
    if (article) {
      setForm({
        title: article.title || "",
        excerpt: article.excerpt || "",
        content: article.content || "",
        author: article.author || "",
        magazine: article.magazine?._id || article.magazine || "",
        issue: article.issue?._id || article.issue || "",
        category: article.category?._id || article.category || "",
        accessLevel: article.accessLevel || "free",
        status: article.status || "draft",
        scheduledAt: article.scheduledAt
          ? article.scheduledAt.split("T")[0]
          : "",
        readingTime: article.readingTime || "",
      });
      setPreview(article.featuredImage?.url || "");
    }
  }, [article]);

  // Load issues whenever the selected magazine changes
  useEffect(() => {
    if (!form.magazine) {
      setIssues([]);
      return;
    }
    (async () => {
      try {
        const { data } = await adminGetAllIssuesApi({
          magazine: form.magazine,
        });
        setIssues(data.data.issues || []);
      } catch {
        setIssues([]);
      }
    })();
  }, [form.magazine]);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const buildPayload = () => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v !== "" && v !== null && v !== undefined) fd.append(k, v);
    });
    if (imageFile) fd.append("featuredImage", imageFile);
    return fd;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.title ||
      !form.excerpt ||
      !form.content ||
      !form.author ||
      !form.magazine ||
      !form.category
    ) {
      return toast.error("Please fill in all required fields.");
    }
    if (!article && !imageFile)
      return toast.error("Please select a featured image.");

    try {
      setLoading(true);
      if (article) {
        await updateArticleApi(article._id, buildPayload());
        toast.success("Article updated.");
      } else {
        await createArticleApi(buildPayload());
        toast.success("Article created.");
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
      {/* Featured image */}
      <Field label="Featured Image *">
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-48 h-32 object-cover border border-line rounded"
            />
          )}
          <label className="flex-1 border-2 border-dashed border-line rounded p-6 text-center cursor-pointer hover:bg-cream transition-colors">
            <IoCloudUploadOutline
              size={28}
              className="mx-auto text-muted mb-2"
            />
            <p className="text-sm text-charcoal-soft">
              {imageFile
                ? imageFile.name
                : "Click to upload (16:9 ratio recommended)"}
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
          </label>
        </div>
      </Field>

      <Field label="Title *">
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="input-mz"
          placeholder="The Lost Art of Paying Attention"
          required
        />
      </Field>

      <Field label="Excerpt *">
        <textarea
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          className="input-mz min-h-20 resize-y"
          placeholder="We live in an economy that profits when we glance and loses when we linger. What does it cost us, individually and collectively, to forget how to sit with one thing at a time?"
          required
        />
      </Field>

      <Field label="Content *">
        <div className="bg-paper rounded border border-line">
          <ReactQuill
            theme="snow"
            value={form.content}
            onChange={(content) => setForm({ ...form, content })}
            modules={quillModules}
            placeholder="Write the full article here..."
            style={{ minHeight: 300 }}
          />
        </div>
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Author *">
          <input
            type="text"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            className="input-mz"
            placeholder="Eleanor Marsh"
            required
          />
        </Field>
        <Field label="Reading Time (minutes) — leave blank to auto-calc">
          <input
            type="number"
            min="1"
            value={form.readingTime}
            onChange={(e) => setForm({ ...form, readingTime: e.target.value })}
            className="input-mz"
            placeholder="8"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Field label="Magazine *">
          <select
            value={form.magazine}
            onChange={(e) =>
              setForm({ ...form, magazine: e.target.value, issue: "" })
            }
            className="input-mz"
            required
          >
            <option value="">Select magazine</option>
            {magazines.map((m) => (
              <option key={m._id} value={m._id}>
                {m.title}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Issue (optional)">
          <select
            value={form.issue}
            onChange={(e) => setForm({ ...form, issue: e.target.value })}
            disabled={!form.magazine}
            className="input-mz disabled:opacity-50"
          >
            <option value="">— Unassigned —</option>
            {issues.map((i) => (
              <option key={i._id} value={i._id}>
                {i.issueNumber}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Category *">
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="input-mz"
            required
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Field label="Access Level">
          <select
            value={form.accessLevel}
            onChange={(e) => setForm({ ...form, accessLevel: e.target.value })}
            className="input-mz"
          >
            <option value="free">Free</option>
            <option value="premium">Premium</option>
          </select>
        </Field>
        <Field label="Status">
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="input-mz"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </Field>
        {form.status === "scheduled" && (
          <Field label="Scheduled For">
            <input
              type="date"
              value={form.scheduledAt}
              onChange={(e) =>
                setForm({ ...form, scheduledAt: e.target.value })
              }
              className="input-mz"
            />
          </Field>
        )}
      </div>

      <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-line">
        {onPreview && (
          <button
            type="button"
            onClick={() => onPreview(form)}
            className="btn-outline"
          >
            Preview
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary disabled:opacity-60"
        >
          {loading
            ? "Saving..."
            : article
              ? "Update Article"
              : "Create Article"}
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

export default ArticleForm;
