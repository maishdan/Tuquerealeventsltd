import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Settings2,
  Users,
  PartyPopper,
  MessageSquare,
  ClipboardList,
  UserCircle,
  Receipt,
} from "lucide-react";

export type DashboardNavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  description?: string;
  category?: string;
};

export const adminNav: DashboardNavItem[] = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, category: "Main" },
  { to: "/admin/contacts", label: "Contacts", icon: MessageSquare, category: "Main" },
  { to: "/admin/events", label: "Events", icon: PartyPopper, category: "Main" },
  { to: "/admin/bookings", label: "Bookings", icon: ClipboardList, category: "Main" },
  { to: "/admin/users", label: "Users", icon: Users, category: "People" },
  { to: "/admin/customers", label: "Customers", icon: UserCircle, category: "People" },
  { to: "/admin/receipts", label: "Receipts & Payments", icon: Receipt, category: "Finance" },
  { to: "/admin/settings", label: "Settings", icon: Settings2, category: "System" },
];

export const customerNav: DashboardNavItem[] = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/events", label: "My Events", icon: PartyPopper },
  { to: "/dashboard/bookings", label: "Bookings", icon: ClipboardList },
  { to: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { to: "/dashboard/profile", label: "Profile", icon: UserCircle },
];
