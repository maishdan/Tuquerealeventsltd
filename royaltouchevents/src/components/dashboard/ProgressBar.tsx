import { cn } from "@/lib/utils";

type ProgressBarProps = {
  percent: number;
  label?: string;
  className?: string;
};

export function ProgressBar({ percent, label = "Progress", className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, Math.round(percent)));

  return (
    <progress
      max={100}
      value={clamped}
      aria-label={label}
      className={cn("dashboard-progress", className)}
    />
  );
}
