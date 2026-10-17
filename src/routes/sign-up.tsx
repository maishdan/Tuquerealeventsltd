import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { Loader2, ShieldCheck, ArrowRight, Check, Eye, EyeOff, AlertCircle } from "lucide-react";
import { createPageSeo } from "../lib/seo";
import { useAuth } from "@/contexts/AuthContext";

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

function SignUp() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [authError, setAuthError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{ email: string; password: string } | null>(null);
  const [countdown, setCountdown] = useState(5);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const hasRedirectedRef = useRef(false);

  const handleGoogleSignUp = async () => {
    setGoogleSubmitting(true);
    setAuthError("");
    try {
      if (auth?.signInWithGoogle) {
        await auth.signInWithGoogle();
      }
    } catch (err: any) {
      setAuthError(err?.message || "Google sign-up failed. Please try again.");
    } finally {
      setGoogleSubmitting(false);
    }
  };

  useEffect(() => {
    if (auth?.loading) return;
    if (auth?.user && auth?.profile) {
      if (hasRedirectedRef.current) return;
      hasRedirectedRef.current = true;

      const userEmail = auth.user.email?.toLowerCase();
      const isAdmin =
        auth.profile.role === "admin" ||
        auth.user.id === "2e4f72d4-e107-4d59-9342-4a97294be051" ||
        userEmail === "eventsroyaltouch7@gmail.com" ||
        userEmail === "maishdan4940@gmail.com" ||
        userEmail === "abigaelmuthoni29@gmail.com";

      const to = isAdmin ? "/admin" : "/dashboard";
      navigate({ to });
    }
  }, [auth?.loading, auth?.user, auth?.profile, navigate]);

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
          password: successData.password,
        },
      });
    }
  }, [successData, countdown, navigate]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAuthError("");
    const signupData = { name, email, password, confirmPassword };
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

          {/* SIGN IN WITH GOOGLE */}
          <div className="space-y-3">
            <button
              type="button"
              disabled={googleSubmitting}
              onClick={handleGoogleSignUp}
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
              <span>{googleSubmitting ? "Connecting to Google..." : "Sign Up With Google"}</span>
            </button>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-300 dark:border-white/10"></div>
            <span className="flex-shrink mx-4 text-[9px] text-muted-foreground uppercase font-black tracking-widest">
              OR REGISTER WITH EMAIL
            </span>
            <div className="flex-grow border-t border-slate-300 dark:border-white/10"></div>
          </div>

          <form onSubmit={onSubmit} className="space-y-6" noValidate>
            <div className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="signup-name" className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground block">
                  Full Legal Name
                </label>
                <input
                  id="signup-name"
                  name="name"
                  type="text"
                  maxLength={100}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full legal name"
                  className="w-full h-14 bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-none px-5 text-xs font-bold text-foreground focus:border-gold outline-none transition-all placeholder:text-muted-foreground/40"
                />
                {errors.name && <p className="text-[9px] font-bold text-rose-500 uppercase tracking-widest">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="signup-email" className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground block">
                  Email Address
                </label>
                <input
                  id="signup-email"
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
                <label htmlFor="signup-password" className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground block">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="signup-password"
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

              <div className="space-y-2 relative">
                <label htmlFor="signup-confirm" className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground block">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="signup-confirm"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    maxLength={128}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full h-14 bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-none px-5 pr-12 text-xs font-bold text-foreground focus:border-gold outline-none transition-all placeholder:text-muted-foreground/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-[9px] font-bold text-rose-500 uppercase tracking-widest">{errors.confirmPassword}</p>
                )}
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
