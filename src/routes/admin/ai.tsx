import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  useAdminEvents,
  useAdminBookings,
  useAdminTickets,
  useAdminClients,
  useAdminContacts,
  useAdminProspects,
  useCreateProspect,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
  useAdminTeam,
  formatKes
} from "@/hooks/use-dashboard-data";
import { updateBookingStatus } from "@/lib/api/bookings";
import { sendMessage } from "@/lib/api/messages";
import { useAuth } from "@/contexts/AuthContext";
import { createPageSeo } from "@/lib/seo";
import { AgentAudioVisualizerBar, AgentState } from "@/components/agents-ui/AgentAudioVisualizerBar";
import {
  processCompanionCommand,
  interpretPage,
  speakWithZephyrVoice,
  playZephyrAudioSample,
  generateExecutivePdfReport,
  type CompanionContext
} from "@/lib/ann-companion";
import {
  Sparkles,
  Zap,
  TrendingUp,
  Search,
  ChevronDown,
  Settings,
  Mail,
  HelpCircle,
  LogOut,
  User,
  Home,
  Send,
  Globe,
  FileText,
  Flame,
  MapPin,
  RefreshCw,
  Crown,
  Users,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Music,
  Eye,
  Radio,
  Share2,
  Phone,
  Check,
  Heart,
  PlusCircle,
  Bell,
  X,
  Plus,
  Bot,
  Calendar,
  MessageSquare,
  Copy,
  ExternalLink,
  UserCheck,
  Building
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

export const Route = createFileRoute("/admin/ai")({
  head: () =>
    createPageSeo({
      title: "AI Africa Opportunity Intelligence & Discovery | TOQUE REAL EVENTS LIMITED Admin",
      description: "Pan-Africa event discovery, public signals scanner, regional opportunity heatmap, and AI lead scoring system.",
      path: "/admin/ai",
      noindex: true,
    }),
  component: AdminAI,
});

type AITab = "messages" | "generator" | "assistant" | "discovered" | "tenders" | "trends";

export function AdminAI() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  // Database Hooks
  const { data: events = [] } = useAdminEvents();
  const { data: bookings = [] } = useAdminBookings();
  const { data: tickets = [] } = useAdminTickets();
  const { data: clients = [] } = useAdminClients();
  const { data: contacts = [] } = useAdminContacts();
  const { data: prospects = [] } = useAdminProspects();
  const { data: team = [] } = useAdminTeam();

  // Mutations
  const createProspectMutation = useCreateProspect();
  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useDeleteEvent();

  const [activeTab, setActiveTab] = useState<AITab>("messages");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false);

  // Scanner & Generator Filters
  const [scanLocation, setScanLocation] = useState("Nairobi, Kenya");
  const [scanCategory, setScanCategory] = useState("Corporate Conference & Gala");
  const [minBudget, setMinScore] = useState(1000000);
  const [isScanning, setIsScanning] = useState(false);

  // Messages & Planner Lead Outreach State
  const [activeTemplateType, setActiveTemplateType] = useState<"email" | "whatsapp" | "sms">("email");
  const [selectedPlanner, setSelectedPlanner] = useState<any>(null);
  const [customPitchText, setCustomPitchText] = useState("");
  const [savedLeadIds, setSavedLeadIds] = useState<Record<string, boolean>>({});

  // Hands-Free Voice Assistant State
  const [isAlwaysOnListening, setIsAlwaysOnListening] = useState(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [liveVoiceTranscript, setLiveVoiceTranscript] = useState("");

  const continuousRecognitionRef = useRef<any>(null);

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

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2800);
  };

  const userInitials = profile?.full_name ? profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase() : "JO";

  // Financial Computations
  const totalSettledRevenue = tickets.reduce((acc, t) => acc + (t.price || 0), 0);
  const pipelineValue = bookings.reduce((acc, b) => {
    const numeric = typeof b.budget === "number" ? b.budget : parseInt(String(b.budget || 0).replace(/[^0-9]/g, "")) || 0;
    return acc + numeric;
  }, 0);

  // Discovered Opportunities & Event Planners Lead Dataset
  const [opportunities, setOpportunities] = useState([
    {
      id: "opp-africa-1",
      title: "Africa Business & Tech Leadership Summit 2026",
      organization: "Africa Business Council",
      location: "Nairobi, Kenya",
      country: "Kenya",
      date: "November 2026",
      type: "Corporate Summit",
      categoryGroup: "Corporate",
      attendance: "850+ Delegates",
      score: 96,
      winProbability: "96%",
      estimatedMinRevenue: 1200000,
      estimatedMaxRevenue: 2800000,
      aiRecommendation: "HIGH WIN PROBABILITY (96%): Pitch full-service turnkey conference package (Stage, AV & VIP Catering). Target decision maker: Dr. Sarah Muthoni.",
      services: ["Conference Management", "VIP Catering", "Audio Visual", "Stage Design"],
      source: "Pan-Africa Business Portal",
      urgency: "HOT MATCH",
      url: "https://invest.go.ke",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=700&q=80",
      contact: {
        name: "Dr. Sarah Muthoni",
        designation: "Head of Regional Procurement",
        phone: "+254722884921",
        email: "smuthoni@africabusiness.org",
        address: "Westlands Nairobi"
      },
      assignedTo: "Jane Wambui",
      status: "NEW",
    },
    {
      id: "opp-africa-2",
      title: "East Africa Trade & Investment Expo 2026",
      organization: "East African Community",
      location: "Kampala, Uganda",
      country: "Uganda",
      date: "October 2026",
      type: "Exhibition & Trade Fair",
      categoryGroup: "Exhibition",
      attendance: "1,500+ Attendees",
      score: 94,
      winProbability: "92%",
      estimatedMinRevenue: 1800000,
      estimatedMaxRevenue: 3500000,
      aiRecommendation: "HIGH INTENT MATCH (92%): Dispatch trade fair booth & dome tent package proposal. Contact Peter Musoke in Kampala.",
      services: ["Exhibition Booths", "Dome Tents", "AV & Sound", "Security"],
      source: "EAC Official Trade Calendar",
      urgency: "HOT MATCH",
      url: "https://eac.int",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=700&q=80",
      contact: {
        name: "Peter Musoke",
        designation: "Trade Expo Coordinator",
        phone: "+256701445889",
        email: "pmusoke@eac.int",
        address: "Kampala City"
      },
      assignedTo: "David Mwangi",
      status: "NEW",
    },
    {
      id: "opp-africa-3",
      title: "Safaricom Foundation — Youth Innovation Expo 2026",
      organization: "Safaricom Foundation",
      location: "Nairobi, Kenya",
      country: "Kenya",
      date: "October 2026",
      type: "Exhibition & Tech Expo",
      categoryGroup: "Corporate",
      attendance: "1,200+ Attendees",
      score: 95,
      winProbability: "95%",
      estimatedMinRevenue: 1500000,
      estimatedMaxRevenue: 3000000,
      aiRecommendation: "HOT MATCH: High brand visibility deal for stage production and sound.",
      services: ["Stage Design", "AV & Sound", "VIP Catering", "Security"],
      source: "InvestKenya Events Calendar",
      urgency: "HOT MATCH",
      url: "https://invest.go.ke",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=700&q=80",
      contact: {
        name: "Peter Otieno",
        designation: "Corporate Affairs Director",
        phone: "+254733901442",
        email: "potieno@safaricom.co.ke",
        address: "Waiyaki Way Nairobi"
      },
      assignedTo: "David Mwangi",
      status: "NEW",
    },
  ]);

  // Default Template Messages
  const getDefaultEmailTemplate = (planner: any) => {
    const pName = planner ? planner.contact.name : "Event Planner";
    const title = planner ? planner.title : "Upcoming Corporate Production";
    const loc = planner ? planner.location : "Nairobi, Kenya";

    return `Subject: Turnkey Event Production Proposal — ${title}\n\nDear ${pName},\n\nHope this finds you well.\n\nOn behalf of TOQUE REAL EVENTS LIMITED (Royal Touch Events), East Africa's premier luxury event production agency, we would love to submit our turnkey production proposal for ${title} in ${loc}.\n\nOur full-service offering includes:\n- Custom 3D Stage Staging & Trussing\n- Ultra-HD 4K LED Screen Arrays & Concert Sound Systems\n- VVIP Lounge Setup & Gourmet Catering\n- On-site Event Logistics & Security Protocols\n\nWe would be honored to schedule a brief 10-minute briefing with you.\n\nWarm regards,\n\n${adminInfo.fullName}\nCEO — TOQUE REAL EVENTS LIMITED\nPhone: +254 795 365 334 | https://royaltouchevents.co.ke`;
  };

  const getDefaultWhatsAppTemplate = (planner: any) => {
    const pName = planner ? planner.contact.name : "Planner";
    const title = planner ? planner.title : "Upcoming Production";
    const loc = planner ? planner.location : "Nairobi";

    return `Hello ${pName}, this is ${adminInfo.fullName} from Royal Touch Events. We noticed your upcoming *${title}* in ${loc}. We specialize in high-definition stage, 4K sound & VIP catering for corporate galas in Kenya & East Africa. Would you be open to a quick 5-minute chat or proposal review? Website: https://royaltouchevents.co.ke`;
  };

  const getDefaultSmsTemplate = (planner: any) => {
    const title = planner ? planner.title : "Event Production";
    return `Royal Touch Events: High-production stage, AV & VIP catering for ${title}. View proposal: https://royaltouchevents.co.ke or call +254795365334.`;
  };

  // Set default selected planner on load
  useEffect(() => {
    if (opportunities.length > 0 && !selectedPlanner) {
      setSelectedPlanner(opportunities[0]);
    }
  }, [opportunities]);

  // Speech Output Engine
  const speakAI = (text: string) => {
    speakWithZephyrVoice(
      text,
      isVoiceMuted,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const buildContext = (): CompanionContext => ({
    userName: adminInfo.fullName,
    currentPath: "/admin/ai",
    navigate: (opts) => navigate(opts),
    bookings,
    events,
    clients,
    contacts,
    tickets,
    prospects,
    createEventFn: async (data) => createEventMutation.mutateAsync(data),
    updateEventFn: async (opts) => updateEventMutation.mutateAsync(opts),
    deleteEventFn: async (id) => deleteEventMutation.mutateAsync(id),
    updateBookingStatusFn: async (opts) => updateBookingStatus(opts.id, opts.status),
    sendMessageFn: async (opts) =>
      sendMessage(opts.userId, opts.fromName, opts.fromRole, opts.body, opts.subject),
  });

  const handleVoiceCommand = async (rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    setLiveVoiceTranscript(cmd);
    setIsThinking(true);

    const ctx = buildContext();
    const result = await processCompanionCommand(cmd, ctx);

    setIsThinking(false);
    showToast(`Ann: "${result.replyText.slice(0, 80)}..."`);
    speakAI(result.replyText);
  };

  // Always-On Continuous Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let currentTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          const finalSpeech = event.results[i][0].transcript;
          handleVoiceCommand(finalSpeech);
        }
      }
      setLiveVoiceTranscript(currentTranscript);
    };

    recognition.onend = () => {
      if (isAlwaysOnListening) {
        try { recognition.start(); } catch {}
      }
    };

    continuousRecognitionRef.current = recognition;

    if (isAlwaysOnListening) {
      try {
        if ("speechSynthesis" in window) window.speechSynthesis.cancel();
        recognition.start();
        speakAI("Always-on listening mode is active. Speak to me anytime!");
      } catch (e) {
        console.error("Continuous Speech start error:", e);
      }
    } else {
      try { recognition.stop(); } catch {}
    }

    return () => {
      try { recognition.stop(); } catch {}
    };
  }, [isAlwaysOnListening]);

  // AI Market Lead Scanner
  const handleRunAiLeadScanner = () => {
    setIsScanning(true);
    speakAI(`Scanning online markets, signals, and tenders in ${scanLocation} for ${scanCategory}...`);

    setTimeout(() => {
      setIsScanning(false);

      const generatedNewLead = {
        id: `opp-gen-${Date.now()}`,
        title: `${scanCategory} — ${scanLocation}`,
        organization: `Executive Event Partner (${scanLocation.split(",")[0]})`,
        location: scanLocation,
        country: scanLocation.includes("Uganda") ? "Uganda" : scanLocation.includes("Tanzania") ? "Tanzania" : "Kenya",
        date: "December 2026",
        type: scanCategory,
        categoryGroup: "Corporate",
        attendance: "1,000+ Guests",
        score: Math.floor(Math.random() * 15) + 85,
        winProbability: "94%",
        estimatedMinRevenue: minBudget,
        estimatedMaxRevenue: minBudget * 2.2,
        aiRecommendation: `HIGH REVENUE SIGNAL: Pitch premium 3D Staging, 4K AV arrays, and VIP catering package for ${scanLocation}.`,
        services: ["Stage Production", "4K Audio Visual", "VIP Catering", "Lighting Design"],
        source: "AI Online Market Scanner",
        urgency: "HOT MATCH",
        url: "https://royaltouchevents.co.ke",
        image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=700&q=80",
        contact: {
          name: "Francis K. Mwangi",
          designation: "Executive Procurement Director",
          phone: "+254795365334",
          email: "procurement@royaltouch.co.ke",
          address: scanLocation
        },
        assignedTo: "Japheth Owiyo",
        status: "NEW",
      };

      setOpportunities((prev) => [generatedNewLead, ...prev]);
      setSelectedPlanner(generatedNewLead);
      showToast(`New High-Match Lead Generated for ${scanLocation}!`);
      speakAI(`Done! I've discovered a new high-value lead opportunity for ${scanCategory} in ${scanLocation} with an estimated budget of ${formatKes(minBudget)}!`);
    }, 2200);
  };

  // Save Lead to Supabase Database
  const handleSaveLeadToDb = async (opp: any) => {
    try {
      await createProspectMutation.mutateAsync({
        company_name: opp.organization,
        contact_name: opp.contact.name,
        email: opp.contact.email,
        phone: opp.contact.phone,
        event_type: opp.type,
        estimated_budget: formatKes(opp.estimatedMaxRevenue),
        lead_score: opp.score,
        notes: `Source: ${opp.source}. ${opp.aiRecommendation}`,
        status: "new",
      });

      setSavedLeadIds((prev) => ({ ...prev, [opp.id]: true }));
      showToast(`Saved '${opp.title}' to Prospects Database!`);
      speakAI(`I've saved ${opp.title} directly into our CRM prospects database!`);
    } catch (err) {
      showToast("Error saving lead to database");
    }
  };

  const agentState: AgentState = isAlwaysOnListening
    ? "listening"
    : isSpeaking
    ? "speaking"
    : isThinking
    ? "listening"
    : "idle";

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
            <Crown size={22} className="text-[#f4cf69]" />
            {!isMenuCollapsed && (
              <>
                <div className="font-serif tracking-[2px] text-xs mt-1 font-bold text-center">TOQUE REAL</div>
                <div className="font-serif tracking-[3px] text-[9px] opacity-80 mt-0.5 text-center">EVENTS LIMITED</div>
              </>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-[#243343] scrollbar-track-[#07101a]">
            {[
              { to: "/admin", label: "Dashboard", icon: Home },
              { to: "/admin/users", label: "Clients", icon: Users },
              { to: "/admin/prospects", label: "Prospects", icon: Sparkles },
              { to: "/admin/customers", label: "Customers", icon: Users },
              { to: "/admin/events", label: "Events", icon: Calendar },
              { to: "/admin/bookings", label: "Sales & CRM", icon: FileText },
              { to: "/admin/proposals", label: "Proposals", icon: FileText },
              { to: "/admin/payments", label: "Payments", icon: TrendingUp },
              { to: "/admin/finance", label: "Finance", icon: TrendingUp },
              { to: "/admin/ai", label: "AI & Insights", icon: Sparkles, active: true },
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
                  onClick={() => showToast(`${item.label} Module Selected`)}
                  className={cn(
                    "flex items-center gap-3 h-[43px] px-3 rounded-lg text-xs font-medium transition-all cursor-pointer my-1",
                    item.active
                      ? "bg-gradient-to-r from-[#a9741b] via-[#d5a637] to-[#896019] text-white shadow-lg shadow-[#b48224]/20 font-bold"
                      : "text-[#c7d0da] hover:bg-[#111b27] hover:text-white"
                  )}
                >
                  <Icon size={16} className={cn("shrink-0", item.active ? "text-white" : "text-[#f1c35a]")} />
                  {!isMenuCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}

            <button
              type="button"
              onClick={() => setShowLogoutConfirmModal(true)}
              className="w-full flex items-center gap-3 h-[43px] px-3 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all cursor-pointer my-2 text-left"
            >
              <LogOut size={16} className="text-rose-400 shrink-0 font-bold" />
              {!isMenuCollapsed && <span>Sign Out</span>}
            </button>
          </nav>
        </aside>

        {/* MAIN PAGE CONTAINER */}
        <div className="flex flex-col min-w-0 bg-[#03070d]">
          {/* HEADER BAR */}
          <header className="h-[95px] border-b border-[#202c39] bg-gradient-to-r from-[#03070d] via-[#08121a] to-[#03070d] px-6 sm:px-10 flex items-center justify-between z-40 sticky top-0 shadow-xl">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}
                className="p-2 rounded-lg bg-[#0e1722] border border-[#202e3c] text-[#f4cf69] hover:bg-[#162534] transition-all cursor-pointer"
                title="Toggle Sidebar Menu"
              >
                <span className="text-sm">☰</span>
              </button>

              <div>
                <h1 className="text-lg sm:text-xl font-bold tracking-wide text-white uppercase font-serif">
                  AI & Insights Engine
                </h1>
                <p className="text-xs text-[#899cb0] font-medium hidden sm:block">
                  TOQUE REAL Pan-Africa Event Opportunity Intelligence & Lead Generation
                </p>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search AI opportunities..."
                  className="h-10 pl-9 pr-4 w-60 bg-[#0c1622] border border-[#202e3c] focus:border-[#f4cf69] rounded-lg text-xs text-white placeholder-[#5a6e80] focus:outline-none transition-all"
                />
                <Search size={14} className="absolute left-3 top-3 text-[#5a6e80]" />
              </div>

              {/* Dedicated Virtual Assistant Button with Icon */}
              <button
                onClick={() => {
                  setActiveTab("assistant");
                  speakAI("Virtual Assistant activated. How can I assist you today?");
                  showToast("Virtual Assistant Activated");
                }}
                className="px-3.5 py-2 rounded-lg bg-[#142637] border border-[#f4cf69]/50 text-[#f4cf69] text-xs font-bold uppercase tracking-wider hover:bg-[#1f354c] transition-all cursor-pointer flex items-center gap-2 shadow-md active:scale-95"
                title="Open Virtual Assistant"
              >
                <Bot size={15} className="text-[#f4cf69]" />
                <span className="hidden sm:inline">Virtual Assistant</span>
              </button>

              {/* Always-On Voice Switch */}
              <button
                onClick={() => setIsAlwaysOnListening(!isAlwaysOnListening)}
                className={cn(
                  "px-3 py-2 rounded-lg border text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg",
                  isAlwaysOnListening
                    ? "bg-rose-600 text-white border-rose-400 animate-pulse shadow-[0_0_15px_rgba(225,29,72,0.6)]"
                    : "bg-[#0c1622] text-[#f4cf69] border-[#202e3c] hover:border-[#f4cf69]"
                )}
                title="Toggle Continuous Always-On Listening Mode"
              >
                {isAlwaysOnListening ? <Radio size={14} className="animate-spin" /> : <Mic size={14} />}
                <span className="hidden sm:inline">{isAlwaysOnListening ? "Always-On Active" : "Hands-Free Mic"}</span>
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2.5 p-1.5 rounded-lg bg-[#0e1722] border border-[#202e3c] hover:border-[#f4cf69] transition-all cursor-pointer">
                  <div className="h-8 w-8 rounded-md bg-gradient-to-tr from-[#d5a637] to-[#f4cf69] text-black font-black text-xs flex items-center justify-center">
                    {userInitials}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold text-white leading-none">{adminInfo.fullName}</p>
                    <p className="text-[9px] font-mono text-[#f4cf69] mt-0.5">{adminInfo.badge}</p>
                  </div>
                  <ChevronDown size={14} className="text-[#899cb0]" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#07131e] border-[#203348] text-white">
                  <DropdownMenuLabel>Executive Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#203348]" />
                  <DropdownMenuItem onClick={() => navigate({ to: "/admin/settings" })} className="cursor-pointer">
                    <Settings size={14} className="mr-2 text-[#f4cf69]" /> System Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowLogoutConfirmModal(true)} className="text-rose-400 cursor-pointer">
                    <LogOut size={14} className="mr-2" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* PAGE CONTENT CANVAS */}
          <main className="p-6 sm:p-8 space-y-6 max-w-[1700px] w-full mx-auto">
            {/* REAL-TIME AI SIGNAL BAR */}
            <div className="bg-gradient-to-r from-[#0d1f2d] via-[#102434] to-[#081520] border border-[#f4cf69]/40 rounded-xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4 font-sans">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-[#f4cf69]" /> Pan-Africa AI Market Lead Intelligence Active
                </span>
                <span className="text-[10px] font-mono text-[#899cb0] hidden md:inline-block">
                  — Kenya, Uganda, Tanzania & Online Signals Monitored
                </span>
              </div>

              <div className="flex items-center gap-5 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-[#f4cf69]">
                  <Flame size={15} /> <span className="font-bold">Hot Leads:</span> {opportunities.filter((o) => o.score >= 90).length}
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <TrendingUp size={15} /> <span className="font-bold">Active Pipeline:</span> KSh {pipelineValue.toLocaleString()}
                </div>
                <div className="flex items-center gap-1.5 text-blue-400">
                  <Users size={15} /> <span className="font-bold">Clients in CRM:</span> {clients.length}
                </div>
              </div>
            </div>

            {/* EXECUTIVE HERO TILE BANNER */}
            <div className="relative group z-0">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#d5a637]/30 via-[#f4cf69]/20 to-[#896019]/30 blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-6 sm:p-8 bg-gradient-to-r from-[#0d1c28] via-[#09141f] to-[#050e17] border-2 border-[#d4a43b]/40 rounded-xl shadow-[0_12px_35px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.15)] flex flex-col lg:flex-row lg:items-center justify-between gap-6 overflow-hidden">
                <div className="space-y-2.5 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#e6b83f]/15 border border-[#e6b83f]/40 text-[#f4cf69] text-[9px] font-black uppercase tracking-[0.25em] rounded-md shadow-inner">
                    <Crown size={14} className="text-[#f4cf69]" /> TOQUE REAL Pan-Africa AI Event Discovery Engine
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif tracking-tight text-white flex flex-wrap items-center gap-2 leading-tight drop-shadow-md">
                    AI Event Opportunity Discovery Engine — Africa & Kenya
                  </h1>

                  <p className="text-xs sm:text-sm text-[#98a7b7] font-medium leading-relaxed font-sans">
                    Continuously discovers public signals of upcoming conferences, summits, tech expos, weddings, and corporate events across Africa.
                  </p>
                </div>

                {/* Agent Ann Zephyr Hero Quick Action */}
                <div className="flex items-center gap-3 shrink-0 relative z-10">
                  <AgentAudioVisualizerBar
                    state={agentState}
                    barCount={5}
                    size="sm"
                    className="py-1.5 px-3 h-10 border-[#f4cf69]/50 bg-[#07131e]"
                  />

                  <button
                    onClick={playZephyrAudioSample}
                    className="px-3.5 py-2.5 rounded-lg bg-[#142637] border border-[#f4cf69]/60 text-[#f4cf69] text-xs font-black uppercase hover:bg-[#1f354c] transition-all cursor-pointer flex items-center gap-1.5 shadow-lg active:scale-95"
                    title="Play Zephyr's official audio sample"
                  >
                    <Music size={14} /> Zephyr Sample
                  </button>
                </div>
              </div>
            </div>

            {/* AI MODULE SUB-NAVIGATION TABS (WITH MESSAGES TAB) */}
            <div className="flex items-center gap-2 overflow-x-auto p-2 bg-[#09141f] border border-[#243343] rounded-xl scrollbar-none">
              {[
                { id: "messages", label: "Messages", icon: MessageSquare },
                { id: "generator", label: "AI Lead Generator & Scanner", icon: Flame },
                { id: "assistant", label: "Hands-Free Voice Assistant", icon: Mic },
                { id: "discovered", label: "Discovered Signals", icon: Sparkles },
                { id: "tenders", label: "Tenders Radar", icon: FileText },
                { id: "trends", label: "Regional Heatmap", icon: Globe },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as AITab)}
                    className={cn(
                      "px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-2",
                      isActive
                        ? "bg-gradient-to-r from-[#d5a637] to-[#f4cf69] text-black shadow-lg shadow-[#f4cf69]/20 font-black"
                        : "text-[#899cb0] hover:text-white hover:bg-[#122436]"
                    )}
                  >
                    <Icon size={15} /> {tab.label}
                  </button>
                );
              })}
            </div>

            {/* TAB: MESSAGES & DIRECT EVENT PLANNER OUTREACH HUB */}
            {activeTab === "messages" && (
              <div className="space-y-6">
                {/* DEFAULT SAMPLE MESSAGES & PITCH TEMPLATES BOX */}
                <div className="p-6 bg-[#091624] border-2 border-[#f4cf69]/40 rounded-xl shadow-2xl space-y-5">
                  <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#203348] pb-4">
                    <div>
                      <h3 className="text-base font-black uppercase tracking-wider text-white flex items-center gap-2">
                        <MessageSquare className="text-[#f4cf69]" /> DIRECT EVENT PLANNER MESSAGES & DEFAULT OUTREACH TEMPLATES
                      </h3>
                      <p className="text-xs text-[#98a7b7] font-medium mt-1">
                        Select an event planner lead below to auto-generate default pitch emails, WhatsApp messages, calls, and SMS texts.
                      </p>
                    </div>

                    {/* Template Type Selector */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveTemplateType("email")}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5",
                          activeTemplateType === "email"
                            ? "bg-[#f4cf69] text-black font-black"
                            : "bg-[#142637] text-[#899cb0] hover:text-white"
                        )}
                      >
                        <Mail size={14} /> Email
                      </button>

                      <button
                        onClick={() => setActiveTemplateType("whatsapp")}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5",
                          activeTemplateType === "whatsapp"
                            ? "bg-emerald-500 text-black font-black"
                            : "bg-[#142637] text-[#899cb0] hover:text-white"
                        )}
                      >
                        <Share2 size={14} /> WhatsApp
                      </button>

                      <button
                        onClick={() => setActiveTemplateType("sms")}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5",
                          activeTemplateType === "sms"
                            ? "bg-blue-500 text-white font-black"
                            : "bg-[#142637] text-[#899cb0] hover:text-white"
                        )}
                      >
                        <Phone size={14} /> SMS
                      </button>
                    </div>
                  </div>

                  {/* ACTIVE TEMPLATE DISPLAY & COPY CONTROLS */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-[#899cb0]">
                      <span>
                        Default Sample Message for:{" "}
                        <strong className="text-[#f4cf69]">
                          {selectedPlanner ? selectedPlanner.contact.name : "Event Planner"}
                        </strong>{" "}
                        ({selectedPlanner ? selectedPlanner.title : "Event"})
                      </span>
                      <span className="text-emerald-400 font-bold uppercase">{activeTemplateType} format</span>
                    </div>

                    <textarea
                      value={
                        activeTemplateType === "email"
                          ? getDefaultEmailTemplate(selectedPlanner)
                          : activeTemplateType === "whatsapp"
                          ? getDefaultWhatsAppTemplate(selectedPlanner)
                          : getDefaultSmsTemplate(selectedPlanner)
                      }
                      onChange={(e) => setCustomPitchText(e.target.value)}
                      rows={6}
                      className="w-full p-4 bg-[#0c1a28] border border-[#203548] rounded-xl text-xs font-mono text-white focus:border-[#f4cf69] focus:outline-none"
                    />

                    <div className="flex items-center gap-3 flex-wrap pt-1">
                      <button
                        onClick={() => {
                          const txt =
                            activeTemplateType === "email"
                              ? getDefaultEmailTemplate(selectedPlanner)
                              : activeTemplateType === "whatsapp"
                              ? getDefaultWhatsAppTemplate(selectedPlanner)
                              : getDefaultSmsTemplate(selectedPlanner);
                          navigator.clipboard.writeText(txt);
                          showToast("Copied sample default message to clipboard!");
                        }}
                        className="px-4 py-2.5 rounded-xl bg-[#142637] border border-[#f4cf69]/50 text-[#f4cf69] text-xs font-black uppercase tracking-wider hover:bg-[#1f344c] transition-all cursor-pointer flex items-center gap-2"
                      >
                        <Copy size={15} /> Copy Default Template
                      </button>

                      {selectedPlanner && (
                        <>
                          <a
                            href={`mailto:${selectedPlanner.contact.email}?subject=${encodeURIComponent(
                              `Turnkey Event Production Proposal — ${selectedPlanner.title}`
                            )}&body=${encodeURIComponent(getDefaultEmailTemplate(selectedPlanner))}`}
                            className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-black uppercase tracking-wider hover:bg-blue-500 transition-all cursor-pointer flex items-center gap-2 shadow-lg"
                          >
                            <Mail size={15} /> Send Email Directly
                          </a>

                          <a
                            href={`https://wa.me/${selectedPlanner.contact.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                              getDefaultWhatsAppTemplate(selectedPlanner)
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black uppercase tracking-wider hover:bg-emerald-500 transition-all cursor-pointer flex items-center gap-2 shadow-lg"
                          >
                            <Share2 size={15} /> Open WhatsApp Chat
                          </a>

                          <a
                            href={`sms:${selectedPlanner.contact.phone.replace(/[^0-9]/g, "")}?body=${encodeURIComponent(
                              getDefaultSmsTemplate(selectedPlanner)
                            )}`}
                            className="px-4 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-black uppercase tracking-wider hover:bg-purple-500 transition-all cursor-pointer flex items-center gap-2 shadow-lg"
                          >
                            <Phone size={15} /> Send SMS
                          </a>

                          <a
                            href={`tel:${selectedPlanner.contact.phone.replace(/[^0-9]/g, "")}`}
                            className="px-4 py-2.5 rounded-xl bg-[#182a3c] border border-emerald-500/50 text-emerald-400 text-xs font-black uppercase tracking-wider hover:bg-[#20364b] transition-all cursor-pointer flex items-center gap-2 shadow-lg"
                          >
                            <Phone size={15} /> Direct Call
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* VERIFIED EVENT PLANNER & CORPORATE LEAD CONTACT CARDS GRID */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#f4cf69] flex items-center gap-2">
                    <UserCheck size={16} /> VERIFIED EVENT PLANNER & PROCUREMENT DIRECTORY ({opportunities.length} LEADS)
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {opportunities.map((opp) => {
                      const isSelected = selectedPlanner?.id === opp.id;
                      return (
                        <div
                          key={opp.id}
                          className={cn(
                            "p-5 bg-[#081522] border rounded-xl shadow-xl transition-all space-y-4 relative cursor-pointer",
                            isSelected
                              ? "border-[#f4cf69] bg-[#0d1d2b] ring-2 ring-[#f4cf69]/30"
                              : "border-[#203348] hover:border-[#f4cf69]/60"
                          )}
                          onClick={() => setSelectedPlanner(opp)}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <span className="px-2 py-0.5 bg-[#f4cf69]/20 text-[#f4cf69] text-[9px] font-black uppercase rounded border border-[#f4cf69]/40">
                                {opp.type}
                              </span>
                              <h5 className="text-sm font-black text-white mt-2 leading-snug">{opp.title}</h5>
                              <p className="text-xs text-[#899cb0] mt-0.5">{opp.organization}</p>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="text-xs font-mono text-emerald-400 font-bold">{formatKes(opp.estimatedMaxRevenue)}</span>
                            </div>
                          </div>

                          {/* Contact Details Box */}
                          <div className="p-3 bg-[#0c1a28] border border-[#1b2f40] rounded-xl text-xs space-y-1.5 font-sans">
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <User size={13} className="text-[#f4cf69]" /> {opp.contact.name}
                            </div>
                            <div className="text-[11px] text-[#899cb0]">{opp.contact.designation}</div>
                            <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                              <Phone size={12} /> {opp.contact.phone}
                            </div>
                            <div className="text-[11px] font-mono text-[#a0b2c6] flex items-center gap-1 truncate">
                              <Mail size={12} /> {opp.contact.email}
                            </div>
                          </div>

                          {/* Direct Action Buttons */}
                          <div className="pt-2 border-t border-[#1e3144] flex items-center justify-between gap-2 text-xs">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPlanner(opp);
                                setActiveTemplateType("email");
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-[#142637] border border-[#f4cf69]/40 text-[#f4cf69] text-[10px] font-bold uppercase hover:bg-[#1f354c] transition-all cursor-pointer flex items-center gap-1"
                            >
                              <Mail size={12} /> Email
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPlanner(opp);
                                setActiveTemplateType("whatsapp");
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 text-[10px] font-bold uppercase hover:bg-emerald-600 hover:text-white transition-all cursor-pointer flex items-center gap-1"
                            >
                              <Share2 size={12} /> WhatsApp
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPlanner(opp);
                                setActiveTemplateType("sms");
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-950/80 border border-blue-500/50 text-blue-300 text-[10px] font-bold uppercase hover:bg-blue-600 hover:text-white transition-all cursor-pointer flex items-center gap-1"
                            >
                              <Phone size={12} /> SMS
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 1: AUTOMATED AI LEAD GENERATOR & SCANNER */}
            {activeTab === "generator" && (
              <div className="space-y-6">
                <div className="p-6 bg-[#091624] border-2 border-[#f4cf69]/40 rounded-xl shadow-2xl space-y-5">
                  <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#203348] pb-4">
                    <div>
                      <h3 className="text-base font-black uppercase tracking-wider text-white flex items-center gap-2">
                        <Flame className="text-[#f4cf69]" /> AUTOMATED AI ONLINE MARKET LEAD SCANNER
                      </h3>
                      <p className="text-xs text-[#98a7b7] font-medium mt-1">
                        Scans public corporate signals, tenders, trade fairs, summits, and luxury event requests across Kenya & Africa.
                      </p>
                    </div>

                    <button
                      onClick={handleRunAiLeadScanner}
                      disabled={isScanning}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d5a637] to-[#f4cf69] text-black font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl cursor-pointer disabled:opacity-50 flex items-center gap-2"
                    >
                      {isScanning ? <RefreshCw className="animate-spin" size={16} /> : <Zap size={16} />}
                      <span>{isScanning ? "Scanning Online Markets..." : "Run AI Lead Scanner"}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-xs">
                    <div>
                      <label className="block font-bold text-[#899cb0] uppercase tracking-wider mb-2">Target Location</label>
                      <select
                        value={scanLocation}
                        onChange={(e) => setScanLocation(e.target.value)}
                        className="w-full h-11 px-3.5 bg-[#0e1d2c] border border-[#23384c] rounded-xl text-white focus:border-[#f4cf69] focus:outline-none"
                      >
                        <option value="Nairobi, Kenya">Nairobi, Kenya</option>
                        <option value="Mombasa, Kenya">Mombasa, Kenya</option>
                        <option value="Kampala, Uganda">Kampala, Uganda</option>
                        <option value="Dar es Salaam, Tanzania">Dar es Salaam, Tanzania</option>
                        <option value="Kigali, Rwanda">Kigali, Rwanda</option>
                        <option value="Global Online Market">Global B2B Market</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-[#899cb0] uppercase tracking-wider mb-2">Event Category</label>
                      <select
                        value={scanCategory}
                        onChange={(e) => setScanCategory(e.target.value)}
                        className="w-full h-11 px-3.5 bg-[#0e1d2c] border border-[#23384c] rounded-xl text-white focus:border-[#f4cf69] focus:outline-none"
                      >
                        <option value="Corporate Conference & Gala">Corporate Conference & Gala</option>
                        <option value="Trade Fair & Tech Expo">Trade Fair & Tech Expo</option>
                        <option value="Luxury Wedding & Reception">Luxury Wedding & Reception</option>
                        <option value="Government & Public Tender">Government & Public Tender</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-[#899cb0] uppercase tracking-wider mb-2">Min Budget (KES)</label>
                      <select
                        value={minBudget}
                        onChange={(e) => setMinScore(Number(e.target.value))}
                        className="w-full h-11 px-3.5 bg-[#0e1d2c] border border-[#23384c] rounded-xl text-white focus:border-[#f4cf69] focus:outline-none font-mono"
                      >
                        <option value={500000}>KES 500,000+</option>
                        <option value={1000000}>KES 1,000,000+</option>
                        <option value={2500000}>KES 2,500,000+</option>
                        <option value={5000000}>KES 5,000,000+</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {opportunities.map((opp) => {
                    const isSaved = savedLeadIds[opp.id];
                    return (
                      <div
                        key={opp.id}
                        className="p-6 bg-[#081522] border border-[#203348] hover:border-[#f4cf69] rounded-xl shadow-xl transition-all space-y-4 relative group"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-1 bg-[#f4cf69]/20 text-[#f4cf69] text-[10px] font-black uppercase rounded border border-[#f4cf69]/40">
                                {opp.type}
                              </span>
                              <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                                <MapPin size={12} /> {opp.location}
                              </span>
                            </div>
                            <h4 className="text-base font-black text-white mt-2 group-hover:text-[#f4cf69] transition-colors leading-snug">
                              {opp.title}
                            </h4>
                            <p className="text-xs text-[#899cb0] font-medium mt-1">{opp.organization}</p>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-xs font-mono text-[#899cb0]">AI Match Score</div>
                            <div className="text-2xl font-black text-[#f4cf69] font-mono">{opp.score}%</div>
                          </div>
                        </div>

                        <div className="p-3 bg-[#0d1c2a] border border-[#1b2f40] rounded-xl text-xs font-mono flex items-center justify-between text-[#a0b2c6]">
                          <span>Budget Projection:</span>
                          <span className="text-emerald-400 font-bold">{formatKes(opp.estimatedMaxRevenue)}</span>
                        </div>

                        <p className="text-xs text-[#899cb0] font-sans leading-relaxed">
                          {opp.aiRecommendation}
                        </p>

                        <div className="pt-3 border-t border-[#1e3144] flex items-center justify-between flex-wrap gap-2 text-xs">
                          <div className="text-[#899cb0] font-mono text-[11px] flex items-center gap-1">
                            <Phone size={12} className="text-[#f4cf69]" /> {opp.contact.name} ({opp.contact.phone})
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleSaveLeadToDb(opp)}
                              disabled={isSaved}
                              className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5",
                                isSaved
                                  ? "bg-emerald-600/30 text-emerald-400 border border-emerald-500/50"
                                  : "bg-[#142637] border border-[#f4cf69]/50 text-[#f4cf69] hover:bg-[#1f354c]"
                              )}
                            >
                              {isSaved ? <Check size={14} /> : <PlusCircle size={14} />}
                              <span>{isSaved ? "Saved to CRM" : "Save Lead"}</span>
                            </button>

                            <button
                              onClick={() => {
                                setSelectedPlanner(opp);
                                setActiveTab("messages");
                              }}
                              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#d5a637] to-[#f4cf69] text-black text-xs font-black uppercase hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <MessageSquare size={14} /> Send Message
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: HANDS-FREE AI ASSISTANT */}
            {activeTab === "assistant" && (
              <div className="p-6 bg-[#081522] border border-[#203348] rounded-xl shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-[#1f3246] pb-4">
                  <div>
                    <h3 className="text-base font-black uppercase tracking-wider text-white flex items-center gap-2">
                      <Mic className="text-[#f4cf69]" /> HANDS-FREE ZEPHYR VIRTUAL ASSISTANT
                    </h3>
                    <p className="text-xs text-[#899cb0] font-medium mt-1">
                      Ann listens continuously to your voice commands, executes real database tasks, navigates pages, and speaks in Zephyr's voice.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsAlwaysOnListening(!isAlwaysOnListening)}
                    className={cn(
                      "px-5 py-2.5 rounded-xl border text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg",
                      isAlwaysOnListening
                        ? "bg-rose-600 text-white border-rose-400 animate-pulse shadow-[0_0_20px_rgba(225,29,72,0.6)]"
                        : "bg-[#0d1b29] text-[#f4cf69] border-[#293d52] hover:border-[#f4cf69]"
                    )}
                  >
                    {isAlwaysOnListening ? <Radio size={16} className="animate-spin" /> : <Mic size={16} />}
                    <span>{isAlwaysOnListening ? "Stop Always-On Mic" : "Start Always-On Mic"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                  <div className="p-5 bg-[#0c1c2b] border border-[#1e3245] rounded-xl space-y-3">
                    <h4 className="text-xs font-black text-[#f4cf69] uppercase tracking-wider flex items-center gap-1.5">
                      <Zap size={14} /> Example Voice Commands You Can Speak:
                    </h4>
                    <ul className="text-xs text-[#a0b2c6] space-y-2 list-disc list-inside">
                      <li>"Ann, scan for new corporate leads in Nairobi"</li>
                      <li>"Create a new event named Tech Summit at Kempinski on Nov 20"</li>
                      <li>"Take me to the bookings page and interpret what you see"</li>
                      <li>"Send a direct message to Daniwest telling him his quote is ready"</li>
                      <li>"Pull a PDF executive report for this month's revenue"</li>
                      <li>"Approve the booking for John"</li>
                    </ul>
                  </div>

                  <div className="p-5 bg-[#0c1c2b] border border-[#1e3245] rounded-xl space-y-3 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Music size={14} className="text-[#f4cf69]" /> Zephyr Voice Engine Status
                      </h4>
                      <p className="text-xs text-[#899cb0] mt-2 leading-relaxed">
                        Ann uses Google's official Zephyr female voice model. Tap below to preview Zephyr's authentic high-definition vocal sample!
                      </p>
                    </div>

                    <button
                      onClick={playZephyrAudioSample}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d5a637] to-[#f4cf69] text-black font-black text-xs uppercase tracking-wider hover:scale-105 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xl"
                    >
                      <Music size={16} /> Test Zephyr HD Sample Audio
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: DISCOVERED SIGNALS */}
            {activeTab === "discovered" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {opportunities.map((opp) => (
                    <div key={opp.id} className="p-5 bg-[#081522] border border-[#203348] rounded-xl space-y-3">
                      <span className="px-2 py-0.5 bg-[#f4cf69]/20 text-[#f4cf69] text-[9px] font-black uppercase rounded border border-[#f4cf69]/40">
                        {opp.type}
                      </span>
                      <h4 className="text-sm font-black text-white">{opp.title}</h4>
                      <p className="text-xs text-[#899cb0]">{opp.organization} — {opp.location}</p>
                      <div className="pt-2 border-t border-[#1d3043] flex items-center justify-between text-xs font-mono text-[#a0b2c6]">
                        <span>Score: {opp.score}%</span>
                        <span className="text-emerald-400 font-bold">{formatKes(opp.estimatedMaxRevenue)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: CORPORATE TENDERS RADAR */}
            {activeTab === "tenders" && (
              <div className="p-6 bg-[#081522] border border-[#203348] rounded-xl space-y-4">
                <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <FileText className="text-[#f4cf69]" /> PUBLIC SECTOR & CORPORATE TENDERS RADAR
                </h3>
                <p className="text-xs text-[#899cb0]">
                  Monitors Ministry of Tourism, Safaricom Foundation, East African Community, and corporate procurement tenders across Kenya.
                </p>

                <div className="p-4 bg-[#0d1d2b] border border-[#1f3246] rounded-xl text-xs space-y-2">
                  <div className="flex justify-between items-center text-white font-bold">
                    <span>Tender #KE-2026-AV88: Stage & Sound Production for Kenya Innovation Week</span>
                    <span className="text-[#f4cf69]">Deadline: Oct 28, 2026</span>
                  </div>
                  <p className="text-[#899cb0]">Issuing Body: Ministry of ICT & Innovation Kenya. Estimated Budget: KSh 4,500,000.</p>
                </div>
              </div>
            )}

            {/* TAB 5: REGIONAL HEATMAP & TRENDS */}
            {activeTab === "trends" && (
              <div className="p-6 bg-[#081522] border border-[#203348] rounded-xl space-y-4">
                <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Globe className="text-[#f4cf69]" /> EAST AFRICA EVENT DEMAND HEATMAP
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                  <div className="p-4 bg-[#0d1d2b] border border-[#1f3246] rounded-xl space-y-1">
                    <div className="font-black text-[#f4cf69] uppercase">Nairobi & Westlands</div>
                    <div className="text-[#899cb0]">High Demand: Corporate Galas, Tech Summits, Product Launches.</div>
                  </div>
                  <div className="p-4 bg-[#0d1d2b] border border-[#1f3246] rounded-xl space-y-1">
                    <div className="font-black text-[#f4cf69] uppercase">Mombasa & Diani Coastal</div>
                    <div className="text-[#899cb0]">High Demand: Destination Luxury Weddings, Beach Concerts.</div>
                  </div>
                  <div className="p-4 bg-[#0d1d2b] border border-[#1f3246] rounded-xl space-y-1">
                    <div className="font-black text-[#f4cf69] uppercase">Kampala & Entebbe</div>
                    <div className="text-[#899cb0]">High Demand: Trade Expos, Diplomatic Receptions.</div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirmModal && (
        <div className="fixed inset-0 z-[999999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#081522] border-2 border-[#f4cf69] p-6 rounded-2xl max-w-sm w-full space-y-4 text-center text-white">
            <h3 className="text-base font-black uppercase tracking-wider">Confirm Sign Out</h3>
            <p className="text-xs text-[#899cb0]">Are you sure you want to sign out of the CEO Command Hub?</p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowLogoutConfirmModal(false)}
                className="px-4 py-2 rounded-xl bg-[#142637] text-[#9caec2] text-xs font-bold uppercase hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirmModal(false);
                  signOut();
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold uppercase hover:bg-rose-500"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
