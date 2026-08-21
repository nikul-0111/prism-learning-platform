"use client";

import { useEffect, useState } from "react";
import { BandwidthReport, getBandwidthReport } from "@/lib/api/admin";
import BandwidthUsageTable from "@/components/admin/BandwidthUsageTable";

export default function UsagePage() {
  const [report, setReport] = useState<BandwidthReport | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUsage = async () => {
    try {
      setLoading(true);
      const res = await getBandwidthReport();
      setReport(res);
    } catch {
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsage();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Bandwidth & Streaming Analytics
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Aggregated streaming bandwidth consumption per instructor and course.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-blue-600 text-sm font-semibold">
          Aggregating platform bandwidth usage...
        </div>
      ) : !report ? (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          Failed to fetch bandwidth usage report.
        </div>
      ) : (
        <BandwidthUsageTable report={report} />
      )}
    </div>
  );
}
