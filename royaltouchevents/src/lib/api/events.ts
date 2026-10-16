import { supabase } from "../supabase";
import type { EventRecord, TicketClass } from "../database.types";

let inMemoryEvents: EventRecord[] = [];

export async function fetchAllEvents(): Promise<EventRecord[]> {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });

    if (error || !data) {
      return inMemoryEvents;
    }
    return data as EventRecord[];
  } catch {
    return inMemoryEvents;
  }
}

export async function fetchUserEvents(userId: string): Promise<EventRecord[]> {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("user_id", userId)
      .order("event_date", { ascending: true });

    if (error || !data) {
      return inMemoryEvents.filter((e) => e.user_id === userId);
    }
    return data as EventRecord[];
  } catch {
    return inMemoryEvents.filter((e) => e.user_id === userId);
  }
}

export async function fetchEventById(eventId: string): Promise<EventRecord | null> {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (error || !data) {
      return inMemoryEvents.find((e) => e.id === eventId) || null;
    }
    return data as EventRecord;
  } catch {
    return inMemoryEvents.find((e) => e.id === eventId) || null;
  }
}

export async function createEvent(eventInput: Partial<EventRecord>): Promise<EventRecord> {
  const newEvt: EventRecord = {
    id: `evt-${Date.now()}`,
    user_id: eventInput.user_id ?? null,
    booking_id: eventInput.booking_id ?? null,
    name: eventInput.name || "Untitled Event",
    event_type: eventInput.event_type || "General",
    event_date: eventInput.event_date || new Date().toISOString().slice(0, 10),
    venue: eventInput.venue || "Nairobi Venue",
    budget: eventInput.budget ?? 0,
    status: eventInput.status || "upcoming",
    lifecycle_state: eventInput.lifecycle_state || "PUBLISHED",
    description: eventInput.description || "Executive production by Royal Touch Events.",
    organizer_name: eventInput.organizer_name || "Royal Touch Events",
    organizer_email: eventInput.organizer_email || "eventsroyaltouch7@gmail.com",
    organizer_phone: eventInput.organizer_phone || "+254795365334",
    start_time: eventInput.start_time || "08:00 AM",
    end_time: eventInput.end_time || "06:00 PM",
    poster_url: eventInput.poster_url || "/placeholder-event.png",
    ticket_classes: eventInput.ticket_classes || [
      { id: `tc-${Date.now()}-1`, name: "Regular", description: "General admission", price: 500, quantity_available: 200, quantity_sold: 0, benefits: ["General Entry"] },
      { id: `tc-${Date.now()}-2`, name: "VIP", description: "Priority VIP admission", price: 1500, quantity_available: 50, quantity_sold: 0, benefits: ["Priority Entry", "VIP Seating"] }
    ],
    team_count: eventInput.team_count || 1,
    vendor_count: eventInput.vendor_count || 1,
    created_at: new Date().toISOString(),
  };

  inMemoryEvents = [newEvt, ...inMemoryEvents];

  try {
    const { id: _omitId, created_at: _omitCreated, ...insertPayload } = newEvt;
    const { data, error } = await supabase
      .from("events")
      .insert([insertPayload])
      .select()
      .single();

    if (error || !data) {
      if (error) console.warn("[events] insert failed, kept locally:", error.message);
      return newEvt;
    }
    inMemoryEvents = inMemoryEvents.filter((e) => e.id !== newEvt.id);
    return data as EventRecord;
  } catch {
    return newEvt;
  }
}

const POSTER_BUCKET = "event-posters";

export async function uploadEventPoster(file: File): Promise<string> {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `events/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from(POSTER_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(POSTER_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function updateEvent(eventId: string, updates: Partial<EventRecord>): Promise<EventRecord> {
  inMemoryEvents = inMemoryEvents.map((evt) => {
    if (evt.id === eventId) {
      return { ...evt, ...updates };
    }
    return evt;
  });

  try {
    const { data, error } = await supabase
      .from("events")
      .update(updates)
      .eq("id", eventId)
      .select()
      .single();

    if (error || !data) {
      return inMemoryEvents.find((e) => e.id === eventId)!;
    }
    return data as EventRecord;
  } catch {
    return inMemoryEvents.find((e) => e.id === eventId)!;
  }
}

export async function deleteEvent(eventId: string): Promise<boolean> {
  inMemoryEvents = inMemoryEvents.filter((evt) => evt.id !== eventId);

  try {
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", eventId);

    return !error;
  } catch {
    return true;
  }
}
