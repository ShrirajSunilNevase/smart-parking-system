let currentFloor = 'B1';
let allSlots = [];
let refreshTimer;

const slotTypeIcons = { 'Regular': '🚗', 'EV Charging': '⚡', 'Handicapped': '♿', 'Compact': '🛵' };

async function loadSlots() {
  try {
    const res = await fetch('/api/parking');
    const data = await res.json();
    allSlots = data.slots;
    renderMap();
    updateLastUpdated();
  } catch (e) {
    showToast('Failed to load parking data', 'error');
  }
}

function renderMap() {
  const grid = document.getElementById('slots-grid');
  const typeFilter = document.getElementById('filter-type').value;
  const statusFilter = document.getElementById('filter-status').value;

  const floorSlots = allSlots.filter(s => {
    let pass = s.floor === currentFloor;
    if (typeFilter !== 'all') pass = pass && s.type === typeFilter;
    if (statusFilter !== 'all') pass = pass && s.status === statusFilter;
    return pass;
  });

  const availableCount = allSlots.filter(s => s.floor === currentFloor && s.status === 'Available').length;
  document.getElementById('floor-available').textContent = availableCount;

  grid.innerHTML = '';

  if (floorSlots.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted)">No slots match your filters</div>';
    return;
  }

  floorSlots.forEach(slot => {
    const card = document.createElement('div');
    card.className = `slot-card ${slot.status.toLowerCase()}`;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Slot ${slot.id} - ${slot.status}`);

    const tooltip = slot.status === 'Occupied' ? `Vehicle: ${slot.vehicleNumber || 'N/A'}` :
                    slot.status === 'Reserved' ? 'Reserved' :
                    'Click to book';

    card.innerHTML = `
      <div class="slot-id">${slot.id}</div>
      <div class="slot-type-badge">${slotTypeIcons[slot.type] || '🚗'} ${slot.type}</div>
      <div class="slot-status-dot"></div>
      <div class="slot-tooltip">${tooltip}</div>
    `;

    if (slot.status === 'Available') {
      const action = () => window.location.href = `booking.html?slot=${slot.id}&floor=${slot.floor}`;
      card.addEventListener('click', action);
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') action(); });
    }

    grid.appendChild(card);
  });
}

function updateLastUpdated() {
  const el = document.getElementById('last-updated');
  if (el) el.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
}

// Floor tabs
document.querySelectorAll('.floor-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.floor-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentFloor = tab.dataset.floor;
    renderMap();
  });
});

// Filters
document.getElementById('filter-type').addEventListener('change', renderMap);
document.getElementById('filter-status').addEventListener('change', renderMap);

// Auto-refresh
loadSlots();
refreshTimer = setInterval(() => {
  loadSlots();
  showToast('Map refreshed', 'info', 2000);
}, 15000);
