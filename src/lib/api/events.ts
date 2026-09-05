import { supabase } from "../supabase";
import type { EventRecord, TicketClass } from "../database.types";

const defaultSampleEvents: EventRecord[] = [
  {
    id: "evt-kisii-tech-2026",
    user_id: null,
    booking_id: null,
    name: "Kisii University Tech & Innovation Summit 2026",
    event_type: "Technology",
    event_date: "2026-09-20",
    venue: "Kisii University Main Auditorium, Kenya",
    budget: 1500000,
    status: "upcoming",
    lifecycle_state: "PUBLISHED",
    description: "East Africa's premier technology, cybersecurity, and AI summit bringing together 1,000+ tech leaders, students, and corporate innovators.",
    organizer_name: "Kisii University Science & Computer Ass. (KUSCA)",
    organizer_email: "techsummit@kisii.ac.ke",
    organizer_phone: "+254795365334",
    start_time: "08:00 AM",
    end_time: "06:00 PM",
    poster_url: "/back/e1.jfif",
    team_count: 24,
    vendor_count: 8,
    created_at: new Date().toISOString(),
    ticket_classes: [
      {
        id: "tc-ku-reg",
        name: "Regular",
        description: "General summit admission & exhibition access",
        price: 500,
        quantity_available: 500,
        quantity_sold: 140,
        benefits: ["Main Auditorium Access", "Exhibition Floor", "Digital Certificate"],
      },
      {
        id: "tc-ku-vip",
        name: "VIP",
        description: "Priority entrance, VIP seating & networking lunch",
        price: 1500,
        quantity_available: 100,
        quantity_sold: 45,
        benefits: ["Priority Fast-Track Entrance", "Front Reserved VIP Seating", "Conference Materials & Swag", "VIP Executive Lunch & Refreshments"],
      },
      {
        id: "tc-ku-vvip",
        name: "VVIP",
        description: "Front-row lounge access, speaker dinner & certificate",
        price: 3000,
        quantity_available: 30,
        quantity_sold: 18,
        benefits: ["Front-Row VVIP Recliner Seating", "Private VVIP Executive Lounge", "Exclusive Speaker Meet & Greet Dinner", "Printed Plaque & Physical Certificate"],
      },
    ],
  },
  {
    id: "evt-royal-gala-2026",
    user_id: null,
    booking_id: null,
    name: "Royal Touch Gala Night & High Production Launch",
    event_type: "Corporate Gala",
    event_date: "2026-10-15",
    venue: "Sarit Centre Expo Hall, Nairobi",
    budget: 3500000,
    status: "upcoming",
    lifecycle_state: "PUBLISHED",
    description: "An elite red-carpet evening showcasing luxury staging, high-definition 4K AV arrays, and live orchestral entertainment.",
    organizer_name: "Royal Touch Executive Board",
    organizer_email: "eventsroyaltouch7@gmail.com",
    organizer_phone: "+254795365334",
    start_time: "06:00 PM",
    end_time: "11:30 PM",
    poster_url: "/back/e2.jfif",
    team_count: 36,
    vendor_count: 14,
    created_at: new Date().toISOString(),
    ticket_classes: [
      {
        id: "tc-rg-ga",
        name: "Regular",
        description: "Standard gala seat & cocktail reception",
        price: 3500,
        quantity_available: 300,
        quantity_sold: 80,
        benefits: ["Gala Seating Area", "Red Carpet Arrival", "Welcome Champagne"],
      },
      {
        id: "tc-rg-vip",
        name: "VIP",
        description: "Reserved VIP table & 3-course dinner",
        price: 10000,
        quantity_available: 80,
        quantity_sold: 32,
        benefits: ["VIP Stage Front Table", "3-Course Gourmet Dinner", "Premium Bar Service", "Complimentary Valet Parking"],
      },
      {
        id: "tc-rg-vvip",
        name: "VVIP",
        description: "Exclusive VVIP box, private concierge & luxury gift hamper",
        price: 25000,
        quantity_available: 20,
        quantity_sold: 12,
        benefits: ["Private VVIP Elevated Lounge Box", "Personal Concierge Service", "Exclusive Premium Champagne Bar", "Luxury Executive Gift Hamper"],
      },
    ],
  },
];

let inMemoryEvents: EventRecord[] = [...defaultSampleEvents];

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
      return inMemoryEvents.filter((e) => e.user_id === userId);
    }
    return data as EventRecord[];
  } catch {
    return inMemoryEvents.filter((e) => e.user_id === userId);
  }
}

export async function createEvent(eventInput: Partial<EventRecord>): Promise<EventRecord> {
  const newEvt: EventRecord = {
    id: `evt-${Date.now()}`,
    user_id: eventInput.user_id ?? null,
    booking_id: eventInput.booking_id ?? null,
    name: eventInput.name || "Untitled Event",
    event_type: eventInput.event_type || "General",
    event_date: eventInput.event_date || "2026-10-01",
    venue: eventInput.venue || "Nairobi Venue",
    budget: eventInput.budget ?? 500000,
    status: eventInput.status || "upcoming",
    lifecycle_state: eventInput.lifecycle_state || "PUBLISHED",
    description: eventInput.description || "Executive production by Royal Touch Events.",
    organizer_name: eventInput.organizer_name || "Royal Touch Events",
    organizer_email: eventInput.organizer_email || "eventsroyaltouch7@gmail.com",
    organizer_phone: eventInput.organizer_phone || "+254795365334",
    start_time: eventInput.start_time || "08:00 AM",
    end_time: eventInput.end_time || "06:00 PM",
    poster_url: eventInput.poster_url || "/back/e3.jfif",
    ticket_classes: eventInput.ticket_classes || [
      { id: `tc-${Date.now()}-1`, name: "Regular", description: "General admission", price: 500, quantity_available: 200, quantity_sold: 0, benefits: ["General Entry"] },
      { id: `tc-${Date.now()}-2`, name: "VIP", description: "Priority VIP admission", price: 1500, quantity_available: 50, quantity_sold: 0, benefits: ["Priority Entry", "VIP Seating"] }
    ],
    team_count: 12,
    vendor_count: 4,
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

    if (error) return true;
    return true;
  } catch {
    return true;
  }
}
