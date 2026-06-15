import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShoppingCart,
  Search,
  Filter,
  ArrowRight,
  Clock,
  Package,
  CheckCircle2,
  Zap,
  MoreVertical
} from "lucide-react";
import { BackToDashboard } from "@/components/dashboard/BackToDashboard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

const orders = [
  { id: "ORD-1042", client: "Achieng Wedding", items: "Decor + Sound", total: "KES 380,000", status: "Confirmed" },
  { id: "ORD-1041", client: "Equity Corporate Gala", items: "Full Production", total: "KES 1,250,000", status: "Processing" },
  { id: "ORD-1040", client: "Kamau Birthday", items: "Decor + DJ", total: "KES 145,000", status: "Pending" },
  { id: "ORD-1039", client: "Safaricom Launch", items: "Stage + AV", total: "KES 820,000", status: "Delivered" },
];

function AdminOrders() {
  return (
    <div className="space-y-10 pb-20 font-sans text-white">
      <BackToDashboard role="admin" />

      {/* 1. STRATEGIC HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gold">
            <div className="h-[1px] w-10 bg-gold" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Resource Allocation</p>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black tracking-tighter uppercase">Operations Log</h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl font-medium leading-relaxed">
            Registry of all technical and decorative assets deployed across active projects. Monitor procurement and fulfillment status.
          </p>
        </div>
      </div>

      {/* 2. CORE LOGISTICS METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Active Deployments", val: orders.length, icon: Package, color: "gold" },
          { label: "Processing Stage", val: "2", icon: Zap, color: "amber" },
          { label: "Successful Delivery", val: "100%", icon: CheckCircle2, color: "emerald" },
        ].map((stat, i) => (
          <div key={i} className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-gold/30 transition-all group">
             <div className="flex justify-between items-start mb-6">
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center border transition-all",
                  stat.color === "gold" ? "bg-gold/10 text-gold border-gold/20" :
                  stat.color === "amber" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                  "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                )}>
                  <stat.icon size={24} />
                </div>
             </div>
             <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-2">{stat.label}</p>
             <h3 className="text-4xl font-black text-white">{stat.val}</h3>
          </div>
        ))}
      </div>

      {/* 3. ORDERS REGISTRY */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
           <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                placeholder="Search logistical deployments..."
                className="w-full bg-transparent border-none pl-12 pr-6 py-2 text-sm text-white focus:ring-0 outline-none"
              />
           </div>
           <div className="h-8 w-[1px] bg-white/5" />
           <button className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
              <Filter size={14} /> Filter
           </button>
        </div>

        <div className="bg-[#121212] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5 border-b border-white/5">
              <tr className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">
                <th className="px-8 py-6">Mission ID</th>
                <th className="px-8 py-6">Primary Client</th>
                <th className="px-8 py-6">Asset Bundle</th>
                <th className="px-8 py-6">Investment</th>
                <th className="px-8 py-6">State</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map((o) => (
                <tr key={o.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-6 font-mono text-[10px] text-gold font-bold">{o.id}</td>
                  <td className="px-8 py-6 font-bold text-white uppercase tracking-tight text-xs">{o.client}</td>
                  <td className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{o.items}</td>
                  <td className="px-8 py-6 font-black text-white text-xs">{o.total}</td>
                  <td className="px-8 py-6">
                    <span className="inline-flex px-3 py-1 rounded bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest text-gray-400">
                      {o.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                     <button className="p-2 rounded-xl hover:bg-white/5 text-gray-700 hover:text-white transition-colors">
                        <MoreVertical size={16} />
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {orders.length === 0 && (
             <div className="py-24 text-center">
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">No Active Deployments Discovered</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
