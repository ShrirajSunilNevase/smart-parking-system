// ── Shared Utilities ────────────────────────────────────────────────────────

// Page Loader
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('page-loader');
    if (loader) loader.classList.add('hidden');
  }, 600);
});

// Toast System
function showToast(message, type = 'info', duration = 4000) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type]}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Navbar hamburger
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
}

// Mark active nav link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (href === 'index.html' && currentPage === '')) {
    a.classList.add('active');
  }
});

// Mobile nav active
document.querySelectorAll('.mobile-nav-item').forEach(item => {
  const href = item.getAttribute('href');
  if (href === currentPage || (href === 'index.html' && currentPage === '')) {
    item.classList.add('active');
  }
});

// Back to Top
const btt = document.getElementById('back-to-top');
if (btt) {
  window.addEventListener('scroll', () => {
    btt.classList.toggle('visible', window.scrollY > 300);
  });
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// API base
const API = '';

// Fetch stats
async function fetchStats() {
  try {
    const res = await fetch(`${API}/api/stats`);
    const data = await res.json();
    return data.stats;
  } catch (e) { return null; }
}

// Update stats bar
async function updateStatsBar() {
  const stats = await fetchStats();
  if (!stats) return;
  const map = { total: stats.total, available: stats.available, occupied: stats.occupied, reserved: stats.reserved };
  Object.entries(map).forEach(([key, val]) => {
    const el = document.querySelector(`[data-stat="${key}"]`);
    if (el) el.textContent = val;
  });
}

if (document.querySelector('[data-stat]')) {
  updateStatsBar();
  setInterval(updateStatsBar, 10000);
}

// Page fade-in
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  requestAnimationFrame(() => { document.body.style.opacity = '1'; });
});
