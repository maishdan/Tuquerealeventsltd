import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { P as Phone, c as MessageCircle, a as Mail, b as MapPin, g as Check } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
const schema = objectType({
  name: stringType().trim().min(2).max(100),
  email: stringType().trim().email().max(255),
  message: stringType().trim().min(5).max(1e3)
});
const phone = "254795365334";
function Contact() {
  const [submitted, setSubmitted] = reactExports.useState(false);
  const [errors, setErrors] = reactExports.useState({});
  function onSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = schema.safeParse({
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      message: String(fd.get("message") || "")
    });
    if (!res.success) {
      const errs = {};
      res.error.issues.forEach((i) => {
        errs[String(i.path[0])] = i.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitted(true);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-6 pt-24 pb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-gold mb-4", children: "Contact" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-5xl md:text-7xl leading-[1] max-w-3xl", children: [
        "Let's start a ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-gold", children: "conversation" }),
        "."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-6 pb-24 grid lg:grid-cols-2 gap-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ContactRow, { icon: Phone, label: "Call us", value: "+254 795 365 334", href: "tel:+254795365334" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ContactRow, { icon: MessageCircle, label: "WhatsApp", value: "Chat with a planner", href: `https://wa.me/${phone}`, accent: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ContactRow, { icon: Mail, label: "Email", value: "eventsroyaltouch7@gmail.com", href: "mailto:eventsroyaltouch7@gmail.com" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ContactRow, { icon: MapPin, label: "Studio", value: "Nairobi, Kenya" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl overflow-hidden border border-border aspect-video", children: /* @__PURE__ */ jsxRuntimeExports.jsx("iframe", { title: "Royal Touch Events Location", src: "https://www.google.com/maps?q=Nairobi%2C%20Kenya&output=embed", loading: "lazy", className: "w-full h-full", style: {
          filter: "grayscale(0.4) invert(0.9) hue-rotate(180deg)"
        } }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: submitted ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card/60 p-10 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto h-14 w-14 rounded-full bg-gold/20 text-gold flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 24 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-5 font-display text-3xl", children: "Message sent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "We'll reply within one business day." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "rounded-2xl border border-border bg-card/60 p-8 space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { name: "name", maxLength: 100, className: "mt-2 w-full rounded-xl bg-background/60 border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold/60" }),
          errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-destructive", children: errors.name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { name: "email", type: "email", maxLength: 255, className: "mt-2 w-full rounded-xl bg-background/60 border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold/60" }),
          errors.email && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-destructive", children: errors.email })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Message" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { name: "message", rows: 5, maxLength: 1e3, className: "mt-2 w-full rounded-xl bg-background/60 border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold/60" }),
          errors.message && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-destructive", children: errors.message })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition", children: "Send Message" })
      ] }) })
    ] })
  ] });
}
function ContactRow({
  icon: Icon,
  label,
  value,
  href,
  accent
}) {
  const inner = /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-4 rounded-2xl border p-5 transition ${accent ? "border-gold/40 bg-gold/5 hover:bg-gold/10" : "border-border bg-card/60 hover:border-gold/40"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-11 rounded-full bg-primary/15 text-gold flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 18 }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg", children: value })
    ] })
  ] });
  return href ? /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href, target: href.startsWith("http") ? "_blank" : void 0, rel: "noopener noreferrer", children: inner }) : inner;
}
export {
  Contact as component
};
