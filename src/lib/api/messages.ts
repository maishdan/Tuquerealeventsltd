import { supabase } from "../supabase";
import type { Message } from "../database.types";

export async function fetchUserMessages(userId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true }); // Ascending for chat history

  if (error) throw error;
  return (data ?? []) as Message[];
}

export async function sendMessage(userId: string, fromName: string, fromRole: string, body: string, subject?: string) {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      user_id: userId,
      from_name: fromName,
      from_role: fromRole,
      body,
      subject: subject || "Direct Message",
      read: false
    })
    .select()
    .single();

  if (error) throw error;
  return data as Message;
}

export async function markAsRead(messageId: string) {
  const { error } = await supabase
    .from("messages")
    .update({ read: true })
    .eq("id", messageId);

  if (error) throw error;
}
