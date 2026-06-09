import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, ChevronUp, Menu } from "lucide-react";
import eventsLogo from "../../assets/events-logo.jpeg";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
] as const;

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function scrollToBottom() {
  window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
}

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-background border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 min-w-0">
          <span className="relative inline-flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 rounded-full overflow-hidden ring-1 ring-gold/40 shadow-[0_0_24px_oklch(0.82_0.13_85/0.35)]">
            <img src={eventsLogo} alt="Royal Touch Events" className="h-full w-full object-cover" />
          </span>
          <span className="font-display text-lg sm:text-xl md:text-2xl leading-tight truncate">
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

        <div className="hidden md:flex items-center gap-2 lg:gap-3 shrink-0">
          <Link
            to="/sign-in"
            className="inline-flex items-center rounded-full border border-gold/40 text-gold px-4 py-2 text-sm font-medium hover:bg-gold/10 transition"
          >
            Sign In
          </Link>
          <Link
            to="/booking"
            className="inline-flex items-center rounded-full glass glass-gold px-4 lg:px-5 py-2 text-sm font-medium text-gold hover:bg-gold/10 transition"
          >
            Book an Event
          </Link>
        </div>

        {/* Hamburger → left slide-out drawer (off-canvas menu) */}
        <button
          className="md:hidden shrink-0 inline-flex items-center justify-center h-10 w-10 rounded-lg text-foreground hover:bg-white/5 transition"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="glass-strong border-white/10 w-[min(85vw,320px)] p-0 gap-0 flex flex-col h-full"
        >
          <SheetHeader className="px-6 py-5 border-b border-white/10 text-left">
            <div className="flex items-center gap-3 pr-8">
              <span className="inline-flex h-10 w-10 shrink-0 rounded-full overflow-hidden ring-1 ring-gold/40">
                <img src={eventsLogo} alt="" className="h-full w-full object-cover" />
              </span>
              <SheetTitle className="font-display text-lg leading-tight">
                Royal <span className="text-gradient-gold">Touch</span> Events
              </SheetTitle>
            </div>
          </SheetHeader>

          <nav className="flex flex-col px-4 py-4 gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: n.to === "/" }}
                activeProps={{ className: "bg-gold/10 text-gold border-gold/30" }}
                inactiveProps={{ className: "text-foreground/90 hover:bg-white/5 hover:text-foreground" }}
                className="rounded-xl px-4 py-3 text-base font-medium border border-transparent transition"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="px-4 py-3 border-t border-white/10">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 px-1">Scroll page</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={scrollToTop}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-2.5 text-sm text-foreground/90 hover:bg-white/5 transition"
              >
                <ChevronUp size={16} />
                Top
              </button>
              <button
                type="button"
                onClick={scrollToBottom}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-2.5 text-sm text-foreground/90 hover:bg-white/5 transition"
              >
                <ChevronDown size={16} />
                Bottom
              </button>
            </div>
          </div>

          <div className="mt-auto px-4 pb-6 pt-2 border-t border-white/10 space-y-2">
            <Link
              to="/sign-in"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center rounded-xl border border-gold/40 text-gold px-5 py-3 text-sm font-medium hover:bg-gold/10 transition"
            >
              Sign In
            </Link>
            <Link
              to="/booking"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center rounded-full bg-gold text-background px-5 py-3 text-sm font-semibold hover:opacity-90 transition"
            >
              Book an Event
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
