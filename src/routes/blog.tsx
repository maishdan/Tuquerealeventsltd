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
  ShieldCheck
} from "lucide-react";
import { createPageSeo } from "../lib/seo";

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
  title: "The Future of Hybrid Corporate Summits in 2026",
  excerpt: "Exploring the strategic intersection of physical presence and digital reach in the modern executive landscape.",
  category: "Strategy",
  date: "Oct 24, 2025",
  readTime: "8 min read",
  image: "https://images.unsplash.com/photo-1540575861501-7ad05823c9f5?q=80&w=2070&auto=format&fit=crop"
};

const posts = [
  {
    title: "Cinematic Lighting: More Than Just Visibility",
    excerpt: "How intelligent lighting design transforms standard venues into emotionally resonant environments.",
    category: "Production",
    date: "Oct 18, 2025",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Sustainability in Luxury: The New Gold Standard",
    excerpt: "Redefining high-end events with zero-waste protocols and ethical sourcing without compromising on grandeur.",
    category: "Trends",
    date: "Oct 12, 2025",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop"
  },
  {
    title: "The Architecture of a 5,000 Guest Launch",
    excerpt: "A technical deep-dive into the logistics and coordination required for stadium-scale brand reveals.",
    category: "Logistics",
    date: "Sep 28, 2025",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1475721027187-4024733923f9?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Curating Entertainment for Global Audiences",
    excerpt: "Balancing local cultural nuances with international standards in artist selection and stage hospitality.",
    category: "Entertainment",
    date: "Sep 15, 2025",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Crisis Management: Production Protocols",
    excerpt: "Why our 100% technical uptime record is built on redundant systems and aerospace-grade checklists.",
    category: "Operations",
    date: "Sep 02, 2025",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1454165833767-027eeef1596e?q=80&w=2070&auto=format&fit=crop"
  }
];

