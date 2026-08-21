"use client";

import { useState } from "react";
import { StorageReport, runGarbageCollection } from "@/lib/api/admin";
import { HardDrive, Trash2 } from "lucide-react";

interface StorageUsageTableProps {
  report: StorageReport;
  onRefresh: () => void;
}

export default function StorageUsageTable({
  report,
  onRefresh,
}: StorageUsageTableProps) {
  const [gcLoading, setGcLoading] = useState(false);
  const [gcMessage, setGcMessage] = useState<string | null>(null);

  const handleRunGC = async () => {
    if (!confirm("Are you sure you want to trigger orphaned asset cleanup?")) return;
    try {
      setGcLoading(true);
      setGcMessage(null);
      const res = await runGarbageCollection();
      setGcMessage(`Garbage collection finished: Removed ${res.deletedCount} orphaned assets, freed ${res.freedStorageMB} MB.`);
      onRefresh();
    } catch (err: any) {
      setGcMessage(err.message || "Failed to run garbage collection.");
    } finally {
      setGcLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {gcMessage && (
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-sm font-semibold">
          {gcMessage}
        </div>
      )}

      {/* Orphaned Cleanup Action Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
        <div>
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-amber-600" />
            Storage Lifecycle & Garbage Collection
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Detected <span className="font-bold text-amber-700">{report.orphanedSummary.orphanedCount}</span> orphaned or failed storage assets ({report.orphanedSummary.orphanedStorageMB} MB).
          </p>
        </div>

        <button
          onClick={handleRunGC}
          disabled={gcLoading || report.orphanedSummary.orphanedCount === 0}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-sm disabled:opacity-40"
        >
          <Trash2 className="w-4 h-4" />
          {gcLoading ? "Cleaning Up..." : "Run Garbage Collection"}
        </button>
      </div>

      {/* Per-Instructor Storage Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-6 border-b border-slate-200">
          <h4 className="font-bold text-slate-900 text-base">Per-Instructor Storage Allocation</h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase tracking-wider text-[11px] text-slate-400 font-bold">
              <tr>
                <th className="px-6 py-4">Instructor</th>
                <th className="px-6 py-4">Courses & Assets</th>
                <th className="px-6 py-4">Raw MP4 Storage</th>
                <th className="px-6 py-4">HLS Renditions Storage</th>
                <th className="px-6 py-4">Total Storage Used</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {report.instructors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-slate-400">
                    No instructor storage data available.
                  </td>
                </tr>
              ) : (
                report.instructors.map((inst) => (
                  <tr key={inst.instructorId} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{inst.name}</p>
                      <p className="text-slate-400 text-[11px]">{inst.email}</p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">
                        {inst.coursesCount} Courses • {inst.assetCount} Assets
                      </p>
                      <p className="text-slate-400 text-[11px]">
                        Ready: {inst.readyCount} / {inst.assetCount}
                      </p>
                    </td>

                    <td className="px-6 py-4 font-semibold text-slate-700">
                      {inst.rawStorageMB} MB
                    </td>

                    <td className="px-6 py-4 font-bold text-blue-600">
                      {inst.hlsStorageMB} MB
                    </td>

                    <td className="px-6 py-4 font-extrabold text-emerald-600 text-sm">
                      {inst.totalStorageMB} MB
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
