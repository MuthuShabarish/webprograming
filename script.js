/**
 * Aetheria Voyages - Core Website JavaScript
 * Beginner-friendly, readable interactions suitable for a college web programming project.
 */

// Exchange rates for currency conversion
const EXCHANGE_RATES = {
  USD: { symbol: '$', rate: 1.0 },
  EUR: { symbol: '€', rate: 0.92 },
  GBP: { symbol: '£', rate: 0.79 },
  JPY: { symbol: '¥', rate: 155.0 }
};

// Destination details for modal view
const DESTINATIONS_DATA = {
  'kyoto, japan': {
    duration: '10 Days / 9 Nights',
    region: 'East Asia',
    category: 'Cultural & Historic',
    highlights: ['Private temple visits', 'Traditional Kaiseki dinner', 'Zen meditation session', 'Ryokan stay in Arashiyama'],
    inclusions: ['Private bullet train travel', 'English-speaking guide', 'Accommodations included', 'VIP concierge']
  },
  'zermatt, switzerland': {
    duration: '8 Days / 7 Nights',
    region: 'Western Europe',
    category: 'Alpine & Mountain',
    highlights: ['Alpine skiing near Matterhorn', 'Glacier palace visit', 'Sunset fondue experience', 'Panoramic scenic train'],
    inclusions: ['Ski equipment & passes', 'Private alpine guide', 'Spa access included', 'Mountain dining']
  },
  'amalfi coast, italy': {
    duration: '9 Days / 8 Nights',
    region: 'Southern Europe',
    category: 'Coastal & Beach',
    highlights: ['Private boat cruise to Capri', 'Ravello cliffside wine tasting', 'Ceramics workshop', 'Sunset dinner in Positano'],
    inclusions: ['Private boat skipper', 'Cliffside sea-view suite', 'Private ground transfers', 'Local area guide']
  },
  'bora bora, french polynesia': {
    duration: '7 Days / 6 Nights',
    region: 'South Pacific',
    category: 'Coastal & Beach',
    highlights: ['Overwater bungalow', 'Lagoon snorkel with stingrays', 'Polynesian traditional dinner', 'Scenic helicopter flight'],
    inclusions: ['All meals included', 'Private island picnic', 'Airport boat transfer', 'Personal concierge']
  },
  'machu picchu, peru': {
    duration: '9 Days / 8 Nights',
    region: 'South America',
    category: 'Cultural & Historic',
    highlights: ['Hiram Bingham train journey', 'Sunrise at Machu Picchu citadel', 'Sacred Valley exploration', 'Colonial hotel in Cusco'],
    inclusions: ['Private archaeology guides', 'Luxury train tickets', 'All entry admissions', 'Trip coordinator']
  },
  'banff national park, canada': {
    duration: '7 Days / 6 Nights',
    region: 'North America',
    category: 'Alpine & Mountain',
    highlights: ['Sunrise canoeing on Lake Louise', 'Icefield glacier excursion', 'Wildlife tracking', 'Historic mountain resort stay'],
    inclusions: ['Private SUV transport', 'National park passes', 'Outdoor equipment', 'Experienced nature guide']
  }
};

// Initialize features when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNavigation();
  initCurrencyConverter();
  initWishlistSystem();
  initAnimatedCounters();
  initInquiryFormEnhancements();
  initNewsletterForm();
  initBackToTop();
});

/* ==========================================================================
   1. STICKY HEADER
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   2. MOBILE NAVIGATION
   ========================================================================== */
function initMobileNavigation() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navLinks = document.querySelector('.nav-links');
  const menuToggle = document.getElementById('menu-toggle');

  if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      hamburgerBtn.classList.toggle('active');
    });
  }

  // Close menu when any nav link is clicked
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        if (hamburgerBtn) hamburgerBtn.classList.remove('active');
        if (menuToggle) menuToggle.checked = false;
      });
    });
  }
}

/* ==========================================================================
   3. CURRENCY CONVERTER
   ========================================================================== */
function formatPrice(usdPrice, currency = 'USD') {
  const config = EXCHANGE_RATES[currency] || EXCHANGE_RATES.USD;
  const converted = Math.round(usdPrice * config.rate);
  return `${config.symbol}${converted.toLocaleString()}`;
}

function initCurrencyConverter() {
  const select = document.getElementById('currency-select');
  if (!select) return;

  const currentCurrency = localStorage.getItem('aetheria_currency') || 'USD';
  select.value = currentCurrency;

  function updatePrices(currency) {
    document.querySelectorAll('.dest-price').forEach(el => {
      const usd = parseFloat(el.dataset.usdPrice);
      if (!isNaN(usd)) {
        el.innerHTML = `${formatPrice(usd, currency)} <span>/ person</span>`;
      }
    });
  }

  select.addEventListener('change', (e) => {
    const newCurrency = e.target.value;
    localStorage.setItem('aetheria_currency', newCurrency);
    updatePrices(newCurrency);
    // Notify React component of currency change
    window.dispatchEvent(new CustomEvent('currencychange', { detail: { currency: newCurrency } }));
    showToast(`Currency updated to ${newCurrency}`);
  });

  updatePrices(currentCurrency);
}

