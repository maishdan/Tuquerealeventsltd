import { useState, useEffect } from "react";
import { ShieldCheck, Phone, Mail, ArrowRight, Sparkles } from "lucide-react";

export function LoadingScreen({
  title = "TOQUE REAL EVENTS LIMITED",
  onSkip,
}: {
  title?: string;
  onSkip?: () => void;
}) {
  const [, setTimerCount] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimerCount((prev) => {
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
      {/* Top Header Title Badge */}
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

      {/* Center Card with Big Circular GIF & High-Contrast HCI Controls */}
      <div className="p-6 sm:p-8 bg-[#080d1a]/95 border-2 border-[#f4cf69]/60 shadow-[0_25px_80px_rgba(0,0,0,0.95)] max-w-lg w-full text-center space-y-6 my-auto rounded-none">
        {/* Brand Crown Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f4cf69]/10 border border-[#f4cf69]/40 text-[#f4cf69] text-[10px] font-black uppercase tracking-widest font-mono">
          <Sparkles size={13} /> TOQUE REAL Executive Portal
        </div>

        {/* Big Circular Loading Buffering GIF */}
        <div className="flex justify-center my-2">
          <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-full overflow-hidden border-2 border-[#f4cf69] shadow-[0_0_60px_rgba(244,207,105,0.5)] bg-black p-2 flex items-center justify-center">
            <img src="/Loading Buffering GIF.gif" alt="Loading..." className="h-full w-full object-cover rounded-full" />
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs font-mono font-bold text-white bg-black/90 border border-[#243343] p-3 shadow-2xl">
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
            className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-[0.2em] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xl rounded-none hover:scale-[1.02]"
          >
            <span>Skip / Enter Now</span>
            <ArrowRight size={16} />
          </button>
        )}
      </div>

      {/* Footer Powered By in Vibrant Green */}
      <div className="pb-2 text-center">
        <div className="px-5 py-1.5 bg-black/90 border border-emerald-500/50 shadow-2xl inline-block">
          <p className="text-xs text-emerald-400 font-bold italic font-serif">
            Powered by My World Africa
          </p>
        </div>
      </div>
    </div>
  );
}
