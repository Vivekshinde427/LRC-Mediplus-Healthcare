import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'users'
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Product Modal Form State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    rentPricePerMonth: '',
    category: 'Wheelchair',
    subCategory: 'equipment',
    image: '',
    isTrending: false
  });

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/login');
      return;
    }
    loadData();
  }, [user, isAdmin]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resOrders, resProducts, resUsers] = await Promise.all([
        API.get('/orders'),
        API.get('/products'),
        API.get('/auth/users')
      ]);
      setOrders(resOrders.data);
      setProducts(resProducts.data);
      setUsersList(resUsers.data);
    } catch (error) {
      console.error('Error loading admin dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedDatabase = async () => {
    if (!window.confirm('Do you want to re-seed initial products into MongoDB?')) return;
    try {
      const { data } = await API.post('/seed');
      alert(`Success: ${data.message} (${data.productCount} products populated).`);
      loadData();
    } catch (error) {
      alert('Error seeding database: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status: newStatus });
      loadData();
    } catch (error) {
      alert('Failed to update status.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await API.delete(`/products/${productId}`);
      loadData();
    } catch (error) {
      alert('Failed to delete product.');
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/products/${editingId}`, formData);
      } else {
        await API.post('/products', formData);
      }
      setShowProductModal(false);
      setEditingId(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        rentPricePerMonth: '',
        category: 'Wheelchair',
        subCategory: 'equipment',
        image: '',
        isTrending: false
      });
      loadData();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to save product.');
    }
  };

  const openEditModal = (prod) => {
    setEditingId(prod._id);
    setFormData({
      name: prod.name,
      description: prod.description,
      price: prod.price,
      rentPricePerMonth: prod.rentPricePerMonth || '',
      category: prod.category,
      subCategory: prod.subCategory || 'equipment',
      image: prod.image || '',
      isTrending: prod.isTrending || false
    });
    setShowProductModal(true);
  };

  if (!isAdmin) return null;

  const totalRevenue = orders.reduce((acc, o) => acc + (o.status !== 'cancelled' ? o.totalPrice : 0), 0);

  return (
    <div className="container" style={{ padding: '3rem 1.25rem' }}>
      {/* Top Header & Quick Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem' }}>Admin Control Center</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage products, orders, rental plans, users & database</p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={handleSeedDatabase}>
            <i className="fa-solid fa-database"></i> Seed MongoDB Data
          </button>

          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingId(null);
              setFormData({
                name: '',
                description: '',
                price: '',
                rentPricePerMonth: '',
                category: 'Wheelchair',
                subCategory: 'equipment',
                image: '',
                isTrending: false
              });
              setShowProductModal(true);
            }}
          >
            <i className="fa-solid fa-plus"></i> Add New Product
          </button>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '2rem' }}>
        <div className="form-card" style={{ margin: 0, padding: '1.25rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Revenue</span>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)' }}>₹{totalRevenue.toLocaleString('en-IN')}</h2>
        </div>

        <div className="form-card" style={{ margin: 0, padding: '1.25rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Orders</span>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--secondary)' }}>{orders.length}</h2>
        </div>

        <div className="form-card" style={{ margin: 0, padding: '1.25rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Active Products</span>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--accent)' }}>{products.length}</h2>
        </div>

        <div className="form-card" style={{ margin: 0, padding: '1.25rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Registered Users</span>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--success)' }}>{usersList.length}</h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="filter-bar">
        <button className={`filter-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
          Orders & Rentals ({orders.length})
        </button>
        <button className={`filter-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
          Products Catalog ({products.length})
        </button>
        <button className={`filter-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
          Users Database ({usersList.length})
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2.5rem', color: 'var(--primary)' }}></i>
        </div>
      ) : activeTab === 'orders' ? (
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Address / Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td><strong>#{order._id.substring(order._id.length - 6)}</strong></td>
                  <td>
                    {order.userName}<br />
                    <small style={{ color: 'var(--text-muted)' }}>{order.userEmail}</small>
                  </td>
                  <td>
                    {order.items.map((i, idx) => (
                      <div key={idx} style={{ fontSize: '0.85rem' }}>
                        • {i.name} x {i.quantity} ({i.option})
                      </div>
                    ))}
                  </td>
                  <td><strong>₹{order.totalPrice.toLocaleString('en-IN')}</strong></td>
                  <td>
                    <div style={{ fontSize: '0.85rem' }}>{order.deliveryAddress}</div>
                    <small style={{ color: 'var(--primary)' }}>📞 {order.phone}</small>
                  </td>
                  <td>
                    <select
                      className="form-control"
                      style={{ padding: '4px 8px', fontSize: '0.85rem' }}
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    {order.prescriptionUrl && (
                      <a href={order.prescriptionUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                        Rx Link
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : activeTab === 'products' ? (
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Buy Price</th>
                <th>Rent/Mo</th>
                <th>Trending</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(prod => (
                <tr key={prod._id}>
                  <td>
                    <img src={prod.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop'} alt={prod.name} style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '4px' }} />
                  </td>
                  <td><strong>{prod.name}</strong></td>
                  <td>{prod.category} ({prod.subCategory})</td>
                  <td>₹{prod.price.toLocaleString('en-IN')}</td>
                  <td>{prod.rentPricePerMonth ? `₹${prod.rentPricePerMonth}/mo` : 'N/A'}</td>
                  <td>{prod.isTrending ? '🔥 Yes' : 'No'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEditModal(prod)}>Edit</button>
                      <button className="btn btn-secondary btn-sm" style={{ color: 'var(--danger)' }} onClick={() => handleDeleteProduct(prod._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map(u => (
                <tr key={u._id}>
                  <td><strong>{u.name}</strong></td>
                  <td>{u.email}</td>
                  <td>{u.phone || 'N/A'}</td>
                  <td><span className="badge" style={{ position: 'static' }}>{u.role}</span></td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Add / Edit Product */}
      {showProductModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="form-card" style={{ margin: 0, width: '100%', maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSaveProduct} style={{ marginTop: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input type="text" required className="form-control" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <input type="text" required className="form-control" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">Sub-Category Type</label>
                <select className="form-control" value={formData.subCategory} onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}>
                  <option value="equipment">Medical Equipment</option>
                  <option value="medicine">Medicine</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea rows="3" required className="form-control" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Purchase Price (₹)</label>
                  <input type="number" required className="form-control" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Rent Price/Mo (₹)</label>
                  <input type="number" className="form-control" placeholder="0 if not for rent" value={formData.rentPricePerMonth} onChange={(e) => setFormData({ ...formData, rentPricePerMonth: e.target.value })} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input type="text" className="form-control" placeholder="https://..." value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" id="trendingCheck" checked={formData.isTrending} onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })} />
                <label htmlFor="trendingCheck" className="form-label" style={{ margin: 0 }}>Mark as Trending Item</label>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary btn-full">Save Product</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowProductModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
