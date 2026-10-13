import { createFileRoute } from "@tanstack/react-router";
import { createPageSeo } from "../lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () =>
    createPageSeo({
      title: "Privacy Policy",
      description:
        "How Royal Touch Events collects, uses and protects your personal information when you inquire, book or interact with our event planning services.",
      path: "/privacy",
    }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 py-24">
      <div className="glass-strong rounded-2xl p-10">
        <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Legal</p>
        <h1 className="font-display text-4xl md:text-5xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {new Date().getFullYear()}</p>

        <div className="mt-8 text-muted-foreground space-y-6 text-sm leading-relaxed">
          <div>
            <h2 className="text-foreground font-display text-2xl">Information We Collect</h2>
            <p>When you book an event or contact us, we may collect your name, phone number, email, event date and venue, and any preferences you share. We may also collect basic analytics on our website such as page views and device type.</p>
          </div>
          <div>
            <h2 className="text-foreground font-display text-2xl">How We Use It</h2>
            <p>We use your information solely to plan and deliver your event, send quotes, share updates, and improve our services. We do not sell or rent your data to third parties.</p>
          </div>
          <div>
            <h2 className="text-foreground font-display text-2xl">Sharing</h2>
            <p>We share details with vendors (venues, caterers, suppliers) only as needed to fulfil your event. All partners are bound by confidentiality.</p>
          </div>
          <div>
            <h2 className="text-foreground font-display text-2xl">Your Rights</h2>
            <p>You may request access, correction, or deletion of your personal data at any time by writing to <a href="mailto:realtoque0@gmail.com" className="text-gold underline">realtoque0@gmail.com</a>.</p>
          </div>
          <div>
            <h2 className="text-foreground font-display text-2xl">Security</h2>
            <p>We protect your information with reasonable technical and organisational measures, including encrypted communications and limited internal access.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
