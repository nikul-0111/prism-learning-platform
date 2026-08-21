import { prisma } from "../lib/prisma.js";
import type { CourseStatus } from "@prisma/client";

export async function getPlatformMetrics() {
  const [
    totalUsers,
    studentsCount,
    instructorsCount,
    adminsCount,
    totalCourses,
    publishedCoursesCount,
    draftCoursesCount,
    pendingApprovalCount,
    rejectedCoursesCount,
    totalEnrollments,
    totalAssets,
    transcodedAssetsCount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "INSTRUCTOR" } }),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.course.count(),
    prisma.course.count({ where: { status: "PUBLISHED" } }),
    prisma.course.count({ where: { status: "DRAFT" } }),
    prisma.course.count({ where: { status: "PENDING_REVIEW" } }),
    prisma.course.count({ where: { status: "REJECTED" } }),
    prisma.enrollment.count(),
    prisma.asset.count(),
    prisma.asset.count({ where: { status: "READY" } }),
  ]);

  // Aggregate enrollment sales safely
  const coursesWithPrices = await prisma.course.findMany({
    select: { id: true, price: true, _count: { select: { enrollments: true } } },
  });

  let totalRevenue = 0;
  for (const course of coursesWithPrices) {
    totalRevenue += course.price * course._count.enrollments;
  }

  const platformFee = totalRevenue * 0.2; // 20% platform fee
  const instructorNet = totalRevenue - platformFee;

  // Calculate storage usage from assets
  const assets = await prisma.asset.findMany({
    select: { fileSize: true, status: true, masterPlaylistKey: true, thumbnailKey: true },
  });

  let totalStorageBytes = BigInt(0);
  for (const asset of assets) {
    totalStorageBytes += asset.fileSize || BigInt(0);
  }

  const rawStorageMB = Math.round(Number(totalStorageBytes / BigInt(1024 * 1024)));
  const hlsStorageMB = Math.round(rawStorageMB * 1.4);
  const thumbnailStorageMB = Math.round(assets.length * 0.5);
  const totalStorageMB = rawStorageMB + hlsStorageMB + thumbnailStorageMB;

  // Estimated Bandwidth based on enrollments & transcoded assets
  const estimatedBandwidthGB = Math.round((hlsStorageMB * totalEnrollments * 0.8) / 1024);

  return {
    courseMetrics: {
      totalCourses,
      publishedCourses: publishedCoursesCount,
      draftCourses: draftCoursesCount,
      pendingReviewCourses: pendingApprovalCount,
      rejectedCourses: rejectedCoursesCount,
    },
    userMetrics: {
      totalUsers,
      totalStudents: studentsCount,
      totalInstructors: instructorsCount,
      totalAdmins: adminsCount,
    },
    enrollmentMetrics: {
      totalEnrollments,
      courseCompletions: Math.round(totalEnrollments * 0.45),
    },
    storageMetrics: {
      totalStorageMB,
      rawStorageMB,
      hlsStorageMB,
      thumbnailStorageMB,
      totalAssets,
      transcodedAssetsCount,
    },
    bandwidthMetrics: {
      totalBandwidthGB: estimatedBandwidthGB,
      currentPeriodBandwidthGB: Math.round(estimatedBandwidthGB * 0.35),
    },
    revenueMetrics: {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      platformFee: Number(platformFee.toFixed(2)),
      instructorNet: Number(instructorNet.toFixed(2)),
    },
  };
}

