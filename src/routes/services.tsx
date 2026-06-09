import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, Heart, Cake, Music, Users, Rocket, Sparkles, Lightbulb, Camera, Mic } from "lucide-react";
import { SectionHeader } from "../components/site/Section";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Royal Touch Events" },
      { name: "description", content: "Weddings, corporate events, concerts, decoration, sound & lighting, photography and more." },
      { property: "og:title", content: "Services — Royal Touch Events" },
      { property: "og:description", content: "Full-service event production across East Africa." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: Services,
});

const services = [
  { icon: Briefcase, title: "Corporate Events", desc: "AGMs, galas, retreats and brand activations engineered for impact." },
  { icon: Heart, title: "Weddings", desc: "Intimate ceremonies to grand receptions, planned end to end." },
  { icon: Cake, title: "Birthday Parties", desc: "Milestone celebrations with thoughtful, personal design." },
  { icon: Music, title: "Concerts", desc: "Festival staging, tour production and artist hospitality." },
  { icon: Users, title: "Conferences", desc: "Multi-day, multi-room conferences with seamless logistics." },
  { icon: Rocket, title: "Product Launches", desc: "Reveals, press events and experiential marketing." },
  { icon: Sparkles, title: "Event Decoration", desc: "Florals, draping, tablescapes and bespoke installations." },
  { icon: Lightbulb, title: "Sound & Lighting", desc: "Pro audio, intelligent lighting and stage design." },
  { icon: Camera, title: "Photography & Video", desc: "Cinematic films and editorial photography of your event." },
  { icon: Mic, title: "MC & Entertainment", desc: "Hosts, DJs, bands and curated entertainment lineups." },
];

function Services() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-24 pb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Services</p>
        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl leading-[1] max-w-4xl">
          One studio. <span className="text-gradient-gold">Every</span> moving piece.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Plan, design, produce, capture. We cover the full stack so you don't need to coordinate ten vendors.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-24 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((s) => (
          <div key={s.title} className="group rounded-2xl border border-border bg-card/60 p-7 hover:border-gold/50 transition">
            <div className="h-11 w-11 rounded-full bg-primary/15 text-gold flex items-center justify-center">
              <s.icon size={20} />
            </div>
            <h3 className="mt-6 font-display text-2xl">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-24">
        <div className="rounded-3xl border border-gold/30 bg-card/60 p-10 md:p-16 text-center">
          <SectionHeader eyebrow="Custom packages" title={<>Tell us about your event — we'll <span className="text-gradient-gold">tailor</span> the rest.</>} center />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/booking" className="rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground">Get a Free Quote</Link>
          </div>
        </div>
      </section>
    </>
  );
}
