/**
 * Aetheria Voyages - React Destinations Component
 * 
 * Simple, beginner-friendly functional components demonstrating:
 * - Functional components & Props
 * - useState for category filter, search query, and wishlist
 * - Array.prototype.filter() for live searching
 */

// Curated destinations dataset
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
 * DestinationCard Component
 * Displays individual trip card with image, details, price, and actions
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
          aria-label={isWishlisted ? `Remove ${name} from saved` : `Save ${name}`}
          onClick={(e) => {
            e.preventDefault();
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
          onClick={(e) => {
            e.preventDefault();
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
 * DestinationControls Component
 * Search input and category filter buttons
 */
function DestinationControls({ categories, activeCategory, onSelectCategory, searchQuery, onSearchChange, onClearSearch, totalResults }) {
  return (
    <div className="destinations-controls-wrapper">
      {/* Search Bar */}
      <div className="destinations-search-bar">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            id="destinations-search-input"
            placeholder="Search by destination or keyword..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={onClearSearch}
            >
              ✕
            </button>
          )}
        </div>
        <div className="results-count-badge">
          Showing {totalResults} {totalResults === 1 ? 'escape' : 'escapes'}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="filter-controls">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Main DestinationsApp Component
 */
function DestinationsApp() {
  const [activeCategory, setActiveCategory] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // Wishlist state initialized from localStorage
  const [wishlist, setWishlist] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem('aetheria_wishlist')) || [];
    } catch (e) {
      return [];
    }
  });

  // Currency state initialized from localStorage
  const [currency, setCurrency] = React.useState(() => {
    return localStorage.getItem('aetheria_currency') || 'USD';
  });

  // Listen for changes from header dropdown or wishlist modal
  React.useEffect(() => {
    function handleCurrencyChange(e) {
      if (e.detail && e.detail.currency) {
        setCurrency(e.detail.currency);
      }
    }
    function handleWishlistChange(e) {
      if (e.detail && Array.isArray(e.detail.wishlist)) {
        setWishlist(e.detail.wishlist);
      }
    }

    window.addEventListener('currencychange', handleCurrencyChange);
    window.addEventListener('wishlistchange', handleWishlistChange);

    return () => {
      window.removeEventListener('currencychange', handleCurrencyChange);
      window.removeEventListener('wishlistchange', handleWishlistChange);
    };
  }, []);

  // Format price helper
  function getFormattedPrice(usdPrice) {
    if (typeof window.formatPrice === 'function') {
      return window.formatPrice(usdPrice, currency);
    }
    return `$${usdPrice.toLocaleString()}`;
  }

  // Toggle wishlist item
  function handleToggleWishlist(destName) {
    let nextList;
    if (wishlist.includes(destName)) {
      nextList = wishlist.filter(item => item !== destName);
      if (typeof window.showToast === 'function') {
        window.showToast(`Removed "${destName}" from saved escapes.`, 'info');
      }
    } else {
      nextList = [...wishlist, destName];
      if (typeof window.showToast === 'function') {
        window.showToast(`Saved "${destName}" to your wishlist!`, 'success');
      }
    }

    setWishlist(nextList);
    localStorage.setItem('aetheria_wishlist', JSON.stringify(nextList));

    if (typeof window.updateWishlistBadge === 'function') {
      window.updateWishlistBadge();
    }
    window.dispatchEvent(new CustomEvent('wishlistchange', { detail: { wishlist: nextList } }));
  }

  // Open itinerary modal
  function handleQuickView(destination, formattedPrice) {
    if (typeof window.openDestinationModal === 'function') {
      window.openDestinationModal(destination.name, destination.image, `${formattedPrice} / person`);
    } else {
      alert(`${destination.name}\n${destination.description}\nPrice: ${formattedPrice}`);
    }
  }

  // Simple array filter (no useMemo needed)
  const query = searchQuery.trim().toLowerCase();
  const filteredDestinations = DESTINATIONS_LIST.filter((dest) => {
    const matchesCategory = activeCategory === 'all' || dest.category === activeCategory;
    const matchesSearch = !query ||
      dest.name.toLowerCase().includes(query) ||
      dest.description.toLowerCase().includes(query) ||
      dest.categoryLabel.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

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
        <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--clr-white)', borderRadius: 'var(--radius-md)', marginTop: '2rem' }}>
          <h3>No Destinations Found</h3>
          <p style={{ color: 'var(--clr-gray)', margin: '0.75rem 0 1.5rem' }}>
            No escapes matched &ldquo;{searchQuery}&rdquo;. Try another search or reset filters.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

// Render React into container
const rootContainer = document.getElementById('react-destinations-root');
if (rootContainer) {
  const root = ReactDOM.createRoot(rootContainer);
  root.render(<DestinationsApp />);
}
