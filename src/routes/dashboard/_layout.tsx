import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { DashboardGuard } from "@/components/dashboard/DashboardGuard";
import { useAuth } from "@/contexts/AuthContext";
import { useCustomerMessages } from "@/hooks/use-dashboard-data";
import { createPageSeo } from "@/lib/seo";
import {
  Menu,
  Bell,
  Home,
  Search,
  Power,
  UserCircle,
  Settings2,
  ChevronDown,
  HelpCircle,
  Globe,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/dashboard/_layout")({
  head: () =>
    createPageSeo({
      title: "Client Dashboard | Royal Touch Events",
      description: "Manage your Royal Touch Events bookings, events and messages.",
      path: "/dashboard",
      noindex: true,
    }),
  component: CustomerLayout,
});

function CustomerLayout() {
  return (
    <DashboardGuard requiredRole="customer">
      <ClientPortalLayout>
        <Outlet />
      </ClientPortalLayout>
    </DashboardGuard>
  );
}

function ClientPortalLayout({ children }: { children?: ReactNode }) {
  const { signOut, profile, user } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [collapsed, setCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { data: allMessages = [] } = useCustomerMessages(user?.id);
  const unreadMessages = Array.isArray(allMessages) ? allMessages.filter((m) => !m.read && m.from_role === "admin") : [];
  const unreadCount = unreadMessages.length;

  const isLinkActive = (to: string) => {
    const normalizedTo = to.replace(/\/$/, "");
    const normalizedPath = pathname.replace(/\/$/, "");
    if (normalizedTo === "/dashboard") return normalizedPath === normalizedTo;
    return normalizedPath === normalizedTo || normalizedPath.startsWith(`${normalizedTo}/`);
  };

  const userInitials = profile?.full_name ? profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase() : "JO";

  const clientNavItems = [
    { to: "/dashboard", label: "Portal Hub", icon: "▣" },
    { to: "/dashboard/events", label: "My Events", icon: "▦" },
    { to: "/dashboard/bookings", label: "Inquiries", icon: "▤" },
    { to: "/dashboard/orders", label: "Service Orders", icon: "▤" },
    { to: "/dashboard/messages", label: "Concierge Chat", icon: "✉", badge: unreadCount },
    { to: "/dashboard/receipts", label: "Receipts", icon: "▣" },
    { to: "/dashboard/profile", label: "My Profile", icon: "♟" },
    { to: "/dashboard/settings", label: "Settings", icon: "⚙" },
  ];

  async function handleSignOut() {
    setShowLogoutConfirm(false);
    await signOut();
    navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#03070d] text-[#f4f7fb] relative selection:bg-gold selection:text-black">
      {/* LOGOUT CONFIRMATION POPUP */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-md px-4 font-sans">
          <div className="bg-[#09141f] border border-gold/40 p-8 sm:p-10 rounded-none max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-6">
              <div className="mx-auto h-20 w-20 bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center justify-center rounded-none">
                <Power size={36} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase tracking-tight text-white">
                  Are you sure you want to exit?
                </h3>
                <p className="text-xs text-[#94a4b6] font-medium leading-relaxed">
                  You are about to terminate your active client session.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="h-12 rounded-none bg-[#121d29] border border-[#314354] text-white font-bold text-xs uppercase tracking-widest hover:border-gold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="h-12 rounded-none bg-rose-600 text-white font-black text-xs uppercase tracking-widest hover:bg-rose-700 transition-all shadow-md cursor-pointer"
                >
                  Confirm Exit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 min-h-screen">
        {/* Independent Desktop Customer Sidebar (212px width, No scrollbars) */}
        <aside
          className={cn(
            "hidden xl:flex flex-col fixed inset-y-0 left-0 top-0 z-40 transition-all duration-300 ease-in-out border-r border-[#202c39] overflow-hidden bg-gradient-to-b from-[#02070d] via-[#050b12] to-[#02060b]",
            collapsed ? "w-20" : "w-[212px]"
          )}
        >
          {/* Brand Crown Header */}
          <div className="h-[95px] flex flex-col items-center justify-center border-b border-[#17212b] text-[#f4cf69] select-none shrink-0">
            <div className="text-2xl leading-none filter drop-shadow-[0_0_12px_rgba(230,184,63,0.3)]">♕</div>
            {!collapsed && (
              <>
                <div className="font-serif tracking-[2px] text-sm mt-1 font-bold">ROYAL TOUCH</div>
                <div className="font-serif tracking-[3px] text-[9px] text-[#f4cf69] opacity-90 font-bold uppercase">CLIENT PORTAL</div>
              </>
            )}
          </div>

          {/* Nav List */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-none">
            {clientNavItems.map((item) => {
              const active = isLinkActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 h-10 px-3 rounded-none text-xs font-semibold transition-all cursor-pointer",
                    active
                      ? "text-white bg-gradient-to-r from-[#a9741b] via-[#d5a637] to-[#896019] shadow-lg shadow-[#b48224]/20 font-black"
                      : "text-[#c7d0da] hover:bg-[#111b27] hover:text-white"
                  )}
                >
                  <span className={cn("text-base w-5 text-center shrink-0", active ? "text-white" : "text-[#f1c35a]")}>
                    {item.icon}
                  </span>
                  {!collapsed && <span>{item.label}</span>}
                  {item.badge ? (
                    <span className="ml-auto px-1.5 py-0.5 rounded-none bg-rose-500 text-white text-[9px] font-mono font-bold">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}

            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center gap-3 h-10 px-3 rounded-none text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all cursor-pointer my-2 text-left"
            >
              <span className="text-base w-5 text-center shrink-0 text-rose-400 font-bold">🚪</span>
              {!collapsed && <span>Sign Out</span>}
            </button>
          </nav>

          {/* Bottom Photo Card */}
          {!collapsed && (
            <div className="relative h-24 shrink-0 bg-[linear-gradient(0deg,#03070d_0%,rgba(3,7,13,0.3)_45%,transparent),url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=700&q=80')] bg-cover bg-center opacity-80 border-t border-[#17212b] p-3 flex items-end">
              <p className="italic text-[11px] text-[#f5d47a] font-serif leading-snug">
                Extraordinary Events.<br />
                Lasting Impressions.
              </p>
            </div>
          )}
        </aside>

        {/* Main Content Area */}
        <div
          className={cn(
            "flex-1 flex flex-col min-w-0 transition-all duration-300 relative z-10",
            collapsed ? "xl:pl-20" : "xl:pl-[212px]"
          )}
        >
          {/* TOPBAR HEADER WITH GREEN ACTION BUTTONS */}
          <header className="sticky top-0 z-[1000] h-[74px] border-b border-[#202b37] bg-[#03080e]/95 backdrop-blur-md flex items-center justify-between px-6 shadow-xl overflow-visible">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="p-2 rounded-none bg-[#121d29] border border-[#314354] text-[#f4cf69] hover:bg-[#f4cf69] hover:text-black transition-all cursor-pointer"
                title="Toggle Sidebar"
              >
                <Menu size={18} />
              </button>

              <div className="relative hidden sm:flex items-center w-[240px] lg:w-[320px] h-9 border border-[#314354] rounded-none bg-[#121d29] px-3">
                <Search size={15} className="text-[#8d9bad] mr-2 shrink-0" />
                <input
                  placeholder="Search my bookings, events, invoices..."
                  className="w-full bg-transparent border-none outline-none text-xs text-white placeholder:text-[#8291a2]"
                />
              </div>
            </div>

            {/* Topbar Right Actions (GREEN BUTTONS) */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Green Action Buttons */}
              <Link
                to="/dashboard/host-event"
                className="h-9 px-3.5 bg-emerald-500 hover:bg-emerald-600 text-black font-black text-[10px] uppercase tracking-wider rounded-none flex items-center gap-1.5 shadow-md transition-all cursor-pointer shrink-0"
              >
                <Globe size={14} /> <span className="hidden sm:inline">Host Event</span>
              </Link>

              <Link
                to="/dashboard/book-event"
                className="h-9 px-3.5 bg-[#f4cf69] hover:bg-white text-black font-black text-[10px] uppercase tracking-wider rounded-none flex items-center gap-1.5 shadow-md transition-all cursor-pointer shrink-0"
              >
                <Sparkles size={14} /> <span className="hidden sm:inline">Book Event</span>
              </Link>

              <Link
                to="/"
                className="h-9 px-3 border border-[#314354] bg-[#121d29] hover:border-[#f4cf69] text-[#f4cf69] hover:text-white text-xs font-bold rounded-none flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hidden md:flex"
                title="Go to Public Website Home"
              >
                <Home size={15} /> <span>Website Home</span>
              </Link>

              <div className="h-9 w-px bg-[#34404d] hidden sm:block" />

              <Link
                to="/dashboard/messages"
                className="relative h-9 w-9 flex items-center justify-center text-[#e8edf3] hover:text-[#f4cf69] transition-colors cursor-pointer bg-[#121d29] border border-[#314354] rounded-none"
                title="Concierge Messages"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-none bg-[#f0444f] text-white font-extrabold text-[9px] flex items-center justify-center border-2 border-[#050b12]">
                    {unreadCount}
                  </span>
                )}
              </Link>

              <div className="h-9 w-px bg-[#34404d] hidden md:block" />

              {/* Profile Avatar Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2.5 group cursor-pointer outline-none">
                    <div className="h-9 w-9 rounded-none bg-[#f2e8cd] text-[#25200f] font-extrabold text-xs flex items-center justify-center shadow-md overflow-hidden">
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="User Avatar" className="h-full w-full object-cover" />
                      ) : (
                        userInitials
                      )}
                    </div>
                    <div className="text-left hidden sm:block">
                      <strong className="block text-xs text-white font-bold">{profile?.full_name || "Valued Client"}</strong>
                      <small className="block text-[10px] text-[#9ca8b6] font-medium uppercase">CLIENT / MEMBER</small>
                    </div>
                    <ChevronDown size={14} className="text-[#9ba6b3]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#09141f] border-[#243343] text-white p-2 shadow-2xl rounded-xl z-[99999]">
                  <DropdownMenuLabel className="px-3 py-2 text-xs font-bold text-[#f4cf69] uppercase">
                    {profile?.full_name || "Valued Client"}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#172533]" />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/profile" className="flex items-center gap-3 px-3 py-2.5 text-xs font-semibold hover:bg-[#121d29] rounded-lg cursor-pointer transition-colors text-slate-200 hover:text-white">
                      <UserCircle size={15} className="text-[#f4cf69]" /> My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 text-xs font-semibold hover:bg-[#121d29] rounded-lg cursor-pointer transition-colors text-slate-200 hover:text-white">
                      <Settings2 size={15} className="text-[#f4cf69]" /> Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/contact" className="flex items-center gap-3 px-3 py-2.5 text-xs font-semibold hover:bg-[#121d29] rounded-lg cursor-pointer transition-colors text-slate-200 hover:text-white">
                      <HelpCircle size={15} className="text-[#f4cf69]" /> Help & Support
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#172533]" />
                  <DropdownMenuItem
                    onClick={() => setShowLogoutConfirm(true)}
                    className="flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-500/10 cursor-pointer rounded-lg"
                  >
                    <Power size={14} /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-[1700px] mx-auto w-full">
            {children ?? <Outlet />}
          </main>

          {/* Footer */}
          <footer className="py-6 border-t border-[#172533] bg-[#02070d] text-center text-xs text-[#8d9bad] font-mono">
            <p>© {new Date().getFullYear()} Royal Touch Events Group • <a href="https://myworldafric.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:underline italic text-[#f4cf69] font-serif">Powered by My World Africa</a></p>
          </footer>
        </div>
      </div>
    </div>
  );
}
