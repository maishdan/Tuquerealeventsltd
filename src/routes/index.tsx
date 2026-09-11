import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Smartphone,
  BarChart3,
  History,
  Building2,
  Heart,
  Music,
  ArrowRight,
  Calculator,
  Clock,
  CheckCircle2,
  Sparkles,
  Users,
  Award,
  Globe,
  DollarSign
} from "lucide-react";
import corporate from "../assets/gallery-corporate.jpg";
import wedding from "../assets/gallery-wedding.jpg";
import concert from "../assets/gallery-concert.jpg";
import { createPageSeo, SERVICE_KEYWORDS } from "../lib/seo";
import { formatKes } from "@/lib/dashboard-mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () =>
    createPageSeo({
      title: "TOQUE REAL EVENTS LIMITED | Premier Corporate & Luxury Event Production Nairobi",
      description:
        "TOQUE REAL EVENTS LIMITED is Nairobi's premier event planning agency for corporate summits, luxury weddings, and stadium concerts. Accessible production for all levels and standards.",
      path: "/",
      keywords: SERVICE_KEYWORDS,
    }),
  component: Home,
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
    id: "sec-community",
    title: "Community & Private",
    subtitle: "Birthdays, Graduations & Family",
    icon: Users,
    img: wedding,
    badge: "Budget Friendly",
    features: [
      "Intimate Sound & Stage Setup",
      "Custom Decor & Lighting",
      "Flexible Pricing for All",
    ],
    startingFrom: 15000,
  },
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
    startingFrom: 150000,
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
    startingFrom: 300000,
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
    startingFrom: 500000,
  },
];

const currencies = [
  { code: "KES", symbol: "KSh", name: "Kenya Shillings (KES)", rate: 1 },
  { code: "USD", symbol: "$", name: "US Dollar (USD)", rate: 0.0077 },
  { code: "EUR", symbol: "€", name: "Euro (EUR)", rate: 0.0071 },
  { code: "GBP", symbol: "£", name: "British Pound (GBP)", rate: 0.0060 },
  { code: "UGX", symbol: "UGX ", name: "Uganda Shillings (UGX)", rate: 28.5 },
  { code: "TZS", symbol: "TZS ", name: "Tanzania Shillings (TZS)", rate: 20.2 },
];

