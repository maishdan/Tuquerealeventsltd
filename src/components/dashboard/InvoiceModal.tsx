import React, { useState } from "react";
import type { Booking } from "@/lib/database.types";
import { formatKes } from "@/lib/dashboard-mock-data";
import {
  X,
  Printer,
  Download,
  Mail,
  MessageSquare,
  Building2,
  Phone,
  Globe,
  FileText,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Send
} from "lucide-react";
import eventsLogo from "@/assets/events-logo.jpeg";

interface InvoiceModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export function InvoiceModal({ booking, isOpen, onClose }: InvoiceModalProps) {
  const [downloading, setDownloading] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);

  if (!isOpen || !booking) return null;

  const invoiceNumber = `INV-2026-${booking.id.slice(0, 6).toUpperCase()}`;

  const parseBudgetAmount = (b: string) => {
    const num = parseInt(b.replace(/[^0-9]/g, ""), 10);
    return Number.isFinite(num) ? num * 1000 : 1500;
  };

  const invoiceAmount = parseBudgetAmount(booking.budget);

  const getWhatsAppInvoiceLink = () => {
    const text = encodeURIComponent(
      `Hello ${booking.name},\nHere is your official invoice for *${booking.event_type}*:\n\nInvoice No: ${invoiceNumber}\nAmount Due: KSh ${invoiceAmount.toLocaleString()}\n\nPay via M-Pesa Paybill:\nPaybill: 303030\nAccount: 2053270290\n\nThank you for choosing Royal Touch Events!`
    );
    return `https://wa.me/${booking.phone || "254795365334"}?text=${text}`;
  };

  const handleSendEmailInvoice = () => {
    setEmailSending(true);
    setTimeout(() => {
      setEmailSending(false);
      setEmailSentSuccess(true);
      setTimeout(() => setEmailSentSuccess(false), 4000);
    }, 1500);
  };

  const handleDownloadInvoicePdf = () => {
    setDownloading(true);
    const actionWindow = window.open("", "_blank");
    if (!actionWindow) {
      setDownloading(false);
      return;
    }

    const logoUrl = window.location.origin + eventsLogo;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Official Invoice - ${invoiceNumber}</title>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Work+Sans:wght@400;600;700;800;900&display=swap');
            body { font-family: 'Work Sans', sans-serif; background: #f8fafc; color: #0b0e14; margin: 0; padding: 40px 20px; display: flex; justify-content: center; }
            .invoice-card {
              width: 780px;
              background: #ffffff;
              border: 3px solid #000000;
              padding: 40px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 2px solid #000000;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .brand { display: flex; align-items: center; gap: 15px; }
            .brand img { width: 56px; height: 54px; border: 2px solid #000000; object-fit: cover; }
            .brand-title { font-family: 'Cinzel', serif; font-size: 24px; font-weight: 900; color: #000000; text-transform: uppercase; }
            .invoice-title { font-family: 'Cinzel', serif; font-size: 28px; font-weight: 900; color: #b45309; text-transform: uppercase; text-align: right; }
            .invoice-no { font-family: monospace; font-size: 14px; font-weight: 800; color: #000000; text-align: right; }

            .bill-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
            .bill-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 18px; }
            .label { font-size: 8px; font-weight: 900; color: #64748b; uppercase; tracking-widest; margin-bottom: 6px; }
            .val { font-size: 13px; font-weight: 800; color: #000000; text-transform: uppercase; }

            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .items-table th { background: #000000; color: #ffffff; padding: 12px; font-size: 9px; font-weight: 900; text-transform: uppercase; text-align: left; }
            .items-table td { padding: 14px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; font-weight: 700; }

            .paybill-box { background: #f0fdf4; border: 2px solid #16a34a; padding: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
            .pay-title { font-size: 10px; font-weight: 900; color: #16a34a; text-transform: uppercase; }

            .footer { border-top: 2px solid #000000; padding-top: 15px; font-size: 9px; color: #64748b; font-weight: 800; display: flex; justify-content: space-between; uppercase; }
          </style>
        </head>
        <body>
          <div class="invoice-card" id="invoice-content">
            <div class="header">
              <div class="brand">
                <img src="${logoUrl}" alt="Royal Touch Logo" />
                <div>
                  <div class="brand-title">Royal Touch Events</div>
                  <div style="font-size: 9px; font-weight: 800; color: #64748b; uppercase;">Official Executive Invoice</div>
                </div>
              </div>

              <div>
                <div class="invoice-title">OFFICIAL INVOICE</div>
                <div class="invoice-no">${invoiceNumber}</div>
                <div style="font-size: 10px; font-weight: 800; color: #64748b; text-align: right; margin-top: 4px;">DATE: ${new Date().toLocaleDateString()}</div>
              </div>
            </div>

            <div class="bill-grid">
              <div class="bill-box">
                <div class="label">Billed To Customer:</div>
                <div class="val">${booking.name}</div>
                <div style="font-size: 11px; color: #475569; font-weight: 700;">Email: ${booking.email}</div>
                <div style="font-size: 11px; color: #475569; font-weight: 700;">Phone: ${booking.phone || "N/A"}</div>
              </div>

              <div class="bill-box">
                <div class="label">Issued By Organization:</div>
                <div class="val">Royal Touch Events Executive</div>
                <div style="font-size: 11px; color: #475569; font-weight: 700;">Upper Hill, Nairobi, Kenya</div>
                <div style="font-size: 11px; color: #475569; font-weight: 700;">eventsroyaltouch7@gmail.com</div>
              </div>
            </div>

            <table class="items-table">
              <thead>
                <tr>
                  <th>Description / Event Service</th>
                  <th>Date</th>
                  <th style="text-align: right;">Amount Due</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${booking.event_type} - Event Booking & Seat Pass Reservation</td>
                  <td>${booking.event_date || "Confirmed"}</td>
                  <td style="text-align: right; font-family: monospace; font-weight: 900; color: #b45309;">KSh ${invoiceAmount.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            <div class="paybill-box">
              <div>
                <div class="pay-title">Official M-Pesa Payment Parameters</div>
                <div style="font-size: 12px; font-weight: 800; color: #000000; margin-top: 4px;">
                  1. M-Pesa Paybill Number: <span style="color: #16a34a; font-family: monospace; font-size: 16px; font-weight: 900;">303030</span><br />
                  2. Account Number: <span style="color: #b45309; font-family: monospace; font-size: 16px; font-weight: 900;">2053270290</span>
                </div>
              </div>
              <div style="font-family: monospace; font-size: 22px; font-weight: 900; color: #16a34a;">
                KSh ${invoiceAmount.toLocaleString()}
              </div>
            </div>

            <div class="footer">
              <div>&copy; 2026 ROYAL TOUCH EVENTS · OFFICIAL BILLING DISPATCH</div>
              <div>TEL: +254 795 365 334 | WWW.ROYALTOUCHEVENTS.CO.KE</div>
            </div>
          </div>

          <script>
            window.onload = function() {
              const element = document.getElementById('invoice-content');
              const opt = {
                margin: 0.15,
                filename: '${invoiceNumber}.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
              };
              setTimeout(() => {
                html2pdf().set(opt).from(element).save().then(() => {
                  setTimeout(() => window.close(), 1000);
                });
              }, 800);
            };
          </script>
        </body>
      </html>
    `;

    actionWindow.document.write(html);
    actionWindow.document.close();
    setDownloading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300 font-sans">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0d121c] border border-gold/40 rounded-none overflow-hidden shadow-2xl p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gold text-black flex items-center justify-center font-black">
              <FileText size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gold">Official Billing Console</p>
              <h3 className="text-lg font-black uppercase tracking-tight text-foreground">{invoiceNumber}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {emailSentSuccess && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-bold text-xs uppercase tracking-widest text-center flex items-center justify-center gap-2">
            <CheckCircle2 size={16} /> Official Invoice Dispatched to {booking.email}!
          </div>
        )}

        {/* Invoice Summary Box */}
        <div className="p-6 bg-slate-50 dark:bg-black/40 border border-border space-y-4 text-xs">
          <div className="flex justify-between items-start border-b border-border pb-3">
            <div>
              <p className="text-[9px] font-black uppercase text-gold">Customer Invoice</p>
              <h4 className="text-lg font-black uppercase text-foreground">{booking.name}</h4>
              <p className="text-muted-foreground">{booking.email} · {booking.phone || "No phone"}</p>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[9px] font-black uppercase tracking-widest">
                Pending Payment
              </span>
              <p className="text-xl font-mono font-black text-gold mt-2">{formatKes(invoiceAmount)}</p>
            </div>
          </div>

          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 space-y-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500">M-Pesa Payment Instructions Included In Invoice</p>
            <p className="font-bold text-foreground">
              Paybill: <span className="font-mono text-emerald-500 font-black">303030</span> | Account No: <span className="font-mono text-gold font-black">2053270290</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="grid sm:grid-cols-3 gap-3 pt-2">
          <button
            onClick={handleSendEmailInvoice}
            disabled={emailSending}
            className="h-14 bg-gold text-black font-black text-[10px] uppercase tracking-widest rounded-none flex items-center justify-center gap-2 hover:bg-black hover:text-gold transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {emailSending ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
            Email Invoice
          </button>

          <a
            href={getWhatsAppInvoiceLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="h-14 bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest rounded-none flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-md text-center"
          >
            <MessageSquare size={16} /> WhatsApp Invoice
          </a>

          <button
            onClick={handleDownloadInvoicePdf}
            disabled={downloading}
            className="h-14 border border-border text-foreground font-black text-[10px] uppercase tracking-widest rounded-none flex items-center justify-center gap-2 hover:border-gold transition-all cursor-pointer disabled:opacity-50"
          >
            {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            Download PDF Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
