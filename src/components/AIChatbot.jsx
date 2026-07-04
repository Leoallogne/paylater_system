import { useState, useRef, useEffect } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaRocket, FaCoffee } from 'react-icons/fa';

const AIChatbot = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Halo! Saya asisten AI NexStore. Ada yang bisa saya bantu hari ini? Anda bisa menanyakan produk, tugas joki, atau rekomendasi kafe.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    const handleOpenChat = (e) => {
      setIsOpen(true);
      if (e.detail?.message) {
        setMessages(prev => [
          ...prev, 
          { id: Date.now(), sender: 'user', text: e.detail.message }
        ]);
        
        // Custom reply simulation
        setTimeout(() => {
          setMessages(prev => [
            ...prev, 
            {
              id: Date.now() + 1,
              sender: 'bot',
              text: `Tentu! Saya akan menghubungkan Anda dengan ${e.detail.expertName} (${e.detail.role}). Beliau adalah ahli terbaik kami untuk tugas ini. Silakan tuliskan detail tugas dan tenggat waktu Anda di sini.`
            }
          ]);
        }, 1200);
      }
    };
    window.addEventListener('open-nex-chatbot', handleOpenChat);
    return () => window.removeEventListener('open-nex-chatbot', handleOpenChat);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = inputValue.trim();
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userMsg }]);
    setInputValue('');

    // Simulate AI thinking
    setTimeout(() => {
      let botResponse = 'Maaf, saya tidak mengerti. Coba tanyakan tentang "joki tugas", "rekomendasi kopi", atau "bantuan pembayaran".';
      
      const lowerMsg = userMsg.toLowerCase();
      
      if (lowerMsg.includes('joki') || lowerMsg.includes('tugas') || lowerMsg.includes('skripsi')) {
        botResponse = (
          <span>
            Kami memiliki layanan Joki Tugas elit yang siap membantu Anda dengan rahasia terjamin! Silakan kunjungi halaman <button onClick={() => onNavigate('joki')} className="chat-link-btn"><FaRocket /> Joki Tugas</button> kami.
          </span>
        );
      } else if (lowerMsg.includes('kopi') || lowerMsg.includes('kafe') || lowerMsg.includes('wfc') || lowerMsg.includes('nongkrong')) {
        botResponse = (
          <span>
            Sedang mencari tempat WFC atau nongkrong? Cek rekomendasi premium kami di halaman <button onClick={() => onNavigate('coffee')} className="chat-link-btn"><FaCoffee /> Coffee Shop</button>. Anda juga bisa langsung reservasi meja!
          </span>
        );
      } else if (lowerMsg.includes('halo') || lowerMsg.includes('hai')) {
        botResponse = 'Halo juga! Senang bertemu dengan Anda. Ingin melihat daftar layanan kami?';
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: botResponse }]);
    }, 1000);
  };

  return (
    <>
      <div className={`chat-widget-btn ${isOpen ? 'hidden' : ''}`} onClick={() => setIsOpen(true)}>
        <FaRobot className="bot-icon" />
      </div>

      <div className={`chat-window-premium ${isOpen ? 'active' : ''}`}>
        <div className="chat-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="bot-avatar"><FaRobot /></div>
            <div>
              <h4 style={{ margin: 0, fontSize: '1rem' }}>NexStore AI</h4>
              <span style={{ fontSize: '0.75rem', color: '#4CAF50', display: 'flex', alignItems: 'center', gap: '4px' }}><span className="online-dot"></span> Online</span>
            </div>
          </div>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            <FaTimes />
          </button>
        </div>

        <div className="chat-body">
          {messages.map(msg => (
            <div key={msg.id} className={`chat-bubble-wrapper ${msg.sender}`}>
              <div className="chat-bubble">
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-footer">
          <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <input 
              type="text" 
              placeholder="Ketik pesan..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="chat-input"
            />
            <button type="submit" className="chat-send-btn">
              <FaPaperPlane />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AIChatbot;
