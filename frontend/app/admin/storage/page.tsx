"use client";

import { useEffect, useState } from "react";
import { StorageReport, getStorageReport } from "@/lib/api/admin";
import StorageUsageTable from "@/components/admin/StorageUsageTable";

export default function StoragePage() {
  const [report, setReport] = useState<StorageReport | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStorage = async () => {
    try {
      setLoading(true);
      const res = await getStorageReport();
      setReport(res);
    } catch {
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStorage();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Storage Metrics & Lifecycle Management
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Per-instructor storage reporting, raw vs HLS breakdown, and garbage collection cleanup policies.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-blue-600 text-sm font-semibold">
          Calculating per-instructor storage allocations...
        </div>
      ) : !report ? (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          Failed to fetch storage report.
        </div>
      ) : (
        <StorageUsageTable report={report} onRefresh={loadStorage} />
      )}
    </div>
  );
}
