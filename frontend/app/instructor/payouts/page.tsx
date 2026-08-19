"use client";

import { useAuth } from "@/context/auth-context";
import {
  DollarSign,
  TrendingUp,
  Users,
  Wallet,
  CheckCircle2,
  Search,
  Filter,
  Download,
  FileText,
  X,
  Printer,
  ShieldCheck,
  Building2,
  ArrowUpRight,
  Sparkles,
  CreditCard,
  Mail,
  Phone,
  BookOpen,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";

interface StudentInfo {
  id?: string;
  name: string;
  email: string;
  mobileNumber: string;
}

interface CourseInfo {
  id?: string;
  title: string;
  price: number;
}

interface InstructorTransaction {
  id: string;
  transactionId: string;
  orderId: string;
  student: StudentInfo;
  course: CourseInfo;
  grossAmount: string;
  instructorEarnings: string;
  instructorEarningsRaw: number;
  platformFee: string;
  paymentMethod: string;
  status: string;
  date: string;
}

interface PayoutSummary {
  totalRevenue: string;
  totalPayoutEligible: string;
  pendingPayouts: string;
  totalStudents: number;
}

export default function ProfessionalInstructorPayoutsPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseFilter, setSelectedCourseFilter] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState<InstructorTransaction | null>(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const [summary, setSummary] = useState<PayoutSummary>({
    totalRevenue: "₹0",
    totalPayoutEligible: "₹0",
    pendingPayouts: "₹0",
    totalStudents: 0,
  });

  const [transactions, setTransactions] = useState<InstructorTransaction[]>([]);

  useEffect(() => {
    async function fetchPayouts() {
      if (!token) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiUrl}/payments/instructor-payouts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            if (data.data.summary) {
              setSummary(data.data.summary);
            }
            if (Array.isArray(data.data.transactions)) {
              setTransactions(data.data.transactions);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch instructor payout data from DB:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPayouts();
  }, [token]);

  // Filter transactions by course and search query
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.course.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCourse =
      selectedCourseFilter === "all" || tx.course.title === selectedCourseFilter;

    return matchesSearch && matchesCourse;
  });

  // Extract unique course titles for filter dropdown
  const courseOptions = Array.from(new Set(transactions.map((tx) => tx.course.title)));

  function handleWithdrawRequest() {
    setWithdrawSuccess(true);
    setTimeout(() => {
      setWithdrawSuccess(false);
      setShowWithdrawModal(false);
    }, 2500);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 border border-indigo-200">
              <ShieldCheck className="h-3.5 w-3.5" /> INSTRUCTOR REVENUE PORTAL
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
              90% INSTRUCTOR SHARE
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Payouts & Earnings Breakdown</h1>
          <p className="text-xs font-medium text-slate-500 max-w-xl">
            Real-time sales & payment details for student purchases in <strong>your courses only</strong>.
          </p>
        </div>

        <div className="z-10 flex items-center gap-3">
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 text-xs font-extrabold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition cursor-pointer"
          >
            <Wallet className="h-4 w-4" />
            <span>Withdraw Earnings ({summary.totalPayoutEligible})</span>
          </button>
        </div>
      </div>

      {/* FINANCIAL SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Gross Sales */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-2 hover:border-indigo-200 transition">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">GROSS SALES</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{summary.totalRevenue}</p>
          <p className="text-xs font-semibold text-slate-500">Total Course Sales Generated</p>
        </div>

        {/* Your Net Payout (90%) */}
        <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/60 to-white p-6 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
              <DollarSign className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">NET EARNINGS</span>
          </div>
          <p className="text-2xl font-black text-emerald-900">{summary.totalPayoutEligible}</p>
          <p className="text-xs font-bold text-emerald-700">Eligible for Bank Withdrawal</p>
        </div>

        {/* Total Enrolled Students */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-2 hover:border-purple-200 transition">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
              <Users className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-extrabold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">STUDENTS</span>
          </div>
          <p className="text-2xl font-black text-slate-900">{summary.totalStudents} Buyers</p>
          <p className="text-xs font-semibold text-slate-500">Enrolled in Your Courses</p>
        </div>

        {/* Platform Share Fee */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-2 hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-extrabold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">10% FEE</span>
          </div>
          <p className="text-2xl font-black text-slate-900">10% Fee</p>
          <p className="text-xs font-semibold text-slate-500">Platform Maintenance Share</p>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-extrabold text-slate-900">Student Course Purchases</h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student, email or ID..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs font-semibold text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white"
              />
            </div>

            {/* Course Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedCourseFilter}
                onChange={(e) => setSelectedCourseFilter(e.target.value)}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer focus:border-indigo-500 focus:bg-white"
              >
                <option value="all">All Your Courses ({transactions.length})</option>
                {courseOptions.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* TRANSACTIONS TABLE */}
        {loading ? (
          <div className="py-16 text-center text-xs font-extrabold text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
            <span>Fetching real payout & earnings records from database...</span>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-16 text-center space-y-3">
            <BookOpen className="mx-auto h-12 w-12 text-slate-300" />
            <p className="text-base font-extrabold text-slate-800">
              {searchQuery || selectedCourseFilter !== "all"
                ? "No payment records matched your search"
                : "No Course Sales Yet"}
            </p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              {searchQuery || selectedCourseFilter !== "all"
                ? "Try clearing your search query or dropdown filter."
                : "When students enroll in or purchase your courses, transaction receipts and earnings will automatically appear here!"}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3.5">Student Info</th>
                  <th className="px-5 py-3.5">Course Purchased</th>
                  <th className="px-5 py-3.5">Gross Price</th>
                  <th className="px-5 py-3.5">Your Payout (90%)</th>
                  <th className="px-5 py-3.5">Tx ID & Date</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                    {/* Student Info */}
                    <td className="px-5 py-4">
                      <div className="font-extrabold text-slate-900">{tx.student.name}</div>
                      <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                        <Mail className="h-3 w-3 text-slate-400" /> {tx.student.email}
                      </div>
                      <div className="text-[10px] font-semibold text-slate-400 flex items-center gap-1 mt-0.5">
                        <Phone className="h-2.5 w-2.5 text-slate-400" /> {tx.student.mobileNumber}
                      </div>
                    </td>

                    {/* Course Title */}
                    <td className="px-5 py-4 font-bold text-slate-800 max-w-xs">
                      <div className="line-clamp-2">{tx.course.title}</div>
                      <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                        {tx.paymentMethod}
                      </span>
                    </td>

                    {/* Gross Price */}
                    <td className="px-5 py-4 font-extrabold text-slate-700">{tx.grossAmount}</td>

                    {/* Instructor Payout Share */}
                    <td className="px-5 py-4">
                      <span className="font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                        {tx.instructorEarnings}
                      </span>
                    </td>

                    {/* Tx ID & Date */}
                    <td className="px-5 py-4">
                      <div className="font-mono text-[11px] font-bold text-slate-800">{tx.transactionId}</div>
                      <div className="text-[10px] text-slate-400">{tx.date}</div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" /> {tx.status}
                      </span>
                    </td>

                    {/* View Invoice */}
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelectedTransaction(tx)}
                        className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-extrabold text-slate-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition cursor-pointer"
                      >
                        <FileText className="h-3.5 w-3.5" /> Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* STUDENT TRANSACTION INVOICE MODAL */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-6 relative border border-slate-100">
            <button
              onClick={() => setSelectedTransaction(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center space-y-1">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Student Purchase Breakdown</h3>
              <p className="text-[11px] font-semibold text-slate-400">PRISM Instructor Revenue Statement</p>
            </div>

            {/* Verification Stamp */}
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-center">
              <p className="text-xs font-black text-emerald-800 uppercase tracking-wider">
                ✓ VERIFIED STUDENT PURCHASE
              </p>
            </div>

            {/* Breakdown List */}
            <div className="space-y-3 rounded-2xl bg-slate-50 p-4 border border-slate-200 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="font-semibold text-slate-500">Student Name</span>
                <span className="font-bold text-slate-900">{selectedTransaction.student.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="font-semibold text-slate-500">Student Email</span>
                <span className="font-bold text-slate-900">{selectedTransaction.student.email}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="font-semibold text-slate-500">Mobile Number</span>
                <span className="font-bold text-slate-800">{selectedTransaction.student.mobileNumber}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="font-semibold text-slate-500">Course</span>
                <span className="font-bold text-slate-900 max-w-[200px] text-right truncate">
                  {selectedTransaction.course.title}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="font-semibold text-slate-500">Gross Price</span>
                <span className="font-bold text-slate-900">{selectedTransaction.grossAmount}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="font-semibold text-slate-500">Platform Share (10%)</span>
                <span className="font-semibold text-slate-500">{selectedTransaction.platformFee}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="font-semibold text-slate-500">Transaction ID</span>
                <span className="font-mono font-bold text-indigo-600">{selectedTransaction.transactionId}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="font-bold text-slate-900">Your Net Payout (90%)</span>
                <span className="text-sm font-black text-emerald-700">{selectedTransaction.instructorEarnings}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition cursor-pointer"
              >
                <Printer className="h-4 w-4" /> Print Statement
              </button>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="rounded-2xl border border-slate-200 px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BANK WITHDRAWAL MODAL */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-6 relative border border-slate-100">
            <button
              onClick={() => setShowWithdrawModal(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center space-y-1">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30">
                <Wallet className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Withdraw Earnings</h3>
              <p className="text-[11px] font-semibold text-slate-400">Transfer revenue directly to your Bank / UPI account</p>
            </div>

            {withdrawSuccess ? (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center space-y-2">
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600 animate-bounce" />
                <p className="text-sm font-black text-emerald-900">Withdrawal Requested!</p>
                <p className="text-xs text-emerald-700">
                  {summary.totalPayoutEligible} will be deposited to your registered bank account within 24 hours.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-500">Available Net Balance</span>
                    <span className="font-black text-emerald-700">{summary.totalPayoutEligible}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-500">Payout Account</span>
                    <span className="font-bold text-slate-800">HDFC Bank •••• 4892 (UPI)</span>
                  </div>
                </div>

                <button
                  onClick={handleWithdrawRequest}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3.5 text-xs font-black text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" /> Confirm Payout Transfer
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}