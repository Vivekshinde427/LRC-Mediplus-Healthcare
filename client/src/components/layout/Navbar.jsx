import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { totalCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="container nav-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo">
          <div className="brand-icon">
            <i className="fa-solid fa-heart-pulse"></i>
          </div>
          <span>LRC Medi<span style={{ color: 'var(--secondary)' }}>+</span></span>
        </Link>

        {/* Nav Links */}
        <ul className="nav-links">
          <li><NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink></li>
          <li><NavLink to="/store" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Medical Equipment</NavLink></li>
          <li><NavLink to="/medicines" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Medicines</NavLink></li>
          {isAdmin && (
            <li><NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} style={{ color: 'var(--accent)', fontWeight: '700' }}>Admin Dashboard</NavLink></li>
          )}
        </ul>

        {/* Action Controls */}
        <div className="nav-actions">
          {/* Theme Toggle */}
          <button className="btn-icon" onClick={toggleTheme} title="Toggle Dark/Light Mode">
            {theme === 'light' ? <i className="fa-regular fa-moon"></i> : <i className="fa-regular fa-sun"></i>}
          </button>

          {/* Cart Icon */}
          <Link to="/cart" className="btn-icon" title="Shopping Cart">
            <i className="fa-solid fa-cart-shopping"></i>
            {totalCount > 0 && <span className="badge">{totalCount}</span>}
          </Link>

          {/* User Auth */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/profile" className="btn btn-secondary btn-sm">
                <i className="fa-solid fa-user-circle"></i> {user?.name ? user.name.split(' ')[0] : 'Account'}
              </Link>
              <button className="btn btn-outline-primary btn-sm" onClick={() => { logout(); navigate('/'); }}>
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              <i className="fa-solid fa-right-to-bracket"></i> Login / Register
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
