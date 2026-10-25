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

let inMemoryBookings: Booking[] = [];

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

    if (error || !data) {
      return [];
    }
    return data as Booking[];
  } catch {
    return [];
  }
}

export async function fetchUserBookings(userId: string, email: string): Promise<Booking[]> {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .or(`user_id.eq.${userId},email.eq.${email}`)
      .order("created_at", { ascending: false });

    if (error || !data) {
      return [];
    }
    return data as Booking[];
  } catch {
    return [];
  }
}

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<Booking> {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      return { id, status } as any;
    }
    return data as Booking;
  } catch {
    return { id, status } as any;
  }
}
