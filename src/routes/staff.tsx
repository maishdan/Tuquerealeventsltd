import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { createPageSeo } from "@/lib/seo";
import { useAuth } from "@/contexts/AuthContext";
import {
  Crown,
  Search,
  Home,
  Bell,
  Calendar,
  CheckSquare,
  Clock,
  MessageSquare,
  User,
  Plus,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Send,
  Sparkles,
  ChevronRight,
  LogOut,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/staff")({
  head: () =>
    createPageSeo({
      title: "Staff & Operations Command Dashboard | TOQUE REAL EVENTS LIMITED",
      description: "Official Staff & Operations Command Center for TOQUE REAL EVENTS LIMITED coordinators and event managers.",
      path: "/staff",
      noindex: true,
    }),
  component: StaffDashboard,
});

type StaffPage =
  | "overview"
  | "schedule"
  | "tasks"
  | "assigned"
  | "notifications"
  | "messages"
  | "profile"
  | "decor"
  | "catering"
  | "media"
  | "sound"
  | "logistics"
  | "vendors"
  | "finance"
  | "inventory"
  | "venue"
  | "tickets"
  | "marketing"
  | "reports"
  | "field";

const departmentData: Record<string, [string, string, string[]]> = {
  schedule: ["📅 My Schedule", "Your calendar, shifts, appointments and event commitments.", ["Calendar", "Shifts", "Appointments", "Event Schedule", "Availability", "Time Off"]],
  tasks: ["✅ My Tasks", "Tasks assigned to you, priorities and completion tracking.", ["All Tasks", "Today", "Overdue", "High Priority", "Completed", "Task Calendar"]],
  assigned: ["📋 Assigned Events", "Events where you are an assigned coordinator or team member.", ["Upcoming Events", "Active Events", "Event Briefs", "Requirements", "Team Assignments", "Event Documents"]],
  notifications: ["🔔 Notifications", "System, event, task and operational alerts.", ["All Notifications", "Urgent", "Events", "Tasks", "Approvals", "Read History"]],
  messages: ["💬 Internal Messages", "Internal TOQUE REAL communication and team conversations.", ["Inbox", "Team Chat", "Event Chats", "Sent", "Attachments", "Archived"]],
  profile: ["👤 My Profile", "Your staff profile, role, contact details and preferences.", ["Personal Details", "Role & Permissions", "Availability", "Documents", "Preferences", "Security"]],
  decor: ["🎨 Decor & Design", "Themes, moodboards, decoration jobs, materials, installations and approvals.", ["Assigned Events", "Themes & Moodboards", "Decoration Inventory", "Setup Schedule", "Design Approvals", "Completed Projects"]],
  catering: ["🍽️ Catering & Kitchen", "Menus, guest counts, ingredients, kitchen production, dietary requirements and service.", ["Menus", "Guest Counts", "Ingredients", "Kitchen Tasks", "Dietary Requirements", "Delivery Schedule"]],
  media: ["📸 Media & Photography", "Photography, videography, equipment, editing queues, albums and delivery.", ["Photography Jobs", "Videography Jobs", "Shot Lists", "Equipment", "Editing Queue", "Client Review"]],
  sound: ["🔊 Sound & Entertainment", "Sound, DJs, MCs, performers, technical requirements and setup.", ["Sound Assignments", "DJ Assignments", "MC Assignments", "Performers", "Equipment", "Sound Check"]],
  logistics: ["🚚 Logistics & Operations", "Transport, drivers, deliveries, equipment movement, setup teams and incidents.", ["Transport", "Vehicles", "Drivers", "Deliveries", "Equipment Movement", "Incident Reports"]],
  vendors: ["🤝 Vendor / Supplier", "Vendor profiles, availability, quotations, orders, contracts and assignments.", ["Vendors", "Suppliers", "Availability", "Quotations", "Orders", "Vendor Assignments"]],
  finance: ["💰 Finance & Accounting", "Invoices, receipts, customer payments, balances, expenses and event profitability.", ["Invoices", "Receipts", "Customer Payments", "Outstanding Balances", "Expenses", "Financial Reports"]],
  inventory: ["📦 Inventory & Assets", "Assets, stock movements, reservations, check-out/check-in, maintenance and loss tracking.", ["All Assets", "Available", "Reserved", "Assigned", "Maintenance", "Stock Movements"]],
  venue: ["🏨 Venue Management", "Venues, availability, bookings, capacity, facilities, partners and requirements.", ["Venues", "Availability", "Bookings", "Capacity", "Venue Partners", "Setup Requirements"]],
  tickets: ["🎟️ Ticketing & Registration", "Ticket types, ticket sales, attendees, QR tickets, registration and check-in.", ["Ticket Types", "Ticket Sales", "Attendees", "Registrations", "QR Tickets", "Check-In"]],
  marketing: ["📢 Marketing", "Campaigns, social media, promotions, landing pages, leads and campaign analytics.", ["Campaigns", "Social Media", "Email Campaigns", "Promotions", "Landing Pages", "Campaign Analytics"]],
  reports: ["📊 Reports & Analytics", "Operational, sales, customer, staff, vendor, inventory and service reports.", ["Event Reports", "Sales Reports", "Customer Reports", "Staff Reports", "Inventory Reports", "Custom Reports"]],
  field: ["🗺️ Field Operations", "Assignments, venue routes, arrival check-in, setup progress, incidents and completion.", ["Today's Assignments", "My Events", "Routes", "Arrival Check-In", "Setup Progress", "Incident Reports"]],
};

