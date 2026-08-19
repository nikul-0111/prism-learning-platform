import { get, post, patch } from "./client";

export interface PlatformMetrics {
  totalUsers: number;
  studentsCount: number;
  instructorsCount: number;
  totalCourses: number;
  publishedCoursesCount: number;
  pendingApprovalCount: number;
  totalEnrollments: number;
  totalAssets: number;
  transcodedAssetsCount: number;
  totalRevenue: number;
}

export interface PendingCourse {
  id: string;
  title: string;
  category: string;
  level: string;
  price: number;
  instructor: string;
  instructorEmail: string;
  lessonsCount: number;
  durationMinutes: number;
  createdAt: string;
}

export interface StorageReportItem {
  instructorId: string;
  name: string;
  email: string;
  assetCount: number;
  readyCount: number;
  rawStorageMB: number;
  hlsStorageMB: number;
  estimatedBandwidthGB: number;
  estimatedCostUSD: string;
}

export interface PayoutReportItem {
  instructorId: string;
  name: string;
  email: string;
  coursesCount: number;
  totalEnrollments: number;
  grossRevenue: string;
  platformFee: string;
  netPayout: string;
}

export interface TranscodeJobItem {
  id: string;
  lessonTitle: string;
  courseTitle: string;
  originalFileName: string;
  status: string;
  progress: number;
  errorMessage?: string | null;
  updatedAt: string;
}

export interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  role: string;
  createdAt: string;
  enrollmentsCount: number;
  coursesCount: number;
}

export async function fetchAdminMetrics(): Promise<PlatformMetrics> {
  const res = await get<{ success: boolean; data: PlatformMetrics }>("/admin/metrics");
  return res.data;
}

export async function fetchPendingCourses(): Promise<PendingCourse[]> {
  const res = await get<{ success: boolean; data: PendingCourse[] }>("/admin/courses/pending");
  return res.data;
}

export async function approveCourseApi(courseId: string) {
  return post<{ success: boolean; message: string }>(`/admin/courses/${courseId}/approve`);
}

export async function rejectCourseApi(courseId: string, feedback?: string) {
  return post<{ success: boolean; message: string }>(`/admin/courses/${courseId}/reject`, { feedback });
}

export async function fetchStorageReport(): Promise<StorageReportItem[]> {
  const res = await get<{ success: boolean; data: StorageReportItem[] }>("/admin/storage");
  return res.data;
}

export async function triggerGarbageCollectionApi() {
  return post<{ success: boolean; deletedCount: number; freedStorageMB: number; timestamp: string }>("/admin/storage/gc");
}

export async function fetchPayoutReport(): Promise<PayoutReportItem[]> {
  const res = await get<{ success: boolean; data: PayoutReportItem[] }>("/admin/payouts");
  return res.data;
}

export async function fetchTranscodeQueue(): Promise<TranscodeJobItem[]> {
  const res = await get<{ success: boolean; data: TranscodeJobItem[] }>("/admin/transcode-queue");
  return res.data;
}

export async function retryTranscodeJobApi(jobId: string) {
  return post<{ success: boolean; message: string }>(`/admin/transcode-queue/${jobId}/retry`);
}

export async function fetchAdminUsers(role?: string): Promise<AdminUserItem[]> {
  const query = role ? `?role=${encodeURIComponent(role)}` : "";
  const res = await get<{ success: boolean; data: AdminUserItem[] }>(`/admin/users${query}`);
  return res.data;
}

export async function updateUserRoleApi(userId: string, role: "STUDENT" | "INSTRUCTOR" | "ADMIN") {
  return patch<{ success: boolean; message: string }>(`/admin/users/${userId}/role`, { role });
}
