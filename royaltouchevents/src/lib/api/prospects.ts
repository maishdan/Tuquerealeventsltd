import { supabase } from "../supabase";

export type ProspectRecord = {
  id: string;
  name: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  event: string;
  location?: string | null;
  date?: string | null;
  guests?: string | null;
  budget?: number | null;
  score?: number | null;
  source?: string | null;
  urgency?: string | null;
  recommendation?: string | null;
  status?: string | null;
  created_at?: string;
};

export async function fetchProspects() {
  try {
    const { data, error } = await supabase
      .from("prospects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase fetchProspects Warning:", error);
      return [];
    }
    return (data || []) as ProspectRecord[];
  } catch (err) {
    console.warn("Supabase fetchProspects Exception:", err);
    return [];
  }
}

export async function createProspect(prospectData: Partial<ProspectRecord>) {
  try {
    const { data, error } = await supabase
      .from("prospects")
      .insert([prospectData])
      .select()
      .single();

    if (error) throw error;
    return data as ProspectRecord;
  } catch (err) {
    console.warn("Supabase createProspect Exception:", err);
    return {
      id: `pr-${Date.now()}`,
      created_at: new Date().toISOString(),
      ...prospectData,
    } as ProspectRecord;
  }
}

export async function updateProspectStatus(id: string, status: string) {
  try {
    const { data, error } = await supabase
      .from("prospects")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as ProspectRecord;
  } catch (err) {
    console.warn("Supabase updateProspectStatus Exception:", err);
    return null;
  }
}
