import { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import type { UserRole } from "@/lib/database.types";
import { LoadingScreen } from "@/components/common/LoadingScreen";

export function DashboardGuard({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: UserRole;
}) {
  const { loading, session, profile, role } = useAuth();
  const navigate = useNavigate();
  const hasNavigatedRef = useRef(false);

  const email = (session?.user?.email || profile?.email || "").toLowerCase();
  const isAdminEmail =
    session?.user?.id === "2e4f72d4-e107-4d59-9342-4a97294be051" ||
    email === "realtoque0@gmail.com" ||
    email === "eventsroyaltouch7@gmail.com" ||
    email === "maishdan4940@gmail.com" ||
    email === "abigaelmuthoni29@gmail.com";

  const effectiveRole: UserRole | null = isAdminEmail ? "admin" : (profile?.role ?? role);

  const isAuthorized = (() => {
    if (!requiredRole) return true;
    if (effectiveRole === "admin") return true; // CEO & Super Admins have full access
    if (requiredRole === "staff" && (effectiveRole === "staff" || effectiveRole === "admin")) return true;
    return effectiveRole === requiredRole;
  })();

  const hasAccess = Boolean(session || profile);

  useEffect(() => {
    if (loading) return;

    // Unauthenticated and no profile -> Redirect to sign-in ONCE
    if (!hasAccess) {
      if (!hasNavigatedRef.current) {
        hasNavigatedRef.current = true;
        navigate({ to: "/sign-in" });
      }
      return;
    }

    // Authenticated but profile/role still resolving -> Wait
    if (!effectiveRole) return;

    // Authenticated but unauthorized for this page -> Redirect once to authorized area
    if (!isAuthorized && !hasNavigatedRef.current) {
      hasNavigatedRef.current = true;
      const target = effectiveRole === "admin" ? "/admin" : effectiveRole === "staff" ? "/staff" : "/dashboard";
      navigate({ to: target });
    }
  }, [loading, hasAccess, effectiveRole, isAuthorized, navigate]);

  if (loading || (hasAccess && !effectiveRole)) {
    return <LoadingScreen title="Authenticating Executive Session & Permissions..." />;
  }

  if (!hasAccess || !isAuthorized) return null;

  return <>{children}</>;
}
