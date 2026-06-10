import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageSquare, Inbox } from "lucide-react";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { useAdminContacts, useUpdateContactStatus } from "@/hooks/use-dashboard-data";
import type { ContactStatus } from "@/lib/database.types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/contacts")({
  component: AdminContacts,
});

const statusOptions: ContactStatus[] = ["new", "read", "replied", "archived"];

const statusStyles: Record<ContactStatus, string> = {
  new: "border-amber-400/40 bg-amber-500/10 text-amber-300",
  read: "border-blue-400/40 bg-blue-500/10 text-blue-300",
  replied: "border-emerald-400/40 bg-emerald-500/10 text-emerald-300",
  archived: "border-white/20 bg-white/5 text-muted-foreground",
};

function AdminContacts() {
  const { data: contacts = [], isLoading, error } = useAdminContacts();
  const updateStatus = useUpdateContactStatus();

  const newCount = contacts.filter((c) => c.status === "new").length;
  const repliedCount = contacts.filter((c) => c.status === "replied").length;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Contact Inquiries</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl">
          Website <span className="text-gradient-gold">messages</span>
        </h2>
        <p className="mt-2 text-muted-foreground">
          All submissions from the public contact page. Update status as you read and reply.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="glass-strong rounded-2xl border border-white/15 p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
            <Inbox size={20} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Total</p>
            <p className="font-display text-2xl">{contacts.length}</p>
          </div>
        </div>
        <div className="glass-strong rounded-2xl border border-white/15 p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-300">
            <MessageSquare size={20} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Unread</p>
            <p className="font-display text-2xl">{newCount}</p>
          </div>
        </div>
        <div className="glass-strong rounded-2xl border border-white/15 p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-300">
            <Mail size={20} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Replied</p>
            <p className="font-display text-2xl">{repliedCount}</p>
          </div>
        </div>
      </div>

      <GlassPanel title="Contact Messages" subtitle={`${contacts.length} inquiries from /contact`}>
        {isLoading && <p className="text-sm text-muted-foreground">Loading contact messages…</p>}
        {error && (
          <p className="text-sm text-destructive">Could not load contact inquiries. Check your Supabase connection.</p>
        )}
        {!isLoading && contacts.length === 0 && (
          <p className="text-sm text-muted-foreground">No contact messages yet. Submissions from the contact page will appear here.</p>
        )}
        <div className="space-y-3">
          {contacts.map((c) => (
            <div key={c.id} className="rounded-xl glass border border-white/10 p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg">{c.name}</p>
                  <a href={`mailto:${c.email}`} className="text-sm text-gold mt-1 inline-block hover:underline">
                    {c.email}
                  </a>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs capitalize", statusStyles[c.status])}>
                    {c.status}
                  </span>
                  <span className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleString()}</span>
                </div>
              </div>
              <p className="mt-4 text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap">{c.message}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <label htmlFor={`contact-status-${c.id}`} className="text-xs uppercase tracking-widest text-muted-foreground">
                  Status
                </label>
                <select
                  id={`contact-status-${c.id}`}
                  value={c.status}
                  onChange={(e) => updateStatus.mutate({ id: c.id, status: e.target.value as ContactStatus })}
                  className="rounded-lg bg-background/60 border border-border px-3 py-1.5 text-sm"
                  aria-label={`Update status for ${c.name}`}
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <a
                  href={`mailto:${c.email}?subject=Re: Your inquiry to Royal Touch Events`}
                  className="ml-auto text-xs uppercase tracking-widest text-gold hover:underline"
                >
                  Reply via email
                </a>
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}
