import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { useState, type ReactNode } from "react";
import { BackToDashboard } from "./BackToDashboard";
import { adminSections, customerSections, type DashboardNavSection } from "@/lib/dashboard-nav";
import { useCustomerMessages } from "@/hooks/use-dashboard-data";
import {
  Menu,
  Bell,
  Home,
  Search,
  Power,
  User as UserIcon,
  Crown,
  LayoutDashboard,
  Users,
  Globe,
  ClipboardList,
  Wallet,
  Settings,
  ArrowLeft,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type DashboardLayoutProps = {
  title: string;
  subtitle: string;
  nav: any[];
  role: "admin" | "customer";
  children?: ReactNode;
};

const adminHeaderPages = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/users", label: "Clients", icon: Users },
  { to: "/admin/events", label: "Events", icon: Globe },
  { to: "/admin/bookings", label: "Sales & CRM", icon: ClipboardList },
  { to: "/admin/finance", label: "Finance", icon: Wallet },
  { to: "/admin/contacts", label: "Operations", icon: Settings },
] as const;

export function DashboardLayout({ title, subtitle, nav, role, children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const isMobile = useIsMobile();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { signOut, profile, user } = useAuth();
  const isDashboardRoot = pathname === "/admin" || pathname === "/dashboard" || pathname === "/admin/" || pathname === "/dashboard/";

  const { data: allMessages = [] } = useCustomerMessages(user?.id);
  const unreadMessages = Array.isArray(allMessages) ? allMessages.filter(m => !m.read && m.from_role === 'admin') : [];
  const unreadCount = unreadMessages.length;

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

  const isLinkActive = (to: string) => {
    const normalizedTo = to.replace(/\/$/, "");
    const normalizedPath = pathname.replace(/\/$/, "");
    if (normalizedTo === "/admin" || normalizedTo === "/dashboard") return normalizedPath === normalizedTo;
    return normalizedPath === normalizedTo || normalizedPath.startsWith(`${normalizedTo}/`);
  };

  const userInitials = profile?.full_name ? profile.full_name.split(" ").map(n => n[0]).join("").toUpperCase() : "JO";

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#03070d] text-[#f4f7fb] relative selection:bg-gold selection:text-black">
      {/* LOGOUT CONFIRMATION POPUP ("ARE YOU SURE YOU WANT TO EXIT?") */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md px-4">
          <div className="bg-[#09141f] border border-gold/40 p-8 sm:p-10 rounded-xl max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-6">
              <div className="mx-auto h-20 w-20 bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center justify-center rounded-full">
                <Power size={36} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase tracking-tight text-white">
                  Are you sure you want to exit?
                </h3>
                <p className="text-xs text-[#94a4b6] font-medium leading-relaxed">
                  You are about to terminate your active CEO administrative session.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="h-12 rounded-lg bg-[#121d29] border border-[#314354] text-white font-bold text-xs uppercase tracking-widest hover:border-gold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="h-12 rounded-lg bg-rose-600 text-white font-black text-xs uppercase tracking-widest hover:bg-rose-700 transition-all shadow-md cursor-pointer"
                >
                  Confirm Exit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 min-h-screen">
        {/* Desktop CEO Sidebar (212px width matching royal_touch_ceo_dashboard.html) */}
        <aside
          className={cn(
            "hidden xl:flex flex-col fixed inset-y-0 left-0 top-0 z-40 transition-all duration-300 ease-in-out border-r border-[#202c39] overflow-hidden bg-gradient-to-b from-[#02070d] via-[#050b12] to-[#02060b]",
            collapsed ? "w-20" : "w-[212px]"
          )}
        >
          <CeoSidebar collapsed={collapsed} pathname={pathname} isLinkActive={isLinkActive} />
        </aside>

        {/* Mobile Sliding Side Sheet */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-[212px] p-0 border-r border-[#202c39] bg-[#02070d] text-white">
            <CeoSidebar collapsed={false} pathname={pathname} isLinkActive={isLinkActive} onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Main Content Area */}
        <div
          className={cn(
            "flex-1 flex flex-col min-w-0 transition-all duration-300 relative z-10",
            collapsed ? "xl:pl-20" : "xl:pl-[212px]"
          )}
        >
          {/* TOPBAR (74px height matching royal_touch_ceo_dashboard.html) */}
          <header className="sticky top-0 z-50 h-[74px] border-b border-[#202b37] bg-[#03080e]/85 backdrop-blur-md flex items-center justify-between px-6 shadow-xl">
            <div className="flex items-center gap-4">
              {/* Menu Toggle Button */}
              <button
                onClick={handleMenuToggle}
                className="p-2 rounded-lg bg-[#121d29] border border-[#314354] text-gold hover:bg-gold hover:text-black transition-all cursor-pointer"
                title="Toggle Sidebar"
              >
                <Menu size={18} />
              </button>

              {/* Search Bar */}
              <div className="relative hidden sm:flex items-center w-[320px] lg:w-[420px] h-9 border border-[#314354] rounded-lg bg-[#121d29] px-3">
                <Search size={15} className="text-[#8d9bad] mr-2 shrink-0" />
                <input
                  placeholder="Search clients, events, contacts..."
                  className="w-full bg-transparent border-none outline-none text-xs text-white placeholder:text-[#8291a2]"
                />
              </div>
            </div>

            {/* Topbar Right Icons */}
            <div className="flex items-center gap-4">
              <button className="relative h-9 w-9 flex items-center justify-center text-[#e8edf3] hover:text-gold transition-colors cursor-pointer" title="Notifications">
                <Bell size={20} />
                <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-[#f0444f] text-white font-extrabold text-[9px] flex items-center justify-center border-2 border-[#050b12]">
                  3
                </span>
              </button>

              <div className="h-9 w-px bg-[#34404d]" />

              <div className="hidden md:flex items-center gap-2 text-xs text-[#d8dee6] font-mono">
                <span className="text-gold">▣</span> Wed, 10 Sep 2026
              </div>

              <div className="h-9 w-px bg-[#34404d] hidden md:block" />

              {/* User Avatar */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 group cursor-pointer outline-none">
                    <div className="h-9 w-9 rounded-full bg-[#f2e8cd] text-[#25200f] font-extrabold text-xs flex items-center justify-center shadow-md">
                      {userInitials}
                    </div>
                    <div className="text-left hidden sm:block">
                      <strong className="block text-xs text-white font-bold">{profile?.full_name || "Japheth Owiyo"}</strong>
                      <small className="block text-[10px] text-[#9ca8b6] font-medium uppercase">CEO</small>
                    </div>
                    <ChevronDown size={14} className="text-[#9ba6b3]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#09141f] border-[#243343] text-white p-2 shadow-2xl rounded-xl">
                  <DropdownMenuLabel className="px-3 py-2 text-xs font-bold text-gold uppercase">
                    CEO Account Portal
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#172533]" />
                  <DropdownMenuItem
                    onClick={() => setShowLogoutConfirm(true)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 cursor-pointer rounded-lg"
                  >
                    <Power size={14} /> Exit CEO Session
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-[1700px] mx-auto w-full">
            {!isDashboardRoot && <BackToDashboard role={role} />}
            {children ?? <Outlet />}
          </main>
        </div>
      </div>
    </div>
  );
}

function CeoSidebar({ collapsed, pathname, isLinkActive, onNavigate }: any) {
  const navItems = [
    { to: "/admin", label: "Dashboard", icon: "▣" },
    { to: "/admin/users", label: "Clients", icon: "♟" },
    { to: "/admin/events", label: "Events", icon: "▦" },
    { to: "/admin/bookings", label: "Sales & CRM", icon: "▤" },
    { to: "/admin/finance", label: "Finance", icon: "✥" },
    { to: "/admin/contacts", label: "Operations", icon: "⚙" },
  ];

  return (
    <div className="flex flex-col h-full min-h-0 relative">
      {/* Brand Crown Header */}
      <div className="h-[95px] flex flex-col items-center justify-center border-b border-[#17212b] text-[#f4cf69] select-none">
        <div className="text-2xl leading-none filter drop-shadow-[0_0_12px_rgba(230,184,63,0.3)]">♕</div>
        {!collapsed && (
          <>
            <div className="font-serif tracking-[2px] text-sm mt-1 font-bold">ROYAL TOUCH</div>
            <div className="font-serif tracking-[4px] text-[10px] opacity-80 mt-0.5">EVENTS</div>
          </>
        )}
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isLinkActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 h-11 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                active
                  ? "text-white bg-gradient-to-r from-[#a9741b] via-[#d5a637] to-[#896019] shadow-lg shadow-[#b48224]/20"
                  : "text-[#c7d0da] hover:bg-[#111b27] hover:text-white"
              )}
            >
              <span className={cn("text-base w-5 text-center shrink-0", active ? "text-white" : "text-[#f1c35a]")}>
                {item.icon}
              </span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Ambient Photo Card */}
      {!collapsed && (
        <div className="relative h-60 mt-auto bg-[linear-gradient(0deg,#03070d_0%,rgba(3,7,13,0.3)_45%,transparent),url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=700&q=80')] bg-cover bg-center opacity-80 border-t border-[#17212b] p-6 flex items-end">
          <p className="italic text-sm text-[#f5d47a] font-serif leading-snug">
            Extraordinary Events.<br />
            Lasting Impressions.
          </p>
        </div>
      )}
    </div>
  );
}
