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
  History,
  LayoutDashboard,
  Sparkles,
  Command
} from "lucide-react";
import heroImg from "../assets/hero-event.jpg";
import corporate from "../assets/gallery-corporate.jpg";
import wedding from "../assets/gallery-wedding.jpg";
import concert from "../assets/gallery-concert.jpg";
import { createPageSeo, SERVICE_KEYWORDS } from "../lib/seo";
import { cn } from "@/lib/utils";

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
  { icon: ShieldCheck, title: "Mission Critical", desc: "Redundant high-spec technical systems for zero-failure production uptime." },
  { icon: BarChart3, title: "Strategic ROI", desc: "Events engineered to amplify brand equity and stakeholder engagement." },
  { icon: Globe, title: "Global Logistics", desc: "International standard production protocols and elite venue management." },
  { icon: History, title: "Executive Legacy", desc: "15 years of delivering high-stakes productions for world-class brands." },
];

const featuredAssets = [
  {
    title: "Corporate Command",
    img: corporate,
    features: ["AGM Management", "Product Reveals", "Stakeholder Summits"],
    status: "Priority Protocol",
    desc: "Precision management for the corporate elite."
  },
  {
    title: "Luxury Production",
    img: wedding,
    features: ["Bespoke Design", "VIP Concierge", "Elite Catering"],
    status: "Limited Access",
    desc: "Curating extraordinary private celebrations."
  },
  {
    title: "Technical Mastery",
    img: concert,
    features: ["Stadium Sound", "Intelligent Light", "Stage Rigging"],
    status: "Active Status",
    desc: "Massive scale production for world-class stages."
  }
];

