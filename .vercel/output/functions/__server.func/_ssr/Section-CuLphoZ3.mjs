import { j as jsxRuntimeExports } from "../_libs/react.mjs";
function SectionHeader({ eyebrow, title, subtitle, center = false }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: center ? "text-center max-w-2xl mx-auto" : "max-w-2xl", children: [
    eyebrow && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.25em] text-gold mb-3", children: eyebrow }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-4xl md:text-5xl leading-[1.05]", children: title }),
    subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground text-base md:text-lg", children: subtitle })
  ] });
}
export {
  SectionHeader as S
};
