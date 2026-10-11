import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, QrCode } from 'lucide-react';
import './Pages.css';

export default function NotFound() {
  return (
    <div className="page-wrapper">
      <div className="container" style={{ textAlign: 'center', padding: '6rem 1rem' }}>
        <div style={{ 
          width: '4.5rem', 
          height: '4.5rem', 
          borderRadius: 'var(--radius-lg)', 
          background: 'var(--primary-100)', 
          color: 'var(--primary-800)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          margin: '0 auto 1.5rem auto' 
        }}>
          <AlertTriangle size={36} />
        </div>
        <span className="badge badge-teal" style={{ marginBottom: '1rem' }}>404 Error</span>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Page or Passport Not Found</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 2rem auto', fontSize: '1.05rem' }}>
          The requested page route or product passport ID could not be located. It might have been moved or does not exist yet.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">
            <Home size={18} />
            <span>Return to Home</span>
          </Link>
          <Link to="/products" className="btn btn-outline">
            <QrCode size={18} />
            <span>Explore Passports</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
