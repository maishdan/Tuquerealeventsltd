import { supabase } from "../supabase";
import type { Order } from "../database.types";

export async function fetchUserOrders(userId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("order_date", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Order[];
}

export async function createOrder(order: Partial<Order>) {
  const { data, error } = await supabase
    .from("orders")
    .insert([order])
    .select()
    .single();

  if (error) throw error;
  return data as Order;
}
