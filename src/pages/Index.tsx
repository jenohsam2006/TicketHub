import { useState, useRef, useEffect, useMemo } from "react";
import {
  Bot, Send, Ticket, MapPin, Calendar, Clock, Music, Laugh, PartyPopper,
  Sparkles, ChevronRight, History, Download
} from "lucide-react";
import {
  mockEvents, Event, SectionInfo, getBookedSeats, bookSeats,
  addBooking, getBookings, BookingDetails, getEventsByLocation,
} from "@/data/events";
import { exportBookingsToCSV, exportSeatAvailabilityToCSV } from "@/utils/exportCsv";
import { Bill } from "@/components/Bill";
import { ScrollArea } from "@/components/ui/scroll-area";

/* ── types ── */
interface Message {
  id: string;
  role: "bot" | "user";
  text: string;
  options?: { label: string; value: string; icon?: React.ReactNode }[];
  showSeats?: { event: Event; section: SectionInfo };
  showEventCards?: Event[];
  showBill?: BookingDetails;
}

type BotState =
  | "idle"
  | "browsing"
  | "event-selected"
  | "selecting-section"
  | "selecting-seats"
  | "ask-name"
  | "ask-email"
  | "ask-phone"
  | "confirm"
  | "done";

const categoryIcons: Record<string, React.ReactNode> = {
  Concert: <Music className="h-4 w-4" />,
  Comedy: <Laugh className="h-4 w-4" />,
  Festival: <PartyPopper className="h-4 w-4" />,
};

