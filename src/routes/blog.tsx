import { createFileRoute, Link } from "@tanstack/react-router";
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
  ArrowUpRight
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
  return (
    <div className="bg-[#0b0e14] text-white font-sans min-h-screen">
      {/* 1. STRATEGIC HEADER */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[140px] -mr-80 -mt-80" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
          <div className="flex items-center gap-3 text-gold mb-6">
             <div className="h-[1px] w-12 bg-gold" />
             <p className="text-[10px] font-bold uppercase tracking-[0.4em]">Insight Hub</p>
          </div>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-[100px] leading-[0.85] tracking-tighter max-w-5xl">
            Executive <span className="text-gold">Insights</span>. <br />
            Industry Trends.
          </h1>
          <p className="mt-10 max-w-3xl text-lg md:text-xl text-gray-400 font-light leading-relaxed">
            Professional perspectives on the intersection of strategic design, high-stakes logistics, and world-class event production.
          </p>
        </div>
      </section>

      {/* 2. FEATURED ARTICLE (MARKETING TECH) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
        <div className="group relative rounded-[48px] overflow-hidden border border-white/10 bg-white/[0.02] flex flex-col lg:flex-row items-stretch hover:border-gold/30 transition-all duration-700">
          <div className="lg:w-1/2 relative h-80 lg:h-auto overflow-hidden">
            <img src={featuredPost.image} alt={featuredPost.title} className="h-full w-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b0e14]/60 to-transparent lg:hidden" />
          </div>
          <div className="lg:w-1/2 p-10 lg:p-16 space-y-8 flex flex-col justify-center">
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 rounded-full bg-gold/10 text-gold text-[10px] font-black uppercase tracking-widest border border-gold/20">Featured Insight</span>
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{featuredPost.category}</span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl text-white group-hover:text-gold transition-colors duration-500">{featuredPost.title}</h2>
            <p className="text-gray-400 text-lg leading-relaxed">{featuredPost.excerpt}</p>
            <div className="flex items-center gap-6 text-xs text-gray-500">
               <div className="flex items-center gap-2"><Calendar size={14} className="text-gold" /> {featuredPost.date}</div>
               <div className="flex items-center gap-2"><Clock size={14} className="text-gold" /> {featuredPost.readTime}</div>
            </div>
            <button className="inline-flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest pt-4 group/btn">
              Read Strategic Analysis <ArrowUpRight size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform text-gold" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. INSIGHTS GRID (SMOOTH ARRANGEMENT) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-32">
        <div className="flex items-center gap-6 mb-16">
           <h2 className="font-display text-4xl text-white tracking-tight whitespace-nowrap">Professional Archive</h2>
           <div className="h-px w-full bg-white/10" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <article key={i} className="group flex flex-col space-y-6">
              <div className="relative aspect-[16/10] rounded-3xl overflow-hidden border border-white/5 bg-white/[0.02]">
                <img src={post.image} alt={post.title} className="h-full w-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-lg bg-[#0b0e14]/80 backdrop-blur-md text-gold text-[8px] font-black uppercase tracking-widest border border-white/10">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="space-y-4 px-2">
                <div className="flex items-center gap-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><Calendar size={12} /> {post.date}</span>
                  <span className="h-1 w-1 rounded-full bg-white/20" />
                  <span className="flex items-center gap-1.5"><Clock size={12} /> {post.readTime}</span>
                </div>
                <h3 className="font-display text-2xl text-white group-hover:text-gold transition-colors leading-tight">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
                <Link to="/blog" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white pt-2 transition-colors">
                  View Article <ArrowRight size={14} className="text-gold" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 4. NEWSLETTER / MARKET TECH CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-32">
        <div className="relative rounded-[40px] overflow-hidden bg-white/[0.02] border border-white/10 p-12 md:p-20 flex flex-col lg:flex-row items-center gap-12 text-left">
          <div className="absolute inset-0 bg-radial-indigo opacity-30" />

          <div className="relative z-10 lg:w-3/5 space-y-6">
            <div className="h-12 w-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
               <TrendingUp size={24} />
            </div>
            <h2 className="font-display text-4xl md:text-6xl text-white">Join the <span className="text-gradient-gold">Inner</span> Circle.</h2>
            <p className="text-gray-400 text-lg font-light leading-relaxed">
              Stay ahead of the curve with our monthly executive digest. No fluff, just strategic event insights delivered to your inbox.
            </p>
          </div>

          <div className="relative z-10 lg:w-2/5 w-full">
            <form className="space-y-4">
               <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="email"
                    placeholder="Enter professional email"
                    className="w-full bg-[#0b0e14] border border-white/10 rounded-full py-4 pl-12 pr-6 text-sm focus:border-gold outline-none transition-all"
                  />
               </div>
               <button className="w-full h-14 rounded-full bg-gold text-[#0b0e14] font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.02] transition-transform">
                 Subscribe to Insights
               </button>
            </form>
            <p className="text-[10px] text-gray-500 text-center mt-4 uppercase tracking-widest font-bold">
               Professional privacy guaranteed.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
