import { supabase } from "../supabase";
import type { Ticket, TicketStatus, TicketTier } from "../database.types";

export type CreateTicketInput = {
  user_id?: string | null;
  booking_id?: string | null;
  event_id?: string | null;
  event_name: string;
  holder_name: string;
  holder_email: string;
  ticket_tier: TicketTier;
  price: number;
  seat_number?: string | null;
  event_date?: string | null;
  venue?: string | null;
};

const mockTickets: Ticket[] = [
  {
    id: "tck-001",
    user_id: null,
    booking_id: "bk-sample-1",
    event_id: null,
    event_name: "Gala Night & High Production Launch",
    holder_name: "Alexander Vance",
    holder_email: "vance@royaltouch.com",
    ticket_tier: "VVIP",
    price: 25000,
    status: "valid",
    ticket_code: "TCK-VVIP-9021",
    ticket_token: "TKT-TOKEN-9021-VVIP",
    seat_number: "01",
    payment_status: "SUCCESS",
    event_date: "2026-09-20",
    venue: "Sarit Centre Expo Hall",
    created_at: new Date().toISOString(),
    used_at: null,
  },
  {
    id: "tck-002",
    user_id: null,
    booking_id: "bk-sample-2",
    event_id: null,
    event_name: "Corporate Leadership Summit 2026",
    holder_name: "Sophia Martinez",
    holder_email: "sophia@techglobal.io",
    ticket_tier: "VIP",
    price: 12000,
    status: "valid",
    ticket_code: "TCK-VIP-4412",
    ticket_token: "TKT-TOKEN-4412-VIP",
    seat_number: "05",
    payment_status: "SUCCESS",
    event_date: "2026-10-05",
    venue: "Villa Rosa Kempinski",
    created_at: new Date().toISOString(),
    used_at: null,
  },
  {
    id: "tck-003",
    user_id: null,
    booking_id: null,
    event_id: null,
    event_name: "Royal Sound Concert & Cultural Expo",
    holder_name: "Daniel West",
    holder_email: "daniwest@outlook.com",
    ticket_tier: "General Access",
    price: 3500,
    status: "used",
    ticket_code: "TCK-GEN-1089",
    ticket_token: "TKT-TOKEN-1089-GEN",
    seat_number: "12",
    payment_status: "SUCCESS",
    event_date: "2026-08-15",
    venue: "Nairobi Arboretum Grounds",
    created_at: new Date().toISOString(),
    used_at: "2026-08-15T18:30:00.000Z",
  },
];

let inMemoryTickets: Ticket[] = [...mockTickets];

function generateTicketCode(tier: TicketTier): { code: string; token: string } {
  const prefix = tier === "VVIP" ? "VVIP" : tier === "VIP" ? "VIP" : tier === "Early Bird" ? "EBD" : "GEN";
  const num = Math.floor(1000 + Math.random() * 9000);
  const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
  return {
    code: `TCK-${prefix}-${num}`,
    token: `TKT-${randomHex}-${num}`,
  };
}

export async function fetchAllTickets(): Promise<Ticket[]> {
  try {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return inMemoryTickets;
    }
    return data as Ticket[];
  } catch {
    return inMemoryTickets;
  }
}

export async function fetchUserTickets(userId?: string, email?: string): Promise<Ticket[]> {
  try {
    let query = supabase.from("tickets").select("*");
    if (userId && email) {
      query = query.or(`user_id.eq.${userId},holder_email.eq.${email}`);
    } else if (userId) {
      query = query.eq("user_id", userId);
    } else if (email) {
      query = query.eq("holder_email", email);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      if (email) {
        return inMemoryTickets.filter((t) => t.holder_email.toLowerCase() === email.toLowerCase());
      }
      return inMemoryTickets;
    }
    return data as Ticket[];
  } catch {
    if (email) {
      return inMemoryTickets.filter((t) => t.holder_email.toLowerCase() === email.toLowerCase());
    }
    return inMemoryTickets;
  }
}

