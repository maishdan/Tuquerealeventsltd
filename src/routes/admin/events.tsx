import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  useAdminEvents,
  useAdminTickets,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
  useIssueTicket,
  formatKes,
} from "@/hooks/use-dashboard-data";
import { useAuth } from "@/contexts/AuthContext";
import { createPageSeo } from "@/lib/seo";
import { uploadEventPoster } from "@/lib/api/events";
import {
  Search,
  ChevronDown,
  Power,
  Settings,
  Mail,
  HelpCircle,
  LogOut,
  User,
  Plus,
  Edit,
  Trash2,
  Ticket as TicketIcon,
  QrCode,
  CheckCircle2,
  Calendar,
  MapPin,
  Globe,
  Loader2,
  Sparkles,
  Wallet,
  Home,
  Flame,
  PlusCircle,
  ExternalLink,
  Layers,
  Bot,
  Crown,
  Image as ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { EventRecord } from "@/lib/database.types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TicketPassModal } from "@/components/dashboard/TicketPassModal";

export const Route = createFileRoute("/admin/events")({
  validateSearch: (search: Record<string, unknown>) => ({
    action: search.action as string | undefined,
  }),
  head: () =>
    createPageSeo({
      title: "Event Registry & AI Event Planner | Royal Touch Admin",
      description: "Manage Royal Touch events, ticket classes, VIP passes, and venue pricing.",
      path: "/admin/events",
      noindex: true,
    }),
  component: AdminEvents,
});

export function AdminEvents() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  // Database Hooks
  const { data: events = [], isLoading: isLoadingEvents } = useAdminEvents();
  const { data: tickets = [] } = useAdminTickets();

  // Mutations
  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useDeleteEvent();
  const issueTicketMutation = useIssueTicket();

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventRecord | null>(null);
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Form State
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState("Corporate Event");
  const [formVenue, setFormVenue] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formBudget, setFormBudget] = useState(500000);
  const [formPosterUrl, setFormPosterUrl] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

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

  const userInitials = profile?.full_name
    ? profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "JO";

  const openCreateModal = () => {
    setEditingEvent(null);
    setFormName("");
    setFormType("Corporate Event");
    setFormVenue("");
    setFormDate(new Date().toISOString().slice(0, 10));
    setFormBudget(500000);
    setFormPosterUrl("");
    setIsCreateModalOpen(true);
  };

  const openEditModal = (evt: EventRecord) => {
    setEditingEvent(evt);
    setFormName(evt.name);
    setFormType(evt.event_type);
    setFormVenue(evt.venue || "");
    setFormDate(evt.event_date || "");
    setFormBudget(evt.budget || 0);
    setFormPosterUrl(evt.poster_url && !evt.poster_url.startsWith("/back/") ? evt.poster_url : "");
    setIsCreateModalOpen(true);
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const publicUrl = await uploadEventPoster(file);
      setFormPosterUrl(publicUrl);
      showToast("✓ Custom Event Poster uploaded directly to Supabase Storage!");
    } catch (err: any) {
      showToast("Error uploading poster image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formVenue || !formDate) {
      showToast("Please fill in all required event details");
      return;
    }

    const payload = {
      name: formName,
      event_type: formType,
      venue: formVenue,
      event_date: formDate,
      budget: formBudget,
      poster_url: formPosterUrl || null,
      status: "upcoming" as const,
      lifecycle_state: "PUBLISHED" as const,
    };

    try {
      if (editingEvent) {
        await updateEventMutation.mutateAsync({ id: editingEvent.id, ...payload });
        showToast(`✓ Updated Event '${formName}'`);
      } else {
        await createEventMutation.mutateAsync(payload);
        showToast(`✓ Published New Event '${formName}' to Live Database!`);
      }
      setIsCreateModalOpen(false);
    } catch (err) {
      showToast("Error saving event to database");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete '${name}'?`)) {
      try {
        await deleteEventMutation.mutateAsync(id);
        showToast(`Deleted event '${name}'`);
      } catch (err) {
        showToast("Error deleting event");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#03070d] text-[#f4f7fb] font-sans selection:bg-[#e6b83f] selection:text-black antialiased">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[300] px-5 py-3 bg-[#142231] border border-[#3c4d5e] text-white text-xs font-bold shadow-2xl rounded-lg animate-in slide-in-from-bottom-4 duration-300">
          {toastMsg}
        </div>
      )}

      {/* App Shell Grid */}
      <div className={cn("min-h-screen grid transition-all duration-300", isMenuCollapsed ? "grid-cols-[60px_1fr] sm:grid-cols-[70px_1fr]" : "grid-cols-[60px_1fr] md:grid-cols-[212px_1fr]")}>
        {/* SIDEBAR */}
        <aside className="relative min-h-screen border-r border-[#202c39] bg-gradient-to-b from-[#02070d] via-[#050b12] to-[#02060b] flex flex-col z-50 sticky top-0 h-screen overflow-hidden">
          <div className="h-[95px] flex flex-col items-center justify-center border-b border-[#17212b] text-[#f4cf69] shrink-0 sticky top-0 bg-[#02070d] z-10">
            <Crown size={22} className="text-[#f4cf69]" />
            {!isMenuCollapsed && (
              <div className="hidden md:block">
                <div className="font-serif tracking-[2px] text-xs mt-1 font-bold text-center">TOQUE REAL</div>
                <div className="font-serif tracking-[3px] text-[9px] opacity-80 mt-0.5 text-center">EVENTS LIMITED</div>
              </div>
            )}
          </div>

          <nav className="p-3 space-y-1 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-[#243343] scrollbar-track-[#07101a]">
            {[
              { to: "/admin", label: "Dashboard", icon: Home },
              { to: "/admin/users", label: "Clients", icon: Users },
              { to: "/admin/prospects", label: "Prospects", icon: Sparkles },
              { to: "/admin/customers", label: "Customers", icon: Users },
              { to: "/admin/events", label: "Events", icon: Calendar, active: true },
              { to: "/admin/bookings", label: "Sales & CRM", icon: FileText },
              { to: "/admin/proposals", label: "Proposals", icon: FileText },
              { to: "/admin/payments", label: "Payments", icon: TrendingUp },
              { to: "/admin/finance", label: "Finance", icon: TrendingUp },
              { to: "/admin/ai", label: "AI & Insights", icon: Sparkles },
              { to: "/admin/admin-booking", label: "Booking", icon: Calendar },
              { to: "/admin/contacts", label: "Notifications", icon: Bell },
              { to: "/admin/contacts", label: "Messages", icon: Mail },
              { to: "/admin/team", label: "Team", icon: Users },
              { to: "/admin/marketing", label: "Marketing", icon: Zap },
              { to: "/admin/reports", label: "Reports", icon: FileText },
              { to: "/admin/settings", label: "Settings", icon: Settings },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 h-[42px] px-3 rounded-lg text-xs font-medium transition-all cursor-pointer my-1 justify-center md:justify-start",
                    item.active
                      ? "bg-gradient-to-r from-[#a9741b] via-[#d5a637] to-[#896019] text-white shadow-lg shadow-[#b48224]/20 font-bold"
                      : "text-[#c7d0da] hover:bg-[#111b27] hover:text-white"
                  )}
                >
                  <Icon size={16} className={cn("shrink-0", item.active ? "text-white" : "text-[#f1c35a]")} />
                  {!isMenuCollapsed && <span className="hidden md:inline">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* MAIN PAGE CONTAINER */}
        <div className="flex flex-col min-w-0 bg-[#03070d]">
          {/* HEADER BAR */}
          <header className="h-[95px] border-b border-[#202c39] bg-gradient-to-r from-[#03070d] via-[#08121a] to-[#03070d] px-6 lg:px-10 flex items-center justify-between z-40 sticky top-0 shadow-xl">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}
                className="p-2 rounded-lg bg-[#0e1722] border border-[#202e3c] text-[#f4cf69] hover:bg-[#162534] transition-all cursor-pointer"
              >
                <span className="text-sm">☰</span>
              </button>

              <div>
                <h1 className="text-lg lg:text-xl font-bold tracking-wide text-white uppercase font-serif">
                  Event Registry & Production Hub
                </h1>
                <p className="text-xs text-[#899cb0] font-medium hidden sm:block">
                  TOQUE REAL EVENTS LIMITED — Official Event Management
                </p>
              </div>
            </div>

            <button
              onClick={openCreateModal}
              className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#d5a637] to-[#f4cf69] text-black font-black text-xs uppercase tracking-wider hover:scale-105 transition-all cursor-pointer flex items-center gap-2 shadow-lg"
            >
              <Plus size={16} /> + Plan & Publish Event
            </button>
          </header>

          {/* MAIN CONTENT AREA */}
          <main className="p-6 lg:p-8 space-y-6 max-w-[1700px] w-full mx-auto">
            {/* LIVE EVENTS GRID */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="text-[#f4cf69]" /> Live Event Catalog ({events.length})
                </h3>
              </div>

              {events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((evt) => {
                    const hasCustomPoster = evt.poster_url && !evt.poster_url.startsWith("/back/") && evt.poster_url !== "/placeholder-event.png";

                    return (
                      <div
                        key={evt.id}
                        className="bg-[#081522] border border-[#203348] hover:border-[#f4cf69] rounded-xl overflow-hidden shadow-xl transition-all group space-y-3"
                      >
                        {/* Event Poster / "EVENT IMAGE COMING SOON" Badge */}
                        <div className="relative h-48 w-full bg-[#0d1c2a] flex items-center justify-center border-b border-[#1c3044] overflow-hidden">
                          {hasCustomPoster ? (
                            <img src={evt.poster_url!} alt={evt.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="flex flex-col items-center justify-center p-6 text-center space-y-2">
                              <div className="h-12 w-12 rounded-full bg-[#142637] border border-[#f4cf69]/40 flex items-center justify-center text-[#f4cf69]">
                                <ImageIcon size={22} />
                              </div>
                              <span className="text-xs font-black uppercase tracking-widest text-[#f4cf69] bg-[#07131e] px-3 py-1 rounded border border-[#f4cf69]/40 shadow-inner">
                                Event Image Coming Soon
                              </span>
                            </div>
                          )}

                          <span className="absolute top-3 right-3 px-2.5 py-1 bg-black/80 backdrop-blur-md text-[#f4cf69] text-[10px] font-black uppercase rounded border border-[#f4cf69]/40 font-mono">
                            {evt.event_type}
                          </span>
                        </div>

                        {/* Event Content Details */}
                        <div className="p-5 space-y-3">
                          <h4 className="text-base font-black text-white group-hover:text-[#f4cf69] transition-colors leading-snug">
                            {evt.name}
                          </h4>

                          <div className="space-y-1.5 text-xs text-[#899cb0] font-sans">
                            <div className="flex items-center gap-1.5">
                              <MapPin size={14} className="text-[#f4cf69] shrink-0" />
                              <span className="truncate">{evt.venue || "Nairobi Venue"}</span>
                            </div>
                            <div className="flex items-center gap-1.5 font-mono text-emerald-400">
                              <Calendar size={14} className="shrink-0" />
                              <span>{evt.event_date || "Upcoming Date"}</span>
                            </div>
                          </div>

                          <div className="p-3 bg-[#0c1a28] border border-[#1b2f40] rounded-xl text-xs font-mono flex items-center justify-between text-[#a0b2c6]">
                            <span>Budget Allocation:</span>
                            <span className="text-[#f4cf69] font-bold">{formatKes(evt.budget || 0)}</span>
                          </div>

                          {/* Action Buttons */}
                          <div className="pt-2 border-t border-[#1d3043] flex items-center justify-between gap-2">
                            <button
                              onClick={() => openEditModal(evt)}
                              className="px-3 py-1.5 rounded-lg bg-[#142637] border border-[#f4cf69]/50 text-[#f4cf69] text-xs font-bold uppercase hover:bg-[#1f354c] transition-all cursor-pointer flex items-center gap-1"
                            >
                              <Edit size={13} /> Edit Event
                            </button>

                            <button
                              onClick={() => handleDelete(evt.id, evt.name)}
                              className="px-3 py-1.5 rounded-lg bg-rose-950/60 border border-rose-500/50 text-rose-400 text-xs font-bold uppercase hover:bg-rose-600 hover:text-white transition-all cursor-pointer flex items-center gap-1"
                            >
                              <Trash2 size={13} /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-12 bg-[#081522] border border-[#203348] rounded-xl text-center space-y-4">
                  <div className="mx-auto h-16 w-16 rounded-full bg-[#0d1c2a] border border-[#f4cf69]/40 flex items-center justify-center text-[#f4cf69]">
                    <Calendar size={32} />
                  </div>
                  <h4 className="text-lg font-black text-white uppercase tracking-wider">No Live Events Published</h4>
                  <p className="text-xs text-[#899cb0] max-w-md mx-auto">
                    The database event catalog is clean and ready for real operational data. Click below to publish your first event!
                  </p>
                  <button
                    onClick={openCreateModal}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d5a637] to-[#f4cf69] text-black font-black text-xs uppercase tracking-wider hover:scale-105 transition-all cursor-pointer shadow-xl inline-flex items-center gap-2"
                  >
                    <Plus size={16} /> + Plan & Publish First Event
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* CREATE / EDIT EVENT MODAL (CLOSES ON BACKDROP CLICK & FITS ALL SCREENS) */}
      {isCreateModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsCreateModalOpen(false);
            }
          }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 font-sans animate-in fade-in duration-200 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#081522] border-2 border-[#f4cf69] p-4 sm:p-6 lg:p-8 rounded-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl space-y-5 text-white cursor-default scrollbar-thin scrollbar-thumb-[#243343]"
          >
            <div className="flex justify-between items-center border-b border-[#1d3043] pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-[#f4cf69] tracking-wider">TOQUE REAL Production Hub</span>
                <h3 className="text-base sm:text-lg font-black uppercase text-white">{editingEvent ? `Edit Event: ${editingEvent.name}` : "Plan & Publish Event"}</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="h-8 w-8 rounded-lg bg-[#142637] text-[#9caec2] hover:text-white flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-bold text-[#899cb0] uppercase tracking-wider mb-1.5">Event Name / Title *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Annual Leadership Gala 2026"
                  className="w-full h-11 px-3.5 bg-[#0c1a28] border border-[#203548] rounded-xl text-white focus:border-[#f4cf69] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#899cb0] uppercase tracking-wider mb-1.5">Event Category *</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full h-11 px-3.5 bg-[#0c1a28] border border-[#203548] rounded-xl text-white focus:border-[#f4cf69] focus:outline-none"
                  >
                    <option value="Corporate Event">Corporate Conference & Summit</option>
                    <option value="Luxury Wedding">Luxury Wedding & Gala</option>
                    <option value="Birthday Party">Birthday Party & Celebration</option>
                    <option value="Exhibition & Expo">Exhibition & Trade Fair</option>
                    <option value="Concert & Live Show">Concert & Musical Festival</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#899cb0] uppercase tracking-wider mb-1.5">Venue Location *</label>
                  <input
                    type="text"
                    required
                    value={formVenue}
                    onChange={(e) => setFormVenue(e.target.value)}
                    placeholder="e.g. Villa Rosa Kempinski, Nairobi"
                    className="w-full h-11 px-3.5 bg-[#0c1a28] border border-[#203548] rounded-xl text-white focus:border-[#f4cf69] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#899cb0] uppercase tracking-wider mb-1.5">Event Date *</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full h-11 px-3.5 bg-[#0c1a28] border border-[#203548] rounded-xl text-white focus:border-[#f4cf69] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#899cb0] uppercase tracking-wider mb-1.5">Production Budget (KES) *</label>
                  <input
                    type="number"
                    value={formBudget}
                    onChange={(e) => setFormBudget(Number(e.target.value))}
                    className="w-full h-11 px-3.5 bg-[#0c1a28] border border-[#203548] rounded-xl text-white focus:border-[#f4cf69] focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* CUSTOM FILE UPLOAD TO SUPABASE BUCKET (NO PRESETS AT ALL) */}
              <div className="p-4 bg-[#0d1c2b] border border-[#1f3246] rounded-xl space-y-3">
                <label className="block font-bold text-[#f4cf69] uppercase tracking-wider text-[11px]">
                  Custom Event Poster Upload (Supabase Storage)
                </label>

                {formPosterUrl ? (
                  <div className="relative h-40 w-full rounded-xl overflow-hidden border border-[#f4cf69] shadow-lg">
                    <img src={formPosterUrl} alt="Event Poster" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormPosterUrl("")}
                      className="absolute top-2 right-2 px-2 py-1 bg-rose-600 text-white text-[10px] font-bold rounded uppercase shadow cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="p-6 border-2 border-dashed border-[#203548] rounded-xl text-center space-y-2">
                    <ImageIcon size={28} className="mx-auto text-[#f4cf69]" />
                    <p className="text-xs text-[#899cb0]">Upload custom poster file or leave empty for "Event Image Coming Soon"</p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="block font-bold text-[#899cb0] uppercase text-[10px] mb-1">Upload File:</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      disabled={isUploadingImage}
                      className="w-full text-xs text-[#a0b2c6] file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-gradient-to-r file:from-[#d5a637] file:to-[#f4cf69] file:text-black hover:file:opacity-90 cursor-pointer"
                    />
                  </div>

                  <div>
                    <span className="block font-bold text-[#899cb0] uppercase text-[10px] mb-1">Or Image URL:</span>
                    <input
                      type="text"
                      value={formPosterUrl}
                      onChange={(e) => setFormPosterUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full h-10 px-3 bg-[#0c1a28] border border-[#203548] rounded-xl text-xs text-white focus:border-[#f4cf69] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#142637] text-[#899cb0] text-xs font-bold uppercase hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingImage}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d5a637] to-[#f4cf69] text-black font-black text-xs uppercase tracking-wider hover:scale-105 transition-all cursor-pointer shadow-xl disabled:opacity-50"
                >
                  {isUploadingImage ? "Uploading Image..." : editingEvent ? "Save Changes" : "Publish Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
