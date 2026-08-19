import type { Metadata } from "next";
import { AuthProvider } from "@/context/auth-context";
import { SessionProvider } from "@/components/providers/session-provider";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "PRISM Learning Platform",
  description: "Online learning platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
        <SessionProvider>
          <AuthProvider>
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}