import { supabase } from "../supabase";
import type { ContactInquiry } from "../database.types";

export const DEFAULT_CONTACT_INQUIRIES: ContactInquiry[] = [
  {
    id: "ci-101",
    name: "Evelyn Wanjiku",
    email: "evelyn.wanjiku@gmail.com",
    message: "Inquiring about stadium audio setup and VIP staging for December concert.",
    status: "new",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: "ci-102",
    name: "Marcus Ochieng",
    email: "marcus.o@fintechkenya.co.ke",
    message: "Need proposal for 500-guest annual tech award ceremony.",
    status: "replied",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  }
];

let inMemoryContacts: ContactInquiry[] = [...DEFAULT_CONTACT_INQUIRIES];

export async function createContactInquiry(input: { name: string; email: string; message: string }): Promise<ContactInquiry> {
  const newInquiry: ContactInquiry = {
    id: `ci-${Date.now()}`,
    name: input.name,
    email: input.email,
    message: input.message,
    status: "new",
    created_at: new Date().toISOString(),
  };

  inMemoryContacts = [newInquiry, ...inMemoryContacts];

  try {
    const { data, error } = await supabase
      .from("contact_inquiries")
      .insert(input)
      .select()
      .single();

    if (error || !data) return newInquiry;
    return data as ContactInquiry;
  } catch {
    return newInquiry;
  }
}

export async function fetchContactInquiries(): Promise<ContactInquiry[]> {
  try {
    const { data, error } = await supabase
      .from("contact_inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return inMemoryContacts;
    }
    return data as ContactInquiry[];
  } catch {
    return inMemoryContacts;
  }
}

export async function updateContactStatus(id: string, status: ContactInquiry["status"]): Promise<ContactInquiry> {
  inMemoryContacts = inMemoryContacts.map((c) => (c.id === id ? { ...c, status } : c));

  try {
    const { data, error } = await supabase
      .from("contact_inquiries")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      return inMemoryContacts.find((c) => c.id === id) || { ...DEFAULT_CONTACT_INQUIRIES[0], id, status };
    }
    return data as ContactInquiry;
  } catch {
    return inMemoryContacts.find((c) => c.id === id) || { ...DEFAULT_CONTACT_INQUIRIES[0], id, status };
  }
}
