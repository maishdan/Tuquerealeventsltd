import { useState, useEffect } from "react";
import { Download, X, Sparkles, Smartphone, CheckCircle2 } from "lucide-react";

export function PwaInstallBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute (60 seconds)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  // Listen for browser PWA beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  // 1-Minute Countdown Timer: Disappears completely after 60 seconds
  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsVisible(false); // Disappears completely after 1 minute
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setInstalled(true);
        setTimeout(() => setIsVisible(false), 2000);
      }
      setDeferredPrompt(null);
    } else {
      setShowInstructions(true);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-[#0c1b28] via-[#07111a] to-[#0c1b28] border-b-2 border-[#f4cf69]/60 shadow-[0_10px_30px_rgba(0,0,0,0.8)] p-3 sm:p-4 text-white font-sans relative z-[9999] animate-in slide-in-from-top duration-300">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">

        {/* Logo & Brand Info */}
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <img
              src="/new logo.png"
              alt="TOQUE REAL Logo"
              className="h-11 w-11 rounded-full object-cover border-2 border-[#f4cf69] shadow-md ring-2 ring-[#f4cf69]/20"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            <span className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-2 border-[#07111a] flex items-center justify-center">
              <Sparkles size={9} className="text-black" />
            </span>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center justify-center sm:justify-start gap-2 font-mono">
              <span className="text-xs font-black uppercase text-[#f4cf69] tracking-wider">
                TOQUE REAL EVENTS LIMITED
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[9px] uppercase border border-emerald-500/30">
                Official Web App
              </span>
            </div>
            <p className="text-xs text-[#a3b3c3] font-medium leading-tight max-w-xl">
              Install our web app to your home screen for fast VIP ticket pass access, offline booking & instant updates.
            </p>
          </div>
        </div>

        {/* Action Controls & Countdown */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Timer Indicator */}
          <div className="text-[10px] font-mono text-[#8a9ba9] hidden md:block">
            Auto-dismiss in: <strong className="text-[#f4cf69]">{timeLeft}s</strong>
          </div>

          {installed ? (
            <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-400 text-emerald-400 font-black text-xs uppercase tracking-wider rounded-lg flex items-center gap-1.5 font-mono">
              <CheckCircle2 size={15} /> App Installed!
            </div>
          ) : (
            <button
              type="button"
              onClick={handleInstallClick}
              className="px-4 py-2 bg-gradient-to-r from-[#d5a637] to-[#f4cf69] text-black font-black text-xs uppercase tracking-wider rounded-lg shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5 font-mono"
            >
              <Download size={15} /> Install Web App
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="p-1.5 rounded-lg text-[#8a9ba9] hover:text-white hover:bg-[#142637] transition-all cursor-pointer"
            title="Close Banner"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Safari / Unsupported Browser Instructions Popup */}
      {showInstructions && (
        <div className="mt-2 pt-2 border-t border-[#182a3c] text-center text-xs font-mono text-amber-300 animate-in fade-in duration-200">
          💡 To install: Tap your browser menu (<strong className="text-white">⋮</strong> or <strong className="text-white">Share</strong>) and select <strong className="text-white">"Add to Home Screen"</strong> or <strong className="text-white">"Install App"</strong>.
        </div>
      )}
    </div>
  );
}
