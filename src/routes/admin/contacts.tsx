import { createFileRoute } from "@tanstack/react-router";
import {
  Mail,
  MessageSquare,
  Inbox,
  Search,
  Filter,
  Clock,
  ArrowRight,
  MoreHorizontal,
  ShieldCheck,
  Send
} from "lucide-react";
import { useAdminContacts, useUpdateContactStatus } from "@/hooks/use-dashboard-data";
import type { ContactStatus } from "@/lib/database.types";
import { cn } from "@/lib/utils";
import { BackToDashboard } from "@/components/dashboard/BackToDashboard";

export const Route = createFileRoute("/admin/contacts")({
  component: AdminContacts,
});

const statusOptions: ContactStatus[] = ["new", "read", "replied", "archived"];

const statusStyles: Record<ContactStatus, string> = {
  new: "border-amber-400/40 bg-amber-500/10 text-amber-300",
  read: "border-blue-400/40 bg-blue-500/10 text-blue-300",
  replied: "border-emerald-400/40 bg-emerald-500/10 text-emerald-300",
  archived: "border-white/20 bg-white/5 text-gray-500",
};

function AdminContacts() {
  const { data: contacts = [], isLoading, error } = useAdminContacts();
  const updateStatus = useUpdateContactStatus();

  const newCount = contacts.filter((c) => c.status === "new").length;
  const repliedCount = contacts.filter((c) => c.status === "replied").length;

  return (
    <div className="space-y-10 pb-20 font-sans text-white">
      <BackToDashboard role="admin" />

      {/* 1. STRATEGIC HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gold">
            <div className="h-[1px] w-10 bg-gold" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Intelligence Inbound</p>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black tracking-tighter uppercase">Communications</h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl font-medium leading-relaxed">
            Centralized intake for all high-level inquiries and strategic partnerships. Monitor response latency and engagement quality.
          </p>
        </div>
      </div>

      {/* 2. CORE METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Inquiries", val: contacts.length, icon: Inbox, color: "gold" },
          { label: "Awaiting Action", val: newCount, icon: MessageSquare, color: "amber" },
          { label: "Resolved/Replied", val: repliedCount, icon: Send, color: "emerald" },
        ].map((stat, i) => (
          <div key={i} className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-gold/30 transition-all group">
             <div className="flex justify-between items-start mb-6">
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center border transition-all",
                  stat.color === "gold" ? "bg-gold/10 text-gold border-gold/20 group-hover:bg-gold group-hover:text-black" :
                  stat.color === "amber" ? "bg-amber-500/10 text-amber-500 border-amber-500/20 group-hover:bg-amber-500 group-hover:text-black" :
                  "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-black"
                )}>
                  <stat.icon size={24} />
                </div>
             </div>
             <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-2">{stat.label}</p>
             <h3 className="text-4xl font-black text-white">{stat.val}</h3>
          </div>
        ))}
      </div>

      {/* 3. MESSAGE REGISTRY */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
           <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                placeholder="Search inbound intelligence..."
                className="w-full bg-transparent border-none pl-12 pr-6 py-2 text-sm text-white focus:ring-0 outline-none"
              />
           </div>
           <div className="h-8 w-[1px] bg-white/5" />
           <button className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
              <Filter size={14} /> Refine
           </button>
        </div>

        <div className="space-y-4">
          {isLoading && <p className="text-center py-20 text-gray-500 uppercase tracking-widest text-[10px] font-black animate-pulse">Syncing Secure Database...</p>}
          {error && <p className="text-center py-20 text-rose-500 uppercase tracking-widest text-[10px] font-black">Database Synchronization Failure</p>}

          {contacts.map((c) => (
            <div key={c.id} className="group relative bg-[#121212] border border-white/10 p-8 rounded-[40px] hover:border-gold/30 transition-all duration-500">
               <div className="flex flex-wrap justify-between items-start gap-6 mb-8">
                  <div className="flex gap-6">
                     <div className="h-14 w-14 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-display text-2xl font-black">
                        {c.name.charAt(0).toUpperCase()}
                     </div>
                     <div className="space-y-1">
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter group-hover:text-gold transition-colors">{c.name}</h3>
                        <div className="flex items-center gap-4">
                           <a href={`mailto:${c.email}`} className="text-[10px] font-bold text-gray-500 hover:text-gold transition-colors uppercase tracking-widest">{c.email}</a>
                           <div className="h-1 w-1 rounded-full bg-white/10" />
                           <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                              <Clock size={12} /> {new Date(c.created_at).toLocaleDateString()}
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <span className={cn("inline-flex rounded-full border px-4 py-1.5 text-[9px] font-black uppercase tracking-widest", statusStyles[c.status])}>
                        {c.status}
                     </span>
                     <button className="p-2 rounded-xl hover:bg-white/5 text-gray-500 transition-colors">
                        <MoreHorizontal size={20} />
                     </button>
                  </div>
               </div>

               <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl mb-8">
                  <p className="text-gray-300 text-sm leading-relaxed italic">"{c.message}"</p>
               </div>

               <div className="flex flex-wrap items-center gap-6 border-t border-white/5 pt-8">
                  <div className="flex items-center gap-3">
                     <label htmlFor={`status-${c.id}`} className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Update State:</label>
                     <select
                       id={`status-${c.id}`}
                       value={c.status}
                       onChange={(e) => updateStatus.mutate({ id: c.id, status: e.target.value as ContactStatus })}
                       className="bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-gold transition-all"
                     >
                       {statusOptions.map((s) => (
                         <option key={s} value={s}>{s}</option>
                       ))}
                     </select>
                  </div>

                  <a
                    href={`mailto:${c.email}?subject=Executive Response: Royal Touch Events`}
                    className="ml-auto inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gold hover:text-white transition-colors"
                  >
                    Dispatch Executive Response <ArrowRight size={14} />
                  </a>
               </div>
            </div>
          ))}

          {!isLoading && contacts.length === 0 && (
             <div className="py-32 text-center space-y-6">
                <Inbox size={48} className="text-gray-800 mx-auto" />
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">Communication Vault Empty</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
