"use client";

import { useState } from "react";
import { AdminUserItem, updateUserRole } from "@/lib/api/admin";

interface UsersTableProps {
  users: AdminUserItem[];
  onRefresh: () => void;
}

export default function UsersTable({ users, onRefresh }: UsersTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleRoleChange = async (userId: string, newRole: "STUDENT" | "INSTRUCTOR" | "ADMIN") => {
    if (!confirm(`Are you sure you want to change this member's role to ${newRole}?`)) return;
    try {
      setLoadingId(userId);
      setMessage(null);
      const res = await updateUserRole(userId, newRole);
      setMessage({ type: "success", text: res.message });
      onRefresh();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to update role" });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {message && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase tracking-wider text-[11px] text-slate-400 font-bold">
              <tr>
                <th className="px-6 py-4">User & Email</th>
                <th className="px-6 py-4">Mobile Number</th>
                <th className="px-6 py-4">Current Role</th>
                <th className="px-6 py-4">Activity Breakdown</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Role Governance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400 font-medium">
                    No members match the selected criteria.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      <p className="text-slate-900">{u.name}</p>
                      <p className="text-slate-400 text-[11px] font-normal">{u.email}</p>
                    </td>

                    <td className="px-6 py-4 text-slate-500 font-medium">
                      {u.mobileNumber || "N/A"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          u.role === "ADMIN"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : u.role === "INSTRUCTOR"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-700 font-semibold">
                      {u.role === "INSTRUCTOR" ? (
                        <span>📹 {u.coursesCount} Courses Created</span>
                      ) : (
                        <span>🎓 {u.enrollmentsCount} Enrolled Courses</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-slate-400 text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-right">
                      {u.role === "ADMIN" ? (
                        <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
                          ADMIN (Protected)
                        </span>
                      ) : (
                        <select
                          value={u.role}
                          disabled={loadingId === u.id}
                          onChange={(e) =>
                            handleRoleChange(
                              u.id,
                              e.target.value as "STUDENT" | "INSTRUCTOR"
                            )
                          }
                          className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer font-semibold"
                        >
                          <option value="STUDENT">STUDENT</option>
                          <option value="INSTRUCTOR">INSTRUCTOR</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
