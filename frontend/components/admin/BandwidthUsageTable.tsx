"use client";

import { BandwidthReport } from "@/lib/api/admin";

interface BandwidthUsageTableProps {
  report: BandwidthReport;
}

export default function BandwidthUsageTable({ report }: BandwidthUsageTableProps) {
  return (
    <div className="space-y-6">
      {/* Total Overview */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 flex items-center justify-between shadow-xs">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Aggregated Bandwidth
          </span>
          <h2 className="text-4xl font-extrabold text-blue-600 tracking-tight mt-1">
            {report.totalBandwidthGB} GB
          </h2>
        </div>
        <div className="text-right text-xs text-slate-400 font-medium">
          <p>Calculated via video renditions & enrollment stream volume</p>
        </div>
      </div>

      {/* Per Instructor Breakdown */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-6 border-b border-slate-200">
          <h4 className="font-bold text-slate-900 text-base">Bandwidth Consumption by Instructor & Course</h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase tracking-wider text-[11px] text-slate-400 font-bold">
              <tr>
                <th className="px-6 py-4">Instructor</th>
                <th className="px-6 py-4">Courses Breakdown</th>
                <th className="px-6 py-4 text-right">Instructor Total Bandwidth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {report.instructors.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-6 text-slate-400">
                    No bandwidth consumption data available.
                  </td>
                </tr>
              ) : (
                report.instructors.map((inst) => (
                  <tr key={inst.instructorId} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4 align-top">
                      <p className="font-bold text-slate-900">{inst.name}</p>
                      <p className="text-slate-400 text-[11px]">{inst.email}</p>
                    </td>

                    <td className="px-6 py-4 align-top">
                      <div className="space-y-2">
                        {inst.courses.map((c) => (
                          <div key={c.courseId} className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <span className="font-semibold text-slate-800">{c.courseTitle} ({c.enrollmentsCount} Students)</span>
                            <span className="font-bold text-blue-600">{c.bandwidthGB} GB</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="px-6 py-4 align-top text-right font-extrabold text-emerald-600 text-base">
                      {inst.totalBandwidthGB} GB
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
