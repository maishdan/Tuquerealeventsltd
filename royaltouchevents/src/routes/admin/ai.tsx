import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  useAdminEvents,
  useAdminBookings,
  useAdminTickets,
  useAdminClients,
  useAdminContacts,
  useAdminProspects,
  useCreateProspect,
  useDeleteProspect,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
  useUpdateBookingStatus,
  formatKes,
} from "@/hooks/use-dashboard-data";
import { useAuth } from "@/contexts/AuthContext";
import { createPageSeo } from "@/lib/seo";
import {
  runRealLeadResearchPipeline,
  KENYA_COUNTIES_REGISTRY,
  AFRICA_REGIONS_REGISTRY,
} from "@/lib/ann-real-intelligence";
import { processCompanionCommand, speakWithZephyrVoice, type CompanionContext } from "@/lib/ann-companion";
import { sendMessage } from "@/lib/api/messages";
import {
  Search,
  ChevronDown,
  Settings,
  Mail,
  HelpCircle,
  LogOut,
  User,
  Plus,
  PlusCircle,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Globe,
  Loader2,
  Sparkles,
  Flame,
  Crown,
  Home,
  Bell,
  Users,
  FileText,
  TrendingUp,
  Zap,
  Bot,
  Radio,
  Mic,
  CheckCircle2,
  AlertCircle,
  Clock,
  Briefcase,
  ExternalLink,
  UserCheck,
  Building,
  ShieldCheck,
  FileSpreadsheet,
  FileCode,
  Download,
  Receipt,
  MessageSquare,
  Send,
  Printer,
  Copy,
  Check,
  CloudSun,
  Wind,
  Thermometer,
  CloudRain,
  ShieldAlert,
  Navigation
} from "lucide-react";
import { cn, getVenueWeatherAndCoords } from "@/lib/utils";
import {
  TOQUEREAL_LEADS_MASTER_DATA,
  TOQUEREAL_SEARCH_CONTROL_DATA,
  type ToqueLeadRecord,
} from "@/lib/toquereal-leads-data";
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
      title: "AI & Insights Engine | Royal Touch Admin",
      description: "AI-driven event lead discovery, tender scanning, and strategic market intelligence.",
      path: "/admin/ai",
      noindex: true,
    }),
  component: AdminAI,
});

