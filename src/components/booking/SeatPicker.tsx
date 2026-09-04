import React, { useState, useEffect } from "react";
import { useSeats, useLockSeat, useReleaseSeat, formatKes } from "@/hooks/use-dashboard-data";
import { Armchair, Clock, ShieldCheck, Zap, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SeatPickerProps {
  eventId?: string;
  selectedSeat: string | null;
  onSelectSeat: (seatNumber: string, price: number) => void;
}

export function SeatPicker({ eventId, selectedSeat, onSelectSeat }: SeatPickerProps) {
  const { data: seats = [], isLoading } = useSeats(eventId);
  const lockSeatMutation = useLockSeat();
  const releaseSeatMutation = useReleaseSeat();

  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes timer
  const [lockActive, setLockActive] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (lockActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setLockActive(false);
      if (selectedSeat) {
        releaseSeatMutation.mutate(`seat-${selectedSeat}`);
      }
    }
    return () => clearInterval(timer);
  }, [lockActive, timeLeft, selectedSeat]);

  const handleSeatClick = (seatNumber: string, price: number, currentStatus: string) => {
    if (currentStatus === "occupied" || currentStatus === "reserved") return;

    if (selectedSeat === seatNumber) {
      // Deselect
      onSelectSeat("", 0);
      setLockActive(false);
      releaseSeatMutation.mutate(`seat-${seatNumber}`);
    } else {
      // Select new seat
      onSelectSeat(seatNumber, price);
      setTimeLeft(600);
      setLockActive(true);
      lockSeatMutation.mutate({ seatId: `seat-${seatNumber}` });
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-card border border-border p-6 md:p-8 rounded-[32px] space-y-8">
      {/* Header & Lock Alert */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gold">Seat Reservation Grid</p>
          <h3 className="text-xl font-bold uppercase tracking-tight text-foreground">Interactive Venue Layout</h3>
        </div>

        {selectedSeat && lockActive && (
          <div className="bg-gold/10 border border-gold/30 px-5 py-2.5 rounded-2xl flex items-center gap-3">
            <Clock size={16} className="text-gold animate-pulse" />
            <div>
              <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Seat {selectedSeat} Locked For</p>
              <p className="font-mono text-xs font-black text-gold">{formatTimer(timeLeft)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Stage Orientation */}
      <div className="relative text-center py-3 bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20 border border-gold/30 rounded-2xl">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">▲ STAGE / MAIN PERFORMANCE ZONE ▲</p>
      </div>

      {/* Seat Grid Layout */}
      <div className="py-4">
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 sm:gap-4 max-w-xl mx-auto">
          {seats.map((seat) => {
            const isSelected = selectedSeat === seat.seat_number;
            const isOccupied = seat.status === "occupied";
            const isReserved = seat.status === "reserved";
            const isVip = seat.seat_type === "VIP";

            return (
              <button
                key={seat.id}
                type="button"
                disabled={isOccupied || isReserved}
                onClick={() => handleSeatClick(seat.seat_number, seat.price, seat.status)}
                className={cn(
                  "relative group flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border transition-all duration-300",
                  isOccupied
                    ? "bg-rose-500/10 border-rose-500/30 text-rose-500/40 cursor-not-allowed"
                    : isReserved
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-500/40 cursor-not-allowed"
                    : isSelected
                    ? "bg-gold text-black border-gold font-black scale-105 shadow-xl shadow-gold/20"
                    : "bg-muted/50 border-border text-foreground hover:border-gold hover:bg-gold/10"
                )}
              >
                <Armchair size={22} className={cn(isSelected ? "text-black" : "text-foreground")} />
                <span className="font-mono text-xs font-black mt-1">S-{seat.seat_number}</span>
                <span className="text-[8px] font-extrabold uppercase opacity-80">{isVip ? "VIP" : "GA"}</span>

                {isOccupied && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-rose-600 text-white text-[7px] font-black uppercase rounded-full">
                    BOOKED
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 pt-4 border-t border-border text-[9px] font-black uppercase tracking-widest text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-md bg-muted border border-border"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-md bg-gold border border-gold"></div>
          <span className="text-gold">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-md bg-rose-500/20 border border-rose-500/40"></div>
          <span>Occupied</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-md bg-amber-500/20 border border-amber-500/40"></div>
          <span>Reserved</span>
        </div>
      </div>
    </div>
  );
}
