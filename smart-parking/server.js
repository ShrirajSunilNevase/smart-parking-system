const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── In-Memory Data Store ──────────────────────────────────────────────────────
// (replaces fs-based parking.json — works on Vercel serverless)
let data = {
  slots: [
    {"id":"B1-01","floor":"B1","type":"Regular","status":"Available","vehicleNumber":null,"bookingId":null,"parkedAt":null,"duration":null},
    {"id":"B1-02","floor":"B1","type":"Regular","status":"Occupied","vehicleNumber":"MH12AB1234","bookingId":"PSP-2024-0001","parkedAt":"2024-01-15T09:30:00","duration":"4hr"},
    {"id":"B1-03","floor":"B1","type":"Regular","status":"Available","vehicleNumber":null,"bookingId":null,"parkedAt":null,"duration":null},
    {"id":"B1-04","floor":"B1","type":"EV Charging","status":"Occupied","vehicleNumber":"MH14EV5678","bookingId":"PSP-2024-0002","parkedAt":"2024-01-15T10:00:00","duration":"2hr"},
    {"id":"B1-05","floor":"B1","type":"Regular","status":"Reserved","vehicleNumber":null,"bookingId":"PSP-2024-0003","parkedAt":null,"duration":"1hr"},
    {"id":"B1-06","floor":"B1","type":"Compact","status":"Available","vehicleNumber":null,"bookingId":null,"parkedAt":null,"duration":null},
    {"id":"B1-07","floor":"B1","type":"Regular","status":"Occupied","vehicleNumber":"MH12CD3456","bookingId":"PSP-2024-0004","parkedAt":"2024-01-15T08:00:00","duration":"Full Day"},
    {"id":"B1-08","floor":"B1","type":"Handicapped","status":"Available","vehicleNumber":null,"bookingId":null,"parkedAt":null,"duration":null},
    {"id":"B1-09","floor":"B1","type":"Regular","status":"Available","vehicleNumber":null,"bookingId":null,"parkedAt":null,"duration":null},
    {"id":"B1-10","floor":"B1","type":"Regular","status":"Occupied","vehicleNumber":"MH20XY9012","bookingId":"PSP-2024-0005","parkedAt":"2024-01-15T11:00:00","duration":"2hr"},
    {"id":"B1-11","floor":"B1","type":"EV Charging","status":"Available","vehicleNumber":null,"bookingId":null,"parkedAt":null,"duration":null},
    {"id":"B1-12","floor":"B1","type":"Regular","status":"Reserved","vehicleNumber":null,"bookingId":"PSP-2024-0006","parkedAt":null,"duration":"2hr"},
    {"id":"B1-13","floor":"B1","type":"Regular","status":"Available","vehicleNumber":null,"bookingId":null,"parkedAt":null,"duration":null},
    {"id":"B1-14","floor":"B1","type":"Compact","status":"Occupied","vehicleNumber":"MH12PQ7890","bookingId":"PSP-2024-0007","parkedAt":"2024-01-15T09:00:00","duration":"4hr"},
    {"id":"B1-15","floor":"B1","type":"Regular","status":"Available","vehicleNumber":null,"bookingId":null,"parkedAt":null,"duration":null},
    {"id":"B1-16","floor":"B1","type":"Regular","status":"Available","vehicleNumber":null,"bookingId":null,"parkedAt":null,"duration":null},
    {"id":"B1-17","floor":"B1","type":"Handicapped","status":"Occupied","vehicleNumber":"MH04RS2345","bookingId":"PSP-2024-0008","parkedAt":"2024-01-15T10:30:00","duration":"2hr"},
    {"id":"B1-18","floor":"B1","type":"Regular","status":"Available","vehicleNumber":null,"bookingId":null,"parkedAt":null,"duration":null},
    {"id":"B1-19","floor":"B1","type":"Regular","status":"Reserved","vehicleNumber":null,"bookingId":"PSP-2024-0009","parkedAt":null,"duration":"1hr"},
    {"id":"B1-20","floor":"B1","type":"EV Charging","status":"Available","vehicleNumber":null,"bookingId":null,"parkedAt":null,"duration":null},
    {"id":"B2-01","floor":"B2","type":"Regular","status":"Occupied","vehicleNumber":"MH12TU6789","bookingId":"PSP-2024-0010","parkedAt":"2024-01-15T08:30:00","duration":"Full Day"},
    {"id":"B2-02","floor":"B2","type":"Regular","status":"Available","vehicleNumber":null,"bookingId":null,"parkedAt":null,"duration":null},
    {"id":"B2-03","floor":"B2","type":"Compact","status":"Available","vehicleNumber":null,"bookingId":null,"parkedAt":null,"duration":null},
    {"id":"B2-04","floor":"B2","type":"Regular","status":"Occupied","vehicleNumber":"MH15VW3456","bookingId":"PSP-2024-0011","parkedAt":"2024-01-15T09:45:00","duration":"4hr"},
    {"id":"B2-05","floor":"B2","type":"EV Charging","status":"Available","vehicleNumber":null,"bookingId":null,"parkedAt":null,"duration":null},
    {"id":"B2-06","floor":"B2","type":"Regular","status":"Available","vehicleNumber":null,"bookingId":null,"parkedAt":null,"duration":null},
    {"id":"B2-07","floor":"B2","type":"Regular","status":"Reserved","vehicleNumber":null,"bookingId":"PSP-2024-0012","parkedAt":null,"duration":"2hr"},
    {"id":"B2-08","floor":"B2","type":"Regular","status":"Available","vehicleNumber":null,"bookingId":null,"parkedAt":null,"duration":null},
    {"id":"B2-09","floor":"B2","type":"Handicapped","status":"Occupied","vehicleNumber":"MH12MN4567","bookingId":"PSP-2024-0013","parkedAt":"2024-01-15T10:15:00","duration":"2hr"},
    {"id":"B2-10","floor":"B2","type":"Regular","status":"Available","vehicleNumber":null,"bookingId":null,"parkedAt":null,"duration":null},
    {"id":"B2-11","floor":"B2","type":"Regular","status":"Available","vehicleNumber":null,"bookingId":null,"parkedAt":null,"duration":null},
    {"id":"B2-12","floor":"B2","type":"EV Charging","status":"Occupied","vehicleNumber":"MH12OP8901","bookingId":"PSP-2024-0014","parkedAt":"2024-01-15T11:30:00","duration":"1hr"},
    {"id":"B2-13","floor":"B2","type":"Regular","status":"Available","vehicleNumber":null,"bookingId":null,"parkedAt":null,"duration":null},
    {"id":"B2-14","floor":"B2","type":"Regular","status":"Reserved","vehicleNumber":null,"bookingId":"PSP-2024-0015","parkedAt":null,"duration":"4hr"},
    {"id":"B2-15","floor":"B2","type":"Compact","status":"Available","vehicleNumber":null,"bookingId":null,"parkedAt":null,"duration":null},
    {"id":"B2-16","floor":"B2","type":"Regular","status":"Available","vehicleNumber":null,"bookingId":null,"parkedAt":null,"duration":null},
    {"id":"B2-17","floor":"B2","type":"Regular","status":"Occupied","vehicleNumber":"MH12QR2345","bookingId":"PSP-2024-0016","parkedAt":"2024-01-15T07:00:00","duration":"Full Day"},
    {"id":"B2-18","floor":"B2","type":"Handicapped","status":"Available","vehicleNumber":null,"bookingId":null,"parkedAt":null,"duration":null},
    {"id":"B2-19","floor":"B2","type":"Regular","status":"Available","vehicleNumber":null,"bookingId":null,"parkedAt":null,"duration":null},
    {"id":"B2-20","floor":"B2","type":"EV Charging","status":"Available","vehicleNumber":null,"bookingId":null,"parkedAt":null,"duration":null},
    {"id":"L1-01","floor":"L1","type":"Regular","status":"Available","vehicleNumber":null,"bookingId":null,"parkedAt":null,"duration":null},
    {"id":"L1-02","floor":"L1","type":"Regular","status":"Occupied","vehicleNumber":"MH12ST5678","bookingId":"PSP-2024-0017","parkedAt":"2024-01-15T10:00:00","duration":"2hr"},
    {"id":"L1-03","floor":"L1","type":"EV Charging","status":"Available","vehicleNumber":null,"bookingId":null,"parkedAt":null,"duration":null},
    {"id":"L1-04","floor":"L1","type":"Regular","status":"Available","vehicleNumber":null,"bookingId":null,"parkedAt":null,"duration":null},
    {"id":"L1-05","floor":"L1","type":"Compact","status":"Occupied","vehicleNumber":"MH12UV9012","bookingId":"PSP-2024-0018","parkedAt":"2024-01-15T09:15:00","duration":"4hr"},
    {"id":"L1-06","floor":"L1","type":"Regular","status":"Reserved","vehicleNumber":null,"bookingId":"PSP-2024-0019","parkedAt":null,"duration":"2hr"},
    {"id":"L1-07","floor":"L1","type":"Regular","status":"Available","vehicleNumber":null,"bookingId":null,"parkedAt":null,"duration":null},
    {"id":"L1-08","floor":"L1","type":"Handicapped","status":"Available","vehicleNumber":null,"bookingId":null,"parkedAt":null,"duration":null},
    {"id":"L1-09","floor":"L1","type":"Regular","status":"Occupied","vehicleNumber":"MH12WX3456","bookingId":"PSP-2024-0020","parkedAt":"2024-01-15T08:45:00","duration":"Full Day"},
    {"id":"L1-10","floor":"L1","type":"Regular","status":"Available","vehicleNumber":null,"bookingId":null,"parkedAt":null,"duration":null},
    {"id":"L1-11","floor":"L1","type":"Regular","status":"Available","vehicleNumber":null,"bookingId":null,"parkedAt":null,"duration":null},
    {"id":"L1-12","floor":"L1","type":"EV Charging","status":"Available","vehicleNumber":null,"bookingId":null,"parkedAt":null,"duration":null},
    {"id":"L1-13","floor":"L1","type":"Compact","status":"Available","vehicleNumber":null,"bookingId":null,"parkedAt":null,"duration":null},
    {"id":"L1-14","floor":"L1","type":"Regular","status":"Reserved","vehicleNumber":null,"bookingId":"PSP-2024-0021","parkedAt":null,"duration":"1hr"},
    {"id":"L1-15","floor":"L1","type":"Regular","status":"Occupied","vehicleNumber":"MH12YZ7890","bookingId":"PSP-2024-0022","parkedAt":"2024-01-15T11:15:00","duration":"2hr"},
    {"id":"L1-16","floor":"L1","type":"Regular","status":"Available","vehicleNumber":null,"bookingId":null,"parkedAt":null,"duration":null},
    {"id":"L1-17","floor":"L1","type":"Handicapped","status":"Available","vehicleNumber":null,"bookingId":null,"parkedAt":null,"duration":null},
    {"id":"L1-18","floor":"L1","type":"Regular","status":"Available","vehicleNumber":null,"bookingId":null,"parkedAt":null,"duration":null},
    {"id":"L1-19","floor":"L1","type":"EV Charging","status":"Available","vehicleNumber":null,"bookingId":null,"parkedAt":null,"duration":null},
    {"id":"L1-20","floor":"L1","type":"Regular","status":"Available","vehicleNumber":null,"bookingId":null,"parkedAt":null,"duration":null}
  ],
  bookings: [
    {"id":"PSP-2024-0001","name":"Rahul Sharma","mobile":"9876543210","vehicleNumber":"MH12AB1234","vehicleType":"Car","slotId":"B1-02","floor":"B1","entryTime":"2024-01-15T09:30:00","duration":"4hr","parkingType":"Regular","amount":120,"status":"Active"},
    {"id":"PSP-2024-0002","name":"Priya Desai","mobile":"9988776655","vehicleNumber":"MH14EV5678","vehicleType":"EV","slotId":"B1-04","floor":"B1","entryTime":"2024-01-15T10:00:00","duration":"2hr","parkingType":"EV Charging","amount":100,"status":"Active"},
    {"id":"PSP-2024-0003","name":"Amit Joshi","mobile":"9123456789","vehicleNumber":null,"slotId":"B1-05","floor":"B1","entryTime":null,"duration":"1hr","parkingType":"Regular","amount":30,"status":"Reserved"},
    {"id":"PSP-2024-0004","name":"Sneha Patil","mobile":"9765432180","vehicleNumber":"MH12CD3456","vehicleType":"SUV","slotId":"B1-07","floor":"B1","entryTime":"2024-01-15T08:00:00","duration":"Full Day","parkingType":"Regular","amount":240,"status":"Active"},
    {"id":"PSP-2024-0005","name":"Vikram Nair","mobile":"9654321890","vehicleNumber":"MH20XY9012","vehicleType":"Car","slotId":"B1-10","floor":"B1","entryTime":"2024-01-15T11:00:00","duration":"2hr","parkingType":"Regular","amount":60,"status":"Active"},
    {"id":"PSP-2024-0006","name":"Kavya Reddy","mobile":"9543218760","vehicleNumber":null,"slotId":"B1-12","floor":"B1","entryTime":null,"duration":"2hr","parkingType":"Regular","amount":60,"status":"Reserved"},
    {"id":"PSP-2024-0007","name":"Arjun Mehta","mobile":"9432187650","vehicleNumber":"MH12PQ7890","vehicleType":"Bike","slotId":"B1-14","floor":"B1","entryTime":"2024-01-15T09:00:00","duration":"4hr","parkingType":"Compact","amount":80,"status":"Active"},
    {"id":"PSP-2024-0008","name":"Divya Iyer","mobile":"9321876540","vehicleNumber":"MH04RS2345","vehicleType":"Car","slotId":"B1-17","floor":"B1","entryTime":"2024-01-15T10:30:00","duration":"2hr","parkingType":"Handicapped","amount":50,"status":"Active"},
    {"id":"PSP-2024-0009","name":"Rohan Kulkarni","mobile":"9210765430","vehicleNumber":null,"slotId":"B1-19","floor":"B1","entryTime":null,"duration":"1hr","parkingType":"Regular","amount":30,"status":"Reserved"},
    {"id":"PSP-2024-0010","name":"Neha Bhatt","mobile":"9109654320","vehicleNumber":"MH12TU6789","vehicleType":"SUV","slotId":"B2-01","floor":"B2","entryTime":"2024-01-15T08:30:00","duration":"Full Day","parkingType":"Regular","amount":240,"status":"Active"},
    {"id":"PSP-2024-0011","name":"Kiran Rao","mobile":"9098543210","vehicleNumber":"MH15VW3456","vehicleType":"Car","slotId":"B2-04","floor":"B2","entryTime":"2024-01-15T09:45:00","duration":"4hr","parkingType":"Regular","amount":120,"status":"Active"},
    {"id":"PSP-2024-0012","name":"Ananya Singh","mobile":"8987432100","vehicleNumber":null,"slotId":"B2-07","floor":"B2","entryTime":null,"duration":"2hr","parkingType":"Regular","amount":60,"status":"Reserved"},
    {"id":"PSP-2024-0013","name":"Suresh Verma","mobile":"8876321000","vehicleNumber":"MH12MN4567","vehicleType":"Car","slotId":"B2-09","floor":"B2","entryTime":"2024-01-15T10:15:00","duration":"2hr","parkingType":"Handicapped","amount":50,"status":"Active"},
    {"id":"PSP-2024-0014","name":"Meera Nambiar","mobile":"8765210000","vehicleNumber":"MH12OP8901","vehicleType":"EV","slotId":"B2-12","floor":"B2","entryTime":"2024-01-15T11:30:00","duration":"1hr","parkingType":"EV Charging","amount":50,"status":"Active"},
    {"id":"PSP-2024-0015","name":"Rajesh Gupta","mobile":"8654100000","vehicleNumber":null,"slotId":"B2-14","floor":"B2","entryTime":null,"duration":"4hr","parkingType":"Regular","amount":120,"status":"Reserved"},
    {"id":"PSP-2024-0016","name":"Pooja Shetty","mobile":"8543000000","vehicleNumber":"MH12QR2345","vehicleType":"Car","slotId":"B2-17","floor":"B2","entryTime":"2024-01-15T07:00:00","duration":"Full Day","parkingType":"Regular","amount":240,"status":"Active"},
    {"id":"PSP-2024-0017","name":"Deepak Pillai","mobile":"8432000000","vehicleNumber":"MH12ST5678","vehicleType":"Bike","slotId":"L1-02","floor":"L1","entryTime":"2024-01-15T10:00:00","duration":"2hr","parkingType":"Compact","amount":40,"status":"Active"},
    {"id":"PSP-2024-0018","name":"Lakshmi Menon","mobile":"8321000000","vehicleNumber":"MH12UV9012","vehicleType":"Car","slotId":"L1-05","floor":"L1","entryTime":"2024-01-15T09:15:00","duration":"4hr","parkingType":"Compact","amount":80,"status":"Active"},
    {"id":"PSP-2024-0019","name":"Ajay Kumar","mobile":"8210000000","vehicleNumber":null,"slotId":"L1-06","floor":"L1","entryTime":null,"duration":"2hr","parkingType":"Regular","amount":60,"status":"Reserved"},
    {"id":"PSP-2024-0020","name":"Shweta Jain","mobile":"8100000000","vehicleNumber":"MH12WX3456","vehicleType":"SUV","slotId":"L1-09","floor":"L1","entryTime":"2024-01-15T08:45:00","duration":"Full Day","parkingType":"Regular","amount":240,"status":"Active"},
    {"id":"PSP-2024-0021","name":"Manish Tiwari","mobile":"7999000000","vehicleNumber":null,"slotId":"L1-14","floor":"L1","entryTime":null,"duration":"1hr","parkingType":"Regular","amount":30,"status":"Reserved"},
    {"id":"PSP-2024-0022","name":"Rashmi Agrawal","mobile":"7888000000","vehicleNumber":"MH12YZ7890","vehicleType":"Car","slotId":"L1-15","floor":"L1","entryTime":"2024-01-15T11:15:00","duration":"2hr","parkingType":"Regular","amount":60,"status":"Active"}
  ],
  meta: {
    lastBookingNumber: 22,
    revenueToday: 1760
  }
};