function Home() {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % heroImages.length);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-w-0 bg-[#f8fafc] text-[#0f172a] font-sans overflow-x-hidden">
      {/* 1. HERO: EXECUTIVE COMMAND CENTER */}
      <section className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden">
        <div className="absolute inset-0 z-0">
          {heroImages.map((src, idx) => (
            <img
              key={src}
              src={src}
              alt=""
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-[3000ms] ease-in-out scale-110",
                idx === currentImgIndex ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
              )}
            />
          ))}
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-[#f8fafc]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(212,175,55,0.1),transparent_60%)]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10 w-full text-center mt-24 md:mt-32">
          <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="space-y-6">
              <div className="flex justify-center">
                 <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md shadow-sm">
                    <ShieldCheck size={14} className="animate-pulse" /> Established Production Intelligence
                 </div>
              </div>
              <h1 className="text-4xl sm:text-7xl lg:text-[110px] font-black tracking-tighter text-[#0b0e14] uppercase leading-[0.85]">
                Architecting <br />
                <span className="text-gold">Grandeur.</span>
              </h1>
              <p className="max-w-2xl mx-auto text-sm sm:text-lg md:text-xl text-slate-700 font-medium leading-relaxed">
                Experience the pinnacle of event production. Precision planning, 100% technical uptime, and professional logistics at your command.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-6 pt-4">
              <Link to="/booking" className="h-16 px-12 rounded-2xl bg-gold text-[#0b0e14] font-black text-xs uppercase tracking-widest flex items-center justify-center hover:bg-[#0b0e14] hover:text-white transition-all shadow-[0_20px_50px_rgba(212,175,55,0.2)] group w-full sm:w-auto">
                Initiate Project <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link to="/sign-in" className="h-16 px-12 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-xl text-[#0b0e14] font-black text-xs uppercase tracking-widest flex items-center justify-center hover:bg-slate-50 transition-all w-full sm:w-auto gap-2 shadow-sm">
                <LayoutDashboard size={18} /> Client Portal
              </Link>
            </div>
          </div>
        </div>

        {/* 2. REAL-TIME SEARCH PANEL */}
        <div className="relative mt-auto w-full z-20 pb-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end relative z-10">
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-center gap-2">
                     <Command size={12} className="text-gold" />
                     <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Registry Search</p>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Identify project by scale or sector..."
                      className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm text-[#0b0e14] focus:border-gold outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-2">Active Disciplines</p>
                  <div className="relative">
                    <select className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm text-[#0b0e14] appearance-none focus:border-gold outline-none cursor-pointer">
                      <option>All Operations</option>
                      <option>Corporate Governance</option>
                      <option>Technical Production</option>
                      <option>Luxury Experience</option>
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gold pointer-events-none" size={20} />
                  </div>
                </div>

                <div className="lg:col-span-3">
                  <button className="w-full h-16 bg-[#0b0e14] text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-gold hover:text-[#0b0e14] transition-all shadow-xl">
                    <Search size={20} /> Execute Query
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OPERATIONAL PILLARS */}
      <section className="py-40 bg-white relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-100 to-transparent" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustPillars.map((pillar, i) => (
              <div key={i} className="p-12 rounded-[48px] bg-slate-50 border border-slate-100 hover:border-gold/30 hover:bg-white transition-all group relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-[0.05] transition-opacity duration-700">
                    <pillar.icon size={120} className="text-[#0b0e14]" />
                </div>
                <div className="h-16 w-16 rounded-2xl bg-gold/10 flex items-center justify-center text-gold mb-10 group-hover:bg-gold group-hover:text-white transition-all shadow-inner">
                  <pillar.icon size={32} />
                </div>
                <h3 className="font-display text-3xl text-[#0b0e14] mb-4 tracking-tight group-hover:text-gold transition-colors">{pillar.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. STRATEGIC SECTORS */}
      <section className="py-40 bg-[#f8fafc] relative overflow-hidden">
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-24">
             <div className="max-w-2xl space-y-6">
                <div className="flex items-center gap-3 text-gold">
                   <div className="h-[1px] w-12 bg-gold" />
                   <p className="text-[10px] font-black uppercase tracking-[0.4em]">Core Capabilities</p>
                </div>
                <h2 className="font-display text-6xl md:text-[100px] leading-[0.9] tracking-tighter text-[#0b0e14]">Executive <br />Portfolios.</h2>
             </div>
             <Link to="/services" className="h-14 px-10 rounded-full border border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-[#0b0e14] hover:text-white transition-all flex items-center gap-3 bg-white shadow-sm">
                Access All Sectors <ArrowRight size={14} />
             </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {featuredAssets.map((asset, i) => (
              <div key={i} className="flex flex-col bg-white border border-slate-100 rounded-[60px] overflow-hidden hover:border-gold/30 transition-all duration-700 group shadow-xl">
                <div className="h-80 relative overflow-hidden">
                  <img src={asset.img} alt={asset.title} className="h-full w-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[2000ms]" />
                  <div className="absolute top-8 left-8 px-4 py-1.5 rounded-full bg-gold/90 text-[#0b0e14] text-[9px] font-black uppercase tracking-widest backdrop-blur-sm shadow-lg">
                    {asset.status}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="p-12 space-y-10 flex flex-col justify-between flex-1 relative">
                  <div className="space-y-4">
                    <h3 className="font-display text-5xl text-[#0b0e14] group-hover:text-gold transition-colors">{asset.title}</h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">{asset.desc}</p>
                  </div>

                  <div className="space-y-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 border-b border-slate-100 pb-4">Key Metrics</p>
                    <ul className="space-y-4">
                      {asset.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-4 text-xs font-bold text-slate-400 group-hover:text-slate-600 transition-colors">
                          <div className="h-1.5 w-1.5 rounded-full bg-gold/40" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button className="w-full h-16 mt-6 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] bg-slate-50 text-[#0b0e14] group-hover:bg-gold group-hover:text-[#0b0e14] transition-all shadow-sm">
                    Request Strategic Brief
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. MISSION CONTROL STATUS */}
      <section className="py-40 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
           <div className="grid lg:grid-cols-2 gap-24 items-center">
              <div className="space-y-12">
                 <div className="space-y-6">
                    <div className="flex items-center gap-3 text-gold">
                       <Zap size={14} className="fill-gold" />
                       <p className="text-[10px] font-black uppercase tracking-[0.4em]">Operations Hub</p>
                    </div>
                    <h2 className="font-display text-6xl md:text-8xl tracking-tight leading-[0.9] text-[#0b0e14]">Always Online. <br />Always Elite.</h2>
                 </div>

                 <div className="grid sm:grid-cols-2 gap-6">
                    {[
                      { icon: Clock, label: "Response Time", val: "Instant" },
                      { icon: ShieldCheck, label: "Uptime Record", val: "100.0%" },
                      { icon: Users, label: "Active Team", val: "42 Staff" },
                      { icon: Sparkles, label: "Tech Readiness", val: "Elite" },
                    ].map((stat, i) => (
                      <div key={i} className="flex items-center gap-5 p-8 rounded-[32px] bg-slate-50 border border-slate-100 shadow-sm hover:bg-white transition-colors">
                         <div className="h-12 w-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold shadow-inner shrink-0">
                            <stat.icon size={24} />
                         </div>
                         <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                            <p className="text-2xl font-black text-[#0b0e14] tracking-tighter">{stat.val}</p>
                         </div>
                      </div>
                    ))}
                 </div>

                 <p className="text-slate-500 leading-relaxed max-w-xl text-lg font-medium">
                   Our integrated command center provides real-time oversight of all logistical and technical assets, ensuring absolute precision from first arrival to final load-out.
                 </p>
              </div>

              <div className="relative group">
                 <div className="aspect-[4/5] rounded-[60px] overflow-hidden border border-slate-100 shadow-[0_50px_100px_rgba(0,0,0,0.1)] relative bg-slate-100">
                    <img src={heroImg} alt="" className="h-full w-full object-cover opacity-90 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-[3000ms]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                       <div className="h-32 w-32 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-gold shadow-2xl">
                          <PlayCircle size={64} className="fill-gold/20" />
                       </div>
                    </div>
                 </div>
                 {/* Trust Badge */}
                 <div className="absolute -top-10 -right-10 bg-white border border-slate-100 p-10 rounded-[40px] animate-float-slow hidden xl:block shadow-2xl">
                    <Award size={48} className="text-gold mb-6" />
                    <p className="font-display text-2xl text-[#0b0e14]">Tier-1 Agency</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-2">Nairobi HQ · 2026</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 6. TRUSTED PARTNERS MARQUEE */}
      <section className="py-24 bg-slate-50 border-y border-slate-100 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 hover:opacity-100 transition-all duration-1000 grayscale hover:grayscale-0">
            {["SAFARICOM", "KCB BANK", "UNEP", "COCA-COLA", "BMW KENYA", "AIRTEL"].map(brand => (
              <span key={brand} className="text-2xl font-black tracking-tighter text-[#0b0e14] font-sans">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 7. EXECUTIVE CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-40">
        <div className="relative rounded-[80px] overflow-hidden bg-white border border-slate-100 p-12 md:p-32 text-center shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.05),transparent_70%)] opacity-50" />
          <div className="relative z-10 max-w-4xl mx-auto space-y-12">
            <h2 className="font-display text-6xl md:text-[140px] leading-[0.8] tracking-tighter text-[#0b0e14] uppercase font-black">Success <br /><span className="text-gold">Architected.</span></h2>
            <p className="text-slate-500 text-xl md:text-3xl font-medium max-w-2xl mx-auto leading-relaxed">
              Connect with our technical directors to discuss your project's high-precision blueprint.
            </p>
            <div className="flex flex-wrap justify-center gap-8 pt-6">
              <Link to="/booking" className="h-24 px-20 rounded-[32px] bg-[#0b0e14] text-white font-black text-sm uppercase tracking-[0.3em] flex items-center gap-4 hover:bg-gold hover:text-[#0b0e14] transition-all shadow-2xl">
                Start Strategy <ArrowRight size={24} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
