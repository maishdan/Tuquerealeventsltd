import { supabase } from "../supabase";
import type { EventRecord } from "../database.types";

export const DEFAULT_EVENTS: EventRecord[] = [
  {
    id: "evt-101",
    user_id: "usr-admin-1",
    booking_id: "bk-1001",
    name: "Nairobi Tech & AI Summit 2026",
    event_type: "Technology",
    event_date: "2026-11-15",
    venue: "KICC Grand Ballroom, Nairobi",
    budget: 2500000,
    status: "upcoming",
    lifecycle_state: "PUBLISHED",
    description: "East Africa's premier technology and AI innovation summit hosted by Royal Touch Events.",
    organizer_name: "Royal Touch Events",
    organizer_email: "eventsroyaltouch7@gmail.com",
    organizer_phone: "+254795365334",
    start_time: "08:00 AM",
    end_time: "06:00 PM",
    poster_url: "/back/e1.jfif",
    ticket_classes: [
      { id: "tc-1", name: "Regular", description: "General Entry & Expo Pass", price: 1500, quantity_available: 500, quantity_sold: 120, benefits: ["General Entry", "Exhibitor Hall"] },
      { id: "tc-2", name: "VIP", description: "VIP Lounge & Speaker Networking", price: 5000, quantity_available: 100, quantity_sold: 45, benefits: ["VIP Lounge", "Lunch & Networking"] }
    ],
    team_count: 12,
    vendor_count: 6,
    created_at: new Date().toISOString(),
  },
  {
    id: "evt-102",
    user_id: "usr-admin-1",
    booking_id: "bk-1002",
    name: "Royal Platinum Corporate Gala",
    event_type: "Corporate Gala",
    event_date: "2026-12-05",
    venue: "Villa Rosa Kempinski, Nairobi",
    budget: 5000000,
    status: "upcoming",
    lifecycle_state: "PUBLISHED",
    description: "An exclusive black-tie networking gala celebrating corporate excellence.",
    organizer_name: "Royal Touch Events",
    organizer_email: "eventsroyaltouch7@gmail.com",
    organizer_phone: "+254795365334",
    start_time: "06:00 PM",
    end_time: "11:30 PM",
    poster_url: "/back/e2.jfif",
    ticket_classes: [
      { id: "tc-3", name: "VIP Table", description: "Reserved VIP Table for 10", price: 35000, quantity_available: 20, quantity_sold: 8, benefits: ["3-Course Dinner", "Champagne Service"] }
    ],
    team_count: 20,
    vendor_count: 10,
    created_at: new Date().toISOString(),
  },
  {
    id: "evt-103",
    user_id: "usr-admin-1",
    booking_id: "bk-1003",
    name: "Afro Beats & Fusion Concert",
    event_type: "Concert Production",
    event_date: "2026-12-20",
    venue: "Carnivore Grounds, Nairobi",
    budget: 8000000,
    status: "upcoming",
    lifecycle_state: "PUBLISHED",
    description: "High-energy live music festival featuring top regional and international artists.",
    organizer_name: "Royal Touch Events",
    organizer_email: "eventsroyaltouch7@gmail.com",
    organizer_phone: "+254795365334",
    start_time: "03:00 PM",
    end_time: "04:00 AM",
    poster_url: "/back/e3.jfif",
    ticket_classes: [
      { id: "tc-4", name: "Regular Pass", description: "General Entry Pass", price: 2000, quantity_available: 2000, quantity_sold: 450, benefits: ["General Festival Entry"] },
      { id: "tc-5", name: "VVIP Pass", description: "Front Stage & All Access", price: 10000, quantity_available: 150, quantity_sold: 80, benefits: ["Front Stage Access", "VVIP Bar"] }
    ],
    team_count: 35,
    vendor_count: 15,
    created_at: new Date().toISOString(),
  }
];

let inMemoryEvents: EventRecord[] = [...DEFAULT_EVENTS];

export async function fetchAllEvents(): Promise<EventRecord[]> {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });

    if (error || !data || data.length === 0) {
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

    if (error || !data || data.length === 0) {
      return inMemoryEvents.filter((e) => e.user_id === userId || !e.user_id);
    }
    return data as EventRecord[];
  } catch {
    return inMemoryEvents.filter((e) => e.user_id === userId || !e.user_id);
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
      return inMemoryEvents.find((e) => e.id === eventId) || inMemoryEvents[0] || null;
    }
    return data as EventRecord;
  } catch {
    return inMemoryEvents.find((e) => e.id === eventId) || inMemoryEvents[0] || null;
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
    poster_url: eventInput.poster_url || "/back/e1.jfif",
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
      return newEvt;
    }
    return data as EventRecord;
  } catch {
    return newEvt;
  }
}

const POSTER_BUCKET = "event-posters";

export async function uploadEventPoster(file: File): Promise<string> {
  try {
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `events/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from(POSTER_BUCKET)
      .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });

    if (error) {
      return "/back/e1.jfif";
    }

    const { data } = supabase.storage.from(POSTER_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  } catch {
    return "/back/e1.jfif";
  }
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
