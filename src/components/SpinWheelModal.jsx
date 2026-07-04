import { useState } from 'react';
import { FaTimes, FaGift, FaCoins } from 'react-icons/fa';

const SpinWheelModal = ({ isOpen, onClose, points, setPoints, _balance, setBalance }) => {
  const [spinning, setSpinning] = useState(false);
  const [prize, setPrize] = useState(null);
  const [rotation, setRotation] = useState(0);

  const prizes = [
    { label: 'Diskon 10%', type: 'discount', value: 0 },
    { label: 'Cashback 50K', type: 'cashback', value: 50000 },
    { label: 'Gratis Ongkir', type: 'shipping', value: 0 },
    { label: 'Zonk', type: 'zonk', value: 0 },
    { label: 'Voucher 100K', type: 'voucher', value: 100000 },
    { label: 'Diskon 50%', type: 'discount', value: 0 },
  ];

  const handleSpin = () => {
    if (spinning || prize) return;
    if (points < 100) {
      alert("NexPoints Anda tidak mencukupi! Setiap putaran membutuhkan 100 NexPoints.");
      return;
    }
    
    // Deduct 100 NexPoints
    setPoints(prev => prev - 100);
    setSpinning(true);
    
    // Random rotations between 5 and 10 full spins + random offset
    const randomSpin = Math.floor(Math.random() * 360) + (360 * 8); 
    const finalRotation = rotation + randomSpin;
    setRotation(finalRotation);

    setTimeout(() => {
      setSpinning(false);
      // Calculate which segment won based on angle
      const normalizedAngle = finalRotation % 360;
      const segmentAngle = 360 / prizes.length;
      // Because CSS rotate goes clockwise and segment 0 starts at top right
      const winningIndex = Math.floor((360 - (normalizedAngle % 360)) / segmentAngle) % prizes.length;
      const wonPrize = prizes[winningIndex];
      setPrize(wonPrize);
      
      // If won cashback or voucher, add to balance directly
      if (wonPrize.value > 0) {
        setBalance(prev => prev + wonPrize.value);
      }
    }, 4000); // 4s animation
  };

  const handleClaim = () => {
    if (prize.value > 0) {
      alert(`Selamat! Hadiah ${prize.label} telah ditambahkan ke Saldo E-Wallet Anda.`);
    } else {
      alert(`Selamat! Anda mendapatkan ${prize.label}. Voucher ini siap digunakan.`);
    }
    onClose();
    // Reset state for next time
    setTimeout(() => {
      setPrize(null);
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} style={{ zIndex: 6000 }}>
      <div className="app-modal glass spin-wheel-modal" style={{ maxWidth: '400px', textAlign: 'center', padding: '2rem 1.5rem', background: 'rgba(11,12,16,0.98)', border: '1px solid var(--accent)' }}>
        <button className="close-btn" onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px' }}>
          <FaTimes />
        </button>

        <h2 style={{ color: 'white', marginBottom: '0.3rem' }}>NexStore <span style={{ color: 'var(--accent)' }}>Roulette</span></h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
          Biaya Putar: <strong style={{ color: 'var(--accent)' }}>100 NexPoints</strong>
        </p>

        {/* Display Current Points */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', background: 'rgba(102, 252, 241, 0.1)', padding: '0.5rem 1rem', borderRadius: '20px', width: 'max-content', margin: '0 auto 1.5rem', border: '1px solid rgba(102, 252, 241, 0.2)' }}>
          <FaCoins color="#FFD700" />
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>{points} NexPoints</span>
        </div>

        <div className="wheel-container">
          <div className="wheel-pointer"></div>
          <div 
            className="wheel" 
            style={{ 
              transform: `rotate(${rotation}deg)`, 
              transition: spinning ? 'transform 4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'none' 
            }}
          >
            {prizes.map((p, idx) => (
              <div 
                key={idx} 
                className="wheel-segment" 
                style={{ 
                  transform: `rotate(${idx * (360 / prizes.length)}deg)`,
                  background: idx % 2 === 0 ? '#1A1A2E' : '#2A2A40'
                }}
              >
                <span className="segment-text">{p.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '2.5rem', minHeight: '80px' }}>
          {prize ? (
            <div className="prize-reveal" style={{ animation: 'bounceIn 0.5s' }}>
              <h3 style={{ color: prize.type === 'zonk' ? '#ff5252' : '#FFD700', fontSize: '1.4rem', marginBottom: '10px' }}>
                {prize.type === 'zonk' ? 'Oops, Coba Lagi Besok!' : prize.label}
              </h3>
              {prize.type !== 'zonk' && (
                <button className="btn btn-primary" onClick={handleClaim} style={{ width: '100%', borderRadius: '20px' }}>
                  <FaGift style={{ marginRight: '8px' }}/> Klaim Hadiah
                </button>
              )}
            </div>
          ) : (
            <button 
              className="btn btn-primary btn-spin" 
              onClick={handleSpin} 
              disabled={spinning || points < 100}
              style={{ 
                width: '100%', 
                borderRadius: '25px', 
                padding: '1rem', 
                fontSize: '1.1rem', 
                fontWeight: 'bold',
                textTransform: 'uppercase', 
                letterSpacing: '1px', 
                background: (spinning || points < 100) ? 'grey' : 'linear-gradient(45deg, #FF9800, #E91E63)',
                boxShadow: (spinning || points < 100) ? 'none' : '0 10px 20px rgba(233, 30, 99, 0.3)'
              }}
            >
              {spinning ? 'Memutar...' : points < 100 ? 'NexPoints Kurang' : 'Putar Sekarang'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpinWheelModal;
