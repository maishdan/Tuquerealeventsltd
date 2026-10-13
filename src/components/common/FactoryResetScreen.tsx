import React, { useState, useEffect } from "react";
import { Cog, RefreshCw, Factory, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";

interface FactoryResetScreenProps {
  onComplete: () => void;
}

export function FactoryResetScreen({ onComplete }: FactoryResetScreenProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Connecting to Supabase Database Cluster...");

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 800);
          return 100;
        }
        const next = prev + 5;
        if (next < 25) {
          setStatusText("Connecting to Supabase Database Cluster...");
        } else if (next < 50) {
          setStatusText("Wiping operational records, bookings & tickets (Preserving Registered Users)...");
        } else if (next < 75) {
          setStatusText("Clearing event registries, CRM proposals & messaging logs...");
        } else if (next < 95) {
          setStatusText("Re-evaluating RLS security policies & flushing local memory caches...");
        } else {
          setStatusText("✓ Factory reset complete! System restored to fresh default zero state.");
        }
        return next;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[999999] bg-[#02060b]/98 backdrop-blur-md text-white font-sans flex flex-col items-center justify-center p-6 select-none animate-in fade-in duration-300">
      <div className="max-w-lg w-full bg-[#081522] border-2 border-[#f4cf69] rounded-2xl p-8 shadow-[0_25px_80px_rgba(0,0,0,0.95)] text-center space-y-6">
        {/* Top Header Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-rose-500/20 border border-rose-500/50 text-rose-300 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg">
          <ShieldAlert size={14} className="text-rose-400" /> SYSTEM FACTORY RESET IN PROGRESS
        </div>

        {/* ROTATING INDUSTRIAL GEARS & FACTORY SILHOUETTE */}
        <div className="relative flex items-center justify-center py-4">
          <div className="relative h-32 w-32 flex items-center justify-center">
            {/* Outer Orbit Arrow Ring */}
            <RefreshCw className="absolute inset-0 h-full w-full text-[#f4cf69] animate-spin duration-[3000ms] opacity-80" />

            {/* Counter-Rotating Big Industrial Gear */}
            <Cog className="absolute h-20 w-20 text-[#d5a637] animate-spin duration-[2000ms]" style={{ animationDirection: "reverse" }} />

            {/* Center Factory Icon */}
            <div className="relative z-10 h-10 w-10 bg-[#081522] rounded-full flex items-center justify-center text-white shadow-xl border border-[#f4cf69]">
              <Factory size={22} className="text-[#f4cf69]" />
            </div>
          </div>
        </div>

        {/* PROGRESS PERCENTAGE & STATUS */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-mono font-bold">
            <span className="text-[#f4cf69] uppercase flex items-center gap-1.5">
              <Sparkles size={14} className="animate-pulse" /> Reset Progress
            </span>
            <span className="text-white text-base">{progress}%</span>
          </div>

          {/* Horizontal Progress Bar */}
          <div className="h-3 w-full bg-[#0c1a28] border border-[#203548] rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#d5a637] via-[#f4cf69] to-emerald-400 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-xs text-[#a0b2c6] font-mono min-h-[32px] pt-1">
            {statusText}
          </p>
        </div>

        <div className="pt-2 border-t border-[#1f3246] text-[10px] text-[#899cb0] font-mono uppercase tracking-widest">
          TOQUE REAL EVENTS LIMITED — Official Factory Reset Engine
        </div>
      </div>
    </div>
  );
}
