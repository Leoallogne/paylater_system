import { useState } from 'react';
import { FaTimes, FaStar, FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { formatRupiah } from '../utils';

const ProductDetailModal = ({ product, isOpen, onClose, onAddToCart, onAddReview }) => {
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  if (!product) return null;

  const reviews = product.reviews || [];
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    onAddReview(product.id, {
      user: "Pengguna Demo", // Hardcoded current user
      rating: newRating,
      comment: newComment
    });
    
    setNewComment('');
    setNewRating(5);
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`}>
      <div className="app-modal" style={{ maxWidth: '800px' }}>
        <div className="modal-header">
          <h2>Detail Produk</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="modal-body detail-modal-body" style={{ flexDirection: 'column', gap: '2rem' }}>
          
          {/* Top Section: Product Info */}
          <div className="product-info-section" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <img src={product.image} alt={product.name} className="detail-modal-image" style={{ width: '100%', maxWidth: '300px', height: '300px' }} />
            
            <div className="detail-modal-info" style={{ flex: 1, minWidth: '250px' }}>
              <span className="product-category" style={{ fontSize: '0.9rem' }}>{product.category} &bull; {product.type}</span>
              <h3 style={{ fontSize: '1.5rem', margin: '0.5rem 0' }}>{product.name}</h3>
              
              <div className="detail-modal-rating" style={{ marginBottom: '1rem', color: '#ffc107', display: 'flex', alignItems: 'center' }}>
                <FaStar style={{ marginRight: '5px' }} /> 
                <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>{averageRating > 0 ? averageRating : 'Belum ada rating'}</span>
                {reviews.length > 0 && <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>({reviews.length} Ulasan)</span>}
              </div>
              
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', flexGrow: 1 }}>
                {product.description}
                <br /><br />
                <strong>Stok Tersedia:</strong> Sangat Terbatas<br />
                <strong>Garansi:</strong> 1 Tahun Resmi
              </p>
              
              <div className="detail-modal-price" style={{ fontSize: '1.8rem', color: 'var(--accent)', fontWeight: 'bold', margin: '1rem 0' }}>
                {formatRupiah(product.price)}
              </div>
              
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                style={{ width: '100%', padding: '1rem' }}
              >
                <FaShoppingCart /> Masukkan ke Keranjang
              </button>
            </div>
          </div>

          {/* Bottom Section: Reviews */}
          <div className="reviews-section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Ulasan Pembeli</h3>
            
            {/* List of Reviews */}
            <div className="reviews-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {reviews.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>Belum ada ulasan untuk produk ini. Jadilah yang pertama!</p>
              ) : (
                reviews.map(review => (
                  <div key={review.id} className="review-item" style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaUserCircle size={20} color="var(--text-muted)" />
                        <span style={{ fontWeight: '600' }}>{review.user}</span>
                      </div>
                      <div style={{ color: '#ffc107', display: 'flex' }}>
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} color={i < review.rating ? '#ffc107' : 'rgba(255,255,255,0.2)'} />
                        ))}
                      </div>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.4' }}>{review.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Review Form */}
            <div className="add-review-form" style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px' }}>
              <h4 style={{ marginBottom: '1rem' }}>Berikan Ulasan Anda</h4>
              <form onSubmit={handleSubmitReview}>
                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Rating:</label>
                  <select 
                    value={newRating} 
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '5px 10px', outline: 'none' }}
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                    <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                    <option value={3}>⭐⭐⭐ (3/5)</option>
                    <option value={2}>⭐⭐ (2/5)</option>
                    <option value={1}>⭐ (1/5)</option>
                  </select>
                </div>
                <textarea 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Ceritakan pengalaman Anda menggunakan produk ini..."
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', outline: 'none', minHeight: '80px', marginBottom: '1rem', fontFamily: 'inherit' }}
                  required
                ></textarea>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>
                  Kirim Ulasan
                </button>
              </form>
            </div>
            
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
