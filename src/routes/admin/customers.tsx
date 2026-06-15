import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, UserCircle, Search, Filter, ArrowUpRight, ShieldCheck, Globe } from "lucide-react";
import { useAdminClients } from "@/hooks/use-dashboard-data";
import { cn } from "@/lib/utils";
import { BackToDashboard } from "@/components/dashboard/BackToDashboard";

export const Route = createFileRoute("/admin/customers")({
  component: AdminCustomers,
});

function AdminCustomers() {
  const { data: profiles = [], isLoading, error } = useAdminClients();

  const customers = profiles.filter((p) => p.role === "customer");
  const withPhone = customers.filter((c) => c.phone).length;
  const newThisMonth = customers.filter((c) => {
    const d = new Date(c.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="space-y-10 pb-20 font-sans text-white">
      <BackToDashboard role="admin" />

      {/* 1. STRATEGIC HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gold">
            <div className="h-[1px] w-10 bg-gold" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Client Relations</p>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black tracking-tighter uppercase">Member Directory</h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl font-medium leading-relaxed">
            Comprehensive registry of all verified Royal Touch members. Manage high-value client profiles and communication protocols.
          </p>
        </div>
      </div>

      {/* 2. CORE METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Members", val: customers.length, icon: Globe, color: "gold" },
          { label: "Verified Verified", val: withPhone, icon: ShieldCheck, color: "emerald" },
          { label: "New Acquisitions", val: newThisMonth, icon: ArrowUpRight, color: "blue" },
        ].map((stat, i) => (
          <div key={i} className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-gold/30 transition-all group">
             <div className="flex justify-between items-start mb-6">
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center border transition-all",
                  stat.color === "gold" ? "bg-gold/10 text-gold border-gold/20" :
                  stat.color === "emerald" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                  "bg-blue-500/10 text-blue-500 border-blue-500/20"
                )}>
                  <stat.icon size={24} />
                </div>
             </div>
             <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-2">{stat.label}</p>
             <h3 className="text-4xl font-black text-white">{stat.val}</h3>
          </div>
        ))}
      </div>

      {/* 3. DIRECTORY REGISTRY */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
           <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                placeholder="Search member registry..."
                className="w-full bg-transparent border-none pl-12 pr-6 py-2 text-sm text-white focus:ring-0 outline-none"
              />
           </div>
           <div className="h-8 w-[1px] bg-white/5" />
           <button className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
              <Filter size={14} /> Refine
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading && <p className="col-span-full text-center py-20 text-gray-500 uppercase tracking-widest text-[10px] font-black animate-pulse">Retrieving Member Profiles...</p>}
          {error && <p className="col-span-full text-center py-20 text-rose-500 uppercase tracking-widest text-[10px] font-black">Profile Database Access Failure</p>}

          {customers.map((customer) => (
            <div key={customer.id} className="group relative bg-[#121212] border border-white/10 p-8 rounded-[40px] hover:border-gold/30 transition-all duration-500">
               <div className="flex items-start gap-5 mb-8">
                  <div className="h-16 w-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-display text-3xl font-black">
                     {customer.full_name ? customer.full_name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="space-y-1">
                     <h3 className="text-xl font-black text-white uppercase tracking-tighter group-hover:text-gold transition-colors">{customer.full_name || "UNNAMED CLIENT"}</h3>
                     <span className="inline-flex px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest text-gray-500">Verified Member</span>
                  </div>
               </div>

               <ul className="space-y-4 border-t border-white/5 pt-8">
                  <li className="flex items-center gap-4 group/item">
                    <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-gold shrink-0 border border-white/5 group-hover/item:border-gold transition-colors">
                       <Mail size={14} />
                    </div>
                    <a href={`mailto:${customer.email}`} className="text-[10px] font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest truncate">{customer.email}</a>
                  </li>
                  <li className="flex items-center gap-4 group/item">
                    <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-gold shrink-0 border border-white/5 group-hover/item:border-gold transition-colors">
                       <Phone size={14} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{customer.phone || "COMMUNICATION PENDING"}</span>
                  </li>
                  <li className="flex items-center gap-4 group/item">
                    <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-gold shrink-0 border border-white/5 group-hover/item:border-gold transition-colors">
                       <MapPin size={14} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{customer.city || "REGION UNKNOWN"}</span>
                  </li>
               </ul>

               <div className="mt-10 pt-6 border-t border-white/5 flex justify-between items-center">
                  <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Registered {new Date(customer.created_at).toLocaleDateString()}</p>
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
