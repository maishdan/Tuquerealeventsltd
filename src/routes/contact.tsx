import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Phone, Mail, MapPin, MessageCircle, Check } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Royal Touch Events" },
      { name: "description", content: "Reach Royal Touch Events by phone, email, WhatsApp, or visit our Nairobi studio." },
      { property: "og:title", content: "Contact Us — Royal Touch Events" },
      { property: "og:description", content: "Get in touch with our team." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
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
  const [errors, setErrors] = useState<Record<string, string>>({});

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
    setSubmitted(true);
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

          <div className="rounded-2xl overflow-hidden border border-border aspect-video">
            <iframe
              title="Royal Touch Events Location"
              src="https://www.google.com/maps?q=Nairobi%2C%20Kenya&output=embed"
              loading="lazy"
              className="w-full h-full"
              style={{ filter: "grayscale(0.4) invert(0.9) hue-rotate(180deg)" }}
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
            <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card/60 p-8 space-y-5">
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Name</label>
                <input name="name" maxLength={100} className="mt-2 w-full rounded-xl bg-background/60 border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold/60" />
                {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
                <input name="email" type="email" maxLength={255} className="mt-2 w-full rounded-xl bg-background/60 border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold/60" />
                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Message</label>
                <textarea name="message" rows={5} maxLength={1000} className="mt-2 w-full rounded-xl bg-background/60 border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold/60" />
                {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
              </div>
              <button type="submit" className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition">
                Send Message
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

function ContactRow({ icon: Icon, label, value, href, accent }: { icon: any; label: string; value: string; href?: string; accent?: boolean }) {
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
