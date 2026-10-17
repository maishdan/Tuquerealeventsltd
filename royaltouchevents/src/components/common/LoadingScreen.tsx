import { useState, useEffect } from "react";
import { ActivityIndicator } from "./ActivityIndicator";
import { ArrowRight } from "lucide-react";

export function LoadingScreen({
  title = "TOQUE REAL EVENTS LIMITED",
  message,
  onSkip,
}: {
  message?: string;
  title?: string;
  onSkip?: () => void;
}) {
  const [showSkip, setShowSkip] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    // Show Skip button after 3 seconds (3000ms)
    const skipTimer = setTimeout(() => {
      setShowSkip(true);
    }, 3000);

    // Auto-dismiss / force complete after 5 seconds (5000ms)
    const timeoutTimer = setTimeout(() => {
      setTimedOut(true);
      if (onSkip) {
        onSkip();
      }
    }, 5000);

    return () => {
      clearTimeout(skipTimer);
      clearTimeout(timeoutTimer);
    };
  }, [onSkip]);

  const handleSkipClick = () => {
    setTimedOut(true);
    if (onSkip) {
      onSkip();
    }
  };

  if (timedOut && !onSkip) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[99999] bg-[#03070d] text-white font-sans flex flex-col items-center justify-center p-6 select-none animate-in fade-in duration-200 space-y-6">
      {/* Activity Indicator Throbber */}
      <ActivityIndicator size="md" label="" sublabel="" />

      {(title || message) && (
        <div className="text-center space-y-1">
          {title && (
            <p className="text-xs font-bold text-[#f4cf69] uppercase tracking-widest font-mono">
              {title}
            </p>
          )}
          {message && (
            <p className="text-[10px] text-gray-400 font-mono">
              {message}
            </p>
          )}
        </div>
      )}

      {/* High-Visibility Green Skip Button - Appears at 3 seconds */}
      {(showSkip || onSkip) && (
        <button
          type="button"
          onClick={handleSkipClick}
          className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-[0.2em] rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xl hover:scale-105 active:scale-95 animate-in fade-in zoom-in-95 duration-300 mt-2"
        >
          <span>Skip / Enter Now</span>
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
}
