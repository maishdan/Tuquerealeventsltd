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
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const hasRedirectedRef = useRef(false);

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

          {/* DIRECT BYPASS DASHBOARD BUTTONS */}
          <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-2 font-sans">
            <span className="text-[10px] font-black uppercase text-gold tracking-widest block text-center">
              ⚡ Instant Direct Dashboard Access (No Password Required)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  auth?.directLoginAs("admin");
                  navigate({ to: "/admin" });
                }}
                className="py-3 px-2 bg-[#f4cf69]/15 border border-[#f4cf69] text-[#f4cf69] hover:bg-[#f4cf69] hover:text-black font-black text-[10px] uppercase tracking-wider rounded-none transition-all cursor-pointer shadow text-center"
              >
                👑 CEO Admin Portal
              </button>

              <button
                type="button"
                onClick={() => {
                  auth?.directLoginAs("staff");
                  navigate({ to: "/staff" });
                }}
                className="py-3 px-2 bg-emerald-500/15 border border-emerald-400 text-emerald-400 hover:bg-emerald-500 hover:text-black font-black text-[10px] uppercase tracking-wider rounded-none transition-all cursor-pointer shadow text-center"
              >
                ⚙️ Staff Operations
              </button>

              <button
                type="button"
                onClick={() => {
                  auth?.directLoginAs("customer");
                  navigate({ to: "/dashboard" });
                }}
                className="py-3 px-2 bg-sky-500/15 border border-sky-400 text-sky-400 hover:bg-sky-500 hover:text-black font-black text-[10px] uppercase tracking-wider rounded-none transition-all cursor-pointer shadow text-center"
              >
                👤 Client Portal
              </button>
            </div>
          </div>

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
