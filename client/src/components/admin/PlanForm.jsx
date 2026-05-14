// Subscription plan form — name, duration, price, features array, status toggles
import { useEffect, useState } from "react";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import {
  createPlanApi,
  updatePlanApi,
} from "../../api/subscriptionPlan.api.js";

const PlanForm = ({ plan = null, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    durationMonths: 1,
    price: 0,
    isActive: true,
    isDefault: false,
  });
  const [features, setFeatures] = useState([""]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (plan) {
      setForm({
        name: plan.name || "",
        description: plan.description || "",
        durationMonths: plan.durationMonths || 1,
        price: plan.price || 0,
        isActive: plan.isActive ?? true,
        isDefault: plan.isDefault ?? false,
      });
      setFeatures(plan.features?.length ? plan.features : [""]);
    }
  }, [plan]);

  const updateFeature = (idx, value) => {
    setFeatures((f) => f.map((v, i) => (i === idx ? value : v)));
  };
  const addFeature = () => setFeatures((f) => [...f, ""]);
  const removeFeature = (idx) =>
    setFeatures((f) => (f.length === 1 ? [""] : f.filter((_, i) => i !== idx)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.durationMonths || form.price === "") {
      return toast.error("Name, duration, and price are required.");
    }

    try {
      setLoading(true);
      const payload = {
        ...form,
        price: Number(form.price),
        durationMonths: Number(form.durationMonths),
        features: features.filter((f) => f.trim()),
      };

      if (plan) {
        await updatePlanApi(plan._id, payload);
        toast.success("Plan updated.");
      } else {
        await createPlanApi(payload);
        toast.success("Plan created.");
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
      <Field label="Plan Name *">
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Monthly Reader"
          className="input-mz"
          required
        />
      </Field>

      <Field label="Description">
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Full access on a flexible monthly basis — cancel anytime. The easiest way to dip in."
          className="input-mz min-h-20 resize-y"
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Duration (months) *">
          <input
            type="number"
            min="1"
            value={form.durationMonths}
            onChange={(e) =>
              setForm({ ...form, durationMonths: e.target.value })
            }
            className="input-mz"
            disabled={!!plan}
            required
          />
          {plan && (
            <p className="text-[10px] text-muted mt-1">
              Existing subscriptions keep their original duration.
            </p>
          )}
        </Field>
        <Field label="Price (USD) *">
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="input-mz"
            required
          />
        </Field>
      </div>

      {/* Features list */}
      <Field label="Features">
        <div className="flex flex-col gap-2">
          {features.map((feature, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => updateFeature(idx, e.target.value)}
                placeholder={`Feature ${idx + 1}`}
                className="input-mz flex-1"
              />
              <button
                type="button"
                onClick={() => removeFeature(idx)}
                className="text-crimson p-2 hover:bg-crimson/10 rounded"
                aria-label="Remove feature"
              >
                <IoRemoveCircleOutline size={20} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addFeature}
            className="self-start text-sm text-crimson flex items-center gap-1 hover:underline mt-1"
          >
            <IoAddCircleOutline size={18} /> Add another feature
          </button>
        </div>
      </Field>

      <div className="flex flex-col sm:flex-row gap-5">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="w-4 h-4 accent-crimson"
          />
          Active (shown publicly)
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
            className="w-4 h-4 accent-crimson"
          />
          Default plan for new users
        </label>
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
          {loading ? "Saving..." : plan ? "Update Plan" : "Create Plan"}
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

export default PlanForm;
