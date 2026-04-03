const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'parking.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper: read data
function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

// Helper: write data
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Helper: generate booking ID
function generateBookingId(num) {
  return `PSP-2024-${String(num).padStart(4, '0')}`;
}

// ── GET /api/parking ─────────────────────────────────────────────────────────
app.get('/api/parking', (req, res) => {
  const data = readData();
  res.json({ success: true, slots: data.slots });
});

// ── GET /api/parking/:floor ──────────────────────────────────────────────────
app.get('/api/parking/:floor', (req, res) => {
  const data = readData();
  const floor = req.params.floor.toUpperCase();
  const slots = data.slots.filter(s => s.floor === floor);
  if (!slots.length) return res.status(404).json({ success: false, message: 'Floor not found' });
  res.json({ success: true, floor, slots });
});

// ── GET /api/stats ───────────────────────────────────────────────────────────
app.get('/api/stats', (req, res) => {
  const data = readData();
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
  const data = readData();
  res.json({ success: true, bookings: data.bookings });
});

// ── POST /api/bookings ───────────────────────────────────────────────────────
app.post('/api/bookings', (req, res) => {
  const data = readData();
  const { name, mobile, vehicleNumber, vehicleType, slotId, floor, entryTime, duration, parkingType } = req.body;

  if (!name || !mobile || !vehicleNumber || !slotId || !floor) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  // Check slot availability
  const slot = data.slots.find(s => s.id === slotId);
  if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
  if (slot.status !== 'Available') {
    // Suggest next available slot on same floor
    const nextAvailable = data.slots.find(s => s.floor === floor && s.status === 'Available');
    return res.status(409).json({
      success: false,
      message: 'Slot not available',
      suggestedSlot: nextAvailable ? nextAvailable.id : null
    });
  }

  // Fare calculation
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

  // Mark slot as occupied
  slot.status = 'Occupied';
  slot.vehicleNumber = vehicleNumber;
  slot.bookingId = bookingId;
  slot.parkedAt = booking.entryTime;
  slot.duration = duration;

  data.bookings.push(booking);
  data.meta.revenueToday += amount;
  writeData(data);

  res.status(201).json({ success: true, booking });
});

// ── GET /api/find/:query ─────────────────────────────────────────────────────
app.get('/api/find/:query', (req, res) => {
  const data = readData();
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
  const data = readData();
  const booking = data.bookings.find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

  Object.assign(booking, req.body);
  writeData(data);
  res.json({ success: true, booking });
});

// ── DELETE /api/bookings/:id ─────────────────────────────────────────────────
app.delete('/api/bookings/:id', (req, res) => {
  const data = readData();
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
  // Keep in history but mark completed
  writeData(data);
  res.json({ success: true, message: 'Slot released', bookingId: booking.id });
});

// Serve HTML pages
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🅿️  ParkSmart Pune running at http://localhost:${PORT}\n`);
});
