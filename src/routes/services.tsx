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
import { useFavorites } from "@/contexts/FavoritesContext";
import { cn } from "@/lib/utils";

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
        id: "srv-corp-strat",
        icon: Briefcase,
        title: "Corporate Strategy",
        desc: "Strategic event production engineered for high-stakes board retreats and brand activations.",
        deliverables: ["Strategy Alignment", "Logistics Mastery", "Impact Reporting"]
      },
      {
        id: "srv-prod-launch",
        icon: Rocket,
        title: "Product Launches",
        desc: "High-impact reveal events designed to capture market share and drive significant media disruption.",
        deliverables: ["Experiential Design", "Press Coordination", "Teaser Campaigns"]
      },
      {
        id: "srv-global-conf",
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
        id: "srv-bespoke-wed",
        icon: Heart,
        title: "Bespoke Weddings",
        desc: "Discreet and high-end planning for exclusive nuptials, from concept to day-of execution.",
        deliverables: ["Venue Curation", "Aesthetic Blueprint", "Vendor Synergy"]
      },
      {
        id: "srv-vip-events",
        icon: Cake,
        title: "VIP Private Events",
        desc: "Curated milestone celebrations for elite individuals demanding the highest level of privacy and craft.",
        deliverables: ["Discreet Security", "Custom Themes", "Bespoke Entertainment"]
      },
      {
        id: "srv-bespoke-decor",
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
        id: "srv-concert-log",
        icon: Music,
        title: "Concert Logistics",
        desc: "Stadium-grade sound, lighting, and stage production for major international and local festivals.",
        deliverables: ["Backline Support", "Technical Rigging", "Artist Logistics"]
      },
      {
        id: "srv-av-hub",
        icon: Lightbulb,
        title: "Technical AV Hub",
        desc: "Professional audio-visual ecosystems featuring 4K live-streaming and intelligent lighting arrays.",
        deliverables: ["Live Streaming", "Pro Audio", "Stage Lighting"]
      },
      {
        id: "srv-media-prod",
        icon: Camera,
        title: "Media Production",
        desc: "Cinematic documentation and editorial photography designed to build your event's digital legacy.",
        deliverables: ["4K Cinematography", "Still Photography", "Post-Production"]
      },
    ]
  }
];

