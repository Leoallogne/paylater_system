import { useState, useMemo } from 'react';
import { FaMapMarkerAlt, FaStar, FaFilter, FaSearch, FaFire, FaRegCalendarCheck } from 'react-icons/fa';
import CoffeeModal from './CoffeeModal';

const coffeeShops = [
  {
    id: 1,
    name: "Senja Kopi Karawang",
    address: "Kawasan Galuh Mas Raya, Karawang Barat",
    rating: 4.8,
    tags: ["WFC Friendly", "Outdoor Area", "Live Music"],
    category: "WFC",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=600",
    mapsQuery: "Senja Kopi Galuh Mas Karawang"
  },
  {
    id: 2,
    name: "Lawang Cafe & Resto",
    address: "Jl. Tuparev No. 12, Karawang Wetan",
    rating: 4.6,
    tags: ["Aesthetic", "Vintage", "Family"],
    category: "Instagramable",
    image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=600",
    mapsQuery: "Lawang Cafe Karawang"
  },
  {
    id: 3,
    name: "Kopi Kenangan Grand Taruma",
    address: "Ruko Grand Taruma, Jl. Tarumanagara",
    rating: 4.9,
    tags: ["Grab & Go", "Promo", "Full AC"],
    category: "WFC",
    image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&q=80&w=600",
    mapsQuery: "Kopi Kenangan Grand Taruma Karawang"
  },
  {
    id: 4,
    name: "Limasan Coffee",
    address: "Jl. Ronggowaluyo, Telukjambe Timur",
    rating: 4.7,
    tags: ["Tradisional", "Outdoor", "Luas"],
    category: "Instagramable",
    image: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&q=80&w=600",
    mapsQuery: "Limasan Coffee Karawang"
  },
  {
    id: 5,
    name: "24/7 Coffee Space",
    address: "Kawasan Resinda, Interchange Karawang Barat",
    rating: 4.5,
    tags: ["Buka 24 Jam", "Colokan Banyak", "Wi-Fi Ngebut"],
    category: "24 Jam",
    image: "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&q=80&w=600",
    mapsQuery: "Resinda Park Mall Karawang" // Fallback query
  },
  {
    id: 6,
    name: "Ruang Seduh Karawang",
    address: "Jl. Kertabumi No. 45, Karawang Kulon",
    rating: 4.9,
    tags: ["Manual Brew", "Specialty Coffee", "Quiet"],
    category: "WFC",
    image: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&q=80&w=600",
    mapsQuery: "Ruang Seduh Karawang"
  }
];

