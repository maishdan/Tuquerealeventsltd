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

  useEffect(() => {
    if (loading) return;
    if (!session) {
      navigate({ to: "/sign-in" });
      return;
    }
    if (requiredRole && role !== requiredRole) {
      navigate({ to: role === "admin" ? "/admin" : "/dashboard" });
    }
  }, [loading, session, role, requiredRole, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-strong rounded-2xl px-8 py-6 text-sm text-muted-foreground">Loading dashboard…</div>
      </div>
    );
  }

  if (!session || (requiredRole && role !== requiredRole)) return null;

  return children;
}
