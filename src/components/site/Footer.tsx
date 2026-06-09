import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import daniwestIcon from "../../assets/daniwest-icon.png";
import eventsLogo from "../../assets/events-logo.jpeg";

export function Footer() {
  return (
    <footer className="mt-24 glass border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 grid gap-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 rounded-full overflow-hidden ring-1 ring-gold/40">
              <img src={eventsLogo} alt="Royal Touch Events" className="h-full w-full object-cover" />
            </span>
            <div className="font-display text-xl">Royal <span className="text-gradient-gold">Touch</span> Events</div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs italic">
            We plan. You celebrate. We make it memorable.
          </p>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-widest text-gold mb-4">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/services" className="hover:text-foreground">Services</Link></li>
            <li><Link to="/portfolio" className="hover:text-foreground">Portfolio</Link></li>
            <li><Link to="/blog" className="hover:text-foreground">Blog</Link></li>
            <li><Link to="/booking" className="hover:text-foreground">Book an Event</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-widest text-gold mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone size={14} /> +254 795 365 334</li>
            <li className="flex items-center gap-2"><Mail size={14} /> eventsroyaltouch7@gmail.com</li>
            <li className="flex items-center gap-2"><MapPin size={14} /> Nairobi, Kenya</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-widest text-gold mb-4">Follow</h4>
          <div className="flex gap-3">
            <a href="#" aria-label="Instagram" className="h-9 w-9 inline-flex items-center justify-center rounded-full glass hover:border-gold hover:text-gold transition"><Instagram size={16} /></a>
            <a href="#" aria-label="Facebook" className="h-9 w-9 inline-flex items-center justify-center rounded-full glass hover:border-gold hover:text-gold transition"><Facebook size={16} /></a>
            <a href="#" aria-label="Twitter" className="h-9 w-9 inline-flex items-center justify-center rounded-full glass hover:border-gold hover:text-gold transition"><Twitter size={16} /></a>
          </div>
          <Link to="/booking" className="mt-6 inline-flex items-center rounded-full bg-gold text-background px-5 py-2 text-sm font-medium hover:opacity-90 transition">
            Get a Free Quote
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 text-xs text-muted-foreground flex flex-col md:flex-row gap-3 justify-between items-center text-center md:text-left">
          <p>© {new Date().getFullYear()} Royal Touch Events. All rights reserved.</p>
          <nav className="flex items-center gap-5">
            <Link to="/terms" className="hover:text-gold">Terms &amp; Conditions</Link>
            <Link to="/privacy" className="hover:text-gold">Privacy Policy</Link>
            <Link to="/copyright" className="hover:text-gold">Copyright</Link>
          </nav>
        </div>
        <div className="border-t border-white/10 bg-white/[0.03]">
          <p className="mx-auto max-w-7xl px-4 sm:px-6 py-4 text-xs sm:text-sm leading-relaxed text-muted-foreground flex flex-wrap items-center justify-center gap-2 text-center">
            <img
              src={daniwestIcon}
              alt="Daniwest Tech Ltd"
              className="h-5 w-5 sm:h-6 sm:w-6 shrink-0 object-contain"
            />
            <span>
              Engineered by{" "}
              <a
                href="https://daniwesttechnologies.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-gold hover:text-gold-soft underline underline-offset-2 transition-colors"
              >
                Daniwest Tech Ltd
              </a>{" "}
              © 2026. Securing the digital future, one innovation at a time.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
