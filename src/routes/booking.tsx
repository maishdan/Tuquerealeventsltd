import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Check } from "lucide-react";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "Book an Event — Lumiere Events" },
      { name: "description", content: "Tell us about your event and we'll send a tailored quote within 24 hours." },
      { property: "og:title", content: "Book an Event — Lumiere Events" },
      { property: "og:description", content: "Start your event inquiry." },
      { property: "og:url", content: "/booking" },
    ],
    links: [{ rel: "canonical", href: "/booking" }],
  }),
  component: Booking,
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

const eventTypes = ["Wedding", "Corporate Event", "Birthday", "Concert", "Conference", "Product Launch", "Other"];
const budgets = ["Under $2,000", "$2,000 – $5,000", "$5,000 – $15,000", "$15,000 – $50,000", "$50,000+"];
const serviceOptions = ["Decoration", "Sound & Lighting", "Photography", "Videography", "MC / Entertainment", "Catering Coordination", "Full Planning"];

function Booking() {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selServices, setSelServices] = useState<string[]>([]);

  const toggle = (s: string) =>
    setSelServices((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-32 text-center">
        <div className="mx-auto h-16 w-16 rounded-full bg-gold/20 text-gold flex items-center justify-center">
          <Check size={28} />
        </div>
        <h1 className="mt-6 font-display text-4xl md:text-5xl">Thank you.</h1>
        <p className="mt-4 text-muted-foreground">Your inquiry has been received. A planner will be in touch within 24 hours.</p>
      </section>
    );
  }

  return (
    <>
      <section className="mx-auto max-w-4xl px-6 pt-24 pb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Book your event</p>
        <h1 className="font-display text-5xl md:text-6xl leading-[1.05]">
          Tell us your <span className="text-gradient-gold">vision</span>.
        </h1>
        <p className="mt-4 text-muted-foreground text-lg">Share a few details and we'll respond with a tailored quote.</p>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24">
        <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card/60 p-6 md:p-10 space-y-6">
          <div className="grid md:grid-cols-2 gap-5">
            <Field label="Full Name" name="name" error={errors.name} />
            <Field label="Email" name="email" type="email" error={errors.email} />
            <Field label="Phone / WhatsApp" name="phone" error={errors.phone} />
            <Field label="Event Date" name="date" type="date" error={errors.date} />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <Select label="Event Type" name="eventType" options={eventTypes} error={errors.eventType} />
            <Select label="Budget Range" name="budget" options={budgets} error={errors.budget} />
          </div>

          <Field label="Expected Guests" name="guests" placeholder="Optional" />

          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Services Needed</label>
            <div className="mt-3 flex flex-wrap gap-2">
              {serviceOptions.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => toggle(s)}
                  className={`px-4 py-2 rounded-full text-xs border transition ${
                    selServices.includes(s) ? "bg-gold text-background border-gold" : "border-border text-muted-foreground hover:border-gold/60"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Notes</label>
            <textarea name="notes" rows={4} maxLength={1000} className="mt-2 w-full rounded-xl bg-background/60 border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold/60" placeholder="Tell us anything else about your event..." />
          </div>

          <button type="submit" className="w-full md:w-auto inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition">
            Submit Inquiry
          </button>
        </form>
      </section>
    </>
  );
}

function Field({ label, name, type = "text", placeholder, error }: { label: string; name: string; type?: string; placeholder?: string; error?: string }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        maxLength={255}
        className="mt-2 w-full rounded-xl bg-background/60 border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold/60"
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Select({ label, name, options, error }: { label: string; name: string; options: string[]; error?: string }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <select name={name} defaultValue="" className="mt-2 w-full rounded-xl bg-background/60 border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold/60">
        <option value="" disabled>Select...</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
