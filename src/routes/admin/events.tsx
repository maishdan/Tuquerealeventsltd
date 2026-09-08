import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  useAdminEvents,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
  useAdminTickets,
  useIssueTicket,
  formatKes
} from "@/hooks/use-dashboard-data";
import { uploadEventPoster } from "@/lib/api/events";
import { useAuth } from "@/contexts/AuthContext";
import {
  Calendar,
  MapPin,
  Wallet,
  ArrowRight,
  Sparkles,
  Globe,
  Users,
  Plus,
  Search,
  X,
  Ticket as TicketIcon,
  CheckCircle2,
  Clock,
  Trash2,
  Loader2,
  Edit,
  Image as ImageIcon,
  Check,
  Gift,
  Bell,
  ChevronDown,
  Settings,
  Mail,
  FileText,
  LogOut,
  Power,
  ChevronUp,
  QrCode,
  User,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { EventRecord, TicketClass, EventLifecycleState, Ticket } from "@/lib/database.types";
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

function AdminEvents() {
  const searchParams = Route.useSearch();
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

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
  const [issuePrice, setIssuePrice] = useState(500);
  const [issuePaymentChannel, setIssuePaymentChannel] = useState("M-Pesa");

  // PDF Ticket Modal
  const [selectedTicketForPdf, setSelectedTicketForPdf] = useState<Ticket | null>(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

  useEffect(() => {
    if (searchParams.action === "create") {
      openCreateModal();
    }
  }, [searchParams.action]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Form State
  const [name, setName] = useState("");
  const [eventType, setEventType] = useState("Technology");
  const [description, setDescription] = useState("");
  const [organizerName, setOrganizerName] = useState("Royal Touch Events");
  const [organizerEmail, setOrganizerEmail] = useState("eventsroyaltouch7@gmail.com");
  const [organizerPhone, setOrganizerPhone] = useState("+254795365334");
  const [eventDate, setEventDate] = useState("2026-09-20");
  const [startTime, setStartTime] = useState("08:00 AM");
  const [endTime, setEndTime] = useState("06:00 PM");
  const [venue, setVenue] = useState("Kisii University Main Auditorium");
  const [posterUrl, setPosterUrl] = useState("/back/e1.jfif");
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [posterError, setPosterError] = useState("");
  const [lifecycleState, setLifecycleState] = useState<EventLifecycleState>("PUBLISHED");

  const [ticketClasses, setTicketClasses] = useState<TicketClass[]>([
    {
      id: "tc-1",
      name: "Regular Pass",
      description: "Standard event admission",
      price: 500,
      quantity_available: 500,
      quantity_sold: 0,
      benefits: ["General Entrance", "Standard Seating"],
    },
    {
      id: "tc-2",
      name: "VIP Pass",
      description: "VIP reserved seating & fast-track entrance",
      price: 1500,
      quantity_available: 100,
      quantity_sold: 0,
      benefits: ["Priority Entrance", "VIP Seating", "Refreshments"],
    },
    {
      id: "tc-3",
      name: "Free Admission Pass",
      description: "Complimentary & free public admission",
      price: 0,
      quantity_available: 200,
      quantity_sold: 0,
      benefits: ["Free General Entry"],
    },
  ]);

  const openCreateModal = () => {
    setEditingEvent(null);
    setName("");
    setEventType("Technology");
    setDescription("");
    setOrganizerName("Royal Touch Events");
    setEventDate("2026-09-20");
    setStartTime("08:00 AM");
    setEndTime("06:00 PM");
    setVenue("Kisii University Main Auditorium");
    setPosterUrl("/back/e1.jfif");
    setLifecycleState("PUBLISHED");
    setTicketClasses([
      {
        id: "tc-1",
        name: "Regular Pass",
        description: "General admission ticket",
        price: 500,
        quantity_available: 500,
        quantity_sold: 0,
        benefits: ["General Entrance"],
      },
      {
        id: "tc-2",
        name: "VIP Pass",
        description: "VIP fast-track entrance & seating",
        price: 1500,
        quantity_available: 100,
        quantity_sold: 0,
        benefits: ["Priority Entrance", "VIP Seating"],
      },
      {
        id: "tc-3",
        name: "Free Entry Pass",
        description: "Complimentary & free entry",
        price: 0,
        quantity_available: 200,
        quantity_sold: 0,
        benefits: ["Free Public Entry"],
      },
    ]);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (evt: EventRecord) => {
    setEditingEvent(evt);
    setName(evt.name);
    setEventType(evt.event_type || "General");
    setDescription(evt.description || "");
    setOrganizerName(evt.organizer_name || "Royal Touch Events");
    setEventDate(evt.event_date || "2026-09-20");
    setStartTime(evt.start_time || "08:00 AM");
    setEndTime(evt.end_time || "06:00 PM");
    setVenue(evt.venue || "Nairobi Venue");
    setPosterUrl(evt.poster_url || "/back/e1.jfif");
    setLifecycleState(evt.lifecycle_state || "PUBLISHED");
    setTicketClasses(
      evt.ticket_classes && evt.ticket_classes.length > 0
        ? evt.ticket_classes
        : [
            {
              id: "tc-1",
              name: "Regular Pass",
              description: "General admission",
              price: 500,
              quantity_available: 500,
              quantity_sold: 0,
              benefits: ["General Entrance"],
            },
          ]
    );
    setIsCreateModalOpen(true);
  };

  const handlePosterFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPosterError("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPosterError("Image must be under 5MB.");
      return;
    }
    setPosterError("");
    setUploadingPoster(true);
    try {
      const url = await uploadEventPoster(file);
      setPosterUrl(url);
    } catch {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setPosterUrl(String(evt.target.result));
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingPoster(false);
    }
  };

  const addTicketClass = () => {
    setTicketClasses((prev) => [
      ...prev,
      {
        id: `tc-${Date.now()}`,
        name: "Custom Tier",
        description: "Custom ticket class description",
        price: 1000,
        quantity_available: 100,
        quantity_sold: 0,
        benefits: ["General Entrance"],
      },
    ]);
  };

  const addFreeTicketClass = () => {
    setTicketClasses((prev) => [
      ...prev,
      {
        id: `tc-free-${Date.now()}`,
        name: "Free Entry Pass",
        description: "Complimentary & free public admission pass",
        price: 0,
        quantity_available: 200,
        quantity_sold: 0,
        benefits: ["Free Public Admission"],
      },
    ]);
  };

  const removeTicketClass = (id: string) => {
    setTicketClasses((prev) => prev.filter((tc) => tc.id !== id));
  };

  const updateTicketClass = (id: string, field: keyof TicketClass, value: any) => {
    setTicketClasses((prev) =>
      prev.map((tc) => {
        if (tc.id === id) {
          if (field === "benefits" && typeof value === "string") {
            return { ...tc, benefits: value.split(",").map((b) => b.trim()) };
          }
          return { ...tc, [field]: value };
        }
        return tc;
      })
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload: Partial<EventRecord> = {
      name,
      event_type: eventType,
      description,
      organizer_name: organizerName,
      organizer_email: organizerEmail,
      organizer_phone: organizerPhone,
      event_date: eventDate,
      start_time: startTime,
      end_time: endTime,
      venue,
      poster_url: posterUrl,
      lifecycle_state: lifecycleState,
      ticket_classes: ticketClasses,
      status: "upcoming",
      budget: ticketClasses.reduce((acc, tc) => acc + tc.price * tc.quantity_available, 0),
    };

    if (editingEvent) {
      updateEventMutation.mutate(
        { id: editingEvent.id, updates: payload },
        {
          onSuccess: () => {
            setIsCreateModalOpen(false);
            setEditingEvent(null);
            showToast("✓ Event & Ticket Prices updated successfully!");
          },
        }
      );
    } else {
      createEventMutation.mutate(payload, {
        onSuccess: () => {
          setIsCreateModalOpen(false);
          showToast("✓ New Event created & prices set!");
        },
      });
    }
  };

  const handleDeleteEvent = (evt: EventRecord) => {
    if (confirm(`Are you sure you want to delete "${evt.name}"? This action cannot be undone.`)) {
      deleteEventMutation.mutate(evt.id);
      showToast("✓ Event deleted successfully.");
    }
  };

  const handleIssueTicketForEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueForEvent || !issueHolderName.trim() || !issueHolderEmail.trim()) return;

    const finalPrice = issuePaymentChannel === "Free Pass" ? 0 : issuePrice;

    issueTicketMutation.mutate(
      {
        holder_name: issueHolderName,
        holder_email: issueHolderEmail,
        event_name: issueForEvent.name,
        ticket_tier: `${issueTier} [Paid via ${issuePaymentChannel}]`,
        price: finalPrice,
        status: "valid",
        seat_number: `A-${Math.floor(Math.random() * 80 + 10)}`,
        event_date: issueForEvent.event_date || "2026-09-20",
        venue: issueForEvent.venue || "Main Auditorium",
      },
      {
        onSuccess: (newTkt) => {
          setIssueForEvent(null);
          setIssueHolderName("");
          setIssueHolderEmail("");
          setSelectedTicketForPdf(newTkt);
          setIsPassModalOpen(true);
          showToast(`✓ Ticket issued for ${issueForEvent.name}!`);
        },
      }
    );
  };

  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.venue && e.venue.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter = filterState === "ALL" || e.lifecycle_state === filterState;
    return matchesSearch && matchesFilter;
  });

  const userInitials = profile?.full_name ? profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase() : "JO";

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
              { to: "/admin/users", label: "Clients", icon: "♟" },
              { to: "/admin/events", label: "Events", icon: "▦", active: true },
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
                placeholder="Search event title, venue, or ticket class..."
                className="w-full bg-transparent border-0 outline-none text-xs text-white placeholder:text-[#8291a2]"
              />
            </div>

            <div className="ml-auto flex items-center gap-4">
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

          {/* EVENTS DASHBOARD CONTENT BODY */}
          <section className="p-4 sm:p-6 space-y-4 max-w-[1700px] mx-auto">
            {/* Executive 3D Event Tile Banner */}
            <div className="relative group">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#d5a637]/30 via-[#f4cf69]/20 to-[#896019]/30 blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-6 sm:p-8 bg-gradient-to-r from-[#0d1c28] via-[#09141f] to-[#050e17] border-2 border-[#d4a43b]/40 rounded-xl shadow-[0_12px_35px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.15)] flex flex-col lg:flex-row lg:items-center justify-between gap-6 overflow-hidden">
                <div className="space-y-2.5 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#e6b83f]/15 border border-[#e6b83f]/40 text-[#f4cf69] text-[9px] font-black uppercase tracking-[0.25em] rounded-md shadow-inner">
                    <span className="text-[#f4cf69] font-serif text-sm">♛</span> Royal Touch Event Management Hub
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif tracking-tight text-white flex flex-wrap items-center gap-2 leading-tight drop-shadow-md">
                    Event Registry & Ticket Pricing <span className="text-[#f4cf69] font-serif text-2xl lg:text-3xl">♛</span>
                  </h1>

                  <p className="text-xs sm:text-sm text-[#98a7b7] font-medium leading-relaxed font-sans">
                    Configure public event listings, upload posters, multi-tier ticket classes (Regular, VIP, Free Pass), and seat capacities.
                  </p>
                </div>

                {/* Quick Actions Bar embedded in Tile */}
                <div className="flex flex-wrap items-center gap-2 relative z-10 shrink-0">
                  <button
                    onClick={openCreateModal}
                    className="px-4 py-2.5 rounded-lg bg-emerald-500 text-black font-black text-xs uppercase tracking-widest shadow-lg transition-all cursor-pointer hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    <Plus size={16} /> + Add Event & Set Prices
                  </button>
                </div>
              </div>
            </div>

            {/* 3 KPI STAT CARDS ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl shadow-lg space-y-2">
                <div className="flex items-center justify-between text-xs text-[#bdc8d4]">
                  <span className="font-semibold uppercase tracking-wider">Published Events</span>
                  <Globe size={18} className="text-[#f4cf69]" />
                </div>
                <p className="text-2xl font-black text-white font-mono">{events.length}</p>
                <p className="text-[10px] text-[#20e39b] font-medium">↑ Live Marketplace Listings</p>
              </div>

              <div className="p-4 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl shadow-lg space-y-2">
                <div className="flex items-center justify-between text-xs text-[#bdc8d4]">
                  <span className="font-semibold uppercase tracking-wider">Ticket Price Classes</span>
                  <TicketIcon size={18} className="text-[#20e39b]" />
                </div>
                <p className="text-2xl font-black text-[#20e39b] font-mono">
                  {events.reduce((acc, e) => acc + (e.ticket_classes?.length || 0), 0)}
                </p>
                <p className="text-[10px] text-[#20e39b] font-medium">↑ Multi-Tier Tiers Set</p>
              </div>

              <div className="p-4 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl shadow-lg space-y-2">
                <div className="flex items-center justify-between text-xs text-[#bdc8d4]">
                  <span className="font-semibold uppercase tracking-wider">Total Seat Capacity</span>
                  <Wallet size={18} className="text-[#f4cf69]" />
                </div>
                <p className="text-2xl font-black text-[#f4cf69] font-mono">
                  {events.reduce(
                    (acc, e) =>
                      acc + (e.ticket_classes?.reduce((sum, tc) => sum + tc.quantity_available, 0) || 500),
                    0
                  )}{" "}
                  Seats
                </p>
                <p className="text-[10px] text-[#20e39b] font-medium">↑ Total Stadium Capacity</p>
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
                              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold text-[8px] uppercase rounded">
                                {evt.lifecycle_state || "PUBLISHED"}
                              </span>
                            </div>

                            <h4 className="text-xl font-black uppercase text-white">{evt.name}</h4>
                            <p className="text-xs text-[#9ca8b6]">{evt.description || "Executive production by Royal Touch Events."}</p>

                            <div className="flex flex-wrap gap-4 text-xs font-bold text-[#8d9baa] pt-1">
                              <span>📅 {evt.event_date || "Date Confirmed"}</span>
                              <span>⏰ {evt.start_time || "08:00 AM"} - {evt.end_time || "06:00 PM"}</span>
                              <span>📍 {evt.venue || "Nairobi Venue"}</span>
                            </div>
                          </div>

                          <div className="flex lg:flex-col gap-2 shrink-0">
                            <button
                              onClick={() => {
                                setIssueForEvent(evt);
                                setIssueHolderName("");
                                setIssueHolderEmail("");
                              }}
                              className="px-4 py-2 bg-emerald-500 text-black font-black text-[10px] uppercase rounded-lg hover:bg-black hover:text-emerald-400 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <Plus size={14} /> + Issue Ticket
                            </button>

                            <button
                              onClick={() => setExpandedEventId(isExpanded ? null : evt.id)}
                              className="px-4 py-2 bg-[#121d29] border border-[#314354] hover:border-[#f4cf69] text-white font-bold text-[10px] uppercase rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <TicketIcon size={14} className="text-[#f4cf69]" />
                              {isExpanded ? "Hide Issued Passes" : `Issued Passes (${eventIssuedTickets.length})`}
                            </button>

                            <button
                              onClick={() => openEditModal(evt)}
                              className="px-4 py-2 bg-[#f4cf69] text-black font-black text-[10px] uppercase rounded-lg hover:bg-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <Edit size={14} /> Edit Event & Prices
                            </button>

                            <button
                              onClick={() => handleDeleteEvent(evt)}
                              className="px-4 py-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-[10px] uppercase rounded-lg hover:bg-rose-500 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        </div>

                        {/* Ticket Classes Options */}
                        <div className="pt-3 border-t border-[#172533] space-y-2">
                          <p className="text-[9px] font-black uppercase tracking-widest text-[#f4cf69]">Configured Ticket Classes & Prices</p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {(evt.ticket_classes || []).map((tc) => {
                              const availableSeats = Math.max(0, tc.quantity_available - tc.quantity_sold);
                              const isFree = tc.price === 0;
                              return (
                                <div key={tc.id} className="p-3 bg-[#111a25] border border-[#233240] rounded-lg space-y-1">
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold uppercase text-white">{tc.name}</span>
                                    <span className="font-mono font-black text-[#f4cf69]">
                                      {isFree ? "FREE ENTRY" : formatKes(tc.price)}
                                    </span>
                                  </div>
                                  <div className="text-[9px] text-[#8d9baa] font-mono flex justify-between pt-1 border-t border-[#172533]">
                                    <span>Seats: {availableSeats} / {tc.quantity_available}</span>
                                    <span className={cn("font-bold", availableSeats === 0 ? "text-rose-500" : "text-emerald-400")}>
                                      {availableSeats === 0 ? "SOLD OUT" : "READY"}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* EXPANDED ISSUED TICKETS TABLE FOR THIS EVENT */}
                        {isExpanded && (
                          <div className="pt-4 border-t border-[#f4cf69]/30 space-y-3 animate-in fade-in duration-300">
                            <div className="flex justify-between items-center">
                              <p className="text-xs font-black uppercase tracking-wider text-[#f4cf69]">
                                🎫 Issued Digital QR Passes for {evt.name} ({eventIssuedTickets.length})
                              </p>
                              <button
                                onClick={() => setExpandedEventId(null)}
                                className="text-[10px] text-[#8d9baa] hover:underline"
                              >
                                Close List
                              </button>
                            </div>

                            {eventIssuedTickets.length === 0 ? (
                              <p className="text-xs text-[#8d9baa] py-4 text-center font-mono">
                                No issued passes found for this event in database.
                              </p>
                            ) : (
                              <div className="overflow-x-auto border border-[#243343] rounded-lg">
                                <table className="w-full text-left border-collapse text-xs">
                                  <thead className="bg-[#0d1823] text-[#8d9baa]">
                                    <tr>
                                      <th className="p-2.5">Pass Code</th>
                                      <th className="p-2.5">Holder Name</th>
                                      <th className="p-2.5">Email</th>
                                      <th className="p-2.5">Pass Tier</th>
                                      <th className="p-2.5 text-right">Price Paid</th>
                                      <th className="p-2.5 text-center">Status</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-[#172530] text-white">
                                    {eventIssuedTickets.map((tkt) => (
                                      <tr key={tkt.id} className="hover:bg-[#111a25]">
                                        <td className="p-2.5 font-mono font-bold text-[#f4cf69]">{tkt.ticket_code}</td>
                                        <td className="p-2.5 font-bold">{tkt.holder_name}</td>
                                        <td className="p-2.5 font-mono text-[#9ca8b6]">{tkt.holder_email}</td>
                                        <td className="p-2.5">{tkt.ticket_tier}</td>
                                        <td className="p-2.5 text-right font-mono font-bold text-[#f4cf69]">
                                          {tkt.price > 0 ? formatKes(tkt.price) : "FREE PASS"}
                                        </td>
                                        <td className="p-2.5 text-center">
                                          <span
                                            className={cn(
                                              "px-2 py-0.5 rounded text-[8px] font-black uppercase",
                                              tkt.status === "used" ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400"
                                            )}
                                          >
                                            {tkt.status === "used" ? "Checked In" : "Valid Pass"}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      {/* CREATE / EDIT EVENT MODAL WITH PRICE & FREE ENTRY OPTIONS */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-2xl bg-[#09141f] border border-[#f4cf69]/40 rounded-xl p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#172533] pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-[#f4cf69] text-black flex items-center justify-center font-black rounded-lg">
                  <Globe size={20} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">Admin Creator</p>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white">
                    {editingEvent ? "Edit Event & Ticket Prices" : "Create Event & Set Prices"}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="h-10 w-10 bg-[#121d29] border border-[#314354] flex items-center justify-center text-[#8d9bad] hover:text-white cursor-pointer rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6 text-xs font-sans">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Kisii University Tech Summit 2026"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Category</label>
                  <input
                    type="text"
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Organizer Name</label>
                  <input
                    type="text"
                    value={organizerName}
                    onChange={(e) => setOrganizerName(e.target.value)}
                    className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Event synopsis..."
                  className="w-full bg-[#121d29] border border-[#314354] rounded-lg p-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Event Date</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Venue Location</label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]"
                  />
                </div>
              </div>

              {/* Poster Image Section */}
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Poster Image URL / Preset</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={posterUrl}
                    onChange={(e) => setPosterUrl(e.target.value)}
                    className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-mono text-white outline-none focus:border-[#f4cf69]"
                  />
                  <label className="h-12 px-4 bg-[#f4cf69] text-black font-black text-[10px] uppercase rounded-lg flex items-center justify-center cursor-pointer shrink-0">
                    Upload
                    <input type="file" accept="image/*" className="hidden" onChange={handlePosterFile} />
                  </label>
                </div>
              </div>

              {/* TICKET CLASSES & FREE ENTRY BUILDER */}
              <div className="space-y-4 p-4 bg-[#111a25] border border-[#233240] rounded-lg">
                <div className="flex justify-between items-center border-b border-[#172533] pb-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#f4cf69]">
                    Ticket Classes & Price Options
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={addFreeTicketClass}
                      className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-bold uppercase rounded hover:bg-emerald-500 hover:text-black transition-all cursor-pointer"
                    >
                      + Add Free Entry Pass
                    </button>
                    <button
                      type="button"
                      onClick={addTicketClass}
                      className="px-3 py-1 bg-[#f4cf69]/20 text-[#f4cf69] border border-[#f4cf69]/40 text-[9px] font-bold uppercase rounded hover:bg-[#f4cf69] hover:text-black transition-all cursor-pointer"
                    >
                      + Add Paid Tier
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {ticketClasses.map((tc, idx) => (
                    <div key={tc.id} className="p-3 bg-[#09141f] border border-[#243343] rounded-lg space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-white uppercase">
                          Tier #{idx + 1}: {tc.name} {tc.price === 0 && "(FREE ENTRY)"}
                        </span>
                        {ticketClasses.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTicketClass(tc.id)}
                            className="text-rose-400 hover:text-rose-300 text-[10px] font-bold"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid sm:grid-cols-3 gap-2">
                        <div>
                          <label className="text-[8px] text-[#8d9bad] uppercase block mb-1">Class Name</label>
                          <input
                            type="text"
                            value={tc.name}
                            onChange={(e) => updateTicketClass(tc.id, "name", e.target.value)}
                            className="w-full h-9 bg-[#121d29] border border-[#314354] rounded px-2 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[8px] text-[#8d9bad] uppercase block mb-1">Price (Set 0 for Free Pass)</label>
                          <input
                            type="number"
                            value={tc.price}
                            onChange={(e) => updateTicketClass(tc.id, "price", Number(e.target.value))}
                            className="w-full h-9 bg-[#121d29] border border-[#314354] rounded px-2 text-xs font-mono font-bold text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[8px] text-[#8d9bad] uppercase block mb-1">Seat Capacity</label>
                          <input
                            type="number"
                            value={tc.quantity_available}
                            onChange={(e) => updateTicketClass(tc.id, "quantity_available", Number(e.target.value))}
                            className="w-full h-9 bg-[#121d29] border border-[#314354] rounded px-2 text-xs font-mono text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={createEventMutation.isPending || updateEventMutation.isPending}
                className="w-full h-14 bg-[#f4cf69] text-black font-black text-xs uppercase tracking-[0.2em] rounded-lg flex items-center justify-center gap-2 hover:bg-white transition-all shadow-xl cursor-pointer pt-1"
              >
                {createEventMutation.isPending || updateEventMutation.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : editingEvent ? (
                  "Save Event Changes & Price Tiers"
                ) : (
                  "Publish Event & Set Ticket Prices"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ISSUE TICKET MODAL FOR SPECIFIC EVENT */}
      {issueForEvent && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-md bg-[#09141f] border border-[#f4cf69]/40 rounded-xl p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#172533] pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-[#f4cf69] text-black flex items-center justify-center font-black rounded-lg">
                  <TicketIcon size={20} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">Office Sales</p>
                  <h3 className="text-sm font-black uppercase tracking-tight text-white truncate max-w-[220px]">
                    Issue Ticket for {issueForEvent.name}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setIssueForEvent(null)}
                className="h-10 w-10 bg-[#121d29] border border-[#314354] flex items-center justify-center text-[#8d9bad] hover:text-white cursor-pointer rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleIssueTicketForEvent} className="space-y-4 text-xs font-sans">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Attendee Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Daniel Maina"
                  value={issueHolderName}
                  onChange={(e) => setIssueHolderName(e.target.value)}
                  className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Attendee Email *</label>
                <input
                  type="email"
                  required
                  placeholder="Ex: daniel@royaltouch.com"
                  value={issueHolderEmail}
                  onChange={(e) => setIssueHolderEmail(e.target.value)}
                  className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#f4cf69]">
                  Payment Verification & Channel *
                </label>
                <select
                  value={issuePaymentChannel}
                  onChange={(e) => setIssuePaymentChannel(e.target.value)}
                  className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69] cursor-pointer"
                >
                  <option value="M-Pesa">Paid via M-Pesa Mobile Money (KSh)</option>
                  <option value="Cash (KES)">Paid via Cash in KES</option>
                  <option value="Bank Transfer">Paid via Bank Wire Transfer</option>
                  <option value="Free Pass">Complimentary / Free Entry Pass</option>
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Pass Tier</label>
                  <select
                    value={issueTier}
                    onChange={(e) => setIssueTier(e.target.value)}
                    className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69] cursor-pointer"
                  >
                    {(issueForEvent.ticket_classes || []).map((tc) => (
                      <option key={tc.id} value={tc.name}>
                        {tc.name} ({tc.price > 0 ? formatKes(tc.price) : "FREE"})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Price Collected (KES)</label>
                  <input
                    type="number"
                    disabled={issuePaymentChannel === "Free Pass"}
                    value={issuePaymentChannel === "Free Pass" ? 0 : issuePrice}
                    onChange={(e) => setIssuePrice(Number(e.target.value))}
                    className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69] disabled:opacity-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={issueTicketMutation.isPending}
                className="w-full h-14 bg-[#f4cf69] text-black font-black text-xs uppercase tracking-[0.2em] rounded-lg flex items-center justify-center gap-2 hover:bg-white transition-all shadow-xl cursor-pointer pt-1"
              >
                {issueTicketMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : "Issue Pass & Generate QR Code"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PDF GATE PASS MODAL */}
      <TicketPassModal
        ticket={selectedTicketForPdf}
        isOpen={isPassModalOpen}
        onClose={() => {
          setIsPassModalOpen(false);
          setSelectedTicketForPdf(null);
        }}
      />
    </div>
  );
}
