import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardGuard } from "@/components/dashboard/DashboardGuard";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminClients, useAdminTeam, useAdminTickets } from "@/hooks/use-dashboard-data";
import { updateUserRole, updateProfile, deleteProfile, createProfile } from "@/lib/api/profiles";
import type { UserRole } from "@/lib/database.types";
import { createPageSeo } from "@/lib/seo";
import {
  Users as UsersIcon,
  ShieldCheck,
  UserCheck,
  Search,
  CheckCircle2,
  Trash2,
  UserPlus,
  Crown,
  Key,
  ChevronDown,
  Menu,
  Power,
  RefreshCw,
  Mail,
  Phone,
  Ticket,
  Lock,
  Building,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/users")({
  validateSearch: (search: Record<string, unknown>) => ({
    role: search.role as string | undefined,
  }),
  head: () =>
    createPageSeo({
      title: "Users Directory | Royal Touch Events Executive Admin",
      description: "Manage system user accounts, permissions, and roles.",
      path: "/admin/users",
      noindex: true,
    }),
  component: UsersAdminPage,
});

function UsersAdminPage() {
  return (
    <DashboardGuard requiredRole="admin">
      <AdminUsersDirectoryContent />
    </DashboardGuard>
  );
}

function AdminUsersDirectoryContent() {
  const searchParams = Route.useSearch();
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const emailLower = (user?.email || profile?.email || "").toLowerCase();
  const rawName = profile?.full_name || user?.user_metadata?.full_name || "";

  const adminInfo = (() => {
    if (emailLower === "eventsroyaltouch7@gmail.com" || (rawName && rawName.toLowerCase().includes("japheth"))) {
      return { fullName: "Japheth Owiyo", badge: "PROTECTED C.E.O" };
    }
    if (emailLower === "maishdan4940@gmail.com" || (rawName && (rawName.toLowerCase().includes("maishdan") || rawName.toLowerCase().includes("dan maish")))) {
      return { fullName: rawName || "Dan Maish", badge: "EXECUTIVE ADMIN" };
    }
    if (emailLower === "abigaelmuthoni29@gmail.com" || (rawName && rawName.toLowerCase().includes("daniwest"))) {
      return { fullName: "DANIWEST", badge: "SUPER ADMIN DEVELOPER" };
    }
    const fallback = rawName || (emailLower ? emailLower.split("@")[0].toUpperCase() : "ADMINISTRATOR");
    return { fullName: fallback, badge: "EXECUTIVE ADMIN" };
  })();

  const { data: profiles = [], isLoading: loadingProfiles, refetch: refetchProfiles } = useAdminClients();
  const { data: tickets = [] } = useAdminTickets();

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "CLIENTS" | "ADMINS">(
    searchParams.role === "admin" ? "ADMINS" : searchParams.role === "customer" ? "CLIENTS" : "ALL"
  );
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Modal States
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [editProfileUser, setEditProfileUser] = useState<any | null>(null);

  // Form Fields for Manual Provisioning
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("customer");
  const [newPhone, setNewPhone] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const isProtectedAdminAccount = (email?: string | null, fullName?: string | null) => {
    if (!email && !fullName) return false;
    const e = (email || "").toLowerCase();
    const n = (fullName || "").toLowerCase();
    return (
      e === "eventsroyaltouch7@gmail.com" ||
      e === "abigaelmuthoni29@gmail.com" ||
      e.includes("superadmin") ||
      n.includes("daniwest") ||
      n.includes("japheth")
    );
  };

  const getProtectedAdminBadge = (email?: string | null, fullName?: string | null) => {
    const e = (email || "").toLowerCase();
    const n = (fullName || "").toLowerCase();
    if (e === "eventsroyaltouch7@gmail.com" || n.includes("japheth")) {
      return { title: "PROTECTED C.E.O ♛ (IMMUTABLE)", label: "🔒 Protected C.E.O" };
    }
    if (e === "abigaelmuthoni29@gmail.com" || n.includes("daniwest")) {
      return { title: "SUPER ADMIN DEVELOPER ♛ (IMMUTABLE)", label: "🔒 Protected Developer" };
    }
    return { title: "EXECUTIVE ADMIN ♛ (IMMUTABLE)", label: "🔒 Protected Admin" };
  };

  const handleRoleChange = async (userId: string, targetEmail: string, targetName: string, newRoleVal: UserRole) => {
    if (isProtectedAdminAccount(targetEmail, targetName)) {
      showToast("❌ Protected Admin accounts are immutable.");
      return;
    }

    setUpdatingRoleId(userId);
    try {
      await updateUserRole(userId, newRoleVal);
      showToast(`✓ Role updated to ${newRoleVal === "admin" ? "EXECUTIVE ADMIN" : "REGISTERED CLIENT"}`);
      refetchProfiles();
    } catch {
      showToast("❌ Failed to update user role.");
    } finally {
      setUpdatingRoleId(null);
    }
  };

  const handleDeleteUser = async (userId: string, targetEmail: string, targetName: string) => {
    if (isProtectedAdminAccount(targetEmail, targetName)) {
      showToast("❌ Protected Admin accounts CANNOT BE DELETED!");
      return;
    }

    if (confirm(`Are you sure you want to delete profile for "${targetName || targetEmail}"?`)) {
      try {
        await deleteProfile(userId);
        showToast("✓ User account profile deleted successfully.");
        refetchProfiles();
      } catch {
        showToast("❌ Failed to delete user profile.");
      }
    }
  };

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) {
      showToast("❌ Please provide a valid email address.");
      return;
    }

    try {
      await createProfile({
        email: newEmail.trim().toLowerCase(),
        full_name: newName.trim() || "User",
        role: newRole,
        phone: newPhone.trim() || null,
      });
      showToast("✓ Account profile provisioned successfully.");
      setNewEmail("");
      setNewName("");
      setNewPhone("");
      setIsProvisionModalOpen(false);
      refetchProfiles();
    } catch {
      showToast("❌ Error provisioning user account.");
    }
  };

  const handleEditProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProfileUser) return;

    try {
      await updateProfile(editProfileUser.id, {
        full_name: editProfileUser.full_name,
        phone: editProfileUser.phone,
        city: editProfileUser.city,
        role: editProfileUser.role,
      });
      showToast("✓ User profile updated successfully.");
      setEditProfileUser(null);
      refetchProfiles();
    } catch {
      showToast("❌ Error updating user profile.");
    }
  };

  // Display exact live users from Supabase database without hardcoded fallbacks
  const allProfiles = [...profiles];

  if (profile && !allProfiles.some((p) => p.id === profile.id || (p.email && profile.email && p.email.toLowerCase() === profile.email.toLowerCase()))) {
    allProfiles.unshift(profile);
  }

  const clientProfiles = allProfiles.filter((p) => p.role === "customer" || p.role === "client" || !p.role);
  const adminUsers = allProfiles.filter((p) => p.role === "admin");
  const staffProfiles = allProfiles.filter((p) => p.role === "staff");
  const userInitials = profile?.full_name ? profile.full_name.split(" ").filter(Boolean).map((n) => n[0]).join("").toUpperCase() : "JO";

  // Filtered Users based on search query AND role filter
  const filteredUsers = allProfiles.filter((p) => {
    const e = p.email || "";
    const n = p.full_name || "";
    const r = p.role || "";
    const q = searchQuery || "";

    const matchesSearch =
      n.toLowerCase().includes(q.toLowerCase()) ||
      e.toLowerCase().includes(q.toLowerCase()) ||
      r.toLowerCase().includes(q.toLowerCase());

    if (roleFilter === "CLIENTS") {
      return matchesSearch && (p.role === "customer" || p.role === "client" || !p.role);
    }
    if (roleFilter === "STAFF") {
      return matchesSearch && p.role === "staff";
    }
    if (roleFilter === "ADMINS") {
      return matchesSearch && p.role === "admin";
    }
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#03070d] text-[#f4f7fb] flex flex-col font-sans selection:bg-[#f4cf69] selection:text-black">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-[220] bg-[#12212d] border-2 border-[#f4cf69] text-white text-xs font-mono px-5 py-3 shadow-2xl animate-in slide-in-from-top duration-200 flex items-center gap-3">
          <Sparkles className="text-[#f4cf69] shrink-0" size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* HEADER */}
      <header className="h-16 bg-[#081522] border-b border-[#182836] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}
            className="p-2 text-[#899cb0] hover:text-white hover:bg-[#12212d] transition-colors rounded-none"
            title="Toggle Menu"
          >
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-2">
            <UsersIcon size={20} className="text-[#f4cf69]" />
            <span className="font-black text-sm tracking-widest uppercase text-white font-mono">
              Registered Accounts & Clients
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetchProfiles()}
            className="px-3 py-1.5 bg-[#0f2132] border border-[#203548] text-[#899cb0] hover:text-white text-xs font-mono flex items-center gap-2 transition cursor-pointer"
            title="Refresh database profiles"
          >
            <RefreshCw size={12} className={loadingProfiles ? "animate-spin text-[#f4cf69]" : ""} />
            <span>Sync</span>
          </button>
          <div className="text-right hidden sm:block">
            <div className="text-xs font-black text-[#f4cf69] font-mono">{adminInfo.fullName}</div>
            <div className="text-[10px] text-[#20e39b] font-mono">{adminInfo.badge}</div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* KPI COUNTERS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            onClick={() => setRoleFilter("ALL")}
            className={cn(
              "p-5 bg-[#081522] border-2 rounded-none transition-all cursor-pointer group shadow-xl",
              roleFilter === "ALL" ? "border-[#f4cf69] bg-[#0c1e30]" : "border-[#182836] hover:border-[#385268]"
            )}
          >
            <div className="flex items-center justify-between text-[#899cb0] group-hover:text-white mb-2">
              <span className="text-[10px] font-black uppercase font-mono tracking-wider">All Registered Accounts</span>
              <UsersIcon size={18} className="text-[#f4cf69]" />
            </div>
            <p className="text-2xl font-black text-white font-mono group-hover:text-[#f4cf69] transition-colors">
              {allProfiles.length}
            </p>
          </div>

          <div
            onClick={() => setRoleFilter("CLIENTS")}
            className={cn(
              "p-5 bg-[#081522] border-2 rounded-none transition-all cursor-pointer group shadow-xl",
              roleFilter === "CLIENTS" ? "border-[#20e39b] bg-[#0c1e30]" : "border-[#182836] hover:border-[#385268]"
            )}
          >
            <div className="flex items-center justify-between text-[#899cb0] group-hover:text-white mb-2">
              <span className="text-[10px] font-black uppercase font-mono tracking-wider">Registered Clients</span>
              <UserCheck size={18} className="text-[#20e39b]" />
            </div>
            <p className="text-2xl font-black text-white font-mono group-hover:text-[#20e39b] transition-colors">
              {clientProfiles.length}
            </p>
          </div>

          <div
            onClick={() => setRoleFilter("ADMINS")}
            className={cn(
              "p-5 bg-[#081522] border-2 rounded-none transition-all cursor-pointer group shadow-xl",
              roleFilter === "ADMINS" ? "border-amber-400 bg-[#0c1e30]" : "border-[#182836] hover:border-[#385268]"
            )}
          >
            <div className="flex items-center justify-between text-[#899cb0] group-hover:text-white mb-2">
              <span className="text-[10px] font-black uppercase font-mono tracking-wider">Executive Admins</span>
              <Crown size={18} className="text-amber-400" />
            </div>
            <p className="text-2xl font-black text-white font-mono group-hover:text-amber-400 transition-colors">
              {adminUsers.length}
            </p>
          </div>

          <div className="p-5 bg-[#081522] border-2 border-[#182836] rounded-none shadow-xl flex items-center justify-between">
            <div>
              <div className="text-[10px] font-black text-[#899cb0] uppercase font-mono tracking-wider mb-1">
                Database Status
              </div>
              <div className="text-xs font-bold text-[#20e39b] font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#20e39b] animate-ping" />
                <span>Supabase Live</span>
              </div>
            </div>
            <button
              onClick={() => setIsProvisionModalOpen(true)}
              className="p-3 bg-[#f4cf69] hover:bg-[#d5a637] text-black font-black text-xs uppercase tracking-wider transition shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <UserPlus size={16} />
              <span className="hidden sm:inline">Add Account</span>
            </button>
          </div>
        </div>

        {/* SEARCH & CONTROLS BAR */}
        <div className="p-4 bg-[#081522] border border-[#182836] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#899cb0]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, email, or role..."
              className="w-full pl-9 pr-4 py-2 bg-[#0c1e30] border border-[#203548] text-xs font-mono text-white placeholder:text-[#5a6e82] focus:border-[#f4cf69] outline-none transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-[10px] font-mono text-[#899cb0] uppercase font-bold mr-1">Filter:</span>
            <button
              onClick={() => setRoleFilter("ALL")}
              className={cn(
                "px-3 py-1.5 text-xs font-mono font-bold uppercase transition border cursor-pointer",
                roleFilter === "ALL" ? "bg-[#f4cf69] text-black border-[#f4cf69]" : "bg-[#0c1e30] text-[#899cb0] border-[#203548] hover:text-white"
              )}
            >
              All ({allProfiles.length})
            </button>
            <button
              onClick={() => setRoleFilter("CLIENTS")}
              className={cn(
                "px-3 py-1.5 text-xs font-mono font-bold uppercase transition border cursor-pointer",
                roleFilter === "CLIENTS" ? "bg-[#20e39b] text-black border-[#20e39b]" : "bg-[#0c1e30] text-[#899cb0] border-[#203548] hover:text-white"
              )}
            >
              Clients ({clientProfiles.length})
            </button>
            <button
              onClick={() => setRoleFilter("ADMINS")}
              className={cn(
                "px-3 py-1.5 text-xs font-mono font-bold uppercase transition border cursor-pointer",
                roleFilter === "ADMINS" ? "bg-amber-400 text-black border-amber-400" : "bg-[#0c1e30] text-[#899cb0] border-[#203548] hover:text-white"
              )}
            >
              Admins ({adminUsers.length})
            </button>
          </div>
        </div>

        {/* PROFILES TABLE */}
        <div className="bg-[#081522] border border-[#182836] overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-[#182836] flex items-center justify-between">
            <span className="text-xs font-black font-mono uppercase tracking-wider text-[#f4cf69]">
              Database Registered Users ({filteredUsers.length})
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0c1e30] text-[#899cb0] uppercase font-bold text-[10px] tracking-wider border-b border-[#182836]">
                <tr>
                  <th className="p-3">User Profile</th>
                  <th className="p-3">Email Credentials</th>
                  <th className="p-3">Account Role</th>
                  <th className="p-3">Joined Date</th>
                  <th className="p-3 text-right">Holdings</th>
                  <th className="p-3 text-right">User Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#172530] text-[#dbe2e9]">
                {filteredUsers.map((client) => {
                  const clientEmail = client.email || "";
                  const clientName = client.full_name || "User";
                  const clientTickets = tickets.filter(
                    (t: any) => ((t.holder_email || t.email || "") as string).toLowerCase() === clientEmail.toLowerCase()
                  );
                  const isProtected = isProtectedAdminAccount(clientEmail, clientName);
                  const badgeInfo = getProtectedAdminBadge(clientEmail, clientName);
                  const isAdmin = client.role === "admin";
                  const isUpdating = updatingRoleId === client.id;

                  return (
                    <tr key={client.id} className="hover:bg-[#0d1823] transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#122332] border border-[#203548] flex items-center justify-center font-bold text-[#f4cf69] text-xs shrink-0">
                            {clientName ? clientName.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div>
                            <div className="font-bold text-white text-xs">{clientName}</div>
                            {isProtected && (
                              <span className="text-[9px] text-[#f4cf69] font-mono font-bold">{badgeInfo.label}</span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="text-xs text-white font-mono">{clientEmail}</div>
                        {client.phone && <div className="text-[10px] text-[#899cb0]">{client.phone}</div>}
                      </td>

                      <td className="p-3">
                        {isProtected ? (
                          <span className="px-2.5 py-1 bg-amber-400/10 border border-amber-400/40 text-amber-300 font-bold text-[10px] font-mono">
                            {badgeInfo.title}
                          </span>
                        ) : (
                          <select
                            value={client.role || "customer"}
                            disabled={isUpdating}
                            onChange={(e) =>
                              handleRoleChange(client.id, clientEmail, clientName, e.target.value as UserRole)
                            }
                            className="bg-[#0c1e30] border border-[#203548] text-[#20e39b] font-bold text-[11px] font-mono px-2 py-1 outline-none focus:border-[#f4cf69] cursor-pointer"
                          >
                            <option value="customer">REGISTERED CLIENT</option>
                            <option value="staff">ROYAL STAFF</option>
                            <option value="admin">EXECUTIVE ADMIN</option>
                          </select>
                        )}
                      </td>

                      <td className="p-3 text-[11px] text-[#899cb0] font-mono">
                        {client.created_at ? new Date(client.created_at).toLocaleDateString() : "Recent"}
                      </td>

                      <td className="p-3 text-right">
                        <span className="px-2 py-1 bg-[#122332] border border-[#203548] text-white text-[10px] font-mono font-bold">
                          {clientTickets.length} Pass(es)
                        </span>
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditProfileUser(client)}
                            className="px-2.5 py-1 bg-[#0c1e30] border border-[#203548] hover:border-[#f4cf69] text-white text-[10px] font-mono font-bold transition cursor-pointer"
                          >
                            Edit
                          </button>

                          {!isProtected && (
                            <button
                              onClick={() => handleDeleteUser(client.id, clientEmail, clientName)}
                              className="px-2 py-1 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 text-[10px] font-mono transition cursor-pointer"
                              title="Delete Profile"
                            >
                              <Trash2 size={12} />
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
        </div>
      </div>

      {/* PROVISION USER MODAL */}
      {isProvisionModalOpen && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#081522] border-2 border-[#f4cf69] p-6 sm:p-8 max-w-md w-full space-y-4 font-mono shadow-2xl">
            <h3 className="text-sm font-black uppercase text-white tracking-wider flex items-center gap-2">
              <UserPlus size={18} className="text-[#f4cf69]" />
              <span>Provision Database User Account</span>
            </h3>

            <form onSubmit={handleCreateUserSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#899cb0] mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="client@royaltouchevents.co.ke"
                  className="w-full bg-[#0c1e30] border border-[#203548] p-2.5 text-white outline-none focus:border-[#f4cf69]"
                />
              </div>

              <div>
                <label className="block text-[#899cb0] mb-1">Full Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full bg-[#0c1e30] border border-[#203548] p-2.5 text-white outline-none focus:border-[#f4cf69]"
                />
              </div>

              <div>
                <label className="block text-[#899cb0] mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+254 700 000 000"
                  className="w-full bg-[#0c1e30] border border-[#203548] p-2.5 text-white outline-none focus:border-[#f4cf69]"
                />
              </div>

              <div>
                <label className="block text-[#899cb0] mb-1">Account Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full bg-[#0c1e30] border border-[#203548] p-2.5 text-white outline-none focus:border-[#f4cf69]"
                >
                  <option value="customer">REGISTERED CLIENT</option>
                  <option value="staff">ROYAL STAFF</option>
                  <option value="admin">EXECUTIVE ADMIN</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProvisionModalOpen(false)}
                  className="px-4 py-2 border border-[#203548] text-[#899cb0] hover:text-white"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-[#f4cf69] text-black font-black uppercase">
                  Provision Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
