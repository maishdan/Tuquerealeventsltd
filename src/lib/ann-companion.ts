import type { Booking, EventRecord, ContactInquiry, ProspectRecord } from "./database.types";
import { formatKes } from "./dashboard-mock-data";

export interface CompanionResponse {
  replyText: string;
  actionTaken?: string;
  pdfTriggered?: boolean;
  navigatedTo?: string;
}

export interface CompanionContext {
  userName: string;
  currentPath: string;
  navigate: (opts: { to: string }) => void;
  bookings: Booking[];
  events: EventRecord[];
  clients: any[];
  contacts: ContactInquiry[];
  tickets: any[];
  prospects: ProspectRecord[];
  // Mutations & Actions
  createEventFn?: (data: Partial<EventRecord>) => Promise<any>;
  updateEventFn?: (opts: { id: string; updates: Partial<EventRecord> }) => Promise<any>;
  deleteEventFn?: (id: string) => Promise<any>;
  createBookingFn?: (data: any) => Promise<any>;
  updateBookingStatusFn?: (opts: { id: string; status: any }) => Promise<any>;
  sendMessageFn?: (opts: { userId: string; fromName: string; fromRole: string; body: string; subject?: string }) => Promise<any>;
}

// Universal System Voice Configuration — ZEPHYR FROM GEMINI VOICE LIBRARY
export const ZEPHYR_VOICE_CONFIG = {
  name: "Zephyr",
  gender: "Female",
  pitchType: "Higher Pitch",
  characteristics: [
    "Enthusiastic",
    "Young Adult",
    "Clear Articulation",
    "Upbeat",
    "General American Accent",
    "Bright Tone"
  ],
  audioSampleUrl: "https://gstatic.com/aistudio/voices/samples/Zephyr.wav",
  fileUri: "https://generativelanguage.googleapis.com/v1beta/files/l8ohk0ehyuwd",
  pitchRate: 1.18, // Bright, enthusiastic Zephyr female pitch
  speakingRate: 1.02, // Clear, upbeat cadence
};

let audioContext: AudioContext | null = null;
let currentSourceNode: AudioBufferSourceNode | null = null;

function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// Universal Speech Engine for Zephyr (Gemini REST Audio API + Zephyr Vocal Signature)
export async function speakWithZephyrVoice(
  text: string,
  isMuted: boolean = false,
  onStart?: () => void,
  onEnd?: () => void
) {
  if (isMuted) return;

  // Stop previous speech
  if (currentSourceNode) {
    try { currentSourceNode.stop(); } catch {}
    currentSourceNode = null;
  }
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  const cleanText = text
    .replace(/[*_~#]/g, "")
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    .trim();

  if (!cleanText) return;

  const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_AI_KEY || "").trim();

  // 1. Call Gemini Neural Audio REST API directly if key is configured
  if (apiKey) {
    try {
      onStart?.();
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: cleanText }] }],
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
              },
            },
          }),
        }
      );

      const json = await response.json();
      const audioData = json?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

      if (audioData) {
        if (!audioContext || audioContext.state === "closed") {
          audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        } else if (audioContext.state === "suspended") {
          await audioContext.resume();
        }

        const rawBytes = decodeBase64(audioData);
        const audioBuffer = await decodeAudioData(rawBytes, audioContext, 24000);

        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.onended = () => {
          currentSourceNode = null;
          onEnd?.();
        };

        currentSourceNode = source;
        source.start();
        return;
      }
    } catch (err) {
      console.warn("[Ann Companion] Gemini REST API fallback:", err);
    }
  }

  // 2. High-Fidelity Tuned Web Speech Engine with Zephyr Pitch & Speed Params
  if (!("speechSynthesis" in window)) return;

  onStart?.();
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = ZEPHYR_VOICE_CONFIG.speakingRate; // 1.02 — Upbeat cadence
  utterance.pitch = ZEPHYR_VOICE_CONFIG.pitchRate;   // 1.18 — Bright Zephyr female pitch
  utterance.volume = 1.0;

  const voices = window.speechSynthesis.getVoices();

  // Find optimal bright, upbeat female voice matching Zephyr's characteristics
  const zephyrMatchingVoice =
    voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.includes("Samantha") ||
          v.name.includes("Google US English") ||
          v.name.includes("Google UK English Female") ||
          v.name.includes("Karen") ||
          v.name.includes("Victoria") ||
          v.name.includes("Zira") ||
          v.name.includes("Siri") ||
          v.name.includes("Jenny") ||
          v.name.includes("Aria"))
    ) ||
    voices.find((v) => v.lang.startsWith("en") && !v.name.toLowerCase().includes("male")) ||
    voices.find((v) => v.lang.startsWith("en"));

  if (zephyrMatchingVoice) {
    utterance.voice = zephyrMatchingVoice;
  }

  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();

  window.speechSynthesis.speak(utterance);
}

