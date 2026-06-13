import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  Search,
  PlayCircle,
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
  History
} from "lucide-react";
import heroImg from "../assets/hero-event.jpg";
import corporate from "../assets/gallery-corporate.jpg";
import wedding from "../assets/gallery-wedding.jpg";
import concert from "../assets/gallery-concert.jpg";
import { createPageSeo, SERVICE_KEYWORDS } from "../lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    createPageSeo({
      title: "Royal Touch Events | Corporate & Luxury Production Nairobi",
      description:
        "Nairobi's premier event production agency. We specialize in high-impact corporate events, luxury weddings, and world-class concert production. Royally delivered excellence.",
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
  { icon: ShieldCheck, title: "Risk Mitigation", desc: "Redundant power & audio systems for zero-failure production." },
  { icon: BarChart3, title: "ROI Focused", desc: "Strategic events designed to drive brand value and engagement." },
  { icon: Globe, title: "Global Standards", desc: "International production protocols and elite logistics." },
  { icon: History, title: "15-Year Legacy", desc: "Over a decade of successful high-stakes event delivery." },
];

const featuredAssets = [
  {
    title: "Corporate Command",
    img: corporate,
    features: ["AGM Management", "Product Reveals", "Stakeholder Summits"],
    status: "Priority Service"
  },
  {
    title: "Luxury Production",
    img: wedding,
    features: ["Bespoke Design", "VIP Concierge", "Elite Catering"],
    status: "Limited Availability"
  },
  {
    title: "Massive Venues",
    img: concert,
    features: ["Stadium Sound", "Intelligent Light", "Stage Rigging"],
    status: "Technical Mastery"
  }
];

