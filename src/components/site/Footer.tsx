import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ShieldCheck, ArrowRight, Globe, Smartphone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0b0e14] border-t-2 border-gold/20 pt-24 font-sans relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Top: Brand & Newsletter Strategic Row */}
        <div className="grid lg:grid-cols-12 gap-12 pb-16 border-b border-white/5">
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full overflow-hidden border border-gold/30 shadow-xl shadow-gold/5 bg-black">
                <img src="/new logo.png" alt="TOQUE REAL EVENTS LIMITED Logo" className="h-full w-full object-cover" />
              </div>
              <span className="text-xl font-black uppercase tracking-tighter text-white">
                TOQUE REAL <span className="text-gold">EVENTS</span> LIMITED
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm font-medium">
              Architecting extraordinary moments for the world's most discerning brands and individuals. Nairobi's premier choice for executive event production.
            </p>
            <div className="flex items-center gap-2 text-[10px] text-emerald-500 font-black uppercase tracking-widest bg-emerald-500/5 px-4 py-2 rounded-full border border-emerald-500/20 w-fit">
              <ShieldCheck size={14} /> Certified Event Agency 2026
            </div>
          </div>

          <div className="lg:col-span-3 lg:col-start-6 space-y-6">
             <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Executive Briefing</h4>
             <p className="text-xs text-gray-500 leading-relaxed">Join 2,500+ leaders receiving our monthly production insights.</p>
             <div className="relative group">
                <input
                  type="email"
                  placeholder="Professional Email"
                  className="w-full bg-[#121212] border border-white/10 rounded-lg py-3 pl-4 pr-12 text-xs text-white focus:border-gold outline-none transition-all"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-md bg-gold text-[#0b0e14] flex items-center justify-center hover:bg-white transition-all">
                  <ArrowRight size={16} />
                </button>
             </div>
          </div>

          <div className="lg:col-span-3 lg:col-start-10 space-y-6">
             <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Global Reach</h4>
             <div className="flex items-center gap-3 text-gold">
                <Globe size={24} className="opacity-50" />
                <div>
                   <p className="text-xl font-black text-white leading-none">EAST AFRICA</p>
                   <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold mt-1">Operational Hub</p>
                </div>
             </div>
          </div>
        </div>

        {/* Middle: Navigation & Details modular grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 py-16">
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">The Firm</h4>
            <ul className="space-y-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Our Disciplines</Link></li>
              <li><Link to="/portfolio" className="hover:text-white transition-colors">Event Vault</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Insight Hub</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Solutions</h4>
            <ul className="space-y-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <li><Link to="/services" className="hover:text-white transition-colors">Corporate Strategy</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Luxury Production</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Technical AV</Link></li>
              <li><Link to="/booking" className="hover:text-white transition-colors">Custom Brief</Link></li>
            </ul>
          </div>

          <div className="space-y-6 lg:col-span-2">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Headquarters</h4>
            <ul className="space-y-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <li className="flex items-start gap-4">
                <MapPin size={18} className="text-gold shrink-0 mt-0.5" />
                <span className="leading-relaxed">TOQUE REAL EXECUTIVE TOWER,<br />Kilimani, Nairobi, Kenya</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone size={16} className="text-gold shrink-0" />
                <span>+254 795 365 334</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail size={16} className="text-gold shrink-0" />
                <span className="lowercase">realtoque0@gmail.com</span>
              </li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Connect</h4>
            <div className="flex flex-wrap gap-4">
              {[
                { icon: Instagram, label: "Instagram" },
                { icon: Facebook, label: "Facebook" },
                { icon: Twitter, label: "Twitter" }
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-white/10 text-gray-400 hover:border-gold hover:text-gold hover:bg-gold/5 transition-all duration-300"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
            <Link
              to="/booking"
              className="w-full h-12 inline-flex items-center justify-center rounded-lg bg-gold text-[#0b0e14] text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-gold/10"
            >
              Request Quote
            </Link>
          </div>
        </div>

        {/* MOBILE APPS COMING SOON TILE */}
        <div className="my-8 p-6 bg-gradient-to-r from-[#121824] via-[#0d131f] to-[#121824] border border-gold/30 rounded-none shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/30 text-gold text-[9px] font-black uppercase tracking-widest rounded-none">
              <Smartphone size={13} /> Official Mobile App Status
            </div>
            <h4 className="text-lg font-black uppercase tracking-tight text-white font-serif">
              TOQUE REAL Mobile Apps Coming Soon
            </h4>
            <p className="text-xs text-gray-400 font-medium">
              Manage event bookings, scan gate QR passes, and access 24/7 concierge chat on iOS & Android.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            {/* Google Play Store Badge */}
            <div className="h-12 px-4 bg-black/80 border border-white/15 rounded-none flex items-center gap-3 text-left hover:border-gold transition-colors group cursor-default shadow-md">
              <img src="/playstore.jfif" alt="Google Play Store" className="h-6 w-6 object-contain rounded-sm shrink-0 group-hover:scale-110 transition-transform" />
              <div>
                <span className="block text-[8px] uppercase tracking-widest text-gray-400 font-bold">GET IT ON</span>
                <span className="block text-xs font-black text-white uppercase tracking-wider font-mono">Google Play <small className="text-[#f4cf69] text-[9px] font-mono font-bold">(Soon)</small></span>
              </div>
            </div>

            {/* Apple App Store Badge */}
            <div className="h-12 px-4 bg-black/80 border border-white/15 rounded-none flex items-center gap-3 text-left hover:border-gold transition-colors group cursor-default shadow-md">
              <img src="/apple.png" alt="Apple App Store" className="h-6 w-6 object-contain rounded-sm shrink-0 group-hover:scale-110 transition-transform" />
              <div>
                <span className="block text-[8px] uppercase tracking-widest text-gray-400 font-bold">Download on the</span>
                <span className="block text-xs font-black text-white uppercase tracking-wider font-mono">App Store <small className="text-[#f4cf69] text-[9px] font-mono font-bold">(Soon)</small></span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Legal & Credits (Formal Layout) */}
        <div className="border-t border-white/5 py-12 flex flex-col md:grid md:grid-cols-12 gap-8 items-center md:items-start text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
           <div className="md:col-span-4 text-center md:text-left">
             © {new Date().getFullYear()} TOQUE REAL EVENTS LIMITED. All Rights Reserved.
           </div>

           <nav className="md:col-span-4 flex flex-wrap justify-center gap-6 sm:gap-10">
             <Link to="/terms" className="hover:text-gold transition-colors">Terms</Link>
             <Link to="/privacy" className="hover:text-gold transition-colors">Privacy</Link>
             <Link to="/contact" className="hover:text-gold transition-colors">Help & Support</Link>
           </nav>

           <div className="md:col-span-4 flex justify-center md:justify-end items-center">
              <a
                href="https://myworldafric.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline italic text-gold font-serif normal-case text-xs font-medium"
              >
                Powered by My World Africa
              </a>
           </div>
        </div>
      </div>
    </footer>
  );
}