// Helper: generate booking ID
function generateBookingId(num) {
  return `PSP-2024-${String(num).padStart(4, '0')}`;
}

// ── GET /api/parking ─────────────────────────────────────────────────────────
app.get('/api/parking', (req, res) => {
  res.json({ success: true, slots: data.slots });
});

// ── GET /api/parking/:floor ──────────────────────────────────────────────────
app.get('/api/parking/:floor', (req, res) => {
  const floor = req.params.floor.toUpperCase();
  const slots = data.slots.filter(s => s.floor === floor);
  if (!slots.length) return res.status(404).json({ success: false, message: 'Floor not found' });
  res.json({ success: true, floor, slots });
});

// ── GET /api/stats ───────────────────────────────────────────────────────────
app.get('/api/stats', (req, res) => {
  const total = data.slots.length;
  const available = data.slots.filter(s => s.status === 'Available').length;
  const occupied = data.slots.filter(s => s.status === 'Occupied').length;
  const reserved = data.slots.filter(s => s.status === 'Reserved').length;

  const floorStats = ['B1', 'B2', 'L1'].map(floor => {
    const floorSlots = data.slots.filter(s => s.floor === floor);
    return {
      floor,
      total: floorSlots.length,
      available: floorSlots.filter(s => s.status === 'Available').length,
      occupied: floorSlots.filter(s => s.status === 'Occupied').length,
      reserved: floorSlots.filter(s => s.status === 'Reserved').length,
    };
  });

  res.json({
    success: true,
    stats: { total, available, occupied, reserved, revenueToday: data.meta.revenueToday, floorStats }
  });
});

