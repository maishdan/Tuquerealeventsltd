import { supabase } from "../supabase";
import type { Message } from "../database.types";

export const DEFAULT_MESSAGES: Message[] = [
  {
    id: "msg-101",
    user_id: "usr-client-1",
    from_name: "Japheth Owiyo (CEO)",
    from_role: "admin",
    subject: "Event Brief Confirmed",
    body: "Welcome to Royal Touch Events! Your event brief for Corporate Gala is approved.",
    read: false,
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "msg-102",
    user_id: "usr-client-1",
    from_name: "Royal Staff Lead",
    from_role: "staff",
    subject: "M-Pesa Payment Received",
    body: "Your gate pass for Nairobi Tech Summit has been issued with QR Code.",
    read: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  }
];

let inMemoryMessages: Message[] = [...DEFAULT_MESSAGES];

export async function fetchUserMessages(userId: string): Promise<Message[]> {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      return inMemoryMessages;
    }
    return data as Message[];
  } catch {
    return inMemoryMessages;
  }
}

export async function sendMessage(userId: string, fromName: string, fromRole: string, body: string, subject?: string): Promise<Message> {
  const newMsg: Message = {
    id: `msg-${Date.now()}`,
    user_id: userId,
    from_name: fromName,
    from_role: fromRole,
    body,
    subject: subject || "Direct Message",
    read: false,
    created_at: new Date().toISOString(),
  };

  inMemoryMessages = [...inMemoryMessages, newMsg];

  try {
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

    if (error || !data) return newMsg;
    return data as Message;
  } catch {
    return newMsg;
  }
}

export async function markAsRead(messageId: string): Promise<void> {
  inMemoryMessages = inMemoryMessages.map((m) => (m.id === messageId ? { ...m, read: true } : m));

  try {
    await supabase
      .from("messages")
      .update({ read: true })
      .eq("id", messageId);
  } catch {
    // Graceful offline update
  }
}
