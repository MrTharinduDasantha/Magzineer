// Category create/edit form
import { useEffect, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import {
  createCategoryApi,
  updateCategoryApi,
} from "../../api/category.api.js";

const CategoryForm = ({ category = null, onSuccess, onCancel }) => {
  const [form, setForm] = useState({ name: "", description: "" });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setForm({
        name: category.name || "",
        description: category.description || "",
      });
      setPreview(category.image?.url || "");
    }
  }, [category]);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Name is required.");

    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      if (imageFile) fd.append("image", imageFile);

      if (category) {
        await updateCategoryApi(category._id, fd);
        toast.success("Category updated.");
      } else {
        await createCategoryApi(fd);
        toast.success("Category created.");
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
      <div>
        <label className="block text-xs uppercase tracking-widest text-muted font-medium mb-2">
          Image (optional)
        </label>
        <div className="flex gap-4 items-start">
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 object-cover border border-line rounded"
            />
          )}
          <label className="flex-1 border-2 border-dashed border-line rounded p-5 text-center cursor-pointer hover:bg-cream transition-colors">
            <IoCloudUploadOutline
              size={24}
              className="mx-auto text-muted mb-1"
            />
            <p className="text-sm text-charcoal-soft">
              {imageFile
                ? imageFile.name
                : "Click to upload (1:1 ratio recommended)"}
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

      <Field label="Name *">
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Culture"
          className="input-mz"
          required
        />
      </Field>

      <Field label="Description">
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Essays, criticism, and reportage on the books, films, music, and ideas shaping our cultural moment."
          className="input-mz min-h-22.5 resize-y"
        />
      </Field>

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
            : category
              ? "Update Category"
              : "Create Category"}
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

export default CategoryForm;
