import { FaTimes, FaMapMarkerAlt, FaStar, FaCheckCircle, FaRegCalendarCheck, FaChair, FaUtensils } from 'react-icons/fa';
import { useState } from 'react';
import { formatRupiah } from '../utils';

const CoffeeModal = ({ isOpen, shop, onClose }) => {
  const [isBooked, setIsBooked] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState([]);
  
  // Occupied seats simulation
  const occupiedSeats = [3, 5, 8, 10];
  const seats = Array.from({ length: 12 }, (_, i) => i + 1);

  const menuItems = [
    { id: 'm1', name: 'Signature Iced Latte', price: 28000 },
    { id: 'm2', name: 'Almond Croissant', price: 22000 },
    { id: 'm3', name: 'Matcha Green Tea Latte', price: 30000 }
  ];

  if (!isOpen || !shop) return null;

  const handleSeatClick = (seat) => {
    if (occupiedSeats.includes(seat)) return;
    setSelectedSeat(selectedSeat === seat ? null : seat);
  };

  const handleMenuToggle = (menuId) => {
    setSelectedMenu(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleBook = () => {
    if (!selectedSeat) {
      alert("Silakan pilih nomor meja/kursi terlebih dahulu sebelum melakukan reservasi!");
      return;
    }
    setIsBooked(true);
    setTimeout(() => {
      setIsBooked(false);
      onClose();
      
      const orderedNames = selectedMenu.map(id => menuItems.find(m => m.id === id).name).join(', ');
      const orderText = orderedNames ? ` dengan pesanan menu: ${orderedNames}` : '';
      
      alert(`✅ RESERVASI MEJA BERHASIL!\n\nMeja Nomor ${selectedSeat} Anda di ${shop.name} telah dikonfirmasi${orderText}.\n\nTunjukkan konfirmasi ini kepada barista saat Anda sampai.`);
      
      // Reset state
      setSelectedSeat(null);
      setSelectedMenu([]);
    }, 1500);
  };

  const preOrderTotal = selectedMenu.reduce((sum, id) => {
    const item = menuItems.find(m => m.id === id);
    return sum + (item ? item.price : 0);
  }, 0);

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} style={{ zIndex: 4000 }}>
      <div className="app-modal coffee-modal" style={{ maxWidth: '550px', padding: 0, overflow: 'hidden', background: 'rgba(11, 12, 16, 0.98)', border: '1px solid rgba(102, 252, 241, 0.2)' }}>
        
        <button className="close-btn" onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 10, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', border: 'none', color: 'white' }}>
          <FaTimes />
        </button>

        <div className="coffee-modal-header" style={{ height: '180px', backgroundImage: `url(${shop.image})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(11,12,16,1), transparent)' }}></div>
          <div style={{ position: 'absolute', bottom: '15px', left: '20px', right: '20px' }}>
            <div className="coffee-rating-badge" style={{ display: 'inline-flex', marginBottom: '8px' }}>
              <FaStar color="#FFD700" /> {shop.rating}
            </div>
            <h2 style={{ fontSize: '1.6rem', color: 'white', margin: 0, textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>{shop.name}</h2>
          </div>
        </div>
        
        <div className="modal-body" style={{ padding: '1.5rem', maxHeight: '480px', overflowY: 'auto' }}>
          
          {/* Address Box */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', color: 'var(--text-muted)', marginBottom: '1.2rem', background: 'rgba(255,255,255,0.02)', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <FaMapMarkerAlt color="#D4A373" style={{ fontSize: '1.1rem', marginTop: '2px', flexShrink: 0 }} />
            <div>
              <p style={{ margin: 0, color: 'white', fontWeight: 'bold', fontSize: '0.85rem' }}>Alamat Lokasi</p>
              <p style={{ margin: 0, fontSize: '0.8rem' }}>{shop.address}</p>
            </div>
          </div>

          {/* Interactive Seat Selection */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ color: 'white', fontSize: '0.9rem', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaChair color="#D4A373" /> Pilih Meja / Kursi Anda
            </h4>
            
            {/* Seat Map Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
              {seats.map(seatNum => {
                const isOccupied = occupiedSeats.includes(seatNum);
                const isSelected = selectedSeat === seatNum;
                
                let bgStyle = 'rgba(76, 175, 80, 0.1)';
                let borderStyle = '1px solid rgba(76, 175, 80, 0.4)';
                let colorStyle = '#4CAF50';
                
                if (isOccupied) {
                  bgStyle = 'rgba(255, 82, 82, 0.1)';
                  borderStyle = '1px solid rgba(255, 82, 82, 0.2)';
                  colorStyle = '#ff5252';
                } else if (isSelected) {
                  bgStyle = 'rgba(102, 252, 241, 0.2)';
                  borderStyle = '1px solid var(--accent)';
                  colorStyle = 'var(--accent)';
                }

                return (
                  <div 
                    key={seatNum}
                    onClick={() => handleSeatClick(seatNum)}
                    style={{ 
                      padding: '8px 0', 
                      borderRadius: '8px', 
                      background: bgStyle, 
                      border: borderStyle,
                      color: colorStyle,
                      textAlign: 'center', 
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      cursor: isOccupied ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    T{seatNum}
                  </div>
                );
              })}
            </div>
            
            {/* Seat Map Legend */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', background: '#4CAF50', borderRadius: '50%' }}></span> Tersedia</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', background: '#ff5252', borderRadius: '50%' }}></span> Terisi</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', background: 'var(--accent)', borderRadius: '50%' }}></span> Pilihan Anda</span>
            </div>
          </div>

          {/* Pre-order Menu Section */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ color: 'white', fontSize: '0.9rem', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaUtensils color="#D4A373" /> Pre-order Makanan & Minuman (Opsional)
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {menuItems.map(item => {
                const checked = selectedMenu.includes(item.id);
                return (
                  <div 
                    key={item.id} 
                    onClick={() => handleMenuToggle(item.id)}
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '10px 12px', 
                      borderRadius: '10px', 
                      background: checked ? 'rgba(212, 163, 115, 0.08)' : 'rgba(255,255,255,0.01)', 
                      border: checked ? '1px solid #D4A373' : '1px solid rgba(255,255,255,0.03)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input 
                        type="checkbox" 
                        checked={checked} 
                        onChange={() => {}} // handled by div click
                        style={{ pointerEvents: 'none' }}
                      />
                      <span style={{ fontSize: '0.85rem', color: 'white', fontWeight: checked ? 'bold' : 'normal' }}>{item.name}</span>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: '#D4A373', fontWeight: 'bold' }}>{formatRupiah(item.price)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Total & Action Buttons */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.2rem', marginTop: '1.2rem' }}>
            {preOrderTotal > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal Pre-order</span>
                <span style={{ color: '#D4A373', fontWeight: 'bold', fontSize: '1.1rem' }}>{formatRupiah(preOrderTotal)}</span>
              </div>
            )}

            <button 
              className="btn btn-primary" 
              onClick={handleBook}
              disabled={isBooked}
              style={{ 
                width: '100%', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '1rem', 
                background: 'linear-gradient(45deg, #D4A373, #A67C52)', 
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 'bold',
                boxShadow: '0 8px 20px rgba(212, 163, 115, 0.2)'
              }}
            >
              {isBooked ? <FaCheckCircle /> : <FaRegCalendarCheck />}
              {isBooked ? 'Memproses...' : selectedSeat ? `Reservasi Meja T${selectedSeat}` : 'Pilih Meja Dahulu'}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default CoffeeModal;
