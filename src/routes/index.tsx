import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Smartphone,
  BarChart3,
  History,
  Building2,
  Heart,
  Music,
  ArrowRight,
  Calculator,
  Clock,
  CheckCircle2,
  Sparkles,
  Users,
  Award,
  Globe,
  DollarSign,
  Calendar,
  MapPin,
  Star,
  Ticket as TicketIcon,
  MessageSquare,
  Check
} from "lucide-react";
import corporate from "../assets/gallery-corporate.jpg";
import wedding from "../assets/gallery-wedding.jpg";
import concert from "../assets/gallery-concert.jpg";
import { createPageSeo, SERVICE_KEYWORDS } from "../lib/seo";
import { formatKes } from "@/lib/dashboard-mock-data";
import { useAdminEvents } from "@/hooks/use-dashboard-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () =>
    createPageSeo({
      title: "TOQUE REAL EVENTS LIMITED | Premier Event Planning & Production Nairobi",
      description:
        "TOQUE REAL EVENTS LIMITED is Kenya's premier event planning agency for community celebrations, weddings, corporate summits, and concerts. Simple, reliable, and accessible for everyone.",
      path: "/",
      keywords: SERVICE_KEYWORDS,
    }),
  component: Home,
});

const heroImages = [
  "/back/e1.jfif",
  "/back/e2.jfif",
  "/back/e3.jfif",
  "/back/e4.jfif",
  "/back/e5.jfif",
  "/back/e7.jpg",
  "/back/e8.jpg",
  "/back/e9.jpg",
];

const trustPillars = [
  {
    icon: ShieldCheck,
    title: "100% Technical Reliability",
    desc: "Backup generators and professional sound systems so your event never stops.",
  },
  {
    icon: Smartphone,
    title: "Instant M-Pesa Gate Tickets",
    desc: "Fast digital pass generation sent straight to phone with verified QR code scanning.",
  },
  {
    icon: BarChart3,
    title: "Transparent Fair Pricing",
    desc: "Clear upfront quotes for all budgets — from small family parties to massive summits.",
  },
  {
    icon: History,
    title: "15 Years Experience",
    desc: "Over 1,200+ successful events organized across Nairobi and East Africa.",
  },
];

const upcomingEventsList = [
  {
    id: "evt-1",
    title: "East Africa Business & Tech Leadership Summit 2026",
    category: "Corporate Conference",
    date: "20 Nov 2026",
    location: "KICC Nairobi, Kenya",
    price: 5000,
    tier: "VIP Pass",
    image: "/back/e1.jfif",
  },
  {
    id: "evt-2",
    title: "Safaricom Youth Innovation & Tech Expo 2026",
    category: "Exhibition & Expo",
    date: "15 Oct 2026",
    location: "Westlands, Nairobi",
    price: 1500,
    tier: "Regular Pass",
    image: "/back/e2.jfif",
  },
  {
    id: "evt-3",
    title: "TOQUE REAL Grand Luxury Gala & Cultural Night",
    category: "Luxury Gala",
    date: "12 Dec 2026",
    location: "Villa Rosa Kempinski Nairobi",
    price: 15000,
    tier: "VVIP All Access",
    image: "/back/e3.jfif",
  },
  {
    id: "evt-4",
    title: "Nairobi Music & Cultural Festival 2026",
    category: "Concert & Festival",
    date: "20 Dec 2026",
    location: "Nyayo Stadium, Nairobi",
    price: 0,
    tier: "Free Public Pass",
    image: "/back/e4.jfif",
  },
];

