import { Link, useLocation } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Menu, Star, User, Sun, Moon, LayoutDashboard, ChevronDown, ChevronRight, ArrowRight } from "lucide-react";
import eventsLogo from "../../assets/events-logo.jpeg";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { FavoritesModal } from "./FavoritesModal";

const exploreNav = [
  { to: "/about", label: "About" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/services", label: "Services" },
  { to: "/blog", label: "Insights" },
] as const;

const bookingEventsNav = [
  { to: "/events", label: "Events" },
  { to: "/booking", label: "Reserve & Book" },
] as const;

export function Header({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [favoritesModalOpen, setFavoritesModalOpen] = useState(false);

  // Hover & Click state for Explore Dropdown
  const [exploreOpen, setExploreOpen] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);

  // Hover & Click state for Bookings & Events Dropdown
  const [bookingEventsOpen, setBookingEventsOpen] = useState(false);
  const bookingEventsRef = useRef<HTMLDivElement>(null);

  const auth = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { favorites } = useFavorites();
  const location = useLocation();

  const user = auth?.user;
  const role = auth?.profile?.role;
  const portalTo = role === "admin" ? "/admin" : "/dashboard";

  const pathname = location?.pathname || "";

  // Check if current active path is inside Explore
  const isExploreActive = exploreNav.some(
    (item) => pathname === item.to || pathname.startsWith(`${item.to}/`)
  );

  // Check if current active path is inside Booking & Events
  const isBookingEventsActive = bookingEventsNav.some(
    (item) => pathname === item.to || pathname.startsWith(`${item.to}/`)
  );

  // Click outside handlers
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exploreRef.current && !exploreRef.current.contains(event.target as Node)) {
        setExploreOpen(false);
      }
      if (bookingEventsRef.current && !bookingEventsRef.current.contains(event.target as Node)) {
        setBookingEventsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Brand Name Change Moving Marquee Header */}
      <div className="fixed inset-x-0 top-0 z-[60] bg-[#f4cf69] text-black h-7 px-4 overflow-hidden flex items-center border-b border-[#d5a637] shadow-md">
        <div className="whitespace-nowrap inline-block animate-marquee text-[10px] sm:text-xs font-black uppercase tracking-widest">
          Official Notice: Company name changing from Royal Touch Events to TOQUE REAL EVENTS LIMITED &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp; Official Notice: Company name changing from Royal Touch Events to TOQUE REAL EVENTS LIMITED &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp; Official Notice: Company name changing from Royal Touch Events to TOQUE REAL EVENTS LIMITED
        </div>
      </div>

      <header className={cn(
        "fixed inset-x-0 top-7 z-50 border-b h-20 bg-black border-white/10 text-white shadow-2xl transition-all duration-300"
      )}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-full flex items-center justify-between gap-4">
          {/* Left: Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="h-10 w-10 rounded-full overflow-hidden border border-gold/20 shadow-lg shadow-gold/10">
              <img src={eventsLogo} alt="TOQUE REAL EVENTS LIMITED" className="h-full w-full object-cover" />
            </div>
            <span className={cn(
              "font-display text-lg uppercase tracking-tight font-black hidden lg:block text-white"
            )}>
              TOQUE REAL <span className="text-gold">EVENTS</span> LIMITED
            </span>
          </Link>

          {/* Center: Navigation */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-3">
            {/* Home */}
            <Link
              to="/"
              activeOptions={{ exact: true }}
              activeProps={{ className: "text-gold bg-white/5 border-b-2 border-gold" }}
              inactiveProps={{ className: "text-gray-400 hover:text-white" }}
              className="px-3 xl:px-4 py-2 rounded-none text-[9px] xl:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap"
            >
              Home
            </Link>

            {/* 1. EXPLORE DROPDOWN */}
            <div
              className="relative group py-2"
              ref={exploreRef}
              onMouseEnter={() => setExploreOpen(true)}
              onMouseLeave={() => setExploreOpen(false)}
            >
              <button
                onClick={() => setExploreOpen((prev) => !prev)}
                className={cn(
                  "px-3 xl:px-4 py-2 rounded-none text-[9px] xl:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer border-b-2 border-transparent",
                  isExploreActive
                    ? "text-gold bg-white/5 border-gold"
                    : "text-gray-400 hover:text-white"
                )}
              >
                <span>Explore</span>
                <ChevronDown
                  size={12}
                  className={cn(
                    "text-gold transition-transform duration-300 stroke-[2.5]",
                    exploreOpen && "rotate-180"
                  )}
                />
              </button>

              {exploreOpen && (
                <div className="absolute top-full left-0 mt-0.5 w-56 bg-[#0b0e14] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.9)] rounded-none py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-2 border-b border-white/5 text-[8px] font-black uppercase tracking-[0.3em] text-gold">
                    Directory
                  </div>
                  {exploreNav.map((item) => {
                    const isActive = pathname === item.to;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setExploreOpen(false)}
                        className={cn(
                          "group/item flex items-center justify-between px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-all border-b border-white/5 last:border-none rounded-none",
                          isActive
                            ? "text-gold bg-white/5 pl-7 border-l-2 border-l-gold"
                            : "text-gray-300 hover:text-gold hover:bg-white/5 hover:pl-7"
                        )}
                      >
                        <span>{item.label}</span>
                        <ChevronRight
                          size={12}
                          className={cn(
                            "transition-transform duration-300 stroke-[2]",
                            isActive ? "text-gold translate-x-1" : "text-gray-600 group-hover/item:text-gold group-hover/item:translate-x-1"
                          )}
                        />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. BOOKINGS & EVENTS DROPDOWN */}
            <div
              className="relative group py-2"
              ref={bookingEventsRef}
              onMouseEnter={() => setBookingEventsOpen(true)}
              onMouseLeave={() => setBookingEventsOpen(false)}
            >
              <button
                onClick={() => setBookingEventsOpen((prev) => !prev)}
                className={cn(
                  "px-3 xl:px-4 py-2 rounded-none text-[9px] xl:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer border-b-2 border-transparent",
                  isBookingEventsActive
                    ? "text-gold bg-white/5 border-gold"
                    : "text-gray-400 hover:text-white"
                )}
              >
                <span>Booking & Events</span>
                <ChevronDown
                  size={12}
                  className={cn(
                    "text-gold transition-transform duration-300 stroke-[2.5]",
                    bookingEventsOpen && "rotate-180"
                  )}
                />
              </button>

              {bookingEventsOpen && (
                <div className="absolute top-full left-0 mt-0.5 w-52 bg-[#0b0e14] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.9)] rounded-none py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-2 border-b border-white/5 text-[8px] font-black uppercase tracking-[0.3em] text-gold">
                    Ticketing & Briefs
                  </div>
                  {bookingEventsNav.map((item) => {
                    const isActive = pathname === item.to;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setBookingEventsOpen(false)}
                        className={cn(
                          "group/item flex items-center justify-between px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-all border-b border-white/5 last:border-none rounded-none",
                          isActive
                            ? "text-gold bg-white/5 pl-7 border-l-2 border-l-gold"
                            : "text-gray-300 hover:text-gold hover:bg-white/5 hover:pl-7"
                        )}
                      >
                        <span>{item.label}</span>
                        <ChevronRight
                          size={12}
                          className={cn(
                            "transition-transform duration-300 stroke-[2]",
                            isActive ? "text-gold translate-x-1" : "text-gray-600 group-hover/item:text-gold group-hover/item:translate-x-1"
                          )}
                        />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* CONTACT LINK */}
            <Link
              to="/contact"
              activeProps={{ className: "text-gold bg-white/5 border-b-2 border-gold" }}
              inactiveProps={{ className: "text-gray-400 hover:text-white" }}
              className="px-3 xl:px-4 py-2 rounded-none text-[9px] xl:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap"
            >
              Contact
            </Link>
          </nav>

          {/* Right: Status, Favorites & Theme & Auth */}
          <div className="flex items-center gap-4 shrink-0">
            {/* FAVORITES STAR BUTTON WITH BADGE */}
            <button
              onClick={() => setFavoritesModalOpen(true)}
              className="relative p-2 rounded-none text-gray-400 hover:text-gold transition-colors"
              title="View Favorites"
            >
              <Star size={18} className={cn(favorites.length > 0 && "text-gold fill-gold")} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gold text-black font-black text-[9px] flex items-center justify-center shadow-md">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* GET STARTED / PORTAL BUTTON */}
            {user ? (
              <Link
                to={portalTo}
                className="flex items-center gap-2 h-10 px-5 rounded-none border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all duration-300 shadow-md shadow-emerald-500/10 font-black"
              >
                <LayoutDashboard size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Portal</span>
              </Link>
            ) : (
              <Link
                to="/sign-in"
                className="group flex items-center gap-2 h-10 px-5 rounded-none bg-emerald-500 text-black font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all duration-300 shadow-md shadow-emerald-500/20"
              >
                <span>Get Started</span>
                <ArrowRight size={13} className="text-black group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            )}

            {/* DARK / LIGHT MODE TOGGLE (SUN / MOON) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-none text-gray-400 hover:text-gold transition-colors"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "light" ? (
                <Sun size={18} className="text-amber-400" />
              ) : (
                <Moon size={18} className="text-gold" />
              )}
            </button>

            <button
              className="md:hidden h-10 w-10 rounded-none border border-white/10 flex items-center justify-center bg-white/5 text-white transition-all"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent
            side="left"
            className="bg-black border-white/10 w-[min(85vw,320px)] p-0 gap-0 flex flex-col h-full rounded-none"
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

            <nav className="flex flex-col px-4 py-4 gap-1 overflow-y-auto">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                activeOptions={{ exact: true }}
                activeProps={{ className: "bg-gold/10 text-gold" }}
                inactiveProps={{ className: "text-gray-400 hover:bg-white/5 hover:text-white" }}
                className="rounded-none px-4 py-3 text-xs font-black uppercase tracking-widest transition"
              >
                Home
              </Link>

              <div className="pt-2 pb-1 px-4 text-[9px] font-black uppercase tracking-[0.3em] text-gold border-t border-white/10 mt-2">
                Directory
              </div>

              {exploreNav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  activeProps={{ className: "bg-gold/10 text-gold pl-6" }}
                  inactiveProps={{ className: "text-gray-300 hover:bg-white/5 hover:text-white" }}
                  className="rounded-none px-4 py-2.5 text-xs font-black uppercase tracking-widest transition flex items-center justify-between"
                >
                  <span>{item.label}</span>
                  <ChevronRight size={12} className="text-gold opacity-60" />
                </Link>
              ))}

              <div className="pt-2 pb-1 px-4 text-[9px] font-black uppercase tracking-[0.3em] text-gold border-t border-white/10 mt-2">
                Ticketing & Briefs
              </div>

              {bookingEventsNav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  activeProps={{ className: "bg-gold/10 text-gold pl-6" }}
                  inactiveProps={{ className: "text-gray-300 hover:bg-white/5 hover:text-white" }}
                  className="rounded-none px-4 py-2.5 text-xs font-black uppercase tracking-widest transition flex items-center justify-between"
                >
                  <span>{item.label}</span>
                  <ChevronRight size={12} className="text-gold opacity-60" />
                </Link>
              ))}

              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                activeProps={{ className: "bg-gold/10 text-gold" }}
                inactiveProps={{ className: "text-gray-400 hover:bg-white/5 hover:text-white" }}
                className="rounded-none px-4 py-3 text-xs font-black uppercase tracking-widest transition border-t border-white/10 mt-2"
              >
                Contact
              </Link>

              <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setFavoritesModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-none bg-white/5 text-gold text-xs font-black uppercase tracking-widest border border-gold/20"
                >
                  <span className="flex items-center gap-2">
                    <Star size={16} className="fill-gold" /> Favorites ({favorites.length})
                  </span>
                  <ChevronRight size={14} />
                </button>

                {user ? (
                  <Link
                    to={portalTo}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-none bg-gold/10 text-gold text-xs font-black uppercase tracking-widest"
                  >
                    <LayoutDashboard size={18} /> Portal
                  </Link>
                ) : (
                  <Link
                    to="/sign-in"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between px-4 py-3.5 rounded-none bg-gold text-black text-xs font-black uppercase tracking-widest shadow-lg"
                  >
                    <span>Get Started</span>
                    <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </header>

      {/* FAVORITES MODAL */}
      <FavoritesModal isOpen={favoritesModalOpen} onClose={() => setFavoritesModalOpen(false)} />
    </>
  );
}
