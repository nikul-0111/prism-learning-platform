import { get, post, patch } from "./client";

export interface PlatformMetrics {
  courseMetrics: {
    totalCourses: number;
    publishedCourses: number;
    draftCourses: number;
    pendingReviewCourses: number;
    rejectedCourses: number;
  };
  userMetrics: {
    totalUsers: number;
    totalStudents: number;
    totalInstructors: number;
    totalAdmins: number;
  };
  enrollmentMetrics: {
    totalEnrollments: number;
    courseCompletions: number;
  };
  storageMetrics: {
    totalStorageMB: number;
    rawStorageMB: number;
    hlsStorageMB: number;
    thumbnailStorageMB: number;
    totalAssets: number;
    transcodedAssetsCount: number;
  };
  bandwidthMetrics: {
    totalBandwidthGB: number;
    currentPeriodBandwidthGB: number;
  };
  revenueMetrics: {
    totalRevenue: number;
    platformFee: number;
    instructorNet: number;
  };
}

export interface PendingCourseItem {
  id: string;
  title: string;
  category: string;
  level: string;
  price: number;
  status: string;
  instructor: string;
  instructorEmail: string;
  sectionsCount: number;
  lessonsCount: number;
  videoLessonsCount: number;
  quizLessonsCount: number;
  durationMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalHistoryItem {
  id: string;
  title: string;
  category: string;
  level: string;
  price: number;
  status: string;
  instructor: string;
  instructorEmail: string;
  reviewedBy: string;
  reviewedByEmail?: string;
  reviewedAt: string;
  rejectionReason?: string | null;
  createdAt: string;
  sectionsCount: number;
}

export interface CourseDetailItem {
  id: string;
  title: string;
  shortDescription?: string;
  description: string;
  category: string;
  level: string;
  price: number;
  thumbnail?: string;
  status: string;
  instructor: {
    id: string;
    name: string;
    email: string;
    mobileNumber?: string;
  };
  reviewedBy?: {
    id: string;
    name: string;
    email: string;
  } | null;
  reviewedAt?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
  sections: Array<{
    id: string;
    title: string;
    description?: string;
    position: number;
    lessons: Array<{
      id: string;
      title: string;
      description?: string;
      type: string;
      duration: number;
      position: number;
      isFreePreview: boolean;
      asset?: {
        id: string;
        originalFileName: string;
        fileSizeMB: string;
        status: string;
        transcodeProgress: number;
        duration?: number;
        renditions: {
          res360p: boolean;
          res720p: boolean;
          res1080p: boolean;
          hlsMasterAvailable: boolean;
        };
      } | null;
      quiz?: {
        id: string;
        title: string;
        passMark: number;
        timeLimit?: number;
        maxAttempts: number;
        questionCount: number;
      } | null;
    }>;
  }>;
}

export interface StorageReport {
  instructors: Array<{
    instructorId: string;
    name: string;
    email: string;
    coursesCount: number;
    assetCount: number;
    readyCount: number;
    rawStorageMB: number;
    hlsStorageMB: number;
    thumbnailStorageMB: number;
    totalStorageMB: number;
    courseBreakdown: Array<{
      courseId: string;
      courseTitle: string;
      sizeMB: number;
    }>;
  }>;
  orphanedSummary: {
    orphanedCount: number;
    orphanedStorageMB: number;
    orphanedItems: Array<{
      id: string;
      originalFileName: string;
      sizeMB: string;
      status: string;
      createdAt: string;
    }>;
  };
}

export interface BandwidthReport {
  totalBandwidthGB: string;
  instructors: Array<{
    instructorId: string;
    name: string;
    email: string;
    totalBandwidthGB: string;
    courses: Array<{
      courseId: string;
      courseTitle: string;
      enrollmentsCount: number;
      bandwidthGB: string;
    }>;
  }>;
}

export interface PayoutReportItem {
  instructorId: string;
  name: string;
  email: string;
  coursesCount: number;
  totalEnrollments: number;
  grossRevenue: number;
  platformFee: number;
  netPayout: number;
  courseBreakdown: Array<{
    courseId: string;
    courseTitle: string;
    price: number;
    enrollments: number;
    revenue: number;
    platformFee: number;
    netAmount: number;
  }>;
}

export interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  createdAt: string;
  enrollmentsCount: number;
  coursesCount: number;
}

export interface AdminUsersResponse {
  users: AdminUserItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Client API Methods
export async function getAdminMetrics(): Promise<PlatformMetrics> {
  const res = await get<{ success: boolean; data: PlatformMetrics }>("/admin/metrics");
  return res.data;
}

export async function getPendingCourses(): Promise<PendingCourseItem[]> {
  const res = await get<{ success: boolean; data: PendingCourseItem[] }>("/admin/courses/pending");
  return res.data;
}

export async function getApprovalHistory(): Promise<ApprovalHistoryItem[]> {
  const res = await get<{ success: boolean; data: ApprovalHistoryItem[] }>("/admin/courses/history");
  return res.data;
}

export async function getAllAdminCourses(status?: string, search?: string): Promise<PendingCourseItem[]> {
  const params = new URLSearchParams();
  if (status && status.toUpperCase() !== "ALL") params.append("status", status);
  if (search && search.trim() !== "") params.append("search", search.trim());
  const queryString = params.toString();
  const endpoint = queryString ? `/admin/courses?${queryString}` : "/admin/courses";
  const res = await get<{ success: boolean; data: PendingCourseItem[] }>(endpoint);
  return res.data;
}

export async function getAdminCourseDetails(courseId: string): Promise<CourseDetailItem> {
  const res = await get<{ success: boolean; data: CourseDetailItem }>(`/admin/courses/${courseId}`);
  return res.data;
}

export async function approveCourse(courseId: string): Promise<{ success: boolean; message: string }> {
  return await post<{ success: boolean; message: string }>(`/admin/courses/${courseId}/approve`);
}

export async function rejectCourse(courseId: string, reason: string): Promise<{ success: boolean; message: string }> {
  return await post<{ success: boolean; message: string }>(`/admin/courses/${courseId}/reject`, { reason });
}

export async function getStorageReport(): Promise<StorageReport> {
  const res = await get<{ success: boolean; data: StorageReport }>("/admin/storage");
  return res.data;
}

export async function runGarbageCollection(): Promise<{ success: boolean; deletedCount: number; freedStorageMB: number }> {
  return await post<{ success: boolean; deletedCount: number; freedStorageMB: number }>("/admin/storage/gc");
}

export async function getBandwidthReport(): Promise<BandwidthReport> {
  const res = await get<{ success: boolean; data: BandwidthReport }>("/admin/usage");
  return res.data;
}

export async function getPayoutReport(): Promise<PayoutReportItem[]> {
  const res = await get<{ success: boolean; data: PayoutReportItem[] }>("/admin/payouts");
  return res.data;
}

export async function getAdminUsers(page = 1, limit = 10, role?: string, search?: string): Promise<AdminUsersResponse> {
  let url = `/admin/users?page=${page}&limit=${limit}`;
  if (role) url += `&role=${role}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  const res = await get<{ success: boolean; data: AdminUsersResponse }>(url);
  return res.data;
}

export async function updateUserRole(userId: string, role: "STUDENT" | "INSTRUCTOR" | "ADMIN"): Promise<{ success: boolean; message: string }> {
  return await patch<{ success: boolean; message: string }>(`/admin/users/${userId}/role`, { role });
}
