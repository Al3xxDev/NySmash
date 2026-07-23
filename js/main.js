/**
 * NY SMASH BURGER - MAIN JAVASCRIPT LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initLiveStoreStatus();
  initActiveNavObserver();
  initVideoPlayback();
  initInteractiveMap();
});

/**
 * Header Background & Blur transition on scroll
 */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Mobile Hamburger Navigation Drawer
 */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu) return;

  const toggleMenu = () => {
    const isOpen = navMenu.classList.toggle('open');
    toggleBtn.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  toggleBtn.addEventListener('click', toggleMenu);

  // Close menu when clicking on navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        toggleMenu();
      }
    });
  });
}

/**
 * Real-time Store Open/Closed Status Indicator & Footer Highlight
 * Orari:
 * Lunedì: Chiuso
 * Martedì - Domenica: 19:00 - 23:30
 */
function initLiveStoreStatus() {
  const statusBadge = document.getElementById('store-status-badge');
  const statusText = document.getElementById('store-status-text');
  
  if (!statusBadge || !statusText) return;

  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, 2 = Tuesday, ...
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTimeInMinutes = hours * 60 + minutes;

  const openTimeInMinutes = 19 * 60;       // 19:00 -> 1140 min
  const closeTimeInMinutes = 23 * 60 + 30; // 23:30 -> 1410 min

  let isOpen = false;

  // Monday is day 1 (Closed)
  if (day !== 1) {
    if (currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes < closeTimeInMinutes) {
      isOpen = true;
    }
  }

  if (isOpen) {
    statusBadge.classList.remove('closed');
    statusText.textContent = 'Aperto Ora';
  } else {
    statusBadge.classList.add('closed');
    if (day === 1) {
      statusText.textContent = 'Chiuso Oggi';
    } else if (currentTimeInMinutes < openTimeInMinutes) {
      statusText.textContent = 'Apre alle 19:00';
    } else {
      statusText.textContent = 'Chiuso';
    }
  }

  // Highlight today in footer hours list
  const hoursRows = document.querySelectorAll('.hours-row');
  // Day mapping index: 1 = Lun, 2 = Mar, 3 = Mer, 4 = Gio, 5 = Ven, 6 = Sab, 0 = Dom
  const dayMapping = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 0: 6 };
  const todayRowIndex = dayMapping[day];

  if (hoursRows && hoursRows[todayRowIndex]) {
    hoursRows[todayRowIndex].classList.add('today');
  }
}

/**
 * Active Navigation Item Highlighter using Intersection Observer
 */
function initActiveNavObserver() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/**
 * Ensures background videos play smoothly on mobile & low power mode
 */
function initVideoPlayback() {
  const videos = document.querySelectorAll('video[autoplay]');
  videos.forEach(video => {
    video.muted = true;
    video.play().catch(err => {
      console.log('Autoplay restriction handled:', err);
    });
  });
}

/**
 * Interactive Leaflet Dark Map anchored at Via Irno 24, Salerno
 */
function initInteractiveMap() {
  const mapElement = document.getElementById('map');
  if (!mapElement || typeof L === 'undefined') return;

  // Exact user-provided coordinates for NySmash Burger (Via Irno 24, Salerno)
  const lat = 40.683219535504925;
  const lng = 14.775719503057992;

  const map = L.map('map', {
    center: [lat, lng],
    zoom: 17,
    scrollWheelZoom: false
  });

  // Dark High-Contrast Tiles (CartoDB Dark Matter)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }).addTo(map);

  // Custom Neon Fluo Pin Marker attached to coordinates
  const fluoIcon = L.divIcon({
    className: 'custom-leaflet-neon-pin',
    html: `
      <div class="neon-map-pin" title="NySmash Burger - Via Irno 24, Salerno">
        <div class="pin-tooltip">NYSMASH • Via Irno 24</div>
        <div class="pin-marker">
          <svg viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
        <div class="pin-pulse"></div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });

  const marker = L.marker([lat, lng], { icon: fluoIcon }).addTo(map);

  marker.on('click', () => {
    window.open('https://maps.app.goo.gl/JF8Pb9fP7JtvnqQN6', '_blank');
  });
}
