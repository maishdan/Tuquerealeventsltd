import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Loader2, LogIn } from "lucide-react";
import { createPageSeo } from "../lib/seo";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/sign-in")({
  head: () => ({
    ...createPageSeo({
      title: "Sign In",
      description:
        "Sign in to your Royal Touch Events account to manage bookings, inquiries and event planning details.",
      path: "/sign-in",
      keywords: "Royal Touch Events login, client portal, event account Nairobi",
      noindex: true,
    }),
  }),
  component: SignIn,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

function SignIn() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [authError, setAuthError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      const role = await signIn(res.data.email, res.data.password);
      navigate({ to: role === "admin" ? "/admin" : "/dashboard" });
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Sign in failed. Check your email and password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 sm:px-6 py-12 sm:py-16">
      <div className="rounded-2xl border border-white/15 glass-strong p-8 sm:p-10">
        <div className="mx-auto h-12 w-12 rounded-full bg-primary/15 text-gold flex items-center justify-center">
          <LogIn size={22} />
        </div>
        <h1 className="mt-6 font-display text-3xl sm:text-4xl text-center">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground text-center">
          Sign in to access your Royal Touch Events account.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
          {authError && (
            <p className="text-sm text-destructive rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3">{authError}</p>
          )}
          <div>
            <label htmlFor="signin-email" className="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
            <input
              id="signin-email"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={255}
              placeholder="you@example.com"
              className="mt-2 w-full rounded-xl bg-background/60 border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold/60"
            />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="signin-password" className="text-xs uppercase tracking-widest text-muted-foreground">Password</label>
            <input
              id="signin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              maxLength={128}
              placeholder="Your password"
              className="mt-2 w-full rounded-xl bg-background/60 border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold/60"
            />
            {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition disabled:opacity-60"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link to="/sign-up" className="text-gold hover:underline">
            Sign up
          </Link>
        </p>

        {/* Developer Bypass Buttons */}
        <div className="mt-10 pt-6 border-t border-white/10 space-y-4">
          <p className="text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
            Development Access
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/admin"
              className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 p-3 text-center transition hover:bg-white/10 hover:border-gold/30"
            >
              <span className="text-xs font-bold text-gold">Admin</span>
              <span className="text-[10px] text-muted-foreground">Dashboard</span>
            </Link>
            <Link
              to="/dashboard"
              className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 p-3 text-center transition hover:bg-white/10 hover:border-gold/30"
            >
              <span className="text-xs font-bold text-gold">Customer</span>
              <span className="text-[10px] text-muted-foreground">Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
