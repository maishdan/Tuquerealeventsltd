import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, b as useRouterState, O as Outlet, H as HeadContent, S as Scripts, d as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { R as Root, P as Portal, C as Content, a as Close, T as Title, O as Overlay, D as Description } from "../_libs/radix-ui__react-dialog.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { M as Menu, P as Phone, a as Mail, b as MapPin, I as Instagram, F as Facebook, T as Twitter, c as MessageCircle, X } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
const bgVenue = "/assets/bg-venue-nImh2qTb.jpg";
const homeBackground = "/assets/background-DqonffPD.png";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
const eventsLogo = "/assets/events-logo-DmT2XvSK.jpeg";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const Sheet = Root;
const SheetPortal = Portal;
const SheetOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
SheetOverlay.displayName = Overlay.displayName;
const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
      }
    },
    defaultVariants: {
      side: "right"
    }
  }
);
const SheetContent = reactExports.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(SheetOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsxs(Content, { ref, className: cn(sheetVariants({ side }), className), ...props, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
    ] }),
    children
  ] })
] }));
SheetContent.displayName = Content.displayName;
const SheetHeader = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props });
SheetHeader.displayName = "SheetHeader";
const SheetTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title,
  {
    ref,
    className: cn("text-lg font-semibold text-foreground", className),
    ...props
  }
));
SheetTitle.displayName = Title.displayName;
const SheetDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
SheetDescription.displayName = Description.displayName;
const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" }
];
function Header() {
  const [open, setOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-40 glass border-b border-white/10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2 sm:gap-3 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative inline-flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 rounded-full overflow-hidden ring-1 ring-gold/40 shadow-[0_0_24px_oklch(0.82_0.13_85/0.35)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: eventsLogo, alt: "Royal Touch Events", className: "h-full w-full object-cover" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-lg sm:text-xl md:text-2xl leading-tight truncate", children: [
          "Royal ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-gold", children: "Touch" }),
          " Events"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "hidden md:flex items-center gap-8 text-sm", children: nav.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: n.to,
          activeOptions: { exact: n.to === "/" },
          activeProps: { className: "text-gold" },
          inactiveProps: { className: "text-muted-foreground hover:text-foreground transition" },
          children: n.label
        },
        n.to
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:flex items-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/booking", className: "inline-flex items-center rounded-full glass glass-gold px-5 py-2 text-sm font-medium text-gold hover:bg-gold/10 transition", children: "Book an Event" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "md:hidden shrink-0 inline-flex items-center justify-center h-10 w-10 rounded-lg text-foreground hover:bg-white/5 transition",
          onClick: () => setOpen(true),
          "aria-label": "Open menu",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { size: 22 })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      SheetContent,
      {
        side: "left",
        className: "glass-strong border-white/10 w-[min(85vw,320px)] p-0 gap-0 flex flex-col h-full",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SheetHeader, { className: "px-6 py-5 border-b border-white/10 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 pr-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex h-10 w-10 shrink-0 rounded-full overflow-hidden ring-1 ring-gold/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: eventsLogo, alt: "", className: "h-full w-full object-cover" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetTitle, { className: "font-display text-lg leading-tight", children: [
              "Royal ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-gold", children: "Touch" }),
              " Events"
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex flex-col px-4 py-4 gap-1", children: nav.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: n.to,
              onClick: () => setOpen(false),
              activeOptions: { exact: n.to === "/" },
              activeProps: { className: "bg-gold/10 text-gold border-gold/30" },
              inactiveProps: { className: "text-foreground/90 hover:bg-white/5 hover:text-foreground" },
              className: "rounded-xl px-4 py-3 text-base font-medium border border-transparent transition",
              children: n.label
            },
            n.to
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-auto px-4 pb-6 pt-2 border-t border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/booking",
              onClick: () => setOpen(false),
              className: "flex items-center justify-center rounded-full bg-gold text-background px-5 py-3 text-sm font-semibold hover:opacity-90 transition",
              children: "Book an Event"
            }
          ) })
        ]
      }
    ) })
  ] });
}
const daniwestIcon = "/assets/daniwest-icon-D7fMrNqX.png";
function Footer() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "mt-24 glass border-t border-white/10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 py-16 grid gap-12 md:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex h-12 w-12 rounded-full overflow-hidden ring-1 ring-gold/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: eventsLogo, alt: "Royal Touch Events", className: "h-full w-full object-cover" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-xl", children: [
            "Royal ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-gold", children: "Touch" }),
            " Events"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-muted-foreground max-w-xs italic", children: "We plan. You celebrate. We make it memorable." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm uppercase tracking-widest text-gold mb-4", children: "Explore" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/about", className: "hover:text-foreground", children: "About" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/services", className: "hover:text-foreground", children: "Services" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/portfolio", className: "hover:text-foreground", children: "Portfolio" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/blog", className: "hover:text-foreground", children: "Blog" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/booking", className: "hover:text-foreground", children: "Book an Event" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm uppercase tracking-widest text-gold mb-4", children: "Contact" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-3 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 14 }),
            " +254 795 365 334"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 14 }),
            " eventsroyaltouch7@gmail.com"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 14 }),
            " Nairobi, Kenya"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm uppercase tracking-widest text-gold mb-4", children: "Follow" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", "aria-label": "Instagram", className: "h-9 w-9 inline-flex items-center justify-center rounded-full glass hover:border-gold hover:text-gold transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Instagram, { size: 16 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", "aria-label": "Facebook", className: "h-9 w-9 inline-flex items-center justify-center rounded-full glass hover:border-gold hover:text-gold transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Facebook, { size: 16 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", "aria-label": "Twitter", className: "h-9 w-9 inline-flex items-center justify-center rounded-full glass hover:border-gold hover:text-gold transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Twitter, { size: 16 }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/booking", className: "mt-6 inline-flex items-center rounded-full bg-gold text-background px-5 py-2 text-sm font-medium hover:opacity-90 transition", children: "Get a Free Quote" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-white/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 py-6 text-xs text-muted-foreground flex flex-col md:flex-row gap-3 justify-between items-center text-center md:text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          "© ",
          (/* @__PURE__ */ new Date()).getFullYear(),
          " Royal Touch Events. All rights reserved."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex items-center gap-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/terms", className: "hover:text-gold", children: "Terms & Conditions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/privacy", className: "hover:text-gold", children: "Privacy Policy" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/copyright", className: "hover:text-gold", children: "Copyright" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mx-auto max-w-7xl px-4 sm:px-6 py-3 text-[10px] leading-relaxed text-muted-foreground/70 italic flex flex-wrap items-center justify-center gap-1.5 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: daniwestIcon,
            alt: "",
            "aria-hidden": true,
            className: "h-3.5 w-3.5 shrink-0 object-contain opacity-80"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Engineered by",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: "https://daniwesttechnologies.vercel.app",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "italic text-muted-foreground/90 hover:text-gold transition-colors",
              children: "Daniwest Tech Ltd"
            }
          ),
          " ",
          "2026. Securing the digital future, one innovation at a time."
        ] })
      ] }) })
    ] })
  ] });
}
function WhatsAppButton() {
  const phone = "254795365334";
  const msg = encodeURIComponent("Hi Royal Touch Events, I'd like to inquire about booking.");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "a",
    {
      href: `https://wa.me/${phone}?text=${msg}`,
      target: "_blank",
      rel: "noopener noreferrer",
      "aria-label": "Chat on WhatsApp",
      className: "fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-4 py-3 shadow-lg shadow-black/40 hover:scale-105 transition animate-float-slow",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 20 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline text-sm font-medium", children: "WhatsApp" })
      ]
    }
  );
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-7xl text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground", children: "Go home" }) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
        router.invalidate();
        reset();
      }, className: "rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground", children: "Try again" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/", className: "rounded-full border border-border px-5 py-2 text-sm", children: "Go home" })
    ] })
  ] }) });
}
const Route$b = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Royal Touch Events — Premium Event Planning Nairobi" },
      { name: "description", content: "Royal Touch Events plans weddings, corporate events, concerts and private parties in Nairobi — we plan, you celebrate, we make it memorable." },
      { property: "og:site_name", content: "Royal Touch Events" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Royal Touch Events — Premium Event Planning Nairobi" },
      { name: "twitter:title", content: "Royal Touch Events — Premium Event Planning Nairobi" },
      { property: "og:description", content: "We plan. You celebrate. We make it memorable." },
      { name: "twitter:description", content: "We plan. You celebrate. We make it memorable." }
    ],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Royal Touch Events",
        telephone: "+254795365334",
        address: { "@type": "PostalAddress", addressLocality: "Nairobi", addressCountry: "KE" },
        url: "/"
      })
    }]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", className: "dark", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$b.useRouteContext();
  const isHome = useRouterState({ select: (s) => s.location.pathname === "/" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen flex flex-col overflow-x-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "aria-hidden": true, className: "fixed inset-0 z-0 pointer-events-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: isHome ? homeBackground : bgVenue,
          alt: "",
          className: "absolute inset-0 h-full w-full object-cover object-center"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `absolute inset-0 ${isHome ? "bg-[linear-gradient(180deg,oklch(0.10_0.04_280/0.15),oklch(0.10_0.04_280/0.45))]" : "bg-[linear-gradient(180deg,oklch(0.10_0.04_280/0.35),oklch(0.10_0.04_280/0.65))]"}`
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex flex-col flex-1 min-h-screen", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(WhatsAppButton, {})
    ] })
  ] }) });
}
const $$splitComponentImporter$9 = () => import("./terms-CSP2yBj-.mjs");
const Route$a = createFileRoute("/terms")({
  head: () => ({
    meta: [{
      title: "Terms & Conditions — Royal Touch Events"
    }, {
      name: "description",
      content: "Terms and conditions for engaging Royal Touch Events for event planning and production services."
    }, {
      property: "og:title",
      content: "Terms & Conditions — Royal Touch Events"
    }, {
      property: "og:description",
      content: "Read our terms of engagement."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const BASE_URL = "";
const Route$9 = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/about", changefreq: "monthly", priority: "0.7" },
          { path: "/services", changefreq: "monthly", priority: "0.9" },
          { path: "/portfolio", changefreq: "weekly", priority: "0.8" },
          { path: "/booking", changefreq: "monthly", priority: "0.9" },
          { path: "/blog", changefreq: "weekly", priority: "0.6" },
          { path: "/contact", changefreq: "monthly", priority: "0.7" }
        ];
        const urls = entries.map(
          (e) => [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`
          ].filter(Boolean).join("\n")
        );
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`
        ].join("\n");
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" }
        });
      }
    }
  }
});
const $$splitComponentImporter$8 = () => import("./services-C3EBhgx7.mjs");
const Route$8 = createFileRoute("/services")({
  head: () => ({
    meta: [{
      title: "Services — Royal Touch Events"
    }, {
      name: "description",
      content: "Weddings, corporate events, concerts, decoration, sound & lighting, photography and more."
    }, {
      property: "og:title",
      content: "Services — Royal Touch Events"
    }, {
      property: "og:description",
      content: "Full-service event production across East Africa."
    }, {
      property: "og:url",
      content: "/services"
    }],
    links: [{
      rel: "canonical",
      href: "/services"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./privacy-BrjkXfMA.mjs");
const Route$7 = createFileRoute("/privacy")({
  head: () => ({
    meta: [{
      title: "Privacy Policy — Royal Touch Events"
    }, {
      name: "description",
      content: "How Royal Touch Events collects, uses and protects your personal information."
    }, {
      property: "og:title",
      content: "Privacy Policy — Royal Touch Events"
    }, {
      property: "og:description",
      content: "Your data, handled with care."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./portfolio-DdkeLlSz.mjs");
const Route$6 = createFileRoute("/portfolio")({
  head: () => ({
    meta: [{
      title: "Portfolio — Royal Touch Events"
    }, {
      name: "description",
      content: "Selected work — weddings, corporate galas, concerts, launches and bespoke productions."
    }, {
      property: "og:title",
      content: "Portfolio — Royal Touch Events"
    }, {
      property: "og:description",
      content: "A gallery of our work."
    }, {
      property: "og:url",
      content: "/portfolio"
    }],
    links: [{
      rel: "canonical",
      href: "/portfolio"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./copyright-Il3zz52f.mjs");
const Route$5 = createFileRoute("/copyright")({
  head: () => ({
    meta: [{
      title: "Copyright — Royal Touch Events"
    }, {
      name: "description",
      content: "Copyright notice for content, photography and brand assets of Royal Touch Events."
    }, {
      property: "og:title",
      content: "Copyright — Royal Touch Events"
    }, {
      property: "og:description",
      content: "Brand and content ownership notice."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./contact-B0VS0gIl.mjs");
const Route$4 = createFileRoute("/contact")({
  head: () => ({
    meta: [{
      title: "Contact Us — Royal Touch Events"
    }, {
      name: "description",
      content: "Reach Royal Touch Events by phone, email, WhatsApp, or visit our Nairobi studio."
    }, {
      property: "og:title",
      content: "Contact Us — Royal Touch Events"
    }, {
      property: "og:description",
      content: "Get in touch with our team."
    }, {
      property: "og:url",
      content: "/contact"
    }],
    links: [{
      rel: "canonical",
      href: "/contact"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./booking-B0PJCbCb.mjs");
const Route$3 = createFileRoute("/booking")({
  head: () => ({
    meta: [{
      title: "Book an Event — Royal Touch Events"
    }, {
      name: "description",
      content: "Tell us about your event and we'll send a tailored quote within 24 hours."
    }, {
      property: "og:title",
      content: "Book an Event — Royal Touch Events"
    }, {
      property: "og:description",
      content: "Start your event inquiry."
    }, {
      property: "og:url",
      content: "/booking"
    }],
    links: [{
      rel: "canonical",
      href: "/booking"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./blog-BokWYb-m.mjs");
const Route$2 = createFileRoute("/blog")({
  head: () => ({
    meta: [{
      title: "Blog & News — Royal Touch Events"
    }, {
      name: "description",
      content: "Event planning tips, industry trends and Royal Touch updates."
    }, {
      property: "og:title",
      content: "Blog & News — Royal Touch Events"
    }, {
      property: "og:description",
      content: "Tips, trends, and stories from behind the scenes."
    }, {
      property: "og:url",
      content: "/blog"
    }],
    links: [{
      rel: "canonical",
      href: "/blog"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./about-ZBKuTG1f.mjs");
const Route$1 = createFileRoute("/about")({
  head: () => ({
    meta: [{
      title: "About — Royal Touch Events"
    }, {
      name: "description",
      content: "Our story, mission and the team behind East Africa's most-loved event house."
    }, {
      property: "og:title",
      content: "About — Royal Touch Events"
    }, {
      property: "og:description",
      content: "Our story, mission and team."
    }, {
      property: "og:url",
      content: "/about"
    }],
    links: [{
      rel: "canonical",
      href: "/about"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-C_mVVwbT.mjs");
const Route = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Royal Touch Events — Premium Event Planning in Nairobi"
    }, {
      name: "description",
      content: "Weddings, corporate galas, concerts and launches — beautifully produced end to end."
    }, {
      property: "og:title",
      content: "Royal Touch Events — Premium Event Planning"
    }, {
      property: "og:description",
      content: "Beautifully produced events end to end."
    }, {
      property: "og:url",
      content: "/"
    }],
    links: [{
      rel: "canonical",
      href: "/"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const TermsRoute = Route$a.update({
  id: "/terms",
  path: "/terms",
  getParentRoute: () => Route$b
});
const SitemapDotxmlRoute = Route$9.update({
  id: "/sitemap.xml",
  path: "/sitemap.xml",
  getParentRoute: () => Route$b
});
const ServicesRoute = Route$8.update({
  id: "/services",
  path: "/services",
  getParentRoute: () => Route$b
});
const PrivacyRoute = Route$7.update({
  id: "/privacy",
  path: "/privacy",
  getParentRoute: () => Route$b
});
const PortfolioRoute = Route$6.update({
  id: "/portfolio",
  path: "/portfolio",
  getParentRoute: () => Route$b
});
const CopyrightRoute = Route$5.update({
  id: "/copyright",
  path: "/copyright",
  getParentRoute: () => Route$b
});
const ContactRoute = Route$4.update({
  id: "/contact",
  path: "/contact",
  getParentRoute: () => Route$b
});
const BookingRoute = Route$3.update({
  id: "/booking",
  path: "/booking",
  getParentRoute: () => Route$b
});
const BlogRoute = Route$2.update({
  id: "/blog",
  path: "/blog",
  getParentRoute: () => Route$b
});
const AboutRoute = Route$1.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => Route$b
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$b
});
const rootRouteChildren = {
  IndexRoute,
  AboutRoute,
  BlogRoute,
  BookingRoute,
  ContactRoute,
  CopyrightRoute,
  PortfolioRoute,
  PrivacyRoute,
  ServicesRoute,
  SitemapDotxmlRoute,
  TermsRoute
};
const routeTree = Route$b._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router;
};
export {
  getRouter
};
