import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  useAdminBookings,
  useAdminEvents,
  useAdminClients,
  computeAdminKpis,
  formatKes
} from "@/hooks/use-dashboard-data";
import { useAuth } from "@/contexts/AuthContext";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  X,
  Sparkles,
  RotateCcw,
  Crown,
  Zap,
  Activity,
  Maximize2,
  Minimize2,
  Minus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  actionTaken?: string;
}

type WindowMode = "floating" | "maximized";

export function AdminFloatingAIChatbot() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { data: bookings = [] } = useAdminBookings();
  const { data: events = [] } = useAdminEvents();
  const { data: clients = [] } = useAdminClients();

  const [isOpen, setIsOpen] = useState(false);
  const [windowMode, setWindowMode] = useState<WindowMode>("floating");
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcriptPreview, setTranscriptPreview] = useState("");
  const [inputText, setInputText] = useState("");

  const emailLower = (user?.email || profile?.email || "").toLowerCase();
  const rawName = profile?.full_name || user?.user_metadata?.full_name || "";
  const bossName = rawName || (emailLower.includes("daniwest") ? "DANIWEST" : "Boss");

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "ai",
      text: `Welcome to the system, ${bossName}! I am your Executive AI Agent. All system operations are running at peak efficiency. Speak or type instructions like 'go to bookings', 'open finance', or 'show revenue summary'. How can I assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll chat feed
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, windowMode]);

  // Speech Recognition initialization
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscriptPreview(currentTranscript);

        if (event.results[0].isFinal) {
          setIsListening(false);
          setTranscriptPreview("");
          handleUserCommand(currentTranscript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setTranscriptPreview("");
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Text-To-Speech Synthesis
  const speakAIResponse = (text: string) => {
    if (!("speechSynthesis" in window) || isVoiceMuted) return;

    window.speechSynthesis.cancel();

    const cleanSpeechText = text
      .replace(/[*_~#]/g, "")
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice =
      voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          (v.name.includes("Natural") ||
            v.name.includes("Google") ||
            v.name.includes("Daniel") ||
            v.name.includes("Samantha") ||
            v.name.includes("Alex"))
      ) || voices.find((v) => v.lang.startsWith("en"));

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Welcome Greeting when Boss clicks the floating icon
  const handleToggleOpen = () => {
    if (!isOpen) {
      setIsOpen(true);
      const greeting = `Welcome back to the Command Center, ${bossName}! All system operations are synced and running smoothly. What are your commands today?`;
      speakAIResponse(greeting);
    } else {
      setIsOpen(false);
    }
  };

  // Toggle Voice Listening
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice recognition is not supported by your browser. Please use text input.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setTranscriptPreview("");
    } else {
      try {
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
        setIsSpeaking(false);
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Error starting speech recognition:", err);
      }
    }
  };

  // Process Voice or Typed System Command
  const handleUserCommand = (rawCommand: string) => {
    const command = rawCommand.trim();
    if (!command) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: command,
      timestamp,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    const lower = command.toLowerCase();
    let replyText = "";
    let actionTaken = "";

    const kpis = computeAdminKpis(bookings, clients, events);

    // 1. Navigation Commands
    if (lower.includes("booking") || lower.includes("crm") || lower.includes("sales") || lower.includes("reservation")) {
      replyText = `Opening Sales & CRM Bookings Directory, ${bossName}. You currently have ${bookings.length} live bookings in the database.`;
      actionTaken = "Navigated to /admin/bookings";
      navigate({ to: "/admin/bookings" });
    } else if (lower.includes("event") || lower.includes("production")) {
      replyText = `Opening Event Production Hub, ${bossName}. There are ${events.length} registered events in total.`;
      actionTaken = "Navigated to /admin/events";
      navigate({ to: "/admin/events" });
    } else if (lower.includes("finance") || lower.includes("revenue") || lower.includes("money") || lower.includes("cash")) {
      replyText = `Accessing Financial Command Center, ${bossName}. Your gross revenue stands at ${formatKes(kpis.totalRevenue)}.`;
      actionTaken = "Navigated to /admin/finance";
      navigate({ to: "/admin/finance" });
    } else if (lower.includes("payment") || lower.includes("receipt") || lower.includes("paid")) {
      replyText = `Opening Payment Transactions & Invoices, ${bossName}.`;
      actionTaken = "Navigated to /admin/payments";
      navigate({ to: "/admin/payments" });
    } else if (lower.includes("user") || lower.includes("client") || lower.includes("customer")) {
      replyText = `Opening Client Directory, ${bossName}. There are ${clients.length} registered clients operating on the platform.`;
      actionTaken = "Navigated to /admin/users";
      navigate({ to: "/admin/users" });
    } else if (lower.includes("prospect") || lower.includes("pipeline") || lower.includes("lead")) {
      replyText = `Opening Prospects & Sales Pipeline, ${bossName}.`;
      actionTaken = "Navigated to /admin/prospects";
      navigate({ to: "/admin/prospects" });
    } else if (lower.includes("proposal") || lower.includes("quote") || lower.includes("quotation")) {
      replyText = `Opening Proposals and Quotations Hub, ${bossName}.`;
      actionTaken = "Navigated to /admin/proposals";
      navigate({ to: "/admin/proposals" });
    } else if (lower.includes("ai") || lower.includes("insight") || lower.includes("discovery") || lower.includes("scan")) {
      replyText = `Navigating to Pan-Africa AI Event Discovery Engine, ${bossName}.`;
      actionTaken = "Navigated to /admin/ai";
      navigate({ to: "/admin/ai" });
    } else if (lower.includes("marketing") || lower.includes("campaign")) {
      replyText = `Opening Marketing Intelligence Command Center, ${bossName}.`;
      actionTaken = "Navigated to /admin/marketing";
      navigate({ to: "/admin/marketing" });
    } else if (lower.includes("report") || lower.includes("analytic")) {
      replyText = `Opening Executive Reports & Operations Analytics, ${bossName}.`;
      actionTaken = "Navigated to /admin/reports";
      navigate({ to: "/admin/reports" });
    } else if (lower.includes("team") || lower.includes("staff")) {
      replyText = `Opening Personnel Directory & Team Command, ${bossName}.`;
      actionTaken = "Navigated to /admin/team";
      navigate({ to: "/admin/team" });
    } else if (lower.includes("setting") || lower.includes("config")) {
      replyText = `Opening System Settings, ${bossName}.`;
      actionTaken = "Navigated to /admin/settings";
      navigate({ to: "/admin/settings" });
    } else if (lower.includes("contact") || lower.includes("message") || lower.includes("inquiry")) {
      replyText = `Opening Inbound Messages and Notifications, ${bossName}.`;
      actionTaken = "Navigated to /admin/contacts";
      navigate({ to: "/admin/contacts" });
    } else if (lower.includes("home") || lower.includes("overview") || lower.includes("dashboard")) {
      replyText = `Returning to CEO Executive Overview, ${bossName}.`;
      actionTaken = "Navigated to /admin";
      navigate({ to: "/admin" });
    }
    // 2. Intelligence Queries
    else if (lower.includes("stat") || lower.includes("summary") || lower.includes("health") || lower.includes("performance") || lower.includes("fetch")) {
      replyText = `System Performance Briefing for ${bossName}: Gross Revenue is ${formatKes(kpis.totalRevenue)}. Active Bookings: ${bookings.length}. Active Events: ${events.length}. Total Registered Clients: ${clients.length}. System health is operating at 100%.`;
      actionTaken = "Live System Metrics Queried";
    } else if (lower.includes("who is the boss") || lower.includes("who am i") || lower.includes("ceo") || lower.includes("who is ceo")) {
      replyText = `You are ${bossName}, Super Admin Developer & CEO of TOQUE REAL EVENTS LIMITED. You hold full supreme administrative authority over this enterprise system.`;
    } else if (lower.includes("company") || lower.includes("toque real") || lower.includes("royal touch")) {
      replyText = "TOQUE REAL EVENTS LIMITED (formerly Royal Touch Events) is East Africa's premier luxury event planning and production agency headquartered in Kilimani, Nairobi, Kenya.";
    } else if (lower.includes("help") || lower.includes("command") || lower.includes("what can you do")) {
      replyText = `Commands you can give me include: 'Go to Bookings', 'Open Finance', 'Fetch Data', 'Show Revenue', 'Open Events', 'Go to Users', 'Open AI Insights', or 'System Settings'. Simply speak or type!`;
    } else {
      replyText = `Understood, ${bossName}. Executing on your command: "${command}". All database records and modules are synced in real-time.`;
    }

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        actionTaken,
      };

      setMessages((prev) => [...prev, aiMsg]);
      speakAIResponse(replyText);
    }, 400);
  };

  const handleSubmitText = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      handleUserCommand(inputText);
    }
  };

  return (
    <>
      {/* FLOATING TILE SCREEN */}
      {isOpen && (
        <div
          className={cn(
            "fixed z-[99999] bg-[#07131e]/98 border-2 border-[#f4cf69] shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_50px_rgba(244,207,105,0.3)] backdrop-blur-2xl rounded-2xl flex flex-col overflow-hidden transition-all duration-300 font-sans text-white",
            windowMode === "maximized"
              ? "inset-2 sm:inset-6 lg:inset-10 w-auto h-auto"
              : "bottom-24 right-3 sm:right-6 w-[92vw] sm:w-[440px] max-w-[calc(100vw-1.5rem)] h-[580px] max-h-[78vh]"
          )}
        >
          {/* TOPBAR HEADER */}
          <div className="p-3.5 bg-gradient-to-r from-[#0d1d2b] via-[#0a1824] to-[#060e17] border-b border-[#f4cf69]/40 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-3">
              {/* Custom AI Agent Avatar */}
              <div className="relative shrink-0">
                <div
                  className={cn(
                    "h-11 w-11 rounded-full bg-gradient-to-tr from-[#d5a637] via-[#f4cf69] to-[#896019] p-0.5 shadow-lg border border-[#f4cf69] flex items-center justify-center overflow-hidden transition-transform",
                    isSpeaking && "scale-110 animate-pulse"
                  )}
                >
                  <img src="/tagent.png" alt="Executive AI Agent" className="h-full w-full object-cover rounded-full" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-[#07131e] animate-ping" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-[#07131e]" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-white truncate">
                    TOQUE REAL EXECUTIVE AI
                  </h3>
                  <span className="px-1.5 py-0.5 bg-[#f4cf69]/20 text-[#f4cf69] text-[8px] font-black uppercase tracking-widest rounded border border-[#f4cf69]/40 shrink-0">
                    TALKING BOT
                  </span>
                </div>
                <p className="text-[10px] text-[#9caec2] font-medium flex items-center gap-1 truncate">
                  <Crown size={11} className="text-[#f4cf69] shrink-0" /> Serving {bossName} (CEO Command)
                </p>
              </div>
            </div>

            {/* WINDOW CONTROL BUTTONS */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsVoiceMuted(!isVoiceMuted);
                  if (isSpeaking) window.speechSynthesis.cancel();
                }}
                className={cn(
                  "p-1.5 rounded-lg border transition-all cursor-pointer",
                  isVoiceMuted
                    ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                    : "bg-[#172533] border-[#293d52] text-[#f4cf69] hover:bg-[#1f3245]"
                )}
                title={isVoiceMuted ? "Unmute AI Voice" : "Mute AI Voice"}
              >
                {isVoiceMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMessages([
                    {
                      id: "1",
                      sender: "ai",
                      text: `Chat cleared, ${bossName}! Ready for your next voice or text instruction.`,
                      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    },
                  ]);
                }}
                className="p-1.5 rounded-lg bg-[#172533] border border-[#293d52] text-[#9caec2] hover:text-white hover:bg-[#1f3245] transition-all cursor-pointer"
                title="Reset Conversation"
              >
                <RotateCcw size={15} />
              </button>

              <button
                type="button"
                onClick={() => setWindowMode(windowMode === "floating" ? "maximized" : "floating")}
                className="p-1.5 rounded-lg bg-[#172533] border border-[#293d52] text-[#f4cf69] hover:text-white hover:bg-[#1f3245] transition-all cursor-pointer"
                title={windowMode === "maximized" ? "Restore to Tile" : "Maximize to Full Page"}
              >
                {windowMode === "maximized" ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-[#172533] border border-[#293d52] text-[#9caec2] hover:text-white hover:bg-[#1f3245] transition-all cursor-pointer"
                title="Minimize Tile"
              >
                <Minus size={15} />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-[#172533] border border-[#293d52] text-[#9caec2] hover:text-white hover:bg-rose-600 transition-all cursor-pointer ml-0.5"
                title="Close AI Assistant"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* AUDIO VISUALIZER / STATUS STRIP */}
          <div className="px-4 py-2 bg-[#040c14] border-b border-[#182736] flex items-center justify-between text-[10px] font-mono shrink-0">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  isListening
                    ? "bg-rose-500 animate-ping"
                    : isSpeaking
                    ? "bg-[#f4cf69] animate-pulse"
                    : "bg-emerald-400"
                )}
              />
              <span className="text-[#a4b5c7] uppercase tracking-wider font-bold">
                {isListening
                  ? "LISTENING TO VOICE..."
                  : isSpeaking
                  ? "AI SPEAKING..."
                  : "AI ONLINE • VOICE & COMMANDS READY"}
              </span>
            </div>

            <div className="flex items-center gap-0.5 h-3">
              {[40, 75, 100, 60, 90, 50, 80].map((h, idx) => (
                <div
                  key={idx}
                  style={{ height: isSpeaking || isListening ? `${h}%` : "30%" }}
                  className={cn(
                    "w-0.5 bg-[#f4cf69] rounded-full transition-all duration-300",
                    (isSpeaking || isListening) && "animate-pulse"
                  )}
                />
              ))}
            </div>
          </div>

          {/* QUICK COMMAND CHIPS */}
          <div className="px-3 py-2 bg-[#091624] border-b border-[#182736] flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[9px] font-black uppercase tracking-wider text-[#9caec2] shrink-0">
            <span className="text-[#f4cf69] shrink-0 font-bold flex items-center gap-0.5">
              <Zap size={10} /> Quick:
            </span>
            <button
              onClick={() => handleUserCommand("go to bookings")}
              className="px-2.5 py-1 rounded-md bg-[#122233] border border-[#22364c] hover:border-[#f4cf69] hover:text-[#f4cf69] transition-all whitespace-nowrap shrink-0 cursor-pointer font-bold"
            >
              📅 Bookings
            </button>
            <button
              onClick={() => handleUserCommand("open finance")}
              className="px-2.5 py-1 rounded-md bg-[#122233] border border-[#22364c] hover:border-[#f4cf69] hover:text-[#f4cf69] transition-all whitespace-nowrap shrink-0 cursor-pointer font-bold"
            >
              💰 Finance
            </button>
            <button
              onClick={() => handleUserCommand("fetch system summary")}
              className="px-2.5 py-1 rounded-md bg-[#122233] border border-[#22364c] hover:border-[#f4cf69] hover:text-[#f4cf69] transition-all whitespace-nowrap shrink-0 cursor-pointer font-bold"
            >
              📊 Fetch Stats
            </button>
            <button
              onClick={() => handleUserCommand("open events")}
              className="px-2.5 py-1 rounded-md bg-[#122233] border border-[#22364c] hover:border-[#f4cf69] hover:text-[#f4cf69] transition-all whitespace-nowrap shrink-0 cursor-pointer font-bold"
            >
              🎪 Events
            </button>
            <button
              onClick={() => handleUserCommand("go to users")}
              className="px-2.5 py-1 rounded-md bg-[#122233] border border-[#22364c] hover:border-[#f4cf69] hover:text-[#f4cf69] transition-all whitespace-nowrap shrink-0 cursor-pointer font-bold"
            >
              👥 Clients
            </button>
            <button
              onClick={() => handleUserCommand("go to ai insights")}
              className="px-2.5 py-1 rounded-md bg-[#122233] border border-[#22364c] hover:border-[#f4cf69] hover:text-[#f4cf69] transition-all whitespace-nowrap shrink-0 cursor-pointer font-bold"
            >
              💡 AI Insights
            </button>
          </div>

          {/* CHAT FEED */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-[#203245]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-start gap-2.5 max-w-[90%] sm:max-w-[82%]",
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                {/* Avatar for AI message */}
                {msg.sender === "ai" && (
                  <img
                    src="/tagent.png"
                    alt="AI Agent"
                    className="h-7 w-7 rounded-full object-cover border border-[#f4cf69]/60 shadow-md shrink-0 mt-1"
                  />
                )}

                <div
                  className={cn(
                    "flex flex-col text-xs leading-relaxed space-y-1",
                    msg.sender === "user" ? "items-end" : "items-start"
                  )}
                >
                  <div className="flex items-center gap-1.5 text-[8px] font-mono text-[#899cb0] uppercase tracking-wider px-1">
                    <span>{msg.sender === "user" ? bossName : "Executive AI"}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={cn(
                      "p-3.5 rounded-xl shadow-md border text-xs sm:text-sm",
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-[#d5a637] to-[#f4cf69] text-black border-[#f4cf69] font-medium rounded-tr-none"
                        : "bg-[#0f1d2c] text-[#e3eaf2] border-[#22364c] rounded-tl-none font-sans"
                    )}
                  >
                    {msg.text}

                    {msg.actionTaken && (
                      <div className="mt-2.5 pt-2 border-t border-emerald-500/30 flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                        <Activity size={12} /> {msg.actionTaken}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isListening && transcriptPreview && (
              <div className="mr-auto max-w-[88%] p-3 bg-rose-950/50 border border-rose-500/50 text-rose-200 text-xs rounded-xl font-mono animate-pulse flex items-center gap-2">
                <img src="/tagent.png" alt="AI Agent" className="h-5 w-5 rounded-full object-cover shrink-0" />
                <span>🎤 Hearing: "{transcriptPreview}"</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* INPUT FORM PANEL */}
          <form onSubmit={handleSubmitText} className="p-3 bg-[#050e17] border-t border-[#182736] flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleListening}
              className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center border transition-all shrink-0 cursor-pointer",
                isListening
                  ? "bg-rose-600 text-white border-rose-400 animate-bounce shadow-[0_0_15px_rgba(225,29,72,0.6)]"
                  : "bg-[#0f1e2d] text-[#f4cf69] border-[#283e56] hover:bg-[#1a2e42] hover:border-[#f4cf69]"
              )}
              title={isListening ? "Stop listening" : "Speak command (Voice AI)"}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? "Listening to your voice..." : "Type command or talk..."}
              className="flex-1 h-10 px-3.5 bg-[#0d1b29] border border-[#203348] focus:border-[#f4cf69] rounded-xl text-xs text-white placeholder-[#687a8e] focus:outline-none transition-all"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#d5a637] to-[#f4cf69] text-black flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all shadow-md shrink-0 cursor-pointer"
              title="Send command"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* COMPACT CIRCULAR FLOATING TRIGGER BUTTON */}
      <button
        type="button"
        onClick={handleToggleOpen}
        className={cn(
          "fixed bottom-28 right-4 sm:right-8 z-[9999] h-12 w-12 rounded-full p-0.5 bg-gradient-to-tr from-[#d5a637] via-[#f4cf69] to-[#896019] border-2 border-[#f4cf69] shadow-[0_8px_25px_rgba(244,207,105,0.6),0_0_15px_rgba(244,207,105,0.4)] hover:scale-110 active:scale-95 transition-all cursor-pointer group overflow-hidden flex items-center justify-center",
          isOpen && "ring-4 ring-[#f4cf69]/50"
        )}
        title="TOQUE REAL Executive Talking AI Assistant"
      >
        {(isSpeaking || isListening) && (
          <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#f4cf69] to-[#d5a637] opacity-85 blur animate-ping" />
        )}

        <div className="relative h-full w-full rounded-full overflow-hidden flex items-center justify-center bg-[#07131e]">
          <img
            src="/tagent.png"
            alt="AI Agent"
            className="h-full w-full object-cover rounded-full transition-transform duration-300 group-hover:scale-110"
          />

          <div className="absolute top-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-[#07131e] flex items-center justify-center shadow-sm">
            <Sparkles size={8} className="text-black" />
          </div>
        </div>
      </button>
    </>
  );
}
