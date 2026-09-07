import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import {
  Check,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Zap,
  Users,
  MessageSquare,
  Clock,
  Sparkles,
  ChevronDown,
  Armchair,
  Smartphone,
  Ticket as TicketIcon,
  QrCode,
  MapPin,
  CheckCircle2,
  Tag,
  Download,
  Mail,
  Printer,
  ChevronLeft,
  Minus,
  Plus,
  AlertCircle,
  XCircle,
  Gift
} from "lucide-react";
import { createPageSeo } from "../lib/seo";
import { createBooking } from "@/lib/api/bookings";
import { fetchAllEvents } from "@/lib/api/events";
import { issueTicket } from "@/lib/api/tickets";
import { SeatPicker } from "@/components/booking/SeatPicker";
import { MpesaPaymentModal } from "@/components/booking/MpesaPaymentModal";
import { TicketPassModal } from "@/components/dashboard/TicketPassModal";
import { useAuth } from "@/contexts/AuthContext";
import type { InitiateMpesaInput } from "@/lib/api/payments";
import type { Ticket, TicketClass, EventRecord } from "@/lib/database.types";
import { formatKes } from "@/lib/dashboard-mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/booking")({
  head: () =>
    createPageSeo({
      title: "Guest Checkout & Gate Passes | Royal Touch Events Nairobi",
      description:
        "5-Screen guest ticket checkout. Select event, choose Regular/VIP/VVIP or Free Ticket class, pay via M-Pesa STK, and receive your digital PDF ticket instantly.",
      path: "/booking",
      keywords: "book event Nairobi, M-Pesa event tickets Kenya, guest ticket checkout, QR ticket PDF",
    }),
  component: Booking,
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

export function Booking() {
  const { user, profile } = useAuth();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // Events Registry
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // 5-Screen Guest Checkout Flow State
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedEvent, setSelectedEvent] = useState<EventRecord | null>(null);
  const [selectedTicketClass, setSelectedTicketClass] = useState<TicketClass | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSeat, setSelectedSeat] = useState<string | null>("07");

  // Customer Contact Info (Screen 3)
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [phone, setPhone] = useState(profile?.phone || "0712345678");

  // Payment & Pass Output State (Screen 4 & 5)
  const [isMpesaModalOpen, setIsMpesaModalOpen] = useState(false);
  const [mpesaPayload, setMpesaPayload] = useState<InitiateMpesaInput | null>(null);
  const [generatedTicket, setGeneratedTicket] = useState<Ticket | null>(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [issuingFreePass, setIssuingFreePass] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAllEvents();
        setEvents(data);
        if (data.length > 0) {
          setSelectedEvent(data[0]);
          if (data[0].ticket_classes && data[0].ticket_classes.length > 0) {
            setSelectedTicketClass(data[0].ticket_classes[0]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingEvents(false);
      }
    }
    load();

    const timer = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % heroImages.length);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleSelectEvent = (evt: EventRecord) => {
    setSelectedEvent(evt);
    if (evt.ticket_classes && evt.ticket_classes.length > 0) {
      setSelectedTicketClass(evt.ticket_classes[0]);
    } else {
      setSelectedTicketClass({
        id: `tc-${evt.id}`,
        name: "Regular",
        description: "General Admission",
        price: 500,
        quantity_available: 500,
        quantity_sold: 0,
        benefits: ["General Entrance"],
      });
    }
    setCurrentStep(2);
  };

  const calculateTotal = () => {
    return (selectedTicketClass?.price || 0) * quantity;
  };

  const handleProceedToPayment = async () => {
    if (!selectedEvent || !selectedTicketClass) return;

    const totalAmount = calculateTotal();

    // IF TICKET CLASS IS FREE (Price = 0) -> GENERATE TICKET DIRECTLY WITHOUT PAYMENT PROMPT!
    if (totalAmount === 0 || selectedTicketClass.price === 0) {
      setIssuingFreePass(true);
      try {
        const freeTicket = await issueTicket({
          user_id: user?.id ?? null,
          booking_id: `bk-free-${Date.now()}`,
          event_name: selectedEvent.name,
          holder_name: fullName || "Guest Attendee",
          holder_email: email || "guest@royaltouch.com",
          ticket_tier: selectedTicketClass.name as any,
          price: 0,
          seat_number: selectedSeat || "GA",
          event_date: selectedEvent.event_date,
          venue: selectedEvent.venue,
        });

        setGeneratedTicket(freeTicket);
        setCurrentStep(5);
      } catch (err) {
        console.error(err);
      } finally {
        setIssuingFreePass(false);
      }
      return;
    }

    // Paid Ticket Flow via M-Pesa
    const payload: InitiateMpesaInput = {
      booking_id: `bk-guest-${Date.now()}`,
      phone_number: phone,
      amount: totalAmount,
      event_name: selectedEvent.name,
      holder_name: fullName || "Guest Attendee",
      holder_email: email || "guest@royaltouch.com",
      seat_number: selectedSeat || "07",
      ticket_tier: selectedTicketClass.name as any,
      event_date: selectedEvent.event_date,
      venue: selectedEvent.venue,
      user_id: user?.id ?? null,
    };

    setMpesaPayload(payload);
    setIsMpesaModalOpen(true);
  };

  const handlePaymentConfirmed = (ticket: Ticket) => {
    setGeneratedTicket(ticket);
    setIsMpesaModalOpen(false);
    setCurrentStep(5);
  };

  return (
    <div className="relative min-w-0 bg-[#f8fafc] dark:bg-[#0b0e14] text-foreground font-sans overflow-x-hidden transition-colors duration-300">
      {/* 1. HERO HEADER */}
      <section className="relative min-h-[50vh] flex flex-col items-center justify-start overflow-hidden pt-12 pb-16 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b0e14]">
        <div className="absolute inset-0 z-0">
          {heroImages.map((src, idx) => (
            <img
              key={src}
              src={src}
              alt={`Royal Booking Hero ${idx}`}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[2500ms] ease-in-out scale-105 ${
                idx === currentImgIndex ? "opacity-15 dark:opacity-25" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-slate-50/95 to-[#f8fafc] dark:from-[#0b0e14]/90 dark:via-[#0b0e14]/95 dark:to-[#0b0e14]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10 w-full text-center mt-12 md:mt-16 space-y-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-none bg-gold/10 border border-gold/40 text-gold text-[10px] font-black uppercase tracking-[0.3em] shadow-sm">
                <ShieldCheck size={14} className="text-gold" /> 5-Screen Guest Checkout · Instant M-Pesa PDF Pass
              </div>
            </div>

            <h1 className="text-4xl sm:text-7xl lg:text-[90px] font-black tracking-tighter uppercase leading-[0.88] text-[#0b0e14] dark:text-white">
              Instant Ticket <br />
              <span className="text-gold font-display font-normal">Checkout.</span>
            </h1>

            <p className="max-w-2xl mx-auto text-sm sm:text-lg md:text-xl font-medium text-slate-700 dark:text-gray-300 leading-relaxed">
              No account creation required. Select your event, pick your pass tier, complete M-Pesa payment, and receive your PDF gate ticket automatically.
            </p>
          </div>
        </div>
      </section>

      {/* 2. 5-STEP CHECKOUT PROGRESS BAR */}
      <section className="py-6 bg-slate-100 dark:bg-[#121722] border-b border-slate-200 dark:border-white/10 sticky top-20 z-30 shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-5 gap-2 sm:gap-4 text-center">
            {[
              { step: 1, label: "01. Event" },
              { step: 2, label: "02. Ticket Class" },
              { step: 3, label: "03. Details" },
              { step: 4, label: "04. Summary" },
              { step: 5, label: "05. Pass Ready" },
            ].map((s) => (
              <button
                key={s.step}
                onClick={() => {
                  if (s.step < currentStep) setCurrentStep(s.step as any);
                }}
                className={cn(
                  "py-3 px-2 rounded-none text-[9px] sm:text-[10px] font-black uppercase tracking-widest border transition-all truncate cursor-pointer",
                  currentStep === s.step
                    ? "bg-gold text-black border-gold shadow-md"
                    : currentStep > s.step
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-white dark:bg-black/30 border-slate-200 dark:border-white/10 text-muted-foreground"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CHECKOUT WIZARD BODY (SCREENS 1 TO 5) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20 relative z-20">
        <div className="max-w-5xl mx-auto">
          {/* SCREEN 1: BROWSE & CHOOSE EVENT (HORIZONTALLY ARRANGED ACROSS IN GRID WITH POSTER IMAGES) */}
          {currentStep === 1 && (
            <div className="bg-white dark:bg-[#121722] border border-slate-200 dark:border-white/10 p-8 sm:p-12 rounded-none shadow-xl space-y-8 animate-in fade-in duration-300">
              <div className="space-y-2 border-b border-slate-200 dark:border-white/10 pb-4">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Step 01 Of 05</p>
                <h2 className="text-3xl font-black uppercase tracking-tight text-[#0b0e14] dark:text-white">
                  Select Available Engagement
                </h2>
              </div>

              {loadingEvents ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                  <Loader2 size={40} className="text-gold animate-spin" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Loading Registry...</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {events.map((evt) => (
                    <div
                      key={evt.id}
                      className="group bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 hover:border-gold transition-all rounded-none overflow-hidden shadow-sm flex flex-col justify-between"
                    >
                      {/* Event Poster Image */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
                        <img
                          src={evt.poster_url || "/back/e1.jfif"}
                          alt={evt.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                        />
                        <div className="absolute top-3 left-3 px-2.5 py-0.5 bg-black/80 text-gold font-black text-[8px] uppercase border border-gold/30">
                          {evt.event_type}
                        </div>
                      </div>

                      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <h3 className="text-lg font-black uppercase tracking-tight text-foreground group-hover:text-gold transition-colors leading-snug">
                            {evt.name}
                          </h3>
                          <p className="text-xs text-slate-600 dark:text-gray-400 font-medium leading-relaxed line-clamp-2">
                            {evt.description || "Executive production by Royal Touch Events."}
                          </p>
                          <div className="space-y-1 text-xs font-bold text-muted-foreground pt-1">
                            <p className="flex items-center gap-1.5"><Calendar size={13} className="text-gold shrink-0" /> {evt.event_date || "Date Confirmed"}</p>
                            <p className="flex items-center gap-1.5"><MapPin size={13} className="text-gold shrink-0" /> <span className="truncate">{evt.venue || "Nairobi Venue"}</span></p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSelectEvent(evt)}
                          className="h-12 w-full bg-gold text-black font-black text-[10px] uppercase tracking-widest rounded-none flex items-center justify-center gap-2 hover:bg-black hover:text-gold transition-all shadow-md cursor-pointer"
                        >
                          Book Event Pass <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SCREEN 2: CHOOSE TICKET CLASS & QUANTITY (SHOWS AVAILABLE SEATS / SOLD OUT / FREE ENTRY) */}
          {currentStep === 2 && selectedEvent && (
            <div className="bg-white dark:bg-[#121722] border border-slate-200 dark:border-white/10 p-8 sm:p-12 rounded-none shadow-xl space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Step 02 Of 05</p>
                  <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#0b0e14] dark:text-white">
                    Choose Pass Class & Seat Availability
                  </h2>
                </div>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft size={16} /> Back
                </button>
              </div>

              <div className="p-4 bg-gold/10 border border-gold/30 text-gold text-xs font-black uppercase tracking-widest">
                Selected: {selectedEvent.name} ({selectedEvent.event_date})
              </div>

              {/* Ticket Classes Options with Seats Available & Free Admission */}
              <div className="grid gap-4">
                {(selectedEvent.ticket_classes || [
                  { id: "c1", name: "Regular", description: "General admission", price: 500, quantity_available: 500, quantity_sold: 140, benefits: ["General Entrance"] },
                  { id: "c2", name: "VIP", description: "Priority VIP admission", price: 1500, quantity_available: 100, quantity_sold: 45, benefits: ["Priority Fast-Track Entrance", "VIP Reserved Seating"] },
                  { id: "c3", name: "Free Admission Pass", description: "Free student & public entry", price: 0, quantity_available: 200, quantity_sold: 50, benefits: ["Free General Entry", "Exhibition Floor"] },
                ]).map((tc) => {
                  const isSelected = selectedTicketClass?.id === tc.id || selectedTicketClass?.name === tc.name;
                  const availableSeats = Math.max(0, tc.quantity_available - tc.quantity_sold);
                  const isSoldOut = availableSeats <= 0;
                  const isFree = tc.price === 0;

                  return (
                    <div
                      key={tc.id}
                      onClick={() => {
                        if (!isSoldOut) setSelectedTicketClass(tc);
                      }}
                      className={cn(
                        "p-6 border rounded-none space-y-4 transition-all relative",
                        isSoldOut
                          ? "bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/10 opacity-60 cursor-not-allowed"
                          : isSelected
                          ? "bg-gold/10 border-gold ring-1 ring-gold shadow-md cursor-pointer"
                          : "bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/10 hover:border-gold cursor-pointer"
                      )}
                    >
                      <div className="flex flex-wrap justify-between items-center gap-2">
                        <div className="flex items-center gap-3">
                          <span className="font-black text-lg uppercase tracking-wider text-foreground">{tc.name}</span>
                          {isFree && (
                            <span className="px-2.5 py-0.5 bg-emerald-500 text-black font-black text-[9px] uppercase tracking-widest">
                              FREE ENTRY
                            </span>
                          )}
                        </div>

                        <div className="text-right">
                          <span className="font-mono text-xl font-black text-gold block">
                            {isFree ? "FREE" : formatKes(tc.price)}
                          </span>
                          <span
                            className={cn(
                              "text-[9px] font-black uppercase tracking-widest font-mono block",
                              isSoldOut ? "text-rose-500" : availableSeats < 10 ? "text-amber-500" : "text-emerald-500"
                            )}
                          >
                            {isSoldOut ? "● ALL SEATS OCCUPIED / SOLD OUT" : `● ${availableSeats} Available Seats`}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground">{tc.description}</p>

                      <ul className="grid sm:grid-cols-2 gap-2 text-xs font-bold text-slate-600 dark:text-gray-300">
                        {tc.benefits.map((b, bIdx) => (
                          <li key={bIdx} className="flex items-center gap-2">
                            <CheckCircle2 size={12} className="text-gold shrink-0" /> {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select Quantity</p>
                  <p className="text-lg font-black text-foreground">{quantity} Ticket Pass(es)</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="h-10 w-10 bg-white dark:bg-black/50 border border-slate-300 dark:border-white/10 flex items-center justify-center font-black cursor-pointer hover:border-gold"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-mono text-lg font-black w-8 text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    className="h-10 w-10 bg-white dark:bg-black/50 border border-slate-300 dark:border-white/10 flex items-center justify-center font-black cursor-pointer hover:border-gold"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <button
                onClick={() => setCurrentStep(3)}
                disabled={!selectedTicketClass || (selectedTicketClass.quantity_available - selectedTicketClass.quantity_sold <= 0)}
                className="w-full h-16 bg-gold text-black font-black text-xs uppercase tracking-[0.2em] rounded-none flex items-center justify-center gap-3 hover:bg-black hover:text-gold transition-all shadow-xl cursor-pointer disabled:opacity-50"
              >
                Continue To Details ({selectedTicketClass?.price === 0 ? "FREE ENTRY" : formatKes(calculateTotal())}) <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* SCREEN 3: CUSTOMER DETAILS (GUEST CHECKOUT - NO forced registration!) */}
          {currentStep === 3 && (
            <div className="bg-white dark:bg-[#121722] border border-slate-200 dark:border-white/10 p-8 sm:p-12 rounded-none shadow-xl space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Step 03 Of 05</p>
                  <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#0b0e14] dark:text-white">
                    Attendee Credentials
                  </h2>
                </div>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft size={16} /> Back
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Daniel Maina"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-14 bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-none px-5 text-xs font-bold text-foreground outline-none focus:border-gold"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">
                      Email Address (For PDF Delivery) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Ex: daniel@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-14 bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-none px-5 text-xs font-bold text-foreground outline-none focus:border-gold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">
                      M-Pesa Mobile Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: 0712345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-14 bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-none px-5 text-xs font-bold text-foreground outline-none focus:border-gold"
                    />
                  </div>
                </div>
              </div>

              <button
                disabled={!fullName || !email || !phone}
                onClick={() => setCurrentStep(4)}
                className="w-full h-16 bg-gold text-black font-black text-xs uppercase tracking-[0.2em] rounded-none flex items-center justify-center gap-3 hover:bg-black hover:text-gold transition-all shadow-xl cursor-pointer disabled:opacity-50"
              >
                Proceed To Order Summary <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* SCREEN 4: ORDER SUMMARY & PAY NOW (LIPA NA M-PESA PAYBILL 303030 / ACC 2053270290) */}
          {currentStep === 4 && selectedEvent && selectedTicketClass && (
            <div className="bg-white dark:bg-[#121722] border border-slate-200 dark:border-white/10 p-8 sm:p-12 rounded-none shadow-xl space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Step 04 Of 05</p>
                  <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#0b0e14] dark:text-white">
                    Order Summary & M-Pesa Payment
                  </h2>
                </div>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft size={16} /> Back
                </button>
              </div>

              <div className="p-8 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 space-y-4">
                <div className="flex justify-between items-start border-b border-slate-200 dark:border-white/10 pb-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gold">{selectedEvent.event_type}</p>
                    <h3 className="text-xl font-black uppercase text-foreground">{selectedEvent.name}</h3>
                    <p className="text-xs text-muted-foreground">{selectedEvent.event_date} · {selectedEvent.venue}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-bold">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Attendee Name:</span>
                    <span className="text-foreground">{fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Email:</span>
                    <span className="text-foreground">{email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pass Class:</span>
                    <span className="text-gold font-black">{selectedTicketClass.name} × {quantity}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex justify-between items-center text-lg font-black">
                  <span className="uppercase tracking-widest text-foreground">Total Checkout Amount:</span>
                  <span className="font-mono text-2xl text-gold">
                    {selectedTicketClass.price === 0 ? "FREE ENTRY / KSh 0" : formatKes(calculateTotal())}
                  </span>
                </div>
              </div>

              {selectedTicketClass.price === 0 ? (
                <button
                  onClick={handleProceedToPayment}
                  disabled={issuingFreePass}
                  className="w-full h-16 bg-emerald-500 text-black font-black text-xs uppercase tracking-[0.2em] rounded-none flex items-center justify-center gap-3 hover:bg-black hover:text-emerald-400 transition-all shadow-xl cursor-pointer disabled:opacity-50"
                >
                  {issuingFreePass ? <Loader2 size={18} className="animate-spin" /> : <>Claim Free Ticket Pass <Gift size={18} /></>}
                </button>
              ) : (
                /* OFFICIAL LIPA NA M-PESA PAYBILL CARD */
                <div className="space-y-6">
                  <div className="p-6 bg-emerald-500/10 border-2 border-emerald-500/40 rounded-none space-y-4">
                    <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2">
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-xs uppercase tracking-widest">
                        <Smartphone size={16} /> Lipa Na M-Pesa Paybill
                      </div>
                      <span className="px-2.5 py-0.5 bg-emerald-500 text-black font-black text-[9px] uppercase tracking-widest">
                        Official Payment
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-black/40 border border-emerald-500/30 p-3.5 flex flex-col justify-between">
                        <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Paybill Number</span>
                        <span className="font-mono text-2xl font-black text-emerald-500 mt-1">303030</span>
                      </div>

                      <div className="bg-white dark:bg-black/40 border border-emerald-500/30 p-3.5 flex flex-col justify-between">
                        <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Account Number</span>
                        <span className="font-mono text-2xl font-black text-gold mt-1">2053270290</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleProceedToPayment}
                    className="w-full h-16 bg-emerald-500 text-black font-black text-xs uppercase tracking-[0.2em] rounded-none flex items-center justify-center gap-3 hover:bg-black hover:text-emerald-400 transition-all shadow-xl cursor-pointer"
                  >
                    <Smartphone size={20} /> Proceed To Verify M-Pesa Payment ({formatKes(calculateTotal())})
                  </button>
                </>
              )}
            </div>
          )}

          {/* SCREEN 5: SUCCESS PAGE - AUTO PDF GENERATION & ONE-CLICK DOWNLOAD */}
          {currentStep === 5 && generatedTicket && (
            <div className="bg-white dark:bg-[#121722] border border-gold/40 p-8 sm:p-14 rounded-none shadow-2xl space-y-8 text-center animate-in zoom-in-95 duration-500">
              <div className="h-20 w-20 bg-emerald-500 text-black flex items-center justify-center mx-auto shadow-2xl">
                <CheckCircle2 size={44} />
              </div>

              <div className="space-y-3">
                <span className="px-4 py-1 bg-gold/10 text-gold font-black text-[10px] uppercase tracking-widest border border-gold/30">
                  Step 05 Of 05 · Ticket Issued
                </span>
                <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0b0e14] dark:text-white">
                  {generatedTicket.price === 0 ? "Free Pass Confirmed!" : "Payment Confirmed!"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 font-medium max-w-md mx-auto leading-relaxed">
                  Your ticket <span className="font-mono text-gold font-bold">{generatedTicket.ticket_code}</span> has been generated and sent to <span className="text-foreground font-bold">{email}</span>.
                </p>
              </div>

              {/* Digital Pass Preview & Actions */}
              <div className="p-6 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 space-y-4 max-w-md mx-auto text-left">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-gold">Gate Pass Summary</span>
                  <span className="text-[9px] font-mono text-emerald-400 font-bold">STATUS: VALID PASS</span>
                </div>
                <div className="text-xs space-y-1">
                  <p className="font-bold text-foreground">{generatedTicket.event_name}</p>
                  <p className="text-muted-foreground">{generatedTicket.holder_name} · {generatedTicket.ticket_tier} Pass</p>
                  <p className="text-muted-foreground font-mono">Seat Assignment: Seat {generatedTicket.seat_number || "GA"}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                <button
                  onClick={() => setIsPassModalOpen(true)}
                  className="h-14 px-8 bg-gold text-black font-black text-xs uppercase tracking-widest rounded-none flex items-center justify-center gap-2 hover:bg-black hover:text-gold transition-all shadow-xl cursor-pointer w-full sm:w-auto"
                >
                  <Download size={16} /> Download / Print PDF Ticket
                </button>

                <Link
                  to="/"
                  className="h-14 px-8 border border-slate-300 dark:border-white/10 text-foreground font-black text-xs uppercase tracking-widest rounded-none flex items-center justify-center hover:border-gold transition-all w-full sm:w-auto"
                >
                  Return To Command
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* M-PESA PAYMENT MODAL */}
      <MpesaPaymentModal
        isOpen={isMpesaModalOpen}
        onClose={() => setIsMpesaModalOpen(false)}
        bookingData={mpesaPayload}
        onPaymentSuccess={handlePaymentConfirmed}
      />

      {/* TICKET PASS MODAL (PDF / PRINT VIEW) */}
      <TicketPassModal
        ticket={generatedTicket}
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
      />
    </div>
  );
}