/* ── main component ── */
const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [state, setState] = useState<BotState>("idle");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedSection, setSelectedSection] = useState<SectionInfo | null>(null);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [userDetails, setUserDetails] = useState({ name: "", email: "", phone: "" });
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addMsg = (msg: Omit<Message, "id">, delay = 400) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { ...msg, id: `${Date.now()}-${Math.random()}` }]);
      setIsTyping(false);
    }, delay);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isTyping]);

  // Welcome on mount
  useEffect(() => {
    addMsg({
      role: "bot",
      text: "Hey there! 👋 I'm **TicketBot** — your personal event booking assistant.\n\nI can help you discover events, pick seats, and book tickets instantly. What would you like to do?",
      options: [
        { label: "Browse Events", value: "browse", icon: <Ticket className="h-3.5 w-3.5" /> },
        { label: "Search by Location", value: "ask-location", icon: <MapPin className="h-3.5 w-3.5" /> },
        { label: "My Bookings", value: "my-bookings", icon: <History className="h-3.5 w-3.5" /> },
        { label: "How it works", value: "help", icon: <Sparkles className="h-3.5 w-3.5" /> },
      ],
    }, 600);
  }, []);

  /* ── helpers ── */
  const showEvents = () => {
    setState("browsing");
    addMsg({
      role: "bot",
      text: "Here are the upcoming events — tap one to explore!",
      showEventCards: mockEvents,
    });
  };

  const resetFlow = () => {
    setSelectedEvent(null);
    setSelectedSection(null);
    setSelectedSeatIds([]);
    setUserDetails({ name: "", email: "", phone: "" });
    setState("idle");
  };

  const completeBooking = () => {
    if (!selectedEvent || !selectedSection) return;
    const seats = selectedSeatIds.map((seatId) => {
      const [section, row, col] = seatId.split("-");
      return { id: seatId, section, row: parseInt(row), col: parseInt(col), isBooked: true };
    });
    const totalAmount = selectedSeatIds.length * selectedSection.price;
    bookSeats(selectedEvent.id, selectedSeatIds);
    const booking: BookingDetails = {
      ...userDetails,
      eventId: selectedEvent.id,
      seats,
      totalAmount,
      bookingId: `TKT-${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toISOString(),
    };
    addBooking(booking);
    setState("done");
    addMsg({
      role: "bot",
      text: `✅ **Booking Confirmed!**\n\n🎫 Booking ID: **${booking.bookingId}**\n🎶 ${selectedEvent.title}\n📍 ${selectedEvent.venue}, ${selectedEvent.location}\n💺 ${selectedSeatIds.length} seat(s) in **${selectedSection.name}**\n💰 Total: **₹${totalAmount.toLocaleString("en-IN")}**\n\n📧 E-ticket sent to **${userDetails.email}**\n\nHere's your bill 👇`,
      showBill: booking,
      options: [
        { label: "Book Another Event", value: "new-booking", icon: <Ticket className="h-3.5 w-3.5" /> },
      ],
    });
  };

  /* ── option handler ── */
  const handleOption = (value: string) => {
    if (value === "browse") {
      addMsg({ role: "user", text: "Show me events" }, 0);
      showEvents();
    } else if (value === "ask-location") {
      addMsg({ role: "user", text: "Search by location" }, 0);
      addMsg({
        role: "bot",
        text: "📍 Type a **city name** to find events there!\n\nAvailable locations: **Chennai**, **Coimbatore**, **Madurai**, **Trichy**, **Salem**, **Tirunelveli**, **Bangalore**, **Hyderabad**, **Kolkata**, **Pune**, **New Delhi**, **Mumbai**",
        options: [
          { label: "Chennai", value: "loc-chennai" },
          { label: "Bangalore", value: "loc-bangalore" },
          { label: "Mumbai", value: "loc-mumbai" },
          { label: "Hyderabad", value: "loc-hyderabad" },
          { label: "All Events", value: "browse" },
        ],
      });
    } else if (value.startsWith("loc-")) {
      const city = value.replace("loc-", "");
      addMsg({ role: "user", text: city }, 0);
      showEventsByLocation(city);
    } else if (value === "help") {
      addMsg({ role: "user", text: "How does it work?" }, 0);
      addMsg({
        role: "bot",
        text: "It's super simple! Here's how:\n\n1️⃣ Browse upcoming events or search by city\n2️⃣ Pick a seating section (Premium, VIP, or General)\n3️⃣ Choose your seats from the seat map (up to 10)\n4️⃣ Enter your details\n5️⃣ Get your e-ticket with bill instantly!\n\nReady to start?",
        options: [
          { label: "Browse Events", value: "browse", icon: <Ticket className="h-3.5 w-3.5" /> },
          { label: "Search by Location", value: "ask-location", icon: <MapPin className="h-3.5 w-3.5" /> },
        ],
      });
    } else if (value.startsWith("event-")) {
      const eventId = value.replace("event-", "");
      const event = mockEvents.find((e) => e.id === eventId);
      if (event) {
        addMsg({ role: "user", text: event.title }, 0);
        setSelectedEvent(event);
        setState("selecting-section");
        addMsg({
          role: "bot",
          text: `Great choice! 🎶\n\n**${event.title}**\n🎤 ${event.artist}\n📍 ${event.venue}, ${event.location}\n📅 ${event.date} • ${event.time}\n\nWhich section would you like?`,
          options: event.sections.map((s) => ({
            label: `${s.name} — ₹${s.price.toLocaleString("en-IN")}`,
            value: `section-${s.id}`,
          })),
        });
      }
    } else if (value.startsWith("section-")) {
      const sectionId = value.replace("section-", "");
      const section = selectedEvent?.sections.find((s) => s.id === sectionId);
      if (section && selectedEvent) {
        addMsg({ role: "user", text: `${section.name} section` }, 0);
        setSelectedSection(section);
        setSelectedSeatIds([]);
        setState("selecting-seats");
        addMsg({
          role: "bot",
          text: `**${section.name}** section at **₹${section.price.toLocaleString("en-IN")}** per seat.\n\nSelect your seats below (up to 10). When you're done, type **done** or hit the button.`,
          showSeats: { event: selectedEvent, section },
        });
      }
    } else if (value === "seats-done") {
      handleSeatsDone();
    } else if (value === "confirm-yes") {
      addMsg({ role: "user", text: "Confirm booking" }, 0);
      completeBooking();
    } else if (value === "confirm-no") {
      addMsg({ role: "user", text: "Cancel" }, 0);
      resetFlow();
      showEvents();
    } else if (value === "new-booking") {
      addMsg({ role: "user", text: "Book another event" }, 0);
      resetFlow();
      showEvents();
    } else if (value === "my-bookings") {
      addMsg({ role: "user", text: "My Bookings" }, 0);
      showBookingHistory();
    } else if (value === "export-bookings") {
      addMsg({ role: "user", text: "Export bookings" }, 0);
      const bookings = getBookings();
      if (bookings.length === 0) {
        addMsg({ role: "bot", text: "No bookings to export yet! Book an event first. 🎶" });
      } else {
        exportBookingsToCSV(bookings);
        addMsg({ role: "bot", text: "✅ **Bookings exported!** Check your downloads folder for the CSV file." });
      }
    } else if (value === "export-seats") {
      addMsg({ role: "user", text: "Export seat availability" }, 0);
      exportSeatAvailabilityToCSV();
      addMsg({ role: "bot", text: "✅ **Seat availability exported!** Check your downloads folder for the CSV file with all events' seat data." });
    }
  };

  const showBookingHistory = () => {
    const bookings = getBookings();
    if (bookings.length === 0) {
      addMsg({
        role: "bot",
        text: "You don't have any bookings yet! Let's find an event for you. 🎶",
        options: [
          { label: "Browse Events", value: "browse", icon: <Ticket className="h-3.5 w-3.5" /> },
          { label: "Search by Location", value: "ask-location", icon: <MapPin className="h-3.5 w-3.5" /> },
        ],
      });
    } else {
      addMsg({
        role: "bot",
        text: `📋 You have **${bookings.length} booking(s)**. Here's your history:`,
      });
      bookings.slice().reverse().forEach((b, i) => {
        const event = mockEvents.find(e => e.id === b.eventId);
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: `history-${Date.now()}-${i}`,
            role: "bot",
            text: `🎫 **${event?.title || "Unknown Event"}**\n📍 ${event?.venue || "N/A"}, ${event?.location || "N/A"}\n📅 ${event?.date || "N/A"} • ${event?.time || "N/A"}\n👤 ${b.name} | ${b.email} | ${b.phone}\n💺 ${b.seats.length} seat(s) | 💰 ₹${b.totalAmount.toLocaleString("en-IN")}\n🆔 ${b.bookingId}\n🕐 ${new Date(b.timestamp).toLocaleString("en-IN")}`,
          }]);
        }, (i + 1) * 300);
      });
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: `history-end-${Date.now()}`,
          role: "bot",
          text: "That's all your bookings! What would you like to do next?",
          options: [
            { label: "📥 Export Bookings CSV", value: "export-bookings", icon: <Download className="h-3.5 w-3.5" /> },
            { label: "📥 Export Seat Data CSV", value: "export-seats", icon: <Download className="h-3.5 w-3.5" /> },
            { label: "Browse Events", value: "browse", icon: <Ticket className="h-3.5 w-3.5" /> },
            { label: "Search by Location", value: "ask-location", icon: <MapPin className="h-3.5 w-3.5" /> },
          ],
        }]);
      }, (bookings.length + 1) * 300);
    }
  };

  const showEventsByLocation = (locationQuery: string) => {
    const events = getEventsByLocation(locationQuery);
    if (events.length > 0) {
      setState("browsing");
      addMsg({
        role: "bot",
        text: `Found **${events.length} event(s)** in **${locationQuery.charAt(0).toUpperCase() + locationQuery.slice(1)}**:`,
        showEventCards: events,
      });
    } else {
      addMsg({
        role: "bot",
        text: `No events found in "${locationQuery}". Try another city or browse all events.`,
        options: [
          { label: "Browse All Events", value: "browse", icon: <Ticket className="h-3.5 w-3.5" /> },
          { label: "Search by Location", value: "ask-location", icon: <MapPin className="h-3.5 w-3.5" /> },
        ],
      });
    }
  };

  const handleSeatsDone = () => {
    if (selectedSeatIds.length === 0) {
      addMsg({ role: "bot", text: "You haven't selected any seats yet! Tap seats on the map to pick them." });
      return;
    }
    setState("ask-name");
    addMsg({
      role: "bot",
      text: `You selected **${selectedSeatIds.length} seat(s)**. Now let me grab your details.\n\nWhat's your **full name**?`,
    });
  };

  /* ── text input handler ── */
  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    addMsg({ role: "user", text }, 0);

    if (state === "selecting-seats" && text.toLowerCase() === "done") {
      handleSeatsDone();
      return;
    }
    if (state === "ask-name") {
      setUserDetails((d) => ({ ...d, name: text }));
      setState("ask-email");
      addMsg({ role: "bot", text: `Nice to meet you, **${text}**! 😊\n\nWhat's your **email address**?` });
      return;
    }
    if (state === "ask-email") {
      if (!text.includes("@")) {
        addMsg({ role: "bot", text: "Hmm, that doesn't look like a valid email. Could you try again?" });
        return;
      }
      setUserDetails((d) => ({ ...d, email: text }));
      setState("ask-phone");
      addMsg({ role: "bot", text: "Almost there! What's your **phone number**?" });
      return;
    }
    if (state === "ask-phone") {
      setUserDetails((d) => ({ ...d, phone: text }));
      setState("confirm");
      const totalAmount = selectedSeatIds.length * (selectedSection?.price || 0);
      addMsg({
        role: "bot",
        text: `📋 **Booking Summary**\n\n🎶 ${selectedEvent?.title}\n📍 ${selectedEvent?.venue}, ${selectedEvent?.location}\n💺 ${selectedSeatIds.length} × ${selectedSection?.name} = **₹${totalAmount.toLocaleString("en-IN")}**\n👤 ${text}\n\nShall I confirm this booking?`,
        options: [
          { label: "✅ Confirm", value: "confirm-yes" },
          { label: "❌ Cancel", value: "confirm-no" },
        ],
      });
      return;
    }

    // Fallback NLU
    const lower = text.toLowerCase();
    
    // Check if user typed a city name
    const cityKeywords = ["chennai", "coimbatore", "madurai", "trichy", "salem", "tirunelveli", "delhi", "mumbai", "bangalore", "hyderabad", "kolkata", "pune"];
    const matchedCity = cityKeywords.find(city => lower.includes(city));
    if (matchedCity) {
      showEventsByLocation(matchedCity);
      return;
    }

    if (lower.includes("event") || lower.includes("browse") || lower.includes("show") || lower.includes("ticket") || lower.includes("book")) {
      showEvents();
    } else if (lower.includes("location") || lower.includes("city") || lower.includes("where") || lower.includes("place")) {
      handleOption("ask-location");
    } else if (lower.includes("history") || lower.includes("my booking") || lower.includes("past") || lower.includes("previous")) {
      showBookingHistory();
    } else if (lower.includes("help") || lower.includes("how")) {
      handleOption("help");
    } else if (lower.includes("hi") || lower.includes("hello") || lower.includes("hey")) {
      addMsg({
        role: "bot",
        text: "Hello! 😊 How can I help you today?",
        options: [
          { label: "Browse Events", value: "browse", icon: <Ticket className="h-3.5 w-3.5" /> },
          { label: "Search by Location", value: "ask-location", icon: <MapPin className="h-3.5 w-3.5" /> },
          { label: "My Bookings", value: "my-bookings", icon: <History className="h-3.5 w-3.5" /> },
          { label: "How it works", value: "help", icon: <Sparkles className="h-3.5 w-3.5" /> },
        ],
      });
    } else {
      addMsg({
        role: "bot",
        text: "I'm not sure I understood that. Here's what I can help with:",
        options: [
          { label: "Browse Events", value: "browse", icon: <Ticket className="h-3.5 w-3.5" /> },
          { label: "Search by Location", value: "ask-location", icon: <MapPin className="h-3.5 w-3.5" /> },
          { label: "My Bookings", value: "my-bookings", icon: <History className="h-3.5 w-3.5" /> },
          { label: "How it works", value: "help", icon: <Sparkles className="h-3.5 w-3.5" /> },
        ],
      });
    }
  };

  const handleSeatToggle = (seatId: string) => {
    setSelectedSeatIds((prev) => {
      if (prev.includes(seatId)) return prev.filter((s) => s !== seatId);
      if (prev.length >= 10) return prev;
      return [...prev, seatId];
    });
  };

  const placeholder =
    state === "selecting-seats"
      ? 'Select seats above, then type "done"...'
      : state === "ask-name"
      ? "Type your full name..."
      : state === "ask-email"
      ? "Type your email address..."
      : state === "ask-phone"
      ? "Type your phone number..."
      : "Message TicketBot...";

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="shrink-0 border-b border-border gradient-card">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-base font-bold text-foreground">TicketBot</h1>
            <p className="text-[11px] text-muted-foreground">Your AI event booking assistant</p>
          </div>
        </div>
      </header>

      {/* Chat area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-6 space-y-5">
          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              msg={msg}
              onOption={handleOption}
              selectedSeatIds={selectedSeatIds}
              onSeatToggle={handleSeatToggle}
            />
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full gradient-primary">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="rounded-2xl rounded-tl-md bg-secondary px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0ms]" />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]" />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          {/* Done button when selecting seats */}
          {state === "selecting-seats" && selectedSeatIds.length > 0 && (
            <div className="flex justify-center animate-message-in">
              <button
                onClick={() => handleOption("seats-done")}
                className="rounded-full gradient-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground glow-primary transition-transform hover:scale-105"
              >
                Done — {selectedSeatIds.length} seat(s) selected →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Input bar */}
      <div className="shrink-0 border-t border-border gradient-card">
        <div className="mx-auto max-w-3xl px-4 py-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 focus-within:border-primary/60 focus-within:ring-1 focus-within:ring-primary/30 transition-all"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-primary text-primary-foreground transition-all hover:scale-105 disabled:opacity-30 disabled:hover:scale-100"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <p className="mt-2 text-center text-[10px] text-muted-foreground">
            TicketBot can help you browse events, select seats & book tickets instantly.
          </p>
        </div>
      </div>
    </div>
  );
};