/* ==========================================================================
   4. WISHLIST SYSTEM
   ========================================================================== */
function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem('aetheria_wishlist')) || [];
  } catch (e) {
    return [];
  }
}

function saveWishlist(list) {
  localStorage.setItem('aetheria_wishlist', JSON.stringify(list));
  updateWishlistBadge();
}

function updateWishlistBadge() {
  const badge = document.getElementById('wishlist-count-badge');
  if (!badge) return;

  const count = getWishlist().length;
  badge.textContent = count;
  badge.style.display = count > 0 ? 'inline-flex' : 'none';
}

function initWishlistSystem() {
  const wishlistBtn = document.getElementById('wishlist-nav-btn');
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', openWishlistModal);
  }

  // Handle static cards (e.g. on index.html)
  document.querySelectorAll('.dest-card').forEach(card => {
    const titleEl = card.querySelector('h3');
    if (!titleEl) return;
    const destName = titleEl.textContent.trim();

    const heartBtn = card.querySelector('.wishlist-toggle-btn');
    if (heartBtn) {
      if (getWishlist().includes(destName)) {
        heartBtn.classList.add('active');
      }
      heartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let list = getWishlist();
        if (list.includes(destName)) {
          list = list.filter(item => item !== destName);
          heartBtn.classList.remove('active');
          showToast(`Removed "${destName}" from saved.`, 'info');
        } else {
          list.push(destName);
          heartBtn.classList.add('active');
          showToast(`Saved "${destName}" to your wishlist!`, 'success');
        }
        saveWishlist(list);
        window.dispatchEvent(new CustomEvent('wishlistchange', { detail: { wishlist: list } }));
      });
    }
  });

  updateWishlistBadge();
}

function openWishlistModal() {
  const wishlist = getWishlist();
  let content = '';

  if (wishlist.length === 0) {
    content = `
      <div style="text-align: center; padding: 2rem 1rem;">
        <p style="font-size: 2rem; color: var(--clr-accent); margin-bottom: 0.5rem;">♥</p>
        <h4>Your Wishlist is Empty</h4>
        <p style="color: var(--clr-gray); margin-top: 0.5rem;">Click the heart icon on any destination to save your favorite trips.</p>
        <a href="destinations.html" class="btn btn-primary" style="margin-top: 1.5rem; display: inline-block;">Browse Destinations</a>
      </div>
    `;
  } else {
    content = `
      <p style="color: var(--clr-gray); margin-bottom: 1rem;">You have <strong>${wishlist.length}</strong> saved trip${wishlist.length > 1 ? 's' : ''}:</p>
      <ul class="wishlist-modal-items">
        ${wishlist.map(name => `
          <li class="wishlist-modal-row">
            <span><strong>${name}</strong></span>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <a href="contact.html?destination=${encodeURIComponent(name.toLowerCase().split(',')[0].trim())}" class="btn btn-primary" style="padding: 0.35rem 0.85rem; font-size: 0.75rem;">Inquire</a>
              <button class="wishlist-remove-item-btn" data-dest="${name}">✕</button>
            </div>
          </li>
        `).join('')}
      </ul>
      <div style="margin-top: 1.5rem; text-align: center;">
        <a href="contact.html" class="btn btn-primary" style="width: 100%;">Inquire About All Saved Trips</a>
      </div>
    `;
  }

  showModal('Your Saved Wishlist', content);

  // Bind remove buttons inside modal
  const modal = document.getElementById('aetheria-modal');
  if (modal) {
    modal.querySelectorAll('.wishlist-remove-item-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const dest = e.target.dataset.dest;
        let list = getWishlist().filter(item => item !== dest);
        saveWishlist(list);
        window.dispatchEvent(new CustomEvent('wishlistchange', { detail: { wishlist: list } }));
        openWishlistModal();
      });
    });
  }
}

/* ==========================================================================
   5. DESTINATION ITINERARY MODAL
   ========================================================================== */
function openDestinationModal(title, image, price) {
  const key = title.toLowerCase().trim();
  const info = DESTINATIONS_DATA[key] || {
    duration: 'Custom Duration',
    region: 'Curated Location',
    highlights: ['Luxury accommodations', 'Private guide services', 'Bespoke daily itineraries'],
    inclusions: ['Ground transfers', 'Breakfast included', '24/7 concierge support']
  };

  const content = `
    <div class="dest-modal-wrapper">
      <div class="dest-modal-hero" style="background-image: url('${image}');">
        <div class="dest-modal-overlay">
          <h3 style="color: var(--clr-white); font-size: 1.5rem;">${title}</h3>
          <p style="color: var(--clr-accent); font-weight: 600;">${info.duration} • ${info.region}</p>
        </div>
      </div>
      <div class="dest-modal-body">
        <div class="dest-modal-section">
          <h4>Trip Highlights</h4>
          <ul class="dest-modal-list">
            ${info.highlights.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
        <div class="dest-modal-section">
          <h4>Included in this Voyage</h4>
          <ul class="dest-modal-list">
            ${info.inclusions.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
        <div class="dest-modal-footer">
          <div style="font-size: 1.25rem; font-weight: 700; color: var(--clr-primary);">${price}</div>
          <a href="contact.html?destination=${encodeURIComponent(title.toLowerCase().split(',')[0].trim())}" class="btn btn-primary">Book This Voyage</a>
        </div>
      </div>
    </div>
  `;

  showModal(title, content);
}

