import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
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
  Calendar,
  Search,
  Plus
} from "lucide-react";
import { createBooking } from "@/lib/api/bookings";
import { fetchAllEvents } from "@/lib/api/events";
import { useAuth } from "@/contexts/AuthContext";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import type { EventRecord } from "@/lib/database.types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/_layout/book-event")({
  component: BookEvent,
});

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().min(7, "Phone too short").max(30),
  eventType: z.string().min(1, "Select an event type"),
  date: z.string().min(1, "Pick a date"),
  guests: z.string().max(10).optional(),
  budget: z.string().min(1, "Select a budget"),
  services: z.array(z.string()).default([]),
  notes: z.string().max(1000).optional(),
});

const defaultEventTypes = ["Corporate Gala", "Luxury Wedding", "Product Launch", "Concert Production", "Milestone Birthday", "VIP Private Event"];
const budgets = ["KSh 500,000 - 1M", "KSh 1M - 5M", "KSh 5M - 15M", "KSh 15M - 50M", "KSh 50M+"];
const serviceOptions = ["Full Production", "Strategic Planning", "Technical AV", "Floral Architecture", "VIP Concierge", "Cinematography"];

function BookEvent() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [publicEvents, setPublicEvents] = useState<EventRecord[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selServices, setSelServices] = useState<string[]>([]);

  const [formType, setFormType] = useState<'custom' | 'public'>('custom');

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAllEvents();
        setPublicEvents(data.filter(e => e.status === 'upcoming' || e.status === 'confirmed'));
      } catch (err) {
        console.error("Failed to load public registry:", err);
      } finally {
        setLoadingEvents(false);
      }
    }
    load();
  }, []);

  const toggle = (s: string) =>
    setSelServices((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const selectPublicEvent = (event: EventRecord) => {
    setSelectedEventId(event.id);
    setFormType('public');
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError("");
    const fd = new FormData(e.currentTarget);

    let eventType = String(fd.get("eventType") || "");
    let date = String(fd.get("date") || "");
    let notes = String(fd.get("notes") || "");

    if (formType === 'public' && selectedEventId) {
      const ev = publicEvents.find(p => p.id === selectedEventId);
      if (ev) {
        eventType = `[Public Registration] ${ev.name}`;
        date = ev.event_date || "";
        notes = `Public Registration for Event ID: ${ev.id}. ${notes}`;
      }
    }

    const data = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      eventType,
      date,
      guests: String(fd.get("guests") || ""),
      budget: String(fd.get("budget") || ""),
      services: selServices,
      notes,
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
      await createBooking({
        ...res.data,
        user_id: user?.id ?? null,
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Could not submit booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="h-24 w-24 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/30 shadow-sm">
          <Check size={48} />
        </div>
        <div className="space-y-4">
          <h1 className="font-display text-5xl md:text-6xl uppercase font-black tracking-tighter text-foreground">Project Initiated.</h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">Your strategic brief has been received and indexed. An executive producer will contact you to finalize the blueprint.</p>
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
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Project Acquisition</p>
        <h2 className="mt-2 font-display text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground">Secure Your Date</h2>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 items-start">
        {/* Left: Registry Selector */}
        <div className="lg:col-span-4 space-y-6 animate-in fade-in slide-in-from-left-8 duration-1000">
          <GlassPanel title="Event Registry" subtitle="Select from public engagements or custom production">
             <div className="space-y-4 py-2">
                <button
                  onClick={() => { setFormType('custom'); setSelectedEventId(null); }}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group",
                    formType === 'custom' ? "bg-gold/10 border-gold shadow-lg" : "bg-muted border-border hover:border-gold/30"
                  )}
                >
                   <div className={cn(
                     "h-10 w-10 rounded-xl flex items-center justify-center transition-all shadow-sm",
                     formType === 'custom' ? "bg-gold text-black" : "bg-card text-muted-foreground group-hover:text-foreground"
                   )}>
                      <Plus size={20} />
                   </div>
                   <div className="min-w-0">
                      <p className={cn("text-[10px] font-black uppercase tracking-widest", formType === 'custom' ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")}>Start Custom</p>
                      <p className="text-xs font-bold text-muted-foreground opacity-60 truncate">New Project Inquiry</p>
                   </div>
                </button>

                <div className="h-px bg-border mx-2" />

                {loadingEvents ? (
                   <div className="py-10 text-center space-y-3">
                      <Loader2 size={24} className="mx-auto text-gold animate-spin" />
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Retrieving Registry...</p>
                   </div>
                ) : publicEvents.length === 0 ? (
                  <p className="py-6 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-loose px-4">No active public engagements listed.</p>
                ) : (
                  <div className="space-y-3">
                    <p className="px-2 text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-50">Public Engagements</p>
                    {publicEvents.map((ev) => (
                      <button
                        key={ev.id}
                        onClick={() => selectPublicEvent(ev)}
                        className={cn(
                          "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group",
                          selectedEventId === ev.id ? "bg-gold/10 border-gold shadow-lg" : "bg-muted border-border hover:border-gold/30"
                        )}
                      >
                        <div className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center transition-all shadow-sm",
                          selectedEventId === ev.id ? "bg-gold text-black" : "bg-card text-muted-foreground group-hover:text-foreground"
                        )}>
                            <Globe size={18} />
                        </div>
                        <div className="min-w-0">
                            <p className={cn("text-[10px] font-black uppercase tracking-widest truncate", selectedEventId === ev.id ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")}>{ev.name}</p>
                            <p className="text-[10px] font-bold text-muted-foreground opacity-60 truncate mt-0.5">{ev.event_date || "TBD"}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
             </div>
          </GlassPanel>

          <div className="bg-card border border-border p-8 rounded-[40px] space-y-6 shadow-sm">
             <div className="flex items-center gap-3 text-gold">
                <ShieldCheck size={20} />
                <h4 className="text-[10px] font-black uppercase tracking-widest">Priority Indexing</h4>
             </div>
             <p className="text-[11px] text-muted-foreground leading-relaxed font-medium uppercase tracking-[0.1em]">Members receive priority processing for all registry inquiries.</p>
          </div>
        </div>

        {/* Right: Submission Form */}
        <div className="lg:col-span-8 animate-in fade-in slide-in-from-right-8 duration-1000">
          <GlassPanel title="Strategic Brief" subtitle={formType === 'custom' ? "Initiate a new bespoke production" : "Register for selected public engagement"}>
            <form onSubmit={onSubmit} className="space-y-10 py-6" noValidate>
              {submitError && (
                <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-4">
                  <Zap size={20} />
                  <p>{submitError}</p>
                </div>
              )}

              <div className="space-y-8">
                 <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground border-b border-border pb-4">01. Contact Intelligence</h3>
                 <div className="grid md:grid-cols-2 gap-6">
                    <Field label="Authorized Profile" name="name" id="booking-name" defaultValue={profile?.full_name || ""} error={errors.name} />
                    <Field label="Verified Email" name="email" id="booking-email" type="email" defaultValue={profile?.email || ""} error={errors.email} readOnly />
                    <Field label="Operational Phone" name="phone" id="booking-phone" defaultValue={profile?.phone || ""} error={errors.phone} />

                    {formType === 'custom' ? (
                       <Field label="Target Execution Date" name="date" id="booking-date" type="date" error={errors.date} />
                    ) : (
                       <div className="space-y-3">
                          <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-4">Scheduled Date</label>
                          <div className="w-full h-16 bg-muted rounded-2xl px-6 flex items-center text-sm text-foreground opacity-60 font-bold uppercase tracking-widest">
                             {publicEvents.find(e => e.id === selectedEventId)?.event_date || "TBD"}
                          </div>
                          <input type="hidden" name="date" value={publicEvents.find(e => e.id === selectedEventId)?.event_date || ""} />
                       </div>
                    )}
                 </div>
              </div>

              <div className="space-y-8">
                 <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground border-b border-border pb-4">02. Project Dimensions</h3>
                 <div className="grid md:grid-cols-2 gap-6">
                    {formType === 'custom' ? (
                       <Select label="Production Sector" name="eventType" id="booking-event-type" options={defaultEventTypes} error={errors.eventType} />
                    ) : (
                      <div className="space-y-3">
                         <label className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-4">Selected Engagement</label>
                         <div className="w-full h-16 bg-muted rounded-2xl px-6 flex items-center text-sm text-gold font-black uppercase tracking-widest truncate">
                            {publicEvents.find(e => e.id === selectedEventId)?.name}
                         </div>
                         <input type="hidden" name="eventType" value={publicEvents.find(e => e.id === selectedEventId)?.name || ""} />
                      </div>
                    )}
                    <Select label="Allocated Budget" name="budget" id="booking-budget" options={budgets} error={errors.budget} />
                    <Field label="Est. Delegate Count" name="guests" id="booking-guests" placeholder="Ex: 250 PAX" />
                 </div>
              </div>

              <div className="space-y-8">
                 <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground border-b border-border pb-4">03. Integrated Logistics</h3>
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {serviceOptions.map((s) => {
                      const checked = selServices.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggle(s)}
                          className={cn(
                            "flex flex-col gap-4 p-5 rounded-2xl border transition-all duration-300 text-left shadow-sm",
                            checked ? "bg-gold/10 border-gold" : "bg-muted border-border hover:border-gold/30"
                          )}
                        >
                          <div className={cn(
                            "h-6 w-6 rounded-lg flex items-center justify-center transition-all shadow-inner",
                            checked ? "bg-gold text-black" : "bg-card text-muted-foreground"
                          )}>
                             <Check size={14} className={checked ? "opacity-100" : "opacity-0"} />
                          </div>
                          <span className={cn("text-[9px] font-black uppercase tracking-widest leading-none", checked ? "text-foreground" : "text-muted-foreground")}>{s}</span>
                        </button>
                      );
                    })}
                 </div>
              </div>

              <div className="space-y-4">
                 <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground border-b border-border pb-4">04. Strategic Mandate</h3>
                 <textarea
                  id="booking-notes"
                  name="notes"
                  rows={6}
                  maxLength={1000}
                  placeholder="Detail your operational requirements, venue preferences, and creative objectives..."
                  className="w-full bg-muted border border-border rounded-[32px] px-8 py-6 text-sm text-foreground focus:border-gold outline-none transition-all placeholder:text-muted-foreground/40"
                 />
              </div>

              <div className="pt-6">
                 <button type="submit" disabled={submitting || (formType === 'public' && !selectedEventId)} className="h-20 w-full sm:w-auto sm:px-16 rounded-full bg-gold text-black font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:scale-[1.02] transition-all shadow-[0_10px_50px_rgba(212,175,55,0.25)] disabled:opacity-50">
                    {submitting ? <Loader2 size={24} className="animate-spin" /> : <>Finalize Project Brief <ArrowRight size={20} /></>}
                 </button>
              </div>
            </form>
          </GlassPanel>
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
