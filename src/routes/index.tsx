import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, Sparkles, Award, HeartHandshake, Star, Quote } from "lucide-react";
import heroImg from "../assets/hero-event.jpg";
import wedding from "../assets/gallery-wedding.jpg";
import corporate from "../assets/gallery-corporate.jpg";
import concert from "../assets/gallery-concert.jpg";
import decor from "../assets/gallery-decor.jpg";
import { SectionHeader } from "../components/site/Section";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Royal Touch Events — Premium Event Planning in Nairobi" },
      { name: "description", content: "Weddings, corporate galas, concerts and launches — beautifully produced end to end." },
      { property: "og:title", content: "Royal Touch Events — Premium Event Planning" },
      { property: "og:description", content: "Beautifully produced events end to end." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const services = [
  { title: "Weddings", desc: "Timeless ceremonies and luxurious receptions.", img: wedding, detail: "Full planning, decor, MC, photography, catering." },
  { title: "Corporate Events", desc: "Galas, conferences, and brand experiences.", img: corporate, detail: "AV, staging, branding and flawless logistics." },
  { title: "Concerts", desc: "Full-scale production, stage, sound & lights.", img: concert, detail: "Rigging, line array sound, intelligent lighting." },
  { title: "Private Parties", desc: "Birthdays, anniversaries, intimate celebrations.", img: decor, detail: "Themes, decor, entertainment & catering." },
];

const why = [
  { icon: Award, title: "12+ Years", desc: "Of producing flagship events across East Africa." },
  { icon: HeartHandshake, title: "End-to-end", desc: "From concept to last guest, we handle everything." },
  { icon: Sparkles, title: "Premium Craft", desc: "Curated decor, lighting & entertainment partners." },
];

const testimonials = [
  { name: "Amara & Joel", role: "Wedding, 2025", quote: "They turned our vision into something more magical than we imagined. Flawless from rehearsal to send-off." },
  { name: "Equity Bank", role: "Annual Gala", quote: "Production value rivalled anything we've seen abroad. Our executives still talk about the show." },
  { name: "Sauti Sol", role: "Concert Tour", quote: "The crew runs like clockwork. Lighting and stage design were on another level." },
];

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={heroImg} alt="Elegant event ballroom" width={1920} height={1080} className="h-full w-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        </div>

        <div className="mx-auto max-w-7xl px-6 pt-28 pb-32 md:pt-40 md:pb-44">
          <p className="text-xs uppercase tracking-[0.3em] text-gold mb-6">Premium Event Management</p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.98] max-w-4xl">
            Moments that <span className="text-gradient-gold">linger</span>, long after the lights dim.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            From candle-lit weddings to flagship brand launches — Royal Touch designs and produces unforgettable events with cinematic detail.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/booking" className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition">
              Book an Event <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border border-gold/40 text-gold px-7 py-3.5 text-sm font-medium hover:bg-gold/10 transition">
              Get a Free Quote
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl">
            {[["500+", "Events Produced"], ["12yrs", "Experience"], ["40+", "Trusted Partners"], ["99%", "Client Satisfaction"]].map(([n, l]) => (
              <div key={l}>
                <div className="font-display text-3xl md:text-4xl text-gradient-gold">{n}</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto max-w-7xl px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <SectionHeader
            eyebrow="Who we are"
            title={<>Designers of <em className="text-gradient-gold not-italic">defining</em> moments.</>}
            subtitle="Royal Touch Events is a full-service event house. We blend storytelling, design, and flawless logistics so you can be fully present at your own event."
          />
          <Link to="/about" className="mt-8 inline-flex items-center gap-2 text-gold story-link text-sm uppercase tracking-widest">
            Our story <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img src={wedding} alt="" loading="lazy" className="rounded-xl aspect-[4/5] object-cover" />
          <img src={decor} alt="" loading="lazy" className="rounded-xl aspect-[4/5] object-cover mt-10" />
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex items-end justify-between flex-wrap gap-6">
          <SectionHeader eyebrow="What we do" title="Services tailored to your vision." />
          <Link to="/services" className="text-sm uppercase tracking-widest text-gold story-link">All Services</Link>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s) => (
            <div key={s.title} className="flip-tile h-72 rounded-2xl tech-glow">
              <div className="flip-inner rounded-2xl">
                {/* Front */}
                <div className="flip-face glass-strong rounded-2xl p-6 flex flex-col justify-end">
                  <img src={s.img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-40" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
                  <div className="relative">
                    <Calendar className="text-gold" size={20} />
                    <h3 className="mt-3 font-display text-2xl">{s.title}</h3>
                    <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">Hover to explore</p>
                  </div>
                </div>
                {/* Back */}
                <div className="flip-face flip-back glass-strong glass-gold rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-2xl text-gradient-gold">{s.title}</h3>
                    <p className="mt-3 text-sm text-foreground/85">{s.desc}</p>
                    <p className="mt-3 text-xs text-muted-foreground">{s.detail}</p>
                  </div>
                  <Link to="/services" className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-gold">
                    Explore <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="border-y border-border bg-card/40">
        <div className="mx-auto max-w-7xl px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img src={concert} alt="" loading="lazy" className="rounded-2xl aspect-[5/6] object-cover" />
            <div className="absolute -bottom-6 -right-6 hidden md:block rounded-2xl bg-background border border-gold/40 px-6 py-5">
              <div className="font-display text-3xl text-gradient-gold">Award<br />Winning</div>
              <p className="text-xs text-muted-foreground mt-1">EAEA 2024 Honoree</p>
            </div>
          </div>
          <div>
            <SectionHeader eyebrow="Why choose us" title="Production with conscience and craft." />
            <div className="mt-10 space-y-8">
              {why.map((w) => (
                <div key={w.title} className="flex gap-5">
                  <div className="h-11 w-11 rounded-full bg-primary/15 text-gold flex items-center justify-center shrink-0">
                    <w.icon size={18} />
                  </div>
                  <div>
                    <h4 className="font-display text-xl">{w.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{w.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <SectionHeader eyebrow="Kind words" title="Trusted by couples & brands alike." center />
        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <figure key={t.name} className="glass-strong tech-glow rounded-2xl p-7">
              <Quote className="text-gold" size={22} />
              <blockquote className="mt-5 text-base leading-relaxed text-foreground/90">"{t.quote}"</blockquote>
              <figcaption className="mt-6 pt-5 border-t border-white/10">
                <div className="font-display text-lg">{t.name}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest">{t.role}</div>
                <div className="mt-2 flex gap-0.5 text-gold">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} fill="currentColor" />)}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-card/60 p-10 md:p-16 text-center">
          <div className="absolute inset-0 -z-10 opacity-30">
            <img src={corporate} alt="" loading="lazy" className="h-full w-full object-cover" />
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Ready when you are</p>
          <h2 className="mt-4 font-display text-4xl md:text-6xl">Let's plan something <span className="text-gradient-gold">remarkable</span>.</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/booking" className="rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground">Book Your Event</Link>
            <Link to="/contact" className="rounded-full border border-gold/40 text-gold px-7 py-3.5 text-sm font-medium hover:bg-gold/10">Contact Us Today</Link>
          </div>
        </div>
      </section>
    </>
  );
}
