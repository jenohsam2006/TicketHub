export interface Seat {
  id: string;
  row: number;
  col: number;
  section: string;
  isBooked: boolean;
}

export interface SectionInfo {
  id: string;
  name: string;
  price: number;
  rows: number;
  seatsPerRow: number;
  color: string;
}

export interface Event {
  id: string;
  title: string;
  artist: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  category: string;
  sections: SectionInfo[];
}

export interface BookingDetails {
  name: string;
  email: string;
  phone: string;
  eventId: string;
  seats: Seat[];
  totalAmount: number;
  bookingId: string;
  timestamp: string;
}

const defaultSections = (premium: number, vip: number, general: number): SectionInfo[] => [
  { id: "premium", name: "Premium", price: premium, rows: 2, seatsPerRow: 10, color: "hsl(217 91% 60%)" },
  { id: "vip", name: "VIP", price: vip, rows: 3, seatsPerRow: 10, color: "hsl(250 80% 65%)" },
  { id: "general", name: "General", price: general, rows: 10, seatsPerRow: 10, color: "hsl(152 69% 45%)" },
];

export const mockEvents: Event[] = [
  // ── New Delhi ──
  { id: "1", title: "Neon Horizons World Tour", artist: "Aurora Waves", venue: "Jawaharlal Nehru Stadium", location: "New Delhi, India", date: "Mar 15, 2026", time: "8:00 PM", category: "Concert", sections: defaultSections(5000, 3000, 1000) },
  { id: "2", title: "Comedy Night Live", artist: "Zakir Khan", venue: "Siri Fort Auditorium", location: "New Delhi, India", date: "Mar 22, 2026", time: "9:00 PM", category: "Comedy", sections: defaultSections(3500, 2000, 800) },
  { id: "3", title: "Electronic Dreams Festival", artist: "Multiple Artists", venue: "MMRDA Grounds", location: "New Delhi, India", date: "Apr 5, 2026", time: "6:00 PM", category: "Festival", sections: defaultSections(8000, 5000, 2000) },
  { id: "d4", title: "Bollywood Retro Night", artist: "Arijit Singh", venue: "Talkatora Stadium", location: "New Delhi, India", date: "Apr 12, 2026", time: "7:30 PM", category: "Concert", sections: defaultSections(7000, 4000, 1500) },
  { id: "d5", title: "Delhi Comedy Fest", artist: "Biswa Kalyan Rath", venue: "Kamani Auditorium", location: "New Delhi, India", date: "Apr 18, 2026", time: "8:00 PM", category: "Comedy", sections: defaultSections(3000, 1800, 700) },

  // ── Mumbai ──
  { id: "m1", title: "Bollywood Beats Live", artist: "Shreya Ghoshal", venue: "NSCI Dome", location: "Mumbai, India", date: "Mar 20, 2026", time: "7:00 PM", category: "Concert", sections: defaultSections(8000, 5000, 2000) },
  { id: "m2", title: "Mumbai Comedy Carnival", artist: "Vir Das", venue: "Rangsharda Auditorium", location: "Mumbai, India", date: "Mar 28, 2026", time: "8:30 PM", category: "Comedy", sections: defaultSections(4000, 2500, 1000) },
  { id: "m3", title: "Sunburn Arena", artist: "Martin Garrix", venue: "Mahalaxmi Race Course", location: "Mumbai, India", date: "Apr 10, 2026", time: "5:00 PM", category: "Festival", sections: defaultSections(10000, 6000, 3000) },
  { id: "m4", title: "Indie Rock Fest", artist: "The Local Train", venue: "Bandra Fort Amphitheatre", location: "Mumbai, India", date: "Apr 20, 2026", time: "6:30 PM", category: "Concert", sections: defaultSections(3500, 2000, 800) },
  { id: "m5", title: "Stand-Up Special", artist: "Abhishek Upmanyu", venue: "St. Andrew's Auditorium", location: "Mumbai, India", date: "May 2, 2026", time: "9:00 PM", category: "Comedy", sections: defaultSections(5000, 3000, 1200) },

  // ── Chennai, Tamil Nadu ──
  { id: "4", title: "Anirudh Live in Concert", artist: "Anirudh Ravichander", venue: "Nehru Indoor Stadium", location: "Chennai, Tamil Nadu", date: "Mar 28, 2026", time: "7:00 PM", category: "Concert", sections: defaultSections(6000, 3500, 1200) },
  { id: "5", title: "Kollywood Music Night", artist: "Yuvan Shankar Raja", venue: "YMCA Ground", location: "Chennai, Tamil Nadu", date: "Apr 10, 2026", time: "7:30 PM", category: "Concert", sections: defaultSections(5500, 3000, 1000) },
  { id: "10", title: "Beach Music Festival", artist: "Multiple Artists", venue: "Marina Beach Open Ground", location: "Chennai, Tamil Nadu", date: "May 15, 2026", time: "5:00 PM", category: "Festival", sections: defaultSections(4500, 2500, 900) },
  { id: "c4", title: "AR Rahman Symphony", artist: "AR Rahman", venue: "Chennai Trade Centre", location: "Chennai, Tamil Nadu", date: "May 25, 2026", time: "7:00 PM", category: "Concert", sections: defaultSections(8000, 5000, 2000) },
  { id: "c5", title: "Tamil Stand-Up Night", artist: "Manoj Prabakar", venue: "Sir Mutha Venkatasubba Rao Hall", location: "Chennai, Tamil Nadu", date: "Jun 1, 2026", time: "8:00 PM", category: "Comedy", sections: defaultSections(2500, 1500, 600) },

  // ── Coimbatore, Tamil Nadu ──
  { id: "6", title: "Stand-Up Tamil", artist: "Alexander Babu", venue: "Codissia Trade Fair Complex", location: "Coimbatore, Tamil Nadu", date: "Apr 15, 2026", time: "8:00 PM", category: "Comedy", sections: defaultSections(2500, 1500, 600) },
  { id: "cb2", title: "Sid Sriram Unplugged", artist: "Sid Sriram", venue: "Brookefields Mall Ground", location: "Coimbatore, Tamil Nadu", date: "Apr 25, 2026", time: "7:00 PM", category: "Concert", sections: defaultSections(5000, 3000, 1000) },
  { id: "cb3", title: "Kovai Music Fest", artist: "Multiple Artists", venue: "VOC Park Ground", location: "Coimbatore, Tamil Nadu", date: "May 5, 2026", time: "5:30 PM", category: "Festival", sections: defaultSections(3000, 1800, 700) },
  { id: "cb4", title: "Hippy Hop Night", artist: "Hiphop Tamizha", venue: "Nehru Stadium", location: "Coimbatore, Tamil Nadu", date: "May 15, 2026", time: "7:30 PM", category: "Concert", sections: defaultSections(4000, 2500, 900) },
  { id: "cb5", title: "Comedy Galatta CBE", artist: "Praveen Kumar", venue: "PSG Auditorium", location: "Coimbatore, Tamil Nadu", date: "May 22, 2026", time: "8:00 PM", category: "Comedy", sections: defaultSections(2000, 1200, 500) },

  // ── Madurai, Tamil Nadu ──
  { id: "7", title: "Carnatic Fusion Night", artist: "Multiple Artists", venue: "Tamukkam Grounds", location: "Madurai, Tamil Nadu", date: "Apr 20, 2026", time: "6:30 PM", category: "Festival", sections: defaultSections(3000, 1800, 700) },
  { id: "md2", title: "Imman Live", artist: "D. Imman", venue: "Madurai Meenakshi Hall", location: "Madurai, Tamil Nadu", date: "May 1, 2026", time: "7:00 PM", category: "Concert", sections: defaultSections(4000, 2500, 900) },
  { id: "md3", title: "Madurai Comedy Show", artist: "Sathish", venue: "Pandian Hall", location: "Madurai, Tamil Nadu", date: "May 10, 2026", time: "8:00 PM", category: "Comedy", sections: defaultSections(2000, 1200, 500) },
  { id: "md4", title: "Folk Music Festival", artist: "Anthony Daasan", venue: "Ellis Nagar Ground", location: "Madurai, Tamil Nadu", date: "May 20, 2026", time: "6:00 PM", category: "Festival", sections: defaultSections(2500, 1500, 600) },
  { id: "md5", title: "GV Prakash Rocks", artist: "GV Prakash", venue: "Madurai Corporation Stadium", location: "Madurai, Tamil Nadu", date: "Jun 5, 2026", time: "7:30 PM", category: "Concert", sections: defaultSections(3500, 2000, 800) },

  // ── Trichy, Tamil Nadu ──
  { id: "8", title: "Rock Revolution", artist: "The F16s", venue: "VOC Ground", location: "Trichy, Tamil Nadu", date: "May 1, 2026", time: "7:00 PM", category: "Concert", sections: defaultSections(2000, 1200, 500) },
  { id: "tr2", title: "Trichy Music Carnival", artist: "Multiple Artists", venue: "Trichy Indoor Stadium", location: "Trichy, Tamil Nadu", date: "May 12, 2026", time: "6:00 PM", category: "Festival", sections: defaultSections(2500, 1500, 600) },
  { id: "tr3", title: "Laughs Unlimited", artist: "Karthik Kumar", venue: "BIT Auditorium", location: "Trichy, Tamil Nadu", date: "May 18, 2026", time: "8:00 PM", category: "Comedy", sections: defaultSections(1800, 1000, 400) },
  { id: "tr4", title: "Vijay Antony Live", artist: "Vijay Antony", venue: "Trichy Maarangal Ground", location: "Trichy, Tamil Nadu", date: "May 28, 2026", time: "7:00 PM", category: "Concert", sections: defaultSections(3000, 1800, 700) },
  { id: "tr5", title: "Classical Night", artist: "Bombay Jayashri", venue: "Srirangam Temple Ground", location: "Trichy, Tamil Nadu", date: "Jun 8, 2026", time: "6:30 PM", category: "Concert", sections: defaultSections(2500, 1500, 600) },

  // ── Salem, Tamil Nadu ──
  { id: "9", title: "Tamil Comedy Galatta", artist: "Praveen Kumar", venue: "Raja Muthiah Hall", location: "Salem, Tamil Nadu", date: "May 8, 2026", time: "8:00 PM", category: "Comedy", sections: defaultSections(2000, 1200, 500) },
  { id: "sl2", title: "Salem Rock Night", artist: "Agam Band", venue: "Periyar University Ground", location: "Salem, Tamil Nadu", date: "May 15, 2026", time: "7:00 PM", category: "Concert", sections: defaultSections(2000, 1200, 500) },
  { id: "sl3", title: "Yogi Babu Comedy", artist: "Yogi Babu", venue: "Salem Town Hall", location: "Salem, Tamil Nadu", date: "May 25, 2026", time: "8:00 PM", category: "Comedy", sections: defaultSections(1800, 1000, 400) },
  { id: "sl4", title: "Shreya Ghoshal Live", artist: "Shreya Ghoshal", venue: "Salem Fairgrounds", location: "Salem, Tamil Nadu", date: "Jun 2, 2026", time: "7:00 PM", category: "Concert", sections: defaultSections(3500, 2000, 800) },
  { id: "sl5", title: "Tamil Folk Fest", artist: "Multiple Artists", venue: "Mango Park Ground", location: "Salem, Tamil Nadu", date: "Jun 10, 2026", time: "5:30 PM", category: "Festival", sections: defaultSections(2000, 1200, 500) },

  // ── Tirunelveli, Tamil Nadu ──
  { id: "11", title: "Indie Beats Live", artist: "Sean Roldan", venue: "Surya Convention Center", location: "Tirunelveli, Tamil Nadu", date: "May 22, 2026", time: "7:00 PM", category: "Concert", sections: defaultSections(1800, 1000, 400) },
  { id: "tn2", title: "Nellai Music Night", artist: "Haricharan", venue: "VOC Ground", location: "Tirunelveli, Tamil Nadu", date: "Jun 1, 2026", time: "7:00 PM", category: "Concert", sections: defaultSections(2000, 1200, 500) },
  { id: "tn3", title: "Comedy Pattarai", artist: "Sathish", venue: "Town Hall", location: "Tirunelveli, Tamil Nadu", date: "Jun 8, 2026", time: "8:00 PM", category: "Comedy", sections: defaultSections(1500, 900, 400) },
  { id: "tn4", title: "Nellai Cultural Fest", artist: "Multiple Artists", venue: "Nellai Fairground", location: "Tirunelveli, Tamil Nadu", date: "Jun 15, 2026", time: "5:00 PM", category: "Festival", sections: defaultSections(2000, 1200, 500) },
  { id: "tn5", title: "SPB Tribute Night", artist: "Sid Sriram", venue: "Nellai Indoor Stadium", location: "Tirunelveli, Tamil Nadu", date: "Jun 22, 2026", time: "7:00 PM", category: "Concert", sections: defaultSections(3000, 1800, 700) },

  // ── Bangalore ──
  { id: "b1", title: "Prateek Kuhad Live", artist: "Prateek Kuhad", venue: "Phoenix Marketcity", location: "Bangalore, Karnataka", date: "Mar 25, 2026", time: "7:00 PM", category: "Concert", sections: defaultSections(5000, 3000, 1200) },
  { id: "b2", title: "Kenny Sebastian Show", artist: "Kenny Sebastian", venue: "Good Shepherd Auditorium", location: "Bangalore, Karnataka", date: "Apr 2, 2026", time: "8:00 PM", category: "Comedy", sections: defaultSections(3000, 1800, 700) },
  { id: "b3", title: "Bangalore Open Air", artist: "Multiple Artists", venue: "Jayamahal Palace Ground", location: "Bangalore, Karnataka", date: "Apr 15, 2026", time: "4:00 PM", category: "Festival", sections: defaultSections(6000, 3500, 1500) },
  { id: "b4", title: "Raghu Dixit Project", artist: "Raghu Dixit", venue: "Chowdiah Memorial Hall", location: "Bangalore, Karnataka", date: "May 1, 2026", time: "7:30 PM", category: "Concert", sections: defaultSections(4000, 2500, 1000) },
  { id: "b5", title: "Comicstaan Live", artist: "Multiple Artists", venue: "JN Tata Auditorium", location: "Bangalore, Karnataka", date: "May 12, 2026", time: "8:00 PM", category: "Comedy", sections: defaultSections(3500, 2000, 800) },

  // ── Hyderabad ──
  { id: "h1", title: "Armaan Malik Live", artist: "Armaan Malik", venue: "Hitex Exhibition Center", location: "Hyderabad, Telangana", date: "Mar 30, 2026", time: "7:00 PM", category: "Concert", sections: defaultSections(5500, 3500, 1200) },
  { id: "h2", title: "Hyderabad Comedy Club", artist: "Rahul Subramanian", venue: "Shilpakala Vedika", location: "Hyderabad, Telangana", date: "Apr 8, 2026", time: "8:30 PM", category: "Comedy", sections: defaultSections(3000, 1800, 700) },
  { id: "h3", title: "Deccan Music Fest", artist: "Multiple Artists", venue: "People's Plaza", location: "Hyderabad, Telangana", date: "Apr 20, 2026", time: "5:00 PM", category: "Festival", sections: defaultSections(5000, 3000, 1200) },
  { id: "h4", title: "Shankar Mahadevan Live", artist: "Shankar Mahadevan", venue: "Ravindra Bharathi", location: "Hyderabad, Telangana", date: "May 5, 2026", time: "7:00 PM", category: "Concert", sections: defaultSections(6000, 3500, 1500) },
  { id: "h5", title: "Laugh Riot Hyderabad", artist: "Zakir Khan", venue: "HICC Novotel", location: "Hyderabad, Telangana", date: "May 18, 2026", time: "9:00 PM", category: "Comedy", sections: defaultSections(4000, 2500, 1000) },

  // ── Kolkata ──
  { id: "k1", title: "Arijit Singh Live", artist: "Arijit Singh", venue: "Netaji Indoor Stadium", location: "Kolkata, West Bengal", date: "Apr 1, 2026", time: "7:00 PM", category: "Concert", sections: defaultSections(7000, 4500, 1800) },
  { id: "k2", title: "Kolkata Comedy Fest", artist: "Anubhav Singh Bassi", venue: "Kala Mandir", location: "Kolkata, West Bengal", date: "Apr 12, 2026", time: "8:00 PM", category: "Comedy", sections: defaultSections(4000, 2500, 1000) },
  { id: "k3", title: "Bangla Rock Night", artist: "Fossils", venue: "Science City Auditorium", location: "Kolkata, West Bengal", date: "Apr 25, 2026", time: "7:30 PM", category: "Concert", sections: defaultSections(3000, 1800, 700) },
  { id: "k4", title: "Durga Puja Music Fest", artist: "Multiple Artists", venue: "Salt Lake Stadium", location: "Kolkata, West Bengal", date: "May 10, 2026", time: "5:00 PM", category: "Festival", sections: defaultSections(5000, 3000, 1200) },
  { id: "k5", title: "Nachiketa Unplugged", artist: "Nachiketa", venue: "Rabindra Sadan", location: "Kolkata, West Bengal", date: "May 20, 2026", time: "7:00 PM", category: "Concert", sections: defaultSections(2500, 1500, 600) },

  // ── Pune ──
  { id: "p1", title: "Vishal Mishra Live", artist: "Vishal Mishra", venue: "Ganesh Kala Krida Manch", location: "Pune, Maharashtra", date: "Mar 28, 2026", time: "7:30 PM", category: "Concert", sections: defaultSections(5000, 3000, 1200) },
  { id: "p2", title: "Pune Comedy Night", artist: "Samay Raina", venue: "Bal Gandharva Rang Mandir", location: "Pune, Maharashtra", date: "Apr 5, 2026", time: "8:00 PM", category: "Comedy", sections: defaultSections(3500, 2000, 800) },
  { id: "p3", title: "NH7 Weekender", artist: "Multiple Artists", venue: "Mahalaxmi Lawns", location: "Pune, Maharashtra", date: "Apr 18, 2026", time: "3:00 PM", category: "Festival", sections: defaultSections(7000, 4500, 2000) },
  { id: "p4", title: "Indian Ocean Live", artist: "Indian Ocean", venue: "Symbiosis Open Air", location: "Pune, Maharashtra", date: "May 3, 2026", time: "7:00 PM", category: "Concert", sections: defaultSections(4000, 2500, 1000) },
  { id: "p5", title: "Kunal Kamra Live", artist: "Kunal Kamra", venue: "Tilak Smarak Mandir", location: "Pune, Maharashtra", date: "May 15, 2026", time: "8:30 PM", category: "Comedy", sections: defaultSections(3500, 2000, 800) },
];

