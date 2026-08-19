import express from "express";
import cors from "cors";
import path from "path";

import courseRoutes from "./modules/courses/course.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import sectionRoutes from "./modules/sections/section.routes.js";
import lessonRoutes from "./modules/lessons/lesson.routes.js";
import quizRoutes from "./modules/quizzes/quiz.routes.js";
import videoRoutes from "./modules/video/video.routes.js";
import enrollmentRoutes from "./modules/enrollments/enrollment.routes.js";
import paymentRoutes from "./modules/payments/payment.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve local static uploaded videos directory
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Authentication & Admin
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// Courses, Enrollments & Payments
app.use("/api/courses", courseRoutes);
app.use("/api", enrollmentRoutes);
app.use("/api", paymentRoutes);

// Instructor Routes (Sections, Lessons, Quizzes)
app.use("/api/instructor", sectionRoutes);
app.use("/api/instructor", lessonRoutes);
app.use("/api/instructor", quizRoutes);

// Video Upload, Status & Playback Routes
app.use("/api", videoRoutes);
app.use("/api", quizRoutes);

// Error handler MUST be after routes
app.use(errorMiddleware);

export default app;