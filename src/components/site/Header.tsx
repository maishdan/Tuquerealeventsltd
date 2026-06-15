import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, Star, User, Sun } from "lucide-react";
import eventsLogo from "../../assets/events-logo.jpeg";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const nav = [
  { to: "/", label: "Home" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/services", label: "Services" },
  { to: "/booking", label: "Booking" },
  { to: "/blog", label: "Insights" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[#0b0e14]/90 backdrop-blur-xl border-b border-white/5 h-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-full flex items-center justify-between gap-4">
        {/* Left: Logo & Brand */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="h-10 w-10 rounded-full overflow-hidden border border-gold/20 shadow-lg shadow-gold/10">
            <img src={eventsLogo} alt="Royal Touch Events" className="h-full w-full object-cover" />
          </div>
          <span className="font-display text-xl uppercase tracking-tighter text-white font-black hidden lg:block">
            Royal <span className="text-gold">Touch</span> Events
          </span>
        </Link>

        {/* Center: Navigation (Visible on Tablet & Desktop) */}
        <nav className="hidden md:flex items-center gap-1 xl:gap-2">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              activeProps={{ className: "text-gold bg-white/5" }}
              inactiveProps={{ className: "text-gray-400 hover:text-white" }}
              className="px-3 xl:px-4 py-2 rounded-md text-[9px] xl:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Right: Status & Auth (Based on the Image structure) */}
        <div className="flex items-center gap-4 shrink-0">
          <button className="text-gray-400 hover:text-gold transition-colors hidden sm:block">
            <Star size={18} />
          </button>

          <Link
            to="/sign-in"
            className="flex items-center gap-3 text-white hover:text-gold transition-all"
          >
            <User size={18} className="text-gold" />
            <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Sign In</span>
          </Link>

          <button className="text-gray-400 hover:text-white transition-colors">
            <Sun size={18} />
          </button>

          <button
            className="xl:hidden h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center text-white"
            onClick={() => setOpen(true)}
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="bg-[#0b0e14] border-white/10 w-[min(85vw,320px)] p-0 gap-0 flex flex-col h-full"
        >
          <SheetHeader className="px-6 py-5 border-b border-white/10 text-left">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 rounded-full overflow-hidden ring-1 ring-gold/40">
                <img src={eventsLogo} alt="" className="h-full w-full object-cover" />
              </span>
              <SheetTitle className="font-display text-lg leading-tight text-white">
                Royal <span className="text-gold">Touch</span> Events
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
                activeProps={{ className: "bg-gold/10 text-gold" }}
                inactiveProps={{ className: "text-gray-400 hover:bg-white/5 hover:text-white" }}
                className="rounded-xl px-4 py-3 text-sm font-black uppercase tracking-widest transition"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
