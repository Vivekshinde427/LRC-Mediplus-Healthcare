import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../components/common/ProductCard';

const DEFAULT_BANNERS = [
  {
    _id: 'default-1',
    title: 'ICU Beds & Oxygen Concentrators',
    caption: 'Flexible daily rental Plans across Navi Mumbai',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&h=600&fit=crop'
  },
  {
    _id: 'default-2',
    title: 'Electric & Manual Wheelchairs',
    caption: '100% Sanitized & Tested for Doorstep Delivery',
    image: 'https://images.unsplash.com/photo-1589810635657-232948472d98?w=800&h=600&fit=crop'
  },
  {
    _id: 'default-3',
    title: 'Surgical & Emergency Care Supplies',
    caption: 'Trusted Medical Grade Healthcare Equipment',
    image: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&h=600&fit=crop'
  }
];

export default function HomePage() {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [banners, setBanners] = useState(DEFAULT_BANNERS);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resTrending, resBanners] = await Promise.all([
          API.get('/products?trending=true'),
          API.get('/banners')
        ]);
        setTrendingProducts(resTrending.data);
        if (resBanners.data && resBanners.data.length > 0) {
          setBanners(resBanners.data);
        }
      } catch (error) {
        console.error('Error fetching home page data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Auto-play hero image slider loop every 4 seconds
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + banners.length) % banners.length);
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % banners.length);
  };

  const activeBanner = banners[currentSlide] || banners[0];

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

          {/* Dynamic Auto-Sliding Hero Banners */}
          <div className="hero-card-container">
            <img
              src={activeBanner.image}
              alt={activeBanner.title || 'LRC Healthcare Banner'}
              className="hero-image"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&h=600&fit=crop';
              }}
            />

            {/* Title & Caption Overlay */}
            {(activeBanner.title || activeBanner.caption) && (
              <div className="hero-slider-overlay">
                {activeBanner.title && <div className="hero-slider-title">{activeBanner.title}</div>}
                {activeBanner.caption && <div className="hero-slider-caption">{activeBanner.caption}</div>}
              </div>
            )}

            {/* Slider Nav Arrows */}
            {banners.length > 1 && (
              <>
                <button className="hero-slider-arrow left" onClick={prevSlide} title="Previous slide">
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <button className="hero-slider-arrow right" onClick={nextSlide} title="Next slide">
                  <i className="fa-solid fa-chevron-right"></i>
                </button>

                {/* Dot Indicators */}
                <div className="hero-slider-dots">
                  {banners.map((_, idx) => (
                    <div
                      key={idx}
                      className={`hero-slider-dot ${idx === currentSlide ? 'active' : ''}`}
                      onClick={() => setCurrentSlide(idx)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Services Highlight */}
      <section className="container" style={{ margin: '4rem auto 2rem' }}>
        <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          <div className="form-card" style={{ margin: 0, padding: '1.75rem', textAlign: 'center' }}>
            <i className="fa-solid fa-repeat" style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1rem' }}></i>
            <h3>Flexible daily rentals</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Rent hospital beds or wheelchairs for as low as ₹150/day with zero long-term commitments.
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
