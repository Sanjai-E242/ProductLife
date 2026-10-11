import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, MapPin, Globe, ExternalLink, Leaf } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="container footer-content">
        {/* Brand & Purpose Column */}
        <div className="footer-col footer-brand-col">
          <Link to="/" className="footer-brand">
            <div className="footer-icon-wrapper">
              <ShieldCheck size={22} />
            </div>
            <span className="footer-brand-title">ProductLife</span>
          </Link>
          <p className="footer-description">
            Empowering circular economy transparency through verifiable Digital Product Passports.
            Scan, track lifecycle, access repair history, and explore material recycling instructions.
          </p>
          <div className="compliance-tag">
            <Leaf size={14} />
            <span>Circular Economy & Sustainability Initiative</span>
          </div>
        </div>

        {/* Navigation Links Column */}
        <div className="footer-col">
          <h4 className="footer-heading">Platform</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/services">Services & Solutions</Link></li>
            <li><Link to="/products">Product Explorer</Link></li>
            <li><Link to="/how-it-works">How It Works</Link></li>
          </ul>
        </div>

        {/* Resources & Compliance Column */}
        <div className="footer-col">
          <h4 className="footer-heading">Digital Passport</h4>
          <ul className="footer-links">
            <li><Link to="/how-it-works">QR Code Architecture</Link></li>
            <li><Link to="/services">Material Disclosure</Link></li>
            <li><Link to="/services">Repair & Maintenance Tracking</Link></li>
            <li><Link to="/contact">Partnership Enquiries</Link></li>
            <li><Link to="/contact">Report an Issue</Link></li>
          </ul>
        </div>

        {/* Contact Info Column */}
        <div className="footer-col">
          <h4 className="footer-heading">Contact & Support</h4>
          <ul className="footer-contact-list">
            <li>
              <MapPin size={16} className="contact-icon" />
              <span>Bangalore / Chennai Tech Corridor, India</span>
            </li>
            <li>
              <Mail size={16} className="contact-icon" />
              <a href="mailto:support@productlife.eco">support@productlife.eco</a>
            </li>
            <li>
              <Globe size={16} className="contact-icon" />
              <span>www.productlife.eco</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-container">
          <p className="copyright-text">
            &copy; {new Date().getFullYear()} ProductLife. Built for Web Programming Academic Submission. All product credentials use demonstration data.
          </p>
          <div className="academic-badge">
            B.Tech Information Technology Project
          </div>
        </div>
      </div>
    </footer>
  );
}
