import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/copyright")({
  head: () => ({
    meta: [
      { title: "Copyright — Royal Touch Events" },
      { name: "description", content: "Copyright notice for content, photography and brand assets of Royal Touch Events." },
      { property: "og:title", content: "Copyright — Royal Touch Events" },
      { property: "og:description", content: "Brand and content ownership notice." },
    ],
  }),
  component: CopyrightPage,
});

function CopyrightPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <div className="glass-strong rounded-2xl p-10">
        <p className="text-xs uppercase tracking-[0.3em] text-gold mb-4">Legal</p>
        <h1 className="font-display text-4xl md:text-5xl">Copyright Notice</h1>
        <p className="mt-3 text-sm text-muted-foreground">© {new Date().getFullYear()} Royal Touch Events. All rights reserved.</p>

        <div className="mt-8 text-muted-foreground space-y-6 text-sm leading-relaxed">
          <p>All content on this website — including the Royal Touch Events name, logo, photographs, videos, written copy, design, and code — is the exclusive property of Royal Touch Events and is protected by Kenyan and international copyright laws.</p>
          <p>No part of this website may be reproduced, distributed, or transmitted in any form or by any means without prior written permission from Royal Touch Events, except for brief quotations with full attribution.</p>
          <p>Third-party trademarks, logos and brand names mentioned on this site remain the property of their respective owners.</p>
          <p>To request permission to use any material, please contact <a className="text-gold" href="mailto:eventsroyaltouch7@gmail.com">eventsroyaltouch7@gmail.com</a>.</p>
        </div>
      </div>
    </section>
  );
}
