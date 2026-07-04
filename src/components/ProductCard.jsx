import { useState } from 'react';
import { FaPlus, FaHeart, FaStar } from 'react-icons/fa';
import { formatRupiah } from '../utils';

const ProductCard = ({ product, onAddToCart, onClickCard }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlist = (e) => {
    e.stopPropagation(); // Prevent opening detail modal
    setIsWishlisted(!isWishlisted);
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  return (
    <div className="glass product-card" onClick={() => onClickCard(product)}>
      <button 
        className={`wishlist-btn ${isWishlisted ? 'active' : ''}`} 
        onClick={handleWishlist}
      >
        <FaHeart />
      </button>
      
      <div className="product-image-container">
        <span className="product-badge">{product.type}</span>
        <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
        <div className="product-card-overlay">
          <button className="btn-quick-view-card" onClick={(e) => { e.stopPropagation(); onClickCard(product); }}>
            Quick View
          </button>
        </div>
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-title">{product.name}</h3>
        {product.reviews && product.reviews.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#ffc107', marginBottom: '0.5rem' }}>
            <FaStar /> 
            <span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>
              {(product.reviews.reduce((acc, curr) => acc + curr.rating, 0) / product.reviews.length).toFixed(1)}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>({product.reviews.length})</span>
          </div>
        )}
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">{formatRupiah(product.price)}</span>
          <button className="btn btn-primary btn-sm" onClick={handleAdd}>
            <FaPlus /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
