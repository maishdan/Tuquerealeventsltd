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

export async function createBooking(input: CreateBookingInput) {
  const { data, error } = await supabase
    .from("bookings")
    .insert({
      ...input,
      user_id: input.user_id ?? null,
      status: "pending",
    })
    .select()
    .single();

  if (error) throw error;
  return data as Booking;
}

export async function fetchAllBookings() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Booking[];
}

export async function fetchUserBookings(userId: string, email: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .or(`user_id.eq.${userId},email.eq.${email}`)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Booking[];
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  const { data, error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Booking;
}
