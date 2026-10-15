/**
 * Aetheria Voyages - Core Interactive JavaScript
 * High-end luxury travel website interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNavigation();
  initBackToTop();
  initCurrencyConverter();
  initWishlistSystem();
  initAnimatedCounters();
  initDestinationInteractions();
  initTestimonialsCarousel();
  initInquiryFormEnhancements();
  initNewsletterForm();
});

/* ==========================================================================
   1. STICKY HEADER & SCROLL BEHAVIOR
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   2. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNavigation() {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (!menuToggle || !navLinks) return;

  // Close navigation menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.checked = false;
    });
  });

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuToggle.checked) {
      menuToggle.checked = false;
    }
  });
}

/* ==========================================================================
   3. TOAST NOTIFICATION SYSTEM
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
  
  const icon = type === 'success' ? '✧' : 'ℹ';
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
    <button type="button" class="toast-close" aria-label="Close notification">&times;</button>
  `;

  toastContainer.appendChild(toast);

  // Trigger entrance animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  const closeBtn = toast.querySelector('.toast-close');
  const removeToast = () => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => {
      toast.remove();
    }, { once: true });
  };

  closeBtn.addEventListener('click', removeToast);

  // Auto remove after 4.5 seconds
  setTimeout(removeToast, 4500);
}

/* ==========================================================================
   4. CURRENCY CONVERTER SYSTEM
   ========================================================================== */
const EXCHANGE_RATES = {
  USD: { symbol: '$', rate: 1.0, label: 'USD ($)' },
  EUR: { symbol: '€', rate: 0.92, label: 'EUR (€)' },
  GBP: { symbol: '£', rate: 0.79, label: 'GBP (£)' },
  JPY: { symbol: '¥', rate: 155.0, label: 'JPY (¥)' }
};

let currentCurrency = localStorage.getItem('aetheria_currency') || 'USD';

function initCurrencyConverter() {
  const navContainer = document.querySelector('.nav-container');
  if (!navContainer) return;

  // Add Currency Dropdown to navigation if not present
  if (!document.getElementById('currency-selector-wrapper')) {
    const currencyDiv = document.createElement('div');
    currencyDiv.id = 'currency-selector-wrapper';
    currencyDiv.className = 'currency-selector-wrapper';
    currencyDiv.innerHTML = `
      <select id="currency-select" aria-label="Select Currency" class="currency-dropdown">
        <option value="USD"${currentCurrency === 'USD' ? ' selected' : ''}>USD ($)</option>
        <option value="EUR"${currentCurrency === 'EUR' ? ' selected' : ''}>EUR (€)</option>
        <option value="GBP"${currentCurrency === 'GBP' ? ' selected' : ''}>GBP (£)</option>
        <option value="JPY"${currentCurrency === 'JPY' ? ' selected' : ''}>JPY (¥)</option>
      </select>
    `;
    // Insert before the hamburger button or nav-links
    const hamburgerBtn = document.getElementById('hamburger-btn');
    if (hamburgerBtn) {
      navContainer.insertBefore(currencyDiv, hamburgerBtn);
    } else {
      navContainer.appendChild(currencyDiv);
    }

    const select = document.getElementById('currency-select');
    select.addEventListener('change', (e) => {
      currentCurrency = e.target.value;
      localStorage.setItem('aetheria_currency', currentCurrency);
      updateAllPrices();
      window.dispatchEvent(new CustomEvent('currencychange', { detail: { currency: currentCurrency } }));
      showToast(`Currency changed to ${EXCHANGE_RATES[currentCurrency].label}`);
    });
  }

  // Store base USD prices on all price elements
  document.querySelectorAll('.dest-price').forEach(el => {
    if (!el.dataset.usdPrice) {
      const text = el.textContent || '';
      const match = text.match(/\$([0-9,]+)/);
      if (match) {
        const rawNum = parseInt(match[1].replace(/,/g, ''), 10);
        el.dataset.usdPrice = rawNum;
      }
    }
  });

  updateAllPrices();
}

function updateAllPrices() {
  const { symbol, rate } = EXCHANGE_RATES[currentCurrency];
  document.querySelectorAll('.dest-price').forEach(el => {
    const usd = parseFloat(el.dataset.usdPrice);
    if (!isNaN(usd)) {
      const converted = Math.round(usd * rate);
      el.innerHTML = `${symbol}${converted.toLocaleString()} <span>/ person</span>`;
    }
  });
}

