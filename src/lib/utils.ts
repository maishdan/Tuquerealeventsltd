import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTimeBasedGreeting(name: string): { greeting: string; period: string } {
  const hour = new Date().getHours();
  let period = "Morning";
  if (hour >= 12 && hour < 17) {
    period = "Afternoon";
  } else if (hour >= 17 && hour < 22) {
    period = "Evening";
  } else if (hour >= 22 || hour < 5) {
    period = "Night";
  }
  return {
    greeting: `Good ${period}, ${name}`,
    period,
  };
}
