import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardGuard } from "@/components/dashboard/DashboardGuard";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  useAdminEvents,
  useAdminBookings,
  useAdminTickets,
  useAdminClients,
  useAdminProspects,
  formatKes,
} from "@/hooks/use-dashboard-data";
import { createPageSeo } from "@/lib/seo";
import { adminNav } from "@/lib/dashboard-nav";
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Users,
  Sparkles,
  ArrowUpRight,
  Globe,
  Clock,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/admin/")({
  head: () =>
    createPageSeo({
      title: "Executive CEO Command Center | TOQUE REAL EVENTS LIMITED",
      description: "Official Executive CEO Command Center for TOQUE REAL EVENTS LIMITED — Kenya's Top Event Agency.",
      path: "/admin",
      noindex: true,
    }),
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <DashboardGuard requiredRole="admin">
      <AdminDashboardContent />
    </DashboardGuard>
  );
}

function AdminDashboardContent() {
  const navigate = useNavigate();

  // Database Hooks
  const { data: bookings = [] } = useAdminBookings();
  const { data: events = [] } = useAdminEvents();
  const { data: clients = [] } = useAdminClients();
  const { data: tickets = [] } = useAdminTickets();
  const { data: prospects = [] } = useAdminProspects();

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Financial KPI calculations strictly from live database
  const totalRevenue = tickets.reduce((acc, t) => acc + (t.price || 0), 0);
  const salesPipelineAmount = bookings.reduce((acc, b) => {
    const numeric = typeof b.budget === "number" ? b.budget : parseInt(String(b.budget || 0).replace(/[^0-9]/g, "")) || 0;
    return acc + numeric;
  }, 0);

  return (
    <DashboardLayout
      title="TOQUE REAL EVENTS LIMITED ADMINISTRATOR"
      subtitle="Executive CEO Command Center"
      nav={adminNav}
      role="admin"
    >
      <div className="space-y-6 font-sans">
        {/* Toast Notification */}
        {toastMsg && (
          <div className="fixed top-6 right-6 z-[300] bg-[#12212d] border-2 border-[#f4cf69] text-white text-xs font-mono px-5 py-3 shadow-2xl animate-in slide-in-from-top duration-200 flex items-center gap-3">
            <Sparkles className="text-[#f4cf69] shrink-0" size={16} />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* GUIDANCE BANNER */}
        <div className="p-4 bg-gradient-to-r from-[#0d1d2c] via-[#091522] to-[#0d1d2c] border border-[#f4cf69]/40 rounded-xl shadow-xl flex items-center gap-3">
          <div className="p-2.5 bg-[#f4cf69]/10 border border-[#f4cf69]/30 rounded-lg text-[#f4cf69] shrink-0">
            <Sparkles size={18} />
          </div>
          <div className="space-y-0.5 text-xs">
            <div className="font-bold text-[#f4cf69] uppercase font-mono tracking-wider flex items-center gap-2">
              <span>💡 Executive Command Center Guide</span>
            </div>
            <p className="text-[#9ca8b6] font-medium leading-relaxed">
              Real-time platform oversight. All KPI metrics calculate dynamically from your live Supabase database with automatic responsive text fitting across mobile and desktop screens.
            </p>
          </div>
        </div>

        {/* KPI STATS ROW (4 RESPONSIVE FIT TILE CARDS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Ticket Revenue */}
          <button
            onClick={() => navigate({ to: "/admin/finance" })}
            className="p-5 bg-[#081522] border border-[#203348] hover:border-[#f4cf69] rounded-xl space-y-2 text-left transition-all cursor-pointer hover:scale-[1.02] shadow-xl overflow-hidden group"
          >
            <div className="flex justify-between items-center text-[#899cb0] group-hover:text-[#f4cf69]">
              <span className="text-[10px] font-black uppercase font-mono tracking-wider">Total Ticket Revenue</span>
              <DollarSign size={16} className="text-[#20e39b]" />
            </div>
            <p className="text-[#20e39b] font-mono font-black text-sm sm:text-base lg:text-lg truncate max-w-full" title={formatKes(totalRevenue)}>
              {formatKes(totalRevenue)}
            </p>
            <span className="text-[10px] text-emerald-400 font-mono block">Verified Database Sales</span>
          </button>

          {/* Card 2: Sales Pipeline */}
          <button
            onClick={() => navigate({ to: "/admin/bookings" })}
            className="p-5 bg-[#081522] border border-[#203348] hover:border-[#f4cf69] rounded-xl space-y-2 text-left transition-all cursor-pointer hover:scale-[1.02] shadow-xl overflow-hidden group"
          >
            <div className="flex justify-between items-center text-[#899cb0] group-hover:text-[#f4cf69]">
              <span className="text-[10px] font-black uppercase font-mono tracking-wider">Sales Pipeline</span>
              <TrendingUp size={16} className="text-[#f4cf69]" />
            </div>
            <p className="text-[#f4cf69] font-mono font-black text-sm sm:text-base lg:text-lg truncate max-w-full" title={formatKes(salesPipelineAmount)}>
              {formatKes(salesPipelineAmount)}
            </p>
            <span className="text-[10px] text-[#899cb0] font-mono block">Inbound Booking Orders ({bookings.length})</span>
          </button>

          {/* Card 3: Active Production Events */}
          <button
            onClick={() => navigate({ to: "/admin/events" })}
            className="p-5 bg-[#081522] border border-[#203348] hover:border-[#f4cf69] rounded-xl space-y-2 text-left transition-all cursor-pointer hover:scale-[1.02] shadow-xl overflow-hidden group"
          >
            <div className="flex justify-between items-center text-[#899cb0] group-hover:text-[#f4cf69]">
              <span className="text-[10px] font-black uppercase font-mono tracking-wider">Active Events</span>
              <Globe size={16} className="text-[#f4cf69]" />
            </div>
            <p className="text-white font-mono font-black text-sm sm:text-base lg:text-lg truncate max-w-full">
              {events.length} Events
            </p>
            <span className="text-[10px] text-[#899cb0] font-mono block">Published Events</span>
          </button>

          {/* Card 4: Registered Users */}
          <button
            onClick={() => navigate({ to: "/admin/users" })}
            className="p-5 bg-[#081522] border border-[#203348] hover:border-[#f4cf69] rounded-xl space-y-2 text-left transition-all cursor-pointer hover:scale-[1.02] shadow-xl overflow-hidden group"
          >
            <div className="flex justify-between items-center text-[#899cb0] group-hover:text-[#f4cf69]">
              <span className="text-[10px] font-black uppercase font-mono tracking-wider">Active Accounts</span>
              <Users size={16} className="text-[#20e39b]" />
            </div>
            <p className="text-white font-mono font-black text-sm sm:text-base lg:text-lg truncate max-w-full">
              {clients.length} Accounts
            </p>
            <span className="text-[10px] text-emerald-400 font-mono block">Registered Platform Users</span>
          </button>
        </div>

        {/* QUICK NAVIGATION GRID */}
        <div className="p-6 bg-[#09131d] border border-[#1b2c3d] rounded-xl space-y-4 shadow-2xl">
          <h3 className="text-sm font-black font-mono uppercase text-white tracking-wider flex items-center gap-2">
            <Zap size={16} className="text-[#f4cf69]" /> Quick Operations Navigation
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
            {[
              { label: "Leads Directory", path: "/admin/leads" },
              { label: "AI Studio v2", path: "/admin/ai" },
              { label: "Events Hub", path: "/admin/events" },
              { label: "Clients List", path: "/admin/users" },
              { label: "Sales & CRM", path: "/admin/bookings" },
              { label: "Finance", path: "/admin/finance" },
            ].map((navItem, idx) => (
              <button
                key={idx}
                onClick={() => navigate({ to: navItem.path as any })}
                className="p-3 bg-[#0c1e30] border border-[#203548] hover:border-[#f4cf69] text-[#f4cf69] text-white hover:text-[#f4cf69] rounded-lg transition-all text-left flex items-center justify-between font-bold cursor-pointer"
              >
                <span>{navItem.label}</span>
                <ArrowUpRight size={14} className="text-[#899cb0]" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
