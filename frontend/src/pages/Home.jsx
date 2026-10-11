import React from 'react';
import { Link } from 'react-router-dom';
import { 
  QrCode, 
  ShieldCheck, 
  Layers, 
  Wrench, 
  RefreshCw, 
  ArrowRight, 
  CheckCircle2, 
  FileText,
  Sparkles
} from 'lucide-react';
import './Pages.css';

export default function Home() {
  return (
    <div className="page-wrapper">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-text">
            <div className="badge badge-teal">
              <Sparkles size={14} />
              <span>Next-Gen Circular Transparency</span>
            </div>
            <h1>
              Every Product Has a Story. <br />
              <span>Track It with Digital Passports.</span>
            </h1>
            <p className="hero-subtitle">
              ProductLife provides verifiable digital records accessible via instant QR codes. 
              Empowering consumers and manufacturers with material transparency, repair logs, 
              and circular recycling instructions.
            </p>
            <div className="hero-cta-group">
              <Link to="/products" className="btn btn-primary">
                <QrCode size={18} />
                <span>Explore Sample Passports</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/how-it-works" className="btn btn-outline">
                <span>How the QR System Works</span>
              </Link>
            </div>
          </div>

          {/* Interactive Hero Card Preview */}
          <div className="hero-card-preview">
            <div className="preview-badge">
              <span className="badge badge-green">Live Demonstration</span>
              <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>ID: PL-ECO-001</span>
            </div>
            <div className="preview-qr-box">
              <QrCode size={72} className="preview-qr-icon" />
              <p style={{ fontSize: '0.85rem', color: '#164E3B', fontWeight: 600 }}>
                Scan to View Real-Time Passport
              </p>
            </div>
            <div className="preview-product-info">
              <span style={{ fontSize: '0.75rem', color: '#0D9488', fontWeight: 700, textTransform: 'uppercase' }}>
                EcoHydrate Tech
              </span>
              <h3>HydroPure Thermal Flask 750ml</h3>
              <div className="preview-meta">
                <span>Origin: Sweden</span>
                <span>Recycled Steel 92%</span>
              </div>
              <div className="preview-tags">
                <span className="badge badge-teal">Repairable Lid</span>
                <span className="badge badge-green">100% Recyclable</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars / Why ProductLife */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="section-header">
            <span className="badge badge-green">Why Digital Passports?</span>
            <h2>Bridging Products, People & Planet</h2>
            <p>
              Moving from linear "take-make-waste" consumption toward a traceable, repairable circular economy.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <QrCode size={24} />
              </div>
              <h3>Instant QR Accessibility</h3>
              <p>
                No special mobile apps required. Any standard smartphone camera scans the passport code to open full product credentials in seconds.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Layers size={24} />
              </div>
              <h3>Material & Origin Disclosure</h3>
              <p>
                Comprehensive breakdowns of raw materials, manufacturing origins, and environmental certifications for conscious decisions.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Wrench size={24} />
              </div>
              <h3>Lifecycle & Repair History</h3>
              <p>
                Authorized service centers log maintenance and part replacements, extending the product lifespan and resale value.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <RefreshCw size={24} />
              </div>
              <h3>Circular End-of-Life Guidance</h3>
              <p>
                Step-by-step disassembly and recycling procedures prevent valuable components from ending up in local landfills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Note & Call to Action */}
      <section style={{ background: 'var(--primary-50)', padding: '4.5rem 0', borderTop: '1px solid var(--border-light)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '700px' }}>
          <div className="badge badge-green" style={{ marginBottom: '1rem' }}>
            College Web Programming Project
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
            Built for Academic Evaluation & Real-World Scalability
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            This project showcases full-stack web development with React, Spring Boot REST APIs, and MySQL persistence. 
            All passport data is currently demonstrative and ready for end-to-end testing.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/products" className="btn btn-primary">
              Browse Sample Products
            </Link>
            <Link to="/contact" className="btn btn-outline">
              Contact Developer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
