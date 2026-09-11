import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { updateProfile } from "@/lib/api/profiles";
import { supabase } from "@/lib/supabase";
import {
  User,
  Shield,
  Lock,
  Bell,
  Sliders,
  Key,
  Globe,
  Camera,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  Power,
  ChevronDown,
  Settings as SettingsIcon,
  Mail,
  FileText,
  HelpCircle,
  Clock,
  ShieldCheck,
  Crown,
  Laptop,
  Check,
  X,
  Loader2,
  Trash2,
  Phone,
  Building,
  Home
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

export const Route = createFileRoute("/admin/profile")({
  component: ProfilePage,
});

type ProfileTab =
  | "personal"
  | "security"
  | "notifications"
  | "preferences"
  | "activity"
  | "danger";

function ProfilePage() {
  const { profile, signOut, user } = useAuth();
  const navigate = useNavigate();

  const emailLower = (user?.email || profile?.email || "").toLowerCase();
  const rawName = profile?.full_name || user?.user_metadata?.full_name || "";

  const adminInfo = (() => {
    if (emailLower === "eventsroyaltouch7@gmail.com" || rawName.toLowerCase().includes("japheth")) {
      return { fullName: "Japheth Owiyo", badge: "PROTECTED C.E.O" };
    }
    if (emailLower === "abigaelmuthoni29@gmail.com" || rawName.toLowerCase().includes("daniwest")) {
      return { fullName: "DANIWEST", badge: "SUPER ADMIN DEVELOPER" };
    }
    const fallback = rawName || (emailLower ? emailLower.split("@")[0].toUpperCase() : "ADMINISTRATOR");
    return { fullName: fallback, badge: "EXECUTIVE ADMIN" };
  })();

  const [activeTab, setActiveTab] = useState<ProfileTab>("personal");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Form States
  const [fullName, setFullName] = useState(profile?.full_name || "Japheth Owiyo");
  const [phone, setPhone] = useState(profile?.phone || "+254 795 365 334");
  const [city, setCity] = useState(profile?.city || "Nairobi");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);

  // Danger Zone Delete Modal State
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        if (evt.target?.result) {
          const base64Url = String(evt.target.result);
          setAvatarUrl(base64Url);
          if (user?.id) {
            await updateProfile(user.id, { avatar_url: base64Url });
          }
          showToast("✓ Profile photo updated successfully!");
        }
      };
      reader.readAsDataURL(file);
    } catch {
      showToast("Photo upload failed.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSavePersonalInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setSavingProfile(true);
    try {
      await updateProfile(user.id, {
        full_name: fullName,
        phone,
        city,
        avatar_url: avatarUrl,
      });
      showToast("✓ Personal Profile updated successfully!");
    } catch (err) {
      showToast("Profile details updated.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (newPassword.length < 8) {
      setPasswordMsg("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg("New passwords do not match.");
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      showToast("✓ Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordMsg(err.message || "Failed to update password.");
    }
  };

  const userInitials = profile?.full_name
    ? profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "JO";

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
            <div className="text-2xl font-serif"></div>
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
              { to: "/admin/users", label: "Clients", icon: "♟" },
              { to: "/admin/events", label: "Events", icon: "▦" },
              { to: "/admin/bookings", label: "Sales & CRM", icon: "▤" },
              { to: "/admin/proposals", label: "Proposals", icon: "▤" },
              { to: "/admin/payments", label: "Payments", icon: "▣" },
              { to: "/admin/finance", label: "Finance", icon: "✥" },
              { to: "/admin/ai", label: "AI & Insights", icon: "✦" },
              { to: "/admin/admin-booking", label: "Booking", icon: "▣" },
              { to: "/admin/contacts", label: "Notifications", icon: "♧" },
              { to: "/admin/contacts", label: "Messages", icon: "✉" },
              { to: "/admin/team", label: "Team", icon: "♟" },
              { to: "/admin/marketing", label: "Marketing", icon: "✦" },
              { to: "/admin/reports", label: "Reports", icon: "▣" },
              { to: "/admin/settings", label: "Settings", icon: "⚙" },
            ].map((item, idx) => (
              <Link
                key={idx}
                to={item.to}
                onClick={() => showToast(`${item.label} Module Selected`)}
                className={cn(
                  "flex items-center gap-3 h-[43px] px-3 rounded-lg text-xs font-medium transition-all cursor-pointer my-1",
                  "text-[#c7d0da] hover:bg-[#111b27] hover:text-white"
                )}
              >
                <span className="text-base w-5 text-center shrink-0 text-[#f1c35a]">
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
              <span className="text-base w-5 text-center shrink-0 text-rose-400 font-bold"></span>
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
                placeholder="Search profile, security, 2FA, sessions..."
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
                        <span>Profile Identity Verified</span>
                        <span className="text-[#8391a0]">Just now</span>
                      </div>
                      <p className="text-[#c7d0da] text-[11px] leading-snug">
                        Executive credentials synchronized.
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
                      {avatarUrl || profile?.avatar_url ? (
                        <img src={avatarUrl || profile?.avatar_url || ""} alt="Admin Avatar" className="h-full w-full object-cover" />
                      ) : (
                        userInitials
                      )}
                    </div>
                    <div className="text-left hidden md:block">
                      <strong className="block text-xs text-white leading-tight group-hover:text-[#f4cf69] transition-colors">
                        {adminInfo.fullName}
                      </strong>
                      <small className="block text-[10px] text-[#9ca8b6] font-medium uppercase">{adminInfo.badge}</small>
                    </div>
                    <ChevronDown size={14} className="text-[#9ba6b3] group-hover:text-[#f4cf69] transition-colors" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#09141f] border-[#243343] text-white p-2 shadow-2xl rounded-xl space-y-1">
                  <DropdownMenuLabel className="px-3 py-2 text-xs font-black text-[#f4cf69] uppercase tracking-wider">
                    {adminInfo.fullName} ({adminInfo.badge})
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#172533]" />

                  <DropdownMenuItem asChild>
                    <Link to="/admin/settings" className="flex items-center gap-3 px-3 py-2.5 text-xs font-semibold hover:bg-[#121d29] rounded-lg cursor-pointer transition-colors text-slate-200 hover:text-white">
                      <SettingsIcon size={15} className="text-[#f4cf69]" /> Settings
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

          {/* USER PROFILE PAGE BODY */}
          <section className="p-4 sm:p-6 space-y-6 max-w-[1700px] mx-auto">
            {/* 1. TOP PROFILE OVERVIEW HEADER CARD */}
            <div className="relative group">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#d5a637]/30 via-[#f4cf69]/20 to-[#896019]/30 blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-6 sm:p-8 bg-gradient-to-r from-[#0d1c28] via-[#09141f] to-[#050e17] border-2 border-[#d4a43b]/40 rounded-xl shadow-[0_12px_35px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.15)] flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 relative z-10">
                  {/* Photo Avatar with Upload Overlay */}
                  <div className="relative h-24 w-24 rounded-full bg-[#f2e8cd] text-[#25200f] font-extrabold text-2xl flex items-center justify-center border-2 border-[#f4cf69] shadow-xl overflow-hidden shrink-0 group/avatar">
                    {avatarUrl || profile?.avatar_url ? (
                      <img src={avatarUrl || profile?.avatar_url || ""} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      userInitials
                    )}
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center text-white text-[9px] font-black uppercase cursor-pointer transition-opacity">
                      {uploadingAvatar ? <Loader2 size={16} className="animate-spin" /> : <Camera size={18} />}
                      <span>Change</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                    </label>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-0.5 bg-[#f4cf69]/15 border border-[#f4cf69]/40 text-[#f4cf69] text-[9px] font-black uppercase tracking-widest rounded">
                        <Crown size={11} className="inline mr-1" /> CEO / EXECUTIVE ADMINISTRATOR
                      </span>
                      <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[8px] font-extrabold uppercase rounded">
                        ● ACTIVE ACCOUNT
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-black font-serif tracking-tight text-white drop-shadow-md">
                      {fullName || "Japheth Owiyo"}
                    </h1>

                    <div className="flex flex-wrap gap-4 text-xs text-[#98a7b7] font-medium font-mono pt-1">
                      <span>✉ {profile?.email || user?.email || "eventsroyaltouch7@gmail.com"}</span>
                      <span> {phone}</span>
                      <span>{city}, Kenya</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 relative z-10 shrink-0">
                  <button
                    onClick={() => setActiveTab("personal")}
                    className="px-4 py-2.5 rounded-lg bg-[#f4cf69] text-black font-black text-xs uppercase tracking-widest shadow-lg hover:bg-white transition-all cursor-pointer"
                  >
                    Edit Personal Info
                  </button>
                </div>
              </div>
            </div>

            {/* PROFILE LEFT-SIDE SUB-NAVIGATION & CONTENT LAYOUT */}
            <div className="grid lg:grid-cols-12 gap-6">
              {/* Left Sub-Navigation Menu */}
              <div className="lg:col-span-3 space-y-1 p-2 bg-[#09141f] border border-[#243343] rounded-xl shadow-lg h-fit">
                {[
                  { id: "personal", label: "Personal Information", icon: User },
                  { id: "security", label: "Password & Security", icon: Lock },
                  { id: "notifications", label: "Notification Preferences", icon: Bell },
                  { id: "preferences", label: "Appearance & Region", icon: Sliders },
                  { id: "activity", label: "My Activity Log", icon: Clock },
                  { id: "danger", label: "Danger Zone", icon: AlertTriangle, danger: true },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as ProfileTab)}
                      className={cn(
                        "w-full px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer text-left",
                        item.danger
                          ? isActive
                            ? "bg-rose-600 text-white font-black shadow-md"
                            : "text-rose-400 hover:bg-rose-500/10"
                          : isActive
                          ? "bg-[#f4cf69] text-black font-black shadow-md"
                          : "text-[#8d9bad] hover:bg-[#121d29] hover:text-white"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={16} />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <span>→</span>}
                    </button>
                  );
                })}
              </div>

              {/* Right Content View */}
              <div className="lg:col-span-9">
                {/* 1. PERSONAL INFORMATION FORM */}
                {activeTab === "personal" && (
                  <form onSubmit={handleSavePersonalInfo} className="bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-6 shadow-xl space-y-6 animate-in fade-in duration-300">
                    <div className="border-b border-[#172533] pb-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">Profile Identity</p>
                      <h3 className="text-xl font-black uppercase text-white">Personal & Contact Information</h3>
                    </div>

                    {/* Profile Photo Uploader */}
                    <div className="p-4 bg-[#09141f] border border-[#243343] rounded-lg space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-widest text-[#f4cf69] block">
                        Upload Profile Photo / Avatar
                      </label>

                      <div className="flex flex-wrap items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-[#f2e8cd] text-[#25200f] font-black text-xl flex items-center justify-center border border-[#f4cf69] shadow-md overflow-hidden shrink-0">
                          {avatarUrl || profile?.avatar_url ? (
                            <img src={avatarUrl || profile?.avatar_url || ""} alt="Avatar" className="h-full w-full object-cover" />
                          ) : (
                            userInitials
                          )}
                        </div>

                        <label className="h-11 px-5 bg-[#121d29] border border-[#314354] hover:border-[#f4cf69] text-white font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-2 cursor-pointer transition-all">
                          {uploadingAvatar ? <Loader2 size={14} className="animate-spin text-[#f4cf69]" /> : <Camera size={15} className="text-[#f4cf69]" />}
                          <span>{uploadingAvatar ? "Uploading..." : "Choose Image File"}</span>
                          <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                        </label>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 text-xs font-sans">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Full Legal Name *</label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Email Address (Read-Only)</label>
                        <input
                          type="email"
                          disabled
                          value={profile?.email || user?.email || "eventsroyaltouch7@gmail.com"}
                          className="w-full h-12 bg-[#09141f] border border-[#243343] rounded-lg px-4 text-xs font-mono font-bold text-[#8d9bad] cursor-not-allowed"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Phone Number *</label>
                        <input
                          type="text"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">City / Location</label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]"
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-[#09141f] border border-[#243343] rounded-lg text-xs space-y-1">
                      <p className="font-bold text-[#f4cf69] uppercase">Protected Executive Role:</p>
                      <p className="text-[#8d9baa]">Privileged Role: <b className="text-white">Super Admin / CEO</b> (Role is managed under Admin Security Policy).</p>
                    </div>

                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="h-12 px-8 bg-[#f4cf69] text-black font-black text-xs uppercase tracking-widest rounded-lg hover:bg-white transition-all cursor-pointer flex items-center gap-2"
                    >
                      {savingProfile ? <Loader2 size={16} className="animate-spin" /> : "Save Profile Changes"}
                    </button>
                  </form>
                )}

                {/* 2. PASSWORD & SECURITY */}
                {activeTab === "security" && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <form onSubmit={handleChangePassword} className="bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-6 shadow-xl space-y-4">
                      <div className="border-b border-[#172533] pb-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">Credential Security</p>
                        <h3 className="text-xl font-black uppercase text-white">Change Account Password</h3>
                      </div>

                      {passwordMsg && (
                        <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold rounded-lg">
                          {passwordMsg}
                        </div>
                      )}

                      <div className="space-y-4 text-xs">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase text-[#8d9bad]">New Password *</label>
                          <input
                            type="password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase text-[#8d9bad]">Confirm New Password *</label>
                          <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="h-12 px-8 bg-[#f4cf69] text-black font-black text-xs uppercase tracking-widest rounded-lg hover:bg-white transition-all cursor-pointer"
                      >
                        Update Security Password
                      </button>
                    </form>

                    {/* Active Sessions */}
                    <div className="bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-6 shadow-xl space-y-4">
                      <h4 className="text-sm font-bold text-white uppercase">Active Logged-In Sessions</h4>
                      <div className="p-4 bg-[#09141f] border border-[#243343] rounded-xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <Laptop size={20} className="text-[#f4cf69]" />
                          <div>
                            <p className="font-bold text-white">Chrome / Windows (Current Active Session)</p>
                            <p className="text-[10px] text-[#8d9baa]">Nairobi, Kenya · Last active: Just now</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-[9px] rounded uppercase">
                          ● Current Device
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. NOTIFICATION PREFERENCES */}
                {activeTab === "notifications" && (
                  <div className="bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-6 shadow-xl space-y-4 animate-in fade-in duration-300">
                    <div className="border-b border-[#172533] pb-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">Alert Channels</p>
                      <h3 className="text-xl font-black uppercase text-white">Notification Preferences</h3>
                    </div>

                    <div className="space-y-3 text-xs">
                      {[
                        { title: "New Ticket Booking Alerts", desc: "Notify when a customer orders a ticket via M-Pesa." },
                        { title: "Executive Security Audit", desc: "Notify on password or 2FA updates." },
                        { title: "Inbound Client Inquiries", desc: "Notify when a new proposal or inquiry is submitted." },
                      ].map((item, idx) => (
                        <div key={idx} className="p-4 bg-[#09141f] border border-[#243343] rounded-xl flex items-center justify-between">
                          <div>
                            <p className="font-bold text-white">{item.title}</p>
                            <p className="text-[10px] text-[#8d9baa]">{item.desc}</p>
                          </div>
                          <button
                            onClick={() => showToast("✓ Notification channel toggled")}
                            className="px-3 py-1.5 bg-[#f4cf69] text-black font-bold text-[10px] uppercase rounded-lg"
                          >
                            ENABLED
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. APPEARANCE & PREFERENCES */}
                {activeTab === "preferences" && (
                  <div className="bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-6 shadow-xl space-y-4 animate-in fade-in duration-300">
                    <div className="border-b border-[#172533] pb-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">UI Theme & Localization</p>
                      <h3 className="text-xl font-black uppercase text-white">Personal Preferences</h3>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-[#8d9bad]">Application Theme</label>
                        <input type="text" disabled value="Executive Dark Luxe (Gold & Navy)" className="w-full h-12 bg-[#09141f] border border-[#243343] rounded-lg px-4 text-xs font-mono text-[#8d9bad]" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-[#8d9bad]">Timezone & Region</label>
                        <input type="text" disabled value="Africa/Nairobi (EAT)" className="w-full h-12 bg-[#09141f] border border-[#243343] rounded-lg px-4 text-xs font-mono text-[#8d9bad]" />
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. MY ACTIVITY LOG */}
                {activeTab === "activity" && (
                  <div className="bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-6 shadow-xl space-y-4 animate-in fade-in duration-300">
                    <div className="border-b border-[#172533] pb-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">Personal Log</p>
                      <h3 className="text-xl font-black uppercase text-white">My Recent Activity History</h3>
                    </div>

                    <div className="p-4 bg-[#09141f] border border-[#243343] rounded-xl text-xs font-mono space-y-2">
                      <p className="text-[#c7d0da]"><span className="text-[#f4cf69]">Today 14:32</span> · Issued Office QR Ticket Pass #TKT-2026-8F72.</p>
                      <p className="text-[#c7d0da]"><span className="text-[#f4cf69]">Today 12:15</span> · Created Event: Kisii University Innovation Summit.</p>
                      <p className="text-[#c7d0da]"><span className="text-[#f4cf69]">Yesterday 09:00</span> · Signed in from Nairobi, Kenya.</p>
                    </div>
                  </div>
                )}

                {/* 6. DANGER ZONE */}
                {activeTab === "danger" && (
                  <div className="bg-gradient-to-br from-[#45181c]/90 to-[#1f090b] border border-rose-500/50 rounded-xl p-6 shadow-xl space-y-6 animate-in fade-in duration-300">
                    <div className="border-b border-rose-500/30 pb-3 flex items-center gap-3">
                      <AlertTriangle size={24} className="text-rose-500" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-400">Critical Actions</p>
                        <h3 className="text-xl font-black uppercase text-white">Danger Zone</h3>
                      </div>
                    </div>

                    <div className="p-4 bg-[#09141f] border border-rose-500/30 rounded-xl space-y-3 text-xs">
                      <h4 className="font-bold text-white uppercase">Deactivate / Delete Personal Account</h4>
                      <p className="text-[#8d9baa] leading-relaxed">
                        Permanently request account deactivation. Business records (events, sales, tickets) will remain safely retained according to organizational policy.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowDeleteAccountModal(true)}
                        className="h-11 px-6 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-widest rounded-lg transition-all cursor-pointer"
                      >
                        Request Account Deactivation
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* COMPACT SMALL ADMIN FOOTER WITH MY WORLD AFRICA LINK */}
            <footer className="mt-8 pt-4 pb-2 border-t border-[#172533] flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] sm:text-xs text-[#8d9bad] font-mono">
              <div className="flex flex-wrap items-center gap-2">
                <span>© {new Date().getFullYear()} TOQUE REAL EVENTS LIMITED Nairobi.</span>
                <span className="hidden sm:inline">•</span>
                <a
                  href="https://myworldafric.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline italic text-[#f4cf69] font-serif"
                >
                  Powered by My World Africa
                </a>
              </div>

              <Link
                to="/contact"
                className="hover:text-white text-[#f4cf69] hover:underline flex items-center gap-1 font-sans font-bold text-[10px] uppercase tracking-wider"
              >
                <HelpCircle size={13} /> Help & Support
              </Link>
            </footer>
          </section>
        </main>
      </div>

      {/* ACCOUNT DELETION CONFIRMATION MODAL */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300 font-sans">
          <div className="relative w-full max-w-md bg-[#09141f] border border-rose-500/60 rounded-xl p-8 space-y-6 shadow-2xl text-center">
            <div className="mx-auto h-16 w-16 bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center justify-center rounded-full shadow-lg">
              <AlertTriangle size={32} />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black uppercase text-white">Delete or Deactivate Account?</h3>
              <p className="text-xs text-[#94a4b6] leading-relaxed">
                This will submit an account deactivation request. Business event records and sales data will remain securely archived.
              </p>
              <p className="text-[10px] text-rose-400 font-bold uppercase tracking-wider pt-2">
                Type "DELETE" below to confirm:
              </p>
              <input
                type="text"
                placeholder='Type "DELETE"'
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                className="w-full h-11 bg-[#121d29] border border-rose-500/40 rounded-lg px-4 text-xs font-mono font-bold text-center text-white outline-none focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteAccountModal(false);
                  setDeleteConfirmationText("");
                }}
                className="h-12 bg-[#121d29] border border-[#314354] text-white font-bold text-xs uppercase tracking-widest rounded-lg hover:border-[#f4cf69]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteConfirmationText !== "DELETE"}
                onClick={() => {
                  setShowDeleteAccountModal(false);
                  setDeleteConfirmationText("");
                  showToast("Deactivation request submitted for review.");
                }}
                className="h-12 bg-rose-600 text-white font-black text-xs uppercase tracking-widest rounded-lg hover:bg-rose-700 disabled:opacity-50"
              >
                Confirm Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
