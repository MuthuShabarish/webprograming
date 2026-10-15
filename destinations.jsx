/**
 * Aetheria Voyages - React Destinations Component
 * 
 * Demonstrates progressive enhancement by integrating React into a traditional
 * multi-page website for selected, highly dynamic UI components (Destinations catalog,
 * reusable DestinationCard, category filtering, live search, and interactive state).
 */
(function() {
  const { useState, useEffect, useMemo } = React;

  // Curated destinations dataset matching the original site content
  const DESTINATIONS_LIST = [
  {
    id: 'kyoto',
    name: 'Kyoto, Japan',
    shortName: 'kyoto',
    category: 'cultural',
    categoryLabel: 'Cultural',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    alt: 'Arashiyama Bamboo Grove in Kyoto, Japan',
    description: 'Experience traditional teahouses, zen stone gardens, and historic wooden shrines in the ancient capital.',
    basePriceUsd: 4850
  },
  {
    id: 'zermatt',
    name: 'Zermatt, Switzerland',
    shortName: 'zermatt',
    category: 'mountain',
    categoryLabel: 'Mountain',
    image: 'https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?auto=format&fit=crop&w=800&q=80',
    alt: 'Beautiful wooden cabin facing snowy Swiss Alps peaks',
    description: 'Nestled beneath the Matterhorn, enjoy world-class skiing, scenic train rides, and premier alpine dining.',
    basePriceUsd: 6200
  },
  {
    id: 'amalfi',
    name: 'Amalfi Coast, Italy',
    shortName: 'amalfi',
    category: 'beach',
    categoryLabel: 'Beach',
    image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=800&q=80',
    alt: 'Cliffs and colourful houses of Positano, Amalfi Coast',
    description: 'Vibrant cliffside villages overlooking shimmering blue sea. Cruise the shoreline in your private yacht.',
    basePriceUsd: 5400
  },
  {
    id: 'borabora',
    name: 'Bora Bora, French Polynesia',
    shortName: 'borabora',
    category: 'beach',
    categoryLabel: 'Beach',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    alt: 'Sandy beach and palm trees in tropical lagoon',
    description: 'Stay in luxurious overwater bungalows above coral gardens, sandbars, and turquoise waters.',
    basePriceUsd: 7800
  },
  {
    id: 'machupicchu',
    name: 'Machu Picchu, Peru',
    shortName: 'machupicchu',
    category: 'cultural',
    categoryLabel: 'Cultural',
    image: 'https://images.unsplash.com/photo-1509024644558-2f56ce76c490?auto=format&fit=crop&w=800&q=80',
    alt: 'The ruins of Machu Picchu nested between high green peaks',
    description: 'Trek the ancient Inca Trail to witness sunrise over the spectacular mountain citadel ruins.',
    basePriceUsd: 4100
  },
  {
    id: 'banff',
    name: 'Banff National Park, Canada',
    shortName: 'banff',
    category: 'mountain',
    categoryLabel: 'Mountain',
    image: 'https://images.unsplash.com/photo-1483168527879-c66136b56105?auto=format&fit=crop&w=800&q=80',
    alt: 'Lake Louise surrounded by dark green pine forests and tall mountains in Banff',
    description: 'Canoe across glacier-fed turquoise lakes, view spectacular wildlife, and hike rugged peaks.',
    basePriceUsd: 3900
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All Escapes' },
  { id: 'beach', label: 'Coastal & Beach' },
  { id: 'mountain', label: 'Alpine & Mountain' },
  { id: 'cultural', label: 'Cultural & Historic' }
];

/**
 * Reusable DestinationCard Component
 * Encapsulates card rendering, category badges, wishlist toggle, quick view, and dynamic pricing.
 */
function DestinationCard({ destination, isWishlisted, onToggleWishlist, onQuickView, formattedPrice }) {
  const { id, name, shortName, category, categoryLabel, image, alt, description, basePriceUsd } = destination;

  return (
    <div className={`dest-card cat-${category}`} id={`dest-${id}`}>
      <span className="dest-badge">{categoryLabel}</span>
      <div className="dest-img-container">
        <img src={image} alt={alt} loading="lazy" />
        <button
          type="button"
          className={`wishlist-toggle-btn ${isWishlisted ? 'active' : ''}`}
          aria-label={isWishlisted ? `Remove ${name} from saved escapes` : `Save ${name} to wishlist`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWishlist(name);
          }}
        >
          ♥
        </button>
      </div>
      <div className="dest-body">
        <h3>{name}</h3>
        <p style={{ color: 'var(--clr-gray)', marginBottom: '1rem' }}>{description}</p>
        
        <button
          type="button"
          className="btn-quick-view"
          aria-label={`View details for ${name}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onQuickView(destination, formattedPrice);
          }}
        >
          ✧ Itinerary Details
        </button>

        <div className="dest-meta">
          <div className="dest-price" data-usd-price={basePriceUsd}>
            {formattedPrice} <span>/ person</span>
          </div>
          <a
            href={`contact.html?destination=${encodeURIComponent(shortName)}`}
            className="btn btn-primary"
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.75rem' }}
            id={`inquire-${id}`}
          >
            Inquire
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * Filter & Search Bar Controls
 */
function DestinationControls({
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onClearSearch,
  totalResults
}) {
  return (
    <div className="destinations-controls-wrapper">
      {/* Live Search Bar */}
      <div className="destinations-search-bar">
        <div className="search-input-wrapper">
          <span className="search-icon" aria-hidden="true">🔍</span>
          <input
            type="text"
            id="destinations-search-input"
            placeholder="Search by destination, country, or keyword..."
            aria-label="Search destinations"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              id="search-clear-btn"
              className="search-clear-btn"
              title="Clear search"
              onClick={onClearSearch}
            >
              ✕
            </button>
          )}
        </div>
        <div className="results-count-badge" id="results-count">
          Showing {totalResults} {totalResults === 1 ? 'escape' : 'escapes'}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="filter-controls" id="filter-buttons-container" role="tablist" aria-label="Destination Categories">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`filter-btn ${isActive ? 'active' : ''}`}
              id={`lbl-filter-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Main Destinations Catalog App Component
 */
function DestinationsApp() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlist, setWishlist] = useState(() => {
    if (window.Aetheria && typeof window.Aetheria.getWishlist === 'function') {
      return window.Aetheria.getWishlist();
    }
    try {
      return JSON.parse(localStorage.getItem('aetheria_wishlist')) || [];
    } catch {
      return [];
    }
  });

  const [currency, setCurrency] = useState(() => {
    if (window.Aetheria && typeof window.Aetheria.getCurrentCurrency === 'function') {
      return window.Aetheria.getCurrentCurrency();
    }
    return localStorage.getItem('aetheria_currency') || 'USD';
  });

  // Listen to cross-component events triggered by existing vanilla script.js
  useEffect(() => {
    const handleWishlistChange = (e) => {
      if (e.detail && Array.isArray(e.detail.wishlist)) {
        setWishlist(e.detail.wishlist);
      } else if (window.Aetheria) {
        setWishlist(window.Aetheria.getWishlist());
      }
    };

    const handleCurrencyChange = (e) => {
      if (e.detail && e.detail.currency) {
        setCurrency(e.detail.currency);
      }
    };

    window.addEventListener('wishlistchange', handleWishlistChange);
    window.addEventListener('currencychange', handleCurrencyChange);

    return () => {
      window.removeEventListener('wishlistchange', handleWishlistChange);
      window.removeEventListener('currencychange', handleCurrencyChange);
    };
  }, []);

  // Format price helper
  const getFormattedPrice = (usdPrice) => {
    if (window.Aetheria && typeof window.Aetheria.formatPrice === 'function') {
      return window.Aetheria.formatPrice(usdPrice, currency);
    }
    // Fallback USD formatting
    return `$${usdPrice.toLocaleString()}`;
  };

  // Toggle wishlist item
  const handleToggleWishlist = (destName) => {
    if (window.Aetheria && typeof window.Aetheria.toggleWishlist === 'function') {
      window.Aetheria.toggleWishlist(destName);
    } else {
      const exists = wishlist.includes(destName);
      const nextList = exists ? wishlist.filter(item => item !== destName) : [...wishlist, destName];
      setWishlist(nextList);
      localStorage.setItem('aetheria_wishlist', JSON.stringify(nextList));
    }
  };

  // Open itinerary details modal
  const handleQuickView = (destination, formattedPrice) => {
    if (window.Aetheria && typeof window.Aetheria.openDestinationModal === 'function') {
      window.Aetheria.openDestinationModal(destination.name, destination.image, `${formattedPrice} / person`);
    } else {
      alert(`${destination.name}\n${destination.description}\nPrice: ${formattedPrice}`);
    }
  };

  // Filter logic
  const filteredDestinations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return DESTINATIONS_LIST.filter((dest) => {
      const matchesCategory = activeCategory === 'all' || dest.category === activeCategory;
      const matchesSearch =
        !query ||
        dest.name.toLowerCase().includes(query) ||
        dest.description.toLowerCase().includes(query) ||
        dest.categoryLabel.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="react-destinations-wrapper">
      <DestinationControls
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={() => setSearchQuery('')}
        totalResults={filteredDestinations.length}
      />

      {/* Destinations Grid */}
      {filteredDestinations.length > 0 ? (
        <div className="destinations-grid">
          {filteredDestinations.map((dest) => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              isWishlisted={wishlist.includes(dest.name)}
              onToggleWishlist={handleToggleWishlist}
              onQuickView={handleQuickView}
              formattedPrice={getFormattedPrice(dest.basePriceUsd)}
            />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--clr-white)', borderRadius: 'var(--radius-md)', marginTop: '2rem', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ fontSize: '2.5rem', color: 'var(--clr-accent)', marginBottom: '1rem' }}>✧</p>
          <h3 style={{ marginBottom: '0.5rem' }}>No Destinations Match Your Search</h3>
          <p style={{ color: 'var(--clr-gray)', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
            We could not find any luxury escapes matching &ldquo;{searchQuery}&rdquo;. Try another term or reset your filters.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
            }}
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}

// Mount the React Application into the specified container
const mountContainer = document.getElementById('react-destinations-root');
if (mountContainer) {
  const root = ReactDOM.createRoot(mountContainer);
  root.render(<DestinationsApp />);
}
})();
