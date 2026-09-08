import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { Profile, UserRole } from "@/lib/database.types";
import { fetchProfile } from "@/lib/api/profiles";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  role: UserRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<UserRole>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const metaRole = (u: User | null | undefined): UserRole | null =>
    u?.app_metadata?.role === "admin" ? "admin" : null;

  const loadProfile = async (u: User) => {
    try {
      const p = await fetchProfile(u.id);
      // Prefer the profiles table; fall back to the role set in auth metadata.
      setProfile({ ...p, role: p.role ?? metaRole(u) ?? "customer" });
    } catch {
      const r = metaRole(u);
      if (r) {
        setProfile({ id: u.id, email: u.email ?? "", role: r } as Profile);
      } else {
        setProfile(null);
      }
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        loadProfile(data.session.user).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user) {
        loadProfile(nextSession.user);
      } else {
        setProfile(null);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const p = await fetchProfile(data.user.id);
    const role: UserRole = p.role ?? metaRole(data.user) ?? "customer";
    setProfile({ ...p, role });
    return role;
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      setProfile(null);
      setSession(null);
      // Force navigation to login page is handled by individual components calling navigate
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        role: profile?.role ?? null,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile: async () => {
          if (session?.user) await loadProfile(session.user);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