export function StaffDashboard() {
  const { user, profile, signOut } = useAuth();
  const [activePage, setActivePage] = useState<StaffPage>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Interactive Task Ledger State
  const [tasksList, setTasksList] = useState([
    { id: 1, text: "Finalize seating plan for Gala", due: "Sep 15", event: "Gala", done: true },
    { id: 2, text: "Follow up on AV quote for Conference", due: "Sep 16", event: "Conference", done: false },
    { id: 3, text: "Confirm catering headcount", due: "Sep 16", event: "Conference", done: true },
    { id: 4, text: "Finalize vendor allocation", due: "Sep 16", event: "Gala", done: true },
    { id: 5, text: "Upload event requirements", due: "Sep 16", event: "XYZ Org", done: true },
    { id: 6, text: "Prepare venue checklist", due: "Sep 17", event: "ABC Corp", done: false },
  ]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const toggleTask = (id: number) => {
    setTasksList(
      tasksList.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
    showToast("✓ Task status updated!");
  };

  const staffName = profile?.full_name || user?.user_metadata?.full_name || "Japheth Owiyo";
  const staffRole = "Event Coordinator";

  return (
    <div className="min-h-screen bg-[#050812] text-[#f7f4ed] font-sans selection:bg-[#d3aa68] selection:text-black antialiased">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[100] px-5 py-3 bg-[#172132] border border-[#705431] text-white text-xs font-mono font-bold shadow-2xl rounded-lg animate-in slide-in-from-bottom-4 duration-300">
          {toastMsg}
        </div>
      )}

      {/* App Shell Grid */}
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-[225px_1fr]">
        {/* SIDEBAR NAVIGATION */}
        <aside className="border-r border-[#202838] bg-[#070b14] flex flex-col sticky top-0 h-screen overflow-y-auto scrollbar-thin p-3 space-y-3 z-50">
          {/* Brand Logo Header */}
          <div className="text-center pb-4 border-b border-[#202838] text-[#d4ad6a] pt-2">
            <img src="/new logo.png" alt="TOQUE REAL Logo" className="h-9 w-9 mx-auto rounded-full object-cover border border-[#d4ad6a]/50 shadow-md mb-1" />
            <b className="block font-serif text-base tracking-[2px] leading-tight">TOQUE REAL</b>
            <small className="block text-[9px] tracking-[3px] text-[#8993a4]">EVENTS LIMITED</small>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1 text-xs">
            {[
              { id: "overview", label: "Staff Overview", icon: "🏠" },
              { id: "schedule", label: "My Schedule", icon: "📅" },
              { id: "tasks", label: "My Tasks", icon: "✅" },
              { id: "assigned", label: "Assigned Events", icon: "📋" },
              { id: "notifications", label: "Notifications", icon: "🔔" },
              { id: "messages", label: "Internal Messages", icon: "💬" },
              { id: "profile", label: "My Profile", icon: "👤" },
            ].map((nav) => (
              <button
                key={nav.id}
                onClick={() => {
                  setActivePage(nav.id as StaffPage);
                  showToast(`${nav.label} Workspace Opened`);
                }}
                className={cn(
                  "w-full text-left px-3 py-2.5 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-2.5",
                  activePage === nav.id
                    ? "bg-gradient-to-r from-[#b78a4a] to-[#735127] text-white font-bold shadow-md"
                    : "text-[#bfc6d3] hover:bg-[#121b2b] hover:text-white"
                )}
              >
                <span className="text-base">{nav.icon}</span>
                <span>{nav.label}</span>
              </button>
            ))}

            <div className="text-[10px] text-[#697385] font-black uppercase tracking-[2px] pt-4 pb-1 px-3">
              Departments
            </div>

            {[
              { id: "decor", label: "Decor & Design", icon: "🎨" },
              { id: "catering", label: "Catering & Kitchen", icon: "🍽️" },
              { id: "media", label: "Media & Photography", icon: "📸" },
              { id: "sound", label: "Sound & Entertainment", icon: "🔊" },
              { id: "logistics", label: "Logistics & Operations", icon: "🚚" },
              { id: "vendors", label: "Vendor / Supplier", icon: "🤝" },
              { id: "finance", label: "Finance & Accounting", icon: "💰" },
              { id: "inventory", label: "Inventory & Assets", icon: "📦" },
              { id: "venue", label: "Venue Management", icon: "🏨" },
              { id: "tickets", label: "Ticketing & Registration", icon: "🎟️" },
              { id: "marketing", label: "Marketing", icon: "📢" },
              { id: "reports", label: "Reports & Analytics", icon: "📊" },
              { id: "field", label: "Field Operations", icon: "🗺️" },
            ].map((nav) => (
              <button
                key={nav.id}
                onClick={() => {
                  setActivePage(nav.id as StaffPage);
                  showToast(`${nav.label} Department Workspace Opened`);
                }}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-2.5 text-xs",
                  activePage === nav.id
                    ? "bg-gradient-to-r from-[#b78a4a] to-[#735127] text-white font-bold shadow-md"
                    : "text-[#bfc6d3] hover:bg-[#121b2b] hover:text-white"
                )}
              >
                <span className="text-sm">{nav.icon}</span>
                <span>{nav.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="min-w-0 flex flex-col">
          {/* TOP STICKY COMMAND BAR */}
          <header className="h-[72px] border-b border-[#202838] bg-[#070b14]/95 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6 gap-4">
            <div className="relative w-full max-w-md h-10 bg-[#121b2b] border border-[#394356] rounded-lg flex items-center px-3 text-xs text-[#9aa5b7]">
              <Search size={15} className="mr-2 text-[#697385]" />
              <input
                type="text"
                placeholder="Search clients, events, contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") showToast(`Searching: "${searchQuery}"`);
                }}
                className="w-full bg-transparent border-0 outline-none text-white placeholder:text-[#697385]"
              />
            </div>

            <div className="flex items-center gap-4 text-xs shrink-0">
              <Link
                to="/"
                className="h-9 px-3 border border-[#394356] bg-[#121b2b] hover:border-[#d4ad6a] text-[#d4ad6a] text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all"
              >
                <Home size={14} /> <span className="hidden sm:inline">Website Home</span>
              </Link>

              <button
                onClick={() => showToast("4 Unread Internal Messages")}
                className="p-2 text-[#bfc6d3] hover:text-[#d4ad6a] transition-colors cursor-pointer relative"
              >
                <Bell size={18} />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 animate-ping" />
              </button>

              <div className="hidden sm:block text-[#9aa5b7] font-mono text-xs">
                Wed, 10 Sep 2026
              </div>

              <div className="flex items-center gap-2.5 border-l border-[#202838] pl-3">
                <div className="h-9 w-9 rounded-full bg-[#f1ddb0] text-[#222] font-black text-xs flex items-center justify-center shadow-md">
                  JO
                </div>
                <div className="text-left hidden md:block">
                  <b className="block text-white text-xs leading-tight">{staffName}</b>
                  <small className="block text-[10px] text-[#929bab] font-medium">{staffRole}</small>
                </div>
              </div>
            </div>
          </header>

          {/* PAGE CONTENT CONTAINER */}
          <div className="p-6 sm:p-8 space-y-6 flex-1">
            {/* VIEW 1: STAFF OVERVIEW */}
            {activePage === "overview" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Hero Welcome Banner */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#202838] pb-6">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      Welcome, {staffName}, <span className="text-[#d4ad6a] font-normal">{staffRole}</span>
                    </h1>
                    <p className="text-xs text-[#929bab] mt-1 font-medium">
                      Your operational focus and assigned event workflows for today
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { label: "＋ New Client", msg: "New Client workspace opened" },
                      { label: "▣ New Event", msg: "New Event creation opened" },
                      { label: "▤ Create Proposal", msg: "Proposal workspace opened" },
                      { label: "▣ Approve Payment", msg: "Payment approval ledger opened" },
                      { label: "▦ View All", msg: "All department modules opened" },
                    ].map((btn, i) => (
                      <button
                        key={i}
                        onClick={() => showToast(btn.msg)}
                        className="px-3.5 py-2.5 border border-[#6d522f] bg-gradient-to-b from-[#3a2b1b] to-[#241a10] text-[#f5ead6] hover:text-white text-xs font-bold rounded-lg transition-all shadow-md cursor-pointer hover:border-[#d4ad6a]"
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* KPI Stat Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  <div className="p-4 bg-gradient-to-br from-[#0b1220] to-[#070c15] border border-[#202a3a] rounded-xl space-y-1 shadow-lg">
                    <h3 className="text-xs font-semibold text-[#d4dae3]">My Active Tasks</h3>
                    <div className="text-2xl sm:text-3xl font-bold text-white font-mono">7</div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-[#0b1220] to-[#070c15] border border-[#202a3a] rounded-xl space-y-1 shadow-lg">
                    <h3 className="text-xs font-semibold text-[#d4dae3]">Events This Week</h3>
                    <div className="text-2xl sm:text-3xl font-bold text-white font-mono">3</div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-[#0b1220] to-[#070c15] border border-[#202a3a] rounded-xl space-y-1 shadow-lg">
                    <h3 className="text-xs font-semibold text-[#d4dae3]">Pending Approvals</h3>
                    <div className="text-2xl sm:text-3xl font-bold text-white font-mono">1</div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-[#0b1220] to-[#070c15] border border-[#202a3a] rounded-xl space-y-1 shadow-lg">
                    <h3 className="text-xs font-semibold text-[#d4dae3]">Internal Messages</h3>
                    <div className="text-2xl sm:text-3xl font-bold text-white font-mono flex items-baseline gap-1.5">
                      4 <small className="text-[#d3aa68] text-xs font-normal">Unread</small>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-[#0b1220] to-[#070c15] border border-[#202a3a] rounded-xl space-y-1 shadow-lg">
                    <h3 className="text-xs font-semibold text-[#d4dae3]">Event-Related Issues</h3>
                    <div className="text-2xl sm:text-3xl font-bold text-rose-500 font-mono flex items-baseline gap-1.5">
                      1 <small className="text-rose-400 text-xs font-normal">(Critical)</small>
                    </div>
                  </div>
                </div>

                {/* Main Overview Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Today's Schedule & Interactive Calendar (Col 7) */}
                  <div className="lg:col-span-7 p-5 bg-gradient-to-br from-[#0b1220] to-[#070c15] border border-[#202a3a] rounded-xl space-y-4 shadow-xl">
                    <div className="flex justify-between items-center border-b border-[#202838] pb-3">
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <span>▣</span> Today's Schedule & Events
                      </h2>
                      <button onClick={() => setActivePage("schedule")} className="text-xs font-bold text-[#d3aa68] hover:underline cursor-pointer">
                        View All →
                      </button>
                    </div>

                    <div className="grid sm:grid-cols-12 gap-4">
                      {/* Weekly Date Calendar Grid */}
                      <div className="sm:col-span-5 space-y-2">
                        <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] text-[#929bab] font-bold">
                          <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                          <div className="py-1">7</div><div className="py-1">8</div><div className="py-1">9</div>
                          <div className="py-1 bg-[#c59a58] text-black font-black rounded-full shadow-md">10</div>
                          <div className="py-1">11</div><div className="py-1">12</div><div className="py-1">13</div>
                          <div className="py-1">14</div><div className="py-1">15</div><div className="py-1">16</div>
                          <div className="py-1">17</div><div className="py-1">18</div><div className="py-1">19</div><div className="py-1">20</div>
                        </div>
                      </div>

                      {/* Live Event Timeline */}
                      <div className="sm:col-span-7 border-t sm:border-t-0 sm:border-l border-[#202838] pt-3 sm:pt-0 sm:pl-4 space-y-2 max-h-56 overflow-y-auto scrollbar-thin">
                        {[
                          { time: "09:00", title: "Decor Setup for ABC Corp", detail: "Venue · ABC Corp" },
                          { time: "14:00", title: "Venue Walkthrough for XYZ Org", detail: "Site Visit" },
                          { time: "16:30", title: "Catering Review", detail: "TOQUE REAL Kitchen" },
                        ].map((evt, idx) => (
                          <div key={idx} className="p-2.5 bg-white/5 border-l-4 border-[#d49d50] rounded-r-lg text-xs space-y-0.5">
                            <strong className="block text-white font-mono">{evt.time} — {evt.title}</strong>
                            <small className="block text-[#858fa0]">{evt.detail}</small>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Role-Specific Quick Actions (Col 5) */}
                  <div className="lg:col-span-5 p-5 bg-gradient-to-br from-[#0b1220] to-[#070c15] border border-[#202a3a] rounded-xl space-y-4 shadow-xl">
                    <div className="border-b border-[#202838] pb-3">
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <span>⚡</span> Role-Specific Quick Actions
                      </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                      {[
                        { label: "＋ Create New Task", msg: "Create New Task modal opened" },
                        { label: "⌕ Assigned Events", msg: "View My Assigned Events opened" },
                        { label: "✉ Check Messages", msg: "Internal Chat Inbox opened" },
                        { label: "🤝 Connect Vendor", msg: "Vendor Directory opened" },
                        { label: "📷 Submit Media", msg: "Media Submission workspace opened" },
                        { label: "📦 Inventory Check", msg: "Inventory Check workspace opened" },
                      ].map((act, i) => (
                        <button
                          key={i}
                          onClick={() => showToast(act.msg)}
                          className="p-3 border border-[#6d522f] bg-gradient-to-b from-[#3a2b1b] to-[#241a10] text-[#f5ead6] hover:text-white rounded-lg text-left transition-all hover:border-[#d4ad6a] cursor-pointer shadow"
                        >
                          {act.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tasks & Deadlines Ledger Table */}
                <div className="p-5 bg-gradient-to-br from-[#0b1220] to-[#070c15] border border-[#202a3a] rounded-xl space-y-4 shadow-xl">
                  <div className="flex justify-between items-center border-b border-[#202838] pb-3">
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <span>☑</span> My Upcoming Tasks & Deadlines
                    </h2>
                    <button onClick={() => setActivePage("tasks")} className="text-xs font-bold text-[#d3aa68] hover:underline cursor-pointer">
                      View All →
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans">
                      <thead>
                        <tr className="bg-[#101827] text-[#8993a5] uppercase text-[10px] font-mono tracking-wider border-b border-[#202838]">
                          <th className="p-3">Status</th>
                          <th className="p-3">Task Description</th>
                          <th className="p-3">Due Date</th>
                          <th className="p-3">Associated Event</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#202838] text-[#d4dae3]">
                        {tasksList.map((t) => (
                          <tr key={t.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-3 w-12">
                              <input
                                type="checkbox"
                                checked={t.done}
                                onChange={() => toggleTask(t.id)}
                                className="h-4 w-4 accent-[#d49d50] cursor-pointer"
                              />
                            </td>
                            <td className={cn("p-3 font-semibold", t.done && "line-through text-[#858fa0]")}>
                              {t.text}
                            </td>
                            <td className="p-3 font-mono text-[#d3aa68] font-bold">{t.due}</td>
                            <td className="p-3"><span className="px-2 py-0.5 bg-[#121b2b] border border-[#394356] rounded text-[10px]">{t.event}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Event Alerts & CEO Decision Center Row */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Event Alerts */}
                  <div className="p-5 bg-gradient-to-br from-[#0b1220] to-[#070c15] border border-[#202a3a] rounded-xl space-y-3 shadow-xl">
                    <div className="flex justify-between items-center border-b border-[#202838] pb-3">
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <span>🔔</span> Event-Specific Alerts
                      </h2>
                      <span className="text-xs text-[#d3aa68] font-bold cursor-pointer">Visit →</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-3 bg-[#070c15] border-l-4 border-amber-500 border border-[#263144] rounded-r-lg text-white">
                        ⚠ Decor change request for Gala Night
                      </div>
                      <div className="p-3 bg-[#070c15] border-l-4 border-emerald-500 border border-[#263144] rounded-r-lg text-emerald-400 font-bold">
                        ✅ Catering confirmed for Conference
                      </div>
                      <div className="p-3 bg-[#070c15] border-l-4 border-amber-500 border border-[#263144] rounded-r-lg text-white">
                        📎 New attachment added to Logistics Plan
                      </div>
                    </div>
                  </div>

                  {/* CEO Decision Center */}
                  <div className="p-5 bg-gradient-to-br from-[#0b1220] to-[#070c15] border border-[#202a3a] rounded-xl space-y-3 shadow-xl">
                    <div className="flex justify-between items-center border-b border-[#202838] pb-3">
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <span>👑</span> CEO Decision Center
                      </h2>
                      <span className="text-xs text-[#d3aa68] font-bold cursor-pointer">View All →</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-3 bg-[#070c15] border-l-4 border-amber-500 border border-[#263144] rounded-r-lg text-white">
                        💼 KES 350,000 — Executive Approval Request
                      </div>
                      <div className="p-3 bg-[#070c15] border-l-4 border-amber-500 border border-[#263144] rounded-r-lg text-white">
                        ▣ Event scope update — XYZ Org
                      </div>
                      <div className="p-3 bg-[#070c15] border-l-4 border-emerald-500 border border-[#263144] rounded-r-lg text-emerald-400 font-bold">
                        ✓ Task completed — Event setup verified
                      </div>
                    </div>

                    <div className="mt-4 p-4 border border-[#202838] rounded-xl text-center font-serif italic text-sm text-[#d8c4a1]">
                      “Individual commitment to a group effort — that is what makes a team work.”
                      <small className="block text-xs text-[#858fa0] not-italic font-sans mt-1">— Vince Lombardi</small>
                    </div>
                  </div>
                </div>

                <div className="p-5 border border-[#202838] bg-[#070c15] rounded-xl text-center font-serif text-base text-[#d8c4a1]">
                  Your operational contributions make extraordinary events happen.
                </div>
              </div>
            )}

            {/* VIEW 2: DYNAMIC DEPARTMENT WORKSPACE MODULE */}
            {activePage !== "overview" && departmentData[activePage] && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#202838] pb-6">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      {departmentData[activePage][0]}
                    </h1>
                    <p className="text-xs text-[#929bab] mt-1 font-medium">
                      {departmentData[activePage][1]}
                    </p>
                  </div>

                  <button
                    onClick={() => showToast(`New record created in ${departmentData[activePage][0]}`)}
                    className="px-4 py-2.5 border border-[#6d522f] bg-gradient-to-b from-[#3a2b1b] to-[#241a10] text-[#f5ead6] hover:text-white text-xs font-bold rounded-lg transition-all shadow-md cursor-pointer hover:border-[#d4ad6a] shrink-0"
                  >
                    ＋ New Record
                  </button>
                </div>

                {/* Department Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  <div className="p-4 bg-gradient-to-br from-[#0b1220] to-[#070c15] border border-[#202a3a] rounded-xl space-y-1 shadow-lg">
                    <h3 className="text-xs font-semibold text-[#d4dae3]">Active Items</h3>
                    <div className="text-2xl sm:text-3xl font-bold text-white font-mono">18</div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-[#0b1220] to-[#070c15] border border-[#202a3a] rounded-xl space-y-1 shadow-lg">
                    <h3 className="text-xs font-semibold text-[#d4dae3]">Pending Tasks</h3>
                    <div className="text-2xl sm:text-3xl font-bold text-white font-mono">6</div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-[#0b1220] to-[#070c15] border border-[#202a3a] rounded-xl space-y-1 shadow-lg">
                    <h3 className="text-xs font-semibold text-[#d4dae3]">Due Today</h3>
                    <div className="text-2xl sm:text-3xl font-bold text-white font-mono">3</div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-[#0b1220] to-[#070c15] border border-[#202a3a] rounded-xl space-y-1 shadow-lg">
                    <h3 className="text-xs font-semibold text-[#d4dae3]">Alerts</h3>
                    <div className="text-2xl sm:text-3xl font-bold text-rose-500 font-mono">1</div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-[#0b1220] to-[#070c15] border border-[#202a3a] rounded-xl space-y-1 shadow-lg">
                    <h3 className="text-xs font-semibold text-[#d4dae3]">Completed</h3>
                    <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono">42</div>
                  </div>
                </div>

                {/* Sub-Workspaces Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {departmentData[activePage][2].map((sub, i) => (
                    <div
                      key={i}
                      className="p-5 bg-gradient-to-br from-[#0b1220] to-[#070c15] border border-[#202a3a] hover:border-[#d4ad6a]/60 rounded-xl space-y-3 shadow-xl transition-all"
                    >
                      <div className="text-2xl font-mono text-[#d3aa68]">
                        {["▣", "✓", "◈", "⌂", "▤", "◉"][i % 6]}
                      </div>
                      <h3 className="text-base font-bold text-white">{sub}</h3>
                      <p className="text-xs text-[#8993a4] leading-relaxed">
                        Open and manage {sub.toLowerCase()} for your assigned TOQUE REAL EVENTS LIMITED role.
                      </p>
                      <button
                        onClick={() => showToast(`✓ ${sub} workspace opened`)}
                        className="px-3.5 py-2 border border-[#6d522f] bg-gradient-to-b from-[#3a2b1b] to-[#241a10] text-[#f5ead6] hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer hover:border-[#d4ad6a]"
                      >
                        Open workspace →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
