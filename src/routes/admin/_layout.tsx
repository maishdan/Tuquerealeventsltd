import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardGuard } from "@/components/dashboard/DashboardGuard";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { adminNav } from "@/lib/dashboard-nav";
import { createPageSeo } from "@/lib/seo";

export const Route = createFileRoute("/admin/_layout")({
  head: () =>
    createPageSeo({
      title: "Admin Dashboard",
      description: "Royal Touch Events executive dashboard — revenue, operations, events and AI insights.",
      path: "/admin",
      noindex: true,
    }),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <DashboardGuard requiredRole="admin">
      <DashboardLayout
        title="Empire Operations"
        subtitle="Executive Dashboard"
        nav={adminNav}
        role="admin"
      >
        <Outlet />
      </DashboardLayout>
    </DashboardGuard>
  );
}
