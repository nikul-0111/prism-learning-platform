"use client";

import Link from "next/link";
import { ApprovalHistoryItem } from "@/lib/api/admin";
import { Eye, CheckCircle2, XCircle, Calendar, UserCheck } from "lucide-react";

interface ApprovalHistoryTableProps {
  history: ApprovalHistoryItem[];
}

export default function ApprovalHistoryTable({ history }: ApprovalHistoryTableProps) {
  if (history.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-xs">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <Calendar className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-slate-900 text-base">No Approval History</h4>
        <p className="text-xs text-slate-500 mt-1">
          No courses have been reviewed or published yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 uppercase tracking-wider text-[11px] text-slate-400 font-bold">
            <tr>
              <th className="px-6 py-4">Course & Category</th>
              <th className="px-6 py-4">Instructor</th>
              <th className="px-6 py-4">Decision & Status</th>
              <th className="px-6 py-4">Reviewer</th>
              <th className="px-6 py-4">Review Timestamp</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {history.map((item) => {
              const formattedDate = new Date(item.reviewedAt).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              });

              const isApproved = item.status === "PUBLISHED";

              return (
                <tr key={item.id} className="hover:bg-slate-50/80 transition">
                  {/* Course & Category */}
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/courses/${item.id}`}
                      className="font-bold text-slate-900 hover:text-blue-600 text-sm transition line-clamp-1"
                    >
                      {item.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">
                        {item.level}
                      </span>
                    </div>
                  </td>

                  {/* Instructor */}
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{item.instructor}</p>
                    <p className="text-slate-400 text-[11px]">{item.instructorEmail}</p>
                  </td>

                  {/* Decision & Status */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase border w-fit ${
                          isApproved
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {isApproved ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Approved
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-rose-600" />
                            Rejected
                          </>
                        )}
                      </span>

                      {!isApproved && item.rejectionReason && (
                        <p className="text-[11px] text-rose-700 bg-rose-50/60 p-2 rounded-xl border border-rose-100 max-w-xs mt-1">
                          <span className="font-bold">Feedback:</span> {item.rejectionReason}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Reviewer */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                      <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>{item.reviewedBy}</span>
                    </div>
                    {item.reviewedByEmail && (
                      <p className="text-slate-400 text-[10px] mt-0.5">{item.reviewedByEmail}</p>
                    )}
                  </td>

                  {/* Review Timestamp */}
                  <td className="px-6 py-4 font-medium text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formattedDate}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/courses/${item.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Inspect
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
