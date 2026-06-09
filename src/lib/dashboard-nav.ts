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
  TrendingUp,
  DollarSign,
  Package,
  Truck,
  PieChart,
  LineChart,
  Activity,
  FileText,
} from "lucide-react";

export type DashboardNavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  description?: string;
  category?: string;
};

export const adminNav: DashboardNavItem[] = [
  // EXECUTIVE & GROWTH
  { to: "/admin", label: "Executive Overview", icon: LayoutDashboard, category: "Executive" },
  { to: "/admin/analytics", label: "Revenue Analytics", icon: LineChart, category: "Executive" },
  { to: "/admin/investor", label: "Investor & Board", icon: PieChart, category: "Executive" },

  // EVENT OPERATIONS
  { to: "/admin/events", label: "All Events", icon: PartyPopper, category: "Operations" },
  { to: "/admin/command", label: "Event Command Center", icon: Radio, category: "Operations" },
  { to: "/admin/projects", label: "Project (Work Done)", icon: Briefcase, category: "Operations" },
  { to: "/admin/calendar", label: "Event Calendar", icon: Calendar, category: "Operations" },
  { to: "/admin/bookings", label: "Bookings & Orders", icon: ClipboardList, category: "Operations" },

  // LOGISTICS & ASSETS
  { to: "/admin/team", label: "Staff Management", icon: Users, category: "Logistics" },
  { to: "/admin/contacts", label: "Contact Inquiries", icon: MessageSquare, category: "Logistics" },
  { to: "/admin/vehicles", label: "Vehicle Tracking", icon: Truck, category: "Logistics" },
  { to: "/admin/inventory", label: "Inventory Status", icon: Package, category: "Logistics" },
  { to: "/admin/vendors", label: "Vendor Management", icon: MessageSquare, category: "Logistics" },

  // INTELLIGENCE & FINANCE
  { to: "/admin/ai", label: "AI CEO Insights", icon: Sparkles, category: "Intelligence" },
  { to: "/admin/finance", label: "Financial Hub", icon: Wallet, category: "Intelligence" },
  { to: "/admin/receipts", label: "Official Receipts", icon: FileText, category: "Intelligence" },
  { to: "/admin/forecasting", label: "Success Forecast", icon: TrendingUp, category: "Intelligence" },

  // SYSTEM
  { to: "/admin/operations", label: "System Settings", icon: Settings2, category: "System" },
];

export const customerNav: DashboardNavItem[] = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/events", label: "My Events", icon: PartyPopper },
  { to: "/dashboard/bookings", label: "Bookings", icon: Calendar },
  { to: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { to: "/dashboard/profile", label: "Profile", icon: User },
];
