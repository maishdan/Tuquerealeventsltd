import { supabase } from "../supabase";
import type { EventRecord } from "../database.types";

export async function fetchAllEvents() {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true });

  if (error) throw error;
  return (data ?? []) as EventRecord[];
}

export async function fetchUserEvents(userId: string) {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("user_id", userId)
    .order("event_date", { ascending: true });

  if (error) throw error;
  return (data ?? []) as EventRecord[];
}

export async function createEvent(event: Partial<EventRecord>) {
  const { data, error } = await supabase
    .from("events")
    .insert([event])
    .select()
    .single();

  if (error) throw error;
  return data as EventRecord;
}
