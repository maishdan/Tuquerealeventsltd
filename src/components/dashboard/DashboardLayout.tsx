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
  MailOpen,
  Phone,
  Globe,
  ClipboardList,
  Wallet
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

type DashboardLayoutProps = {
  title: string;
  subtitle: string;
  nav: DashboardNavItem[];
  role: "admin" | "customer";
  children?: ReactNode;
};

type Theme = "system" | "dark" | "light" | "classic-dark";

const adminHeaderPages = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/events", label: "Events & Prices", icon: Globe },
  { to: "/admin/bookings", label: "Intake & Invoices", icon: ClipboardList },
  { to: "/admin/users", label: "User Directory", icon: Users },
  { to: "/admin/finance", label: "Financials", icon: Wallet },
  { to: "/admin/contacts", label: "Comms", icon: MessageSquare },
] as const;

const customerHeaderPages = [
  { to: "/dashboard", label: "Portal Hub", icon: LayoutDashboard },
  { to: "/dashboard/bookings", label: "My Orders", icon: ClipboardList },
  { to: "/dashboard/events", label: "My Events", icon: Globe },
  { to: "/dashboard/messages", label: "Messages", icon: MessageSquare },
] as const;

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
    root.classList.add(theme);
  }, [theme]);

  async function handleSignOut() {
    setShowLogoutConfirm(false);
    await signOut();
    navigate({ to: "/" });
  }

  function handleMenuToggle() {
    if (isMobile) {
      setMobileOpen((prev) => !prev);
    } else {
      setCollapsed((prev) => !prev);
    }
  }

  const userLabel = profile?.full_name || profile?.email || "User";
  const roleLabel = role === "admin" ? "Administrator" : "Client";
  const sections: DashboardNavSection[] = role === "admin" ? adminSections : customerSections;
  const headerPages = role === "admin" ? adminHeaderPages : customerHeaderPages;

  const isLinkActive = (to: string) => {
    const normalizedTo = to.replace(/\/$/, "");
    const normalizedPath = pathname.replace(/\/$/, "");
    if (normalizedTo === "/admin" || normalizedTo === "/dashboard") return normalizedPath === normalizedTo;
    return normalizedPath === normalizedTo || normalizedPath.startsWith(`${normalizedTo}/`);
  };

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
      {/* LOGOUT CONFIRMATION POPUP ("ARE YOU SURE YOU WANT TO EXIT?") */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md px-4">
          <div className="bg-white dark:bg-[#121722] border border-emerald-500/40 p-8 sm:p-10 rounded-none max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-6">
              <div className="mx-auto h-20 w-20 bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center justify-center">
                <Power size={36} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase tracking-tight text-foreground">
                  Are you sure you want to exit?
                </h3>
                <p className="text-xs text-slate-600 dark:text-gray-300 font-medium leading-relaxed">
                  You are about to terminate your active administrative session.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="h-14 rounded-none bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-foreground font-black text-xs uppercase tracking-widest hover:border-emerald-500 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="h-14 rounded-none bg-rose-600 text-white font-black text-xs uppercase tracking-widest hover:bg-rose-700 transition-all shadow-md cursor-pointer"
                >
                  Confirm Exit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1">
        {/* Desktop Collapsible Sidebar (xl screens) */}
        <aside
          className={cn(
            "hidden xl:flex flex-col fixed inset-y-0 left-0 top-0 z-40 transition-all duration-300 ease-in-out border-r border-slate-200 dark:border-white/10 shadow-xl overflow-hidden",
            "bg-white dark:bg-[#0b0e14]",
            collapsed ? "w-20" : "w-72",
          )}
        >
          <DashboardSidebar {...sidebarProps} theme={theme} />
        </aside>

        {/* Mobile Sliding Side Menu Sheet */}
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
            "flex-1 flex flex-col min-w-0 transition-all duration-300 relative z-10 pb-16",
            collapsed ? "xl:pl-20" : "xl:pl-72"
          )}
        >
          {/* PERMANENTLY FIXED HEADER WITH DASHBOARD PAGES NAVBAR */}
          <header className="sticky top-0 z-50 h-16 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0b0e14]/95 flex items-center justify-between px-4 sm:px-6 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
              {/* MENU TOGGLE BUTTON */}
              <button
                onClick={handleMenuToggle}
                className="p-2.5 rounded-none bg-emerald-500/10 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all shrink-0 flex items-center gap-2 cursor-pointer shadow-sm font-black"
                title="Toggle Sidebar Menu"
              >
                <Menu size={20} />
                <span className="hidden sm:inline text-[9px] font-black uppercase tracking-widest">
                  {collapsed ? "Expand" : "Menu"}
                </span>
              </button>

              <div className="h-6 w-px bg-slate-200 dark:bg-white/10 mx-1 hidden lg:block" />

              {/* FIXED HEADER DASHBOARD PAGES NAV LINKS */}
              <nav className="hidden lg:flex items-center gap-1 overflow-x-auto scrollbar-none">
                {headerPages.map((page) => {
                  const active = isLinkActive(page.to);
                  const Icon = page.icon;
                  return (
                    <Link
                      key={page.to}
                      to={page.to}
                      className={cn(
                        "h-10 px-3 flex items-center gap-2 rounded-none text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap",
                        active
                          ? "bg-emerald-500 text-black shadow-md font-black"
                          : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-white/5 hover:text-foreground"
                      )}
                    >
                      <Icon size={14} className={cn(active ? "text-black" : "text-emerald-500")} />
                      <span>{page.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* GREEN ACTION BUTTON IN HEADER */}
              <Link
                to={role === "admin" ? "/admin/events" : "/booking"}
                className="hidden md:flex items-center gap-2 h-10 px-4 bg-emerald-500 hover:bg-emerald-600 text-black font-black text-[9px] uppercase tracking-widest transition-all shadow-md cursor-pointer shrink-0"
              >
                <Plus size={14} />
                <span>{role === "admin" ? "+ Add Event" : "Book Ticket"}</span>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative p-2 rounded-none transition-all outline-none hover:bg-muted text-muted-foreground hover:text-emerald-500 cursor-pointer" title="Notifications">
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-none bg-emerald-500 text-black text-[9px] font-black flex items-center justify-center border border-background">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 bg-popover border-border text-popover-foreground rounded-none p-2 shadow-2xl overflow-hidden">
                  <DropdownMenuLabel className="px-4 py-3 flex items-center justify-between">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Notifications</span>
                    {unreadCount > 0 && <span className="text-[9px] font-bold text-emerald-500 uppercase">{unreadCount} New</span>}
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
                              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-tight">{msg.from_name}</p>
                              <span className="text-[8px] font-bold text-muted-foreground">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{msg.body}</p>
                          </Link>
                        </DropdownMenuItem>
                      ))
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="h-8 w-px bg-slate-200 dark:bg-white/10 mx-1 hidden sm:block" />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 group px-1 outline-none cursor-pointer">
                    <div className="h-10 w-10 rounded-none overflow-hidden border border-slate-200 dark:border-white/10 ring-2 ring-transparent group-data-[state=open]:ring-emerald-500 transition-all bg-muted flex items-center justify-center">
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
                      <UserIcon size={16} className="text-muted-foreground group-hover:text-emerald-500" />
                      <span className="text-xs font-bold uppercase tracking-widest">Account</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={role === 'admin' ? '/admin/settings' : '/dashboard/settings'} className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted focus:bg-muted transition-colors rounded-none group border-b border-border mb-1 outline-none">
                      <Settings size={16} className="text-muted-foreground group-hover:text-emerald-500" />
                      <span className="text-xs font-bold uppercase tracking-widest">Settings</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem
                    onClick={() => setShowLogoutConfirm(true)}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-rose-500/10 focus:bg-rose-500/10 transition-colors rounded-none group outline-none text-rose-500 font-bold"
                  >
                    <Power size={16} className="text-rose-500 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">Logout / Exit</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="h-8 w-px bg-slate-200 dark:bg-white/10 mx-1 hidden sm:block" />

              {/* GREEN LOGOUT / EXIT BUTTON IN FIXED HEADER */}
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-none bg-emerald-500 hover:bg-emerald-600 text-black font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all group shrink-0 cursor-pointer shadow-md"
                title="Logout / Exit Session"
              >
                <Power size={14} className="group-hover:rotate-90 transition-transform duration-300" />
                <span className="hidden xs:inline">Logout</span>
              </button>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 md:p-10 max-w-[1600px] mx-auto w-full">
            <div>
              {!isDashboardRoot && <BackToDashboard role={role} />}
              {children ?? <Outlet />}
            </div>
          </main>

          {/* PERMANENTLY FIXED FOOTER */}
          <footer
            className={cn(
              "fixed bottom-0 right-0 z-40 h-12 bg-white/95 dark:bg-[#0b0e14]/95 backdrop-blur-md border-t border-slate-200 dark:border-white/10 px-6 flex items-center justify-between text-[9px] sm:text-[10px] text-muted-foreground font-black uppercase tracking-widest shadow-lg transition-all duration-300",
              collapsed ? "left-0 xl:left-20" : "left-0 xl:left-72"
            )}
          >
            <div>© 2026 ROYAL TOUCH EVENTS EXECUTIVE OPERATIONS</div>
            <div className="hidden md:flex items-center gap-6">
              <span>TEL: +254 795 365 334</span>
              <span>EMAIL: eventsroyaltouch7@gmail.com</span>
              <span>WEB: www.royaltouchevents.co.ke</span>
            </div>
          </footer>
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
              <div className="h-10 w-10 rounded-none flex items-center justify-center transition-all bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black">
                <Home size={20} />
              </div>
              {!collapsed && <span className="text-[11px] font-black uppercase tracking-[0.2em] transition-colors text-foreground group-hover:text-emerald-500">Exit to Website</span>}
           </Link>
        </div>

        {sections.map((sec: any) => ( sec.items.length > 0 && (
          <div key={sec.section} className="space-y-3">
            {!collapsed && (
              <p className="px-3 text-[9px] font-black uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400">
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
                              ? "bg-emerald-500 text-black shadow-md"
                              : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-white/5 hover:text-foreground"
                          )}
                        >
                          <Icon size={20} className={cn("shrink-0", active ? "text-black" : "text-emerald-500")} />
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
                              isLinkActive(child.to) ? "text-emerald-500" : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <div className={cn("h-1.5 w-1.5 rounded-none", isLinkActive(child.to) ? "bg-emerald-500" : "bg-muted-foreground")} />
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
                        ? "bg-emerald-500 text-black shadow-md font-black"
                        : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-white/5 hover:text-foreground"
                    )}
                  >
                    <Icon size={20} className={cn("shrink-0", active ? "text-black" : "text-emerald-500")} />
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
            <div className="h-10 w-10 rounded-none overflow-hidden border border-emerald-500 shrink-0">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <UserIcon size={18} />
                </div>
              )}
            </div>
            <div className="min-w-0">
               <p className="text-[11px] font-black truncate uppercase tracking-tight text-foreground">{userLabel}</p>
               <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest">{roleLabel}</p>
            </div>
          </div>
        )}
        <button
          onClick={onSignOut}
          className={cn(
            "flex w-full items-center gap-3 px-4 py-3 rounded-none text-[10px] font-black uppercase tracking-[0.2em] transition-all cursor-pointer",
            "bg-emerald-500 text-black font-black hover:bg-black hover:text-emerald-400 shadow-md"
          )}
        >
          <Power size={18} className="shrink-0" />
          {!collapsed && <span>Logout / Exit</span>}
        </button>
      </div>
    </div>
  );
}
