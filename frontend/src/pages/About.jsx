import React from 'react';
import { Target, Eye, Award, Users, ShieldCheck, HeartHandshake } from 'lucide-react';
import './Pages.css';

export default function About() {
  return (
    <div className="page-wrapper">
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container page-hero-content">
          <span className="badge badge-green">About ProductLife</span>
          <h1>Pioneering Digital Transparency for Sustainable Products</h1>
          <p>
            We are dedicated to building digital infrastructure that empowers consumers, 
            brands, and recyclers with verifiable lifecycle product data.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container" style={{ marginBottom: '5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
          <div className="card">
            <div className="feature-icon-wrapper" style={{ background: 'var(--teal-100)', color: 'var(--teal-700)' }}>
              <Target size={26} />
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Our Mission</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              To bridge the information gap between manufacturing and disposal. By providing 
              every manufactured item with a unique, unforgeable digital passport, we enable 
              informed purchases, responsible repairs, and circular end-of-life recovery.
            </p>
          </div>

          <div className="card">
            <div className="feature-icon-wrapper">
              <Eye size={26} />
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Our Vision</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              A world where every durable product carries its own permanent digital identity, 
              eliminating counterfeit claims, encouraging right-to-repair practices, and reducing 
              global electronic and textile waste by enabling precise recycling sorting.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="container" style={{ marginBottom: '5rem' }}>
        <div className="section-header">
          <span className="badge badge-teal">Our Core Principles</span>
          <h2>Values Guiding Our Architecture</h2>
          <p>Every line of code and database schema in ProductLife is guided by these principles.</p>
        </div>

        <div className="features-grid">
          <div className="card">
            <ShieldCheck size={28} style={{ color: 'var(--primary-700)', marginBottom: '0.75rem' }} />
            <h3>Honest Transparency</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
              We explicitly differentiate demonstrative student samples from third-party certified supply chain audits.
            </p>
          </div>

          <div className="card">
            <Award size={28} style={{ color: 'var(--teal-700)', marginBottom: '0.75rem' }} />
            <h3>Right to Repair</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
              We treat maintenance logs and spare part specifications as first-class citizens in our digital passport schema.
            </p>
          </div>

          <div className="card">
            <HeartHandshake size={28} style={{ color: 'var(--primary-700)', marginBottom: '0.75rem' }} />
            <h3>Open Accessibility</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
              Consumers should never have to download proprietary app store apps just to check if a bottle or sneaker is recyclable.
            </p>
          </div>

          <div className="card">
            <Users size={28} style={{ color: 'var(--teal-700)', marginBottom: '0.75rem' }} />
            <h3>Academic Excellence</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
              Developed as a collegiate Web Programming project demonstrating clean MVC design, robust REST APIs, and responsive UI.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
