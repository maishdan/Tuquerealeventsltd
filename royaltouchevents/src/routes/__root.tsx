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
import { AlertCircle, ChevronUp } from "lucide-react";

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
import { ThemeProvider } from "../contexts/ThemeContext";
import { FavoritesProvider } from "../contexts/FavoritesContext";
import { Header } from "../components/site/Header";
import { Footer } from "../components/site/Footer";
import { cn } from "@/lib/utils";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0e14] px-4 font-sans">
      <div className="max-w-md text-center space-y-6">
        <h1 className="font-display text-8xl text-gold font-black tracking-tighter">404</h1>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-white uppercase tracking-widest">Route Not Found</h2>
          <p className="text-sm text-gray-500 uppercase tracking-widest leading-loose">The requested sector of the Royal Touch engine is unavailable.</p>
        </div>
        <div className="pt-4">
          <Link to="/" className="inline-flex h-14 px-10 items-center rounded-full bg-gold text-[#0b0e14] text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-2xl">Return to Command</Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error("CRITICAL SYSTEM ERROR:", error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0e14] text-white px-4 font-sans">
      <div className="max-w-2xl w-full glass-strong p-12 rounded-[40px] border border-red-500/30 text-center space-y-8">
        <div className="mx-auto h-20 w-20 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center border border-red-500/30">
          <AlertCircle size={40} />
        </div>
        <div className="space-y-4">
          <h1 className="font-display text-4xl md:text-6xl uppercase font-black tracking-tighter leading-tight text-white">System Malfunction.</h1>
          <p className="text-gray-400 text-sm font-mono bg-black/40 p-4 rounded-xl border border-white/5 overflow-auto max-h-40">
            {error.message || "An unexpected critical error has occurred in the Royal Touch engine."}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="h-14 px-10 rounded-full bg-red-600 text-white font-black uppercase tracking-widest text-[10px] hover:bg-red-700 transition-all shadow-2xl"
          >
            Reboot Application
          </button>
          <a
            href="/"
            className="h-14 px-10 rounded-full border border-white/10 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all flex items-center justify-center"
          >
            Return to Base
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => {
    const seo = createPageSeo({
      title: `${SITE_NAME} — Premium Event Planning Nairobi, Kenya`,
      description: `${SITE_TAGLINE} Full-service event production in Nairobi.`,
      path: "/",
      keywords: "event planning Nairobi, Royal Touch Events",
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

function SystemLockdown404Screen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8f9fa] dark:bg-[#111111] text-[#6c757d] font-sans p-6 text-center select-none">
      <div className="max-w-md space-y-6 flex flex-col items-center">
        {/* Sad Face Icon */}
        <div className="w-32 h-32 rounded-full border-4 border-[#888888] flex items-center justify-center text-[#888888]">
          <svg className="w-20 h-20 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 0zM8.5 8C7.67 8 7 8.67 7 9.5S7.67 11 8.5 11 10 10.33 10 9.5 9.33 8 8.5 8zm7 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5S16.33 8 15.5 8zm-7 10c2.33-1.67 4.67-1.67 7 0 .39.28.93.2 1.21-.19.28-.39.2-.93-.19-1.21-3.03-2.18-6.03-2.18-9.06 0-.39.28-.47.82-.19 1.21.28.39.82.47 1.21.19z"/>
          </svg>
        </div>

        <h1 className="text-7xl font-light text-[#777777] tracking-tight">
          404
        </h1>

        <div className="space-y-2">
          <p className="text-2xl font-normal text-[#888888]">
            Page not found
          </p>
          <p className="text-xs text-[#999999] max-w-sm font-sans leading-relaxed">
            The Page you are looking for doesn't exist or an other error occurred.
          </p>
        </div>
      </div>
    </div>
  );
}

function RootComponent() {
  // EMERGENCY SYSTEM LOCKDOWN SWITCH - SET TO FALSE TO RESTORE SYSTEM
  const IS_EMERGENCY_LOCKDOWN = false;

  if (IS_EMERGENCY_LOCKDOWN) {
    return <SystemLockdown404Screen />;
  }

  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLoading = useRouterState({ select: (s) => s.isLoading });
  const isDashboard = pathname.startsWith("/admin") || pathname.startsWith("/dashboard");
  const isHome = pathname === "/";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <FavoritesProvider>
          <AuthProvider>
            <div className="min-h-screen bg-background text-foreground selection:bg-gold/30">
              {/* TOP ROUTE TRANSITION PROGRESS BAR */}
              {isLoading && (
                <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d5a637] via-[#f4cf69] to-emerald-400 z-[999999] animate-pulse" />
              )}

              <div className="relative flex flex-col min-h-screen">
                {!isDashboard && <Header variant={isHome ? "light" : "dark"} />}
                <main className={cn("flex-1", !isDashboard && "pt-20")}>
                  <Outlet />
                </main>
                {!isDashboard && <Footer />}

                {/* Golden Scroll to Top Button */}
                <button
                  onClick={scrollToTop}
                  className="fixed bottom-40 right-6 z-[9999] h-14 w-14 rounded-full bg-gold text-[#0b0e14] flex items-center justify-center shadow-[0_10px_40px_rgba(212,175,55,0.4)] hover:scale-110 transition-all active:scale-95 animate-bounce group border-2 border-white/20"
                  title="Return to Command Center"
                >
                  <ChevronUp size={28} className="group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
            </div>
          </AuthProvider>
        </FavoritesProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
