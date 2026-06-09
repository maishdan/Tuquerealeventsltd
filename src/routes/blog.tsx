import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader } from "../components/site/Section";
import { createPageSeo } from "../lib/seo";

export const Route = createFileRoute("/blog")({
  head: () =>
    createPageSeo({
      title: "Blog & News — Event Planning Tips & Trends",
      description:
        "Royal Touch Events blog: wedding planning tips, corporate event trends, décor inspiration and behind-the-scenes stories from Nairobi's premier event production team.",
      path: "/blog",
      keywords: "event planning blog Kenya, wedding tips Nairobi, corporate event trends",
    }),
  component: Blog,
});

const postSlots = [0, 1, 2, 3, 4, 5];

function Blog() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-24 pb-10">
        <SectionHeader eyebrow="Blog & News" title={<>Stories, tips, and <span className="text-gradient-gold">trends</span>.</>} />
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-24 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {postSlots.map((slot) => (
          <article
            key={slot}
            aria-label="Blog post placeholder"
            className="rounded-2xl border border-border bg-card/60 min-h-56"
          />
        ))}
      </section>
    </>
  );
}
