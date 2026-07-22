import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchMyOrders();
  }, [user]);

  const fetchMyOrders = async () => {
    try {
      const { data } = await API.get('/orders/myorders');
      setOrders(data);
    } catch (error) {
      console.error('Error fetching user orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await updateProfile({ name, phone, address });
      setMsg('Profile information updated successfully!');
    } catch (error) {
      setMsg('Failed to update profile.');
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await API.put(`/orders/${orderId}/cancel`);
      fetchMyOrders();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to cancel order.');
    }
  };

  if (!user) return null;

  return (
    <div className="container" style={{ padding: '3rem 1.25rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>User Dashboard & Account</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Profile Card & Settings */}
        <div>
          <div className="form-card" style={{ margin: 0, maxWidth: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div className="brand-icon" style={{ margin: '0 auto 10px', width: '60px', height: '60px', fontSize: '1.8rem' }}>
                <i className="fa-solid fa-user-astronaut"></i>
              </div>
              <h3 style={{ fontSize: '1.3rem' }}>{user.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{user.email}</p>
              <span className="badge" style={{ position: 'static', display: 'inline-block', marginTop: '6px', padding: '4px 12px', background: user.role === 'admin' ? 'var(--accent)' : 'var(--primary)', width: 'auto', height: 'auto' }}>
                {user.role.toUpperCase()}
              </span>
            </div>

            {msg && (
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', border: '1px solid var(--success)', padding: '10px', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.88rem' }}>
                {msg}
              </div>
            )}

            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Delivery Address</label>
                <textarea
                  rows="3"
                  className="form-control"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-full">
                Save Changes
              </button>
            </form>

            <button
              onClick={() => { logout(); navigate('/'); }}
              className="btn btn-secondary btn-full"
              style={{ marginTop: '1rem', color: 'var(--danger)' }}
            >
              <i className="fa-solid fa-right-from-bracket"></i> Sign Out
            </button>
          </div>
        </div>

        {/* Order History */}
        <div>
          <h2 style={{ marginBottom: '1.25rem', fontSize: '1.5rem' }}>My Orders & Rentals History</h2>

          {loadingOrders ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--primary)' }}></i>
            </div>
          ) : orders.length === 0 ? (
            <div className="form-card" style={{ margin: 0, maxWidth: '100%', textAlign: 'center' }}>
              <i className="fa-solid fa-box-open" style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '1rem' }}></i>
              <h3>No Active Orders</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>
                You haven't placed any order or equipment rental yet.
              </p>
            </div>
          ) : (
            orders.map(order => (
              <div
                key={order._id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  marginBottom: '1rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px dashed var(--border-color)' }}>
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Order #{order._id.substring(order._id.length - 8).toUpperCase()}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      textTransform: 'uppercase',
                      backgroundColor: order.status === 'delivered' ? 'rgba(16, 185, 129, 0.2)' : order.status === 'cancelled' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      color: order.status === 'delivered' ? 'var(--success)' : order.status === 'cancelled' ? 'var(--danger)' : 'var(--accent)'
                    }}
                  >
                    {order.status}
                  </span>
                </div>

                <div style={{ marginBottom: '10px' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px' }}>
                      <span>
                        {item.name} x {item.quantity} ({item.option.toUpperCase()})
                      </span>
                      <strong>₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.9rem' }}>Delivery: <strong>{order.deliveryAddress}</strong></span>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <strong style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>
                      Total: ₹{order.totalPrice.toLocaleString('en-IN')}
                    </strong>
                    {order.status === 'pending' && (
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ color: 'var(--danger)' }}
                        onClick={() => handleCancelOrder(order._id)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
