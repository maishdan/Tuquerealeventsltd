export const SITE_NAME = "TOQUE REAL EVENTS LIMITED";
export const SITE_TAGLINE = "We plan. You celebrate. We make it memorable.";
export const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined) ?? "https://royaltouchevents.co.ke";
export const SITE_PHONE = "+254795365334";
export const SITE_EMAIL = "eventsroyaltouch7@gmail.com";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const SERVICE_KEYWORDS =
  "TOQUE REAL EVENTS LIMITED, top event hoster Kenya, #1 luxury event management Nairobi, East Africa best event planners, corporate galas, luxury weddings Kenya, VIP event production, sound and lighting Nairobi, concert production, product launches, M-Pesa gate passes, high class event services Kenya";

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
      { name: "keywords", content: options.keywords || SERVICE_KEYWORDS },
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
      { property: "og:image:alt", content: `${SITE_NAME} — Kenya's Top-Class Event Management Agency` },
      { property: "og:locale", content: "en_KE" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: options.description },
      { name: "twitter:image", content: DEFAULT_OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: url }, { rel: "icon", href: "/favicon.jpg", type: "image/jpeg" }],
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "EventPlanner",
    name: SITE_NAME,
    description: "TOQUE REAL EVENTS LIMITED — Kenya's Premier Luxury Event Management Agency & Production Specialist.",
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
    sameAs: ["https://myworldafric.vercel.app"],
  };
}

export function servicesJsonLd() {
  const services = [
    "Luxury Corporate Events",
    "High-Class Weddings",
    "VIP Concerts & Galas",
    "Product Launches & Summits",
    "Conferences",
    "Event Decoration & Stage Design",
    "Sound, AV & Lighting Production",
    "Photography & Videography",
    "MC & Royal Entertainment",
  ];

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE_NAME} Premium Services`,
    description:
      "TOQUE REAL EVENTS LIMITED — Kenya's #1 Luxury Event Management & Production Agency. Corporate events, weddings, concerts, AV lighting, stage design, and gate passes.",
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
