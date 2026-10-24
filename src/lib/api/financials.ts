import { supabase } from "../supabase";
import type { FinancialRecord } from "../database.types";

export const DEFAULT_FINANCIALS: FinancialRecord[] = [
  {
    id: "fin-101",
    user_id: "usr-client-1",
    booking_id: "bk-1001",
    transaction_ref: "MPE-RTE-88912",
    amount: 1500000,
    type: "income",
    category: "Corporate Gala Deposit",
    status: "completed",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "fin-102",
    user_id: "usr-client-2",
    booking_id: "bk-1002",
    transaction_ref: "MPE-RTE-88915",
    amount: 800000,
    type: "income",
    category: "Product Launch Booking",
    status: "completed",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  }
];

let inMemoryFinancials: FinancialRecord[] = [...DEFAULT_FINANCIALS];

export async function fetchUserFinancials(userId: string): Promise<FinancialRecord[]> {
  try {
    const { data, error } = await supabase
      .from("financial_records")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return inMemoryFinancials.filter((f) => f.user_id === userId || !f.user_id);
    }
    return data as FinancialRecord[];
  } catch {
    return inMemoryFinancials.filter((f) => f.user_id === userId || !f.user_id);
  }
}

export async function fetchAllFinancials(): Promise<FinancialRecord[]> {
  try {
    const { data, error } = await supabase
      .from("financial_records")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return inMemoryFinancials;
    }
    return data as FinancialRecord[];
  } catch {
    return inMemoryFinancials;
  }
}
