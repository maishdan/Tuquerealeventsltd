import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  Search,
  Camera,
  ExternalLink,
  Award,
  ShieldCheck,
  Users,
  Calendar,
  Filter,
  ChevronDown
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
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % heroImages.length);
    }, 60000); // Switch every 1 minute
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#0b0e14] text-white font-sans min-w-0">
      {/* 1. HERO SECTION (MATCHES HOME PAGE DESIGN) */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-start overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          {heroImages.map((src, idx) => (
            <img
              key={src}
              src={src}
              alt={`Royal Vault Hero ${idx}`}
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
                  <ShieldCheck size={12} /> Established Industry Leader
                </div>
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-[100px] font-black tracking-tighter text-white uppercase leading-[0.85]">
                The Royal <br />
                <span className="text-gold">Vault.</span>
              </h1>
              <p className="max-w-2xl mx-auto text-base md:text-xl text-gray-200 font-medium leading-relaxed">
                Explore our curated selection of high-impact productions. Each project represents our commitment to operational precision and cinematic design for the world's most demanding clients.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
               <div className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-widest">
                 <Search size={14} className="text-gold" />
                 <span>Explore 1,200+ Delivered Projects</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROFESSIONAL FILTER SYSTEM (SMOOTH & FUNCTIONAL) */}
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
              placeholder="Filter by Project Name..."
              className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-6 text-xs text-white focus:ring-1 focus:ring-gold outline-none w-64 transition-all"
            />
          </div>
        </div>
      </section>

      {/* 3. CASE STUDY GRID (BUSINESS FOCUS & CLEAR IMAGES) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-12 md:gap-16">
          {filtered.map((item, i) => (
            <div key={`${item.title}-${i}`} className="group relative space-y-8">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[32px] md:rounded-[48px] border border-white/5 shadow-2xl bg-white/5 transition-all duration-500 group-hover:border-gold/30">
                <img
                  src={item.src}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-all duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-transparent to-transparent opacity-60" />

                {/* View Project Badge */}
                <div className="absolute top-8 right-8 h-12 w-12 rounded-full bg-gold text-[#0b0e14] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100 shadow-xl">
                  <ExternalLink size={18} />
                </div>
              </div>

              <div className="flex justify-between items-start px-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-gold text-[10px] font-black uppercase tracking-widest">{item.cat}</span>
                    <div className="h-[1px] w-6 bg-white/10" />
                    <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{item.scale}</span>
                  </div>
                  <h3 className="font-display text-4xl md:text-5xl text-white group-hover:text-gold transition-colors">{item.title}</h3>
                  <div className="flex items-center gap-4 text-gray-500 text-xs font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar size={12} className="text-gold" />
                      <span>2024 PRODUCTION</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={12} className="text-gold" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TRUST & QUALITY STANDARDS */}
      <section className="py-24 bg-white/[0.01] border-y border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-16 text-center">
            {[
              { icon: ShieldCheck, title: "Absolute Security", desc: "We maintain 100% discretion and security for our high-profile and private VIP engagements." },
              { icon: Award, title: "Award Winning", desc: "Recognized internationally for our standards in production and creative execution." },
              { icon: Users, title: "Elite Coordination", desc: "Every project is overseen by a senior executive producer to ensure perfect delivery." }
            ].map((feature, i) => (
              <div key={i} className="space-y-6">
                 <div className="h-16 w-16 rounded-2xl bg-gold/5 border border-gold/10 flex items-center justify-center text-gold mx-auto group-hover:bg-gold transition-all">
                    <feature.icon size={28} />
                 </div>
                 <h4 className="font-display text-3xl text-white">{feature.title}</h4>
                 <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PORTFOLIO CTA (MATCHES HOME PAGE) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-32">
        <div className="relative rounded-[40px] md:rounded-[60px] overflow-hidden bg-white/5 border border-white/10 p-12 md:p-32 text-center">
          <div className="absolute inset-0 bg-radial-indigo opacity-30" />
          <div className="relative z-10 max-w-4xl mx-auto space-y-12">
            <div className="flex justify-center">
               <Camera size={64} className="text-gold animate-pulse" />
            </div>
            <h2 className="font-display text-5xl md:text-9xl leading-none text-white tracking-tighter">Your Event is the <br /><span className="text-gold">Next Legacy.</span></h2>
            <p className="text-gray-400 text-lg md:text-2xl font-light max-w-2xl mx-auto">
              We focus on a limited number of projects to ensure world-class attention to detail. Discuss your project with us today.
            </p>
            <div className="flex flex-wrap justify-center gap-6 pt-10">
              <Link to="/booking" className="h-16 md:h-20 px-12 md:px-20 rounded-full bg-gold text-[#0b0e14] font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-[0_0_50px_rgba(212,175,55,0.3)]">
                Secure Your Date <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
