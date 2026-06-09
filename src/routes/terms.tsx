import { createFileRoute } from "@tanstack/react-router";
import { createPageSeo } from "../lib/seo";

export const Route = createFileRoute("/terms")({
  head: () =>
    createPageSeo({
      title: "Terms & Conditions",
      description:
        "Terms and conditions for engaging Royal Touch Events for event planning, production and related services in Nairobi, Kenya.",
      path: "/terms",
    }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 py-24">
      <div className="glass-strong rounded-2xl p-10">
        <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Legal</p>
        <h1 className="font-display text-4xl md:text-5xl">Terms &amp; Conditions</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {new Date().getFullYear()}</p>

        <div className="prose prose-invert mt-8 text-muted-foreground space-y-6 text-sm leading-relaxed">
          <div>
            <h2 className="text-foreground font-display text-2xl">1. Agreement</h2>
            <p>By engaging Royal Touch Events ("we", "us") for any event planning, decor, or production service, the client agrees to these terms. A signed quote or paid deposit constitutes acceptance.</p>
          </div>
          <div>
            <h2 className="text-foreground font-display text-2xl">2. Bookings & Payments</h2>
            <p>A non-refundable deposit of 50% is required to confirm any booking. Final balance is due no later than 7 days before the event date. Payments may be made via bank transfer or mobile money.</p>
          </div>
          <div>
            <h2 className="text-foreground font-display text-2xl">3. Cancellations</h2>
            <p>Cancellations made more than 30 days before the event date forfeit the deposit. Cancellations within 14 days of the event are charged at 100% of the agreed package.</p>
          </div>
          <div>
            <h2 className="text-foreground font-display text-2xl">4. Liability</h2>
            <p>We are not liable for delays or losses arising from third-party vendors, venue restrictions, weather, or acts beyond our reasonable control.</p>
          </div>
          <div>
            <h2 className="text-foreground font-display text-2xl">5. Media Rights</h2>
            <p>We reserve the right to use photographs and footage of events we produce for marketing purposes unless the client opts out in writing.</p>
          </div>
          <div>
            <h2 className="text-foreground font-display text-2xl">6. Contact</h2>
            <p>Questions about these terms: <a className="text-gold" href="tel:+254795365334">+254 795 365 334</a>.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
