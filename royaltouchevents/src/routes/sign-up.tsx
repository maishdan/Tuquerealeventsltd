import { createFileRoute, Navigate } from "@tanstack/react-router";
import { createPageSeo } from "../lib/seo";

export const Route = createFileRoute("/sign-up")({
  head: () => ({
    ...createPageSeo({
      title: "CEO Admin Portal | Royal Touch Events Nairobi",
      description: "Direct executive portal access for Royal Touch Events Nairobi.",
      path: "/sign-up",
      noindex: true,
    }),
  }),
  component: () => <Navigate to="/admin" replace />,
});