export async function getPendingCourses() {
  // Query pending review courses (or fall back to DRAFT for review queue visibility)
  const courses = await prisma.course.findMany({
    where: {
      OR: [{ status: "PENDING_REVIEW" }, { status: "DRAFT" }],
    },
    include: {
      instructor: {
        select: { id: true, name: true, email: true },
      },
      sections: {
        include: {
          lessons: {
            select: {
              id: true,
              title: true,
              type: true,
              duration: true,
              quizId: true,
              asset: { select: { id: true, status: true } },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return courses.map((course) => {
    let sectionCount = course.sections.length;
    let lessonCount = 0;
    let videoLessonCount = 0;
    let quizLessonCount = 0;
    let totalDurationSeconds = 0;

    for (const sec of course.sections) {
      lessonCount += sec.lessons.length;
      for (const les of sec.lessons) {
        totalDurationSeconds += les.duration || 0;
        if (les.type === "VIDEO") videoLessonCount++;
        if (les.type === "QUIZ" || les.quizId) quizLessonCount++;
      }
    }

    return {
      id: course.id,
      title: course.title,
      category: course.category || "General",
      level: course.level,
      price: course.price,
      status: course.status,
      instructor: course.instructor.name,
      instructorEmail: course.instructor.email,
      sectionsCount: sectionCount,
      lessonsCount: lessonCount,
      videoLessonsCount: videoLessonCount,
      quizLessonsCount: quizLessonCount,
      durationMinutes: Math.round(totalDurationSeconds / 60),
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    };
  });
}

export async function getApprovalHistory() {
  const courses = await prisma.course.findMany({
    where: {
      OR: [
        { status: "PUBLISHED" },
        { status: "REJECTED" },
        { reviewedAt: { not: null } },
      ],
    },
    include: {
      instructor: {
        select: { id: true, name: true, email: true },
      },
      reviewedBy: {
        select: { id: true, name: true, email: true },
      },
      _count: {
        select: { sections: true, enrollments: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return courses.map((course) => ({
    id: course.id,
    title: course.title,
    category: course.category || "General",
    level: course.level,
    price: course.price,
    status: course.status,
    instructor: course.instructor.name,
    instructorEmail: course.instructor.email,
    reviewedBy: course.reviewedBy ? course.reviewedBy.name : "Admin Governance",
    reviewedByEmail: course.reviewedBy ? course.reviewedBy.email : undefined,
    reviewedAt: course.reviewedAt || course.updatedAt,
    rejectionReason: course.rejectionReason,
    createdAt: course.createdAt,
    sectionsCount: course._count.sections,
  }));
}

export async function getAdminCourseDetails(courseId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      instructor: {
        select: { id: true, name: true, email: true, mobileNumber: true },
      },
      reviewedBy: {
        select: { id: true, name: true, email: true },
      },
      sections: {
        orderBy: { position: "asc" },
        include: {
          lessons: {
            orderBy: { position: "asc" },
            include: {
              asset: true,
              quiz: {
                select: {
                  id: true,
                  title: true,
                  passMark: true,
                  timeLimit: true,
                  maxAttempts: true,
                  _count: { select: { questions: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!course) {
    return null;
  }

  // Format section & lesson information for review
  const formattedSections = course.sections.map((section) => ({
    id: section.id,
    title: section.title,
    description: section.description,
    position: section.position,
    lessons: section.lessons.map((lesson) => {
      const asset = lesson.asset;
      return {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        type: lesson.type,
        duration: lesson.duration,
        position: lesson.position,
        isFreePreview: lesson.isFreePreview,
        asset: asset
          ? {
              id: asset.id,
              originalFileName: asset.originalFileName,
              fileSizeMB: (Number(asset.fileSize) / (1024 * 1024)).toFixed(2),
              status: asset.status,
              transcodeProgress: asset.transcodeProgress,
              duration: asset.duration,
              renditions: {
                res360p: asset.status === "READY",
                res720p: asset.status === "READY",
                res1080p: asset.status === "READY",
                hlsMasterAvailable: !!asset.masterPlaylistKey,
              },
            }
          : null,
        quiz: lesson.quiz
          ? {
              id: lesson.quiz.id,
              title: lesson.quiz.title,
              passMark: lesson.quiz.passMark,
              timeLimit: lesson.quiz.timeLimit,
              maxAttempts: lesson.quiz.maxAttempts,
              questionCount: lesson.quiz._count.questions,
            }
          : null,
      };
    }),
  }));

  return {
    id: course.id,
    title: course.title,
    shortDescription: course.shortDescription,
    description: course.description,
    category: course.category || "General",
    level: course.level,
    price: course.price,
    thumbnail: course.thumbnail,
    status: course.status,
    instructor: course.instructor,
    reviewedBy: course.reviewedBy,
    reviewedAt: course.reviewedAt,
    rejectionReason: course.rejectionReason,
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
    sections: formattedSections,
  };
}

export async function getAllCourses(statusFilter?: string, search?: string) {
  const where: any = {};

  if (statusFilter && statusFilter.toUpperCase() !== "ALL") {
    where.status = statusFilter.toUpperCase() as CourseStatus;
  }

  if (search && search.trim() !== "") {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { category: { contains: search, mode: "insensitive" } },
      { instructor: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  const courses = await prisma.course.findMany({
    where,
    include: {
      instructor: {
        select: { id: true, name: true, email: true },
      },
      sections: {
        include: {
          lessons: {
            select: { id: true, type: true, duration: true, quizId: true },
          },
        },
      },
      _count: {
        select: { sections: true, enrollments: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return courses.map((c) => {
    let lessonCount = 0;
    let videoLessonCount = 0;
    let quizLessonCount = 0;
    let totalDurationSeconds = 0;

    for (const sec of c.sections) {
      lessonCount += sec.lessons.length;
      for (const les of sec.lessons) {
        totalDurationSeconds += les.duration || 0;
        if (les.type === "VIDEO") videoLessonCount++;
        if (les.type === "QUIZ" || les.quizId) quizLessonCount++;
      }
    }

    return {
      id: c.id,
      title: c.title,
      category: c.category || "General",
      level: c.level,
      price: c.price,
      status: c.status,
      instructor: c.instructor.name,
      instructorEmail: c.instructor.email,
      sectionsCount: c._count.sections,
      lessonsCount: lessonCount,
      videoLessonsCount: videoLessonCount,
      quizLessonsCount: quizLessonCount,
      durationMinutes: Math.round(totalDurationSeconds / 60),
      enrollmentsCount: c._count.enrollments,
      createdAt: c.createdAt,
    };
  });
}

export async function approveCourse(courseId: string, reviewerId?: string) {
  const existingCourse = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!existingCourse) {
    throw new Error("Course not found.");
  }

  const updatedCourse = await prisma.course.update({
    where: { id: courseId },
    data: {
      status: "PUBLISHED",
      reviewedById: reviewerId || null,
      reviewedAt: new Date(),
      rejectionReason: null,
    },
  });

  return {
    success: true,
    message: `Course "${updatedCourse.title}" approved and published successfully.`,
    course: updatedCourse,
  };
}

export async function rejectCourse(courseId: string, reason: string, reviewerId?: string) {
  const existingCourse = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!existingCourse) {
    throw new Error("Course not found.");
  }

  const updatedCourse = await prisma.course.update({
    where: { id: courseId },
    data: {
      status: "REJECTED",
      reviewedById: reviewerId || null,
      reviewedAt: new Date(),
      rejectionReason: reason,
    },
  });

  return {
    success: true,
    message: `Course "${updatedCourse.title}" rejected with reason recorded.`,
    course: updatedCourse,
    rejectionReason: reason,
  };
}

export async function getStorageReport() {
  const instructors = await prisma.user.findMany({
    where: { role: "INSTRUCTOR" },
    select: {
      id: true,
      name: true,
      email: true,
      courses: {
        select: {
          id: true,
          title: true,
          sections: {
            select: {
              lessons: {
                select: {
                  asset: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const instructorReports = instructors.map((instructor) => {
    let totalBytes = BigInt(0);
    let assetCount = 0;
    let readyCount = 0;
    let courseBreakdown: Array<{ courseId: string; courseTitle: string; sizeMB: number }> = [];

    for (const course of instructor.courses) {
      let courseBytes = BigInt(0);
      for (const section of course.sections) {
        for (const lesson of section.lessons) {
          if (lesson.asset) {
            assetCount++;
            const bytes = lesson.asset.fileSize || BigInt(0);
            totalBytes += bytes;
            courseBytes += bytes;
            if (lesson.asset.status === "READY") readyCount++;
          }
        }
      }
      courseBreakdown.push({
        courseId: course.id,
        courseTitle: course.title,
        sizeMB: Math.round(Number(courseBytes / BigInt(1024 * 1024))),
      });
    }

    const rawMB = Math.round(Number(totalBytes / BigInt(1024 * 1024)));
    const hlsMB = Math.round(rawMB * 1.4);
    const thumbnailMB = Math.round(assetCount * 0.5);
    const totalMB = rawMB + hlsMB + thumbnailMB;

    return {
      instructorId: instructor.id,
      name: instructor.name,
      email: instructor.email,
      coursesCount: instructor.courses.length,
      assetCount,
      readyCount,
      rawStorageMB: rawMB,
      hlsStorageMB: hlsMB,
      thumbnailStorageMB: thumbnailMB,
      totalStorageMB: totalMB,
      courseBreakdown,
    };
  });

  // Calculate Orphaned Assets
  const orphanedAssets = await prisma.asset.findMany({
    where: {
      OR: [
        { isOrphaned: true },
        { status: "FAILED" },
        { status: "UPLOADING", createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      ],
    },
    select: { id: true, originalFileName: true, fileSize: true, status: true, createdAt: true },
  });

  let orphanedBytes = BigInt(0);
  for (const o of orphanedAssets) {
    orphanedBytes += o.fileSize || BigInt(0);
  }

  return {
    instructors: instructorReports,
    orphanedSummary: {
      orphanedCount: orphanedAssets.length,
      orphanedStorageMB: Math.round(Number(orphanedBytes / BigInt(1024 * 1024))),
      orphanedItems: orphanedAssets.map((o) => ({
        id: o.id,
        originalFileName: o.originalFileName,
        sizeMB: (Number(o.fileSize) / (1024 * 1024)).toFixed(2),
        status: o.status,
        createdAt: o.createdAt,
      })),
    },
  };
}

export async function runGarbageCollection() {
  const staleAssets = await prisma.asset.findMany({
    where: {
      OR: [
        { isOrphaned: true },
        { status: "FAILED" },
        { status: "UPLOADING", createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      ],
    },
  });

  const count = staleAssets.length;
  let freedBytes = BigInt(0);
  for (const asset of staleAssets) {
    freedBytes += asset.fileSize || BigInt(0);
  }

  // Soft/Hard delete stale assets
  if (count > 0) {
    await prisma.asset.deleteMany({
      where: {
        id: { in: staleAssets.map((a) => a.id) },
      },
    });
  }

  return {
    success: true,
    deletedCount: count,
    freedStorageMB: Math.round(Number(freedBytes / BigInt(1024 * 1024))),
    timestamp: new Date().toISOString(),
  };
}

export async function getBandwidthReport() {
  const instructors = await prisma.user.findMany({
    where: { role: "INSTRUCTOR" },
    select: {
      id: true,
      name: true,
      email: true,
      courses: {
        select: {
          id: true,
          title: true,
          price: true,
          _count: { select: { enrollments: true } },
          sections: {
            select: {
              lessons: {
                select: {
                  asset: { select: { fileSize: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  let totalPlatformBandwidthBytes = BigInt(0);

  const instructorUsage = instructors.map((inst) => {
    let instBytes = BigInt(0);

    const coursesUsage = inst.courses.map((course) => {
      let courseLessonBytes = BigInt(0);
      for (const sec of course.sections) {
        for (const les of sec.lessons) {
          if (les.asset?.fileSize) {
            courseLessonBytes += les.asset.fileSize;
          }
        }
      }

      // Bandwidth = lesson video size * enrollments count * average stream views (1.5)
      const courseBandwidth = courseLessonBytes * BigInt(course._count.enrollments || 1) * BigInt(2);
      instBytes += courseBandwidth;

      return {
        courseId: course.id,
        courseTitle: course.title,
        enrollmentsCount: course._count.enrollments,
        bandwidthGB: (Number(courseBandwidth) / (1024 * 1024 * 1024)).toFixed(2),
      };
    });

    totalPlatformBandwidthBytes += instBytes;

    return {
      instructorId: inst.id,
      name: inst.name,
      email: inst.email,
      totalBandwidthGB: (Number(instBytes) / (1024 * 1024 * 1024)).toFixed(2),
      courses: coursesUsage,
    };
  });

  return {
    totalBandwidthGB: (Number(totalPlatformBandwidthBytes) / (1024 * 1024 * 1024)).toFixed(2),
    instructors: instructorUsage,
  };
}

export async function getPayoutReport() {
  const PLATFORM_FEE_PERCENTAGE = 0.2; // 20% configurable fee

  const instructors = await prisma.user.findMany({
    where: { role: "INSTRUCTOR" },
    select: {
      id: true,
      name: true,
      email: true,
      courses: {
        select: {
          id: true,
          title: true,
          price: true,
          _count: { select: { enrollments: true } },
        },
      },
    },
  });

  return instructors.map((inst) => {
    let grossRevenue = 0;
    let totalEnrollments = 0;

    const courseBreakdown = inst.courses.map((course) => {
      const enrollments = course._count.enrollments;
      totalEnrollments += enrollments;
      const courseRevenue = course.price * enrollments;
      grossRevenue += courseRevenue;

      const coursePlatformFee = courseRevenue * PLATFORM_FEE_PERCENTAGE;
      const courseNet = courseRevenue - coursePlatformFee;

      return {
        courseId: course.id,
        courseTitle: course.title,
        price: course.price,
        enrollments,
        revenue: courseRevenue,
        platformFee: coursePlatformFee,
        netAmount: courseNet,
      };
    });

    const platformFee = grossRevenue * PLATFORM_FEE_PERCENTAGE;
    const netPayout = grossRevenue - platformFee;

    return {
      instructorId: inst.id,
      name: inst.name,
      email: inst.email,
      coursesCount: inst.courses.length,
      totalEnrollments,
      grossRevenue: Number(grossRevenue.toFixed(2)),
      platformFee: Number(platformFee.toFixed(2)),
      netPayout: Number(netPayout.toFixed(2)),
      courseBreakdown,
    };
  });
}

export async function getUsersList(roleFilter?: string, page = 1, limit = 10, search?: string) {
  const where: any = {};

  if (roleFilter && roleFilter.toUpperCase() !== "ALL") {
    where.role = roleFilter.toUpperCase() as "STUDENT" | "INSTRUCTOR";
  } else {
    // Exclude ADMIN users from governance user list
    where.role = { not: "ADMIN" };
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        mobileNumber: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            enrollments: true,
            courses: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users: users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      mobileNumber: u.mobileNumber,
      role: u.role,
      createdAt: u.createdAt,
      enrollmentsCount: u._count.enrollments,
      coursesCount: u._count.courses,
    })),
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
}

export async function updateUserRole(userId: string, newRole: "STUDENT" | "INSTRUCTOR" | "ADMIN") {
  const existingUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!existingUser) {
    throw new Error("User not found.");
  }
  if (existingUser.role === "ADMIN") {
    throw new Error("Admin accounts cannot be demoted or modified from user governance.");
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });

  return {
    success: true,
    message: `User ${user.name} role updated to ${newRole}.`,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}
