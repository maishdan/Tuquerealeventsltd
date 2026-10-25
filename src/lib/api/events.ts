import { supabase } from "../supabase";
import type { EventRecord } from "../database.types";

export async function fetchAllEvents(): Promise<EventRecord[]> {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });

    if (error || !data) {
      return [];
    }
    return data as EventRecord[];
  } catch {
    return [];
  }
}

export async function fetchFeaturedEvents(): Promise<EventRecord[]> {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("featured", true)
      .order("event_date", { ascending: true });

    if (error || !data) {
      return [];
    }
    return data as EventRecord[];
  } catch {
    return [];
  }
}

export async function toggleEventFeatured(eventId: string, featured: boolean): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("events")
      .update({ featured })
      .eq("id", eventId);

    return !error;
  } catch {
    return false;
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
      return [];
    }
    return data as EventRecord[];
  } catch {
    return [];
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
      return null;
    }
    return data as EventRecord;
  } catch {
    return null;
  }
}

export async function createEvent(eventInput: Partial<EventRecord>): Promise<EventRecord> {
  try {
    const insertPayload: Record<string, any> = {
      name: eventInput.name || "Untitled Event",
      event_type: eventInput.event_type || "General",
      event_date: eventInput.event_date || new Date().toISOString().slice(0, 10),
      venue: eventInput.venue || "Nairobi Venue",
      budget: eventInput.budget ?? 0,
      status: eventInput.status || "upcoming",
      featured: eventInput.featured ?? false,
      description: eventInput.description || "Executive production by TOQUE REAL EVENTS LIMITED.",
      organizer_name: eventInput.organizer_name || "TOQUE REAL EVENTS LIMITED",
      organizer_email: eventInput.organizer_email || "realtoque0@gmail.com",
      organizer_phone: eventInput.organizer_phone || "+254795365334",
      poster_url: eventInput.poster_url || "/back/e1.jfif",
    };

    if (eventInput.user_id) insertPayload.user_id = eventInput.user_id;
    if (eventInput.booking_id) insertPayload.booking_id = eventInput.booking_id;

    const { data, error } = await supabase
      .from("events")
      .insert([insertPayload])
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || "Error inserting event into database");
    }
    return data as EventRecord;
  } catch (err: any) {
    throw new Error(err?.message || "Failed to save event to database");
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
  try {
    const { data, error } = await supabase
      .from("events")
      .update(updates)
      .eq("id", eventId)
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || "Failed to update event in database");
    }
    return data as EventRecord;
  } catch (err: any) {
    throw new Error(err?.message || "Failed to update event");
  }
}

export async function deleteEvent(eventId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", eventId);

    return !error;
  } catch {
    return false;
  }
}
