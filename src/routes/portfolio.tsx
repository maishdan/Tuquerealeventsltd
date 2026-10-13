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
  ChevronDown,
  Star,
  MapPin,
  CheckCircle2
} from "lucide-react";
import wedding from "../assets/gallery-wedding.jpg";
import corporate from "../assets/gallery-corporate.jpg";
import concert from "../assets/gallery-concert.jpg";
import birthday from "../assets/gallery-birthday.jpg";
import launch from "../assets/gallery-launch.jpg";
import decor from "../assets/gallery-decor.jpg";
import { createPageSeo } from "../lib/seo";
import { useFavorites } from "@/contexts/FavoritesContext";
import { cn } from "@/lib/utils";

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
  { id: "port-001", src: corporate, cat: "Corporate", title: "Global Leadership Summit", location: "Upper Hill, Nairobi", scale: "500+ Executives", year: "2026" },
  { id: "port-002", src: wedding, cat: "Weddings", title: "Grand Ballroom Nuptials", location: "Windsor Golf Club", scale: "Elite VIP", year: "2026" },
  { id: "port-003", src: concert, cat: "Concerts", title: "Afro-Beats Live Production", location: "KICC Grounds", scale: "15,000+ Attendees", year: "2025" },
  { id: "port-004", src: launch, cat: "Launches", title: "Automotive Brand Reveal", location: "Muthaiga Square", scale: "Strategic Launch", year: "2025" },
  { id: "port-005", src: decor, cat: "Decor", title: "The Royal Indigo Gala", location: "Serena Hotel", scale: "Bespoke Design", year: "2025" },
  { id: "port-006", src: birthday, cat: "Private", title: "Private Milestone Celebration", location: "Karen Estate", scale: "Discreet VIP", year: "2025" },
  { id: "port-007", src: corporate, cat: "Corporate", title: "Bank Anniversary Production", location: "Radisson Blu", scale: "Corporate History", year: "2024" },
  { id: "port-008", src: wedding, cat: "Weddings", title: "Coastal Luxury Vows", location: "Diani Beach", scale: "Destination Wedding", year: "2024" },
];

const categories = ["All", "Corporate", "Weddings", "Concerts", "Launches", "Decor", "Private"];

