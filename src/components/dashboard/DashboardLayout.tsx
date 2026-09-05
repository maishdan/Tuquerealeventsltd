import { Link, Outlet, useNavigate, useRouter, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import { Slider } from "@/components/ui/slider";

type DashboardLayoutProps = {
  title: string;
  subtitle: string;
  nav: DashboardNavItem[];
  role: "admin" | "customer";
  children?: ReactNode;
};

type Theme = "system" | "dark" | "light" | "classic-dark";

export function DashboardLayout({ title, subtitle, nav, role, children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { theme, setTheme } = useTheme();
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
    navigate({ to: "/" });
  }

  function toggleMenu() {
    setMobileOpen((prev) => !prev);
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
      "min-h-screen flex flex-col font-sans relative transition-colors duration-300",
      "bg-[#f8fafc] dark:bg-[#0b0e14] text-foreground"
    )}>
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
           <div className="bg-white dark:bg-[#121722] border border-gold/40 p-8 rounded-none max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="text-center space-y-6">
                 <div className="mx-auto h-16 w-16 bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20">
                    <LogOut size={32} />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-xl font-black uppercase tracking-tight text-foreground">Confirm Logout</h3>
                    <p className="text-xs text-muted-foreground font-medium">Are you certain you wish to terminate your current session?</p>
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setShowLogoutConfirm(false)}
                      className="h-12 rounded-none bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-foreground font-black text-xs uppercase tracking-widest hover:border-gold transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="h-12 rounded-none bg-rose-600 text-white font-black text-xs uppercase tracking-widest hover:bg-rose-700 transition-all shadow-md cursor-pointer"
                    >
                      Logout
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      <div className="flex flex-1">
        {/* Desktop Persistent Sidebar (xl screens) */}
        <aside
          className={cn(
            "hidden xl:flex flex-col fixed inset-y-0 left-0 top-0 z-40 transition-all duration-300 ease-in-out border-r border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden",
            "bg-white dark:bg-[#0b0e14]",
            collapsed ? "w-20" : "w-72",
          )}
        >
          <DashboardSidebar {...sidebarProps} theme={theme} />
        </aside>

        {/* The Slider Side Menu Sheet - Opened by the 3-Line Menu Button */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent
            side="left"
            className="w-[300px] p-0 gap-0 flex flex-col border-r border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b0e14] text-foreground shadow-2xl rounded-none"
          >
            <DashboardSidebar {...sidebarProps} collapsed={false} theme={theme} onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Main Content Area */}
        <div
          className={cn(
            "flex-1 flex flex-col min-w-0 transition-all duration-300 relative z-10",
            "xl:pl-72",
            collapsed && "xl:pl-20"
          )}
        >
          <header className="sticky top-0 z-30 h-16 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#0b0e14]/80 flex items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
              {/* THE THREE-LINE MENU BUTTON FOR SIDE NAVIGATION */}
              <button
                onClick={toggleMenu}
                className="p-2.5 rounded-none bg-gold/10 border border-gold/40 text-gold hover:bg-gold hover:text-black transition-all shrink-0 flex items-center gap-2 cursor-pointer shadow-sm"
                title="Toggle Side Menu"
              >
                <Menu size={20} />
                <span className="hidden sm:inline text-[9px] font-black uppercase tracking-widest">Menu</span>
              </button>

              <div className="h-6 w-px bg-slate-200 dark:bg-white/10 mx-1 hidden xs:block" />

              <div className="flex items-center gap-3 min-w-0">
                 <h1 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] text-muted-foreground truncate">
                   <span>{role === "admin" ? "Admin Mission Control" : "Client Portal Hub"} / </span>
                   <span className="text-foreground">{title}</span>
                 </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
               <DropdownMenu>
                 <DropdownMenuTrigger asChild>
                    <button className="relative p-2 rounded-none transition-all outline-none hover:bg-muted text-muted-foreground hover:text-gold cursor-pointer" title="Notifications">
                       <Bell size={20} />
                       {unreadCount > 0 && (
                         <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-none bg-gold text-black text-[9px] font-black flex items-center justify-center border border-background">
                           {unreadCount}
                         </span>
                       )}
                    </button>
                 </DropdownMenuTrigger>
                 <DropdownMenuContent align="end" className="w-80 bg-popover border-border text-popover-foreground rounded-none p-2 shadow-2xl overflow-hidden">
                    <DropdownMenuLabel className="px-4 py-3 flex items-center justify-between">
                       <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Notifications</span>
                       {unreadCount > 0 && <span className="text-[9px] font-bold text-gold uppercase">{unreadCount} New</span>}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border" />

                    <div className="max-h-80 overflow-y-auto scrollbar-none">
                       {unreadCount === 0 ? (
                         <div className="py-10 text-center space-y-3">
                            <div className="h-12 w-12 rounded-none bg-muted flex items-center justify-center mx-auto">
                               <MailOpen size={20} className="text-muted-foreground opacity-30" />
                            </div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Registry Clear</p>
                         </div>
                       ) : (
                         unreadMessages.slice(0, 5).map((msg) => (
                           <DropdownMenuItem key={msg.id} asChild>
                              <Link
                                to="/dashboard/messages"
                                className="flex flex-col items-start gap-1 p-4 cursor-pointer hover:bg-muted focus:bg-muted transition-colors rounded-none outline-none"
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

               <div className="h-8 w-px bg-slate-200 dark:bg-white/10 mx-1 hidden sm:block" />

               <DropdownMenu>
                 <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 group px-1 outline-none cursor-pointer">
                      <div className="h-10 w-10 rounded-none overflow-hidden border border-slate-200 dark:border-white/10 ring-2 ring-transparent group-data-[state=open]:ring-gold transition-all bg-muted flex items-center justify-center">
                        {profile?.avatar_url ? (
                          <img src={profile.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                          <UserIcon size={20} className="text-muted-foreground" />
                        )}
                      </div>
                    </button>
                 </DropdownMenuTrigger>
                 <DropdownMenuContent align="end" className="w-64 bg-popover border-border text-popover-foreground rounded-none p-2 shadow-2xl overflow-hidden">
                    <DropdownMenuLabel className="px-4 py-3">
                       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Authenticated as</p>
                       <p className="text-xs font-bold truncate text-foreground">{user?.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border" />

                    <DropdownMenuItem asChild>
                       <Link to={role === 'admin' ? '/admin/settings' : '/dashboard/profile'} className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted focus:bg-muted transition-colors rounded-none group outline-none">
                          <UserIcon size={16} className="text-muted-foreground group-hover:text-gold" />
                          <span className="text-xs font-bold uppercase tracking-widest">Account</span>
                       </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                       <Link to={role === 'admin' ? '/admin/settings' : '/dashboard/settings'} className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted focus:bg-muted transition-colors rounded-none group border-b border-border mb-1 outline-none">
                          <Settings size={16} className="text-muted-foreground group-hover:text-gold" />
                          <span className="text-xs font-bold uppercase tracking-widest">Settings</span>
                       </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem
                      onClick={() => setShowLogoutConfirm(true)}
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-rose-500/10 focus:bg-rose-500/10 transition-colors rounded-none group outline-none"
                    >
                       <Power size={16} className="text-rose-500 group-hover:scale-110 transition-transform" />
                       <span className="text-xs font-bold uppercase tracking-widest text-foreground">Log out</span>
                    </DropdownMenuItem>
                 </DropdownMenuContent>
               </DropdownMenu>

               <div className="h-8 w-px bg-slate-200 dark:bg-white/10 mx-1 hidden sm:block" />

               <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-none bg-rose-500/10 border border-rose-500/30 text-rose-500 text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all group shrink-0 cursor-pointer"
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
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  const toggleGroup = (key: string) => {
    setOpenGroups(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const isLinkActive = (to: string) => {
    const normalizedTo = to.replace(/\/$/, "");
    const normalizedPath = pathname.replace(/\/$/, "");
    if (normalizedTo === "/admin" || normalizedTo === "/dashboard") return normalizedPath === normalizedTo;
    return normalizedPath === normalizedTo || normalizedPath.startsWith(`${normalizedTo}/`);
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-white dark:bg-[#0b0e14] text-foreground transition-colors duration-300 font-sans">
      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-8 scrollbar-none">
        <div className="pb-4 border-b border-slate-200 dark:border-white/10 mb-4">
           <Link to="/" className="flex items-center gap-4 px-3 py-2 group">
              <div className="h-10 w-10 rounded-none flex items-center justify-center transition-all bg-gold/10 text-gold group-hover:bg-gold group-hover:text-black">
                <Home size={20} />
              </div>
              {!collapsed && <span className="text-[11px] font-black uppercase tracking-[0.2em] transition-colors text-foreground group-hover:text-gold">Exit to Website</span>}
           </Link>
        </div>

        {sections.map((sec: any) => ( sec.items.length > 0 && (
          <div key={sec.section} className="space-y-3">
            {!collapsed && (
              <p className="px-3 text-[9px] font-black uppercase tracking-[0.3em] text-gold">
                {sec.section}
              </p>
            )}
            <div className="space-y-1.5">
              {sec.items.map((item: any) => {
                const hasChildren = item.children && item.children.length > 0;
                const to = item.to;
                const active = to ? isLinkActive(to) : (item.children?.some((c: any) => isLinkActive(c.to)));
                const Icon = item.icon;
                const isOpen = openGroups.includes(item.key);

                if (hasChildren) {
                  return (
                    <Collapsible
                      key={item.key}
                      open={isOpen && !collapsed}
                      onOpenChange={() => toggleGroup(item.key)}
                      className="space-y-1"
                    >
                      <CollapsibleTrigger asChild>
                        <button
                          className={cn(
                            "w-full flex items-center gap-4 px-4 py-3 rounded-none text-xs font-black uppercase tracking-widest transition-all text-left cursor-pointer",
                            active && !isOpen
                              ? "bg-gold text-black shadow-md"
                              : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-white/5 hover:text-foreground"
                          )}
                        >
                          <Icon size={20} className={cn("shrink-0", active ? "text-black" : "text-gold")} />
                          {!collapsed && <span className="text-[11px] truncate leading-none font-black tracking-widest">{item.label}</span>}
                          {!collapsed && (
                            <div className="ml-auto flex items-center gap-2">
                              <ChevronDown size={14} className={cn("transition-transform duration-300", isOpen && "rotate-180")} />
                            </div>
                          )}
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-1 pl-10 animate-in slide-in-from-top-2 duration-300">
                        {item.children.map((child: any) => (
                          <Link
                            key={child.to}
                            to={child.to}
                            onClick={onNavigate}
                            className={cn(
                              "flex items-center gap-3 py-2 text-[10px] font-black uppercase tracking-widest transition-colors",
                              isLinkActive(child.to) ? "text-gold" : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <div className={cn("h-1.5 w-1.5 rounded-none", isLinkActive(child.to) ? "bg-gold" : "bg-muted-foreground")} />
                            {child.label}
                          </Link>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  );
                }

                if (!to) return null;

                return (
                  <Link
                    key={item.key}
                    to={to}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-4 px-4 py-3 rounded-none text-xs font-black uppercase tracking-widest transition-all group relative cursor-pointer",
                      active
                        ? "bg-gold text-black shadow-md font-black"
                        : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-white/5 hover:text-foreground"
                    )}
                  >
                    <Icon size={20} className={cn("shrink-0", active ? "text-black" : "text-gold")} />
                    {!collapsed && <span className="text-[11px] truncate leading-none font-black tracking-widest">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        )))}
      </nav>

      {/* Footer Profile & Logout */}
      <div className="shrink-0 p-6 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/30 space-y-4">
        {!collapsed && (
          <div className="flex items-center gap-3 px-1">
            <div className="h-10 w-10 rounded-none overflow-hidden border border-gold shrink-0">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-gold/10 flex items-center justify-center text-gold">
                  <UserIcon size={18} />
                </div>
              )}
            </div>
            <div className="min-w-0">
               <p className="text-[11px] font-black truncate uppercase tracking-tight text-foreground">{userLabel}</p>
               <p className="text-[9px] text-gold font-black uppercase tracking-widest">{roleLabel}</p>
            </div>
          </div>
        )}
        <button
          onClick={onSignOut}
          className={cn(
            "flex w-full items-center gap-3 px-4 py-3 rounded-none text-[10px] font-black uppercase tracking-[0.2em] transition-all cursor-pointer",
            "bg-rose-500/10 text-rose-500 border border-rose-500/30 hover:bg-rose-500 hover:text-white"
          )}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>End Session</span>}
        </button>
      </div>
    </div>
  );
}
