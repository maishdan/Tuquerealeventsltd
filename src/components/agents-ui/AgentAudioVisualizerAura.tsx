import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { AgentState } from "./AgentAudioVisualizerBar";

export interface AgentAudioVisualizerAuraProps {
  state: AgentState;
  size?: "sm" | "md" | "lg" | "xl";
  color?: string;
  colorShift?: number;
  className?: string;
  children?: React.ReactNode;
}

export function AgentAudioVisualizerAura({
  state,
  size = "xl",
  color = "#1FD5F9",
  colorShift = 0.1,
  className,
  children,
}: AgentAudioVisualizerAuraProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.06;
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 2 - 10;

      ctx.clearRect(0, 0, width, height);

      let numWaves = 7;
      let amplitude = 4;
      let mainColor = color;

      if (state === "speaking") {
        amplitude = 7;
        mainColor = color || "#1FD5F9";
      } else if (state === "listening") {
        amplitude = 9;
        mainColor = "#f43f5e"; // Rose audio pulse
      } else if (state === "thinking") {
        amplitude = 5;
        mainColor = "#f4cf69"; // Gold
      } else {
        amplitude = 2.5;
        mainColor = color || "#1FD5F9";
      }

      // Draw 3 layered undulating wave rings for realistic depth
      for (let layer = 0; layer < 3; layer++) {
        ctx.save();
        ctx.beginPath();
        const layerAlpha = 0.85 - layer * 0.25;
        const layerRadius = radius + layer * 2;

        for (let angle = 0; angle <= Math.PI * 2; angle += 0.04) {
          const wave =
            Math.sin(angle * numWaves + time * (1.2 + layer * 0.25)) *
            amplitude *
            (1 - layer * 0.15);
          const r = layerRadius + wave;
          const x = centerX + r * Math.cos(angle);
          const y = centerY + r * Math.sin(angle);

          if (angle === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.closePath();

        ctx.strokeStyle = mainColor;
        ctx.globalAlpha = layerAlpha;
        ctx.lineWidth = 3.5 - layer * 0.8;
        ctx.shadowColor = mainColor;
        ctx.shadowBlur = 18 - layer * 4;
        ctx.stroke();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [state, color, colorShift]);

  const pixelSize =
    size === "sm" ? 44 : size === "md" ? 72 : size === "lg" ? 110 : 150;

  return (
    <div
      className={cn("relative flex items-center justify-center shrink-0 select-none", className)}
      style={{ width: pixelSize, height: pixelSize }}
    >
      <canvas
        ref={canvasRef}
        width={pixelSize}
        height={pixelSize}
        className="absolute inset-0 pointer-events-none z-0"
      />
      {children && (
        <div className="relative z-10 flex items-center justify-center overflow-hidden rounded-full">
          {children}
        </div>
      )}
    </div>
  );
}