const serviceSectors = [
  {
    id: "sec-community",
    title: "Community & Private Gatherings",
    subtitle: "Graduations, Family Events & Anniversaries",
    icon: Users,
    img: "/back/e5.jfif",
    badge: "Budget Friendly",
    features: [
      "PA Sound System & Microphones",
      "Decor, Tables & Chairs Setup",
      "Fair Pricing for Everyday Clients",
    ],
    startingFrom: 15000,
  },
  {
    id: "sec-birthdays",
    title: "Birthday Extravaganzas & Milestones",
    subtitle: "Birthdays, Kids, Sweet 16 & Jubilee Celebrations",
    icon: Sparkles,
    img: "/back/e8.jpg",
    badge: "Popular Choice",
    features: [
      "Custom Theme Decor & Cake Canopy",
      "DJ & Intelligent Lighting Rig",
      "Photo Booth & Live Entertainment",
    ],
    startingFrom: 25000,
  },
  {
    id: "sec-corp",
    title: "Corporate Conferences & AGMs",
    subtitle: "Company Summits & Product Launches",
    icon: Building2,
    img: corporate,
    badge: "Enterprise Standard",
    features: [
      "HD LED Screens & Stage Rigging",
      "Delegate Registration & Gate Pass",
      "VIP Catering & Protocol Staff",
    ],
    startingFrom: 150000,
  },
  {
    id: "sec-luxury",
    title: "Luxury Weddings & Galas",
    subtitle: "Bespoke Weddings & Evening Galas",
    icon: Heart,
    img: wedding,
    badge: "VIP Exclusive",
    features: [
      "Custom Floral Architecture & Lighting",
      "VIP Security & Protocol Leads",
      "Gourmet Catering & Bar Service",
    ],
    startingFrom: 300000,
  },
  {
    id: "sec-dowry",
    title: "Traditional & Cultural Ceremonies",
    subtitle: "Ruracio, Koito, Itara & Cultural Celebrations",
    icon: Users,
    img: "/back/e9.jpg",
    badge: "Cultural Package",
    features: [
      "Traditional Seating & Tent Setup",
      "Authentic Catering & Beverage Bar",
      "High-Clarity Sound & Cultural Decor",
    ],
    startingFrom: 45000,
  },
  {
    id: "sec-expos",
    title: "Exhibitions, Expos & Trade Shows",
    subtitle: "Brand Expos, Auto Shows & Product Displays",
    icon: Globe,
    img: "/back/e2.jfif",
    badge: "Business Expo",
    features: [
      "Modular Shell Scheme Booths",
      "Power & Accent Lighting Distribution",
      "Digital Visitor QR Check-in System",
    ],
    startingFrom: 200000,
  },
  {
    id: "sec-religious",
    title: "Church, Choir & Spiritual Gatherings",
    subtitle: "Crusades, Worship Nights & Pastoral Galas",
    icon: Award,
    img: "/back/e7.jpg",
    badge: "Community Outreach",
    features: [
      "High-Output Choir Sound Systems",
      "Stage Lighting & Live Broadcast Screens",
      "Seating Setup for Large Congregations",
    ],
    startingFrom: 50000,
  },
  {
    id: "sec-academic",
    title: "School & Academic Ceremonies",
    subtitle: "Proms, Sports Days & Graduation Galas",
    icon: Award,
    img: "/back/e1.jfif",
    badge: "Academic Special",
    features: [
      "High-Energy Sound & Stage Lighting",
      "Student Security & Entry Gate Pass",
      "Stage Setup & Sound Engineering",
    ],
    startingFrom: 35000,
  },
  {
    id: "sec-concert",
    title: "Stadium Concerts & Festivals",
    subtitle: "Public Concerts & Festivals",
    icon: Music,
    img: concert,
    badge: "Large Production",
    features: [
      "Stadium Grade Audio & Stage Rigging",
      "Live 4K Media Broadcast & Screens",
      "Encrypted M-Pesa QR Gate Scanning",
    ],
    startingFrom: 500000,
  },
  {
    id: "sec-tailored",
    title: "Tailored VIP Soirées & Private Dinners",
    subtitle: "Bespoke Dinners & Tailored Event Solutions",
    icon: Star,
    img: "/back/e3.jfif",
    badge: "Tailored Solutions",
    features: [
      "Fine Dining Setup & Sommelier Service",
      "Live Acoustic Band / Saxophonist",
      "Discreet Protocol & Executive Security",
    ],
    startingFrom: 80000,
  },
];

const clientReviews = [
  {
    name: "Dr. Sarah Muthoni",
    role: "Corporate HR Director, Nairobi",
    comment: "TOQUE REAL EVENTS LIMITED managed our 800-delegate summit in Westlands. Flawless 4K AV, zero technical delays, and M-Pesa QR check-in made the event effortless.",
    rating: 5,
  },
  {
    name: "Daniel & Mary Kamau",
    role: "Wedding Couple, Kilimani",
    comment: "They handled our wedding with 300 guests with incredible decor and VIP catering. Very honest pricing and great communication from start to finish!",
    rating: 5,
  },
  {
    name: "Peter Otieno",
    role: "Concert Promoter, Mombasa",
    comment: "Stadium sound, stage lighting, and digital QR ticket verification were 100% reliable. Best production team in Kenya!",
    rating: 5,
  },
];

