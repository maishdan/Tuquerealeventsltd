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
  const { session, profile, role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    const isAuthenticated = Boolean(session || profile);
    if (!isAuthenticated) {
      navigate({ to: "/sign-in", replace: true });
      return;
    }

    const currentRole = profile?.role || role || "customer";
    if (requiredRole === "admin" && currentRole !== "admin") {
      navigate({ to: "/dashboard", replace: true });
    } else if (requiredRole === "staff" && currentRole !== "staff" && currentRole !== "admin") {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [session, profile, role, loading, requiredRole, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b10] text-white flex flex-col items-center justify-center p-4">
        <div className="h-10 w-10 border-4 border-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono font-bold uppercase tracking-widest text-gold mt-4">
          Verifying Access Permissions...
        </p>
      </div>
    );
  }

  const isAuthenticated = Boolean(session || profile);
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
