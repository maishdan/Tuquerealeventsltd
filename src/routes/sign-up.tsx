import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { Loader2, UserPlus, ShieldCheck, ArrowRight, Check } from "lucide-react";
import { createPageSeo } from "../lib/seo";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/sign-up")({
  head: () => ({
    ...createPageSeo({
      title: "Establish Membership | Royal Touch Events",
      description:
        "Join Royal Touch Events. Create your account to access Nairobi's premier event planning and production services.",
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
  const { signUp } = useAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [authError, setAuthError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

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
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      password: String(fd.get("password") || ""),
      confirmPassword: String(fd.get("confirmPassword") || ""),
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
      await signUp(res.data.email, res.data.password, res.data.name);
      setCheckEmail(true);
      setTimeout(() => navigate({ to: "/sign-in" }), 3500);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Could not create account.");
    } finally {
      setSubmitting(false);
    }
  }

  if (checkEmail) {
    return (
      <div className="bg-[#0b0e14] min-h-screen flex flex-col items-center justify-center text-white px-4">
        <div className="max-w-xl w-full glass-strong p-12 rounded-[40px] border border-gold/30 text-center space-y-8 animate-in fade-in zoom-in duration-700">
          <div className="mx-auto h-20 w-20 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
            <Check size={40} />
          </div>
          <div className="space-y-4">
            <h1 className="font-display text-5xl md:text-7xl uppercase font-black tracking-tighter leading-tight">Verification Required.</h1>
            <p className="text-gray-400 text-lg">We have dispatched a verification link to your professional email. Please confirm your membership to proceed.</p>
          </div>
          <Link to="/sign-in" className="inline-flex items-center gap-2 text-gold font-black uppercase tracking-widest text-xs hover:text-white transition-colors">
            Proceed to Sign In <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0b0e14] text-white font-sans min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Background Switcher */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((src, idx) => (
          <img
            key={src}
            src={src}
            alt={`Auth Background ${idx}`}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[3000ms] ease-in-out ${
              idx === currentImgIndex ? "opacity-40 scale-105" : "opacity-0 scale-100"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0e14]/80 via-[#0b0e14]/40 to-[#0b0e14]" />
      </div>

      <div className="relative z-10 w-full max-w-xl">
        <div className="text-center mb-10 space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
           <div className="flex justify-center">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] font-black uppercase tracking-widest">
               <ShieldCheck size={12} /> Membership Registry
             </div>
           </div>
           <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase leading-none">Join the <br /><span className="text-gold">Firm.</span></h1>
        </div>

        <div className="bg-[#121212]/90 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-[40px] shadow-2xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {authError && (
            <div className="p-5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-3">
              <ShieldCheck size={16} />
              <p>{authError}</p>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6" noValidate>
            <div className="space-y-4">
               <AuthField label="Full Legal Name" name="name" id="signup-name" error={errors.name} />
               <AuthField label="Official Email" name="email" id="signup-email" type="email" error={errors.email} />
               <AuthField label="Establish Security Key" name="password" id="signup-password" type="password" error={errors.password} />
               <AuthField label="Verify Security Key" name="confirmPassword" id="signup-confirm" type="password" error={errors.confirmPassword} />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-16 rounded-full bg-gold text-[#0b0e14] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-[0_0_40px_rgba(212,175,55,0.2)] disabled:opacity-50"
            >
              {submitting ? <Loader2 size={20} className="animate-spin" /> : <>Register Membership <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="pt-6 border-t border-white/5 flex flex-col items-center gap-4">
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Already have an account?</p>
             <Link to="/sign-in" className="text-gold font-black uppercase tracking-[0.2em] text-xs hover:text-white transition-colors">
               Return to Access
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthField({ label, name, id, type = "text", error }: { label: string; name: string; id: string; type?: string; error?: string }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        maxLength={255}
        placeholder={`Enter ${label.toLowerCase()}`}
        className="w-full h-14 bg-[#1a1a1a] border border-white/5 rounded-2xl px-6 text-sm text-white focus:border-gold outline-none transition-all placeholder:text-gray-700"
      />
      {error && <p className="mt-1 text-[9px] font-bold text-destructive uppercase tracking-widest ml-4">{error}</p>}
    </div>
  );
}
