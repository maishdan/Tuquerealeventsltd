import React, { useState } from "react";
import type { Ticket } from "@/lib/database.types";
import { formatKes } from "@/lib/dashboard-mock-data";
import {
  X,
  Printer,
  Download,
  QrCode,
  ShieldCheck,
  Calendar,
  MapPin,
  Sparkles,
  Ticket as TicketIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Phone,
  Mail,
  Globe,
  Building2,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import eventsLogo from "@/assets/events-logo.jpeg";

interface TicketPassModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TicketPassModal({ ticket, isOpen, onClose }: TicketPassModalProps) {
  const [downloading, setDownloading] = useState(false);
  const [printing, setPrinting] = useState(false);

  if (!isOpen || !ticket) return null;

  const tierColors: Record<string, { bg: string; text: string; border: string; badge: string }> = {
    VVIP: {
      bg: "bg-gradient-to-r from-amber-500/20 via-gold/10 to-amber-500/20",
      text: "text-gold",
      border: "border-gold/40",
      badge: "bg-gold text-black font-black",
    },
    VIP: {
      bg: "bg-gradient-to-r from-blue-500/20 via-indigo-500/10 to-blue-500/20",
      text: "text-blue-400",
      border: "border-blue-500/40",
      badge: "bg-blue-600 text-white font-black",
    },
    Regular: {
      bg: "bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-emerald-500/20",
      text: "text-emerald-400",
      border: "border-emerald-500/40",
      badge: "bg-emerald-600 text-white font-black",
    },
    "General Access": {
      bg: "bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-emerald-500/20",
      text: "text-emerald-400",
      border: "border-emerald-500/40",
      badge: "bg-emerald-600 text-white font-black",
    },
  };

  const currentTier = tierColors[ticket.ticket_tier] || tierColors["Regular"];

  // Real Dynamic Redirect QR Code Target URL
  const ticketVerificationUrl = `${window.location.origin}/booking?ticketCode=${encodeURIComponent(
    ticket.ticket_code
  )}`;
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    ticketVerificationUrl
  )}`;

  const handleAction = (mode: "download" | "print") => {
    if (mode === "download") setDownloading(true);
    else setPrinting(true);

    const actionWindow = window.open("", "_blank");
    if (!actionWindow) {
      setDownloading(false);
      setPrinting(false);
      return;
    }

    const logoUrl = window.location.origin + eventsLogo;
    const isUsed = ticket.status === "used";

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Official Ticket - ${ticket.ticket_code}</title>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Work+Sans:wght@400;600;700;800;900&display=swap');
            body { font-family: 'Work Sans', sans-serif; background: #e2e8f0; color: #0b0e14; margin: 0; padding: 25px 15px; display: flex; justify-content: center; }
            .ticket-pass {
              width: 780px;
              background: #ffffff;
              border: 3px solid #000000;
              border-radius: 0px;
              overflow: hidden;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
              position: relative;
            }
            .top-bar {
              background: #000000;
              color: #ffffff;
              font-size: 10px;
              font-weight: 900;
              padding: 8px 30px;
              display: flex;
              justify-content: space-between;
              letter-spacing: 2px;
              text-transform: uppercase;
            }
            .header {
              padding: 25px 35px;
              border-bottom: 2px solid #000000;
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              background: #fafafa;
            }
            .brand { display: flex; align-items: center; gap: 15px; }
            .brand img { width: 56px; height: 54px; border: 2px solid #000000; object-fit: cover; }
            .brand-title { font-family: 'Cinzel', serif; font-size: 24px; font-weight: 900; color: #000000; letter-spacing: 2px; text-transform: uppercase; }
            .brand-sub { font-size: 9px; color: #475569; letter-spacing: 3px; font-weight: 800; text-transform: uppercase; margin-top: 2px; }

            /* QR CODE AT TOP RIGHT */
            .top-right-qr {
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
            }
            .qr-code-box {
              width: 125px;
              height: 125px;
              background: #ffffff;
              padding: 6px;
              border: 2px solid #000000;
              box-shadow: 3px 3px 0px #000000;
            }
            .qr-code-box img { width: 100%; height: 100%; object-fit: contain; }
            .ticket-serial-badge {
              font-family: monospace;
              font-size: 11px;
              font-weight: 900;
              color: #000000;
              letter-spacing: 1.5px;
              margin-top: 6px;
              background: #f1f5f9;
              padding: 2px 8px;
              border: 1px solid #000000;
            }

            .body {
              padding: 30px 35px;
              display: flex;
              flex-direction: column;
              gap: 20px;
            }
            .event-title-box {
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 15px;
            }
            .event-name { font-family: 'Cinzel', serif; font-size: 26px; font-weight: 900; color: #000000; text-transform: uppercase; margin: 0 0 8px 0; line-height: 1.15; }
            .paid-badge-line { display: flex; align-items: center; gap: 12px; }
            .paid-stamp {
              border: 2px solid #16a34a;
              color: #16a34a;
              background: #f0fdf4;
              padding: 4px 14px;
              font-weight: 900;
              font-size: 10px;
              letter-spacing: 2px;
              text-transform: uppercase;
            }
            .tier-stamp {
              border: 2px solid #000000;
              color: #000000;
              background: #fef08a;
              padding: 4px 14px;
              font-weight: 900;
              font-size: 10px;
              letter-spacing: 2px;
              text-transform: uppercase;
            }

            .info-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
            .info-label { font-size: 8px; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 4px; }
            .info-value { font-size: 13px; font-weight: 800; color: #0f172a; text-transform: uppercase; }

            /* OFFICIAL CONTACT FOOTER */
            .contacts-bar {
              background: #f8fafc;
              border-top: 2px solid #000000;
              border-bottom: 1px solid #e2e8f0;
              padding: 14px 35px;
              display: flex;
              justify-content: space-between;
              font-size: 10px;
              color: #0f172a;
              font-weight: 800;
            }
            .contacts-bar span { color: #b45309; font-weight: 900; margin-right: 4px; }

            .footer {
              background: #000000;
              color: #ffffff;
              padding: 12px 35px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 8px;
              font-weight: 800;
              letter-spacing: 2px;
              text-transform: uppercase;
            }
            @media print {
              body { background: white; color: black; }
              .ticket-pass { border-color: #000; box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="ticket-pass" id="ticket-pass-content">
            <div class="top-bar">
              <div>TOQUE REAL EVENTS LIMITED · OFFICIAL PAID ENTRY PASS</div>
              <div>TIER: ${ticket.ticket_tier} PASS</div>
            </div>

            <!-- HEADER WITH LOGO & QR CODE AT TOP RIGHT -->
            <div class="header">
              <div class="brand">
                <img src="/new logo.png" alt="TOQUE REAL Logo" />
                <div>
                  <div class="brand-title">TOQUE REAL EVENTS LIMITED</div>
                  <div class="brand-sub">Luxury Production & Event Gate Registry</div>
                </div>
              </div>

              <!-- QR CODE AT TOP RIGHT -->
              <div class="top-right-qr">
                <div class="qr-code-box">
                  <img src="${qrCodeImageUrl}" alt="Scan QR To Verify Ticket" />
                </div>
                <div class="ticket-serial-badge">${ticket.ticket_code}</div>
              </div>
            </div>

            <div class="body">
              <div class="event-title-box">
                <h1 class="event-name">${ticket.event_name}</h1>
                <div class="paid-badge-line">
                  <span class="paid-stamp">✓ PAID & VERIFIED</span>
                  <span class="tier-stamp">${ticket.ticket_tier} PASS</span>
                  <span style="font-size: 10px; font-weight: 800; color: ${isUsed ? "#dc2626" : "#16a34a"}; margin-left: auto;">
                    ${isUsed ? "● CHECKED IN / USED" : "● SCAN QR FOR INSTANT VERIFICATION REDIRECT"}
                  </span>
                </div>
              </div>

              <div class="info-grid">
                <div>
                  <div class="info-label">Pass Holder Name</div>
                  <div class="info-value">${ticket.holder_name}</div>
                </div>
                <div>
                  <div class="info-label">Event Date</div>
                  <div class="info-value">${ticket.event_date || "Confirmed"}</div>
                </div>
                <div>
                  <div class="info-label">Venue Location</div>
                  <div class="info-value">${ticket.venue || "Royal Touch Venue"}</div>
                </div>
                <div>
                  <div class="info-label">Seat Assignment</div>
                  <div class="info-value" style="color: #b45309;">SEAT ${ticket.seat_number || "GA"}</div>
                </div>
                <div>
                  <div class="info-label">Holder Email</div>
                  <div class="info-value" style="font-size: 11px;">${ticket.holder_email}</div>
                </div>
                <div>
                  <div class="info-label">Investment Amount</div>
                  <div class="info-value" style="color: #16a34a;">${ticket.price > 0 ? "KSh " + ticket.price.toLocaleString() : "Paid"}</div>
                </div>
              </div>
            </div>

            <!-- OFFICIAL FOOTER WITH FULL CONTACT DETAILS & WEBSITE -->
            <div class="contacts-bar">
              <div><span>TEL:</span> +254 795 365 334</div>
              <div><span>EMAIL:</span> eventsroyaltouch7@gmail.com</div>
              <div><span>HQ:</span> Upper Hill, Nairobi, Kenya</div>
              <div><span>WEBSITE:</span> www.royaltouchevents.co.ke</div>
            </div>

            <div class="footer">
              <div>&copy; 2026 TOQUE REAL EVENTS LIMITED · ALL RIGHTS RESERVED</div>
              <div>CRYPTOGRAPHIC GATE TOKEN REDIRECT ACTIVE</div>
            </div>
          </div>

          <script>
            window.onload = function() {
              const mode = '${mode}';
              const element = document.getElementById('ticket-pass-content');

              const opt = {
                margin: 0.15,
                filename: '${ticket.ticket_code}-OfficialTicket.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
              };

              setTimeout(() => {
                if (mode === 'download') {
                  html2pdf().set(opt).from(element).save().then(() => {
                    setTimeout(() => window.close(), 1000);
                  });
                } else {
                  window.print();
                  window.onafterprint = function() { window.close(); };
                  setTimeout(() => window.close(), 10000);
                }
              }, 800);
            };
          </script>
        </body>
      </html>
    `;

    actionWindow.document.write(html);
    actionWindow.document.close();
    setDownloading(false);
    setPrinting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#0d121c] border border-gold/40 rounded-none overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-border bg-gold/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gold text-black flex items-center justify-center font-black">
              <TicketIcon size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gold">Official White Gate Pass</p>
              <h3 className="text-lg font-black uppercase tracking-tight text-foreground">Verified Ticket & Top-Right QR Redirect</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body / Official White Ticket Card Preview */}
        <div className="p-8 space-y-8">
          <div className="relative overflow-hidden rounded-none border-2 border-black bg-white text-black p-8 space-y-8 shadow-xl">
            {/* TOP HEADER WITH LOGO & TOP-RIGHT QR CODE */}
            <div className="flex justify-between items-start border-b-2 border-black pb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <img src={eventsLogo} alt="Royal Touch Logo" className="h-12 w-12 border-2 border-black object-cover" />
                  <div>
                    <h3 className="font-display font-black text-xl uppercase tracking-wider text-black">Royal Touch Events</h3>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">Official Executive Access Pass</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-600 font-black text-[9px] uppercase tracking-widest">
                    ✓ Paid & Verified
                  </span>
                  <span className="px-3 py-1 bg-yellow-200 text-black border border-black font-black text-[9px] uppercase tracking-widest">
                    {ticket.ticket_tier} PASS
                  </span>
                </div>
              </div>

              {/* QR CODE AT TOP RIGHT */}
              <div className="flex flex-col items-center text-center">
                <div className="h-24 w-24 bg-white p-1 border-2 border-black shadow-[3px_3px_0px_#000000]">
                  <img
                    src={qrCodeImageUrl}
                    alt="Scan To Redirect To Ticket Verification"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="font-mono text-[10px] font-black uppercase tracking-widest mt-1 bg-slate-100 border border-black px-2 py-0.5">
                  {ticket.ticket_code}
                </span>
              </div>
            </div>

            {/* EVENT DETAILS */}
            <div className="space-y-4">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Event Engagement</p>
                <h2 className="text-2xl font-black uppercase tracking-tight text-black">{ticket.event_name}</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-200 text-xs">
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Pass Holder Name</p>
                  <p className="font-bold text-black uppercase">{ticket.holder_name}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Event Date</p>
                  <p className="font-bold text-black uppercase">{ticket.event_date || "Confirmed"}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Venue Location</p>
                  <p className="font-bold text-black uppercase">{ticket.venue || "Nairobi Venue"}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Seat Assignment</p>
                  <p className="font-mono font-black text-amber-700 uppercase">SEAT {ticket.seat_number || "GA"}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Holder Email</p>
                  <p className="font-mono text-[10px] text-slate-700">{ticket.holder_email}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Investment Paid</p>
                  <p className="font-mono font-black text-emerald-700">{ticket.price > 0 ? formatKes(ticket.price) : "Paid"}</p>
                </div>
              </div>
            </div>

            {/* OFFICIAL CONTACT DETAILS FOOTER */}
            <div className="pt-4 border-t-2 border-black flex flex-wrap items-center justify-between gap-3 text-[10px] text-black font-bold bg-slate-50 p-3">
              <span className="flex items-center gap-1"><Phone size={12} className="text-amber-700" /> +254 795 365 334</span>
              <span className="flex items-center gap-1"><Mail size={12} className="text-amber-700" /> eventsroyaltouch7@gmail.com</span>
              <span className="flex items-center gap-1"><Globe size={12} className="text-amber-700" /> www.royaltouchevents.co.ke</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-8 py-6 bg-slate-50 dark:bg-black/40 border-t border-border">
          <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase tracking-widest">
            <ShieldCheck size={14} className="text-gold" /> Royal Touch Encrypted White Pass
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => handleAction("print")}
              disabled={printing}
              className="h-12 px-6 rounded-none border border-border bg-white dark:bg-white/5 text-foreground font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:border-gold transition-all cursor-pointer disabled:opacity-50"
            >
              {printing ? <Loader2 size={14} className="animate-spin" /> : <Printer size={14} />} Print Pass
            </button>
            <button
              onClick={() => handleAction("download")}
              disabled={downloading}
              className="h-12 px-6 rounded-none bg-gold text-black font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-black hover:text-gold transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {downloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} Download PDF Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
