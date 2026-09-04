import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  Search,
  Star,
  ChevronDown,
  ShieldCheck,
  Zap,
  Globe,
  Award,
  Users,
  BarChart3,
  CheckCircle2,
  Clock,
  Briefcase,
  History,
  LayoutDashboard,
  Sparkles,
  Command,
  Smartphone,
  Ticket as TicketIcon,
  Calculator,
  Building2,
  Heart,
  Music,
  Check
} from "lucide-react";
import corporate from "../assets/gallery-corporate.jpg";
import wedding from "../assets/gallery-wedding.jpg";
import concert from "../assets/gallery-concert.jpg";
import { createPageSeo, SERVICE_KEYWORDS } from "../lib/seo";
import { formatKes } from "@/lib/dashboard-mock-data";
import { cn } from "@/lib/utils";

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

const trustPillars = [
  {
    icon: ShieldCheck,
    title: "100% Technical Uptime",
    desc: "Redundant high-spec power & audio-visual systems for zero-failure event execution.",
  },
  {
    icon: Smartphone,
    title: "Instant M-Pesa Ticketing",
    desc: "Automated gate ticket generation with encrypted QR code verification scanner.",
  },
  {
    icon: BarChart3,
    title: "Strategic Brand ROI",
    desc: "Events engineered to maximize engagement, media reach, and stakeholder value.",
  },
  {
    icon: History,
    title: "15 Years Legacy",
    desc: "Over 480+ high-profile events executed across Nairobi and East Africa.",
  },
];

const serviceSectors = [
  {
    id: "sec-corp",
    title: "Corporate Command",
    subtitle: "AGMs, Summits & Launches",
    icon: Building2,
    img: corporate,
    badge: "Enterprise Standard",
    features: [
      "AGM & Stakeholder Governance",
      "Experiential Product Reveals",
      "Multi-Track AV Orchestration",
    ],
    startingFrom: 350000,
  },
  {
    id: "sec-luxury",
    title: "Luxury Weddings",
    subtitle: "Bespoke & Private Celebrations",
    icon: Heart,
    img: wedding,
    badge: "Exclusive Access",
    features: [
      "Floral Architecture & Styling",
      "Discreet VIP Security",
      "Bespoke Sound & Lighting Blueprint",
    ],
    startingFrom: 500000,
  },
  {
    id: "sec-concert",
    title: "Stadium Concerts",
    subtitle: "Festivals & Large Scale",
    icon: Music,
    img: concert,
    badge: "Massive Production",
    features: [
      "Stadium Grade Rigging & Audio",
      "Live 4K Streaming & Media Hub",
      "Gate QR Ticket Verification",
    ],
    startingFrom: 750000,
  },
];

