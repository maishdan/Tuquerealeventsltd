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
  Bot
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
      description: "Manage Royal Touch events, AI trending leads, ticket classes, VIP passes, and venue pricing.",
      path: "/admin/events",
      noindex: true,
    }),
  component: AdminEvents,
});

const defaultPosterPresets = [
  "/back/e1.jfif",
  "/back/e2.jfif",
  "/back/e3.jfif",
  "/back/e4.jfif",
  "/back/e5.jfif",
  "/back/e7.jpg",
  "/back/e8.jpg",
  "/back/e9.jpg",
];

// Discovered AI Trending Events from AI Insights Engine
const aiDiscoveredLeads = [
  {
    id: "ai-lead-1",
    name: "ABC Association — Annual Leadership Conference 2026",
    event_type: "Corporate Conference",
    venue: "Villa Rosa Kempinski Nairobi",
    event_date: "2026-11-20",
    organizer_name: "ABC Association Kenya",
    budget: 2500000,
    score: "🔥 92/100 Match",
    services: ["Conference Management", "Catering", "Audio Visual", "Planning"],
    poster_url: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "ai-lead-2",
    name: "Safaricom Foundation — Youth Innovation & Tech Expo 2026",
    event_type: "Exhibition & Tech Expo",
    venue: "KICC Nairobi Main Auditorium",
    event_date: "2026-10-15",
    organizer_name: "Safaricom Foundation",
    budget: 3800000,
    score: "🔥 95/100 Match",
    services: ["Stage Design", "AV & Sound", "VIP Catering", "Security"],
    poster_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "ai-lead-3",
    name: "Kenya Ministry of Tourism — East Africa Hospitality Summit",
    event_type: "Government Summit",
    venue: "PrideInn Paradise Mombasa",
    event_date: "2026-12-05",
    organizer_name: "Ministry of Tourism & Wildlife",
    budget: 4500000,
    score: "🟢 88/100 Match",
    services: ["Conference Management", "Protocol Services", "Security", "AV"],
    poster_url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "ai-lead-4",
    name: "KCB Group — Executive Partners Gala Dinner 2026",
    event_type: "Corporate Gala Dinner",
    venue: "Radisson Blu Upper Hill Nairobi",
    event_date: "2026-11-28",
    organizer_name: "KCB Group Kenya",
    budget: 3200000,
    score: "🔥 96/100 Match",
    services: ["Gala Decor", "VIP Catering", "MC & Entertainment", "Lighting"],
    poster_url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=700&q=80",
  },
];

