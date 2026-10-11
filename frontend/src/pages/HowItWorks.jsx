import React from 'react';
import { 
  FilePlus, 
  ShieldCheck, 
  QrCode, 
  Smartphone, 
  Wrench, 
  Recycle, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './Pages.css';

export default function HowItWorks() {
  const workflowSteps = [
    {
      step: "01",
      icon: <FilePlus size={26} />,
      title: "1. Administrator Registers the Product",
      desc: "An authorized administrator logs into the ProductLife admin dashboard and creates a new product record with brand name, model number, manufacturer, country of origin, bill of materials, specifications, and care instructions.",
      highlight: "Role-protected data creation with Spring Boot backend validation"
    },
    {
      step: "02",
      icon: <ShieldCheck size={26} />,
      title: "2. Creation of the Digital Product Passport",
      desc: "The system generates an immutable unique passport identity (e.g., PL-ECO-001) in the MySQL database, establishing a dedicated public URL for the lifecycle record.",
      highlight: "Permanent primary key mapping & structured data persistence"
    },
    {
      step: "03",
      icon: <QrCode size={26} />,
      title: "3. Generation of the Unique QR Code",
      desc: "ProductLife renders a high-resolution, scannable QR code encoding the product's exact passport URL. Manufacturers can download or print this QR code directly onto product packaging, tags, or engraved chassis.",
      highlight: "Scannable 2D barcode directly linked to the public passport URL"
    },
    {
      step: "04",
      icon: <Smartphone size={26} />,
      title: "4. Scanning to View Public Product Details",
      desc: "Consumers and retailers scan the QR code using any smartphone camera. No app store installation or login is required — the responsive web passport loads instantly in the mobile browser.",
      highlight: "Zero-friction public access across iOS, Android, and desktop"
    },
    {
      step: "05",
      icon: <Recycle size={26} />,
      title: "5. Accessing Care, Repair & Recycling Guidance",
      desc: "The passport displays comprehensive care guidelines, lets certified service centers view and log repair history, and offers step-by-step circular recycling and disassembly instructions to keep materials out of landfills.",
      highlight: "Right-to-repair support & circular economy waste reduction"
    }
  ];

  return (
    <div className="page-wrapper">
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container page-hero-content">
          <div className="badge badge-teal" style={{ marginBottom: '0.75rem' }}>
            <Sparkles size={14} />
            <span>End-to-End Lifecycle Flow</span>
          </div>
          <h1>How the Digital Product Passport Works</h1>
          <p>
            From initial manufacturer registration to consumer scanning, ongoing maintenance logging, 
            and circular recycling — discover how ProductLife tracks products across their complete lifecycle.
          </p>
        </div>
      </section>

      {/* 5-Step Process Section */}
      <section className="container" style={{ marginBottom: '5rem' }}>
        <div className="section-header">
          <span className="badge badge-green">5-Step Architecture</span>
          <h2>A Complete Lifecycle in 5 Seamless Steps</h2>
          <p>Each step connects physical manufacturing to verifiable digital transparency.</p>
        </div>

        <div className="steps-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {workflowSteps.map((item, idx) => (
            <div key={idx} className="step-card">
              <span className="step-number">{item.step}</span>
              <div className="feature-icon-wrapper" style={{ marginTop: '0.5rem' }}>
                {item.icon}
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.65rem' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginBottom: '1.25rem', lineHeight: '1.6' }}>
                {item.desc}
              </p>
              <div style={{ 
                marginTop: 'auto', 
                paddingTop: '0.75rem', 
                borderTop: '1px solid var(--border-light)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                fontSize: '0.8rem', 
                color: 'var(--teal-700)',
                fontWeight: 600
              }}>
                <CheckCircle2 size={14} style={{ flexShrink: 0 }} />
                <span>{item.highlight}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Demonstration Banner */}
      <section className="container" style={{ marginBottom: '5rem' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, var(--primary-900) 0%, var(--primary-800) 100%)', 
          color: '#FFFFFF', 
          padding: '3.5rem 2.5rem', 
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
            <span className="badge badge-teal" style={{ marginBottom: '1rem', background: 'rgba(20, 184, 166, 0.2)', color: 'var(--teal-500)', border: '1px solid rgba(20, 184, 166, 0.3)' }}>
              Interactive QR Verification
            </span>
            <h2 style={{ color: '#FFFFFF', fontSize: '2.25rem', marginBottom: '1rem' }}>
              Experience the Scanning Flow First-Hand
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '2rem' }}>
              Want to see how an end user experiences a digital passport? Explore our demonstration products in the 
              Product Explorer, inspect their materials and repair history, or test how QR codes map directly to unique product records.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/products" className="btn btn-primary" style={{ background: 'var(--teal-600)', color: '#FFFFFF' }}>
                <QrCode size={18} />
                <span>Open Product Explorer</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/contact" className="btn btn-outline" style={{ color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.3)' }}>
                <span>Contact Academic Team</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Technical FAQ / Faculty Explanation */}
      <section className="container" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '3.5rem 2.5rem', marginBottom: '4rem' }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="badge badge-green" style={{ marginBottom: '0.5rem' }}>Viva & Evaluation Guide</span>
            <h2 style={{ fontSize: '1.85rem' }}>Technical Architecture Notes for Faculty Evaluation</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Clear answers to potential questions regarding system design, routing, and data flow.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '1.5rem' }}>
              <h4 style={{ color: 'var(--primary-800)', marginBottom: '0.5rem', fontSize: '1.15rem' }}>
                1. How does the QR code point to the correct product?
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Each product is assigned a unique primary key in the MySQL database (e.g. <code>id</code> or <code>productCode</code>). 
                The QR code encodes a standard web URL: <code>http://domain/passport/PL-ECO-001</code>. When scanned, 
                React Router reads the dynamic route parameter and requests the record from Spring Boot via <code>GET /api/products/{'{id}'}</code>.
              </p>
            </div>

            <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '1.5rem' }}>
              <h4 style={{ color: 'var(--primary-800)', marginBottom: '0.5rem', fontSize: '1.15rem' }}>
                2. Why choose a responsive Web Application over a native mobile app?
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Native mobile apps require downloading from the Apple App Store or Google Play, creating high friction for a customer simply wanting to inspect a product in a retail store. A responsive React web application guarantees that anyone with a camera can view passport data in under 2 seconds on any device without registration.
              </p>
            </div>

            <div>
              <h4 style={{ color: 'var(--primary-800)', marginBottom: '0.5rem', fontSize: '1.15rem' }}>
                3. How does ProductLife protect data integrity and prevent unauthorized modifications?
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Public passport pages are strictly read-only (HTTP GET requests). Creation, editing, and deletion operations (HTTP POST, PUT, DELETE) are protected by secure Spring Boot administrator authentication and authorization filters implemented in Phase 7.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
