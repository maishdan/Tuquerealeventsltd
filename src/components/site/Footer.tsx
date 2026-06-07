import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border mt-24 bg-card/40">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-12 md:grid-cols-4">
        <div>
          <div className="font-display text-2xl">Lumiere <span className="text-gradient-gold">Events</span></div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            Crafting unforgettable moments — from intimate ceremonies to flagship corporate launches.
          </p>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-widest text-gold mb-4">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/services" className="hover:text-foreground">Services</Link></li>
            <li><Link to="/portfolio" className="hover:text-foreground">Portfolio</Link></li>
            <li><Link to="/blog" className="hover:text-foreground">Blog</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-widest text-gold mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone size={14} /> +254 701 460 110</li>
            <li className="flex items-center gap-2"><Mail size={14} /> hello@lumiereevents.co</li>
            <li className="flex items-center gap-2"><MapPin size={14} /> Nairobi, Kenya</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-widest text-gold mb-4">Follow</h4>
          <div className="flex gap-3">
            <a href="#" aria-label="Instagram" className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-border hover:border-gold hover:text-gold transition"><Instagram size={16} /></a>
            <a href="#" aria-label="Facebook" className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-border hover:border-gold hover:text-gold transition"><Facebook size={16} /></a>
            <a href="#" aria-label="Twitter" className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-border hover:border-gold hover:text-gold transition"><Twitter size={16} /></a>
          </div>
          <Link to="/booking" className="mt-6 inline-flex items-center rounded-full bg-gold text-background px-5 py-2 text-sm font-medium hover:opacity-90 transition">
            Get a Free Quote
          </Link>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-6 text-xs text-muted-foreground flex flex-col md:flex-row gap-2 justify-between">
          <p>© {new Date().getFullYear()} Lumiere Events. All rights reserved.</p>
          <p>Made with care in Nairobi.</p>
        </div>
      </div>
    </footer>
  );
}
