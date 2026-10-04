import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAdminBookings, useAdminEvents, useAdminClients, computeAdminKpis, formatKes } from "@/hooks/use-dashboard-data";
import { useAuth } from "@/contexts/AuthContext";
import {
  Bot,
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
  ArrowRight,
  Minimize2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  actionTaken?: string;
}

export function AdminFloatingAIChatbot() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { data: bookings = [] } = useAdminBookings();
  const { data: events = [] } = useAdminEvents();
  const { data: clients = [] } = useAdminClients();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "ai",
      text: "Greetings CEO! I am your Talking Executive AI Assistant. You can speak or type commands like 'go to bookings', 'open finance', or 'show revenue summary'. How can I assist you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [transcriptPreview, setTranscriptPreview] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Initialize Web Speech Recognition if available
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

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
        setTranscriptPreview("");
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Text-To-Speech Synthesis (AI Talking Back)
  const speakAIResponse = (text: string) => {
    if (!("speechSynthesis" in window) || isVoiceMuted) return;

    window.speechSynthesis.cancel(); // Stop any ongoing speech

    // Clean text of markdown/emojis for speech
    const cleanSpeechText = text
      .replace(/[*_~#]/g, "")
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(
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

  // Toggle Voice Listening
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice recognition is not supported by your browser. Please use text input or try Chrome/Edge.");
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

  // Process User Speech or Typed Command
  const handleUserCommand = (rawCommand: string) => {
    const command = rawCommand.trim();
    if (!command) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Add User Message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: command,
      timestamp,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    // Analyze command and generate system action response
    const lower = command.toLowerCase();
    let replyText = "";
    let actionTaken = "";

    // 1. Navigation Commands
    if (lower.includes("booking") || lower.includes("reservations") || lower.includes("book")) {
      replyText = `Opening Executive Bookings Directory. You currently have ${bookings.length} total bookings on file.`;
      actionTaken = "Navigated to /admin/bookings";
      navigate({ to: "/admin/bookings" });
    } else if (lower.includes("event") || lower.includes("production")) {
      replyText = `Opening Event Production Directory. You have ${events.length} active events in total.`;
      actionTaken = "Navigated to /admin/events";
      navigate({ to: "/admin/events" });
    } else if (lower.includes("finance") || lower.includes("revenue") || lower.includes("money") || lower.includes("payment")) {
      const kpis = computeAdminKpis(bookings, clients, events);
      replyText = `Accessing Financial Command Center. Your current gross revenue stands at ${formatKes(kpis.totalRevenue)}.`;
      actionTaken = "Navigated to /admin/finance";
      navigate({ to: "/admin/finance" });
    } else if (lower.includes("user") || lower.includes("client") || lower.includes("customer")) {
      replyText = `Opening Client Directory. You have ${clients.length} registered clients on the platform.`;
      actionTaken = "Navigated to /admin/users";
      navigate({ to: "/admin/users" });
    } else if (lower.includes("ai") || lower.includes("insight") || lower.includes("discovery") || lower.includes("scan")) {
      replyText = "Opening Pan-Africa AI Event Opportunity Discovery Engine.";
      actionTaken = "Navigated to /admin/ai";
      navigate({ to: "/admin/ai" });
    } else if (lower.includes("setting") || lower.includes("config")) {
      replyText = "Opening System Settings.";
      actionTaken = "Navigated to /admin/settings";
      navigate({ to: "/admin/settings" });
    } else if (lower.includes("marketing") || lower.includes("campaign")) {
      replyText = "Opening Marketing Intelligence Command Center.";
      actionTaken = "Navigated to /admin/marketing";
      navigate({ to: "/admin/marketing" });
    } else if (lower.includes("proposal") || lower.includes("quote")) {
      replyText = "Opening Proposals and Quotations Hub.";
      actionTaken = "Navigated to /admin/proposals";
      navigate({ to: "/admin/proposals" });
    } else if (lower.includes("contact") || lower.includes("lead") || lower.includes("inquir")) {
      replyText = "Opening Inbound Contacts & Lead Registry.";
      actionTaken = "Navigated to /admin/contacts";
      navigate({ to: "/admin/contacts" });
    } else if (lower.includes("home") || lower.includes("overview") || lower.includes("dashboard")) {
      replyText = "Returning to CEO Command Center Overview.";
      actionTaken = "Navigated to /admin";
      navigate({ to: "/admin" });
    }
    // 2. Query & Intelligence Commands
    else if (lower.includes("stat") || lower.includes("summary") || lower.includes("health") || lower.includes("performance")) {
      const kpis = computeAdminKpis(bookings, clients, events);
      replyText = `System Operational Summary: Total gross revenue is ${formatKes(kpis.totalRevenue)}. You have ${bookings.length} bookings, ${events.length} active events, and ${clients.length} registered clients operating at optimal health.`;
    } else if (lower.includes("help") || lower.includes("what can you do") || lower.includes("command")) {
      replyText = "I am your Talking Executive AI. Voice or text commands you can give me include: 'Go to Bookings', 'Open Finance', 'Show Revenue', 'Open Events', 'Go to Users', 'Open AI Insights', or 'System Settings'.";
    } else {
      replyText = `Understood, CEO. Operating on your command: "${command}". All systems are synced and functioning at peak performance.`;
    }

    // Add AI Response
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
    <div className="fixed bottom-28 right-6 z-[9999] font-sans">
      {/* POPUP TILE CHATBOT SCREEN */}
      {isOpen && (
        <div className="mb-4 w-[380px] sm:w-[420px] max-w-[calc(100vw-2rem)] h-[580px] max-h-[82vh] bg-[#07131e]/95 border-2 border-[#e6b83f]/60 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(230,184,63,0.15)] backdrop-blur-2xl rounded-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          {/* HEADER */}
          <div className="p-4 bg-gradient-to-r from-[#0d1d2b] via-[#091521] to-[#060e17] border-b border-[#e6b83f]/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              {/* Talking AI Icon Avatar */}
              <div className="relative">
                <div
                  className={cn(
                    "h-10 w-10 rounded-full bg-gradient-to-tr from-[#d5a637] via-[#f4cf69] to-[#896019] p-0.5 shadow-md flex items-center justify-center transition-transform",
                    isSpeaking && "scale-110 animate-pulse"
                  )}
                >
                  <div className="h-full w-full bg-[#07131e] rounded-full flex items-center justify-center text-[#f4cf69]">
                    <Bot size={22} className={cn(isSpeaking && "animate-bounce text-[#f4cf69]")} />
                  </div>
                </div>
                {/* Live Online Badge */}
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-[#07131e] animate-ping" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-[#07131e]" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-white">
                    TOQUE REAL EXECUTIVE AI
                  </h3>
                  <span className="px-1.5 py-0.5 bg-[#f4cf69]/20 text-[#f4cf69] text-[8px] font-black uppercase tracking-widest rounded border border-[#f4cf69]/40">
                    TALKING BOT
                  </span>
                </div>
                <p className="text-[10px] text-[#8d9bad] font-medium flex items-center gap-1">
                  <Crown size={10} className="text-[#f4cf69]" /> Active Voice Command Center
                </p>
              </div>
            </div>

            {/* Header Action Controls */}
            <div className="flex items-center gap-1">
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
                      text: "Chat cleared, CEO! I am ready for your next voice or text instruction.",
                      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    },
                  ]);
                }}
                className="p-1.5 rounded-lg bg-[#172533] border border-[#293d52] text-[#8d9bad] hover:text-white hover:bg-[#1f3245] transition-all cursor-pointer"
                title="Reset Conversation"
              >
                <RotateCcw size={15} />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-[#172533] border border-[#293d52] text-[#8d9bad] hover:text-white hover:bg-rose-600 transition-all cursor-pointer ml-1"
                title="Close AI Assistant"
              >
                <Minimize2 size={15} />
              </button>
            </div>
          </div>

          {/* AUDIO VISUALIZER / STATUS STRIP */}
          <div className="px-4 py-2 bg-[#040c14] border-b border-[#182736] flex items-center justify-between text-[10px] font-mono">
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
              <span className="text-[#98a7b7] uppercase tracking-wider font-bold">
                {isListening
                  ? "LISTENING TO VOICE..."
                  : isSpeaking
                  ? "AI SPEAKING..."
                  : "AI ONLINE • VOICE READY"}
              </span>
            </div>

            {/* Sound Wave Animation Bars */}
            <div className="flex items-center gap-0.5 h-3">
              {[40, 70, 100, 60, 90, 50].map((h, idx) => (
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
          <div className="px-3 py-2 bg-[#091522] border-b border-[#182736] flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[9px] font-black uppercase tracking-wider text-[#98a7b7]">
            <span className="text-[#f4cf69] shrink-0 font-bold flex items-center gap-0.5">
              <Zap size={10} /> Quick:
            </span>
            <button
              onClick={() => handleUserCommand("go to bookings")}
              className="px-2 py-1 rounded bg-[#132233] border border-[#22364c] hover:border-[#f4cf69] hover:text-[#f4cf69] transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              📅 Bookings
            </button>
            <button
              onClick={() => handleUserCommand("open finance")}
              className="px-2 py-1 rounded bg-[#132233] border border-[#22364c] hover:border-[#f4cf69] hover:text-[#f4cf69] transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              💰 Finance
            </button>
            <button
              onClick={() => handleUserCommand("open events")}
              className="px-2 py-1 rounded bg-[#132233] border border-[#22364c] hover:border-[#f4cf69] hover:text-[#f4cf69] transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              🎪 Events
            </button>
            <button
              onClick={() => handleUserCommand("go to users")}
              className="px-2 py-1 rounded bg-[#132233] border border-[#22364c] hover:border-[#f4cf69] hover:text-[#f4cf69] transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              👥 Clients
            </button>
            <button
              onClick={() => handleUserCommand("go to ai insights")}
              className="px-2 py-1 rounded bg-[#132233] border border-[#22364c] hover:border-[#f4cf69] hover:text-[#f4cf69] transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              💡 AI Insights
            </button>
          </div>

          {/* CHAT MESSAGES FEED */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin scrollbar-thumb-[#203245]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex flex-col max-w-[88%] text-xs leading-relaxed space-y-1",
                  msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                )}
              >
                <div className="flex items-center gap-1.5 text-[8px] font-mono text-[#7b8e9f] uppercase tracking-wider px-1">
                  <span>{msg.sender === "user" ? (profile?.full_name || "CEO Admin") : "Executive AI"}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={cn(
                    "p-3 rounded-xl shadow-md border text-xs",
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-[#d5a637] to-[#f4cf69] text-black border-[#f4cf69] font-medium rounded-tr-none"
                      : "bg-[#0f1d2c] text-[#e3eaf2] border-[#22364c] rounded-tl-none font-sans"
                  )}
                >
                  {msg.text}

                  {msg.actionTaken && (
                    <div className="mt-2 pt-1.5 border-t border-emerald-500/30 flex items-center gap-1 text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                      <Activity size={10} /> {msg.actionTaken}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Transcript Preview while speaking */}
            {isListening && transcriptPreview && (
              <div className="mr-auto max-w-[88%] p-2.5 bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs rounded-xl font-mono animate-pulse">
                🎤 Hearing: "{transcriptPreview}"
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* INPUT PANEL */}
          <form onSubmit={handleSubmitText} className="p-3 bg-[#050e17] border-t border-[#182736] flex items-center gap-2">
            {/* Microphone Toggle Button */}
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

            {/* Command Text Input */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? "Listening to your voice..." : "Type command or talk..."}
              className="flex-1 h-10 px-3 bg-[#0d1b29] border border-[#203348] focus:border-[#f4cf69] rounded-xl text-xs text-white placeholder-[#687a8e] focus:outline-none transition-all"
            />

            {/* Send Button */}
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

      {/* FLOATING TRIGGER BUTTON (TALKING AI ICON) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative h-14 w-14 rounded-full bg-gradient-to-tr from-[#091522] via-[#0f2338] to-[#152e4a] border-2 border-[#f4cf69] text-[#f4cf69] flex items-center justify-center shadow-[0_10px_35px_rgba(244,207,105,0.4)] hover:scale-110 active:scale-95 transition-all cursor-pointer group",
          isOpen && "ring-4 ring-[#f4cf69]/30"
        )}
        title="TOQUE REAL Executive Talking AI Assistant"
      >
        {/* Pulsing Aura Rings when Talking or Listening */}
        {(isSpeaking || isListening) && (
          <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#f4cf69] to-[#d5a637] opacity-75 blur animate-ping" />
        )}

        <div className="relative h-full w-full rounded-full flex items-center justify-center">
          <Bot size={26} className={cn("group-hover:rotate-12 transition-transform", isSpeaking && "animate-bounce text-[#f4cf69]")} />

          {/* Microphone Badge Indicator */}
          <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 text-black border-2 border-[#07131e] flex items-center justify-center font-black text-[9px] shadow-sm">
            <Sparkles size={10} />
          </div>
        </div>
      </button>
    </div>
  );
}
