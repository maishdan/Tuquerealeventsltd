import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { Loader2, ShieldCheck, ArrowRight, Eye, EyeOff, AlertCircle, Lock, Check, CheckCircle2, XCircle } from "lucide-react";
import { createPageSeo } from "../lib/seo";
import { useAuth } from "@/contexts/AuthContext";

type SignInSearch = {
  email?: string;
  password?: string;
};

export const Route = createFileRoute("/sign-in")({
  validateSearch: (search: Record<string, unknown>): SignInSearch => {
    return {
      email: search.email as string | undefined,
      password: search.password as string | undefined,
    };
  },
  head: () => ({
    ...createPageSeo({
      title: "Sign In | Royal Touch Events Nairobi",
      description: "Access your Royal Touch Events account. Secure login for clients and administrators.",
      path: "/sign-in",
      noindex: true,
    }),
  }),
  component: SignIn,
});

const heroImages = [
  "/back/e1.jfif",
  "/back/e2.jfif",
  "/back/e3.jfif",
  "/back/e4.jfif",
  "/back/e5.jfif",
  "/back/e7.jpg",
  "/back/e8.jpg",
  "/back/e9.jpg",
];

const SECRET_PASSCODE = "Xya!Toque1";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

function SignIn() {
  const navigate = useNavigate();
  const auth = useAuth();
  const search = Route.useSearch();

  const [email, setEmail] = useState(search.email || "");
  const [password, setPassword] = useState(search.password || "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [authError, setAuthError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  // Secret Passcode Verification State
  const [secretInput, setSecretInput] = useState("");
  const [verifyingSecret, setVerifyingSecret] = useState(false);
  const [secretStatus, setSecretStatus] = useState<"idle" | "success" | "error">("idle");
  const [secretMsg, setSecretMsg] = useState("");

  const [isTilesUnlocked, setIsTilesUnlocked] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("royal_secret_unlocked") === "true";
    }
    return false;
  });

  const hasRedirectedRef = useRef(false);

  const handleUnlockTiles = (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyingSecret(true);
    setSecretStatus("idle");
    setSecretMsg("");

    const cleanVal = secretInput.trim().toLowerCase();
    const targetPass = SECRET_PASSCODE.toLowerCase();

    setTimeout(() => {
      setVerifyingSecret(false);
      if (cleanVal === targetPass) {
        setSecretStatus("success");
        setSecretMsg("✓ Secret Code Verified! Direct Dashboards Unlocked.");
        setIsTilesUnlocked(true);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("royal_secret_unlocked", "true");
        }
      } else {
        setSecretStatus("error");
        setSecretMsg("✕ Incorrect Secret Code. Access Denied.");
      }
    }, 400);
  };

  const handleDirectLogin = (targetRole: "admin" | "staff" | "customer", route: string) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("royal_bypass_role", targetRole);
      }
      if (auth?.quickBypassSignIn) {
        auth.quickBypassSignIn(targetRole);
      }
    } catch (e) {
      console.warn("Direct login error:", e);
    }
    window.location.href = route;
  };

  const handleGoogleSignIn = async () => {
    setGoogleSubmitting(true);
    setAuthError("");
    try {
      if (auth?.signInWithGoogle) {
        await auth.signInWithGoogle();
      }
    } catch (err: any) {
      setAuthError(err?.message || "Google Sign-In failed. Please try again.");
    } finally {
      setGoogleSubmitting(false);
    }
  };

  useEffect(() => {
    if (auth?.loading) return;
    if (auth?.user && auth?.profile) {
      if (hasRedirectedRef.current) return;
      hasRedirectedRef.current = true;

      const uEmail = auth.user.email?.toLowerCase();
      const isAdmin =
        auth.profile.role === "admin" ||
        uEmail === "realtoque0@gmail.com" ||
        uEmail === "eventsroyaltouch7@gmail.com" ||
        uEmail === "maishdan4940@gmail.com" ||
        uEmail === "abigaelmuthoni29@gmail.com";
      const isStaff = auth.profile.role === "staff";

      const to = isAdmin ? "/admin" : isStaff ? "/staff" : "/dashboard";
      navigate({ to });
    }
  }, [auth?.loading, auth?.user, auth?.profile, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % heroImages.length);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAuthError("");
    const res = schema.safeParse({ email, password });
    if (!res.success) {
      const errs: Record<string, string> = {};
      res.error.issues.forEach((i) => {
        errs[String(i.path[0])] = i.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      if (!auth) throw new Error("Auth system unavailable");
      const role = await auth.signIn(res.data.email, res.data.password);
      const isTargetAdmin =
        role === "admin" ||
        res.data.email.toLowerCase() === "realtoque0@gmail.com" ||
        res.data.email.toLowerCase() === "eventsroyaltouch7@gmail.com" ||
        res.data.email.toLowerCase() === "abigaelmuthoni29@gmail.com";
      const isTargetStaff = role === "staff";

      if (isTargetAdmin) {
        navigate({ to: "/admin" });
      } else if (isTargetStaff) {
        navigate({ to: "/staff" });
      } else {
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Sign in failed. Check your email and password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative min-w-0 bg-[#0b0e14] bg-[url('/ltd.png')] bg-cover bg-center bg-fixed text-foreground font-sans min-h-screen flex flex-col items-center justify-center p-4 overflow-x-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          key={heroImages[currentImgIndex]}
          src={heroImages[currentImgIndex]}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 opacity-20 dark:opacity-30 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-slate-50/95 to-[#f8fafc] dark:from-[#0b0e14]/90 dark:via-[#0b0e14]/95 dark:to-[#0b0e14]" />
      </div>

      <div className="relative z-10 w-full max-w-xl py-12">
        <div className="text-center mb-8 space-y-4">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-none bg-gold/10 border border-gold/40 text-gold text-[10px] font-black uppercase tracking-[0.3em] shadow-sm">
              <ShieldCheck size={14} className="text-gold" /> Executive Authorization Gateway
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-none text-[#0b0e14] dark:text-white">
            Sign <span className="text-gold font-display font-normal">In.</span>
          </h1>
          <p className="text-slate-600 dark:text-gray-300 font-bold uppercase tracking-widest text-[10px]">
            Access your Royal Touch executive portal & ticket registry
          </p>
        </div>

        <div className="bg-white dark:bg-[#121722] border border-slate-200 dark:border-white/10 p-8 sm:p-12 rounded-none shadow-2xl space-y-8">
          {authError && (
            <div className="p-4 rounded-none bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-bold flex items-center gap-3 animate-in fade-in duration-200">
              <AlertCircle size={18} />
              <p>{authError}</p>
            </div>
          )}

          {/* SECRET PASSCODE VERIFICATION DIRECT DASHBOARD ACCESS */}
          {!isTilesUnlocked ? (
            <div className="p-5 bg-black/40 border border-gold/40 rounded-none space-y-4">
              <div className="text-center space-y-1">
                <span className="text-[10px] font-black uppercase text-gold tracking-[0.25em] font-mono block flex items-center justify-center gap-1.5">
                  <Lock size={12} /> EXECUTIVE SECRET CODE VERIFICATION
                </span>
                <p className="text-xs font-bold text-white uppercase tracking-wider">
                  Enter Secret Code To Verify Access To Direct Portals
                </p>
              </div>

              {secretStatus === "error" && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold rounded-none flex items-center justify-center gap-2 animate-in fade-in duration-200">
                  <XCircle size={16} className="shrink-0" />
                  <span>{secretMsg || "✕ Incorrect Secret Code. Access Denied."}</span>
                </div>
              )}

              {secretStatus === "success" && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-none flex items-center justify-center gap-2 animate-in fade-in duration-200">
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>{secretMsg}</span>
                </div>
              )}

              <form onSubmit={handleUnlockTiles} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={secretInput}
                  onChange={(e) => {
                    setSecretInput(e.target.value);
                    if (secretStatus !== "idle") setSecretStatus("idle");
                  }}
                  placeholder="Enter secret key"
                  className="flex-1 h-12 bg-black/60 border border-gold/40 px-4 text-xs font-mono text-white placeholder:text-gray-500 focus:border-gold outline-none"
                />
                <button
                  type="submit"
                  disabled={verifyingSecret}
                  className="h-12 px-6 bg-gold text-black font-black text-xs uppercase tracking-wider hover:bg-white transition-all cursor-pointer shrink-0 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {verifyingSecret ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>Verify & Unlock</>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="p-5 bg-black/40 border-2 border-emerald-500/80 rounded-none space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.2em] font-mono block flex items-center gap-1">
                    <CheckCircle2 size={13} /> VERIFIED · EXECUTIVE OVERRIDE ACTIVE
                  </span>
                  <p className="text-xs font-bold text-white uppercase tracking-wider">
                    Direct Dashboard Portals Unlocked
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsTilesUnlocked(false);
                    setSecretStatus("idle");
                    setSecretInput("");
                    if (typeof window !== "undefined") {
                      sessionStorage.removeItem("royal_secret_unlocked");
                    }
                  }}
                  className="text-[9px] font-mono text-gray-400 hover:text-rose-400 uppercase tracking-widest border border-gray-700 px-2 py-1 cursor-pointer"
                >
                  Lock Tiles 🔒
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <a
                  href="/admin"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDirectLogin("admin", "/admin");
                  }}
                  className="w-full p-4 bg-gradient-to-r from-amber-500/20 via-gold/25 to-amber-500/20 border-2 border-gold hover:border-white text-gold hover:text-white font-black text-xs uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer shadow-xl rounded-none group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded bg-gold text-black flex items-center justify-center font-extrabold text-lg shadow-md group-hover:scale-105 transition-transform">
                      👑
                    </div>
                    <div className="text-left">
                      <span className="block font-bold leading-tight text-white group-hover:text-gold transition-colors">CEO Admin Dashboard</span>
                      <span className="text-[9px] text-gray-300 font-mono font-normal block">Sales, CRM, Events, Finance & AI Assistant</span>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-gold group-hover:translate-x-1 transition-transform" />
                </a>

                <a
                  href="/staff"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDirectLogin("staff", "/staff");
                  }}
                  className="w-full p-4 bg-gradient-to-r from-blue-500/20 via-indigo-500/25 to-blue-500/20 border-2 border-blue-400/80 hover:border-white text-blue-300 hover:text-white font-black text-xs uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer shadow-xl rounded-none group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded bg-blue-500 text-white flex items-center justify-center font-extrabold text-lg shadow-md group-hover:scale-105 transition-transform">
                      🛡️
                    </div>
                    <div className="text-left">
                      <span className="block font-bold leading-tight text-white group-hover:text-blue-300 transition-colors">Staff Operations Dashboard</span>
                      <span className="text-[9px] text-gray-300 font-mono font-normal block">Logistics, Tasks, Vendors & Schedules</span>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-blue-400 group-hover:translate-x-1 transition-transform" />
                </a>

                <a
                  href="/dashboard"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDirectLogin("customer", "/dashboard");
                  }}
                  className="w-full p-4 bg-gradient-to-r from-emerald-500/20 via-teal-500/25 to-emerald-500/20 border-2 border-emerald-400/80 hover:border-white text-emerald-300 hover:text-white font-black text-xs uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer shadow-xl rounded-none group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded bg-emerald-500 text-black flex items-center justify-center font-extrabold text-lg shadow-md group-hover:scale-105 transition-transform">
                      👤
                    </div>
                    <div className="text-left">
                      <span className="block font-bold leading-tight text-white group-hover:text-emerald-400 transition-colors">Client Portal Dashboard</span>
                      <span className="text-[9px] text-gray-300 font-mono font-normal block">My Bookings, Tickets, Passes & Briefs</span>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-emerald-400 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          )}

          {/* SIGN IN WITH GOOGLE */}
          <div className="space-y-3">
            <button
              type="button"
              disabled={googleSubmitting}
              onClick={handleGoogleSignIn}
              className="w-full h-14 bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-3 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{googleSubmitting ? "Connecting to Google..." : "Sign In With Google"}</span>
            </button>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-300 dark:border-white/10"></div>
            <span className="flex-shrink mx-4 text-[9px] text-muted-foreground uppercase font-black tracking-widest">
              OR LOGIN WITH EMAIL
            </span>
            <div className="flex-grow border-t border-slate-300 dark:border-white/10"></div>
          </div>

          {/* EMAIL & PASSWORD FORM */}
          <form onSubmit={onSubmit} className="space-y-6" noValidate>
            <div className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="signin-email" className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground block">
                  Email Address
                </label>
                <input
                  id="signin-email"
                  name="email"
                  type="email"
                  maxLength={255}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full h-14 bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-none px-5 text-xs font-bold text-foreground focus:border-gold outline-none transition-all placeholder:text-muted-foreground/40"
                />
                {errors.email && <p className="text-[9px] font-bold text-rose-500 uppercase tracking-widest">{errors.email}</p>}
              </div>

              <div className="space-y-2 relative">
                <label htmlFor="signin-password" className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground block">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="signin-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    maxLength={128}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full h-14 bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-none px-5 pr-12 text-xs font-bold text-foreground focus:border-gold outline-none transition-all placeholder:text-muted-foreground/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-[9px] font-bold text-rose-500 uppercase tracking-widest">{errors.password}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-16 rounded-none bg-gold text-black font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-black hover:text-gold transition-all shadow-xl shadow-gold/20 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? <Loader2 size={20} className="animate-spin" /> : <>Sign In To Command <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex flex-col items-center gap-3 text-center">
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">New to TOQUE REAL EVENTS LIMITED?</p>
            <Link
              to="/sign-up"
              className="h-12 px-8 border border-slate-300 dark:border-white/10 text-foreground hover:border-gold font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center transition-all cursor-pointer w-full"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
