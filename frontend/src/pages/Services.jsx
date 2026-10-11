import React from 'react';
import { 
  QrCode, 
  Layers, 
  Wrench, 
  Recycle, 
  BarChart3, 
  FileCheck2, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './Pages.css';

export default function Services() {
  const serviceList = [
    {
      icon: <QrCode size={26} />,
      title: "Digital Product Passport Creation",
      desc: "Assign a unique cryptographic identifier and persistent cloud record to each manufactured product, model, or batch.",
      benefits: ["Unique URL and QR generation", "Standardized schema", "Instant public access"]
    },
    {
      icon: <Layers size={26} />,
      title: "Material & Component Disclosure",
      desc: "Document bill of materials, recycled contents percentages, country of origin, and environmental footprints.",
      benefits: ["Transparency for consumers", "Compliance with sustainability directives", "Ingredient tracking"]
    },
    {
      icon: <Wrench size={26} />,
      title: "Maintenance & Repair Logging",
      desc: "Enable verified technicians to log service events, part replacements, and firmware revisions over the product lifetime.",
      benefits: ["Extended product lifespan", "Warranty verification", "Higher second-hand resale value"]
    },
    {
      icon: <Recycle size={26} />,
      title: "Circular End-of-Life Instructions",
      desc: "Provide recyclers and municipal waste facilities with precise disassembly instructions and material separation guidelines.",
      benefits: ["Reduces landfill contamination", "E-waste component recovery", "Clear consumer guidance"]
    },
    {
      icon: <BarChart3 size={26} />,
      title: "Product Lifecycle Analytics",
      desc: "Admin dashboards that display product distribution, warranty status, repair trends, and recycling rates.",
      benefits: ["Real-time inventory view", "Durability metrics", "Quality control feedback loop"]
    },
    {
      icon: <FileCheck2 size={26} />,
      title: "Regulatory Compliance Readiness",
      desc: "Designed to align with upcoming European Union Ecodesign for Sustainable Products Regulation (ESPR) criteria.",
      benefits: ["Standard-compliant data structures", "Structured JSON APIs", "Audit-ready logging"]
    }
  ];

  return (
    <div className="page-wrapper">
      <section className="page-hero">
        <div className="container page-hero-content">
          <span className="badge badge-teal">Our Capabilities</span>
          <h1>Comprehensive Product Passport Solutions</h1>
          <p>
            From factory floor to recycling bin — explore our suite of digital passport modules 
            designed to make sustainable transparency seamless for modern manufacturers.
          </p>
        </div>
      </section>

      <section className="container" style={{ marginBottom: '5rem' }}>
        <div className="features-grid">
          {serviceList.map((service, idx) => (
            <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="feature-icon-wrapper">
                {service.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{service.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginBottom: '1.25rem', flex: 1 }}>
                {service.desc}
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                {service.benefits.map((b, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <CheckCircle size={14} style={{ color: 'var(--teal-600)' }} />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Try It CTA */}
      <section className="container" style={{ textAlign: 'center', background: 'var(--bg-card)', border: '1px solid var(--border-light)', padding: '3.5rem 2rem', borderRadius: 'var(--radius-lg)' }}>
        <h2>Ready to Explore Live Product Passports?</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0.75rem auto 1.75rem auto' }}>
          Explore our collection of demonstration products, inspect their verified materials, and view repair histories.
        </p>
        <Link to="/products" className="btn btn-primary">
          <QrCode size={18} />
          <span>Launch Product Explorer</span>
        </Link>
      </section>
    </div>
  );
}
