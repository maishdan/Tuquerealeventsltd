export type UserRole = "admin" | "staff" | "customer" | "client";
export type BookingStatus = "pending" | "confirmed" | "planning" | "inquiry" | "cancelled";
export type BookingPaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
export type BookingState = "PENDING_PAYMENT" | "CONFIRMED" | "CANCELLED" | "EXPIRED" | "COMPLETED";
export type EventStatus = "in-progress" | "upcoming" | "completed" | "delayed" | "confirmed" | "planning" | "inquiry";
export type EventLifecycleState = "DRAFT" | "PUBLISHED" | "COMPLETED" | "CANCELLED";
export type ContactStatus = "new" | "read" | "replied" | "archived";
export type TicketTier = "VVIP" | "VIP" | "General Access" | "Regular" | "Early Bird" | "Staff / Press";
export type TicketStatus = "valid" | "used" | "cancelled";
export type SeatStatus = "available" | "selected" | "occupied" | "reserved";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Booking = {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  event_type: string;
  event_date: string | null;
  guests: string | null;
  budget: string;
  services: string[];
  notes: string | null;
  status: BookingStatus;
  seat_number?: string | null;
  payment_status?: BookingPaymentStatus;
  booking_state?: BookingState;
  created_at: string;
};

export type Seat = {
  id: string;
  event_id: string | null;
  seat_number: string;
  seat_type: string;
  status: SeatStatus;
  price: number;
  locked_by?: string | null;
  locked_until?: string | null;
};

export type PaymentRecord = {
  id: string;
  booking_id: string;
  phone_number: string;
  amount: number;
  mpesa_receipt: string;
  provider: "M-PESA" | "CASH" | "CARD" | "OTHER";
  status: BookingPaymentStatus;
  paid_at: string;
};

export type TicketClass = {
  id: string;
  event_id?: string | null;
  name: string;
  description: string;
  price: number;
  quantity_available: number;
  quantity_sold: number;
  benefits: string[];
};

export type ContactInquiry = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: ContactStatus;
  created_at: string;
};

export type EventRecord = {
  id: string;
  user_id: string | null;
  booking_id: string | null;
  name: string;
  event_type: string;
  event_date: string | null;
  venue: string | null;
  budget: number | null;
  status: EventStatus;
  featured?: boolean | null;
  lifecycle_state?: EventLifecycleState;
  description?: string | null;
  poster_url?: string | null;
  organizer_name?: string | null;
  organizer_email?: string | null;
  organizer_phone?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  ticket_classes?: TicketClass[];
  team_count: number;
  vendor_count: number;
  created_at: string;
};

export type Message = {
  id: string;
  user_id: string;
  from_name: string;
  from_role: string | null;
  subject: string | null;
  body: string;
  read: boolean;
  created_at: string;
};

export type FinancialRecord = {
  id: string;
  user_id: string | null;
  record_type: "revenue" | "expense" | "invoice";
  label: string;
  amount: number;
  client_name: string | null;
  due_date: string | null;
  month_key: string | null;
  created_at: string;
};

export type TeamMember = {
  id: string;
  full_name: string;
  role: string;
  performance_score: number;
  events_managed: number;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string | null;
  item_name: string;
  order_date: string;
  total_amount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  created_at: string;
};

export type Ticket = {
  id: string;
  user_id: string | null;
  booking_id: string | null;
  event_id: string | null;
  event_name: string;
  holder_name: string;
  holder_email: string;
  holder_phone?: string | null;
  ticket_tier: TicketTier;
  price: number;
  quantity?: number;
  status: TicketStatus;
  ticket_code: string;
  ticket_number?: string;
  ticket_token?: string;
  seat_number?: string | null;
  payment_status?: BookingPaymentStatus;
  payment_method?: "M-Pesa" | "Cash" | "Card" | "Bank Transfer" | "Other";
  event_date: string | null;
  venue: string | null;
  created_at: string;
  used_at?: string | null;
};

export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile> & { id: string; email: string }; Update: Partial<Profile> };
      bookings: { Row: Booking; Insert: Omit<Booking, "id" | "created_at" | "status"> & { status?: BookingStatus }; Update: Partial<Booking> };
      contact_inquiries: { Row: ContactInquiry; Insert: Omit<ContactInquiry, "id" | "created_at" | "status">; Update: Partial<ContactInquiry> };
      events: { Row: EventRecord; Insert: Partial<EventRecord> & { name: string; event_type: string }; Update: Partial<EventRecord> };
      messages: { Row: Message; Insert: Omit<Message, "id" | "created_at" | "read">; Update: Partial<Message> };
      financial_records: { Row: FinancialRecord; Insert: Omit<FinancialRecord, "id" | "created_at">; Update: Partial<FinancialRecord> };
      team_members: { Row: TeamMember; Insert: Omit<TeamMember, "id" | "created_at">; Update: Partial<TeamMember> };
      orders: { Row: Order; Insert: Partial<Order> & { item_name: string }; Update: Partial<Order> };
      tickets: { Row: Ticket; Insert: Omit<Ticket, "id" | "created_at" | "ticket_code" | "status"> & { ticket_code?: string; status?: TicketStatus }; Update: Partial<Ticket> };
      seats: { Row: Seat; Insert: Omit<Seat, "id">; Update: Partial<Seat> };
      payments: { Row: PaymentRecord; Insert: Omit<PaymentRecord, "id">; Update: Partial<PaymentRecord> };
    };
  };
};
