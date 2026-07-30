import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { Loader2, ShieldCheck, ArrowRight, Check, Eye, EyeOff, AlertCircle } from "lucide-react";
import { createPageSeo } from "../lib/seo";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/sign-up")({
  head: () => ({
    ...createPageSeo({
      title: "Sign Up | Royal Touch Events",
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
  const [strength, setStrength] = useState(0); // 0 to 100

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

  const requirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One lowercase letter", met: /[a-z]/.test(password) },
    { label: "One number", met: /[0-9]/.test(password) },
    { label: "One special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div className="bg-[#0b0e14] text-white font-sans min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 z-0">
        {heroImages.map((src, idx) => (
          <img
            key={src}
            src={src}
            alt=""
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-[3000ms] ease-in-out",
              idx === currentImgIndex ? "opacity-40 scale-105" : "opacity-0 scale-100"
            )}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0e14]/80 via-[#0b0e14]/40 to-[#0b0e14]" />
      </div>

      {/* Success Popup */}
      {successData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
           <div className="bg-emerald-500/10 border border-emerald-500/30 p-10 rounded-[40px] max-w-lg w-full shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in duration-500 text-center space-y-6">
              <div className="mx-auto h-20 w-20 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
                <Check size={40} />
              </div>
              <div className="space-y-3">
                 <h2 className="text-3xl font-display font-black uppercase tracking-tight text-emerald-400">Successful Register.</h2>
                 <p className="text-gray-300 font-medium leading-relaxed">Please check your email for confirmation. You will be redirected to the secure login gateway in <span className="text-emerald-400 font-black">{countdown}s</span>.</p>
              </div>
              <div className="pt-2">
                 <Link
                  to="/sign-in"
                  search={{ email: successData.email, password: successData.password }}
                  className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 hover:text-white transition-colors"
                 >
                    Manual Redirect <ArrowRight size={14} />
                 </Link>
              </div>
           </div>
        </div>
      )}

      <div className="relative z-10 w-full max-w-xl py-12">
        <div className="text-center mb-10 space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
           <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase leading-none">Sign <span className="text-gold">Up.</span></h1>
           <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Create your Royal Touch account</p>
        </div>

        <div className="bg-[#121212]/90 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-[40px] shadow-2xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {authError && (
            <div className="p-5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-3">
              <AlertCircle size={16} />
              <p>{authError}</p>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6" noValidate>
            <div className="space-y-5">
               <AuthField label="Full Name" name="name" id="signup-name" error={errors.name} />
               <AuthField label="Email Address" name="email" id="signup-email" type="email" error={errors.email} />

               <div className="space-y-3">
                  <div className="relative">
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
                      className="absolute right-4 top-[48px] text-gray-500 hover:text-gold transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* Password Strength Bar */}
                  <div className="px-4 space-y-2">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                       <span className="text-gray-500">Security Strength</span>
                       <span className={cn(
                         strength < 40 ? "text-rose-500" : strength < 80 ? "text-amber-500" : "text-emerald-500"
                       )}>
                         {strength < 40 ? "Weak" : strength < 80 ? "Medium" : "Strong"}
                       </span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <div
                         className={cn(
                           "h-full transition-all duration-500 rounded-full",
                           strength < 40 ? "bg-rose-500" : strength < 80 ? "bg-amber-500" : "bg-emerald-500"
                         )}
                         style={{ width: `${strength}%` }}
                       />
                    </div>
                  </div>
               </div>

               <div className="relative">
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
                    className="absolute right-4 top-[48px] text-gray-500 hover:text-gold transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
               </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-16 rounded-full bg-gold text-[#0b0e14] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-[0_0_40px_rgba(212,175,55,0.2)] disabled:opacity-50 mt-4"
            >
              {submitting ? <Loader2 size={20} className="animate-spin" /> : <>Sign Up <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="pt-6 border-t border-white/5 flex flex-col items-center gap-4">
             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Already have an account?</p>
             <Link to="/sign-in" className="text-gold font-black uppercase tracking-[0.2em] text-xs hover:text-white transition-colors">
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
      <label htmlFor={id} className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        maxLength={255}
        placeholder={`Enter ${label.toLowerCase()}`}
        className="w-full h-14 bg-[#1a1a1a] border border-white/5 rounded-2xl px-6 text-sm text-white focus:border-gold outline-none transition-all placeholder:text-gray-700"
      />
      {error && <p className="mt-1 text-[9px] font-bold text-rose-500 uppercase tracking-widest ml-4">{error}</p>}
    </div>
  );
}