const currencies = [
  { code: "KES", symbol: "KSh", name: "Kenya Shillings (KES)", rate: 1 },
  { code: "USD", symbol: "$", name: "US Dollar (USD)", rate: 0.0077 },
  { code: "EUR", symbol: "€", name: "Euro (EUR)", rate: 0.0071 },
  { code: "GBP", symbol: "£", name: "British Pound (GBP)", rate: 0.0060 },
  { code: "UGX", symbol: "UGX ", name: "Uganda Shillings (UGX)", rate: 28.5 },
  { code: "TZS", symbol: "TZS ", name: "Tanzania Shillings (TZS)", rate: 20.2 },
];

function Home() {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const { data: dbEvents = [] } = useAdminEvents();

  const displayEvents = dbEvents.length > 0
    ? dbEvents.map((e, idx) => ({
        id: e.id,
        title: e.name,
        category: e.event_type || "Featured Event",
        date: e.event_date || "2026-11-20",
        location: e.venue || "Nairobi, Kenya",
        price: typeof e.budget === "number" ? e.budget : parseInt(String(e.budget || 0).replace(/[^0-9]/g, "")) || 5000,
        tier: idx === 0 ? "VIP Pass" : idx === 1 ? "Regular Pass" : idx === 2 ? "VVIP All Access" : "Free Public Pass",
        image: e.image_url || heroImages[idx % heroImages.length],
      }))
    : upcomingEventsList;

  // Quick Estimator State
  const [estGuests, setEstGuests] = useState<number>(100);
  const [estCategory, setEstCategory] = useState<string>("Community & Private Gatherings");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("KES");
  const [includeAv, setIncludeAv] = useState<boolean>(true);
  const [includeTicketing, setIncludeTicketing] = useState<boolean>(false);

  // Real-Time Sequential Typewriter Effect State
  const line1Full = "TOQUE REAL EVENTS LIMITED";
  const line2Full = "We Plan Your Event..........";
  const line3Full = "You Celebrate....";

  const [line1Typed, setLine1Typed] = useState("");
  const [line2Typed, setLine2Typed] = useState("");
  const [line3Typed, setLine3Typed] = useState("");

  useEffect(() => {
    let index1 = 0;
    let index2 = 0;
    let index3 = 0;

    setLine1Typed("");
    setLine2Typed("");
    setLine3Typed("");

    const timer = setInterval(() => {
      if (index1 < line1Full.length) {
        setLine1Typed(line1Full.slice(0, index1 + 1));
        index1++;
      } else if (index2 < line2Full.length) {
        setLine2Typed(line2Full.slice(0, index2 + 1));
        index2++;
      } else if (index3 < line3Full.length) {
        setLine3Typed(line3Full.slice(0, index3 + 1));
        index3++;
      } else {
        setTimeout(() => {
          index1 = 0;
          index2 = 0;
          index3 = 0;
          setLine1Typed("");
          setLine2Typed("");
          setLine3Typed("");
        }, 8000);
      }
    }, 60);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % heroImages.length);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const calculateEstimateInKes = () => {
    let base =
      estCategory === "Community & Private Gatherings"
        ? 15000
        : estCategory === "Corporate Conferences & AGMs"
        ? 150000
        : estCategory === "Luxury Weddings & Galas"
        ? 300000
        : 500000;

    let perGuest = estGuests * (estCategory === "Community & Private Gatherings" ? 150 : 350);
    let avCost = includeAv ? (estCategory === "Community & Private Gatherings" ? 10000 : 80000) : 0;
    let ticketCost = includeTicketing ? 15000 : 0;

    return base + perGuest + avCost + ticketCost;
  };

  const formatCurrency = (amountInKes: number, currCode: string) => {
    const curr = currencies.find((c) => c.code === currCode) || currencies[0];
    const converted = amountInKes * curr.rate;

    if (currCode === "KES") {
      return `${curr.symbol} ${Math.round(converted).toLocaleString()}`;
    }
    if (currCode === "UGX" || currCode === "TZS") {
      return `${curr.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${curr.symbol}${converted.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="relative min-w-0 bg-[#0b0e14] bg-[url('/ltd.png')] bg-cover bg-center bg-fixed text-foreground font-sans overflow-x-hidden transition-colors duration-300">
      {/* 1. HERO SECTION WITH 3-LINE TYPEWRITER TILE */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-90 transition-all duration-1000"
          style={{ backgroundImage: `url('/ltd.png')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-[#0b0e14]/60 to-[#0b0e14]/20" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10 py-20 text-center space-y-8">
          {/* Animated Typewriter 3-Horizontal Lines Directly Over Background */}
          <div className="max-w-4xl mx-auto space-y-4 font-mono text-center">
            {/* Horizontal Line 1 */}
            <div className="flex items-center justify-center gap-2 text-[#f4cf69] text-xs sm:text-sm font-black uppercase tracking-[0.25em] drop-shadow-md">
              <Sparkles size={16} className="text-[#f4cf69] shrink-0" />
              <span>{line1Typed}</span>
              {line1Typed.length < line1Full.length && (
                <span className="inline-block w-2 h-4 bg-[#f4cf69] animate-pulse ml-1" />
              )}
            </div>

            {/* Horizontal Line 2 */}
            <div className="text-3xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-tight font-display drop-shadow-2xl">
              <span>{line2Typed}</span>
              {line1Typed.length >= line1Full.length && line2Typed.length < line2Full.length && (
                <span className="inline-block w-3 h-8 sm:h-12 bg-white animate-pulse ml-1" />
              )}
            </div>

            {/* Horizontal Line 3 */}
            <div className="text-2xl sm:text-5xl lg:text-6xl font-black text-emerald-400 font-display drop-shadow-2xl">
              <span>{line3Typed}</span>
              {line2Typed.length >= line2Full.length && (
                <span className="inline-block w-3 h-8 sm:h-12 bg-emerald-400 animate-pulse ml-1" />
              )}
            </div>
          </div>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-200 font-medium leading-relaxed font-sans">
            Kenya's premier event planning agency. We organize stress-free events for everyone — family celebrations, birthdays, weddings, corporate summits, and public concerts.
          </p>

          {/* VIBRANT GREEN CTA BUTTONS */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link
              to="/booking"
              className="h-14 px-8 rounded-none bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-2xl shadow-emerald-500/30 w-full sm:w-auto cursor-pointer"
            >
              Plan Your Event <ArrowRight size={16} />
            </Link>
            <Link
              to="/services"
              className="h-14 px-8 rounded-none border border-white/20 bg-black/60 backdrop-blur-md text-white font-black text-xs uppercase tracking-widest flex items-center justify-center hover:border-[#f4cf69] hover:text-[#f4cf69] transition-all w-full sm:w-auto"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* 2. TRUST PILLARS BAR */}
      <section className="py-12 bg-[#0b0e14]/85 backdrop-blur-md border-y border-[#172533]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustPillars.map((p, i) => (
              <div key={i} className="flex items-start gap-4 p-5 rounded-none bg-[#121722]/90 backdrop-blur-md border border-[#243343] hover:border-[#f4cf69]/60 shadow-xl transition-all">
                <div className="h-10 w-10 rounded-none bg-[#f4cf69]/10 border border-[#f4cf69]/30 text-[#f4cf69] flex items-center justify-center shrink-0">
                  <p.icon size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-white">{p.title}</h4>
                  <p className="text-[11px] text-[#8d9bad] leading-snug font-medium">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. UPCOMING EVENTS & GATE TICKETS SECTION */}
      <section className="py-20 bg-[#0b0e14]/90 backdrop-blur-md border-b border-[#172533]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#172533] pb-6">
            <div className="space-y-2">
              <span className="px-3 py-1 bg-[#f4cf69]/10 text-[#f4cf69] border border-[#f4cf69]/30 text-[10px] font-black uppercase tracking-widest rounded-none">
                <Calendar size={12} className="inline mr-1" /> Live Gate Passes
              </span>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
                Upcoming Featured Events
              </h2>
              <p className="text-xs sm:text-sm text-[#8d9bad] max-w-xl font-medium">
                Reserve your seat or gate pass online with instant M-Pesa payment and encrypted QR code ticket delivery.
              </p>
            </div>

            <Link
              to="/events"
              className="h-12 px-6 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-widest rounded-none flex items-center justify-center gap-2 shadow-xl transition-all shrink-0 cursor-pointer"
            >
              Browse All Events →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayEvents.slice(0, 4).map((evt) => (
              <div
                key={evt.id}
                className="bg-[#121722]/90 border border-[#243343] hover:border-[#f4cf69] rounded-none overflow-hidden shadow-2xl flex flex-col group transition-all duration-300"
              >
                <div className="relative h-44 overflow-hidden">
                  <img src={evt.image} alt={evt.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 right-3 px-2.5 py-1 bg-black/80 text-[#f4cf69] text-[9px] font-black uppercase rounded-none border border-[#f4cf69]/40">
                    {evt.tier}
                  </span>
                </div>

                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">{evt.category}</span>
                    <h3 className="text-sm font-bold text-white uppercase leading-snug group-hover:text-[#f4cf69] transition-colors">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-[#8d9bad] font-mono flex items-center gap-1">
                      <MapPin size={12} className="text-[#f4cf69]" /> {evt.location}
                    </p>
                    <p className="text-xs text-[#8d9bad] font-mono flex items-center gap-1">
                      <Calendar size={12} className="text-[#f4cf69]" /> {evt.date}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#172533] flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[8px] uppercase tracking-widest text-[#8d9bad] block">Pass Price</span>
                      <strong className="text-sm font-mono text-[#f4cf69]">
                        {evt.price === 0 ? "FREE PASS" : formatKes(evt.price)}
                      </strong>
                    </div>

                    <Link
                      to="/events"
                      className="h-9 px-3 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-[9px] uppercase tracking-widest rounded-none flex items-center gap-1 shadow-md transition-all cursor-pointer"
                    >
                      Reserve Gate Ticket →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ACCESSIBLE SERVICE SECTORS FOR ALL LEVELS */}
      <section className="py-24 bg-[#0b0e14]/85 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#f4cf69]">Tailored Solutions</p>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              Accessible Event Packages For Everyone
            </h2>
            <p className="text-xs sm:text-sm text-[#8d9bad] font-medium">
              From small family gatherings to multinational corporate summits, TOQUE REAL EVENTS LIMITED delivers transparent quality at every budget level.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {serviceSectors.map((sector) => (
              <div
                key={sector.id}
                className="bg-[#121722]/90 backdrop-blur-md border border-[#243343] hover:border-[#f4cf69] rounded-none overflow-hidden shadow-2xl flex flex-col group transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={sector.img} alt={sector.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 right-3 px-3 py-1 bg-black/80 text-[#f4cf69] text-[9px] font-black uppercase rounded-none border border-[#f4cf69]/30">
                    {sector.badge}
                  </span>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#f4cf69]">{sector.subtitle}</p>
                      <h3 className="text-lg font-black uppercase tracking-tight text-white group-hover:text-[#f4cf69] transition-colors">
                        {sector.title}
                      </h3>
                    </div>

                    <ul className="space-y-2 pt-2 border-t border-[#172533]">
                      {sector.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2 text-xs font-medium text-[#c7d0da]">
                          <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-[#172533] flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-widest text-[#8d9bad]">Starting From</p>
                      <p className="text-sm font-black text-[#f4cf69] font-mono">{formatKes(sector.startingFrom)}</p>
                    </div>

                    <Link
                      to="/booking"
                      className="h-10 px-4 rounded-none bg-emerald-500 hover:bg-emerald-400 text-black font-black text-[9px] uppercase tracking-widest flex items-center gap-1 shadow-md transition-all cursor-pointer"
                    >
                      Inquire Quote <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE COST ESTIMATOR & CURRENCY CONVERTER */}
      <section className="py-24 bg-[#0b0e14]/90 border-y border-[#172533]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#f4cf69]/10 border border-[#f4cf69]/30 text-[#f4cf69] text-[10px] font-black uppercase tracking-widest">
                <Calculator size={14} /> Instant Cost Estimator
              </div>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                Estimate Your Event Budget
              </h2>
              <p className="text-sm text-[#8d9bad] leading-relaxed font-medium">
                Simple, transparent cost estimates for everyone—from small family celebrations to multi-currency corporate conferences.
              </p>

              {/* Currency Selector Box */}
              <div className="p-4 bg-[#121722]/90 border border-[#243343] rounded-none space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#f4cf69] flex items-center gap-1.5">
                  <DollarSign size={14} /> Select Preferred Currency *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {currencies.map((curr) => (
                    <button
                      key={curr.code}
                      type="button"
                      onClick={() => setSelectedCurrency(curr.code)}
                      className={cn(
                        "py-2 px-2.5 rounded-none text-xs font-mono font-bold border transition-all cursor-pointer text-center",
                        selectedCurrency === curr.code
                          ? "bg-[#f4cf69] text-black border-[#f4cf69] shadow-md font-black"
                          : "bg-[#0b0e14] border-[#243343] text-[#c7d0da] hover:border-[#f4cf69]"
                      )}
                    >
                      {curr.code} ({curr.symbol})
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-[#121722]/90 border border-[#243343] rounded-none space-y-3">
                <div className="flex items-center gap-3 text-[#f4cf69]">
                  <Clock size={18} />
                  <p className="text-[10px] font-black uppercase tracking-widest text-white">Fast Proposal Turnaround</p>
                </div>
                <p className="text-xs text-[#8d9bad]">
                  Submitting your details triggers a dedicated producer review within 12 business hours.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#121722]/90 border border-[#243343] p-8 sm:p-10 rounded-none space-y-8 shadow-2xl">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#8d9bad] block mb-2">
                    Event Category & Level *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      "Community & Private Gatherings",
                      "Birthday Extravaganzas",
                      "Corporate Conferences & AGMs",
                      "Luxury Weddings & Galas",
                      "Traditional & Cultural",
                      "Exhibitions & Expos",
                      "Church & Spiritual",
                      "Stadium Concerts & Festivals",
                    ].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setEstCategory(cat)}
                        className={cn(
                          "py-3 px-2 rounded-none text-[9px] font-black uppercase tracking-wider border transition-all text-center cursor-pointer",
                          estCategory === cat
                            ? "bg-[#f4cf69] text-black border-[#f4cf69] shadow-md font-black"
                            : "bg-[#0b0e14] border-[#243343] text-white hover:border-[#f4cf69]"
                        )}
                      >
                        {cat.split(" ")[0]} {cat.split(" ")[1]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#8d9bad]">
                      Guest Capacity
                    </label>
                    <span className="font-mono text-sm font-black text-[#f4cf69]">{estGuests} Guests</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="3000"
                    step="10"
                    value={estGuests}
                    onChange={(e) => setEstGuests(Number(e.target.value))}
                    className="w-full accent-[#f4cf69] cursor-pointer h-2 bg-[#0b0e14] rounded-none"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 p-4 bg-[#0b0e14] border border-[#243343] rounded-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeAv}
                      onChange={(e) => setIncludeAv(e.target.checked)}
                      className="accent-[#f4cf69] h-4 w-4"
                    />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">Include Sound & Lighting</span>
                  </label>

                  <label className="flex items-center gap-3 p-4 bg-[#0b0e14] border border-[#243343] rounded-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeTicketing}
                      onChange={(e) => setIncludeTicketing(e.target.checked)}
                      className="accent-[#f4cf69] h-4 w-4"
                    />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">Include M-Pesa QR Gate Passes</span>
                  </label>
                </div>
              </div>

              {/* Estimate Calculation Banner with Green Action Button */}
              <div className="p-6 bg-[#f4cf69]/10 border border-[#f4cf69]/40 rounded-none flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Estimated Budget ({selectedCurrency})</p>
                  <p className="text-2xl sm:text-3xl font-black text-[#f4cf69] font-mono">
                    {formatCurrency(calculateEstimateInKes(), selectedCurrency)}
                  </p>
                </div>

                <Link
                  to="/booking"
                  className="h-12 px-6 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shrink-0 w-full sm:w-auto transition-all cursor-pointer rounded-none"
                >
                  Book Estimate <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CLIENT TESTIMONIALS & TRUST REVIEWS */}
      <section className="py-24 bg-[#0b0e14]/85 border-b border-[#172533]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-widest rounded-none">
              <Star size={12} className="inline mr-1 fill-emerald-400" /> Rated 4.9/5
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              Trusted By Clients Across Kenya
            </h2>
            <p className="text-xs sm:text-sm text-[#8d9bad]">
              Here is what event organizers, corporate directors, and couples say about TOQUE REAL EVENTS LIMITED.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {clientReviews.map((rev, idx) => (
              <div
                key={idx}
                className="p-6 bg-[#121722]/90 border border-[#243343] hover:border-[#f4cf69]/60 rounded-none space-y-4 shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex gap-1 text-[#f4cf69]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={14} className="fill-[#f4cf69]" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-medium italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-[#172533] space-y-0.5">
                  <strong className="text-sm font-bold text-white block">{rev.name}</strong>
                  <span className="text-[10px] font-mono text-[#8d9bad] uppercase block">{rev.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
