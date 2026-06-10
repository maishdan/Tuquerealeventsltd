import { Link, Outlet, useNavigate, useRouter, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { useState, type ReactNode } from "react";
import { BackToDashboard } from "./BackToDashboard";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  Bell,
  Home,
  LogOut,
  Search,
  Sun,
  Moon,
  FileText,
  Plus,
  MessageSquare,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import eventsLogo from "../../assets/events-logo.jpeg";
import type { DashboardNavItem } from "@/lib/dashboard-nav";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type DashboardLayoutProps = {
  title: string;
  subtitle: string;
  nav: DashboardNavItem[];
  role: "admin" | "customer";
  children?: ReactNode;
};

const SIDEBAR_EXPANDED = "w-64";
const SIDEBAR_COLLAPSED = "w-[4.5rem]";

export function DashboardLayout({ title, subtitle, nav, role, children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const isMobile = useIsMobile();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const router = useRouter();
  const { signOut, profile } = useAuth();
  const isDashboardRoot = pathname === "/admin" || pathname === "/dashboard";

  function handleReload() {
    router.invalidate();
  }

  async function handleSignOut() {
    setMobileOpen(false);
    await signOut();
    navigate({ to: "/sign-in" });
  }

  function toggleMenu() {
    if (isMobile) {
      setMobileOpen(true);
    } else {
      setCollapsed((c) => !c);
    }
  }

  const content = children ?? <Outlet />;
  const userLabel = profile?.full_name || profile?.email || "User";
  const roleLabel = role === "admin" ? "Administrator" : "Client";

  const sidebarProps = {
    collapsed,
    subtitle,
    nav,
    role,
    pathname,
    onNavigate: () => setMobileOpen(false),
    onSignOut: handleSignOut,
    userLabel,
    roleLabel,
    isDark,
    onToggleCollapse: collapsed ? () => setCollapsed(false) : () => setCollapsed(true),
    showCollapseToggle: !isMobile,
  };

  return (
    <div
      className={cn(
        "min-h-screen flex transition-colors duration-300 font-sans",
        isDark ? "bg-[#0b0e14] text-white" : "bg-slate-50 text-slate-900",
      )}
    >
      {/* Desktop collapsible sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col fixed inset-y-0 left-0 z-50 border-r transition-all duration-300 ease-in-out",
          isDark ? "bg-[#0b0e14] border-white/5" : "bg-white border-slate-200 shadow-xl",
          collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED,
        )}
      >
        <DashboardSidebar {...sidebarProps} />
      </aside>

      {/* Mobile slide-out menu */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className={cn(
            "w-[min(85vw,300px)] p-0 gap-0 flex flex-col border-r",
            isDark ? "bg-[#0b0e14] border-white/10" : "bg-white border-slate-200",
          )}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>{title} menu</SheetTitle>
          </SheetHeader>
          <DashboardSidebar {...sidebarProps} collapsed={false} showCollapseToggle={false} />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300",
          collapsed ? "lg:pl-[4.5rem]" : "lg:pl-64",
        )}
      >
        <header
          className={cn(
            "sticky top-0 z-40 border-b px-4 sm:px-6 h-16 flex items-center justify-between gap-4",
            isDark ? "bg-[#0b0e14] border-white/5" : "bg-white border-slate-200 shadow-sm",
          )}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              type="button"
              className={cn(
                "p-2 rounded-lg transition",
                isDark ? "hover:bg-white/10 text-white" : "hover:bg-slate-100 text-slate-700",
              )}
              onClick={toggleMenu}
              aria-label={isMobile ? "Open menu" : collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <div className="h-8 w-8 rounded-full overflow-hidden ring-1 ring-gold/30 shrink-0">
                <img src={eventsLogo} alt="Royal Touch Events" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 hidden sm:block">
                <h1 className="font-semibold text-sm sm:text-base truncate">{title}</h1>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest truncate">{subtitle}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              to="/"
              className={cn(
                "hidden md:inline-flex p-2 rounded-lg transition",
                isDark ? "text-gray-400 hover:text-white hover:bg-white/5" : "text-slate-500 hover:text-slate-900",
              )}
              title="Back to website"
            >
              <Home size={18} />
            </Link>
            <button
              type="button"
              onClick={() => setIsDark(!isDark)}
              className={cn(
                "hidden md:inline-flex p-2 rounded-lg transition",
                isDark ? "text-gray-400 hover:text-white hover:bg-white/5" : "text-slate-500 hover:text-slate-900",
              )}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="relative hidden md:block">
              <Bell size={18} className={cn("cursor-pointer", isDark ? "text-gray-400" : "text-slate-500")} />
              <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-red-600 text-[10px] flex items-center justify-center font-bold text-white">
                3
              </span>
            </div>

            {role === "admin" && (
              <div className="hidden md:flex items-center gap-2">
                <button
                  type="button"
                  className="flex items-center gap-2 bg-[#1a2b4b] hover:bg-[#253d6b] text-white px-3 py-2 rounded-md text-xs font-medium transition"
                >
                  <FileText size={14} /> Reports
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 bg-gold hover:bg-gold/90 text-black px-3 py-2 rounded-md text-xs font-bold transition"
                >
                  <Plus size={14} /> Add Event
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Search sub-header */}
        <div
          className={cn(
            "border-b px-4 sm:px-6 py-2 flex items-center gap-3",
            isDark ? "bg-[#0b0e14] border-white/5" : "bg-white border-slate-200",
          )}
        >
          <div className="relative flex-1 max-w-xl group">
            <Search
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 transition-colors",
                isDark ? "text-gray-500 group-focus-within:text-white" : "text-slate-400",
              )}
              size={16}
            />
            <input
              type="text"
              placeholder="Search pages..."
              className={cn(
                "w-full border-none pl-10 pr-4 py-1.5 rounded text-sm outline-none focus:ring-1 focus:ring-gold/40",
                isDark ? "bg-[#1a1d23] text-white" : "bg-slate-100 text-slate-900",
              )}
            />
          </div>
          <button
            type="button"
            onClick={handleReload}
            title="Reload dashboard data"
            className={cn(
              "p-1.5 rounded transition",
              isDark ? "bg-[#1a1d23] text-gray-400 hover:text-white" : "bg-slate-100 text-slate-500",
            )}
          >
            <RotateCcw size={16} />
          </button>
        </div>

        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden relative">
          <div className="max-w-[1600px] mx-auto">
            {!isDashboardRoot && <BackToDashboard role={role} />}
            {content}
          </div>

          <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 group">
            <div className="bg-gold text-black px-3 py-1 rounded shadow-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Speak to us!
            </div>
            <button
              type="button"
              className="h-12 w-12 rounded-full bg-gold shadow-2xl flex items-center justify-center text-black hover:scale-105 transition transform relative"
            >
              <MessageSquare size={22} />
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 border-2 border-[#0b0e14] text-[10px] flex items-center justify-center font-bold text-white">
                1
              </span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

type DashboardSidebarProps = {
  collapsed: boolean;
  subtitle: string;
  nav: DashboardNavItem[];
  role: "admin" | "customer";
  pathname: string;
  onNavigate?: () => void;
  onSignOut: () => void;
  userLabel: string;
  roleLabel: string;
  isDark: boolean;
  onToggleCollapse?: () => void;
  showCollapseToggle?: boolean;
};

function DashboardSidebar({
  collapsed,
  subtitle,
  nav,
  role,
  pathname,
  onNavigate,
  onSignOut,
  userLabel,
  roleLabel,
  isDark,
  onToggleCollapse,
  showCollapseToggle = true,
}: DashboardSidebarProps) {
  const grouped = nav.reduce(
    (acc, item) => {
      const cat = item.category || "Menu";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    },
    {} as Record<string, DashboardNavItem[]>,
  );

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Brand + collapse toggle */}
      <div
        className={cn(
          "shrink-0 flex items-center border-b border-white/5",
          collapsed ? "flex-col gap-3 px-3 py-4" : "justify-between px-4 py-5",
          !isDark && "border-slate-200",
        )}
      >
        <Link to={role === "admin" ? "/admin" : "/dashboard"} onClick={onNavigate} className="flex items-center gap-3 min-w-0">
          <span className="inline-flex h-10 w-10 shrink-0 rounded-full overflow-hidden ring-1 ring-gold/40">
            <img src={eventsLogo} alt="" className="h-full w-full object-cover" />
          </span>
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-display text-base leading-tight truncate">
                Royal <span className="text-gold">Touch</span>
              </p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest truncate">{subtitle}</p>
            </div>
          )}
        </Link>
        {showCollapseToggle && onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className={cn(
              "p-1.5 rounded-lg transition shrink-0",
              isDark ? "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10" : "bg-slate-100 text-slate-500",
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4 space-y-5 scrollbar-thin">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="space-y-0.5">
            {!collapsed && (
              <p className="px-3 mb-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                {category}
              </p>
            )}
            {items.map((item) => {
              const isHome = item.to === "/admin" || item.to === "/dashboard";
              const isActive = isHome
                ? pathname === item.to
                : pathname === item.to || pathname.startsWith(`${item.to}/`);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onNavigate}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 group relative",
                    collapsed && "justify-center px-2",
                    isActive
                      ? "bg-gold text-black font-semibold shadow-[0_0_16px_rgba(212,175,55,0.25)]"
                      : isDark
                        ? "text-gray-400 hover:bg-white/5 hover:text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  )}
                >
                  <item.icon size={18} className="shrink-0" />
                  {!collapsed && <span className="truncate flex-1">{item.label}</span>}
                  {isActive && !collapsed && (
                    <span className="h-1.5 w-1.5 rounded-full bg-black/30 shrink-0" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer: user info + logout */}
      <div className={cn("shrink-0 border-t border-white/5 p-3 space-y-2", !isDark && "border-slate-200")}>
        {!collapsed && (
          <div className={cn("px-3 py-2.5 rounded-lg mb-1", isDark ? "bg-white/5 border border-white/5" : "bg-slate-50 border border-slate-200")}>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{roleLabel}</p>
            <p className="text-xs truncate font-medium mt-0.5">{userLabel}</p>
          </div>
        )}

        <Link
          to="/"
          onClick={onNavigate}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
            collapsed && "justify-center px-2",
            isDark ? "text-gray-400 hover:bg-white/5 hover:text-white" : "text-slate-600 hover:bg-slate-100",
          )}
          title={collapsed ? "Visit website" : undefined}
        >
          <ExternalLink size={18} className="shrink-0" />
          {!collapsed && <span>Visit Website</span>}
        </Link>

        <button
          type="button"
          onClick={onSignOut}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
            collapsed && "justify-center px-2",
            "text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 border border-transparent hover:border-rose-500/20",
          )}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}
