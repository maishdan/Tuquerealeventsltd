import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import {
  Check,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Zap,
  Users,
  MessageSquare,
  Clock,
  Sparkles,
  ChevronDown
} from "lucide-react";
import { createPageSeo } from "../lib/seo";
import { createBooking } from "@/lib/api/bookings";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/booking")({
  head: () =>
    createPageSeo({
      title: "Secure Your Date | Royal Touch Events Nairobi",
      description:
        "Initiate your project strategy with Nairobi's premier event production agency. Request a custom quote and consultation within 24 hours.",
      path: "/booking",
      keywords: "book event Nairobi, wedding booking Kenya, corporate event quote, event inquiry form",
    }),
  component: Booking,
});

const heroImages = [
  "/back/e1.jfif",
  "/back/e2.jfif",
  "/back/e3.jfif",
  "/back/e4.jfif",
  "/back/e5.jfif",
  "/back/e7.jpg",
  "/back/e8.jpg",
  "/back/e9.jpg",
];

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

const eventTypes = ["Corporate Gala", "Luxury Wedding", "Product Launch", "Concert Production", "Milestone Birthday", "VIP Private Event"];
const budgets = ["KSh 500,000 - 1M", "KSh 1M - 5M", "KSh 5M - 15M", "KSh 15M - 50M", "KSh 50M+"];
const serviceOptions = ["Full Production", "Strategic Planning", "Technical AV", "Floral Architecture", "VIP Concierge", "Cinematography"];

