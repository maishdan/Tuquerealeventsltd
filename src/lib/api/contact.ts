import { supabase } from "../supabase";
import type { ContactInquiry } from "../database.types";

export async function createContactInquiry(input: { name: string; email: string; message: string }) {
  const { data, error } = await supabase
    .from("contact_inquiries")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data as ContactInquiry;
}

export async function fetchContactInquiries() {
  const { data, error } = await supabase
    .from("contact_inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as ContactInquiry[];
}

export async function updateContactStatus(id: string, status: ContactInquiry["status"]) {
  const { data, error } = await supabase
    .from("contact_inquiries")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as ContactInquiry;
}
