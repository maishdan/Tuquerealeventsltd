import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type AgentState = "idle" | "listening" | "thinking" | "speaking";

export interface AgentAudioVisualizerBarProps {
  state: AgentState;
  barCount?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AgentAudioVisualizerBar({
  state,
  barCount = 5,
  size = "lg",
  className,
}: AgentAudioVisualizerBarProps) {
  const [barHeights, setBarHeights] = useState<number[]>([30, 45, 60, 40, 50]);

  useEffect(() => {
    if (state === "idle") {
      setBarHeights([25, 35, 45, 30, 20]);
      return;
    }

    const interval = setInterval(() => {
      setBarHeights(() => {
        if (state === "speaking") {
          return [50, 75, 90, 60, 80];
        } else if (state === "listening") {
          return [30, 60, 40, 70, 50];
        } else if (state === "thinking") {
          return [40, 50, 60, 50, 40];
        }
        return [20, 20, 20, 20, 20];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state, barCount]);

  const sizeHeight = size === "sm" ? "h-6" : size === "md" ? "h-10" : "h-14";
  const barWidth = size === "sm" ? "w-1.5" : size === "md" ? "w-2.5" : "w-3.5";

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#040d16]/90 border border-[#f4cf69]/30 shadow-inner",
        sizeHeight,
        className
      )}
      title={`AI Agent State: ${state.toUpperCase()}`}
    >
      {barHeights.slice(0, barCount).map((heightPercent, idx) => (
        <div
          key={idx}
          style={{ height: `${heightPercent}%` }}
          className={cn(
            "rounded-full transition-all duration-300 ease-out shadow-sm",
            barWidth,
            state === "speaking"
              ? "bg-gradient-to-t from-[#d5a637] via-[#f4cf69] to-[#ffffff] shadow-[0_0_10px_rgba(244,207,105,0.6)]"
              : state === "listening"
              ? "bg-gradient-to-t from-rose-600 via-rose-400 to-white shadow-[0_0_10px_rgba(244,63,94,0.6)]"
              : state === "thinking"
              ? "bg-gradient-to-t from-sky-600 via-sky-300 to-white shadow-[0_0_10px_rgba(56,189,248,0.6)]"
              : "bg-[#203348]"
          )}
        />
      ))}
    </div>
  );
}