function Booking() {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selServices, setSelServices] = useState<string[]>([]);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % heroImages.length);
    }, 60000); // Switch every 1 minute
    return () => clearInterval(timer);
  }, []);

  const toggle = (s: string) =>
    setSelServices((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError("");
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      eventType: String(fd.get("eventType") || ""),
      date: String(fd.get("date") || ""),
      guests: String(fd.get("guests") || ""),
      budget: String(fd.get("budget") || ""),
      services: selServices,
      notes: String(fd.get("notes") || ""),
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
        name: res.data.name,
        email: res.data.email,
        phone: res.data.phone,
        event_type: res.data.eventType,
        event_date: res.data.date,
        guests: res.data.guests,
        budget: res.data.budget,
        services: res.data.services,
        notes: res.data.notes,
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
      <div className="bg-[#0b0e14] min-h-screen flex flex-col items-center justify-center text-white px-4">
        <div className="max-w-xl w-full glass-strong p-12 rounded-[40px] border border-gold/30 text-center space-y-8 animate-in fade-in zoom-in duration-700">
          <div className="mx-auto h-20 w-20 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
            <Check size={40} />
          </div>
          <div className="space-y-4">
            <h1 className="font-display text-5xl md:text-7xl uppercase font-black tracking-tighter">Strategic Brief Received.</h1>
            <p className="text-gray-400 text-lg">A senior producer has been assigned to your inquiry. We will contact you within 12-24 business hours to discuss your blueprint.</p>
          </div>
          <Link to="/" className="inline-flex items-center gap-2 text-gold font-black uppercase tracking-widest text-xs hover:text-white transition-colors">
            Return to Dashboard <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0b0e14] text-white font-sans min-w-0">
      {/* 1. HERO SECTION (MATCHES HOME PAGE) */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-start overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          {heroImages.map((src, idx) => (
            <img
              key={src}
              src={src}
              alt={`Royal Booking Hero ${idx}`}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[3000ms] ease-in-out ${
                idx === currentImgIndex ? "opacity-100 scale-105" : "opacity-0 scale-100"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-[#0b0e14]/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b0e14]/80 via-transparent to-[#0b0e14]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10 w-full text-center mt-12 md:mt-20">
          <div className="max-w-4xl mx-auto bg-[#0b0e14]/60 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-[32px] space-y-8 animate-in fade-in zoom-in duration-1000">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] font-black uppercase tracking-widest">
                  <ShieldCheck size={12} /> Priority Project Request
                </div>
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-[100px] font-black tracking-tighter text-white uppercase leading-[0.85]">
                Secure Your <br />
                <span className="text-gold">Date.</span>
              </h1>
              <p className="max-w-2xl mx-auto text-base md:text-xl text-gray-200 font-medium leading-relaxed">
                Initiate your project strategy with Nairobi's premier event production agency. Provide your requirements below for a comprehensive technical and creative proposal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FORM SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 -mt-32 relative z-20 pb-32">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
           {/* Form Side */}
           <div className="lg:col-span-8">
              <form onSubmit={onSubmit} className="bg-[#121212] border border-white/10 p-8 md:p-16 rounded-[40px] shadow-2xl space-y-12" noValidate>
                {submitError && (
                  <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-4">
                    <Zap size={20} />
                    <p>{submitError}</p>
                  </div>
                )}

                <div className="space-y-8">
                   <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gold border-b border-white/5 pb-4">01. Contact Intelligence</h2>
                   <div className="grid md:grid-cols-2 gap-6">
                      <Field label="Full Legal Name" name="name" id="booking-name" error={errors.name} />
                      <Field label="Professional Email" name="email" id="booking-email" type="email" error={errors.email} />
                      <Field label="Mobile / WhatsApp" name="phone" id="booking-phone" error={errors.phone} />
                      <Field label="Target Event Date" name="date" id="booking-date" type="date" error={errors.date} />
                   </div>
                </div>

                <div className="space-y-8">
                   <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gold border-b border-white/5 pb-4">02. Project Scope</h2>
                   <div className="grid md:grid-cols-2 gap-6">
                      <Select label="Discipline" name="eventType" id="booking-event-type" options={eventTypes} error={errors.eventType} />
                      <Select label="Investment Range" name="budget" id="booking-budget" options={budgets} error={errors.budget} />
                      <Field label="Scale (Est. Guest Count)" name="guests" id="booking-guests" placeholder="Ex: 500+" />
                   </div>
                </div>

                <div className="space-y-8">
                   <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gold border-b border-white/5 pb-4">03. Integrated Services</h2>
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {serviceOptions.map((s) => {
                        const id = `booking-service-${s.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
                        const checked = selServices.includes(s);
                        return (
                          <label
                            key={s}
                            htmlFor={id}
                            className={`cursor-pointer group flex flex-col gap-4 p-6 rounded-2xl border transition-all duration-300 ${
                              checked ? "bg-gold/10 border-gold shadow-lg" : "bg-white/[0.02] border-white/5 hover:border-gold/30"
                            }`}
                          >
                            <input
                              id={id}
                              type="checkbox"
                              className="sr-only"
                              checked={checked}
                              onChange={() => toggle(s)}
                            />
                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all ${checked ? "bg-gold text-[#0b0e14]" : "bg-white/5 text-gray-500"}`}>
                               <Check size={16} className={checked ? "opacity-100" : "opacity-0"} />
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${checked ? "text-white" : "text-gray-500"}`}>{s}</span>
                          </label>
                        );
                      })}
                   </div>
                </div>

                <div className="space-y-4 pt-8">
                   <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gold border-b border-white/5 pb-4">04. Strategic Vision</h2>
                   <textarea
                    id="booking-notes"
                    name="notes"
                    rows={6}
                    maxLength={1000}
                    placeholder="Briefly describe your objectives, venue preferences, and any technical requirements..."
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-[32px] px-8 py-6 text-sm text-white focus:border-gold outline-none transition-all"
                   />
                </div>

                <button type="submit" disabled={submitting} className="w-full h-20 rounded-full bg-gold text-[#0b0e14] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:scale-[1.02] transition-all shadow-[0_0_50px_rgba(212,175,55,0.2)] disabled:opacity-50">
                  {submitting ? <Loader2 size={24} className="animate-spin" /> : <>Submit Strategic Brief <ArrowRight size={20} /></>}
                </button>
              </form>
           </div>

           {/* Sidebar Info */}
           <div className="lg:col-span-4 space-y-8">
              <div className="bg-[#121212] border border-white/10 p-10 rounded-[40px] space-y-8">
                 <div className="flex items-center gap-4 text-gold">
                    <Clock size={24} />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">Response Time</h3>
                 </div>
                 <p className="text-3xl font-black text-white">Under 24 Hours</p>
                 <p className="text-gray-500 text-sm leading-relaxed">Our executive coordination team reviews every brief within one business day to ensure alignment with our production standards.</p>
              </div>

              <div className="bg-[#1a2b4b]/20 border border-blue-500/20 p-10 rounded-[40px] space-y-8 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Sparkles size={120} />
                 </div>
                 <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4 text-blue-400">
                       <ShieldCheck size={24} />
                       <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">Privacy Shield</h3>
                    </div>
                    <p className="text-white font-bold leading-relaxed">Your data and event details are managed with 100% executive discretion.</p>
                    <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest">
                       <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                       Encryption Active
                    </div>
                 </div>
              </div>

              <div className="p-10 space-y-6">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Need Immediate Support?</h4>
                 <div className="space-y-4">
                    <a href="tel:+254795365334" className="flex items-center gap-4 text-white hover:text-gold transition-colors">
                       <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center"><MessageSquare size={16} /></div>
                       <span className="text-xs font-bold">+254 795 365 334</span>
                    </a>
                 </div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}

function Field({ label, name, id, type = "text", placeholder, error }: { label: string; name: string; id: string; type?: string; placeholder?: string; error?: string }) {
  return (
    <div className="space-y-3">
      <label htmlFor={id} className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        maxLength={255}
        className="w-full h-16 bg-[#1a1a1a] border border-white/5 rounded-2xl px-6 text-sm text-white focus:border-gold outline-none transition-all placeholder:text-gray-700"
      />
      {error && <p className="mt-2 text-[10px] font-bold text-destructive uppercase tracking-widest ml-4">{error}</p>}
    </div>
  );
}

function Select({ label, name, id, options, error }: { label: string; name: string; id: string; options: string[]; error?: string }) {
  return (
    <div className="space-y-3">
      <label htmlFor={id} className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">{label}</label>
      <div className="relative">
        <select id={id} name={name} defaultValue="" aria-label={label} className="w-full h-16 bg-[#1a1a1a] border border-white/5 rounded-2xl px-6 text-sm text-white focus:border-gold outline-none appearance-none cursor-pointer">
          <option value="" disabled>Select...</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gold pointer-events-none" size={18} />
      </div>
      {error && <p className="mt-2 text-[10px] font-bold text-destructive uppercase tracking-widest ml-4">{error}</p>}
    </div>
  );
}
