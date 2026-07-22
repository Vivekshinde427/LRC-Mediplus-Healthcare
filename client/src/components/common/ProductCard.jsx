import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const isRentalAvailable = product.rentPricePerMonth > 0;

  return (
    <div className="product-card">
      <div className="product-image-wrap">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=400&fit=crop'}
          alt={product.name}
          className="product-image"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=400&fit=crop';
          }}
        />
        {product.isTrending && <span className="tag-trending"><i className="fa-solid fa-fire"></i> Trending</span>}
        {isRentalAvailable && <span className="tag-rent"><i className="fa-solid fa-repeat"></i> Rent / Buy</span>}
      </div>

      <div className="product-body">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">
          <Link to={`/product/${product._id}`}>{product.name}</Link>
        </h3>
        <p className="product-desc">{product.description}</p>

        <div className="product-prices">
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Purchase Price</span>
            <span className="price-buy">₹{product.price.toLocaleString('en-IN')}</span>
          </div>
          {isRentalAvailable && (
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Monthly Rent</span>
              <span className="price-rent">₹{product.rentPricePerMonth.toLocaleString('en-IN')}/mo</span>
            </div>
          )}
        </div>

        <div className="product-actions">
          <button
            className="btn btn-primary btn-sm btn-full"
            onClick={() => addToCart(product, 'buy', 1, 1)}
          >
            <i className="fa-solid fa-cart-plus"></i> Buy Now
          </button>

          {isRentalAvailable && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => addToCart(product, 'rent', 1, 1)}
              title="Rent this equipment"
            >
              <i className="fa-solid fa-clock-rotate-left"></i> Rent
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
