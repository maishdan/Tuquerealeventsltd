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
} from "lucide-react";

export type DashboardNavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  description?: string;
};

export const adminNav: DashboardNavItem[] = [
  { to: "/admin", label: "Executive Overview", icon: LayoutDashboard, description: "KPIs & CEO insights" },
  { to: "/admin/bookings", label: "Bookings & Inquiries", icon: ClipboardList, description: "New leads from website" },
  { to: "/admin/command", label: "Event Command", icon: Radio, description: "Live event tracking" },
  { to: "/admin/calendar", label: "Event Calendar", icon: Calendar },
  { to: "/admin/categories", label: "Event Categories", icon: Layers },
  { to: "/admin/operations", label: "Operations", icon: Settings2 },
  { to: "/admin/finance", label: "Financial Hub", icon: Wallet },
  { to: "/admin/team", label: "Team Management", icon: Users },
  { to: "/admin/ai", label: "AI Insights", icon: Sparkles },
];

export const customerNav: DashboardNavItem[] = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/events", label: "My Events", icon: PartyPopper },
  { to: "/dashboard/bookings", label: "Bookings", icon: Calendar },
  { to: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { to: "/dashboard/profile", label: "Profile", icon: User },
];
