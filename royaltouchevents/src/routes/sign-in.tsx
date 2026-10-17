import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { Loader2, ShieldCheck, ArrowRight, Eye, EyeOff, AlertCircle, Lock, User } from "lucide-react";
import { createPageSeo } from "../lib/seo";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

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
  const [directLoading, setDirectLoading] = useState<"admin" | "staff" | "customer" | null>(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const hasRedirectedRef = useRef(false);

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
    const res = schema.safeParse({
      email,
      password,
    });
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
      {/* Hero Background Image */}
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
            <div className="p-4 rounded-none bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-bold flex items-center gap-3">
              <AlertCircle size={18} />
              <p>{authError}</p>
            </div>
          )}

          {/* DIRECT ONE-CLICK DASHBOARD ACCESS (NO PASSWORD REQUIRED) */}
          <div className="p-5 bg-black/40 border border-gold/40 rounded-none space-y-4">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-black uppercase text-gold tracking-[0.25em] font-mono block">
                ⚡ INSTANT ONE-CLICK ACCESS
              </span>
              <p className="text-xs font-bold text-white uppercase tracking-wider">
                Direct Dashboard Portals (No Password Required)
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {/* 1. CEO / ADMIN DASHBOARD */}
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

              {/* 2. STAFF & OPERATIONS DASHBOARD */}
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

              {/* 3. CLIENT / CUSTOMER PORTAL */}
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

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-300 dark:border-white/10"></div>
            <span className="flex-shrink mx-4 text-[9px] text-muted-foreground uppercase font-black tracking-widest">
              OR LOGIN WITH CREDENTIALS
            </span>
            <div className="flex-grow border-t border-slate-300 dark:border-white/10"></div>
          </div>

          <form onSubmit={onSubmit} className="space-y-6" noValidate>
            <div className="space-y-5">
              <AuthField
                label="Email Address"
                name="email"
                id="signin-email"
                type="email"
                error={errors.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="space-y-2 relative">
                <AuthField
                  label="Password"
                  name="password"
                  id="signin-password"
                  type={showPassword ? "text" : "password"}
                  error={errors.password}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[38px] text-muted-foreground hover:text-gold transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
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

function AuthField({
  label,
  name,
  id,
  type = "text",
  error,
  value,
  onChange,
}: {
  label: string;
  name: string;
  id: string;
  type?: string;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground block">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        maxLength={255}
        value={value}
        onChange={onChange}
        placeholder={`Enter ${label.toLowerCase()}`}
        className="w-full h-14 bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-none px-5 text-xs font-bold text-foreground focus:border-gold outline-none transition-all placeholder:text-muted-foreground/40"
      />
      {error && <p className="text-[9px] font-bold text-rose-500 uppercase tracking-widest">{error}</p>}
    </div>
  );
}
