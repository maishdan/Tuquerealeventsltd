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
    email === "eventsroyaltouch7@gmail.com" ||
    email === "abigaelmuthoni29@gmail.com";

  const effectiveRole: UserRole | null = isAdminEmail ? "admin" : role;

  useEffect(() => {
    if (loading) return;
    if (!session) {
      navigate({ to: "/sign-in" });
      return;
    }
    if (requiredRole && effectiveRole !== requiredRole) {
      navigate({ to: effectiveRole === "admin" ? "/admin" : "/dashboard" });
    }
  }, [loading, session, effectiveRole, requiredRole, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#03070d]">
        <div className="bg-[#09141f] border border-[#f4cf69]/30 rounded-xl px-8 py-6 text-xs font-bold text-[#f4cf69] uppercase tracking-widest">
          Authenticating Executive Session…
        </div>
      </div>
    );
  }

  if (!session || (requiredRole && effectiveRole !== requiredRole)) return null;

  return children;
}
