import { supabase } from "../supabase";
import type { Profile, UserRole } from "../database.types";

export async function fetchProfile(userId: string) {
  try {
    const fetchPromise = supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Profile Fetch Timeout")), 5000)
    );

    const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

    if (error) throw error;
    return data as Profile;
  } catch (err) {
    console.warn("fetchProfile fallback due to timeout or RLS:", err);
    return null;
  }
}

export async function updateProfile(userId: string, updates: Partial<Pick<Profile, "full_name" | "phone" | "city" | "avatar_url" | "role">>) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function updateUserRole(userId: string, role: UserRole) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  } catch (err: any) {
    if (err?.code === "23514" || String(err?.message || "").includes("profiles_role_check")) {
      console.warn("Supabase Role Check Constraint Warning: Please run the SQL script in Supabase SQL Editor to allow 'staff' in the profiles table.");
    }
    throw err;
  }
}

export async function deleteProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", userId);

  if (error) throw error;
  return data;
}

export async function createProfile(profileData: Partial<Profile>) {
  const { data, error } = await supabase
    .from("profiles")
    .insert([profileData])
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function fetchAllProfiles(): Promise<Profile[]> {
  try {
    const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (error) {
      console.warn("Supabase fetchAllProfiles Query Warning:", error);
      return [];
    }
    return (data || []) as Profile[];
  } catch (err) {
    console.warn("Supabase fetchAllProfiles Exception:", err);
    return [];
  }
}
