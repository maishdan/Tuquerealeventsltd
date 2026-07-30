import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, Star, User, Sun, LayoutDashboard } from "lucide-react";
import eventsLogo from "../../assets/events-logo.jpeg";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/events", label: "Events" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/services", label: "Services" },
  { to: "/booking", label: "Booking" },
  { to: "/blog", label: "Insights" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const [open, setOpen] = useState(false);
  const auth = useAuth();

  const user = auth?.user;
  const role = auth?.profile?.role;
  const portalTo = role === "admin" ? "/admin" : "/dashboard";

  return (
    <header className={cn(
      "fixed inset-x-0 top-0 z-50 border-b h-20 bg-black border-white/10 text-white shadow-2xl transition-all duration-300"
    )}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-full flex items-center justify-between gap-4">
        {/* Left: Logo & Brand */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="h-10 w-10 rounded-full overflow-hidden border border-gold/20 shadow-lg shadow-gold/10">
            <img src={eventsLogo} alt="Royal Touch Events" className="h-full w-full object-cover" />
          </div>
          <span className={cn(
            "font-display text-xl uppercase tracking-tighter font-black hidden lg:block text-white"
          )}>
            Royal <span className="text-gold">Touch</span> Events
          </span>
        </Link>

        {/* Center: Navigation */}
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

        {/* Right: Status & Auth */}
        <div className="flex items-center gap-4 shrink-0">
          <button className="transition-colors hidden sm:block text-gray-400 hover:text-gold">
            <Star size={18} />
          </button>

          {user ? (
            <Link
              to={portalTo}
              className="flex items-center gap-2 h-10 px-5 rounded-full border border-gold/50 bg-gold/10 text-gold hover:bg-gold hover:text-black transition-all"
            >
              <LayoutDashboard size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Portal</span>
            </Link>
          ) : (
            <Link
              to="/sign-in"
              className="flex items-center gap-3 transition-all text-white hover:text-gold"
            >
              <User size={18} className="text-gold" />
              <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Sign In</span>
            </Link>
          )}

          <button className="transition-colors text-gray-400 hover:text-white">
            <Sun size={18} />
          </button>

          <button
            className="xl:hidden h-10 w-10 rounded-lg flex items-center justify-center bg-white/5 text-white transition-all"
            onClick={() => setOpen(true)}
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="bg-black border-white/10 w-[min(85vw,320px)] p-0 gap-0 flex flex-col h-full"
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

            <div className="mt-4 pt-4 border-t border-white/10">
              {user ? (
                <Link
                  to={portalTo}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gold/10 text-gold text-sm font-black uppercase tracking-widest"
                >
                  <LayoutDashboard size={18} /> Portal
                </Link>
              ) : (
                <Link
                  to="/sign-in"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 text-white text-sm font-black uppercase tracking-widest"
                >
                  <User size={18} className="text-gold" /> Sign In
                </Link>
              )}
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
