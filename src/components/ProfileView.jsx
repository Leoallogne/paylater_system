import { useState, useRef, useEffect } from 'react';
import { FaUser, FaHistory, FaHeadset, FaPaperPlane, FaBoxOpen, FaCheckCircle, FaWallet, FaChevronRight, FaGift, FaGamepad, FaCoins, FaCalendarDay } from 'react-icons/fa';
import DailyRewardModal from './DailyRewardModal';
import SpinWheelModal from './SpinWheelModal';
import OrderTrackingModal from './OrderTrackingModal';
import { formatRupiah } from '../utils';

const ProfileView = ({ balance, setBalance, points, setPoints, orders, _setOrders, showToast, paylaterLimit, _setPaylaterLimit, paylaterUsed, setPaylaterUsed }) => {
  const [activeMenu, setActiveMenu] = useState('history');
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

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

  return (
    <div className="profile-container-premium" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Sidebar Profile */}
      <div className="profile-sidebar-premium">
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
              style={{ borderRadius: '12px', padding: '0.8rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px', background: 'linear-gradient(45deg, #4CAF50, #009688)', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '0.8rem' }}
              onClick={() => setShowRewardModal(true)}
            >
              <FaGift size={20} /> Mystery Box
            </button>
            <button
              className="btn btn-primary"
              style={{ borderRadius: '12px', padding: '0.8rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px', background: 'linear-gradient(45deg, #E91E63, #9C27B0)', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '0.8rem' }}
              onClick={() => setShowSpinWheel(true)}
            >
              <FaGamepad size={20} /> Spin Wheel
            </button>
          </div>
        </div>

        {/* Centered Credit Card Section Wrapper */}
        <div className="credit-card-section-wrapper">
          {/* Mandiri GPN Debit Card Mockup */}
          <div className="premium-credit-card-container">
            <div className={`card-inner ${isCardFlipped ? 'flipped' : ''}`} onClick={() => setIsCardFlipped(!isCardFlipped)}>
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
      </div>

      {/* Content Area */}
      <div className="profile-content-premium">
        {activeMenu === 'history' && (
          <div className="glass order-history-card-premium">
            <div className="history-header">
              <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: 0 }}>Riwayat Pesanan <span>Terbaru</span></h2>
              <button className="btn-filter-history">Filter Bulan Ini</button>
            </div>

            <div className="order-items-list" style={{ maxHeight: '420px', overflowY: 'auto' }}>
              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  <FaBoxOpen size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                  <p>Belum ada riwayat pesanan.</p>
                </div>
              ) : (
                orders.map(order => (
                  <div
                    key={order.id}
                    className="order-item-premium"
                    onClick={() => setSelectedOrder(order)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="order-item-icon">
                      <FaBoxOpen />
                    </div>
                    <div className="order-info-premium">
                      <h4 style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '250px' }}>{order.name}</h4>
                      <span className="order-meta">{order.invoice} • {order.date}</span>
                      <span className="order-price">{formatRupiah(order.price)}</span>
                    </div>
                    <div className="order-status-container">
                      <span className={`order-status ${order.status === 'Selesai' ? 'status-success' : 'status-shipping'}`}>{order.status}</span>
                      {order.status === 'Selesai' ? (
                        <button className="btn-buy-again" onClick={(e) => { e.stopPropagation(); alert("Ditambahkan kembali ke keranjang! (Simulasi)"); }}>Beli Lagi</button>
                      ) : (
                        <button className="btn-track" onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}>Lacak</button>
                      )}
                    </div>
                  </div>
                ))
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
                  Customer Service Online
                </p>
              </div>
              <FaHeadset size={24} color="var(--accent)" />
            </div>

            <div className="chat-messages-premium">
              {messages.map(msg => (
                <div key={msg.id} className={`chat-bubble-wrapper ${msg.sender === 'bot' ? 'wrapper-bot' : 'wrapper-user'}`}>
                  {msg.sender === 'bot' && <div className="chat-avatar-cs"><FaHeadset /></div>}
                  <div className={`chat-bubble-premium ${msg.sender === 'bot' ? 'chat-bot-premium' : 'chat-user-premium'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form className="chat-input-area-premium" onSubmit={handleSendMessage}>
              <input
                type="text"
                className="chat-input-premium"
                placeholder="Ketik pesan Anda di sini..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
              />
              <button type="submit" className="chat-send-btn-premium" disabled={!chatMessage.trim()}>
                <FaPaperPlane />
              </button>
            </form>
          </div>
        )}

        {activeMenu === 'paylater' && (
          <div className="glass order-history-card-premium" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div className="history-header">
              <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: 0 }}>Dasbor <span>NexPayLater</span></h2>
              <span style={{ fontSize: '0.8rem', background: 'rgba(255, 215, 0, 0.1)', color: '#FFD700', padding: '4px 10px', borderRadius: '12px', border: '1px solid rgba(255,215,0,0.3)', fontWeight: 'bold' }}>Gold Tier</span>
            </div>

            {/* PayLater Limit Card */}
            <div style={{ background: 'linear-gradient(135deg, #18191e 0%, #06070a 100%)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '20px', padding: '1.8rem', marginBottom: '2rem', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.4)' }}>
              <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'rgba(255, 215, 0, 0.05)', borderRadius: '50%', filter: 'blur(30px)' }}></div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>Sisa Limit Tersedia</span>
                <span style={{ color: '#FFD700', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bunga 0% Aktif</span>
              </div>
              <h1 style={{ fontSize: '2.4rem', color: 'white', fontWeight: '900', margin: '0 0 1.5rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{formatRupiah(paylaterLimit - paylaterUsed)}</h1>
              
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg, #FFD700, #FFA500)', width: `${((paylaterLimit - paylaterUsed) / paylaterLimit) * 100}%`, transition: 'all 0.5s ease' }}></div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.2rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '3px' }}>Total Limit Kredit</span>
                  <strong style={{ color: 'white', fontSize: '1rem' }}>{formatRupiah(paylaterLimit)}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '3px' }}>Tagihan Aktif</span>
                  <strong style={{ color: '#ff5252', fontSize: '1rem' }}>{formatRupiah(paylaterUsed)}</strong>
                </div>
              </div>
            </div>

            {/* Repayment and Bill detail */}
            {paylaterUsed > 0 ? (
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                  <div>
                    <h4 style={{ margin: 0, color: 'white', fontSize: '1rem' }}>Tagihan Bulan Ini</h4>
                    <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Jatuh tempo pada 25 Jul 2026</p>
                  </div>
                  <strong style={{ fontSize: '1.3rem', color: '#ff5252' }}>{formatRupiah(paylaterUsed)}</strong>
                </div>

                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    if (balance >= paylaterUsed) {
                      setBalance(prev => prev - paylaterUsed);
                      setPaylaterUsed(0);
                      showToast("Pembayaran Tagihan NexPayLater Berhasil!");
                    } else {
                      showToast("Saldo E-Wallet tidak cukup untuk membayar tagihan!");
                    }
                  }}
                  style={{ 
                    width: '100%', 
                    padding: '0.9rem', 
                    borderRadius: '12px', 
                    fontWeight: 'bold', 
                    background: 'linear-gradient(45deg, #FFD700, #FFA500)', 
                    border: 'none', 
                    color: '#0B0C10',
                    boxShadow: '0 6px 15px rgba(255, 215, 0, 0.2)',
                    cursor: 'pointer'
                  }}
                >
                  Bayar Tagihan Sekarang
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2.5rem 1.5rem', background: 'rgba(76, 175, 80, 0.05)', border: '1px dashed rgba(76, 175, 80, 0.2)', borderRadius: '16px', color: '#4CAF50', marginBottom: '2rem' }}>
                <FaCheckCircle size={32} style={{ marginBottom: '10px' }} />
                <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Tidak Ada Tagihan Aktif</h4>
                <p style={{ margin: '5px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Limit kredit Anda utuh. Silakan gunakan NexPayLater pada saat checkout.</p>
              </div>
            )}

            {/* Credit Score & Perks */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.2rem' }}>
                <h4 style={{ margin: '0 0 10px', color: 'white', fontSize: '0.95rem' }}>Keuntungan NexPayLater</h4>
                <ul style={{ paddingLeft: '15px', margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li>Bunga 0% untuk cicilan 1x (bayar bulan depan).</li>
                  <li>Metode pembayaran aman terverifikasi sistem OJK.</li>
                  <li>Dapatkan tambahan NexPoints gratis setiap bertransaksi.</li>
                </ul>
              </div>
              
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px' }}>Skor Kredit</div>
                <div style={{ fontSize: '2rem', color: '#4CAF50', fontWeight: 'bold', textShadow: '0 0 10px rgba(76, 175, 80, 0.2)' }}>780</div>
                <div style={{ fontSize: '0.7rem', color: '#4CAF50', background: 'rgba(76, 175, 80, 0.1)', padding: '2px 8px', borderRadius: '10px', marginTop: '5px', fontWeight: 'bold' }}>Sangat Baik</div>
              </div>
            </div>
          </div>
        )}
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
