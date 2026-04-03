const rates = { 'Regular': 30, 'EV Charging': 50, 'Compact': 20, 'Handicapped': 25, 'Bike': 20 };
const hours = { '1hr': 1, '2hr': 2, '4hr': 4, 'Full Day': 8 };
let selectedDuration = '2hr';
let availableSlots = [];

// Pre-fill from URL params
const params = new URLSearchParams(window.location.search);
if (params.get('slot')) document.getElementById('slot-preference').value = params.get('slot');
if (params.get('floor')) {
  const radio = document.querySelector(`input[name="floor"][value="${params.get('floor')}"]`);
  if (radio) { radio.checked = true; loadAvailableSlots(params.get('floor')); }
}

// Duration toggle buttons
document.querySelectorAll('.duration-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.duration-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedDuration = btn.dataset.duration;
    updateFare();
  });
});

// Floor change → load slots
document.querySelectorAll('input[name="floor"]').forEach(radio => {
  radio.addEventListener('change', () => loadAvailableSlots(radio.value));
});

async function loadAvailableSlots(floor) {
  try {
    const res = await fetch(`/api/parking/${floor}`);
    const data = await res.json();
    availableSlots = data.slots.filter(s => s.status === 'Available');
    const sel = document.getElementById('slot-preference');
    sel.innerHTML = '<option value="">Auto-select best slot</option>';
    availableSlots.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = `${s.id} — ${s.type}`;
      sel.appendChild(opt);
    });
    if (params.get('slot')) sel.value = params.get('slot');
  } catch (e) {}
}

// Parking type → update fare
document.getElementById('parking-type').addEventListener('change', updateFare);
document.getElementById('vehicle-type').addEventListener('change', updateFare);

function updateFare() {
  const parkType = document.getElementById('parking-type').value;
  const vType = document.getElementById('vehicle-type').value;
  const rate = vType === 'Bike' ? rates['Bike'] : (rates[parkType] || 30);
  const hrs = hours[selectedDuration] || 2;
  const subtotal = rate * hrs;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  document.getElementById('fare-rate').textContent = `₹${rate}/hr`;
  document.getElementById('fare-hours').textContent = `${hrs} hr${hrs > 1 ? 's' : ''}`;
  document.getElementById('fare-subtotal').textContent = `₹${subtotal}`;
  document.getElementById('fare-tax').textContent = `₹${tax}`;
  document.getElementById('fare-total').textContent = `₹${total}`;
}

// Set min datetime to now
const entryInput = document.getElementById('entry-time');
if (entryInput) {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  entryInput.min = now.toISOString().slice(0, 16);
  entryInput.value = now.toISOString().slice(0, 16);
}

// Validation
function validateField(id, rule, msg) {
  const el = document.getElementById(id);
  const err = document.getElementById(`${id}-error`);
  const valid = rule(el.value.trim());
  el.classList.toggle('error', !valid);
  if (err) err.classList.toggle('visible', !valid);
  if (!valid && err) err.textContent = msg;
  return valid;
}

document.getElementById('name').addEventListener('input', () =>
  validateField('name', v => v.length >= 2, 'Name must be at least 2 characters'));

document.getElementById('mobile').addEventListener('input', () =>
  validateField('mobile', v => /^[6-9]\d{9}$/.test(v), 'Enter a valid 10-digit mobile number'));

document.getElementById('vehicle-number').addEventListener('input', e => {
  e.target.value = e.target.value.toUpperCase();
  validateField('vehicle-number', v => /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/.test(v), 'Format: MH12AB1234');
});

// Form submit
document.getElementById('booking-form').addEventListener('submit', async e => {
  e.preventDefault();

  const v1 = validateField('name', v => v.length >= 2, 'Name required');
  const v2 = validateField('mobile', v => /^[6-9]\d{9}$/.test(v), 'Valid mobile required');
  const v3 = validateField('vehicle-number', v => /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/.test(v), 'Valid vehicle number required');

  if (!v1 || !v2 || !v3) { showToast('Please fix form errors', 'error'); return; }

  const floor = document.querySelector('input[name="floor"]:checked')?.value || 'B1';
  let slotId = document.getElementById('slot-preference').value;

  // Auto-select
  if (!slotId && availableSlots.length > 0) slotId = availableSlots[0].id;
  if (!slotId) { showToast('No available slots on this floor', 'error'); return; }

  const parkingType = document.getElementById('parking-type').value;
  const vType = document.getElementById('vehicle-type').value;
  const rate = vType === 'Bike' ? rates['Bike'] : (rates[parkingType] || 30);
  const hrs = hours[selectedDuration] || 2;
  const amount = rate * hrs;

  const payload = {
    name: document.getElementById('name').value.trim(),
    mobile: document.getElementById('mobile').value.trim(),
    vehicleNumber: document.getElementById('vehicle-number').value.trim(),
    vehicleType: vType,
    slotId,
    floor,
    entryTime: document.getElementById('entry-time').value,
    duration: selectedDuration,
    parkingType,
    amount
  };

  const btn = document.getElementById('submit-btn');
  btn.disabled = true;
  btn.textContent = 'Booking...';

  try {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (data.success) {
      showBookingConfirmation(data.booking);
      showToast('Booking confirmed!', 'success');
    } else if (res.status === 409) {
      showToast(`Slot taken. ${data.suggestedSlot ? 'Suggested: ' + data.suggestedSlot : 'Try another slot.'}`, 'warning');
      if (data.suggestedSlot) document.getElementById('slot-preference').value = data.suggestedSlot;
      btn.disabled = false;
      btn.textContent = 'Confirm Booking';
    } else {
      showToast(data.message || 'Booking failed', 'error');
      btn.disabled = false;
      btn.textContent = 'Confirm Booking';
    }
  } catch (err) {
    showToast('Network error. Please try again.', 'error');
    btn.disabled = false;
    btn.textContent = 'Confirm Booking';
  }
});

function showBookingConfirmation(booking) {
  document.getElementById('booking-form-section').style.display = 'none';
  const conf = document.getElementById('booking-confirmation');
  conf.classList.add('visible');

  document.getElementById('conf-booking-id').textContent = booking.id;
  document.getElementById('conf-name').textContent = booking.name;
  document.getElementById('conf-vehicle').textContent = booking.vehicleNumber;
  document.getElementById('conf-slot').textContent = booking.slotId;
  document.getElementById('conf-floor').textContent = booking.floor === 'B1' ? 'Basement 1' : booking.floor === 'B2' ? 'Basement 2' : 'Level 1';
  document.getElementById('conf-duration').textContent = booking.duration;
  document.getElementById('conf-type').textContent = booking.parkingType;
  document.getElementById('conf-amount').textContent = `₹${booking.amount + Math.round(booking.amount * 0.05)}`;
  document.getElementById('conf-find-link').href = `find-my-car.html?id=${booking.id}`;
}

document.getElementById('print-pass').addEventListener('click', () => window.print());

updateFare();
loadAvailableSlots('B1');