/* ==========================================================================
   5. WISHLIST / SAVED ESCAPES SYSTEM
   ========================================================================== */
function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem('aetheria_wishlist')) || [];
  } catch {
    return [];
  }
}

function saveWishlist(list) {
  localStorage.setItem('aetheria_wishlist', JSON.stringify(list));
  updateWishlistBadge();
}

function updateWishlistBadge() {
  const badge = document.getElementById('wishlist-count-badge');
  const count = getWishlist().length;
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-flex' : 'none';
  }
}

function initWishlistSystem() {
  // Inject Wishlist button in header
  const navContainer = document.querySelector('.nav-container');
  if (navContainer && !document.getElementById('wishlist-nav-btn')) {
    const wishlistBtn = document.createElement('button');
    wishlistBtn.id = 'wishlist-nav-btn';
    wishlistBtn.className = 'wishlist-nav-btn';
    wishlistBtn.setAttribute('aria-label', 'View Saved Escapes');
    wishlistBtn.innerHTML = `
      <span class="heart-icon">♥</span>
      <span class="wishlist-label">Saved</span>
      <span id="wishlist-count-badge" class="wishlist-count">0</span>
    `;
    wishlistBtn.addEventListener('click', openWishlistModal);

    const currencyDiv = document.getElementById('currency-selector-wrapper');
    if (currencyDiv) {
      currencyDiv.parentNode.insertBefore(wishlistBtn, currencyDiv);
    }
  }

  // Inject heart buttons on every destination card
  document.querySelectorAll('.dest-card').forEach(card => {
    if (card.querySelector('.wishlist-toggle-btn')) return;

    const titleEl = card.querySelector('h3');
    if (!titleEl) return;
    const destName = titleEl.textContent.trim();

    const heartBtn = document.createElement('button');
    heartBtn.type = 'button';
    heartBtn.className = 'wishlist-toggle-btn';
    heartBtn.setAttribute('aria-label', `Save ${destName} to wishlist`);
    heartBtn.innerHTML = '♥';

    const wishlist = getWishlist();
    if (wishlist.includes(destName)) {
      heartBtn.classList.add('active');
    }

    heartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      toggleWishlist(destName, heartBtn);
    });

    const imgContainer = card.querySelector('.dest-img-container');
    if (imgContainer) {
      imgContainer.appendChild(heartBtn);
    }
  });

  updateWishlistBadge();
}

function toggleWishlist(destName, buttonEl) {
  let list = getWishlist();
  if (list.includes(destName)) {
    list = list.filter(item => item !== destName);
    if (buttonEl) buttonEl.classList.remove('active');
    showToast(`Removed "${destName}" from saved escapes`, 'info');
  } else {
    list.push(destName);
    if (buttonEl) buttonEl.classList.add('active');
    showToast(`Saved "${destName}" to your wishlist!`, 'success');
  }
  saveWishlist(list);
  window.dispatchEvent(new CustomEvent('wishlistchange', { detail: { wishlist: list } }));
}

