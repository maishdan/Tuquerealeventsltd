import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import {
  useAdminBookings,
  useAdminEvents,
  useAdminClients,
  useAdminContacts,
  useAdminTickets,
  useAdminProspects,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
} from "@/hooks/use-dashboard-data";
import { updateBookingStatus } from "@/lib/api/bookings";
import { sendMessage } from "@/lib/api/messages";
import { useAuth } from "@/contexts/AuthContext";
import { AgentAudioVisualizerBar, AgentState } from "@/components/agents-ui/AgentAudioVisualizerBar";
import {
  processCompanionCommand,
  interpretPage,
  speakWithZephyrVoice,
  playZephyrAudioSample,
  ZEPHYR_VOICE_CONFIG,
  type CompanionContext
} from "@/lib/ann-companion";
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
  Minus,
  Eye,
  FileText,
  Heart,
  Music
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
  const location = useLocation();
  const { user, profile } = useAuth();

  // Data Queries
  const { data: bookings = [] } = useAdminBookings();
  const { data: events = [] } = useAdminEvents();
  const { data: clients = [] } = useAdminClients();
  const { data: contacts = [] } = useAdminContacts();
  const { data: tickets = [] } = useAdminTickets();
  const { data: prospects = [] } = useAdminProspects();

  // Mutations
  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useDeleteEvent();

  const [isOpen, setIsOpen] = useState(false);
  const [windowMode, setWindowMode] = useState<WindowMode>("floating");
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [transcriptPreview, setTranscriptPreview] = useState("");
  const [inputText, setInputText] = useState("");

  const emailLower = (user?.email || profile?.email || "").toLowerCase();
  const rawName = profile?.full_name || user?.user_metadata?.full_name || "";

  const adminExactName = (() => {
    if (rawName && rawName.trim().length > 0) return rawName.trim();
    if (emailLower.includes("eventsroyaltouch7@gmail.com")) return "Japheth Owiyo";
    if (emailLower.includes("abigaelmuthoni29@gmail.com")) return "Daniwest";
    return "Japheth Owiyo";
  })();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "ai",
      text: `Hi ${adminExactName}! I'm Ann, your AI companion powered by Zephyr's bright voice. I'm so happy to see you! How are you doing today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const hasGreetedRef = useRef(false);

  const agentState: AgentState = isListening
    ? "listening"
    : isSpeaking
    ? "speaking"
    : isThinking
    ? "listening"
    : "idle";

  // Auto-scroll chat feed
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, windowMode]);

  // One-time media permission request
  useEffect(() => {
    const permKey = "ann_media_permissions_requested";
    const alreadyRequested = localStorage.getItem(permKey);

    if (!alreadyRequested && navigator.mediaDevices?.getUserMedia) {
      localStorage.setItem(permKey, "true");
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then((stream) => stream.getTracks().forEach((track) => track.stop()))
        .catch(() => {
          navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => stream.getTracks().forEach((track) => track.stop()))
            .catch(() => {});
        });
    }
  }, []);

  // Zephyr Voice Speech Synthesis Wrapper
  const speakAIResponse = (text: string) => {
    speakWithZephyrVoice(
      text,
      isVoiceMuted,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  // Play Zephyr Voice Sample Preview
  const handleTestZephyrSample = async () => {
    setIsSpeaking(true);
    await playZephyrAudioSample();
    setIsSpeaking(false);
  };

  // Automatic Warm Companion Greeting on Mount with Zephyr Voice
  useEffect(() => {
    if (!hasGreetedRef.current && adminExactName) {
      hasGreetedRef.current = true;
      const welcomeMsg = `Hi ${adminExactName}! I'm Ann, your AI companion. I'm so happy to see you! How are you doing today?`;
      const timer = setTimeout(() => {
        speakAIResponse(welcomeMsg);
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [adminExactName]);

  // Speech Recognition setup
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

  // Toggle Chat Tile & Speak Warm Greeting with Zephyr Voice
  const handleToggleOpen = () => {
    if (!isOpen) {
      setIsOpen(true);
      const greeting = `Hi ${adminExactName}! I'm right here with you. How can I help or chat with you today?`;
      speakAIResponse(greeting);
    } else {
      setIsOpen(false);
    }
  };

  // Toggle Mic
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

  // Build Companion Context object
  const buildContext = (): CompanionContext => ({
    userName: adminExactName,
    currentPath: location.pathname || "/admin",
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

  // Handle User Input (Text or Voice)
  const handleUserCommand = async (rawCommand: string) => {
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
    setIsThinking(true);

    try {
      const ctx = buildContext();
      const response = await processCompanionCommand(command, ctx);

      setIsThinking(false);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: response.replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        actionTaken: response.actionTaken,
      };

      setMessages((prev) => [...prev, aiMsg]);
      speakAIResponse(response.replyText);
    } catch (err) {
      setIsThinking(false);
      const fallbackText = `I'm right here, ${adminExactName}! Something unexpected happened, but everything is safe in our system. What would you like us to do next?`;
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: fallbackText,
          timestamp,
        },
      ]);
      speakAIResponse(fallbackText);
    }
  };

  // Interpret current screen
  const handleInterpretCurrentScreen = () => {
    const ctx = buildContext();
    const result = interpretPage(location.pathname, ctx);

    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const aiMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "ai",
      text: result.replyText,
      timestamp,
      actionTaken: result.actionTaken,
    };

    setMessages((prev) => [...prev, aiMsg]);
    speakAIResponse(result.replyText);
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
              : "bottom-24 right-3 sm:right-6 w-[92vw] sm:w-[450px] max-w-[calc(100vw-1.5rem)] h-[600px] max-h-[80vh]"
          )}
        >
          {/* TOPBAR HEADER */}
          <div className="p-3.5 bg-gradient-to-r from-[#0d1d2b] via-[#0a1824] to-[#060e17] border-b border-[#f4cf69]/40 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-3">
              {/* Agent Ann Avatar */}
              <div className="relative shrink-0">
                <div
                  className={cn(
                    "h-11 w-11 rounded-full bg-gradient-to-tr from-[#d5a637] via-[#f4cf69] to-[#896019] p-0.5 shadow-lg border border-[#f4cf69] flex items-center justify-center overflow-hidden transition-transform",
                    isSpeaking && "scale-110 animate-pulse"
                  )}
                >
                  <img src="/agent.png" alt="Agent Ann" className="h-full w-full object-cover rounded-full" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-[#07131e] animate-ping" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-[#07131e]" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-white truncate flex items-center gap-1">
                    ANN — ZEPHYR VOICE <Heart size={10} className="text-rose-400 fill-rose-400 shrink-0" />
                  </h3>
                  <span className="px-1.5 py-0.5 bg-[#f4cf69]/20 text-[#f4cf69] text-[8px] font-black uppercase tracking-widest rounded border border-[#f4cf69]/40 shrink-0">
                    ZEPHYR AI
                  </span>
                </div>
                <p className="text-[10px] text-[#9caec2] font-medium flex items-center gap-1 truncate">
                  <Crown size={11} className="text-[#f4cf69] shrink-0" /> Companion to {adminExactName}
                </p>
              </div>
            </div>

            {/* WINDOW CONTROL BUTTONS */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleTestZephyrSample}
                className="p-1.5 rounded-lg bg-[#172533] border border-[#f4cf69]/50 text-[#f4cf69] hover:bg-[#1f3245] transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold px-2"
                title="Test Zephyr's official voice sample audio"
              >
                <Music size={12} /> Sample
              </button>

              <button
                type="button"
                onClick={handleInterpretCurrentScreen}
                className="p-1.5 rounded-lg bg-[#172533] border border-[#293d52] text-[#f4cf69] hover:bg-[#1f3245] transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold px-2"
                title="Ask Ann to interpret the current page"
              >
                <Eye size={13} /> Inspect
              </button>

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
                title={isVoiceMuted ? "Unmute Zephyr's Voice" : "Mute Zephyr's Voice"}
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
                      text: `Chat refreshed! What would you like us to work on or talk about now, ${adminExactName}?`,
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
                title={windowMode === "maximized" ? "Restore to Tile" : "Maximize Window"}
              >
                {windowMode === "maximized" ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
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

          {/* REAL AGENT 5-BAR AUDIO VISUALIZER STRIP */}
          <div className="px-4 py-2 bg-[#040c14] border-b border-[#182736] flex items-center justify-between text-[10px] font-mono shrink-0">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "h-2.5 w-2.5 rounded-full",
                  isListening
                    ? "bg-rose-500 animate-ping"
                    : isSpeaking
                    ? "bg-[#f4cf69] animate-pulse"
                    : "bg-emerald-400"
                )}
              />
              <span className="text-[#a4b5c7] uppercase tracking-wider font-bold">
                {isListening
                  ? "ANN IS LISTENING TO YOUR VOICE..."
                  : isSpeaking
                  ? "ZEPHYR VOICE SPEAKING (BRIGHT & UPBEAT)..."
                  : "ZEPHYR VOICE ENGINE ONLINE • BRIGHT & CLEAR"}
              </span>
            </div>

            {/* Live 5-Bar Audio Visualizer */}
            <AgentAudioVisualizerBar
              state={agentState}
              barCount={5}
              size="sm"
              className="py-1 px-2.5 h-8 border-[#f4cf69]/40 bg-[#091522]"
            />
          </div>

          {/* QUICK COMPANION CHIPS */}
          <div className="px-3 py-2 bg-[#091624] border-b border-[#182736] flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[9px] font-black uppercase tracking-wider text-[#9caec2] shrink-0">
            <span className="text-[#f4cf69] shrink-0 font-bold flex items-center gap-0.5">
              <Zap size={10} /> Quick:
            </span>
            <button
              onClick={() => handleUserCommand("Hi Ann, how are you doing today?")}
              className="px-2.5 py-1 rounded-md bg-[#122233] border border-[#22364c] hover:border-[#f4cf69] hover:text-[#f4cf69] transition-all whitespace-nowrap shrink-0 cursor-pointer font-bold flex items-center gap-1"
            >
              💬 Chat
            </button>
            <button
              onClick={handleInterpretCurrentScreen}
              className="px-2.5 py-1 rounded-md bg-[#122233] border border-[#22364c] hover:border-[#f4cf69] hover:text-[#f4cf69] transition-all whitespace-nowrap shrink-0 cursor-pointer font-bold flex items-center gap-1"
            >
              👁️ Interpret Page
            </button>
            <button
              onClick={() => handleUserCommand("Take me to events page and tell me what you see")}
              className="px-2.5 py-1 rounded-md bg-[#122233] border border-[#22364c] hover:border-[#f4cf69] hover:text-[#f4cf69] transition-all whitespace-nowrap shrink-0 cursor-pointer font-bold"
            >
              🎪 Events
            </button>
            <button
              onClick={() => handleUserCommand("Take me to bookings page and interpret what is there")}
              className="px-2.5 py-1 rounded-md bg-[#122233] border border-[#22364c] hover:border-[#f4cf69] hover:text-[#f4cf69] transition-all whitespace-nowrap shrink-0 cursor-pointer font-bold"
            >
              📅 Bookings
            </button>
            <button
              onClick={() => handleUserCommand("Take me to finance page and pull a PDF report")}
              className="px-2.5 py-1 rounded-md bg-[#122233] border border-[#22364c] hover:border-[#f4cf69] hover:text-[#f4cf69] transition-all whitespace-nowrap shrink-0 cursor-pointer font-bold flex items-center gap-1"
            >
              📄 PDF Report
            </button>
            <button
              onClick={() => handleUserCommand("Take me to users page")}
              className="px-2.5 py-1 rounded-md bg-[#122233] border border-[#22364c] hover:border-[#f4cf69] hover:text-[#f4cf69] transition-all whitespace-nowrap shrink-0 cursor-pointer font-bold"
            >
              👥 Clients
            </button>
          </div>

          {/* CHAT FEED */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-[#203245]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-start gap-2.5 max-w-[90%] sm:max-w-[85%]",
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                {msg.sender === "ai" && (
                  <img
                    src="/agent.png"
                    alt="Agent Ann"
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
                    <span>{msg.sender === "user" ? adminExactName : "Ann (Zephyr Voice)"}</span>
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

            {isThinking && (
              <div className="mr-auto max-w-[85%] flex items-center gap-2 p-3 bg-[#0d1b29] border border-[#f4cf69]/30 text-[#f4cf69] text-xs rounded-xl font-sans animate-pulse">
                <img src="/agent.png" alt="Ann" className="h-5 w-5 rounded-full object-cover shrink-0" />
                <span>Ann is thinking and interpreting...</span>
              </div>
            )}

            {isListening && transcriptPreview && (
              <div className="mr-auto max-w-[88%] p-3 bg-rose-950/50 border border-rose-500/50 text-rose-200 text-xs rounded-xl font-mono animate-pulse flex items-center gap-2">
                <img src="/agent.png" alt="Agent Ann" className="h-5 w-5 rounded-full object-cover shrink-0" />
                <span>🎤 Ann Hearing: "{transcriptPreview}"</span>
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
              title={isListening ? "Stop listening" : "Talk to Ann (Zephyr Voice Assistant)"}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? "Ann is listening with Zephyr voice..." : "Chat, ask Ann to see the page, create events, message users..."}
              className="flex-1 h-10 px-3.5 bg-[#0d1b29] border border-[#203348] focus:border-[#f4cf69] rounded-xl text-xs text-white placeholder-[#687a8e] focus:outline-none transition-all"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#d5a637] to-[#f4cf69] text-black flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all shadow-md shrink-0 cursor-pointer"
              title="Send message to Ann"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* COMPACT CIRCULAR FLOATING TRIGGER BUTTON WITH RIPPLE VISUALIZATION */}
      <button
        type="button"
        onClick={handleToggleOpen}
        className={cn(
          "fixed bottom-28 right-4 sm:right-8 z-[9999] h-12 w-12 rounded-full p-0.5 bg-gradient-to-tr from-[#d5a637] via-[#f4cf69] to-[#896019] border-2 border-[#f4cf69] shadow-[0_8px_25px_rgba(244,207,105,0.6),0_0_15px_rgba(244,207,105,0.4)] hover:scale-110 active:scale-95 transition-all cursor-pointer group overflow-hidden flex items-center justify-center",
          isOpen && "ring-4 ring-[#f4cf69]/50"
        )}
        title="Agent Ann — Zephyr Voice AI Companion"
      >
        {/* Expanding Ripple Auras when Speaking or Listening */}
        {(isSpeaking || isListening) && (
          <>
            <span className="absolute -inset-2 rounded-full border-2 border-[#f4cf69] opacity-80 animate-ping" />
            <span className="absolute -inset-4 rounded-full bg-[#f4cf69]/25 blur-md animate-pulse" />
          </>
        )}

        <div className="relative h-full w-full rounded-full overflow-hidden flex items-center justify-center bg-[#07131e]">
          <img
            src="/agent.png"
            alt="Agent Ann"
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
