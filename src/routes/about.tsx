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
  Zap
} from "lucide-react";
import decor from "../assets/gallery-decor.jpg";
import corporate from "../assets/gallery-corporate.jpg";
import { createPageSeo } from "../lib/seo";

export const Route = createFileRoute("/about")({
  head: () =>
    createPageSeo({
      title: "Our Story & Philosophy | Royal Touch Events Nairobi",
      description:
        "Learn about Royal Touch Events' 15-year legacy of excellence in Nairobi. Discover our strategic approach to luxury event production and our commitment to ultimate client service.",
      path: "/about",
      keywords: "about Royal Touch Events, event company Nairobi, luxury event production Kenya",
    }),
  component: About,
});

function About() {
  return (
    <div className="bg-[#0b0e14] text-white font-sans">
      {/* 1. LEADERSHIP & LEGACY HEADER */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
          <div className="flex items-center gap-3 text-gold mb-6">
             <div className="h-[1px] w-12 bg-gold" />
             <p className="text-[10px] font-bold uppercase tracking-[0.4em]">Established 2011</p>
          </div>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-[100px] leading-[0.9] tracking-tight max-w-5xl">
            Building Legacies Through <br />
            <span className="text-gold">Exceptional</span> Production.
          </h1>
          <p className="mt-10 max-w-3xl text-lg md:text-xl text-gray-400 font-light leading-relaxed">
            For over 15 years, Royal Touch Events has stood as a beacon of reliability and artistic excellence in East Africa. We don't just plan events; we engineer unforgettable corporate milestones and private celebrations.
          </p>
        </div>
      </section>

      {/* 2. THE BUSINESS PROMISE (TRUST & SERVICE) */}
      <section className="py-32 bg-white/[0.01]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative group">
               <div className="absolute -inset-4 bg-gold/10 rounded-[40px] blur-3xl opacity-0 group-hover:opacity-100 transition duration-1000" />
               <img src={corporate} alt="Executive Event" className="relative rounded-[40px] shadow-2xl border border-white/10" />
               <div className="absolute -bottom-8 -left-8 glass-strong p-8 rounded-3xl animate-float-slow">
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                        <ShieldCheck size={24} />
                     </div>
                     <div>
                        <p className="text-white font-bold">Absolute Reliability</p>
                        <p className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">Our Service Standard</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="space-y-10">
              <div className="space-y-4">
                 <p className="text-gold text-xs font-bold uppercase tracking-[0.3em]">The Royal Touch Difference</p>
                 <h2 className="font-display text-4xl md:text-6xl text-white leading-tight">Professionalism without compromise.</h2>
              </div>

              <div className="space-y-8">
                 <p className="text-gray-400 text-lg leading-relaxed">
                   Founded on the principles of integrity and artistic innovation, our agency has evolved into a strategic partner for multinational brands and elite private clients.
                 </p>

                 <div className="grid sm:grid-cols-2 gap-8">
                    {[
                      { icon: HeartHandshake, title: "Client First", desc: "Your objectives are our primary operational directive." },
                      { icon: Zap, title: "Fast Response", desc: "Our 24/7 concierge ensures you are never without support." },
                      { icon: Target, title: "Precision", desc: "From micro-logistics to grand aesthetic themes." },
                      { icon: Award, title: "Quality", desc: "We only partner with the top 5% of industry vendors." },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4">
                         <item.icon size={20} className="text-gold shrink-0 mt-1" />
                         <div>
                            <h4 className="font-bold text-white text-sm">{item.title}</h4>
                            <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. STRATEGIC METRICS (MARKETING ORIENTED) */}
      <section className="py-24 bg-white/[0.02] border-y border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { n: "1,200+", l: "Events Delivered" },
              { n: "15yrs", l: "Industry Mastery" },
              { n: "65+", l: "Brand Partners" },
              { n: "100%", l: "Client Commitment" }
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="font-display text-5xl md:text-6xl text-gold">{stat.n}</div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-black">{stat.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. MISSION & VISION (MARKETABILITY) */}
      <section className="py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
           <div className="grid md:grid-cols-2 gap-8">
              <div className="glass-strong p-12 rounded-[40px] border border-white/5 space-y-6">
                 <div className="h-12 w-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
                    <Target size={24} />
                 </div>
                 <h3 className="font-display text-4xl text-white">Our Strategic Mission</h3>
                 <p className="text-gray-400 leading-relaxed italic">
                   "To engineer moments of high impact through impeccable design and rigorous operational standards, ensuring every client project is a benchmark for excellence in the industry."
                 </p>
              </div>
              <div className="glass-strong p-12 rounded-[40px] border border-white/5 space-y-6">
                 <div className="h-12 w-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
                    <Sparkles size={24} />
                 </div>
                 <h3 className="font-display text-4xl text-white">The 2030 Vision</h3>
                 <p className="text-gray-400 leading-relaxed italic">
                   "To remain Africa's most trusted authority in luxury event production, continuously redefining the boundaries of what is possible in experiential marketing and celebration."
                 </p>
              </div>
           </div>
        </div>
      </section>

      {/* 5. TEAM PHILOSOPHY (HUMAN-CENTRIC BUT BUSINESS ORIENTED) */}
      <section className="py-32 bg-white/[0.01] border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-6 mb-20">
             <p className="text-gold text-xs font-bold uppercase tracking-[0.4em]">The Experts</p>
             <h2 className="font-display text-5xl md:text-7xl">Driven by Mastery.</h2>
             <p className="text-gray-400">Our team consists of senior producers, creative directors, and technical engineers who share a singular obsession: Perfection.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {["Senior Planners", "Creative Directors", "Technical Leads", "Operations Specialists"].map((role, i) => (
                <div key={i} className="group relative h-80 rounded-[32px] overflow-hidden border border-white/10 bg-[#0b0e14] flex flex-col justify-end p-8">
                   <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] to-transparent opacity-60" />
                   <div className="relative z-10 space-y-2">
                      <div className="h-[1px] w-8 bg-gold group-hover:w-full transition-all duration-500" />
                      <p className="text-white font-bold text-lg">{role}</p>
                      <p className="text-[10px] uppercase tracking-widest text-gold font-bold">Royal Touch Team</p>
                   </div>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* 6. TRUST-BUILDING CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-32">
        <div className="relative rounded-[48px] overflow-hidden bg-white/5 border border-white/10 p-12 md:p-24 text-center">
          <div className="max-w-3xl mx-auto space-y-10">
            <h2 className="font-display text-5xl md:text-8xl leading-none text-white tracking-tight">Trust Your Vision to the <span className="text-gold">Professionals</span>.</h2>
            <p className="text-gray-400 text-lg md:text-xl font-light">
              We provide a level of service and security that is unique to Royal Touch. Let's discuss how we can bring our 15 years of mastery to your next project.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-10">
              <Link to="/booking" className="h-16 px-12 rounded-full bg-gold text-[#0b0e14] font-black text-sm flex items-center gap-2 hover:scale-105 transition-all">
                Book a Strategy Session <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="h-16 px-12 rounded-full border border-white/10 bg-white/5 text-white font-bold text-sm flex items-center hover:bg-white/10 transition">
                Speak to Leadership
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