function openWishlistModal() {
  const wishlist = getWishlist();
  let content = '';

  if (wishlist.length === 0) {
    content = `
      <div style="text-align: center; padding: 2rem 1rem;">
        <p style="font-size: 2rem; margin-bottom: 1rem; color: var(--clr-accent);">✧</p>
        <p style="font-size: 1.1rem; color: var(--clr-primary);">Your saved wishlist is currently empty.</p>
        <p style="color: var(--clr-gray); font-size: 0.9rem; margin-top: 0.5rem;">Explore our destinations and click the heart icon to save your favorite journeys.</p>
        <a href="destinations.html" class="btn btn-primary" style="margin-top: 1.5rem; display: inline-block;">Browse Escapes</a>
      </div>
    `;
  } else {
    content = `
      <p style="color: var(--clr-gray); margin-bottom: 1.5rem;">You have <strong>${wishlist.length}</strong> bespoke voyage${wishlist.length > 1 ? 's' : ''} saved:</p>
      <ul class="wishlist-modal-items">
        ${wishlist.map(name => `
          <li class="wishlist-modal-row">
            <span><strong>${name}</strong></span>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <a href="contact.html?destination=${encodeURIComponent(name.toLowerCase().split(',')[0].trim())}" class="btn btn-primary" style="padding: 0.35rem 0.85rem; font-size: 0.75rem;">Inquire</a>
              <button class="wishlist-remove-item-btn" data-dest="${name}" title="Remove">✕</button>
            </div>
          </li>
        `).join('')}
      </ul>
      <div style="margin-top: 2rem; text-align: center;">
        <a href="contact.html" class="btn btn-primary" style="width: 100%;">Inquire About All Saved Journeys</a>
      </div>
    `;
  }

  showModal('Your Curated Wishlist', content);

  // Wire up remove buttons inside modal
  const modal = document.getElementById('aetheria-modal');
  if (modal) {
    modal.querySelectorAll('.wishlist-remove-item-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const dest = e.target.dataset.dest;
        let list = getWishlist().filter(item => item !== dest);
        saveWishlist(list);
        window.dispatchEvent(new CustomEvent('wishlistchange', { detail: { wishlist: list } }));
        // Refresh active hearts on cards
        document.querySelectorAll('.dest-card').forEach(card => {
          const title = card.querySelector('h3')?.textContent.trim();
          if (title === dest) {
            card.querySelector('.wishlist-toggle-btn')?.classList.remove('active');
          }
        });
        openWishlistModal(); // Re-render modal
      });
    });
  }
}

/* ==========================================================================
   6. DESTINATION INTERACTION & QUICK-VIEW MODAL
   ========================================================================== */
const DESTINATIONS_DATA = {
  'kyoto, japan': {
    duration: '10 Days / 9 Nights',
    region: 'East Asia',
    category: 'Cultural & Historic',
    highlights: ['Private after-hours temple visits', 'Michelin Kaiseki dining with master chef', 'Zen meditation with senior abbot', 'Boutique ryokan stay in Arashiyama'],
    inclusions: ['Luxury private bullet train & chauffeur', 'English-speaking personal historian guide', 'All five-star accommodations', 'Concierge & VIP reservations']
  },
  'zermatt, switzerland': {
    duration: '8 Days / 7 Nights',
    region: 'Western Europe',
    category: 'Alpine & Mountain',
    highlights: ['Private heli-skiing over Monte Rosa', 'Glacier Palace guided descent', 'Matterhorn sunset fondue in panoramic chalet', 'Gornergrat scenic railway private car'],
    inclusions: ['Ski equipment fitting & lift passes', 'Private alpine guide & luxury chalet staff', 'Heated spa & wellness access', 'Gourmet mountain dining experiences']
  },
  'amalfi coast, italy': {
    duration: '9 Days / 8 Nights',
    region: 'Southern Europe',
    category: 'Coastal & Beach',
    highlights: ['Private Riva yacht charter to Capri & Blue Grotto', 'Cliffside terrace wine tasting in Ravello', 'Private artisan ceramic workshop', 'Sunset dinner overlooking Positano bay'],
    inclusions: ['Private boat skipper & crew', 'Luxury cliffside suite with sea view', 'All ground transfers by private luxury vehicle', 'Dedicated local guide']
  },
  'bora bora, french polynesia': {
    duration: '7 Days / 6 Nights',
    region: 'South Pacific',
    category: 'Coastal & Beach',
    highlights: ['Overwater bungalow with glass bottom lounge', 'Private lagoon catamaran cruise with stingray snorkel', 'Polynesian traditional outrigger dinner', 'Helicopter flight over Mount Otemanu'],
    inclusions: ['All meals and premium beverage pairings', 'Private island picnic & spa treatment', 'VIP airport water taxi arrival', 'Personal island butler']
  },
  'machu picchu, peru': {
    duration: '9 Days / 8 Nights',
    region: 'South America',
    category: 'Cultural & Historic',
    highlights: ['Luxury Hiram Bingham train journey', 'Dawn access to Machu Picchu Citadel before crowds', 'Sacred Valley weaving & culinary experience', 'Colonial monastery boutique hotel in Cusco'],
    inclusions: ['Private archaeologists and naturalist guides', 'High-altitude luxury train travel', 'All museum and sanctuary admissions', '24/7 personal trip coordinator']
  },
  'banff national park, canada': {
    duration: '7 Days / 6 Nights',
    region: 'North America',
    category: 'Alpine & Mountain',
    highlights: ['Private sunrise canoeing on Lake Louise', 'Columbia Icefield private helicopter tour', 'Wildlife safari tracking grizzly & elk', 'Stay at historic Fairmont Chateau Lake Louise'],
    inclusions: ['Private luxury SUV with driver-guide', 'National park private access permits', 'Gourmet campfire chef experience', 'All equipment and park entrance passes']
  }
};

