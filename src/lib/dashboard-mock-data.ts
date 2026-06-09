export const executiveKpis = {
  todayRevenue: 284_500,
  monthlyRevenue: 4_820_000,
  activeEvents: 12,
  totalClients: 486,
  totalRevenue: 28_400_000,
  netProfit: 6_120_000,
  eventsThisMonth: 18,
  clientRetention: 94,
  newContracts: 7,
  avgEventValue: 385_000,
};

export const eventCategories = [
  { name: "Weddings", count: 142, revenue: 8_200_000, growth: 12 },
  { name: "Corporate Events", count: 98, revenue: 6_400_000, growth: 8 },
  { name: "Conferences", count: 64, revenue: 4_100_000, growth: 15 },
  { name: "Concerts", count: 38, revenue: 5_600_000, growth: 22 },
  { name: "Private Parties", count: 86, revenue: 2_900_000, growth: 6 },
];

export const liveEvents = [
  { id: 1, name: "Equity Bank Annual Gala", type: "Corporate", status: "in-progress", venue: "KICC, Nairobi", team: 24, vendors: 8 },
  { id: 2, name: "Naivasha Garden Wedding", type: "Wedding", status: "upcoming", venue: "Lake Naivasha Resort", team: 18, vendors: 12 },
  { id: 3, name: "Afro-Beats Night Live", type: "Concert", status: "in-progress", venue: "Carnivore Grounds", team: 42, vendors: 15 },
  { id: 4, name: "Tech Summit 2026", type: "Conference", status: "delayed", venue: "Radisson Blu", team: 16, vendors: 6 },
  { id: 5, name: "Amara & Joel Reception", type: "Wedding", status: "completed", venue: "Karen Country Club", team: 14, vendors: 10 },
  { id: 6, name: "Brand Launch — Indigo", type: "Corporate", status: "upcoming", venue: "Two Rivers Mall", team: 12, vendors: 5 },
];

export const operations = {
  staff: { total: 48, onDuty: 36, available: 12 },
  vehicles: { total: 8, active: 5, maintenance: 1 },
  inventory: { healthy: 78, low: 14, critical: 3 },
  vendors: { active: 42, pending: 6, overdue: 2 },
};

export const financialHub = {
  cashFlow: 2_140_000,
  expenses: 1_680_000,
  outstandingInvoices: 890_000,
  profitMargin: 28.4,
  monthlyData: [
    { month: "Jan", revenue: 3_200_000, expenses: 2_400_000 },
    { month: "Feb", revenue: 3_800_000, expenses: 2_600_000 },
    { month: "Mar", revenue: 4_100_000, expenses: 2_800_000 },
    { month: "Apr", revenue: 4_820_000, expenses: 3_100_000 },
  ],
};

export const ceoInsights = {
  topTeam: "Production Crew Alpha",
  topClient: "Equity Bank Kenya",
  topEventType: "Corporate Events",
  growthOpportunity: "Expand concert production across East Africa",
};

export const aiInsights = {
  predictedRevenue: 5_400_000,
  successForecast: 92,
  highRiskEvents: 2,
  pricingSuggestion: "Increase wedding premium packages by 8%",
  topServices: ["Sound & Lighting", "Full Planning", "Corporate Production"],
};

export const teamPerformance = [
  { name: "Brian Ouma", role: "Head of Production", score: 98, events: 24 },
  { name: "Aisha Hassan", role: "Lead Planner", score: 96, events: 31 },
  { name: "David Mwangi", role: "Technical Director", score: 94, events: 18 },
  { name: "Wanjiru Karanja", role: "Creative Director", score: 92, events: 22 },
];

export const topClients = [
  { name: "Equity Bank", value: 2_400_000, events: 6 },
  { name: "Safaricom", value: 1_800_000, events: 4 },
  { name: "Amara & Joel", value: 680_000, events: 1 },
  { name: "Sauti Sol", value: 1_200_000, events: 3 },
];

export const customerEvents = [
  { id: 1, name: "Garden Wedding Reception", date: "Apr 18, 2026", status: "confirmed", type: "Wedding", budget: "$45,000" },
  { id: 2, name: "Corporate Anniversary", date: "May 02, 2026", status: "planning", type: "Corporate", budget: "$28,000" },
  { id: 3, name: "Birthday Soirée", date: "Jun 14, 2026", status: "inquiry", type: "Private Party", budget: "$12,000" },
];

export const customerBookings = [
  { id: "BK-2041", event: "Garden Wedding Reception", date: "Apr 18, 2026", amount: "$45,000", status: "confirmed" },
  { id: "BK-2088", event: "Corporate Anniversary", date: "May 02, 2026", amount: "$28,000", status: "pending" },
];

export function formatKes(value: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number) {
  return `${value}%`;
}
