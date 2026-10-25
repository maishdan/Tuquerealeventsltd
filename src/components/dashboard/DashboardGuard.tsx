import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import type { UserRole } from "@/lib/database.types";
import { ShieldCheck, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { sendMessage } from "@/lib/api/messages";

// Generate 6-Character Alphanumeric OTP (Mixed Numbers & Uppercase/Lowercase Letters)
const generateAlphanumericOtp = (): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export function DashboardGuard({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: UserRole;
}) {
  const { session, profile, role, user, loading } = useAuth();
  const navigate = useNavigate();

  // Detect Google OAuth User vs Email/Password User
  const isGoogleUser = Boolean(
    user?.app_metadata?.provider === "google" ||
    user?.app_metadata?.providers?.includes("google") ||
    user?.identities?.some((id) => id.provider === "google")
  );

  const [is2FaVerified, setIs2FaVerified] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    // Google OAuth users are automatically 2FA verified
    return sessionStorage.getItem("royal_2fa_verified") === "true";
  });

  const [generatedOtpCode, setGeneratedOtpCode] = useState("");
  const [otpCodeInput, setOtpCodeInput] = useState("");
  const [otpErrorMsg, setOtpErrorMsg] = useState("");
  const [otpSuccessMsg, setOtpSuccessMsg] = useState("");
  const [otpTimeLeft, setOtpTimeLeft] = useState(600); // 10 minutes in seconds

  const userEmail = user?.email || profile?.email || "authenticated-user@trealeventsltd.co.ke";

  // Dispatch OTP code on initial load for Email & Password Users
  const dispatchOtp = async () => {
    const code = generateAlphanumericOtp();
    setGeneratedOtpCode(code);
    setOtpCodeInput("");
    setOtpErrorMsg("");
    setOtpSuccessMsg("");
    setOtpTimeLeft(600); // 10 minutes

    try {
      await sendMessage({
        from_name: "TOQUE REAL 2FA Sentinel",
        from_role: "Security Guard",
        subject: `🔐 2FA OTP Code for ${userEmail}: ${code}`,
        body: `Your 6-character 2FA verification code for TOQUE REAL EVENTS LIMITED is: ${code}. Valid for 10 minutes.`,
      });
    } catch {
      // Continue to 2FA screen
    }
  };

  useEffect(() => {
    if (loading) return;

    const isAuthenticated = Boolean(session || profile);
    if (!isAuthenticated) {
      navigate({ to: "/sign-in", replace: true });
      return;
    }

    // GOOGLE OAUTH USERS: Log in directly without requiring OTP
    if (isGoogleUser && !is2FaVerified) {
      sessionStorage.setItem("royal_2fa_verified", "true");
      setIs2FaVerified(true);
      return;
    }

    // EMAIL & PASSWORD USERS: Must complete 2FA OTP
    if (!isGoogleUser && !is2FaVerified && !generatedOtpCode) {
      dispatchOtp();
    }

    const currentRole = profile?.role || role || "customer";

    if (requiredRole === "admin" && currentRole !== "admin") {
      navigate({ to: "/dashboard", replace: true });
    } else if (requiredRole === "staff" && currentRole !== "staff" && currentRole !== "admin") {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [session, profile, role, loading, requiredRole, navigate, is2FaVerified, generatedOtpCode, isGoogleUser]);

  // 10-Minute Timer for Email/Password OTP
  useEffect(() => {
    let timer: any;
    if (!isGoogleUser && !is2FaVerified && otpTimeLeft > 0) {
      timer = setInterval(() => setOtpTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isGoogleUser, is2FaVerified, otpTimeLeft]);

  const formatOtpTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleOtpInputChange = (val: string) => {
    setOtpCodeInput(val);
    setOtpErrorMsg("");

    if (val.length === 6) {
      if (otpTimeLeft <= 0) {
        setOtpErrorMsg("❌ 2FA OTP code has expired (10 minutes limit). Click 'Resend Code' below.");
        return;
      }

      if (val.trim().toUpperCase() === generatedOtpCode.trim().toUpperCase()) {
        setOtpSuccessMsg("✓ 2FA Security Verified! Access Granted.");
        sessionStorage.setItem("royal_2fa_verified", "true");
        setTimeout(() => {
          setIs2FaVerified(true);
        }, 400);
      } else {
        setOtpErrorMsg("❌ Incorrect 2FA OTP code. Please enter the valid code sent to your email or click Resend.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b10] text-white flex flex-col items-center justify-center p-4 font-sans">
        <div className="h-10 w-10 border-4 border-[#f4cf69] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono font-bold uppercase tracking-widest text-[#f4cf69] mt-4">
          Verifying Role Access & Permissions...
        </p>
      </div>
    );
  }

  const isAuthenticated = Boolean(session || profile);
  if (!isAuthenticated) return null;

  // EMAIL & PASSWORD USERS: Render Center-Aligned 2FA Verification Modal if NOT verified
  if (!isGoogleUser && !is2FaVerified) {
    return (
      <div className="min-h-screen bg-[#070b10] text-white flex flex-col items-center justify-center p-4 font-mono relative">
        <div className="bg-[#09131d] border-2 border-[#f4cf69] rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-[0_25px_70px_rgba(0,0,0,0.9)] space-y-5 text-center text-white relative animate-in zoom-in-95 duration-300 z-50">
          {/* Shield Icon */}
          <div className="mx-auto w-16 h-16 rounded-full bg-[#f4cf69]/10 border border-[#f4cf69]/40 text-[#f4cf69] flex items-center justify-center shadow-lg">
            <ShieldCheck size={34} />
          </div>

          {/* Title & Email Info */}
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-[#f4cf69] tracking-widest block">
              🔐 2FA SECURITY VERIFICATION
            </span>
            <h3 className="text-xl font-black uppercase tracking-tight text-white">Enter 6-Character OTP Code</h3>
            <p className="text-xs text-[#90a2b4] font-sans font-medium leading-relaxed">
              An active 2FA alphanumeric code has been dispatched to <strong className="text-white">{userEmail}</strong>.
            </p>
          </div>

          {/* OTP Code Input */}
          <div className="space-y-3">
            <input
              type="text"
              maxLength={6}
              value={otpCodeInput}
              onChange={(e) => handleOtpInputChange(e.target.value)}
              placeholder="e.g. K9p3L1"
              className="w-full text-center text-2xl font-mono font-black tracking-[0.3em] uppercase bg-[#0d1e2e] border-2 border-[#f4cf69]/60 text-[#f4cf69] p-3 rounded-xl focus:outline-none focus:border-[#f4cf69] focus:ring-2 focus:ring-[#f4cf69]/30 transition"
            />

            {otpErrorMsg && (
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold font-sans rounded-lg flex items-center justify-center gap-1.5">
                <AlertCircle size={15} /> <span>{otpErrorMsg}</span>
              </div>
            )}

            {otpSuccessMsg && (
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-sans rounded-lg flex items-center justify-center gap-1.5">
                <CheckCircle2 size={15} /> <span>{otpSuccessMsg}</span>
              </div>
            )}
          </div>

          {/* Timer & Resend Button */}
          <div className="pt-2 border-t border-[#182836] flex justify-between items-center text-xs text-[#8293a4] font-mono">
            <span>Expires in: <strong className="text-white">{formatOtpTime(otpTimeLeft)}</strong></span>
            <button
              type="button"
              onClick={dispatchOtp}
              className="text-[#f4cf69] hover:underline font-bold uppercase cursor-pointer flex items-center gap-1"
            >
              <RefreshCw size={12} /> Resend Code
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
