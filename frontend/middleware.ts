import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const pathname = req.nextUrl.pathname;
  const isInstructorRoute = pathname.startsWith("/instructor");
  const isAdminRoute = pathname.startsWith("/admin");
  const isStudentDashboard = pathname === "/dashboard";

  // Require authentication for protected routes
  if ((isInstructorRoute || isAdminRoute || isStudentDashboard) && !isLoggedIn) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }

  // Server-Side Instant Role Routing:
  if (isLoggedIn && isStudentDashboard) {
    const userRole = req.auth?.user?.role?.toUpperCase();
    if (userRole === "ADMIN") {
      return Response.redirect(new URL("/admin", req.nextUrl));
    }
    if (userRole === "INSTRUCTOR") {
      return Response.redirect(new URL("/instructor/dashboard", req.nextUrl));
    }
  }

  // Protect Admin route from non-admins
  if (isLoggedIn && isAdminRoute) {
    const userRole = req.auth?.user?.role?.toUpperCase();
    if (userRole !== "ADMIN") {
      return Response.redirect(new URL("/dashboard", req.nextUrl));
    }
  }
});

export const config = {
  matcher: ["/admin/:path*", "/instructor/:path*", "/dashboard"],
};
