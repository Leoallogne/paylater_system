import { FaTimes, FaMapMarkerAlt, FaStar, FaRegCalendarCheck, FaChair, FaUtensils, FaBolt, FaSun, FaClock, FaCalendarAlt, FaWallet } from 'react-icons/fa';
import { useState, useMemo } from 'react';
import { formatRupiah } from '../utils';

const CoffeeModal = ({ 
  isOpen, 
  shop, 
  onClose, 
  balance, 
  setBalance, 
  _points, 
  setPoints, 
  _orders, 
  setOrders, 
  showToast, 
  paylaterLimit, 
  _setPaylaterLimit, 
  paylaterUsed, 
  setPaylaterUsed 
}) => {
  const [isBooked, setIsBooked] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [menuQuantities, setMenuQuantities] = useState({});
  const [activeMenuTab, setActiveMenuTab] = useState('coffee');
  const [paymentMethod, setPaymentMethod] = useState('ewallet');
  
  // Date & Time Selector state
  const dates = useMemo(() => {
    const list = [];
    const options = { day: 'numeric', month: 'short' };
    for (let i = 0; i < 3; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      list.push({
        label: i === 0 ? 'Hari Ini' : i === 1 ? 'Besok' : d.toLocaleDateString('id-ID', options),
        value: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
      });
    }
    return list;
  }, []);
  
  const [selectedDate, setSelectedDate] = useState(dates[0].value);
  const [selectedTime, setSelectedTime] = useState('14:00');
  const [selectedDuration, setSelectedDuration] = useState('2 Jam');

  const timeSlots = ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
  const durations = ['1 Jam', '2 Jam', '4 Jam'];

  // Table Floor Plan Structure
  const floorPlan = {
    indoor: [
      { id: 1, name: 'T1', type: 'WFC', outlet: true, occupied: false },
      { id: 2, name: 'T2', type: 'WFC', outlet: true, occupied: true },
      { id: 3, name: 'T3', type: 'WFC', outlet: false, occupied: false },
      { id: 4, name: 'T4', type: 'WFC', outlet: true, occupied: false },
    ],
    outdoor: [
      { id: 5, name: 'T5', type: 'Garden', outlet: false, occupied: false },
      { id: 6, name: 'T6', type: 'Garden', outlet: false, occupied: true },
      { id: 7, name: 'T7', type: 'Garden', outlet: false, occupied: false },
      { id: 8, name: 'T8', type: 'Garden', outlet: false, occupied: false },
    ],
    bar: [
      { id: 9, name: 'B9', type: 'Bar Stool', outlet: true, occupied: false },
      { id: 10, name: 'B10', type: 'Bar Stool', outlet: true, occupied: true },
      { id: 11, name: 'B11', type: 'Bar Stool', outlet: true, occupied: false },
      { id: 12, name: 'B12', type: 'Bar Stool', outlet: true, occupied: false },
    ]
  };

  const menuCatalog = {
    coffee: [
      { id: 'c1', name: 'Signature Iced Latte', price: 28000, desc: 'Espresso blend Arabica dengan susu segar dan sirup aren premium.' },
      { id: 'c2', name: 'Manual Brew V60', price: 25000, desc: 'Seduhan kopi manual menggunakan single origin beans pilihan lokal.' },
      { id: 'c3', name: 'Espresso Double Shot', price: 18000, desc: 'Ekstraksi murni biji kopi Arabica Houseblend pilihan.' }
    ],
    nonCoffee: [
      { id: 'nc1', name: 'Matcha Tea Latte', price: 30000, desc: 'Bubuk Matcha murni Kyoto Jepang dipadukan susu segar lembut.' },
      { id: 'nc2', name: 'Iced Lychee Tea', price: 22000, desc: 'Teh harum rasa buah leci segar dengan topping buah leci asli.' },
      { id: 'nc3', name: 'Red Velvet Frappe', price: 28000, desc: 'Blend red velvet premium yang gurih dan creamy dengan whipped cream.' }
    ],
    pastry: [
      { id: 'p1', name: 'Almond Croissant', price: 22000, desc: 'Croissant renyah dengan isian krim almond manis bertabur almond slice.' },
      { id: 'p2', name: 'Chocolate Fudge Cake', price: 25000, desc: 'Kue cokelat panggang berlapis cokelat fudge yang pekat dan manis.' },
      { id: 'p3', name: 'Premium French Fries', price: 20000, desc: 'Kentang goreng renyah bumbu gurih disajikan dengan saus sambal.' }
    ]
  };

  if (!isOpen || !shop) return null;

  const handleSeatClick = (seat) => {
    if (seat.occupied) return;
    setSelectedSeat(selectedSeat?.id === seat.id ? null : seat);
  };

  const updateQuantity = (itemId, change) => {
    setMenuQuantities(prev => {
      const current = prev[itemId] || 0;
      const next = current + change;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return { ...prev, [itemId]: next };
    });
  };

  const bookingFee = 15000; // Standard table reservation deposit

  const preOrderTotal = Object.entries(menuQuantities).reduce((sum, [itemId, qty]) => {
    // Find item across all catalogs
    let item = null;
    for (const cat in menuCatalog) {
      const found = menuCatalog[cat].find(m => m.id === itemId);
      if (found) {
        item = found;
        break;
      }
    }
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const grandTotal = bookingFee + preOrderTotal;

  const handleBook = () => {
    if (!selectedSeat) {
      showToast("Silakan pilih meja/kursi Anda pada denah kafe terlebih dahulu!");
      return;
    }

    if (paymentMethod === 'ewallet' && balance < grandTotal) {
      showToast("Saldo E-Wallet Anda tidak mencukupi untuk pembayaran!");
      return;
    }

    if (paymentMethod === 'paylater' && (paylaterLimit - paylaterUsed) < grandTotal) {
      showToast("Limit NexPayLater Anda tidak mencukupi untuk transaksi ini!");
      return;
    }

    setIsBooked(true);

    setTimeout(() => {
      // Deduct balance or limit
      if (paymentMethod === 'ewallet') {
        setBalance(prev => prev - grandTotal);
      } else {
        setPaylaterUsed(prev => prev + grandTotal);
      }

      // Add 25 points reward to user
      setPoints(prev => prev + 25);

      // Create new order record
      const invoiceNumber = `INV/CF/${Date.now().toString().slice(-6)}`;
      const newOrder = {
        id: Date.now(),
        name: `Meja ${selectedSeat.name} (${selectedSeat.type}) - ${shop.name}`,
        price: grandTotal,
        invoice: invoiceNumber,
        date: selectedDate,
        status: 'Selesai',
        type: 'digital'
      };

      setOrders(prev => [newOrder, ...prev]);

      setIsBooked(false);
      onClose();

      // Show congratulations toast
      showToast(`🎉 Reservasi Meja ${selectedSeat.name} Berhasil! Poin +25 Pts.`);

      // Alert confirmation details
      alert(`✅ RESERVASI MEJA DIKONFIRMASI!\n\nTempat: ${shop.name}\nNomor Meja: ${selectedSeat.name} (${selectedSeat.type})\nTanggal: ${selectedDate}\nJam: ${selectedTime} (${selectedDuration})\nMetode Bayar: ${paymentMethod === 'ewallet' ? 'E-Wallet' : 'NexPayLater'}\nTotal Transaksi: ${formatRupiah(grandTotal)}\n\nSilakan tunjukkan Invoice ${invoiceNumber} di Halaman Profil kepada barista saat tiba.`);
      
      // Reset local state
      setSelectedSeat(null);
      setMenuQuantities({});
      setSelectedDate(dates[0].value);
      setSelectedTime('14:00');
    }, 1800);
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} style={{ zIndex: 4000 }}>
      <div className="app-modal coffee-modal" style={{ maxWidth: '580px', padding: 0, overflow: 'hidden', background: 'rgba(11, 12, 16, 0.98)', border: '1px solid rgba(102, 252, 241, 0.25)', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
        
        {/* Close Button */}
        <button className="close-btn" onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 10, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', border: 'none', color: 'white', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justify: 'center' }}>
          <FaTimes />
        </button>

        {/* Cafe Banner Header */}
        <div className="coffee-modal-header" style={{ height: '170px', backgroundImage: `url(${shop.image})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(11,12,16,1) 0%, rgba(11,12,16,0.2) 100%)' }}></div>
          <div style={{ position: 'absolute', bottom: '15px', left: '20px', right: '20px' }}>
            <div className="coffee-rating-badge" style={{ display: 'inline-flex', marginBottom: '8px', background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '8px', fontSize: '0.8rem', gap: '4px', alignItems: 'center' }}>
              <FaStar color="#FFD700" /> {shop.rating}
            </div>
            <h2 style={{ fontSize: '1.7rem', color: 'white', margin: 0, fontWeight: '700', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>{shop.name}</h2>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="modal-body" style={{ padding: '1.5rem', maxHeight: '490px', overflowY: 'auto' }}>
          
          {/* Address & Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.01)', padding: '0.8rem 1rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <FaMapMarkerAlt color="#D4A373" style={{ fontSize: '1.1rem', marginTop: '3px', flexShrink: 0 }} />
              <div style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
                <p style={{ margin: 0, color: 'white', fontWeight: 'bold', fontSize: '0.8rem' }}>Lokasi</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{shop.address}</p>
              </div>
            </div>
            <button 
              onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.mapsQuery || shop.name)}`, '_blank')}
              style={{ padding: '6px 12px', background: 'rgba(102, 252, 241, 0.1)', color: 'var(--accent)', border: '1px solid rgba(102, 252, 241, 0.2)', borderRadius: '30px', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease', whiteSpace: 'nowrap' }}
            >
              Buka Rute Maps
            </button>
          </div>

          {/* Date & Time Slot Slider Selector */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ color: 'white', fontSize: '0.9rem', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaCalendarAlt color="#D4A373" /> Tentukan Jadwal Kedatangan
            </h4>
            
            {/* Days Slider */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', overflowX: 'auto', paddingBottom: '3px' }}>
              {dates.map(d => (
                <button
                  key={d.value}
                  onClick={() => setSelectedDate(d.value)}
                  style={{
                    flex: '1',
                    minWidth: '90px',
                    padding: '8px 12px',
                    background: selectedDate === d.value ? 'rgba(212, 163, 115, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${selectedDate === d.value ? '#D4A373' : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: '10px',
                    color: selectedDate === d.value ? '#D4A373' : 'var(--text-muted)',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Time Slot List */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px', marginBottom: '10px' }} className="paylater-dashboard-grid-mobile">
              {timeSlots.map(time => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  style={{
                    padding: '6px 0',
                    background: selectedTime === time ? 'rgba(102, 252, 241, 0.15)' : 'rgba(255, 255, 255, 0.01)',
                    border: `1px solid ${selectedTime === time ? 'var(--accent)' : 'rgba(255,255,255,0.04)'}`,
                    borderRadius: '8px',
                    color: selectedTime === time ? 'var(--accent)' : 'white',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {time}
                </button>
              ))}
            </div>

            {/* Duration selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.2)', padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.02)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}><FaClock style={{ marginRight: '4px' }} /> Durasi Booking Meja:</span>
              <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto' }}>
                {durations.map(dur => (
                  <button
                    key={dur}
                    onClick={() => setSelectedDuration(dur)}
                    style={{
                      padding: '4px 10px',
                      background: selectedDuration === dur ? '#D4A373' : 'transparent',
                      border: 'none',
                      borderRadius: '6px',
                      color: selectedDuration === dur ? '#0B0C10' : 'white',
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    {dur}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive 2D Floor Plan map */}
          <div style={{ marginBottom: '1.8rem' }}>
            <h4 style={{ color: 'white', fontSize: '0.9rem', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaChair color="#D4A373" /> Denah Meja Interaktif 2D
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: '1rem' }}>Pilihlah salah satu meja kosong di zona favorit Anda di bawah ini:</p>

            <div style={{ background: 'rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255, 255, 255, 0.04)', borderRadius: '16px', padding: '1.2rem' }}>
              
              {/* AC / Indoor WFC area */}
              <div style={{ marginBottom: '1.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 'bold', marginBottom: '6px', borderBottom: '1px dashed rgba(102, 252, 241, 0.15)', paddingBottom: '4px' }}>
                  <span>ZONA INDOOR (AC / WFC FRIENDLY)</span>
                  <span style={{ fontSize: '0.65rem' }}>⚡ Outlet Colokan Tersedia</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  {floorPlan.indoor.map(seat => {
                    const isSelected = selectedSeat?.id === seat.id;
                    return (
                      <div
                        key={seat.id}
                        onClick={() => handleSeatClick(seat)}
                        style={{
                          background: seat.occupied ? 'rgba(255, 82, 82, 0.06)' : isSelected ? 'rgba(102, 252, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                          border: `1px solid ${seat.occupied ? 'rgba(255, 82, 82, 0.2)' : isSelected ? 'var(--accent)' : 'rgba(255,255,255,0.06)'}`,
                          borderRadius: '10px',
                          padding: '12px 0',
                          textAlign: 'center',
                          color: seat.occupied ? '#ff5252' : isSelected ? 'var(--accent)' : 'white',
                          cursor: seat.occupied ? 'not-allowed' : 'pointer',
                          position: 'relative',
                          transition: 'all 0.2s ease',
                          boxShadow: isSelected ? '0 0 10px rgba(102, 252, 241, 0.1)' : 'none'
                        }}
                      >
                        <strong style={{ display: 'block', fontSize: '0.85rem' }}>{seat.name}</strong>
                        <span style={{ fontSize: '0.55rem', opacity: 0.6 }}>{seat.occupied ? 'Terisi' : 'WFC'}</span>
                        {seat.outlet && !seat.occupied && (
                          <FaBolt size={8} style={{ position: 'absolute', top: '4px', right: '4px', color: '#ffd700' }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Outdoor garden area */}
              <div style={{ marginBottom: '1.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#81C784', fontWeight: 'bold', marginBottom: '6px', borderBottom: '1px dashed rgba(129, 199, 132, 0.15)', paddingBottom: '4px' }}>
                  <span>ZONA OUTDOOR (SMOKING AREA & LIVE MUSIC)</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><FaSun size={8} /> Outdoor Garden</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  {floorPlan.outdoor.map(seat => {
                    const isSelected = selectedSeat?.id === seat.id;
                    return (
                      <div
                        key={seat.id}
                        onClick={() => handleSeatClick(seat)}
                        style={{
                          background: seat.occupied ? 'rgba(255, 82, 82, 0.06)' : isSelected ? 'rgba(102, 252, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                          border: `1px solid ${seat.occupied ? 'rgba(255, 82, 82, 0.2)' : isSelected ? 'var(--accent)' : 'rgba(255,255,255,0.06)'}`,
                          borderRadius: '10px',
                          padding: '12px 0',
                          textAlign: 'center',
                          color: seat.occupied ? '#ff5252' : isSelected ? 'var(--accent)' : 'white',
                          cursor: seat.occupied ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: isSelected ? '0 0 10px rgba(102, 252, 241, 0.1)' : 'none'
                        }}
                      >
                        <strong style={{ display: 'block', fontSize: '0.85rem' }}>{seat.name}</strong>
                        <span style={{ fontSize: '0.55rem', opacity: 0.6 }}>{seat.occupied ? 'Terisi' : 'Santai'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bar Area */}
              <div>
                <div style={{ fontSize: '0.7rem', color: '#FFB74D', fontWeight: 'bold', marginBottom: '6px', borderBottom: '1px dashed rgba(255, 183, 77, 0.15)', paddingBottom: '4px' }}>
                  BAR AREA (COFFEE STOOLS)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  {floorPlan.bar.map(seat => {
                    const isSelected = selectedSeat?.id === seat.id;
                    return (
                      <div
                        key={seat.id}
                        onClick={() => handleSeatClick(seat)}
                        style={{
                          background: seat.occupied ? 'rgba(255, 82, 82, 0.06)' : isSelected ? 'rgba(102, 252, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                          border: `1px solid ${seat.occupied ? 'rgba(255, 82, 82, 0.2)' : isSelected ? 'var(--accent)' : 'rgba(255,255,255,0.06)'}`,
                          borderRadius: '10px',
                          padding: '12px 0',
                          textAlign: 'center',
                          color: seat.occupied ? '#ff5252' : isSelected ? 'var(--accent)' : 'white',
                          cursor: seat.occupied ? 'not-allowed' : 'pointer',
                          position: 'relative',
                          transition: 'all 0.2s ease',
                          boxShadow: isSelected ? '0 0 10px rgba(102, 252, 241, 0.1)' : 'none'
                        }}
                      >
                        <strong style={{ display: 'block', fontSize: '0.85rem' }}>{seat.name}</strong>
                        <span style={{ fontSize: '0.55rem', opacity: 0.6 }}>{seat.occupied ? 'Terisi' : 'Kursi Bar'}</span>
                        {seat.outlet && !seat.occupied && (
                          <FaBolt size={8} style={{ position: 'absolute', top: '4px', right: '4px', color: '#ffd700' }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Legend details */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '6px', height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%' }}></span> Tersedia</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '6px', height: '6px', background: '#ff5252', borderRadius: '50%' }}></span> Meja Terisi</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '6px', height: '6px', background: 'var(--accent)', borderRadius: '50%' }}></span> Pilihan Anda</span>
              </div>

            </div>
          </div>

          {/* Pre-order menu with tabs and quantities */}
          <div style={{ marginBottom: '1.8rem' }}>
            <h4 style={{ color: 'white', fontSize: '0.9rem', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaUtensils color="#D4A373" /> Pre-order Menu Kafe (Opsional)
            </h4>

            {/* Menu Category Tabs */}
            <div style={{ display: 'flex', gap: '5px', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', marginBottom: '12px' }}>
              {[
                { id: 'coffee', label: 'Coffee Menu' },
                { id: 'nonCoffee', label: 'Non-Coffee' },
                { id: 'pastry', label: 'Camilan & Roti' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveMenuTab(tab.id)}
                  style={{
                    flex: 1,
                    background: activeMenuTab === tab.id ? 'rgba(212, 163, 115, 0.12)' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    color: activeMenuTab === tab.id ? '#D4A373' : 'var(--text-muted)',
                    padding: '6px 0',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Menu List of Active Category */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {menuCatalog[activeMenuTab].map(item => {
                const qty = menuQuantities[item.id] || 0;
                return (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '12px',
                      background: qty > 0 ? 'rgba(212,163,115,0.03)' : 'rgba(255,255,255,0.01)',
                      border: `1px solid ${qty > 0 ? '#D4A373' : 'rgba(255,255,255,0.03)'}`,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ maxWidth: '65%' }}>
                      <span style={{ fontSize: '0.85rem', color: 'white', fontWeight: 'bold', display: 'block' }}>{item.name}</span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px', lineHeight: '1.2' }}>{item.desc}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                      <span style={{ fontSize: '0.85rem', color: '#D4A373', fontWeight: 'bold', marginRight: '5px' }}>{formatRupiah(item.price)}</span>
                      
                      {/* Quantity Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '2px 4px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          style={{ background: 'none', border: 'none', color: 'white', width: '22px', height: '22px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
                        >
                          -
                        </button>
                        <span style={{ fontSize: '0.8rem', color: 'white', width: '12px', textAlign: 'center', fontWeight: 'bold' }}>{qty}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          style={{ background: 'none', border: 'none', color: 'white', width: '22px', height: '22px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Checkout & Payment integration */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.2rem', marginTop: '1.5rem' }}>
            
            {/* Price Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '1.2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Biaya Booking Meja ({selectedDuration})</span>
                <span style={{ color: 'white' }}>{formatRupiah(bookingFee)}</span>
              </div>
              {preOrderTotal > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal Pre-order Makanan/Minuman</span>
                  <span style={{ color: 'white' }}>{formatRupiah(preOrderTotal)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 'bold', color: 'white', borderTop: '1px dashed rgba(255,255,255,0.05)', paddingTop: '8px', marginTop: '4px' }}>
                <span>Total Pembayaran</span>
                <span style={{ color: '#D4A373' }}>{formatRupiah(grandTotal)}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div style={{ marginBottom: '1.2rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Metode Pembayaran Reservasi:</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                
                {/* E-Wallet option */}
                <div
                  onClick={() => setPaymentMethod('ewallet')}
                  style={{
                    padding: '10px',
                    borderRadius: '12px',
                    border: `1px solid ${paymentMethod === 'ewallet' ? 'var(--accent)' : 'rgba(255,255,255,0.04)'}`,
                    background: paymentMethod === 'ewallet' ? 'rgba(102,252,241,0.05)' : 'rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FaWallet size={10} color={paymentMethod === 'ewallet' ? 'var(--accent)' : 'white'} /> E-Wallet
                  </span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Saldo: {formatRupiah(balance)}</span>
                </div>

                {/* NexPayLater option */}
                <div
                  onClick={() => setPaymentMethod('paylater')}
                  style={{
                    padding: '10px',
                    borderRadius: '12px',
                    border: `1px solid ${paymentMethod === 'paylater' ? '#FFD700' : 'rgba(255,255,255,0.04)'}`,
                    background: paymentMethod === 'paylater' ? 'rgba(255,215,0,0.05)' : 'rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FaRegCalendarCheck size={10} color={paymentMethod === 'paylater' ? '#FFD700' : 'white'} /> NexPayLater
                  </span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Limit Sisa: {formatRupiah(paylaterLimit - paylaterUsed)}</span>
                </div>

              </div>
            </div>

            {/* Validation Warnings */}
            {paymentMethod === 'ewallet' && balance < grandTotal && (
              <p style={{ color: '#ff5252', fontSize: '0.7rem', margin: '0 0 10px', textAlign: 'center', fontWeight: 'bold' }}>
                ⚠️ Saldo E-Wallet Anda tidak mencukupi untuk memesan.
              </p>
            )}
            {paymentMethod === 'paylater' && (paylaterLimit - paylaterUsed) < grandTotal && (
              <p style={{ color: '#ff5252', fontSize: '0.7rem', margin: '0 0 10px', textAlign: 'center', fontWeight: 'bold' }}>
                ⚠️ Sisa limit NexPayLater Anda kurang untuk transaksi ini.
              </p>
            )}

            {/* Confirm Book Button */}
            <button 
              className="btn btn-primary" 
              onClick={handleBook}
              disabled={isBooked || (paymentMethod === 'ewallet' && balance < grandTotal) || (paymentMethod === 'paylater' && (paylaterLimit - paylaterUsed) < grandTotal)}
              style={{ 
                width: '100%', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '1rem', 
                background: isBooked ? 'rgba(255,255,255,0.05)' : paymentMethod === 'ewallet' ? 'linear-gradient(45deg, #009688, #4CAF50)' : 'linear-gradient(45deg, #b8860b, #ffd700)', 
                border: 'none',
                borderRadius: '12px',
                fontSize: '0.95rem',
                color: paymentMethod === 'ewallet' ? 'white' : '#0B0C10',
                fontWeight: 'bold',
                boxShadow: isBooked ? 'none' : paymentMethod === 'ewallet' ? '0 8px 20px rgba(76, 175, 80, 0.2)' : '0 8px 20px rgba(255, 215, 0, 0.2)',
                cursor: (isBooked || (paymentMethod === 'ewallet' && balance < grandTotal) || (paymentMethod === 'paylater' && (paylaterLimit - paylaterUsed) < grandTotal)) ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {isBooked ? (
                <>
                  <span className="spinner-micro-paylater spin" style={{ borderColor: paymentMethod === 'ewallet' ? 'white' : '#0B0C10', borderTopColor: 'transparent' }}></span>
                  <span>Memproses Reservasi...</span>
                </>
              ) : (
                <>
                  <FaRegCalendarCheck />
                  <span>Bayar & Reservasi {selectedSeat ? `Meja ${selectedSeat.name}` : ''}</span>
                </>
              )}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default CoffeeModal;
