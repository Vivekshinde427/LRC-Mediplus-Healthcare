import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand-logo" style={{ marginBottom: '1rem' }}>
              <div className="brand-icon">
                <i className="fa-solid fa-heart-pulse"></i>
              </div>
              <span>LRC Medi+ Healthcare</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Your trusted medical equipment rental and sales partner based in Navi Mumbai. Providing high quality wheelchairs, ICU beds, oxygen concentrators, and daily medicine care.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="#" className="btn-icon"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" className="btn-icon"><i className="fa-brands fa-twitter"></i></a>
              <a href="#" className="btn-icon"><i className="fa-brands fa-instagram"></i></a>
              <a href="#" className="btn-icon"><i className="fa-brands fa-whatsapp"></i></a>
            </div>
          </div>

          <div>
            <h4 style={{ marginBottom: '1.25rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/store">Medical Equipment</Link></li>
              <li><Link to="/medicines">Medicines Catalog</Link></li>
              <li><Link to="/cart">Cart & Checkout</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ marginBottom: '1.25rem' }}>Categories</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <li>Wheelchairs</li>
              <li>Hospital Beds</li>
              <li>Oxygen Concentrators</li>
              <li>Surgical Equipment</li>
              <li>Pain Relief & Vitamins</li>
            </ul>
          </div>

          <div>
            <h4 style={{ marginBottom: '1.25rem' }}>Contact & Location</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <i className="fa-solid fa-location-dot" style={{ color: 'var(--primary)', marginRight: '8px' }}></i>
              Sector 15, Vashi, Navi Mumbai, MH 400703
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <i className="fa-solid fa-phone" style={{ color: 'var(--primary)', marginRight: '8px' }}></i>
              +91 98765 43210 / +91 22 2789 0000
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <i className="fa-solid fa-envelope" style={{ color: 'var(--primary)', marginRight: '8px' }}></i>
              mediiplus.healthcare@gmail.com
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} LRC Medi+ Healthcare. All rights reserved. Built with MERN Stack (Node, Express, React, MongoDB).</p>
        </div>
      </div>
    </footer>
  );
}
