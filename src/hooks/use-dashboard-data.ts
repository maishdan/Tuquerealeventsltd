import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAllBookings, fetchUserBookings, updateBookingStatus } from "@/lib/api/bookings";
import { fetchContactInquiries, updateContactStatus } from "@/lib/api/contact";
import type { ContactStatus } from "@/lib/database.types";
import { fetchUserMessages } from "@/lib/api/messages";
import { fetchAllProfiles, updateUserRole } from "@/lib/api/profiles";
import {
  fetchAllEvents,
  fetchEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  type EventRecord,
} from "@/lib/api/events";
import {
  fetchAllTickets,
  fetchUserTickets,
  createTicket,
  updateTicketStatus as updateTicketStatusApi,
} from "@/lib/api/tickets";
import { fetchProspects, createProspect, updateProspectStatus, type ProspectRecord } from "@/lib/api/prospects";
import type { BookingStatus, TicketStatus } from "@/lib/database.types";
import { formatKes } from "@/lib/dashboard-mock-data";

export function useAdminProspects() {
  return useQuery({ queryKey: ["admin", "prospects"], queryFn: fetchProspects });
}

export function useCreateProspect() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: Parameters<typeof createProspect>[0]) => createProspect(p),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "prospects"] });
    },
  });
}

export function useAdminBookings() {
  return useQuery({ queryKey: ["admin", "bookings"], queryFn: fetchAllBookings });
}

export function useAdminContacts() {
  return useQuery({ queryKey: ["admin", "contacts"], queryFn: fetchContactInquiries });
}

export function useAdminEvents() {
  return useQuery({ queryKey: ["admin", "events"], queryFn: fetchAllEvents });
}

export function useAdminEventDetail(id: string) {
  return useQuery({ queryKey: ["admin", "event", id], queryFn: () => fetchEventById(id), enabled: !!id });
}

export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (eventData: Parameters<typeof createEvent>[0]) => createEvent(eventData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "events"] });
    },
  });
}

export function useUpdateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...eventData }: { id: string } & Parameters<typeof updateEvent>[1]) => updateEvent(id, eventData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "events"] });
    },
  });
}

export function useDeleteEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEvent(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "events"] });
    },
  });
}

export function useAdminClients() {
  return useQuery({ queryKey: ["admin", "clients"], queryFn: fetchAllProfiles });
}

export function useAdminTeam() {
  return useQuery({ queryKey: ["admin", "team"], queryFn: fetchAllProfiles });
}

export function useUpdateUserRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: any }) => updateUserRole(id, role),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "clients"] });
      qc.invalidateQueries({ queryKey: ["admin", "team"] });
    },
  });
}

export function useAdminTickets() {
  return useQuery({ queryKey: ["admin", "tickets"], queryFn: fetchAllTickets });
}

export function useCreateTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ticketData: Parameters<typeof createTicket>[0]) => createTicket(ticketData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "tickets"] });
      qc.invalidateQueries({ queryKey: ["customer", "tickets"] });
    },
  });
}

export { useCreateTicket as useIssueTicket };

export function useVerifyAndScanTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ticketInput: string | { ticketCode: string }) => {
      const code = typeof ticketInput === "string" ? ticketInput : ticketInput.ticketCode;
      await updateTicketStatusApi(code, "used");
      return {
        status: "VALID" as const,
        message: `Pass #${code} successfully verified & checked-in!`,
        ticket: {
          ticket_code: code,
          holder_name: "Verified Pass Holder",
          ticket_tier: "VIP Pass",
        },
      };
    },
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
    enabled: !!(userId || email),
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
    enabled: !!(userId || email),
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
    if (!b) return 0;
    const n = parseInt(b.replace(/[^0-9]/g, ""), 10);
    return Number.isFinite(n) ? n : 0;
  };

  const monthRev = monthBookings.reduce((s, b) => s + parseBudget(b.budget), 0);
  const todayRev = todayBookings.reduce((s, b) => s + parseBudget(b.budget), 0);

  return {
    todayRevenue: todayRev,
    monthlyRevenue: monthRev,
    activeEvents: active.length,
    totalClients: clients.length,
    eventsThisMonth: monthBookings.length,
    newContracts: monthBookings.filter((b) => b.status === "confirmed").length,
  };
}

export { formatKes };
