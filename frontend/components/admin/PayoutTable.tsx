"use client";

import { PayoutReportItem } from "@/lib/api/admin";

interface PayoutTableProps {
  report: PayoutReportItem[];
}

export default function PayoutTable({ report }: PayoutTableProps) {
  const totalGross = report.reduce((sum, item) => sum + item.grossRevenue, 0);
  const totalFee = report.reduce((sum, item) => sum + item.platformFee, 0);
  const totalNet = report.reduce((sum, item) => sum + item.netPayout, 0);

  return (
    <div className="space-y-6">
      {/* Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Gross Revenue
          </span>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
            ₹{totalGross.toLocaleString("en-IN")}
          </h3>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
            PRISM Platform Fee (20%)
          </span>
          <h3 className="text-3xl font-extrabold text-amber-600 mt-1">
            ₹{totalFee.toLocaleString("en-IN")}
          </h3>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Instructor Net Amount
          </span>
          <h3 className="text-3xl font-extrabold text-emerald-600 mt-1">
            ₹{totalNet.toLocaleString("en-IN")}
          </h3>
        </div>
      </div>

      {/* Main Payout Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-900 text-base">Instructor Revenue & Payout Ledger</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Calculated automatically based on course enrollments and platform fee model.
            </p>
          </div>
          <span className="px-3.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold rounded-full">
            REPORTING ONLY (NO MONETARY TRANSFER)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase tracking-wider text-[11px] text-slate-400 font-bold">
              <tr>
                <th className="px-6 py-4">Instructor</th>
                <th className="px-6 py-4">Courses & Enrollments</th>
                <th className="px-6 py-4">Gross Revenue</th>
                <th className="px-6 py-4 text-amber-600">Platform Fee (20%)</th>
                <th className="px-6 py-4 text-emerald-600 font-extrabold">Instructor Net Payout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {report.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-slate-400">
                    No instructor payout data available.
                  </td>
                </tr>
              ) : (
                report.map((item) => (
                  <tr key={item.instructorId} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{item.name}</p>
                      <p className="text-slate-400 text-[11px]">{item.email}</p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">
                        {item.coursesCount} Courses • {item.totalEnrollments} Enrollments
                      </p>
                    </td>

                    <td className="px-6 py-4 font-bold text-slate-900">
                      ₹{item.grossRevenue.toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-4 font-bold text-amber-600">
                      ₹{item.platformFee.toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-4 font-extrabold text-emerald-600 text-sm">
                      ₹{item.netPayout.toLocaleString("en-IN")}
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