// ── GET /api/bookings ────────────────────────────────────────────────────────
app.get('/api/bookings', (req, res) => {
  res.json({ success: true, bookings: data.bookings });
});

// ── POST /api/bookings ───────────────────────────────────────────────────────
app.post('/api/bookings', (req, res) => {
  const { name, mobile, vehicleNumber, vehicleType, slotId, floor, entryTime, duration, parkingType } = req.body;

  if (!name || !mobile || !vehicleNumber || !slotId || !floor) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const slot = data.slots.find(s => s.id === slotId);
  if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
  if (slot.status !== 'Available') {
    const nextAvailable = data.slots.find(s => s.floor === floor && s.status === 'Available');
    return res.status(409).json({
      success: false,
      message: 'Slot not available',
      suggestedSlot: nextAvailable ? nextAvailable.id : null
    });
  }

  const rates = { 'Regular': 30, 'EV Charging': 50, 'Compact': 20, 'Handicapped': 25 };
  const hours = { '1hr': 1, '2hr': 2, '4hr': 4, 'Full Day': 8 };
  const rate = rates[parkingType] || 30;
  const hrs = hours[duration] || 1;
  const amount = rate * hrs;

  data.meta.lastBookingNumber++;
  const bookingId = generateBookingId(data.meta.lastBookingNumber);

  const booking = {
    id: bookingId, name, mobile, vehicleNumber, vehicleType,
    slotId, floor, entryTime: entryTime || new Date().toISOString(),
    duration, parkingType, amount, status: 'Active'
  };

  slot.status = 'Occupied';
  slot.vehicleNumber = vehicleNumber;
  slot.bookingId = bookingId;
  slot.parkedAt = booking.entryTime;
  slot.duration = duration;

  data.bookings.push(booking);
  data.meta.revenueToday += amount;

  res.status(201).json({ success: true, booking });
});

