import type { BookingPaymentStatus, PaymentRecord, Ticket } from "../database.types";
import { issueTicket } from "./tickets";
import { markSeatOccupied } from "./seats";

let inMemoryPayments: PaymentRecord[] = [];

export type InitiateMpesaInput = {
  booking_id: string;
  phone_number: string;
  amount: number;
  event_name: string;
  holder_name: string;
  holder_email: string;
  seat_number?: string | null;
  ticket_tier?: string;
  event_date?: string | null;
  venue?: string | null;
  user_id?: string | null;
};

export type StkPushResponse = {
  checkout_request_id: string;
  merchant_request_id: string;
  response_code: string;
  response_description: string;
  customer_message: string;
};

export async function initiateMpesaStkPush(input: InitiateMpesaInput): Promise<StkPushResponse> {
  const checkoutRequestId = `ws_CO_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  // Simulate M-Pesa STK push trigger
  return {
    checkout_request_id: checkoutRequestId,
    merchant_request_id: `MCH-${Date.now()}`,
    response_code: "0",
    response_description: "Success. Request accepted for processing.",
    customer_message: `STK Push prompt sent to ${input.phone_number}. Please enter M-Pesa PIN on your phone.`,
  };
}

export async function processMpesaCallback(
  checkoutRequestId: string,
  input: InitiateMpesaInput,
  simulatedSuccess: boolean = true
): Promise<{ payment: PaymentRecord; ticket: Ticket | null }> {
  const mpesaReceipt = `RTE${Math.floor(10000000 + Math.random() * 90000000)}`;
  const status: BookingPaymentStatus = simulatedSuccess ? "SUCCESS" : "FAILED";

  const paymentRecord: PaymentRecord = {
    id: `pay-${Date.now()}`,
    booking_id: input.booking_id,
    phone_number: input.phone_number,
    amount: input.amount,
    mpesa_receipt: mpesaReceipt,
    provider: "M-PESA",
    status,
    paid_at: new Date().toISOString(),
  };

  inMemoryPayments.push(paymentRecord);

  let generatedTicket: Ticket | null = null;

  if (simulatedSuccess) {
    if (input.seat_number) {
      await markSeatOccupied(input.seat_number);
    }

    generatedTicket = await issueTicket({
      user_id: input.user_id,
      booking_id: input.booking_id,
      event_name: input.event_name,
      holder_name: input.holder_name,
      holder_email: input.holder_email,
      ticket_tier: (input.ticket_tier as any) || "VIP",
      price: input.amount,
      event_date: input.event_date,
      venue: input.venue,
    });
  }

  return { payment: paymentRecord, ticket: generatedTicket };
}
