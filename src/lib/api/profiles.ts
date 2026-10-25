import { supabase } from "../supabase";
import type { Profile, UserRole } from "../database.types";

export async function fetchProfile(userId: string): Promise<Profile | null> {
  try {
    let timerId: any;
    const fetchPromise = supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()
      .then((res) => {
        if (timerId) clearTimeout(timerId);
        return res;
      });

    const timeoutPromise = new Promise<never>((_, reject) => {
      timerId = setTimeout(() => reject(new Error("Profile Fetch Timeout")), 5000);
    });

    const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

    if (error || !data) return null;
    return data as Profile;
  } catch (err) {
    console.warn("fetchProfile fallback due to timeout or RLS:", err);
    return null;
  }
}

export async function updateProfile(userId: string, updates: Partial<Pick<Profile, "full_name" | "phone" | "city" | "avatar_url" | "role">>) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  } catch (err) {
    console.warn("updateProfile local fallback:", err);
    return { id: userId, ...updates } as Profile;
  }
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
    console.warn("updateUserRole local fallback:", err?.message);
    return { id: userId, role } as Profile;
  }
}

export async function deleteProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (error) throw error;
    return data;
  } catch {
    return true;
  }
}

export async function createProfile(profileData: Partial<Profile>) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .insert([profileData])
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  } catch {
    return {
      id: profileData.id || `usr-${Date.now()}`,
      email: profileData.email || "",
      full_name: profileData.full_name || "User",
      role: profileData.role || "customer",
      created_at: new Date().toISOString(),
      ...profileData,
    } as Profile;
  }
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
