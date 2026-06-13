import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Search,
  Camera,
  ExternalLink,
  Award,
  ShieldCheck,
  Users,
  Calendar,
  Filter
} from "lucide-react";
import wedding from "../assets/gallery-wedding.jpg";
import corporate from "../assets/gallery-corporate.jpg";
import concert from "../assets/gallery-concert.jpg";
import birthday from "../assets/gallery-birthday.jpg";
import launch from "../assets/gallery-launch.jpg";
import decor from "../assets/gallery-decor.jpg";
import { createPageSeo } from "../lib/seo";

export const Route = createFileRoute("/portfolio")({
  head: () =>
    createPageSeo({
      title: "The Royal Vault | Portfolio of Premier Events Nairobi",
      description:
        "Explore our portfolio of high-impact corporate galas, luxury weddings, and world-class concert productions. Proven excellence across East Africa.",
      path: "/portfolio",
      keywords: "event portfolio Nairobi, wedding gallery Kenya, corporate event photos",
    }),
  component: Portfolio,
});

const items = [
  { src: corporate, cat: "Corporate", title: "Global Leadership Summit", location: "Upper Hill, Nairobi", scale: "500+ Executives" },
  { src: wedding, cat: "Weddings", title: "Grand Ballroom Nuptials", location: "Windsor Golf Club", scale: "Elite VIP" },
  { src: concert, cat: "Concerts", title: "Afro-Beats Live Production", location: "KICC Grounds", scale: "15,000+ Attendees" },
  { src: launch, cat: "Launches", title: "Automotive Brand Reveal", location: "Muthaiga Square", scale: "Strategic Launch" },
  { src: decor, cat: "Decor", title: "The Royal Indigo Gala", location: "Serena Hotel", scale: "Bespoke Design" },
  { src: birthday, cat: "Private", title: "Private Milestone Celebration", location: "Karen Estate", scale: "Discreet VIP" },
  { src: corporate, cat: "Corporate", title: "Bank Anniversary Production", location: "Radisson Blu", scale: "Corporate History" },
  { src: wedding, cat: "Weddings", title: "Coastal Luxury Vows", location: "Diani Beach", scale: "Destination Wedding" },
];

const categories = ["All", "Corporate", "Weddings", "Concerts", "Launches", "Decor", "Private"];

function Portfolio() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? items : items.filter((i) => i.cat === filter);

  return (
    <div className="bg-[#0b0e14] text-white font-sans">
      {/* 1. STRATEGIC PORTFOLIO HEADER */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[140px] -mr-80 -mt-80" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
          <div className="flex items-center gap-3 text-gold mb-6">
             <div className="h-[1px] w-12 bg-gold" />
             <p className="text-[10px] font-bold uppercase tracking-[0.4em]">The Royal Vault</p>
          </div>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-[100px] leading-[0.85] tracking-tighter max-w-5xl">
            Proven <span className="text-gold">Success</span>. <br />
            Visualized.
          </h1>
          <p className="mt-10 max-w-3xl text-lg md:text-xl text-gray-400 font-light leading-relaxed">
            A curated selection of our high-impact productions. Each project represents our commitment to operational precision and cinematic design for the world's most demanding clients.
          </p>
        </div>
      </section>

      {/* 2. PROFESSIONAL FILTER SYSTEM */}
      <section className="sticky top-16 sm:top-20 z-30 bg-[#0b0e14]/90 backdrop-blur-xl border-b border-white/5 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0 w-full md:w-auto">
            <Filter size={14} className="text-gold shrink-0 mr-2" />
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-300 whitespace-nowrap ${
                  filter === c
                    ? "bg-gold text-[#0b0e14] border-gold shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                    : "border-white/10 text-gray-500 hover:border-white/30 hover:text-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input
              type="text"
              placeholder="Search Projects..."
              className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-6 text-xs text-white focus:ring-1 focus:ring-gold outline-none w-64"
            />
          </div>
        </div>
      </section>

      {/* 3. CASE STUDY GRID (BUSINESS FOCUS) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-12">
          {filtered.map((item, i) => (
            <div key={`${item.title}-${i}`} className="group relative space-y-6">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[40px] border border-white/5 shadow-2xl">
                <img
                  src={item.src}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-transparent to-transparent opacity-60" />

                {/* View Project Badge */}
                <div className="absolute top-8 right-8 h-12 w-12 rounded-full bg-gold text-[#0b0e14] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-90 group-hover:scale-100 shadow-xl">
                  <ExternalLink size={18} />
                </div>
              </div>

              <div className="flex justify-between items-start px-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-gold text-[10px] font-black uppercase tracking-widest">{item.cat}</span>
                    <div className="h-[1px] w-4 bg-white/10" />
                    <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{item.scale}</span>
                  </div>
                  <h3 className="font-display text-3xl md:text-4xl text-white group-hover:text-gold transition-colors">{item.title}</h3>
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <Calendar size={12} className="text-gold" />
                    <span>2024 Production</span>
                    <span className="mx-2">•</span>
                    <span>{item.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TRUST & QUALITY STANDARDS */}
      <section className="py-24 bg-white/[0.02] border-y border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {[
              { icon: ShieldCheck, title: "Absolute Security", desc: "We maintain 100% discretion and security for our high-profile and private VIP engagements." },
              { icon: Award, title: "Award Winning", desc: "Recognized internationally for our standards in production and creative execution." },
              { icon: Users, title: "Elite Coordination", desc: "Every project is overseen by a senior executive producer to ensure perfect delivery." }
            ].map((feature, i) => (
              <div key={i} className="space-y-4">
                 <div className="h-14 w-14 rounded-2xl bg-gold/5 border border-gold/10 flex items-center justify-center text-gold mx-auto">
                    <feature.icon size={24} />
                 </div>
                 <h4 className="font-display text-2xl text-white">{feature.title}</h4>
                 <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PORTFOLIO CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-32">
        <div className="relative rounded-[48px] overflow-hidden bg-white/5 border border-white/10 p-12 md:p-24 text-center">
          <div className="absolute inset-0 bg-radial-indigo opacity-20" />
          <div className="relative z-10 max-w-3xl mx-auto space-y-10">
            <div className="flex justify-center">
               <Camera size={48} className="text-gold animate-pulse" />
            </div>
            <h2 className="font-display text-5xl md:text-8xl leading-none text-white tracking-tight">Your Event is the <br /><span className="text-gold italic">Next Success Story</span>.</h2>
            <p className="text-gray-400 text-lg md:text-xl font-light">
              We focus on a limited number of projects to ensure world-class attention to detail. Discuss your project with us today.
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-10">
              <Link to="/booking" className="h-16 px-12 rounded-full bg-gold text-[#0b0e14] font-black text-sm flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_50px_rgba(212,175,55,0.3)]">
                Secure Your Date <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="h-16 px-12 rounded-full border border-white/10 bg-white/5 text-white font-bold text-sm flex items-center hover:bg-white/10 transition">
                Consult With Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
