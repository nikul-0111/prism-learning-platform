"use client";

import { CheckCircle2, Award, Download, ArrowRight, Shield, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export interface PaymentReceiptData {
  paymentId: string;
  orderId: string;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  amountPaid: string;
  date: string;
  status: string;
}

interface PaymentReceiptModalProps {
  receipt: PaymentReceiptData | null;
  onClose: () => void;
}

export default function PaymentReceiptModal({
  receipt,
  onClose,
}: PaymentReceiptModalProps) {
  const router = useRouter();

  if (!receipt) return null;

  function handleStartLearning() {
    onClose();
    router.push("/student/my-courses");
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl space-y-6">
        {/* Top Success Badge */}
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-600 shadow-inner">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
            <Sparkles className="h-3.5 w-3.5" /> Payment Successful
          </span>
          <h2 className="text-2xl font-black text-slate-900">Official Payment Receipt</h2>
          <p className="text-xs text-slate-500">
            Thank you for your purchase! Your course enrollment is confirmed and unlocked.
          </p>
        </div>

        {/* Receipt Details Invoice Box */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3 font-mono text-xs">
          <div className="flex justify-between border-b border-slate-200/80 pb-2">
            <span className="text-slate-500">Payment ID</span>
            <span className="font-bold text-slate-900">{receipt.paymentId}</span>
          </div>

          <div className="flex justify-between border-b border-slate-200/80 pb-2">
            <span className="text-slate-500">Order ID</span>
            <span className="font-bold text-slate-900">{receipt.orderId}</span>
          </div>

          <div className="flex justify-between border-b border-slate-200/80 pb-2">
            <span className="text-slate-500">Student Name</span>
            <span className="font-bold text-slate-900">{receipt.studentName}</span>
          </div>

          <div className="flex justify-between border-b border-slate-200/80 pb-2">
            <span className="text-slate-500">Course Purchased</span>
            <span className="font-bold text-indigo-700 text-right truncate max-w-[200px]">
              {receipt.courseTitle}
            </span>
          </div>

          <div className="flex justify-between border-b border-slate-200/80 pb-2">
            <span className="text-slate-500">Date & Time</span>
            <span className="font-bold text-slate-900">{receipt.date}</span>
          </div>

          <div className="flex justify-between pt-1 text-sm font-extrabold">
            <span className="text-slate-700">Amount Paid</span>
            <span className="text-emerald-600 font-black">{receipt.amountPaid}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleStartLearning}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition cursor-pointer"
          >
            <span>Start Learning in My Courses</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
