// User list — search, paginate, view detail, block/unblock
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  IoSearchOutline,
  IoEyeOutline,
  IoBan,
  IoCheckmarkCircle,
} from "react-icons/io5";
import { toast } from "react-toastify";
import { toggleBlockUserApi } from "../../api/admin.api.js";
import Pagination from "../common/Pagination.jsx";
import { formatDate } from "../../utils/formatDate.js";

const UserTable = ({
  users = [],
  pagination,
  onSearch,
  onPageChange,
  onRefresh,
}) => {
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch?.(search);
  };

  const handleToggle = async (id) => {
    try {
      await toggleBlockUserApi(id);
      toast.success("User status updated.");
      onRefresh?.();
    } catch {
      toast.error("Failed.");
    }
  };

  return (
    <>
      <form onSubmit={handleSearch} className="mb-4">
        <div className="relative max-w-sm">
          <IoSearchOutline
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-3 py-2 bg-cream border border-line rounded text-sm focus:outline-none focus:border-charcoal"
          />
        </div>
      </form>

      <div className="card-mz overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream/50">
              <tr className="text-left text-xs uppercase tracking-widest text-muted">
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Joined</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-muted">
                    No users found.
                  </td>
                </tr>
              )}
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="border-t border-line hover:bg-cream/40"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {u.profilePhoto?.url ? (
                        <img
                          src={u.profilePhoto.url}
                          alt={u.name}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-charcoal text-ivory flex items-center justify-center font-display text-sm">
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                      )}
                      <span className="font-medium text-charcoal">
                        {u.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-charcoal-soft text-xs">
                    {u.email}
                  </td>
                  <td className="px-5 py-3 text-muted text-xs">
                    {formatDate(u.createdAt)}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${
                        u.blocked
                          ? "bg-crimson/10 text-crimson"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {u.blocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/users/${u._id}`}
                        className="w-8 h-8 flex items-center justify-center rounded border border-line bg-paper hover:bg-charcoal hover:text-ivory! transition-colors"
                        title="View detail"
                      >
                        <IoEyeOutline size={16} />
                      </Link>
                      <button
                        onClick={() => handleToggle(u._id)}
                        className={`w-8 h-8 flex items-center justify-center rounded border transition-colors ${
                          u.blocked
                            ? "border-emerald-300 text-emerald-700 hover:bg-emerald-700 hover:text-white"
                            : "border-line text-crimson hover:bg-crimson hover:text-ivory hover:border-crimson"
                        }`}
                        title={u.blocked ? "Unblock" : "Block"}
                      >
                        {u.blocked ? (
                          <IoCheckmarkCircle size={16} />
                        ) : (
                          <IoBan size={16} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        page={pagination?.page || 1}
        totalPages={pagination?.totalPages || 0}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default UserTable;
