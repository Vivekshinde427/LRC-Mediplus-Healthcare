import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useCart } from '../context/CartContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [option, setOption] = useState('buy');
  const [rentMonths, setRentMonths] = useState(1);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 1.25rem', textAlign: 'center' }}>
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2.5rem', color: 'var(--primary)' }}></i>
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading item details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '5rem 1.25rem', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/store')}>
          Back to Store
        </button>
      </div>
    );
  }

  const isRentalAvailable = product.rentPricePerMonth > 0;
  const unitPrice = option === 'rent' ? product.rentPricePerMonth * rentMonths : product.price;

  return (
    <div className="container" style={{ padding: '3rem 1.25rem' }}>
      <div className="product-detail-grid">
        {/* Product Image Display */}
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <img
            src={product.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=500&fit=crop'}
            alt={product.name}
            style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
          />
        </div>

        {/* Product Specs & Add to Cart Controls */}
        <div>
          <span className="product-category">{product.category}</span>
          <h1 style={{ fontSize: '2.5rem', margin: '8px 0' }}>{product.name}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '1.5rem', lineHeight: '1.7' }}>
            {product.description}
          </p>

          {/* Pricing Toggle Option */}
          <div className="form-card" style={{ margin: '0 0 1.5rem 0', maxWidth: '100%', padding: '1.5rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>Select Purchasing Mode</h4>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '1.25rem' }}>
              <button
                className={`btn btn-full ${option === 'buy' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setOption('buy')}
              >
                <i className="fa-solid fa-cart-shopping"></i> Buy Outright (₹{product.price.toLocaleString('en-IN')})
              </button>

              {isRentalAvailable && (
                <button
                  className={`btn btn-full ${option === 'rent' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setOption('rent')}
                >
                  <i className="fa-solid fa-clock-rotate-left"></i> Rent Monthly (₹{product.rentPricePerMonth.toLocaleString('en-IN')}/mo)
                </button>
              )}
            </div>

            {/* Rental Duration Selection */}
            {option === 'rent' && (
              <div className="form-group">
                <label className="form-label">Rental Duration (Months):</label>
                <select
                  className="form-control"
                  value={rentMonths}
                  onChange={(e) => setRentMonths(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6, 12].map(m => (
                    <option key={m} value={m}>{m} Month{m > 1 ? 's' : ''} (₹{(product.rentPricePerMonth * m).toLocaleString('en-IN')})</option>
                  ))}
                </select>
              </div>
            )}

            {/* Quantity */}
            <div className="form-group">
              <label className="form-label">Quantity:</label>
              <input
                type="number"
                min="1"
                max="10"
                className="form-control"
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
              />
            </div>

            {/* Total calculated price preview */}
            <div style={{ padding: '12px 0', borderTop: '1px dashed var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Total Price:</span>
              <strong style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>
                ₹{(unitPrice * qty).toLocaleString('en-IN')}
              </strong>
            </div>

            <button
              className="btn btn-primary btn-full"
              style={{ marginTop: '1rem' }}
              onClick={() => {
                addToCart(product, option, rentMonths, qty);
                navigate('/cart');
              }}
            >
              <i className="fa-solid fa-cart-plus"></i> Add to Cart & Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