// Extract unique locations for chatbot
export const availableLocations = [...new Set(mockEvents.map(e => {
  const city = e.location.split(",")[0].trim().toLowerCase();
  return city;
}))];

export function getEventsByLocation(locationQuery: string): Event[] {
  const query = locationQuery.toLowerCase().trim();
  return mockEvents.filter(e => e.location.toLowerCase().includes(query));
}

// Simulated booked seats storage
const bookedSeatsMap: Record<string, Set<string>> = {};

export function getBookedSeats(eventId: string): Set<string> {
  if (!bookedSeatsMap[eventId]) {
    const event = mockEvents.find(e => e.id === eventId);
    const booked = new Set<string>();
    if (event) {
      event.sections.forEach(section => {
        for (let r = 1; r <= section.rows; r++) {
          for (let c = 1; c <= section.seatsPerRow; c++) {
            if (Math.random() < 0.15) {
              booked.add(`${section.id}-${r}-${c}`);
            }
          }
        }
      });
    }
    bookedSeatsMap[eventId] = booked;
  }
  return bookedSeatsMap[eventId];
}

export function bookSeats(eventId: string, seatIds: string[]): void {
  const booked = getBookedSeats(eventId);
  seatIds.forEach(id => booked.add(id));
}

const BOOKINGS_KEY = "ticketbot_bookings";

function loadBookings(): BookingDetails[] {
  try {
    const data = localStorage.getItem(BOOKINGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveBookings(bookings: BookingDetails[]): void {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

export function addBooking(booking: BookingDetails): void {
  const bookings = loadBookings();
  bookings.push(booking);
  saveBookings(bookings);
}

export function getBookings(): BookingDetails[] {
  return loadBookings();
}
