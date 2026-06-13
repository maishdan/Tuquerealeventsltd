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
  Sparkles
} from "lucide-react";
import { createPageSeo } from "../lib/seo";
import { createContactInquiry } from "@/lib/api/contact";

export const Route = createFileRoute("/contact")({
  head: () =>
    createPageSeo({
      title: "Executive Consultation | Royal Touch Events Nairobi",
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

function Contact() {
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
    <div className="bg-[#0b0e14] text-white font-sans min-w-0">
      {/* 1. HERO SECTION (MATCHES HOME PAGE) */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-start overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          {heroImages.map((src, idx) => (
            <img
              key={src}
              src={src}
              alt={`Royal Contact Hero ${idx}`}
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
                  <Globe size={12} /> Regional Headquarters
                </div>
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-[100px] font-black tracking-tighter text-white uppercase leading-[0.85]">
                Direct <br />
                <span className="text-gold">Connection.</span>
              </h1>
              <p className="max-w-2xl mx-auto text-base md:text-xl text-gray-200 font-medium leading-relaxed">
                Connect with our executive coordination team for high-stakes projects. We ensure a professional and rapid response to all qualified inquiries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CONTACT SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-12 relative z-20 pb-32">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Channel Info Side */}
          <div className="lg:col-span-5 space-y-6">
             <div className="bg-[#121212] border border-white/10 p-10 rounded-[40px] space-y-10">
                <div className="space-y-2">
                   <p className="text-gold text-[10px] font-black uppercase tracking-[0.4em]">Official Channels</p>
                   <h2 className="font-display text-4xl text-white font-black uppercase tracking-tighter">Reach Out.</h2>
                </div>

                <div className="space-y-6">
                   <ContactItem icon={Phone} label="Executive Line" val="+254 795 365 334" href="tel:+254795365334" />
                   <ContactItem icon={MessageCircle} label="WhatsApp Concierge" val="Chat Live Now" href={`https://wa.me/${phone}`} gold />
                   <ContactItem icon={Mail} label="Professional Email" val="eventsroyaltouch7@gmail.com" href="mailto:eventsroyaltouch7@gmail.com" />
                   <ContactItem icon={MapPin} label="Operational Hub" val="Upper Hill, Nairobi, Kenya" />
                </div>
             </div>

             <div className="rounded-[40px] overflow-hidden border border-white/10 aspect-video grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-700 shadow-2xl">
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
               <div className="h-full bg-emerald-500/5 border border-emerald-500/20 p-16 rounded-[40px] text-center flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in duration-500">
                  <div className="h-20 w-20 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
                     <Check size={40} />
                  </div>
                  <div className="space-y-4">
                     <h2 className="font-display text-5xl text-white font-black uppercase tracking-tighter">Inquiry Secured.</h2>
                     <p className="text-gray-400 text-lg max-w-md">Our team has received your communication and will provide an executive response within one business day.</p>
                  </div>
                  <button onClick={() => setSubmitted(false)} className="text-gold font-black uppercase tracking-widest text-xs hover:text-white transition-colors">Send Another Message</button>
               </div>
             ) : (
               <form onSubmit={onSubmit} className="bg-[#121212] border border-white/10 p-10 md:p-16 rounded-[40px] shadow-2xl space-y-12" noValidate>
                 <div className="space-y-2">
                    <p className="text-gold text-[10px] font-black uppercase tracking-[0.4em]">Strategic Inquiry</p>
                    <h2 className="font-display text-4xl text-white font-black uppercase tracking-tighter">Message the Firm.</h2>
                 </div>

                 {submitError && (
                   <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-4">
                     <ShieldCheck size={20} />
                     <p>{submitError}</p>
                   </div>
                 )}

                 <div className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-6">
                       <ContactField label="Professional Name" name="name" id="contact-name" error={errors.name} />
                       <ContactField label="Official Email" name="email" id="contact-email" type="email" error={errors.email} />
                    </div>
                    <div className="space-y-3">
                       <label htmlFor="contact-message" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">Strategic Brief / Message</label>
                       <textarea
                        id="contact-message"
                        name="message"
                        rows={6}
                        maxLength={1000}
                        placeholder="How can our production team assist your project?"
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-[32px] px-8 py-6 text-sm text-white focus:border-gold outline-none transition-all"
                       />
                       {errors.message && <p className="mt-2 text-[10px] font-bold text-destructive uppercase tracking-widest ml-4">{errors.message}</p>}
                    </div>
                 </div>

                 <button type="submit" disabled={submitting} className="w-full h-20 rounded-full bg-gold text-[#0b0e14] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:scale-[1.02] transition-all shadow-[0_0_50px_rgba(212,175,55,0.2)] disabled:opacity-50">
                   {submitting ? <Loader2 size={24} className="animate-spin" /> : <>Dispatch Message <ArrowRight size={20} /></>}
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
    <div className={`group flex items-center gap-6 p-6 rounded-3xl border transition-all duration-300 ${gold ? "bg-gold/10 border-gold shadow-lg" : "bg-white/[0.02] border-white/5 hover:border-gold/30"}`}>
       <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all ${gold ? "bg-gold text-[#0b0e14]" : "bg-white/5 text-gold group-hover:bg-gold group-hover:text-[#0b0e14]"}`}>
          <Icon size={20} />
       </div>
       <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1">{label}</p>
          <p className="text-sm font-bold text-white uppercase tracking-tight">{val}</p>
       </div>
    </div>
  );

  return href ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="block">{content}</a> : <div className="block">{content}</div>;
}

function ContactField({ label, name, id, type = "text", error }: { label: string; name: string; id: string; type?: string; error?: string }) {
  return (
    <div className="space-y-3">
      <label htmlFor={id} className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        maxLength={255}
        placeholder={`Enter ${label.toLowerCase()}`}
        className="w-full h-16 bg-[#1a1a1a] border border-white/5 rounded-2xl px-6 text-sm text-white focus:border-gold outline-none transition-all placeholder:text-gray-700"
      />
      {error && <p className="mt-2 text-[10px] font-bold text-destructive uppercase tracking-widest ml-4">{error}</p>}
    </div>
  );
}
