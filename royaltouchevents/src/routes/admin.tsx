import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardGuard } from "@/components/dashboard/DashboardGuard";
import { AdminFloatingAIChatbot } from "@/components/dashboard/AdminFloatingAIChatbot";
import { createPageSeo } from "@/lib/seo";

export const Route = createFileRoute("/admin")({
  head: () =>
    createPageSeo({
      title: "TOQUE REAL EVENTS LIMITED — CEO Admin Dashboard",
      description: "Executive CEO Dashboard for TOQUE REAL EVENTS LIMITED — Sales, CRM, Events, Finance and Operations.",
      path: "/admin",
      noindex: true,
    }),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <DashboardGuard requiredRole="admin">
      <Outlet />
      {/* Floating Talking AI Assistant strictly for Admin Dashboard ONLY */}
      <AdminFloatingAIChatbot />
    </DashboardGuard>
  );
}
