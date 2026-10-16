import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Users,
  Target,
  Award,
  Clock,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Building2,
  History,
  Star,
  Globe
} from "lucide-react";
import decor from "../assets/gallery-decor.jpg";
import corporate from "../assets/gallery-corporate.jpg";
import { createPageSeo } from "../lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/about")({
  head: () =>
    createPageSeo({
      title: "Our Story & Philosophy | TOQUE REAL EVENTS LIMITED Nairobi",
      description:
        "Learn about TOQUE REAL EVENTS LIMITED's 15-year legacy of excellence in Nairobi. Discover our strategic approach to luxury event production and our commitment to ultimate client service.",
      path: "/about",
      keywords: "about TOQUE REAL EVENTS LIMITED, event company Nairobi, luxury event production Kenya",
    }),
  component: About,
});

const legacyStats = [
  { n: "1,200+", l: "Projects Delivered", desc: "Corporate summits, weddings & festivals" },
  { n: "15 Yrs", l: "Executive Mastery", desc: "Established in 2011 in Nairobi" },
  { n: "100%", l: "Technical Uptime", desc: "Zero-failure power & AV redundancy" },
  { n: "65+", l: "Corporate Partners", desc: "Trusted by Safaricom, KCB & UNEP" },
];

const corePrinciples = [
  {
    icon: HeartHandshake,
    title: "Client-First Protocol",
    desc: "Your strategic objectives define our primary operational directive from brief to post-event breakdown.",
  },
  {
    icon: Zap,
    title: "Instant Concierge Response",
    desc: "Guaranteed 12-24 business hour proposal turnaround with 24/7 dedicated producer access.",
  },
  {
    icon: Target,
    title: "Micro-Logistics Precision",
    desc: "Every floral arrangement, lighting cue, and delegate path is mapped with military precision.",
  },
  {
    icon: Award,
    title: "Top 5% Vendor Synergy",
    desc: "We curate and manage only the highest certified catering, security, and AV partners in East Africa.",
  },
];

const teamSpecialties = [
  { role: "Executive Producers", detail: "Strategic Lead & Budget Governance" },
  { role: "Creative Directors", detail: "Aesthetic Blueprint & Structural Design" },
  { role: "Technical Leads", detail: "Stadium Audio, Rigging & Live Streaming" },
  { role: "Gate Operations Leads", detail: "Encrypted M-Pesa QR Ticket Check-in" },
];

