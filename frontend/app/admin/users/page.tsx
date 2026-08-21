"use client";

import { useEffect, useState } from "react";
import { AdminUserItem, getAdminUsers } from "@/lib/api/admin";
import UsersTable from "@/components/admin/UsersTable";
import { Search } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await getAdminUsers(1, 50, roleFilter === "ALL" ? undefined : roleFilter, search || undefined);
      setUsers(res.users);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [roleFilter, search]);

  const tabs = [
    { id: "ALL", label: "All Members" },
    { id: "INSTRUCTOR", label: "Instructors" },
    { id: "STUDENT", label: "Students" },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          User Governance & Role Management
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage platform instructors and student accounts and update member roles across the system.
        </p>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        {/* Role Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
                roleFilter === tab.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition font-medium shadow-xs"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-blue-600 text-sm font-semibold">
          Fetching platform members...
        </div>
      ) : (
        <UsersTable users={users} onRefresh={loadUsers} />
      )}
    </div>
  );
}
