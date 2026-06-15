import { createFileRoute, Link } from "@tanstack/react-router";
import { adminNav } from "@/lib/dashboard-nav";
import {
  DollarSign,
  CalendarDays,
  Users,
  TrendingUp,
  Wallet,
  Percent,
  FileSignature,
  BarChart3,
  Plus,
  Clock,
  ArrowRight,
  Car,
  Package,
  Eye,
  Search,
  MoreVertical,
  Activity,
  Truck,
  MessageSquare,
  ShieldCheck,
  TrendingDown,
  Target,
  Trophy,
  Zap,
  Heart,
  Briefcase,
  PartyPopper,
  Sparkles,
  Radio,
  CheckCircle2,
  LayoutDashboard,
  Globe
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import {
  ceoInsights,
  executiveKpis,
  financialHub,
  formatKes,
  formatPercent,
  topClients,
} from "@/lib/dashboard-mock-data";
import { useAdminBookings, useAdminClients, computeAdminKpis } from "@/hooks/use-dashboard-data";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import eventsLogo from "../../assets/events-logo.jpeg";
import { useState } from "react";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const { profile } = useAuth();
  const { data: bookings = [] } = useAdminBookings();
  const { data: clients = [] } = useAdminClients();
  const kpis = computeAdminKpis(bookings, clients);
  const [activeTab, setActiveTab] = useState("Overview");

  const today = new Date();
  const hours = today.getHours();
  let greeting = "EVENING";
  if (hours < 12) greeting = "MORNING";
  else if (hours < 17) greeting = "AFTERNOON";
  else if (hours < 21) greeting = "EVENING";
  else greeting = "NIGHT";

  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).toUpperCase();

  return (
    <div className="space-y-12 pb-24 font-sans text-white">
      {/* 1. EXECUTIVE HEADER (MATCHES FRONTEND BUSINESS STYLE) */}
      <section className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[#121212] p-10 md:p-16">
        <div className="absolute inset-0 bg-radial-indigo opacity-30" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden border-2 border-gold/30 shadow-2xl shadow-gold/10 shrink-0">
            <img src={eventsLogo} alt="Royal Touch Logo" className="h-full w-full object-cover" />
          </div>
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] font-black uppercase tracking-[0.3em]">
              <ShieldCheck size={12} /> Executive Session Active
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
              Good {greeting}, <span className="text-gold">Admin.</span>
            </h1>
            <p className="text-gray-400 text-sm font-black uppercase tracking-widest">
              Royal Touch Events Group — {dateString}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
             <Link to="/admin/events" className="h-12 px-8 rounded-xl bg-gold text-[#0b0e14] font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-white transition-all">
                <LayoutDashboard size={14} /> View Command Center
             </Link>
             <button className="h-12 px-8 rounded-xl border border-white/20 bg-white/5 text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-all">
                <Plus size={14} /> New Contract
             </button>
          </div>
        </div>
      </section>

      {/* 2. COMMAND HUB (TILED MENU) */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
           <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gold whitespace-nowrap">Empire Command Hub</h2>
           <div className="h-px w-full bg-white/5" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {adminNav.filter((item) => item.to !== "/admin").slice(0, 12).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex flex-col items-center justify-center gap-4 p-6 rounded-[24px] bg-white/[0.02] border border-white/5 hover:border-gold/30 hover:bg-white/5 transition-all duration-500 group relative overflow-hidden h-32"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20 group-hover:bg-gold group-hover:text-[#0b0e14] group-hover:border-gold transition-all duration-500 shadow-lg shadow-gold/5 relative z-10">
                <item.icon size={20} />
              </div>

              <div className="text-center relative z-10">
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors block">
                  {item.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. STRATEGIC METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Live Revenue", val: formatKes(kpis.todayRevenue), icon: Zap, trend: "+14%", color: "gold" },
          { label: "Monthly Gross", val: formatKes(kpis.monthlyRevenue), icon: Wallet, trend: "+18%", color: "blue" },
          { label: "Active Events", val: kpis.activeEvents, icon: CalendarDays, trend: "4 Live", color: "emerald" },
          { label: "Total Clients", val: kpis.totalClients, icon: Users, trend: "+6%", color: "purple" },
        ].map((stat, i) => (
          <div key={i} className="group p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-gold/30 transition-all duration-500">
             <div className="flex justify-between items-start mb-6">
                <div className={`h-12 w-12 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-500 border border-${stat.color}-500/20 group-hover:bg-gold group-hover:text-[#0b0e14] group-hover:border-gold transition-all duration-500`}>
                  <stat.icon size={24} />
                </div>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stat.trend} VS PREV</span>
             </div>
             <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-2">{stat.label}</p>
             <h3 className="text-3xl font-black text-white tracking-tight">{stat.val}</h3>
          </div>
        ))}
      </div>

      {/* 3. PERFORMANCE & ANALYTICS */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#121212] border border-white/10 rounded-[40px] overflow-hidden p-10 shadow-2xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
              <div className="space-y-2">
                <h4 className="text-white font-black text-2xl uppercase tracking-tighter">Revenue Trajectory</h4>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Real-time performance across all categories</p>
              </div>
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                <button className="px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest bg-gold text-[#0b0e14]">Weekly</button>
                <button className="px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Monthly</button>
              </div>
            </div>
            <div className="h-[360px] w-full">
              <RevenueChart data={financialHub.monthlyData} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
             {/* Category Distribution Tiles */}
             <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-10">
               <h4 className="text-white font-black text-xs uppercase tracking-[0.4em] mb-8">Discipline Allocation</h4>
               <div className="space-y-4">
                 {[
                   { name: 'Weddings', icon: Heart, count: 42, color: 'text-rose-400' },
                   { name: 'Corporate', icon: Briefcase, count: 28, color: 'text-blue-400' },
                   { name: 'Conferences', icon: MessageSquare, count: 12, color: 'text-emerald-400' },
                   { name: 'Concerts', icon: Zap, count: 8, color: 'text-amber-400' },
                   { name: 'VIP Parties', icon: PartyPopper, count: 35, color: 'text-purple-400' },
                 ].map((cat) => (
                   <div key={cat.name} className="flex items-center justify-between p-4 rounded-2xl border border-white/5 hover:bg-white/5 transition-all cursor-pointer group">
                     <div className="flex items-center gap-4">
                       <cat.icon size={18} className={cat.color} />
                       <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white">{cat.name}</span>
                     </div>
                     <span className="text-xs font-black text-white">{cat.count}</span>
                   </div>
                 ))}
               </div>
             </div>

             {/* Strategic Insights Tiles */}
             <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-10">
               <h4 className="text-white font-black text-xs uppercase tracking-[0.4em] mb-8">Strategic Intelligence</h4>
               <div className="space-y-6">
                  {([
                    ["Top Team", ceoInsights.topTeam, Trophy, "text-gold"],
                    ["Key Partner", ceoInsights.topClient, Globe, "text-blue-400"],
                    ["High Margin", ceoInsights.topEventType, BarChart3, "text-emerald-400"],
                    ["Growth Target", ceoInsights.growthOpportunity, Target, "text-amber-400"],
                  ] as const).map(([label, value, Icon, color]) => (
                   <div key={label} className="flex gap-5 group">
                     <div className={cn("shrink-0 h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-gold transition-colors", color)}>
                       <Icon size={18} />
                     </div>
                     <div>
                       <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-0.5">{label}</p>
                       <p className="text-xs text-white font-bold uppercase tracking-tight">{value}</p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        </div>

        {/* 4. SIDEBAR INTELLIGENCE (MATCHES SITE SIDEBARS) */}
        <div className="space-y-8">
          <div className="bg-[#1a2b4b]/20 border border-blue-500/20 rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Sparkles size={120} />
            </div>
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-3 text-blue-400">
                <Sparkles size={20} />
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em]">AI CEO Forecast</h4>
              </div>
              <div className="p-6 rounded-2xl bg-[#0b0e14]/60 backdrop-blur-md border border-white/5">
                <p className="text-[9px] text-blue-300 font-black uppercase tracking-widest mb-2">Projected Monthly Revenue</p>
                <h5 className="text-3xl font-black text-white tracking-tight">KSh 5,820,000</h5>
                <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                  <TrendingUp size={12} /> +12.5% Forecast
                </p>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Production Success", val: "94%", color: "emerald-500" },
                  { label: "High-Risk Alerts", val: "2", color: "rose-500" },
                  { label: "Pricing Analysis", val: "Optimal", color: "blue-500" },
                ].map((insight) => (
                  <div key={insight.label} className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{insight.label}</span>
                    <span className={cn("px-3 py-1 rounded-lg text-[10px] font-black text-white", `bg-${insight.color}`)}>{insight.val}</span>
                  </div>
                ))}
              </div>
              <button className="w-full h-14 rounded-full bg-blue-500 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:scale-[1.02] transition-all shadow-xl shadow-blue-500/10">
                Deep Analysis Report
              </button>
            </div>
          </div>

          <div className="bg-[#121212] border border-white/10 rounded-[40px] p-10 space-y-8">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.4em]">Operational Status</h4>
            <div className="space-y-6">
               {[
                 { label: "Fleet Tracking", val: "8/10 active", icon: Truck },
                 { label: "Mission Staff", val: "42 members", icon: Users },
                 { label: "Asset Readiness", val: "92% available", icon: Package },
                 { label: "Technical Status", val: "100% Uptime", icon: Zap },
               ].map((item) => (
                 <div key={item.label} className="flex items-center justify-between group">
                   <div className="flex items-center gap-4">
                     <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 border border-white/10 group-hover:border-gold transition-colors">
                       <item.icon size={18} />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.label}</span>
                   </div>
                   <span className="text-xs font-black text-white">{item.val}</span>
                 </div>
               ))}
            </div>
            <button className="w-full h-14 rounded-xl border border-white/10 bg-white/5 text-white font-black text-[10px] uppercase tracking-widest hover:bg-gold hover:text-black transition-all flex items-center justify-center gap-3">
              <Radio size={16} className="text-rose-500" /> Dispatch Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
