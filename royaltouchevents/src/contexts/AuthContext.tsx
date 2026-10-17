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
  quickBypassSignIn: (targetRole: UserRole) => Promise<UserRole>;
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
      email === "maishdan4940@gmail.com" ||
      email === "abigaelmuthoni29@gmail.com" ||
      appRole === "admin" ||
      metaRoleVal === "admin" ||
      p?.role === "admin"
    );
  };

  const resolveFullNameForUser = (uEmail?: string | null, userMetaName?: string | null, pName?: string | null): string => {
    if (pName && pName.trim().length > 0) return pName.trim();
    if (userMetaName && userMetaName.trim().length > 0) return userMetaName.trim();

    const email = (uEmail || "").toLowerCase();
    if (email === "eventsroyaltouch7@gmail.com") return "Japheth Owiyo";
    if (email === "maishdan4940@gmail.com") return "Dan Maish";
    if (email === "abigaelmuthoni29@gmail.com") return "DANIWEST";
    if (email) {
      const prefix = email.split("@")[0];
      return prefix.charAt(0).toUpperCase() + prefix.slice(1);
    }
    return "User";
  };

  const createBypassProfile = (targetRole: UserRole): { userObj: User; mockSession: Session; profileObj: Profile } => {
    const emailMap: Record<UserRole, string> = {
      admin: "eventsroyaltouch7@gmail.com",
      staff: "staff@royaltouch.com",
      customer: "client@royaltouch.com",
    };
    const nameMap: Record<UserRole, string> = {
      admin: "Japheth Owiyo (CEO)",
      staff: "Japheth Owiyo (Staff Lead)",
      customer: "Valued Client",
    };
    const idMap: Record<UserRole, string> = {
      admin: "2e4f72d4-e107-4d59-9342-4a97294be051",
      staff: "bypass-staff-id-1002",
      customer: "bypass-customer-id-1003",
    };

    const bypassEmail = emailMap[targetRole] || "client@royaltouch.com";
    const bypassName = nameMap[targetRole] || "Valued User";
    const bypassId = idMap[targetRole] || `bypass-${Date.now()}`;

    const userObj: User = {
      id: bypassId,
      app_metadata: { provider: "email", role: targetRole },
      user_metadata: { full_name: bypassName, role: targetRole },
      aud: "authenticated",
      created_at: new Date().toISOString(),
      email: bypassEmail,
      phone: "+254795365334",
      role: "authenticated",
      updated_at: new Date().toISOString(),
    };

    const mockSession: Session = {
      access_token: "bypass-access-token",
      token_type: "bearer",
      expires_in: 86400,
      refresh_token: "bypass-refresh-token",
      user: userObj,
      expires_at: Math.floor(Date.now() / 1000) + 86400,
    };

    const profileObj: Profile = {
      id: userObj.id,
      email: bypassEmail,
      full_name: bypassName,
      phone: "+254 795 365 334",
      city: "Nairobi",
      avatar_url: null,
      role: targetRole,
      created_at: new Date().toISOString(),
    };

    return { userObj, mockSession, profileObj };
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

    const resolvedFullName = resolveFullNameForUser(u.email, u.user_metadata?.full_name, p?.full_name);

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
    let isMounted = true;

    const storedBypass = typeof window !== "undefined" ? (localStorage.getItem("royal_bypass_role") as UserRole | null) : null;
    if (storedBypass && (storedBypass === "admin" || storedBypass === "staff" || storedBypass === "customer")) {
      const { mockSession, profileObj } = createBypassProfile(storedBypass);
      setSession(mockSession);
      setProfile(profileObj);
      setLoading(false);
    } else {
      supabase.auth.getSession().then(({ data }) => {
        if (!isMounted) return;
        if (data.session?.user) {
          setSession(data.session);
          loadProfile(data.session.user).finally(() => {
            if (isMounted) setLoading(false);
          });
        } else {
          setSession(null);
          setProfile(null);
          setLoading(false);
        }
      });
    }

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return;
      const currentBypass = typeof window !== "undefined" ? (localStorage.getItem("royal_bypass_role") as UserRole | null) : null;
      if (currentBypass && (currentBypass === "admin" || currentBypass === "staff" || currentBypass === "customer")) {
        const { mockSession, profileObj } = createBypassProfile(currentBypass);
        setSession(mockSession);
        setProfile(profileObj);
        setLoading(false);
      } else if (nextSession?.user) {
        setSession(nextSession);
        loadProfile(nextSession.user).finally(() => {
          if (isMounted) setLoading(false);
        });
      } else {
        setProfile(null);
        setSession(null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
    };
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

    const resolvedFullName = resolveFullNameForUser(data.user.email, data.user.user_metadata?.full_name, p?.full_name);

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

  const quickBypassSignIn = async (targetRole: UserRole): Promise<UserRole> => {
    setLoading(true);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("royal_bypass_role", targetRole);
      } catch {
        // ignore storage error
      }
    }

    const { mockSession, profileObj } = createBypassProfile(targetRole);

    setSession(mockSession);
    setProfile(profileObj);
    setLoading(false);
    return targetRole;
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
    } catch (err) {
      console.warn("Sign out warning:", err);
    } finally {
      setProfile(null);
      setSession(null);
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("royal_bypass_role");
          localStorage.removeItem("sb-access-token");
          localStorage.removeItem("sb-refresh-token");
          sessionStorage.clear();
        } catch {
          // Ignore storage errors
        }
      }
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
        quickBypassSignIn,
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
  quickBypassSignIn: async (role) => role,
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
