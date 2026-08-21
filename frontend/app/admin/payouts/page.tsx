"use client";

import { useEffect, useState } from "react";
import { PayoutReportItem, getPayoutReport } from "@/lib/api/admin";
import PayoutTable from "@/components/admin/PayoutTable";

export default function PayoutsPage() {
  const [report, setReport] = useState<PayoutReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPayouts = async () => {
    try {
      setLoading(true);
      const res = await getPayoutReport();
      setReport(res);
    } catch {
      setReport([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayouts();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Instructor Payout & Revenue Ledger
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Financial calculation reporting: Gross Revenue per course, 20% platform commission, and instructor net payout.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-blue-600 text-sm font-semibold">
          Calculating instructor payouts & platform fees...
        </div>
      ) : (
        <PayoutTable report={report} />
      )}
    </div>
  );
}