export function Services() {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % heroImages.length);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-w-0 bg-[#f8fafc] dark:bg-[#0b0e14] text-foreground font-sans overflow-x-hidden transition-colors duration-300">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[55vh] flex flex-col items-center justify-start overflow-hidden pt-12 pb-16 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b0e14]">
        <div className="absolute inset-0 z-0">
          {heroImages.map((src, idx) => (
            <img
              key={src}
              src={src}
              alt={`Royal Services Hero ${idx}`}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[2500ms] ease-in-out scale-105 ${
                idx === currentImgIndex ? "opacity-15 dark:opacity-25" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-slate-50/95 to-[#f8fafc] dark:from-[#0b0e14]/90 dark:via-[#0b0e14]/95 dark:to-[#0b0e14]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10 w-full text-center mt-12 md:mt-16 space-y-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-none bg-gold/10 border border-gold/40 text-gold text-[10px] font-black uppercase tracking-[0.3em] shadow-sm">
                <Star size={14} className="fill-gold" /> Vertically Integrated Event Disciplines
              </div>
            </div>

            <h1 className="text-4xl sm:text-7xl lg:text-[90px] font-black tracking-tighter uppercase leading-[0.88] text-[#0b0e14] dark:text-white">
              Operational <br />
              <span className="text-gold font-display font-normal">Disciplines.</span>
            </h1>

            <p className="max-w-2xl mx-auto text-sm sm:text-lg md:text-xl font-medium text-slate-700 dark:text-gray-300 leading-relaxed">
              We deliver a vertically integrated service model. Royal Touch Events eliminates operational fragmentation by managing every technical and creative vertical in-house.
            </p>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIZED SERVICE GRID */}
      <div className="py-20 space-y-24">
        {serviceCategories.map((cat, idx) => (
          <section key={idx} className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-center justify-between gap-6 mb-12 border-b border-slate-200 dark:border-white/10 pb-6">
              <h2 className="text-3xl sm:text-5xl font-black text-[#0b0e14] dark:text-white uppercase tracking-tight">{cat.category}</h2>
              <span className="text-[10px] font-black uppercase tracking-widest text-gold bg-gold/10 px-3 py-1 border border-gold/30">
                Tier 1 Capability
              </span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cat.services.map((s) => {
                const isFav = isFavorite(s.id);
                return (
                  <div
                    key={s.id}
                    className="group relative flex flex-col bg-white dark:bg-[#121722] border border-slate-200 dark:border-white/10 rounded-none overflow-hidden hover:border-gold transition-all duration-300 shadow-md"
                  >
                    <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                      <div className="space-y-6">
                        <div className="flex justify-between items-start">
                          <div className="h-14 w-14 rounded-none bg-gold/10 border border-gold/30 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all">
                            <s.icon size={26} />
                          </div>

                          {/* FAVORITE STAR BUTTON */}
                          <button
                            onClick={() =>
                              toggleFavorite({
                                id: s.id,
                                title: s.title,
                                category: cat.category,
                                link: "/services",
                              })
                            }
                            className={cn(
                              "h-10 w-10 border rounded-none flex items-center justify-center transition-all cursor-pointer",
                              isFav
                                ? "bg-gold text-black border-gold shadow-md"
                                : "border-slate-200 dark:border-white/10 text-muted-foreground hover:border-gold hover:text-gold"
                            )}
                            title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                          >
                            <Star size={16} className={cn(isFav && "fill-black")} />
                          </button>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-2xl font-black text-[#0b0e14] dark:text-white uppercase tracking-tight group-hover:text-gold transition-colors">
                            {s.title}
                          </h3>
                          <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed font-medium">
                            {s.desc}
                          </p>
                        </div>

                        <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-white/5">
                          <p className="text-[9px] font-black uppercase tracking-widest text-gold">Core Deliverables</p>
                          <ul className="space-y-2">
                            {s.deliverables.map((d, dIdx) => (
                              <li key={dIdx} className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-gray-300 font-bold uppercase tracking-tight">
                                <CheckCircle2 size={14} className="text-gold shrink-0" />
                                <span>{d}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <Link
                        to="/booking"
                        className="mt-6 h-12 w-full bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-foreground font-black text-[10px] uppercase tracking-widest flex items-center justify-between px-6 group-hover:bg-gold group-hover:text-black group-hover:border-gold transition-all shadow-sm"
                      >
                        <span>Inquire Strategy Brief</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* 3. BUSINESS ROI & ACCOUNTABILITY */}
      <section className="py-20 bg-white dark:bg-[#0b0e14] border-y border-slate-200 dark:border-white/10">
        <div className="mx-auto Max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Performance Alignment</p>
                <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0b0e14] dark:text-white leading-tight">
                  Production With Accountability
                </h2>
                <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed font-medium max-w-xl">
                  We align our service delivery with your business KPIs. Every event we produce is measured by its impact on brand equity, stakeholder engagement, and operational uptime.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { title: "Engagement Tracking", desc: "Data-driven metrics for brand activations and corporate summits." },
                  { title: "Redundant Infrastructure", desc: "Backup power & sound systems for zero-failure production." },
                ].map((item, i) => (
                  <div key={i} className="p-6 bg-slate-50 dark:bg-[#121722] border border-slate-200 dark:border-white/10 rounded-none space-y-2">
                    <h4 className="font-black text-xs uppercase tracking-widest text-foreground">{item.title}</h4>
                    <p className="text-[11px] text-slate-600 dark:text-gray-400 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-10 bg-slate-50 dark:bg-[#121722] border border-slate-200 dark:border-white/10 rounded-none space-y-6 shadow-xl text-center">
              <ShieldCheck size={48} className="text-gold mx-auto" />
              <div className="space-y-2">
                <p className="text-4xl font-black font-mono text-gold">100% Uptime</p>
                <p className="text-xs font-black uppercase tracking-widest text-foreground">Technical Redundancy Guarantee</p>
              </div>
              <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed font-medium max-w-sm mx-auto">
                All high-stakes corporate galas and concerts feature dual power feeds and secondary audio/visual rigs for absolute peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="py-24 bg-slate-100 dark:bg-[#0d121c]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative rounded-none border border-gold/40 bg-gradient-to-r from-gold/10 via-white to-gold/10 dark:from-gold/10 dark:via-[#0b0e14] dark:to-gold/10 p-12 sm:p-20 text-center space-y-8 shadow-2xl">
            <div className="max-w-3xl mx-auto space-y-4">
              <h2 className="text-4xl sm:text-7xl font-black uppercase tracking-tight text-[#0b0e14] dark:text-white leading-tight">
                Scale Your <br />
                <span className="text-gold text-gradient-gold">Next Ambition.</span>
              </h2>
              <p className="text-slate-700 dark:text-gray-300 text-sm sm:text-lg font-medium max-w-xl mx-auto">
                Connect with our executive production leads to define your project's technical and creative blueprint.
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
