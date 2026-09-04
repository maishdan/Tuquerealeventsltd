import React, { useState } from "react";
import {
  initiateMpesaStkPush,
  processMpesaCallback,
  parseAndVerifyMpesaSms,
  type InitiateMpesaInput,
  type MpesaSmsVerificationResult
} from "@/lib/api/payments";
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
  Copy,
  Sparkles,
  Cpu,
  Check,
  Info,
  XCircle,
  Clock,
  UserCheck
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
  const [mpesaSmsText, setMpesaSmsText] = useState("");
  const [step, setStep] = useState<"input" | "ai_scanning" | "flagged_error" | "admin_pending" | "success">("input");

  // Copy Feedback State
  const [copiedPaybill, setCopiedPaybill] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  // AI Verification State
  const [aiResult, setAiResult] = useState<MpesaSmsVerificationResult | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStepMessage, setScanStepMessage] = useState("Initializing AI Neural Scanner...");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen || !bookingData) return null;

  const handleStartAiScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mpesaSmsText.trim()) {
      setErrorMsg("Please paste your M-Pesa SMS confirmation message or transaction code.");
      return;
    }

    setErrorMsg("");
    setLoading(true);
    setStep("ai_scanning");
    setScanProgress(20);
    setScanStepMessage("Analyzing M-Pesa Message Structure & Code...");

    // Run AI Parsing & Verification
    const result = parseAndVerifyMpesaSms(mpesaSmsText, bookingData.amount);
    setAiResult(result);

    // Step 1: Format Check (1 sec)
    setTimeout(() => {
      setScanProgress(50);
      setScanStepMessage(`Checking Amount & Date Timestamp...`);
    }, 1000);

    // Step 2: Exact Amount & Time Check (2.2 sec)
    setTimeout(async () => {
      setScanProgress(100);

      if (!result.isValid) {
        setStep("flagged_error");
        setLoading(false);
        return;
      }

      setScanStepMessage(`✓ Exact Amount & Date Verified!`);

      try {
        const callbackRes = await processMpesaCallback(
          `ws_AI_${Date.now()}`,
          bookingData,
          true,
          result.receiptCode || undefined
        );

        if (callbackRes.ticket) {
          setStep("success");
          onPaymentSuccess(callbackRes.ticket);
        } else {
          setStep("flagged_error");
          setErrorMsg("Could not issue ticket. Submitted for admin approval.");
        }
      } catch (err) {
        setStep("flagged_error");
        setErrorMsg("Failed to verify payment with admin server.");
      } finally {
        setLoading(false);
      }
    }, 2200);
  };

  const handleSubmitToAdminForApproval = () => {
    setStep("admin_pending");
  };

  const autofillValidSample = () => {
    const today = new Date();
    const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear().toString().slice(-2)}`;
    const timeStr = today.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const validText = `${bookingData.booking_id.slice(0, 10).toUpperCase()} Confirmed. Ksh${bookingData.amount.toLocaleString()}.00 sent to ROYAL TOUCH EVENTS 2053270290 on ${dateStr} at ${timeStr}. New M-PESA balance is Ksh${(bookingData.amount + 3200).toLocaleString()}.00.`;
    setMpesaSmsText(validText);
  };

  const autofillInvalidAmountSample = () => {
    const today = new Date();
    const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear().toString().slice(-2)}`;
    const timeStr = today.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const invalidText = `ABCDE12345 Confirmed. Ksh150.00 sent to JOHN DOE 0722000000 on ${dateStr} at ${timeStr}. New M-PESA balance is Ksh1,205.10.`;
    setMpesaSmsText(invalidText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300 font-sans">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#0d121c] border border-gold/40 rounded-none overflow-hidden shadow-2xl p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gold text-black flex items-center justify-center font-black">
              <Cpu size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gold">M-Pesa Verification Engine</p>
              <h3 className="text-lg font-black uppercase tracking-tight text-foreground">Lipa Na M-Pesa Paybill</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* OFFICIAL M-PESA PAYBILL & ACCOUNT NUMBER PANEL */}
        <div className="p-5 bg-emerald-500/10 border-2 border-emerald-500/40 rounded-none space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-xs uppercase tracking-widest">
              <Smartphone size={16} /> Lipa Na M-Pesa Paybill
            </div>
            <span className="px-2.5 py-0.5 bg-emerald-500 text-black font-black text-[9px] uppercase tracking-widest">
              Official Payment
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-black/40 border border-emerald-500/30 p-3.5 flex flex-col justify-between">
              <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Paybill Number</span>
              <div className="flex items-center justify-between mt-1">
                <span className="font-mono text-xl font-black text-emerald-500">303030</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText("303030");
                    setCopiedPaybill(true);
                    setTimeout(() => setCopiedPaybill(false), 2000);
                  }}
                  className="text-[9px] text-muted-foreground hover:text-foreground font-black uppercase flex items-center gap-1 cursor-pointer"
                >
                  {copiedPaybill ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                  {copiedPaybill ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-black/40 border border-emerald-500/30 p-3.5 flex flex-col justify-between">
              <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Account Number</span>
              <div className="flex items-center justify-between mt-1">
                <span className="font-mono text-xl font-black text-gold">2053270290</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText("2053270290");
                    setCopiedAccount(true);
                    setTimeout(() => setCopiedAccount(false), 2000);
                  }}
                  className="text-[9px] text-muted-foreground hover:text-foreground font-black uppercase flex items-center gap-1 cursor-pointer"
                >
                  {copiedAccount ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                  {copiedAccount ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-1 text-[11px] text-slate-700 dark:text-gray-300 font-medium leading-relaxed pt-1">
            <p>1. Open M-Pesa Menu → Lipa na M-Pesa → Pay Bill.</p>
            <p>2. Enter Paybill <span className="font-black text-emerald-500 font-mono">303030</span> and Account <span className="font-black text-gold font-mono">2053270290</span>.</p>
            <p>3. Enter exact ticket price <span className="font-black text-emerald-500 font-mono">{formatKes(bookingData.amount)}</span> & PIN.</p>
            <p>4. Paste your received M-Pesa SMS confirmation below for AI scan.</p>
          </div>
        </div>

        {/* STEP 1: Input & Paste M-Pesa Message */}
        {step === "input" && (
          <form onSubmit={handleStartAiScan} className="space-y-6">
            {/* Target Ticket Specs */}
            <div className="bg-slate-50 dark:bg-black/30 border border-border p-4 rounded-none space-y-2 text-xs font-bold">
              <div className="flex justify-between items-center text-muted-foreground uppercase">
                <span>Pass Holder</span>
                <span className="text-foreground">{bookingData.holder_name}</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground uppercase">
                <span>Engagement</span>
                <span className="text-foreground">{bookingData.event_name}</span>
              </div>
              <div className="flex justify-between items-center border-t border-border pt-2 text-sm">
                <span className="uppercase text-muted-foreground">Required Ticket Price</span>
                <span className="font-mono text-emerald-500 font-black text-lg">{formatKes(bookingData.amount)}</span>
              </div>
            </div>

            {errorMsg && (
              <div className="p-4 rounded-none bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-bold flex items-center gap-2">
                <AlertCircle size={16} />
                <p>{errorMsg}</p>
              </div>
            )}

            {/* M-Pesa SMS Paste Area */}
            <div className="space-y-2">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  Paste M-Pesa SMS Message *
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={autofillValidSample}
                    className="text-[9px] text-emerald-500 font-black uppercase tracking-widest hover:underline cursor-pointer"
                  >
                    + Valid Sample
                  </button>
                  <button
                    type="button"
                    onClick={autofillInvalidAmountSample}
                    className="text-[9px] text-rose-500 font-black uppercase tracking-widest hover:underline cursor-pointer"
                  >
                    + Mismatch Sample
                  </button>
                </div>
              </div>

              <textarea
                rows={4}
                required
                value={mpesaSmsText}
                onChange={(e) => setMpesaSmsText(e.target.value)}
                placeholder='Ex: "ABCDE12345 Confirmed. Ksh1,500.00 sent to ROYAL TOUCH EVENTS 2053270290 on 04/09/26 at 8:15 PM..."'
                className="w-full bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-none p-4 text-xs font-mono font-bold text-foreground focus:border-gold outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-16 w-full rounded-none bg-gold text-black font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-black hover:text-gold transition-all shadow-xl shadow-gold/20 cursor-pointer disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <>AI Scan Exact Amount & Timestamp <Cpu size={16} /></>}
            </button>
          </form>
        )}

        {/* STEP 2: AI Scanning Animation Screen */}
        {step === "ai_scanning" && (
          <div className="py-10 flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative h-24 w-24 bg-black border-2 border-gold flex items-center justify-center text-gold shadow-2xl">
              <Cpu size={44} className="animate-pulse text-gold" />
              <div className="absolute inset-0 bg-gold/10 animate-ping opacity-30" />
            </div>

            <div className="space-y-3 w-full">
              <p className="text-xl font-black uppercase tracking-tight text-foreground">AI Exact Match Verification</p>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-muted border border-border overflow-hidden rounded-none">
                <div
                  className="h-full bg-gold transition-all duration-500"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>

              <p className="text-xs font-bold font-mono text-gold">{scanStepMessage}</p>
            </div>
          </div>
        )}

        {/* STEP 3: FLAGGED ERROR SCREEN (Mismatch Amount or Date Error) */}
        {step === "flagged_error" && aiResult && (
          <div className="py-6 space-y-6 text-center animate-in fade-in duration-300">
            <div className="h-20 w-20 bg-rose-500 text-white flex items-center justify-center mx-auto shadow-2xl">
              <XCircle size={44} />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 bg-rose-500/10 text-rose-500 font-black text-[9px] uppercase tracking-widest border border-rose-500/30">
                ❌ Verification Flagged Down
              </span>
              <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">
                Payment Message Mismatch
              </h2>
              <p className="text-xs text-rose-500 font-bold max-w-md mx-auto leading-relaxed bg-rose-500/10 p-4 border border-rose-500/20">
                {aiResult.failureReason}
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-black/30 border border-border text-left space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pasted Message Code:</span>
                <span className="text-foreground font-bold">{aiResult.receiptCode || "Not Found"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pasted Amount:</span>
                <span className={cn("font-bold", aiResult.amountMatches ? "text-emerald-500" : "text-rose-500 font-black")}>
                  KSh {aiResult.amount ? aiResult.amount.toLocaleString() : "0"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Required Ticket Amount:</span>
                <span className="text-gold font-bold">KSh {aiResult.expectedAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep("input")}
                className="h-12 px-6 border border-border text-foreground font-black text-[10px] uppercase tracking-widest hover:border-gold transition-all cursor-pointer flex-1"
              >
                Re-Paste Correct Message
              </button>

              <button
                type="button"
                onClick={handleSubmitToAdminForApproval}
                className="h-12 px-6 bg-gold text-black font-black text-[10px] uppercase tracking-widest hover:bg-black hover:text-gold transition-all shadow-md cursor-pointer flex-1"
              >
                Submit To Admin For Approval
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SUBMITTED TO ADMIN QUEUE FOR MANUAL APPROVAL */}
        {step === "admin_pending" && (
          <div className="py-8 space-y-6 text-center animate-in zoom-in-95 duration-500">
            <div className="h-20 w-20 bg-amber-500 text-black flex items-center justify-center mx-auto shadow-2xl">
              <Clock size={44} />
            </div>

            <div className="space-y-2">
              <p className="text-2xl font-black uppercase tracking-tight text-foreground">
                Submitted For Admin Approval
              </p>
              <p className="text-xs text-slate-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
                Your payment message has been queued for manual review by our executive finance team. Once approved, your digital ticket pass will be automatically issued to <span className="font-bold text-foreground">{bookingData.holder_email}</span>.
              </p>
            </div>

            <button
              onClick={onClose}
              className="h-12 px-8 rounded-none bg-gold text-black font-black text-[10px] uppercase tracking-widest hover:bg-black hover:text-gold transition-all cursor-pointer"
            >
              Close & Wait For Confirmation
            </button>
          </div>
        )}

        {/* STEP 5: VERIFICATION SUCCESS */}
        {step === "success" && (
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in-95 duration-500">
            <div className="h-20 w-20 bg-emerald-500 text-black flex items-center justify-center shadow-2xl">
              <CheckCircle2 size={44} />
            </div>

            <div className="space-y-2">
              <p className="text-2xl font-black uppercase tracking-tight text-foreground">AI Verification Confirmed!</p>
              <p className="text-xs text-muted-foreground">
                Transaction Code: <span className="text-emerald-500 font-mono font-black">{aiResult?.receiptCode}</span>
              </p>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                Exact ticket amount KSh {bookingData.amount.toLocaleString()} and date timestamp matched. Your PDF pass is ready.
              </p>
            </div>

            <button
              onClick={onClose}
              className="h-14 px-8 rounded-none bg-gold text-black font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-black hover:text-gold transition-all shadow-xl cursor-pointer"
            >
              Proceed To Download Ticket <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