const CoffeeView = () => {
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedShop, setSelectedShop] = useState(null);

  const filters = ['Semua', 'WFC', 'Instagramable', '24 Jam'];

  const filteredAndSortedShops = useMemo(() => {
    let result = coffeeShops.filter(shop => {
      const matchCat = activeFilter === 'Semua' || shop.category === activeFilter;
      const matchSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          shop.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'popular') {
      // Just a dummy sort logic for 'popular' based on ID for simulation
      result.sort((a, b) => a.id - b.id);
    }

    return result;
  }, [activeFilter, searchQuery, sortBy]);

  const featuredShop = coffeeShops[5]; // Ruang Seduh Karawang

  return (
    <div className="coffee-view-container" style={{ animation: 'fadeIn 0.5s ease-out', paddingBottom: '4rem' }}>
      
      {/* Premium Coffee Hero Section */}
      <div className="coffee-hero premium-card">
        <div className="coffee-badge">
          <FaMapMarkerAlt style={{ marginRight: '5px' }} /> Eksklusif di Karawang
        </div>
        <h1 className="coffee-title">Temukan <span>Coffee Shop</span> Impianmu.</h1>
        <p className="coffee-subtitle">Eksplorasi tempat nongkrong, WFC (Work From Cafe), dan specialty coffee terbaik di sudut kota Karawang. Kurasi premium khusus untuk Anda.</p>
        
        <div className="coffee-search-bar">
          <FaSearch className="search-icon" color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Cari nama kedai atau lokasi (contoh: Galuh Mas)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Featured Cafe of the Week */}
      {!searchQuery && activeFilter === 'Semua' && (
        <div className="featured-cafe-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', color: '#FF9800' }}>
            <FaFire size={20} /> <h2 style={{ fontSize: '1.5rem', color: 'white', margin: 0 }}>Featured Cafe of the Week</h2>
          </div>
          <div className="featured-cafe-card glass" onClick={() => setSelectedShop(featuredShop)}>
            <div className="featured-image" style={{ backgroundImage: `url(${featuredShop.image})` }}>
              <div className="coffee-rating-badge" style={{ transform: 'scale(1.2)', transformOrigin: 'top left' }}>
                <FaStar color="#FFD700" /> {featuredShop.rating}
              </div>
            </div>
            <div className="featured-info">
              <h3>{featuredShop.name}</h3>
              <p className="address"><FaMapMarkerAlt color="#D4A373" /> {featuredShop.address}</p>
              <div className="tags">
                {featuredShop.tags.map(tag => <span key={tag} className="coffee-tag">{tag}</span>)}
              </div>
              <p className="featured-desc">"Surganya para penikmat Manual Brew. Tempatnya tenang, kopinya juara, dan barista yang sangat edukatif. Sangat cocok untuk fokus bekerja atau deep talk."</p>
              <button className="btn btn-primary" style={{ marginTop: 'auto', alignSelf: 'flex-start', borderRadius: '30px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <FaRegCalendarCheck /> Pesan Tempat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Filters & Sorting */}
      <div className="coffee-controls-container">
        <div className="coffee-filters-wrapper">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
            <FaFilter color="#D4A373" /> <span>Saring suasana:</span>
          </div>
          <div className="coffee-filters">
            {filters.map(filter => (
              <button 
                key={filter}
                className={`coffee-filter-btn ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter === 'Semua' ? 'Semua Kedai' : filter === 'WFC' ? 'Nugas (WFC)' : filter}
              </button>
            ))}
          </div>
        </div>

        <div className="coffee-sort-wrapper">
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginRight: '10px' }}>Urutkan:</span>
          <select 
            className="coffee-sort-select" 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="popular">Terpopuler</option>
            <option value="rating">Rating Tertinggi</option>
          </select>
        </div>
      </div>

      {/* Coffee Grid */}
      <div className="coffee-grid">
        {filteredAndSortedShops.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)', borderRadius: '20px', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <FaSearch size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <p style={{ fontSize: '1.2rem' }}>Tidak ada kedai kopi yang cocok dengan pencarian Anda.</p>
          </div>
        ) : (
          filteredAndSortedShops.map(shop => (
            <div key={shop.id} className="coffee-card glass" onClick={() => setSelectedShop(shop)}>
              <div className="coffee-image-placeholder" style={{ backgroundImage: `url(${shop.image})` }}>
                <div className="coffee-rating-badge">
                  <FaStar color="#FFD700" /> {shop.rating}
                </div>
                <div className="quick-action-overlay">
                  <button className="btn-quick-action" onClick={(e) => { e.stopPropagation(); setSelectedShop(shop); }}>
                    Booking Meja
                  </button>
                </div>
              </div>
              <div className="coffee-info">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.3rem', color: '#fff' }}>{shop.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', gap: '5px', alignItems: 'flex-start' }}>
                  <FaMapMarkerAlt color="#D4A373" style={{ flexShrink: 0, marginTop: '3px' }}/> 
                  <span>{shop.address}</span>
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {shop.tags.map(tag => (
                    <span key={tag} className="coffee-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <CoffeeModal 
        isOpen={!!selectedShop} 
        shop={selectedShop} 
        onClose={() => setSelectedShop(null)} 
      />

    </div>
  );
};

export default CoffeeView;
