import { useState } from 'react';
import { FaTimes, FaPlus, FaMinus, FaArrowRight, FaShoppingBag, FaShieldAlt, FaTicketAlt, FaCheckCircle, FaFire } from 'react-icons/fa';
import { formatRupiah } from '../utils';

const CartDrawer = ({ isOpen, onClose, cart, updateQuantity, removeFromCart, onCheckout }) => {
  const [promoCode, setPromoCode] = useState('');
  const [promoStatus, setPromoStatus] = useState(null); // 'success', 'error', null
  const [discountAmount, setDiscountAmount] = useState(0);

  const totalValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Free Shipping Logic
  const freeShippingThreshold = 2000000; // Rp 2.000.000
  const progressPercent = Math.min((totalValue / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = freeShippingThreshold - totalValue;

  const handleApplyPromo = () => {
    const code = promoCode.toUpperCase().trim();
    if (code === 'NEXSTORE50') {
      setPromoStatus('success');
      setDiscountAmount(50000);
    } else if (code === 'NEXNEW') {
      setPromoStatus('success');
      setDiscountAmount(Math.round(totalValue * 0.10));
    } else if (code === 'JOKIHEMAT') {
      setPromoStatus('success');
      setDiscountAmount(25000);
    } else if (code === 'NEXSUPER') {
      setPromoStatus('success');
      setDiscountAmount(Math.round(totalValue * 0.50));
    } else if (code !== '') {
      setPromoStatus('error');
      setDiscountAmount(0);
    }
  };

  const finalTotal = totalValue - discountAmount > 0 ? totalValue - discountAmount : 0;

  // Cross-selling dummy items
  const crossSellItems = [
    { id: 101, name: 'Mousepad Premium XL', price: 150000, image: 'https://images.unsplash.com/photo-1615663245857-ac93bb5c9027?auto=format&fit=crop&q=80&w=200' },
    { id: 102, name: 'Screen Cleaner Kit', price: 45000, image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=200' }
  ];

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'active' : ''}`} onClick={onClose} style={{ zIndex: 1000, backdropFilter: 'blur(10px)', background: 'rgba(0,0,0,0.6)' }}></div>
      <div className={`cart-drawer-premium ${isOpen ? 'active' : ''}`} style={{ width: '450px', maxWidth: '100vw', display: 'flex', flexDirection: 'column' }}>
        
        <div className="cart-header-premium" style={{ background: 'rgba(11, 12, 16, 0.98)', borderBottom: '1px solid rgba(102, 252, 241, 0.2)', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(102, 252, 241, 0.1)', padding: '10px', borderRadius: '12px', color: 'var(--accent)' }}>
              <FaShoppingBag size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', margin: 0, color: 'white' }}>Keranjang Belanja</h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cart.length} Item Terpilih</span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)' }}>
            <FaTimes />
          </button>
        </div>
        
        <div className="cart-items-premium" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          
          {cart.length > 0 && (
            <div className="free-shipping-progress" style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: 'white', fontWeight: 'bold' }}>
                  {remainingForFreeShipping > 0 ? `Belanja ${formatRupiah(remainingForFreeShipping)} lagi` : 'Gratis Ongkir Tercapai! 🎉'}
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${progressPercent}%`, height: '100%', background: progressPercent >= 100 ? '#4CAF50' : 'var(--accent)', transition: 'width 0.5s ease', boxShadow: progressPercent >= 100 ? '0 0 10px #4CAF50' : '0 0 10px var(--accent)' }}></div>
              </div>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Batas Gratis Ongkir Reguler: Rp 2.000.000</p>
            </div>
          )}

          {cart.length === 0 ? (
            <div className="empty-cart-premium" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60%', textAlign: 'center' }}>
              <div className="empty-cart-icon" style={{ background: 'rgba(255,255,255,0.02)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
                <FaShoppingBag size={30} />
              </div>
              <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Keranjang Kosong</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Belum ada produk premium yang Anda pilih. Mulai jelajahi koleksi kami!</p>
              <button className="btn btn-primary" onClick={onClose} style={{ borderRadius: '25px', padding: '0.8rem 2rem' }}>
                Mulai Belanja
              </button>
            </div>
          ) : (
            <>
              {cart.map(item => (
                <div className="cart-item-premium" key={item.id} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
                  <div className="cart-item-img-wrapper" style={{ width: '80px', height: '80px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
                    <img src={item.image} alt={item.name} className="cart-item-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div className="cart-item-details" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h4 className="cart-item-title" style={{ fontSize: '0.95rem', color: 'white', margin: '0 0 0.3rem', lineHeight: '1.3' }}>{item.name}</h4>
                      <div className="cart-item-price-premium" style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '1rem' }}>{formatRupiah(item.price)}</div>
                    </div>
                    
                    <div className="cart-item-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.8rem' }}>
                      <div className="qty-controls-premium" style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '2px 5px' }}>
                        <button className="qty-btn-premium" style={{ background: 'transparent', border: 'none', color: 'white', padding: '5px 10px', cursor: 'pointer' }} onClick={() => updateQuantity(item.id, -1)}><FaMinus size={10} /></button>
                        <span className="qty-number" style={{ color: 'white', fontWeight: 'bold', minWidth: '20px', textAlign: 'center', fontSize: '0.9rem' }}>{item.quantity}</span>
                        <button className="qty-btn-premium" style={{ background: 'transparent', border: 'none', color: 'var(--accent)', padding: '5px 10px', cursor: 'pointer' }} onClick={() => updateQuantity(item.id, 1)}><FaPlus size={10} /></button>
                      </div>
                      <button className="remove-btn-premium" style={{ background: 'transparent', border: 'none', color: '#ff5252', fontSize: '0.8rem', cursor: 'pointer' }} onClick={() => removeFromCart(item.id)}>Hapus</button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="cross-sell-section" style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                <h4 style={{ color: 'white', fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <FaFire color="#FF9800" /> Sering Dibeli Bersamaan
                </h4>
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                  {crossSellItems.map(item => (
                    <div key={item.id} style={{ minWidth: '140px', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} />
                      <h5 style={{ color: 'white', fontSize: '0.75rem', margin: '0 0 5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</h5>
                      <p style={{ color: 'var(--accent)', fontSize: '0.8rem', margin: '0 0 8px', fontWeight: 'bold' }}>{formatRupiah(item.price)}</p>
                      <button style={{ width: '100%', background: 'rgba(102, 252, 241, 0.1)', color: 'var(--accent)', border: 'none', padding: '5px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}>+ Tambah</button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        
        {cart.length > 0 && (
          <div className="cart-footer-premium" style={{ padding: '1.5rem', background: 'rgba(11, 12, 16, 0.98)', borderTop: '1px solid rgba(102, 252, 241, 0.2)' }}>
            
            <div className="promo-code-section" style={{ display: 'flex', gap: '10px', marginBottom: '1.2rem' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <FaTicketAlt style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="Gunakan Kode: NEXSTORE50" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: `1px solid ${promoStatus === 'success' ? '#4CAF50' : promoStatus === 'error' ? '#ff5252' : 'rgba(255,255,255,0.1)'}`, padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '10px', color: 'white', outline: 'none', fontSize: '0.85rem' }}
                />
              </div>
              <button className="btn btn-outline" onClick={handleApplyPromo} style={{ padding: '0 1rem', borderRadius: '10px', fontSize: '0.85rem' }}>Klaim</button>
            </div>
            
            {promoStatus === 'success' && <p style={{ color: '#4CAF50', fontSize: '0.75rem', margin: '-10px 0 15px', display: 'flex', alignItems: 'center', gap: '5px' }}><FaCheckCircle /> Kode Promo Berhasil Diterapkan!</p>}
            {promoStatus === 'error' && <p style={{ color: '#ff5252', fontSize: '0.75rem', margin: '-10px 0 15px' }}>Kode promo tidak valid atau kadaluarsa.</p>}

            <div className="cart-total-premium" style={{ marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                <span>Subtotal</span>
                <span>{formatRupiah(totalValue)}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4CAF50', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  <span>Diskon Promo</span>
                  <span>-{formatRupiah(discountAmount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Total Tagihan</span>
                <span className="total-value" style={{ color: 'var(--accent)', fontSize: '1.4rem', fontWeight: '900' }}>{formatRupiah(finalTotal)}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '1.2rem', color: '#4CAF50', fontSize: '0.8rem', background: 'rgba(76, 175, 80, 0.1)', padding: '0.5rem', borderRadius: '8px' }}>
              <FaShieldAlt /> Checkout Aman (Enkripsi SSL 256-bit)
            </div>

            <button 
              className="btn btn-primary checkout-btn-premium" 
              onClick={() => onCheckout(finalTotal)} 
              style={{ width: '100%', borderRadius: '12px', padding: '1rem', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
            >
              Checkout Sekarang <FaArrowRight />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
