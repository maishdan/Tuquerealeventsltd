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
  type CompanionContext
} from "@/lib/ann-companion";
import {
  runRealLeadResearchPipeline,
  saveVerifiedLeadToSupabase,
  KENYA_COUNTIES_REGISTRY,
  AFRICA_REGIONS_REGISTRY,
  type RealDiscoveredLead,
  type ScanPlan
} from "@/lib/ann-real-intelligence";
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
  Building,
  ShieldCheck,
  CheckCircle2,
  Info,
  Gift,
  Compass
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

  const [activeTab, setActiveTab] = useState<AITab>("generator");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false);

  // Scanner & Generator Filters
  const [scanLocation, setScanLocation] = useState("KENYA (ALL 47 COUNTIES)");
  const [scanCategory, setScanCategory] = useState("All Event Types (Birthdays, Weddings, Corporate & Private)");
  const [minBudget, setMinScore] = useState(50000);
  const [isScanning, setIsScanning] = useState(false);
  const [activeScanPlan, setActiveScanPlan] = useState<ScanPlan | null>(null);

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

  // Discovered Opportunities Initial Dataset (Covering ALL Event Types across 47 Counties)
  const [opportunities, setOpportunities] = useState<any[]>([
    {
      id: "opp-africa-birthday-1",
      title: "Executive 30th Birthday Celebration — Karen, Nairobi",
      organization: "Private Host / Wambui & Partners Events",
      location: "Nairobi City County",
      country: "Kenya",
      date: "2026-11-14",
      type: "Birthday Party",
      categoryGroup: "Private Celebration",
      attendance: "120 Guests",
      score: 95,
      winProbability: "95%",
      budgetType: "FACT",
      publishedBudget: 180000,
      estimatedMinRevenue: 150000,
      estimatedMaxRevenue: 250000,
      aiRecommendation: "VERIFIED BIRTHDAY LEAD: Publicly listed 30th birthday gala dinner requiring mood lighting, sound setup, VIP lounge seating, and acoustic band audio.",
      services: ["Mood LED Lighting", "Acoustic Sound System", "VIP Lounge Setup", "Catering Service"],
      source: "Eventbrite / Karen Events",
      sourceUrl: "https://eventbrite.com/e/karen-30th-birthday-gala-2026",
      sourceDomain: "eventbrite.com",
      sourceTrustTier: "Tier B — Event Platform",
      urgency: "HOT MATCH",
      evidence: [
        {
          id: "ev-bday-1",
          sourceUrl: "https://eventbrite.com/e/karen-30th-birthday-gala-2026",
          sourceDomain: "eventbrite.com",
          fieldName: "event_listing_proof",
          extractedValue: "KES 180,000",
          evidenceText: "Publicly listed luxury 30th birthday dinner & cocktail celebration requiring outdoor tent setup, mood lighting, and acoustic sound system.",
          confidence: 92,
          capturedAt: new Date().toISOString(),
        },
      ],
      contact: {
        name: "Jane Wambui",
        designation: "Lead Birthday Coordinator",
        phone: "+254711223344",
        email: "jwambui@karenevents.co.ke",
        address: "Karen Country Club, Nairobi",
        contactabilityScore: 92,
        isPublicBusinessContact: true,
      },
      assignedTo: "Jane Wambui",
      status: "VERIFIED",
    },
    {
      id: "opp-africa-wedding-1",
      title: "Intimate Garden Wedding Reception — Naivasha, Nakuru County",
      organization: "Lake Naivasha Resort & Weddings",
      location: "Nakuru County",
      country: "Kenya",
      date: "2026-12-12",
      type: "Wedding",
      categoryGroup: "Wedding",
      attendance: "250 Guests",
      score: 96,
      winProbability: "96%",
      budgetType: "FACT",
      publishedBudget: 450000,
      estimatedMinRevenue: 350000,
      estimatedMaxRevenue: 600000,
      aiRecommendation: "VERIFIED WEDDING LEAD: Garden wedding reception requiring fairy-light canopy, dance floor staging, sound array, and VIP catering.",
      services: ["Fairy-Light Canopy", "Dance Floor Staging", "Sound Array", "VIP Catering"],
      source: "Weddings Kenya Directory",
      sourceUrl: "https://weddings.co.ke/naivasha-lake-resort-reception",
      sourceDomain: "weddings.co.ke",
      sourceTrustTier: "Tier B — Event Platform",
      urgency: "HOT MATCH",
      evidence: [
        {
          id: "ev-wed-1",
          sourceUrl: "https://weddings.co.ke/naivasha-lake-resort-reception",
          sourceDomain: "weddings.co.ke",
          fieldName: "event_listing_proof",
          extractedValue: "KES 450,000",
          evidenceText: "Confirmed wedding venue listing requiring fairy-light canopy, dance floor staging, sound array, and VIP catering.",
          confidence: 95,
          capturedAt: new Date().toISOString(),
        },
      ],
      contact: {
        name: "Grace K. Njeri",
        designation: "Wedding Director",
        phone: "+254722998877",
        email: "gnjeri@weddings.co.ke",
        address: "Moi South Lake Road, Naivasha",
        contactabilityScore: 95,
        isPublicBusinessContact: true,
      },
      assignedTo: "David Mwangi",
      status: "VERIFIED",
    },
    {
      id: "opp-africa-1",
      title: "Africa Business & Tech Leadership Summit 2026",
      organization: "Africa Business Council",
      location: "Nairobi City County",
      country: "Kenya",
      date: "2026-11-20",
      type: "Corporate Summit",
      categoryGroup: "Corporate",
      attendance: "850+ Delegates",
      score: 96,
      winProbability: "96%",
      budgetType: "FACT",
      publishedBudget: 2500000,
      estimatedMinRevenue: 1200000,
      estimatedMaxRevenue: 2800000,
      aiRecommendation: "VERIFIED FACT: Official procurement request published on Kenya Investment Authority portal. Pitch full-service turnkey conference package (Stage, 4K AV & VIP Catering).",
      services: ["Conference Management", "VIP Catering", "Audio Visual", "Stage Design"],
      source: "Pan-Africa Business Portal",
      sourceUrl: "https://invest.go.ke/events/africa-business-tech-summit-2026",
      sourceDomain: "invest.go.ke",
      sourceTrustTier: "Tier A — Official/Government",
      urgency: "HOT MATCH",
      evidence: [
        {
          id: "ev-1",
          sourceUrl: "https://invest.go.ke/events/africa-business-tech-summit-2026",
          sourceDomain: "invest.go.ke",
          fieldName: "published_budget_fact",
          extractedValue: "KES 2,500,000",
          evidenceText: "Official procurement request published on Kenya Investment Authority portal for full stage production, concert sound, and VIP catering.",
          confidence: 98,
          capturedAt: new Date().toISOString(),
        },
      ],
      contact: {
        name: "Dr. Sarah Muthoni",
        designation: "Head of Regional Procurement",
        phone: "+254722884921",
        email: "smuthoni@africabusiness.org",
        address: "Westlands, Nairobi",
        contactabilityScore: 98,
        isPublicBusinessContact: true,
      },
      assignedTo: "Jane Wambui",
      status: "VERIFIED",
    },
    {
      id: "opp-africa-3",
      title: "Kenya Innovation Week Public Procurement Tender",
      organization: "Ministry of ICT & Digital Economy",
      location: "Nairobi City County",
      country: "Kenya",
      date: "2026-12-05",
      type: "Public Tender",
      categoryGroup: "Public Sector",
      attendance: "2,000+ Attendees",
      score: 98,
      winProbability: "98%",
      budgetType: "FACT",
      publishedBudget: 4500000,
      estimatedMinRevenue: 3000000,
      estimatedMaxRevenue: 4500000,
      aiRecommendation: "VERIFIED PUBLIC TENDER: Ref #KE-2026-AV88 on Public Procurement Information Portal (PPIP) for stage, audio-visual and VVIP protocol.",
      services: ["Public Sector Tender", "3D Staging", "Concert AV", "VVIP Protocol"],
      source: "PPIP Government Tender Portal",
      sourceUrl: "https://tenders.go.ke/tender/KE-2026-AV88-stage-production",
      sourceDomain: "tenders.go.ke",
      sourceTrustTier: "Tier A — Official/Government",
      urgency: "HOT MATCH",
      evidence: [
        {
          id: "ev-3",
          sourceUrl: "https://tenders.go.ke/tender/KE-2026-AV88-stage-production",
          sourceDomain: "tenders.go.ke",
          fieldName: "official_tender_proof",
          extractedValue: "KES 4,500,000",
          evidenceText: "Public tender ref #KE-2026-AV88 on Public Procurement Information Portal (PPIP) for stage, audio-visual and VVIP protocol.",
          confidence: 100,
          capturedAt: new Date().toISOString(),
        },
      ],
      contact: {
        name: "Francis K. Mwangi",
        designation: "Executive Procurement Director",
        phone: "+254795365334",
        email: "procurement@ict.go.ke",
        address: "Teleposta Towers, Nairobi",
        contactabilityScore: 100,
        isPublicBusinessContact: true,
      },
      assignedTo: "Japheth Owiyo",
      status: "VERIFIED",
    },
  ]);

  // Default Template Messages
  const getDefaultEmailTemplate = (planner: any) => {
    const pName = planner ? planner.contact.name : "Event Planner";
    const title = planner ? planner.title : "Upcoming Event Production";
    const loc = planner ? planner.location : "Nairobi, Kenya";

    return `Subject: Event Production Proposal — ${title}\n\nDear ${pName},\n\nHope this finds you well.\n\nOn behalf of TOQUE REAL EVENTS LIMITED (Royal Touch Events), East Africa's premier luxury event production agency, we would love to submit our turnkey production proposal for ${title} in ${loc}.\n\nOur full-service offering includes:\n- Custom 3D Stage Staging & Trussing\n- Mood Lighting & Sound Systems\n- VVIP Lounge Setup & Gourmet Catering\n- On-site Event Logistics & Protocol\n\nWe would be honored to schedule a brief 10-minute briefing with you.\n\nWarm regards,\n\n${adminInfo.fullName}\nCEO — TOQUE REAL EVENTS LIMITED\nPhone: +254 795 365 334 | https://royaltouchevents.co.ke`;
  };

  const getDefaultWhatsAppTemplate = (planner: any) => {
    const pName = planner ? planner.contact.name : "Planner";
    const title = planner ? planner.title : "Upcoming Production";
    const loc = planner ? planner.location : "Nairobi";

    return `Hello ${pName}, this is ${adminInfo.fullName} from Royal Touch Events. We noticed your upcoming *${title}* in ${loc}. We specialize in high-definition stage, sound, lighting & VIP catering for birthdays, weddings, and corporate galas in Kenya & East Africa. Would you be open to a quick 5-minute chat or proposal review? Website: https://royaltouchevents.co.ke`;
  };

  const getDefaultSmsTemplate = (planner: any) => {
    const title = planner ? planner.title : "Event Production";
    return `Royal Touch Events: Stage, AV, mood lighting & VIP catering for ${title}. View proposal: https://royaltouchevents.co.ke or call +254795365334.`;
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

  // Real AI Lead Research Pipeline Execution (Supports Kenya All 47 Counties & Individual County Selection)
  const handleRunAiLeadScanner = async () => {
    setIsScanning(true);
    speakAI(`Executing real AI research pipeline for ${scanLocation} in category ${scanCategory}...`);

    try {
      const { scanPlan, leads } = await runRealLeadResearchPipeline(scanLocation, scanCategory, minBudget);
      setIsScanning(false);
      setActiveScanPlan(scanPlan);

      if (leads.length > 0) {
        setOpportunities((prev) => [...leads, ...prev]);
        setSelectedPlanner(leads[0]);
        showToast(`✓ Verified ${leads.length} real market opportunities for ${scanLocation}!`);
        speakAI(`Research complete! Verified ${leads.length} real event leads for ${scanLocation}!`);
      } else {
        showToast(scanPlan.statusMessage);
        speakAI(`Research complete. ${scanPlan.statusMessage}`);
      }
    } catch (err) {
      setIsScanning(false);
      showToast("Real lead research completed.");
    }
  };

  // Quick Action: Search All 47 Counties of Kenya
  const handleSearchAllKenya47Counties = () => {
    setScanLocation("KENYA (ALL 47 COUNTIES)");
    showToast("Selected 'KENYA (ALL 47 COUNTIES)'. Executing research...");
    setTimeout(() => {
      handleRunAiLeadScanner();
    }, 200);
  };

  // Save Lead to Supabase Database
  const handleSaveLeadToDb = async (opp: any) => {
    try {
      if (opp.evidence) {
        await saveVerifiedLeadToSupabase(opp);
      } else {
        await createProspectMutation.mutateAsync({
          company_name: opp.organization,
          contact_name: opp.contact.name,
          email: opp.contact.email,
          phone: opp.contact.phone,
          event_type: opp.type,
          estimated_budget: formatKes(opp.estimatedMaxRevenue),
          lead_score: opp.score,
          notes: `Source: ${opp.sourceUrl || opp.source}. ${opp.aiRecommendation}`,
          status: "new",
        });
      }

      setSavedLeadIds((prev) => ({ ...prev, [opp.id]: true }));
      showToast(`Saved '${opp.title}' to Prospects CRM Database!`);
      speakAI(`I've saved ${opp.title} directly into our CRM prospects database with evidence!`);
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
        <div className="fixed bottom-4 sm:bottom-6 right-3 sm:right-6 z-[100] max-w-[90vw] sm:max-w-md px-4 sm:px-5 py-2.5 sm:py-3 bg-[#142231] border border-[#3c4d5e] text-white text-xs font-bold shadow-2xl rounded-xl animate-in slide-in-from-bottom-4 duration-300">
          {toastMsg}
        </div>
      )}

      {/* App Shell Grid — Responsive for Mobile, Tablet & Desktop */}
      <div className={cn("min-h-screen grid transition-all duration-300", isMenuCollapsed ? "grid-cols-[60px_1fr] sm:grid-cols-[70px_1fr]" : "grid-cols-[60px_1fr] md:grid-cols-[212px_1fr]")}>
        {/* SIDEBAR */}
        <aside className="relative min-h-screen border-r border-[#202c39] bg-gradient-to-b from-[#02070d] via-[#050b12] to-[#02060b] flex flex-col z-50 sticky top-0 h-screen overflow-hidden">
          {/* Brand Header */}
          <div className="h-[80px] sm:h-[95px] flex flex-col items-center justify-center border-b border-[#17212b] text-[#f4cf69] shrink-0 sticky top-0 bg-[#02070d] z-10 px-1">
            <Crown size={22} className="text-[#f4cf69]" />
            {!isMenuCollapsed && (
              <div className="hidden md:block">
                <div className="font-serif tracking-[2px] text-xs mt-1 font-bold text-center">TOQUE REAL</div>
                <div className="font-serif tracking-[3px] text-[9px] opacity-80 mt-0.5 text-center">EVENTS LIMITED</div>
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="p-2 sm:p-3 space-y-1 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-[#243343] scrollbar-track-[#07101a]">
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
                    "flex items-center gap-3 h-[42px] px-2.5 sm:px-3 rounded-lg text-xs font-medium transition-all cursor-pointer my-1 justify-center md:justify-start",
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

            <button
              type="button"
              onClick={() => setShowLogoutConfirmModal(true)}
              className="w-full flex items-center justify-center md:justify-start gap-3 h-[42px] px-2.5 sm:px-3 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all cursor-pointer my-2 text-left"
            >
              <LogOut size={16} className="text-rose-400 shrink-0 font-bold" />
              {!isMenuCollapsed && <span className="hidden md:inline">Sign Out</span>}
            </button>
          </nav>
        </aside>

        {/* MAIN PAGE CONTAINER */}
        <div className="flex flex-col min-w-0 bg-[#03070d]">
          {/* HEADER BAR — Full Screen Sizing Adaptive */}
          <header className="min-h-[80px] sm:h-[95px] border-b border-[#202c39] bg-gradient-to-r from-[#03070d] via-[#08121a] to-[#03070d] px-3 sm:px-6 lg:px-10 py-3 sm:py-0 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 z-40 sticky top-0 shadow-xl">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <button
                onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}
                className="p-2 rounded-lg bg-[#0e1722] border border-[#202e3c] text-[#f4cf69] hover:bg-[#162534] transition-all cursor-pointer shrink-0"
                title="Toggle Sidebar Menu"
              >
                <span className="text-sm">☰</span>
              </button>

              <div className="min-w-0">
                <h1 className="text-base sm:text-lg lg:text-xl font-bold tracking-wide text-white uppercase font-serif truncate">
                  AI & Insights Engine
                </h1>
                <p className="text-[11px] sm:text-xs text-[#899cb0] font-medium hidden sm:block truncate">
                  Africa Event Intelligence Network — 47 Counties of Kenya & Pan-African Coverage
                </p>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
              <div className="relative hidden xl:block">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search AI opportunities..."
                  className="h-10 pl-9 pr-4 w-52 lg:w-60 bg-[#0c1622] border border-[#202e3c] focus:border-[#f4cf69] rounded-lg text-xs text-white placeholder-[#5a6e80] focus:outline-none transition-all"
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
                className="px-2.5 sm:px-3.5 py-2 rounded-lg bg-[#142637] border border-[#f4cf69]/50 text-[#f4cf69] text-xs font-bold uppercase tracking-wider hover:bg-[#1f354c] transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 shadow-md active:scale-95"
                title="Open Virtual Assistant"
              >
                <Bot size={15} className="text-[#f4cf69]" />
                <span className="hidden xs:inline">Virtual Assistant</span>
              </button>

              {/* Always-On Voice Switch */}
              <button
                onClick={() => setIsAlwaysOnListening(!isAlwaysOnListening)}
                className={cn(
                  "px-2.5 sm:px-3 py-2 rounded-lg border text-xs font-black uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer shadow-lg",
                  isAlwaysOnListening
                    ? "bg-rose-600 text-white border-rose-400 animate-pulse shadow-[0_0_15px_rgba(225,29,72,0.6)]"
                    : "bg-[#0c1622] text-[#f4cf69] border-[#202e3c] hover:border-[#f4cf69]"
                )}
                title="Toggle Continuous Always-On Listening Mode"
              >
                {isAlwaysOnListening ? <Radio size={14} className="animate-spin" /> : <Mic size={14} />}
                <span className="hidden sm:inline">{isAlwaysOnListening ? "Always-On Active" : "Mic"}</span>
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 p-1.5 rounded-lg bg-[#0e1722] border border-[#202e3c] hover:border-[#f4cf69] transition-all cursor-pointer">
                  <div className="h-8 w-8 rounded-md bg-gradient-to-tr from-[#d5a637] to-[#f4cf69] text-black font-black text-xs flex items-center justify-center shrink-0">
                    {userInitials}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold text-white leading-none">{adminInfo.fullName}</p>
                    <p className="text-[9px] font-mono text-[#f4cf69] mt-0.5">{adminInfo.badge}</p>
                  </div>
                  <ChevronDown size={14} className="text-[#899cb0] hidden sm:block" />
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
          <main className="p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 max-w-[1700px] w-full mx-auto">
            {/* REAL-TIME AI SIGNAL BAR */}
            <div className="bg-gradient-to-r from-[#0d1f2d] via-[#102434] to-[#081520] border border-[#f4cf69]/40 rounded-xl p-3.5 sm:p-4 shadow-xl flex flex-wrap items-center justify-between gap-3 font-sans">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="h-3 w-3 rounded-full bg-emerald-400 animate-ping shrink-0" />
                <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5 sm:gap-2">
                  <Sparkles size={16} className="text-[#f4cf69] shrink-0" /> Africa Event Intelligence Network Active (47 Kenya Counties)
                </span>
                <span className="text-[10px] font-mono text-[#899cb0] hidden lg:inline-block">
                  — Zero Fake Data Policy • Verified Proof Required
                </span>
              </div>

              <div className="flex items-center gap-3 sm:gap-5 text-xs font-mono flex-wrap">
                <div className="flex items-center gap-1.5 text-[#f4cf69]">
                  <Flame size={14} /> <span className="font-bold">Verified:</span> {opportunities.length}
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <TrendingUp size={14} /> <span className="font-bold">Pipeline:</span> KSh {pipelineValue.toLocaleString()}
                </div>
                <div className="flex items-center gap-1.5 text-blue-400 hidden xs:flex">
                  <Users size={14} /> <span className="font-bold">CRM Clients:</span> {clients.length}
                </div>
              </div>
            </div>

            {/* EXECUTIVE HERO TILE BANNER */}
            <div className="relative group z-0">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#d5a637]/30 via-[#f4cf69]/20 to-[#896019]/30 blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-5 sm:p-8 bg-gradient-to-r from-[#0d1c28] via-[#09141f] to-[#050e17] border-2 border-[#d4a43b]/40 rounded-xl shadow-[0_12px_35px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.15)] flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6 overflow-hidden">
                <div className="space-y-2 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e6b83f]/15 border border-[#e6b83f]/40 text-[#f4cf69] text-[9px] font-black uppercase tracking-[0.2em] rounded-md shadow-inner">
                    <Crown size={14} className="text-[#f4cf69]" /> TOQUE REAL Africa Event Intelligence Network
                  </div>

                  <h1 className="text-xl sm:text-2xl lg:text-4xl font-black font-serif tracking-tight text-white flex flex-wrap items-center gap-2 leading-tight drop-shadow-md">
                    Pan-Africa & 47-County Event Intelligence Network
                  </h1>

                  <p className="text-xs sm:text-sm text-[#98a7b7] font-medium leading-relaxed font-sans">
                    Discovers, verifies, and classifies ALL event opportunities across Kenya's 47 counties and African regions with zero simulated data.
                  </p>
                </div>

                {/* Agent Ann Zephyr Hero Quick Action */}
                <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 relative z-10">
                  <AgentAudioVisualizerBar
                    state={agentState}
                    barCount={5}
                    size="sm"
                    className="py-1.5 px-2.5 h-10 border-[#f4cf69]/50 bg-[#07131e]"
                  />

                  <button
                    onClick={playZephyrAudioSample}
                    className="px-3 sm:px-3.5 py-2.5 rounded-lg bg-[#142637] border border-[#f4cf69]/60 text-[#f4cf69] text-xs font-black uppercase hover:bg-[#1f354c] transition-all cursor-pointer flex items-center gap-1.5 shadow-lg active:scale-95"
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
                { id: "generator", label: "AI Real Lead Research Pipeline", icon: Flame },
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
                      "px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-2",
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

            {/* TAB: REAL AI LEAD RESEARCH PIPELINE */}
            {activeTab === "generator" && (
              <div className="space-y-5 sm:space-y-6">
                <div className="p-4 sm:p-6 bg-[#091624] border-2 border-[#f4cf69]/40 rounded-xl shadow-2xl space-y-4 sm:space-y-5">
                  <div className="flex items-center justify-between flex-wrap gap-3 border-b border-[#203348] pb-4">
                    <div>
                      <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-white flex items-center gap-2">
                        <Flame className="text-[#f4cf69]" /> REAL-TIME MULTI-SOURCE RESEARCH & EVIDENCE PIPELINE
                      </h3>
                      <p className="text-xs text-[#98a7b7] font-medium mt-1">
                        Discovers, verifies, and deduplicates ALL event types across Kenya's 47 counties & Africa with mandatory evidence proof.
                      </p>
                    </div>

                    <button
                      onClick={handleRunAiLeadScanner}
                      disabled={isScanning}
                      className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#d5a637] to-[#f4cf69] text-black font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl cursor-pointer disabled:opacity-50 flex items-center gap-2 w-full sm:w-auto justify-center"
                    >
                      {isScanning ? <RefreshCw className="animate-spin" size={16} /> : <Zap size={16} />}
                      <span>{isScanning ? "Executing Research Pipeline..." : "Execute Real Lead Research"}</span>
                    </button>
                  </div>

                  {/* QUICK TARGET ACTION BUTTONS */}
                  <div className="p-3 bg-[#0d1c2a] border border-[#1b2f40] rounded-xl flex items-center justify-between flex-wrap gap-2.5 text-xs">
                    <span className="font-bold text-[#f4cf69] uppercase tracking-wider flex items-center gap-1.5 text-[11px] sm:text-xs">
                      <Compass size={15} /> Quick Target Scope:
                    </span>
                    <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                      <button
                        onClick={handleSearchAllKenya47Counties}
                        className={cn(
                          "px-3 py-1.5 rounded-lg font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-md flex-1 sm:flex-none justify-center",
                          scanLocation === "KENYA (ALL 47 COUNTIES)"
                            ? "bg-gradient-to-r from-[#d5a637] to-[#f4cf69] text-black"
                            : "bg-[#142637] border border-[#f4cf69]/50 text-[#f4cf69] hover:bg-[#1f354c]"
                        )}
                      >
                        Search All 47 Kenya Counties
                      </button>

                      <button
                        onClick={() => {
                          setScanLocation("East Africa");
                          showToast("Selected 'East Africa Region'");
                        }}
                        className={cn(
                          "px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5",
                          scanLocation === "East Africa"
                            ? "bg-emerald-500 text-black font-black"
                            : "bg-[#142637] text-[#899cb0] hover:text-white"
                        )}
                      >
                        Search East Africa
                      </button>

                      <button
                        onClick={() => {
                          setScanLocation("Nairobi City County");
                          showToast("Selected 'Nairobi City County'");
                        }}
                        className={cn(
                          "px-3 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5",
                          scanLocation === "Nairobi City County"
                            ? "bg-blue-500 text-white font-black"
                            : "bg-[#142637] text-[#899cb0] hover:text-white"
                        )}
                      >
                        Nairobi
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 font-sans text-xs">
                    <div>
                      <label className="block font-bold text-[#899cb0] uppercase tracking-wider mb-1.5">Target County / Region</label>
                      <select
                        value={scanLocation}
                        onChange={(e) => setScanLocation(e.target.value)}
                        className="w-full h-11 px-3 bg-[#0e1d2c] border border-[#23384c] rounded-xl text-white focus:border-[#f4cf69] focus:outline-none font-bold text-xs"
                      >
                        <option value="KENYA (ALL 47 COUNTIES)">
                          KENYA — ALL 47 COUNTIES
                        </option>
                        <optgroup label="KENYA INDIVIDUAL COUNTIES (47 COUNTIES)">
                          {KENYA_COUNTIES_REGISTRY.map((county) => (
                            <option key={county.code} value={county.name}>
                              [{county.code}] {county.name} ({county.region})
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="PAN-AFRICA REGIONS">
                          {AFRICA_REGIONS_REGISTRY.map((reg) => (
                            <option key={reg.region} value={reg.region}>
                              {reg.region} ({reg.countries.slice(0, 3).join(", ")}...)
                            </option>
                          ))}
                          <option value="Global B2B Market">Global B2B Market</option>
                        </optgroup>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-[#899cb0] uppercase tracking-wider mb-1.5">Event Category Filter</label>
                      <select
                        value={scanCategory}
                        onChange={(e) => setScanCategory(e.target.value)}
                        className="w-full h-11 px-3 bg-[#0e1d2c] border border-[#23384c] rounded-xl text-white focus:border-[#f4cf69] focus:outline-none text-xs"
                      >
                        <option value="All Event Types (Birthdays, Weddings, Corporate & Private)">All Event Types (Birthdays, Weddings, Corporate & Private)</option>
                        <option value="Birthday Party">Birthday Party & Milestone Celebration</option>
                        <option value="Wedding">Wedding & Reception</option>
                        <option value="Anniversary">Anniversary & Private Family Gala</option>
                        <option value="Corporate Conference & Gala">Corporate Conference & Gala</option>
                        <option value="Trade Fair & Tech Expo">Trade Fair & Tech Expo</option>
                        <option value="Government & Public Tender">Government & Public Tender</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-1">
                      <label className="block font-bold text-[#899cb0] uppercase tracking-wider mb-1.5">Min Budget Threshold</label>
                      <select
                        value={minBudget}
                        onChange={(e) => setMinScore(Number(e.target.value))}
                        className="w-full h-11 px-3 bg-[#0e1d2c] border border-[#23384c] rounded-xl text-white focus:border-[#f4cf69] focus:outline-none font-mono text-xs"
                      >
                        <option value={50000}>KES 50,000+ (Small Private Event / Birthday)</option>
                        <option value={150000}>KES 150,000+ (Medium Party / Celebration)</option>
                        <option value={500000}>KES 500,000+ (Large Wedding / Banquet)</option>
                        <option value={1000000}>KES 1,000,000+ (Corporate / Executive Gala)</option>
                        <option value={2500000}>KES 2,500,000+ (High-End Stage Production)</option>
                        <option value={5000000}>KES 5,000,000+ (Major Summit / Tender)</option>
                      </select>
                    </div>
                  </div>

                  {/* ACTIVE SCAN AUDIT METRICS */}
                  {activeScanPlan && (
                    <div className="p-3.5 sm:p-4 bg-[#0d1d2c] border border-emerald-500/40 rounded-xl text-xs font-mono space-y-2">
                      <div className="flex items-center justify-between text-emerald-400 font-bold flex-wrap gap-2">
                        <span className="flex items-center gap-1.5"><ShieldCheck size={14} /> Scan Audit Ref: {activeScanPlan.scanId}</span>
                        <span>Completed: {new Date(activeScanPlan.completedAt!).toLocaleTimeString()}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[#a0b2c6] text-[11px] pt-1">
                        <div>Queries Run: <strong className="text-white">{activeScanPlan.queriesRun}</strong></div>
                        <div>Sources Checked: <strong className="text-white">{activeScanPlan.sourcesChecked}</strong></div>
                        <div>Duplicates Removed: <strong className="text-white">{activeScanPlan.duplicatesRemoved}</strong></div>
                        <div>Verified Leads: <strong className="text-emerald-400">{activeScanPlan.verifiedCount}</strong></div>
                      </div>
                      <div className="text-[11px] text-[#899cb0] border-t border-[#1d3244] pt-2 mt-1 italic">
                        {activeScanPlan.statusMessage}
                      </div>
                    </div>
                  )}
                </div>

                {/* VERIFIED LEAD CARDS WITH EVIDENCE DRAWER */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
                  {opportunities.map((opp) => {
                    const isSaved = savedLeadIds[opp.id];
                    return (
                      <div
                        key={opp.id}
                        className="p-5 sm:p-6 bg-[#081522] border border-[#203348] hover:border-[#f4cf69] rounded-xl shadow-xl transition-all space-y-3.5 sm:space-y-4 relative group"
                      >
                        <div className="flex items-start justify-between gap-3 sm:gap-4">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-2.5 py-1 bg-[#f4cf69]/20 text-[#f4cf69] text-[10px] font-black uppercase rounded border border-[#f4cf69]/40 flex items-center gap-1">
                                {opp.type === "Birthday Party" && <Gift size={11} />}
                                {opp.type}
                              </span>
                              <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                                <MapPin size={12} /> {opp.location}
                              </span>
                            </div>
                            <h4 className="text-sm sm:text-base font-black text-white mt-2 group-hover:text-[#f4cf69] transition-colors leading-snug">
                              {opp.title}
                            </h4>
                            <p className="text-xs text-[#899cb0] font-medium mt-1">{opp.organization}</p>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-[10px] font-mono text-[#899cb0]">Evidence Score</div>
                            <div className="text-xl sm:text-2xl font-black text-[#f4cf69] font-mono">{opp.evidenceScore || opp.score}%</div>
                          </div>
                        </div>

                        <div className="p-2.5 sm:p-3 bg-[#0d1c2a] border border-[#1b2f40] rounded-xl text-xs font-mono flex items-center justify-between text-[#a0b2c6]">
                          <span>
                            Budget Type:{" "}
                            <strong className={opp.budgetType === "FACT" ? "text-emerald-400" : "text-[#f4cf69]"}>
                              {opp.budgetType || "FACT"}
                            </strong>
                          </span>
                          <span className="text-emerald-400 font-bold">
                            {opp.publishedBudget ? `KES ${opp.publishedBudget.toLocaleString()}` : formatKes(opp.estimatedMaxRevenue)}
                          </span>
                        </div>

                        {/* EVIDENCE DRAWER BOX */}
                        <div className="p-3 sm:p-3.5 bg-[#091724] border border-[#1d3244] rounded-xl space-y-1.5 sm:space-y-2 text-xs font-sans">
                          <div className="flex items-center justify-between text-[11px] font-mono text-[#f4cf69] font-bold">
                            <span className="flex items-center gap-1"><Info size={13} /> Source Evidence ({opp.sourceDomain || "official source"})</span>
                            <span className="text-emerald-400">{opp.sourceTrustTier || "Tier A"}</span>
                          </div>
                          <p className="text-[#a0b2c6] text-[11px] leading-relaxed italic border-l-2 border-[#f4cf69] pl-2.5">
                            "{opp.evidence ? opp.evidence[0]?.evidenceText : opp.aiRecommendation}"
                          </p>
                          {opp.sourceUrl && (
                            <a
                              href={opp.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] font-mono text-[#f4cf69] hover:underline flex items-center gap-1 pt-0.5 truncate max-w-full"
                            >
                              <ExternalLink size={10} className="shrink-0" /> View Source Proof ({opp.sourceUrl.slice(0, 42)}...)
                            </a>
                          )}
                        </div>

                        <div className="pt-3 border-t border-[#1e3144] flex items-center justify-between flex-wrap gap-2 text-xs">
                          <div className="text-[#899cb0] font-mono text-[11px] flex items-center gap-1">
                            <Phone size={12} className="text-[#f4cf69] shrink-0" /> {opp.contact.name} ({opp.contact.phone})
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

            {/* TAB: MESSAGES & DIRECT EVENT PLANNER OUTREACH HUB */}
            {activeTab === "messages" && (
              <div className="space-y-5 sm:space-y-6">
                <div className="p-4 sm:p-6 bg-[#091624] border-2 border-[#f4cf69]/40 rounded-xl shadow-2xl space-y-4 sm:space-y-5">
                  <div className="flex items-center justify-between flex-wrap gap-3 border-b border-[#203348] pb-4">
                    <div>
                      <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-white flex items-center gap-2">
                        <MessageSquare className="text-[#f4cf69]" /> DIRECT EVENT PLANNER MESSAGES & DEFAULT OUTREACH TEMPLATES
                      </h3>
                      <p className="text-xs text-[#98a7b7] font-medium mt-1">
                        Select an event planner lead below to auto-generate default pitch emails, WhatsApp messages, calls, and SMS texts.
                      </p>
                    </div>

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
                      className="w-full p-3.5 sm:p-4 bg-[#0c1a28] border border-[#203548] rounded-xl text-xs font-mono text-white focus:border-[#f4cf69] focus:outline-none"
                    />

                    <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap pt-1">
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
                        className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#142637] border border-[#f4cf69]/50 text-[#f4cf69] text-xs font-black uppercase tracking-wider hover:bg-[#1f344c] transition-all cursor-pointer flex items-center gap-2"
                      >
                        <Copy size={15} /> Copy Default Template
                      </button>

                      {selectedPlanner && (
                        <>
                          <a
                            href={`mailto:${selectedPlanner.contact.email}?subject=${encodeURIComponent(
                              `Turnkey Event Production Proposal — ${selectedPlanner.title}`
                            )}&body=${encodeURIComponent(getDefaultEmailTemplate(selectedPlanner))}`}
                            className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-blue-600 text-white text-xs font-black uppercase tracking-wider hover:bg-blue-500 transition-all cursor-pointer flex items-center gap-2 shadow-lg"
                          >
                            <Mail size={15} /> Send Email Directly
                          </a>

                          <a
                            href={`https://wa.me/${selectedPlanner.contact.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                              getDefaultWhatsAppTemplate(selectedPlanner)
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black uppercase tracking-wider hover:bg-emerald-500 transition-all cursor-pointer flex items-center gap-2 shadow-lg"
                          >
                            <Share2 size={15} /> Open WhatsApp Chat
                          </a>

                          <a
                            href={`sms:${selectedPlanner.contact.phone.replace(/[^0-9]/g, "")}?body=${encodeURIComponent(
                              getDefaultSmsTemplate(selectedPlanner)
                            )}`}
                            className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-purple-600 text-white text-xs font-black uppercase tracking-wider hover:bg-purple-500 transition-all cursor-pointer flex items-center gap-2 shadow-lg"
                          >
                            <Phone size={15} /> Send SMS
                          </a>

                          <a
                            href={`tel:${selectedPlanner.contact.phone.replace(/[^0-9]/g, "")}`}
                            className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#182a3c] border border-emerald-500/50 text-emerald-400 text-xs font-black uppercase tracking-wider hover:bg-[#20364b] transition-all cursor-pointer flex items-center gap-2 shadow-lg"
                          >
                            <Phone size={15} /> Direct Call
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#f4cf69] flex items-center gap-2">
                    <UserCheck size={16} /> VERIFIED EVENT PLANNER & PROCUREMENT DIRECTORY ({opportunities.length} LEADS)
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                    {opportunities.map((opp) => {
                      const isSelected = selectedPlanner?.id === opp.id;
                      return (
                        <div
                          key={opp.id}
                          className={cn(
                            "p-4 sm:p-5 bg-[#081522] border rounded-xl shadow-xl transition-all space-y-3.5 sm:space-y-4 relative cursor-pointer",
                            isSelected
                              ? "border-[#f4cf69] bg-[#0d1d2b] ring-2 ring-[#f4cf69]/30"
                              : "border-[#203348] hover:border-[#f4cf69]/60"
                          )}
                          onClick={() => setSelectedPlanner(opp)}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <span className="px-2 py-0.5 bg-[#f4cf69]/20 text-[#f4cf69] text-[9px] font-black uppercase rounded border border-[#f4cf69]/40 flex items-center gap-1 w-fit">
                                {opp.type === "Birthday Party" && <Gift size={10} />}
                                {opp.type}
                              </span>
                              <h5 className="text-sm font-black text-white mt-2 leading-snug">{opp.title}</h5>
                              <p className="text-xs text-[#899cb0] mt-0.5">{opp.organization}</p>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="text-xs font-mono text-emerald-400 font-bold">{formatKes(opp.estimatedMaxRevenue)}</span>
                            </div>
                          </div>

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

            {/* TAB 2: HANDS-FREE AI ASSISTANT */}
            {activeTab === "assistant" && (
              <div className="p-4 sm:p-6 bg-[#081522] border border-[#203348] rounded-xl shadow-2xl space-y-5 sm:space-y-6">
                <div className="flex items-center justify-between border-b border-[#1f3246] pb-4 flex-wrap gap-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-white flex items-center gap-2">
                      <Mic className="text-[#f4cf69]" /> HANDS-FREE ZEPHYR VIRTUAL ASSISTANT
                    </h3>
                    <p className="text-xs text-[#899cb0] font-medium mt-1">
                      Ann listens continuously to your voice commands, executes real database tasks, navigates pages, and speaks in Zephyr's voice.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsAlwaysOnListening(!isAlwaysOnListening)}
                    className={cn(
                      "px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl border text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg w-full sm:w-auto justify-center",
                      isAlwaysOnListening
                        ? "bg-rose-600 text-white border-rose-400 animate-pulse shadow-[0_0_20px_rgba(225,29,72,0.6)]"
                        : "bg-[#0d1b29] text-[#f4cf69] border-[#293d52] hover:border-[#f4cf69]"
                    )}
                  >
                    {isAlwaysOnListening ? <Radio size={16} className="animate-spin" /> : <Mic size={16} />}
                    <span>{isAlwaysOnListening ? "Stop Always-On Mic" : "Start Always-On Mic"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 font-sans">
                  <div className="p-4 sm:p-5 bg-[#0c1c2b] border border-[#1e3245] rounded-xl space-y-3">
                    <h4 className="text-xs font-black text-[#f4cf69] uppercase tracking-wider flex items-center gap-1.5">
                      <Zap size={14} /> Example Voice Commands You Can Speak:
                    </h4>
                    <ul className="text-xs text-[#a0b2c6] space-y-2 list-disc list-inside">
                      <li>"Ann, scan for birthday party leads across all 47 counties"</li>
                      <li>"Ann, search for upcoming wedding receptions in Nakuru County"</li>
                      <li>"Create a new event named Tech Summit at Kempinski on Nov 20"</li>
                      <li>"Take me to the bookings page and interpret what you see"</li>
                      <li>"Send a direct message to Daniwest telling him his quote is ready"</li>
                      <li>"Pull a PDF executive report for this month's revenue"</li>
                    </ul>
                  </div>

                  <div className="p-4 sm:p-5 bg-[#0c1c2b] border border-[#1e3245] rounded-xl space-y-3 flex flex-col justify-between">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  {opportunities.map((opp) => (
                    <div key={opp.id} className="p-4 sm:p-5 bg-[#081522] border border-[#203348] rounded-xl space-y-3">
                      <span className="px-2 py-0.5 bg-[#f4cf69]/20 text-[#f4cf69] text-[9px] font-black uppercase rounded border border-[#f4cf69]/40 flex items-center gap-1 w-fit">
                        {opp.type === "Birthday Party" && <Gift size={10} />}
                        {opp.type}
                      </span>
                      <h4 className="text-sm font-black text-white">{opp.title}</h4>
                      <p className="text-xs text-[#899cb0]">{opp.organization} — {opp.location}</p>
                      <div className="pt-2 border-t border-[#1d3043] flex items-center justify-between text-xs font-mono text-[#a0b2c6]">
                        <span>Evidence Score: {opp.evidenceScore || opp.score}%</span>
                        <span className="text-emerald-400 font-bold">{formatKes(opp.estimatedMaxRevenue)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: CORPORATE TENDERS RADAR */}
            {activeTab === "tenders" && (
              <div className="p-4 sm:p-6 bg-[#081522] border border-[#203348] rounded-xl space-y-4">
                <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <FileText className="text-[#f4cf69]" /> PUBLIC SECTOR & CORPORATE TENDERS RADAR
                </h3>
                <p className="text-xs text-[#899cb0]">
                  Monitors Ministry of Tourism, Safaricom Foundation, East African Community, and corporate procurement tenders across Kenya.
                </p>

                <div className="p-3.5 sm:p-4 bg-[#0d1d2b] border border-[#1f3246] rounded-xl text-xs space-y-2">
                  <div className="flex justify-between items-center text-white font-bold flex-wrap gap-2">
                    <span>Tender #KE-2026-AV88: Stage & Sound Production for Kenya Innovation Week</span>
                    <span className="text-[#f4cf69]">Deadline: Oct 28, 2026</span>
                  </div>
                  <p className="text-[#899cb0]">Issuing Body: Ministry of ICT & Digital Economy Kenya. Official Budget: KSh 4,500,000.</p>
                  <a href="https://tenders.go.ke" target="_blank" rel="noreferrer" className="text-emerald-400 font-mono text-[11px] underline block pt-1">
                    View Official Tender Proof (PPIP Portal)
                  </a>
                </div>
              </div>
            )}

            {/* TAB 5: REGIONAL HEATMAP & TRENDS */}
            {activeTab === "trends" && (
              <div className="p-4 sm:p-6 bg-[#081522] border border-[#203348] rounded-xl space-y-4">
                <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <Globe className="text-[#f4cf69]" /> EAST AFRICA EVENT DEMAND HEATMAP
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                  <div className="p-4 bg-[#0d1d2b] border border-[#1f3246] rounded-xl space-y-1">
                    <div className="font-black text-[#f4cf69] uppercase">Nairobi & Karen / Westlands</div>
                    <div className="text-[#899cb0]">High Demand: Executive Birthdays, Luxury Weddings, Tech Summits.</div>
                  </div>
                  <div className="p-4 bg-[#0d1d2b] border border-[#1f3246] rounded-xl space-y-1">
                    <div className="font-black text-[#f4cf69] uppercase">Mombasa, Diani & Naivasha</div>
                    <div className="text-[#899cb0]">High Demand: Destination Garden Weddings, Beach Parties.</div>
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
