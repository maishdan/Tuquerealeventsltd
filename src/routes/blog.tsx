import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader } from "../components/site/Section";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog & News — Royal Touch Events" },
      { name: "description", content: "Event planning tips, industry trends and Royal Touch updates." },
      { property: "og:title", content: "Blog & News — Royal Touch Events" },
      { property: "og:description", content: "Tips, trends, and stories from behind the scenes." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
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