// ── GET /api/find/:query ─────────────────────────────────────────────────────
app.get('/api/find/:query', (req, res) => {
  const query = req.params.query.toUpperCase();

  const booking = data.bookings.find(
    b => b.id.toUpperCase() === query || b.vehicleNumber?.toUpperCase() === query
  );

  if (!booking) return res.status(404).json({ success: false, message: 'No vehicle found' });

  const slot = data.slots.find(s => s.id === booking.slotId);
  const parkedAt = booking.entryTime ? new Date(booking.entryTime) : null;
  const now = new Date();
  const elapsedMs = parkedAt ? now - parkedAt : 0;
  const elapsedHrs = elapsedMs / 3600000;

  const rates = { 'Regular': 30, 'EV Charging': 50, 'Compact': 20, 'Handicapped': 25 };
  const rate = rates[booking.parkingType] || 30;
  const chargesSoFar = Math.ceil(elapsedHrs * rate);

  res.json({
    success: true,
    booking,
    slot,
    elapsedMinutes: Math.floor(elapsedMs / 60000),
    chargesSoFar: Math.max(chargesSoFar, 0)
  });
});

// ── PUT /api/bookings/:id ────────────────────────────────────────────────────
app.put('/api/bookings/:id', (req, res) => {
  const booking = data.bookings.find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

  Object.assign(booking, req.body);
  res.json({ success: true, booking });
});

// ── DELETE /api/bookings/:id ─────────────────────────────────────────────────
app.delete('/api/bookings/:id', (req, res) => {
  const bookingIdx = data.bookings.findIndex(b => b.id === req.params.id);
  if (bookingIdx === -1) return res.status(404).json({ success: false, message: 'Booking not found' });

  const booking = data.bookings[bookingIdx];
  const slot = data.slots.find(s => s.id === booking.slotId);

  if (slot) {
    slot.status = 'Available';
    slot.vehicleNumber = null;
    slot.bookingId = null;
    slot.parkedAt = null;
    slot.duration = null;
  }

  booking.status = 'Completed';
  res.json({ success: true, message: 'Slot released', bookingId: booking.id });
});

// Serve HTML pages
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🅿️  ParkSmart Pune running at http://localhost:${PORT}\n`);
});
