import { useState, useRef, useEffect } from 'react';
import { FaSearch, FaShoppingBag, FaBell, FaCircle, FaWallet } from 'react-icons/fa';
import { formatRupiah } from '../utils';

const dummySuggestions = [
  "Joki Tugas Pemrograman",
  "Desain Logo Premium",
  "E-Book Web Development",
  "Headphones Sony Wireless",
  "Coffee Shop Terdekat",
  "Akun Netflix Premium"
];

const dummyNotifications = [
  { id: 1, title: "Promo Spesial! 🔥", message: "Diskon 50% untuk Joki Tugas malam ini.", time: "Baru saja", unread: true },
  { id: 2, title: "Pesanan Dikirim 📦", message: "Resi JNE: 01029384756. Lacak pesanan Anda.", time: "2 jam lalu", unread: true },
  { id: 3, title: "Level Up! 🌟", message: "Selamat! Anda resmi menjadi Platinum Member.", time: "1 hari lalu", unread: false }
];

const Header = ({ onSearch, cartCount, onOpenCart, onOpenProfile, balance }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(dummyNotifications);

  const searchRef = useRef(null);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    onSearch(val);
    setShowSuggestions(val.length > 0);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="glass premium-header">
      <a href="#" className="logo" onClick={(e) => { e.preventDefault(); window.location.reload(); }}>Nex<span>Store</span></a>
      <div className="header-actions">
        
        {/* Floating E-Wallet Balance Widget */}
        <div className="nav-wallet-widget" onClick={onOpenProfile} title="Buka Detail Profil & Saldo E-Wallet">
          <FaWallet className="nav-wallet-icon" />
          <span className="nav-wallet-text">{formatRupiah(balance || 0)}</span>
        </div>

        {/* Search Bar with Auto-suggest */}
        <div className="search-container" ref={searchRef}>
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Cari produk atau jasa..." 
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => { if(searchTerm) setShowSuggestions(true) }}
          />
          {showSuggestions && (
            <div className="search-suggestions glass-dropdown">
              {dummySuggestions
                .filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((suggestion, idx) => (
                  <div key={idx} className="suggestion-item" onClick={() => handleSuggestionClick(suggestion)}>
                    <FaSearch style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }} /> {suggestion}
                  </div>
              ))}
              {dummySuggestions.filter(s => s.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                <div className="suggestion-item text-muted">Tidak ada hasil ditemukan.</div>
              )}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="action-icon-wrapper" ref={notifRef}>
          <div className="icon-btn" onClick={() => setShowNotifications(!showNotifications)} title="Notifikasi">
            <FaBell />
            {unreadCount > 0 && <span className="pulse-indicator"></span>}
          </div>
          
          {showNotifications && (
            <div className="notifications-dropdown glass-dropdown">
              <div className="notif-header">
                <h3>Notifikasi</h3>
                {unreadCount > 0 && <button className="mark-read-btn" onClick={markAllRead}>Tandai dibaca</button>}
              </div>
              <div className="notif-list">
                {notifications.map(notif => (
                  <div key={notif.id} className={`notif-item ${notif.unread ? 'unread' : ''}`}>
                    <div className="notif-icon">{notif.unread ? <FaCircle color="var(--accent)" size={10} /> : ''}</div>
                    <div className="notif-content">
                      <h4>{notif.title}</h4>
                      <p>{notif.message}</p>
                      <span className="notif-time">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Cart */}
        <div className="action-icon-wrapper">
          <div className="icon-btn" onClick={onOpenCart} title="Keranjang Belanja">
            <FaShoppingBag />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </div>
        </div>

        {/* User Custom Avatar Ring */}
        <div className="action-icon-wrapper" onClick={onOpenProfile} title="Lihat Profil Saya">
          <div className="nav-avatar-btn">
            LA
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
