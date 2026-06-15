import { Link, Outlet, useNavigate, useRouter, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect, type ReactNode } from "react";
import { BackToDashboard } from "./BackToDashboard";
import { adminSections, customerSections, type DashboardNavSection } from "@/lib/dashboard-nav";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
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
  Users,
  ArrowLeft
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
import { Header as SiteHeader } from "@/components/site/Header";

type DashboardLayoutProps = {
  title: string;
  subtitle: string;
  nav: DashboardNavItem[];
  role: "admin" | "customer";
  children?: ReactNode;
};

const SIDEBAR_EXPANDED = "w-64";
const SIDEBAR_COLLAPSED = "w-[4.5rem]";

const heroImages = [
  "/back/e1.jfif",
  "/back/e2.jfif",
  "/back/e3.jfif",
  "/back/e4.jfif",
  "/back/e5.jfif",
  "/back/e7.jpg",
  "/back/e8.jpg",
  "/back/e9.jpg",
];

export function DashboardLayout({ title, subtitle, nav, role, children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
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

  const sections: DashboardNavSection[] = role === "admin" ? adminSections : customerSections;

  const sidebarProps = {
    collapsed,
    subtitle,
    sections,
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
        "min-h-screen flex flex-col transition-colors duration-300 font-sans relative",
        "bg-[#f5f7f9] text-[#2d3748]",
      )}
    >
      {/* Global Fixed Frontend Header */}
      <SiteHeader />

      <div className="flex flex-1 pt-20">
        {/* Desktop sidebar */}
        <aside
          className={cn(
            "hidden lg:flex flex-col fixed inset-y-0 left-0 top-20 z-50 transition-all duration-300 ease-in-out bg-[#2b4c8c] text-white shadow-2xl",
            collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED,
          )}
        >
          <DashboardSidebar {...sidebarProps} />
        </aside>

        {/* Mobile slide-out menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent
            side="left"
            className="w-[min(85vw,300px)] p-0 gap-0 flex flex-col border-r bg-[#2b4c8c] text-white"
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
            "flex-1 flex flex-col min-w-0 transition-all duration-300 relative z-10",
            collapsed ? "lg:pl-[4.5rem]" : "lg:pl-64",
          )}
        >
          <main className="flex-1 p-6 sm:p-10 overflow-x-hidden relative">
            <div className="max-w-[1400px] mx-auto">
              {!isDashboardRoot && <BackToDashboard role={role} />}
              {content}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

type DashboardSidebarProps = {
  collapsed: boolean;
  subtitle: string;
  sections: DashboardNavSection[];
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
  sections,
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
  const isLinkActive = (to: string) => {
    const isHome = to === "/admin" || to === "/dashboard";
    return isHome ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-[#0b0e14] border-r border-white/5 shadow-2xl relative z-50">
      {/* 1. BRAND SECTION (SLIDING ENTRY) */}
      <div
        className={cn(
          "shrink-0 flex items-center relative transition-all duration-500",
          collapsed ? "flex-col gap-4 px-3 py-6" : "justify-between px-6 py-8",
        )}
      >
        <Link
          to={role === "admin" ? "/admin" : "/dashboard"}
          onClick={onNavigate}
          className="flex items-center gap-4 min-w-0 group"
        >
          <div className="h-12 w-12 rounded-full overflow-hidden ring-2 ring-gold/20 shadow-[0_0_20px_rgba(212,175,55,0.2)] shrink-0 group-hover:scale-110 transition-transform duration-500">
            <img src={eventsLogo} alt="Royal Touch" className="h-full w-full object-cover" />
          </div>
          {!collapsed && (
            <div className="min-w-0 animate-in fade-in slide-in-from-left-4 duration-700">
              <p className="font-display text-xl font-black uppercase tracking-tighter text-white">
                Royal <span className="text-gold">Touch</span>
              </p>
              <div className="flex items-center gap-2 mt-1">
                 <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                 <p className="text-[8px] text-gray-500 font-black uppercase tracking-[0.3em] truncate">{subtitle}</p>
              </div>
            </div>
          )}
        </Link>
      </div>

      {/* 2. TILED NAVIGATION HUB (SMOOTH SLIDING GRID) */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 space-y-8 scrollbar-none">
        {sections.map((sec, sIdx) => (
          <div key={sec.section} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${sIdx * 100}ms` }}>
            {!collapsed && (
              <div className="flex items-center gap-3 px-2">
                 <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">
                   {sec.section}
                 </p>
                 <div className="h-px flex-1 bg-white/5" />
              </div>
            )}

            <div className={cn(
              "grid gap-2 grid-cols-1"
            )}>
              {sec.items.map((item) => {
                const to = item.to || (item.children && item.children[0]?.to);
                if (!to) return null;

                const active = isLinkActive(to) || (item.children?.some(c => isLinkActive(c.to)));
                const Icon = item.icon!;

                return (
                  <Link
                    key={item.key}
                    to={to}
                    onClick={onNavigate}
                    title={item.label}
                    className={cn(
                      "flex flex-col items-center justify-center gap-3 p-4 rounded-[20px] border transition-all duration-500 group relative overflow-hidden",
                      active
                        ? "bg-gold border-gold shadow-[0_0_40px_rgba(212,175,55,0.4)] z-10 scale-[1.03]"
                        : "bg-white/[0.02] border-white/5 hover:border-gold/40 hover:bg-white/[0.04]",
                      collapsed && "h-14 w-14 p-0"
                    )}
                  >
                    {/* Background Slide Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-500 relative z-10",
                      active ? "bg-black/10 text-black" : "bg-white/5 text-gray-500 group-hover:text-gold group-hover:scale-110"
                    )}>
                      <Icon size={collapsed ? 22 : 20} strokeWidth={active ? 2.5 : 2} />
                    </div>

                    {!collapsed && (
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-widest text-center leading-tight relative z-10",
                        active ? "text-black" : "text-gray-500 group-hover:text-white"
                      )}>
                        {item.label}
                      </span>
                    )}

                    {/* Sliding Active Notch */}
                    {active && (
                       <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 animate-in slide-in-from-left duration-500" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* 3. EXECUTIVE FOOTER (SLIDING EXIT) */}
      <div className="shrink-0 p-6 border-t border-white/5 space-y-4 bg-black/20">
        {!collapsed && (
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-700">
             <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                <Users size={14} className="text-gold" />
             </div>
             <div className="min-w-0">
                <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest leading-none">{roleLabel}</p>
                <p className="text-[10px] font-bold text-white truncate mt-1">{userLabel}</p>
             </div>
          </div>
        )}

        <button
          type="button"
          onClick={onSignOut}
          className={cn(
            "flex w-full items-center gap-4 rounded-2xl p-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 group",
            "bg-rose-500/5 text-rose-500 border border-rose-500/10 hover:bg-rose-500 hover:text-white hover:shadow-[0_0_20px_rgba(244,63,94,0.4)]",
            collapsed && "justify-center p-0 h-12 w-12 mx-auto"
          )}
          title="Secure Logout"
        >
          <LogOut size={18} className="group-hover:rotate-180 transition-transform duration-700" />
          {!collapsed && <span className="animate-in fade-in slide-in-from-left-2">Terminate Session</span>}
        </button>
      </div>
    </div>
  );
}

