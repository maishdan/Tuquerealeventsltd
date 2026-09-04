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

export type MpesaSmsVerificationResult = {
  isMpesa: boolean;
  receiptCode: string | null;
  amount: number | null;
  expectedAmount: number;
  recipient: string | null;
  dateTimeStr: string | null;
  amountMatches: boolean;
  dateValid: boolean;
  isValid: boolean;
  failureReason: string | null;
  confidenceScore: number;
  rawMessage: string;
};

export function parseAndVerifyMpesaSms(
  smsText: string,
  expectedAmount: number
): MpesaSmsVerificationResult {
  const cleanText = smsText.trim();

  // 1. Regex for 10-character uppercase M-Pesa Transaction Code (e.g. ABCDE12345 or RTE8923451)
  const codeMatch = cleanText.match(/\b([A-Z0-9]{10})\b/);
  const receiptCode = codeMatch ? codeMatch[1] : null;

  // 2. Regex for Amount (e.g. Ksh500.00, Ksh 500, KSh 1,500.00)
  const amountMatch = cleanText.match(/(?:Ksh|KSH|Ksh\.|KSh\.|KES)\s*([\d,]+(?:\.\d{2})?)/i);
  let parsedAmount: number | null = null;
  if (amountMatch) {
    parsedAmount = parseFloat(amountMatch[1].replace(/,/g, ""));
  }

  // 3. Recipient detection (e.g. sent to JOHN DOE 0722000000)
  const recipientMatch = cleanText.match(/sent to ([A-Z0-9\s]+?)(?:\s+\d{10}|\s+on|\.|$)/i);
  const recipient = recipientMatch ? recipientMatch[1].trim() : null;

  // 4. Date & Time detection (e.g. on 23/6/26 at 3:41 PM or on 04/09/26 at 8:15 PM)
  const timeMatch = cleanText.match(/on\s+(\d{1,2}\/\d{1,2}\/\d{2,4})\s+at\s+(\d{1,2}:\d{2}\s*(?:AM|PM)?)/i);

  const today = new Date();
  let dateValid = false;
  let dateTimeStr = `${today.toLocaleDateString()} at ${today.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

  if (timeMatch) {
    dateTimeStr = `${timeMatch[1]} at ${timeMatch[2]}`;
    const smsDateParts = timeMatch[1].split("/");

    // Compare date parts with current day/month/year or recent date
    if (smsDateParts.length >= 3) {
      const smsDay = parseInt(smsDateParts[0], 10);
      const smsMonth = parseInt(smsDateParts[1], 10);

      const currentDay = today.getDate();
      const currentMonth = today.getMonth() + 1;

      // Allow same day/month or recent transaction
      dateValid = smsDay === currentDay && smsMonth === currentMonth;
    } else {
      dateValid = true;
    }
  } else {
    // If no date string specified, default to current time
    dateValid = true;
  }

  const isMpesa =
    cleanText.toLowerCase().includes("confirmed") ||
    cleanText.toLowerCase().includes("m-pesa") ||
    cleanText.toLowerCase().includes("ksh") ||
    !!receiptCode;

  // Exact amount match check (parsedAmount === expectedAmount)
  const amountMatches = parsedAmount !== null ? Math.abs(parsedAmount - expectedAmount) < 0.01 : false;

  let failureReason: string | null = null;
  if (!isMpesa) {
    failureReason = "Invalid M-Pesa Format: Message does not match genuine M-Pesa SMS structure.";
  } else if (!amountMatches) {
    failureReason = `Invalid Amount Detected: Found KSh ${parsedAmount ? parsedAmount.toLocaleString() : "0"}, but ticket requires exact KSh ${expectedAmount.toLocaleString()}.`;
  } else if (!dateValid) {
    failureReason = `Invalid Time & Date Detected: Message timestamp (${dateTimeStr}) does not match today's transaction date.`;
  }

  const isValid = isMpesa && !!receiptCode && amountMatches && dateValid;

  return {
    isMpesa,
    receiptCode,
    amount: parsedAmount,
    expectedAmount,
    recipient,
    dateTimeStr,
    amountMatches,
    dateValid,
    isValid,
    failureReason,
    confidenceScore: isValid ? 100 : 25,
    rawMessage: cleanText,
  };
}

export async function initiateMpesaStkPush(input: InitiateMpesaInput): Promise<StkPushResponse> {
  const checkoutRequestId = `ws_CO_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  return {
    checkout_request_id: checkoutRequestId,
    merchant_request_id: `MCH-${Date.now()}`,
    response_code: "0",
    response_description: "Success. Request accepted for processing.",
    customer_message: `Automated STK push pending. Please paste your M-Pesa SMS confirmation or transaction code below for instant verification.`,
  };
}

export async function processMpesaCallback(
  checkoutRequestId: string,
  input: InitiateMpesaInput,
  simulatedSuccess: boolean = true,
  providedReceipt?: string
): Promise<{ payment: PaymentRecord; ticket: Ticket | null }> {
  const mpesaReceipt = providedReceipt || `RTE${Math.floor(10000000 + Math.random() * 90000000)}`;
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
