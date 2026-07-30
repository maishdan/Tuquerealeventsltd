import { createFileRoute, Link } from "@tanstack/react-router";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import {
  Mail,
  Phone,
  MapPin,
  UserCircle,
  Search,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  Globe,
  Loader2,
  Users
} from "lucide-react";
import { useAdminClients } from "@/hooks/use-dashboard-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/customers")({
  component: AdminCustomers,
});

function AdminCustomers() {
  const { data: profiles = [], isLoading } = useAdminClients();

  const customers = profiles.filter((p) => p.role === "customer");
  const withPhone = customers.filter((c) => c.phone).length;

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-wrap items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Client Relations</p>
          <h2 className="mt-2 font-display text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground">Member Directory</h2>
        </div>
        <div className="flex gap-4">
           <div className="bg-card border border-border px-6 h-14 rounded-2xl flex items-center gap-3 shadow-sm">
              <Users size={18} className="text-blue-500" />
              <div className="text-left">
                 <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Total Reach</p>
                 <p className="text-sm font-black text-foreground">{customers.length} Accounts</p>
              </div>
           </div>
        </div>
      </div>

      <GlassPanel title="Executive Profiles" subtitle="Registry of all verified Royal Touch members">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
             <Loader2 size={40} className="text-gold animate-spin" />
             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Syncing Client Registry...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
            {customers.map((customer) => (
              <div key={customer.id} className="group bg-muted/30 border border-border p-8 rounded-[40px] hover:border-gold/30 transition-all duration-500 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
                    <UserCircle size={100} />
                 </div>

                 <div className="flex items-start gap-5 mb-8 relative z-10">
                    <div className="h-16 w-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-display text-3xl font-black shadow-inner group-hover:bg-gold group-hover:text-black transition-all">
                       {customer.full_name ? customer.full_name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="space-y-1">
                       <h3 className="text-xl font-bold text-foreground uppercase tracking-tight group-hover:text-gold transition-colors">{customer.full_name || "UNNAMED CLIENT"}</h3>
                       <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Verified Member</p>
                    </div>
                 </div>

                 <div className="space-y-4 border-t border-border pt-8 relative z-10">
                    <div className="flex items-center gap-4">
                       <div className="h-8 w-8 rounded-lg bg-background border border-border flex items-center justify-center text-gold shrink-0 shadow-inner">
                          <Mail size={14} />
                       </div>
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">{customer.email}</p>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="h-8 w-8 rounded-lg bg-background border border-border flex items-center justify-center text-gold shrink-0 shadow-inner">
                          <Phone size={14} />
                       </div>
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{customer.phone || "Comm PENDING"}</p>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="h-8 w-8 rounded-lg bg-background border border-border flex items-center justify-center text-gold shrink-0 shadow-inner">
                          <MapPin size={14} />
                       </div>
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{customer.city || "Region TBD"}</p>
                    </div>
                 </div>

                 <div className="mt-10 flex justify-between items-center relative z-10">
                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em]">Active since {new Date(customer.created_at).getFullYear()}</p>
                    <button className="h-10 w-10 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold transition-all shadow-sm">
                       <ArrowUpRight size={18} />
                    </button>
                 </div>
              </div>
            ))}
          </div>
        )}
      </GlassPanel>
    </div>
  );
}