export function Portfolio() {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % heroImages.length);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const filtered = items.filter((item) => {
    const matchesCat = filter === "All" || item.cat === filter;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cat.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="relative min-w-0 bg-[#0b0e14] bg-[url('/ltd.png')] bg-cover bg-center bg-fixed text-foreground font-sans overflow-x-hidden transition-colors duration-300">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[55vh] flex flex-col items-center justify-start overflow-hidden pt-12 pb-16 border-b border-white/10 bg-[#0b0e14]/85 backdrop-blur-md">
        <div className="absolute inset-0 z-0">
          {heroImages.map((src, idx) => (
            <img
              key={src}
              src={src}
              alt="Royal Vault"
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-[2500ms] ease-in-out scale-105",
                idx === currentImgIndex ? "opacity-15 dark:opacity-25" : "opacity-0"
              )}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-slate-50/95 to-[#f8fafc] dark:from-[#0b0e14]/90 dark:via-[#0b0e14]/95 dark:to-[#0b0e14]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10 w-full text-center mt-12 md:mt-16 space-y-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-none bg-gold/10 border border-gold/40 text-gold text-[10px] font-black uppercase tracking-[0.3em] shadow-sm">
                <ShieldCheck size={14} className="text-gold" /> The Royal Vault · Over 1,200+ Delivered Case Studies
              </div>
            </div>

            <h1 className="text-4xl sm:text-7xl lg:text-[90px] font-black tracking-tighter uppercase leading-[0.88] text-[#0b0e14] dark:text-white">
              Executive <br />
              <span className="text-gold font-display font-normal">Case Studies.</span>
            </h1>

            <p className="max-w-2xl mx-auto text-sm sm:text-lg md:text-xl font-medium text-slate-700 dark:text-gray-300 leading-relaxed">
              Explore our portfolio of high-impact corporate galas, luxury weddings, and stadium concert productions engineered for the world's most demanding brands.
            </p>
          </div>
        </div>
      </section>

      {/* 2. FILTER & SEARCH BAR */}
      <section className="py-8 bg-slate-100 dark:bg-[#121722] border-b border-slate-200 dark:border-white/10 sticky top-20 z-30 shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={cn(
                  "px-4 py-2.5 rounded-none text-[9px] font-black uppercase tracking-widest border transition-all cursor-pointer whitespace-nowrap",
                  filter === c
                    ? "bg-gold text-black border-gold shadow-md"
                    : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-foreground hover:border-gold"
                )}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
            <input
              type="text"
              placeholder="Search by title or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 bg-white dark:bg-[#0b0e14] border border-slate-300 dark:border-white/10 rounded-none pl-11 pr-4 text-xs font-bold text-foreground outline-none focus:border-gold transition-all"
            />
          </div>
        </div>
      </section>

      {/* 3. CASE STUDY GRID */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-10">
          {filtered.map((item) => {
            const isFav = isFavorite(item.id);
            return (
              <div
                key={item.id}
                className="group relative flex flex-col bg-white dark:bg-[#121722] border border-slate-200 dark:border-white/10 rounded-none overflow-hidden hover:border-gold transition-all duration-300 shadow-md"
              >
                {/* Image Frame */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-200 dark:bg-black/40">
                  <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-gold text-black font-black text-[9px] uppercase tracking-widest shadow-md">
                    {item.cat}
                  </div>

                  {/* Bookmark Star Button */}
                  <button
                    onClick={() =>
                      toggleFavorite({
                        id: item.id,
                        title: item.title,
                        category: item.cat,
                        link: "/portfolio",
                        image: item.src,
                      })
                    }
                    className={cn(
                      "absolute top-4 right-4 h-10 w-10 border flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer",
                      isFav
                        ? "bg-gold text-black border-gold"
                        : "bg-black/60 border-white/20 text-white hover:border-gold hover:text-gold"
                    )}
                    title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                  >
                    <Star size={16} className={cn(isFav && "fill-black")} />
                  </button>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                </div>

                {/* Details Body */}
                <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gold">
                      <span>{item.scale}</span>
                      <span className="text-muted-foreground font-mono">{item.year} Production</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#0b0e14] dark:text-white group-hover:text-gold transition-colors">
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-gray-400">
                      <MapPin size={14} className="text-gold" />
                      <span>{item.location}</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-4">
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                      Verified Case Study
                    </span>

                    <Link
                      to="/booking"
                      className="h-11 px-6 rounded-none bg-gold text-black font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-black hover:text-white transition-all shadow-sm"
                    >
                      Inquire Similar Event <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. TRUST & QUALITY STANDARDS */}
      <section className="py-20 bg-white dark:bg-[#0b0e14] border-y border-slate-200 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "Absolute Security",
                desc: "100% discretion and security for high-stakes corporate and VIP private engagements.",
              },
              {
                icon: Award,
                title: "Award-Winning Quality",
                desc: "Recognized internationally for production precision, audio staging, and lighting architecture.",
              },
              {
                icon: Users,
                title: "Senior Producer Direction",
                desc: "Every project is overseen by an executive producer from initial brief to final breakdown.",
              },
            ].map((feature, i) => (
              <div key={i} className="p-8 bg-slate-50 dark:bg-[#121722] border border-slate-200 dark:border-white/10 rounded-none space-y-4 shadow-sm">
                <div className="h-12 w-12 rounded-none bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                  <feature.icon size={24} />
                </div>
                <h4 className="text-xl font-black uppercase tracking-tight text-foreground">{feature.title}</h4>
                <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="py-24 bg-slate-100 dark:bg-[#0d121c]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative rounded-none border border-gold/40 bg-gradient-to-r from-gold/10 via-white to-gold/10 dark:from-gold/10 dark:via-[#0b0e14] dark:to-gold/10 p-12 sm:p-20 text-center space-y-8 shadow-2xl">
            <div className="max-w-3xl mx-auto space-y-4">
              <h2 className="text-4xl sm:text-7xl font-black uppercase tracking-tight text-[#0b0e14] dark:text-white leading-tight">
                Your Event Is <br />
                <span className="text-gold text-gradient-gold">The Next Legacy.</span>
              </h2>
              <p className="text-slate-700 dark:text-gray-300 text-sm sm:text-lg font-medium max-w-xl mx-auto">
                We focus on a limited number of high-stakes projects to guarantee world-class execution.
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
