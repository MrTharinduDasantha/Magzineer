// Plan list — toggle active, set default, edit, delete
import { useState } from "react";
import {
  IoCreateOutline,
  IoTrashOutline,
  IoStar,
  IoStarOutline,
  IoEyeOutline,
  IoEyeOffOutline,
} from "react-icons/io5";
import { toast } from "react-toastify";
import {
  deletePlanApi,
  togglePlanStatusApi,
  setDefaultPlanApi,
} from "../../api/subscriptionPlan.api.js";
import ConfirmDialog from "../common/ConfirmDialog.jsx";
import { formatCurrency } from "../../utils/formatCurrency.js";

const PlanTable = ({ plans = [], onEdit, onRefresh }) => {
  const [confirm, setConfirm] = useState({ open: false, id: null });

  const handleToggle = async (id) => {
    try {
      await togglePlanStatusApi(id);
      toast.success("Plan status updated.");
      onRefresh?.();
    } catch {
      toast.error("Failed.");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await setDefaultPlanApi(id);
      toast.success("Default plan set.");
      onRefresh?.();
    } catch {
      toast.error("Failed.");
    }
  };

  const handleDelete = async () => {
    try {
      await deletePlanApi(confirm.id);
      toast.success("Plan deleted.");
      onRefresh?.();
    } catch {
      toast.error("Delete failed.");
    }
  };

  return (
    <>
      <div className="card-mz overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream/50">
              <tr className="text-left text-xs uppercase tracking-widest text-muted">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Duration</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Features</th>
                <th className="px-5 py-3 font-medium">Active</th>
                <th className="px-5 py-3 font-medium">Default</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-muted">
                    No plans yet.
                  </td>
                </tr>
              )}
              {plans.map((p) => (
                <tr
                  key={p._id}
                  className="border-t border-line hover:bg-cream/40"
                >
                  <td className="px-5 py-3">
                    <p className="font-medium text-charcoal">{p.name}</p>
                    <p className="text-xs text-muted max-w-lg">
                      {p.description}
                    </p>
                  </td>
                  <td className="px-5 py-3 text-xs text-charcoal">
                    {p.durationMonths === 1
                      ? "Monthly"
                      : p.durationMonths === 12
                        ? "Yearly"
                        : `${p.durationMonths} months`}
                  </td>
                  <td className="px-5 py-3 font-medium text-charcoal">
                    {formatCurrency(p.price)}
                  </td>
                  <td className="px-5 py-3 text-xs text-muted">
                    {p.features?.length || 0} listed
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => handleToggle(p._id)}
                      className="text-charcoal hover:text-crimson"
                    >
                      {p.isActive ? (
                        <IoEyeOutline size={18} />
                      ) : (
                        <IoEyeOffOutline size={18} />
                      )}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => !p.isDefault && handleSetDefault(p._id)}
                      className={
                        p.isDefault ? "text-gold" : "text-muted hover:text-gold"
                      }
                      title={p.isDefault ? "Default plan" : "Set as default"}
                    >
                      {p.isDefault ? (
                        <IoStar size={18} />
                      ) : (
                        <IoStarOutline size={18} />
                      )}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit?.(p)}
                        className="w-8 h-8 flex items-center justify-center rounded border border-line bg-paper hover:bg-charcoal hover:text-ivory transition-colors"
                      >
                        <IoCreateOutline size={16} />
                      </button>
                      <button
                        onClick={() => setConfirm({ open: true, id: p._id })}
                        className="w-8 h-8 flex items-center justify-center rounded border border-line bg-paper text-crimson hover:bg-crimson hover:text-ivory hover:border-crimson transition-colors"
                      >
                        <IoTrashOutline size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirm.open}
        onClose={() => setConfirm({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Plan?"
        message="The plan will be removed from the catalog and archived on Stripe."
        confirmText="Delete"
        variant="danger"
      />
    </>
  );
};

export default PlanTable;