export async function issueTicket(input: CreateTicketInput): Promise<Ticket> {
  const { code, token } = generateTicketCode(input.ticket_tier);
  const newTicket: Ticket = {
    id: `tck-${Date.now()}`,
    user_id: input.user_id ?? null,
    booking_id: input.booking_id ?? null,
    event_id: input.event_id ?? null,
    event_name: input.event_name,
    holder_name: input.holder_name,
    holder_email: input.holder_email,
    ticket_tier: input.ticket_tier,
    price: input.price,
    status: "valid",
    ticket_code: code,
    ticket_token: token,
    seat_number: input.seat_number ?? null,
    payment_status: "SUCCESS",
    event_date: input.event_date ?? "TBD",
    venue: input.venue ?? "Nairobi Venue",
    created_at: new Date().toISOString(),
    used_at: null,
  };

  try {
    const { data, error } = await supabase
      .from("tickets")
      .insert({
        user_id: newTicket.user_id,
        booking_id: newTicket.booking_id,
        event_id: newTicket.event_id,
        event_name: newTicket.event_name,
        holder_name: newTicket.holder_name,
        holder_email: newTicket.holder_email,
        ticket_tier: newTicket.ticket_tier,
        price: newTicket.price,
        status: newTicket.status,
        ticket_code: newTicket.ticket_code,
        ticket_token: newTicket.ticket_token,
        seat_number: newTicket.seat_number,
        payment_status: newTicket.payment_status,
        event_date: newTicket.event_date,
        venue: newTicket.venue,
      })
      .select()
      .single();

    if (error || !data) {
      inMemoryTickets = [newTicket, ...inMemoryTickets];
      return newTicket;
    }
    return data as Ticket;
  } catch {
    inMemoryTickets = [newTicket, ...inMemoryTickets];
    return newTicket;
  }
}

export type ScanVerificationResult = {
  result: "VALID" | "ALREADY_USED" | "CANCELLED" | "NOT_FOUND";
  ticket?: Ticket;
  message: string;
  scannedAt?: string;
};

export async function verifyAndScanTicket(queryToken: string): Promise<ScanVerificationResult> {
  const query = queryToken.trim().toUpperCase();

  const ticket = inMemoryTickets.find(
    (t) =>
      t.ticket_code.toUpperCase() === query ||
      (t.ticket_token && t.ticket_token.toUpperCase() === query) ||
      t.id.toUpperCase() === query
  );

  if (!ticket) {
    return {
      result: "NOT_FOUND",
      message: `Invalid Ticket: Code or Token "${queryToken}" not found in system registry.`,
    };
  }

  if (ticket.status === "cancelled") {
    return {
      result: "CANCELLED",
      ticket,
      message: `Ticket Cancelled: This pass (${ticket.ticket_code}) has been revoked/cancelled.`,
    };
  }

  if (ticket.status === "used") {
    return {
      result: "ALREADY_USED",
      ticket,
      message: `Duplicate Scan Warning! Ticket (${ticket.ticket_code}) was ALREADY CHECKED-IN on ${
        ticket.used_at ? new Date(ticket.used_at).toLocaleTimeString() : "earlier scan"
      }. Entry denied.`,
      scannedAt: ticket.used_at || undefined,
    };
  }

  // Atomic state change to USED
  const usedAt = new Date().toISOString();
  ticket.status = "used";
  ticket.used_at = usedAt;

  inMemoryTickets = inMemoryTickets.map((t) => (t.id === ticket.id ? ticket : t));

  return {
    result: "VALID",
    ticket,
    message: `Gate Access Granted! Welcome ${ticket.holder_name} (${ticket.ticket_tier} Pass - Seat ${
      ticket.seat_number || "GA"
    }).`,
    scannedAt: usedAt,
  };
}

export async function updateTicketStatus(id: string, status: TicketStatus): Promise<Ticket> {
  try {
    const { data, error } = await supabase
      .from("tickets")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      inMemoryTickets = inMemoryTickets.map((t) => (t.id === id ? { ...t, status } : t));
      const found = inMemoryTickets.find((t) => t.id === id);
      if (!found) throw new Error("Ticket not found");
      return found;
    }
    return data as Ticket;
  } catch {
    inMemoryTickets = inMemoryTickets.map((t) => (t.id === id ? { ...t, status } : t));
    const found = inMemoryTickets.find((t) => t.id === id);
    if (!found) throw new Error("Ticket not found");
    return found;
  }
}
