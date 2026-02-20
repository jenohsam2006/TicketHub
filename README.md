TicketHub – Event Ticketing Chatbot & Web Platform
Project Overview:-
TicketHub is an intelligent event ticket booking platform designed to simplify the ticket purchasing process. It integrates a chatbot interface with event information and seating chart management to provide users with a smooth and interactive booking experience.
The system compresses event details, displays seating availability, and allows users to book tickets efficiently through a user-friendly web interface.

Features:-
•	Chatbot-based ticket booking assistant
•	Event listing and details display
•	Interactive seating chart visualization
•	Real-time ticket availability checking
•	Streamlined ticket booking process
•	Excel-based backend for event data storage
•	User-friendly and responsive interface

System Architecture:-
TicketHub follows a simple client-server architecture:
User (Browser)
     ↓
Frontend (HTML, CSS, JS)
     ↓
Backend (Python / Node / etc.)
     ↓
Excel Database (.xlsx)

Components:-
1. Frontend
•	Home page
•	Events page
•	Booking page
•	Chatbot interface
•	Result/Confirmation page
2. Backend
•	Handles event data
•	Processes booking requests
•	Updates seat availability
•	Reads/Writes Excel file
3. Database
•	Excel file storing:
•	Event Name
•	Date
•	Venue
•	Seat Numbers
•	Availability
•	Ticket Price

Technologies Used:-
1. Frontend:
•	HTML5
•	CSS3
•	JavaScript
2. Backend:
•	Python (Flask / Django) (or specify your backend)
3. Database:
•	Microsoft Excel (.xlsx)
•	Pandas / OpenPyXL (for Excel handling)

Project Folder Structure:-
TicketHub/
│
├── static/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── script.js
│   └── images/
│
├── templates/
│   ├── index.html
│   ├── events.html
│   ├── booking.html
│   ├── chatbot.html
│   └── confirmation.html
│
├── data/
│   └── events.xlsx
│
├── app.py (or server.js)
├── requirements.txt
└── README.md

Excel Database Structure:-
The events.xlsx file should contain:
Event_ID	Event_Name	Date	Venue	Seat_Number	Status	Price
1	Music Fest	25-03-2026	City Hall	A1	Available	500
1	Music Fest	25-03-2026	City Hall	A2	Booked	500

Status Values:
•	Available
•	Booked

Chatbot Workflow:-
1.	User opens chatbot
2.	Bot asks:
•	Which event?
•	How many tickets?
•	Seat preference?
3.	Bot checks availability
4.	Displays price summary
5.	Confirms booking
6.	Updates Excel database

Booking Process Flow:-
Select Event
     ↓
Choose Seats
     ↓
Check Availability
     ↓
Confirm Booking
     ↓
Update Database
     ↓
Show Confirmation

Validation & Error Handling:-
•	Prevent booking already reserved seats
•	Validate seat count
•	Handle invalid event names
•	Show proper error messages

UI Design Features:-
•	Clean and responsive layout
•	Modern button styles
•	Hover effects
•	Mobile-friendly design
•	Chat-style message bubbles

Future Enhancements:-
•	User authentication system
•	Online payment integration (Razorpay / Stripe)
•	Mobile app version
•	Admin dashboard for event management
•	Email ticket confirmation
•	QR-code based entry system
•	Database upgrade (MySQL / PostgreSQL)

Testing:-
•	Test cases include:
•	Booking available seat
•	Attempt booking booked seat
•	Invalid event selection
•	Multiple seat booking
•	Chatbot conversation flow
