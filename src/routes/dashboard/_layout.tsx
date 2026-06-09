import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardGuard } from "@/components/dashboard/DashboardGuard";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { customerNav } from "@/lib/dashboard-nav";
import { createPageSeo } from "@/lib/seo";

export const Route = createFileRoute("/dashboard/_layout")({
  head: () =>
    createPageSeo({
      title: "Client Dashboard",
      description: "Manage your Royal Touch Events bookings, events and messages.",
      path: "/dashboard",
      noindex: true,
    }),
  component: CustomerLayout,
});

function CustomerLayout() {
  return (
    <DashboardGuard>
      <DashboardLayout
        title="Royal Touch Events"
        subtitle="Client Portal"
        nav={customerNav}
        role="customer"
      >
        <Outlet />
      </DashboardLayout>
    </DashboardGuard>
  );
}
