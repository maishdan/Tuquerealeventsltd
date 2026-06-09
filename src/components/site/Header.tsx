import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import eventsLogo from "../../assets/events-logo.jpeg";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 glass border-b border-white/10">
      <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <span className="relative inline-flex h-12 w-12 rounded-full overflow-hidden ring-1 ring-gold/40 shadow-[0_0_24px_oklch(0.82_0.13_85/0.35)]">
            <img src={eventsLogo} alt="Royal Touch Events" className="h-full w-full object-cover" />
          </span>
          <span className="font-display text-xl md:text-2xl leading-tight">
            Royal <span className="text-gradient-gold">Touch</span> Events
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              activeProps={{ className: "text-gold" }}
              inactiveProps={{ className: "text-muted-foreground hover:text-foreground transition" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/booking" className="inline-flex items-center rounded-full glass glass-gold px-5 py-2 text-sm font-medium text-gold hover:bg-gold/10 transition">
            Book an Event
          </Link>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen((s) => !s)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 glass-strong">
          <div className="px-6 py-4 flex flex-col gap-3">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-1 text-base text-foreground/90">
                {n.label}
              </Link>
            ))}
            <Link to="/booking" onClick={() => setOpen(false)} className="mt-2 inline-flex items-center justify-center rounded-full bg-gold text-background px-5 py-2 text-sm font-medium">
              Book an Event
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
