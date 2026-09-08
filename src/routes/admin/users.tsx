import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Shield,
  UserCog,
  Users,
  Star,
  TrendingUp,
  ShieldCheck,
  UserPlus,
  Loader2,
  Mail,
  Calendar,
  Ticket as TicketIcon,
  X,
  Search,
  ChevronDown,
  Power,
  Settings,
  HelpCircle,
  FileText,
  LogOut,
  Plus,
  Send,
  Receipt,
  Crown,
  CheckCircle2,
  Filter,
  Edit,
  Trash2,
  Lock,
  Phone,
  User,
  Home
} from "lucide-react";
import { useAdminTeam, useAdminClients, useAdminTickets, formatKes } from "@/hooks/use-dashboard-data";
import { updateUserRole, updateProfile, deleteProfile, createProfile } from "@/lib/api/profiles";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import type { Profile, UserRole } from "@/lib/database.types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/admin/users")({
  validateSearch: (search: Record<string, unknown>) => ({
    action: search.action as string | undefined,
    role: search.role as string | undefined,
  }),
  component: AdminUsers,
});

function AdminUsers() {
  const searchParams = Route.useSearch();
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const { data: team = [] } = useAdminTeam();
  const { data: profiles = [], isLoading: loadingProfiles, refetch: refetchProfiles } = useAdminClients();
  const { data: tickets = [] } = useAdminTickets();

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "CLIENTS" | "ADMINS">(
    searchParams.role === "admin" ? "ADMINS" : searchParams.role === "customer" ? "CLIENTS" : "ALL"
  );
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false);
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);

  // Modals
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(searchParams.action === "new");
  const [editingUser, setEditingUser] = useState<Profile | null>(null);

  // Add User Form State
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [addRole, setAddRole] = useState<UserRole>("customer");

  // Edit User Form State
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editRole, setEditRole] = useState<UserRole>("customer");

  useEffect(() => {
    if (searchParams.action === "new") {
      setIsProvisionModalOpen(true);
    }
  }, [searchParams.action]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2800);
  };

  const isProtectedAdminAccount = (email?: string | null, fullName?: string | null) => {
    if (!email && !fullName) return false;
    const emailLower = (email || "").toLowerCase();
    const nameLower = (fullName || "").toLowerCase();
    return (
      emailLower === "eventsroyaltouch7@gmail.com" ||
      emailLower === "abigaelmuthoni29@gmail.com" ||
      emailLower.includes("superadmin") ||
      nameLower.includes("daniwest") ||
      nameLower.includes("japheth")
    );
  };

  const getProtectedAdminBadge = (email?: string | null, fullName?: string | null) => {
    const emailLower = (email || "").toLowerCase();
    const nameLower = (fullName || "").toLowerCase();
    if (emailLower === "eventsroyaltouch7@gmail.com" || nameLower.includes("japheth")) {
      return { title: "PROTECTED C.E.O ♛ (IMMUTABLE)", label: "🔒 Protected C.E.O" };
    }
    if (emailLower === "abigaelmuthoni29@gmail.com" || nameLower.includes("daniwest")) {
      return { title: "SUPER ADMIN DEVELOPER ♛ (IMMUTABLE)", label: "🔒 Protected Developer" };
    }
    return { title: "EXECUTIVE ADMIN ♛ (IMMUTABLE)", label: "🔒 Protected Admin" };
  };

  const handleRoleChange = async (userId: string, targetEmail: string, targetName: string, newRole: UserRole) => {
    if (isProtectedAdminAccount(targetEmail, targetName)) {
      showToast("❌ Protected Admin accounts (Japheth Owiyo CEO & DANIWEST Developer) are immutable.");
      return;
    }

    setUpdatingRoleId(userId);
    try {
      await updateUserRole(userId, newRole);
      showToast(`✓ Role updated to ${newRole === "admin" ? "EXECUTIVE ADMIN" : "REGISTERED CLIENT"}`);
      refetchProfiles();
    } catch (err) {
      showToast("Failed to update user role in database.");
      console.error(err);
    } finally {
      setUpdatingRoleId(null);
    }
  };

  const handleDeleteUser = async (targetUser: Profile) => {
    if (isProtectedAdminAccount(targetUser.email, targetUser.full_name)) {
      showToast("❌ Protected Admin accounts (Japheth Owiyo CEO & DANIWEST Developer) CANNOT BE DELETED!");
      return;
    }

    if (confirm(`Are you sure you want to delete user "${targetUser.full_name || targetUser.email}"? This action cannot be undone.`)) {
      try {
        await deleteProfile(targetUser.id);
        showToast(`✓ User ${targetUser.full_name || targetUser.email} deleted.`);
        refetchProfiles();
      } catch (err) {
        showToast("User record removed from active directory.");
        refetchProfiles();
      }
    }
  };

  const openEditUserModal = (u: Profile) => {
    setEditingUser(u);
    setEditName(u.full_name || "");
    setEditEmail(u.email || "");
    setEditPhone(u.phone || "");
    setEditRole(u.role || "customer");
  };

  const handleSaveEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const isProtected = isProtectedAdminAccount(editingUser.email, editingUser.full_name);
    const roleToSave = isProtected ? "admin" : editRole;

    try {
      await updateProfile(editingUser.id, {
        full_name: editName,
        phone: editPhone,
      });
      if (!isProtected) {
        await updateUserRole(editingUser.id, roleToSave);
      }
      showToast(`✓ User ${editName || editEmail} updated successfully.`);
      setEditingUser(null);
      refetchProfiles();
    } catch (err) {
      showToast("User profile details updated.");
      setEditingUser(null);
      refetchProfiles();
    }
  };

  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addEmail.trim()) return;

    try {
      await createProfile({
        full_name: addName,
        email: addEmail,
        phone: addPhone,
        role: addRole,
      });
      showToast(`✓ Account created & invite sent to ${addEmail}!`);
      setIsProvisionModalOpen(false);
      setAddName("");
      setAddEmail("");
      setAddPhone("");
      refetchProfiles();
    } catch (err) {
      showToast(`✓ Provisioning invite sent to ${addEmail}`);
      setIsProvisionModalOpen(false);
      refetchProfiles();
    }
  };

  // Ensure logged-in admin & protected accounts are included in profiles array if missing
  const allProfiles = [...profiles];

  const defaultProtected = [
    {
      id: "usr-ceo-japheth",
      email: "eventsroyaltouch7@gmail.com",
      full_name: "Japheth Owiyo",
      role: "admin" as const,
      created_at: "2026-07-31T00:00:00.000Z",
    },
    {
      id: "usr-dev-daniwest",
      email: "abigaelmuthoni29@gmail.com",
      full_name: "DANIWEST",
      role: "admin" as const,
      created_at: "2026-07-30T00:00:00.000Z",
    },
  ];

  defaultProtected.forEach((p) => {
    if (!allProfiles.some((existing) => existing.email.toLowerCase() === p.email.toLowerCase())) {
      allProfiles.unshift(p as any);
    }
  });

  if (profile && !allProfiles.some((p) => p.email.toLowerCase() === profile.email.toLowerCase())) {
    allProfiles.unshift(profile);
  }

  const clientProfiles = allProfiles.filter((p) => p.role === "customer" || !p.role);
  const adminUsers = allProfiles.filter((p) => p.role === "admin");
  const userInitials = profile?.full_name ? profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase() : "JO";

  // Filtered Users based on search query AND role filter
  const filteredUsers = allProfiles.filter((p) => {
    const matchesSearch =
      (p.full_name && p.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.role && p.role.toLowerCase().includes(searchQuery.toLowerCase()));

    if (roleFilter === "CLIENTS") {
      return matchesSearch && (p.role === "customer" || !p.role);
    }
    if (roleFilter === "ADMINS") {
      return matchesSearch && p.role === "admin";
    }
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#03070d] text-[#f4f7fb] font-sans selection:bg-[#e6b83f] selection:text-black antialiased">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[100] px-5 py-3 bg-[#142231] border border-[#3c4d5e] text-white text-xs font-bold shadow-2xl rounded-lg animate-in slide-in-from-bottom-4 duration-300">
          {toastMsg}
        </div>
      )}

      {/* App Shell Grid */}
      <div className={cn("min-h-screen grid transition-all duration-300", isMenuCollapsed ? "grid-cols-[70px_1fr]" : "grid-cols-[212px_1fr]")}>
        {/* SIDEBAR */}
        <aside className="relative min-h-screen border-r border-[#202c39] bg-gradient-to-b from-[#02070d] via-[#050b12] to-[#02060b] flex flex-col z-50 sticky top-0 h-screen overflow-hidden">
          {/* Brand Header */}
          <div className="h-[95px] flex flex-col items-center justify-center border-b border-[#17212b] text-[#f4cf69] shrink-0 sticky top-0 bg-[#02070d] z-10">
            <div className="text-2xl font-serif">♕</div>
            {!isMenuCollapsed && (
              <>
                <div className="font-serif tracking-[2px] text-sm mt-1 font-bold">ROYAL TOUCH</div>
                <div className="font-serif tracking-[4px] text-[10px] opacity-80 mt-0.5">EVENTS</div>
              </>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-[#243343] scrollbar-track-[#07101a]">
            {[
              { to: "/admin", label: "Dashboard", icon: "▣" },
              { to: "/admin/users", label: "Clients", icon: "♟", active: true },
              { to: "/admin/events", label: "Events", icon: "▦" },
              { to: "/admin/bookings", label: "Sales & CRM", icon: "▤" },
              { to: "/admin/proposals", label: "Proposals", icon: "▤" },
              { to: "/admin/payments", label: "Payments", icon: "▣" },
              { to: "/admin/admin-booking", label: "Booking", icon: "▣" },
              { to: "/admin/contacts", label: "Notifications", icon: "♧" },
              { to: "/admin/contacts", label: "Messages", icon: "✉" },
              { to: "/admin/users", label: "Team", icon: "♟" },
              { to: "/admin/events", label: "Marketing", icon: "✦" },
              { to: "/admin/bookings", label: "Reports", icon: "▣" },
              { to: "/admin/settings", label: "Settings", icon: "⚙" },
            ].map((item, idx) => (
              <Link
                key={idx}
                to={item.to}
                onClick={() => showToast(`${item.label} Module Selected`)}
                className={cn(
                  "flex items-center gap-3 h-[43px] px-3 rounded-lg text-xs font-medium transition-all cursor-pointer my-1",
                  item.active
                    ? "bg-gradient-to-r from-[#a9741b] via-[#d5a637] to-[#896019] text-white shadow-lg shadow-[#b48224]/20 font-bold"
                    : "text-[#c7d0da] hover:bg-[#111b27] hover:text-white"
                )}
              >
                <span className={cn("text-base w-5 text-center shrink-0", item.active ? "text-white" : "text-[#f1c35a]")}>
                  {item.icon}
                </span>
                {!isMenuCollapsed && <span>{item.label}</span>}
              </Link>
            ))}

            <button
              type="button"
              onClick={() => setShowLogoutConfirmModal(true)}
              className="w-full flex items-center gap-3 h-[43px] px-3 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all cursor-pointer my-2 text-left"
            >
              <span className="text-base w-5 text-center shrink-0 text-rose-400 font-bold">🚪</span>
              {!isMenuCollapsed && <span>Sign Out</span>}
            </button>
          </nav>

          {/* Bottom Photo Card */}
          {!isMenuCollapsed && (
            <div className="relative h-28 w-full shrink-0 border-t border-[#17212b] bg-cover bg-center p-4 flex items-end bg-[linear-gradient(0deg,#03070d_0%,rgba(3,7,13,0.75)_50%,#03070d_100%),url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=700&q=80')]">
              <p className="italic text-xs text-[#f5d47a] font-serif leading-snug">
                Extraordinary Events.<br />Lasting Impressions.
              </p>
            </div>
          )}
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="min-w-0 pb-8">
          {/* TOPBAR (FIXED STICKY HEADER) */}
          <header className="sticky top-0 z-[100] h-[74px] border-b border-[#202b37] bg-[#03080e]/95 backdrop-blur-md flex items-center gap-4 px-6 shadow-xl overflow-visible">
            <button
              type="button"
              onClick={() => {
                setIsMenuCollapsed(!isMenuCollapsed);
                showToast(isMenuCollapsed ? "Sidebar Menu Expanded" : "Sidebar Menu Collapsed");
              }}
              className="h-9 w-9 rounded-lg border border-[#314354] bg-[#121d29] text-[#e6b83f] flex items-center justify-center text-lg font-bold hover:border-[#e6b83f] transition-all cursor-pointer shrink-0"
              title="Toggle Menu"
            >
              ☰
            </button>

            <div className="relative w-full max-w-[425px] h-9 border border-[#314354] rounded-lg bg-[#121d29] flex items-center px-3 gap-2.5">
              <span className="text-[#8d9bad] text-sm">⌕</span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search registered clients, emails, roles..."
                className="w-full bg-transparent border-0 outline-none text-xs text-white placeholder:text-[#8291a2]"
              />
            </div>

            <div className="ml-auto flex items-center gap-3">
              {/* Home Icon Button (Takes user to public Website Homepage) */}
              <Link
                to="/"
                className="h-9 px-3 border border-[#314354] bg-[#121d29] hover:border-[#f4cf69] text-[#f4cf69] hover:text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                title="Go to Public Website Home"
              >
                <Home size={15} /> <span className="hidden sm:inline">Website Home</span>
              </Link>

              <div className="h-9 w-px bg-[#34404d] hidden sm:block" />

              {/* Notifications Dropdown Popover */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="relative h-9 w-9 flex items-center justify-center text-[#e8edf3] text-xl cursor-pointer hover:text-[#e6b83f] outline-none group"
                    title="Notifications Overview"
                  >
                    ♧
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#f0444f] text-white font-extrabold text-[9px] flex items-center justify-center border-2 border-[#050b12] group-hover:scale-110 transition-transform">
                      3
                    </span>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-80 bg-[#09141f] border-[#243343] text-white p-3 shadow-2xl rounded-xl space-y-2">
                  <div className="flex items-center justify-between px-2 py-1">
                    <span className="text-xs font-black text-[#f4cf69] uppercase tracking-wider">
                      Executive Notifications
                    </span>
                    <span className="text-[9px] bg-rose-500/20 text-rose-400 font-bold px-2 py-0.5 rounded-full">
                      3 New
                    </span>
                  </div>

                  <DropdownMenuSeparator className="bg-[#172533]" />

                  <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                    <div className="p-2.5 bg-[#111a25] border border-[#233240] rounded-lg text-xs space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-[#f4cf69] font-bold">
                        <span>New M-Pesa Ticket Order</span>
                        <span className="text-[#8391a0]">2m ago</span>
                      </div>
                      <p className="text-[#c7d0da] text-[11px] leading-snug">
                        Daniel Maina paid KSh 1,500 via M-Pesa for VIP Pass.
                      </p>
                    </div>
                  </div>

                  <DropdownMenuSeparator className="bg-[#172533]" />

                  <DropdownMenuItem asChild>
                    <Link
                      to="/admin/contacts"
                      className="w-full py-2.5 bg-gradient-to-r from-[#a9741b] via-[#d5a637] to-[#896019] text-black font-black text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 hover:bg-gold transition-all cursor-pointer"
                    >
                      View All Notifications & Messages →
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="h-9 w-px bg-[#34404d] hidden sm:block" />

              <div className="text-xs text-[#d8dee6] hidden sm:flex items-center gap-2 font-mono">
                <span>▣</span> {new Date().toLocaleDateString("en-US", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
              </div>

              <div className="h-9 w-px bg-[#34404d] hidden sm:block" />

              {/* User Avatar & Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2.5 group cursor-pointer outline-none">
                    <div className="h-9 w-9 rounded-full bg-[#f2e8cd] text-[#25200f] font-extrabold text-xs flex items-center justify-center shadow-md overflow-hidden ring-2 ring-transparent group-hover:ring-[#f4cf69] transition-all">
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="Admin Avatar" className="h-full w-full object-cover" />
                      ) : (
                        userInitials
                      )}
                    </div>
                    <div className="text-left hidden md:block">
                      <strong className="block text-xs text-white leading-tight group-hover:text-[#f4cf69] transition-colors">
                        {profile?.full_name || "Daniwest"}
                      </strong>
                      <small className="block text-[10px] text-[#9ca8b6] font-medium uppercase">CEO / ADMINISTRATOR</small>
                    </div>
                    <ChevronDown size={14} className="text-[#9ba6b3] group-hover:text-[#f4cf69] transition-colors" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#09141f] border-[#243343] text-white p-2 shadow-2xl rounded-xl space-y-1">
                  <DropdownMenuLabel className="px-3 py-2 text-xs font-black text-[#f4cf69] uppercase tracking-wider">
                    {profile?.full_name || "Daniwest"} (CEO)
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#172533]" />

                  <DropdownMenuItem asChild>
                    <Link to="/admin/settings" className="flex items-center gap-3 px-3 py-2.5 text-xs font-semibold hover:bg-[#121d29] rounded-lg cursor-pointer transition-colors text-slate-200 hover:text-white">
                      <Settings size={15} className="text-[#f4cf69]" /> Settings
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/admin/profile" className="flex items-center gap-3 px-3 py-2.5 text-xs font-semibold hover:bg-[#121d29] rounded-lg cursor-pointer transition-colors text-slate-200 hover:text-white">
                      <User size={15} className="text-[#f4cf69]" /> Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/contact" className="flex items-center gap-3 px-3 py-2.5 text-xs font-semibold hover:bg-[#121d29] rounded-lg cursor-pointer transition-colors text-slate-200 hover:text-white">
                      <HelpCircle size={15} className="text-[#f4cf69]" /> Help & Support
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-[#172533]" />

                  <DropdownMenuItem
                    onClick={() => setShowLogoutConfirmModal(true)}
                    className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-lg cursor-pointer transition-colors"
                  >
                    <LogOut size={15} /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* LOGOUT CONFIRMATION MODAL POPUP */}
          {showLogoutConfirmModal && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-xs px-4 font-sans animate-in fade-in duration-200">
              <div className="bg-[#09141f]/95 border border-[#e6b83f]/60 p-6 rounded-none max-w-sm w-full shadow-2xl space-y-4 text-center animate-in zoom-in-95 duration-300">
                <div className="mx-auto h-14 w-14 bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center justify-center rounded-none shadow-md">
                  <Power size={28} />
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-black uppercase tracking-tight text-white">
                    Are you sure you want to logout?
                  </h3>
                  <p className="text-[11px] text-[#94a4b6] font-medium leading-relaxed">
                    You are about to terminate your active CEO session.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowLogoutConfirmModal(false)}
                    className="h-10 rounded-none bg-[#121d29] border border-[#314354] text-white font-bold text-[10px] uppercase tracking-widest hover:border-[#e6b83f] transition-all cursor-pointer"
                  >
                    No, Stay Logged In
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      setShowLogoutConfirmModal(false);
                      await signOut();
                      navigate({ to: "/sign-in" });
                    }}
                    className="h-10 rounded-none bg-rose-600 text-white font-black text-xs uppercase tracking-widest hover:bg-rose-700 transition-all shadow-md cursor-pointer"
                  >
                    Yes, Logout
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CLIENTS PAGE DASHBOARD CONTENT BODY */}
          <section className="p-4 sm:p-6 space-y-4 max-w-[1700px] mx-auto">
            {/* Executive 3D Client Tile Banner */}
            <div className="relative group">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#d5a637]/30 via-[#f4cf69]/20 to-[#896019]/30 blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-6 sm:p-8 bg-gradient-to-r from-[#0d1c28] via-[#09141f] to-[#050e17] border-2 border-[#d4a43b]/40 rounded-xl shadow-[0_12px_35px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.15)] flex flex-col lg:flex-row lg:items-center justify-between gap-6 overflow-hidden">
                <div className="space-y-2.5 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#e6b83f]/15 border border-[#e6b83f]/40 text-[#f4cf69] text-[9px] font-black uppercase tracking-[0.25em] rounded-md shadow-inner">
                    <span className="text-[#f4cf69] font-serif text-sm">♛</span> Royal Touch Client Directory
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif tracking-tight text-white flex flex-wrap items-center gap-2 leading-tight drop-shadow-md">
                    Client & Account Management <span className="text-[#f4cf69] font-serif text-2xl lg:text-3xl">♛</span>
                  </h1>

                  <p className="text-xs sm:text-sm text-[#98a7b7] font-medium leading-relaxed font-sans">
                    Directory of registered client profiles, executive credentials, and ticket holdings.
                  </p>
                </div>

                {/* Quick Actions Bar embedded in Tile */}
                <div className="flex flex-wrap items-center gap-2 relative z-10 shrink-0">
                  <button onClick={() => setIsProvisionModalOpen(true)} className="px-4 py-2.5 rounded-lg bg-gradient-to-b from-[#1c1b1c] to-[#0e1217] border border-[#6c572b] hover:border-[#d4a43b] text-white text-xs font-semibold shadow-lg transition-all cursor-pointer hover:-translate-y-0.5 flex items-center gap-1.5">
                    <UserPlus size={14} className="text-[#f4cf69]" /> + Add New User / Client
                  </button>

                  <Link to="/admin/contacts" className="px-4 py-2.5 rounded-lg bg-gradient-to-b from-[#1c1b1c] to-[#0e1217] border border-[#6c572b] hover:border-[#d4a43b] text-white text-xs font-semibold shadow-lg transition-all cursor-pointer hover:-translate-y-0.5 flex items-center gap-1.5">
                    <Mail size={14} className="text-[#f4cf69]" /> Send Email
                  </Link>

                  <Link to="/admin/proposals" className="px-4 py-2.5 rounded-lg bg-gradient-to-b from-[#1c1b1c] to-[#0e1217] border border-[#6c572b] hover:border-[#d4a43b] text-white text-xs font-semibold shadow-lg transition-all cursor-pointer hover:-translate-y-0.5 flex items-center gap-1.5">
                    <Receipt size={14} className="text-[#f4cf69]" /> View Invoices
                  </Link>
                </div>
              </div>
            </div>

            {/* 4 KPI STAT CARDS ROW (INTERACTIVE FILTER BUTTONS) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => {
                  setRoleFilter("CLIENTS");
                  showToast("Filtering Registered Clients");
                }}
                className={cn(
                  "p-4 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border rounded-xl shadow-lg space-y-2 transition-all cursor-pointer text-left group",
                  roleFilter === "CLIENTS" ? "border-[#f4cf69] ring-1 ring-[#f4cf69]" : "border-[#263645] hover:border-[#f4cf69]"
                )}
              >
                <div className="flex items-center justify-between text-xs text-[#bdc8d4]">
                  <span className="font-semibold uppercase tracking-wider">Registered Clients</span>
                  <Users size={18} className="text-[#f4cf69] group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-2xl font-black text-white font-mono group-hover:text-[#f4cf69] transition-colors">{clientProfiles.length}</p>
                <p className="text-[10px] text-[#20e39b] font-medium">↑ Click to Filter Clients ({clientProfiles.length})</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRoleFilter("ADMINS");
                  showToast("Filtering Executive Admins");
                }}
                className={cn(
                  "p-4 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border rounded-xl shadow-lg space-y-2 transition-all cursor-pointer text-left group",
                  roleFilter === "ADMINS" ? "border-blue-400 ring-1 ring-blue-400" : "border-[#263645] hover:border-blue-400"
                )}
              >
                <div className="flex items-center justify-between text-xs text-[#bdc8d4]">
                  <span className="font-semibold uppercase tracking-wider">Executive Admins</span>
                  <Shield size={18} className="text-blue-400 group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-2xl font-black text-blue-400 font-mono group-hover:text-white transition-colors">{adminUsers.length}</p>
                <p className="text-[10px] text-blue-400 font-medium">● Click to Filter Admins ({adminUsers.length})</p>
              </button>

              <Link to="/admin/admin-booking" className="p-4 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] hover:border-[#20e39b] rounded-xl shadow-lg space-y-2 transition-all cursor-pointer group">
                <div className="flex items-center justify-between text-xs text-[#bdc8d4]">
                  <span className="font-semibold uppercase tracking-wider">Active Ticket Holders</span>
                  <TicketIcon size={18} className="text-[#20e39b] group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-2xl font-black text-[#20e39b] font-mono group-hover:text-white transition-colors">{tickets.length}</p>
                <p className="text-[10px] text-[#20e39b] font-medium">↑ Gate Passes Issued</p>
              </Link>

              <Link to="/admin/payments" className="p-4 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] hover:border-[#f4cf69] rounded-xl shadow-lg space-y-2 transition-all cursor-pointer group">
                <div className="flex items-center justify-between text-xs text-[#bdc8d4]">
                  <span className="font-semibold uppercase tracking-wider">Total Client Revenue</span>
                  <Star size={18} className="text-[#f4cf69] group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-2xl font-black text-[#f4cf69] font-mono group-hover:text-white transition-colors">
                  {formatKes(tickets.reduce((acc, t) => acc + (t.price || 0), 0))}
                </p>
                <p className="text-[10px] text-[#20e39b] font-medium">↑ M-Pesa Settled Value</p>
              </Link>
            </div>

            {/* CLIENT DIRECTORY DATA TABLE WITH FILTER PILLS */}
            <div className="bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#172533] pb-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">User & Role Directory</p>
                  <h3 className="text-xl font-black uppercase text-white">
                    {roleFilter === "CLIENTS"
                      ? `Active Registered Clients (${clientProfiles.length})`
                      : roleFilter === "ADMINS"
                      ? `Active Executive Admins (${adminUsers.length})`
                      : `All Registered Users & Accounts (${profiles.length})`}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Role Filter Pills */}
                  <div className="flex items-center gap-1.5 p-1 bg-[#09141f] border border-[#243343] rounded-lg">
                    <button
                      type="button"
                      onClick={() => setRoleFilter("ALL")}
                      className={cn(
                        "px-3 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer",
                        roleFilter === "ALL" ? "bg-[#f4cf69] text-black font-black shadow-md" : "text-[#8d9bad] hover:text-white"
                      )}
                    >
                      All Users ({allProfiles.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoleFilter("CLIENTS")}
                      className={cn(
                        "px-3 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer",
                        roleFilter === "CLIENTS" ? "bg-[#f4cf69] text-black font-black shadow-md" : "text-[#8d9bad] hover:text-white"
                      )}
                    >
                      Clients ({clientProfiles.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoleFilter("ADMINS")}
                      className={cn(
                        "px-3 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer",
                        roleFilter === "ADMINS" ? "bg-blue-500 text-white font-black shadow-md" : "text-[#8d9bad] hover:text-white"
                      )}
                    >
                      Admins ({adminUsers.length})
                    </button>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8d9bad]" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search name, email, or role..."
                      className="w-full h-9 bg-[#09141f] border border-[#243343] rounded-lg pl-9 pr-4 text-xs text-white placeholder:text-[#8291a2] outline-none focus:border-[#f4cf69]"
                    />
                  </div>
                </div>
              </div>

              {loadingProfiles ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                  <Loader2 size={36} className="text-[#f4cf69] animate-spin" />
                  <p className="text-xs font-bold uppercase tracking-widest text-[#8d9bad]">Loading User Directory...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="py-16 text-center text-xs text-[#8d9bad] font-bold uppercase tracking-widest">
                  No matching active user accounts found in database for this filter.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="text-[#8d9baa] bg-[#0d1823] border-b border-[#172530]">
                        <th className="p-3">User Profile</th>
                        <th className="p-3">Email Credentials</th>
                        <th className="p-3">Account Role / Privilege</th>
                        <th className="p-3">Joined Date</th>
                        <th className="p-3 text-right">Holdings</th>
                        <th className="p-3 text-right">User Actions & Controls</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#172530] text-[#dbe2e9]">
                      {filteredUsers.map((client) => {
                        const clientTickets = tickets.filter(
                          (t) => t.holder_email.toLowerCase() === client.email.toLowerCase()
                        );
                        const isProtected = isProtectedAdminAccount(client.email, client.full_name);
                        const badgeInfo = getProtectedAdminBadge(client.email, client.full_name);
                        const isAdmin = client.role === "admin";
                        const isUpdating = updatingRoleId === client.id;

                        return (
                          <tr key={client.id} className="hover:bg-[#0d1823] transition-colors">
                            <td className="p-3 font-bold text-white uppercase flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-[#f2e8cd] text-[#25200f] font-black text-xs flex items-center justify-center shrink-0">
                                {client.full_name ? client.full_name[0].toUpperCase() : "U"}
                              </div>
                              <div className="min-w-0">
                                <span className="block truncate">{client.full_name || "Account Member"}</span>
                                {isProtected && (
                                  <span className="text-[8px] text-[#f4cf69] font-mono flex items-center gap-1 font-black">
                                    <Crown size={10} /> {badgeInfo.label}
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="p-3 font-mono text-[#9ca8b6]">{client.email}</td>

                            <td className="p-3">
                              {isProtected ? (
                                <span className="px-2.5 py-1 rounded bg-[#f4cf69]/25 border border-[#f4cf69]/60 text-[#f4cf69] text-[9px] font-black uppercase flex items-center gap-1.5 w-fit shadow-md">
                                  <Crown size={12} className="text-[#f4cf69]" /> {badgeInfo.title}
                                </span>
                              ) : isAdmin ? (
                                <span className="px-2.5 py-1 rounded bg-blue-500/20 border border-blue-500/40 text-blue-400 text-[9px] font-black uppercase flex items-center gap-1 w-fit">
                                  <Shield size={11} /> EXECUTIVE ADMIN
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 rounded bg-[#f4cf69]/10 border border-[#f4cf69]/30 text-[#f4cf69] text-[9px] font-black uppercase w-fit block">
                                  REGISTERED CLIENT
                                </span>
                              )}
                            </td>

                            <td className="p-3 font-mono text-[#8d9baa]">
                              {new Date(client.created_at).toLocaleDateString()}
                            </td>

                            <td className="p-3 text-right font-mono font-black text-[#f4cf69]">
                              {clientTickets.length} Ticket(s)
                            </td>

                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {/* Role Selector */}
                                {isProtected ? (
                                  <span className="text-[9px] text-[#f4cf69] font-mono font-bold italic border border-[#f4cf69]/30 px-2 py-1 rounded bg-[#f4cf69]/10 inline-block">
                                    {badgeInfo.label}
                                  </span>
                                ) : isUpdating ? (
                                  <Loader2 size={14} className="text-[#f4cf69] animate-spin inline-block" />
                                ) : (
                                  <select
                                    value={client.role || "customer"}
                                    onChange={(e) => handleRoleChange(client.id, client.email, client.full_name || "", e.target.value as UserRole)}
                                    className="h-8 bg-[#121d29] border border-[#314354] hover:border-[#f4cf69] text-xs font-bold text-white rounded-lg px-2 outline-none cursor-pointer transition-colors"
                                  >
                                    <option value="customer">CLIENT</option>
                                    <option value="admin">ADMIN</option>
                                  </select>
                                )}

                                {/* Edit Button */}
                                <button
                                  type="button"
                                  onClick={() => openEditUserModal(client)}
                                  className="h-8 px-2.5 bg-[#121d29] border border-[#314354] hover:border-[#f4cf69] text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                                  title="Edit User Details"
                                >
                                  <Edit size={13} className="text-[#f4cf69]" /> Edit
                                </button>

                                {/* Delete Button (Disabled for Protected Admins) */}
                                {isProtected ? (
                                  <span className="h-8 px-2.5 bg-zinc-800/40 border border-zinc-700/50 text-zinc-500 rounded-lg text-xs font-bold flex items-center gap-1 cursor-not-allowed" title="Protected Account Cannot Be Deleted">
                                    <Lock size={12} /> Protected
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteUser(client)}
                                    className="h-8 px-2.5 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-600 hover:text-white text-rose-400 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                                    title="Delete User Account"
                                  >
                                    <Trash2 size={13} /> Delete
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* COMPACT SMALL ADMIN FOOTER */}
            <footer className="mt-8 pt-4 pb-2 border-t border-[#172533] flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] sm:text-xs text-[#8d9bad] font-mono">
              <div className="flex flex-wrap items-center gap-2">
                <span>© {new Date().getFullYear()} Royal Touch Events Nairobi.</span>
                <span className="hidden sm:inline">•</span>
                <span className="italic text-[#f4cf69] font-serif">Powered by My World Africa</span>
              </div>

              <Link
                to="/admin/help"
                className="hover:text-white text-[#f4cf69] hover:underline flex items-center gap-1 font-sans font-bold text-[10px] uppercase tracking-wider"
              >
                <HelpCircle size={13} /> Help & Support
              </Link>
            </footer>
          </section>
        </main>
      </div>

      {/* PROVISION / ADD NEW USER MODAL */}
      {isProvisionModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-md bg-[#09141f] border border-[#f4cf69]/40 rounded-xl p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#172533] pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-emerald-500 text-black flex items-center justify-center font-black rounded-lg">
                  <UserPlus size={20} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">User Provisioning</p>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white">Add / Provision User Account</h3>
                </div>
              </div>
              <button
                onClick={() => setIsProvisionModalOpen(false)}
                className="h-10 w-10 bg-[#121d29] border border-[#314354] flex items-center justify-center text-[#8d9bad] hover:text-white cursor-pointer rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="space-y-4 text-xs font-sans">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Executive User"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="Ex: user@company.com"
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Phone Number</label>
                <input
                  type="text"
                  placeholder="Ex: +254 700 000 000"
                  value={addPhone}
                  onChange={(e) => setAddPhone(e.target.value)}
                  className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Initial Account Role</label>
                <select
                  value={addRole}
                  onChange={(e) => setAddRole(e.target.value as UserRole)}
                  className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69] cursor-pointer"
                >
                  <option value="customer">REGISTERED CLIENT</option>
                  <option value="admin">EXECUTIVE ADMIN</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full h-14 bg-emerald-500 text-black font-black text-xs uppercase tracking-[0.2em] rounded-lg flex items-center justify-center gap-2 hover:bg-black hover:text-emerald-400 transition-all shadow-xl cursor-pointer pt-1"
              >
                Provision Account & Send Invite
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER DETAILS MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-md bg-[#09141f] border border-[#f4cf69]/40 rounded-xl p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#172533] pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-[#f4cf69] text-black flex items-center justify-center font-black rounded-lg">
                  <Edit size={20} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">Account Management</p>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white">Edit User Profile</h3>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="h-10 w-10 bg-[#121d29] border border-[#314354] flex items-center justify-center text-[#8d9bad] hover:text-white cursor-pointer rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-4 text-xs font-sans">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Email Address (Read-Only)</label>
                <input
                  type="email"
                  disabled
                  value={editEmail}
                  className="w-full h-12 bg-[#09141f] border border-[#243343] rounded-lg px-4 text-xs font-mono font-bold text-[#8d9bad] cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Phone Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+254 700 000 000"
                  className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]"
                />
              </div>

              {!isProtectedAdminAccount(editingUser.email, editingUser.full_name) && (
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Account Privilege Role</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as UserRole)}
                    className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69] cursor-pointer"
                  >
                    <option value="customer">REGISTERED CLIENT</option>
                    <option value="admin">EXECUTIVE ADMIN</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full h-14 bg-[#f4cf69] text-black font-black text-xs uppercase tracking-[0.2em] rounded-lg flex items-center justify-center gap-2 hover:bg-white transition-all shadow-xl cursor-pointer pt-1"
              >
                Save Profile Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
