import React, { useState, useEffect } from 'react';
import API from '../services/api';
import ProductCard from '../components/common/ProductCard';

const CATEGORIES = [
  'All',
  'Wheelchair',
  'Hospital Beds',
  'Surgical Equipment',
  'Oxygen Concentrators',
  'Personal Care'
];

export default function StorePage() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [activeCategory, search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `/products?subCategory=equipment`;
      if (activeCategory !== 'All') {
        url += `&category=${encodeURIComponent(activeCategory)}`;
      }
      if (search.trim()) {
        url += `&search=${encodeURIComponent(search.trim())}`;
      }
      const { data } = await API.get(url);
      setProducts(data);
    } catch (error) {
      console.error('Error loading equipment store products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.25rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Medical Equipment Store</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Browse wheelchairs, hospital beds, oxygen concentrators, and surgical instruments available for buy or monthly rental.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="search-box">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            className="search-input"
            placeholder="Search equipment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2.5rem', color: 'var(--primary)' }}></i>
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Fetching equipment catalog...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="form-card" style={{ textAlignment: 'center', margin: '3rem auto' }}>
          <i className="fa-solid fa-box-open" style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '1rem' }}></i>
          <h3>No Equipment Found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            No equipment matching "{search || activeCategory}" was found in our database.
          </p>
        </div>
      ) : (
        <div className="grid-cards">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