function initDestinationInteractions() {
  if (document.getElementById('react-destinations-root')) {
    // Handled declaratively by React DestinationCard components
    return;
  }

  const cards = document.querySelectorAll('.dest-card');
  if (cards.length === 0) return;

  // Add click to view modal on destination cards
  cards.forEach(card => {
    // Add "Quick View" button in body
    const body = card.querySelector('.dest-body');
    const titleEl = card.querySelector('h3');
    const imgEl = card.querySelector('.dest-img-container img');
    const priceEl = card.querySelector('.dest-price');

    if (body && titleEl && !card.querySelector('.btn-quick-view')) {
      const qvBtn = document.createElement('button');
      qvBtn.type = 'button';
      qvBtn.className = 'btn-quick-view';
      qvBtn.innerHTML = '✧ Itinerary Details';
      qvBtn.setAttribute('aria-label', `View details for ${titleEl.textContent}`);

      qvBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openDestinationModal(titleEl.textContent.trim(), imgEl?.src, priceEl?.innerHTML);
      });

      // Insert before or after meta
      const meta = card.querySelector('.dest-meta');
      if (meta) {
        meta.parentNode.insertBefore(qvBtn, meta);
      } else {
        body.appendChild(qvBtn);
      }
    }
  });

  // Dynamic Search & Live Filter Bar on Destinations page
  setupDestinationsFilterSuite();
}

