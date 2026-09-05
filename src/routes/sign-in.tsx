import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
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

export function SignIn() {
  const navigate = useNavigate();
  const auth = useAuth();
  const search = Route.useSearch();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [authError, setAuthError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (auth?.user) {
      const to = auth.profile?.role === "admin" ? "/admin" : "/dashboard";
      navigate({ to });
    }
  }, [auth?.user, auth?.profile?.role, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % heroImages.length);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAuthError("");
    const fd = new FormData(e.currentTarget);
    const res = schema.safeParse({
      email: String(fd.get("email") || ""),
      password: String(fd.get("password") || ""),
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
      if (role === "admin") {
        navigate({ to: "/admin" });
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
    <div className="relative min-w-0 bg-[#f8fafc] dark:bg-[#0b0e14] text-foreground font-sans min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 overflow-x-hidden">
      {/* Hero Background Images */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((src, idx) => (
          <img
            key={src}
            src={src}
            alt=""
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-[2500ms] ease-in-out scale-105",
              idx === currentImgIndex ? "opacity-15 dark:opacity-25" : "opacity-0"
            )}
          />
        ))}
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
                defaultValue={search.email}
              />

              <div className="space-y-2 relative">
                <AuthField
                  label="Password"
                  name="password"
                  id="signin-password"
                  type={showPassword ? "text" : "password"}
                  error={errors.password}
                  defaultValue={search.password}
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
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">New to Royal Touch Events?</p>
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
  defaultValue
}: {
  label: string;
  name: string;
  id: string;
  type?: string;
  error?: string;
  defaultValue?: string;
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
        defaultValue={defaultValue}
        placeholder={`Enter ${label.toLowerCase()}`}
        className="w-full h-14 bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-none px-5 text-xs font-bold text-foreground focus:border-gold outline-none transition-all placeholder:text-muted-foreground/40"
      />
      {error && <p className="text-[9px] font-bold text-rose-500 uppercase tracking-widest">{error}</p>}
    </div>
  );
}
