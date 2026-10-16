import { supabase } from "../supabase";
import type { FinancialRecord } from "../database.types";

export async function fetchUserFinancials(userId: string) {
  const { data, error } = await supabase
    .from("financial_records")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as FinancialRecord[];
}

export async function fetchAllFinancials() {
  const { data, error } = await supabase
    .from("financial_records")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as FinancialRecord[];
}