function Blog() {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % heroImages.length);
    }, 60000); // Switch every 1 minute
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#0b0e14] text-white font-sans min-h-screen min-w-0">
      {/* 1. HERO SECTION (MATCHES HOME PAGE) */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-start overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          {heroImages.map((src, idx) => (
            <img
              key={src}
              src={src}
              alt={`Royal Insights Hero ${idx}`}
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
                  <TrendingUp size={12} /> Strategic Market Intelligence
                </div>
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-[100px] font-black tracking-tighter text-white uppercase leading-[0.85]">
                Executive <br />
                <span className="text-gold">Insights.</span>
              </h1>
              <p className="max-w-2xl mx-auto text-base md:text-xl text-gray-200 font-medium leading-relaxed">
                Professional perspectives on the intersection of strategic design, high-stakes logistics, and world-class event production.
              </p>
            </div>
            <div className="flex justify-center pt-4">
               <div className="h-1 w-24 bg-gold rounded-full shadow-[0_0_20px_rgba(212,175,55,0.5)]" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED ARTICLE (MARKETING TECH) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 -mt-24 relative z-20 pb-24">
        <div className="group relative rounded-[48px] overflow-hidden border border-white/10 bg-[#121212]/90 backdrop-blur-2xl flex flex-col lg:flex-row items-stretch hover:border-gold/30 transition-all duration-700 shadow-2xl">
          <div className="lg:w-1/2 relative h-80 lg:h-auto overflow-hidden">
            <img src={featuredPost.image} alt={featuredPost.title} className="h-full w-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b0e14]/60 to-transparent lg:hidden" />
          </div>
          <div className="lg:w-1/2 p-10 lg:p-16 space-y-8 flex flex-col justify-center">
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 rounded-full bg-gold/10 text-gold text-[10px] font-black uppercase tracking-widest border border-gold/20">Featured Insight</span>
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{featuredPost.category}</span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl text-white group-hover:text-gold transition-colors duration-500 font-black leading-tight uppercase">{featuredPost.title}</h2>
            <p className="text-gray-400 text-lg leading-relaxed font-medium">{featuredPost.excerpt}</p>
            <div className="flex items-center gap-6 text-xs text-gray-500 font-bold uppercase tracking-widest">
               <div className="flex items-center gap-2"><Calendar size={14} className="text-gold" /> {featuredPost.date}</div>
               <div className="flex items-center gap-2"><Clock size={14} className="text-gold" /> {featuredPost.readTime}</div>
            </div>
            <button className="inline-flex items-center gap-2 text-white font-black text-xs uppercase tracking-[0.2em] pt-4 group/btn">
              Read Strategic Analysis <ArrowUpRight size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform text-gold" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. INSIGHTS GRID (SMOOTH ARRANGEMENT) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-32">
        <div className="flex items-center gap-6 mb-16">
           <h2 className="font-display text-4xl sm:text-5xl text-white tracking-tight whitespace-nowrap uppercase font-black">Archive</h2>
           <div className="h-px w-full bg-white/10" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {posts.map((post, i) => (
            <article key={i} className="group flex flex-col space-y-8">
              <div className="relative aspect-[16/10] rounded-[32px] overflow-hidden border border-white/5 bg-white/5 shadow-2xl transition-all duration-500 group-hover:border-gold/30">
                <img src={post.image} alt={post.title} className="h-full w-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute top-6 left-6">
                  <span className="px-3 py-1 rounded-lg bg-[#0b0e14]/80 backdrop-blur-md text-gold text-[8px] font-black uppercase tracking-widest border border-white/10">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="space-y-4 px-2">
                <div className="flex items-center gap-4 text-[9px] text-gray-500 font-black uppercase tracking-[0.2em]">
                  <span className="flex items-center gap-1.5"><Calendar size={12} className="text-gold" /> {post.date}</span>
                  <span className="h-1 w-1 rounded-full bg-white/20" />
                  <span className="flex items-center gap-1.5"><Clock size={12} className="text-gold" /> {post.readTime}</span>
                </div>
                <h3 className="font-display text-3xl text-white group-hover:text-gold transition-colors leading-tight uppercase font-black">
                  {post.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed font-medium line-clamp-2">
                  {post.excerpt}
                </p>
                <Link to="/blog" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white pt-2 transition-colors">
                  View Article <ArrowRight size={14} className="text-gold" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 4. NEWSLETTER / MARKET TECH CTA (MATCHES HOME PAGE) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-32">
        <div className="relative rounded-[40px] md:rounded-[60px] overflow-hidden bg-white/5 border border-white/10 p-12 md:p-24 flex flex-col lg:flex-row items-center gap-12 text-left">
          <div className="absolute inset-0 bg-radial-indigo opacity-30" />

          <div className="relative z-10 lg:w-3/5 space-y-8">
            <div className="h-16 w-16 rounded-2xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
               <TrendingUp size={32} />
            </div>
            <h2 className="font-display text-5xl md:text-8xl text-white leading-none uppercase font-black tracking-tighter">Join the <br /><span className="text-gold">Circle.</span></h2>
            <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed max-w-xl">
              Stay ahead of the curve with our monthly executive digest. No fluff, just strategic event insights delivered to your inbox.
            </p>
          </div>

          <div className="relative z-10 lg:w-2/5 w-full bg-[#121212]/80 backdrop-blur-xl p-8 rounded-[40px] border border-white/5">
            <form className="space-y-6">
               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">Professional Email</label>
                  <div className="relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type="email"
                      placeholder="you@firm.com"
                      className="w-full h-16 bg-[#1a1a1a] border border-white/10 rounded-2xl pl-16 pr-6 text-sm text-white focus:border-gold outline-none transition-all"
                    />
                  </div>
               </div>
               <button className="w-full h-16 rounded-full bg-gold text-[#0b0e14] font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                 Subscribe to Insights
               </button>
            </form>
            <p className="text-[9px] text-gray-500 text-center mt-6 uppercase tracking-widest font-black">
               <ShieldCheck size={10} className="inline mr-1 text-gold" /> Professional privacy guaranteed.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