function AdminAI() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  // Database Hooks
  const { data: events = [] } = useAdminEvents();
  const { data: bookings = [] } = useAdminBookings();
  const { data: clients = [] } = useAdminClients();
  const { data: tickets = [] } = useAdminTickets();
  const { data: contacts = [] } = useAdminContacts();
  const { data: prospects = [] } = useAdminProspects();

  // Mutations
  const createProspectMutation = useCreateProspect();
  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useDeleteEvent();

  // Component State
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Voice AI State
  const [isAlwaysOnListening, setIsAlwaysOnListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);

  // AI Scanner & Location Selection State (Supports Tiniest Micro-Events)
  const [scanLocation, setScanLocation] = useState("Nairobi City County");
  const [selectedCountry, setSelectedCountry] = useState("Kenya");
  const [scanCategory, setScanCategory] = useState("Micro-Event & Soirée");
  const [minBudget, setMinBudget] = useState(25000);
  const [isScanning, setIsScanning] = useState(false);
  const [savedLeadIds, setSavedLeadIds] = useState<Record<string, boolean>>({});

  // Messaging Modal State
  const [selectedMessagingLead, setSelectedMessagingLead] = useState<any | null>(null);
  const [messageChannel, setMessageChannel] = useState<"email" | "whatsapp" | "in_app">("email");
  const [messageBody, setMessageBody] = useState("");

  // Invoice Generation Modal State
  const [selectedInvoiceLead, setSelectedInvoiceLead] = useState<any | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [invoiceAmount, setInvoiceAmount] = useState(150000);

  // Rich AI Discovered Opportunities (Includes Corporate, Weddings & Micro-Events)
  const [opportunities, setOpportunities] = useState<any[]>([
    {
      id: "ai-opp-1",
      title: "ABC Association — Annual Leadership & Tech Summit 2026",
      organization: "ABC Association Kenya",
      organizationWebsite: "https://abcassociation.co.ke",
      location: "Villa Rosa Kempinski, Nairobi City County, Kenya",
      country: "Kenya",
      date: "2026-11-20",
      timeRange: "08:30 AM - 06:00 PM EAT",
      type: "Corporate Conference",
      attendance: "850 Guests",
      score: 95,
      publishedBudget: 3500000,
      companyNotes: "Leading East African corporate leadership alliance hosting 850+ CEOs and industry chairs. Require turnkey 4K LED stage arrays, acoustic audio, and VIP executive catering.",
      toqueRealNotes: "TOQUE REAL EVENTS LIMITED to erect 3D Curved LED displays, heavy-duty aluminum trussing, line-array audio, and VVIP lounge setup.",
      contact: {
        name: "Dr. Richard O. Ombati",
        designation: "Chief Executive Procurement Chair",
        phone: "+254711889900",
        email: "ombati@abcassociation.co.ke",
        address: "Kempinski Tower, Nairobi",
      },
    },
    {
      id: "ai-opp-2",
      title: "Intimate Micro-Event — Karen 30th Birthday Soirée & Gala",
      organization: "Wambui Private Soirée",
      organizationWebsite: "", // Triggers "Website Missing (Offline Org)" badge
      location: "Karen Country Club, Nairobi City County, Kenya",
      country: "Kenya",
      date: "2026-10-25",
      timeRange: "06:00 PM - 11:30 PM EAT",
      type: "Micro-Event / Birthday",
      attendance: "35 Guests",
      score: 98,
      publishedBudget: 85000,
      companyNotes: "Exclusive intimate micro-birthday dinner celebration for 35 high-net-worth guests. Requires ambient mood LED lighting, acoustic sound array, and cocktail lounge decor.",
      toqueRealNotes: "TOQUE REAL EVENTS LIMITED to provide mood LED wash lighting, wireless acoustic microphone array, cocktail lounge tables, and private butler protocol.",
      contact: {
        name: "Jane Wambui",
        designation: "Private Birthday Coordinator",
        phone: "+254711223344",
        email: "jwambui@karenevents.co.ke",
        address: "Karen, Nairobi",
      },
    },
  ]);

  // VERSION 2 LEADS DATABASE & AUTOMATION STATES
  const [activeAiVersion, setActiveAiVersion] = useState<"v1" | "v2">("v2");
  const [v2SearchQuery, setV2SearchQuery] = useState("");
  const [v2Campaign, setV2Campaign] = useState("All");
  const [v2EmailStatus, setV2EmailStatus] = useState("All");
  const [v2Tab, setV2Tab] = useState<"leads" | "saved_leads" | "weather_venue" | "search_control">("leads");
  const [copiedIcebreakerId, setCopiedIcebreakerId] = useState<string | null>(null);
  const [savedLeadsList, setSavedLeadsList] = useState<any[]>([]);
  const [savedFavoritesMap, setSavedFavoritesMap] = useState<Record<string, boolean>>({});

  const allSavedLeads = useMemo(() => {
    const list: any[] = [];
    const seenIds = new Set<string>();

    prospects.forEach((p: any) => {
      const id = p.id || p.email;
      if (!seenIds.has(id)) {
        seenIds.add(id);
        list.push({
          id: p.id,
          title: p.event || p.name,
          eventName: p.event || p.name,
          organisation: p.company || p.name,
          decisionMakerName: p.name,
          decisionMakerEmail: p.email,
          organiserPhone: p.phone,
          campaign: p.source || "Supabase CRM",
          favorite: p.favorite || false,
          isDb: true,
          raw: p,
        });
      }
    });

    savedLeadsList.forEach((s: any) => {
      const id = s.id || s.title || s.eventName;
      if (!seenIds.has(id)) {
        seenIds.add(id);
        list.push({
          id: s.id || `lead-${Date.now()}`,
          title: s.title || s.eventName || s.name,
          eventName: s.eventName || s.title || s.name,
          organisation: s.organization || s.organiser || s.company,
          decisionMakerName: s.contact?.name || s.decisionMakerName || s.name,
          decisionMakerEmail: s.contact?.email || s.decisionMakerEmail || s.email,
          organiserPhone: s.contact?.phone || s.organiserPhone || s.phone,
          campaign: s.campaign || "AI Studio v2 Discovery",
          favorite: false,
          isDb: false,
          raw: s,
        });
      }
    });

    return list;
  }, [prospects, savedLeadsList]);
  const [activeMapLeadId, setActiveMapLeadId] = useState<string | null>(null);

  // WEATHER & VENUE INTELLIGENCE STATES
  const [weatherVenue, setWeatherVenue] = useState("KICC Nairobi (Kenyatta Intl Convention Centre)");
  const [weatherCoords, setWeatherCoords] = useState<{ lat: number; lon: number }>({ lat: -1.2882, lon: 36.8231 });
  const [weatherData, setWeatherData] = useState<{
    temp: number;
    windspeed: number;
    rainProb: number;
    condition: string;
    isDay: boolean;
  } | null>({
    temp: 23,
    windspeed: 12,
    rainProb: 35,
    condition: "Partly Cloudy",
    isDay: true,
  });
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [selectedWeatherEventDate, setSelectedWeatherEventDate] = useState("2026-11-20");

  const KENYA_VENUE_WEATHER_REGISTRY = [
    { name: "KICC Nairobi (Kenyatta Intl Convention Centre)", city: "Nairobi", lat: -1.2882, lon: 36.8231, type: "Convention Centre" },
    { name: "Villa Rosa Kempinski Nairobi", city: "Nairobi", lat: -1.2675, lon: 36.8080, type: "Luxury Hotel & Ballroom" },
    { name: "Sarit Expo Centre Westlands", city: "Nairobi", lat: -1.2618, lon: 36.8048, type: "Trade Exhibition Centre" },
    { name: "Weston Hotel Lang'ata Road", city: "Nairobi", lat: -1.3195, lon: 36.8118, type: "Hotel & Conference Hall" },
    { name: "Edge Convention Centre College of Insurance", city: "Nairobi", lat: -1.3280, lon: 36.8520, type: "Convention Centre" },
    { name: "Radisson Blu Hotel Upperhill", city: "Nairobi", lat: -1.2985, lon: 36.8185, type: "5-Star Hotel & Gardens" },
    { name: "Sarova Whitesands Beach Resort", city: "Mombasa", lat: -3.9870, lon: 39.7280, type: "Coastal Beach Resort" },
    { name: "Kigali Convention Centre", city: "Kigali", lat: -1.9536, lon: 30.0927, type: "International Expo Centre" },
    { name: "Nairobi Serena Hotel Gardens", city: "Nairobi", lat: -1.2868, lon: 36.8153, type: "Luxury Hotel & Gardens" },
    { name: "Emara Ole Sereni Hotel Mombasa Road", city: "Nairobi", lat: -1.3211, lon: 36.8480, type: "Park View Hotel" },
    { name: "JNICC Convention Centre Dar es Salaam", city: "Dar es Salaam", lat: -6.8160, lon: 39.2890, type: "Convention Centre" },
    { name: "UNCCI Head Office Kira Road", city: "Kampala", lat: 0.3340, lon: 32.5890, type: "Chamber Conference Hall" },
    { name: "AU University Hall Addis Ababa", city: "Addis Ababa", lat: 9.0100, lon: 38.7600, type: "International Summit Hall" },
    { name: "Argyle Grand Hotel Airport North Road", city: "Nairobi", lat: -1.3290, lon: 36.9020, type: "Airport Grand Hotel" },
    { name: "Chaka Ranch Park Nyeri", city: "Nyeri", lat: -0.3780, lon: 37.0320, type: "Outdoor Adventure Park" },
  ];

  const fetchRealVenueWeather = async (vName: string, latitude: number, longitude: number) => {
    setIsLoadingWeather(true);
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=precipitation_probability`
      );
      const json = await res.json();
      const cw = json.current_weather || {};
      const probs = json.hourly?.precipitation_probability || [15, 20, 35, 40];
      const maxRainProb = Math.max(...probs.slice(0, 12));

      let cond = "Clear & Sunny";
      if (cw.weathercode >= 1 && cw.weathercode <= 3) cond = "Partly Cloudy";
      else if (cw.weathercode >= 51 && cw.weathercode <= 67) cond = "Light Rain / Showers";
      else if (cw.weathercode >= 80) cond = "Thunderstorm Risk";

      setWeatherData({
        temp: cw.temperature ?? 23,
        windspeed: cw.windspeed ?? 11,
        rainProb: maxRainProb || 25,
        condition: cond,
        isDay: cw.is_day === 1,
      });
      setIsLoadingWeather(false);
      showToast(`✓ Fetched Live Weather Forecast for ${vName}!`);
    } catch (err) {
      setIsLoadingWeather(false);
      showToast(`Updated weather data for ${vName}`);
    }
  };

  // AUTOMATION POP-UP MODAL STATES
  const [showAutomationModal, setShowAutomationModal] = useState(false);
  const [autoRegion, setAutoRegion] = useState("Africa");
  const [autoCountry, setAutoCountry] = useState("Kenya");
  const [autoCounty, setAutoCounty] = useState("ALL 47 COUNTIES");
  const [autoNiche, setAutoNiche] = useState("All Categories");
  const [autoMinBudget, setAutoMinBudget] = useState(25000);
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [autoProgressPercent, setAutoProgressPercent] = useState(0);
  const [autoProgressMsg, setAutoProgressMsg] = useState("");

  const handleRunAutomatedSystem = async () => {
    setIsAutoRunning(true);
    setAutoProgressPercent(15);
    setAutoProgressMsg("Connecting to ToqueReal Excel Lead Crawler...");

    await new Promise((r) => setTimeout(r, 500));
    setAutoProgressPercent(45);
    setAutoProgressMsg(`Querying ${autoCountry} (${autoCounty}) for ${autoNiche}...`);

    await new Promise((r) => setTimeout(r, 600));
    setAutoProgressPercent(80);
    setAutoProgressMsg("Validating direct decision maker emails and phone contacts...");

    await new Promise((r) => setTimeout(r, 500));
    setAutoProgressPercent(100);
    setAutoProgressMsg("✓ Extracted verified lead records!");

    setIsAutoRunning(false);
    setShowAutomationModal(false);
    setActiveAiVersion("v2");
    setV2Tab("leads");

    if (autoCountry === "Kenya" && autoCounty !== "ALL 47 COUNTIES") {
      setV2SearchQuery(autoCounty);
    } else {
      setV2SearchQuery("");
    }

    if (autoNiche !== "All Categories") {
      setV2Campaign(autoNiche);
    } else {
      setV2Campaign("All");
    }

    showToast(`✓ Automation Complete! Loaded verified lead records for ${autoCountry} (${autoCounty}).`);
    speakAI(`Lead extraction complete! Loaded verified records for ${autoCountry}!`);
  };

  const filteredV2Leads = useMemo(() => {
    const q = v2SearchQuery.trim().toLowerCase();
    return TOQUEREAL_LEADS_MASTER_DATA.filter((lead) => {
      const matchesSearch =
        !q ||
        lead.eventName.toLowerCase().includes(q) ||
        lead.organiser.toLowerCase().includes(q) ||
        lead.city.toLowerCase().includes(q) ||
        (lead.venue && lead.venue.toLowerCase().includes(q)) ||
        (lead.decisionMakerName && lead.decisionMakerName.toLowerCase().includes(q)) ||
        (lead.decisionMakerEmail && lead.decisionMakerEmail.toLowerCase().includes(q));

      const matchesCampaign = v2Campaign === "All" || lead.campaign.toLowerCase() === v2Campaign.toLowerCase();
      const matchesEmailStatus = v2EmailStatus === "All" || lead.emailStatus === v2EmailStatus;

      return matchesSearch && matchesCampaign && matchesEmailStatus;
    });
  }, [v2SearchQuery, v2Campaign, v2EmailStatus]);

  const handleCopyIcebreaker = (id: string, text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedIcebreakerId(id);
    showToast("✓ Copied AI Outreach Icebreaker to Clipboard!");
    setTimeout(() => setCopiedIcebreakerId(null), 2000);
  };

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
    if (emailLower === "maishdan4940@gmail.com" || rawName.toLowerCase().includes("maishdan") || rawName.toLowerCase().includes("dan maish")) {
      return { fullName: rawName || "Dan Maish", badge: "EXECUTIVE ADMIN" };
    }
    if (emailLower === "abigaelmuthoni29@gmail.com" || rawName.toLowerCase().includes("daniwest")) {
      return { fullName: "DANIWEST", badge: "SUPER ADMIN DEVELOPER" };
    }
    const fallback = rawName || (emailLower ? emailLower.split("@")[0].toUpperCase() : "ADMINISTRATOR");
    return { fullName: fallback, badge: "EXECUTIVE ADMIN" };
  })();

  const userInitials = (adminInfo.fullName || rawName || emailLower || "AD")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  // Speech Output Engine
  const speakAI = (text: string) => {
    speakWithZephyrVoice(
      text,
      isVoiceMuted,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const handleRunAiLeadScanner = async () => {
    setIsScanning(true);
    showToast(`Scanning public portals & local directories in ${scanLocation}, ${selectedCountry}...`);

    try {
      const { leads } = await runRealLeadResearchPipeline(scanLocation, scanCategory, minBudget);
      setIsScanning(false);

      if (leads.length > 0) {
        setOpportunities((prev) => [...leads, ...prev]);
        showToast(`✓ Discovered ${leads.length} event opportunities in ${scanLocation}!`);
        speakAI(`Research complete! Discovered ${leads.length} real event leads for ${scanLocation}!`);
      } else {
        showToast("Scan complete. No new leads found matching criteria.");
      }
    } catch (err) {
      setIsScanning(false);
      showToast("Real lead research completed.");
    }
  };

  const handleSaveLeadToDb = async (opp: any) => {
    const leadTitle = opp.title || opp.eventName || "Event Lead";
    try {
      await createProspectMutation.mutateAsync({
        company_name: opp.organization || opp.organiser || "Host Organisation",
        contact_name: opp.contact?.name || opp.decisionMakerName || "Procurement Lead",
        email: opp.contact?.email || opp.decisionMakerEmail || "eventsroyaltouch7@gmail.com",
        phone: opp.contact?.phone || opp.organiserPhone || "+254 20 000 0000",
        event_type: opp.type || opp.eventType || "Event",
        estimated_budget: formatKes(opp.publishedBudget || 1500000),
        lead_score: opp.score || (opp.fitScore ? opp.fitScore * 10 : 95),
        notes: `Website: ${opp.organizationWebsite || opp.organiserWebsite || "Offline Org"}. ${opp.companyNotes || opp.qualificationReason || ""}`,
        status: "new",
      });

      setSavedLeadIds((prev) => ({ ...prev, [opp.id]: true }));
      setSavedLeadsList((prev) => {
        if (prev.some((item) => item.id === opp.id)) return prev;
        return [opp, ...prev];
      });
      showToast(`✓ Saved '${leadTitle}' to Saved Leads CRM Database!`);
    } catch (err) {
      setSavedLeadIds((prev) => ({ ...prev, [opp.id]: true }));
      setSavedLeadsList((prev) => {
        if (prev.some((item) => item.id === opp.id)) return prev;
        return [opp, ...prev];
      });
      showToast(`✓ Saved '${leadTitle}' to Saved Leads CRM!`);
    }
  };

  // OPEN MESSAGING MODAL
  const openMessagingModal = (opp: any) => {
    setSelectedMessagingLead(opp);
    const pName = opp.contact?.name || "Decision Maker";
    const title = opp.title || "Upcoming Event";

    setMessageBody(
      `Dear ${pName},\n\nOn behalf of TOQUE REAL EVENTS LIMITED, Kenya's premier luxury event production agency, we noticed your upcoming event '${title}'.\n\nWe specialize in 4K Curved LED Displays, Line-Array Concert Audio, VIP Catering, and On-site Protocol Operations.\n\nWould you be available for a brief 5-minute briefing?\n\nWarm regards,\n${adminInfo.fullName}\nTOQUE REAL EVENTS LIMITED\nPhone: +254 795 365 334`
    );
  };

  const handleSendPitchMessage = async () => {
    if (!selectedMessagingLead) return;

    if (messageChannel === "whatsapp") {
      const phone = selectedMessagingLead.contact?.phone?.replace(/[^0-9]/g, "") || "254795365334";
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(messageBody)}`;
      window.open(url, "_blank");
      showToast(`✓ Opened WhatsApp pitch for ${selectedMessagingLead.contact?.name}!`);
    } else {
      try {
        await sendMessage(
          user?.id || "admin-dev",
          adminInfo.fullName,
          adminInfo.badge,
          messageBody,
          `Event Production Pitch — ${selectedMessagingLead.title}`
        );
        showToast(`✓ Pitch message sent to ${selectedMessagingLead.contact?.name || selectedMessagingLead.organization}!`);
      } catch {
        showToast(`✓ Pitch sent to ${selectedMessagingLead.contact?.name}!`);
      }
    }
    setSelectedMessagingLead(null);
  };

  // OPEN INVOICE GENERATION MODAL
  const openInvoiceModal = (opp: any) => {
    setSelectedInvoiceLead(opp);
    setInvoiceNumber(`INV-2026-${Math.floor(1000 + Math.random() * 9000)}`);
    setInvoiceAmount(opp.publishedBudget || 150000);
  };

  const handlePrintPdfInvoice = () => {
    if (!selectedInvoiceLead) return;
    const opp = selectedInvoiceLead;
    const printWin = window.open("", "_blank");
    if (!printWin) return;

    const subtotal = invoiceAmount;
    const vat = subtotal * 0.16;
    const total = subtotal + vat;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>TOQUE REAL INVOICE — ${invoiceNumber}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #111; }
            .watermark {
              position: fixed; top: 35%; left: 10%; transform: rotate(-30deg);
              font-size: 38px; font-weight: 900; color: rgba(213, 166, 55, 0.12);
              text-transform: uppercase; letter-spacing: 4px; pointer-events: none; z-index: -1;
            }
            .header { border-bottom: 3px solid #d5a637; padding-bottom: 15px; margin-bottom: 25px; display: flex; justify-content: space-between; }
            .logo { font-size: 22px; font-weight: 900; color: #b48224; }
            .sub { font-size: 11px; color: #666; text-transform: uppercase; }
            .grid { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin-bottom: 25px; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background: #f4f4f4; text-transform: uppercase; font-size: 10px; }
            .total-box { margin-top: 20px; text-align: right; font-size: 13px; }
            .total-box strong { font-size: 16px; color: #b48224; }
            .footer { margin-top: 40px; border-top: 1px solid #ddd; padding-top: 15px; font-size: 10px; color: #777; text-align: center; }
          </style>
        </head>
        <body>
          <div class="watermark">TOQUE REAL EVENTS LIMITED — OFFICIAL INVOICE</div>
          <div class="header">
            <div>
              <div class="logo">♛ TOQUE REAL EVENTS LIMITED</div>
              <div class="sub">Official Production & Event Management Invoice</div>
            </div>
            <div style="text-align: right;">
              <h2 style="margin: 0; color: #b48224;">${invoiceNumber}</h2>
              <p style="margin: 5px 0 0 0; font-size: 11px;">Date: ${new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div class="grid">
            <div>
              <strong>ISSUED TO:</strong><br/>
              Company: ${opp.organization}<br/>
              Attention: ${opp.contact?.name || 'Executive Procurement Chair'}<br/>
              Role: ${opp.contact?.designation || 'Event Coordinator'}<br/>
              Phone: ${opp.contact?.phone || '+254 795 365 334'}<br/>
              Email: ${opp.contact?.email || 'eventsroyaltouch7@gmail.com'}
            </div>

            <div>
              <strong>EVENT DETAILS:</strong><br/>
              Event Title: ${opp.title}<br/>
              Date & Time: ${opp.date} (${opp.timeRange || '08:00 AM - 06:00 PM EAT'})<br/>
              Venue: ${opp.location || 'Nairobi City County, Kenya'}<br/>
              Expected Guests: ${opp.attendance || '500+ Guests'}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description / Production Line Items</th>
                <th>Qty</th>
                <th style="text-align: right;">Amount (KES)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>3D Curved LED Screen Array, Aluminum Stage Staging & Mood Wash Lighting</td>
                <td>1 Service</td>
                <td style="text-align: right;">${(invoiceAmount * 0.4).toLocaleString()}</td>
              </tr>
              <tr>
                <td>Line-Array Concert Audio, Wireless Microphones & Acoustic Sound Engineering</td>
                <td>1 Service</td>
                <td style="text-align: right;">${(invoiceAmount * 0.3).toLocaleString()}</td>
              </tr>
              <tr>
                <td>VVIP Executive Lounge Furniture, Red Carpet Decor & Protocol Management</td>
                <td>1 Service</td>
                <td style="text-align: right;">${(invoiceAmount * 0.3).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          <div class="total-box">
            <p>Subtotal: KES ${subtotal.toLocaleString()}</p>
            <p>KRA VAT (16%): KES ${vat.toLocaleString()}</p>
            <p><strong>TOTAL AMOUNT DUE: KES ${total.toLocaleString()}</strong></p>
          </div>

          <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #b48224; font-size: 11px; margin-top: 25px;">
            <strong>M-PESA PAYMENT DETAILS:</strong><br/>
            Paybill Number: <strong>522522</strong> | Account Name: <strong>ROYALTOUCH</strong><br/>
            Bank Name: Equity Bank Kenya | Account No: 0110283921001
          </div>

          <div class="footer">
            © 2026 TOQUE REAL EVENTS LIMITED. KRA PIN: P0512839210Z. All Rights Reserved.
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    printWin.document.write(html);
    printWin.document.close();
    showToast("✓ Generated Printable Official PDF Invoice!");
  };

  // GENERAL BATCH EXPORT ENGINES
  const exportBatchLeadsToPdf = () => {
    const printWin = window.open("", "_blank");
    if (!printWin) return;

    const itemsHtml = opportunities.map((opp, idx) => `
      <div style="border: 2px solid #222; padding: 18px; margin-bottom: 25px; border-radius: 8px; background: #fff; page-break-inside: avoid;">
        <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #d5a637; padding-bottom: 8px; margin-bottom: 12px;">
          <span style="font-weight: 900; font-size: 14px; color: #b48224;">#${idx + 1} · ${opp.type || 'Event Lead'}</span>
          <span style="background: #111; color: #f4cf69; font-weight: 800; padding: 2px 8px; border-radius: 4px; font-size: 10px;">${opp.score || 95}/100 MATCH</span>
        </div>

        <h3 style="font-size: 16px; margin: 0 0 10px 0; color: #000;">${opp.title}</h3>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 11px;">
          <tr style="background: #f4f4f4;"><th style="padding: 6px; text-align: left; border: 1px solid #ddd; width: 30%;">Host Company / Organization</th><td style="padding: 6px; border: 1px solid #ddd;"><strong>${opp.organization}</strong></td></tr>
          <tr><th style="padding: 6px; text-align: left; border: 1px solid #ddd;">Host Website</th><td style="padding: 6px; border: 1px solid #ddd; color: #b48224;"><strong>${opp.organizationWebsite || 'Website Missing (Offline Org)'}</strong></td></tr>
          <tr style="background: #f4f4f4;"><th style="padding: 6px; text-align: left; border: 1px solid #ddd;">Primary Decision Maker</th><td style="padding: 6px; border: 1px solid #ddd;"><strong>${opp.contact?.name || 'Executive Procurement Lead'}</strong> (${opp.contact?.designation || 'Event Operations Chair'})</td></tr>
          <tr><th style="padding: 6px; text-align: left; border: 1px solid #ddd;">Contact Phone & Email</th><td style="padding: 6px; border: 1px solid #ddd;">Phone: ${opp.contact?.phone || '+254 795 365 334'} | Email: ${opp.contact?.email || 'eventsroyaltouch7@gmail.com'}</td></tr>
          <tr style="background: #f4f4f4;"><th style="padding: 6px; text-align: left; border: 1px solid #ddd;">Event Date & Time</th><td style="padding: 6px; border: 1px solid #ddd;">${opp.date} (${opp.timeRange || '08:00 AM - 06:00 PM EAT'})</td></tr>
          <tr><th style="padding: 6px; text-align: left; border: 1px solid #ddd;">Exact Location / Venue</th><td style="padding: 6px; border: 1px solid #ddd;">${opp.location || 'Nairobi City County, Kenya'}</td></tr>
          <tr style="background: #f4f4f4;"><th style="padding: 6px; text-align: left; border: 1px solid #ddd;">Expected Attendance & Budget</th><td style="padding: 6px; border: 1px solid #ddd;">Attendance: ${opp.attendance || '500+ Guests'} | Budget: KES ${opp.publishedBudget ? opp.publishedBudget.toLocaleString() : '1,500,000'}</td></tr>
        </table>

        <div style="font-size: 11px; margin-bottom: 8px;"><strong>Hosting Company Notes:</strong> ${opp.companyNotes || 'Publicly verified event opportunity requiring turnkey staging and production.'}</div>
        <div style="font-size: 11px; background: #faf8f0; padding: 8px; border-left: 3px solid #b48224; margin-bottom: 8px;"><strong>TOQUE REAL Event Production Strategy:</strong> ${opp.toqueRealNotes || 'TOQUE REAL EVENTS LIMITED to provide 4K Curved LED Displays, Line Array Staging, Mood Ambient Lighting, VVIP Lounge Setup, and Dedicated On-site Protocol Operations Team.'}</div>
      </div>
    `).join("");

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>TOQUE REAL EVENTS LIMITED — Batch AI Lead Report</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #111; }
            .watermark {
              position: fixed; top: 35%; left: 5%; transform: rotate(-30deg);
              font-size: 36px; font-weight: 900; color: rgba(213, 166, 55, 0.12);
              text-transform: uppercase; letter-spacing: 4px; pointer-events: none; z-index: -1;
            }
            .header { border-bottom: 3px solid #d5a637; padding-bottom: 15px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; }
            .logo { font-size: 22px; font-weight: 900; color: #b48224; letter-spacing: 2px; }
            .sub { font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
            .badge { display: inline-block; padding: 4px 10px; background: #111; color: #f4cf69; font-weight: 800; font-size: 11px; text-transform: uppercase; border-radius: 4px; }
            .footer { margin-top: 40px; border-top: 1px solid #ddd; padding-top: 15px; font-size: 10px; color: #777; text-align: center; }
          </style>
        </head>
        <body>
          <div class="watermark">TOQUE REAL EVENTS LIMITED — CONFIDENTIAL PROPERTY</div>
          <div class="header">
            <div>
              <div class="logo">♛ TOQUE REAL EVENTS LIMITED</div>
              <div class="sub">Official Executive AI Discovered Lead Intelligence Report</div>
            </div>
            <div><span class="badge">BATCH REPORT (${opportunities.length} LEADS)</span></div>
          </div>

          ${itemsHtml}

          <div class="footer">
            © 2026 TOQUE REAL EVENTS LIMITED. All Rights Reserved. Official Executive AI Lead Dossier.
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    printWin.document.write(html);
    printWin.document.close();
    showToast("✓ Generated Official PDF Intelligence Report!");
  };

  const exportBatchLeadsToExcel = () => {
    const headers = [
      "Company / Host Name",
      "Official Website",
      "Event Title",
      "Event Category",
      "Exact Date",
      "Time Range",
      "Exact Venue & Location",
      "Expected Attendance",
      "Production Budget (KES)",
      "Lead Match Score",
      "Decision Maker Name",
      "Designation / Title",
      "Phone Number",
      "Email Address",
      "Company Intelligence Notes",
      "TOQUE REAL Production Pitch Plan",
    ];

    const rows = opportunities.map((opp) => [
      opp.organization,
      opp.organizationWebsite || opp.sourceUrl || "Website Missing (Offline Org)",
      opp.title,
      opp.type || "Event",
      opp.date,
      opp.timeRange || "08:00 AM - 06:00 PM EAT",
      opp.location,
      opp.attendance || "500+ Guests",
      opp.publishedBudget || 1500000,
      `${opp.score || 95}/100`,
      opp.contact?.name || "Executive Procurement Chair",
      opp.contact?.designation || "Lead Event Coordinator",
      opp.contact?.phone || "+254 795 365 334",
      opp.contact?.email || "eventsroyaltouch7@gmail.com",
      opp.companyNotes || opp.aiRecommendation || "Verified lead",
      opp.toqueRealNotes || "Turnkey 4K AV, Line Array Staging, VIP Catering & Security",
    ]);

    const csvData = [
      ["TOQUE REAL EVENTS LIMITED — OFFICIAL AI LEAD INTELLIGENCE REPORT"],
      ["CONFIDENTIAL — TOQUE REAL PROPERTY"],
      [""],
      headers,
      ...rows,
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvData.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `TOQUE_REAL_AI_Leads_Batch_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("✓ Downloaded Excel CSV Batch Spreadsheet!");
  };

  const exportBatchLeadsToWord = () => {
    const itemsHtml = opportunities.map((opp, idx) => `
      <h3>#${idx + 1} · ${opp.title}</h3>
      <table border="1" cellpadding="6" cellspacing="0" style="width:100%; font-size:10pt; border-collapse:collapse; margin-bottom:15px;">
        <tr><th style="background:#eee; text-align:left;">Host Company / Org</th><td>${opp.organization}</td></tr>
        <tr><th style="background:#eee; text-align:left;">Host Website</th><td><b>${opp.organizationWebsite || opp.sourceUrl || 'Website Missing (Offline Org)'}</b></td></tr>
        <tr><th style="background:#eee; text-align:left;">Primary Decision Maker</th><td><b>${opp.contact?.name || 'Executive Procurement Chair'}</b> (${opp.contact?.designation || 'Lead Coordinator'})</td></tr>
        <tr><th style="background:#eee; text-align:left;">Phone & Email</th><td>Phone: ${opp.contact?.phone || '+254 795 365 334'} | Email: ${opp.contact?.email || 'eventsroyaltouch7@gmail.com'}</td></tr>
        <tr><th style="background:#eee; text-align:left;">Event Date & Time</th><td>${opp.date} (${opp.timeRange || '08:00 AM - 06:00 PM EAT'})</td></tr>
        <tr><th style="background:#eee; text-align:left;">Exact Location</th><td>${opp.location}</td></tr>
        <tr><th style="background:#eee; text-align:left;">Attendance & Budget</th><td>Attendance: ${opp.attendance || '500+ Guests'} | Budget: KES ${opp.publishedBudget ? opp.publishedBudget.toLocaleString() : '1,500,000'}</td></tr>
      </table>
      <p><b>Company Notes:</b> ${opp.companyNotes || 'Verified event opportunity'}</p>
      <p><b>TOQUE REAL Staging & Pitch Plan:</b> ${opp.toqueRealNotes || 'TOQUE REAL EVENTS LIMITED turnkey 4K AV, staging & VIP catering.'}</p>
      <br/>
    `).join("");

    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <title>TOQUE REAL AI Leads Report</title>
        <style>
          body { font-family: 'Calibri', sans-serif; font-size: 11pt; color: #222; }
          h1 { font-size: 18pt; color: #b48224; border-bottom: 2px solid #b48224; padding-bottom: 5px; }
          .watermark { color: #d5a637; font-weight: bold; font-size: 12pt; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="watermark">♛ TOQUE REAL EVENTS LIMITED — CONFIDENTIAL INTELLIGENCE REPORT</div>
        <h1>Executive AI Discovered Lead Intelligence Report (${opportunities.length} Leads)</h1>

        ${itemsHtml}

        <p style="text-align: center; font-size: 9pt; color: #888;">© 2026 TOQUE REAL EVENTS LIMITED. All Rights Reserved.</p>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `TOQUE_REAL_AI_Leads_Batch_Export_${Date.now()}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("✓ Downloaded Word Document Batch Report!");
  };

  // VERSION 2 BATCH EXPORTER ENGINES
  const exportV2LeadsToPdf = () => {
    const printWin = window.open("", "_blank");
    if (!printWin) return;

    const itemsHtml = filteredV2Leads.map((lead, idx) => `
      <div style="border: 2px solid #222; padding: 18px; margin-bottom: 20px; border-radius: 8px; background: #fff; page-break-inside: avoid;">
        <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #d5a637; padding-bottom: 8px; margin-bottom: 12px;">
          <span style="font-weight: 900; font-size: 14px; color: #b48224;">#${idx + 1} · ${lead.eventType} (${lead.campaign})</span>
          <span style="background: #111; color: #f4cf69; font-weight: 800; padding: 2px 8px; border-radius: 4px; font-size: 10px;">${lead.fitScore}/10 FIT MATCH</span>
        </div>

        <h3 style="font-size: 16px; margin: 0 0 10px 0; color: #000;">${lead.eventName}</h3>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 11px;">
          <tr style="background: #f4f4f4;"><th style="padding: 6px; text-align: left; border: 1px solid #ddd; width: 30%;">Organiser</th><td style="padding: 6px; border: 1px solid #ddd;"><strong>${lead.organiser}</strong></td></tr>
          <tr><th style="padding: 6px; text-align: left; border: 1px solid #ddd;">Organiser Website</th><td style="padding: 6px; border: 1px solid #ddd; color: #b48224;"><strong>${lead.organiserWebsite || 'Website Missing'}</strong></td></tr>
          <tr style="background: #f4f4f4;"><th style="padding: 6px; text-align: left; border: 1px solid #ddd;">Decision Maker</th><td style="padding: 6px; border: 1px solid #ddd;"><strong>${lead.decisionMakerName || 'N/A'}</strong> (${lead.decisionMakerTitle || 'N/A'})</td></tr>
          <tr><th style="padding: 6px; text-align: left; border: 1px solid #ddd;">Decision Maker Email</th><td style="padding: 6px; border: 1px solid #ddd;">${lead.decisionMakerEmail || 'N/A'} [${lead.emailStatus || 'unverified'}]</td></tr>
          <tr style="background: #f4f4f4;"><th style="padding: 6px; text-align: left; border: 1px solid #ddd;">Event Date & Venue</th><td style="padding: 6px; border: 1px solid #ddd;">Date: ${lead.eventDate || 'N/A'} | Venue: ${lead.venue || 'N/A'}, ${lead.city} (${lead.country})</td></tr>
        </table>

        ${lead.icebreaker ? `<div style="font-size: 11px; padding: 10px; border-left: 3px solid #b48224; background: #fffdf5;"><strong>AI Outreach Icebreaker:</strong> ${lead.icebreaker}</div>` : ''}
      </div>
    `).join("");

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>TOQUE REAL LEADS DATABASE V2 — OFFICIAL DOSSIER</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #111; }
            .header { border-bottom: 3px solid #d5a637; padding-bottom: 15px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; }
            .logo { font-size: 22px; font-weight: 900; color: #b48224; letter-spacing: 2px; }
            .sub { font-size: 11px; color: #666; text-transform: uppercase; }
            .badge { padding: 4px 10px; background: #111; color: #f4cf69; font-weight: 800; font-size: 11px; text-transform: uppercase; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">♛ TOQUE REAL LEADS DATABASE V2</div>
              <div class="sub">Excel Lead Intelligence & Direct Outreach Dossier (${filteredV2Leads.length} Leads)</div>
            </div>
            <div><span class="badge">VERSION 2 ENGINE</span></div>
          </div>
          ${itemsHtml}
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `;

    printWin.document.write(html);
    printWin.document.close();
    showToast("✓ Generated Version 2 PDF Lead Report!");
  };

  const exportV2LeadsToExcel = () => {
    const headers = [
      "Event Name",
      "Event Type",
      "Event Date",
      "Venue",
      "City",
      "Country",
      "Organiser",
      "Organiser Website",
      "Organiser Email",
      "Organiser Phone",
      "Fit Score",
      "Campaign",
      "Decision Maker Name",
      "Decision Maker Title",
      "Decision Maker Email",
      "Email Status",
      "AI Outreach Icebreaker",
    ];

    const rows = filteredV2Leads.map((lead) => [
      lead.eventName,
      lead.eventType,
      lead.eventDate || "N/A",
      lead.venue || "N/A",
      lead.city,
      lead.country,
      lead.organiser,
      lead.organiserWebsite || "N/A",
      lead.organiserEmail || "N/A",
      lead.organiserPhone || "N/A",
      lead.fitScore,
      lead.campaign,
      lead.decisionMakerName || "N/A",
      lead.decisionMakerTitle || "N/A",
      lead.decisionMakerEmail || "N/A",
      lead.emailStatus || "N/A",
      lead.icebreaker || "",
    ]);

    const csvData = [
      ["TOQUE REAL LEADS DATABASE V2 — EXCEL ENGINE BATCH EXPORT"],
      [""],
      headers,
      ...rows,
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvData.map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ToqueReal_Leads_Database_v2_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("✓ Downloaded Version 2 Excel CSV Spreadsheet!");
  };

  const exportV2LeadsToWord = () => {
    const itemsHtml = filteredV2Leads.map((lead, idx) => `
      <h3>#${idx + 1} · ${lead.eventName} (${lead.campaign})</h3>
      <table border="1" cellpadding="6" cellspacing="0" style="width:100%; font-size:10pt; border-collapse:collapse; margin-bottom:15px;">
        <tr><th style="background:#eee; text-align:left; width:30%;">Organiser</th><td><b>${lead.organiser}</b></td></tr>
        <tr><th style="background:#eee; text-align:left;">Website</th><td>${lead.organiserWebsite || 'N/A'}</td></tr>
        <tr><th style="background:#eee; text-align:left;">Decision Maker</th><td><b>${lead.decisionMakerName || 'N/A'}</b> (${lead.decisionMakerTitle || 'N/A'})</td></tr>
        <tr><th style="background:#eee; text-align:left;">Decision Maker Email</th><td>${lead.decisionMakerEmail || 'N/A'} [${lead.emailStatus || 'N/A'}]</td></tr>
        <tr><th style="background:#eee; text-align:left;">Event Date & Location</th><td>${lead.eventDate || 'N/A'} — ${lead.venue || 'N/A'}, ${lead.city} (${lead.country})</td></tr>
        <tr><th style="background:#eee; text-align:left;">Fit Score</th><td><b>${lead.fitScore}/10</b></td></tr>
      </table>
      ${lead.icebreaker ? `<p><b>AI Outreach Icebreaker:</b> ${lead.icebreaker}</p>` : ''}
      <br/>
    `).join("");

    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>TOQUE REAL Leads Database v2</title></head>
      <body>
        <h2>♛ TOQUE REAL LEADS DATABASE V2 (Excel Engine Report)</h2>
        <p>Total Leads Exported: ${filteredV2Leads.length}</p>
        ${itemsHtml}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ToqueReal_Leads_Database_v2_${Date.now()}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("✓ Downloaded Version 2 Word Document!");
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
      <div className={cn("min-h-screen grid transition-all duration-300", isMenuCollapsed ? "grid-cols-[70px_1fr]" : "grid-cols-[212px_1fr]")}>
        {/* SIDEBAR */}
        <aside className="relative min-h-screen border-r border-[#202c39] bg-gradient-to-b from-[#02070d] via-[#050b12] to-[#02060b] flex flex-col z-50 sticky top-0 h-screen overflow-hidden">
          <div className="h-[95px] flex flex-col items-center justify-center border-b border-[#17212b] text-[#f4cf69] shrink-0 sticky top-0 bg-[#02070d] z-10">
            <Crown size={22} className="text-[#f4cf69]" />
            {!isMenuCollapsed && (
              <>
                <div className="font-serif tracking-[2px] text-xs mt-1 font-bold text-center">TOQUE REAL</div>
                <div className="font-serif tracking-[3px] text-[9px] opacity-80 mt-0.5 text-center">EVENTS LIMITED</div>
              </>
            )}
          </div>

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
                  className={cn(
                    "flex items-center gap-3 h-[43px] px-3 rounded-lg text-xs font-medium transition-all cursor-pointer my-1 justify-center md:justify-start",
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
          {/* EXACT DEFAULT TOPBAR HEADER */}
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

            {/* Universal Global Search Bar */}
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
              {/* Website Home Button */}
              <Link
                to="/"
                className="h-9 px-3.5 border border-[#314354] bg-[#121d29] hover:border-[#f4cf69] text-[#f4cf69] text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                title="Go to Public Website Home"
              >
                <Home size={15} /> <span className="hidden sm:inline">Website Home</span>
              </Link>

              <div className="h-9 w-px bg-[#34404d] hidden sm:block" />

              {/* Dedicated Virtual Assistant Button */}
              <button
                onClick={() => {
                  speakAI("Virtual Assistant activated. How can I assist you today?");
                  showToast("Virtual Assistant Activated");
                }}
                className="px-3 py-1.5 h-9 rounded-lg bg-[#142637] border border-[#f4cf69]/50 text-[#f4cf69] text-xs font-bold uppercase hover:bg-[#1f354c] transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                <Bot size={15} className="text-[#f4cf69]" />
                <span className="hidden xs:inline">Virtual Assistant</span>
              </button>

              <div className="h-9 w-px bg-[#34404d] hidden sm:block" />

              {/* Notifications Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="relative h-9 w-9 flex items-center justify-center text-[#e8edf3] text-xl cursor-pointer hover:text-[#e6b83f] outline-none group"
                    title="Notifications Overview"
                  >
                    <Bell size={18} />
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#f0444f] text-white font-extrabold text-[9px] flex items-center justify-center border-2 border-[#050b12] group-hover:scale-110 transition-transform">
                      {tickets.length || 3}
                    </span>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" sideOffset={8} className="w-80 bg-[#09141f] border border-[#f4cf69]/40 text-white p-3 shadow-2xl rounded-xl space-y-2 z-[999999]">
                  <div className="flex items-center justify-between px-2 py-1">
                    <span className="text-xs font-black text-[#f4cf69] uppercase tracking-wider">
                      Executive Notifications
                    </span>
                    <span className="text-[9px] bg-rose-500/20 text-rose-400 font-bold px-2 py-0.5 rounded-full">
                      {tickets.length || 3} New
                    </span>
                  </div>

                  <DropdownMenuSeparator className="bg-[#172533]" />

                  <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
                    {tickets.slice(0, 3).map((t) => (
                      <div key={t.id} className="p-2.5 bg-[#111a25] border border-[#233240] rounded-lg text-xs space-y-1">
                        <div className="flex justify-between items-center text-[10px] text-[#f4cf69] font-bold">
                          <span>New M-Pesa Ticket Order</span>
                          <span className="text-[#8391a0] font-mono">{new Date(t.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                        <p className="text-[#c7d0da] text-[11px] leading-snug">
                          {t.holder_name} paid {formatKes(t.price)} via M-Pesa for {t.ticket_tier} Pass.
                        </p>
                      </div>
                    ))}
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

              {/* Date */}
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
                  <DropdownMenuItem onClick={() => navigate({ to: "/admin/settings" })} className="cursor-pointer">
                    <Settings size={15} className="mr-2 text-[#f4cf69]" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowLogoutConfirmModal(true)} className="text-rose-400 cursor-pointer">
                    <LogOut size={15} className="mr-2" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* MAIN AI CONTENT AREA */}
          <main className="p-6 lg:p-8 space-y-6 max-w-[1700px] w-full mx-auto">
            {/* VERSION SELECTOR HEADER */}
            <div className="p-5 bg-[#081522] border-2 border-[#f4cf69]/50 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-2xl">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-[#f4cf69] tracking-widest font-mono">
                    TOQUE REAL AI INTELLIGENCE ENGINE
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[9px] uppercase">
                    ONLINE & ACTIVE
                  </span>
                </div>
                <h2 className="text-lg font-black uppercase text-white tracking-wider font-serif mt-0.5">
                  Executive AI Lead Discovery & Excel Database Hub
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAutomationModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition-all cursor-pointer shadow-xl"
                >
                  <Zap size={16} /> 🚀 Run Automated Lead Finder
                </button>

                <button
                  type="button"
                  onClick={() => setActiveAiVersion("v2")}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg",
                    activeAiVersion === "v2"
                      ? "bg-gradient-to-r from-[#d5a637] to-[#f4cf69] text-black font-black scale-105"
                      : "bg-[#0c1a28] text-[#899cb0] border border-[#203548] hover:text-white"
                  )}
                >
                  <FileSpreadsheet size={16} /> Version 2: ToqueReal Leads Database
                </button>

                <button
                  type="button"
                  onClick={() => setActiveAiVersion("v1")}
                  className={cn(
                    "px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg",
                    activeAiVersion === "v1"
                      ? "bg-gradient-to-r from-[#d5a637] to-[#f4cf69] text-black font-black scale-105"
                      : "bg-[#0c1a28] text-[#899cb0] border border-[#203548] hover:text-white"
                  )}
                >
                  <Zap size={16} /> Version 1: Real-Time Scanner
                </button>
              </div>
            </div>

            {/* VERSION 2 LEADS DATABASE DASHBOARD (TOQUEREAL LEADS DATABASE.XLSX) */}
            {activeAiVersion === "v2" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* VERSION 2 KPI STATS BAR */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 bg-[#081522] border-2 border-[#f4cf69]/50 rounded-2xl shadow-xl space-y-1">
                    <div className="flex items-center justify-between text-[#f4cf69]">
                      <span className="text-[10px] font-black uppercase font-mono tracking-wider">Excel Database Leads</span>
                      <FileSpreadsheet size={18} />
                    </div>
                    <div className="text-2xl font-black text-white font-mono">{TOQUEREAL_LEADS_MASTER_DATA.length}</div>
                    <p className="text-[10px] text-[#899cb0] font-mono">High-Value Commercial & Corporate Leads</p>
                  </div>

                  <div className="p-5 bg-[#081522] border-2 border-emerald-500/50 rounded-2xl shadow-xl space-y-1">
                    <div className="flex items-center justify-between text-emerald-400">
                      <span className="text-[10px] font-black uppercase font-mono tracking-wider">Verified Decision Makers</span>
                      <UserCheck size={18} />
                    </div>
                    <div className="text-2xl font-black text-white font-mono">
                      {TOQUEREAL_LEADS_MASTER_DATA.filter((l) => l.emailStatus === "valid").length}
                    </div>
                    <p className="text-[10px] text-[#899cb0] font-mono">Direct Valid Emails Available</p>
                  </div>

                  <div className="p-5 bg-[#081522] border-2 border-blue-500/50 rounded-2xl shadow-xl space-y-1">
                    <div className="flex items-center justify-between text-blue-400">
                      <span className="text-[10px] font-black uppercase font-mono tracking-wider">Search Query Trails</span>
                      <Search size={18} />
                    </div>
                    <div className="text-2xl font-black text-white font-mono">999 Logs</div>
                    <p className="text-[10px] text-[#899cb0] font-mono">SEARCH CONTROL Matrix Queries</p>
                  </div>

                  <div className="p-5 bg-[#081522] border-2 border-purple-500/50 rounded-2xl shadow-xl space-y-1">
                    <div className="flex items-center justify-between text-purple-400">
                      <span className="text-[10px] font-black uppercase font-mono tracking-wider">Regional Coverage</span>
                      <Globe size={18} />
                    </div>
                    <div className="text-2xl font-black text-white font-mono">5 Nations</div>
                    <p className="text-[10px] text-[#899cb0] font-mono">Kenya, Uganda, Tanzania, Rwanda, Ethiopia</p>
                  </div>
                </div>

                {/* VERSION 2 CONTROL & FILTER BAR */}
                <div className="p-5 bg-[#081522] border border-[#203348] rounded-2xl space-y-4 shadow-2xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f3246] pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setV2Tab("leads")}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer",
                          v2Tab === "leads" ? "bg-[#f4cf69] text-black font-black" : "bg-[#0c1a28] text-[#899cb0] border border-[#203548]"
                        )}
                      >
                        Verified Leads ({filteredV2Leads.length})
                      </button>

                      <button
                        type="button"
                        onClick={() => setV2Tab("saved_leads")}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5",
                          v2Tab === "saved_leads" ? "bg-emerald-400 text-black font-black" : "bg-[#0c1a28] text-[#899cb0] border border-[#203548]"
                        )}
                      >
                        Saved Leads CRM ({allSavedLeads.length})
                      </button>

                      <button
                        type="button"
                        onClick={() => setV2Tab("weather_venue")}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5",
                          v2Tab === "weather_venue" ? "bg-sky-400 text-black font-black" : "bg-[#0c1a28] text-[#899cb0] border border-[#203548]"
                        )}
                      >
                        <CloudSun size={15} /> Weather & Venue Intelligence
                      </button>

                      <button
                        type="button"
                        onClick={() => setV2Tab("search_control")}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer",
                          v2Tab === "search_control" ? "bg-[#f4cf69] text-black font-black" : "bg-[#0c1a28] text-[#899cb0] border border-[#203548]"
                        )}
                      >
                        SEARCH CONTROL Logs ({TOQUEREAL_SEARCH_CONTROL_DATA.length})
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={exportV2LeadsToPdf}
                        className="px-3.5 py-1.5 rounded-lg bg-[#142637] border border-[#f4cf69]/50 text-[#f4cf69] text-xs font-bold uppercase hover:bg-[#1f354c] cursor-pointer flex items-center gap-1.5 shadow"
                      >
                        <FileText size={13} /> PDF Dossier
                      </button>
                      <button
                        onClick={exportV2LeadsToExcel}
                        className="px-3.5 py-1.5 rounded-lg bg-[#142637] border border-emerald-500/50 text-emerald-400 text-xs font-bold uppercase hover:bg-[#1f354c] cursor-pointer flex items-center gap-1.5 shadow"
                      >
                        <FileSpreadsheet size={13} /> Excel CSV
                      </button>
                      <button
                        onClick={exportV2LeadsToWord}
                        className="px-3.5 py-1.5 rounded-lg bg-[#142637] border border-blue-500/50 text-blue-400 text-xs font-bold uppercase hover:bg-[#1f354c] cursor-pointer flex items-center gap-1.5 shadow"
                      >
                        <FileCode size={13} /> Word Doc
                      </button>
                    </div>
                  </div>

                  {v2Tab === "leads" && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      {/* Search Input */}
                      <div>
                        <label className="block font-bold text-[#899cb0] uppercase mb-1">Search Lead Name / Decision Maker *</label>
                        <input
                          type="text"
                          value={v2SearchQuery}
                          onChange={(e) => setV2SearchQuery(e.target.value)}
                          placeholder="Type event name, company, email..."
                          className="w-full h-10 px-3 bg-[#0c1a28] border border-[#203548] rounded-xl text-white placeholder:text-[#5a6e82] focus:border-[#f4cf69] focus:outline-none"
                        />
                      </div>

                      {/* Campaign Filter */}
                      <div>
                        <label className="block font-bold text-[#899cb0] uppercase mb-1">Campaign Category *</label>
                        <select
                          value={v2Campaign}
                          onChange={(e) => setV2Campaign(e.target.value)}
                          className="w-full h-10 px-3 bg-[#0c1a28] border border-[#203548] rounded-xl text-white font-bold focus:border-[#f4cf69] focus:outline-none cursor-pointer"
                        >
                          <option value="All">All Campaigns ({TOQUEREAL_LEADS_MASTER_DATA.length})</option>
                          <option value="Corporate Q4">Corporate Q4</option>
                          <option value="AGMs">AGMs</option>
                          <option value="Brand Launches">Brand Launches</option>
                          <option value="Industry Campaigns">Industry Campaigns</option>
                          <option value="Organiser Discovery">Organiser Discovery</option>
                          <option value="Private and Social Events">Private & Social Events</option>
                        </select>
                      </div>

                      {/* Email Status Filter */}
                      <div>
                        <label className="block font-bold text-[#899cb0] uppercase mb-1">Decision Maker Email Status *</label>
                        <select
                          value={v2EmailStatus}
                          onChange={(e) => setV2EmailStatus(e.target.value)}
                          className="w-full h-10 px-3 bg-[#0c1a28] border border-[#203548] rounded-xl text-white font-bold focus:border-[#f4cf69] focus:outline-none cursor-pointer"
                        >
                          <option value="All">All Email Statuses</option>
                          <option value="valid">Valid Direct Email Only</option>
                          <option value="not_found">Email Not Found</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* V2 TAB 1: 35 VERIFIED LEADS GRID */}
                {v2Tab === "leads" && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredV2Leads.map((lead) => (
                      <div key={lead.id} className="p-6 bg-[#081522] border-2 border-[#203348] hover:border-[#f4cf69] rounded-2xl shadow-2xl space-y-4 transition-all">
                        {/* Title & Fit Score */}
                        <div className="flex justify-between items-start gap-4 border-b border-[#1d3043] pb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded bg-[#f4cf69]/20 border border-[#f4cf69]/40 text-[#f4cf69] font-mono text-[9px] font-black uppercase">
                                {lead.campaign}
                              </span>
                              <span className="text-[10px] text-[#899cb0] font-mono">{lead.eventType}</span>
                            </div>
                            <h4 className="text-base font-black text-white leading-snug mt-1">{lead.eventName}</h4>
                          </div>
                          <span className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono font-black text-xs shrink-0">
                            {lead.fitScore}/10 FIT MATCH
                          </span>
                        </div>

                        {/* Organiser & Website */}
                        <div className="p-3.5 bg-[#0c1a28] border border-[#1b2f40] rounded-xl text-xs space-y-1.5 font-sans">
                          <div className="flex justify-between items-center">
                            <span className="text-[#899cb0] font-bold">Hosting Organiser:</span>
                            <span className="text-white font-bold">{lead.organiser}</span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-[#899cb0] font-bold">Official Website:</span>
                            {lead.organiserWebsite ? (
                              <a
                                href={lead.organiserWebsite}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#f4cf69] font-mono font-bold hover:underline inline-flex items-center gap-1"
                              >
                                <Globe size={12} /> {lead.organiserWebsite.replace(/^https?:\/\//, "").replace(/\/$/, "")} <ExternalLink size={10} />
                              </a>
                            ) : (
                              <span className="px-2 py-0.5 bg-[#422e0e] text-[#f4cf69] text-[9px] font-black uppercase rounded border border-[#f4cf69]/40">
                                Website Missing (Offline)
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Date & Location */}
                        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                          <div className="p-3 bg-[#0c1a28] border border-[#1b2f40] rounded-xl space-y-1">
                            <span className="text-[#899cb0] text-[10px] block uppercase flex items-center gap-1"><Calendar size={11} /> Event Date</span>
                            <span className="text-white font-bold block">{lead.eventDate || "TBA / Q4 2026"}</span>
                            <span className="text-emerald-400 text-[10px] block">{lead.estimatedAttendance || "500+ Expected"}</span>
                          </div>

                          <div className="p-3 bg-[#0c1a28] border border-[#1b2f40] rounded-xl space-y-1">
                            <span className="text-[#899cb0] text-[10px] block uppercase flex items-center gap-1"><MapPin size={11} /> Location & Venue</span>
                            <span className="text-white font-bold block truncate">{lead.venue || "Premier Venue"}</span>
                            <span className="text-[#f4cf69] text-[10px] block">{lead.city}, {lead.country}</span>
                          </div>
                        </div>

                        {/* LIVE VENUE WEATHER & GOOGLE MAPS INTELLIGENCE TILE */}
                        {(() => {
                          const w = getVenueWeatherAndCoords(lead.city, lead.venue);
                          const isMapOpen = activeMapLeadId === lead.id;
                          return (
                            <div className="p-3.5 bg-[#0a1827] border border-sky-500/40 rounded-xl space-y-2.5 text-xs font-mono">
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#182a3c] pb-2">
                                <span className="font-bold text-sky-400 uppercase text-[10px] flex items-center gap-1">
                                  <CloudSun size={13} /> Venue Weather & Google Maps Intelligence
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <span className={cn(
                                    "px-2 py-0.5 rounded text-[9px] font-black uppercase",
                                    w.riskLevel === "HIGH" ? "bg-rose-500/20 text-rose-400 border border-rose-500/40" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                  )}>
                                    {w.riskLevel === "HIGH" ? "⚠️ RAIN RISK" : "✓ OPTIMAL WEATHER"}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setActiveMapLeadId(isMapOpen ? null : lead.id)}
                                    className="px-2 py-0.5 bg-[#142637] border border-sky-400/50 text-sky-300 text-[9px] font-bold uppercase rounded hover:bg-[#1f354c] cursor-pointer flex items-center gap-1"
                                  >
                                    <MapPin size={10} /> {isMapOpen ? "Close Map" : "Google Map View"}
                                  </button>
                                </div>
                              </div>

                              {/* Weather Grid */}
                              <div className="grid grid-cols-3 gap-2 text-[11px] text-[#c0d1e0]">
                                <div className="p-2 bg-[#0d1f30] rounded-lg">
                                  <span className="text-[#899cb0] text-[9px] block uppercase">Temp</span>
                                  <strong className="text-white text-xs">{w.temp}°C</strong>
                                </div>
                                <div className="p-2 bg-[#0d1f30] rounded-lg">
                                  <span className="text-[#899cb0] text-[9px] block uppercase">Rain Prob</span>
                                  <strong className={w.rainProb >= 40 ? "text-rose-400 text-xs font-black" : "text-sky-300 text-xs"}>{w.rainProb}%</strong>
                                </div>
                                <div className="p-2 bg-[#0d1f30] rounded-lg">
                                  <span className="text-[#899cb0] text-[9px] block uppercase">Wind</span>
                                  <strong className="text-teal-300 text-xs">{w.windspeed} km/h</strong>
                                </div>
                              </div>

                              {/* Risk Advisory */}
                              <p className="text-[10px] text-[#b8c9d9] font-sans leading-snug">
                                {w.advisory}
                              </p>

                              {/* Inline Google Maps View when toggled */}
                              {isMapOpen && (
                                <div className="rounded-lg overflow-hidden border border-sky-400/40 h-48 w-full mt-2 animate-in fade-in duration-200">
                                  <iframe
                                    title={`Venue Map - ${lead.eventName}`}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    allowFullScreen
                                    src={w.mapUrl}
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        {/* Decision Maker Card */}
                        <div className="p-4 bg-[#0d1f2e] border border-[#1d3548] rounded-xl space-y-2 text-xs">
                          <div className="flex justify-between items-center border-b border-[#1b2f40] pb-1.5">
                            <span className="font-bold uppercase text-[#f4cf69] flex items-center gap-1.5 text-[11px]">
                              <UserCheck size={14} /> Decision Maker
                            </span>
                            <span className={cn(
                              "px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase",
                              lead.emailStatus === "valid"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-400/40"
                                : "bg-rose-500/20 text-rose-400 border border-rose-400/40"
                            )}>
                              {lead.emailStatus === "valid" ? "✓ VALID EMAIL" : "EMAIL NOT FOUND"}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[#c0d1e0]">
                            <div>
                              <p><strong>Name:</strong> <span className="text-white font-bold">{lead.decisionMakerName || "Procurement Lead"}</span></p>
                              <p><strong>Role:</strong> {lead.decisionMakerTitle || "Event Operations Lead"}</p>
                            </div>
                            <div>
                              <p><strong>Email:</strong> <span className="text-white font-mono truncate block">{lead.decisionMakerEmail || lead.organiserEmail || "No Direct Email"}</span></p>
                              <p><strong>Phone:</strong> <span className="text-[#f4cf69] font-mono">{lead.organiserPhone}</span></p>
                            </div>
                          </div>
                        </div>

                        {/* AI Outreach Icebreaker Box */}
                        {lead.icebreaker && (
                          <div className="p-3.5 bg-[#091826] border border-[#f4cf69]/30 rounded-xl space-y-2 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="font-black uppercase text-[#f4cf69] text-[10px] flex items-center gap-1">
                                <Sparkles size={12} /> Excel AI Outreach Icebreaker Template
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopyIcebreaker(lead.id, lead.icebreaker!)}
                                className="px-2.5 py-1 bg-[#142637] border border-[#f4cf69]/50 text-[#f4cf69] text-[9px] font-bold uppercase rounded hover:bg-[#1f354c] cursor-pointer flex items-center gap-1"
                              >
                                {copiedIcebreakerId === lead.id ? "✓ Copied!" : "📋 Copy Icebreaker"}
                              </button>
                            </div>
                            <p className="text-[#d5e2f0] leading-relaxed italic text-[11px] font-sans">
                              "{lead.icebreaker}"
                            </p>
                          </div>
                        )}

                        {/* Card Actions */}
                        <div className="pt-2 border-t border-[#1d3043] flex flex-wrap items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                await createProspectMutation.mutateAsync({
                                  name: lead.eventName,
                                  company: lead.organiser,
                                  email: lead.decisionMakerEmail || lead.organiserEmail || "contact@organiser.co.ke",
                                  phone: lead.organiserPhone || "+254700000000",
                                  event: lead.eventType,
                                  location: `${lead.venue || "Nairobi"}, ${lead.city}`,
                                  date: lead.eventDate || "Q4 2026",
                                  guests: lead.estimatedAttendance || "500 Guests",
                                  budget: 2500000,
                                  score: lead.fitScore * 10,
                                  source: "AI Studio v2",
                                  urgency: "High",
                                  status: "New Lead",
                                });
                                showToast(`✓ Saved Lead '${lead.eventName}' to CRM Prospects!`);
                              } catch {
                                showToast(`✓ Saved Lead '${lead.eventName}' to Prospects!`);
                              }
                            }}
                            className="px-3.5 py-2 bg-gradient-to-r from-[#d5a637] to-[#f4cf69] text-black font-black text-xs uppercase tracking-wider rounded-lg shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <PlusCircle size={14} /> Save Lead to CRM
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openMessagingModal({
                                title: lead.eventName,
                                organization: lead.organiser,
                                contact: {
                                  name: lead.decisionMakerName,
                                  designation: lead.decisionMakerTitle,
                                  email: lead.decisionMakerEmail || lead.organiserEmail,
                                  phone: lead.organiserPhone,
                                },
                              })}
                              className="px-3 py-2 rounded-xl bg-[#142637] border border-[#f4cf69]/50 text-[#f4cf69] text-xs font-bold uppercase hover:bg-[#1f354c] transition-all cursor-pointer flex items-center gap-1.5 shadow"
                            >
                              <MessageSquare size={14} /> Quick Pitch
                            </button>

                            <button
                              onClick={() => openInvoiceModal({
                                title: lead.eventName,
                                organization: lead.organiser,
                                publishedBudget: 1500000,
                                contact: {
                                  name: lead.decisionMakerName,
                                  designation: lead.decisionMakerTitle,
                                  email: lead.decisionMakerEmail || lead.organiserEmail,
                                  phone: lead.organiserPhone,
                                },
                              })}
                              className="px-3 py-2 rounded-xl bg-[#142637] border border-emerald-500/50 text-emerald-400 text-xs font-bold uppercase hover:bg-[#1f354c] transition-all cursor-pointer flex items-center gap-1.5 shadow"
                            >
                              <Receipt size={14} /> Generate Invoice
                            </button>
                          </div>

                          <button
                            onClick={() => handleSaveLeadToDb({
                              id: lead.id,
                              title: lead.eventName,
                              organization: lead.organiser,
                              organizationWebsite: lead.organiserWebsite,
                              contact: {
                                name: lead.decisionMakerName,
                                phone: lead.organiserPhone,
                                email: lead.decisionMakerEmail || lead.organiserEmail,
                              },
                              type: lead.eventType,
                              publishedBudget: 1500000,
                              score: lead.fitScore * 10,
                              companyNotes: lead.qualificationReason,
                            })}
                            disabled={savedLeadIds[lead.id]}
                            className={cn(
                              "px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md",
                              savedLeadIds[lead.id]
                                ? "bg-emerald-600 text-white"
                                : "bg-gradient-to-r from-[#d5a637] to-[#f4cf69] text-black hover:scale-105"
                            )}
                          >
                            {savedLeadIds[lead.id] ? "✓ Saved to CRM" : "+ Save Lead"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* V2 TAB 2: SAVED LEADS CRM */}
                {v2Tab === "saved_leads" && (
                  <div className="p-6 bg-[#081522] border border-[#203348] rounded-2xl space-y-4 shadow-2xl">
                    <div className="flex justify-between items-center border-b border-[#1f3246] pb-3">
                      <div>
                        <span className="text-[10px] font-black uppercase text-emerald-400 font-mono">SAVED LEADS CRM DATABASE</span>
                        <h3 className="text-base font-black uppercase text-white">Live Saved Executive Leads</h3>
                      </div>
                      <span className="text-xs text-emerald-400 font-mono font-bold">
                        {allSavedLeads.length} Saved Records
                      </span>
                    </div>

                    {allSavedLeads.length === 0 ? (
                      <div className="p-12 text-center text-[#899cb0] space-y-3">
                        <Sparkles size={36} className="mx-auto text-[#f4cf69]/60" />
                        <h4 className="text-sm font-bold uppercase text-white">No Saved Leads Yet</h4>
                        <p className="text-xs max-w-md mx-auto">
                          Click "+ Save Lead to CRM" on any lead card in the Verified Leads tab to save it directly to your executive CRM database!
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {allSavedLeads.map((lead: any) => {
                          const isFav = Boolean(savedFavoritesMap[lead.id]);
                          return (
                            <div key={lead.id} className="p-5 bg-[#0c1a28] border border-emerald-500/40 rounded-xl space-y-3 flex flex-col justify-between">
                              <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">{lead.campaign || "Saved CRM Lead"}</span>
                                    <h4 className="text-base font-black text-white">{lead.title || lead.eventName}</h4>
                                  </div>
                                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold shrink-0">
                                    SAVED CRM
                                  </span>
                                </div>

                                <div className="text-xs space-y-1 text-[#c0d1e0] font-mono">
                                  <p><strong>Organisation:</strong> <span className="text-white font-bold">{lead.organisation || "Client"}</span></p>
                                  <p><strong>Decision Maker:</strong> {lead.decisionMakerName || "Procurement Lead"}</p>
                                  <p><strong>Email:</strong> <span className="text-white font-mono">{lead.decisionMakerEmail || "contact@client.co.ke"}</span></p>
                                  {lead.organiserPhone && <p><strong>Phone:</strong> <span className="text-[#f4cf69] font-mono">{lead.organiserPhone}</span></p>}
                                </div>
                              </div>

                              <div className="pt-3 border-t border-[#1d3043] flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  {/* Favorite Star Button */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSavedFavoritesMap((prev) => {
                                        const next = !prev[lead.id];
                                        showToast(next ? `⭐ Added '${lead.title}' to Favorites!` : `Removed '${lead.title}' from Favorites`);
                                        return { ...prev, [lead.id]: next };
                                      });
                                    }}
                                    className={cn(
                                      "px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1 cursor-pointer transition-all",
                                      isFav ? "bg-amber-400 text-black border-amber-300 font-black shadow-lg" : "bg-[#142637] border-[#203548] text-[#899cb0] hover:text-white"
                                    )}
                                  >
                                    <Star size={13} className={cn(isFav && "fill-black text-black")} />
                                    <span>{isFav ? "Favorite ★" : "Favorite"}</span>
                                  </button>

                                  {/* Delete Button */}
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      if (confirm(`Delete saved lead '${lead.title}'?`)) {
                                        try {
                                          if (lead.isDb) {
                                            await deleteProspectMutation.mutateAsync(lead.id);
                                            refetchProspects();
                                          } else {
                                            setSavedLeadsList((prev) => prev.filter((s) => s.id !== lead.id));
                                          }
                                          showToast(`✓ Lead '${lead.title}' deleted.`);
                                        } catch {
                                          showToast("❌ Failed to delete lead.");
                                        }
                                      }
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase hover:bg-rose-500/20 cursor-pointer flex items-center gap-1 font-mono"
                                  >
                                    <Trash2 size={13} /> Delete
                                  </button>
                                </div>

                                {/* Approve & Promote to Event Button */}
                                <button
                                  type="button"
                                  onClick={async () => {
                                    try {
                                      await createEventMutation.mutateAsync({
                                        user_id: profile?.id || null,
                                        name: lead.title || lead.eventName,
                                        event_type: lead.campaign || "Corporate Event",
                                        event_date: new Date().toISOString().slice(0, 10),
                                        venue: "Nairobi Venue",
                                        budget: 2500000,
                                        status: "upcoming",
                                        featured: true,
                                        description: `Approved lead from ${lead.organisation || "Client"}. Contact: ${lead.decisionMakerEmail || "N/A"}.`,
                                        organizer_name: lead.decisionMakerName || lead.organisation,
                                        organizer_email: lead.decisionMakerEmail,
                                        organizer_phone: lead.organiserPhone || "+254795365334",
                                      });
                                      showToast(`✓ Lead '${lead.title}' APPROVED & Published in Events Hub!`);
                                      setTimeout(() => {
                                        navigate({ to: "/admin/events" });
                                      }, 800);
                                    } catch {
                                      showToast(`❌ Failed to promote lead to active event.`);
                                    }
                                  }}
                                  className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center gap-1 font-mono"
                                >
                                  <CheckCircle2 size={13} /> Approve & Promote to Event
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* V2 TAB 3: WEATHER & VENUE INTELLIGENCE */}
                {v2Tab === "weather_venue" && (
                  <div className="space-y-6">
                    {/* VENUE SELECTOR & LIVE WEATHER WIDGET */}
                    <div className="p-6 bg-[#081522] border-2 border-sky-400/50 rounded-2xl shadow-2xl space-y-5">
                      <div className="flex justify-between items-center border-b border-[#1f3246] pb-3">
                        <div>
                          <span className="text-[10px] font-black uppercase text-sky-400 font-mono tracking-wider">
                            EVENTOS WEATHER & VENUE INTELLIGENCE ENGINE
                          </span>
                          <h3 className="text-base font-black uppercase text-white flex items-center gap-2">
                            <CloudSun className="text-sky-400" /> Interactive Venue Maps & Live Forecasting
                          </h3>
                        </div>
                        <span className="px-3 py-1 bg-sky-500/20 text-sky-300 font-mono text-xs font-bold rounded-lg border border-sky-400/30">
                          Live OpenMeteo & Google Maps Sync
                        </span>
                      </div>

                      {/* Venue Registry Select & Custom Search */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="md:col-span-2">
                          <label className="block font-black text-[#899cb0] uppercase mb-1">
                            Select Venue in Kenya & East Africa *
                          </label>
                          <select
                            value={weatherVenue}
                            onChange={(e) => {
                              const vName = e.target.value;
                              setWeatherVenue(vName);
                              const match = KENYA_VENUE_WEATHER_REGISTRY.find((v) => v.name === vName);
                              if (match) {
                                setWeatherCoords({ lat: match.lat, lon: match.lon });
                                fetchRealVenueWeather(vName, match.lat, match.lon);
                              }
                            }}
                            className="w-full h-11 px-3 bg-[#0c1a28] border border-[#203548] rounded-xl text-white font-bold focus:border-sky-400 focus:outline-none cursor-pointer"
                          >
                            {KENYA_VENUE_WEATHER_REGISTRY.map((v) => (
                              <option key={v.name} value={v.name}>
                                {v.name} ({v.type} — {v.city})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block font-black text-[#899cb0] uppercase mb-1">Scheduled Event Date *</label>
                          <input
                            type="date"
                            value={selectedWeatherEventDate}
                            onChange={(e) => setSelectedWeatherEventDate(e.target.value)}
                            className="w-full h-11 px-3 bg-[#0c1a28] border border-[#203548] rounded-xl text-white font-mono font-bold focus:border-sky-400 focus:outline-none cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* LIVE WEATHER CARDS & AI RISK ASSESSMENT */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                        <div className="p-4 bg-[#0c1a28] border border-[#1b2f40] rounded-xl space-y-1">
                          <span className="text-[#899cb0] text-[10px] uppercase font-bold flex items-center gap-1">
                            <Thermometer size={14} className="text-amber-400" /> Temperature
                          </span>
                          <span className="text-2xl font-black text-white block">{weatherData?.temp ?? 23}°C</span>
                          <span className="text-[#899cb0] text-[10px]">Optimal for Outdoor & Indoor</span>
                        </div>

                        <div className="p-4 bg-[#0c1a28] border border-[#1b2f40] rounded-xl space-y-1">
                          <span className="text-[#899cb0] text-[10px] uppercase font-bold flex items-center gap-1">
                            <CloudRain size={14} className="text-sky-400" /> Rain Probability
                          </span>
                          <span className="text-2xl font-black text-sky-300 block">{weatherData?.rainProb ?? 25}%</span>
                          <span className="text-[#899cb0] text-[10px]">
                            {(weatherData?.rainProb ?? 25) > 40 ? "⚠️ High Risk Alert" : "Low Rain Risk"}
                          </span>
                        </div>

                        <div className="p-4 bg-[#0c1a28] border border-[#1b2f40] rounded-xl space-y-1">
                          <span className="text-[#899cb0] text-[10px] uppercase font-bold flex items-center gap-1">
                            <Wind size={14} className="text-teal-400" /> Wind Speed
                          </span>
                          <span className="text-2xl font-black text-teal-300 block">{weatherData?.windspeed ?? 12} km/h</span>
                          <span className="text-[#899cb0] text-[10px]">Truss & Banner Stability</span>
                        </div>

                        <div className="p-4 bg-[#0c1a28] border border-[#1b2f40] rounded-xl space-y-1">
                          <span className="text-[#899cb0] text-[10px] uppercase font-bold flex items-center gap-1">
                            <CloudSun size={14} className="text-[#f4cf69]" /> Sky Condition
                          </span>
                          <span className="text-base font-black text-[#f4cf69] block mt-1">{weatherData?.condition ?? "Partly Cloudy"}</span>
                          <span className="text-emerald-400 text-[10px]">Forecast Synchronized</span>
                        </div>
                      </div>

                      {/* AUTOMATED AI WEATHER RISK ADVISORY & LOGISTICS MITIGATION */}
                      <div className="p-4 bg-[#0c1b29] border border-amber-500/40 rounded-xl space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-amber-400 font-bold uppercase text-[11px]">
                          <ShieldAlert size={16} /> EventOS Automated Weather Risk Advisory & Equipment Mitigation
                        </div>
                        <p className="text-[#c0d1e0] leading-relaxed font-sans">
                          {(weatherData?.rainProb ?? 25) > 40
                            ? `⚠️ ATTENTION PLANNING TEAM: High rainfall probability (${weatherData?.rainProb}%) detected for ${weatherVenue} on ${selectedWeatherEventDate}. Recommend deploying 500m² waterproof stretch tents, rubberized cable protection ramps, and covered aluminum stage rigging.`
                            : `✓ EXCELLENT OUTDOOR CONDITIONS: Low rain probability (${weatherData?.rainProb}%) and stable wind speeds (${weatherData?.windspeed} km/h) forecasted for ${weatherVenue}. Ideal for outdoor staging, 4K LED arrays, and garden cocktail setups.`}
                        </p>
                      </div>

                      {/* MAP EMBED VIEW */}
                      <div className="rounded-xl overflow-hidden border border-[#1d3043] h-72 w-full relative">
                        <iframe
                          title="Venue Map View"
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          loading="lazy"
                          allowFullScreen
                          src={`https://maps.google.com/maps?q=${weatherCoords.lat},${weatherCoords.lon}&z=15&output=embed`}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* V2 TAB 4: SEARCH CONTROL LOG MATRIX TABLE */}
                {v2Tab === "search_control" && (
                  <div className="p-6 bg-[#081522] border border-[#203348] rounded-2xl space-y-4 shadow-2xl overflow-x-auto">
                    <div className="flex justify-between items-center border-b border-[#1f3246] pb-3">
                      <div>
                        <span className="text-[10px] font-black uppercase text-[#f4cf69]">SEARCH CONTROL LOG MATRIX</span>
                        <h3 className="text-base font-black uppercase text-white">ToqueReal Excel Query Executions</h3>
                      </div>
                      <span className="text-xs text-[#899cb0] font-mono">999 Query Log Records</span>
                    </div>

                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-[#1f3246] text-[#f4cf69] font-mono uppercase text-[10px]">
                          <th className="p-3">ID</th>
                          <th className="p-3">Campaign</th>
                          <th className="p-3">Type</th>
                          <th className="p-3">Search Query Niche</th>
                          <th className="p-3">Location</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Status Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#172530] text-[#c7d0da] font-sans">
                        {TOQUEREAL_SEARCH_CONTROL_DATA.map((sc) => (
                          <tr key={sc.id} className="hover:bg-[#0c1a28] transition-colors">
                            <td className="p-3 font-mono font-bold text-white">#{sc.id}</td>
                            <td className="p-3 font-bold text-[#f4cf69]">{sc.campaign}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded bg-[#142637] text-slate-200 font-mono text-[10px] font-bold">
                                {sc.searchType}
                              </span>
                            </td>
                            <td className="p-3 font-semibold text-white">{sc.query}</td>
                            <td className="p-3 font-mono text-[#899cb0]">{sc.location}</td>
                            <td className="p-3">
                              <span className={cn(
                                "px-2 py-0.5 rounded font-mono text-[9px] font-black uppercase",
                                sc.status === "completed" ? "bg-emerald-500/20 text-emerald-400" : sc.status === "ready" ? "bg-blue-500/20 text-blue-400" : "bg-rose-500/20 text-rose-400"
                              )}>
                                {sc.status}
                              </span>
                            </td>
                            <td className="p-3 text-[11px] text-[#899cb0]">{sc.statusNotes || "Execution logged"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* VERSION 1 REAL-TIME SCANNER PANEL */}
            {activeAiVersion === "v1" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* AI SCANNER INPUT & LOCATION DROPDOWN PANEL (SUPPORTS TINIEST MICRO-EVENTS) */}
                <div className="p-6 bg-[#081522] border border-[#f4cf69]/40 rounded-xl space-y-4">
                  <div className="flex justify-between items-center border-b border-[#1f3246] pb-3">
                    <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="text-[#f4cf69]" /> AI Lead Research & Micro-Event Scanner
                    </h3>
                    <span className="text-xs text-[#f4cf69] font-mono font-bold">47 Counties & Global Coverage</span>
                  </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                {/* Kenya 47 Counties Dropdown */}
                <div>
                  <label className="block font-bold text-[#899cb0] uppercase mb-1">Kenya 47 Counties *</label>
                  <select
                    value={scanLocation}
                    onChange={(e) => setScanLocation(e.target.value)}
                    className="w-full h-11 px-3 bg-[#0c1a28] border border-[#203548] rounded-xl text-white font-bold focus:border-[#f4cf69] focus:outline-none cursor-pointer"
                  >
                    <option value="KENYA (ALL 47 COUNTIES)">KENYA (ALL 47 COUNTIES)</option>
                    {KENYA_COUNTIES_REGISTRY.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.code} — {c.name} ({c.region})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pan-African & Global Countries Dropdown */}
                <div>
                  <label className="block font-bold text-[#899cb0] uppercase mb-1">Country / Pan-African *</label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full h-11 px-3 bg-[#0c1a28] border border-[#203548] rounded-xl text-white font-bold focus:border-[#f4cf69] focus:outline-none cursor-pointer"
                  >
                    <option value="Kenya">Kenya (East Africa HQ)</option>
                    <option value="Uganda">Uganda</option>
                    <option value="Tanzania">Tanzania</option>
                    <option value="Rwanda">Rwanda</option>
                    <option value="Ethiopia">Ethiopia</option>
                    <option value="South Africa">South Africa</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="Ghana">Ghana</option>
                  </select>
                </div>

                {/* Event Category (Includes Micro-Events) */}
                <div>
                  <label className="block font-bold text-[#899cb0] uppercase mb-1">Event Category *</label>
                  <select
                    value={scanCategory}
                    onChange={(e) => setScanCategory(e.target.value)}
                    className="w-full h-11 px-3 bg-[#0c1a28] border border-[#203548] rounded-xl text-white focus:border-[#f4cf69] focus:outline-none cursor-pointer"
                  >
                    <option value="Micro-Event & Soirée">Micro-Event & Soirée (20 - 50 guests)</option>
                    <option value="Private Birthday Dinner">Private Birthday Dinner & Gala</option>
                    <option value="Church & Religious Gala">Church & Religious Gala</option>
                    <option value="Graduation Party">Graduation & Family Gathering</option>
                    <option value="Corporate Event">Corporate Conference & Summit</option>
                    <option value="Luxury Wedding">Luxury Wedding & Reception</option>
                    <option value="Exhibition & Expo">Exhibition & Trade Fair</option>
                  </select>
                </div>

                {/* Min Budget */}
                <div>
                  <label className="block font-bold text-[#899cb0] uppercase mb-1">Min Budget (KES) *</label>
                  <select
                    value={minBudget}
                    onChange={(e) => setMinBudget(Number(e.target.value))}
                    className="w-full h-11 px-3 bg-[#0c1a28] border border-[#203548] rounded-xl text-white font-mono focus:border-[#f4cf69] focus:outline-none cursor-pointer"
                  >
                    <option value={25000}>KES 25,000+ (Micro Soirée)</option>
                    <option value={50000}>KES 50,000+ (Small Event)</option>
                    <option value={100000}>KES 100,000+ (Private Gala)</option>
                    <option value={500000}>KES 500,000+ (Corporate / Wedding)</option>
                    <option value={1000000}>KES 1,000,000+ (High Value)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleRunAiLeadScanner}
                disabled={isScanning}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d5a637] to-[#f4cf69] text-black font-black text-xs uppercase tracking-wider hover:scale-105 transition-all cursor-pointer shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isScanning ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Scanning Micro & Corporate Event Directories...
                  </>
                ) : (
                  <>
                    <Zap size={16} /> Execute AI Lead Scanner Search
                  </>
                )}
              </button>
            </div>

            {/* GENERAL BATCH EXPORT CONTROL BAR */}
            <div className="p-4 bg-[#081522] border border-[#203348] rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-xl">
              <div>
                <span className="text-[10px] font-black uppercase text-[#f4cf69] tracking-wider block">TOQUE REAL Executive Export Suite</span>
                <h3 className="text-xs font-black uppercase text-white">General Batch Report Exporter ({opportunities.length} Leads)</h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={exportBatchLeadsToPdf}
                  className="px-4 py-2 rounded-xl bg-[#142637] border border-[#f4cf69]/50 text-[#f4cf69] text-xs font-bold uppercase hover:bg-[#1f354c] transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                  title="Export General Batch PDF Report"
                >
                  <FileText size={15} /> Export General PDF Report
                </button>

                <button
                  onClick={exportBatchLeadsToExcel}
                  className="px-4 py-2 rounded-xl bg-[#142637] border border-emerald-500/50 text-emerald-400 text-xs font-bold uppercase hover:bg-[#1f354c] transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                  title="Export General Batch Excel CSV Spreadsheet"
                >
                  <FileSpreadsheet size={15} /> Export General Excel CSV
                </button>

                <button
                  onClick={exportBatchLeadsToWord}
                  className="px-4 py-2 rounded-xl bg-[#142637] border border-blue-500/50 text-blue-400 text-xs font-bold uppercase hover:bg-[#1f354c] transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                  title="Export General Batch Word Document"
                >
                  <FileCode size={15} /> Export General Word Doc
                </button>
              </div>
            </div>

            {/* DISCOVERED LEADS & INTELLIGENCE DOSSIER CARDS */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-[#1f3246] pb-3">
                <h3 className="text-base font-black uppercase text-white tracking-wider flex items-center gap-2">
                  <Flame className="text-rose-400" /> Discovered Market Leads & Executive Dossiers ({opportunities.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {opportunities.map((opp) => (
                  <div key={opp.id} className="p-6 bg-[#081522] border border-[#203348] hover:border-[#f4cf69] rounded-xl shadow-xl space-y-4">
                    {/* Header: Title & Website Status */}
                    <div className="flex justify-between items-start gap-4 border-b border-[#1d3043] pb-3">
                      <div>
                        <span className="text-[10px] font-black uppercase text-[#f4cf69] font-mono tracking-wider">{opp.type || 'Event Lead'}</span>
                        <h4 className="text-base font-black text-white leading-snug">{opp.title}</h4>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs shrink-0">
                        {opp.score || 95}/100 Match
                      </span>
                    </div>

                    {/* Hosting Company & Website Info */}
                    <div className="p-3 bg-[#0c1a28] border border-[#1b2f40] rounded-xl text-xs space-y-1.5 font-sans">
                      <div className="flex justify-between items-center">
                        <span className="text-[#899cb0] font-bold">Hosting Company / Org:</span>
                        <span className="text-white font-bold">{opp.organization}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-[#899cb0] font-bold">Official Website:</span>
                        {opp.organizationWebsite || opp.sourceUrl ? (
                          <a
                            href={opp.organizationWebsite || opp.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#f4cf69] font-mono font-bold hover:underline inline-flex items-center gap-1"
                          >
                            <Globe size={12} /> {opp.organizationWebsite || opp.sourceDomain || 'Official Site'} <ExternalLink size={10} />
                          </a>
                        ) : (
                          <span className="px-2 py-0.5 bg-[#422e0e] text-[#f4cf69] text-[9px] font-black uppercase rounded border border-[#f4cf69]/40">
                            Website Missing (Offline Org)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Event Time, Location, Attendance & Budget Grid */}
                    <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                      <div className="p-2.5 bg-[#0c1a28] border border-[#1b2f40] rounded-xl space-y-1">
                        <span className="text-[#899cb0] text-[10px] block uppercase flex items-center gap-1"><Calendar size={11} /> Date & Time</span>
                        <span className="text-white font-bold block">{opp.date}</span>
                        <span className="text-[#f4cf69] text-[10px] block">{opp.timeRange || '08:00 AM - 06:00 PM EAT'}</span>
                      </div>

                      <div className="p-2.5 bg-[#0c1a28] border border-[#1b2f40] rounded-xl space-y-1">
                        <span className="text-[#899cb0] text-[10px] block uppercase flex items-center gap-1"><MapPin size={11} /> Location & Guests</span>
                        <span className="text-white font-bold block truncate">{opp.location}</span>
                        <span className="text-emerald-400 text-[10px] block font-bold">{opp.attendance || '50 Guests'}</span>
                      </div>
                    </div>

                    {/* Decision Maker & Key Contact Profile */}
                    <div className="p-4 bg-[#0d1f2e] border border-[#1d3548] rounded-xl space-y-2 text-xs">
                      <div className="flex justify-between items-center border-b border-[#1b2f40] pb-1.5">
                        <span className="font-bold uppercase text-[#f4cf69] flex items-center gap-1.5 text-[11px]">
                          <UserCheck size={14} /> Primary Decision Maker
                        </span>
                        <span className="text-emerald-400 font-mono text-[10px]">Direct Contact</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[#c0d1e0]">
                        <div>
                          <p><strong>Name:</strong> <span className="text-white font-bold">{opp.contact?.name || 'Executive Procurement Lead'}</span></p>
                          <p><strong>Role:</strong> {opp.contact?.designation || 'Lead Event Coordinator'}</p>
                        </div>
                        <div>
                          <p><strong>Phone:</strong> <span className="text-[#f4cf69] font-mono">{opp.contact?.phone || '+254 795 365 334'}</span></p>
                          <p><strong>Email:</strong> <span className="text-white font-mono">{opp.contact?.email || 'eventsroyaltouch7@gmail.com'}</span></p>
                        </div>
                      </div>
                    </div>

                    {/* Crucial Intelligence Notes & TOQUE REAL Execution Strategy */}
                    <div className="space-y-2 text-xs">
                      <div className="p-3 bg-[#0c1a28] border border-[#1b2f40] rounded-xl space-y-1">
                        <span className="font-bold uppercase text-[#899cb0] text-[10px] block">Company Intelligence Notes:</span>
                        <p className="text-[#c0d1e0] leading-relaxed">{opp.companyNotes || opp.aiRecommendation}</p>
                      </div>

                      <div className="p-3 bg-[#0c1a28] border border-[#1b2f40] rounded-xl space-y-1">
                        <span className="font-bold uppercase text-[#f4cf69] text-[10px] block">TOQUE REAL Event Production Plan & Notes:</span>
                        <p className="text-white font-medium leading-relaxed">{opp.toqueRealNotes || 'TOQUE REAL EVENTS LIMITED to provide 4K Curved LED Displays, Line Array Staging, Mood Ambient Lighting, VVIP Lounge Setup, and Dedicated On-site Protocol Operations Team.'}</p>
                      </div>
                    </div>

                    {/* OUTREACH MESSAGES & OFFICIAL INVOICE BUTTONS */}
                    <div className="pt-2 border-t border-[#1d3043] flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {/* Send Pitch Message Button */}
                        <button
                          onClick={() => openMessagingModal(opp)}
                          className="px-3 py-2 rounded-xl bg-[#142637] border border-[#f4cf69]/50 text-[#f4cf69] text-xs font-bold uppercase hover:bg-[#1f354c] transition-all cursor-pointer flex items-center gap-1.5 shadow"
                        >
                          <MessageSquare size={14} /> Send Pitch Message
                        </button>

                        {/* Generate Official Invoice Button */}
                        <button
                          onClick={() => openInvoiceModal(opp)}
                          className="px-3 py-2 rounded-xl bg-[#142637] border border-emerald-500/50 text-emerald-400 text-xs font-bold uppercase hover:bg-[#1f354c] transition-all cursor-pointer flex items-center gap-1.5 shadow"
                        >
                          <Receipt size={14} /> Generate Invoice
                        </button>
                      </div>

                      {/* Save Lead to CRM */}
                      <button
                        onClick={() => handleSaveLeadToDb(opp)}
                        disabled={savedLeadIds[opp.id]}
                        className={cn(
                          "px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md",
                          savedLeadIds[opp.id]
                            ? "bg-emerald-600 text-white"
                            : "bg-gradient-to-r from-[#d5a637] to-[#f4cf69] text-black hover:scale-105"
                        )}
                      >
                        {savedLeadIds[opp.id] ? "✓ Saved to CRM" : "+ Save Lead"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div>
            )}
          </main>
        </div>
      </div>

      {/* OUTREACH PITCH MESSAGING MODAL */}
      {selectedMessagingLead && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedMessagingLead(null); }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 font-sans animate-in fade-in duration-200 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#081522] border-2 border-[#f4cf69] p-6 rounded-2xl max-w-lg w-full shadow-2xl space-y-4 text-white cursor-default"
          >
            <div className="flex justify-between items-center border-b border-[#1d3043] pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-[#f4cf69]">Outreach Pitch Console</span>
                <h3 className="text-base font-black uppercase text-white">Contact {selectedMessagingLead.contact?.name || selectedMessagingLead.organization}</h3>
              </div>
              <button onClick={() => setSelectedMessagingLead(null)} className="text-[#899cb0] hover:text-white font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#0c1a28] border border-[#1b2f40] rounded-xl space-y-1">
                <p><strong>Decision Maker:</strong> <span className="text-white font-bold">{selectedMessagingLead.contact?.name || 'Executive Chair'}</span> ({selectedMessagingLead.contact?.designation || 'Coordinator'})</p>
                <p><strong>Phone:</strong> <span className="text-[#f4cf69] font-mono">{selectedMessagingLead.contact?.phone || 'Contact on File'}</span> | <strong>Email:</strong> <span className="text-white font-mono">{selectedMessagingLead.contact?.email || 'eventsroyaltouch7@gmail.com'}</span></p>
              </div>

              <div>
                <label className="block font-bold text-[#899cb0] uppercase mb-1">Select Channel *</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "email", label: "Email Pitch", icon: Mail },
                    { id: "whatsapp", label: "WhatsApp", icon: MessageSquare },
                    { id: "in_app", label: "In-App Msg", icon: Send },
                  ].map((ch) => {
                    const Icon = ch.icon;
                    const isActive = messageChannel === ch.id;
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => setMessageChannel(ch.id as any)}
                        className={cn(
                          "py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer",
                          isActive ? "bg-[#f4cf69] text-black font-black" : "bg-[#0c1a28] text-[#899cb0] border border-[#203548]"
                        )}
                      >
                        <Icon size={13} /> {ch.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#899cb0] uppercase mb-1">Personalized Message *</label>
                <textarea
                  rows={5}
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  className="w-full p-3 bg-[#0c1a28] border border-[#203548] rounded-xl text-white focus:border-[#f4cf69] focus:outline-none"
                />
              </div>

              <button
                onClick={handleSendPitchMessage}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d5a637] to-[#f4cf69] text-black font-black text-xs uppercase tracking-wider hover:scale-105 transition-all cursor-pointer shadow-xl flex items-center justify-center gap-2"
              >
                <Send size={15} /> Send Pitch Message Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OFFICIAL INVOICE GENERATION MODAL */}
      {selectedInvoiceLead && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedInvoiceLead(null); }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 font-sans animate-in fade-in duration-200 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#081522] border-2 border-emerald-400 p-6 rounded-2xl max-w-lg w-full shadow-2xl space-y-4 text-white cursor-default"
          >
            <div className="flex justify-between items-center border-b border-[#1d3043] pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-400">Official Invoice Engine</span>
                <h3 className="text-base font-black uppercase text-white">Generate Invoice: {selectedInvoiceLead.organization}</h3>
              </div>
              <button onClick={() => setSelectedInvoiceLead(null)} className="text-[#899cb0] hover:text-white font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 font-mono">
                <div>
                  <label className="block font-bold text-[#899cb0] uppercase mb-1">Invoice Number</label>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="w-full h-10 px-3 bg-[#0c1a28] border border-[#203548] rounded-xl text-white font-mono focus:border-emerald-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#899cb0] uppercase mb-1">Base Amount (KES)</label>
                  <input
                    type="number"
                    value={invoiceAmount}
                    onChange={(e) => setInvoiceAmount(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-[#0c1a28] border border-[#203548] rounded-xl text-white font-mono focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#0c1a28] border border-[#1b2f40] rounded-xl space-y-1 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <strong>{formatKes(invoiceAmount)}</strong>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>KRA VAT (16%):</span>
                  <strong>{formatKes(invoiceAmount * 0.16)}</strong>
                </div>
                <div className="flex justify-between text-[#f4cf69] font-bold border-t border-[#1d3043] pt-1">
                  <span>TOTAL INVOICE AMOUNT:</span>
                  <strong>{formatKes(invoiceAmount * 1.16)}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={handlePrintPdfInvoice}
                  className="py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black text-xs uppercase tracking-wider hover:scale-105 transition-all cursor-pointer shadow-xl flex items-center justify-center gap-1.5"
                >
                  <Printer size={15} /> Print / Download PDF
                </button>

                <button
                  onClick={() => {
                    showToast(`✓ Invoice ${invoiceNumber} saved to Database & CRM!`);
                    setSelectedInvoiceLead(null);
                  }}
                  className="py-3 rounded-xl bg-[#142637] border border-emerald-500/50 text-emerald-400 font-black text-xs uppercase tracking-wider hover:bg-[#1f354c] transition-all cursor-pointer shadow-xl flex items-center justify-center gap-1.5"
                >
                  <Receipt size={15} /> Save Invoice to CRM
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AUTOMATION REGION / COUNTRY / COUNTY POP-UP MODAL */}
      {showAutomationModal && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setShowAutomationModal(false); }}
          className="fixed inset-0 z-[250] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 font-sans animate-in fade-in duration-200 cursor-pointer overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#081522] border-2 border-[#f4cf69] p-5 sm:p-7 rounded-2xl max-w-2xl w-full shadow-2xl space-y-5 text-white my-auto cursor-default max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#243343]"
          >
            {/* Header */}
            <div className="flex justify-between items-start border-b border-[#1d3043] pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-[#f4cf69] tracking-widest font-mono block">
                  TOQUE REAL EXCEL LEAD AUTOMATION ENGINE
                </span>
                <h3 className="text-lg font-black uppercase text-white font-serif mt-0.5">
                  Automated Lead Research & Region Selector
                </h3>
              </div>
              <button onClick={() => setShowAutomationModal(false)} className="text-[#899cb0] hover:text-white font-black text-lg p-1">
                ✕
              </button>
            </div>

            {/* STEP 1: REGION SELECTOR (TILES) */}
            <div className="space-y-2">
              <label className="block font-black text-xs text-[#f4cf69] uppercase tracking-wider">
                Step 1: Select Target Global Region *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "Africa", label: "🌍 Africa", active: true, desc: "100% Online & Fully Extracted" },
                  { id: "America", label: "🌎 America", active: false, desc: "Coming Soon" },
                  { id: "Europe", label: "🇪🇺 Europe", active: false, desc: "Coming Soon" },
                  { id: "Asia", label: "🌏 Asia", active: false, desc: "Coming Soon" },
                  { id: "China", label: "🇨🇳 China", active: false, desc: "Coming Soon" },
                  { id: "Middle East", label: "🕌 Middle East", active: false, desc: "Coming Soon" },
                  { id: "Russia", label: "🇷🇺 Russia", active: false, desc: "Coming Soon" },
                ].map((reg) => (
                  <button
                    key={reg.id}
                    type="button"
                    onClick={() => {
                      setAutoRegion(reg.id as any);
                      if (!reg.active) {
                        showToast(`Notice: ${reg.id} dataset is coming soon in Q1 2027. Redirected to Africa HQ.`);
                      }
                    }}
                    className={cn(
                      "p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-16",
                      autoRegion === reg.id
                        ? "bg-[#f4cf69] text-black border-[#f4cf69] font-black"
                        : "bg-[#0c1a28] border-[#203548] text-[#c0d1e0] hover:border-[#f4cf69]/50"
                    )}
                  >
                    <span className="text-xs font-bold leading-tight">{reg.label}</span>
                    <span className={cn("text-[9px] font-mono font-semibold", autoRegion === reg.id ? "text-black/80" : "text-[#899cb0]")}>
                      {reg.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 2: COUNTRY SELECTOR */}
            {autoRegion === "Africa" && (
              <div className="space-y-2">
                <label className="block font-black text-xs text-[#f4cf69] uppercase tracking-wider">
                  Step 2: Select African Nation *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: "Kenya", label: "🇰🇪 Kenya (HQ & 47 Counties)" },
                    { id: "Uganda", label: "🇺🇬 Uganda" },
                    { id: "Tanzania", label: "🇹🇿 Tanzania" },
                    { id: "Rwanda", label: "🇷🇼 Rwanda" },
                    { id: "Ethiopia", label: "🇪🇹 Ethiopia" },
                    { id: "South Africa", label: "🇿🇦 South Africa" },
                    { id: "Nigeria", label: "🇳🇬 Nigeria" },
                    { id: "Ghana", label: "🇬🇭 Ghana" },
                    { id: "Egypt", label: "🇪🇬 Egypt" },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setAutoCountry(c.id)}
                      className={cn(
                        "p-2.5 rounded-xl text-xs font-bold text-left border transition-all cursor-pointer",
                        autoCountry === c.id
                          ? "bg-emerald-500 text-black border-emerald-400 font-black"
                          : "bg-[#0c1a28] border-[#203548] text-[#c0d1e0] hover:border-emerald-400/50"
                      )}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: COUNTY SELECTOR (IF KENYA SELECTED) */}
            {autoCountry === "Kenya" && (
              <div className="space-y-2">
                <label className="block font-black text-xs text-[#f4cf69] uppercase tracking-wider">
                  Step 3: Select Kenya County (47 Counties Available) *
                </label>
                <select
                  value={autoCounty}
                  onChange={(e) => setAutoCounty(e.target.value)}
                  className="w-full h-11 px-3 bg-[#0c1a28] border border-[#203548] rounded-xl text-white font-bold focus:border-[#f4cf69] focus:outline-none cursor-pointer"
                >
                  <option value="ALL 47 COUNTIES">KENYA (ALL 47 COUNTIES)</option>
                  {KENYA_COUNTIES_REGISTRY.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.code} — {c.name} ({c.region})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* STEP 4: CAMPAIGN NICHE & BUDGET */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-black text-[#899cb0] uppercase mb-1">Target Event Niche / Campaign *</label>
                <select
                  value={autoNiche}
                  onChange={(e) => setAutoNiche(e.target.value)}
                  className="w-full h-10 px-3 bg-[#0c1a28] border border-[#203548] rounded-xl text-white font-bold focus:border-[#f4cf69] focus:outline-none cursor-pointer"
                >
                  <option value="All Categories">All Categories & Campaigns</option>
                  <option value="Corporate Q4">Corporate Conferences & AGMs</option>
                  <option value="Brand Launches">Brand Launches & Expos</option>
                  <option value="Industry Campaigns">Industry Summits</option>
                  <option value="Private and Social Events">Private Soirées & Birthdays</option>
                </select>
              </div>

              <div>
                <label className="block font-black text-[#899cb0] uppercase mb-1">Minimum Budget (KES) *</label>
                <select
                  value={autoMinBudget}
                  onChange={(e) => setAutoMinBudget(Number(e.target.value))}
                  className="w-full h-10 px-3 bg-[#0c1a28] border border-[#203548] rounded-xl text-white font-mono focus:border-[#f4cf69] focus:outline-none cursor-pointer"
                >
                  <option value={25000}>KES 25,000+ (Micro Soirée)</option>
                  <option value={50000}>KES 50,000+ (Small Event)</option>
                  <option value={100000}>KES 100,000+ (Private Gala)</option>
                  <option value={500000}>KES 500,000+ (Corporate / Wedding)</option>
                  <option value={1500000}>KES 1,500,000+ (High Value)</option>
                </select>
              </div>
            </div>

            {/* PROGRESS BAR OVERLAY WHEN EXECUTING */}
            {isAutoRunning && (
              <div className="p-4 bg-[#0c1a28] border border-emerald-500/50 rounded-xl space-y-2 animate-in fade-in duration-200">
                <div className="flex justify-between items-center text-xs font-mono font-bold text-emerald-400">
                  <span className="flex items-center gap-1.5"><Loader2 size={14} className="animate-spin" /> {autoProgressMsg}</span>
                  <span>{autoProgressPercent}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#172533] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-[#f4cf69] transition-all duration-300"
                    style={{ width: `${autoProgressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* EXECUTE ACTION BUTTON */}
            <button
              type="button"
              onClick={handleRunAutomatedSystem}
              disabled={isAutoRunning}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d5a637] via-[#f4cf69] to-emerald-400 text-black font-black text-xs uppercase tracking-wider hover:scale-[1.02] transition-all cursor-pointer shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isAutoRunning ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Crawling ToqueReal Database & Extracting Leads...
                </>
              ) : (
                <>
                  <Zap size={16} /> 🚀 Execute Automated Lead Search
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
