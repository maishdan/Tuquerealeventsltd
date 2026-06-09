import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { g as Check } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType, a as arrayType } from "../_libs/zod.mjs";
const schema = objectType({
  name: stringType().trim().min(2, "Please enter your name").max(100),
  email: stringType().trim().email("Enter a valid email").max(255),
  phone: stringType().trim().min(7, "Phone too short").max(30),
  eventType: stringType().min(1, "Select an event type"),
  date: stringType().min(1, "Pick a date"),
  guests: stringType().max(10).optional(),
  budget: stringType().min(1, "Select a budget"),
  services: arrayType(stringType()).default([]),
  notes: stringType().max(1e3).optional()
});
const eventTypes = ["Wedding", "Corporate Event", "Birthday", "Concert", "Conference", "Product Launch", "Other"];
const budgets = ["Under $2,000", "$2,000 – $5,000", "$5,000 – $15,000", "$15,000 – $50,000", "$50,000+"];
const serviceOptions = ["Decoration", "Sound & Lighting", "Photography", "Videography", "MC / Entertainment", "Catering Coordination", "Full Planning"];
function Booking() {
  const [submitted, setSubmitted] = reactExports.useState(false);
  const [errors, setErrors] = reactExports.useState({});
  const [selServices, setSelServices] = reactExports.useState([]);
  const toggle = (s) => setSelServices((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  function onSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      eventType: String(fd.get("eventType") || ""),
      date: String(fd.get("date") || ""),
      guests: String(fd.get("guests") || ""),
      budget: String(fd.get("budget") || ""),
      services: selServices,
      notes: String(fd.get("notes") || "")
    };
    const res = schema.safeParse(data);
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
  if (submitted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-2xl px-4 sm:px-6 py-32 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto h-16 w-16 rounded-full bg-gold/20 text-gold flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 28 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-6 font-display text-4xl md:text-5xl", children: "Thank you." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground", children: "Your inquiry has been received. A planner will be in touch within 24 hours." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-4xl px-4 sm:px-6 pt-24 pb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.3em] text-gold mb-4", children: "Book your event" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-4xl sm:text-5xl md:text-6xl leading-[1.05]", children: [
        "Tell us your ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-gold", children: "vision" }),
        "."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground text-lg", children: "Share a few details and we'll respond with a tailored quote." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-4xl px-4 sm:px-6 pb-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "rounded-2xl border border-border bg-card/60 p-6 md:p-10 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Full Name", name: "name", error: errors.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", name: "email", type: "email", error: errors.email }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Phone / WhatsApp", name: "phone", error: errors.phone }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Event Date", name: "date", type: "date", error: errors.date })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Select, { label: "Event Type", name: "eventType", options: eventTypes, error: errors.eventType }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Select, { label: "Budget Range", name: "budget", options: budgets, error: errors.budget })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Expected Guests", name: "guests", placeholder: "Optional" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Services Needed" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex flex-wrap gap-2", children: serviceOptions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => toggle(s), className: `px-4 py-2 rounded-full text-xs border transition ${selServices.includes(s) ? "bg-gold text-background border-gold" : "border-border text-muted-foreground hover:border-gold/60"}`, children: s }, s)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Notes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { name: "notes", rows: 4, maxLength: 1e3, className: "mt-2 w-full rounded-xl bg-background/60 border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold/60", placeholder: "Tell us anything else about your event..." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "w-full md:w-auto inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition", children: "Submit Inquiry" })
    ] }) })
  ] });
}
function Field({
  label,
  name,
  type = "text",
  placeholder,
  error
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { name, type, placeholder, maxLength: 255, className: "mt-2 w-full rounded-xl bg-background/60 border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold/60" }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-destructive", children: error })
  ] });
}
function Select({
  label,
  name,
  options,
  error
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { name, defaultValue: "", className: "mt-2 w-full rounded-xl bg-background/60 border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold/60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", disabled: true, children: "Select..." }),
      options.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o, children: o }, o))
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-destructive", children: error })
  ] });
}
export {
  Booking as component
};
