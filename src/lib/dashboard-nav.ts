import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Radio,
  Calendar,
  Layers,
  Settings2,
  Wallet,
  Users,
  Sparkles,
  PartyPopper,
  MessageSquare,
  User,
  ClipboardList,
  BarChart3,
  ShieldCheck,
  Briefcase,
  History,
} from "lucide-react";

export type DashboardNavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  description?: string;
  category?: string;
};

export const adminNav: DashboardNavItem[] = [
  // CORE
  { to: "/admin", label: "Executive Overview", icon: LayoutDashboard, description: "KPIs & CEO insights", category: "Core" },
  { to: "/admin/analytics", label: "Sales Analytics", icon: BarChart3, description: "Revenue & growth trends", category: "Core" },

  // MANAGEMENT
  { to: "/admin/bookings", label: "Booking Management", icon: ClipboardList, description: "Leads & inquiries", category: "Management" },
  { to: "/admin/calendar", label: "Event Schedule", icon: Calendar, description: "Operational timeline", category: "Management" },
  { to: "/admin/team", label: "Staff & Teams", icon: Users, description: "Performance & scheduling", category: "Management" },

  // LOGISTICS
  { to: "/admin/command", label: "Command Center", icon: Radio, description: "Live event logistics", category: "Operations" },
  { to: "/admin/categories", label: "Service Catalog", icon: Layers, description: "Event types & pricing", category: "Operations" },
  { to: "/admin/finance", label: "Financial Hub", icon: Wallet, description: "Invoices & payroll", category: "Operations" },

  // ADVANCED
  { to: "/admin/ai", label: "AI Prediction", icon: Sparkles, description: "Demand forecasting", category: "System" },
  { to: "/admin/operations", label: "System Settings", icon: Settings2, description: "Portal configuration", category: "System" },
];

export const customerNav: DashboardNavItem[] = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/events", label: "My Events", icon: PartyPopper },
  { to: "/dashboard/bookings", label: "Bookings", icon: Calendar },
  { to: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { to: "/dashboard/profile", label: "Profile", icon: User },
];
