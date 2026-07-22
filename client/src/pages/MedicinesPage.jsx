import React, { useState, useEffect } from 'react';
import API from '../services/api';
import ProductCard from '../components/common/ProductCard';

const MEDICINE_CATEGORIES = [
  'All',
  'Pain Relief',
  'Vitamins & Supplements',
  'First Aid',
  'Antibiotics',
  'Diabetes Care'
];

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicines();
  }, [activeCategory, search]);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      let url = `/products?subCategory=medicine`;
      if (activeCategory !== 'All') {
        url += `&category=${encodeURIComponent(activeCategory)}`;
      }
      if (search.trim()) {
        url += `&search=${encodeURIComponent(search.trim())}`;
      }
      const { data } = await API.get(url);
      setMedicines(data);
    } catch (error) {
      console.error('Error loading medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1.25rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Medicines & Health Supplements</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Essential daily medicines, wellness supplements, emergency first aid kits, and prescription healthcare items.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="search-box">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            className="search-input"
            placeholder="Search medicine name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {MEDICINE_CATEGORIES.map((cat) => (
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
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading medicine catalog...</p>
        </div>
      ) : medicines.length === 0 ? (
        <div className="form-card" style={{ textAlign: 'center', margin: '3rem auto' }}>
          <i className="fa-solid fa-pills" style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '1rem' }}></i>
          <h3>No Medicines Found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            No products matching "{search || activeCategory}" were found.
          </p>
        </div>
      ) : (
        <div className="grid-cards">
          {medicines.map((item) => (
            <ProductCard key={item._id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
}
