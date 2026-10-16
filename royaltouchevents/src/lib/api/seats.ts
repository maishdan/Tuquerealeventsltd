import type { Seat, SeatStatus } from "../database.types";

// Default seat map layout (20 seats: 01 to 20)
const defaultSeats: Seat[] = Array.from({ length: 20 }, (_, idx) => {
  const num = (idx + 1).toString().padStart(2, "0");
  const isVip = idx < 4;
  const isOccupied = idx === 2 || idx === 6 || idx === 11;
  const isReserved = idx === 1;

  return {
    id: `seat-${num}`,
    event_id: "default-event",
    seat_number: num,
    seat_type: isVip ? "VIP" : "Standard",
    status: isOccupied ? "occupied" : isReserved ? "reserved" : "available",
    price: isVip ? 5000 : 2500,
    locked_by: null,
    locked_until: null,
  };
});

let inMemorySeats: Seat[] = [...defaultSeats];

export async function fetchSeats(eventId?: string): Promise<Seat[]> {
  const now = new Date().getTime();
  // Auto-release expired locks (> 10 mins)
  inMemorySeats = inMemorySeats.map((s) => {
    if (s.status === "selected" && s.locked_until) {
      const lockTime = new Date(s.locked_until).getTime();
      if (now > lockTime) {
        return { ...s, status: "available", locked_by: null, locked_until: null };
      }
    }
    return s;
  });

  return inMemorySeats;
}

export async function lockSeat(seatId: string, userId?: string): Promise<Seat> {
  const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  let updatedSeat: Seat | null = null;

  inMemorySeats = inMemorySeats.map((s) => {
    if (s.id === seatId) {
      if (s.status === "occupied") {
        throw new Error("Seat is already occupied by another attendee.");
      }
      updatedSeat = {
        ...s,
        status: "selected",
        locked_by: userId || "guest",
        locked_until: tenMinutesLater,
      };
      return updatedSeat;
    }
    return s;
  });

  if (!updatedSeat) throw new Error("Seat not found");
  return updatedSeat;
}

export async function releaseSeat(seatId: string): Promise<Seat> {
  let updatedSeat: Seat | null = null;

  inMemorySeats = inMemorySeats.map((s) => {
    if (s.id === seatId) {
      updatedSeat = {
        ...s,
        status: "available",
        locked_by: null,
        locked_until: null,
      };
      return updatedSeat;
    }
    return s;
  });

  if (!updatedSeat) throw new Error("Seat not found");
  return updatedSeat;
}

export async function markSeatOccupied(seatNumber: string): Promise<void> {
  inMemorySeats = inMemorySeats.map((s) => {
    if (s.seat_number === seatNumber || s.id === seatNumber) {
      return { ...s, status: "occupied", locked_by: null, locked_until: null };
    }
    return s;
  });
}
