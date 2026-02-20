import { BookingDetails, mockEvents } from "@/data/events";
import { CheckCircle, Download, Ticket } from "lucide-react";

interface BillProps {
  booking: BookingDetails;
  onNewBooking: () => void;
}

export function Bill({ booking, onNewBooking }: BillProps) {
  const event = mockEvents.find(e => e.id === booking.eventId);
  if (!event) return null;

  // Group seats by section
  const seatsBySection: Record<string, { name: string; price: number; seats: string[] }> = {};
  booking.seats.forEach(seat => {
    const section = event.sections.find(s => s.id === seat.section);
    if (section) {
      if (!seatsBySection[section.id]) {
        seatsBySection[section.id] = { name: section.name, price: section.price, seats: [] };
      }
      const rowLabel = String.fromCharCode(64 + seat.row);
      seatsBySection[section.id].seats.push(`${rowLabel}${seat.col}`);
    }
  });

  return (
    <div className="animate-message-in space-y-6">
      {/* Success header */}
      <div className="text-center space-y-2">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full gradient-primary glow-primary-strong">
          <CheckCircle className="h-8 w-8 text-primary-foreground" />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground">Booking Confirmed!</h2>
        <p className="text-sm text-muted-foreground">Your tickets have been booked successfully</p>
      </div>

      {/* Bill card */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-primary" />
            <span className="font-display text-sm font-bold text-foreground">E-TICKET</span>
          </div>
          <span className="text-xs text-muted-foreground font-mono">{booking.bookingId}</span>
        </div>

        <div className="space-y-2">
          <h3 className="font-display text-lg font-bold text-foreground">{event.title}</h3>
          <p className="text-sm text-muted-foreground">{event.artist}</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div><span className="text-foreground font-medium">Venue:</span> {event.venue}</div>
            <div><span className="text-foreground font-medium">Location:</span> {event.location}</div>
            <div><span className="text-foreground font-medium">Date:</span> {event.date}</div>
            <div><span className="text-foreground font-medium">Time:</span> {event.time}</div>
          </div>
        </div>

        <div className="border-t border-border pt-3 space-y-2">
          <p className="text-xs text-foreground font-semibold">Booked By</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div><span className="text-foreground font-medium">Name:</span> {booking.name}</div>
            <div><span className="text-foreground font-medium">Email:</span> {booking.email}</div>
            <div><span className="text-foreground font-medium">Phone:</span> {booking.phone}</div>
          </div>
        </div>

        <div className="border-t border-border pt-3">
          <p className="text-xs text-foreground font-semibold mb-2">Seat Details</p>
          <div className="space-y-2">
            {Object.values(seatsBySection).map((group) => (
              <div key={group.name} className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-foreground font-medium">{group.name}</span>
                  <span className="text-muted-foreground ml-2">
                    {group.seats.join(", ")} ({group.seats.length} ticket{group.seats.length > 1 ? "s" : ""})
                  </span>
                </div>
                <span className="text-foreground font-medium">
                  ₹{(group.price * group.seats.length).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-3 flex items-center justify-between">
          <span className="font-display text-sm font-bold text-foreground">Total Amount</span>
          <span className="font-display text-xl font-bold text-primary">
            ₹{booking.totalAmount.toLocaleString("en-IN")}
          </span>
        </div>

        <p className="text-[10px] text-muted-foreground text-center">
          Booked on {new Date(booking.timestamp).toLocaleString("en-IN")}
        </p>
      </div>

      <button
        onClick={onNewBooking}
        className="w-full rounded-lg border border-border bg-secondary py-3 text-sm font-medium text-secondary-foreground transition-all hover:bg-secondary/80"
      >
        Book Another Event
      </button>
    </div>
  );
}
