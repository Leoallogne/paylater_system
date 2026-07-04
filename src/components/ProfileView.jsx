import { useState, useRef, useEffect } from 'react';
import { FaUser, FaHistory, FaHeadset, FaPaperPlane, FaBoxOpen, FaCheckCircle, FaWallet, FaChevronRight, FaGift, FaGamepad, FaCoins, FaCalendarDay, FaHeadphones, FaKeyboard, FaDownload, FaTruck, FaCoffee, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import DailyRewardModal from './DailyRewardModal';
import SpinWheelModal from './SpinWheelModal';
import OrderTrackingModal from './OrderTrackingModal';
import { formatRupiah } from '../utils';

const ProfileView = ({ balance, setBalance, points, setPoints, orders, _setOrders, showToast, paylaterLimit, setPaylaterLimit, paylaterUsed, setPaylaterUsed }) => {
  const [activeMenu, setActiveMenu] = useState('history');
  const [historyFilter, setHistoryFilter] = useState('Semua');
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isCardExpanded, setIsCardExpanded] = useState(false);

  const [isAnalyzingLimit, setIsAnalyzingLimit] = useState(false);
  const [installments, setInstallments] = useState([
    { id: 1, name: 'Sony WH-1000XM5 Headphones', tenor: '3 Bulan', current: 'Bulan ke-1', amount: 500000, status: 'Belum Lunas', date: '22 Jun 2026' },
    { id: 2, name: 'Mechanical Keyboard Keychron K2', tenor: '1 Bulan', current: 'Bulan ke-1', amount: 1000000, status: 'Belum Lunas', date: '10 Jun 2026' }
  ]);

  const getOrderIcon = (name, type) => {
    const lowerName = name.toLowerCase();
    const isDigital = type === 'digital' || lowerName.includes('e-book') || lowerName.includes('book') || lowerName.includes('license');
    
    if (isDigital) {
      return {
        icon: <FaDownload />,
        background: 'linear-gradient(135deg, #ab47bc 0%, #7b1fa2 100%)',
        shadow: '0 4px 12px rgba(171, 71, 188, 0.3)'
      };
    }
    
    if (lowerName.includes('headphones') || lowerName.includes('headset') || lowerName.includes('audio') || lowerName.includes('sony')) {
      return {
        icon: <FaHeadphones />,
        background: 'linear-gradient(135deg, #26c6da 0%, #00acc1 100%)',
        shadow: '0 4px 12px rgba(38, 198, 218, 0.3)'
      };
    }
    
    if (lowerName.includes('keyboard') || lowerName.includes('keychron') || lowerName.includes('switch')) {
      return {
        icon: <FaKeyboard />,
        background: 'linear-gradient(135deg, #ff7043 0%, #f4511e 100%)',
        shadow: '0 4px 12px rgba(255, 112, 67, 0.3)'
      };
    }
    
    if (lowerName.includes('kopi') || lowerName.includes('coffee') || lowerName.includes('cafe')) {
      return {
        icon: <FaCoffee />,
        background: 'linear-gradient(135deg, #8d6e63 0%, #5d4037 100%)',
        shadow: '0 4px 12px rgba(141, 110, 99, 0.3)'
      };
    }
    
    return {
      icon: <FaBoxOpen />,
      background: 'linear-gradient(135deg, #26a69a 0%, #00897b 100%)',
      shadow: '0 4px 12px rgba(38, 166, 154, 0.3)'
    };
  };

  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Halo, Kak Leo! Selamat datang di Pusat Bantuan NexStore. Ada yang bisa kami bantu mengenai pesanan, saldo, poin, atau layanan joki kami hari ini?' }
  ]);

  const chatEndRef = useRef(null);

  // Auto scroll chat to bottom when messages or active tab changes
  useEffect(() => {
    if (activeMenu === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeMenu]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsgText = chatMessage.trim();
    const userMsg = { id: Date.now(), sender: 'user', text: userMsgText };
    setMessages(prev => [...prev, userMsg]);
    setChatMessage('');

    // Dynamic response generation based on user keyword audit
    setTimeout(() => {
      let botText = '';
      const lower = userMsgText.toLowerCase();

      if (lower.includes('invoice') || lower.includes('resi') || lower.includes('lacak') || lower.includes('pesan')) {
        if (orders && orders.length > 0) {
          const latest = orders[0];
          botText = `Tentu, saya mendeteksi pesanan terbaru Anda:
• Produk: **${latest.name}**
• Invoice: **${latest.invoice}**
• Status: **${latest.status}**
• Total: **${formatRupiah(latest.price)}**

Anda dapat melacak riwayat lengkap pengiriman atau lisensi digitalnya secara langsung dengan mengeklik kartu pesanan di halaman Riwayat Pesanan.`;
        } else {
          botText = "Anda belum memiliki transaksi belanja di NexStore saat ini. Mulailah menambahkan produk premium dari halaman utama.";
        }
      } else if (lower.includes('saldo') || lower.includes('wallet') || lower.includes('dana') || lower.includes('top up')) {
        botText = `Saldo aktif E-Wallet Anda adalah **${formatRupiah(balance)}**. 
Untuk melakukan pengisian saldo, silakan klik tombol "Top Up 1M" pada kartu profil di sidebar sebelah kiri Anda.`;
      } else if (lower.includes('poin') || lower.includes('point') || lower.includes('nexpoints') || lower.includes('koin')) {
        botText = `Poin NexPoints terkumpul Anda: **${points} Pts**.
Anda bisa mendapatkan poin gratis dengan membuka Mystery Box setiap hari, atau menggunakannya sebanyak 100 Pts untuk memutar Spin Wheel Roulette di dasbor Anda.`;
      } else if (lower.includes('joki') || lower.includes('tugas') || lower.includes('skripsi') || lower.includes('coding')) {
        botText = `Layanan Joki Akademik & Pemrograman NexStore dikerjakan oleh para pakar berpengalaman dan memiliki garansi kelulusan bebas plagiasi.
Silakan menuju tab navigasi bawah **Joki** untuk berkonsultasi langsung dan memesan sesuai budget Anda.`;
      } else if (lower.includes('kopi') || lower.includes('cafe') || lower.includes('coffee') || lower.includes('meja')) {
        botText = `NexStore juga menyediakan direktori kafe terpopuler di kota Karawang untuk WFC atau hangout. 
Anda dapat membuka tab navigasi **Coffee** untuk menyeleksi kedai dan memesan meja secara interaktif menggunakan peta kursi.`;
      } else if (lower.includes('halo') || lower.includes('hai') || lower.includes('pagi') || lower.includes('siang') || lower.includes('sore')) {
        botText = "Halo juga Kak Leo! Ada kendala operasional yang bisa saya bantu tangani hari ini? Tuliskan saja pertanyaannya.";
      } else {
        const ticketNum = Math.floor(Math.random() * 90000 + 10000);
        botText = `Laporan Anda telah berhasil direkam dengan nomor Tiket Layanan #NX-${ticketNum}. 
Tim support kami sedang melakukan verifikasi data akun Anda. Mohon ditunggu paling lambat 5-10 menit.`;
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: botText
      }]);
    }, 1200);
  };

  const profileCardBlock = (
    <div className="glass profile-card-premium">
      <div className="profile-avatar-wrapper">
        <div className="profile-avatar-premium"><FaUser /></div>
        <div className="verified-badge"><FaCheckCircle /> Verified</div>
      </div>
      <h2 className="profile-name-premium">Leonard Allogne</h2>
      <p className="profile-email-premium">leoallogne@nexstore.co.id</p>
      <div className="member-tier">Platinum Member</div>

      <div className="ewallet-balance-premium">
        <div className="ewallet-header">
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}><FaWallet style={{ marginRight: '5px' }} /> Saldo E-Wallet</span>
          <span className="topup-btn" onClick={() => {
            setBalance(prev => prev + 1000000);
            showToast("Top Up Rp 1.000.000 Berhasil!");
          }}>Top Up 1M</span>
        </div>
        <h3>{formatRupiah(balance)}</h3>
      </div>

      {/* NexPoints Display */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(102, 252, 241, 0.05)', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid rgba(102, 252, 241, 0.15)', marginTop: '1rem' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <FaCoins color="#FFD700" /> NexPoints
        </span>
        <strong style={{ color: 'white', fontSize: '1rem' }}>{points} Pts</strong>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '1.5rem' }}>
        <button
          className="btn btn-primary"
          style={{ borderRadius: '12px', padding: '0.8rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px', background: 'linear-gradient(45deg, #4CAF50, #009688)', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' }}
          onClick={() => setShowRewardModal(true)}
        >
          <FaGift size={20} /> Mystery Box
        </button>
        <button
          className="btn btn-primary"
          style={{ borderRadius: '12px', padding: '0.8rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px', background: 'linear-gradient(45deg, #E91E63, #9C27B0)', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' }}
          onClick={() => setShowSpinWheel(true)}
        >
          <FaGamepad size={20} /> Spin Wheel
        </button>
      </div>
    </div>
  );

  const creditCardBlock = (
    <div className="credit-card-section-wrapper">
      {/* Mandiri GPN Debit Card Mockup */}
      <div className="premium-credit-card-container">
        <div className={`card-inner ${isCardFlipped ? 'flipped' : ''}`} onClick={(e) => { e.stopPropagation(); setIsCardFlipped(!isCardFlipped); }}>
          {/* Front Side */}
          <div className="card-front">
            {/* Detailed Wavy Batik SVG Overlay */}
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} viewBox="0 0 300 189" fill="none">
              <defs>
                <pattern id="card-dots" width="8" height="8" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="0.5" fill="rgba(255, 255, 255, 0.05)" />
                </pattern>
                <linearGradient id="gold-metallic" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#b8860b" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#ffd700" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ffdf7a" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#card-dots)" />
              
              {/* Premium Wavy Batik Curves */}
              <path d="M-20,180 C80,100 130,220 230,80 C290,0 340,110 400,-10" stroke="url(#gold-metallic)" strokeWidth="1.8" />
              <path d="M-20,192 C85,110 135,230 235,88 C295,5 345,118 405,0" stroke="url(#gold-metallic)" strokeWidth="0.8" strokeOpacity="0.6" />
              <path d="M-20,168 C75,90 125,210 225,72 C285,-5 335,102 395,-20" stroke="url(#gold-metallic)" strokeWidth="0.5" strokeOpacity="0.5" />
              
              <path d="M10,230 C120,130 190,260 290,110" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="3" />
              <path d="M15,242 C125,138 195,268 295,118" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
              
              {/* Micro Wavy Circles */}
              <circle cx="210" cy="130" r="40" stroke="url(#gold-metallic)" strokeWidth="0.6" strokeOpacity="0.4" />
              <circle cx="210" cy="130" r="52" stroke="url(#gold-metallic)" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="3, 3" />
              <circle cx="210" cy="130" r="64" stroke="url(#gold-metallic)" strokeWidth="1" strokeOpacity="0.15" />
            </svg>

            <div className="card-header-mandiri" style={{ zIndex: 4 }}>
              <span className="mandiri-logo-text" style={{ fontStyle: 'italic', fontWeight: 'bold' }}>mandiri</span>
              <span className="debit-platinum-badge">Debit Platinum</span>
            </div>
            
            <div className="card-chip-container" style={{ marginTop: '0.2rem', zIndex: 4 }}>
              <div className="emv-chip-mockup"></div>
              {/* Contactless waves SVG */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(255, 255, 255, 0.7)">
                <path d="M4 12c0-4.42 3.58-8 8-8s8 3.58 8 8-3.58 8-8 8-8-3.58-8-8zm2 0c0 3.31 2.69 6 6 6s6-2.69 6-6-2.69-6-6-6-6 2.69-6 6zm2 0c0 2.21 1.79 4 4 4s4-1.79 4-4-1.79-4-4-4-4 1.79-4 4z" fill="#FFD700" />
              </svg>
            </div>

            <div className="card-number-premium" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 4 }}>
              <span>6011 8821 5678 9012</span>
              <span 
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText('6011882156789012');
                  showToast("Nomor Kartu Mandiri Berhasil Disalin!");
                }}
                style={{ fontSize: '0.6rem', opacity: 0.8, cursor: 'pointer', background: 'rgba(255,255,255,0.15)', padding: '2px 5px', borderRadius: '5px', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                Salin
              </span>
            </div>

            <div className="card-holder-info" style={{ zIndex: 4 }}>
              <div>
                <div style={{ fontSize: '0.45rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '1px' }}>Card Holder</div>
                <div className="holder-name" style={{ fontSize: '0.7rem', letterSpacing: '0.8px' }}>Leonard Allogne</div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '15px' }}>
                <div className="card-expiry-info">
                  <span>Valid Thru</span>
                  <strong>12/31</strong>
                </div>
                
                {/* Detailed SVG GPN Logo */}
                <div className="gpn-logo-container" style={{ display: 'flex', alignItems: 'center', gap: '3px', background: 'white', padding: '3px 6px', borderRadius: '4px', height: '22px', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    {/* Red Eagle Wing Crest */}
                    <path d="M3 12c4-2 8-1 11 2 2-4 5-5 8-4-3 1-5 4-4 7-4-1-6-3-7-6-1 4-4 5-6 4 2-1 3-3 2-5-2.5 1-4.5 1.5-4 2z" fill="#E53935" />
                    {/* Blue Gateway Arc */}
                    <path d="M8 18c3 2 7 1 9-2" stroke="#1E88E5" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span style={{ fontSize: '0.55rem', fontWeight: '900', color: '#1E88E5', fontFamily: 'sans-serif', letterSpacing: '0.2px' }}>GPN</span>
                </div>
              </div>
            </div>
          </div>

          {/* Back Side */}
          <div className="card-back">
            <div className="magnetic-stripe"></div>
            <div className="card-back-body">
              <div className="signature-cvv-row">
                <div className="signature-strip">Leonard Allogne</div>
                <div className="cvv-box-mock">123</div>
              </div>
              <p className="card-back-info-text">
                Kartu ini diterbitkan oleh PT Bank Mandiri (Persero) Tbk. Penggunaan kartu tunduk pada syarat dan ketentuan yang berlaku. Harap segera hubungi Mandiri Call jika ditemukan.
              </p>
              <div className="mandiri-hotline">
                <span>Mandiri Call: 14000</span>
                <span style={{ fontStyle: 'italic', fontWeight: 'bold', color: '#FFD700', fontSize: '0.7rem' }}>GPN</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Limit Indicator */}
      <div className="credit-limit-wrapper" style={{ margin: '10px 0 0' }}>
        <div className="limit-labels">
          <span>Sisa Limit Kredit</span>
          <span>Limit Kredit</span>
        </div>
        <div className="limit-progress-bg">
          <div className="limit-progress-bar" style={{ width: '25%' }}></div>
        </div>
        <div className="limit-values">
          <span>Rp 37.500.000</span>
          <span>Rp 50.000.000</span>
        </div>
      </div>
    </div>
  );

  const menuBlock = (
    <div className="glass profile-menu-premium">
      <div
        className={`profile-menu-item-premium ${activeMenu === 'history' ? 'active' : ''}`}
        onClick={() => setActiveMenu('history')}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><FaHistory /> Riwayat Pesanan</div>
        <FaChevronRight className="menu-chevron" />
      </div>
      <div
        className={`profile-menu-item-premium ${activeMenu === 'chat' ? 'active' : ''}`}
        onClick={() => setActiveMenu('chat')}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><FaHeadset /> Pusat Bantuan (CS)</div>
        <FaChevronRight className="menu-chevron" />
      </div>
      <div
        className={`profile-menu-item-premium ${activeMenu === 'paylater' ? 'active' : ''}`}
        onClick={() => setActiveMenu('paylater')}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><FaCalendarDay /> NexPayLater</div>
        <FaChevronRight className="menu-chevron" />
      </div>
    </div>
  );

  const horizontalTabs = (
    <div className="horizontal-profile-tabs">
      {[
        { id: 'history', label: 'Riwayat', icon: <FaHistory /> },
        { id: 'paylater', label: 'NexPayLater', icon: <FaCalendarDay /> },
        { id: 'chat', label: 'CS Support', icon: <FaHeadset /> }
      ].map(tab => (
        <button
          key={tab.id}
          className={`tab-btn-premium ${activeMenu === tab.id ? 'active' : ''}`}
          onClick={() => setActiveMenu(tab.id)}
        >
          {tab.icon} <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="profile-container-premium" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      
      {/* 1. HORIZONTAL PROFILE HEADER (Visible ONLY on Tablet & Mobile) */}
      <div className="tablet-mobile-header-wrapper">
        <div className="glass compact-profile-card">
          <div className="compact-profile-top">
            <div className="compact-profile-avatar-wrapper">
              <div className="compact-profile-avatar"><FaUser /></div>
              <div className="verified-badge-compact"><FaCheckCircle /> Verified</div>
            </div>
            <div className="compact-profile-info">
              <h2>Leonard Allogne</h2>
              <p>leoallogne@nexstore.co.id</p>
              <div className="member-tier-compact">Platinum Member</div>
            </div>
          </div>
          
          <div className="compact-profile-stats">
            <div className="ewallet-stat-card">
              <span className="stat-label"><FaWallet /> E-Wallet</span>
              <div className="stat-balance-row">
                <h3>{formatRupiah(balance)}</h3>
                <span className="topup-btn-compact" onClick={() => {
                  setBalance(prev => prev + 1000000);
                  showToast("Top Up Rp 1.000.000 Berhasil!");
                }}>Top Up 1M</span>
              </div>
            </div>
            
            <div className="points-stat-card">
              <span className="stat-label"><FaCoins /> NexPoints</span>
              <h3>{points} Pts</h3>
            </div>
          </div>

          <div className="compact-profile-actions">
            <button className="btn-compact-action mystery-box-gradient" onClick={() => setShowRewardModal(true)}>
              <FaGift /> Mystery Box
            </button>
            <button className="btn-compact-action spin-wheel-gradient" onClick={() => setShowSpinWheel(true)}>
              <FaGamepad /> Spin Wheel
            </button>
          </div>
        </div>

        {/* Accordion creditCardBlock for Mobile Only */}
        <div className="mobile-only accordion-credit-card">
          <div className="accordion-header" onClick={() => setIsCardExpanded(!isCardExpanded)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaWallet color="var(--accent)" />
              <span>Kartu Debit & Limit Kredit</span>
            </div>
            {isCardExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {isCardExpanded && (
            <div className="accordion-content">
              {creditCardBlock}
            </div>
          )}
        </div>

        {/* Horizontal Navigation Tabs */}
        {horizontalTabs}
      </div>

      {/* 2. DESKTOP SIDEBAR LAYOUT (Visible ONLY on Desktop) */}
      <div className="desktop-sidebar-wrapper">
        <div className="profile-sidebar-premium">
          {profileCardBlock}
          {creditCardBlock}
          {menuBlock}
        </div>
      </div>

      {/* 3. RESPONSIVE CONTENT AREA */}
      <div className="profile-main-layout-wrapper">
        <div className="profile-content-premium">
          {activeMenu === 'history' && (
            <div className="glass order-history-card-premium">
              <div className="history-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
                <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: 0 }}>Riwayat Pesanan <span>Terbaru</span></h2>
                <div className="history-filter-pills" style={{ display: 'flex', gap: '8px', width: '100%', overflowX: 'auto', paddingBottom: '5px' }}>
                  {['Semua', 'Sedang Dikemas', 'Sedang Dikirim', 'Selesai'].map(pill => (
                    <button
                      key={pill}
                      className={`filter-pill ${historyFilter === pill ? 'active' : ''}`}
                      onClick={() => setHistoryFilter(pill)}
                      style={{
                        background: historyFilter === pill ? 'rgba(102, 252, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                        border: `1px solid ${historyFilter === pill ? 'var(--accent)' : 'rgba(255,255,255,0.08)'}`,
                        color: historyFilter === pill ? 'var(--accent)' : 'var(--text-muted)',
                        padding: '0.4rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        whiteSpace: 'nowrap',
                        boxShadow: historyFilter === pill ? '0 0 10px rgba(102, 252, 241, 0.15)' : 'none'
                      }}
                    >
                      {pill}
                    </button>
                  ))}
                </div>
              </div>

              <div className="order-items-list">
                {orders.filter(order => {
                  if (historyFilter === 'Semua') return true;
                  return order.status.toLowerCase().includes(historyFilter.toLowerCase());
                }).length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    <FaBoxOpen size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                    <p>Tidak ada riwayat pesanan dengan status "{historyFilter}".</p>
                  </div>
                ) : (
                  orders
                    .filter(order => {
                      if (historyFilter === 'Semua') return true;
                      return order.status.toLowerCase().includes(historyFilter.toLowerCase());
                    })
                    .map(order => {
                      const cardStyle = getOrderIcon(order.name, order.type);
                      return (
                        <div
                          key={order.id}
                          className="order-item-premium"
                          onClick={() => setSelectedOrder(order)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="order-item-icon" style={{ background: cardStyle.background, color: 'white', boxShadow: cardStyle.shadow }}>
                            {cardStyle.icon}
                          </div>
                          <div className="order-info-premium">
                            <h4 style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '280px', color: 'white', fontWeight: '600' }}>{order.name}</h4>
                            <span className="order-meta">{order.invoice} • {order.date}</span>
                            <span className="order-price" style={{ color: 'var(--accent)', fontFamily: 'monospace' }}>{formatRupiah(order.price)}</span>
                          </div>
                          <div className="order-status-container">
                            <span className={`order-status ${
                              order.status === 'Selesai' ? 'status-success' : 
                              order.status.includes('Kemas') ? 'status-processing' : 'status-shipping'
                            }`} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <span style={{ 
                                display: 'inline-block', 
                                width: '6px', 
                                height: '6px', 
                                borderRadius: '50%', 
                                background: 'currentColor',
                                animation: order.status !== 'Selesai' ? 'pulse-cs 1.5s infinite' : 'none'
                              }}></span>
                              {order.status}
                            </span>
                            {order.status === 'Selesai' ? (
                              <button className="btn-buy-again" onClick={(e) => { e.stopPropagation(); alert("Ditambahkan kembali ke keranjang! (Simulasi)"); }} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <FaHistory size={12} /> Beli Lagi
                              </button>
                            ) : (
                              <button className="btn-track" onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <FaTruck size={12} /> Lacak
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          )}

          {activeMenu === 'chat' && (
            <div className="glass live-chat-box-premium">
              <div className="chat-header">
                <div>
                  <h2 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>NexStore <span>Care</span></h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#4CAF50' }}></span>
                    Online • Respon Cepat AI
                  </p>
                </div>
                <FaHeadset size={24} style={{ color: 'var(--accent)', opacity: 0.8 }} />
              </div>

              <div className="chat-messages-premium">
                {messages.map(msg => (
                  <div key={msg.id} className={`chat-bubble-wrapper ${msg.sender === 'user' ? 'wrapper-user' : 'wrapper-bot'}`}>
                    {msg.sender === 'bot' && (
                      <div className="chat-avatar-cs">
                        <FaHeadset size={14} />
                      </div>
                    )}
                    <div 
                      className={`chat-bubble-premium ${msg.sender === 'user' ? 'chat-user-premium' : 'chat-bot-premium'}`}
                      dangerouslySetInnerHTML={{ 
                        __html: msg.text
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\n/g, '<br />')
                      }}
                    />
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="chat-input-area-premium">
                <input 
                  type="text" 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Ketik pertanyaan Kak Leo di sini (contoh: saldo, invoice, joki)..." 
                  className="chat-input-premium"
                />
                <button type="submit" className="chat-send-btn-premium" disabled={!chatMessage.trim()}>
                  <FaPaperPlane size={16} />
                </button>
              </form>
            </div>
          )}

          {activeMenu === 'paylater' && (
            <div className="glass order-history-card-premium" style={{ animation: 'fadeIn 0.5s ease-out', maxWidth: '100%' }}>
              <div className="history-header" style={{ marginBottom: '1.5rem' }}>
                <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: 0 }}>Dasbor <span>NexPayLater</span></h2>
                <span style={{ 
                  fontSize: '0.8rem', 
                  background: paylaterLimit >= 15000000 ? 'linear-gradient(45deg, #9C27B0, #E91E63)' : 'rgba(255, 215, 0, 0.1)', 
                  color: paylaterLimit >= 15000000 ? 'white' : '#FFD700', 
                  padding: '4px 12px', 
                  borderRadius: '12px', 
                  border: paylaterLimit >= 15000000 ? 'none' : '1px solid rgba(255,215,0,0.3)', 
                  fontWeight: 'bold',
                  boxShadow: paylaterLimit >= 15000000 ? '0 3px 8px rgba(156, 39, 176, 0.3)' : 'none'
                }}>
                  {paylaterLimit >= 15000000 ? '⭐ Platinum Elite Tier' : 'Gold Tier'}
                </span>
              </div>

              {/* PayLater Limit Card */}
              <div style={{ background: 'linear-gradient(135deg, #18191e 0%, #06070a 100%)', border: '1px solid rgba(212,163,115,0.2)', borderRadius: '20px', padding: '1.8rem', marginBottom: '2rem', position: 'relative', overflow: 'hidden', boxShadow: '0 12px 30px rgba(0,0,0,0.5)' }}>
                <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'rgba(255, 215, 0, 0.03)', borderRadius: '50%', filter: 'blur(30px)' }}></div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '500' }}>Sisa Limit Tersedia</span>
                  <span style={{ color: '#FFD700', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bunga 0% Aktif</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px', marginBottom: '1.2rem' }}>
                  <h1 style={{ fontSize: '2.5rem', color: 'white', fontWeight: '900', margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.5)', fontFamily: 'monospace' }}>
                    {formatRupiah(paylaterLimit - paylaterUsed)}
                  </h1>
                  
                  {/* Request Limit Upgrade Button */}
                  <button
                    disabled={isAnalyzingLimit || paylaterLimit >= 15000000}
                    onClick={() => {
                      setIsAnalyzingLimit(true);
                      setTimeout(() => {
                        setIsAnalyzingLimit(false);
                        setPaylaterLimit(15000000);
                        showToast("🎉 Selamat! Pengajuan disetujui. Limit NexPayLater Anda naik menjadi Rp 15.000.000!");
                      }, 2500);
                    }}
                    style={{
                      background: paylaterLimit >= 15000000 ? 'rgba(255,255,255,0.05)' : 'linear-gradient(45deg, #b8860b, #ffd700)',
                      border: 'none',
                      color: paylaterLimit >= 15000000 ? 'rgba(255,255,255,0.3)' : '#0B0C10',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      padding: '8px 16px',
                      borderRadius: '30px',
                      cursor: paylaterLimit >= 15000000 ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      boxShadow: paylaterLimit >= 15000000 ? 'none' : '0 4px 15px rgba(255,215,0,0.2)'
                    }}
                    className="btn-raise-limit-hover"
                  >
                    {isAnalyzingLimit ? (
                      <>
                        <span className="spinner-micro-paylater spin"></span>
                        <span>Menganalisis...</span>
                      </>
                    ) : paylaterLimit >= 15000000 ? (
                      'Limit Maksimal'
                    ) : (
                      '⚡ Ajukan Naik Limit'
                    )}
                  </button>
                </div>

                <div className="ewallet-header" style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Total Tagihan Bulan Ini</span>
                  <span style={{ color: 'white', fontSize: '0.9rem', fontWeight: 'bold', fontFamily: 'monospace' }}>{formatRupiah(paylaterUsed)}</span>
                </div>

                <div className="limit-progress-bg" style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', margin: '15px 0 20px' }}>
                  <div className="limit-progress-bar" style={{ width: `${(paylaterUsed / paylaterLimit) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #ff7043, #ff5252)', borderRadius: '4px' }}></div>
                </div>

                {paylaterUsed > 0 ? (
                  <button 
                    onClick={() => {
                      if (balance < paylaterUsed) {
                        showToast("Saldo E-Wallet Anda tidak mencukupi untuk melunasi tagihan!");
                      } else {
                        setBalance(prev => prev - paylaterUsed);
                        setPaylaterUsed(0);
                        // Auto-clear active installments in UI too
                        setInstallments(prev => prev.map(item => ({ ...item, status: 'Lunas' })));
                        showToast("Tagihan NexPayLater Anda Berhasil Dilunasi!");
                      }
                    }}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(45deg, #009688, #4CAF50)',
                      color: 'white',
                      border: 'none',
                      padding: '1rem',
                      borderRadius: '12px',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(76,175,80,0.2)'
                    }}
                  >
                    Bayar Tagihan Sekarang
                  </button>
                ) : (
                  <div style={{ background: 'rgba(76,175,80,0.05)', border: '1px solid rgba(76,175,80,0.15)', borderRadius: '12px', padding: '1rem', textAlign: 'center', color: '#4CAF50' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem' }}>Tagihan Sudah Dilunasi</h4>
                    <p style={{ margin: '5px 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Terima kasih atas kedisiplinan Anda membayar tepat waktu.</p>
                  </div>
                )}
              </div>

              {/* Billing Info Autodebit & Late Penalty */}
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.3rem', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '2rem' }}>
                <h4 style={{ margin: 0, color: 'white', fontSize: '0.95rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>Informasi Penagihan</h4>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Status Autodebit</span>
                  <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>Aktif (Mandiri Debit)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Jatuh Tempo</span>
                  <span style={{ color: 'white' }}>Setiap Tanggal 25</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Tanggal Cetak</span>
                  <span style={{ color: 'white' }}>Setiap Tanggal 10</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Denda Keterlambatan</span>
                  <span style={{ color: '#ff5252' }}>1.5% / hari (Saat ini 0%)</span>
                </div>
              </div>

              {/* Installments Table */}
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' }}>
                <h4 style={{ margin: '0 0 1.2rem', color: 'white', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaBoxOpen color="var(--accent)" /> Daftar Cicilan Aktif
                </h4>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '450px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        <th style={{ padding: '8px 5px' }}>TRANSAKSI</th>
                        <th style={{ padding: '8px 5px' }}>TANGGAL</th>
                        <th style={{ padding: '8px 5px' }}>TENOR</th>
                        <th style={{ padding: '8px 5px', textAlign: 'right' }}>CICILAN/BLN</th>
                        <th style={{ padding: '8px 5px', textAlign: 'right' }}>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {installments.map(inst => (
                        <tr key={inst.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.8rem', color: 'white' }}>
                          <td style={{ padding: '12px 5px', fontWeight: '600' }}>{inst.name}</td>
                          <td style={{ padding: '12px 5px', color: 'var(--text-muted)' }}>{inst.date}</td>
                          <td style={{ padding: '12px 5px' }}>
                            <span style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '5px', fontSize: '0.7rem' }}>
                              {inst.current} / {inst.tenor}
                            </span>
                          </td>
                          <td style={{ padding: '12px 5px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 'bold', color: 'var(--accent)' }}>
                            {formatRupiah(inst.amount)}
                          </td>
                          <td style={{ padding: '12px 5px', textAlign: 'right' }}>
                            <span style={{ 
                              fontSize: '0.7rem', 
                              fontWeight: 'bold', 
                              padding: '2px 8px', 
                              borderRadius: '10px', 
                              background: inst.status === 'Lunas' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 82, 82, 0.1)', 
                              color: inst.status === 'Lunas' ? '#4CAF50' : '#ff5252' 
                            }}>
                              {inst.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Credit Score Gauge & Benefit */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }} className="paylater-dashboard-grid-mobile">
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.3rem' }}>
                  <h4 style={{ margin: '0 0 12px', color: 'white', fontSize: '0.95rem' }}>Keuntungan Tingkat Premium</h4>
                  <ul style={{ paddingLeft: '15px', margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <li>Bunga 0% untuk seluruh tenor pembayaran bulan depan.</li>
                    <li>Metode enkripsi biometrik aman terverifikasi standard OJK.</li>
                    <li>Mendapatkan cashback reward gratis dalam bentuk NexPoints.</li>
                    <li>Akses autodebit langsung dari rekening tabungan Bank Mandiri.</li>
                  </ul>
                </div>
                
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Metrik Skor Kredit</div>
                  
                  {/* Gauge Chart SVG */}
                  <svg width="120" height="70" viewBox="0 0 100 55" style={{ marginBottom: '8px' }}>
                    <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" strokeLinecap="round" />
                    <path d="M 10 50 A 40 40 0 0 1 82 25" fill="none" stroke="#4CAF50" strokeWidth="8" strokeLinecap="round" strokeDasharray="180" strokeDashoffset="0" />
                    <text x="50" y="45" textAnchor="middle" fill="white" fontWeight="bold" fontSize="11" fontFamily="monospace">780</text>
                    <text x="50" y="54" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="6">Max 850</text>
                  </svg>

                  <div style={{ fontSize: '0.75rem', color: '#4CAF50', background: 'rgba(76, 175, 80, 0.1)', padding: '3px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
                    Sangat Baik
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side for Tablet only: Shows GPN Card and limit next to active content */}
        <div className="tablet-only tablet-credit-card-panel">
          <h3 className="section-title" style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'white', fontWeight: '700' }}>Kartu & Limit Saya</h3>
          {creditCardBlock}
        </div>
      </div>

      <DailyRewardModal
        isOpen={showRewardModal}
        onClose={() => setShowRewardModal(false)}
        balance={balance}
        setBalance={setBalance}
        points={points}
        setPoints={setPoints}
      />

      <SpinWheelModal
        isOpen={showSpinWheel}
        onClose={() => setShowSpinWheel(false)}
        points={points}
        setPoints={setPoints}
        balance={balance}
        setBalance={setBalance}
      />

      <OrderTrackingModal isOpen={!!selectedOrder} order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
};

export default ProfileView;
