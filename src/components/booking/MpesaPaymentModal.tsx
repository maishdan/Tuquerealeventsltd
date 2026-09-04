import React, { useState } from "react";
import { initiateMpesaStkPush, processMpesaCallback, type InitiateMpesaInput } from "@/lib/api/payments";
import type { Ticket } from "@/lib/database.types";
import { formatKes } from "@/lib/dashboard-mock-data";
import {
  X,
  PhoneCall,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  ArrowRight,
  Zap,
  Ticket as TicketIcon,
  CreditCard,
  Building2,
  Lock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MpesaPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: InitiateMpesaInput | null;
  onPaymentSuccess: (ticket: Ticket) => void;
}

export function MpesaPaymentModal({
  isOpen,
  onClose,
  bookingData,
  onPaymentSuccess,
}: MpesaPaymentModalProps) {
  const [phone, setPhone] = useState(bookingData?.phone_number || "0712345678");
  const [step, setStep] = useState<"input" | "waiting_stk" | "success" | "error">("input");
  const [stkMessage, setStkMessage] = useState("");
  const [mpesaReceipt, setMpesaReceipt] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen || !bookingData) return null;

  const handleStartStkPush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setErrorMsg("Please enter a valid Kenyan phone number (e.g. 0712345678).");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      const payload = { ...bookingData, phone_number: phone };
      const res = await initiateMpesaStkPush(payload);

      setStep("waiting_stk");
      setStkMessage(res.customer_message);

      // Simulate PIN entry on handset and callback verification
      setTimeout(async () => {
        const callbackRes = await processMpesaCallback(res.checkout_request_id, payload, true);
        if (callbackRes.payment.status === "SUCCESS" && callbackRes.ticket) {
          setMpesaReceipt(callbackRes.payment.mpesa_receipt);
          setStep("success");
          onPaymentSuccess(callbackRes.ticket);
        } else {
          setStep("error");
          setErrorMsg("Payment failed or was cancelled by user.");
        }
        setLoading(false);
      }, 3500);
    } catch (err) {
      setLoading(false);
      setStep("error");
      setErrorMsg("Failed to initiate automated payment prompt. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#0d121c] border border-gold/40 rounded-none overflow-hidden shadow-2xl p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-emerald-500 text-black flex items-center justify-center font-black">
              <Smartphone size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500">Express Payment Console</p>
              <h3 className="text-lg font-black uppercase tracking-tight text-foreground">Auto-Filled Payment Prompt</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* STEP 1: Auto-filled Details + Sticky PesaPal Frame + STK Prompt */}
        {step === "input" && (
          <form onSubmit={handleStartStkPush} className="space-y-6">
            {/* Auto-filled Attendee Summary Panel */}
            <div className="bg-slate-50 dark:bg-black/30 border border-border p-5 rounded-none space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-muted-foreground uppercase">
                <span>Attendee Name</span>
                <span className="text-foreground">{bookingData.holder_name}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-muted-foreground uppercase">
                <span>Attendee Email</span>
                <span className="text-foreground font-mono text-[11px]">{bookingData.holder_email}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-muted-foreground uppercase">
                <span>Engagement</span>
                <span className="text-foreground">{bookingData.event_name}</span>
              </div>
              {bookingData.seat_number && (
                <div className="flex justify-between items-center text-xs font-bold text-muted-foreground uppercase">
                  <span>Reserved Seat</span>
                  <span className="text-gold font-mono">Seat {bookingData.seat_number}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm font-black text-foreground uppercase border-t border-border pt-2">
                <span>Auto-Filled Amount</span>
                <span className="text-emerald-500 font-mono text-lg">{formatKes(bookingData.amount)}</span>
              </div>
            </div>

            {/* STICKY PESAPAL EMBED CODE FRAME */}
            <div className="p-4 bg-slate-100 dark:bg-white/5 border border-border rounded-none space-y-2 flex flex-col items-center justify-center text-center">
              <p className="text-[9px] font-black uppercase tracking-widest text-gold">Official PesaPal Gateway Embed</p>
              <div className="w-full flex justify-center overflow-hidden py-1">
                <iframe
                  width="200"
                  height="40"
                  src="https://store.pesapal.com/embed-code?pageUrl=https://store.pesapal.com/royaltouchevents"
                  frameBorder="0"
                  allowFullScreen
                  title="PesaPal Royal Touch Store"
                  className="border-0 overflow-hidden"
                />
              </div>
              <p className="text-[9px] text-muted-foreground font-medium">
                Supports M-Pesa STK, Airtel Money, Visa & Mastercard without page redirect.
              </p>
            </div>

            {errorMsg && (
              <div className="p-4 rounded-none bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-bold flex items-center gap-2">
                <AlertCircle size={16} />
                <p>{errorMsg}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">
                Target Mobile Number *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0712345678"
                  className="w-full h-14 bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-none pl-12 pr-4 text-xs font-bold text-foreground outline-none focus:border-gold"
                />
                <PhoneCall size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" />
              </div>
              <p className="text-[9px] text-muted-foreground">The prompt for {formatKes(bookingData.amount)} will be sent automatically to this handset.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-16 w-full rounded-none bg-gold text-black font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-black hover:text-gold transition-all shadow-xl shadow-gold/20 disabled:opacity-50 cursor-pointer"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <>Auto-Prompt Payment ({formatKes(bookingData.amount)}) <Zap size={16} /></>}
            </button>
          </form>
        )}

        {/* STEP 2: Waiting STK Push */}
        {step === "waiting_stk" && (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
              <div className="h-20 w-20 bg-gold text-black flex items-center justify-center font-black animate-bounce shadow-xl">
                <Smartphone size={36} />
              </div>
              <Loader2 size={88} className="absolute -top-1 -left-1 text-gold animate-spin opacity-40" />
            </div>

            <div className="space-y-2">
              <p className="text-base font-black uppercase tracking-tight text-foreground">STK Payment Prompt Sent!</p>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">{stkMessage}</p>
            </div>

            <div className="bg-gold/10 border border-gold/40 px-6 py-3 rounded-none text-[10px] font-black text-gold uppercase tracking-widest">
              Awaiting Mobile PIN Authorization...
            </div>
          </div>
        )}

        {/* STEP 3: Payment Success */}
        {step === "success" && (
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in-95 duration-500">
            <div className="h-20 w-20 bg-emerald-500 text-black flex items-center justify-center shadow-2xl">
              <CheckCircle2 size={44} />
            </div>

            <div className="space-y-2">
              <p className="text-2xl font-black uppercase tracking-tight text-foreground">Payment Confirmed!</p>
              <p className="text-xs text-muted-foreground">Receipt Token: <span className="text-emerald-500 font-mono font-bold">{mpesaReceipt}</span></p>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">Your payment has been verified and your digital QR ticket pass is ready.</p>
            </div>

            <button
              onClick={onClose}
              className="h-12 px-8 rounded-none bg-gold text-black font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-black hover:text-gold transition-all shadow-xl cursor-pointer"
            >
              Proceed To PDF Ticket Pass <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
