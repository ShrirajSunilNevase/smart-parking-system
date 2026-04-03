let activeTab = 'vehicle';
let recentSearches = JSON.parse(localStorage.getItem('parkingSearches') || '[]');

// Pre-fill from URL
const params = new URLSearchParams(window.location.search);
if (params.get('id')) {
  document.getElementById('booking-input').value = params.get('id');
  switchTab('booking');
  setTimeout(doSearch, 300);
}

function switchTab(tab) {
  activeTab = tab;
  document.querySelectorAll('.search-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
  document.getElementById('vehicle-section').style.display = tab === 'vehicle' ? 'block' : 'none';
  document.getElementById('booking-section').style.display = tab === 'booking' ? 'block' : 'none';
}

document.querySelectorAll('.search-tab').forEach(tab => {
  tab.addEventListener('click', () => switchTab(tab.dataset.tab));
});

function getQuery() {
  return activeTab === 'vehicle'
    ? document.getElementById('vehicle-input').value.trim().toUpperCase()
    : document.getElementById('booking-input').value.trim().toUpperCase();
}

async function doSearch() {
  const query = getQuery();
  if (!query) { showToast('Please enter a search term', 'warning'); return; }

  const resultCard = document.getElementById('result-card');
  const notFound = document.getElementById('not-found');
  resultCard.classList.remove('visible');
  notFound.classList.remove('visible');

  // Show skeleton
  resultCard.innerHTML = `<div class="skeleton" style="height:40px;margin-bottom:16px"></div>
    <div class="skeleton" style="height:100px;margin-bottom:16px"></div>
    <div class="skeleton" style="height:60px"></div>`;
  resultCard.classList.add('visible');

  try {
    const res = await fetch(`/api/find/${encodeURIComponent(query)}`);
    const data = await res.json();

    if (!data.success) {
      resultCard.classList.remove('visible');
      notFound.classList.add('visible');
      return;
    }

    saveSearch(query);
    renderResult(data);
  } catch (e) {
    showToast('Search failed. Try again.', 'error');
    resultCard.classList.remove('visible');
  }
}

function renderResult({ booking, slot, elapsedMinutes, chargesSoFar }) {
  const resultCard = document.getElementById('result-card');
  const floorNames = { B1: 'Basement 1', B2: 'Basement 2', L1: 'Level 1' };
  const floorName = floorNames[booking.floor] || booking.floor;
  const hrs = Math.floor(elapsedMinutes / 60);
  const mins = elapsedMinutes % 60;
  const timeStr = booking.status === 'Reserved' ? 'Not yet parked' : `${hrs}h ${mins}m`;

  resultCard.innerHTML = `
    <div class="result-floor-badge">🏢 ${floorName}</div>
    <div class="result-slot-highlight">${booking.slotId}</div>
    <div class="mini-map">
      <div style="font-size:11px;color:var(--text-muted);margin-bottom:8px">SLOT POSITION</div>
      <svg width="100%" height="80" viewBox="0 0 300 80" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="10" width="280" height="60" rx="8" fill="rgba(13,18,33,0.8)" stroke="rgba(0,212,255,0.2)" stroke-width="1"/>
        <text x="150" y="25" font-size="10" fill="rgba(107,122,158,0.8)" text-anchor="middle" font-family="Orbitron">${floorName} — Parking Level</text>
        <rect x="20" y="32" width="30" height="28" rx="4" fill="rgba(255,60,95,0.15)" stroke="rgba(255,60,95,0.3)" stroke-width="1"/>
        <rect x="58" y="32" width="30" height="28" rx="4" fill="rgba(255,60,95,0.15)" stroke="rgba(255,60,95,0.3)" stroke-width="1"/>
        <rect x="96" y="32" width="30" height="28" rx="4" fill="rgba(255,184,0,0.15)" stroke="rgba(255,184,0,0.3)" stroke-width="1"/>
        <rect x="134" y="28" width="38" height="34" rx="4" fill="rgba(0,212,255,0.2)" stroke="rgba(0,212,255,0.6)" stroke-width="2"/>
        <text x="153" y="49" font-size="9" fill="#00D4FF" text-anchor="middle" font-family="Orbitron" font-weight="700">YOUR<tspan x="153" dy="10">CAR</tspan></text>
        <rect x="180" y="32" width="30" height="28" rx="4" fill="rgba(0,255,136,0.1)" stroke="rgba(0,255,136,0.2)" stroke-width="1"/>
        <rect x="218" y="32" width="30" height="28" rx="4" fill="rgba(0,255,136,0.1)" stroke="rgba(0,255,136,0.2)" stroke-width="1"/>
        <rect x="256" y="32" width="30" height="28" rx="4" fill="rgba(0,255,136,0.1)" stroke="rgba(0,255,136,0.2)" stroke-width="1"/>
        <text x="153" y="75" font-size="8" fill="rgba(0,212,255,0.7)" text-anchor="middle">▲ ENTRANCE</text>
      </svg>
    </div>
    <div class="confirm-details">
      <div class="confirm-row"><span>👤 Name</span><span>${booking.name}</span></div>
      <div class="confirm-row"><span>🚗 Vehicle</span><span>${booking.vehicleNumber || '—'}</span></div>
      <div class="confirm-row"><span>⏱ Time Parked</span><span>${timeStr}</span></div>
      <div class="confirm-row"><span>📅 Duration Booked</span><span>${booking.duration}</span></div>
      <div class="confirm-row"><span>💳 Charges So Far</span><span style="color:var(--green)">₹${chargesSoFar}</span></div>
      <div class="confirm-row"><span>📋 Booking ID</span><span style="color:var(--cyan)">${booking.id}</span></div>
      <div class="confirm-row"><span>🏷 Status</span><span><span class="status-badge ${booking.status.toLowerCase()}">${booking.status}</span></span></div>
    </div>
    <button class="btn btn-success" style="width:100%;margin-top:8px" onclick="markFound('${booking.id}')">
      ✓ I Found My Car
    </button>
  `;
  resultCard.classList.add('visible');
}

async function markFound(bookingId) {
  try {
    const res = await fetch(`/api/bookings/${bookingId}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      showToast('🎉 Slot released! Safe drive home!', 'success', 5000);
      document.getElementById('result-card').innerHTML = `
        <div style="text-align:center;padding:40px">
          <div style="font-size:64px;margin-bottom:16px">🎊</div>
          <div style="font-family:Orbitron;font-size:18px;color:var(--green);margin-bottom:8px">Car Found!</div>
          <div style="color:var(--text-muted)">Slot ${bookingId} has been released. Drive safe!</div>
          <a href="index.html" class="btn btn-primary" style="margin-top:20px;display:inline-flex">← Back to Home</a>
        </div>`;
    }
  } catch (e) {
    showToast('Could not release slot', 'error');
  }
}

function saveSearch(query) {
  recentSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 3);
  localStorage.setItem('parkingSearches', JSON.stringify(recentSearches));
  renderRecentSearches();
}

function renderRecentSearches() {
  const container = document.getElementById('recent-chips');
  if (!container) return;
  if (recentSearches.length === 0) {
    container.parentElement.style.display = 'none';
    return;
  }
  container.parentElement.style.display = 'block';
  container.innerHTML = recentSearches.map(s =>
    `<span class="chip" onclick="useRecent('${s}')">🔍 ${s}</span>`
  ).join('');
}

function useRecent(query) {
  if (query.startsWith('PSP-')) {
    switchTab('booking');
    document.getElementById('booking-input').value = query;
  } else {
    switchTab('vehicle');
    document.getElementById('vehicle-input').value = query;
  }
  doSearch();
}

// Enter key search
['vehicle-input', 'booking-input'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
});

document.getElementById('search-vehicle-btn').addEventListener('click', doSearch);
document.getElementById('search-booking-btn').addEventListener('click', doSearch);

renderRecentSearches();
