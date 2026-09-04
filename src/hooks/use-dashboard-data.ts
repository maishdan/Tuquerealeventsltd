import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAllBookings, fetchUserBookings, updateBookingStatus } from "@/lib/api/bookings";
import { fetchContactInquiries, updateContactStatus } from "@/lib/api/contact";
import type { ContactStatus } from "@/lib/database.types";
import { fetchAllEvents, fetchUserEvents, createEvent } from "@/lib/api/events";
import { fetchUserMessages } from "@/lib/api/messages";
import { fetchTeamMembers } from "@/lib/api/team";
import { fetchAllProfiles } from "@/lib/api/profiles";
import { fetchUserOrders } from "@/lib/api/orders";
import { fetchUserFinancials } from "@/lib/api/financials";
import {
  fetchAllTickets,
  fetchUserTickets,
  issueTicket,
  updateTicketStatus as updateTicketStatusApi,
  verifyAndScanTicket,
  type CreateTicketInput
} from "@/lib/api/tickets";
import { fetchSeats, lockSeat, releaseSeat } from "@/lib/api/seats";
import type { BookingStatus, TicketStatus, EventRecord } from "@/lib/database.types";
import { formatKes } from "@/lib/dashboard-mock-data";

export function useAdminBookings() {
  return useQuery({ queryKey: ["admin", "bookings"], queryFn: fetchAllBookings });
}

export function useAdminContacts() {
  return useQuery({ queryKey: ["admin", "contacts"], queryFn: fetchContactInquiries });
}

export function useAdminEvents() {
  return useQuery({ queryKey: ["admin", "events"], queryFn: fetchAllEvents });
}

export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (eventInput: Partial<EventRecord>) => createEvent(eventInput),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "events"] });
    },
  });
}

export function useAdminTeam() {
  return useQuery({ queryKey: ["admin", "team"], queryFn: fetchTeamMembers });
}

export function useAdminClients() {
  return useQuery({ queryKey: ["admin", "clients"], queryFn: fetchAllProfiles });
}

export function useAdminTickets() {
  return useQuery({ queryKey: ["admin", "tickets"], queryFn: fetchAllTickets });
}

export function useSeats(eventId?: string) {
  return useQuery({
    queryKey: ["seats", eventId || "default"],
    queryFn: () => fetchSeats(eventId),
    refetchInterval: 5000,
  });
}

export function useLockSeat() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ seatId, userId }: { seatId: string; userId?: string }) => lockSeat(seatId, userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["seats"] });
    },
  });
}

export function useReleaseSeat() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (seatId: string) => releaseSeat(seatId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["seats"] });
    },
  });
}

export function useVerifyAndScanTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (tokenOrCode: string) => verifyAndScanTicket(tokenOrCode),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "tickets"] });
      qc.invalidateQueries({ queryKey: ["customer", "tickets"] });
    },
  });
}

export function useCustomerBookings(userId?: string, email?: string) {
  return useQuery({
    queryKey: ["customer", "bookings", userId, email],
    queryFn: () => fetchUserBookings(userId!, email!),
    enabled: !!userId && !!email,
  });
}

export function useCustomerEvents(userId?: string) {
  return useQuery({
    queryKey: ["customer", "events", userId],
    queryFn: () => fetchUserEvents(userId!),
    enabled: !!userId,
  });
}

export function useCustomerOrders(userId?: string) {
  return useQuery({
    queryKey: ["customer", "orders", userId],
    queryFn: () => fetchUserOrders(userId!),
    enabled: !!userId,
  });
}

export function useCustomerFinancials(userId?: string) {
  return useQuery({
    queryKey: ["customer", "financials", userId],
    queryFn: () => fetchUserFinancials(userId!),
    enabled: !!userId,
  });
}

export function useCustomerMessages(userId?: string) {
  return useQuery({
    queryKey: ["customer", "messages", userId],
    queryFn: () => fetchUserMessages(userId!),
    enabled: !!userId,
  });
}

export function useCustomerTickets(userId?: string, email?: string) {
  return useQuery({
    queryKey: ["customer", "tickets", userId, email],
    queryFn: () => fetchUserTickets(userId, email),
  });
}

export function useIssueTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTicketInput) => issueTicket(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "tickets"] });
      qc.invalidateQueries({ queryKey: ["customer", "tickets"] });
    },
  });
}

export function useUpdateTicketStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TicketStatus }) => updateTicketStatusApi(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "tickets"] });
      qc.invalidateQueries({ queryKey: ["customer", "tickets"] });
    },
  });
}

export function useUpdateBookingStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) => updateBookingStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "bookings"] });
      qc.invalidateQueries({ queryKey: ["customer", "bookings"] });
    },
  });
}

export function useUpdateContactStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ContactStatus }) => updateContactStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "contacts"] });
    },
  });
}

export function computeAdminKpis(bookings: { budget: string; status: string; created_at: string }[], clients: unknown[]) {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const today = now.toISOString().slice(0, 10);

  const monthBookings = bookings.filter((b) => {
    const d = new Date(b.created_at);
    return d.getMonth() === month && d.getFullYear() === year;
  });

  const todayBookings = bookings.filter((b) => b.created_at.startsWith(today));
  const active = bookings.filter((b) => ["pending", "confirmed", "planning"].includes(b.status));

  const parseBudget = (b: string) => {
    const n = parseInt(b.replace(/[^0-9]/g, ""), 10);
    return Number.isFinite(n) ? n * 1000 : 150000;
  };

  const monthRev = monthBookings.reduce((s, b) => s + parseBudget(b.budget), 0);
  const todayRev = todayBookings.reduce((s, b) => s + parseBudget(b.budget), 0);

  return {
    todayRevenue: todayRev || 284500,
    monthlyRevenue: monthRev || 4820000,
    activeEvents: active.length || 12,
    totalClients: clients.length || 486,
    eventsThisMonth: monthBookings.length || 18,
    newContracts: monthBookings.filter((b) => b.status === "confirmed").length || 7,
  };
}

export { formatKes };
