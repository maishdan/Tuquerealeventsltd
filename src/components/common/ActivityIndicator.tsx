import React from "react";
import { cn } from "@/lib/utils";
import { Crown, Sparkles } from "lucide-react";

interface ActivityIndicatorProps {
  size?: "sm" | "md" | "lg" | "xl";
  label?: string;
  sublabel?: string;
  showCrown?: boolean;
  className?: string;
}

export function ActivityIndicator({
  size = "md",
  label = "Connecting to Live Database...",
  sublabel = "TOQUE REAL EVENTS LIMITED — Official System Throbber",
  showCrown = true,
  className,
}: ActivityIndicatorProps) {
  const outerSizeClass = {
    sm: "h-8 w-8 border-2",
    md: "h-14 w-14 border-2",
    lg: "h-20 w-20 border-3",
    xl: "h-28 w-28 border-4",
  }[size];

  const innerSizeClass = {
    sm: "h-5 w-5 border",
    md: "h-9 w-9 border-2",
    lg: "h-12 w-12 border-2",
    xl: "h-16 w-16 border-2",
  }[size];

  const crownSize = {
    sm: 12,
    md: 18,
    lg: 24,
    xl: 32,
  }[size];

  return (
    <div className={cn("flex flex-col items-center justify-center p-4 text-center select-none font-sans space-y-3", className)}>
      {/* LUXURY GOLD THROBBER SPINNER ENGINE */}
      <div className="relative flex items-center justify-center">
        {/* Outer Orbit Spinning Ring */}
        <div
          className={cn(
            "rounded-full border-t-[#f4cf69] border-r-transparent border-b-[#d5a637] border-l-transparent animate-spin duration-700 shadow-[0_0_25px_rgba(244,207,105,0.4)]",
            outerSizeClass
          )}
        />

        {/* Inner Counter-Rotating Orbit Ring */}
        <div
          className={cn(
            "absolute rounded-full border-t-transparent border-r-[#f4cf69] border-b-transparent border-l-[#896019] animate-spin duration-1000 origin-center reverse-spin",
            innerSizeClass
          )}
          style={{ animationDirection: "reverse" }}
        />

        {/* Pulsing Glowing Center Gem / Crown */}
        {showCrown && (
          <div className="absolute flex items-center justify-center text-[#f4cf69] animate-pulse">
            <Crown size={crownSize} className="drop-shadow-[0_0_10px_rgba(244,207,105,0.8)]" />
          </div>
        )}
      </div>

      {/* LABELS */}
      {(label || sublabel) && (
        <div className="space-y-1">
          {label && (
            <p className="text-xs sm:text-sm font-black uppercase tracking-wider text-white flex items-center justify-center gap-1.5 font-mono">
              <Sparkles size={13} className="text-[#f4cf69] animate-pulse" /> {label}
            </p>
          )}
          {sublabel && (
            <p className="text-[10px] text-[#899cb0] font-mono tracking-widest uppercase">
              {sublabel}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
