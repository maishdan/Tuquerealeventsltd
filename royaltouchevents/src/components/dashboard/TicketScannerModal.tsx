import React, { useState } from "react";
import { useVerifyAndScanTicket } from "@/hooks/use-dashboard-data";
import type { ScanVerificationResult } from "@/lib/api/tickets";
import { formatKes } from "@/lib/dashboard-mock-data";
import {
  X,
  QrCode,
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldAlert,
  Loader2,
  Ticket as TicketIcon,
  User,
  Calendar,
  Armchair
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TicketScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TicketScannerModal({ isOpen, onClose }: TicketScannerModalProps) {
  const [ticketInput, setTicketInput] = useState("");
  const [scanResult, setScanResult] = useState<ScanVerificationResult | null>(null);

  const verifyTicketMutation = useVerifyAndScanTicket();

  if (!isOpen) return null;

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketInput.trim()) return;

    verifyTicketMutation.mutate(ticketInput, {
      onSuccess: (res) => {
        setScanResult(res);
      },
    });
  };

  const handleQuickTest = (code: string) => {
    setTicketInput(code);
    verifyTicketMutation.mutate(code, {
      onSuccess: (res) => {
        setScanResult(res);
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl bg-[#0b0e14] border border-gold/40 rounded-[36px] overflow-hidden shadow-[0_0_80px_rgba(212,175,55,0.2)] p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gold/20 border border-gold/30 flex items-center justify-center text-gold">
              <ScanLine size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gold">Gate Security & Scanner</p>
              <h3 className="text-lg font-bold uppercase tracking-tight text-foreground">Ticket Verification System</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scan Input Form */}
        <form onSubmit={handleScanSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
              Enter Ticket Code / Scan Token *
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  required
                  placeholder="Ex: TCK-VVIP-9021 or TKT-TOKEN-..."
                  value={ticketInput}
                  onChange={(e) => setTicketInput(e.target.value)}
                  className="w-full h-14 bg-muted/60 border border-border rounded-2xl pl-12 pr-4 text-sm font-mono font-bold text-foreground uppercase tracking-widest outline-none focus:border-gold"
                />
                <QrCode size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" />
              </div>

              <button
                type="submit"
                disabled={verifyTicketMutation.isPending}
                className="h-14 px-8 rounded-2xl bg-gold text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-lg shadow-gold/20 disabled:opacity-50"
              >
                {verifyTicketMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : "Verify & Check-In"}
              </button>
            </div>
          </div>

          {/* Quick Test Shortcuts */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-[9px] font-bold uppercase text-muted-foreground">Quick Test Samples:</span>
            <button
              type="button"
              onClick={() => handleQuickTest("TCK-VVIP-9021")}
              className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-mono text-gold hover:bg-gold/10"
            >
              TCK-VVIP-9021 (Valid)
            </button>
            <button
              type="button"
              onClick={() => handleQuickTest("TCK-GEN-1089")}
              className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-mono text-rose-400 hover:bg-rose-500/10"
            >
              TCK-GEN-1089 (Already Used)
            </button>
          </div>
        </form>

        {/* SCAN VERIFICATION RESULT DISPLAY */}
        {scanResult && (
          <div className="pt-2">
            {scanResult.result === "VALID" && (
              <div className="p-6 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/40 text-foreground space-y-4 animate-in zoom-in-95 duration-300">
                <div className="flex items-center gap-3 text-emerald-400 border-b border-emerald-500/20 pb-3">
                  <CheckCircle2 size={28} />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">ENTRY GRANTED ✓</p>
                    <p className="text-sm font-bold text-foreground">{scanResult.message}</p>
                  </div>
                </div>

                {scanResult.ticket && (
                  <div className="grid grid-cols-2 gap-4 text-xs font-bold pt-1">
                    <div>
                      <p className="text-[8px] font-black uppercase text-muted-foreground">Pass Holder</p>
                      <p className="text-foreground">{scanResult.ticket.holder_name}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black uppercase text-muted-foreground">Pass Tier</p>
                      <p className="text-gold uppercase">{scanResult.ticket.ticket_tier}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black uppercase text-muted-foreground">Seat Number</p>
                      <p className="text-foreground">Seat {scanResult.ticket.seat_number || "GA"}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black uppercase text-muted-foreground">Check-In Timestamp</p>
                      <p className="text-emerald-400 font-mono">
                        {scanResult.scannedAt ? new Date(scanResult.scannedAt).toLocaleTimeString() : "Just Now"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {scanResult.result === "ALREADY_USED" && (
              <div className="p-6 rounded-3xl bg-rose-500/10 border-2 border-rose-500/40 text-foreground space-y-4 animate-in zoom-in-95 duration-300">
                <div className="flex items-center gap-3 text-rose-500 border-b border-rose-500/20 pb-3">
                  <AlertTriangle size={28} />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">DUPLICATE SCAN WARNING! ❌</p>
                    <p className="text-sm font-bold text-foreground leading-relaxed">{scanResult.message}</p>
                  </div>
                </div>

                {scanResult.ticket && (
                  <div className="grid grid-cols-2 gap-4 text-xs font-bold pt-1">
                    <div>
                      <p className="text-[8px] font-black uppercase text-muted-foreground">Pass Holder</p>
                      <p className="text-foreground">{scanResult.ticket.holder_name}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black uppercase text-muted-foreground">Original Check-In</p>
                      <p className="text-rose-400 font-mono">
                        {scanResult.ticket.used_at ? new Date(scanResult.ticket.used_at).toLocaleTimeString() : "Previously Scanned"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {(scanResult.result === "CANCELLED" || scanResult.result === "NOT_FOUND") && (
              <div className="p-6 rounded-3xl bg-white/5 border-2 border-white/10 text-foreground space-y-3 animate-in zoom-in-95 duration-300">
                <div className="flex items-center gap-3 text-rose-400">
                  <XCircle size={28} />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400">ENTRY DENIED</p>
                    <p className="text-sm font-bold text-foreground">{scanResult.message}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
