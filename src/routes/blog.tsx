import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
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

const posts = [
  { tag: "Planning", title: "10 Questions to Ask Before You Book Your Wedding Venue", date: "Mar 14, 2026", excerpt: "From corkage fees to lighting limits — the practical checklist most couples forget." },
  { tag: "Trends", title: "2026 Color Stories: Why Indigo & Gold Are Everywhere", date: "Feb 28, 2026", excerpt: "Inside the palette dominating ballrooms this year, and how to make it your own." },
  { tag: "News", title: "Royal Touch Recognized at the East Africa Event Awards", date: "Feb 02, 2026", excerpt: "We're honored to be among this year's awardees in Corporate Production." },
  { tag: "Planning", title: "Budget Smart: Where to Spend and Where to Save", date: "Jan 21, 2026", excerpt: "A planner's honest take on the line items that actually move the needle." },
  { tag: "Trends", title: "Immersive Launch Events: Beyond the Keynote", date: "Jan 05, 2026", excerpt: "How brands are turning launches into multi-sensory experiences." },
  { tag: "Tips", title: "MC Briefing: The 7-Point Outline Pros Use", date: "Dec 12, 2025", excerpt: "Make sure your MC walks on stage with everything they need to nail the room." },
];

function Blog() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pt-24 pb-10">
        <SectionHeader eyebrow="Blog & News" title={<>Stories, tips, and <span className="text-gradient-gold">trends</span>.</>} />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map((p) => (
          <article key={p.title} className="group rounded-2xl border border-border bg-card/60 p-7 hover:border-gold/50 transition flex flex-col">
            <div className="flex items-center justify-between text-xs uppercase tracking-widest text-gold">
              <span>{p.tag}</span>
              <span className="text-muted-foreground">{p.date}</span>
            </div>
            <h3 className="mt-5 font-display text-2xl leading-tight">{p.title}</h3>
            <p className="mt-3 text-sm text-muted-foreground flex-1">{p.excerpt}</p>
            <Link to="/blog" className="mt-6 inline-flex items-center gap-2 text-sm text-gold story-link">
              Read more <ArrowRight size={14} />
            </Link>
          </article>
        ))}
      </section>
    </>
  );
}
