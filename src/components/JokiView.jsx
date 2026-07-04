import { useState, useEffect } from 'react';
import { FaRocket, FaPaperPlane, FaUserAlt, FaPhoneAlt, FaCheckCircle, FaStar, FaBolt, FaCheck, FaTimes, FaRegComments } from 'react-icons/fa';
import { formatRupiah } from '../utils';

const expertJokis = [
  { id: 1, name: "Expert Budi", role: "Full-Stack Web Dev", rating: 5.0, projects: 124, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300" },
  { id: 2, name: "Siska UI/UX", role: "Senior Product Designer", rating: 4.9, projects: 89, image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300" },
  { id: 3, name: "Dr. Hendra", role: "Academic & Data Analyst", rating: 4.9, projects: 210, image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300" }
];

const tickerMessages = [
  "Baru saja: Skripsi Bab 1-3 diselesaikan oleh Expert Budi dalam 2 Hari!",
  "Baru saja: Aplikasi Kasir React dipesan dengan garansi 100% bug-free.",
  "Baru saja: Siska UI/UX menyelesaikan desain logo startup dalam 24 jam!"
];

const JokiView = () => {
  const [budget, setBudget] = useState(250000);
  const [taskType, setTaskType] = useState('umum');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);

  const handleConsult = (expert) => {
    const event = new CustomEvent('open-nex-chatbot', {
      detail: {
        message: `Halo, saya ingin berkonsultasi tentang tugas dengan ${expert.name}!`,
        expertName: expert.name,
        role: expert.role
      }
    });
    window.dispatchEvent(event);
  };
  
  // Ticker animation state
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Determine recommendation based on budget
  const getRecommendation = () => {
    if (budget < 100000) return { title: "Tugas Ringan", desc: "Rangkuman, Edit Ringan. Waktu pengerjaan santai 2-3 Hari.", color: "#4CAF50" };
    if (budget < 350000) return { title: "Tugas Standar", desc: "Makalah, Desain Dasar, Mini Coding. Waktu 1-2 Hari.", color: "#2196F3" };
    if (budget < 700000) return { title: "Proyek Menengah", desc: "Aplikasi Web Sederhana, UI/UX Menengah. Prioritas Sedang.", color: "#FF9800" };
    return { title: "Proyek Kompleks / Express", desc: "Full-stack, Riset Mendalam. Dedicated Expert & Support Prioritas.", color: "#E91E63" };
  };

  const rec = getRecommendation();

  const handleSelectExpert = (expert) => {
    setSelectedExpert(expert);
    setDescription(`[Tolong serahkan tugas ini kepada ${expert.name}] \n\nDetail tugas saya: `);
    document.getElementById('ajukan-tugas').scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessModal(true);
      // Reset form
      setDescription('');
      setName('');
      setPhone('');
      setBudget(250000);
      setSelectedExpert(null);
    }, 1500);
  };

  return (
    <div className="joki-view-container" style={{ paddingBottom: '4rem' }}>
      
      {/* Premium Hero Section */}
      <div className="joki-hero-premium">
        <div className="joki-hero-content">
          <div className="joki-badge"><FaStar style={{color: '#FFD700', marginRight: '5px'}}/> Layanan Bintang 5 Terpercaya</div>
          <h1 className="joki-title">Selesaikan Tugas Anda dengan <span>Super Cepat.</span></h1>
          <p className="joki-subtitle">Platform bantuan akademik dan profesional elit. 100% Rahasia Terjamin. Tidak ada plagiasi, dikerjakan oleh para expert industri dan akademisi terpilih.</p>
          
          <div className="joki-hero-stats">
            <div className="stat-item"><FaCheckCircle className="stat-icon"/> <span>10k+ Klien Puas</span></div>
            <div className="stat-item"><FaCheckCircle className="stat-icon"/> <span>Revisi Unlimited</span></div>
            <div className="stat-item"><FaCheckCircle className="stat-icon"/> <span>Garansi Uang Kembali</span></div>
          </div>
          
          <button className="btn btn-primary joki-cta-btn" onClick={() => document.getElementById('ajukan-tugas').scrollIntoView({ behavior: 'smooth' })}>
            Konsultasikan Sekarang <FaRocket style={{ marginLeft: '10px' }}/>
          </button>
        </div>
      </div>

      {/* Live Notification Ticker */}
      <div className="joki-ticker-wrapper">
        <div className="joki-ticker">
          <FaBolt color="#FFD700" />
          <span key={tickerIndex} className="ticker-text">{tickerMessages[tickerIndex]}</span>
        </div>
      </div>

      {/* Advanced Budget Calculator */}
      <div className="joki-section">
        <div className="budget-calculator-premium glass">
          <div className="budget-header">
            <h3>Sesuaikan Budget, Kami Tentukan Layanan Terbaik</h3>
            <p>Geser slider di bawah ini untuk melihat apa yang bisa Anda dapatkan.</p>
          </div>
          
          <div className="budget-interactive-area">
            <div className="budget-value-display" style={{ color: rec.color, textShadow: `0 0 20px ${rec.color}40` }}>
              {formatRupiah(budget)}
            </div>

            <div className="slider-container-premium">
              <input 
                type="range" 
                min="50000" 
                max="2000000" 
                step="50000" 
                value={budget} 
                onChange={(e) => setBudget(Number(e.target.value))}
                className="premium-slider"
                style={{ 
                  background: `linear-gradient(90deg, ${rec.color} ${(budget/2000000)*100}%, rgba(255,255,255,0.1) ${(budget/2000000)*100}%)` 
                }}
              />
              <div className="slider-labels">
                <span>Rp 50rb</span>
                <span>Rp 2 Juta+</span>
              </div>
            </div>

            <div className="budget-recommendation-card" style={{ borderLeftColor: rec.color, background: `${rec.color}15` }}>
              <h4 style={{ color: rec.color }}>{rec.title}</h4>
              <p>{rec.desc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Experts Portfolio */}
      <div className="joki-section">
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>Pilih <span>Expert</span> Favorit Anda</h2>
        <div className="joki-experts-grid">
          {expertJokis.map(expert => (
            <div key={expert.id} className="expert-card glass" style={{ border: selectedExpert?.id === expert.id ? '2px solid var(--accent)' : '1px solid rgba(255,255,255,0.1)' }}>
              <div className="expert-image" style={{ backgroundImage: `url(${expert.image})`, position: 'relative' }}>
                <div className="online-badge-joki" style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(11, 12, 16, 0.8)', border: '1px solid rgba(76, 175, 80, 0.4)', borderRadius: '20px', padding: '3px 10px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem', color: 'white', fontWeight: 'bold' }}>
                  <span style={{ display: 'inline-block', width: '6px', height: '6px', background: '#4CAF50', borderRadius: '50%', boxShadow: '0 0 8px #4CAF50', animation: 'ping 1s infinite alternate' }}></span>
                  Online
                </div>
              </div>
              <div className="expert-info">
                <h3>{expert.name}</h3>
                <p className="expert-role">{expert.role}</p>
                <div className="expert-stats">
                  <span className="expert-rating"><FaStar color="#FFD700" /> {expert.rating}</span>
                  <span className="expert-projects">{expert.projects} Tugas Selesai</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
                  <button 
                    className={`btn ${selectedExpert?.id === expert.id ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: 1.2, borderRadius: '20px', fontSize: '0.75rem', padding: '0.6rem 0.4rem' }}
                    onClick={() => handleSelectExpert(expert)}
                  >
                    {selectedExpert?.id === expert.id ? <><FaCheck /> Selected</> : 'Pilih Expert'}
                  </button>
                  <button 
                    className="btn btn-outline"
                    style={{ flex: 0.8, borderRadius: '20px', borderColor: 'var(--accent)', color: 'var(--accent)', fontSize: '0.75rem', padding: '0.6rem 0.4rem' }}
                    onClick={() => handleConsult(expert)}
                  >
                    Konsul
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modern Form Section */}
      <div id="ajukan-tugas" className="joki-section">
        <div className="joki-form-premium glass" style={{ borderTop: selectedExpert ? '4px solid var(--accent)' : '1px solid rgba(255,255,255,0.1)' }}>
          <div className="form-header">
            <h2>Kirim Detail <span>Tugas</span> Anda</h2>
            {selectedExpert ? (
              <p style={{ color: 'var(--accent)' }}>Anda telah memilih <strong>{selectedExpert.name}</strong> untuk mengerjakan tugas ini.</p>
            ) : (
              <p>Isi formulir di bawah ini. Tim kami siap merespons dalam hitungan menit.</p>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="premium-form">
            
            {/* 2-Column Grid for Personal Info */}
            <div className="form-row">
              <div className="form-group">
                <label>Nama Lengkap</label>
                <div className="input-with-icon">
                  <FaUserAlt className="input-icon" />
                  <input 
                    type="text" 
                    placeholder="Contoh: Budi Santoso"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Nomor WhatsApp</label>
                <div className="input-with-icon">
                  <FaPhoneAlt className="input-icon" />
                  <input 
                    type="tel" 
                    placeholder="Contoh: 081234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Kategori Layanan</label>
              <select value={taskType} onChange={(e) => setTaskType(e.target.value)} className="premium-select" required>
                <option value="umum">Tugas Umum / Rangkuman</option>
                <option value="coding">Pemrograman / Website / Aplikasi</option>
                <option value="desain">Desain Grafis / UIUX</option>
                <option value="makalah">Makalah / Jurnal / Skripsi</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Deskripsi Tugas & Tenggat Waktu (Deadline)</label>
              <textarea 
                rows="5" 
                placeholder="Ceritakan sejelas mungkin. Contoh: Tolong buatkan aplikasi React untuk kasir. Deadline hari Jumat jam 2 siang..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="premium-textarea"
                required
              ></textarea>
            </div>

            <div className="form-summary">
              <div className="summary-text">
                <span className="summary-label">Estimasi Budget yang Anda Tetapkan:</span>
                <span className="summary-value" style={{ color: rec.color }}>{formatRupiah(budget)}</span>
              </div>
              <button type="submit" className="btn btn-primary submit-joki-btn" disabled={isSubmitting}>
                {isSubmitting ? (
                  <><div className="spin-icon"><FaRocket /></div> Memproses Data...</>
                ) : (
                  <>Kirim ke Expert <FaPaperPlane style={{ marginLeft: '10px' }}/></>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Custom Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay active" style={{ zIndex: 5000 }}>
          <div className="app-modal glass" style={{ maxWidth: '400px', textAlign: 'center', padding: '3rem 2rem', border: '1px solid var(--accent)' }}>
            <button className="close-btn" onClick={() => setShowSuccessModal(false)}>
              <FaTimes />
            </button>
            <div style={{ fontSize: '4rem', color: 'var(--accent)', marginBottom: '1rem', animation: 'bounceIn 0.5s ease' }}>
              <FaCheckCircle />
            </div>
            <h2 style={{ color: 'white', marginBottom: '1rem' }}>Tugas Diterima!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
              Rincian tugas Anda telah masuk ke dalam antrean sistem prioritas kami. Expert akan menganalisis kebutuhan Anda.
            </p>
            <button className="btn btn-primary" onClick={() => setShowSuccessModal(false)} style={{ width: '100%', borderRadius: '25px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
              <FaRegComments /> Hubungi Saya di WA
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default JokiView;