function Home() {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % heroImages.length);
    }, 60000); // Switch every 1 minute
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-w-0 bg-[#0b0e14] text-white font-sans">
      {/* 1. HERO SECTION (HIGH-IMPACT MARKETING) */}
      <section className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          {heroImages.map((src, idx) => (
            <img
              key={src}
              src={src}
              alt={`Royal Touch Hero ${idx}`}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[3000ms] ease-in-out ${
                idx === currentImgIndex ? "opacity-100 scale-105" : "opacity-0 scale-100"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-[#0b0e14]/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b0e14]/80 via-transparent to-[#0b0e14]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10 w-full text-center mt-8 md:mt-16">
          <div className="max-w-4xl mx-auto bg-[#0b0e14]/60 backdrop-blur-md border border-white/10 p-6 md:p-12 rounded-[24px] md:rounded-[32px] space-y-6 md:space-y-8 animate-in fade-in zoom-in duration-1000">
            <div className="space-y-3 md:space-y-4">
              <h1 className="text-3xl sm:text-6xl lg:text-[100px] font-black tracking-tighter text-white uppercase leading-tight md:leading-[0.85]">
                Architecting <br />
                <span className="text-gold">Excellence.</span>
              </h1>
              <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-xl text-gray-200 font-medium leading-relaxed">
                Experience the pinnacle of event production. Premium planning, 100% technical uptime, and professional logistics at your command.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
              <Link to="/portfolio" className="h-12 sm:h-16 px-6 sm:px-12 rounded-xl bg-gold text-[#0b0e14] font-black text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center hover:bg-white transition-all shadow-2xl w-full sm:w-auto">
                Execute Portfolio
              </Link>
              <Link to="/booking" className="h-12 sm:h-16 px-6 sm:px-12 rounded-xl border border-white/20 bg-[#0b0e14]/40 backdrop-blur-md text-white font-black text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center hover:bg-white/10 transition-all w-full sm:w-auto">
                Request Strategy Session
              </Link>
            </div>
          </div>
        </div>

        {/* 2. SEARCH DATABASE (FUNCTIONALITY) */}
        <div className="relative mt-auto w-full z-20 pt-8 md:pt-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="bg-[#121212] border-t-4 border-gold p-6 md:p-8 rounded-t-2xl md:rounded-t-3xl shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-end">
                <div className="lg:col-span-5 space-y-2 md:space-y-3">
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Live Project Database</p>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search projects by type or scale..."
                      className="w-full h-12 md:h-14 bg-[#1a1a1a] border border-white/10 rounded-lg md:rounded-xl px-4 md:px-6 text-sm text-white focus:border-gold outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-2 md:space-y-3">
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Select Discipline</p>
                  <div className="relative">
                    <select className="w-full h-12 md:h-14 bg-[#1a1a1a] border border-white/10 rounded-lg md:rounded-xl px-4 md:px-6 text-sm text-white appearance-none focus:border-gold outline-none cursor-pointer">
                      <option>All Services</option>
                      <option>Corporate Galas</option>
                      <option>Concert Productions</option>
                      <option>Luxury Weddings</option>
                    </select>
                    <ChevronDown className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 text-gold pointer-events-none" size={18} />
                  </div>
                </div>

                <div className="lg:col-span-3">
                  <button className="w-full h-12 md:h-14 bg-gold text-[#0b0e14] rounded-lg md:rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white transition-all">
                    <Search size={18} />
                    Run Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRUST PILLARS (BUSINESS ORIENTED TILES) */}
      <section className="py-32 bg-white/[0.01]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustPillars.map((pillar, i) => (
              <div key={i} className="p-10 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-gold/30 transition-all group">
                <div className="h-14 w-14 rounded-2xl bg-gold/10 flex items-center justify-center text-gold mb-8 group-hover:bg-gold group-hover:text-black transition-all">
                  <pillar.icon size={28} />
                </div>
                <h3 className="font-display text-2xl text-white mb-4 tracking-tight">{pillar.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. STRATEGIC ASSETS GRID (CLEAR DETAILS & FEATURES) */}
      <section className="py-32 border-y border-white/5 bg-[#0b0e14]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
             <div className="max-w-2xl space-y-6">
                <p className="text-gold text-[10px] font-black uppercase tracking-[0.4em]">Core Capabilities</p>
                <h2 className="font-display text-5xl md:text-8xl tracking-tighter">Premium Asset <br />Management.</h2>
             </div>
             <Link to="/services" className="h-12 px-8 rounded-full border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-gold hover:text-black transition-all">
                View All Disciplines
             </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {featuredAssets.map((asset, i) => (
              <div key={i} className="flex flex-col bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden hover:border-gold/30 transition-all duration-500 group">
                <div className="h-64 relative overflow-hidden">
                  <img src={asset.img} alt={asset.title} className="h-full w-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" />
                  <div className="absolute top-6 left-6 px-3 py-1 rounded-full bg-gold text-[#0b0e14] text-[9px] font-black uppercase tracking-widest">
                    {asset.status}
                  </div>
                </div>

                <div className="p-10 space-y-8 flex flex-col justify-between flex-1">
                  <div className="space-y-4">
                    <h3 className="font-display text-4xl text-white">{asset.title}</h3>
                    <p className="text-gray-500 text-sm">Engineered for high-impact performance and flawless execution in {asset.title.toLowerCase()} environments.</p>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gold/60">Key Performance Indicators</p>
                    <ul className="space-y-3">
                      {asset.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-3 text-xs font-bold text-gray-400">
                          <CheckCircle2 size={14} className="text-gold" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button className="w-full h-14 mt-4 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest group-hover:bg-gold group-hover:text-black transition-all">
                    Request Strategy Brief
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. LIVE OPERATIONS STATUS (FUNCTIONALITY & TRUST) */}
      <section className="py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
           <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-10">
                 <div className="space-y-4">
                    <p className="text-gold text-xs font-bold uppercase tracking-[0.4em]">Live Intelligence</p>
                    <h2 className="font-display text-5xl md:text-7xl">Mission Control Ready.</h2>
                 </div>

                 <div className="grid sm:grid-cols-2 gap-8">
                    {[
                      { icon: Clock, label: "Response Time", val: "< 15 Mins" },
                      { icon: ShieldCheck, label: "Uptime Record", val: "100.0%" },
                      { icon: Users, label: "Active Team", val: "42 Members" },
                      { icon: Zap, label: "Tech Readiness", val: "98.5%" },
                    ].map((stat, i) => (
                      <div key={i} className="flex items-center gap-4 p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                         <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                            <stat.icon size={20} />
                         </div>
                         <div>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500">{stat.label}</p>
                            <p className="text-xl font-black text-white">{stat.val}</p>
                         </div>
                      </div>
                    ))}
                 </div>

                 <p className="text-gray-500 leading-relaxed max-w-xl">
                   Our integrated command center provides real-time oversight of all logistical and technical assets, ensuring absolute precision from first arrival to final load-out.
                 </p>
              </div>

              <div className="relative group">
                 <div className="aspect-square rounded-[48px] overflow-hidden border border-white/10 shadow-2xl relative">
                    <img src={heroImg} alt="Command Center" className="h-full w-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <PlayCircle size={100} className="text-gold animate-pulse" />
                    </div>
                 </div>
                 {/* Trust Badge */}
                 <div className="absolute -top-6 -right-6 glass-strong p-6 rounded-2xl animate-float-slow hidden xl:block">
                    <Award size={32} className="text-gold mb-3" />
                    <p className="font-display text-lg text-white">Top 5% Agency</p>
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-500 mt-1">Nairobi Region 2026</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 6. TRUSTED PARTNERS (UPRIGHT MARQUEE) */}
      <section className="py-16 bg-white/[0.01] border-y border-white/5 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-20 hover:opacity-100 transition-opacity duration-700">
            {["SAFARICOM", "KCB BANK", "UNEP", "COCA-COLA", "BMW KENYA", "AIRTEL"].map(brand => (
              <span key={brand} className="text-xl font-black tracking-tighter text-white font-sans">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 7. HIGH-CONVERSION CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-32">
        <div className="relative rounded-[60px] overflow-hidden bg-white/5 border border-white/10 p-12 md:p-32 text-center">
          <div className="absolute inset-0 bg-radial-indigo opacity-30" />
          <div className="relative z-10 max-w-3xl mx-auto space-y-10">
            <h2 className="font-display text-5xl md:text-9xl leading-none tracking-tighter text-white">Your Success <br /><span className="text-gold">Architected.</span></h2>
            <p className="text-gray-400 text-lg md:text-2xl font-light">
              Connect with our senior producers to discuss your project's technical and creative blueprint.
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-10">
              <Link to="/booking" className="h-20 px-16 rounded-full bg-gold text-[#0b0e14] font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-2xl">
                Start Strategy <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
