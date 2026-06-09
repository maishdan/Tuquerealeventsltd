import "@fontsource/instrument-serif/400.css";
import "@fontsource/work-sans/300.css";
import "@fontsource/work-sans/400.css";
import "@fontsource/work-sans/500.css";
import "@fontsource/work-sans/600.css";
import "../styles.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import bgVenue from "../assets/bg-venue.jpg";
import homeBackground from "../assets/background.png";
import { reportLovableError } from "../lib/lovable-error-reporting";
import {
  SITE_NAME,
  SITE_TAGLINE,
  createPageSeo,
  defaultSiteLinks,
  organizationJsonLd,
  servicesJsonLd,
} from "../lib/seo";
import { AuthProvider } from "../contexts/AuthContext";
import { Header } from "../components/site/Header";
import { Footer } from "../components/site/Footer";
import { WhatsAppButton } from "../components/site/WhatsAppButton";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground">Go home</Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong on our end.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground">Try again</button>
          <a href="/" className="rounded-full border border-border px-5 py-2 text-sm">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => {
    const seo = createPageSeo({
      title: `${SITE_NAME} — Premium Event Planning Nairobi, Kenya`,
      description: `${SITE_TAGLINE} Full-service event production: weddings, corporate events, concerts, decoration, sound & lighting, photography and entertainment in Nairobi.`,
      path: "/",
      keywords:
        "event planning Nairobi, wedding planner Kenya, corporate events Nairobi, concert production, Royal Touch Events",
    });

    return {
      meta: [{ charSet: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }, ...seo.meta],
      links: [...defaultSiteLinks(), ...seo.links],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(organizationJsonLd()),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(servicesJsonLd()),
        },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";
  const isDashboard = pathname.startsWith("/admin") || pathname.startsWith("/dashboard");

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
      {isDashboard ? (
        <Outlet />
      ) : (
        <div className="relative min-h-screen flex flex-col overflow-x-hidden">
          <div aria-hidden className="fixed inset-0 z-0 pointer-events-none">
            <img
              src={isHome ? homeBackground : bgVenue}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div
              className={`absolute inset-0 ${
                isHome
                  ? "bg-[linear-gradient(180deg,oklch(0.10_0.04_280/0.15),oklch(0.10_0.04_280/0.45))]"
                  : "bg-[linear-gradient(180deg,oklch(0.10_0.04_280/0.35),oklch(0.10_0.04_280/0.65))]"
              }`}
            />
          </div>

          <div className="relative z-10 flex flex-col flex-1 min-h-screen">
            <Header />
            <main className="flex-1 min-w-0 pt-16 sm:pt-20">
              <Outlet />
            </main>
            <Footer />
            <WhatsAppButton />
          </div>
        </div>
      )}
      </AuthProvider>
    </QueryClientProvider>
  );
}
