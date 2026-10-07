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

let inMemoryTickets: Ticket[] = [];

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

    if (error || !data) {
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

    if (error || !data) {
      return inMemoryTickets.filter((t) => (userId && t.user_id === userId) || (email && t.holder_email === email));
    }
    return data as Ticket[];
  } catch {
    return inMemoryTickets.filter((t) => (userId && t.user_id === userId) || (email && t.holder_email === email));
  }
}

export async function createTicket(input: CreateTicketInput): Promise<Ticket> {
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
    seat_number: input.seat_number ?? "01",
    payment_status: "SUCCESS",
    event_date: input.event_date ?? new Date().toISOString().slice(0, 10),
    venue: input.venue ?? "Nairobi Venue",
    created_at: new Date().toISOString(),
    used_at: null,
  };

  inMemoryTickets = [newTicket, ...inMemoryTickets];

  try {
    const { id: _omitId, created_at: _omitCreated, ...insertPayload } = newTicket;
    const { data, error } = await supabase
      .from("tickets")
      .insert([insertPayload])
      .select()
      .single();

    if (error || !data) {
      if (error) console.warn("[tickets] insert failed, kept locally:", error.message);
      return newTicket;
    }
    inMemoryTickets = inMemoryTickets.filter((t) => t.id !== newTicket.id);
    return data as Ticket;
  } catch {
    return newTicket;
  }
}

export async function updateTicketStatus(ticketId: string, status: TicketStatus): Promise<boolean> {
  inMemoryTickets = inMemoryTickets.map((t) => {
    if (t.id === ticketId) {
      return {
        ...t,
        status,
        used_at: status === "used" ? new Date().toISOString() : t.used_at,
      };
    }
    return t;
  });

  try {
    const updates: Partial<Ticket> = { status };
    if (status === "used") {
      updates.used_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("tickets")
      .update(updates)
      .eq("id", ticketId);

    return !error;
  } catch {
    return true;
  }
}
