import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ShieldCheck, Menu, X, QrCode, ArrowRight } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
          <div className="brand-icon-wrapper">
            <ShieldCheck className="brand-icon" size={24} />
          </div>
          <div className="brand-text">
            <span className="brand-title">ProductLife</span>
            <span className="brand-tagline">Digital Passports</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="navbar-nav desktop-nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Home
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            About Us
          </NavLink>
          <NavLink to="/services" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Services
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Product Explorer
          </NavLink>
          <NavLink to="/scan" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Scan QR
          </NavLink>
          <NavLink to="/how-it-works" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            How It Works
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Contact
          </NavLink>
          <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span>Admin</span>
            <span style={{ fontSize: '0.68rem', padding: '1px 5px', borderRadius: '4px', background: 'var(--teal-100)', color: 'var(--teal-700)', fontWeight: 700 }}>PORTAL</span>
          </NavLink>
        </nav>

        {/* CTA Button */}
        <div className="navbar-actions desktop-nav">
          <Link to="/scan" className="btn btn-primary btn-sm">
            <QrCode size={18} />
            <span>Scan Passport</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-nav-menu">
          <div className="container mobile-nav-links">
            <NavLink to="/" end onClick={closeMobileMenu} className={({ isActive }) => isActive ? 'mobile-nav-link active' : 'mobile-nav-link'}>
              Home
            </NavLink>
            <NavLink to="/about" onClick={closeMobileMenu} className={({ isActive }) => isActive ? 'mobile-nav-link active' : 'mobile-nav-link'}>
              About Us
            </NavLink>
            <NavLink to="/services" onClick={closeMobileMenu} className={({ isActive }) => isActive ? 'mobile-nav-link active' : 'mobile-nav-link'}>
              Services
            </NavLink>
            <NavLink to="/products" onClick={closeMobileMenu} className={({ isActive }) => isActive ? 'mobile-nav-link active' : 'mobile-nav-link'}>
              Product Explorer
            </NavLink>
            <NavLink to="/scan" onClick={closeMobileMenu} className={({ isActive }) => isActive ? 'mobile-nav-link active' : 'mobile-nav-link'}>
              Scan QR
            </NavLink>
            <NavLink to="/how-it-works" onClick={closeMobileMenu} className={({ isActive }) => isActive ? 'mobile-nav-link active' : 'mobile-nav-link'}>
              How It Works
            </NavLink>
            <NavLink to="/contact" onClick={closeMobileMenu} className={({ isActive }) => isActive ? 'mobile-nav-link active' : 'mobile-nav-link'}>
              Contact
            </NavLink>
            <NavLink to="/admin" onClick={closeMobileMenu} className={({ isActive }) => isActive ? 'mobile-nav-link active' : 'mobile-nav-link'}>
              Admin Portal
            </NavLink>
            <Link to="/scan" onClick={closeMobileMenu} className="btn btn-primary btn-mobile-cta">
              <QrCode size={18} />
              <span>Scan QR Passport</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
