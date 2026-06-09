import { supabase } from "../supabase";
import type { Message } from "../database.types";

export async function fetchUserMessages(userId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Message[];
}
