import { Event, SectionInfo, getBookedSeats } from "@/data/events";
import { useMemo } from "react";

interface SeatGridProps {
  event: Event;
  selectedSeats: string[];
  onToggleSeat: (seatId: string, section: SectionInfo) => void;
  maxSeats: number;
}

export function SeatGrid({ event, selectedSeats, onToggleSeat, maxSeats }: SeatGridProps) {
  const bookedSeats = useMemo(() => getBookedSeats(event.id), [event.id]);

  return (
    <div className="space-y-6">
      {/* Screen / Stage */}
      <div className="mx-auto w-3/4 rounded-t-full bg-secondary py-3 text-center text-sm font-display font-semibold text-secondary-foreground">
        🎬 SCREEN / STAGE
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="h-4 w-4 rounded border border-border bg-muted" />
          <span className="text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-4 w-4 rounded bg-primary" />
          <span className="text-muted-foreground">Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-4 w-4 rounded bg-destructive/60" />
          <span className="text-muted-foreground">Booked</span>
        </div>
      </div>

      {/* Sections */}
      {event.sections.map((section) => (
        <div key={section.id} className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: section.color }} />
            <h3 className="font-display text-sm font-semibold text-foreground">
              {section.name}
            </h3>
            <span className="text-xs text-muted-foreground">
              — ₹{section.price.toLocaleString("en-IN")}/seat
            </span>
          </div>

          <div className="space-y-1.5 overflow-x-auto">
            {Array.from({ length: section.rows }, (_, rowIdx) => {
              const rowNum = rowIdx + 1;
              const rowLabel = String.fromCharCode(64 + rowNum);
              return (
                <div key={rowNum} className="flex items-center gap-1">
                  <span className="w-6 text-[10px] text-muted-foreground text-right shrink-0">
                    {rowLabel}
                  </span>
                  <div className="flex gap-1">
                    {Array.from({ length: section.seatsPerRow }, (_, colIdx) => {
                      const colNum = colIdx + 1;
                      const seatId = `${section.id}-${rowNum}-${colNum}`;
                      const isBooked = bookedSeats.has(seatId);
                      const isSelected = selectedSeats.includes(seatId);
                      const canSelect = !isBooked && (isSelected || selectedSeats.length < maxSeats);

                      return (
                        <button
                          key={colNum}
                          disabled={isBooked || !canSelect}
                          onClick={() => onToggleSeat(seatId, section)}
                          title={`${section.name} ${rowLabel}${colNum}${isBooked ? " (Booked)" : ""}`}
                          className={`h-7 w-7 rounded text-[9px] font-medium transition-all ${
                            isBooked
                              ? "bg-destructive/60 text-destructive-foreground cursor-not-allowed"
                              : isSelected
                              ? "bg-primary text-primary-foreground glow-primary scale-110"
                              : canSelect
                              ? "bg-muted border border-border text-muted-foreground hover:border-primary/50 hover:bg-primary/20 cursor-pointer"
                              : "bg-muted/50 border border-border/50 text-muted-foreground/40 cursor-not-allowed"
                          }`}
                        >
                          {colNum}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {selectedSeats.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          {selectedSeats.length} seat{selectedSeats.length > 1 ? "s" : ""} selected (max {maxSeats})
        </p>
      )}
    </div>
  );
}
