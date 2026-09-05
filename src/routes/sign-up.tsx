import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { Loader2, ShieldCheck, ArrowRight, Check, Eye, EyeOff, AlertCircle, UserPlus } from "lucide-react";
import { createPageSeo } from "../lib/seo";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/sign-up")({
  head: () => ({
    ...createPageSeo({
      title: "Sign Up | Royal Touch Events Nairobi",
      description: "Join Royal Touch Events. Create your account to access Nairobi's premier event planning and production services.",
      path: "/sign-up",
      noindex: true,
    }),
  }),
  component: SignUp,
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

const schema = z
  .object({
    name: z.string().trim().min(2, "Enter your full name").max(100),
    email: z.string().trim().email("Enter a valid email").max(255),
    password: z.string().min(8, "Password must be at least 8 characters").max(128),
    confirmPassword: z.string().min(8).max(128),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function SignUp() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [authError, setAuthError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{ email: string; password: string } | null>(null);
  const [countdown, setCountdown] = useState(5);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    if (auth?.user) {
      const to = auth.profile?.role === "admin" ? "/admin" : "/dashboard";
      navigate({ to });
    }
  }, [auth?.user, auth?.profile?.role, navigate]);

  // Password Visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password Strength
  const [password, setPassword] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % heroImages.length);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (successData && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (successData && countdown === 0) {
      navigate({
        to: "/sign-in",
        search: {
          email: successData.email,
          password: successData.password
        }
      });
    }
  }, [successData, countdown, navigate]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAuthError("");
    const fd = new FormData(e.currentTarget);
    const signupData = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      password: password,
      confirmPassword: String(fd.get("confirmPassword") || ""),
    };
    const res = schema.safeParse(signupData);
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
      await auth.signUp(res.data.email, res.data.password, res.data.name);
      setSuccessData({ email: res.data.email, password: res.data.password });
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Could not create account.");
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

      {/* Success Popup */}
      {successData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md px-4">
          <div className="bg-white dark:bg-[#121722] border border-gold/40 p-10 sm:p-14 rounded-none max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-500 text-center space-y-6">
            <div className="mx-auto h-20 w-20 bg-emerald-500 text-black flex items-center justify-center shadow-2xl">
              <Check size={40} />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-black uppercase tracking-tight text-emerald-500">
                Registration Complete!
              </h2>
              <p className="text-slate-600 dark:text-gray-300 font-medium text-xs leading-relaxed">
                Your account is ready. Redirecting to the secure sign-in gateway in <span className="text-emerald-500 font-black">{countdown}s</span>.
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/sign-in"
                search={{ email: successData.email, password: successData.password }}
                className="h-12 px-8 bg-gold text-black font-black uppercase tracking-widest text-[10px] inline-flex items-center gap-2 hover:bg-black hover:text-gold transition-all shadow-md"
              >
                Proceed To Sign In <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 w-full max-w-xl py-12">
        <div className="text-center mb-8 space-y-4">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-none bg-gold/10 border border-gold/40 text-gold text-[10px] font-black uppercase tracking-[0.3em] shadow-sm">
              <ShieldCheck size={14} className="text-gold" /> Create Account · Royal Touch Registry
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-none text-[#0b0e14] dark:text-white">
            Sign <span className="text-gold font-display font-normal">Up.</span>
          </h1>
          <p className="text-slate-600 dark:text-gray-300 font-bold uppercase tracking-widest text-[10px]">
            Join Nairobi's premier event planning & ticketing platform
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
              <AuthField label="Full Legal Name" name="name" id="signup-name" error={errors.name} />
              <AuthField label="Email Address" name="email" id="signup-email" type="email" error={errors.email} />

              <div className="space-y-2 relative">
                <AuthField
                  label="Password"
                  name="password"
                  id="signup-password"
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

              <div className="space-y-2 relative">
                <AuthField
                  label="Confirm Password"
                  name="confirmPassword"
                  id="signup-confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  error={errors.confirmPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-[38px] text-muted-foreground hover:text-gold transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-16 rounded-none bg-gold text-black font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-black hover:text-gold transition-all shadow-xl shadow-gold/20 disabled:opacity-50 cursor-pointer mt-4"
            >
              {submitting ? <Loader2 size={20} className="animate-spin" /> : <>Create Executive Account <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex flex-col items-center gap-3 text-center">
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Already have an account?</p>
            <Link
              to="/sign-in"
              className="h-12 px-8 border border-slate-300 dark:border-white/10 text-foreground hover:border-gold font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center transition-all cursor-pointer w-full"
            >
              Sign In
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
  onChange
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
        value={value}
        onChange={onChange}
        maxLength={255}
        placeholder={`Enter ${label.toLowerCase()}`}
        className="w-full h-14 bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-none px-5 text-xs font-bold text-foreground focus:border-gold outline-none transition-all placeholder:text-muted-foreground/40"
      />
      {error && <p className="text-[9px] font-bold text-rose-500 uppercase tracking-widest">{error}</p>}
    </div>
  );
}
