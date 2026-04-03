# 🅿️ ParkSmart Pune — Smart Parking Management System

A full-stack, production-grade Smart Parking Management Web Application for Amanora Mall, Pune.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the server
node server.js

# 3. Open in browser
# → http://localhost:3000
```

That's it! No database setup, no environment variables.

---

## 📁 Project Structure

```
smart-parking/
├── server.js              Node.js + Express backend
├── package.json
├── data/
│   └── parking.json       Mock data store (60 slots + bookings)
└── public/
    ├── index.html          Home page
    ├── parking-map.html    Live parking slot map
    ├── booking.html        Slot booking page
    ├── find-my-car.html    Car finder page
    ├── dashboard.html      Admin dashboard
    ├── css/
    │   └── style.css       Shared styles (futuristic dark theme)
    └── js/
        ├── main.js         Shared utilities (toasts, navbar, stats)
        ├── parking-map.js  Live map logic
        ├── booking.js      Booking form & confirmation
        └── find-my-car.js  Vehicle search logic
```

---

## ✨ Features

| Feature | Details |
|---------|---------|
| Live Parking Map | 60 slots across 3 floors, 15s auto-refresh |
| Instant Booking | Full form with live fare calculator |
| Find My Car | Search by vehicle number or booking ID |
| Admin Dashboard | PIN-protected, occupancy chart, bookings table |
| Real-time Stats | Available / Occupied / Reserved counts |
| Toast Notifications | Slide-in success/error/info messages |
| Page Loader | Animated "P" logo on every page |
| Mobile Support | Responsive + bottom navigation bar |
| Booking Confirmation | Printable pass with QR code |

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/parking` | All 60 slots with status |
| GET | `/api/parking/:floor` | Slots for B1, B2, or L1 |
| GET | `/api/stats` | Summary stats + floor breakdown |
| GET | `/api/bookings` | All bookings |
| POST | `/api/bookings` | Create booking, mark slot occupied |
| GET | `/api/find/:query` | Find by vehicle number or booking ID |
| PUT | `/api/bookings/:id` | Update booking (admin) |
| DELETE | `/api/bookings/:id` | Release slot, free parking space |

---

## 💰 Parking Rates

| Type | Rate |
|------|------|
| Regular / SUV / Car | ₹30/hr |
| EV Charging | ₹50/hr |
| Compact / Bike | ₹20/hr |
| Handicapped | ₹25/hr |

---

## 🔐 Admin Dashboard

- **URL:** http://localhost:3000/dashboard.html
- **Default PIN:** `1234`
- PIN is stored in `sessionStorage` (cleared on browser close)
- Auto-refreshes every 20 seconds

---

## 🗃 Data Store

`data/parking.json` contains:
- **60 slots** across 3 floors (B1, B2, L1) — 20 per floor
- **22 demo bookings** pre-populated
- **15 slots Occupied**, **5 slots Reserved** for demo realism
- Slot types: 40 Regular, 8 EV Charging, 6 Handicapped, 6 Compact

Data persists across server restarts (written to disk on every change).

---

## 🎨 Design

- **Theme:** Futuristic Dark-Tech with neon accents
- **Colors:** Deep navy `#0A0E1A` + Electric Cyan `#00D4FF` + Violet `#7B2FFF`
- **Fonts:** Orbitron (headings) + Exo 2 (body)
- **Effects:** Glassmorphism, circuit board grid background, neon glows

---

## 📱 Mobile

Fully responsive with a sticky bottom navigation bar on mobile screens.
