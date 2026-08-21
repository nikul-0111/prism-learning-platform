import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export const metadata = {
  title: "PRISM Admin Governance",
  description: "Administrative control panel for PRISM Learning Platform",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 pl-0 lg:pl-72">
        <AdminHeader />
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
