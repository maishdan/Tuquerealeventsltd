import { useState, useEffect } from "react";
import { ShieldCheck, Phone, Mail, ArrowRight } from "lucide-react";

export function LoadingScreen({
  title = "TOQUE REAL EVENTS LIMITED",
  onSkip,
}: {
  title?: string;
  onSkip?: () => void;
}) {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onSkip) onSkip();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onSkip]);

  return (
    <div className="fixed inset-0 z-[99999] bg-[#050812] bg-[url('/ltd.png')] bg-cover bg-center text-white font-sans flex flex-col items-center justify-between p-6 sm:p-10 select-none animate-in fade-in duration-300">
      {/* Top Header Title Tile */}
      <div className="pt-4 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black/90 border border-[#f4cf69]/50 text-[#f4cf69] text-[10px] font-black uppercase tracking-[0.25em] shadow-2xl">
          <ShieldCheck size={14} className="text-[#f4cf69]" /> Executive Event Production
        </div>
        <div className="p-3 bg-black/90 border border-[#f4cf69]/40 shadow-2xl inline-block max-w-xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white font-serif">
            {title}
          </h2>
        </div>
      </div>

      {/* Center GIF, Brand Logo & Action Card */}
      <div className="p-6 sm:p-8 bg-[#080d1a]/95 border-2 border-[#f4cf69]/60 shadow-[0_20px_70px_rgba(0,0,0,0.95)] max-w-lg w-full text-center space-y-6 my-auto rounded-none">
        <div className="relative flex justify-center">
          <div className="h-28 w-28 rounded-full overflow-hidden border-2 border-[#f4cf69] shadow-[0_0_50px_rgba(244,207,105,0.4)] bg-black p-1">
            <img src="/new logo.png" alt="TOQUE REAL Logo" className="h-full w-full object-cover rounded-full" />
          </div>
        </div>

        {/* Loading Buffering GIF */}
        <div className="h-16 flex items-center justify-center bg-black/60 border border-white/10 p-2">
          <img src="/Loading Buffering GIF.gif" alt="Loading..." className="h-12 w-auto object-contain" />
        </div>

        <p className="text-xs font-mono font-black text-[#f4cf69] tracking-widest uppercase bg-black/80 p-2 border border-[#f4cf69]/30">
          Loading Page Content ({countdown}s)...
        </p>

        {/* Contact Info Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs font-mono font-bold text-white bg-black/90 border border-[#243343] p-3 shadow-xl">
          <span className="flex items-center gap-1.5 text-emerald-400 font-extrabold">
            <Phone size={14} /> +254 795 365 334
          </span>
          <span className="text-[#8d9bad] hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5 text-[#f4cf69] font-extrabold">
            <Mail size={14} /> realtoque0@gmail.com
          </span>
        </div>

        {/* High-Visibility Green Skip Button */}
        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-[0.2em] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xl rounded-none"
          >
            <span>Skip / Enter Now</span>
            <ArrowRight size={16} />
          </button>
        )}
      </div>

      {/* Footer Powered By in Vibrant Green */}
      <div className="pb-2 text-center">
        <div className="px-5 py-1.5 bg-black/90 border border-emerald-500/50 shadow-xl inline-block">
          <p className="text-xs text-emerald-400 font-bold italic font-serif">
            Powered by My World Africa
          </p>
        </div>
      </div>
    </div>
  );
}
