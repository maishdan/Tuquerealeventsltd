import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Clock,
  ArrowRight,
  Tag,
  TrendingUp,
  Zap,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Star,
  CheckCircle2
} from "lucide-react";
import { createPageSeo } from "../lib/seo";
import { useFavorites } from "@/contexts/FavoritesContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/blog")({
  head: () =>
    createPageSeo({
      title: "Executive Insights | Royal Touch Events Nairobi",
      description:
        "Strategic insights on event production, industry trends, and luxury planning. Explore the Royal Touch Events blog for professional perspectives.",
      path: "/blog",
      keywords: "event planning blog Kenya, wedding tips Nairobi, corporate event trends",
    }),
  component: Blog,
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

const featuredPost = {
  id: "blog-feat-01",
  title: "The Future of Hybrid Corporate Summits in 2026",
  excerpt: "Exploring the strategic intersection of physical presence and digital reach in the modern executive landscape.",
  category: "Strategy",
  date: "Oct 24, 2025",
  readTime: "8 min read",
  image: "https://images.unsplash.com/photo-1540575861501-7ad05823c9f5?q=80&w=2070&auto=format&fit=crop"
};

const posts = [
  {
    id: "blog-01",
    title: "Cinematic Lighting: More Than Just Visibility",
    excerpt: "How intelligent lighting design transforms standard venues into emotionally resonant environments.",
    category: "Production",
    date: "Oct 18, 2025",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "blog-02",
    title: "Sustainability in Luxury: The New Gold Standard",
    excerpt: "Redefining high-end events with zero-waste protocols and ethical sourcing without compromising on grandeur.",
    category: "Trends",
    date: "Oct 12, 2025",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop"
  },
  {
    id: "blog-03",
    title: "The Architecture of a 5,000 Guest Launch",
    excerpt: "A technical deep-dive into the logistics and coordination required for stadium-scale brand reveals.",
    category: "Logistics",
    date: "Sep 28, 2025",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1475721027187-4024733923f9?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "blog-04",
    title: "Curating Entertainment for Global Audiences",
    excerpt: "Balancing local cultural nuances with international standards in artist selection and stage hospitality.",
    category: "Entertainment",
    date: "Sep 15, 2025",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "blog-05",
    title: "Crisis Management: Production Protocols",
    excerpt: "Why our 100% technical uptime record is built on redundant systems and aerospace-grade checklists.",
    category: "Operations",
    date: "Sep 02, 2025",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1454165833767-027eeef1596e?q=80&w=2070&auto=format&fit=crop"
  }
];

const categories = ["All", "Strategy", "Production", "Trends", "Logistics", "Operations"];

function Blog() {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % heroImages.length);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const filteredPosts = posts.filter((p) => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isFeaturedFav = isFavorite(featuredPost.id);

  return (
    <div className="relative min-w-0 bg-[#0b0e14] bg-[url('/ltd.png')] bg-cover bg-center bg-fixed text-foreground font-sans overflow-x-hidden transition-colors duration-300">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[55vh] flex flex-col items-center justify-start overflow-hidden pt-12 pb-16 border-b border-white/10 bg-[#0b0e14]/85 backdrop-blur-md">
        <div className="absolute inset-0 z-0">
          {heroImages.map((src, idx) => (
            <img
              key={src}
              src={src}
              alt="Royal Insights Hero"
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
                <TrendingUp size={14} className="text-gold" /> Strategic Market Intelligence & Editorial
              </div>
            </div>

            <h1 className="text-4xl sm:text-7xl lg:text-[90px] font-black tracking-tighter uppercase leading-[0.88] text-[#0b0e14] dark:text-white">
              Executive <br />
              <span className="text-gold font-display font-normal">Insights.</span>
            </h1>

            <p className="max-w-2xl mx-auto text-sm sm:text-lg md:text-xl font-medium text-slate-700 dark:text-gray-300 leading-relaxed">
              Professional perspectives on strategic event design, high-stakes logistics, and technical production excellence across Nairobi.
            </p>
          </div>
        </div>
      </section>

      {/* 2. FEATURED ARTICLE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="group relative rounded-none overflow-hidden border border-slate-200 dark:border-white/10 bg-white dark:bg-[#121722] flex flex-col lg:flex-row items-stretch hover:border-gold transition-all duration-500 shadow-xl">
          <div className="lg:w-1/2 relative h-80 lg:h-auto overflow-hidden bg-slate-200 dark:bg-black/40">
            <img
              src={featuredPost.image}
              alt={featuredPost.title}
              className="h-full w-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute top-4 left-4 px-3 py-1 bg-gold text-black font-black text-[9px] uppercase tracking-widest shadow-md">
              Featured Insight
            </div>

            {/* Favorite Star Button */}
            <button
              onClick={() =>
                toggleFavorite({
                  id: featuredPost.id,
                  title: featuredPost.title,
                  category: featuredPost.category,
                  link: "/blog",
                })
              }
              className={cn(
                "absolute top-4 right-4 h-10 w-10 border rounded-none flex items-center justify-center transition-all shadow-md cursor-pointer",
                isFeaturedFav
                  ? "bg-gold text-black border-gold"
                  : "bg-black/60 border-white/20 text-white hover:border-gold hover:text-gold"
              )}
              title={isFeaturedFav ? "Remove from Favorites" : "Add to Favorites"}
            >
              <Star size={16} className={cn(isFeaturedFav && "fill-black")} />
            </button>
          </div>

          <div className="lg:w-1/2 p-8 sm:p-12 space-y-6 flex flex-col justify-center">
            <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
              <span className="text-gold font-black">{featuredPost.category}</span>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Calendar size={13} className="text-gold" /> {featuredPost.date}
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Clock size={13} className="text-gold" /> {featuredPost.readTime}
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#0b0e14] dark:text-white group-hover:text-gold transition-colors leading-tight">
              {featuredPost.title}
            </h2>

            <p className="text-sm text-slate-600 dark:text-gray-300 font-medium leading-relaxed">
              {featuredPost.excerpt}
            </p>

            <div className="pt-2">
              <Link
                to="/blog"
                className="h-12 px-8 bg-gold text-black font-black text-[10px] uppercase tracking-[0.2em] inline-flex items-center gap-2 hover:bg-black hover:text-gold transition-all shadow-md"
              >
                Read Strategic Analysis <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FILTER & SEARCH BAR */}
      <section className="py-6 bg-slate-100 dark:bg-[#121722] border-y border-slate-200 dark:border-white/10 sticky top-20 z-30 shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={cn(
                  "px-4 py-2.5 rounded-none text-[9px] font-black uppercase tracking-widest border transition-all cursor-pointer whitespace-nowrap",
                  selectedCategory === c
                    ? "bg-gold text-black border-gold shadow-md"
                    : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-foreground hover:border-gold"
                )}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
            <input
              type="text"
              placeholder="Search insights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 bg-white dark:bg-[#0b0e14] border border-slate-300 dark:border-white/10 rounded-none pl-11 pr-4 text-xs font-bold text-foreground outline-none focus:border-gold transition-all"
            />
          </div>
        </div>
      </section>

      {/* 4. ARTICLES ARCHIVE GRID */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => {
            const isFav = isFavorite(post.id);
            return (
              <article
                key={post.id}
                className="group flex flex-col bg-white dark:bg-[#121722] border border-slate-200 dark:border-white/10 rounded-none overflow-hidden hover:border-gold transition-all duration-300 shadow-md"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-200 dark:bg-black/40">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-gold text-black font-black text-[9px] uppercase tracking-widest shadow-md">
                    {post.category}
                  </div>

                  {/* Favorite Star Button */}
                  <button
                    onClick={() =>
                      toggleFavorite({
                        id: post.id,
                        title: post.title,
                        category: post.category,
                        link: "/blog",
                        image: post.image,
                      })
                    }
                    className={cn(
                      "absolute top-4 right-4 h-10 w-10 border rounded-none flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer",
                      isFav
                        ? "bg-gold text-black border-gold"
                        : "bg-black/60 border-white/20 text-white hover:border-gold hover:text-gold"
                    )}
                    title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                  >
                    <Star size={16} className={cn(isFav && "fill-black")} />
                  </button>
                </div>

                <div className="p-8 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} className="text-gold" /> {post.date}
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock size={12} className="text-gold" /> {post.readTime}
                      </div>
                    </div>

                    <h3 className="text-xl font-black uppercase tracking-tight text-[#0b0e14] dark:text-white group-hover:text-gold transition-colors leading-tight">
                      {post.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-gray-400 font-medium leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gold">Executive Brief</span>
                    <Link
                      to="/blog"
                      className="text-[10px] font-black uppercase tracking-widest text-foreground hover:text-gold transition-colors flex items-center gap-1"
                    >
                      Read Article <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 5. NEWSLETTER DIGEST CTA */}
      <section className="py-24 bg-slate-100 dark:bg-[#0d121c] border-t border-slate-200 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative rounded-none border border-gold/40 bg-white dark:bg-[#0b0e14] p-10 sm:p-16 flex flex-col lg:flex-row items-center gap-12 text-left shadow-2xl">
            <div className="lg:w-3/5 space-y-6">
              <div className="h-14 w-14 rounded-none bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                <TrendingUp size={28} />
              </div>
              <h2 className="text-3xl sm:text-6xl font-black uppercase tracking-tight text-[#0b0e14] dark:text-white leading-tight">
                Join The Executive <br />
                <span className="text-gold text-gradient-gold">Digest.</span>
              </h2>
              <p className="text-slate-600 dark:text-gray-400 text-sm sm:text-base font-medium max-w-xl leading-relaxed">
                Stay ahead with our monthly editorial. Curated event production strategies, technical AV insights, and luxury planning standards delivered directly to your inbox.
              </p>
            </div>

            <div className="lg:w-2/5 w-full bg-slate-50 dark:bg-[#121722] p-8 rounded-none border border-slate-200 dark:border-white/10 space-y-5">
              {subscribed ? (
                <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs uppercase tracking-widest text-center space-y-2">
                  <CheckCircle2 size={32} className="mx-auto text-emerald-400" />
                  <p>Subscription Active! Welcome to the Executive Digest.</p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubscribed(true);
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block ml-1">
                      Professional Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@company.com"
                      className="w-full h-14 bg-white dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-none px-5 text-xs font-bold text-foreground outline-none focus:border-gold"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full h-14 rounded-none bg-gold text-black font-black text-xs uppercase tracking-[0.2em] hover:bg-black hover:text-gold transition-all shadow-md cursor-pointer"
                  >
                    Subscribe To Insights
                  </button>
                </form>
              )}
              <p className="text-[9px] text-muted-foreground text-center uppercase tracking-widest font-black">
                <ShieldCheck size={12} className="inline mr-1 text-gold" /> Strict privacy guaranteed.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
