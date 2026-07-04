import { FaTimes, FaBoxOpen, FaTruck, FaCheckCircle, FaClipboardList, FaMapMarkerAlt, FaCommentDots, FaPhoneAlt, FaMotorcycle, FaSpinner } from 'react-icons/fa';

const OrderTrackingModal = ({ isOpen, order, onClose }) => {
  if (!isOpen || !order) return null;

  const isDigital = order.type === 'digital';
  
  // Normalize order status checks
  const statusLower = order.status.toLowerCase();
  const isShipping = statusLower.includes('kirim') || statusLower.includes('jalan');
  const isProcessing = statusLower.includes('kemas') || statusLower.includes('proses');
  const isCompleted = statusLower.includes('selesai') || statusLower.includes('tiba');

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} style={{ zIndex: 5000 }}>
      <div className="app-modal glass tracking-modal" style={{ maxWidth: '500px', padding: '0', background: 'rgba(11,12,16,0.98)', border: '1px solid rgba(102, 252, 241, 0.3)', overflow: 'hidden' }}>
        
        <div className="tracking-header" style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
          <div>
            <h3 style={{ margin: 0, color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Pelacakan Pesanan 
              {(isShipping || isProcessing) ? (
                <div className="live-indicator"><span className="pulse"></span> LIVE</div>
              ) : (
                <div style={{ background: 'rgba(76, 175, 80, 0.1)', color: '#4CAF50', fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '8px', fontWeight: 'bold' }}>SELESAI</div>
              )}
            </h3>
            <p style={{ margin: '5px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.invoice}</p>
          </div>
          <button className="close-btn" onClick={onClose} style={{ position: 'static', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}>
            <FaTimes />
          </button>
        </div>

        <div className="tracking-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
          
          {/* Dynamic Map for Physical Items during Shipping */}
          {!isDigital && isShipping && (
            <div className="tracking-map-container" style={{ height: '200px', position: 'relative', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <iframe
                title="Delivery Map"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(80%)' }}
                loading="lazy"
                src={`https://www.google.com/maps?q=Karawang,West+Java&output=embed`}
              ></iframe>
              <div className="eta-badge">
                <span className="eta-label">Estimasi Tiba</span>
                <span className="eta-time">14:30 WIB</span>
              </div>
            </div>
          )}

          {/* Dynamic State Banner for Processing Items */}
          {!isDigital && isProcessing && (
            <div style={{ padding: '2rem 1.5rem', textAlign: 'center', background: 'rgba(102, 252, 241, 0.03)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <FaSpinner className="spin" style={{ fontSize: '2.5rem', color: 'var(--accent)' }} />
              <h4 style={{ color: 'white', margin: '5px 0 0' }}>Penjual Sedang Mengemas Paket</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>Pesanan Anda sedang disortir dan dikemas dengan bubble wrap premium di pusat logistik kami.</p>
            </div>
          )}

          <div style={{ padding: '1.5rem' }}>
            
            {/* Courier Profile: Show on Shipping and Completed */}
            {!isDigital && (isShipping || isCompleted) && (
              <div className="courier-profile-card">
                <div className="courier-avatar">
                  <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100" alt="Kurir" />
                </div>
                <div className="courier-info">
                  <h4>Budi Santoso</h4>
                  <p><FaMotorcycle style={{marginRight:'5px'}}/> T 1234 ABC • NexExpress</p>
                  <span style={{ fontSize: '0.75rem', color: isCompleted ? '#4CAF50' : 'var(--accent)', fontWeight: 'bold' }}>
                    {isCompleted ? '✓ Telah Diterima oleh Penerima' : '⚡ Sedang Mengirimkan Paket Anda'}
                  </span>
                </div>
                <div className="courier-actions">
                  <button className="btn-icon-circle chat" onClick={() => alert("Membuka chat dengan Budi Santoso...")}><FaCommentDots /></button>
                  <button className="btn-icon-circle call" onClick={() => alert("Menghubungi kurir...")}><FaPhoneAlt /></button>
                </div>
              </div>
            )}

            <div className="tracking-item-info" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ width: '50px', height: '50px', background: 'rgba(102, 252, 241, 0.1)', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--accent)' }}>
                <FaBoxOpen size={24} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.2rem', color: 'white', fontSize: '1rem', lineHeight: '1.4' }}>{order.name}</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{isDigital ? 'Pengiriman Digital (Email)' : 'Layanan: NexExpress Same Day'}</p>
              </div>
            </div>

            <div className="timeline-container">
              
              {/* Step 1: Created */}
              <div className="timeline-step completed">
                <div className="step-icon"><FaClipboardList /></div>
                <div className="step-content">
                  <h5>Pesanan Dibuat</h5>
                  <p>Pembayaran berhasil diverifikasi oleh sistem.</p>
                  <span className="step-time">{order.date}, 09:15</span>
                </div>
              </div>

              {/* Digital Timeline */}
              {isDigital ? (
                <>
                  <div className="timeline-step completed">
                    <div className="step-icon"><FaBoxOpen /></div>
                    <div className="step-content">
                      <h5>Lisensi Di-generate</h5>
                      <p>Sistem sedang men-generate lisensi produk Anda.</p>
                      <span className="step-time">{order.date}, 11:30</span>
                    </div>
                  </div>
                  <div className="timeline-step active-step">
                    <div className="step-icon"><FaCheckCircle /></div>
                    <div className="step-content">
                      <h5>Selesai</h5>
                      <p>Produk digital telah dikirimkan ke email terdaftar Anda (leo.syafiq@nexstore.co.id).</p>
                      <span className="step-time">{order.date}, 11:35</span>
                    </div>
                  </div>
                </>
              ) : (
                /* Physical Timeline */
                <>
                  {/* Step 2: Processing */}
                  <div className={`timeline-step ${isProcessing ? 'active-step' : 'completed'}`}>
                    <div className="step-icon"><FaBoxOpen /></div>
                    <div className="step-content">
                      <h5>Pesanan Diproses</h5>
                      <p>Penjual sedang mengemas barang pesanan Anda.</p>
                      <span className="step-time">{order.date}, 11:30</span>
                    </div>
                  </div>

                  {/* Step 3: Shipping */}
                  <div className={`timeline-step ${isShipping ? 'active-step' : isCompleted ? 'completed' : 'pending'}`}>
                    <div className="step-icon"><FaTruck /></div>
                    <div className="step-content">
                      <h5>Sedang Dikirim</h5>
                      <p>Kurir sedang dalam perjalanan menuju alamat Anda.</p>
                      {isShipping && (
                        <div className="tracking-location">
                          <FaMapMarkerAlt color="#D4A373" /> Jl. Galuh Mas Raya, Karawang
                        </div>
                      )}
                      {isCompleted && <span className="step-time">Tiba pukul 14:05</span>}
                    </div>
                  </div>

                  {/* Step 4: Completed */}
                  <div className={`timeline-step ${isCompleted ? 'active-step' : 'pending'}`}>
                    <div className="step-icon"><FaCheckCircle /></div>
                    <div className="step-content">
                      <h5>Pesanan Selesai</h5>
                      <p>Paket telah tiba di tujuan dan diterima oleh pembeli.</p>
                    </div>
                  </div>
                </>
              )}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingModal;
