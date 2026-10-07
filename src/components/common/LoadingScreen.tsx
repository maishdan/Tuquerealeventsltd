import React from "react";
import { ActivityIndicator } from "./ActivityIndicator";
import { ArrowRight } from "lucide-react";

export function LoadingScreen({
  title = "TOQUE REAL EVENTS LIMITED",
  onSkip,
}: {
  message?: string;
  title?: string;
  onSkip?: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[99999] bg-[#03070d] text-white font-sans flex flex-col items-center justify-center p-6 select-none animate-in fade-in duration-200 space-y-6">
      {/* Dynamic Activity Indicator / Throbber Spinner in MD MODE (Frameless & Blank) */}
      <ActivityIndicator
        size="md"
        label=""
        sublabel=""
      />

      {/* High-Visibility Green Skip Button */}
      {onSkip && (
        <button
          type="button"
          onClick={onSkip}
          className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-[0.2em] rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xl hover:scale-105 active:scale-95 mt-4"
        >
          <span>Skip / Enter Now</span>
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
}
