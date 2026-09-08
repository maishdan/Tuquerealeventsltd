import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardGuard } from "@/components/dashboard/DashboardGuard";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { adminNav } from "@/lib/dashboard-nav";
import { createPageSeo } from "@/lib/seo";

export const Route = createFileRoute("/admin/_layout")({
  head: () =>
    createPageSeo({
      title: "Royal Touch Events — CEO Admin Dashboard",
      description: "Executive CEO Dashboard for Royal Touch Events — Sales, CRM, Events, Finance and Operations.",
      path: "/admin",
      noindex: true,
    }),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <DashboardGuard requiredRole="admin">
      <DashboardLayout
        title="CEO Dashboard"
        subtitle="Royal Touch Executive Operations"
        nav={adminNav}
        role="admin"
      >
        <Outlet />
      </DashboardLayout>
    </DashboardGuard>
  );
}
