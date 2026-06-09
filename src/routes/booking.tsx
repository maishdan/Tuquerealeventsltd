import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Check, Loader2 } from "lucide-react";
import { createPageSeo } from "../lib/seo";
import { createBooking } from "@/lib/api/bookings";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/booking")({
  head: () =>
    createPageSeo({
      title: "Book an Event — Free Quote Within 24 Hours",
      description:
        "Book your wedding, corporate event, concert or private party with Royal Touch Events. Share your vision and receive a tailored quote within 24 hours.",
      path: "/booking",
      keywords: "book event Nairobi, wedding booking Kenya, corporate event quote, event inquiry form",
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
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selServices, setSelServices] = useState<string[]>([]);

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
      <section className="mx-auto max-w-2xl px-4 sm:px-6 py-32 text-center">
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
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pt-24 pb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Book your event</p>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.05]">
          Tell us your <span className="text-gradient-gold">vision</span>.
        </h1>
        <p className="mt-4 text-muted-foreground text-lg">Share a few details and we'll respond with a tailored quote.</p>
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 pb-24">
        <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card/60 p-6 md:p-10 space-y-6" noValidate>
          {submitError && (
            <p className="text-sm text-destructive rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3">{submitError}</p>
          )}
          <div className="grid md:grid-cols-2 gap-5">
            <Field label="Full Name" name="name" id="booking-name" error={errors.name} />
            <Field label="Email" name="email" id="booking-email" type="email" error={errors.email} />
            <Field label="Phone / WhatsApp" name="phone" id="booking-phone" error={errors.phone} />
            <Field label="Event Date" name="date" id="booking-date" type="date" error={errors.date} />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <Select label="Event Type" name="eventType" id="booking-event-type" options={eventTypes} error={errors.eventType} />
            <Select label="Budget Range" name="budget" id="booking-budget" options={budgets} error={errors.budget} />
          </div>

          <Field label="Expected Guests" name="guests" id="booking-guests" placeholder="Optional" />

          <fieldset className="border-0 p-0 m-0 min-w-0">
            <legend className="text-xs uppercase tracking-widest text-muted-foreground">Services Needed</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {serviceOptions.map((s) => {
                const id = `booking-service-${s.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
                const checked = selServices.includes(s);
                return (
                  <label
                    key={s}
                    htmlFor={id}
                    className={`cursor-pointer px-4 py-2 rounded-full text-xs border transition ${
                      checked ? "bg-gold text-background border-gold" : "border-border text-muted-foreground hover:border-gold/60"
                    }`}
                  >
                    <input
                      id={id}
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => toggle(s)}
                    />
                    {s}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div>
            <label htmlFor="booking-notes" className="text-xs uppercase tracking-widest text-muted-foreground">Notes</label>
            <textarea id="booking-notes" name="notes" rows={4} maxLength={1000} placeholder="Tell us anything else about your event..." className="mt-2 w-full rounded-xl bg-background/60 border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold/60" />
          </div>

          <button type="submit" disabled={submitting} className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition disabled:opacity-60">
            {submitting && <Loader2 size={16} className="animate-spin" />}
            Submit Inquiry
          </button>
        </form>
      </section>
    </>
  );
}

function Field({ label, name, id, type = "text", placeholder, error }: { label: string; name: string; id: string; type?: string; placeholder?: string; error?: string }) {
  return (
    <div>
      <label htmlFor={id} className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <input
        id={id}
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

function Select({ label, name, id, options, error }: { label: string; name: string; id: string; options: string[]; error?: string }) {
  return (
    <div>
      <label htmlFor={id} className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <select id={id} name={name} defaultValue="" aria-label={label} className="mt-2 w-full rounded-xl bg-background/60 border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold/60">
        <option value="" disabled>Select...</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