function About() {
  return (
    <div className="relative min-w-0 bg-[#0b0e14] bg-[url('/ltd.png')] bg-cover bg-center bg-fixed text-foreground font-sans overflow-x-hidden transition-colors duration-300">
      {/* 1. HERO / LEGACY HEADER */}
      <section className="relative pt-24 pb-20 border-b border-white/10 bg-[#0b0e14]/85 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10 text-center space-y-8">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-none bg-gold/10 border border-gold/40 text-gold text-[10px] font-black uppercase tracking-[0.3em] shadow-sm">
              <History size={14} className="text-gold" /> Established Production Intelligence · Since 2011
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-7xl lg:text-[90px] font-black tracking-tighter uppercase leading-[0.88] text-[#0b0e14] dark:text-white">
              Building Legacies Through <br />
              <span className="text-gold font-display font-normal">Exceptional</span> Production.
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-lg md:text-xl font-medium text-slate-700 dark:text-gray-300 leading-relaxed">
              For over 15 years, TOQUE REAL EVENTS LIMITED has stood as East Africa's premier authority in luxury event production. We engineer corporate milestones and private celebrations with unyielding precision.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link
              to="/booking"
              className="h-16 px-12 rounded-none bg-gold text-black font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#0b0e14] hover:text-gold transition-all duration-300 shadow-xl shadow-gold/20 w-full sm:w-auto"
            >
              Inquire Strategy Brief <ArrowRight size={18} />
            </Link>
            <Link
              to="/portfolio"
              className="h-16 px-12 rounded-none border border-slate-300 dark:border-white/10 bg-white/80 dark:bg-white/5 text-foreground font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center hover:border-gold hover:text-gold transition-all duration-300 w-full sm:w-auto gap-3 shadow-sm"
            >
              Explore Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR (SHARP EDGES & HIGH CONTRAST) */}
      <section className="py-16 bg-slate-100 dark:bg-[#121722] border-b border-slate-200 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {legacyStats.map((stat, i) => (
              <div key={i} className="bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/10 p-6 rounded-none space-y-1 shadow-sm text-center">
                <p className="text-3xl sm:text-4xl font-black text-gold font-mono">{stat.n}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#0b0e14] dark:text-white">{stat.l}</p>
                <p className="text-[10px] text-slate-500 dark:text-gray-400 font-medium">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. BUSINESS PROMISE & PRINCIPLES */}
      <section className="py-24 bg-white dark:bg-[#0b0e14] border-b border-slate-200 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative">
              <div className="relative overflow-hidden rounded-none border border-slate-200 dark:border-white/10 shadow-2xl">
                <img src={corporate} alt="Executive Event Production" className="w-full h-[480px] object-cover grayscale opacity-90 hover:grayscale-0 transition-all duration-700" />
                <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/95 dark:bg-[#0d121c]/95 border border-gold/40 rounded-none shadow-xl flex items-center gap-4">
                  <div className="h-12 w-12 rounded-none bg-gold text-black flex items-center justify-center shrink-0">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-foreground">Absolute Reliability Standard</p>
                    <p className="text-[11px] text-muted-foreground">Certified 100% Technical & Logistics Redundancy</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">The TOQUE REAL Edge</p>
                <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0b0e14] dark:text-white leading-tight">
                  Professionalism Without Compromise
                </h2>
                <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed font-medium">
                  Founded on integrity and artistic innovation, our agency has evolved into a strategic partner for multinational corporations, luxury wedding couples, and public concert organizers.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 pt-2">
                {corePrinciples.map((item, i) => (
                  <div key={i} className="p-6 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-none space-y-3 shadow-sm hover:border-gold transition-all">
                    <item.icon size={22} className="text-gold" />
                    <h4 className="font-black text-xs uppercase tracking-widest text-foreground">{item.title}</h4>
                    <p className="text-[11px] text-slate-600 dark:text-gray-400 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MISSION & VISION TILES */}
      <section className="py-24 bg-slate-50 dark:bg-[#0d121c]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-10 sm:p-12 bg-white dark:bg-[#121722] border border-gold/40 rounded-none space-y-6 shadow-xl relative overflow-hidden">
              <div className="h-12 w-12 rounded-none bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                <Target size={24} />
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gold">Operational Objective</p>
                <h3 className="text-2xl font-black uppercase tracking-tight text-foreground">Strategic Mission</h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed font-medium italic">
                "To engineer moments of high impact through impeccable design, technical precision, and rigorous operational standards—ensuring every client project serves as an industry benchmark."
              </p>
            </div>

            <div className="p-10 sm:p-12 bg-white dark:bg-[#121722] border border-gold/40 rounded-none space-y-6 shadow-xl relative overflow-hidden">
              <div className="h-12 w-12 rounded-none bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                <Sparkles size={24} />
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gold">2030 Roadmap</p>
                <h3 className="text-2xl font-black uppercase tracking-tight text-foreground">Future Vision</h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed font-medium italic">
                "To remain East Africa's most trusted authority in luxury event production and gate ticketing technology—continuously redefining experiential marketing and celebration."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRODUCTION LEADERSHIP TEAM TILES */}
      <section className="py-24 bg-white dark:bg-[#0b0e14] border-t border-slate-200 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Expert Human Capital</p>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0b0e14] dark:text-white">
              Driven By Mastery
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 font-medium max-w-lg mx-auto">
              Our team consists of senior planners, creative directors, audio engineers, and gate security leads united by an obsession for perfection.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamSpecialties.map((item, i) => (
              <div
                key={i}
                className="p-8 bg-slate-50 dark:bg-[#121722] border border-slate-200 dark:border-white/10 rounded-none space-y-4 hover:border-gold transition-all duration-300 shadow-sm"
              >
                <div className="h-1.5 w-10 bg-gold" />
                <h4 className="text-lg font-black uppercase tracking-tight text-foreground">{item.role}</h4>
                <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed font-medium">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="py-24 bg-slate-100 dark:bg-[#0d121c]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative rounded-none border border-gold/40 bg-gradient-to-r from-gold/10 via-white to-gold/10 dark:from-gold/10 dark:via-[#0b0e14] dark:to-gold/10 p-12 sm:p-20 text-center space-y-8 shadow-2xl">
            <div className="max-w-3xl mx-auto space-y-4">
              <h2 className="text-4xl sm:text-7xl font-black uppercase tracking-tight text-[#0b0e14] dark:text-white leading-tight">
                Trust Your Vision To <br />
                <span className="text-gold text-gradient-gold">The Professionals.</span>
              </h2>
              <p className="text-slate-700 dark:text-gray-300 text-sm sm:text-lg font-medium max-w-xl mx-auto">
                Connect with our executive production leads to bring 15 years of industry mastery to your next project.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link
                to="/booking"
                className="h-16 px-12 rounded-none bg-gold text-black font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-black hover:text-gold transition-all shadow-xl shadow-gold/20"
              >
                Book Strategy Session <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
