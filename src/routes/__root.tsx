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
        {
          children: `
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/6a6b3fa2a70ec81d5099831d/1jupf15bv';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
            })();
          `,
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
      <AuthProvider>
        <div className="min-h-screen bg-background text-foreground selection:bg-gold/30">
          <div className="relative flex flex-col min-h-screen">
            {!isDashboard && <Header variant={isHome ? "light" : "dark"} />}
            <main className={cn("flex-1", !isDashboard && "pt-20")}>
              <Outlet />
            </main>
            {!isDashboard && <Footer />}

            {/* Golden Scroll to Top Button - Positioned further up to clear the chat widget */}
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
    </QueryClientProvider>
  );
}
