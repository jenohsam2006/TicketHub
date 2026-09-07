import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Clock, Music } from "lucide-react";
import { mockEvents, SectionInfo, bookSeats, addBooking, BookingDetails } from "@/data/events";
import { SeatGrid } from "@/components/SeatGrid";
import { BookingForm } from "@/components/BookingForm";
import { Bill } from "@/components/Bill";

const MAX_TICKETS = 10;

const EventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = mockEvents.find((e) => e.id === id);

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [seatSections, setSeatSections] = useState<Record<string, SectionInfo>>({});
  const [booking, setBooking] = useState<BookingDetails | null>(null);

  const totalAmount = useMemo(() => {
    return selectedSeats.reduce((sum, seatId) => {
      const section = seatSections[seatId];
      return sum + (section?.price || 0);
    }, 0);
  }, [selectedSeats, seatSections]);

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Event not found</p>
          <button onClick={() => navigate("/")} className="text-primary hover:underline text-sm">
            Go back
          </button>
        </div>
      </div>
    );
  }

  const handleToggleSeat = (seatId: string, section: SectionInfo) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        const updated = prev.filter((s) => s !== seatId);
        setSeatSections((ss) => {
          const copy = { ...ss };
          delete copy[seatId];
          return copy;
        });
        return updated;
      }
      if (prev.length >= MAX_TICKETS) return prev;
      setSeatSections((ss) => ({ ...ss, [seatId]: section }));
      return [...prev, seatId];
    });
  };

  const handleBooking = (details: { name: string; email: string; phone: string }) => {
    const seats = selectedSeats.map((seatId) => {
      const [section, row, col] = seatId.split("-");
      return { id: seatId, section, row: parseInt(row), col: parseInt(col), isBooked: true };
    });

    bookSeats(event.id, selectedSeats);

    const newBooking: BookingDetails = {
      ...details,
      eventId: event.id,
      seats,
      totalAmount,
      bookingId: `TKT-${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toISOString(),
    };

    addBooking(newBooking);
    setBooking(newBooking);
  };

  if (booking) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl px-4 py-8">
          <Bill booking={booking} onNewBooking={() => navigate("/")} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border gradient-card">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
              <Music className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-foreground">{event.title}</h1>
              <p className="text-xs text-muted-foreground">{event.artist}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Event info */}
        <div className="mb-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-primary" /> {event.venue}, {event.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-primary" /> {event.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-primary" /> {event.time}
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Seat Grid */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-display text-base font-bold text-foreground mb-4">Select Your Seats</h2>
            <p className="text-xs text-muted-foreground mb-4">
              You can select up to {MAX_TICKETS} seats at a time. Click a seat to select/deselect.
            </p>
            <SeatGrid
              event={event}
              selectedSeats={selectedSeats}
              onToggleSeat={handleToggleSeat}
              maxSeats={MAX_TICKETS}
            />
          </div>

          {/* Sidebar: Summary + Form */}
          <div className="space-y-4">
            {/* Summary */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              <h3 className="font-display text-sm font-bold text-foreground">Booking Summary</h3>
              {selectedSeats.length === 0 ? (
                <p className="text-xs text-muted-foreground">No seats selected yet</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(
                    selectedSeats.reduce<Record<string, { section: SectionInfo; count: number }>>((acc, seatId) => {
                      const section = seatSections[seatId];
                      if (section) {
                        if (!acc[section.id]) acc[section.id] = { section, count: 0 };
                        acc[section.id].count++;
                      }
                      return acc;
                    }, {})
                  ).map(([key, { section, count }]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        {section.name} × {count}
                      </span>
                      <span className="text-foreground font-medium">
                        ₹{(section.price * count).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-2 flex justify-between">
                    <span className="text-sm font-display font-bold text-foreground">Total</span>
                    <span className="text-sm font-display font-bold text-primary">
                      ₹{totalAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Booking form */}
            {selectedSeats.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-5 animate-message-in">
                <BookingForm onSubmit={handleBooking} isDisabled={selectedSeats.length === 0} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPage;
