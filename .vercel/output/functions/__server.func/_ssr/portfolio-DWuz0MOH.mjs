import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { S as SectionHeader } from "./Section-CuLphoZ3.mjs";
import { w as wedding, c as corporate, a as concert } from "./gallery-concert-2BQnojAn.mjs";
import { d as decor } from "./gallery-decor-Bsc1t6vG.mjs";
const birthday = "/assets/gallery-birthday-5fXlXl5v.jpg";
const launch = "/assets/gallery-launch-CFBMTW8P.jpg";
const items = [{
  src: wedding,
  cat: "Weddings",
  title: "Naivasha Garden Ceremony"
}, {
  src: corporate,
  cat: "Corporate",
  title: "Annual Leadership Summit"
}, {
  src: concert,
  cat: "Concerts",
  title: "Afro-Beats Night Live"
}, {
  src: birthday,
  cat: "Birthdays",
  title: "30th Milestone Soirée"
}, {
  src: launch,
  cat: "Launches",
  title: "Tech Brand Reveal"
}, {
  src: decor,
  cat: "Decor",
  title: "Indigo Ballroom Tablescape"
}, {
  src: wedding,
  cat: "Weddings",
  title: "Coastal Sunset Vows"
}, {
  src: corporate,
  cat: "Corporate",
  title: "Bank Anniversary Gala"
}];
const categories = ["All", "Weddings", "Corporate", "Concerts", "Birthdays", "Launches", "Decor"];
function Portfolio() {
  const [filter, setFilter] = reactExports.useState("All");
  const filtered = filter === "All" ? items : items.filter((i) => i.cat === filter);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-6 pt-24 pb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { eyebrow: "Portfolio", title: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        "A few moments we're ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-gold", children: "proud" }),
        " of."
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 flex flex-wrap gap-2", children: categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setFilter(c), className: `px-4 py-2 rounded-full text-xs uppercase tracking-widest border transition ${filter === c ? "bg-gold text-background border-gold" : "border-border text-muted-foreground hover:border-gold/60 hover:text-gold"}`, children: c }, c)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-7xl px-6 pb-24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-5", children: filtered.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("figure", { className: "group relative overflow-hidden rounded-2xl border border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: item.src, alt: item.title, loading: "lazy", className: "aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("figcaption", { className: "absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-background via-background/80 to-transparent", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-gold", children: item.cat }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl mt-1", children: item.title })
      ] })
    ] }, `${item.title}-${i}`)) }) })
  ] });
}
export {
  Portfolio as component
};
