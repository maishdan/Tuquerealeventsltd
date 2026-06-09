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
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { signOut, profile } = useAuth();

  async function handleSignOut() {
    await signOut();
    navigate({ to: "/sign-in" });
  }

  const content = children ?? <Outlet />;

  return (
    <div className="min-h-screen flex bg-[linear-gradient(135deg,oklch(0.12_0.05_280),oklch(0.16_0.06_275))]">
      {/* Sidebar — desktop */}
      <aside
        className={cn(
          "hidden lg:flex flex-col fixed inset-y-0 left-0 z-50 glass-strong border-r border-white/10 transition-all duration-300",
          collapsed ? "w-[72px]" : "w-64",
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
        />
      </aside>

      {/* Sidebar — mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <button className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} aria-label="Close menu" />
          <aside className="relative h-full w-[min(85vw,280px)] glass-strong border-r border-white/10 flex flex-col">
            <button
              className="absolute right-3 top-4 p-2 rounded-lg hover:bg-white/5"
              onClick={() => setMobileOpen(false)}
              aria-label="Close"
            >
              <X size={18} />
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
        />
      </aside>
        </div>
      )}

      {/* Main */}
      <div className={cn("flex-1 flex flex-col min-w-0 transition-all duration-300", collapsed ? "lg:pl-[72px]" : "lg:pl-64")}>
        <header className="sticky top-0 z-40 glass border-b border-white/10 px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-white/5"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-widest text-gold truncate">{role === "admin" ? "CEO Dashboard" : "Client Portal"}</p>
              <h1 className="font-display text-lg truncate">{title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button className="relative p-2 rounded-lg hover:bg-white/5 text-muted-foreground" aria-label="Notifications">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-gold" />
            </button>
            <Link to="/" className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-xs hover:bg-white/5 transition">
              <Home size={14} />
              Website
            </Link>
            <Link
              to={role === "admin" ? "/dashboard" : "/admin"}
              className="hidden md:inline-flex items-center gap-2 rounded-full border border-gold/40 text-gold px-3 py-1.5 text-xs hover:bg-gold/10 transition"
            >
              {role === "admin" ? "Client View" : "Admin View"}
            </Link>
            <div className="h-9 w-9 rounded-full overflow-hidden ring-1 ring-gold/40">
              <img src={eventsLogo} alt="" className="h-full w-full object-cover" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">{content}</main>
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
}) {
  return (
    <>
      <div className={cn("flex items-center gap-3 border-b border-white/10", collapsed ? "p-4 justify-center" : "px-5 py-5")}>
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

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {nav.map((item) => {
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
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition border",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-gold/10 text-gold border-gold/30"
                  : "text-foreground/80 border-transparent hover:bg-white/5 hover:text-foreground",
              )}
            >
              <item.icon size={18} className="shrink-0" />
              {!collapsed && (
                <span className="truncate">
                  {item.label}
                  {item.description && (
                    <span className="block text-[10px] text-muted-foreground font-normal truncate">{item.description}</span>
                  )}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10 space-y-1">
        {onToggle && (
          <button
            onClick={onToggle}
            className={cn(
              "hidden lg:flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground transition",
              collapsed && "justify-center px-2",
            )}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!collapsed && <span>Collapse menu</span>}
          </button>
        )}
        {!collapsed && userLabel && (
          <p className="px-3 pb-2 text-xs text-muted-foreground truncate">{userLabel}</p>
        )}
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            onSignOut();
          }}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-white/5 transition",
            collapsed && "justify-center px-2",
          )}
        >
          <LogOut size={18} />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </>
  );
}
