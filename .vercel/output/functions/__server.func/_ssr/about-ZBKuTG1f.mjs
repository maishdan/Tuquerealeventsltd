import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { S as SectionHeader } from "./Section-Dxp-Mxyg.mjs";
import { d as decor } from "./gallery-decor-Bsc1t6vG.mjs";
const team = [{
  name: "Wanjiru Karanja",
  role: "Creative Director"
}, {
  name: "Brian Ouma",
  role: "Head of Production"
}, {
  name: "Aisha Hassan",
  role: "Lead Planner"
}, {
  name: "David Mwangi",
  role: "Technical Director"
}];
function About() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-4 sm:px-6 pt-24 pb-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-gold mb-4", children: "About Royal Touch" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-4xl sm:text-5xl md:text-7xl leading-[1] max-w-4xl", children: [
        "Twelve years of building moments worth ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-gold", children: "remembering" }),
        "."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-4 sm:px-6 py-16 grid md:grid-cols-2 gap-16 items-start", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 text-muted-foreground text-lg leading-relaxed", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Founded in 2013 by a small team of designers, planners, and producers, Royal Touch Events grew from intimate garden weddings to full-scale corporate productions across East Africa." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Every event we touch is approached as a story — a sequence of carefully designed scenes, from first invitation to final farewell." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: decor, alt: "", loading: "lazy", className: "rounded-2xl aspect-[4/5] object-cover" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-y border-border bg-card/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 py-20 grid md:grid-cols-2 gap-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-gold mb-3", children: "Mission" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-3xl", children: "To translate every client's vision into a flawlessly executed, emotionally resonant experience." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-gold mb-3", children: "Vision" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-3xl", children: "To become Africa's most trusted name in luxury event production." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-4 sm:px-6 py-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { eyebrow: "The team", title: "Meet the people behind every show." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5", children: team.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card/60 p-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-primary/40 to-gold/40 flex items-center justify-center font-display text-2xl", children: m.name.split(" ").map((n) => n[0]).join("") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "mt-5 font-display text-xl", children: m.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground mt-1", children: m.role })
      ] }, m.name)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-7xl px-4 sm:px-6 pb-24 grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-center", children: [["500+", "Events Produced"], ["12yrs", "Experience"], ["8", "Industry Awards"], ["40+", "Partner Vendors"]].map(([n, l]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-4xl text-gradient-gold", children: n }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-widest text-muted-foreground mt-2", children: l })
    ] }, l)) })
  ] });
}
export {
  About as component
};
