import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../components/common/ProductCard';

export default function HomePage() {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data } = await API.get('/products?trending=true');
        setTrendingProducts(data);
      } catch (error) {
        console.error('Error fetching trending products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div>
      {/* Hero Banner Section */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div>
            <div className="hero-badge">
              <i className="fa-solid fa-truck-medical"></i> Fast Doorstep Delivery & Installation
            </div>
            <h1 className="hero-title">
              Medical Equipment <span>Rentals & Sales</span> Made Simple
            </h1>
            <p className="hero-subtitle">
              Rent or purchase high-grade hospital beds, electric wheelchairs, oxygen concentrators, and daily healthcare supplies with transparent pricing and instant delivery in Navi Mumbai.
            </p>
            <div className="hero-buttons">
              <Link to="/store" className="btn btn-primary">
                <i className="fa-solid fa-wheelchair"></i> Explore Equipment Store
              </Link>
              <Link to="/medicines" className="btn btn-secondary">
                <i className="fa-solid fa-pills"></i> Buy Medicines
              </Link>
            </div>
          </div>

          <div className="hero-card-container">
            <img
              src="https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&h=600&fit=crop"
              alt="Healthcare Equipment"
              className="hero-image"
            />
          </div>
        </div>
      </section>

      {/* Services Highlight */}
      <section className="container" style={{ margin: '4rem auto 2rem' }}>
        <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          <div className="form-card" style={{ margin: 0, padding: '1.75rem', textAlign: 'center' }}>
            <i className="fa-solid fa-repeat" style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1rem' }}></i>
            <h3>Flexible Monthly Rentals</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Rent hospital beds or wheelchairs for as low as ₹150/month with zero long-term commitments.
            </p>
          </div>

          <div className="form-card" style={{ margin: 0, padding: '1.75rem', textAlign: 'center' }}>
            <i className="fa-solid fa-shield-halved" style={{ fontSize: '2.5rem', color: 'var(--secondary)', marginBottom: '1rem' }}></i>
            <h3>100% Sanitized & Tested</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              All rental equipment undergoes rigorous multi-step sterilization before dispatch.
            </p>
          </div>

          <div className="form-card" style={{ margin: 0, padding: '1.75rem', textAlign: 'center' }}>
            <i className="fa-solid fa-user-doctor" style={{ fontSize: '2.5rem', color: 'var(--accent)', marginBottom: '1rem' }}></i>
            <h3>Prescription Support</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Easily upload doctor prescriptions for prescribed medical gear and essential medicines.
            </p>
          </div>

          <div className="form-card" style={{ margin: 0, padding: '1.75rem', textAlign: 'center' }}>
            <i className="fa-solid fa-headset" style={{ fontSize: '2.5rem', color: 'var(--success)', marginBottom: '1rem' }}></i>
            <h3>24/7 AI Assistance</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Get instant advice on equipment features and rental plans using our Gemini AI chatbot.
            </p>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="container">
        <div className="section-header">
          <span className="section-subtitle">Top Rental & Sales Items</span>
          <h2 className="section-title">Trending Healthcare Equipment</h2>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--primary)' }}></i>
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading products...</p>
          </div>
        ) : (
          <div className="grid-cards">
            {trendingProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link to="/store" className="btn btn-outline-primary">
            View All Equipment & Medicines <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>
      </section>
    </div>
  );
}
