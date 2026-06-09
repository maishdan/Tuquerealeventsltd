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
  MessageSquare,
  RotateCcw,
  FileText,
  Plus,
  ShieldCheck,
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
      "min-h-screen flex transition-colors duration-300 font-sans",
      isDark
        ? "bg-[#0b0e14] text-white"
        : "bg-slate-50 text-slate-900"
    )}>
      {/* Sidebar — desktop */}
      <aside
        className={cn(
          "hidden lg:flex flex-col fixed inset-y-0 left-0 z-50 border-r transition-all duration-300 ease-in-out transform",
          isDark ? "bg-[#0b0e14] border-white/5" : "bg-white border-slate-200 shadow-xl",
          collapsed ? "w-20" : "w-64",
        )}
      >
        <SidebarInner
          collapsed={collapsed}
          title="Admin Dashboard"
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
          "relative h-full w-[min(85vw,280px)] border-r flex flex-col transition-transform duration-500 ease-out shadow-2xl",
          isDark ? "bg-[#0b0e14] border-white/5" : "bg-white border-slate-200",
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
            title="Admin Dashboard"
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
        "flex-1 flex flex-col min-w-0 transition-all duration-300",
        collapsed ? "lg:pl-20" : "lg:pl-64"
      )}>
        <header className={cn(
          "sticky top-0 z-40 border-b px-4 sm:px-6 h-16 flex items-center justify-between gap-4 transition-all duration-300",
          isDark ? "bg-[#0b0e14] border-white/5" : "bg-white border-slate-200 shadow-sm"
        )}>
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              className={cn("p-1.5 rounded transition", isDark ? "hover:bg-white/5" : "hover:bg-slate-100")}
              onClick={() => {
                if (window.innerWidth >= 1024) {
                  setCollapsed(!collapsed);
                } else {
                  setMobileOpen(true);
                }
              }}
              aria-label="Toggle menu"
            >
              <Menu size={20} className="text-white" />
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                <img src={eventsLogo} alt="Logo" className="h-full w-full object-cover" />
              </div>
              <h1 className="text-white font-semibold text-lg truncate hidden sm:block">Royal Touch Events Admin Dashboard</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="hidden lg:flex items-center gap-4 mr-2">
              <Home size={18} className="text-gray-400 hover:text-white cursor-pointer" />
              <button onClick={() => setIsDark(!isDark)}>
                {isDark ? <Sun size={18} className="text-gray-400 hover:text-white" /> : <Moon size={18} className="text-gray-600" />}
              </button>
              <div className="relative">
                <Bell size={18} className="text-gray-400 hover:text-white cursor-pointer" />
                <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-red-600 text-[10px] flex items-center justify-center font-bold">50</span>
              </div>
              <button
                onClick={handleSignOut}
                className="text-gray-400 hover:text-rose-500 transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button className="hidden md:flex items-center gap-2 bg-[#1a2b4b] hover:bg-[#253d6b] text-white px-4 py-2 rounded-md text-sm font-medium transition shadow-sm">
                <FileText size={16} /> Generate Reports
              </button>
              <button className="flex items-center gap-2 bg-[#0061f2] hover:bg-[#0052cc] text-white px-4 py-2 rounded-md text-sm font-medium transition shadow-sm">
                <Plus size={16} /> Add Event
              </button>
            </div>
          </div>
        </header>

        {/* Search Bar Sub-Header */}
        <div className="bg-[#0b0e14] border-b border-white/5 px-4 sm:px-6 py-2 flex items-center gap-3">
          <div className="relative flex-1 max-w-xl group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search pages..."
              className="w-full bg-[#1a1d23] border-none text-white pl-10 pr-4 py-1.5 rounded text-sm focus:ring-0 outline-none"
            />
          </div>
          <button className="p-1.5 rounded bg-[#1a1d23] text-gray-400 hover:text-white transition">
            <RotateCcw size={16} />
          </button>
        </div>

        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden relative pb-24 lg:pb-6">
          <div className="max-w-[1600px] mx-auto">
            {content}
          </div>

          {/* Floating Chat Button */}
          <div className="fixed bottom-20 lg:bottom-6 right-6 z-50 flex flex-col items-end gap-2 group">
            <div className="bg-[#0061f2] text-white px-3 py-1 rounded shadow-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Speak to us!
            </div>
            <button className="h-12 w-12 rounded-full bg-[#0061f2] shadow-2xl flex items-center justify-center text-white hover:scale-105 transition transform relative">
              <MessageSquare size={24} />
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 border-2 border-[#0b0e14] text-[10px] flex items-center justify-center font-bold">1</span>
            </button>
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0b0e14]/90 backdrop-blur-lg border-t border-white/5 px-2 py-2 flex items-center justify-around">
          {nav.slice(0, 5).map((item) => {
            const active = pathname === item.to || (item.to !== "/admin" && item.to !== "/dashboard" && pathname.startsWith(item.to));
            const isExactHome = item.to === "/admin" || item.to === "/dashboard";
            const isActive = isExactHome ? pathname === item.to : active;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg transition-all",
                  isActive ? "text-gold" : "text-gray-500"
                )}
              >
                <item.icon size={20} />
                <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
              </Link>
            );
          })}
          <button
            onClick={handleSignOut}
            className="flex flex-col items-center gap-1 p-2 rounded-lg text-rose-500"
          >
            <LogOut size={20} />
            <span className="text-[10px] font-medium">Exit</span>
          </button>
          <button
            onClick={() => setMobileOpen(true)}
            className="flex flex-col items-center gap-1 p-2 rounded-lg text-gray-500"
          >
            <Menu size={20} />
            <span className="text-[10px] font-medium">Menu</span>
          </button>
        </div>
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
      <div className={cn("p-6 flex items-center justify-between", collapsed ? "flex-col gap-4" : "")}>
        <h2 className={cn("text-white font-bold text-xl tracking-tight transition-all", collapsed ? "text-xs text-center" : "")}>
          {collapsed ? "RT" : "Royal Touch"}
        </h2>
        {onToggle && (
          <button
            onClick={onToggle}
            className="p-1.5 rounded bg-white/5 text-gray-400 hover:text-white transition-colors lg:flex hidden"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
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
              <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">
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
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 group relative",
                    collapsed && "justify-center",
                    isActive
                      ? "bg-gold text-black font-bold shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                      : "text-gray-400 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <item.icon size={18} className={cn("shrink-0 transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")} />
                  {!collapsed && (
                    <span className="truncate flex-1">
                      {item.label}
                    </span>
                  )}
                  {isActive && !collapsed && (
                    <div className="absolute right-2 h-1.5 w-1.5 rounded-full bg-black/40" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-2">
        {!collapsed && userLabel && (
          <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/5 mb-2">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Active Admin</p>
            <p className="text-xs text-white truncate font-medium">{userLabel}</p>
          </div>
        )}
        <button
          type="button"
          onClick={onSignOut}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-rose-500/10 hover:text-rose-500 transition-all duration-200",
            collapsed && "justify-center",
          )}
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  );
}
