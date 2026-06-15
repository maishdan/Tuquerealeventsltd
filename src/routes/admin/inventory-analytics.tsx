import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Boxes,
  Search,
  Filter,
  ArrowRight,
  BarChart3,
  PieChart,
  TrendingUp,
  ShieldCheck,
  Package,
  Zap,
  ArrowUpRight
} from "lucide-react";
import { BackToDashboard } from "@/components/dashboard/BackToDashboard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/inventory-analytics")({
  component: InventoryAnalytics,
});

const assets = [
  { name: "Stadium Audio Array", category: "Technical", stock: 4, status: "Active", utilization: "85%" },
  { name: "Intelligent LED Rig", category: "Lighting", stock: 12, status: "Available", utilization: "40%" },
  { name: "Bespoke Silk Draping", category: "Decor", stock: 500, status: "Active", utilization: "92%" },
  { name: "Executive Staging", category: "Structures", stock: 8, status: "In Maintenance", utilization: "10%" },
  { name: "4K Cinema Camera", category: "Media", stock: 6, status: "Active", utilization: "75%" },
];

function InventoryAnalytics() {
  return (
    <div className="space-y-10 pb-20 font-sans text-white">
      <BackToDashboard role="admin" />

      {/* 1. STRATEGIC HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gold">
            <div className="h-[1px] w-10 bg-gold" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Asset Intelligence</p>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black tracking-tighter uppercase">Inventory Hub</h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl font-medium leading-relaxed">
            Real-time tracking of empire technical and creative assets. Monitor utilization efficiency and deployment readiness across all regions.
          </p>
        </div>
      </div>

      {/* 2. CORE ASSET METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Asset Value", val: "KES 85.4M", icon: TrendingUp, color: "gold" },
          { label: "Deployment Rate", val: "72.5%", icon: BarChart3, color: "emerald" },
          { label: "Technical Uptime", val: "100%", icon: Zap, color: "blue" },
          { label: "Active Bundles", val: "24", icon: Package, color: "purple" },
        ].map((stat, i) => (
          <div key={i} className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-gold/30 transition-all group">
             <div className="flex justify-between items-start mb-6">
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center border transition-all",
                  stat.color === "gold" ? "bg-gold/10 text-gold border-gold/20" :
                  stat.color === "emerald" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                  stat.color === "blue" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                  "bg-purple-500/10 text-purple-500 border-purple-500/20"
                )}>
                  <stat.icon size={24} />
                </div>
             </div>
             <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-2">{stat.label}</p>
             <h3 className="text-2xl font-black text-white">{stat.val}</h3>
          </div>
        ))}
      </div>

      {/* 3. INVENTORY LIST */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
           <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                placeholder="Search asset registry..."
                className="w-full bg-transparent border-none pl-12 pr-6 py-2 text-sm text-white focus:ring-0 outline-none"
              />
           </div>
           <div className="h-8 w-[1px] bg-white/5" />
           <button className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
              <Filter size={14} /> Category
           </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {assets.map((item, i) => (
            <div key={i} className="group relative bg-[#121212] border border-white/10 p-8 rounded-[40px] hover:border-gold/30 transition-all duration-500">
               <div className="flex justify-between items-start mb-8">
                  <div className="space-y-2">
                     <p className="text-gold text-[10px] font-black uppercase tracking-widest">{item.category}</p>
                     <h3 className="text-2xl font-black text-white uppercase tracking-tighter group-hover:text-gold transition-colors">{item.name}</h3>
                  </div>
                  <span className={cn("inline-flex px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest",
                    item.status === "Active" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500" :
                    item.status === "Available" ? "border-blue-500/30 bg-blue-500/10 text-blue-500" :
                    "border-rose-500/30 bg-rose-500/10 text-rose-500"
                  )}>
                    {item.status}
                  </span>
               </div>

               <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                     <span className="text-gray-500">Utilization Pulse</span>
                     <span className="text-white">{item.utilization}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                     <div
                      className="h-full bg-gold rounded-full transition-all duration-1000"
                      style={{ width: item.utilization }}
                     />
                  </div>
               </div>

               <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Quantity: <span className="text-white">{item.stock} Units</span></p>
                  <button className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-gold transition-colors">
                     <ArrowUpRight size={16} />
                  </button>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
