import { useState, useEffect } from 'react';
import { FaBolt, FaArrowRight } from 'react-icons/fa';
import { formatRupiah } from '../utils';

// Dummy flash sale products
const flashSaleItems = [
  {
    id: 'fs1',
    name: "Paket Joki Skripsi Komplit",
    originalPrice: 2500000,
    price: 1250000, // 50% off
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400",
    soldPercentage: 85
  },
  {
    id: 'fs2',
    name: "Netflix Premium 1 Bulan (4K)",
    originalPrice: 186000,
    price: 45000,
    image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&q=80&w=400",
    soldPercentage: 92
  },
  {
    id: 'fs3',
    name: "Web Portofolio + Hosting",
    originalPrice: 850000,
    price: 350000,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400",
    soldPercentage: 64
  }
];

const FlashSale = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 1, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            }
          }
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => time < 10 ? `0${time}` : time;

  return (
    <div className="flash-sale-section">
      <div className="flash-sale-header">
        <div className="flash-title">
          <FaBolt color="#FF9800" className="flash-icon" />
          <h2>Flash <span>Sale</span></h2>
        </div>
        
        <div className="countdown-timer">
          <div className="time-box">{formatTime(timeLeft.hours)}</div>
          <span className="time-sep">:</span>
          <div className="time-box">{formatTime(timeLeft.minutes)}</div>
          <span className="time-sep">:</span>
          <div className="time-box time-seconds">{formatTime(timeLeft.seconds)}</div>
        </div>
        
        <button className="view-all-btn">Lihat Semua <FaArrowRight size={12} /></button>
      </div>

      <div className="flash-grid">
        {flashSaleItems.map(item => (
          <div className="flash-card glass" key={item.id}>
            <div className="flash-badge">- {Math.round((1 - item.price / item.originalPrice) * 100)}%</div>
            <img src={item.image} alt={item.name} className="flash-img" />
            <div className="flash-info">
              <h4>{item.name}</h4>
              <div className="flash-prices">
                <span className="flash-price-new">{formatRupiah(item.price)}</span>
                <span className="flash-price-old">{formatRupiah(item.originalPrice)}</span>
              </div>
              <div className="progress-container">
                <div className="progress-bar" style={{ width: `${item.soldPercentage}%` }}></div>
              </div>
              <p className="sold-text">Terjual {item.soldPercentage}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashSale;
