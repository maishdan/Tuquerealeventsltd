import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader } from "../components/site/Section";
import decor from "../assets/gallery-decor.jpg";
import { createPageSeo } from "../lib/seo";

export const Route = createFileRoute("/about")({
  head: () =>
    createPageSeo({
      title: "About Us — Twelve Years of Unforgettable Events",
      description:
        "Founded in 2013, Royal Touch Events is Nairobi's full-service event house. Our mission: translate every client's vision into a flawlessly executed, emotionally resonant experience.",
      path: "/about",
      keywords: "about Royal Touch Events, event company Nairobi, luxury event production Kenya",
    }),
  component: About,
});

const teamSlots = [0, 1, 2, 3];

function About() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-24 pb-16">
        <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">About Royal Touch</p>
        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl leading-[1] max-w-4xl">
          Twelve years of building moments worth <span className="text-gradient-gold">remembering</span>.
        </h1>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 grid md:grid-cols-2 gap-16 items-start">
        <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
          <p>Founded in 2013 by a small team of designers, planners, and producers, Royal Touch Events grew from intimate garden weddings to full-scale corporate productions across East Africa.</p>
          <p>Every event we touch is approached as a story — a sequence of carefully designed scenes, from first invitation to final farewell.</p>
        </div>
        <img src={decor} alt="" loading="lazy" className="rounded-2xl aspect-[4/5] object-cover" />
      </section>

      <section className="border-y border-border bg-card/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 grid md:grid-cols-2 gap-12">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-3">Mission</p>
            <h3 className="font-display text-3xl">To translate every client's vision into a flawlessly executed, emotionally resonant experience.</h3>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold mb-3">Vision</p>
            <h3 className="font-display text-3xl">To become Africa's most trusted name in luxury event production.</h3>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
        <SectionHeader eyebrow="The team" title="Meet the people behind every show." />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {teamSlots.map((slot) => (
            <div
              key={slot}
              aria-label="Team member placeholder"
              className="rounded-2xl border border-border bg-card/60 min-h-52"
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-24 grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {[["500+", "Events Produced"], ["12yrs", "Experience"], ["8", "Industry Awards"], ["40+", "Partner Vendors"]].map(([n, l]) => (
          <div key={l} className="rounded-2xl border border-border p-8">
            <div className="font-display text-4xl text-gradient-gold">{n}</div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mt-2">{l}</div>
          </div>
        ))}
      </section>
    </>
  );
}
