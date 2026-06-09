import { createFileRoute } from "@tanstack/react-router";
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
  let greeting = "Evening";
  if (hours < 12) greeting = "Morning";
  else if (hours < 17) greeting = "Afternoon";
  else if (hours < 21) greeting = "Evening";
  else greeting = "Night";

  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Profile Section */}
      <div className="flex items-center gap-4 mb-8">
        <div className="h-16 w-16 rounded-full overflow-hidden ring-4 ring-white/5 shadow-2xl">
          <img src={eventsLogo} alt="Profile" className="h-full w-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded bg-gold/10 border border-gold/20 text-gold text-[10px] font-bold uppercase tracking-widest mb-1.5">
            <ShieldCheck size={10} /> CEO Session Active
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Good {greeting} ROYAL TOUCH EVENTS
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Admin — {dateString}
          </p>
        </div>
        <div className="hidden lg:flex gap-2">
          <button className="flex items-center gap-2 bg-[#1a2b4b] hover:bg-[#253d6b] text-white px-4 py-2 rounded-md text-sm font-medium transition shadow-sm border border-white/5">
            <Target size={16} /> Market Share
          </button>
          <button className="flex items-center gap-2 bg-[#0061f2] hover:bg-[#0052cc] text-white px-4 py-2 rounded-md text-sm font-medium transition shadow-sm">
            <Plus size={16} /> New Contract
          </button>
        </div>
      </div>

      {/* Option 5: Executive Overview Section */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">Executive Overview</h3>
        <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-md">
          {["Overview", "Investor", "AI Insights"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={cn(
                "px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all",
                activeTab === t ? "bg-white/10 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Revenue Card */}
        <div className="bg-[#0f172a] border border-white/5 rounded-xl p-5 relative overflow-hidden group cursor-pointer hover:border-gold/30 transition-all">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-1">Live Revenue</p>
              <h4 className="text-2xl font-bold text-white font-display tracking-tight">{formatKes(kpis.todayRevenue)}</h4>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp size={12} className="text-emerald-500" />
                <span className="text-[10px] text-emerald-500 font-bold">+14% vs yesterday</span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center border border-gold/20">
              <Zap size={20} className="text-gold" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-[10px] text-gray-500 font-medium">Daily transaction volume is peaking</p>
          </div>
        </div>

        {/* Monthly Revenue Card */}
        <div className="bg-[#0f172a] border border-white/5 rounded-xl p-5 relative overflow-hidden group cursor-pointer hover:border-blue-500/30 transition-all">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-1">Monthly Gross</p>
              <h4 className="text-2xl font-bold text-white font-display tracking-tight">{formatKes(kpis.monthlyRevenue)}</h4>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp size={12} className="text-blue-400" />
                <span className="text-[10px] text-blue-400 font-bold">+18% vs last month</span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Wallet size={20} className="text-blue-400" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-[10px] text-gray-500 font-medium">Targeting 10M milestone this month</p>
          </div>
        </div>

        {/* Active Events Card */}
        <div className="bg-[#0f172a] border border-white/5 rounded-xl p-5 relative overflow-hidden group cursor-pointer hover:border-emerald-500/30 transition-all">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-1">Active Events</p>
              <h4 className="text-2xl font-bold text-white font-display tracking-tight">{kpis.activeEvents}</h4>
              <div className="flex items-center gap-1 mt-2">
                <Activity size={12} className="text-emerald-400" />
                <span className="text-[10px] text-emerald-400 font-bold">4 Live Now</span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <CalendarDays size={20} className="text-emerald-400" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-[10px] text-gray-500 font-medium">Ops team at 85% capacity</p>
          </div>
        </div>

        {/* Total Clients Card */}
        <div className="bg-[#0f172a] border border-white/5 rounded-xl p-5 relative overflow-hidden group cursor-pointer hover:border-purple-500/30 transition-all">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[10px] font-bold text-purple-400 uppercase tracking-[0.2em] mb-1">Total Clients</p>
              <h4 className="text-2xl font-bold text-white font-display tracking-tight">{kpis.totalClients}</h4>
              <div className="flex items-center gap-1 mt-2">
                <Users size={12} className="text-purple-400" />
                <span className="text-[10px] text-purple-400 font-bold">+6% growth</span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <Trophy size={20} className="text-purple-400" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-[10px] text-gray-500 font-medium">CLV up by 12.5% this quarter</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Analytics Chart Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0b0e14] border border-white/5 rounded-2xl overflow-hidden p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h4 className="text-white font-bold text-lg">Revenue Growth Chart</h4>
                <p className="text-gray-500 text-xs">Real-time performance across all categories</p>
              </div>
              <div className="flex gap-2">
                <button className="bg-white/5 text-white px-3 py-1 rounded text-xs border border-white/5">Daily</button>
                <button className="bg-white/10 text-white px-3 py-1 rounded text-xs border border-white/10">Weekly</button>
              </div>
            </div>
            <div className="h-[320px] w-full">
              <RevenueChart data={financialHub.monthlyData} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
             {/* Event Categories List */}
             <div className="bg-[#0b0e14] border border-white/5 rounded-2xl p-5">
               <h4 className="text-white font-bold text-sm mb-4">Event Categories Distribution</h4>
               <div className="space-y-3">
                 {[
                   { name: 'Weddings', icon: Heart, count: 42, color: 'text-rose-400' },
                   { name: 'Corporate Events', icon: Briefcase, count: 28, color: 'text-blue-400' },
                   { name: 'Conferences', icon: MessageSquare, count: 12, color: 'text-emerald-400' },
                   { name: 'Concerts', icon: Zap, count: 8, color: 'text-amber-400' },
                   { name: 'Private Parties', icon: PartyPopper, count: 35, color: 'text-purple-400' },
                 ].map((cat) => (
                   <div key={cat.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                     <div className="flex items-center gap-3">
                       <cat.icon size={16} className={cat.color} />
                       <span className="text-sm text-gray-300 group-hover:text-white">{cat.name}</span>
                     </div>
                     <span className="text-xs font-bold text-white">{cat.count}</span>
                   </div>
                 ))}
               </div>
             </div>

             {/* CEO Insights */}
             <div className="bg-[#0b0e14] border border-white/5 rounded-2xl p-5">
               <h4 className="text-white font-bold text-sm mb-4">CEO Strategic Insights</h4>
               <div className="space-y-4">
                 {[
                   ["Top Performing Team", ceoInsights.topTeam, Trophy, "text-gold"],
                   ["Top Client", ceoInsights.topClient, Users, "text-blue-400"],
                   ["Most Profitable", ceoInsights.topEventType, DollarSign, "text-emerald-400"],
                   ["Growth Opportunity", ceoInsights.growthOpportunity, TrendingUp, "text-amber-400"],
                 ].map(([label, value, Icon, color]) => (
                   <div key={label} className="flex gap-3">
                     <div className={cn("mt-1 shrink-0 h-7 w-7 rounded-md bg-white/5 flex items-center justify-center", color)}>
                       <Icon size={14} />
                     </div>
                     <div>
                       <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{label}</p>
                       <p className="text-xs text-white font-medium mt-0.5">{value}</p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        </div>

        {/* Sidebar Intelligence & Ops */}
        <div className="space-y-6">
          {/* AI Assistant Panel (Option 3) */}
          <div className="bg-[#1a2b4b] border border-blue-500/20 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center gap-2 text-blue-400 mb-4">
              <Sparkles size={18} />
              <h4 className="font-bold text-sm">AI CEO Intelligence</h4>
            </div>
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-blue-300 font-bold uppercase">Predicted Revenue (Next Month)</p>
                <h5 className="text-xl font-bold text-white mt-1">KSh 5,820,000</h5>
                <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                  <TrendingUp size={10} /> +12.5% increase forecasted
                </p>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Event Success Forecast", val: "94%", color: "bg-emerald-500" },
                  { label: "High-Risk Events Alert", val: "2", color: "bg-rose-500" },
                  { label: "Pricing Optimizations", val: "Available", color: "bg-blue-500" },
                ].map((insight) => (
                  <div key={insight.label} className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-400">{insight.label}</span>
                    <span className={cn("px-2 py-0.5 rounded text-white font-bold", insight.color)}>{insight.val}</span>
                  </div>
                ))}
              </div>
              <button className="w-full py-2 bg-blue-500 text-white rounded-lg text-xs font-bold hover:bg-blue-600 transition">
                View Deep AI Analysis
              </button>
            </div>
          </div>

          {/* Logistics & Ops Status */}
          <div className="bg-[#0b0e14] border border-white/5 rounded-2xl p-5">
            <h4 className="text-white font-bold text-sm mb-4">Live Logistics Status</h4>
            <div className="space-y-4">
               {[
                 { label: "Vehicle Tracking", val: "8/10 active", icon: Truck },
                 { label: "Staff On-Duty", val: "42 members", icon: Users },
                 { label: "Inventory Status", val: "92% available", icon: Package },
                 { label: "Equipment Ready", val: "100%", icon: Zap },
               ].map((item) => (
                 <div key={item.label} className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">
                       <item.icon size={16} />
                     </div>
                     <span className="text-xs text-gray-300">{item.label}</span>
                   </div>
                   <span className="text-xs font-bold text-white">{item.val}</span>
                 </div>
               ))}
            </div>
            <button className="w-full mt-6 py-2 bg-white/5 border border-white/10 text-white rounded-lg text-xs font-bold hover:bg-white/10 transition flex items-center justify-center gap-2">
              <Radio size={14} className="text-rose-500" /> Command Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
