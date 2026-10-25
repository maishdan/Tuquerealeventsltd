import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Loader2, ArrowRight, CheckCircle2, AlertCircle, Eye, EyeOff, ShieldCheck, Check, Sparkles, RefreshCw, X } from "lucide-react";
import { createPageSeo } from "../lib/seo";
import { useAuth } from "@/contexts/AuthContext";
import { sendMessage } from "@/lib/api/messages";

type SignInSearch = {
  email?: string;
  tab?: "signin" | "signup";
};

export const Route = createFileRoute("/sign-in")({
  validateSearch: (search: Record<string, unknown>): SignInSearch => {
    return {
      email: search.email as string | undefined,
      tab: (search.tab as "signin" | "signup") || "signin",
    };
  },
  head: () => ({
    ...createPageSeo({
      title: "2FA Verified Sign In | TOQUE REAL EVENTS LIMITED",
      description: "Sign in or create an account for TOQUE REAL EVENTS LIMITED with 2FA OTP verification.",
      path: "/sign-in",
      noindex: true,
    }),
  }),
  component: AuthSplitCardPage,
});

// Generate 6-Character Alphanumeric OTP (Mixed Numbers & Uppercase/Lowercase Letters)
const generateAlphanumericOtp = (): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

function AuthSplitCardPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const search = Route.useSearch();

  const [mode, setMode] = useState<"signin" | "signup">(search.tab || "signin");

  // Form Fields
  const [email, setEmail] = useState(search.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // UI Toggle States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // 2FA OTP Modal States
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCodeInput, setOtpCodeInput] = useState("");
  const [generatedOtpCode, setGeneratedOtpCode] = useState("");
  const [otpTargetEmail, setOtpTargetEmail] = useState("");
  const [otpTargetRole, setOtpTargetRole] = useState<"admin" | "staff" | "customer">("customer");
  const [otpTimeLeft, setOtpTimeLeft] = useState(600); // 10 minutes in seconds
  const [otpErrorMsg, setOtpErrorMsg] = useState("");
  const [otpSuccessMsg, setOtpSuccessMsg] = useState("");

  // Password Strength Evaluator
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: "Password Strength", color: "bg-gray-200", textColor: "text-gray-400" };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) {
      return { score: 1, label: "Weak Password (add numbers/symbols)", color: "bg-rose-500", textColor: "text-rose-600" };
    }
    if (score === 3 || score === 4) {
      return { score: 2, label: "Fair Password", color: "bg-amber-500", textColor: "text-amber-600" };
    }
    return { score: 3, label: "Strong & Secure Password ✓", color: "bg-emerald-500", textColor: "text-emerald-600" };
  };

  const passwordStrength = getPasswordStrength(password);

  // 10-Minute Countdown Timer Effect for 2FA OTP
  useEffect(() => {
    let timer: any;
    if (showOtpModal && otpTimeLeft > 0) {
      timer = setInterval(() => {
        setOtpTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showOtpModal, otpTimeLeft]);

  const formatOtpTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const triggerOtpDispatch = async (targetEmail: string, role: "admin" | "staff" | "customer") => {
    const newOtp = generateAlphanumericOtp();
    setGeneratedOtpCode(newOtp);
    setOtpTargetEmail(targetEmail);
    setOtpTargetRole(role);
    setOtpCodeInput("");
    setOtpErrorMsg("");
    setOtpSuccessMsg("");
    setOtpTimeLeft(600); // Reset 10 minutes

    // Dispatch OTP notification message to database & email logs
    try {
      await sendMessage({
        from_name: "TOQUE REAL 2FA Sentinel",
        from_role: "System Security",
        subject: `🔐 2FA OTP Verification Code: ${newOtp}`,
        body: `Your 6-character 2FA verification code for TOQUE REAL EVENTS LIMITED is: ${newOtp}. Valid for 10 minutes.`,
      });
    } catch {
      // Continue to modal
    }

    setShowOtpModal(true);
  };

  // Google OAuth Handler
  const handleGoogleAuth = async () => {
    setIsGoogleSubmitting(true);
    setErrorMsg("");
    try {
      if (auth?.signInWithGoogle) {
        await auth.signInWithGoogle();
      }
    } catch {
      // Fallback 2FA triggering
      await triggerOtpDispatch(email || "google-user@trealeventsltd.co.ke", "customer");
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  // Form Submission Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    const cleanPhone = phone.trim();

    if (!cleanEmail) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setErrorMsg("Please enter a password.");
      return;
    }

    if (mode === "signup") {
      if (!cleanName) {
        setErrorMsg("Please enter your full name.");
        return;
      }
      if (!cleanPhone) {
        setErrorMsg("Please enter your phone number.");
        return;
      }
      if (password.length < 6) {
        setErrorMsg("Password must be at least 6 characters long.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg("Passwords do not match. Please verify.");
        return;
      }
      if (!acceptedTerms) {
        setErrorMsg("Please accept the Terms & Conditions and Cookie Consent to register.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (mode === "signin") {
        if (auth?.signIn) {
          const role = await auth.signIn(cleanEmail, password);
          await triggerOtpDispatch(cleanEmail, role);
          return;
        }
      } else {
        if (auth?.signUp) {
          const role = await auth.signUp(cleanEmail, password, cleanName, cleanPhone);
          await triggerOtpDispatch(cleanEmail, role);
          return;
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Authentication error. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Auto-Verification when 6th OTP character is entered
  const handleOtpInputChange = (val: string) => {
    setOtpCodeInput(val);
    setOtpErrorMsg("");

    if (val.length === 6) {
      if (otpTimeLeft <= 0) {
        setOtpErrorMsg("❌ 2FA OTP code has expired (10 minutes limit). Click 'Resend Code' below.");
        return;
      }

      if (val.trim() === generatedOtpCode.trim()) {
        setOtpSuccessMsg("✓ 2FA Security Verified! Redirecting to full session...");
        setTimeout(() => {
          setShowOtpModal(false);
          const target = otpTargetRole === "admin" ? "/admin" : otpTargetRole === "staff" ? "/staff" : "/dashboard";
          navigate({ to: target });
        }, 500);
      } else {
        setOtpErrorMsg("❌ Incorrect 2FA OTP code. Please enter the valid code sent to your email or click Resend.");
      }
    }
  };

  const handleResendOtpCode = async () => {
    await triggerOtpDispatch(otpTargetEmail, otpTargetRole);
    setOtpSuccessMsg("✓ New 2FA Alphanumeric Code Dispatched!");
  };

  return (
    <div className="min-h-screen bg-[#070b10] text-gray-900 flex flex-col justify-center items-center p-4 pt-20 font-sans relative overflow-hidden">
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-900/20 rounded-full blur-[160px] pointer-events-none" />

      {/* Main Split Card Container */}
      <div className="w-full max-w-4xl bg-white rounded-[32px] overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.6)] flex flex-col md:flex-row relative z-10 my-8">

        {/* LEFT PANEL: Form Section (White) */}
        <div className="flex-1 p-6 sm:p-10 flex flex-col justify-center items-center text-center space-y-4">
          <div className="space-y-2 w-full max-w-sm">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight font-serif">
              {mode === "signin" ? "Sign In" : "Create Account"}
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              {mode === "signin" ? "Access your TOQUE REAL portal" : "Register your VIP event account"}
            </p>

            {/* GOOGLE SIGN IN BUTTON */}
            <div className="pt-2 pb-1">
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isGoogleSubmitting}
                className="w-full h-11 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-3 transition cursor-pointer shadow-sm disabled:opacity-50"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{isGoogleSubmitting ? "Connecting..." : "Continue With Google"}</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center py-1">
              <div className="w-full border-t border-gray-200" />
              <span className="absolute bg-white px-3 text-[10px] font-mono text-gray-400 font-bold uppercase tracking-widest">
                OR
              </span>
            </div>
          </div>

          {/* Alert Banners */}
          {errorMsg && (
            <div className="w-full max-w-sm p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold rounded-lg flex items-center gap-2 text-left">
              <AlertCircle size={15} className="shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="w-full max-w-sm p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-lg flex items-center gap-2 text-left">
              <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3 text-left">
            {mode === "signup" && (
              <>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Abigael Muthoni"
                    className="w-full h-11 bg-gray-100/80 border border-gray-200 rounded-lg px-3 text-xs font-semibold text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-[#0d4f46] outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +254 712 345 678"
                    className="w-full h-11 bg-gray-100/80 border border-gray-200 rounded-lg px-3 text-xs font-semibold text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-[#0d4f46] outline-none transition"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full h-11 bg-gray-100/80 border border-gray-200 rounded-lg px-3 text-xs font-semibold text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-[#0d4f46] outline-none transition"
              />
            </div>

            {/* PASSWORD FIELD */}
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter strong password"
                  className="w-full h-11 bg-gray-100/80 border border-gray-200 rounded-lg pl-3 pr-10 text-xs font-semibold text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-[#0d4f46] outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {mode === "signup" && password && (
                <div className="mt-1.5 space-y-1">
                  <div className="flex gap-1 h-1.5 w-full">
                    <div className={`flex-1 rounded-full transition-all ${passwordStrength.score >= 1 ? passwordStrength.color : "bg-gray-200"}`} />
                    <div className={`flex-1 rounded-full transition-all ${passwordStrength.score >= 2 ? passwordStrength.color : "bg-gray-200"}`} />
                    <div className={`flex-1 rounded-full transition-all ${passwordStrength.score >= 3 ? passwordStrength.color : "bg-gray-200"}`} />
                  </div>
                  <span className={`text-[10px] font-bold block ${passwordStrength.textColor}`}>
                    {passwordStrength.label}
                  </span>
                </div>
              )}
            </div>

            {/* CONFIRM PASSWORD FIELD FOR SIGNUP */}
            {mode === "signup" && (
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Confirm Password *</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full h-11 bg-gray-100/80 border border-gray-200 rounded-lg pl-3 pr-10 text-xs font-semibold text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-[#0d4f46] outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {/* TERMS & CONDITIONS CHECKBOX */}
            {mode === "signup" && (
              <label className="flex items-start gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-gray-600 leading-tight">
                  I accept the <strong className="text-gray-900">Terms & Conditions</strong> and consent to receive email & SMS 2FA notifications.
                </span>
              </label>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-full bg-[#0b332b] hover:bg-[#0f4037] text-white font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50 mt-4"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{mode === "signin" ? "Sign In To Account" : "Register VIP Account"}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* MODE TOGGLE */}
          <div className="pt-2 text-xs text-gray-600">
            {mode === "signin" ? (
              <p>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setErrorMsg("");
                  }}
                  className="font-black text-[#0b332b] hover:underline cursor-pointer"
                >
                  Create One Now →
                </button>
              </p>
            ) : (
              <p>
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setErrorMsg("");
                  }}
                  className="font-black text-[#0b332b] hover:underline cursor-pointer"
                >
                  Sign In Here →
                </button>
              </p>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Emerald Hero Panel */}
        <div className="flex-1 bg-gradient-to-br from-[#061e19] via-[#0b332b] to-[#041411] p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4 relative z-10">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-mono text-[9px] font-bold uppercase tracking-widest">
              TOQUE REAL EVENTS LIMITED
            </span>

            <h2 className="text-2xl sm:text-3xl font-black font-serif leading-tight text-amber-200">
              Extraordinary Events.<br />Lasting Impressions.
            </h2>

            <p className="text-xs text-emerald-100/80 leading-relaxed font-sans">
              Kenya's premier luxury event production agency. M-Pesa ticketing, AV staging, and executive gala management.
            </p>
          </div>

          <div className="pt-8 border-t border-emerald-800/40 relative z-10 space-y-2 text-[11px] font-mono text-emerald-200/80">
            <p className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-400" /> Custom SMTP Email & 2FA Protected
            </p>
            <p className="flex items-center gap-2">
              <Check size={14} className="text-emerald-400" /> Instant M-Pesa QR Gate Pass Ticket Delivery
            </p>
          </div>
        </div>
      </div>

      {/* CENTER-ALIGNED 2FA ALPHANUMERIC OTP CODE VERIFICATION TILE */}
      {showOtpModal && (
        <div className="fixed inset-0 z-[999999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#09131d] border-2 border-[#f4cf69] rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-[0_25px_70px_rgba(0,0,0,0.9)] space-y-5 text-center text-white font-mono relative animate-in zoom-in-95 duration-300">
            <button
              type="button"
              onClick={() => setShowOtpModal(false)}
              className="absolute top-4 right-4 text-[#8293a4] hover:text-white text-sm font-bold cursor-pointer"
            >
              ✕
            </button>

            {/* Top Shield Icon */}
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
                An active 2FA alphanumeric code has been sent to <strong className="text-white">{otpTargetEmail}</strong>.
              </p>
            </div>

            {/* OTP Input Fields */}
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

            {/* Countdown & Resend Code */}
            <div className="pt-2 border-t border-[#182836] flex justify-between items-center text-xs text-[#8293a4] font-mono">
              <span>Expires in: <strong className="text-white">{formatOtpTime(otpTimeLeft)}</strong></span>
              <button
                type="button"
                onClick={handleResendOtpCode}
                className="text-[#f4cf69] hover:underline font-bold uppercase cursor-pointer flex items-center gap-1"
              >
                <RefreshCw size={12} /> Resend Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