function setupDestinationsFilterSuite() {
  if (document.getElementById('react-destinations-root')) {
    // Filter & search UI handled declaratively by React DestinationsApp
    return;
  }
  const filterSection = document.getElementById('filter-section');
  if (!filterSection) return;

  // Check if we need to insert live search bar
  const filterControls = document.getElementById('filter-buttons-container');
  if (filterControls && !document.getElementById('destinations-search-input')) {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'destinations-search-bar';
    searchContainer.innerHTML = `
      <div class="search-input-wrapper">
        <span class="search-icon">🔍</span>
        <input type="text" id="destinations-search-input" placeholder="Search by destination, country, or keyword..." aria-label="Search destinations">
        <button type="button" id="search-clear-btn" class="search-clear-btn" style="display:none;" title="Clear search">✕</button>
      </div>
      <div class="results-count-badge" id="results-count">Showing all destinations</div>
    `;

    filterControls.parentNode.insertBefore(searchContainer, filterControls);

    const searchInput = document.getElementById('destinations-search-input');
    const clearBtn = document.getElementById('search-clear-btn');
    const resultsCount = document.getElementById('results-count');

    const filterCards = () => {
      const query = searchInput.value.toLowerCase().trim();
      clearBtn.style.display = query ? 'inline-block' : 'none';

      // Check current active radio category
      const activeRadio = document.querySelector('input[name="filter"]:checked');
      const activeCategory = activeRadio ? activeRadio.id.replace('filter-', '') : 'all';

      let visibleCount = 0;
      const allCards = filterSection.querySelectorAll('.dest-card');

      allCards.forEach(card => {
        const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
        const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
        const badge = card.querySelector('.dest-badge')?.textContent.toLowerCase() || '';
        
        const matchesCategory = (activeCategory === 'all') || card.classList.contains(`cat-${activeCategory}`);
        const matchesQuery = !query || title.includes(query) || desc.includes(query) || badge.includes(query);

        if (matchesCategory && matchesQuery) {
          card.style.display = 'block';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      resultsCount.textContent = `Showing ${visibleCount} escape${visibleCount === 1 ? '' : 's'}`;
    };

    searchInput.addEventListener('input', filterCards);
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      filterCards();
      searchInput.focus();
    });

    // Also listen to radio changes to combine with search
    document.querySelectorAll('input[name="filter"]').forEach(radio => {
      radio.addEventListener('change', filterCards);
    });
  }
}

function openDestinationModal(name, imgSrc, priceHtml) {
  const key = name.toLowerCase();
  const info = DESTINATIONS_DATA[key] || {
    duration: '7–10 Days Bespoke',
    region: 'Exclusive Global Retreat',
    category: 'Luxury Curated',
    highlights: ['Private historical & cultural access', 'Top-tier luxury boutique accommodations', 'Dedicated private guide and concierge', 'Tailored gastronomic journeys'],
    inclusions: ['All internal private transfers', 'Daily artisan breakfasts & fine dining', 'Personal 24/7 travel advisor', 'Comprehensive travel concierge']
  };

  const shortName = name.split(',')[0].trim().toLowerCase();

  const modalContent = `
    <div class="dest-modal-wrapper">
      <div class="dest-modal-hero" style="background-image: url('${imgSrc || ''}')">
        <div class="dest-modal-overlay">
          <span class="dest-modal-badge">${info.category}</span>
          <h2 style="color: white; font-size: 2rem; margin-top: 0.5rem;">${name}</h2>
          <p style="color: rgba(255,255,255,0.9); font-size: 0.95rem;">${info.duration} • ${info.region}</p>
        </div>
      </div>
      
      <div class="dest-modal-body">
        <div class="dest-modal-section">
          <h4>✧ Voyage Highlights</h4>
          <ul class="dest-modal-list">
            ${info.highlights.map(h => `<li>${h}</li>`).join('')}
          </ul>
        </div>

        <div class="dest-modal-section">
          <h4>✦ Handcrafted Inclusions</h4>
          <ul class="dest-modal-list">
            ${info.inclusions.map(inc => `<li>${inc}</li>`).join('')}
          </ul>
        </div>

        <div class="dest-modal-footer">
          <div>
            <span style="font-size: 0.8rem; text-transform: uppercase; color: var(--clr-gray); letter-spacing: 1px;">Starting from</span>
            <div class="dest-price" style="font-size: 1.5rem;">${priceHtml || '$4,500 / person'}</div>
          </div>
          <a href="contact.html?destination=${encodeURIComponent(shortName)}" class="btn btn-primary" id="modal-inquire-btn">
            Inquire for this Voyage →
          </a>
        </div>
      </div>
    </div>
  `;

  showModal(name, modalContent);
}

/* ==========================================================================
   7. GENERIC ACCESSIBLE MODAL SYSTEM
   ========================================================================== */
function showModal(title, innerHtml) {
  let modal = document.getElementById('aetheria-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'aetheria-modal';
    modal.className = 'aetheria-modal-overlay';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
      <div class="aetheria-modal-dialog">
        <div class="aetheria-modal-header">
          <h3 class="aetheria-modal-title" id="modal-title-heading"></h3>
          <button type="button" class="aetheria-modal-close" aria-label="Close modal">&times;</button>
        </div>
        <div class="aetheria-modal-content" id="modal-body-container"></div>
      </div>
    `;
    document.body.appendChild(modal);

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Close on close button
    modal.querySelector('.aetheria-modal-close').addEventListener('click', closeModal);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  const titleEl = document.getElementById('modal-title-heading');
  const bodyEl = document.getElementById('modal-body-container');
  titleEl.textContent = title;
  bodyEl.innerHTML = innerHtml;

  // Open modal
  document.body.style.overflow = 'hidden';
  modal.classList.add('active');
}

function closeModal() {
  const modal = document.getElementById('aetheria-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   8. ANIMATED STAT COUNTERS (INTERSECTION OBSERVER)
   ========================================================================== */
function initAnimatedCounters() {
  const statItems = document.querySelectorAll('.stat-item h3');
  if (statItems.length === 0) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  statItems.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const originalText = el.textContent.trim();
  const match = originalText.match(/^([0-9]+)(\+?%?)$/);
  if (!match) return;

  const targetValue = parseInt(match[1], 10);
  const suffix = match[2] || '';
  const duration = 1800; // ms
  const startTime = performance.now();

  function updateNumber(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(easeProgress * targetValue);

    el.textContent = `${current}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    } else {
      el.textContent = `${targetValue}${suffix}`;
    }
  }

  requestAnimationFrame(updateNumber);
}

/* ==========================================================================
   9. TESTIMONIALS INTERACTIVE CAROUSEL / HIGHLIGHT
   ========================================================================== */
