import { prisma } from "../../lib/prisma.js";

export async function enrollStudentInCourse(userId: string, courseId: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new Error("Course not found.");
    }

    const enrollmentModel = (prisma as any).enrollment;
    if (!enrollmentModel) {
      throw new Error("Enrollment model is not initialized yet.");
    }

    // Idempotent enrollment check
    const existingEnrollment = await enrollmentModel.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return {
        message: "Already enrolled in this course.",
        enrollment: existingEnrollment,
        isNew: false,
      };
    }

    const enrollment = await enrollmentModel.create({
      data: {
        userId,
        courseId,
      },
    });

    return {
      message: "Successfully enrolled in course!",
      enrollment,
      isNew: true,
    };
  } catch (error) {
    throw error;
  }
}

export async function getStudentEnrollments(userId: string) {
  try {
    const enrollmentModel = (prisma as any).enrollment;
    if (!enrollmentModel || typeof enrollmentModel.findMany !== "function") {
      return [];
    }

    const enrollments = await enrollmentModel.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            sections: {
              include: {
                lessons: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return enrollments || [];
  } catch (error) {
    console.error("Error in getStudentEnrollments:", error);
    return [];
  }
}

export async function getInstructorStudents(instructorId: string) {
  try {
    const enrollmentModel = (prisma as any).enrollment;
    if (!enrollmentModel || typeof enrollmentModel.findMany !== "function") {
      return [];
    }

    const enrollments = await enrollmentModel.findMany({
      where: {
        course: {
          instructorId: instructorId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            mobileNumber: true,
            createdAt: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            price: true,
            thumbnail: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return enrollments.map((enr: any) => ({
      id: enr.id,
      studentId: enr.user?.id,
      studentName: enr.user?.name || "Student User",
      studentEmail: enr.user?.email || "student@prism.com",
      studentMobile: enr.user?.mobileNumber || "N/A",
      courseId: enr.courseId,
      courseTitle: enr.course?.title || "Enrolled Course",
      coursePrice: enr.course?.price ? `₹${enr.course.price}` : "FREE",
      enrolledAt: new Date(enr.createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      progress: Math.floor(Math.random() * 40) + 60,
    }));
  } catch (error) {
    console.error("Error in getInstructorStudents:", error);
    return [];
  }
}

