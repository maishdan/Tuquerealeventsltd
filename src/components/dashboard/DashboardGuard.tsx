import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import type { UserRole } from "@/lib/database.types";

export function DashboardGuard({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: UserRole;
}) {
  const { loading, session, role } = useAuth();
  const navigate = useNavigate();

  const email = session?.user?.email?.toLowerCase();
  const isAdminEmail =
    session?.user?.id === "2e4f72d4-e107-4d59-9342-4a97294be051" ||
    email === "realtoque0@gmail.com" ||
    email === "eventsroyaltouch7@gmail.com" ||
    email === "abigaelmuthoni29@gmail.com";

  const effectiveRole: UserRole | null = isAdminEmail ? "admin" : role;

  const isAuthorized = (() => {
    if (!requiredRole) return true;
    if (effectiveRole === "admin") return true; // CEO & Super Admins have full access
    if (requiredRole === "staff" && (effectiveRole === "staff" || effectiveRole === "admin")) return true;
    return effectiveRole === requiredRole;
  })();

  useEffect(() => {
    if (loading) return;
    if (!session) {
      navigate({ to: "/sign-in" });
      return;
    }
    if (!isAuthorized) {
      navigate({ to: effectiveRole === "admin" ? "/admin" : effectiveRole === "staff" ? "/staff" : "/dashboard" });
    }
  }, [loading, session, isAuthorized, effectiveRole, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#03070d]">
        <div className="bg-[#09141f] border border-[#f4cf69]/30 rounded-xl px-8 py-6 text-xs font-bold text-[#f4cf69] uppercase tracking-widest">
          Authenticating Executive Session…
        </div>
      </div>
    );
  }

  if (!session || !isAuthorized) return null;

  return <>{children}</>;
}
