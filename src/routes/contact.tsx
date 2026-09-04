import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Check,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Globe,
  Clock,
  MessageSquare,
  Sparkles,
  Zap,
  Building2
} from "lucide-react";
import { createPageSeo } from "../lib/seo";
import { createContactInquiry } from "@/lib/api/contact";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/contact")({
  head: () =>
    createPageSeo({
      title: "Executive Consultation & Contact | Royal Touch Events Nairobi",
      description:
        "Connect with Nairobi's premier event production agency. Professional inquiry management and executive consultation for high-stakes projects.",
      path: "/contact",
      keywords: "contact event planner Nairobi, Royal Touch Events phone, WhatsApp event booking Kenya",
    }),
  component: Contact,
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
  name: z.string().trim().min(2, "Name required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  message: z.string().trim().min(5, "Message too short").max(1000),
});

const phone = "254795365334";

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % heroImages.length);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

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
      res.error.issues.forEach((i) => {
        errs[String(i.path[0])] = i.message;
      });
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
    <div className="relative min-w-0 bg-[#f8fafc] dark:bg-[#0b0e14] text-foreground font-sans overflow-x-hidden transition-colors duration-300">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[55vh] flex flex-col items-center justify-start overflow-hidden pt-12 pb-16 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b0e14]">
        <div className="absolute inset-0 z-0">
          {heroImages.map((src, idx) => (
            <img
              key={src}
              src={src}
              alt="Royal Contact Hero"
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-[2500ms] ease-in-out scale-105",
                idx === currentImgIndex ? "opacity-15 dark:opacity-25" : "opacity-0"
              )}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-slate-50/95 to-[#f8fafc] dark:from-[#0b0e14]/90 dark:via-[#0b0e14]/95 dark:to-[#0b0e14]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10 w-full text-center mt-12 md:mt-16 space-y-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-none bg-gold/10 border border-gold/40 text-gold text-[10px] font-black uppercase tracking-[0.3em] shadow-sm">
                <Globe size={14} className="text-gold" /> Regional Command Center · Nairobi HQ
              </div>
            </div>

            <h1 className="text-4xl sm:text-7xl lg:text-[90px] font-black tracking-tighter uppercase leading-[0.88] text-[#0b0e14] dark:text-white">
              Direct <br />
              <span className="text-gold font-display font-normal">Connection.</span>
            </h1>

            <p className="max-w-2xl mx-auto text-sm sm:text-lg md:text-xl font-medium text-slate-700 dark:text-gray-300 leading-relaxed">
              Connect with our executive coordination team for high-stakes projects. We ensure a professional and rapid response to all qualified inquiries.
            </p>
          </div>
        </div>
      </section>

      {/* 2. CONTACT CHANNELS & FORM SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20 relative z-20">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Channel Info Side */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-[#121722] border border-slate-200 dark:border-white/10 p-8 sm:p-10 rounded-none space-y-8 shadow-xl">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Official Communications</p>
                <h2 className="text-3xl font-black uppercase tracking-tight text-[#0b0e14] dark:text-white">
                  Executive Channels
                </h2>
              </div>

              <div className="space-y-4">
                <ContactItem icon={Phone} label="Executive Direct Line" val="+254 795 365 334" href="tel:+254795365334" />
                <ContactItem icon={MessageCircle} label="WhatsApp Concierge" val="Chat Live with Producer" href={`https://wa.me/${phone}`} gold />
                <ContactItem icon={Mail} label="Official Email" val="eventsroyaltouch7@gmail.com" href="mailto:eventsroyaltouch7@gmail.com" />
                <ContactItem icon={MapPin} label="Regional Headquarters" val="Upper Hill, Nairobi, Kenya" />
              </div>
            </div>

            {/* Embedded Location Map */}
            <div className="rounded-none overflow-hidden border border-slate-200 dark:border-white/10 aspect-video grayscale opacity-90 hover:grayscale-0 transition-all duration-500 shadow-lg">
              <iframe
                title="Royal Touch Events Location"
                src="https://www.google.com/maps?q=Nairobi%2C%20Kenya&output=embed"
                loading="lazy"
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="bg-white dark:bg-[#121722] border border-gold/40 p-12 sm:p-16 rounded-none text-center flex flex-col items-center justify-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-500">
                <div className="h-20 w-20 rounded-none bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
                  <Check size={40} />
                </div>
                <div className="space-y-3">
                  <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0b0e14] dark:text-white">
                    Inquiry Dispatched.
                  </h2>
                  <p className="text-slate-600 dark:text-gray-300 text-sm max-w-md mx-auto leading-relaxed">
                    Our coordination team has received your communication and will provide an executive proposal within 12-24 business hours.
                  </p>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="h-12 px-8 bg-gold text-black font-black uppercase tracking-widest text-[10px] rounded-none hover:bg-black hover:text-white transition-all shadow-md cursor-pointer"
                >
                  Send Another Communication
                </button>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                className="bg-white dark:bg-[#121722] border border-slate-200 dark:border-white/10 p-8 sm:p-12 rounded-none shadow-xl space-y-8"
                noValidate
              >
                <div className="space-y-2 border-b border-slate-200 dark:border-white/10 pb-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Strategic Brief</p>
                  <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#0b0e14] dark:text-white">
                    Dispatch A Message
                  </h2>
                </div>

                {submitError && (
                  <div className="p-5 rounded-none bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-bold flex items-center gap-3">
                    <ShieldCheck size={20} />
                    <p>{submitError}</p>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <ContactField label="Professional Name" name="name" id="contact-name" error={errors.name} />
                    <ContactField label="Official Email" name="email" id="contact-email" type="email" error={errors.email} />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="contact-message" className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground block">
                      Strategic Message / Project Brief
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={6}
                      maxLength={1000}
                      placeholder="Describe your event parameters, date, and technical requirements..."
                      className="w-full bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-none px-5 py-4 text-xs font-bold text-foreground focus:border-gold outline-none transition-all placeholder:text-muted-foreground/40"
                    />
                    {errors.message && <p className="text-[9px] font-bold text-rose-500 uppercase tracking-widest">{errors.message}</p>}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-16 rounded-none bg-gold text-black font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-black hover:text-gold transition-all shadow-xl shadow-gold/20 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? <Loader2 size={20} className="animate-spin" /> : <>Dispatch Message <ArrowRight size={18} /></>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactItem({ icon: Icon, label, val, href, gold }: { icon: any; label: string; val: string; href?: string; gold?: boolean }) {
  const content = (
    <div
      className={cn(
        "group flex items-center gap-5 p-5 rounded-none border transition-all duration-300",
        gold
          ? "bg-gold/10 border-gold/40 shadow-sm"
          : "bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/10 hover:border-gold"
      )}
    >
      <div
        className={cn(
          "h-11 w-11 rounded-none flex items-center justify-center transition-all shrink-0",
          gold ? "bg-gold text-black font-black" : "bg-gold/10 text-gold group-hover:bg-gold group-hover:text-black"
        )}
      >
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">{label}</p>
        <p className="text-xs font-bold text-foreground uppercase tracking-tight truncate">{val}</p>
      </div>
    </div>
  );

  return href ? (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="block">
      {content}
    </a>
  ) : (
    <div className="block">{content}</div>
  );
}

function ContactField({ label, name, id, type = "text", error }: { label: string; name: string; id: string; type?: string; error?: string }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground block">{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        maxLength={255}
        placeholder={`Enter ${label.toLowerCase()}`}
        className="w-full h-14 bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-none px-5 text-xs font-bold text-foreground focus:border-gold outline-none transition-all placeholder:text-muted-foreground/40"
      />
      {error && <p className="text-[9px] font-bold text-rose-500 uppercase tracking-widest">{error}</p>}
    </div>
  );
}
