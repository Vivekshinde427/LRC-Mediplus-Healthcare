import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, updateRentDuration, clearCart, totalAmount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState(user?.address || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [prescriptionUrl, setPrescriptionUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Please log in or register to place your order.');
      navigate('/login');
      return;
    }

    if (!address.trim() || !phone.trim()) {
      alert('Please fill in your delivery address and contact phone number.');
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        items: cartItems.map(item => ({
          product: item.product._id,
          name: item.name,
          quantity: item.quantity,
          option: item.option,
          rentDurationMonths: item.rentDurationMonths,
          price: item.price
        })),
        totalPrice: totalAmount,
        deliveryAddress: address,
        phone: phone,
        paymentMethod,
        prescriptionUrl
      };

      await API.post('/orders', orderPayload);
      clearCart();
      setOrderSuccess(true);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="container" style={{ padding: '5rem 1.25rem', textAlign: 'center' }}>
        <div className="form-card" style={{ maxWidth: '560px' }}>
          <i className="fa-solid fa-circle-check" style={{ fontSize: '4rem', color: 'var(--success)', marginBottom: '1rem' }}></i>
          <h2>Order Placed Successfully!</h2>
          <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>
            Thank you for choosing LRC Medi+ Healthcare. We have received your order request and our team will contact you shortly to confirm delivery details.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link to="/profile" className="btn btn-primary">
              View Order History
            </Link>
            <Link to="/" className="btn btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 1.25rem', textAlign: 'center' }}>
        <i className="fa-solid fa-cart-shopping" style={{ fontSize: '4rem', color: 'var(--text-muted)', marginBottom: '1rem' }}></i>
        <h2>Your Cart is Empty</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>
          Browse our store for wheelchairs, hospital beds, and medicines.
        </p>
        <Link to="/store" className="btn btn-primary">
          Explore Equipment Store
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.25rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Shopping Cart & Rental Checkout</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2rem' }}>
        {/* Items List */}
        <div>
          {cartItems.map((item, idx) => (
            <div
              key={`${item.product._id}-${item.option}-${idx}`}
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                marginBottom: '1rem',
                display: 'flex',
                gap: '1rem',
                alignItems: 'center'
              }}
            >
              <img
                src={item.product.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop'}
                alt={item.name}
                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
              />

              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '1.1rem' }}>{item.name}</h4>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '4px' }}>
                  <span className={`tag-${item.option === 'rent' ? 'rent' : 'trending'}`} style={{ position: 'static' }}>
                    {item.option === 'rent' ? `Rental (${item.rentDurationMonths} Month${item.rentDurationMonths > 1 ? 's' : ''})` : 'Purchase'}
                  </span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    ₹{item.price.toLocaleString('en-IN')} each
                  </span>
                </div>

                {/* Rental Month Adjuster */}
                {item.option === 'rent' && (
                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem' }}>Months:</label>
                    <select
                      value={item.rentDurationMonths}
                      className="form-control"
                      style={{ width: 'auto', padding: '4px 8px' }}
                      onChange={(e) => updateRentDuration(item.product._id, item.option, Number(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5, 6, 12].map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Quantity Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => updateQuantity(item.product._id, item.option, item.quantity - 1)}
                >
                  -
                </button>
                <span style={{ fontWeight: '700', minWidth: '24px', textAlign: 'center' }}>{item.quantity}</span>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => updateQuantity(item.product._id, item.option, item.quantity + 1)}
                >
                  +
                </button>
              </div>

              <div style={{ textAlign: 'right', minWidth: '100px' }}>
                <div style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--primary)' }}>
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </div>
                <button
                  onClick={() => removeFromCart(item.product._id, item.option)}
                  style={{ background: 'transparent', color: 'var(--danger)', fontSize: '0.85rem', marginTop: '4px' }}
                >
                  <i className="fa-solid fa-trash"></i> Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Delivery Details */}
        <div>
          <div className="form-card" style={{ margin: 0, maxWidth: '100%' }}>
            <h3 style={{ marginBottom: '1.25rem' }}>Order Summary</h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span>Total Items:</span>
              <strong>{cartItems.reduce((acc, i) => acc + i.quantity, 0)}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span>Delivery Fee:</span>
              <strong style={{ color: 'var(--success)' }}>FREE Doorstep Delivery</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px dashed var(--border-color)', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>Grand Total:</span>
              <strong style={{ fontSize: '1.6rem', color: 'var(--primary)' }}>
                ₹{totalAmount.toLocaleString('en-IN')}
              </strong>
            </div>

            <form onSubmit={handleCheckout}>
              <div className="form-group">
                <label className="form-label">Delivery Address *</label>
                <textarea
                  required
                  rows="3"
                  className="form-control"
                  placeholder="Enter full flat address, street, landmark, and pincode..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone Number *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Doctor Prescription URL (Optional)</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://drive.google.com/... or image link"
                  value={prescriptionUrl}
                  onChange={(e) => setPrescriptionUrl(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select
                  className="form-control"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="Cash on Delivery">Cash on Delivery (COD)</option>
                  <option value="UPI on Delivery">UPI / GooglePay on Delivery</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                style={{ marginTop: '1rem' }}
                disabled={submitting}
              >
                {submitting ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-check-double"></i>} Confirm & Place Order
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
