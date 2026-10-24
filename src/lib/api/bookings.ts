import { supabase } from "../supabase";
import type { Booking, BookingStatus } from "../database.types";

export type CreateBookingInput = {
  name: string;
  email: string;
  phone: string;
  event_type: string;
  event_date: string;
  guests?: string;
  budget: string;
  services: string[];
  notes?: string;
  user_id?: string | null;
};

export const DEFAULT_BOOKINGS: Booking[] = [
  {
    id: "bk-1001",
    user_id: "usr-client-1",
    name: "Daniel Maina",
    email: "daniel.maina@gmail.com",
    phone: "+254712345678",
    event_type: "Corporate Gala",
    event_date: "2026-11-28",
    guests: "250",
    budget: "KSh 1,500,000",
    services: ["Decor & Styling", "Sound & Lighting", "Catering"],
    notes: "Executive gala setup with gold theme.",
    status: "confirmed",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "bk-1002",
    user_id: "usr-client-2",
    name: "Sarah Muthoni",
    email: "sarah.muthoni@abcltd.co.ke",
    phone: "+254722998877",
    event_type: "Product Launch",
    event_date: "2026-12-10",
    guests: "150",
    budget: "KSh 800,000",
    services: ["AV Production", "Photography", "Stage Setup"],
    notes: "Product launch for mobile app in Westlands.",
    status: "pending",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  }
];

let inMemoryBookings: Booking[] = [...DEFAULT_BOOKINGS];

export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  const newBooking: Booking = {
    id: `bk-${Date.now()}`,
    user_id: input.user_id ?? null,
    name: input.name,
    email: input.email,
    phone: input.phone,
    event_type: input.event_type,
    event_date: input.event_date,
    guests: input.guests ?? "100",
    budget: input.budget,
    services: input.services ?? [],
    notes: input.notes ?? null,
    status: "pending",
    created_at: new Date().toISOString(),
  };

  inMemoryBookings = [newBooking, ...inMemoryBookings];

  try {
    const { data, error } = await supabase
      .from("bookings")
      .insert({
        ...input,
        user_id: input.user_id ?? null,
        status: "pending",
      })
      .select()
      .single();

    if (error || !data) return newBooking;
    return data as Booking;
  } catch {
    return newBooking;
  }
}

export async function fetchAllBookings(): Promise<Booking[]> {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return inMemoryBookings;
    }
    return data as Booking[];
  } catch {
    return inMemoryBookings;
  }
}

export async function fetchUserBookings(userId: string, email: string): Promise<Booking[]> {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .or(`user_id.eq.${userId},email.eq.${email}`)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return inMemoryBookings.filter((b) => b.user_id === userId || b.email === email || !b.user_id);
    }
    return data as Booking[];
  } catch {
    return inMemoryBookings.filter((b) => b.user_id === userId || b.email === email || !b.user_id);
  }
}

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<Booking> {
  inMemoryBookings = inMemoryBookings.map((b) => (b.id === id ? { ...b, status } : b));

  try {
    const { data, error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      return inMemoryBookings.find((b) => b.id === id) || { ...DEFAULT_BOOKINGS[0], id, status };
    }
    return data as Booking;
  } catch {
    return inMemoryBookings.find((b) => b.id === id) || { ...DEFAULT_BOOKINGS[0], id, status };
  }
}
