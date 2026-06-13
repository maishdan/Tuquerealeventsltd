import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Briefcase,
  Heart,
  Cake,
  Music,
  Users,
  Rocket,
  Sparkles,
  Lightbulb,
  Camera,
  Mic,
  ArrowRight,
  ShieldCheck,
  Zap,
  Star,
  CheckCircle2,
  BarChart3,
  Globe
} from "lucide-react";
import { createPageSeo, SERVICE_KEYWORDS } from "../lib/seo";

export const Route = createFileRoute("/services")({
  head: () => ({
    ...createPageSeo({
      title: "Business Solutions & Services | Royal Touch Events",
      description:
        "Professional event solutions for the corporate and luxury sectors. Explore our vertically integrated production services in Nairobi.",
      path: "/services",
      keywords: SERVICE_KEYWORDS,
    }),
  }),
  component: Services,
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

const serviceCategories = [
  {
    category: "Executive Solutions",
    services: [
      {
        icon: Briefcase,
        title: "Corporate Strategy",
        desc: "Strategic event production engineered for high-stakes board retreats and brand activations.",
        deliverables: ["Strategy Alignment", "Logistics Mastery", "Impact Reporting"]
      },
      {
        icon: Rocket,
        title: "Product Launches",
        desc: "High-impact reveal events designed to capture market share and drive significant media disruption.",
        deliverables: ["Experiential Design", "Press Coordination", "Teaser Campaigns"]
      },
      {
        icon: Users,
        title: "Global Conferences",
        desc: "End-to-end management for multinational summits, ensuring seamless technical and delegate flow.",
        deliverables: ["AV Orchestration", "Delegate Concierge", "Multi-Track Management"]
      },
    ]
  },
  {
    category: "Luxury Assets",
    services: [
      {
        icon: Heart,
        title: "Bespoke Weddings",
        desc: "Discreet and high-end planning for exclusive nuptials, from concept to day-of execution.",
        deliverables: ["Venue Curation", "Aesthetic Blueprint", "Vendor Synergy"]
      },
      {
        icon: Cake,
        title: "VIP Private Events",
        desc: "Curated milestone celebrations for elite individuals demanding the highest level of privacy and craft.",
        deliverables: ["Discreet Security", "Custom Themes", "Bespoke Entertainment"]
      },
      {
        icon: Sparkles,
        title: "Bespoke Decoration",
        desc: "Artistic floral and structural installations that transform environments into sensory experiences.",
        deliverables: ["Floral Architecture", "Lighting Design", "Furniture Curation"]
      },
    ]
  },
  {
    category: "Technical Production",
    services: [
      {
        icon: Music,
        title: "Concert Logistics",
        desc: "Stadium-grade sound, lighting, and stage production for major international and local festivals.",
        deliverables: ["Backline Support", "Technical Rigging", "Artist Logistics"]
      },
      {
        icon: Lightbulb,
        title: "Technical AV Hub",
        desc: "Professional audio-visual ecosystems featuring 4K live-streaming and intelligent lighting arrays.",
        deliverables: ["Live Streaming", "Pro Audio", "Stage Lighting"]
      },
      {
        icon: Camera,
        title: "Media Production",
        desc: "Cinematic documentation and editorial photography designed to build your event's digital legacy.",
        deliverables: ["4K Cinematography", "Still Photography", "Post-Production"]
      },
    ]
  }
];

function Services() {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % heroImages.length);
    }, 60000); // Switch every 1 minute
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#0b0e14] text-white font-sans min-w-0">
      {/* 1. HERO SECTION (MATCHES HOME PAGE) */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-start overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          {heroImages.map((src, idx) => (
            <img
              key={src}
              src={src}
              alt={`Royal Services Hero ${idx}`}
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
                  <Star size={12} className="fill-gold" /> Comprehensive Industry Solutions
                </div>
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-[100px] font-black tracking-tighter text-white uppercase leading-[0.85]">
                Operational <br />
                <span className="text-gold">Disciplines.</span>
              </h1>
              <p className="max-w-2xl mx-auto text-base md:text-xl text-gray-200 font-medium leading-relaxed">
                We deliver a vertically integrated service model. Royal Touch Events eliminates operational fragmentation by managing every technical and creative vertical in-house.
              </p>
            </div>

            <div className="flex justify-center pt-4">
               <div className="h-1 w-24 bg-gold rounded-full shadow-[0_0_20px_rgba(212,175,55,0.5)]" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIZED SERVICE GRID */}
      <div className="py-24 space-y-32">
        {serviceCategories.map((cat, idx) => (
          <section key={idx} className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-center gap-6 mb-16">
               <h2 className="font-display text-4xl sm:text-5xl text-white tracking-tight whitespace-nowrap uppercase font-black">{cat.category}</h2>
               <div className="h-px w-full bg-white/10" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cat.services.map((s, i) => (
                <div key={i} className="group relative flex flex-col bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden hover:border-gold/40 transition-all duration-500">
                  <div className="p-10 space-y-8 flex-1">
                    <div className="flex justify-between items-start">
                      <div className="h-16 w-16 rounded-2xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20 group-hover:bg-gold group-hover:text-[#0b0e14] transition-all duration-500 shadow-2xl shadow-gold/5">
                        <s.icon size={28} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 bg-white/5 px-3 py-1.5 rounded-lg">Tier 1 Service</span>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-display text-4xl text-white tracking-tight group-hover:text-gold transition-colors">{s.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                    </div>

                    <div className="space-y-5 pt-8 border-t border-white/5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gold/60">Core Deliverables</p>
                      <ul className="grid grid-cols-1 gap-3">
                         {s.deliverables.map((d, dIdx) => (
                           <li key={dIdx} className="flex items-center gap-3 text-xs text-gray-400 font-bold uppercase tracking-tight">
                              <CheckCircle2 size={14} className="text-gold shrink-0" />
                              {d}
                           </li>
                         ))}
                      </ul>
                    </div>
                  </div>

                  <Link
                    to="/booking"
                    className="flex items-center justify-between p-8 bg-white/[0.03] border-t border-white/5 group-hover:bg-gold group-hover:text-[#0b0e14] transition-all"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest">Inquire Strategy Brief</span>
                    <ArrowRight size={18} />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* 3. BUSINESS ROI (MATCHES HOME PAGE) */}
      <section className="py-32 bg-white/[0.01] border-y border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
             <div className="space-y-12">
                <div className="space-y-6">
                  <p className="text-gold text-xs font-black uppercase tracking-[0.4em]">ROI & Performance</p>
                  <h2 className="font-display text-5xl md:text-8xl tracking-tighter leading-none uppercase font-black">Production with <br /><span className="text-gold">Accountability.</span></h2>
                  <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-xl font-medium">
                     We align our service delivery with your business KPIs. Every event we produce is measured by its impact on your brand equity and audience engagement.
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-10">
                   {[
                     { title: "Engagement Tracking", desc: "Data-driven insights for brand activations." },
                     { title: "Risk Management", desc: "Redundant systems for zero-failure production." }
                   ].map((item, i) => (
                     <div key={i} className="space-y-3">
                        <h4 className="text-white font-black text-sm uppercase tracking-widest">{item.title}</h4>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium">{item.desc}</p>
                     </div>
                   ))}
                </div>
             </div>
             <div className="relative group">
                <div className="aspect-video rounded-[48px] overflow-hidden border border-white/10 shadow-2xl relative">
                   <img src="/back/e9.jpg" alt="Executive Strategy" className="h-full w-full object-cover opacity-60 transition-all duration-1000 group-hover:opacity-100 group-hover:scale-105" />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-transparent to-transparent opacity-60" />
                </div>
                <div className="absolute -bottom-8 -right-8 glass-strong p-8 rounded-3xl animate-float-slow hidden xl:block">
                   <p className="font-display text-5xl text-gold font-black">100%</p>
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-1">Technical Uptime</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 4. FINAL CALL TO ACTION (MATCHES HOME PAGE) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-32">
        <div className="relative rounded-[40px] md:rounded-[60px] overflow-hidden bg-[#0b0e14] border border-white/10 p-12 md:p-32 text-center">
          <div className="absolute inset-0 bg-radial-indigo opacity-30" />
          <div className="relative z-10 max-w-4xl mx-auto space-y-12">
            <h2 className="font-display text-5xl md:text-9xl leading-none tracking-tighter text-white uppercase font-black">Scale Your <br /><span className="text-gold">Ambition.</span></h2>
            <p className="text-gray-400 text-lg md:text-2xl font-light max-w-2xl mx-auto">
              Connect with our executive production team to define your project's technical and creative blueprint.
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-10">
              <Link to="/booking" className="h-16 md:h-20 px-12 md:px-20 rounded-full bg-gold text-[#0b0e14] font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-[0_0_50px_rgba(212,175,55,0.3)]">
                Request Strategy Session <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
