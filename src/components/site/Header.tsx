import { Link, useLocation } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Menu, Star, Sun, Moon, ChevronDown, ChevronRight, ArrowRight, LayoutDashboard, Crown, Sparkles } from "lucide-react";
import eventsLogo from "../../assets/events-logo.jpeg";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { FavoritesModal } from "./FavoritesModal";
import { useAuth } from "@/contexts/AuthContext";

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

  const { theme, toggleTheme } = useTheme();
  const { favorites } = useFavorites();
  const { session, user, profile, role } = useAuth();
  const location = useLocation();

  const pathname = location?.pathname || "";

  const isAuthenticated = Boolean(session || user || profile);
  const targetPortalRoute = role === "admin" ? "/admin" : role === "staff" ? "/staff" : "/dashboard";

  // Check if current active path is inside Explore
  const isExploreActive = exploreNav.some(
    (item) => pathname === item.to || pathname.startsWith(`${item.to}/`)
  );

  // Check if current active path is inside Booking & Events
  const isBookingEventsActive = bookingEventsNav.some(
    (item) => pathname === item.to || pathname.startsWith(`${item.to}/`)
  );

  // Language Changer State
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("ENG");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: "ENG", name: "English", flag: "🇬🇧" },
    { code: "SWA", name: "Kiswahili", flag: "🇰🇪" },
    { code: "FRA", name: "Français", flag: "🇫🇷" },
    { code: "CHN", name: "中文", flag: "🇨🇳" },
  ];

  const handleSelectLanguage = (code: string, name: string) => {
    setCurrentLang(code);
    setLangOpen(false);
    setToastMsg(`✓ Language updated to ${name} (${code})`);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Click outside handlers
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exploreRef.current && !exploreRef.current.contains(event.target as Node)) {
        setExploreOpen(false);
      }
      if (bookingEventsRef.current && !bookingEventsRef.current.contains(event.target as Node)) {
        setBookingEventsOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className={cn(
        "fixed inset-x-0 top-0 z-50 border-b h-20 bg-black border-white/10 text-white shadow-2xl transition-all duration-300"
      )}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-full flex items-center justify-between gap-4">
          {/* Left: Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="h-10 w-10 rounded-full overflow-hidden border border-gold/20 shadow-lg shadow-gold/10 bg-black">
              <img src="/new logo.png" alt="TOQUE REAL EVENTS LIMITED" className="h-full w-full object-cover" />
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

            {/* LANGUAGE CHANGER BUTTON NEXT TO FAVORITES */}
            <div
              className="relative py-2"
              ref={langRef}
              onMouseEnter={() => setLangOpen(true)}
              onMouseLeave={() => setLangOpen(false)}
            >
              <button
                type="button"
                onClick={() => setLangOpen((prev) => !prev)}
                className="flex items-center gap-1.5 p-1.5 rounded border border-gold/30 bg-black/40 hover:border-gold transition-all cursor-pointer group"
                title="Select Language"
              >
                <img src="/language.jpeg" alt="Language" className="h-5 w-5 rounded-full object-cover border border-gold/40 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-mono font-bold text-gold uppercase">{currentLang}</span>
                <ChevronDown size={10} className={cn("text-gold transition-transform duration-200", langOpen && "rotate-180")} />
              </button>

              {langOpen && (
                <div className="absolute top-full right-0 mt-1 w-44 bg-[#0b0e14] border border-gold/40 shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-1 z-50 animate-in fade-in duration-200 space-y-0.5 font-sans">
                  <div className="px-3 py-1.5 border-b border-white/10 text-[8px] font-black uppercase tracking-widest text-gold font-mono">
                    Select Language
                  </div>
                  {languages.map((lang) => (
                    <button
                      type="button"
                      key={lang.code}
                      onClick={() => handleSelectLanguage(lang.code, lang.name)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 text-xs font-bold transition-all cursor-pointer hover:bg-gold/10 hover:text-gold text-left",
                        currentLang === lang.code ? "text-gold bg-gold/10 font-black" : "text-gray-300"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                      <span className="text-[9px] font-mono opacity-80">({lang.code})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* DYNAMIC PORTAL / GET STARTED BUTTON */}
            {isAuthenticated ? (
              <Link
                to={targetPortalRoute}
                className="group flex items-center gap-2 h-10 px-5 rounded-none bg-[#f4cf69] text-black font-black text-[10px] uppercase tracking-widest hover:bg-[#d5a637] transition-all duration-300 shadow-md shadow-[#f4cf69]/20 cursor-pointer"
                title="Return to your Portal Dashboard"
              >
                {role === "admin" ? <Crown size={14} className="text-black" /> : <LayoutDashboard size={14} className="text-black" />}
                <span>My Portal</span>
                <ArrowRight size={13} className="text-black group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            ) : (
              <Link
                to="/sign-in"
                className="group flex items-center gap-2 h-10 px-5 rounded-none bg-emerald-500 text-black font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all duration-300 shadow-md shadow-emerald-500/20 cursor-pointer"
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
                inactiveProps={{ className: "text-gray-400 hover:text-white" }}
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

                {isAuthenticated ? (
                  <Link
                    to={targetPortalRoute}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between px-4 py-3.5 rounded-none bg-[#f4cf69] text-black text-xs font-black uppercase tracking-widest shadow-lg"
                  >
                    <span>My Portal</span>
                    <ArrowRight size={14} />
                  </Link>
                ) : (
                  <Link
                    to="/sign-in"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between px-4 py-3.5 rounded-none bg-emerald-500 text-black text-xs font-black uppercase tracking-widest shadow-lg"
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

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[99999] px-5 py-3 bg-[#142231] border border-[#f4cf69]/50 text-white text-xs font-mono font-bold shadow-2xl rounded-lg animate-in slide-in-from-bottom-4 duration-300">
          {toastMsg}
        </div>
      )}
    </>
  );
}
