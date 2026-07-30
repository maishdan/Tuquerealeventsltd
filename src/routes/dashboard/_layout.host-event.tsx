import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import {
  Check,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  Sparkles,
  ChevronDown,
  LayoutDashboard,
  Globe,
  MapPin,
  Calendar,
  Users
} from "lucide-react";
import { createEvent } from "@/lib/api/events";
import { useAuth } from "@/contexts/AuthContext";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/_layout/host-event")({
  component: HostEvent,
});

const schema = z.object({
  name: z.string().trim().min(2, "Please enter event name").max(100),
  eventType: z.string().min(1, "Select an event type"),
  date: z.string().min(1, "Pick a date"),
  venue: z.string().min(2, "Enter venue location"),
  budget: z.string().optional(),
  description: z.string().max(1000).optional(),
});

const eventTypes = ["Public Concert", "Community Festival", "Open Workshop", "Charity Auction", "Exhibition", "Sporting Event"];

function HostEvent() {
  const { user, profile } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError("");
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name") || ""),
      eventType: String(fd.get("eventType") || ""),
      date: String(fd.get("date") || ""),
      venue: String(fd.get("venue") || ""),
      budget: String(fd.get("budget") || ""),
      description: String(fd.get("description") || ""),
    };
    const res = schema.safeParse(data);
    if (!res.success) {
      const errs: Record<string, string> = {};
      res.error.issues.forEach((i) => { errs[String(i.path[0])] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      await createEvent({
        name: res.data.name,
        event_type: res.data.eventType,
        event_date: res.data.date,
        venue: res.data.venue,
        budget: res.data.budget ? parseFloat(res.data.budget.replace(/[^0-9.]/g, '')) : null,
        user_id: user?.id ?? null,
        status: 'upcoming'
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Could not list event. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="h-24 w-24 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
          <Globe size={48} />
        </div>
        <div className="space-y-4">
          <h1 className="font-display text-5xl md:text-6xl uppercase font-black tracking-tighter text-foreground">Event Published.</h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">Your event has been successfully hosted and is now visible on the global Royal Touch events registry.</p>
        </div>
        <Link to="/dashboard" className="h-14 px-10 rounded-full bg-gold text-black font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-2xl">
          <LayoutDashboard size={16} /> Return to Portal Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="animate-in fade-in slide-in-from-top-4 duration-700">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Public Engagement</p>
        <h2 className="mt-2 font-display text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground">Host Public Event</h2>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 animate-in fade-in slide-in-from-left-8 duration-1000">
          <GlassPanel title="Event Registry Details" subtitle="List your engagement on the global Royal Touch engine">
            <form onSubmit={onSubmit} className="space-y-10 py-6" noValidate>
              {submitError && (
                <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-4">
                  <Zap size={20} />
                  <p>{submitError}</p>
                </div>
              )}

              <div className="space-y-8">
                 <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground border-b border-border pb-4">01. Host Intelligence</h3>
                 <div className="grid md:grid-cols-2 gap-6">
                    <Field label="Authorized Host Name" name="hostName" id="host-name" defaultValue={profile?.full_name || ""} readOnly />
                    <Field label="Verified Professional Email" name="hostEmail" id="host-email" defaultValue={profile?.email || ""} readOnly />
                 </div>
              </div>

              <div className="space-y-8">
                 <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground border-b border-border pb-4">02. Project Specifications</h3>
                 <div className="grid md:grid-cols-2 gap-6">
                    <Field label="Public Event Title" name="name" id="event-name" placeholder="Ex: Nairobi Tech Expo 2026" error={errors.name} />
                    <Select label="Engagement Category" name="eventType" id="event-type" options={eventTypes} error={errors.eventType} />
                    <Field label="Launch Date" name="date" id="event-date" type="date" error={errors.date} />
                    <Field label="Venue Coordinates" name="venue" id="event-venue" placeholder="Ex: Sarit Expo Centre" error={errors.venue} />
                 </div>
              </div>

              <div className="space-y-4">
                 <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground border-b border-border pb-4">03. Project Synopsis</h3>
                 <textarea
                  id="event-description"
                  name="description"
                  rows={6}
                  maxLength={1000}
                  placeholder="Provide a detailed description of the event for public listing..."
                  className="w-full bg-muted border border-border rounded-[32px] px-8 py-6 text-sm text-foreground focus:border-gold outline-none transition-all placeholder:text-muted-foreground/40"
                 />
              </div>

              <div className="pt-6">
                 <button type="submit" disabled={submitting} className="h-20 w-full sm:w-auto sm:px-16 rounded-full bg-gold text-black font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:scale-[1.02] transition-all shadow-[0_0_50px_rgba(212,175,55,0.2)] disabled:opacity-50">
                    {submitting ? <Loader2 size={24} className="animate-spin" /> : <>Publish Public Engagement <Globe size={20} /></>}
                 </button>
              </div>
            </form>
          </GlassPanel>
        </div>

        <div className="lg:col-span-4 space-y-6 animate-in fade-in slide-in-from-right-8 duration-1000">
           <div className="bg-card border border-border p-8 rounded-[40px] space-y-6 shadow-sm">
              <div className="flex items-center gap-3 text-gold">
                 <Globe size={20} />
                 <h4 className="text-[10px] font-black uppercase tracking-widest">Global Exposure</h4>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed font-medium uppercase tracking-widest leading-loose">Listing your event ensures indexing on the public Royal Touch registry.</p>
           </div>

           <div className="bg-emerald-500/5 border border-emerald-500/10 p-8 rounded-[40px] space-y-6 shadow-sm">
              <div className="flex items-center gap-3 text-emerald-500">
                 <ShieldCheck size={20} />
                 <h4 className="text-[10px] font-black uppercase tracking-widest">Verification Status</h4>
              </div>
              <p className="text-[11px] text-muted-foreground font-medium">Your hosted events receive an automatic "Verified Partner" badge.</p>
           </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, id, type = "text", defaultValue, placeholder, error, readOnly }: any) {
  return (
    <div className="space-y-3">
      <label htmlFor={id} className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-4">{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        readOnly={readOnly}
        className={cn(
          "w-full h-16 bg-muted border border-border rounded-2xl px-6 text-sm text-foreground font-bold focus:border-gold outline-none transition-all placeholder:text-muted-foreground/40",
          readOnly && "bg-background border-none shadow-inner opacity-60 cursor-not-allowed"
        )}
      />
      {error && <p className="mt-2 text-[9px] font-bold text-rose-500 uppercase tracking-widest ml-4">{error}</p>}
    </div>
  );
}

function Select({ label, name, id, options, error }: any) {
  return (
    <div className="space-y-3">
      <label htmlFor={id} className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-4">{label}</label>
      <div className="relative">
        <select id={id} name={name} defaultValue="" className="w-full h-16 bg-muted border border-border rounded-2xl px-6 text-sm text-foreground font-bold focus:border-gold outline-none appearance-none cursor-pointer">
          <option value="" disabled>Select Sector...</option>
          {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gold pointer-events-none" size={18} />
      </div>
      {error && <p className="mt-2 text-[9px] font-bold text-rose-500 uppercase tracking-widest ml-4">{error}</p>}
    </div>
  );
}
