import { createFileRoute, Link } from "@tanstack/react-router";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { useAdminContacts, useUpdateContactStatus } from "@/hooks/use-dashboard-data";
import type { ContactStatus } from "@/lib/database.types";
import {
  Mail,
  MessageSquare,
  Inbox,
  Search,
  Filter,
  Clock,
  ArrowRight,
  ShieldCheck,
  Send,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/contacts")({
  component: AdminContacts,
});

const statusOptions: ContactStatus[] = ["new", "read", "replied", "archived"];

function AdminContacts() {
  const { data: contacts = [], isLoading } = useAdminContacts();
  const updateStatus = useUpdateContactStatus();

  const newCount = contacts.filter((c) => c.status === "new").length;

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-wrap items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Intelligence Inbound</p>
          <h2 className="mt-2 font-display text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground">Communications</h2>
        </div>
        <div className="flex gap-4">
           <div className="bg-card border border-border px-6 h-14 rounded-2xl flex items-center gap-3 shadow-sm">
              <MessageSquare size={18} className="text-amber-500" />
              <div className="text-left">
                 <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Unread Alerts</p>
                 <p className="text-sm font-black text-foreground">{newCount} Inquiries</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 animate-in fade-in slide-in-from-left-8 duration-1000">
          <GlassPanel title="Intelligence Feed" subtitle="Live feed of all strategic partnership inquiries">
            {isLoading ? (
              <div className="py-24 flex flex-col items-center justify-center space-y-4">
                 <Loader2 size={40} className="text-gold animate-spin" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Syncing Database...</p>
              </div>
            ) : contacts.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
                 <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center border border-border">
                    <Inbox size={32} className="text-muted-foreground" />
                 </div>
                 <div className="space-y-2">
                    <p className="text-sm font-bold text-foreground uppercase tracking-tight">Vault Clear.</p>
                    <p className="text-[11px] text-muted-foreground max-w-xs mx-auto leading-relaxed">No new communications have been intercepted at this time.</p>
                 </div>
              </div>
            ) : (
              <div className="space-y-6 py-4">
                {contacts.map((c) => (
                  <div key={c.id} className="group bg-muted/30 border border-border p-8 rounded-[40px] hover:border-gold/30 transition-all duration-500">
                     <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
                        <div className="flex gap-6">
                           <div className="h-14 w-14 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-display text-2xl font-black shadow-inner">
                              {c.name.charAt(0).toUpperCase()}
                           </div>
                           <div className="space-y-1">
                              <h3 className="text-2xl font-bold text-foreground uppercase tracking-tight group-hover:text-gold transition-colors">{c.name}</h3>
                              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{c.email}</p>
                           </div>
                        </div>
                        <div className={cn(
                          "px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest",
                          c.status === 'new' ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                          c.status === 'replied' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                          "bg-blue-500/10 border-blue-500/20 text-blue-500"
                        )}>
                           {c.status}
                        </div>
                     </div>

                     <div className="bg-background border border-border p-6 rounded-3xl mb-8 relative">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                           <Mail size={60} />
                        </div>
                        <p className="text-foreground text-sm leading-relaxed italic font-medium">"{c.message}"</p>
                     </div>

                     <div className="flex flex-wrap items-center gap-6 border-t border-border pt-8">
                        <div className="flex items-center gap-3">
                           <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Update State:</label>
                           <select
                             value={c.status}
                             onChange={(e) => updateStatus.mutate({ id: c.id, status: e.target.value as ContactStatus })}
                             className="bg-muted border border-border rounded-lg px-4 py-1.5 text-[10px] font-black uppercase text-foreground outline-none focus:border-gold transition-all cursor-pointer"
                           >
                              {statusOptions.map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                        </div>

                        <div className="flex items-center gap-2 text-[9px] font-bold text-muted-foreground uppercase tracking-widest ml-4">
                           <Clock size={12} /> Received {new Date(c.created_at).toLocaleDateString()}
                        </div>

                        <a
                          href={`mailto:${c.email}?subject=Executive Response: Royal Touch Events`}
                          className="ml-auto h-11 px-8 rounded-full bg-gold text-black text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-lg"
                        >
                           Dispatch Response <ArrowRight size={14} />
                        </a>
                     </div>
                  </div>
                ))}
              </div>
            )}
          </GlassPanel>
        </div>

        <div className="lg:col-span-4 space-y-6 animate-in fade-in slide-in-from-right-8 duration-1000">
           <div className="bg-[#121212] border border-white/10 p-8 rounded-[40px] space-y-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <ShieldCheck size={100} />
              </div>
              <div className="relative z-10 space-y-6">
                 <div className="flex items-center gap-3 text-gold">
                    <CheckCircle2 size={20} />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Encryption Verified</h4>
                 </div>
                 <p className="text-gray-400 text-xs font-bold leading-relaxed uppercase tracking-tight opacity-60">
                    All inbound communications are routed through the secure Royal Touch bridge. Response latency is monitored at the executive level.
                 </p>
              </div>
           </div>

           <div className="bg-emerald-500/5 border border-emerald-500/10 p-8 rounded-[40px] space-y-4">
              <div className="flex items-center gap-3 text-emerald-500">
                 <Send size={18} />
                 <h4 className="text-[10px] font-black uppercase tracking-widest">Protocol Stats</h4>
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase">
                    <span>Response Rate</span>
                    <span className="text-foreground">98.2%</span>
                 </div>
                 <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                    <div className="h-full w-[98%] bg-emerald-500 rounded-full" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
