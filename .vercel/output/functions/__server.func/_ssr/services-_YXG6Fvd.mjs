import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as SectionHeader } from "./Section-CuLphoZ3.mjs";
import { B as Briefcase, H as Heart, C as Cake, d as Music, U as Users, R as Rocket, S as Sparkles, L as Lightbulb, e as Camera, f as Mic } from "../_libs/lucide-react.mjs";
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
const services = [{
  icon: Briefcase,
  title: "Corporate Events",
  desc: "AGMs, galas, retreats and brand activations engineered for impact."
}, {
  icon: Heart,
  title: "Weddings",
  desc: "Intimate ceremonies to grand receptions, planned end to end."
}, {
  icon: Cake,
  title: "Birthday Parties",
  desc: "Milestone celebrations with thoughtful, personal design."
}, {
  icon: Music,
  title: "Concerts",
  desc: "Festival staging, tour production and artist hospitality."
}, {
  icon: Users,
  title: "Conferences",
  desc: "Multi-day, multi-room conferences with seamless logistics."
}, {
  icon: Rocket,
  title: "Product Launches",
  desc: "Reveals, press events and experiential marketing."
}, {
  icon: Sparkles,
  title: "Event Decoration",
  desc: "Florals, draping, tablescapes and bespoke installations."
}, {
  icon: Lightbulb,
  title: "Sound & Lighting",
  desc: "Pro audio, intelligent lighting and stage design."
}, {
  icon: Camera,
  title: "Photography & Video",
  desc: "Cinematic films and editorial photography of your event."
}, {
  icon: Mic,
  title: "MC & Entertainment",
  desc: "Hosts, DJs, bands and curated entertainment lineups."
}];
function Services() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-6 pt-24 pb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-gold mb-4", children: "Services" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-5xl md:text-7xl leading-[1] max-w-4xl", children: [
        "One studio. ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-gold", children: "Every" }),
        " moving piece."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 max-w-2xl text-lg text-muted-foreground", children: "Plan, design, produce, capture. We cover the full stack so you don't need to coordinate ten vendors." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-7xl px-6 pb-24 grid sm:grid-cols-2 lg:grid-cols-3 gap-5", children: services.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group rounded-2xl border border-border bg-card/60 p-7 hover:border-gold/50 transition", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-11 rounded-full bg-primary/15 text-gold flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { size: 20 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-6 font-display text-2xl", children: s.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground leading-relaxed", children: s.desc })
    ] }, s.title)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-7xl px-6 pb-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-gold/30 bg-card/60 p-10 md:p-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { eyebrow: "Custom packages", title: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        "Tell us about your event — we'll ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-gold", children: "tailor" }),
        " the rest."
      ] }), center: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 flex flex-wrap justify-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/booking", className: "rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground", children: "Get a Free Quote" }) })
    ] }) })
  ] });
}
export {
  Services as component
};
