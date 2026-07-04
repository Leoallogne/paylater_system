import { useState, useEffect } from 'react';
import { FaTimes, FaQrcode, FaWallet, FaBuilding, FaCreditCard, FaCheckCircle, FaSpinner, FaLock, FaShieldAlt, FaCopy, FaInfoCircle } from 'react-icons/fa';
import { formatRupiah } from '../utils';

const PaymentModal = ({ isOpen, onClose, totalAmount, onSuccess, cart }) => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [subMethod, setSubMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [copied, setCopied] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');

  // Countdown Timer
  useEffect(() => {
    if (!isOpen || paymentSuccess || showReceipt) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, paymentSuccess, showReceipt]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handlePay = () => {
    if (!selectedMethod) return;
    setIsProcessing(true);

    const inv = 'INV/' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '/MPL/' + Math.floor(Math.random()*900 + 100);
    const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    setInvoiceNumber(inv);
    setInvoiceDate(dateStr);
    
    // Simulate API request
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      
      setTimeout(() => {
        setPaymentSuccess(false);
        setShowReceipt(true);
      }, 1500);
    }, 2500);
  };

  const resetAndClose = () => {
    if(isProcessing) return;
    setSelectedMethod('');
    setSubMethod('');
    setIsProcessing(false);
    setPaymentSuccess(false);
    setShowReceipt(false);
    setTimeLeft(15 * 60);
    onClose();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const adminFee = selectedMethod === 'card' ? 5000 : 2500;
  const grandTotal = totalAmount + adminFee;

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} style={{ zIndex: 4000 }}>
      <div className="app-modal payment-modal-premium" style={{ maxWidth: '550px', width: '95%', background: 'rgba(11,12,16,0.98)', backdropFilter: 'blur(20px)', border: '1px solid rgba(102, 252, 241, 0.2)', boxShadow: '0 25px 50px rgba(0,0,0,0.8)' }}>
        
        {showReceipt ? (
          <div className="receipt-screen-premium" style={{ padding: '2rem 1.5rem', animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.5rem' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'var(--accent)', borderRadius: '50%', filter: 'blur(20px)', opacity: 0.3 }}></div>
                <FaCheckCircle style={{ fontSize: '3rem', color: 'var(--accent)', position: 'relative', zIndex: 1 }} />
              </div>
              <h3 style={{ color: 'white', margin: 0, fontSize: '1.4rem' }}>Rincian Transaksi</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '3px 0 0' }}>Terima kasih atas pembayaran Anda</p>
            </div>
            
            <div className="invoice-receipt-paper" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(102, 252, 241, 0.3)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                <span>No. Invoice</span>
                <span style={{ color: 'white', fontFamily: 'monospace' }}>{invoiceNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                <span>Tanggal</span>
                <span style={{ color: 'white' }}>{invoiceDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                <span>Metode Pembayaran</span>
                <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{selectedMethod.toUpperCase()} {subMethod ? `(${subMethod})` : ''}</span>
              </div>
              
              <div className="receipt-items-list" style={{ marginBottom: '1.2rem', maxHeight: '100px', overflowY: 'auto' }}>
                {cart && cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px', color: 'white' }}>
                    <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '250px' }}>{item.name} <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>x{item.quantity}</span></span>
                    <span>{formatRupiah(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              
              <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  <span>Subtotal</span>
                  <span>{formatRupiah(totalAmount)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  <span>Biaya Layanan</span>
                  <span>{formatRupiah(adminFee)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', color: 'white', fontWeight: 'bold', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <span>Total Bayar</span>
                  <span style={{ color: 'var(--accent)', fontSize: '1.2rem' }}>{formatRupiah(grandTotal)}</span>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn btn-outline" 
                onClick={() => {
                  alert("Invoice PDF berhasil disimpan ke perangkat Anda!");
                }}
                style={{ flex: 1, borderRadius: '10px', padding: '0.8rem' }}
              >
                Unduh PDF
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  setShowReceipt(false);
                  onSuccess();
                }}
                style={{ flex: 1, borderRadius: '10px', padding: '0.8rem', fontWeight: 'bold' }}
              >
                Selesai
              </button>
            </div>
          </div>
        ) : paymentSuccess ? (
          <div className="payment-success-screen" style={{ padding: '4rem 2rem', textAlign: 'center', animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.5rem' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#4CAF50', borderRadius: '50%', filter: 'blur(20px)', opacity: 0.5 }}></div>
              <FaCheckCircle style={{ fontSize: '6rem', color: '#4CAF50', position: 'relative', zIndex: 1 }} />
            </div>
            <h2 style={{ marginBottom: '0.5rem', fontSize: '2rem', color: 'white' }}>Pembayaran Berhasil!</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Pesanan Anda sedang diproses oleh sistem.</p>
          </div>
        ) : (
          <>
            <div className="modal-header" style={{ borderBottomColor: 'rgba(255,255,255,0.05)', padding: '1.5rem 2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FaLock style={{ color: '#4CAF50', fontSize: '1.2rem' }} />
                <h2 style={{ fontSize: '1.3rem', margin: 0, color: 'white' }}>NexStore Checkout</h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ background: timeLeft < 300 ? 'rgba(255, 82, 82, 0.1)' : 'rgba(102, 252, 241, 0.1)', color: timeLeft < 300 ? '#ff5252' : 'var(--accent)', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', border: `1px solid ${timeLeft < 300 ? 'rgba(255, 82, 82, 0.3)' : 'rgba(102, 252, 241, 0.3)'}` }}>
                  {formatTime(timeLeft)}
                </div>
                <button className="close-btn" onClick={resetAndClose} disabled={isProcessing}>
                  <FaTimes />
                </button>
              </div>
            </div>
            
            <div className="modal-body" style={{ padding: '0' }}>
              
              {/* Order Summary Strip */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <span>Subtotal</span>
                  <span>{formatRupiah(totalAmount)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <span>Biaya Layanan</span>
                  <span>{formatRupiah(adminFee)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'white' }}>Total Tagihan</span>
                  <span style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--accent)' }}>{formatRupiah(grandTotal)}</span>
                </div>
              </div>

              <div style={{ padding: '1.5rem 2rem' }}>
                <p style={{ fontSize: '0.95rem', marginBottom: '1rem', fontWeight: '600', color: 'white' }}>Pilih Metode Pembayaran</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.8rem', marginBottom: '1.5rem' }}>
                  {[
                    { id: 'qris', icon: <FaQrcode />, label: 'QRIS' },
                    { id: 'ewallet', icon: <FaWallet />, label: 'E-Wallet' },
                    { id: 'va', icon: <FaBuilding />, label: 'Transfer VA' },
                    { id: 'card', icon: <FaCreditCard />, label: 'Kartu Kredit' }
                  ].map(method => (
                    <div 
                      key={method.id}
                      onClick={() => {
                        if (isProcessing) return;
                        setSelectedMethod(method.id);
                        setSubMethod('');
                      }}
                      style={{ 
                        padding: '1rem 0.5rem', 
                        borderRadius: '12px', 
                        border: `1px solid ${selectedMethod === method.id ? 'var(--accent)' : 'rgba(255,255,255,0.1)'}`, 
                        background: selectedMethod === method.id ? 'rgba(102, 252, 241, 0.05)' : 'rgba(255,255,255,0.02)', 
                        textAlign: 'center', 
                        cursor: 'pointer', 
                        transition: 'all 0.3s',
                        boxShadow: selectedMethod === method.id ? '0 0 15px rgba(102, 252, 241, 0.2)' : 'none'
                      }}
                    >
                      <div style={{ fontSize: '1.5rem', color: selectedMethod === method.id ? 'var(--accent)' : 'var(--text-muted)', marginBottom: '0.5rem' }}>{method.icon}</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: selectedMethod === method.id ? 'bold' : 'normal', color: selectedMethod === method.id ? 'white' : 'var(--text-muted)' }}>{method.label}</div>
                    </div>
                  ))}
                </div>

                {/* Dynamic Payment Details Container */}
                <div style={{ minHeight: '180px', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.03)' }}>
                  
                  {!selectedMethod && (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                      <FaShieldAlt style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.3 }} />
                      <p style={{ fontSize: '0.9rem' }}>Pilih metode pembayaran untuk melanjutkan transaksi yang aman.</p>
                    </div>
                  )}

                  {selectedMethod === 'qris' && (
                    <div style={{ textAlign: 'center', animation: 'fadeIn 0.3s' }}>
                      <div style={{ background: 'white', padding: '15px', borderRadius: '16px', display: 'inline-block', marginBottom: '1rem', boxShadow: '0 10px 30px rgba(102,252,241,0.2)' }}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QRIS" style={{ width: '150px', height: '150px' }} />
                      </div>
                      <h4 style={{ color: 'white', marginBottom: '0.3rem' }}>NMID: ID1029384756</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Buka aplikasi M-Banking atau E-Wallet Anda lalu scan kode QR di atas.</p>
                    </div>
                  )}

                  {selectedMethod === 'ewallet' && (
                    <div style={{ animation: 'fadeIn 0.3s' }}>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Pilih provider E-Wallet:</p>
                      <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
                        {['GoPay', 'OVO', 'DANA', 'ShopeePay'].map(ew => (
                          <button 
                            key={ew}
                            onClick={() => setSubMethod(ew)}
                            style={{ flex: 1, padding: '0.8rem 0', background: subMethod === ew ? 'var(--accent)' : 'rgba(255,255,255,0.05)', color: subMethod === ew ? '#1A1A2E' : 'white', border: '1px solid', borderColor: subMethod === ew ? 'var(--accent)' : 'rgba(255,255,255,0.1)', borderRadius: '8px', fontWeight: subMethod === ew ? 'bold' : 'normal', cursor: 'pointer', transition: '0.2s', fontSize: '0.8rem' }}
                          >
                            {ew}
                          </button>
                        ))}
                      </div>
                      
                      {subMethod && (
                        <div style={{ animation: 'fadeIn 0.3s' }}>
                          <label style={{ fontSize: '0.85rem', color: 'white', display: 'block', marginBottom: '0.5rem' }}>Nomor HP Terdaftar ({subMethod})</label>
                          <input 
                            type="tel" 
                            placeholder="Contoh: 081234567890" 
                            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(102, 252, 241, 0.3)', color: 'white', padding: '1rem', borderRadius: '10px', outline: 'none', fontSize: '1rem', letterSpacing: '1px' }}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {selectedMethod === 'va' && (
                    <div style={{ animation: 'fadeIn 0.3s' }}>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Pilih Bank Tujuan:</p>
                      <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
                        {['BCA', 'Mandiri', 'BNI', 'BRI'].map(bank => (
                          <button 
                            key={bank}
                            onClick={() => setSubMethod(bank)}
                            style={{ flex: 1, padding: '0.8rem 0', background: subMethod === bank ? 'var(--accent)' : 'rgba(255,255,255,0.05)', color: subMethod === bank ? '#1A1A2E' : 'white', border: '1px solid', borderColor: subMethod === bank ? 'var(--accent)' : 'rgba(255,255,255,0.1)', borderRadius: '8px', fontWeight: subMethod === bank ? 'bold' : 'normal', cursor: 'pointer', transition: '0.2s' }}
                          >
                            {bank}
                          </button>
                        ))}
                      </div>
                      
                      {subMethod && (
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(102,252,241,0.2)', animation: 'fadeIn 0.3s' }}>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Nomor Virtual Account ({subMethod})</p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--accent)', letterSpacing: '2px' }}>
                              8899 0102 9384
                            </span>
                            <button onClick={() => copyToClipboard('889901029384')} style={{ background: 'transparent', border: 'none', color: copied ? '#4CAF50' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }}>
                              {copied ? <FaCheckCircle /> : <FaCopy />} {copied ? 'Tersalin' : 'Salin'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedMethod === 'card' && (
                    <div style={{ animation: 'fadeIn 0.3s' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#4CAF50', fontSize: '0.8rem', marginBottom: '1rem' }}>
                        <FaShieldAlt /> Pembayaran Kartu Kredit dienkripsi penuh (PCI-DSS Compliant)
                      </div>
                      <div style={{ marginBottom: '1rem' }}>
                        <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Nomor Kartu</label>
                        <input type="text" placeholder="0000 0000 0000 0000" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.8rem 1rem', borderRadius: '8px', outline: 'none', letterSpacing: '2px' }} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Masa Berlaku (MM/YY)</label>
                          <input type="text" placeholder="MM/YY" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.8rem 1rem', borderRadius: '8px', outline: 'none' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>CVV</label>
                          <input type="password" placeholder="***" maxLength="3" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.8rem 1rem', borderRadius: '8px', outline: 'none', letterSpacing: '3px' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  className="btn btn-primary" 
                  onClick={handlePay} 
                  disabled={!selectedMethod || isProcessing || ((selectedMethod === 'ewallet' || selectedMethod === 'va') && !subMethod)}
                  style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', marginTop: '1.5rem', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontWeight: 'bold', letterSpacing: '1px', boxShadow: (!selectedMethod || ((selectedMethod === 'ewallet' || selectedMethod === 'va') && !subMethod)) ? 'none' : '0 10px 20px rgba(102, 252, 241, 0.3)' }}
                >
                  {isProcessing ? (
                    <><FaSpinner className="spin" /> Verifikasi Pembayaran...</>
                  ) : (
                    <>Bayar {formatRupiah(grandTotal)} <FaLock style={{ fontSize: '0.9rem' }} /></>
                  )}
                </button>
                <div style={{ textAlign: 'center', marginTop: '1rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                  <FaInfoCircle /> NexStore Payment Gateway by Stripe
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