function initTestimonialsCarousel() {
  const section = document.querySelector('.testimonials-section');
  if (!section) return;

  const cards = section.querySelectorAll('.testimonial-card');
  if (cards.length <= 1) return;

  // Create carousel controls indicator
  const controlsDiv = document.createElement('div');
  controlsDiv.className = 'carousel-dots';
  
  cards.forEach((card, idx) => {
    const dot = document.createElement('button');
    dot.className = `carousel-dot${idx === 0 ? ' active' : ''}`;
    dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
    dot.addEventListener('click', () => {
      cards.forEach((c, i) => {
        c.style.transform = i === idx ? 'scale(1.03)' : 'scale(1)';
        c.style.borderColor = i === idx ? 'var(--clr-accent)' : 'rgba(255, 255, 255, 0.05)';
      });
      controlsDiv.querySelectorAll('.carousel-dot').forEach((d, i) => {
        d.classList.toggle('active', i === idx);
      });
      // Scroll into view gently on mobile
      if (window.innerWidth < 768) {
        cards[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
    controlsDiv.appendChild(dot);
  });

  const container = section.querySelector('.container');
  if (container) {
    container.appendChild(controlsDiv);
  }
}

/* ==========================================================================
   10. INQUIRY FORM PRE-FILL & ADVANCED VALIDATION
   ========================================================================== */
function initInquiryFormEnhancements() {
  const form = document.getElementById('travel-inquiry-form');
  if (!form) return;

  // Auto pre-populate destination if provided via URL param: ?destination=kyoto
  const urlParams = new URLSearchParams(window.location.search);
  const destParam = urlParams.get('destination');
  if (destParam) {
    const select = document.getElementById('destination');
    if (select) {
      const matchOpt = Array.from(select.options).find(opt => 
        opt.value.toLowerCase().includes(destParam.toLowerCase()) || 
        opt.textContent.toLowerCase().includes(destParam.toLowerCase())
      );
      if (matchOpt) {
        select.value = matchOpt.value;
        select.classList.add('highlight-selected');
        showToast(`Selected destination: ${matchOpt.text}`, 'info');
      }
    }
  }

  // Asynchronous PHP inquiry submission with backend confirmation
  form.onsubmit = async (e) => {
    e.preventDefault();

    const firstName = document.getElementById('first-name')?.value.trim();
    const destinationSelect = document.getElementById('destination');
    const destName = destinationSelect?.options[destinationSelect.selectedIndex]?.text;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit Trip Inquiry';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending Inquiry...';
    }

    try {
      const formData = new FormData(form);
      const targetUrl = form.getAttribute('action') || 'process-inquiry.php';

      const response = await fetch(targetUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        // Only show success toast when PHP confirms the database insert succeeded
        showToast(
          result.message || `Thank you, ${firstName || 'valued traveler'}! Your inquiry for ${destName || 'your dream voyage'} has been received.`,
          'success'
        );
        form.reset();
      } else {
        const errorMsg = result.message || (result.errors && result.errors.join(' ')) || 'Unable to submit inquiry. Please check required fields.';
        showToast(errorMsg, 'info');
      }
    } catch (error) {
      console.error('Inquiry submission error:', error);
      showToast('Could not connect to the server. Please ensure XAMPP (Apache and MySQL) is running.', 'info');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    }
  };
}

/* ==========================================================================
   11. NEWSLETTER SUBSCRIPTION
   ========================================================================== */
function initNewsletterForm() {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.onsubmit = (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value) {
        showToast(`Thank you! ${input.value} is now subscribed to Aetheria Voyages exclusives.`, 'success');
        input.value = '';
      }
    };
  });
}

/* ==========================================================================
   12. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  if (document.getElementById('back-to-top')) return;

  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.className = 'back-to-top-btn';
  btn.setAttribute('aria-label', 'Return to top of page');
  btn.innerHTML = '↑';

  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   GLOBAL INTEROP FOR REACT INTEGRATION
   ========================================================================== */
window.Aetheria = {
  getWishlist,
  saveWishlist,
  toggleWishlist,
  updateWishlistBadge,
  showToast,
  openDestinationModal,
  closeModal,
  EXCHANGE_RATES,
  getCurrentCurrency: () => currentCurrency,
  formatPrice: (usdPrice, currency = currentCurrency) => {
    const config = EXCHANGE_RATES[currency] || EXCHANGE_RATES.USD;
    const converted = Math.round(usdPrice * config.rate);
    return `${config.symbol}${converted.toLocaleString()}`;
  }
};
