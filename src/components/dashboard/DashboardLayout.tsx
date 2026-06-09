import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { useState, type ReactNode } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Bell,
  Home,
  LogOut,
  Search,
  Settings,
  Sun,
  Moon,
  User,
  Crown,
} from "lucide-react";
import eventsLogo from "../../assets/events-logo.jpeg";
import type { DashboardNavItem } from "@/lib/dashboard-nav";
import { cn } from "@/lib/utils";

type DashboardLayoutProps = {
  title: string;
  subtitle: string;
  nav: DashboardNavItem[];
  role: "admin" | "customer";
  children?: ReactNode;
};

export function DashboardLayout({ title, subtitle, nav, role, children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { signOut, profile } = useAuth();

  async function handleSignOut() {
    await signOut();
    navigate({ to: "/sign-in" });
  }

  const content = children ?? <Outlet />;

  return (
    <div className={cn(
      "min-h-screen flex transition-colors duration-300",
      isDark
        ? "bg-[linear-gradient(135deg,oklch(0.12_0.05_280),oklch(0.16_0.06_275))] text-white"
        : "bg-slate-50 text-slate-900"
    )}>
      {/* Sidebar — desktop */}
      <aside
        className={cn(
          "hidden lg:flex flex-col fixed inset-y-0 left-0 z-50 border-r transition-all duration-500 ease-in-out transform",
          isDark ? "glass-strong border-white/10" : "bg-white border-slate-200 shadow-xl",
          collapsed ? "w-20" : "w-72",
        )}
      >
        <SidebarInner
          collapsed={collapsed}
          title={title}
          subtitle={subtitle}
          nav={nav}
          role={role}
          pathname={pathname}
          onToggle={() => setCollapsed((c) => !c)}
          onSignOut={handleSignOut}
          userLabel={profile?.full_name || profile?.email}
          isDark={isDark}
        />
      </aside>

      {/* Sidebar — mobile drawer */}
      <div className={cn(
        "lg:hidden fixed inset-0 z-50 transition-opacity duration-300",
        mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        <button className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} aria-label="Close menu" />
        <aside className={cn(
          "relative h-full w-[min(85vw,300px)] border-r flex flex-col transition-transform duration-500 ease-out shadow-2xl",
          isDark ? "glass-strong border-white/10" : "bg-white border-slate-200",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <button
            className={cn("absolute right-3 top-4 p-2 rounded-lg transition", isDark ? "hover:bg-white/10" : "hover:bg-slate-100")}
            onClick={() => setMobileOpen(false)}
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <SidebarInner
            collapsed={false}
            title={title}
            subtitle={subtitle}
            nav={nav}
            role={role}
            pathname={pathname}
            onNavigate={() => setMobileOpen(false)}
            onSignOut={handleSignOut}
            userLabel={profile?.full_name || profile?.email}
            isDark={isDark}
          />
        </aside>
      </div>

      {/* Main Content Area */}
      <div className={cn(
        "flex-1 flex flex-col min-w-0 transition-all duration-500 ease-in-out",
        collapsed ? "lg:pl-20" : "lg:pl-72"
      )}>
        <header className={cn(
          "sticky top-0 z-40 border-b px-4 sm:px-6 h-16 flex items-center justify-between gap-4 transition-all duration-300",
          isDark ? "glass border-white/10" : "bg-white/80 backdrop-blur-md border-slate-200 shadow-sm"
        )}>
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              className={cn("p-2 rounded-lg transition", isDark ? "hover:bg-white/5" : "hover:bg-slate-100")}
              onClick={() => {
                if (window.innerWidth >= 1024) {
                  setCollapsed(!collapsed);
                } else {
                  setMobileOpen(true);
                }
              }}
              aria-label="Toggle menu"
            >
              <Menu size={22} className="text-gold" />
            </button>

            {/* Slide down search bar simulation */}
            <div className="hidden md:flex items-center flex-1 max-w-md relative group">
              <Search className="absolute left-3 text-muted-foreground group-focus-within:text-gold transition-colors" size={18} />
              <input
                type="text"
                placeholder="Quick search (Ctrl+K)..."
                className={cn(
                  "w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border transition-all outline-none",
                  isDark
                    ? "bg-white/5 border-white/10 focus:bg-white/10 focus:border-gold/50"
                    : "bg-slate-100 border-slate-200 focus:bg-white focus:border-gold/50"
                )}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={() => setIsDark(!isDark)}
                className={cn("p-2.5 rounded-xl transition", isDark ? "hover:bg-white/5 text-gold" : "hover:bg-slate-100 text-slate-600")}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button className={cn("relative p-2.5 rounded-xl transition", isDark ? "hover:bg-white/5 text-muted-foreground" : "hover:bg-slate-100 text-slate-600")} aria-label="Notifications">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 border-2 border-transparent" />
              </button>
            </div>

            <div className="h-8 w-px bg-white/10 hidden sm:block mx-1" />

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={cn(
                  "flex items-center gap-2 p-1.5 pr-3 rounded-xl transition border",
                  isDark ? "border-white/10 hover:bg-white/5" : "border-slate-200 hover:bg-slate-50"
                )}
              >
                <div className="h-8 w-8 rounded-full overflow-hidden ring-2 ring-gold/20 shrink-0">
                  <img src={eventsLogo} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="hidden sm:block text-left min-w-0">
                  <p className="text-sm font-semibold truncate leading-tight">{profile?.full_name?.split(' ')[0] || "Justice"}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Admin</p>
                </div>
              </button>

              {/* User Dropdown */}
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-[-1]" onClick={() => setUserMenuOpen(false)} />
                  <div className={cn(
                    "absolute right-0 mt-2 w-64 rounded-2xl border p-2 shadow-2xl animate-in slide-in-from-top-2 duration-300",
                    isDark ? "glass-strong border-white/10" : "bg-white border-slate-200"
                  )}>
                    <div className="px-4 py-3 border-b border-white/5 mb-1">
                      <p className="text-xs font-bold text-gold uppercase tracking-[0.2em] mb-1">Authenticated</p>
                      <p className="text-sm font-semibold truncate">{profile?.full_name || "Administrator"}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{profile?.email}</p>
                    </div>
                    <button className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition font-medium", isDark ? "hover:bg-white/5" : "hover:bg-slate-50")}>
                      <User size={18} className="text-gold" /> Profile Settings
                    </button>
                    <button className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition font-medium", isDark ? "hover:bg-white/5" : "hover:bg-slate-50")}>
                      <Settings size={18} className="text-gold" /> System Config
                    </button>
                    <div className="h-px bg-white/5 my-1" />
                    <button
                      onClick={handleSignOut}
                      className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-400 transition font-bold", isDark ? "hover:bg-white/10" : "hover:bg-red-50")}
                    >
                      <LogOut size={18} /> Sign out of Portal
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden relative">
          <div className="max-w-[1600px] mx-auto">
            {/* Welcome message section */}
            {role === "admin" && (pathname === "/admin" || pathname === "/admin/") && (
              <div className="mb-8 animate-in fade-in slide-in-from-left duration-700">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] font-bold uppercase tracking-widest mb-3">
                  <ShieldCheck size={12} /> Secure Admin Session
                </div>
                <h2 className="text-3xl font-display leading-tight">
                  Welcome back, <span className="text-gradient-gold">{profile?.full_name?.split(' ')[0] || "Justice"}</span>
                </h2>
                <p className="text-muted-foreground text-sm max-w-xl">
                  Your premium events empire is performing exceptionally well today.
                </p>
              </div>
            )}
            {content}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarInner({
  collapsed,
  title,
  subtitle,
  nav,
  role,
  pathname,
  onToggle,
  onNavigate,
  onSignOut,
  userLabel,
  isDark,
}: {
  collapsed: boolean;
  title: string;
  subtitle: string;
  nav: DashboardNavItem[];
  role: "admin" | "customer";
  pathname: string;
  onToggle?: () => void;
  onNavigate?: () => void;
  onSignOut: () => void;
  userLabel?: string;
  isDark: boolean;
}) {
  return (
    <>
      <div className={cn("flex items-center gap-3 border-b", isDark ? "border-white/10" : "border-slate-200", collapsed ? "p-4 justify-center" : "px-5 py-5")}>
        <span className="inline-flex h-10 w-10 shrink-0 rounded-full overflow-hidden ring-1 ring-gold/40">
          <img src={eventsLogo} alt="" className="h-full w-full object-cover" />
        </span>
        {!collapsed && (
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <Crown size={14} className="text-gold shrink-0" />
              <p className="font-display text-base leading-tight truncate">{title}</p>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground truncate">{subtitle}</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-6">
        {Object.entries(
          nav.reduce((acc, item) => {
            const cat = item.category || "General";
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(item);
            return acc;
          }, {} as Record<string, DashboardNavItem[]>)
        ).map(([category, items]) => (
          <div key={category} className="space-y-1">
            {!collapsed && (
              <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 mb-2">
                {category}
              </p>
            )}
            {items.map((item) => {
              const active = pathname === item.to || (item.to !== "/admin" && item.to !== "/dashboard" && pathname.startsWith(item.to));
              const isExactHome = item.to === "/admin" || item.to === "/dashboard";
              const isActive = isExactHome ? pathname === item.to : active;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onNavigate}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition border group",
                    collapsed && "justify-center px-2",
                    isActive
                      ? "bg-gold/10 text-gold border-gold/30 shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                      : isDark
                        ? "text-foreground/80 border-transparent hover:bg-white/5 hover:text-foreground"
                        : "text-slate-600 border-transparent hover:bg-slate-100 hover:text-slate-900",
                  )}
                >
                  <item.icon size={18} className={cn("shrink-0 transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")} />
                  {!collapsed && (
                    <span className="truncate font-medium">
                      {item.label}
                      {item.description && (
                        <span className="block text-[10px] text-muted-foreground font-normal truncate group-hover:text-muted-foreground/80 transition-colors">{item.description}</span>
                      )}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className={cn("p-3 border-t space-y-1", isDark ? "border-white/10" : "border-slate-200")}>
        {onToggle && (
          <button
            onClick={onToggle}
            className={cn(
              "hidden lg:flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
              isDark ? "text-muted-foreground hover:bg-white/5 hover:text-foreground" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
              collapsed && "justify-center px-2",
            )}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!collapsed && <span>Collapse menu</span>}
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            onSignOut();
          }}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
            isDark ? "text-muted-foreground hover:bg-white/5 hover:text-foreground" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
            collapsed && "justify-center px-2",
          )}
        >
          <LogOut size={18} />
          {!collapsed && <span>Sign out</span>}
        </button>
        {!collapsed && userLabel && (
          <div className="px-3 py-2 mt-2 rounded-xl bg-gold/5 border border-gold/10">
            <p className="text-[10px] uppercase tracking-widest text-gold font-bold">Logged in as</p>
            <p className="text-xs text-muted-foreground truncate">{userLabel}</p>
          </div>
        )}
      </div>
    </>
  );
}