export function Home() {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // Quick Estimator State
  const [estGuests, setEstGuests] = useState<number>(200);
  const [estCategory, setEstCategory] = useState<string>("Corporate Summit");
  const [includeAv, setIncludeAv] = useState<boolean>(true);
  const [includeTicketing, setIncludeTicketing] = useState<boolean>(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % heroImages.length);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const calculateEstimate = () => {
    let base = estCategory === "Corporate Summit" ? 250000 : estCategory === "Luxury Wedding" ? 450000 : 600000;
    let perGuest = estGuests * 450;
    let avCost = includeAv ? 150000 : 0;
    let ticketCost = includeTicketing ? 50000 : 0;
    return base + perGuest + avCost + ticketCost;
  };

  return (
    <div className="relative min-w-0 bg-[#f8fafc] dark:bg-[#0b0e14] text-foreground font-sans overflow-x-hidden transition-colors duration-300">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-start overflow-hidden pt-12 pb-20">
        <div className="absolute inset-0 z-0">
          {heroImages.map((src, idx) => (
            <img
              key={src}
              src={src}
              alt="Royal Touch Hero"
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-[2500ms] ease-in-out scale-105",
                idx === currentImgIndex ? "opacity-15 dark:opacity-25" : "opacity-0"
              )}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-slate-50/95 to-[#f8fafc] dark:from-[#0b0e14]/90 dark:via-[#0b0e14]/95 dark:to-[#0b0e14]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.12),transparent_70%)]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10 w-full text-center mt-12 md:mt-20">
          <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in zoom-in duration-700">
            {/* Tech Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-none bg-gold/10 border border-gold/40 text-gold text-[10px] font-black uppercase tracking-[0.3em] shadow-sm">
                <Sparkles size={14} className="text-gold animate-pulse" /> Precision Production & Instant M-Pesa Ticketing
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-7xl lg:text-[100px] font-black tracking-tighter uppercase leading-[0.88] text-[#0b0e14] dark:text-white">
                Architecting <br />
                <span className="text-gold text-gradient-gold">Excellence.</span>
              </h1>
              <p className="max-w-2xl mx-auto text-sm sm:text-lg md:text-xl font-medium text-slate-700 dark:text-gray-300 leading-relaxed">
                Nairobi's premier event production agency. Transform your corporate summits, luxury weddings, and major concerts with 100% technical uptime and automated QR ticketing.
              </p>
            </div>

            {/* Sharp Edge Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
              <Link
                to="/booking"
                className="h-16 px-12 rounded-none bg-gold text-black font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#0b0e14] hover:text-gold transition-all duration-300 shadow-xl shadow-gold/20 w-full sm:w-auto"
              >
                Inquire Project Brief <ArrowRight size={18} />
              </Link>
              <Link
                to="/events"
                className="h-16 px-12 rounded-none border border-slate-300 dark:border-white/10 bg-white/80 dark:bg-white/5 text-foreground font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center hover:border-gold hover:text-gold transition-all duration-300 w-full sm:w-auto gap-3 shadow-sm"
              >
                <TicketIcon size={18} className="text-gold" /> Explore Gate Tickets
              </Link>
            </div>

            {/* Technology Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto">
              {[
                { label: "Technical Uptime", val: "100.0%" },
                { label: "M-Pesa Gate Check-in", val: "Instant QR" },
                { label: "Events Delivered", val: "480+ Projects" },
                { label: "Client Satisfaction", val: "5.0 Rating" },
              ].map((s, i) => (
                <div key={i} className="bg-white dark:bg-[#121722] border border-slate-200 dark:border-white/10 p-5 rounded-none space-y-1 shadow-sm text-center">
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{s.label}</p>
                  <p className="text-xl font-black text-gold font-mono">{s.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. OPERATIONAL PILLARS */}
      <section className="py-24 bg-white dark:bg-[#0b0e14] border-y border-slate-200 dark:border-white/10 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Built For Perfection</p>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0b0e14] dark:text-white">
              Why Elite Clients Choose Royal Touch
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustPillars.map((pillar, i) => (
              <div
                key={i}
                className="group relative p-8 rounded-none bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 hover:border-gold transition-all duration-300 space-y-6 shadow-sm"
              >
                <div className="h-14 w-14 rounded-none bg-gold/10 border border-gold/30 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all">
                  <pillar.icon size={28} />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-2xl font-black uppercase tracking-tight text-[#0b0e14] dark:text-white group-hover:text-gold transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed font-medium">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SERVICE SECTORS */}
      <section className="py-24 bg-slate-50 dark:bg-[#0d121c] relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 border-b border-slate-200 dark:border-white/10 pb-8">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Production Disciplines</p>
              <h2 className="text-3xl sm:text-6xl font-black uppercase tracking-tight text-[#0b0e14] dark:text-white">
                Featured Production Portfolios
              </h2>
            </div>
            <Link
              to="/services"
              className="h-12 px-8 rounded-none bg-[#0b0e14] dark:bg-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-gold hover:text-black transition-all flex items-center gap-2 shrink-0 shadow-md"
            >
              Explore All Services <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {serviceSectors.map((sector) => (
              <div
                key={sector.id}
                className="group relative flex flex-col bg-white dark:bg-[#121722] border border-slate-200 dark:border-white/10 rounded-none overflow-hidden hover:border-gold transition-all duration-500 shadow-md"
              >
                <div className="h-64 relative overflow-hidden">
                  <img
                    src={sector.img}
                    alt={sector.title}
                    className="h-full w-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-gold text-black font-black text-[9px] uppercase tracking-widest shadow-md">
                    {sector.badge}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                </div>

                <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gold">{sector.subtitle}</p>
                      <h3 className="text-2xl font-black uppercase tracking-tight text-[#0b0e14] dark:text-white group-hover:text-gold transition-colors">
                        {sector.title}
                      </h3>
                    </div>

                    <ul className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-white/5">
                      {sector.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-gray-400">
                          <CheckCircle2 size={14} className="text-gold shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Estimated Investment</p>
                      <p className="text-base font-black text-gold font-mono">From {formatKes(sector.startingFrom)}</p>
                    </div>

                    <Link
                      to="/booking"
                      className="h-11 px-5 rounded-none bg-gold text-black font-black text-[9px] uppercase tracking-widest flex items-center gap-1 hover:bg-black hover:text-white transition-all shadow-sm"
                    >
                      Inquire <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE COST ESTIMATOR */}
      <section className="py-24 bg-white dark:bg-[#0b0e14] border-y border-slate-200 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-gold/10 border border-gold/30 text-gold text-[10px] font-black uppercase tracking-widest">
                <Calculator size={14} /> Instant Cost Calculator
              </div>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0b0e14] dark:text-white leading-tight">
                Estimate Your Event Investment
              </h2>
              <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed font-medium">
                Get an instant estimated range for your upcoming project. Our transparent pricing model includes full production, technical AV, and M-Pesa gate ticketing capabilities.
              </p>

              <div className="p-6 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-none space-y-3">
                <div className="flex items-center gap-3 text-gold">
                  <Clock size={18} />
                  <p className="text-[10px] font-black uppercase tracking-widest text-foreground">Guaranteed 24H Proposal Turnaround</p>
                </div>
                <p className="text-xs text-slate-600 dark:text-gray-400">
                  Submitting your brief triggers a dedicated senior producer review within 12 business hours.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 bg-slate-50 dark:bg-[#121722] border border-slate-200 dark:border-white/10 p-8 sm:p-10 rounded-none space-y-8 shadow-xl">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">
                    Event Discipline / Category
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {["Corporate Summit", "Luxury Wedding", "Stadium Concert"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setEstCategory(cat)}
                        className={cn(
                          "py-3 px-3 rounded-none text-[10px] font-black uppercase tracking-widest border transition-all text-center",
                          estCategory === cat
                            ? "bg-gold text-black border-gold shadow-md"
                            : "bg-white dark:bg-black/30 border-slate-200 dark:border-white/10 text-foreground hover:border-gold"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Guest Capacity
                    </label>
                    <span className="font-mono text-sm font-black text-gold">{estGuests} Guests</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="2000"
                    step="50"
                    value={estGuests}
                    onChange={(e) => setEstGuests(Number(e.target.value))}
                    className="w-full accent-gold cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-none"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 p-4 bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeAv}
                      onChange={(e) => setIncludeAv(e.target.checked)}
                      className="accent-gold h-4 w-4"
                    />
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">Include Pro 4K AV & Lighting</span>
                  </label>

                  <label className="flex items-center gap-3 p-4 bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeTicketing}
                      onChange={(e) => setIncludeTicketing(e.target.checked)}
                      className="accent-gold h-4 w-4"
                    />
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">Include M-Pesa QR Gate Pass</span>
                  </label>
                </div>
              </div>

              {/* Estimate Calculation Banner */}
              <div className="p-6 bg-gold/10 border border-gold/40 rounded-none flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Estimated Turnkey Budget</p>
                  <p className="text-2xl font-black text-gold font-mono">{formatKes(calculateEstimate())}</p>
                </div>

                <Link
                  to="/booking"
                  className="h-12 px-8 bg-gold text-black font-black text-[10px] uppercase tracking-widest rounded-none flex items-center gap-2 hover:bg-black hover:text-gold transition-all shadow-md shrink-0"
                >
                  Book Estimate <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CORPORATE TRUSTED PARTNERS MARQUEE */}
      <section className="py-16 bg-slate-100 dark:bg-[#0b0e14] border-b border-slate-200 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center space-y-8">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">
            Trusted By Industry Leaders Across East Africa
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 hover:opacity-100 transition-opacity">
            {["SAFARICOM", "KCB BANK", "UNEP", "COCA-COLA", "BMW KENYA", "AIRTEL"].map((brand) => (
              <span key={brand} className="text-xl md:text-2xl font-black tracking-tighter text-[#0b0e14] dark:text-white font-sans">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="py-24 bg-white dark:bg-[#0d121c]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative rounded-none border border-gold/40 bg-gradient-to-r from-gold/10 via-slate-50 to-gold/10 dark:from-gold/10 dark:via-[#0b0e14] dark:to-gold/10 p-12 sm:p-20 text-center space-y-8 shadow-2xl">
            <div className="max-w-3xl mx-auto space-y-4">
              <h2 className="text-4xl sm:text-7xl font-black uppercase tracking-tight text-[#0b0e14] dark:text-white leading-tight">
                Ready To Launch Your <br />
                <span className="text-gold text-gradient-gold">Next Event?</span>
              </h2>
              <p className="text-slate-700 dark:text-gray-300 text-sm sm:text-lg font-medium max-w-xl mx-auto">
                Connect with our executive production directors to turn your vision into an unforgettable experience.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link
                to="/booking"
                className="h-16 px-12 rounded-none bg-gold text-black font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-black hover:text-gold transition-all shadow-xl shadow-gold/20"
              >
                Inquire Strategy Brief <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export const Route = createFileRoute("/")({
  head: () =>
    createPageSeo({
      title: "Royal Touch Events | Premier Corporate & Luxury Production Nairobi",
      description:
        "Nairobi's top event production agency. We deliver high-impact corporate summits, luxury weddings, and stadium concerts with instant M-Pesa ticketing and 100% technical uptime.",
      path: "/",
      keywords: SERVICE_KEYWORDS,
    }),
  component: Home,
});
