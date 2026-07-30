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
  UsersRound,
  Wallet,
  Activity,
  BarChart3,
  Sparkles,
  Globe,
  Command,
  ShieldCheck,
  Zap,
  Briefcase,
  TrendingUp,
  Fingerprint
} from "lucide-react";

export type DashboardNavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
};

export type DashboardNavGroup = {
  key: string;
  label?: string;
  icon?: LucideIcon;
  /** Single link with no children (rendered as a top-level row) */
  to?: string;
  /** Parent group with sub-items (rendered expandable) */
  children?: DashboardNavItem[];
  /** Optional section header text shown above this entry */
  section?: string;
};

export type DashboardNavSection = {
  section: string;
  items: DashboardNavGroup[];
};

export const adminSections: DashboardNavSection[] = [
  {
    section: "Main Operations",
    items: [
      { key: "overview", label: "Mission Control", icon: Command, to: "/admin" },
      { key: "events", label: "Empire Events", icon: Globe, to: "/admin/events" },
      { key: "bookings", label: "Project Intake", icon: ClipboardList, to: "/admin/bookings" },
      { key: "orders", label: "Logistics Orders", icon: ShoppingCart, to: "/admin/orders" },
      { key: "contacts", label: "Comms Registry", icon: MessageSquare, to: "/admin/contacts" },
    ],
  },
  {
    section: "Financials",
    items: [
      {
        key: "finance",
        label: "Capital Hub",
        icon: Wallet,
        children: [
          { to: "/admin/finance", label: "Overview", icon: Activity },
          { to: "/admin/receipts", label: "Revenue Ledger", icon: Receipt },
          { to: "/admin/payment-history", label: "Transaction Logs", icon: History },
        ],
      },
    ],
  },
  {
    section: "Executive Account",
    items: [
      {
        key: "system",
        label: "System Control",
        icon: ShieldCheck,
        children: [
          { key: "users", label: "Executive Force", icon: Fingerprint, to: "/admin/users" },
          { key: "settings", label: "System Config", icon: Settings2, to: "/admin/settings" },
        ],
      },
    ],
  },
];

export const customerSections: DashboardNavSection[] = [
  {
    section: "Main Operations",
    items: [
      { key: "overview", label: "Portal Hub", icon: LayoutDashboard, to: "/dashboard" },
      { key: "events", label: "My Portfolio", icon: PartyPopper, to: "/dashboard/events" },
      { key: "bookings", label: "My Inquiries", icon: ClipboardList, to: "/dashboard/bookings" },
      { key: "orders", label: "Service Orders", icon: ShoppingCart, to: "/dashboard/orders" },
      { key: "messages", label: "Concierge", icon: MessageSquare, to: "/dashboard/messages" },
    ],
  },
  {
    section: "Financials",
    items: [
      {
        key: "finance",
        label: "Finance",
        icon: Wallet,
        children: [
          { to: "/dashboard/receipts", label: "Receipts & Ledger", icon: Receipt },
          { to: "/dashboard/payment-history", label: "Transaction History", icon: History },
        ],
      },
    ],
  },
  {
    section: "Executive Account",
    items: [
      { key: "profile", label: "Identity Profile", icon: UserCircle, to: "/dashboard/profile" },
      { key: "settings", label: "Portal Settings", icon: Settings2, to: "/dashboard/settings" },
    ],
  },
];

// Back-compat flat lists (kept so other imports keep working)
export const adminNav: DashboardNavItem[] = adminSections.flatMap((s) =>
  s.items.flatMap((g) => (g.children ? g.children : g.to ? [{ to: g.to, label: g.label!, icon: g.icon! }] : [])),
);
export const customerNav: DashboardNavItem[] = customerSections.flatMap((s) =>
  s.items.flatMap((g) => (g.children ? g.children : g.to ? [{ to: g.to, label: g.label!, icon: g.icon! }] : [])),
);
