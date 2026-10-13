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

  const isAdminUser = (u?: User | null, p?: Profile | null) => {
    if (!u) return false;
    const uid = u.id;
    const email = (u.email || p?.email || "").toLowerCase();
    const appRole = u.app_metadata?.role;
    const metaRoleVal = u.user_metadata?.role;

    return (
      uid === "2e4f72d4-e107-4d59-9342-4a97294be051" ||
      email === "eventsroyaltouch7@gmail.com" ||
      email === "abigaelmuthoni29@gmail.com" ||
      appRole === "admin" ||
      metaRoleVal === "admin" ||
      p?.role === "admin"
    );
  };

  const loadProfile = async (u: User) => {
    let p: Profile | null = null;
    try {
      p = await fetchProfile(u.id);
    } catch {
      p = null;
    }

    const isAdmin = isAdminUser(u, p);
    const computedRole: UserRole = isAdmin ? "admin" : (p?.role ?? (u.app_metadata?.role === "admin" ? "admin" : "customer"));

    const resolvedFullName =
      p?.full_name ||
      u.user_metadata?.full_name ||
      (u.email === "eventsroyaltouch7@gmail.com" ? "Japheth Owiyo" : u.email === "abigaelmuthoni29@gmail.com" ? "DANIWEST" : "User");

    setProfile({
      id: u.id,
      email: u.email ?? p?.email ?? "",
      full_name: resolvedFullName,
      phone: p?.phone || u.phone || null,
      city: p?.city || null,
      avatar_url: p?.avatar_url || null,
      role: computedRole,
      created_at: p?.created_at || u.created_at || new Date().toISOString(),
    });
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

    let p: Profile | null = null;
    try {
      p = await fetchProfile(data.user.id);
    } catch {
      p = null;
    }

    const isAdmin = isAdminUser(data.user, p);
    const role: UserRole = isAdmin ? "admin" : (p?.role ?? (data.user.app_metadata?.role === "admin" ? "admin" : "customer"));

    const resolvedFullName =
      p?.full_name ||
      data.user.user_metadata?.full_name ||
      (data.user.email === "eventsroyaltouch7@gmail.com" ? "Japheth Owiyo" : data.user.email === "abigaelmuthoni29@gmail.com" ? "DANIWEST" : "User");

    const finalProfile: Profile = {
      id: data.user.id,
      email: data.user.email ?? email,
      full_name: resolvedFullName,
      phone: p?.phone || data.user.phone || null,
      city: p?.city || null,
      avatar_url: p?.avatar_url || null,
      role,
      created_at: p?.created_at || data.user.created_at || new Date().toISOString(),
    };

    setProfile(finalProfile);
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

const defaultAuthContext: AuthContextValue = {
  session: null,
  user: null,
  profile: null,
  role: null,
  loading: true,
  signIn: async () => "customer",
  signUp: async () => {},
  signOut: async () => {},
  refreshProfile: async () => {},
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return defaultAuthContext;
  }
  return ctx;
}
