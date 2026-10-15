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

export function getVenueWeatherAndCoords(city: string, venueName: string): {
  lat: number;
  lon: number;
  temp: number;
  rainProb: number;
  windspeed: number;
  condition: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  advisory: string;
  mapUrl: string;
} {
  const v = (venueName + " " + city).toLowerCase();

  let lat = -1.2882;
  let lon = 36.8231;
  let temp = 23;
  let rainProb = 20;
  let windspeed = 12;
  let condition = "Partly Cloudy";

  if (v.includes("mombasa") || v.includes("whitesands")) {
    lat = -3.9870; lon = 39.7280; temp = 29; rainProb = 15; windspeed = 18; condition = "Sunny & Breezy";
  } else if (v.includes("kigali") || v.includes("rwanda")) {
    lat = -1.9536; lon = 30.0927; temp = 24; rainProb = 35; windspeed = 10; condition = "Partly Cloudy";
  } else if (v.includes("kampala") || v.includes("uganda")) {
    lat = 0.3340; lon = 32.5890; temp = 26; rainProb = 45; windspeed = 14; condition = "Scattered Showers";
  } else if (v.includes("addis") || v.includes("ethiopia")) {
    lat = 9.0100; lon = 38.7600; temp = 19; rainProb = 10; windspeed = 11; condition = "Clear & Mild";
  } else if (v.includes("dar es salaam") || v.includes("tanzania")) {
    lat = -6.8160; lon = 39.2890; temp = 30; rainProb = 25; windspeed = 16; condition = "Humid & Clear";
  } else if (v.includes("nyeri") || v.includes("chaka")) {
    lat = -0.3780; lon = 37.0320; temp = 21; rainProb = 50; windspeed = 15; condition = "Rain Risk / Cool";
  } else if (v.includes("sarit")) {
    lat = -1.2618; lon = 36.8048; temp = 22; rainProb = 20; windspeed = 11; condition = "Partly Cloudy";
  } else if (v.includes("weston")) {
    lat = -1.3195; lon = 36.8118; temp = 23; rainProb = 30; windspeed = 13; condition = "Partly Cloudy";
  } else if (v.includes("edge")) {
    lat = -1.3280; lon = 36.8520; temp = 22; rainProb = 25; windspeed = 12; condition = "Mild & Clear";
  } else if (v.includes("kempinski")) {
    lat = -1.2675; lon = 36.8080; temp = 23; rainProb = 15; windspeed = 10; condition = "Clear & Warm";
  } else if (v.includes("radisson")) {
    lat = -1.2985; lon = 36.8185; temp = 23; rainProb = 20; windspeed = 12; condition = "Partly Cloudy";
  }

  const isHighRisk = rainProb >= 40;
  const isMediumRisk = rainProb >= 25 && rainProb < 40;

  const riskLevel = isHighRisk ? "HIGH" : isMediumRisk ? "MEDIUM" : "LOW";
  const advisory = isHighRisk
    ? `⚠️ High Rain Probability (${rainProb}%): Deploy waterproof stretch tents, rubberized cable protection ramps, covered stage rigging, and indoor backup hall.`
    : isMediumRisk
    ? `⚡ Moderate Weather Risk (${rainProb}% Rain): Consider side-wall covers for outdoor pavilions and ballasted audio trussing.`
    : `✓ Optimal Outdoor Conditions (${rainProb}% Rain, ${windspeed} km/h wind): Ideal for 4K LED displays, outdoor staging, and open-air receptions.`;

  return {
    lat,
    lon,
    temp,
    rainProb,
    windspeed,
    condition,
    riskLevel,
    advisory,
    mapUrl: `https://maps.google.com/maps?q=${lat},${lon}&z=15&output=embed`,
  };
}