export function Home() {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // Quick Estimator State
  const [estGuests, setEstGuests] = useState<number>(100);
  const [estCategory, setEstCategory] = useState<string>("Community & Private");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("KES");
  const [includeAv, setIncludeAv] = useState<boolean>(true);
  const [includeTicketing, setIncludeTicketing] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % heroImages.length);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const calculateEstimateInKes = () => {
    let base =
      estCategory === "Community & Private"
        ? 15000
        : estCategory === "Corporate Summit"
        ? 150000
        : estCategory === "Luxury Wedding"
        ? 300000
        : 500000;

    let perGuest = estGuests * (estCategory === "Community & Private" ? 150 : 350);
    let avCost = includeAv ? (estCategory === "Community & Private" ? 10000 : 80000) : 0;
    let ticketCost = includeTicketing ? 15000 : 0;

    return base + perGuest + avCost + ticketCost;
  };

  const formatCurrency = (amountInKes: number, currCode: string) => {
    const curr = currencies.find((c) => c.code === currCode) || currencies[0];
    const converted = amountInKes * curr.rate;

    if (currCode === "KES") {
      return `${curr.symbol} ${Math.round(converted).toLocaleString()}`;
    }
    if (currCode === "UGX" || currCode === "TZS") {
      return `${curr.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${curr.symbol}${converted.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="relative min-w-0 bg-[#0b0e14] bg-[url('/ltd.png')] bg-cover bg-center bg-fixed text-foreground font-sans overflow-x-hidden transition-colors duration-300">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-90 transition-all duration-1000"
          style={{ backgroundImage: `url('/ltd.png')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-[#0b0e14]/60 to-[#0b0e14]/20" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10 py-20 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-black uppercase tracking-[0.25em] shadow-inner">
            <Sparkles size={14} className="text-gold" /> TOQUE REAL EVENTS LIMITED
          </div>

          <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-white leading-[0.9] drop-shadow-2xl">
            Architecting <br />
            <span className="text-gold font-display font-normal normal-case">Unforgettable</span> Events.
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-300 font-medium leading-relaxed">
            Nairobi's premier event planning & production agency. Accessible excellence for community celebrations, luxury weddings, corporate summits, and concerts.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link
              to="/booking"
              className="h-14 px-8 rounded-lg bg-gold text-[#0b0e14] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white transition-all shadow-xl shadow-gold/20 w-full sm:w-auto"
            >
              Plan Your Event <ArrowRight size={16} />
            </Link>
            <Link
              to="/services"
              className="h-14 px-8 rounded-lg border border-white/20 bg-black/40 backdrop-blur-md text-white font-black text-xs uppercase tracking-widest flex items-center justify-center hover:border-gold hover:text-gold transition-all w-full sm:w-auto"
            >
              Explore Solutions
            </Link>
          </div>
        </div>
      </section>

      {/* 2. TRUST PILLARS BAR */}
      <section className="py-12 bg-[#0b0e14]/80 backdrop-blur-md border-y border-slate-200 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustPillars.map((p, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-[#121722]/85 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-lg">
                <div className="h-10 w-10 rounded-lg bg-gold/10 border border-gold/30 text-gold flex items-center justify-center shrink-0">
                  <p.icon size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">{p.title}</h4>
                  <p className="text-[11px] text-muted-foreground leading-snug">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ACCESSIBLE SERVICE SECTORS FOR ALL LEVELS */}
      <section className="py-24 bg-[#0b0e14]/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-gold">Tailored Solutions</p>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0b0e14] dark:text-white">
              Accessible Production For All Standards
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              From intimate family celebrations to multinational corporate summits, TOQUE REAL EVENTS LIMITED delivers uncompromising quality at every budget level.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceSectors.map((sector) => (
              <div
                key={sector.id}
                className="bg-[#121722]/85 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col group hover:border-gold transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={sector.img} alt={sector.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 right-3 px-3 py-1 bg-black/80 text-gold text-[9px] font-black uppercase rounded-full border border-gold/30">
                    {sector.badge}
                  </span>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gold">{sector.subtitle}</p>
                      <h3 className="text-xl font-black uppercase tracking-tight text-[#0b0e14] dark:text-white group-hover:text-gold transition-colors">
                        {sector.title}
                      </h3>
                    </div>

                    <ul className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/5">
                      {sector.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                          <CheckCircle2 size={13} className="text-gold shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Starting From</p>
                      <p className="text-sm font-black text-gold font-mono">{formatKes(sector.startingFrom)}</p>
                    </div>

                    <Link
                      to="/booking"
                      className="h-10 px-4 rounded-lg bg-gold text-black font-black text-[9px] uppercase tracking-widest flex items-center gap-1 hover:bg-white transition-all shadow-sm"
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

      {/* 4. INTERACTIVE ACCESSIBLE COST ESTIMATOR & CURRENCY CONVERTER */}
      <section className="py-24 bg-white dark:bg-[#0b0e14] border-y border-slate-200 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-[10px] font-black uppercase tracking-widest">
                <Calculator size={14} /> Instant Cost Calculator
              </div>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0b0e14] dark:text-white leading-tight">
                Estimate Your Event Investment
              </h2>
              <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed font-medium">
                Transparent production estimates adapted for all social levels—from budget family celebrations to multi-currency corporate summits.
              </p>

              {/* Currency Selector Box */}
              <div className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gold flex items-center gap-1.5">
                  <DollarSign size={14} /> Select Preferred Currency *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {currencies.map((curr) => (
                    <button
                      key={curr.code}
                      type="button"
                      onClick={() => setSelectedCurrency(curr.code)}
                      className={cn(
                        "py-2 px-2.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer text-center",
                        selectedCurrency === curr.code
                          ? "bg-gold text-black border-gold shadow-md"
                          : "bg-white dark:bg-black/30 border-slate-200 dark:border-white/10 text-foreground hover:border-gold"
                      )}
                    >
                      {curr.code} ({curr.symbol})
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl space-y-3">
                <div className="flex items-center gap-3 text-gold">
                  <Clock size={18} />
                  <p className="text-[10px] font-black uppercase tracking-widest text-foreground">Guaranteed 24H Proposal Turnaround</p>
                </div>
                <p className="text-xs text-slate-600 dark:text-gray-400">
                  Submitting your brief triggers a dedicated senior producer review within 12 business hours.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 bg-slate-50 dark:bg-[#121722] border border-slate-200 dark:border-white/10 p-8 sm:p-10 rounded-2xl space-y-8 shadow-xl">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">
                    Event Category & Level *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {["Community & Private", "Corporate Summit", "Luxury Wedding", "Stadium Concert"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setEstCategory(cat)}
                        className={cn(
                          "py-3 px-2 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all text-center cursor-pointer",
                          estCategory === cat
                            ? "bg-gold text-black border-gold shadow-md font-bold"
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
                    min="10"
                    max="3000"
                    step="10"
                    value={estGuests}
                    onChange={(e) => setEstGuests(Number(e.target.value))}
                    className="w-full accent-gold cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 p-4 bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeAv}
                      onChange={(e) => setIncludeAv(e.target.checked)}
                      className="accent-gold h-4 w-4"
                    />
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">Include Pro Sound & AV</span>
                  </label>

                  <label className="flex items-center gap-3 p-4 bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeTicketing}
                      onChange={(e) => setIncludeTicketing(e.target.checked)}
                      className="accent-gold h-4 w-4"
                    />
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">Include Gate Passes / QR Tickets</span>
                  </label>
                </div>
              </div>

              {/* Estimate Calculation Banner with Selected Currency */}
              <div className="p-6 bg-gold/10 border border-gold/40 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Estimated Turnkey Budget ({selectedCurrency})</p>
                  <p className="text-2xl sm:text-3xl font-black text-gold font-mono">
                    {formatCurrency(calculateEstimateInKes(), selectedCurrency)}
                  </p>
                </div>

                <Link
                  to="/booking"
                  className="h-12 px-6 rounded-lg bg-gold text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white transition-all shadow-lg shrink-0 w-full sm:w-auto"
                >
                  Book Estimate <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
