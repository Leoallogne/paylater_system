import { useState, useEffect } from 'react';
import { FaInfoCircle, FaHome, FaShoppingBag, FaUser, FaRocket, FaCoffee } from 'react-icons/fa';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import PaymentModal from './components/PaymentModal';
import ProductDetailModal from './components/ProductDetailModal';
import ProfileView from './components/ProfileView';
import JokiView from './components/JokiView';
import CoffeeView from './components/CoffeeView';
import FlashSale from './components/FlashSale';
import AIChatbot from './components/AIChatbot';
import { products as initialProducts } from './data';

function App() {
  const [productsData, setProductsData] = useState(initialProducts);
  const [activeTab, setActiveTab] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [isFiltering, setIsFiltering] = useState(false);
  
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [checkoutTotal, setCheckoutTotal] = useState(0);
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  // e-Wallet & Points Persistence State
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('nex_balance');
    return saved !== null ? Number(saved) : 12500000;
  });

  const [points, setPoints] = useState(() => {
    const saved = localStorage.getItem('nex_points');
    return saved !== null ? Number(saved) : 1250;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('nex_orders');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, name: 'Premium E-Book: Advanced Web Development', invoice: 'INV/20260624/MPL/133', date: '24 Jun 2026', price: 150000, status: 'Selesai', type: 'digital' },
      { id: 2, name: 'Sony WH-1000XM5 Wireless Headphones', invoice: 'INV/20260622/MPL/892', date: '22 Jun 2026', price: 5200000, status: 'Sedang Dikirim (JNE)', type: 'physical' },
      { id: 3, name: 'Mechanical Keyboard Keychron K2', invoice: 'INV/20260610/MPL/442', date: '10 Jun 2026', price: 1350000, status: 'Selesai', type: 'physical' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('nex_balance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('nex_points', points.toString());
  }, [points]);

  useEffect(() => {
    localStorage.setItem('nex_orders', JSON.stringify(orders));
  }, [orders]);

  // Extract unique categories for pills
  const categories = ['Semua', ...new Set(productsData.map(p => p.category))];

  // Filter products based on search term and active category
  const filteredProducts = productsData.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = activeCategory === 'Semua' || p.category === activeCategory;
    return matchSearch && matchCategory;
  });

  // Review System
  const handleAddReview = (productId, review) => {
    const newReview = {
      id: Date.now(),
      ...review
    };

    setProductsData(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, reviews: [...(p.reviews || []), newReview] };
      }
      return p;
    }));

    // Update selected product so modal reflects new review
    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct(prev => ({ ...prev, reviews: [...(prev.reviews || []), newReview] }));
    }

    showToast("Ulasan Anda berhasil ditambahkan!");
  };

  // Cart Functions
  const handleAddToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    showToast(`${product.name} ditambahkan ke keranjang!`);
  };

  const handleUpdateQuantity = (id, change) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + change;
          return { ...item, quantity: Math.max(0, newQty) };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const handleRemoveFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Toast System
  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  // Payment Success
  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false);
    
    // Deduct E-Wallet Balance
    setBalance(prev => prev - checkoutTotal);

    // Calculate & Add NexPoints Reward (e.g., 10% of total in points, or 1 point per 10k IDR)
    const pointsGained = Math.max(50, Math.round(checkoutTotal * 0.0001)); // 1 point per 10k IDR, min 50 points
    setPoints(prev => prev + pointsGained);

    // Add items to orders list
    const invoiceNum = 'INV/' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '/MPL/' + Math.floor(Math.random()*900 + 100);
    const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    
    const newOrders = cart.map(item => ({
      id: Date.now() + Math.random(),
      name: item.name,
      invoice: invoiceNum,
      date: dateStr,
      price: item.price,
      status: item.type === 'Digital' ? 'Selesai' : 'Sedang Dikemas',
      type: item.type.toLowerCase()
    }));

    setOrders(prev => [
      ...newOrders,
      ...prev
    ]);

    setCart([]);
    showToast(`Transaksi Sukses! +${pointsGained} NexPoints didapatkan.`);
  };

  return (
    <>
      <Header 
        onSearch={setSearchTerm} 
        cartCount={cartItemCount} 
        onOpenCart={() => setIsCartOpen(true)}
        onOpenProfile={() => setActiveTab('profile')}
      />

      <main>
        {activeTab === 'home' && (
          <>
            {/* Home Premium Hero */}
            <div className="home-hero-premium">
              <h1>Welcome to <span>NexStore</span></h1>
              <p>Platform marketplace premium dengan layanan terkurasi. Temukan produk digital, fisik, hingga jasa profesional dalam satu genggaman.</p>
            </div>

            <FlashSale />

            {/* Promo Banners 2-Column Grid */}
            <div className="promo-grid">
              <div className="promo-banner promo-joki" onClick={() => setActiveTab('joki')}>
                <div className="promo-content">
                  <h2>Butuh <span>Joki Tugas?</span></h2>
                  <p>Solusi instan untuk tugas kuliah, coding, hingga desain.</p>
                </div>
                <FaRocket className="promo-icon" />
              </div>
              
              <div className="promo-banner promo-coffee" onClick={() => setActiveTab('coffee')}>
                <div className="promo-content">
                  <h2>Cari <span>Coffee Shop?</span></h2>
                  <p>Eksplorasi WFC & specialty coffee terbaik di Karawang.</p>
                </div>
                <FaCoffee className="promo-icon" />
              </div>
            </div>
            
            <h1 className="section-title">Discover <span>Premium</span> Collection</h1>
            
            {/* Category Pills */}
            <div className="category-pills">
              {categories.map(cat => (
                <div 
                  key={cat} 
                  className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => {
                    setIsFiltering(true);
                    setActiveCategory(cat);
                    setTimeout(() => setIsFiltering(false), 450);
                  }}
                >
                  {cat}
                </div>
              ))}
            </div>

            <div className="product-grid">
              {isFiltering ? (
                <>
                  <div className="skeleton-card"></div>
                  <div className="skeleton-card"></div>
                  <div className="skeleton-card"></div>
                  <div className="skeleton-card"></div>
                </>
              ) : filteredProducts.length === 0 ? (
                <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', fontSize: '1.2rem' }}>
                  Tidak ada produk yang cocok dengan pencarian Anda.
                </p>
              ) : (
                filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={handleAddToCart}
                    onClickCard={(prod) => setSelectedProduct(prod)}
                  />
                ))
              )}
            </div>
          </>
        )}

        {activeTab === 'profile' && (
          <ProfileView 
            balance={balance} 
            setBalance={setBalance} 
            points={points} 
            setPoints={setPoints}
            orders={orders}
            _setOrders={setOrders}
            showToast={showToast}
          />
        )}

        {activeTab === 'joki' && (
          <JokiView />
        )}

        {activeTab === 'coffee' && (
          <CoffeeView />
        )}
      </main>

      {/* Global Modals */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={handleUpdateQuantity}
        removeFromCart={handleRemoveFromCart}
        onCheckout={(finalAmount) => {
          setCheckoutTotal(finalAmount);
          setIsCartOpen(false);
          setIsPaymentModalOpen(true);
        }}
      />

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={checkoutTotal}
        onSuccess={handlePaymentSuccess}
        cart={cart}
      />

      <ProductDetailModal 
        isOpen={!!selectedProduct}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onAddReview={handleAddReview}
      />

      {/* Bottom Navigation for Mobile */}
      <nav className="bottom-nav">
        <div 
          className={`bottom-nav-item ${activeTab === 'home' ? 'active' : ''}`} 
          onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        >
          <FaHome />
          <span>Home</span>
        </div>
        <div 
          className={`bottom-nav-item ${activeTab === 'joki' ? 'active' : ''}`} 
          onClick={() => { setActiveTab('joki'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        >
          <FaRocket />
          <span>Joki</span>
        </div>
        <div 
          className={`bottom-nav-item ${activeTab === 'coffee' ? 'active' : ''}`} 
          onClick={() => { setActiveTab('coffee'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        >
          <FaCoffee />
          <span>Coffee</span>
        </div>
        <div className="bottom-nav-item" onClick={() => setIsCartOpen(true)}>
          <FaShoppingBag />
          <span>Cart</span>
          {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
        </div>
        <div 
          className={`bottom-nav-item ${activeTab === 'profile' ? 'active' : ''}`} 
          onClick={() => { setActiveTab('profile'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        >
          <FaUser />
          <span>Profile</span>
        </div>
      </nav>

      <AIChatbot onNavigate={(tab) => { setActiveTab(tab); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />

      <div className={`toast ${toastVisible ? 'show' : ''}`}>
        <FaInfoCircle />
        <span>{toastMessage}</span>
      </div>
    </>
  );
}

export default App;
