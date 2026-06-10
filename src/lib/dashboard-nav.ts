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
    section: "Main",
    items: [
      { key: "overview", label: "Dashboard", icon: LayoutDashboard, to: "/admin" },
      { key: "contacts", label: "Contacts", icon: MessageSquare, to: "/admin/contacts" },
      { key: "events", label: "Events", icon: PartyPopper, to: "/admin/events" },
      { key: "bookings", label: "Bookings", icon: ClipboardList, to: "/admin/bookings" },
      {
        key: "audience",
        label: "Audience",
        icon: UsersRound,
        children: [
          { to: "/admin/users", label: "Users", icon: Users },
          { to: "/admin/customers", label: "Customers", icon: UserCircle },
        ],
      },
      {
        key: "operations",
        label: "Operations",
        icon: Activity,
        children: [
          { to: "/admin/reminders", label: "Admin Reminders", icon: BellRing },
          { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
        ],
      },
      {
        key: "finance",
        label: "Finance",
        icon: Wallet,
        children: [
          { to: "/admin/receipts", label: "Receipts & Payments", icon: Receipt },
          { to: "/admin/payment-history", label: "Payment History", icon: History },
        ],
      },
      {
        key: "insights",
        label: "Insights",
        icon: BarChart3,
        children: [
          { to: "/admin/inventory-analytics", label: "Inventory & Analytics", icon: Boxes },
        ],
      },
    ],
  },
  {
    section: "Settings",
    items: [
      { key: "settings", label: "Settings", icon: Settings2, to: "/admin/settings" },
    ],
  },
];

export const customerSections: DashboardNavSection[] = [
  {
    section: "Main",
    items: [
      { key: "overview", label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
      { key: "events", label: "My Events", icon: PartyPopper, to: "/dashboard/events" },
      { key: "bookings", label: "Bookings", icon: ClipboardList, to: "/dashboard/bookings" },
      { key: "orders", label: "Orders", icon: ShoppingCart, to: "/dashboard/orders" },
      { key: "messages", label: "Messages", icon: MessageSquare, to: "/dashboard/messages" },
      {
        key: "finance",
        label: "Finance",
        icon: Wallet,
        children: [
          { to: "/dashboard/receipts", label: "Receipts & Payments", icon: Receipt },
          { to: "/dashboard/payment-history", label: "Payment History", icon: History },
        ],
      },
    ],
  },
  {
    section: "Account",
    items: [
      { key: "profile", label: "Profile", icon: UserCircle, to: "/dashboard/profile" },
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
