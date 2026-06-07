import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SectionHeader } from "../components/site/Section";
import wedding from "../assets/gallery-wedding.jpg";
import corporate from "../assets/gallery-corporate.jpg";
import concert from "../assets/gallery-concert.jpg";
import birthday from "../assets/gallery-birthday.jpg";
import launch from "../assets/gallery-launch.jpg";
import decor from "../assets/gallery-decor.jpg";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Lumiere Events" },
      { name: "description", content: "Selected work — weddings, corporate galas, concerts, launches and bespoke productions." },
      { property: "og:title", content: "Portfolio — Lumiere Events" },
      { property: "og:description", content: "A gallery of our work." },
      { property: "og:url", content: "/portfolio" },
    ],
    links: [{ rel: "canonical", href: "/portfolio" }],
  }),
  component: Portfolio,
});

const items = [
  { src: wedding, cat: "Weddings", title: "Naivasha Garden Ceremony" },
  { src: corporate, cat: "Corporate", title: "Annual Leadership Summit" },
  { src: concert, cat: "Concerts", title: "Afro-Beats Night Live" },
  { src: birthday, cat: "Birthdays", title: "30th Milestone Soirée" },
  { src: launch, cat: "Launches", title: "Tech Brand Reveal" },
  { src: decor, cat: "Decor", title: "Indigo Ballroom Tablescape" },
  { src: wedding, cat: "Weddings", title: "Coastal Sunset Vows" },
  { src: corporate, cat: "Corporate", title: "Bank Anniversary Gala" },
];

const categories = ["All", "Weddings", "Corporate", "Concerts", "Birthdays", "Launches", "Decor"];

function Portfolio() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? items : items.filter((i) => i.cat === filter);

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pt-24 pb-10">
        <SectionHeader eyebrow="Portfolio" title={<>A few moments we're <span className="text-gradient-gold">proud</span> of.</>} />
        <div className="mt-10 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest border transition ${
                filter === c ? "bg-gold text-background border-gold" : "border-border text-muted-foreground hover:border-gold/60 hover:text-gold"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item, i) => (
            <figure key={`${item.title}-${i}`} className="group relative overflow-hidden rounded-2xl border border-border">
              <img src={item.src} alt={item.title} loading="lazy" className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105" />
              <figcaption className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-background via-background/80 to-transparent">
                <p className="text-xs uppercase tracking-widest text-gold">{item.cat}</p>
                <h3 className="font-display text-xl mt-1">{item.title}</h3>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
