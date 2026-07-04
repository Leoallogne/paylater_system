import { useState } from 'react';
import { FaGift, FaTimes, FaCoins, FaCheckCircle, FaStar, FaCalendarDay } from 'react-icons/fa';
import { formatRupiah } from '../utils';

const DailyRewardModal = ({ isOpen, onClose, _balance, setBalance, _points, setPoints }) => {
  const [opened, setOpened] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [rewardPoints, setRewardPoints] = useState(0);
  
  // Load or initialize streak count (default is day 4 for simulation variety)
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('nex_streak');
    return saved !== null ? Number(saved) : 3; // Start at Day 4 (index 3)
  });
  
  const [hasClaimedToday, setHasClaimedToday] = useState(() => {
    const saved = localStorage.getItem('nex_claimed_today');
    return saved === 'true';
  });

  const streakDays = [
    { day: 1, cash: 5000, pts: 20 },
    { day: 2, cash: 10000, pts: 40 },
    { day: 3, cash: 15000, pts: 60 },
    { day: 4, cash: 20000, pts: 80 },
    { day: 5, cash: 25000, pts: 100 },
    { day: 6, cash: 30000, pts: 120 },
    { day: 7, cash: 50000, pts: 250 }
  ];

  const handleOpenChest = () => {
    if (hasClaimedToday) return;

    const currentDayReward = streakDays[streak];
    setRewardAmount(currentDayReward.cash);
    setRewardPoints(currentDayReward.pts);
    
    // Add to balance and points
    setBalance(prev => prev + currentDayReward.cash);
    setPoints(prev => prev + currentDayReward.pts);
    
    setHasClaimedToday(true);
    localStorage.setItem('nex_claimed_today', 'true');
    setOpened(true);
  };

  const handleClaim = () => {
    // Advance streak (resets to 0 if reached day 7)
    const nextStreak = (streak + 1) % 7;
    setStreak(nextStreak);
    localStorage.setItem('nex_streak', nextStreak.toString());

    onClose();
    setTimeout(() => setOpened(false), 500); // reset state after closing
  };

  // Helper for testing: Reset claim status
  const resetClaimForTesting = () => {
    setHasClaimedToday(false);
    localStorage.setItem('nex_claimed_today', 'false');
    alert("Simulasi klaim harian di-reset! Anda bisa klaim hari ini lagi.");
  };

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} style={{ zIndex: 5000 }}>
      <div className="app-modal reward-modal-premium" style={{ maxWidth: '500px', background: 'radial-gradient(circle at center, rgba(102, 252, 241, 0.15) 0%, rgba(11, 12, 16, 0.98) 75%)', border: '1px solid var(--accent)', boxShadow: '0 0 50px rgba(102, 252, 241, 0.25)', padding: '2rem 1.5rem' }}>
        
        <button className="close-btn" onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px' }}>
          <FaTimes />
        </button>
        
        <div className="modal-body" style={{ textAlign: 'center' }}>
          
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.3rem', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            <FaCalendarDay color="var(--accent)" /> 7-Day Streak Reward
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            Klaim berturut-turut untuk mendapatkan bonus Saldo & NexPoints yang berlipat ganda!
          </p>

          {/* 7-Day Calendar Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '2rem' }}>
            {streakDays.map((dayData, index) => {
              const isPast = index < streak;
              const isCurrent = index === streak;
              const isFuture = index > streak;
              
              let borderStyle = '1px solid rgba(255,255,255,0.05)';
              let bgStyle = 'rgba(255,255,255,0.02)';
              let iconColor = 'var(--text-muted)';
              
              if (isPast) {
                borderStyle = '1px solid #4CAF50';
                bgStyle = 'rgba(76, 175, 80, 0.08)';
                iconColor = '#4CAF50';
              } else if (isCurrent) {
                borderStyle = '2px solid var(--accent)';
                bgStyle = 'rgba(102, 252, 241, 0.1)';
                iconColor = 'var(--accent)';
              }

              return (
                <div 
                  key={dayData.day} 
                  style={{ 
                    padding: '10px 5px', 
                    borderRadius: '12px', 
                    border: borderStyle, 
                    background: bgStyle,
                    position: 'relative',
                    gridColumn: dayData.day === 7 ? 'span 2' : 'span 1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: isFuture ? 0.6 : 1,
                    transition: 'all 0.3s'
                  }}
                >
                  <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: isCurrent ? 'var(--accent)' : 'var(--text-muted)', marginBottom: '5px' }}>Hari {dayData.day}</span>
                  <div style={{ fontSize: '1.2rem', color: iconColor }}>
                    {isPast ? <FaCheckCircle /> : dayData.day === 7 ? <FaGift style={{ color: '#FFD700' }} /> : <FaGift />}
                  </div>
                  <span style={{ fontSize: '0.65rem', color: 'white', marginTop: '5px', fontWeight: 'bold' }}>+{dayData.pts} Pts</span>
                  {isCurrent && !hasClaimedToday && (
                    <span className="pulse-indicator" style={{ top: '5px', right: '5px' }}></span>
                  )}
                </div>
              );
            })}
          </div>

          {!opened ? (
            <div 
              className={`mystery-box-container ${hasClaimedToday ? 'claimed' : ''}`} 
              onClick={handleOpenChest}
              style={{ cursor: hasClaimedToday ? 'not-allowed' : 'pointer' }}
            >
              {hasClaimedToday ? (
                <div style={{ padding: '2rem 1rem' }}>
                  <FaCheckCircle style={{ fontSize: '4rem', color: '#4CAF50', marginBottom: '1rem' }} />
                  <h3 style={{ color: 'white' }}>Sudah Diklaim</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '5px' }}>Kembali lagi besok untuk klaim hadiah Hari {streakDays[(streak + 1) % 7].day}!</p>
                </div>
              ) : (
                <>
                  <div className="box-glow" style={{ animation: 'pulse 1.5s infinite' }}></div>
                  <FaGift className="chest-icon" style={{ animation: 'bounce 2s infinite', fontSize: streak === 6 ? '5rem' : '4rem', color: streak === 6 ? '#FFD700' : 'var(--accent)' }} />
                  <p className="click-to-open" style={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {streak === 6 ? 'BUKA SUPER CHEST HARI 7!' : 'Klik untuk Buka Mystery Box'}
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="reward-result-container fade-in">
              <FaStar className="star-icon star-1" />
              <FaStar className="star-icon star-2" />
              <FaStar className="star-icon star-3" />

              <div className="coin-wrapper" style={{ background: 'rgba(102, 252, 241, 0.1)', border: '2px solid var(--accent)' }}>
                <FaCoins className="coin-icon" style={{ color: '#FFD700' }} />
              </div>

              <h3 style={{ color: 'var(--accent)', fontSize: '1.6rem', marginTop: '1rem' }}>Selamat!</h3>
              <p style={{ color: 'white', marginBottom: '0.5rem', fontSize: '0.95rem' }}>Anda berhasil mengklaim hadiah Hari {streak + 1}:</p>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', margin: '1rem 0' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.8rem 1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cashback</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>{formatRupiah(rewardAmount)}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.8rem 1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>NexPoints</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent)' }}>+{rewardPoints} Pts</div>
                </div>
              </div>

              <button 
                className="btn btn-primary" 
                onClick={handleClaim}
                style={{ width: '100%', padding: '1rem', borderRadius: '30px', marginTop: '1.5rem', fontSize: '1.1rem', fontWeight: 'bold' }}
              >
                Lanjutkan <FaCheckCircle style={{ marginLeft: '10px' }} />
              </button>
            </div>
          )}

          {/* Dev Sandbox controls to test */}
          <div style={{ marginTop: '2rem', borderTop: '1px dashed rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
            <button 
              onClick={resetClaimForTesting}
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)', padding: '5px 12px', borderRadius: '15px', fontSize: '0.7rem', cursor: 'pointer' }}
            >
              Reset Klaim (Testing)
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DailyRewardModal;
