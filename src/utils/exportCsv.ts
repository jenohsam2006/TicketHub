import { BookingDetails, mockEvents, getBookedSeats } from "@/data/events";

function downloadCsv(filename: string, csvContent: string) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportBookingsToCSV(bookings: BookingDetails[]) {
  const headers = ["Booking ID", "Name", "Email", "Phone", "Event", "Venue", "Location", "Event Date", "Event Time", "Section", "Seats", "Seat Count", "Total Amount (₹)", "Booked On"];
  const rows = bookings.map((b) => {
    const event = mockEvents.find((e) => e.id === b.eventId);
    const seatLabels = b.seats.map((s) => {
      const rowLabel = String.fromCharCode(64 + s.row);
      return `${s.section}-${rowLabel}${s.col}`;
    });
    return [
      b.bookingId,
      b.name,
      b.email,
      b.phone,
      event?.title || "Unknown",
      event?.venue || "N/A",
      event?.location || "N/A",
      event?.date || "N/A",
      event?.time || "N/A",
      [...new Set(b.seats.map((s) => s.section))].join("; "),
      seatLabels.join("; "),
      b.seats.length.toString(),
      b.totalAmount.toString(),
      new Date(b.timestamp).toLocaleString("en-IN"),
    ].map((v) => `"${v.replace(/"/g, '""')}"`).join(",");
  });
  const csv = [headers.join(","), ...rows].join("\n");
  downloadCsv(`bookings_${new Date().toISOString().slice(0, 10)}.csv`, csv);
}

export function exportSeatAvailabilityToCSV() {
  const headers = ["Event ID", "Event Title", "Venue", "Location", "Section", "Row", "Seat", "Status"];
  const rows: string[] = [];
  mockEvents.forEach((event) => {
    const booked = getBookedSeats(event.id);
    event.sections.forEach((section) => {
      for (let r = 1; r <= section.rows; r++) {
        for (let c = 1; c <= section.seatsPerRow; c++) {
          const seatId = `${section.id}-${r}-${c}`;
          const rowLabel = String.fromCharCode(64 + r);
          const status = booked.has(seatId) ? "Booked" : "Available";
          rows.push(
            [event.id, event.title, event.venue, event.location, section.name, rowLabel, c.toString(), status]
              .map((v) => `"${v.replace(/"/g, '""')}"`)
              .join(",")
          );
        }
      }
    });
  });
  const csv = [headers.join(","), ...rows].join("\n");
  downloadCsv(`seat_availability_${new Date().toISOString().slice(0, 10)}.csv`, csv);
}
