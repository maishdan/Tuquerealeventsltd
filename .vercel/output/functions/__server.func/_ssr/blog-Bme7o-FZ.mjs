import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as SectionHeader } from "./Section-CuLphoZ3.mjs";
import { A as ArrowRight } from "../_libs/lucide-react.mjs";
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
const posts = [{
  tag: "Planning",
  title: "10 Questions to Ask Before You Book Your Wedding Venue",
  date: "Mar 14, 2026",
  excerpt: "From corkage fees to lighting limits — the practical checklist most couples forget."
}, {
  tag: "Trends",
  title: "2026 Color Stories: Why Indigo & Gold Are Everywhere",
  date: "Feb 28, 2026",
  excerpt: "Inside the palette dominating ballrooms this year, and how to make it your own."
}, {
  tag: "News",
  title: "Royal Touch Recognized at the East Africa Event Awards",
  date: "Feb 02, 2026",
  excerpt: "We're honored to be among this year's awardees in Corporate Production."
}, {
  tag: "Planning",
  title: "Budget Smart: Where to Spend and Where to Save",
  date: "Jan 21, 2026",
  excerpt: "A planner's honest take on the line items that actually move the needle."
}, {
  tag: "Trends",
  title: "Immersive Launch Events: Beyond the Keynote",
  date: "Jan 05, 2026",
  excerpt: "How brands are turning launches into multi-sensory experiences."
}, {
  tag: "Tips",
  title: "MC Briefing: The 7-Point Outline Pros Use",
  date: "Dec 12, 2025",
  excerpt: "Make sure your MC walks on stage with everything they need to nail the room."
}];
function Blog() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-7xl px-6 pt-24 pb-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { eyebrow: "Blog & News", title: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      "Stories, tips, and ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-gold", children: "trends" }),
      "."
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-7xl px-6 pb-24 grid md:grid-cols-2 lg:grid-cols-3 gap-5", children: posts.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "group rounded-2xl border border-border bg-card/60 p-7 hover:border-gold/50 transition flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs uppercase tracking-widest text-gold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: p.tag }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: p.date })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-5 font-display text-2xl leading-tight", children: p.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground flex-1", children: p.excerpt }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/blog", className: "mt-6 inline-flex items-center gap-2 text-sm text-gold story-link", children: [
        "Read more ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 14 })
      ] })
    ] }, p.title)) })
  ] });
}
export {
  Blog as component
};
