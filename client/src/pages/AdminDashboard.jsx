import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'users' | 'banners'
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Product Modal Form State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  // Banner Modal Form State
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [bannerImagePreview, setBannerImagePreview] = useState('');
  const bannerFileInputRef = useRef(null);
  const [bannerFormData, setBannerFormData] = useState({
    title: '',
    caption: '',
    image: ''
  });

  const defaultFormData = {
    name: '',
    description: '',
    price: '',
    rentPricePerDay: '',
    category: 'Wheelchair',
    subCategory: 'equipment',
    image: '',
    isTrending: false,
    inStock: true,
    requiresPrescription: false
  };

  const [formData, setFormData] = useState(defaultFormData);

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
      const [resOrders, resProducts, resUsers, resBanners] = await Promise.all([
        API.get('/orders').catch(e => ({ data: [] })),
        API.get('/products').catch(e => ({ data: [] })),
        API.get('/auth/users').catch(e => ({ data: [] })),
        API.get('/banners').catch(e => ({ data: [] }))
      ]);
      setOrders(Array.isArray(resOrders?.data) ? resOrders.data : []);
      setProducts(Array.isArray(resProducts?.data) ? resProducts.data : []);
      setUsersList(Array.isArray(resUsers?.data) ? resUsers.data : []);
      setBanners(Array.isArray(resBanners?.data) ? resBanners.data : []);
    } catch (error) {
      console.error('Error loading admin dashboard data:', error);
      setOrders([]);
      setProducts([]);
      setUsersList([]);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedDatabase = async () => {
    if (!window.confirm('Do you want to re-seed initial products and banners into MongoDB?')) return;
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

  // Image file upload handler for Products
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (jpg, png, gif, webp, svg).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('image', file);

      const { data } = await API.post('/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setFormData(prev => ({ ...prev, image: data.imageUrl }));
    } catch (error) {
      alert('Image upload failed: ' + (error.response?.data?.error || error.message));
      setImagePreview('');
    } finally {
      setUploading(false);
    }
  };

  // Image file upload handler for Hero Banners / Pamphlets
  const handleBannerImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setBannerImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    setBannerUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('image', file);

      const { data } = await API.post('/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setBannerFormData(prev => ({ ...prev, image: data.imageUrl }));
    } catch (error) {
      alert('Banner image upload failed: ' + (error.response?.data?.error || error.message));
      setBannerImagePreview('');
    } finally {
      setBannerUploading(false);
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
      setFormData(defaultFormData);
      setImagePreview('');
      loadData();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to save product.');
    }
  };

  const handleSaveBanner = async (e) => {
    e.preventDefault();
    if (!bannerFormData.image) {
      alert('Please upload or provide an image URL for the banner.');
      return;
    }
    try {
      await API.post('/banners', bannerFormData);
      setShowBannerModal(false);
      setBannerFormData({ title: '', caption: '', image: '' });
      setBannerImagePreview('');
      loadData();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to save hero banner.');
    }
  };

  const handleDeleteBanner = async (bannerId) => {
    if (!window.confirm('Are you sure you want to remove this hero banner/pamphlet?')) return;
    try {
      await API.delete(`/banners/${bannerId}`);
      loadData();
    } catch (error) {
      alert('Failed to delete hero banner.');
    }
  };

  const openEditModal = (prod) => {
    setEditingId(prod._id);
    setFormData({
      name: prod.name,
      description: prod.description,
      price: prod.price,
      rentPricePerDay: prod.rentPricePerDay || '',
      category: prod.category,
      subCategory: prod.subCategory || 'equipment',
      image: prod.image || '',
      isTrending: prod.isTrending || false,
      inStock: prod.inStock !== undefined ? prod.inStock : true,
      requiresPrescription: prod.requiresPrescription || false
    });
    setImagePreview(prod.image || '');
    setShowProductModal(true);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData(defaultFormData);
    setImagePreview('');
    setShowProductModal(true);
  };

  const openAddBannerModal = () => {
    setBannerFormData({ title: '', caption: '', image: '' });
    setBannerImagePreview('');
    setShowBannerModal(true);
  };

  if (!isAdmin) return null;

  const totalRevenue = orders.reduce((acc, o) => acc + (o.status !== 'cancelled' ? o.totalPrice : 0), 0);
  const currentPreview = imagePreview || formData.image || '';
  const currentBannerPreview = bannerImagePreview || bannerFormData.image || '';

  return (
    <div className="container" style={{ padding: '3rem 1.25rem' }}>
      {/* Top Header & Quick Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem' }}>Admin Control Center</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage products, orders, hero banners, users & database</p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={handleSeedDatabase}>
            <i className="fa-solid fa-database"></i> Seed MongoDB Data
          </button>

          <button className="btn btn-secondary" onClick={openAddBannerModal}>
            <i className="fa-solid fa-image"></i> Add Hero Banner / Pamphlet
          </button>

          <button className="btn btn-primary" onClick={openAddModal}>
            <i className="fa-solid fa-plus"></i> Add New Product
          </button>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '2rem' }}>
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
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Hero Banners</span>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)' }}>{banners.length}</h2>
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
        <button className={`filter-btn ${activeTab === 'banners' ? 'active' : ''}`} onClick={() => setActiveTab('banners')}>
          Hero Banners & Pamphlets ({banners.length})
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
                <th>Status</th>
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
                  <td>{prod.rentPricePerDay ? `₹${prod.rentPricePerDay}/day` : 'N/A'}</td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem' }}>
                      {prod.isTrending && <span style={{ color: 'var(--accent)' }}>🔥 Trending</span>}
                      <span style={{ color: prod.inStock ? 'var(--success)' : 'var(--danger)' }}>
                        {prod.inStock !== false ? '✅ In Stock' : '❌ Out of Stock'}
                      </span>
                      {prod.requiresPrescription && <span style={{ color: 'var(--primary)' }}>📋 Rx Required</span>}
                    </div>
                  </td>
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
      ) : activeTab === 'banners' ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Homepage Hero Slider & Promotional Pamphlets</h3>
            <button className="btn btn-primary btn-sm" onClick={openAddBannerModal}>
              <i className="fa-solid fa-plus"></i> Upload New Banner
            </button>
          </div>

          {banners.length === 0 ? (
            <div className="form-card" style={{ margin: '2rem auto', textAlign: 'center' }}>
              <i className="fa-solid fa-images" style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '1rem' }}></i>
              <h3>No Custom Hero Banners Added</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
                Add your own branding photos, announcement pamphlets, or special rental offers to show in the home page slider!
              </p>
              <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={openAddBannerModal}>
                Upload First Banner
              </button>
            </div>
          ) : (
            <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              {banners.map((b, idx) => (
                <div key={b._id} className="form-card" style={{ margin: 0, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ position: 'relative', height: '180px', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                    <img src={b.image} alt={b.title || `Banner ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span className="badge" style={{ position: 'absolute', top: '8px', left: '8px', background: 'var(--primary)' }}>
                      Slide #{idx + 1}
                    </span>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem' }}>{b.title || 'Untitled Banner'}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>{b.caption || 'No caption'}</p>
                  </div>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ color: 'var(--danger)', marginTop: 'auto', alignSelf: 'flex-end' }}
                    onClick={() => handleDeleteBanner(b._id)}
                  >
                    <i className="fa-solid fa-trash"></i> Remove Slide
                  </button>
                </div>
              ))}
            </div>
          )}
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
          <div className="form-card" style={{ margin: 0, width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSaveProduct} style={{ marginTop: '1rem' }}>

              {/* Image Upload Section */}
              <div className="form-group">
                <label className="form-label">Product Image</label>
                <div
                  className="image-upload-area"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {currentPreview ? (
                    <div>
                      <img
                        src={currentPreview}
                        alt="Product preview"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {uploading ? 'Uploading...' : 'Click to change image'}
                      </p>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      {uploading ? (
                        <i className="fa-solid fa-spinner fa-spin"></i>
                      ) : (
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                      )}
                      <span style={{ fontWeight: 600 }}>
                        {uploading ? 'Uploading image...' : 'Click to upload product image'}
                      </span>
                      <span style={{ fontSize: '0.8rem' }}>JPG, PNG, GIF, WebP — max 5MB</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                />
              </div>

              {/* OR paste URL */}
              <div className="form-group">
                <label className="form-label">Or Paste Image URL</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={(e) => {
                    setFormData({ ...formData, image: e.target.value });
                    setImagePreview(e.target.value);
                  }}
                />
              </div>

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
                  <input type="number" className="form-control" placeholder="0 if not for rent" value={formData.rentPricePerDay} onChange={(e) => setFormData({ ...formData, rentPricePerDay: e.target.value })} />
                </div>
              </div>

              {/* Checkboxes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1rem' }}>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 0 }}>
                  <input type="checkbox" id="trendingCheck" checked={formData.isTrending} onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })} />
                  <label htmlFor="trendingCheck" className="form-label" style={{ margin: 0 }}>🔥 Mark as Trending Item</label>
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 0 }}>
                  <input type="checkbox" id="inStockCheck" checked={formData.inStock} onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })} />
                  <label htmlFor="inStockCheck" className="form-label" style={{ margin: 0 }}>✅ In Stock</label>
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 0 }}>
                  <input type="checkbox" id="rxCheck" checked={formData.requiresPrescription} onChange={(e) => setFormData({ ...formData, requiresPrescription: e.target.checked })} />
                  <label htmlFor="rxCheck" className="form-label" style={{ margin: 0 }}>📋 Requires Doctor Prescription</label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary btn-full" disabled={uploading}>
                  {uploading ? <><i className="fa-solid fa-spinner fa-spin"></i> Uploading...</> : 'Save Product'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => { setShowProductModal(false); setImagePreview(''); }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Add Hero Banner / Pamphlet */}
      {showBannerModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="form-card" style={{ margin: 0, width: '100%', maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3>Upload Hero Banner / Pamphlet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              This image will be added to the auto-sliding carousel on the main homepage.
            </p>
            <form onSubmit={handleSaveBanner}>

              {/* Banner Image Upload Area */}
              <div className="form-group">
                <label className="form-label">Banner Image *</label>
                <div
                  className="image-upload-area"
                  onClick={() => bannerFileInputRef.current?.click()}
                >
                  {currentBannerPreview ? (
                    <div>
                      <img
                        src={currentBannerPreview}
                        alt="Banner preview"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {bannerUploading ? 'Uploading...' : 'Click to change image'}
                      </p>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      {bannerUploading ? (
                        <i className="fa-solid fa-spinner fa-spin"></i>
                      ) : (
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                      )}
                      <span style={{ fontWeight: 600 }}>
                        {bannerUploading ? 'Uploading banner image...' : 'Click to upload banner photo'}
                      </span>
                      <span style={{ fontSize: '0.8rem' }}>Pamphlets, offers, branded graphics (max 5MB)</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={bannerFileInputRef}
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleBannerImageUpload}
                />
              </div>

              {/* OR paste Image URL */}
              <div className="form-group">
                <label className="form-label">Or Paste Image URL</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="https://example.com/banner.jpg"
                  value={bannerFormData.image}
                  onChange={(e) => {
                    setBannerFormData({ ...bannerFormData, image: e.target.value });
                    setBannerImagePreview(e.target.value);
                  }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Banner Headline / Title (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 20% Off Hospital Beds Rent"
                  value={bannerFormData.title}
                  onChange={(e) => setBannerFormData({ ...bannerFormData, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subtitle / Caption (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Valid until end of month in Navi Mumbai"
                  value={bannerFormData.caption}
                  onChange={(e) => setBannerFormData({ ...bannerFormData, caption: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary btn-full" disabled={bannerUploading}>
                  {bannerUploading ? <><i className="fa-solid fa-spinner fa-spin"></i> Uploading...</> : 'Save & Publish Banner'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => { setShowBannerModal(false); setBannerImagePreview(''); }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