// Plays Zephyr's Official High-Definition Sample Audio (https://gstatic.com/aistudio/voices/samples/Zephyr.wav)
export function playZephyrAudioSample(): Promise<void> {
  return new Promise((resolve) => {
    const audio = new Audio(ZEPHYR_VOICE_CONFIG.audioSampleUrl);
    audio.onended = () => resolve();
    audio.onerror = () => resolve();
    audio.play().catch(() => resolve());
  });
}

// Generates an Executive PDF Report in a popup window
export function generateExecutivePdfReport(
  userName: string,
  bookings: Booking[],
  events: EventRecord[],
  clients: any[],
  tickets: any[]
) {
  const reportWindow = window.open("", "_blank");
  if (!reportWindow) return false;

  const totalRevenue = tickets.reduce((acc, t) => acc + (t.price || 0), 0);
  const pendingBookings = bookings.filter((b) => b.status === "pending" || !b.status);
  const totalBudget = events.reduce((acc, e) => acc + (e.budget || 0), 0);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Executive System Report — TOQUE REAL EVENTS LIMITED</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Work+Sans:wght@400;600;700;800;900&display=swap');
          body { font-family: 'Work Sans', sans-serif; background: #07131e; color: #f8fafc; margin: 0; padding: 40px; }
          .container { max-width: 900px; margin: 0 auto; background: #0d1b29; border: 2px solid #f4cf69; padding: 40px; border-radius: 16px; box-shadow: 0 20px 50px rgba(0,0,0,0.8); }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #203348; padding-bottom: 20px; margin-bottom: 30px; }
          .brand { font-family: 'Cinzel', serif; font-size: 26px; font-weight: 900; color: #f4cf69; text-transform: uppercase; }
          .badge { background: #122538; color: #f4cf69; padding: 6px 14px; border-radius: 20px; border: 1px solid #f4cf69; font-size: 12px; font-weight: 700; }
          .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
          .card { background: #07131e; border: 1px solid #203348; padding: 20px; border-radius: 12px; }
          .card-title { font-size: 11px; text-transform: uppercase; color: #899cb0; font-weight: 700; letter-spacing: 1px; }
          .card-value { font-size: 22px; font-weight: 900; color: #ffffff; margin-top: 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { text-align: left; padding: 12px; border-bottom: 1px solid #1c2e42; font-size: 13px; }
          th { background: #07131e; color: #f4cf69; font-weight: 800; text-transform: uppercase; font-size: 11px; }
          .status { padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 800; text-transform: uppercase; }
          .approved { background: rgba(16, 185, 129, 0.2); color: #10b981; }
          .pending { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
          .footer { margin-top: 40px; pt: 20px; border-top: 1px solid #203348; display: flex; justify-content: space-between; font-size: 12px; color: #899cb0; }
        </style>
      </head>
      <body>
        <div class="container" id="report-content">
          <div class="header">
            <div>
              <div class="brand">TOQUE REAL EVENTS LIMITED</div>
              <p style="color: #899cb0; margin-top: 4px; font-size: 13px;">Executive AI Report Prepared for Sir ${userName}</p>
            </div>
            <div class="badge">ZEPHYR GEMINI VOICE REPORT</div>
          </div>

          <div class="grid">
            <div class="card">
              <div class="card-title">Settled Revenue</div>
              <div class="card-value" style="color: #f4cf69;">${formatKes(totalRevenue)}</div>
            </div>
            <div class="card">
              <div class="card-title">Active Bookings</div>
              <div class="card-value">${bookings.length} (${pendingBookings.length} Pending)</div>
            </div>
            <div class="card">
              <div class="card-title">Live Events & Budget</div>
              <div class="card-value">${events.length} Events (${formatKes(totalBudget)})</div>
            </div>
          </div>

          <h3 style="color: #f4cf69; font-family: 'Cinzel', serif; margin-top: 30px;">Upcoming Events Directory</h3>
          <table>
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Type</th>
                <th>Date</th>
                <th>Venue</th>
                <th>Budget</th>
              </tr>
            </thead>
            <tbody>
              ${events
                .map(
                  (e) => `
                <tr>
                  <td style="font-weight: 700;">${e.name}</td>
                  <td>${e.event_type}</td>
                  <td>${e.event_date}</td>
                  <td>${e.venue}</td>
                  <td>${formatKes(e.budget)}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <h3 style="color: #f4cf69; font-family: 'Cinzel', serif; margin-top: 30px;">Recent Sales Bookings</h3>
          <table>
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Event Type</th>
                <th>Date</th>
                <th>Budget</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${bookings
                .slice(0, 8)
                .map(
                  (b) => `
                <tr>
                  <td style="font-weight: 700;">${b.name}</td>
                  <td>${b.event_type}</td>
                  <td>${b.event_date}</td>
                  <td>${b.budget}</td>
                  <td><span class="status ${b.status === "approved" ? "approved" : "pending"}">${b.status || "Pending"}</span></td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div class="footer">
            <span>Generated automatically by Agent Ann (Zephyr Gemini Voice Engine)</span>
            <span>Date: ${new Date().toLocaleDateString("en-US", { dateStyle: "full" })}</span>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 600);
          };
        </script>
      </body>
    </html>
  `;

  reportWindow.document.write(html);
  reportWindow.document.close();
  return true;
}

// Interprets the current page screen in human companion terms
export function interpretPage(path: string, ctx: CompanionContext): { replyText: string; actionTaken?: string } {
  const p = path.toLowerCase();
  const name = ctx.userName;

  if (p.includes("/admin/events")) {
    const upcoming = ctx.events.filter((e) => e.status === "upcoming" || !e.status);
    const totalBudget = ctx.events.reduce((acc, e) => acc + (e.budget || 0), 0);
    return {
      replyText: `We're looking at the Event Production Hub! Right now on screen, I can see ${ctx.events.length} registered events with a total budget allocation of ${formatKes(totalBudget)}. ${
        upcoming.length > 0 ? `For instance, '${upcoming[0]?.name}' is coming up at ${upcoming[0]?.venue}.` : ""
      } Everything is looking vibrant! Would you like me to create a new event, update tickets, or modify any event details?`,
      actionTaken: "Interpreted Event Production Page",
    };
  }

  if (p.includes("/admin/bookings")) {
    const pending = ctx.bookings.filter((b) => b.status === "pending" || !b.status);
    return {
      replyText: `Here we are on the Sales & CRM Bookings page! Looking at what's displayed, we have ${ctx.bookings.length} live booking requests in total, and ${pending.length} of them are currently pending your approval. ${
        pending.length > 0 ? `For example, ${pending[0]?.name} requested an event for ${pending[0]?.event_type}.` : "All current bookings are approved!"
      } What would you like to do? I can approve a booking, adjust budget quotes, or message a client directly.`,
      actionTaken: "Interpreted Sales & CRM Bookings Page",
    };
  }

  if (p.includes("/admin/finance")) {
    const totalSettled = ctx.tickets.reduce((acc, t) => acc + (t.price || 0), 0);
    return {
      replyText: `Welcome to our Financial Command Center! On this page, I'm tracking settled ticket revenue of ${formatKes(totalSettled)} and overall event production budgets. Financial velocity is strong! Would you like me to generate a PDF financial report or summarize payment receipts for you?`,
      actionTaken: "Interpreted Financial Command Center Page",
    };
  }

  if (p.includes("/admin/users")) {
    return {
      replyText: `We're in the Client Directory right now! On this screen, we have ${ctx.clients.length} registered users and clients operating on our platform. I can send a direct message or notification to any client, update user permissions, or check their booking records whenever you wish!`,
      actionTaken: "Interpreted Client Directory Page",
    };
  }

  if (p.includes("/admin/contacts")) {
    return {
      replyText: `We're viewing Inbound Contacts & Inquiries! There are ${ctx.contacts.length} inbound customer messages on screen. I can help you draft a reply or send a notification straight to any contact!`,
      actionTaken: "Interpreted Contacts & Inquiries Page",
    };
  }

  if (p.includes("/admin/prospects")) {
    return {
      replyText: `Here is our Prospects & Sales Pipeline page! On screen, I see ${ctx.prospects.length} high-potential lead prospects scored for corporate event packages. Would you like me to add a new prospect lead or update a prospect status?`,
      actionTaken: "Interpreted Sales Pipeline Page",
    };
  }

  if (p.includes("/admin/reports")) {
    return {
      replyText: `We're on the Executive Analytics & Reports hub! I can summarize key operational metrics across sales, event tickets, team performance, and revenue streams. Want me to compile a downloadable PDF report?`,
      actionTaken: "Interpreted Reports Analytics Page",
    };
  }

  if (p.includes("/admin/ai")) {
    return {
      replyText: `Welcome to the Pan-Africa AI Intelligence Hub! Here, I scan regional signals, tenders, and high-value event opportunities across Kenya and East Africa. Let me know if you want me to generate outreach proposals or scan for new leads!`,
      actionTaken: "Interpreted Pan-Africa AI Page",
    };
  }

  if (p.includes("/admin/team")) {
    return {
      replyText: `We're on the Personnel Directory & Team Command page! On screen, you can manage event coordinators, stage engineers, and crew assignments for upcoming productions.`,
      actionTaken: "Interpreted Team Directory Page",
    };
  }

  if (p.includes("/admin/settings")) {
    return {
      replyText: `Here are our System Settings! You can manage platform branding, security protocols, notification defaults, and administrative profile configurations here.`,
      actionTaken: "Interpreted System Settings Page",
    };
  }

  // Default Dashboard Overview
  const totalSettled = ctx.tickets.reduce((acc, t) => acc + (t.price || 0), 0);
  const pendingCount = ctx.bookings.filter((b) => b.status === "pending" || !b.status).length;
  return {
    replyText: `Hello ${name}! We're on the CEO Executive Overview dashboard. Looking at our main screen, we have ${formatKes(totalSettled)} in settled revenue, ${ctx.events.length} live events, ${ctx.bookings.length} total bookings (${pendingCount} pending review), and ${ctx.clients.length} registered clients. Everything is running smoothly! How can I assist you right now?`,
    actionTaken: "Interpreted CEO Overview Dashboard",
  };
}

// Process user input as a companion conversationalist with tool calling capability
export async function processCompanionCommand(
  rawInput: string,
  ctx: CompanionContext
): Promise<CompanionResponse> {
  const input = rawInput.trim();
  if (!input) {
    return { replyText: `Hi ${ctx.userName}! I'm listening with my Zephyr voice. What's on your mind?` };
  }

  const lower = input.toLowerCase();
  const name = ctx.userName;

  // 1. GREETINGS & CASUAL HUMAN CONVERSATION
  const isGreeting =
    /^(hi|hello|hey|good morning|good afternoon|good evening|howdy|sup|greetings|hola)\b/.test(lower) ||
    lower === "hi" ||
    lower === "hello" ||
    lower === "hey";

  if (isGreeting) {
    if (lower.includes("morning")) {
      return {
        replyText: `Good morning, ${name}! I hope your day is starting off wonderfully. How are you feeling today, and how can I help you?`,
      };
    }
    if (lower.includes("evening")) {
      return {
        replyText: `Good evening, ${name}! It's great to connect with you. How has your day been so far?`,
      };
    }
    if (lower.includes("afternoon")) {
      return {
        replyText: `Good afternoon, ${name}! Having a good day? I'm here if you want to check on our events, message clients, or just chat!`,
      };
    }
    return {
      replyText: `Hi ${name}! How are you doing today? I'm so happy to chat with you! What's on your mind?`,
    };
  }

  // "How are you" / "How are you doing" / "How's your day"
  if (lower.includes("how are you") || lower.includes("how do you do") || lower.includes("how's your day") || lower.includes("how is your day")) {
    return {
      replyText: `I'm doing great, thank you so much for asking! I love working with you on Royal Touch Events. How are you doing today?`,
    };
  }

  // Friendly inquiries: "who are you", "who made you", "what is your name", "what can you do"
  if (lower.includes("who are you") || lower.includes("your name")) {
    return {
      replyText: `I am Ann, your AI companion powered by the Zephyr Gemini voice engine at Royal Touch Events! I'm here to converse with you, help you navigate our platform, manage events, message clients, and keep everything running smoothly like a trusted friend.`,
    };
  }

  if (lower.includes("who made you") || lower.includes("who created you") || lower.includes("who built you")) {
    return {
      replyText: `I was crafted with care for TOQUE REAL EVENTS LIMITED to be your intelligent, friendly companion and executive assistant!`,
    };
  }

  if (lower.includes("thank you") || lower.includes("thanks") || lower.includes("you are awesome") || lower.includes("you're great") || lower.includes("good job")) {
    return {
      replyText: `You are so very welcome, ${name}! It's an absolute joy working with you. Anything else I can do for you right now?`,
    };
  }

  if (lower.includes("tell me a joke") || lower.includes("say something funny")) {
    return {
      replyText: `Why did the event planner bring a ladder to the gala? Because they wanted to take the party to the next level! 😄 What shall we do next, ${name}?`,
    };
  }

  // 2. PAGE INTERPRETATION & PAGE VISION COMMANDS
  const isPageAsk =
    lower.includes("interpret") ||
    lower.includes("what page") ||
    lower.includes("what do you see") ||
    lower.includes("tell me what") ||
    lower.includes("what's on screen") ||
    lower.includes("what's happening") ||
    lower.includes("where are we") ||
    lower.includes("look at this page");

  if (isPageAsk) {
    return interpretPage(ctx.currentPath, ctx);
  }

  // 3. NAVIGATION COMMANDS WITH PAGE INTERPRETATION
  if (
    lower.includes("take me to") ||
    lower.includes("go to") ||
    lower.includes("open") ||
    lower.includes("show me") ||
    lower.includes("navigate")
  ) {
    if (lower.includes("booking") || lower.includes("crm") || lower.includes("sales") || lower.includes("reservation")) {
      ctx.navigate({ to: "/admin/bookings" });
      return {
        replyText: `Taking you to Sales & CRM Bookings! On this page, we have ${ctx.bookings.length} live bookings. ${
          ctx.bookings.filter((b) => b.status === "pending" || !b.status).length
        } are pending approval. What would you like me to do here?`,
        actionTaken: "Navigated to /admin/bookings",
        navigatedTo: "/admin/bookings",
      };
    }
    if (lower.includes("event") || lower.includes("production")) {
      ctx.navigate({ to: "/admin/events" });
      return {
        replyText: `Opening the Event Production Hub! We currently have ${ctx.events.length} active events registered. Take a look—would you like me to create a new event, update tickets, or delete an old one?`,
        actionTaken: "Navigated to /admin/events",
        navigatedTo: "/admin/events",
      };
    }
    if (lower.includes("finance") || lower.includes("revenue") || lower.includes("money") || lower.includes("cash")) {
      ctx.navigate({ to: "/admin/finance" });
      const totalSettled = ctx.tickets.reduce((acc, t) => acc + (t.price || 0), 0);
      return {
        replyText: `Opening Financial Command Center! Total settled ticket revenue is ${formatKes(totalSettled)}. Would you like me to generate a PDF financial report for you?`,
        actionTaken: "Navigated to /admin/finance",
        navigatedTo: "/admin/finance",
      };
    }
    if (lower.includes("user") || lower.includes("client") || lower.includes("customer")) {
      ctx.navigate({ to: "/admin/users" });
      return {
        replyText: `Opening Client Directory! There are ${ctx.clients.length} registered clients here. I can send a direct message or notification to any client if you'd like!`,
        actionTaken: "Navigated to /admin/users",
        navigatedTo: "/admin/users",
      };
    }
    if (lower.includes("contact") || lower.includes("message") || lower.includes("inquiry")) {
      ctx.navigate({ to: "/admin/contacts" });
      return {
        replyText: `Opening Inbound Messages & Contacts! There are ${ctx.contacts.length} inquiries in total.`,
        actionTaken: "Navigated to /admin/contacts",
        navigatedTo: "/admin/contacts",
      };
    }
    if (lower.includes("prospect") || lower.includes("pipeline") || lower.includes("lead")) {
      ctx.navigate({ to: "/admin/prospects" });
      return {
        replyText: `Opening Prospects & Sales Pipeline! There are ${ctx.prospects.length} lead prospects being tracked.`,
        actionTaken: "Navigated to /admin/prospects",
        navigatedTo: "/admin/prospects",
      };
    }
    if (lower.includes("ai") || lower.includes("insight") || lower.includes("discovery")) {
      ctx.navigate({ to: "/admin/ai" });
      return {
        replyText: `Navigating to Pan-Africa AI Event Discovery Engine!`,
        actionTaken: "Navigated to /admin/ai",
        navigatedTo: "/admin/ai",
      };
    }
    if (lower.includes("report") || lower.includes("analytic")) {
      ctx.navigate({ to: "/admin/reports" });
      return {
        replyText: `Opening Executive Reports & Analytics!`,
        actionTaken: "Navigated to /admin/reports",
        navigatedTo: "/admin/reports",
      };
    }
    if (lower.includes("team") || lower.includes("staff")) {
      ctx.navigate({ to: "/admin/team" });
      return {
        replyText: `Opening Personnel & Team Command!`,
        actionTaken: "Navigated to /admin/team",
        navigatedTo: "/admin/team",
      };
    }
    if (lower.includes("setting") || lower.includes("config")) {
      ctx.navigate({ to: "/admin/settings" });
      return {
        replyText: `Opening System Settings!`,
        actionTaken: "Navigated to /admin/settings",
        navigatedTo: "/admin/settings",
      };
    }
    if (lower.includes("dashboard") || lower.includes("home") || lower.includes("overview")) {
      ctx.navigate({ to: "/admin" });
      return {
        replyText: `Returning to the main CEO Executive Overview!`,
        actionTaken: "Navigated to /admin",
        navigatedTo: "/admin",
      };
    }
  }

  // 4. CREATE EVENT TOOL
  if (lower.includes("create event") || lower.includes("add event") || lower.includes("plan event") || lower.includes("new event")) {
    if (ctx.createEventFn) {
      const titleMatch = input.match(/(?:called|named|title|event)\s+['"]?([^'"]+?)['"]?(?=\s+on|\s+at|\s+with|\s+budget|$)/i);
      const venueMatch = input.match(/at\s+['"]?([^'"]+?)['"]?(?=\s+on|\s+with|\s+budget|$)/i);
      const dateMatch = input.match(/on\s+([a-zA-Z0-9\s,-]+?)(?=\s+at|\s+with|\s+budget|$)/i);
      const budgetMatch = input.match(/budget\s*(?:of|is|:)?\s*([0-9,kKmM]+)/i);

      let extractedBudget = 1500000;
      if (budgetMatch && budgetMatch[1]) {
        let bStr = budgetMatch[1].toLowerCase().replace(/,/g, "");
        if (bStr.includes("m")) {
          extractedBudget = parseFloat(bStr) * 1000000;
        } else if (bStr.includes("k")) {
          extractedBudget = parseFloat(bStr) * 1000;
        } else {
          extractedBudget = parseInt(bStr, 10) || 1500000;
        }
      }

      const eventName = titleMatch ? titleMatch[1].trim() : `Special Gala — ${new Date().toLocaleDateString()}`;
      const venueName = venueMatch ? venueMatch[1].trim() : "Villa Rosa Kempinski, Nairobi";
      const eventDate = dateMatch ? dateMatch[1].trim() : "2026-11-20";

      await ctx.createEventFn({
        name: eventName,
        venue: venueName,
        event_date: eventDate,
        budget: extractedBudget,
        event_type: "Corporate Gala",
        status: "upcoming",
        description: `Created via Agent Ann companion assistant for Sir ${name}.`,
      });

      return {
        replyText: `Wonderful news! I've created the event '${eventName}' set for ${eventDate} at ${venueName} with a budget of ${formatKes(extractedBudget)}. It's saved in our database!`,
        actionTaken: `Created Event: ${eventName}`,
      };
    }
  }

  // 5. DELETE EVENT / RECORD TOOL
  if (lower.includes("delete event") || lower.includes("remove event") || lower.includes("cancel event")) {
    if (ctx.deleteEventFn && ctx.events.length > 0) {
      const target = ctx.events.find((e) => lower.includes(e.name.toLowerCase())) || ctx.events[ctx.events.length - 1];

      if (target) {
        await ctx.deleteEventFn(target.id);
        return {
          replyText: `Done! I have removed the event '${target.name}' from our system for you.`,
          actionTaken: `Deleted Event: ${target.name}`,
        };
      }
    }
  }

  // 6. UPDATE EVENT OR BOOKING STATUS TOOL
  if (lower.includes("approve booking") || lower.includes("update status") || lower.includes("mark booking as")) {
    if (ctx.updateBookingStatusFn && ctx.bookings.length > 0) {
      const pending = ctx.bookings.find((b) => b.status === "pending" || !b.status) || ctx.bookings[0];
      if (pending) {
        await ctx.updateBookingStatusFn({ id: pending.id, status: "approved" });
        return {
          replyText: `I've updated the booking status for '${pending.name}' (${pending.event_type}) to Approved!`,
          actionTaken: `Approved Booking for ${pending.name}`,
        };
      }
    }
  }

  // 7. SEND DIRECT MESSAGE TO USER TOOL
  if (lower.includes("send message") || lower.includes("message user") || lower.includes("send notification") || lower.includes("notify")) {
    if (ctx.sendMessageFn) {
      const userMatch = ctx.clients.find((c) => {
        const full = (c.full_name || "").toLowerCase();
        const em = (c.email || "").toLowerCase();
        return lower.includes(full) || lower.includes(em) || lower.includes((c.role || "").toLowerCase());
      }) || ctx.clients[0];

      const targetUserId = userMatch ? userMatch.id : "user-default";
      const targetName = userMatch ? userMatch.full_name || userMatch.email : "Client";

      const bodyMatch = input.match(/(?:saying|message|text|with)\s+['"]?([^'"]+)['"]?$/i);
      const msgBody = bodyMatch ? bodyMatch[1] : `Hello ${targetName}, your event booking update from Royal Touch Events is confirmed!`;

      await ctx.sendMessageFn({
        userId: targetUserId,
        fromName: "Agent Ann (Executive AI)",
        fromRole: "AI Companion",
        body: msgBody,
        subject: "Royal Touch Events Update",
      });

      return {
        replyText: `Done! I've sent that direct message to ${targetName}: "${msgBody}"`,
        actionTaken: `Sent Message to ${targetName}`,
      };
    }
  }

  // 8. GENERATE PDF / EXPORT REPORT TOOL
  if (
    lower.includes("pdf") ||
    lower.includes("pull report") ||
    lower.includes("generate report") ||
    lower.includes("export report") ||
    lower.includes("download report")
  ) {
    const success = generateExecutivePdfReport(ctx.userName, ctx.bookings, ctx.events, ctx.clients, ctx.tickets);
    if (success) {
      return {
        replyText: `I've generated your executive system report PDF in a new window for you! You can preview or print it directly.`,
        actionTaken: "Generated PDF Executive Report",
        pdfTriggered: true,
      };
    }
  }

  // 9. DATA QUERIES & STATS
  if (lower.includes("revenue") || lower.includes("money") || lower.includes("sales") || lower.includes("stat") || lower.includes("health")) {
    const totalSettled = ctx.tickets.reduce((acc, t) => acc + (t.price || 0), 0);
    const pendingCount = ctx.bookings.filter((b) => b.status === "pending" || !b.status).length;
    return {
      replyText: `Here is our live status briefing, ${name}: Settled revenue stands at ${formatKes(
        totalSettled
      )}. We have ${ctx.bookings.length} total bookings (${pendingCount} pending), ${ctx.events.length} active events, and ${
        ctx.clients.length
      } registered clients. All systems are running smoothly!`,
      actionTaken: "Queried Live Financial & System Metrics",
    };
  }

  // 10. GENERAL CHAT FALLBACK (HUMAN COMPANION TONE)
  return {
    replyText: `I'm right here with you, ${name}! You mentioned "${input}". I can take you to any page, create or update events, message clients, generate PDF reports, or just chat about how your day is going. What would you like us to do?`,
  };
}
