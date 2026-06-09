import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { LogIn } from "lucide-react";
import { createPageSeo } from "../lib/seo";

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
    setSubmitted(true);
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

        {submitted ? (
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Sign-in is coming soon. For now, please{" "}
            <Link to="/contact" className="text-gold hover:underline">
              contact us
            </Link>{" "}
            or{" "}
            <Link to="/booking" className="text-gold hover:underline">
              book an event
            </Link>
            .
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
              <input
                name="email"
                type="email"
                autoComplete="email"
                maxLength={255}
                className="mt-2 w-full rounded-xl bg-background/60 border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold/60"
              />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Password</label>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                maxLength={128}
                className="mt-2 w-full rounded-xl bg-background/60 border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold/60"
              />
              {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
            >
              Sign In
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link to="/sign-up" className="text-gold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
}
