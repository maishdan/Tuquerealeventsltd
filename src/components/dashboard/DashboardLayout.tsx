import { Link, Outlet, useNavigate, useRouter, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect, type ReactNode } from "react";
import { BackToDashboard } from "./BackToDashboard";
import { adminSections, customerSections, type DashboardNavSection } from "@/lib/dashboard-nav";
import { useCustomerMessages } from "@/hooks/use-dashboard-data";
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
  ArrowLeft,
  X,
  LayoutDashboard,
  ShieldCheck,
  Zap,
  Power,
  Settings,
  User as UserIcon,
  FlaskConical,
  History,
  Check,
  ChevronRight as ChevronRightIcon,
  Sparkles,
  MailOpen
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";

type DashboardLayoutProps = {
  title: string;
  subtitle: string;
  nav: DashboardNavItem[];
  role: "admin" | "customer";
  children?: ReactNode;
};

const SIDEBAR_EXPANDED = "w-64";
const SIDEBAR_COLLAPSED = "w-20";

type Theme = "system" | "dark" | "light" | "classic-dark";

export function DashboardLayout({ title, subtitle, nav, role, children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");
  const isMobile = useIsMobile();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { signOut, profile, user } = useAuth();
  const isDashboardRoot = pathname === "/admin" || pathname === "/dashboard" || pathname === "/admin/" || pathname === "/dashboard/";

  const { data: allMessages = [] } = useCustomerMessages(user?.id);
  const unreadMessages = Array.isArray(allMessages) ? allMessages.filter(m => !m.read && m.from_role === 'admin') : [];
  const unreadCount = unreadMessages.length;

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark", "classic-dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  async function handleSignOut() {
    setShowLogoutConfirm(false);
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

  const userLabel = profile?.full_name || profile?.email || "User";
  const roleLabel = role === "admin" ? "Administrator" : "Client";
  const sections: DashboardNavSection[] = role === "admin" ? adminSections : customerSections;

  const sidebarProps = {
    collapsed,
    sections,
    role,
    pathname,
    onNavigate: () => setMobileOpen(false),
    onSignOut: () => setShowLogoutConfirm(true),
    userLabel,
    roleLabel,
    profile
  };

  return (
    <div className={cn(
      "min-h-screen flex flex-col font-sans relative transition-colors duration-500",
      "bg-background text-foreground"
    )}>
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
           <div className="bg-card border border-border p-8 rounded-[32px] max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className="text-center space-y-6">
                 <div className="mx-auto h-16 w-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20">
                    <LogOut size={32} />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">Confirm Logout</h3>
                    <p className="text-sm text-muted-foreground font-medium">Are you certain you wish to terminate your current session?</p>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setShowLogoutConfirm(false)}
                      className="h-12 rounded-xl bg-muted border border-border text-foreground font-bold text-xs uppercase tracking-widest hover:bg-accent transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="h-12 rounded-xl bg-rose-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20"
                    >
                      Logout
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside
          className={cn(
            "hidden lg:flex flex-col fixed inset-y-0 left-0 top-0 z-40 transition-all duration-500 ease-in-out border-r shadow-2xl overflow-hidden",
            "bg-card border-border",
            collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED,
          )}
        >
          <DashboardSidebar {...sidebarProps} theme={theme} />
        </aside>

        {/* Mobile Sidebar */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent
            side="left"
            className="w-[min(85vw,300px)] p-0 gap-0 flex flex-col border-r bg-background text-foreground border-border"
          >
            <SheetHeader className="px-6 py-5 border-b border-border text-left">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 rounded-full overflow-hidden ring-1 ring-gold/40">
                  <img src={eventsLogo} alt="" className="h-full w-full object-cover" />
                </span>
                <SheetTitle className="font-display text-lg leading-tight uppercase tracking-tighter text-foreground">
                  Royal <span className="text-gold">Touch</span>
                </SheetTitle>
              </div>
            </SheetHeader>
            <DashboardSidebar {...sidebarProps} collapsed={false} theme={theme} />
          </SheetContent>
        </Sheet>

        {/* Main Content Area */}
        <div
          className={cn(
            "flex-1 flex flex-col min-w-0 transition-all duration-500 relative z-10",
            collapsed ? "lg:pl-20" : "lg:pl-64",
          )}
        >
          <header className="sticky top-0 z-30 h-16 backdrop-blur-xl border-b border-border bg-background/80 flex items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg transition-all shrink-0 hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              <Link to="/" className="p-2 rounded-lg transition-all shrink-0 hover:bg-muted text-muted-foreground hover:text-gold" title="Return to Website Home">
                <Home size={20} />
              </Link>

              <div className="h-6 w-px bg-border mx-1 hidden xs:block" />

              <div className="flex items-center gap-3 min-w-0">
                 <h1 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] text-muted-foreground truncate">
                   <span className="hidden sm:inline">{role === "admin" ? "Admin Mission Control" : "Client Portal Hub"} / </span>
                   <span className="text-foreground">{title}</span>
                 </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
               <DropdownMenu>
                 <DropdownMenuTrigger asChild>
                    <button className="relative p-2 rounded-xl transition-all outline-none hover:bg-muted text-muted-foreground hover:text-gold" title="Notifications">
                       <Bell size={20} />
                       {unreadCount > 0 && (
                         <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-gold text-black text-[9px] font-black flex items-center justify-center border-2 border-background animate-in zoom-in duration-300">
                           {unreadCount}
                         </span>
                       )}
                    </button>
                 </DropdownMenuTrigger>
                 <DropdownMenuContent align="end" className="w-80 bg-popover border-border text-popover-foreground rounded-2xl p-2 shadow-2xl overflow-hidden">
                    <DropdownMenuLabel className="px-4 py-3 flex items-center justify-between">
                       <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Notifications</span>
                       {unreadCount > 0 && <span className="text-[9px] font-bold text-gold uppercase">{unreadCount} New</span>}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border" />

                    <div className="max-h-80 overflow-y-auto scrollbar-none">
                       {unreadCount === 0 ? (
                         <div className="py-10 text-center space-y-3">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto">
                               <MailOpen size={20} className="text-muted-foreground opacity-30" />
                            </div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Registry Clear</p>
                         </div>
                       ) : (
                         unreadMessages.slice(0, 5).map((msg) => (
                           <DropdownMenuItem key={msg.id} asChild>
                              <Link
                                to="/dashboard/messages"
                                className="flex flex-col items-start gap-1 p-4 cursor-pointer hover:bg-muted focus:bg-muted transition-colors rounded-xl outline-none"
                              >
                                 <div className="flex items-center justify-between w-full">
                                    <p className="text-[10px] font-black text-gold uppercase tracking-tight">{msg.from_name}</p>
                                    <span className="text-[8px] font-bold text-muted-foreground">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                 </div>
                                 <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{msg.body}</p>
                              </Link>
                           </DropdownMenuItem>
                         ))
                       )}
                    </div>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem asChild>
                       <Link to="/dashboard/messages" className="flex items-center justify-center w-full py-3 text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] hover:text-gold transition-colors">
                          View All Transmissions
                       </Link>
                    </DropdownMenuItem>
                 </DropdownMenuContent>
               </DropdownMenu>

               <div className="h-8 w-px bg-border mx-1 hidden sm:block" />

               <DropdownMenu>
                 <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 group px-1 outline-none">
                      <div className="h-10 w-10 rounded-full overflow-hidden border border-border ring-2 ring-transparent group-data-[state=open]:ring-gold/50 transition-all bg-muted flex items-center justify-center">
                        {profile?.avatar_url ? (
                          <img src={profile.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                          <UserIcon size={20} className="text-muted-foreground" />
                        )}
                      </div>
                    </button>
                 </DropdownMenuTrigger>
                 <DropdownMenuContent align="end" className="w-64 bg-popover border-border text-popover-foreground rounded-2xl p-2 shadow-2xl overflow-hidden">
                    <DropdownMenuLabel className="px-4 py-3">
                       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Authenticated as</p>
                       <p className="text-xs font-bold truncate text-foreground">{user?.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border" />

                    <DropdownMenuItem asChild>
                       <Link to={role === 'admin' ? '/admin/settings' : '/dashboard/profile'} className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted focus:bg-muted transition-colors rounded-xl group outline-none">
                          <UserIcon size={16} className="text-muted-foreground group-hover:text-gold" />
                          <span className="text-xs font-bold uppercase tracking-widest">Account</span>
                       </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted focus:bg-muted transition-colors rounded-xl group outline-none">
                       <FlaskConical size={16} className="text-muted-foreground group-hover:text-gold" />
                       <span className="text-xs font-bold uppercase tracking-widest">Feature previews</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                       <Link to={role === 'admin' ? '/admin/settings' : '/dashboard/settings'} className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted focus:bg-muted transition-colors rounded-xl group border-b border-border mb-1 outline-none">
                          <Settings size={16} className="text-muted-foreground group-hover:text-gold" />
                          <span className="text-xs font-bold uppercase tracking-widest">Settings</span>
                       </Link>
                    </DropdownMenuItem>

                    <div className="px-4 py-2">
                       <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2">Theme</p>
                       <div className="space-y-1">
                          {[
                            { id: 'system' as const, label: 'System' },
                            { id: 'dark' as const, label: 'Dark' },
                            { id: 'light' as const, label: 'Light' },
                            { id: 'classic-dark' as const, label: 'Classic Dark' },
                          ].map((t) => (
                            <button
                              key={t.id}
                              onClick={() => setTheme(t.id)}
                              className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-muted transition-colors"
                            >
                               <div className="flex items-center gap-3">
                                  <div className={cn("h-1.5 w-1.5 rounded-full", theme === t.id ? "bg-gold" : "bg-transparent")} />
                                  <span className={theme === t.id ? "text-foreground" : "text-muted-foreground"}>{t.label}</span>
                               </div>
                               {theme === t.id && <Check size={10} className="text-gold" />}
                            </button>
                          ))}
                       </div>
                    </div>

                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="flex items-center justify-between w-full px-4 py-3 hover:bg-muted focus:bg-muted transition-colors rounded-xl cursor-pointer outline-none">
                         <div className="flex flex-col text-left">
                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Timezone</p>
                            <p className="text-[10px] font-bold text-muted-foreground opacity-60">Auto (Africa/Nairobi)</p>
                         </div>
                         <ChevronRightIcon size={14} className="text-muted-foreground" />
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className="bg-popover border-border text-popover-foreground">
                           <DropdownMenuItem className="text-[10px] font-bold uppercase">Change Offset</DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>

                    <div className="p-2">
                       <button className="w-full h-11 rounded-xl bg-emerald-500/80 hover:bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/10">
                          <Sparkles size={14} /> Upgrade to Pro
                       </button>
                    </div>

                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem
                      onClick={() => setShowLogoutConfirm(true)}
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-rose-500/10 focus:bg-rose-500/10 transition-colors rounded-xl group outline-none"
                    >
                       <Power size={16} className="text-rose-500 group-hover:scale-110 transition-transform" />
                       <span className="text-xs font-bold uppercase tracking-widest text-foreground">Log out</span>
                    </DropdownMenuItem>
                 </DropdownMenuContent>
               </DropdownMenu>

               <div className="h-8 w-px bg-border mx-1 hidden sm:block" />

               <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all group shrink-0"
               >
                 <Power size={14} className="group-hover:rotate-90 transition-transform duration-300" />
                 <span className="hidden xs:inline">End Session</span>
               </button>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 md:p-10 max-w-[1600px] mx-auto w-full">
            {!isDashboardRoot && <BackToDashboard role={role} />}
            {children ?? <Outlet />}
          </main>
        </div>
      </div>
    </div>
  );
}

function DashboardSidebar({
  collapsed,
  sections,
  role,
  pathname,
  onNavigate,
  onSignOut,
  userLabel,
  roleLabel,
  theme,
  profile
}: any) {
  const isLinkActive = (to: string) => {
    const normalizedTo = to.replace(/\/$/, "");
    const normalizedPath = pathname.replace(/\/$/, "");
    if (normalizedTo === "/admin" || normalizedTo === "/dashboard") return normalizedPath === normalizedTo;
    return normalizedPath === normalizedTo || normalizedPath.startsWith(`${normalizedTo}/`);
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-card transition-colors duration-500">
      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-8 scrollbar-none">
        <div className="pb-4 border-b border-border mb-4">
           <Link to="/" className="flex items-center gap-4 px-4 py-2 group">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center transition-colors bg-muted text-muted-foreground group-hover:text-gold">
                <Home size={16} />
              </div>
              {!collapsed && <span className="text-[10px] font-black uppercase tracking-widest transition-colors text-muted-foreground group-hover:text-foreground">Exit to Website</span>}
           </Link>
        </div>

        {sections.map((sec: any) => ( sec.items.length > 0 && (
          <div key={sec.section} className="space-y-2">
            {!collapsed && (
              <p className="px-4 text-[9px] font-black uppercase tracking-[0.3em] mb-4 text-muted-foreground opacity-60">
                {sec.section}
              </p>
            )}
            <div className="space-y-1">
              {sec.items.map((item: any) => {
                const to = item.to || (item.children && item.children[0]?.to);
                if (!to) return null;
                const active = isLinkActive(to);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.key}
                    to={to}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-300 group relative",
                      active
                        ? "bg-[#6a301a] text-white shadow-[0_10px_30px_rgba(106,48,26,0.3)] border-l-4 border-white"
                        : "border-l-4 border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon size={20} className={cn("shrink-0 transition-transform duration-300", active ? "text-white scale-110" : "text-muted-foreground group-hover:text-gold group-hover:scale-110")} />
                    {!collapsed && <span className="text-[11px] truncate leading-none">{item.label}</span>}
                    {!collapsed && active && (
                      <div className="ml-auto">
                        <Zap size={10} className="text-gold fill-gold animate-pulse" />
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )))}
      </nav>

      {/* Footer Profile & Logout */}
      <div className="shrink-0 p-4 border-t border-border bg-black/5 space-y-4">
        {!collapsed && (
          <div className="flex items-center gap-3 px-2">
            <div className="h-9 w-9 rounded-full overflow-hidden border border-gold/30 ring-2 ring-gold/10">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground">
                  <UserIcon size={16} />
                </div>
              )}
            </div>
            <div className="min-w-0">
               <p className="text-[10px] font-black truncate uppercase tracking-tighter text-foreground">{userLabel}</p>
               <div className="flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck size={10} className="text-gold" />
                  <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest">{roleLabel}</p>
               </div>
            </div>
          </div>
        )}
        <button
          onClick={onSignOut}
          className={cn(
            "flex w-full items-center gap-4 px-4 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500",
            "bg-rose-500/5 text-rose-500 border border-rose-500/10 hover:bg-rose-500 hover:text-white hover:shadow-[0_0_30px_rgba(244,63,94,0.3)]",
            collapsed && "justify-center px-0 h-12 w-12 mx-auto rounded-full"
          )}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Terminate</span>}
        </button>
      </div>
    </div>
  );
}
