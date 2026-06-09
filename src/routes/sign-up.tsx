import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Loader2, UserPlus } from "lucide-react";
import { createPageSeo } from "../lib/seo";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/sign-up")({
  head: () => ({
    ...createPageSeo({
      title: "Sign Up",
      description:
        "Create your Royal Touch Events account to plan weddings, corporate events, concerts and private celebrations in Nairobi.",
      path: "/sign-up",
      keywords: "Royal Touch Events register, create account, event planning Nairobi",
      noindex: true,
    }),
  }),
  component: SignUp,
});

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
      setTimeout(() => navigate({ to: "/sign-in" }), 2500);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Could not create account.");
    } finally {
      setSubmitting(false);
    }
  }

  if (checkEmail) {
    return (
      <section className="mx-auto max-w-md px-4 sm:px-6 py-12 text-center">
        <div className="rounded-2xl border border-white/15 glass-strong p-8">
          <h1 className="font-display text-3xl">Check your email</h1>
          <p className="mt-3 text-sm text-muted-foreground">Confirm your account, then sign in to open your dashboard.</p>
          <Link to="/sign-in" className="mt-6 inline-flex rounded-full bg-gold text-background px-5 py-2.5 text-sm font-medium">Go to Sign In</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-md px-4 sm:px-6 py-12 sm:py-16">
      <div className="rounded-2xl border border-white/15 glass-strong p-8 sm:p-10">
        <div className="mx-auto h-12 w-12 rounded-full bg-primary/15 text-gold flex items-center justify-center">
          <UserPlus size={22} />
        </div>
        <h1 className="mt-6 font-display text-3xl sm:text-4xl text-center">Create account</h1>
        <p className="mt-2 text-sm text-muted-foreground text-center">
          Join Royal Touch Events to plan unforgettable moments.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
          {authError && (
            <p className="text-sm text-destructive rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3">{authError}</p>
          )}
          <div>
            <label htmlFor="signup-name" className="text-xs uppercase tracking-widest text-muted-foreground">Full Name</label>
            <input id="signup-name" name="name" type="text" autoComplete="name" maxLength={100} placeholder="Your full name" className="mt-2 w-full rounded-xl bg-background/60 border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold/60" />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="signup-email" className="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
            <input id="signup-email" name="email" type="email" autoComplete="email" maxLength={255} placeholder="you@example.com" className="mt-2 w-full rounded-xl bg-background/60 border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold/60" />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="signup-password" className="text-xs uppercase tracking-widest text-muted-foreground">Password</label>
            <input id="signup-password" name="password" type="password" autoComplete="new-password" maxLength={128} placeholder="At least 8 characters" className="mt-2 w-full rounded-xl bg-background/60 border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold/60" />
            {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
          </div>
          <div>
            <label htmlFor="signup-confirm" className="text-xs uppercase tracking-widest text-muted-foreground">Confirm Password</label>
            <input id="signup-confirm" name="confirmPassword" type="password" autoComplete="new-password" maxLength={128} placeholder="Repeat password" className="mt-2 w-full rounded-xl bg-background/60 border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold/60" />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-destructive">{errors.confirmPassword}</p>
            )}
          </div>
          <button type="submit" disabled={submitting} className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition disabled:opacity-60">
            {submitting && <Loader2 size={16} className="animate-spin" />}
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/sign-in" className="text-gold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