/* ── ChatBubble ── */
function ChatBubble({
  msg,
  onOption,
  selectedSeatIds,
  onSeatToggle,
}: {
  msg: Message;
  onOption: (v: string) => void;
  selectedSeatIds: string[];
  onSeatToggle: (seatId: string) => void;
}) {
  const isBot = msg.role === "bot";

  return (
    <div className={`flex items-start gap-3 animate-message-in ${isBot ? "" : "flex-row-reverse"}`}>
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isBot ? "gradient-primary" : "bg-secondary"
        }`}
      >
        {isBot ? (
          <Bot className="h-4 w-4 text-primary-foreground" />
        ) : (
          <span className="text-xs font-bold text-secondary-foreground">You</span>
        )}
      </div>

      {/* Content */}
      <div className={`max-w-[80%] space-y-3 ${isBot ? "" : "items-end"}`}>
        {/* Text */}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
            isBot
              ? "bg-secondary text-secondary-foreground rounded-tl-md"
              : "bg-primary text-primary-foreground rounded-tr-md"
          }`}
        >
          {renderFormattedText(msg.text)}
        </div>

        {/* Event cards */}
        {msg.showEventCards && (
          <div className="space-y-2">
            {msg.showEventCards.map((event) => (
              <button
                key={event.id}
                onClick={() => onOption(`event-${event.id}`)}
                className="w-full text-left rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:glow-primary group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg gradient-primary">
                    {categoryIcons[event.category] || <Music className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-display text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                      {event.title}
                    </h4>
                    <p className="text-[11px] text-muted-foreground">{event.artist}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-primary" />{event.venue}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3 text-primary" />{event.date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-primary" />{event.time}</span>
                </div>
                <div className="mt-2 flex gap-1.5">
                  {event.sections.map((s) => (
                    <span key={s.id} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                      {s.name}: ₹{s.price.toLocaleString("en-IN")}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Inline seat map */}
        {msg.showSeats && (
          <InlineSeatMap
            event={msg.showSeats.event}
            section={msg.showSeats.section}
            selectedSeatIds={selectedSeatIds}
            onToggle={onSeatToggle}
          />
        )}

        {/* Inline bill */}
        {msg.showBill && (
          <Bill booking={msg.showBill} onNewBooking={() => onOption("new-booking")} />
        )}

        {/* Quick reply options */}
        {msg.options && (
          <div className="flex flex-wrap gap-2">
            {msg.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onOption(opt.value)}
                className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-xs font-medium text-primary hover:bg-primary/15 hover:border-primary/50 transition-all"
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── InlineSeatMap ── */
function InlineSeatMap({
  event,
  section,
  selectedSeatIds,
  onToggle,
}: {
  event: Event;
  section: SectionInfo;
  selectedSeatIds: string[];
  onToggle: (seatId: string) => void;
}) {
  const bookedSeats = useMemo(() => getBookedSeats(event.id), [event.id]);

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3 overflow-x-auto">
      {/* Stage */}
      <div className="mx-auto w-3/4 rounded-t-full bg-secondary py-2 text-center text-[11px] font-display font-semibold text-secondary-foreground">
        🎬 STAGE
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-[10px] text-muted-foreground justify-center">
        <span className="flex items-center gap-1"><span className="inline-block h-3.5 w-3.5 rounded border border-border bg-muted" /> Available</span>
        <span className="flex items-center gap-1"><span className="inline-block h-3.5 w-3.5 rounded bg-primary" /> Selected</span>
        <span className="flex items-center gap-1"><span className="inline-block h-3.5 w-3.5 rounded bg-destructive/60" /> Booked</span>
      </div>

      {/* Section header */}
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: section.color }} />
        <span className="text-xs font-display font-semibold text-foreground">{section.name}</span>
        <span className="text-[10px] text-muted-foreground">— ₹{section.price.toLocaleString("en-IN")}/seat</span>
      </div>

      {/* Grid */}
      <div className="space-y-1">
        {Array.from({ length: section.rows }, (_, r) => {
          const rowNum = r + 1;
          const rowLabel = String.fromCharCode(64 + rowNum);
          return (
            <div key={rowNum} className="flex items-center gap-1">
              <span className="w-5 text-[9px] text-muted-foreground text-right shrink-0 font-medium">
                {rowLabel}
              </span>
              <div className="flex gap-1">
                {Array.from({ length: section.seatsPerRow }, (_, c) => {
                  const colNum = c + 1;
                  const seatId = `${section.id}-${rowNum}-${colNum}`;
                  const isBooked = bookedSeats.has(seatId);
                  const isSelected = selectedSeatIds.includes(seatId);
                  const canSelect = !isBooked && (isSelected || selectedSeatIds.length < 10);

                  return (
                    <button
                      key={colNum}
                      disabled={isBooked || !canSelect}
                      onClick={() => onToggle(seatId)}
                      title={`${section.name} ${rowLabel}${colNum}${isBooked ? " (Booked)" : ""}`}
                      className={`h-6 w-6 rounded text-[8px] font-medium transition-all ${
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

      {selectedSeatIds.length > 0 && (
        <p className="text-[11px] text-primary font-medium text-center">
          ✨ {selectedSeatIds.length} seat(s) selected (max 10)
        </p>
      )}
    </div>
  );
}

/* ── text formatter for **bold** ── */
function renderFormattedText(text: string) {
  return text.split(/(\*\*.*?\*\*)/).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default Index;
