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
  BellRing,
  ShoppingCart,
  History,
  Boxes,
} from "lucide-react";

export type DashboardNavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  description?: string;
  category?: string;
};

export const adminNav: DashboardNavItem[] = [
  { to: "/admin", label: "Dashboard Overview", icon: LayoutDashboard, category: "Main" },
  { to: "/admin/contacts", label: "Contacts", icon: MessageSquare, category: "Main" },
  { to: "/admin/events", label: "Events", icon: PartyPopper, category: "Main" },
  { to: "/admin/bookings", label: "Bookings", icon: ClipboardList, category: "Main" },
  { to: "/admin/users", label: "Users", icon: Users, category: "People" },
  { to: "/admin/customers", label: "Customers", icon: UserCircle, category: "People" },
  { to: "/admin/reminders", label: "Admin Reminders", icon: BellRing, category: "Operations" },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart, category: "Operations" },
  { to: "/admin/receipts", label: "Receipts & Payments", icon: Receipt, category: "Finance" },
  { to: "/admin/payment-history", label: "Payment History", icon: History, category: "Finance" },
  { to: "/admin/inventory-analytics", label: "Inventory & Analytics", icon: Boxes, category: "Insights" },
  { to: "/admin/settings", label: "Settings", icon: Settings2, category: "System" },
];

export const customerNav: DashboardNavItem[] = [
  { to: "/dashboard", label: "Dashboard Overview", icon: LayoutDashboard, category: "Main" },
  { to: "/dashboard/events", label: "My Events", icon: PartyPopper, category: "Main" },
  { to: "/dashboard/bookings", label: "Bookings", icon: ClipboardList, category: "Main" },
  { to: "/dashboard/orders", label: "Orders", icon: ShoppingCart, category: "Main" },
  { to: "/dashboard/messages", label: "Messages", icon: MessageSquare, category: "Communication" },
  { to: "/dashboard/receipts", label: "Receipts & Payments", icon: Receipt, category: "Finance" },
  { to: "/dashboard/payment-history", label: "Payment History", icon: History, category: "Finance" },
  { to: "/dashboard/profile", label: "Profile", icon: UserCircle, category: "Account" },
];