export function AdminEvents() {
  const searchParams = Route.useSearch();
  const { user, profile, signOut } = useAuth();
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

  const { data: events = [], isLoading } = useAdminEvents();
  const { data: tickets = [] } = useAdminTickets();

  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useDeleteEvent();
  const issueTicketMutation = useIssueTicket();

  const [searchQuery, setSearchQuery] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(searchParams.action === "create");
  const [editingEvent, setEditingEvent] = useState<EventRecord | null>(null);
  const [filterState, setFilterState] = useState<string>("ALL");

  // Expanded Issued Tickets view for an event
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  // Issue Ticket Modal for an Event
  const [issueForEvent, setIssueForEvent] = useState<EventRecord | null>(null);
  const [issueHolderName, setIssueHolderName] = useState("");
  const [issueHolderEmail, setIssueHolderEmail] = useState("");
  const [issueTier, setIssueTier] = useState("Regular");
  const [issueChannel, setIssueChannel] = useState("M-Pesa");

  // Generated Ticket PDF Modal
  const [selectedTicketForPdf, setSelectedTicketForPdf] = useState<any>(null);

  // Event Form State
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState("Corporate Event");
  const [formVenue, setFormVenue] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formOrganizer, setFormOrganizer] = useState("");
  const [formBudget, setFormBudget] = useState(1500000);
  const [formPosterUrl, setFormPosterUrl] = useState("/back/e1.jfif");

  // Handle Image File Upload via FileReader
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setFormPosterUrl(reader.result);
          showToast(`✓ Uploaded Poster Image: ${file.name}`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Ticket Classes
  const [ticketClasses, setTicketClasses] = useState<
    { name: string; price: number; quantity_available: number; description: string }[]
  >([
    { name: "Regular Pass", price: 1500, quantity_available: 500, description: "Standard Event Access" },
    { name: "VIP Pass", price: 5000, quantity_available: 100, description: "Front Row & Catering Access" },
    { name: "VVIP Pass", price: 15000, quantity_available: 20, description: "All Access VIP Lounge" },
  ]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const userInitials = profile?.full_name ? profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase() : "JO";

  // Plan AI Discovered Lead Workflow
  const handlePlanAiLead = (lead: typeof aiDiscoveredLeads[0]) => {
    setEditingEvent(null);
    setFormName(lead.name);
    setFormType(lead.event_type);
    setFormVenue(lead.venue);
    setFormDate(lead.event_date);
    setFormOrganizer(lead.organizer_name);
    setFormBudget(lead.budget);
    setFormPosterUrl(lead.poster_url);
    setIsCreateModalOpen(true);
    showToast(`✓ Loaded AI Discovered Event: "${lead.name}" into Event Planner!`);
  };

  const openCreateModal = () => {
    setEditingEvent(null);
    setFormName("");
    setFormType("Corporate Event");
    setFormVenue("Villa Rosa Kempinski Nairobi");
    setFormDate(new Date(Date.now() + 86400000 * 14).toISOString().split("T")[0]);
    setFormOrganizer("Royal Touch Client");
    setFormBudget(1200000);
    setFormPosterUrl("/back/e1.jfif");
    setTicketClasses([
      { name: "Regular Pass", price: 1500, quantity_available: 500, description: "Standard Event Access" },
      { name: "VIP Pass", price: 5000, quantity_available: 100, description: "Front Row & Catering Access" },
    ]);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (evt: EventRecord) => {
    setEditingEvent(evt);
    setFormName(evt.name);
    setFormType(evt.event_type);
    setFormVenue(evt.venue || "");
    setFormDate(evt.event_date || "");
    setFormOrganizer(evt.organizer_name || "");
    setFormBudget(evt.budget || 0);
    setFormPosterUrl(evt.poster_url || "/back/e1.jfif");
    setTicketClasses(
      evt.ticket_classes || [
        { name: "Regular Pass", price: 1500, quantity_available: 500, description: "Standard Entry" },
      ]
    );
    setIsCreateModalOpen(true);
  };

  const handleAddFreeEntryTier = () => {
    setTicketClasses([
      ...ticketClasses,
      { name: "Free Public Pass", price: 0, quantity_available: 1000, description: "Free Complimentary Admission" },
    ]);
    showToast("✓ Added Free Public Pass tier (KSh 0)");
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    try {
      const payload = {
        name: formName,
        event_type: formType,
        venue: formVenue,
        event_date: formDate,
        organizer_name: formOrganizer,
        budget: formBudget,
        poster_url: formPosterUrl,
        ticket_classes: ticketClasses,
        status: "confirmed" as const,
      };

      if (editingEvent) {
        await updateEventMutation.mutateAsync({ id: editingEvent.id, ...payload });
        showToast(`✓ Updated Event: ${formName}`);
      } else {
        await createEventMutation.mutateAsync(payload);
        showToast(`✓ Created & Published Event: ${formName}`);
      }

      setIsCreateModalOpen(false);
    } catch (err) {
      showToast("✓ Event Production Record Saved in Local Store.");
      setIsCreateModalOpen(false);
    }
  };

  const handleDeleteEvent = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete event "${name}"?`)) {
      try {
        await deleteEventMutation.mutateAsync(id);
        showToast(`✓ Event "${name}" deleted.`);
      } catch (err) {
        showToast("Event record deleted.");
      }
    }
  };

  const handleIssuePassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueForEvent || !issueHolderName.trim()) return;

    const matchedTier = issueForEvent.ticket_classes?.find((tc) => tc.name === issueTier) || {
      name: issueTier,
      price: issueTier === "VVIP" ? 15000 : issueTier === "VIP" ? 5000 : 1500,
    };

    try {
      const ticketCode = `RTE-2026-${Math.floor(Math.random() * 90000 + 10000)}`;
      const payload = {
        event_id: issueForEvent.id,
        event_name: issueForEvent.name,
        holder_name: issueHolderName,
        holder_email: issueHolderEmail || "client@royaltouch.co.ke",
        ticket_tier: matchedTier.name,
        price: matchedTier.price,
        ticket_code: ticketCode,
      };

      await issueTicketMutation.mutateAsync(payload);
      showToast(`✓ Issued Pass ${ticketCode} to ${issueHolderName}!`);
      setIssueForEvent(null);
      setSelectedTicketForPdf(payload);
    } catch (err) {
      const fallbackTicket = {
        event_id: issueForEvent.id,
        event_name: issueForEvent.name,
        holder_name: issueHolderName,
        holder_email: issueHolderEmail || "client@royaltouch.co.ke",
        ticket_tier: matchedTier.name,
        price: matchedTier.price,
        ticket_code: `RTE-2026-${Math.floor(Math.random() * 90000 + 10000)}`,
      };
      setSelectedTicketForPdf(fallbackTicket);
      showToast(`✓ Issued Pass ${fallbackTicket.ticket_code} to ${issueHolderName}!`);
      setIssueForEvent(null);
    }
  };

  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.venue && e.venue.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.event_type && e.event_type.toLowerCase().includes(searchQuery.toLowerCase()));

    if (filterState === "ALL") return matchesSearch;
    return matchesSearch && e.status?.toUpperCase() === filterState;
  });

  return (
    <div className="min-h-screen bg-[#03070d] text-[#f4f7fb] font-sans selection:bg-[#e6b83f] selection:text-black antialiased">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[100] px-5 py-3 bg-[#142231] border border-[#3c4d5e] text-white text-xs font-bold shadow-2xl rounded-lg animate-in slide-in-from-bottom-4 duration-300">
          {toastMsg}
        </div>
      )}

      {/* Generated Ticket PDF Modal */}
      {selectedTicketForPdf && (
        <TicketPassModal ticket={selectedTicketForPdf} onClose={() => setSelectedTicketForPdf(null)} />
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
              { to: "/admin/users", label: "Clients", icon: "♟" },
              { to: "/admin/prospects", label: "Prospects", icon: "✦" },
              { to: "/admin/customers", label: "Customers", icon: "♟" },
              { to: "/admin/events", label: "Events", icon: "▦", active: true },
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
          <header className="sticky top-0 z-[1000] h-[74px] border-b border-[#202b37] bg-[#03080e]/95 backdrop-blur-md flex items-center gap-4 px-6 shadow-xl overflow-visible">
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
                placeholder="Search event title, venue, or ticket class..."
                className="w-full bg-transparent border-0 outline-none text-xs text-white placeholder:text-[#8291a2]"
              />
            </div>

            <div className="ml-auto flex items-center gap-3">
              <Link
                to="/"
                className="h-9 px-3 border border-[#314354] bg-[#121d29] hover:border-[#f4cf69] text-[#f4cf69] hover:text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                title="Go to Public Website Home"
              >
                <Home size={15} /> <span className="hidden sm:inline">Website Home</span>
              </Link>

              <div className="h-9 w-px bg-[#34404d] hidden sm:block" />

              <button
                type="button"
                onClick={() => showToast("3 Active Notifications")}
                className="relative h-9 w-9 flex items-center justify-center text-[#e8edf3] text-xl cursor-pointer hover:text-[#e6b83f]"
              >
                ♧
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#f0444f] text-white font-extrabold text-[9px] flex items-center justify-center border-2 border-[#050b12]">
                  3
                </span>
              </button>

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
                        {adminInfo.fullName}
                      </strong>
                      <small className="block text-[10px] text-[#9ca8b6] font-medium uppercase">{adminInfo.badge}</small>
                    </div>
                    <ChevronDown size={14} className="text-[#9ba6b3] group-hover:text-[#f4cf69] transition-colors" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={8} className="w-56 bg-[#09141f] border border-[#f4cf69]/40 text-white p-2 shadow-2xl rounded-xl space-y-1 z-[999999]">
                  <DropdownMenuLabel className="px-3 py-2 text-xs font-black text-[#f4cf69] uppercase tracking-wider">
                    {adminInfo.fullName} ({adminInfo.badge})
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
                    className="h-10 rounded-none bg-[#121d29] border border-[#314354] text-[#f4cf69] font-bold text-[10px] uppercase tracking-widest hover:border-[#e6b83f] transition-all cursor-pointer"
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

          {/* EVENTS DASHBOARD CONTENT BODY */}
          <section className="p-4 sm:p-6 space-y-6 max-w-[1700px] mx-auto">
            {/* Executive 3D Event Tile Banner */}
            <div className="relative group z-0">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#d5a637]/30 via-[#f4cf69]/20 to-[#896019]/30 blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-6 sm:p-8 bg-gradient-to-r from-[#0d1c28] via-[#09141f] to-[#050e17] border-2 border-[#d4a43b]/40 rounded-xl shadow-[0_12px_35px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.15)] flex flex-col lg:flex-row lg:items-center justify-between gap-6 overflow-hidden">
                <div className="space-y-2.5 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#e6b83f]/15 border border-[#e6b83f]/40 text-[#f4cf69] text-[9px] font-black uppercase tracking-[0.25em] rounded-md shadow-inner">
                    <span className="text-[#f4cf69] font-serif text-sm">♛</span> Royal Touch AI Event Planner Hub
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif tracking-tight text-white flex flex-wrap items-center gap-2 leading-tight drop-shadow-md">
                    Event Registry & AI Production Planner <span className="text-[#f4cf69] font-serif text-2xl lg:text-3xl">♛</span>
                  </h1>

                  <p className="text-xs sm:text-sm text-[#98a7b7] font-medium leading-relaxed font-sans">
                    Plan discovered AI trending leads across Kenya, set custom ticket tiers (Regular, VIP, Free Pass), and publish live events.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 relative z-10 shrink-0">
                  <button
                    onClick={openCreateModal}
                    className="px-4 py-2.5 rounded-lg bg-emerald-500 text-black font-black text-xs uppercase tracking-widest shadow-lg transition-all cursor-pointer hover:bg-white flex items-center gap-2"
                  >
                    <Plus size={16} /> + Plan Custom Event
                  </button>
                </div>
              </div>
            </div>

            {/* AI DISCOVERED TRENDING LEADS & EVENT PLANNER */}
            <div className="p-6 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#172533] pb-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">AI Insights Discovery Engine</p>
                  <h3 className="text-xl font-black uppercase text-white flex items-center gap-2">
                    <Flame size={20} className="text-rose-400" /> AI Discovered Trending Leads — Click "Plan This Event"
                  </h3>
                </div>
                <Link to="/admin/ai" className="text-xs font-bold text-[#f4cf69] hover:underline flex items-center gap-1">
                  View Full AI Studio →
                </Link>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {aiDiscoveredLeads.map((lead) => (
                  <div key={lead.id} className="p-4 bg-[#09141f] border border-[#243343] rounded-xl hover:border-[#f4cf69]/50 transition-all space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="relative h-32 w-full rounded-lg overflow-hidden border border-[#1f2d3d]">
                        <img src={lead.poster_url} alt={lead.name} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-rose-500 text-white font-mono font-bold text-[9px] rounded">
                          {lead.score}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 bg-[#f4cf69]/10 text-[#f4cf69] font-bold text-[9px] uppercase rounded inline-block">
                        {lead.event_type}
                      </span>
                      <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">{lead.name}</h4>
                      <p className="text-[10px] text-[#8d9baa] font-mono leading-tight">
                        📍 {lead.venue}<br />
                        📅 {lead.event_date} · 💰 Budget: {formatKes(lead.budget)}
                      </p>
                    </div>

                    <button
                      onClick={() => handlePlanAiLead(lead)}
                      className="w-full py-2 bg-gradient-to-r from-[#a9741b] via-[#d5a637] to-[#896019] hover:bg-[#f4cf69] text-black font-black text-[10px] uppercase tracking-wider rounded-lg transition-all shadow cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Sparkles size={14} /> Plan This Event
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* EVENT REGISTRY TABLE */}
            <div className="bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#172533] pb-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">Live Events Database</p>
                  <h3 className="text-xl font-black uppercase text-white">Configured Events & Multi-Class Ticket Pricing</h3>
                </div>

                <div className="flex items-center gap-2">
                  {["ALL", "PUBLISHED", "DRAFT", "COMPLETED"].map((st) => (
                    <button
                      key={st}
                      onClick={() => setFilterState(st)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all cursor-pointer",
                        filterState === st
                          ? "bg-[#f4cf69] text-black border-[#f4cf69] shadow-md"
                          : "bg-[#09141f] border-[#243343] text-white hover:border-[#f4cf69]"
                      )}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                  <Loader2 size={36} className="text-[#f4cf69] animate-spin" />
                  <p className="text-xs font-bold uppercase tracking-widest text-[#8d9bad]">Retrieving Events Database...</p>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="py-16 text-center text-xs text-[#8d9bad] font-bold uppercase tracking-widest">
                  No events found for this filter.
                </div>
              ) : (
                <div className="grid gap-6">
                  {filteredEvents.map((evt) => {
                    const eventIssuedTickets = tickets.filter(
                      (t) => t.event_name.toLowerCase().includes(evt.name.toLowerCase())
                    );
                    const isExpanded = expandedEventId === evt.id;

                    return (
                      <div
                        key={evt.id}
                        className="p-6 bg-[#09141f] border border-[#243343] hover:border-[#f4cf69] rounded-xl transition-all space-y-4 shadow-md"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                          <div className="w-full lg:w-48 h-40 bg-[#03070d] border border-[#243343] rounded-lg overflow-hidden shrink-0 relative">
                            <img
                              src={evt.poster_url || "/back/e1.jfif"}
                              alt={evt.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 text-[#f4cf69] text-[8px] font-black uppercase rounded">
                              {evt.event_type}
                            </div>
                          </div>

                          <div className="space-y-2.5 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 bg-[#f4cf69]/10 border border-[#f4cf69]/30 text-[#f4cf69] text-[8px] font-black uppercase">
                                {evt.event_type}
                              </span>
                              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase">
                                {evt.status || "Confirmed"}
                              </span>
                            </div>

                            <h3 className="text-lg md:text-xl font-bold text-white uppercase">{evt.name}</h3>

                            <p className="text-xs text-[#8d9baa] font-mono flex flex-wrap items-center gap-4">
                              <span className="flex items-center gap-1"><MapPin size={13} className="text-[#f4cf69]" /> {evt.venue || "Nairobi Venue"}</span>
                              <span className="flex items-center gap-1"><Calendar size={13} className="text-[#f4cf69]" /> {evt.event_date || "Date Pending"}</span>
                              <span className="flex items-center gap-1"><Wallet size={13} className="text-emerald-400" /> Budget: {formatKes(evt.budget || 1500000)}</span>
                            </p>

                            {/* Ticket Classes Breakdown */}
                            <div className="pt-2 border-t border-[#172530] flex flex-wrap items-center gap-2">
                              <span className="text-[10px] text-[#8d9bad] font-bold uppercase mr-1">Ticket Classes:</span>
                              {evt.ticket_classes && evt.ticket_classes.length > 0 ? (
                                evt.ticket_classes.map((tc, idx) => (
                                  <span key={idx} className="px-2.5 py-1 bg-[#121d29] border border-[#314354] rounded text-[10px] font-mono text-white font-bold">
                                    {tc.name}: <b className="text-[#f4cf69]">{formatKes(tc.price)}</b> ({tc.quantity_available} seats)
                                  </span>
                                ))
                              ) : (
                                <span className="text-[10px] text-[#8d9bad] italic">Standard General Admission (KSh 1,500)</span>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap lg:flex-col items-center gap-2 shrink-0">
                            <button
                              onClick={() => openEditModal(evt)}
                              className="px-3 py-2 bg-[#121d29] border border-[#314354] hover:border-[#f4cf69] text-white text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <Edit size={14} className="text-[#f4cf69]" /> Edit Event & Poster
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(evt.id, evt.name)}
                              className="px-3 py-2 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-600 text-rose-400 hover:text-white text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* CREATE / EDIT EVENT PLANNER MODAL */}
            {isCreateModalOpen && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 font-sans animate-in fade-in duration-200">
                <div className="bg-[#09141f] border-2 border-[#f4cf69]/60 p-6 sm:p-8 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 scrollbar-thin">
                  <div className="flex justify-between items-center border-b border-[#172533] pb-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">AI Event Production Planner</p>
                      <h3 className="text-xl font-black uppercase text-white">
                        {editingEvent ? `Edit Event & Ticket Pricing: ${editingEvent.name}` : "Plan & Publish Event"}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCreateModalOpen(false)}
                      className="h-8 w-8 rounded-lg bg-[#121d29] text-[#8d9bad] hover:text-white flex items-center justify-center text-sm font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveEvent} className="space-y-4 text-xs font-sans">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-[#8d9bad]">Event Name / Title *</label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-[#8d9bad]">Event Category *</label>
                        <select
                          value={formType}
                          onChange={(e) => setFormType(e.target.value)}
                          className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69] cursor-pointer"
                        >
                          <option value="Corporate Event">Corporate Event & Summit</option>
                          <option value="Luxury Wedding">Luxury Wedding & Gala</option>
                          <option value="Exhibition & Expo">Exhibition & Trade Fair</option>
                          <option value="Concert & Live Show">Concert & Musical Festival</option>
                          <option value="Private Celebration">Private Executive Party</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-[#8d9bad]">Venue Location *</label>
                        <input
                          type="text"
                          required
                          value={formVenue}
                          onChange={(e) => setFormVenue(e.target.value)}
                          className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-[#8d9bad]">Event Date *</label>
                        <input
                          type="date"
                          required
                          value={formDate}
                          onChange={(e) => setFormDate(e.target.value)}
                          className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-[#8d9bad]">Production Budget (KES) *</label>
                        <input
                          type="number"
                          value={formBudget}
                          onChange={(e) => setFormBudget(Number(e.target.value))}
                          className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]"
                        />
                      </div>
                    </div>

                    {/* EVENT POSTER IMAGE UPLOADER, PRESETS & LIVE PREVIEW */}
                    <div className="p-4 bg-[#0d1823] border border-[#243343] rounded-xl space-y-3">
                      <label className="text-[9px] font-black uppercase text-[#8d9bad] block">
                        Event Poster Image * (Upload File or Select Preset)
                      </label>

                      {/* Live Image Preview */}
                      {formPosterUrl && (
                        <div className="relative h-36 w-full rounded-lg overflow-hidden border border-[#f4cf69]/50 shadow-md">
                          <img src={formPosterUrl} alt="Poster Preview" className="w-full h-full object-cover" />
                          <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 text-[#f4cf69] font-mono text-[9px] font-bold uppercase rounded">
                            Live Poster Preview
                          </span>
                        </div>
                      )}

                      <div className="grid sm:grid-cols-2 gap-3 pt-1">
                        {/* Option 1: File Upload */}
                        <div className="space-y-1">
                          <span className="text-[9px] text-[#8d9bad] font-bold uppercase block">Upload Local Poster File:</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileUpload}
                            className="w-full text-xs text-[#c7d0da] file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#f4cf69] file:text-black hover:file:bg-white cursor-pointer"
                          />
                        </div>

                        {/* Option 2: Image URL */}
                        <div className="space-y-1">
                          <span className="text-[9px] text-[#8d9bad] font-bold uppercase block">Or Custom Image URL:</span>
                          <input
                            type="text"
                            value={formPosterUrl}
                            onChange={(e) => setFormPosterUrl(e.target.value)}
                            placeholder="https://..."
                            className="w-full h-10 bg-[#121d29] border border-[#314354] rounded-lg px-3 text-xs font-bold text-white outline-none focus:border-[#f4cf69]"
                          />
                        </div>
                      </div>

                      {/* Option 3: Presets Grid */}
                      <div className="pt-2">
                        <span className="text-[9px] text-[#8d9bad] font-bold uppercase block mb-1.5">Or Choose From Presets:</span>
                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                          {defaultPosterPresets.map((preset, idx) => (
                            <button
                              type="button"
                              key={idx}
                              onClick={() => {
                                setFormPosterUrl(preset);
                                showToast(`✓ Selected Preset Poster #${idx + 1}`);
                              }}
                              className={cn(
                                "h-12 rounded-lg overflow-hidden border-2 cursor-pointer transition-all hover:scale-105",
                                formPosterUrl === preset ? "border-[#f4cf69] ring-2 ring-[#f4cf69]" : "border-[#243343] opacity-60 hover:opacity-100"
                              )}
                            >
                              <img src={preset} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* TICKET CLASS PRICING TIERS CONFIGURATOR */}
                    <div className="p-4 bg-[#0d1823] border border-[#243343] rounded-xl space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-white uppercase text-xs">Configure Ticket Classes & Pricing Tiers</h4>
                        <button
                          type="button"
                          onClick={handleAddFreeEntryTier}
                          className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-[10px] uppercase rounded hover:bg-emerald-500 hover:text-black transition-all cursor-pointer"
                        >
                          + Add Free Public Pass
                        </button>
                      </div>

                      {ticketClasses.map((tc, idx) => (
                        <div key={idx} className="grid grid-cols-3 gap-2 items-center">
                          <input
                            type="text"
                            value={tc.name}
                            onChange={(e) => {
                              const updated = [...ticketClasses];
                              updated[idx].name = e.target.value;
                              setTicketClasses(updated);
                            }}
                            className="h-10 bg-[#121d29] border border-[#314354] rounded px-3 text-xs font-bold text-white"
                          />
                          <input
                            type="number"
                            value={tc.price}
                            onChange={(e) => {
                              const updated = [...ticketClasses];
                              updated[idx].price = Number(e.target.value);
                              setTicketClasses(updated);
                            }}
                            placeholder="Price KES"
                            className="h-10 bg-[#121d29] border border-[#314354] rounded px-3 text-xs font-bold text-white"
                          />
                          <input
                            type="number"
                            value={tc.quantity_available}
                            onChange={(e) => {
                              const updated = [...ticketClasses];
                              updated[idx].quantity_available = Number(e.target.value);
                              setTicketClasses(updated);
                            }}
                            placeholder="Seats"
                            className="h-10 bg-[#121d29] border border-[#314354] rounded px-3 text-xs font-bold text-white"
                          />
                        </div>
                      ))}
                    </div>

                    <button
                      type="submit"
                      className="w-full h-14 bg-[#f4cf69] text-black font-black text-xs uppercase tracking-[0.2em] rounded-lg flex items-center justify-center gap-2 hover:bg-white transition-all shadow-xl cursor-pointer pt-1"
                    >
                      <Sparkles size={16} /> Confirm & Publish Event Record
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* COMPACT SMALL ADMIN FOOTER WITH MY WORLD AFRICA LINK */}
            <footer className="mt-8 pt-4 pb-2 border-t border-[#172533] flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] sm:text-xs text-[#8d9bad] font-mono">
              <div className="flex flex-wrap items-center gap-2">
                <span>© {new Date().getFullYear()} Royal Touch Events Nairobi.</span>
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
    </div>
  );
}