function showModal(titleText, bodyHtml) {
  let modalOverlay = document.getElementById('aetheria-modal');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'aetheria-modal';
    modalOverlay.className = 'aetheria-modal-overlay';
    modalOverlay.innerHTML = `
      <div class="aetheria-modal-dialog">
        <div class="aetheria-modal-header">
          <h3 class="aetheria-modal-title" id="modal-title-text"></h3>
          <button type="button" class="aetheria-modal-close" aria-label="Close modal">&times;</button>
        </div>
        <div class="aetheria-modal-content" id="modal-body-content"></div>
      </div>
    `;
    document.body.appendChild(modalOverlay);

    modalOverlay.querySelector('.aetheria-modal-close').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.getElementById('modal-title-text').textContent = titleText;
  document.getElementById('modal-body-content').innerHTML = bodyHtml;

  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modalOverlay = document.getElementById('aetheria-modal');
  if (modalOverlay) {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   6. ANIMATED COUNTER (Using basic setInterval)
   ========================================================================== */
function initAnimatedCounters() {
  const statNumbers = document.querySelectorAll('.stat-item h3');
  if (statNumbers.length === 0) return;

  let started = false;

  function checkScroll() {
    const statsSection = document.querySelector('.stats-grid');
    if (!statsSection || started) return;

    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      started = true;
      statNumbers.forEach(stat => {
        const text = stat.textContent.trim();
        const target = parseInt(text, 10);
        const hasPlus = text.includes('+');
        const hasPercent = text.includes('%');
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 30));

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            stat.textContent = target + (hasPlus ? '+' : '') + (hasPercent ? '%' : '');
            clearInterval(timer);
          } else {
            stat.textContent = current + (hasPlus ? '+' : '') + (hasPercent ? '%' : '');
          }
        }, 30);
      });
    }
  }

  window.addEventListener('scroll', checkScroll);
  checkScroll();
}

/* ==========================================================================
   7. INQUIRY FORM (Fetch POST to process-inquiry.php)
   ========================================================================== */
function initInquiryFormEnhancements() {
  const form = document.getElementById('travel-inquiry-form');
  if (!form) return;

  // Pre-select destination if passed in URL: ?destination=kyoto
  const urlParams = new URLSearchParams(window.location.search);
  const destParam = urlParams.get('destination');
  if (destParam) {
    const select = document.getElementById('destination');
    if (select) {
      for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].value.toLowerCase().includes(destParam.toLowerCase())) {
          select.selectedIndex = i;
          break;
        }
      }
    }
  }

  // Handle asynchronous submit with validation & real DB confirmation
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : 'Submit Trip Inquiry';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending Inquiry...';
    }

    try {
      const formData = new FormData(form);
      const response = await fetch('process-inquiry.php', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        showToast(result.message, 'success');
        form.reset();
      } else {
        const errorMsg = result.message || (result.errors ? result.errors.join(' ') : 'Submission failed.');
        showToast(errorMsg, 'info');
      }
    } catch (error) {
      showToast('Could not connect to the database. Please make sure XAMPP (Apache & MySQL) is running.', 'info');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }
  });
}

/* ==========================================================================
   8. NEWSLETTER SUBSCRIPTION
   ========================================================================== */
function initNewsletterForm() {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value) {
        showToast(`Thank you! ${input.value} is now subscribed to Aetheria Voyages updates.`, 'success');
        input.value = '';
      }
    });
  });
}

/* ==========================================================================
   9. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.className = 'back-to-top-btn';
  btn.setAttribute('aria-label', 'Return to top of page');
  btn.innerHTML = '↑';
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   10. TOAST NOTIFICATION HELPER
   ========================================================================== */
function showToast(message, type = 'success') {
  let toastContainer = document.getElementById('aetheria-toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'aetheria-toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✧' : 'ℹ'}</span>
    <span class="toast-message">${message}</span>
    <button type="button" class="toast-close" aria-label="Close">&times;</button>
  `;

  toastContainer.appendChild(toast);

  // Trigger smooth entrance
  setTimeout(() => toast.classList.add('show'), 50);

  function removeToast() {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }

  toast.querySelector('.toast-close').addEventListener('click', removeToast);
  setTimeout(removeToast, 4000);
}

// Global functions for React integration
window.showToast = showToast;
window.openDestinationModal = openDestinationModal;
window.updateWishlistBadge = updateWishlistBadge;
window.formatPrice = formatPrice;
window.EXCHANGE_RATES = EXCHANGE_RATES;
