export type UserRole = "admin" | "customer";
export type BookingStatus = "pending" | "confirmed" | "planning" | "inquiry" | "cancelled";
export type EventStatus = "in-progress" | "upcoming" | "completed" | "delayed" | "confirmed" | "planning" | "inquiry";
export type ContactStatus = "new" | "read" | "replied" | "archived";

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
  created_at: string;
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
    };
  };
};
