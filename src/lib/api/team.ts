import { supabase } from "../supabase";
import type { TeamMember } from "../database.types";

export const DEFAULT_TEAM: TeamMember[] = [
  {
    id: "tm-1",
    name: "Japheth Owiyo",
    role: "Chief Executive Director",
    email: "eventsroyaltouch7@gmail.com",
    phone: "+254795365334",
    department: "Executive Management",
    performance_score: 99,
    avatar_url: "/team/ceo.jpg",
  },
  {
    id: "tm-2",
    name: "Dan Maish",
    role: "Head of Operations & AI Systems",
    email: "maishdan4940@gmail.com",
    phone: "+254795365334",
    department: "Operations",
    performance_score: 98,
    avatar_url: "/team/ops.jpg",
  },
  {
    id: "tm-3",
    name: "Abigael Muthoni",
    role: "Senior Event Director",
    email: "abigaelmuthoni29@gmail.com",
    phone: "+254795365334",
    department: "Event Management",
    performance_score: 97,
    avatar_url: "/team/director.jpg",
  }
];

let inMemoryTeam: TeamMember[] = [...DEFAULT_TEAM];

export async function fetchTeamMembers(): Promise<TeamMember[]> {
  try {
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("performance_score", { ascending: false });

    if (error || !data || data.length === 0) {
      return inMemoryTeam;
    }
    return data as TeamMember[];
  } catch {
    return inMemoryTeam;
  }
}
