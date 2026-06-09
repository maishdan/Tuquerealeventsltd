export const SITE_NAME = "Royal Touch Events";
export const SITE_TAGLINE = "We plan. You celebrate. We make it memorable.";
export const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined) ?? "https://royaltouchevents.vercel.app";
export const SITE_PHONE = "+254795365334";
export const SITE_EMAIL = "eventsroyaltouch7@gmail.com";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const SERVICE_KEYWORDS =
  "corporate events, weddings, birthday parties, concerts, conferences, product launches, event decoration, sound and lighting, photography, videography, MC entertainment, event planning Nairobi, Kenya event management";

export function absoluteUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function defaultSiteLinks() {
  return [
    { rel: "icon", href: "/favicon.jpg", type: "image/jpeg" },
    { rel: "apple-touch-icon", href: "/og-image.jpg" },
    { rel: "manifest", href: "/site.webmanifest" },
  ];
}

export function createPageSeo(options: {
  title: string;
  description: string;
  path: string;
  keywords?: string;
  noindex?: boolean;
}) {
  const fullTitle = options.title.includes(SITE_NAME)
    ? options.title
    : `${options.title} | ${SITE_NAME}`;
  const url = absoluteUrl(options.path);

  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: options.description },
      ...(options.keywords ? [{ name: "keywords", content: options.keywords }] : []),
      { name: "robots", content: options.noindex ? "noindex, nofollow" : "index, follow" },
      { name: "author", content: SITE_NAME },
      { name: "geo.region", content: "KE-30" },
      { name: "geo.placename", content: "Nairobi" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:type", content: "website" },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: options.description },
      { property: "og:url", content: url },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { property: "og:image:alt", content: `${SITE_NAME} — premium event planning in Nairobi` },
      { property: "og:locale", content: "en_KE" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: options.description },
      { name: "twitter:image", content: DEFAULT_OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "EventPlanner",
    name: SITE_NAME,
    description: SITE_TAGLINE,
    url: SITE_URL,
    logo: DEFAULT_OG_IMAGE,
    image: DEFAULT_OG_IMAGE,
    telephone: SITE_PHONE,
    email: SITE_EMAIL,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Nairobi",
      addressCountry: "KE",
    },
    areaServed: { "@type": "Country", name: "Kenya" },
    sameAs: [],
  };
}

export function servicesJsonLd() {
  const services = [
    "Corporate Events",
    "Weddings",
    "Birthday Parties",
    "Concerts",
    "Conferences",
    "Product Launches",
    "Event Decoration",
    "Sound & Lighting",
    "Photography & Video",
    "MC & Entertainment",
  ];

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE_NAME} Services`,
    description:
      "Plan, design, produce, capture. Full-stack event production — corporate events, weddings, concerts, decoration, AV, photography and entertainment.",
    itemListElement: services.map((name, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name,
        provider: { "@type": "Organization", name: SITE_NAME },
        areaServed: "Kenya",
      },
    })),
  };
}
