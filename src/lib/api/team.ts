import { supabase } from "../supabase";
import type { TeamMember } from "../database.types";

export async function fetchTeamMembers() {
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .order("performance_score", { ascending: false });

  if (error) throw error;
  return (data ?? []) as TeamMember[];
}
