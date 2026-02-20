import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, X, Send, Bot, User, MapPin, Calendar, Clock, Ticket } from "lucide-react";
import { mockEvents, Event, SectionInfo, getBookedSeats, bookSeats, addBooking, BookingDetails } from "@/data/events";

interface Message {
  id: string;
  role: "bot" | "user";
  text: string;
  options?: { label: string; value: string }[];
  eventId?: string;
  showSeats?: { event: Event; section: SectionInfo };
  booking?: BookingDetails;
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

export function Chatbot() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [state, setState] = useState<BotState>("idle");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedSection, setSelectedSection] = useState<SectionInfo | null>(null);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [userDetails, setUserDetails] = useState({ name: "", email: "", phone: "" });
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addMessage = (msg: Omit<Message, "id">) => {
    setMessages((prev) => [...prev, { ...msg, id: Date.now().toString() + Math.random() }]);
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open && messages.length === 0) {
      addMessage({
        role: "bot",
        text: "👋 Hi! I'm TicketBot. I can help you browse events and book tickets. What would you like to do?",
        options: [
          { label: "🎫 Browse Events", value: "browse" },
          { label: "ℹ️ How it works", value: "help" },
        ],
      });
      setState("idle");
    }
  }, [open]);

  const handleOption = (value: string) => {
    if (value === "browse") {
      addMessage({ role: "user", text: "Browse events" });
      showEvents();
    } else if (value === "help") {
      addMessage({ role: "user", text: "How does it work?" });
      addMessage({
        role: "bot",
        text: "It's simple!\n1️⃣ Browse upcoming events\n2️⃣ Pick a section (Premium, VIP, General)\n3️⃣ Choose your seats (up to 10)\n4️⃣ Enter your details\n5️⃣ Get your e-ticket!\n\nReady to start?",
        options: [{ label: "🎫 Browse Events", value: "browse" }],
      });
    } else if (value.startsWith("event-")) {
      const eventId = value.replace("event-", "");
      const event = mockEvents.find((e) => e.id === eventId);
      if (event) {
        addMessage({ role: "user", text: event.title });
        setSelectedEvent(event);
        setState("event-selected");
        addMessage({
          role: "bot",
          text: `🎶 **${event.title}**\n🎤 ${event.artist}\n📍 ${event.venue}, ${event.location}\n📅 ${event.date} at ${event.time}\n\nChoose a section:`,
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
        addMessage({ role: "user", text: `${section.name} section` });
        setSelectedSection(section);
        setSelectedSeatIds([]);
        setState("selecting-seats");
        addMessage({
          role: "bot",
          text: `Great choice! **${section.name}** at ₹${section.price.toLocaleString("en-IN")}/seat.\n\nYou can select up to 10 seats. Choose from the seat map below, then type **done** when ready.`,
          showSeats: { event: selectedEvent, section },
        });
      }
    } else if (value === "confirm-yes") {
      addMessage({ role: "user", text: "Yes, confirm!" });
      completeBooking();
    } else if (value === "confirm-no") {
      addMessage({ role: "user", text: "Start over" });
      resetFlow();
      showEvents();
    } else if (value === "new-booking") {
      resetFlow();
      showEvents();
    } else if (value === "view-website") {
      navigate(`/event/${selectedEvent?.id || "1"}`);
      setOpen(false);
    }
  };

  const showEvents = () => {
    setState("browsing");
    addMessage({
      role: "bot",
      text: "Here are the upcoming events:",
      options: mockEvents.map((e) => ({
        label: `🎵 ${e.title} — ${e.date}`,
        value: `event-${e.id}`,
      })),
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
    if (!selectedEvent) return;
    const seats = selectedSeatIds.map((seatId) => {
      const [section, row, col] = seatId.split("-");
      return { id: seatId, section, row: parseInt(row), col: parseInt(col), isBooked: true };
    });
    const totalAmount = selectedSeatIds.length * (selectedSection?.price || 0);
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
    addMessage({
      role: "bot",
      text: `✅ **Booking Confirmed!**\n\n🎫 **${booking.bookingId}**\n🎶 ${selectedEvent.title}\n💺 ${selectedSeatIds.length} seat(s) in ${selectedSection?.name}\n💰 Total: ₹${totalAmount.toLocaleString("en-IN")}\n\n📧 E-ticket sent to ${userDetails.email}\n\nThank you, ${userDetails.name}! Enjoy the show! 🎉`,
      booking,
      options: [
        { label: "🎫 Book Another", value: "new-booking" },
      ],
    });
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    addMessage({ role: "user", text });

    if (state === "selecting-seats" && text.toLowerCase() === "done") {
      if (selectedSeatIds.length === 0) {
        addMessage({ role: "bot", text: "You haven't selected any seats yet. Please click on seats to select them, then type **done**." });
        return;
      }
      setState("ask-name");
      addMessage({ role: "bot", text: `You selected **${selectedSeatIds.length} seat(s)**. Now I need your details.\n\nWhat's your **full name**?` });
      return;
    }

    if (state === "ask-name") {
      setUserDetails((d) => ({ ...d, name: text }));
      setState("ask-email");
      addMessage({ role: "bot", text: `Thanks, ${text}! What's your **email address**?` });
      return;
    }

    if (state === "ask-email") {
      if (!text.includes("@")) {
        addMessage({ role: "bot", text: "That doesn't look like a valid email. Please try again." });
        return;
      }
      setUserDetails((d) => ({ ...d, email: text }));
      setState("ask-phone");
      addMessage({ role: "bot", text: "And your **phone number**?" });
      return;
    }

    if (state === "ask-phone") {
      setUserDetails((d) => ({ ...d, phone: text }));
      setState("confirm");
      const totalAmount = selectedSeatIds.length * (selectedSection?.price || 0);
      addMessage({
        role: "bot",
        text: `📋 **Booking Summary**\n\n🎶 ${selectedEvent?.title}\n📍 ${selectedEvent?.venue}\n💺 ${selectedSeatIds.length} × ${selectedSection?.name} = ₹${totalAmount.toLocaleString("en-IN")}\n\nConfirm booking?`,
        options: [
          { label: "✅ Confirm", value: "confirm-yes" },
          { label: "❌ Cancel", value: "confirm-no" },
        ],
      });
      return;
    }

    // Default: treat as browse intent
    const lower = text.toLowerCase();
    if (lower.includes("event") || lower.includes("browse") || lower.includes("show") || lower.includes("ticket")) {
      showEvents();
    } else if (lower.includes("help") || lower.includes("how")) {
      handleOption("help");
    } else {
      addMessage({
        role: "bot",
        text: "I'm not sure what you mean. Would you like to browse events?",
        options: [
          { label: "🎫 Browse Events", value: "browse" },
          { label: "ℹ️ Help", value: "help" },
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

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full gradient-primary glow-primary-strong shadow-lg transition-transform hover:scale-110 animate-pulse-glow"
        >
          <MessageCircle className="h-6 w-6 text-primary-foreground" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col w-[380px] h-[600px] max-h-[80vh] rounded-2xl border border-border bg-card shadow-2xl animate-message-in overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 gradient-primary">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary-foreground" />
              <span className="font-display text-sm font-bold text-primary-foreground">TicketBot</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-primary-foreground/80 hover:text-primary-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] space-y-2 animate-message-in`}>
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-line ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-secondary text-secondary-foreground rounded-bl-md"
                    }`}
                  >
                    {msg.text.split(/(\*\*.*?\*\*)/).map((part, i) =>
                      part.startsWith("**") && part.endsWith("**") ? (
                        <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    )}
                  </div>

                  {/* Inline seat selector */}
                  {msg.showSeats && (
                    <MiniSeatGrid
                      event={msg.showSeats.event}
                      section={msg.showSeats.section}
                      selectedSeatIds={selectedSeatIds}
                      onToggle={handleSeatToggle}
                    />
                  )}

                  {/* Quick reply buttons */}
                  {msg.options && (
                    <div className="flex flex-wrap gap-1.5">
                      {msg.options.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleOption(opt.value)}
                          className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-border p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  state === "selecting-seats"
                    ? 'Select seats above, then type "done"'
                    : state === "ask-name"
                    ? "Enter your full name"
                    : state === "ask-email"
                    ? "Enter your email"
                    : state === "ask-phone"
                    ? "Enter your phone number"
                    : "Type a message..."
                }
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg gradient-primary text-primary-foreground transition-transform hover:scale-105"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

/* Mini seat grid for chatbot */
function MiniSeatGrid({
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
    <div className="rounded-xl border border-border bg-background p-3 space-y-2">
      <div className="flex items-center gap-1.5">
        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: section.color }} />
        <span className="text-xs font-semibold text-foreground">{section.name}</span>
        <span className="text-[10px] text-muted-foreground">₹{section.price.toLocaleString("en-IN")}/seat</span>
      </div>
      
      {/* Legend */}
      <div className="flex gap-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded border border-border bg-muted" /> Open</span>
        <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded bg-primary" /> Picked</span>
        <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded bg-destructive/60" /> Taken</span>
      </div>

      <div className="space-y-1">
        {Array.from({ length: section.rows }, (_, r) => {
          const rowNum = r + 1;
          const rowLabel = String.fromCharCode(64 + rowNum);
          return (
            <div key={rowNum} className="flex items-center gap-0.5">
              <span className="w-4 text-[9px] text-muted-foreground text-right shrink-0">{rowLabel}</span>
              <div className="flex gap-0.5">
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
                      title={`${rowLabel}${colNum}`}
                      className={`h-5 w-5 rounded text-[7px] font-medium transition-all ${
                        isBooked
                          ? "bg-destructive/60 text-destructive-foreground cursor-not-allowed"
                          : isSelected
                          ? "bg-primary text-primary-foreground scale-110"
                          : canSelect
                          ? "bg-muted border border-border text-muted-foreground hover:border-primary/50 cursor-pointer"
                          : "bg-muted/50 text-muted-foreground/40 cursor-not-allowed"
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
        <p className="text-[10px] text-primary font-medium">
          {selectedSeatIds.length} seat(s) selected • Type "done" to continue
        </p>
      )}
    </div>
  );
}
