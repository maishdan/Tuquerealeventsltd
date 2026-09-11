import { createFileRoute } from "@tanstack/react-router";
import { createPageSeo } from "../lib/seo";

export const Route = createFileRoute("/copyright")({
  head: () =>
    createPageSeo({
      title: "Copyright Notice",
      description:
        "Copyright notice for content, photography, video and brand assets of TOQUE REAL EVENTS LIMITED. All rights reserved.",
      path: "/copyright",
    }),
  component: CopyrightPage,
});

function CopyrightPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 py-24 font-sans">
      <div className="glass-strong rounded-2xl p-10">
        <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4 font-bold">Legal Notice</p>
        <h1 className="font-display text-4xl md:text-5xl font-black">Copyright Notice</h1>
        <p className="mt-3 text-sm text-muted-foreground font-mono">© {new Date().getFullYear()} TOQUE REAL EVENTS LIMITED. All rights reserved.</p>

        <div className="mt-8 text-muted-foreground space-y-6 text-sm leading-relaxed">
          <p>All content on this website — including the TOQUE REAL EVENTS LIMITED name, logo, photographs, videos, written copy, design, and code — is the exclusive property of TOQUE REAL EVENTS LIMITED and is protected by Kenyan and international copyright laws.</p>
          <p>No part of this website may be reproduced, distributed, or transmitted in any form or by any means without prior written permission from TOQUE REAL EVENTS LIMITED, except for brief quotations with full attribution.</p>
          <p>Third-party trademarks, logos and brand names mentioned on this site remain the property of their respective owners.</p>
          <p>To request permission to use any material, please contact <a className="text-gold underline" href="mailto:eventsroyaltouch7@gmail.com">eventsroyaltouch7@gmail.com</a>.</p>
        </div>
      </div>
    </section>
  );
}
