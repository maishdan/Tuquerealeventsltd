import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Phone, Mail, MapPin, MessageCircle, Check, Loader2 } from "lucide-react";
import { createPageSeo } from "../lib/seo";
import { createContactInquiry } from "@/lib/api/contact";

export const Route = createFileRoute("/contact")({
  head: () =>
    createPageSeo({
      title: "Contact Us — Nairobi Event Planners",
      description:
        "Contact Royal Touch Events in Nairobi. Call +254 795 365 334, email eventsroyaltouch7@gmail.com, or chat on WhatsApp for weddings, corporate events and concerts.",
      path: "/contact",
      keywords: "contact event planner Nairobi, Royal Touch Events phone, WhatsApp event booking Kenya",
    }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(5).max(1000),
});

const phone = "254795365334";

function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError("");
    const fd = new FormData(e.currentTarget);
    const res = schema.safeParse({
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      message: String(fd.get("message") || ""),
    });
    if (!res.success) {
      const errs: Record<string, string> = {};
      res.error.issues.forEach((i) => { errs[String(i.path[0])] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      await createContactInquiry(res.data);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Could not send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-24 pb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Contact</p>
        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl leading-[1] max-w-3xl">
          Let's start a <span className="text-gradient-gold">conversation</span>.
        </h1>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-24 grid lg:grid-cols-2 gap-10">
        <div className="space-y-5">
          <ContactRow icon={Phone} label="Call us" value="+254 795 365 334" href="tel:+254795365334" />
          <ContactRow icon={MessageCircle} label="WhatsApp" value="Chat with a planner" href={`https://wa.me/${phone}`} accent />
          <ContactRow icon={Mail} label="Email" value="eventsroyaltouch7@gmail.com" href="mailto:eventsroyaltouch7@gmail.com" />
          <ContactRow icon={MapPin} label="Studio" value="Nairobi, Kenya" />

          <div className="rounded-2xl overflow-hidden border border-border aspect-video contact-map-embed">
            <iframe
              title="Royal Touch Events Location"
              src="https://www.google.com/maps?q=Nairobi%2C%20Kenya&output=embed"
              loading="lazy"
              className="w-full h-full"
            />
          </div>
        </div>

        <div>
          {submitted ? (
            <div className="rounded-2xl border border-border bg-card/60 p-10 text-center">
              <div className="mx-auto h-14 w-14 rounded-full bg-gold/20 text-gold flex items-center justify-center"><Check size={24} /></div>
              <h2 className="mt-5 font-display text-3xl">Message sent</h2>
              <p className="mt-3 text-muted-foreground">We'll reply within one business day.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card/60 p-8 space-y-5" noValidate>
              {submitError && (
                <p className="text-sm text-destructive rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3">{submitError}</p>
              )}
              <div>
                <label htmlFor="contact-name" className="text-xs uppercase tracking-widest text-muted-foreground">Name</label>
                <input id="contact-name" name="name" maxLength={100} placeholder="Your name" className="mt-2 w-full rounded-xl bg-background/60 border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold/60" />
                {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="contact-email" className="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
                <input id="contact-email" name="email" type="email" maxLength={255} placeholder="you@example.com" className="mt-2 w-full rounded-xl bg-background/60 border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold/60" />
                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="contact-message" className="text-xs uppercase tracking-widest text-muted-foreground">Message</label>
                <textarea id="contact-message" name="message" rows={5} maxLength={1000} placeholder="How can we help?" className="mt-2 w-full rounded-xl bg-background/60 border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold/60" />
                {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
              </div>
              <button type="submit" disabled={submitting} className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition disabled:opacity-60">
                {submitting && <Loader2 size={16} className="animate-spin" />}
                Send Message
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

function ContactRow({ icon: Icon, label, value, href, accent }: { icon: React.ComponentType<{ size?: number }>; label: string; value: string; href?: string; accent?: boolean }) {
  const inner = (
    <div className={`flex items-center gap-4 rounded-2xl border p-5 transition ${accent ? "border-gold/40 bg-gold/5 hover:bg-gold/10" : "border-border bg-card/60 hover:border-gold/40"}`}>
      <div className="h-11 w-11 rounded-full bg-primary/15 text-gold flex items-center justify-center"><Icon size={18} /></div>
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="font-display text-lg">{value}</p>
      </div>
    </div>
  );
  return href ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">{inner}</a> : inner;
}
