import { createFileRoute, Link } from "@tanstack/react-router";
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
import corporate from "../assets/gallery-corporate.jpg";
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
  return (
    <div className="bg-[#0b0e14] text-white font-sans">
      {/* 1. STRATEGIC HEADER */}
      <section className="relative pt-32 pb-24 overflow-hidden border-b border-white/5 bg-[#0b0e14]">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[140px] -mr-80 -mt-80" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
          <div className="flex items-center gap-3 text-gold mb-6">
             <div className="h-[1px] w-12 bg-gold" />
             <p className="text-[10px] font-bold uppercase tracking-[0.4em]">Service Portfolio 2025</p>
          </div>
          <h1 className="font-display text-6xl sm:text-7xl lg:text-9xl leading-[0.85] tracking-tighter">
            Operational <br />
            <span className="text-gold italic">Disciplines.</span>
          </h1>
          <p className="mt-10 max-w-3xl text-lg md:text-xl text-gray-400 font-light leading-relaxed">
            We deliver a vertically integrated service model. Royal Touch Events eliminates operational fragmentation by managing every technical and creative vertical in-house.
          </p>
        </div>
      </section>

      {/* 2. CATEGORIZED SERVICE GRID (MODULAR BUSINESS TILES) */}
      <div className="py-24 space-y-32">
        {serviceCategories.map((cat, idx) => (
          <section key={idx} className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-center gap-6 mb-16">
               <h2 className="font-display text-4xl text-white tracking-tight whitespace-nowrap">{cat.category}</h2>
               <div className="h-px w-full bg-white/10" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cat.services.map((s, i) => (
                <div key={i} className="group relative flex flex-col bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden hover:border-gold/40 transition-all duration-500">
                  <div className="p-8 space-y-6 flex-1">
                    <div className="flex justify-between items-start">
                      <div className="h-12 w-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20 group-hover:bg-gold group-hover:text-black transition-all duration-500">
                        <s.icon size={20} />
                      </div>
                      <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-500 bg-white/5 px-2 py-1 rounded-md">Tier 1 Service</span>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-display text-3xl text-white tracking-tight group-hover:text-gold transition-colors">{s.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                    </div>

                    <div className="space-y-3 pt-6 border-t border-white/5">
                      <p className="text-[9px] font-black uppercase tracking-widest text-gold/60">Core Deliverables</p>
                      <ul className="grid grid-cols-1 gap-2">
                         {s.deliverables.map((d, dIdx) => (
                           <li key={dIdx} className="flex items-center gap-2 text-[10px] text-gray-400 font-bold">
                              <CheckCircle2 size={12} className="text-gold" />
                              {d}
                           </li>
                         ))}
                      </ul>
                    </div>
                  </div>

                  <Link
                    to="/booking"
                    className="flex items-center justify-between p-6 bg-white/[0.03] border-t border-white/5 group-hover:bg-gold group-hover:text-black transition-all"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest">Inquire Strategy</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* 3. THE BUSINESS CASE */}
      <section className="py-32 bg-white/[0.02] border-y border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
             <div className="space-y-8">
                <p className="text-gold text-xs font-bold uppercase tracking-[0.4em]">ROI & Performance</p>
                <h2 className="font-display text-5xl md:text-7xl">Production with <br />Accountability.</h2>
                <p className="text-gray-400 text-lg leading-relaxed max-w-xl font-light">
                   We align our service delivery with your business KPIs. Every event we produce is measured by its impact on your brand equity and audience engagement.
                </p>
                <div className="grid sm:grid-cols-2 gap-8 pt-8">
                   {[
                     { title: "Engagement Tracking", desc: "Data-driven insights for brand activations." },
                     { title: "Risk Management", desc: "Redundant systems for zero-failure production." }
                   ].map((item, i) => (
                     <div key={i} className="space-y-2">
                        <h4 className="text-white font-bold text-sm uppercase tracking-widest">{item.title}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                     </div>
                   ))}
                </div>
             </div>
             <div className="relative">
                <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                   <img src={corporate} alt="Executive Strategy" className="h-full w-full object-cover grayscale opacity-60" />
                </div>
                <div className="absolute -bottom-8 -right-8 glass-strong p-8 rounded-2xl animate-float-slow hidden xl:block">
                   <p className="font-display text-4xl text-gradient-gold">100%</p>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Technical Uptime</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 4. ULTIMATE SERVICE CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-32">
        <div className="relative rounded-[40px] overflow-hidden bg-[#0b0e14] border border-white/10 p-12 md:p-24 text-center">
          <div className="absolute inset-0 bg-radial-indigo opacity-30" />
          <div className="relative z-10 max-w-3xl mx-auto space-y-10">
            <h2 className="font-display text-5xl md:text-9xl leading-none tracking-tighter">Scale Your <br /><span className="text-gold">Ambition.</span></h2>
            <p className="text-gray-400 text-lg md:text-xl font-light">
              Connect with our executive production team to define your project's technical and creative blueprint.
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-10">
              <Link to="/booking" className="h-16 px-12 rounded-full bg-gold text-[#0b0e14] font-black text-sm flex items-center gap-2 hover:bg-white transition-all">
                Request Strategy Session <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="h-16 px-12 rounded-full border border-white/10 text-white font-bold text-sm flex items-center hover:bg-white/5 transition">
                Consult With Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
