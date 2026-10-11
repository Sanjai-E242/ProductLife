import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  QrCode, 
  Filter, 
  MapPin, 
  Calendar, 
  Tag, 
  ArrowRight,
  Database,
  RefreshCw,
  AlertCircle,
  Wrench,
  CheckCircle2
} from 'lucide-react';
import { fetchProducts, fetchCategories } from '../services/api';
import './Pages.css';

export default function ProductExplorer() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load distinct categories on mount
  useEffect(() => {
    fetchCategories()
      .then(catList => {
        if (Array.isArray(catList) && catList.length > 0) {
          setCategories(['All', ...catList]);
        }
      })
      .catch(err => {
        console.warn('Could not load dynamic categories, falling back to defaults:', err);
        setCategories(['All', 'Drinkware', 'Electronics', 'Footwear', 'Gear']);
      });
  }, []);

  // Fetch products when searchTerm or selectedCategory changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    // Debounce search requests slightly for a snappy user experience
    const delayTimer = setTimeout(() => {
      fetchProducts(searchTerm, selectedCategory)
        .then(data => {
          if (isMounted) {
            setProducts(data);
            setLoading(false);
          }
        })
        .catch(err => {
          if (isMounted) {
            console.error('Error fetching products from backend:', err);
            setError(err.message || 'Unable to connect to Spring Boot server.');
            setLoading(false);
          }
        });
    }, 250);

    return () => {
      isMounted = false;
      clearTimeout(delayTimer);
    };
  }, [searchTerm, selectedCategory]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchProducts(searchTerm, selectedCategory)
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Unable to connect to Spring Boot server.');
        setLoading(false);
      });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
  };

  return (
    <div className="page-wrapper">
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container page-hero-content">
          <span className="badge badge-green">Live Public Catalog</span>
          <h1>Product Explorer & Passports</h1>
          <p>
            Browse verified digital product passports directly from our MySQL database,
            inspect manufacturing transparency, and review repair timelines.
          </p>
        </div>
      </section>

      <section className="container">
        {/* Phase 5 Live REST Integration Indicator */}
        <div style={{ 
          background: 'var(--teal-50)', 
          border: '1px solid var(--teal-100)', 
          borderRadius: 'var(--radius-md)', 
          padding: '1rem 1.5rem', 
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Database size={22} style={{ color: 'var(--teal-700)', flexShrink: 0 }} />
            <div style={{ fontSize: '0.9rem', color: 'var(--teal-800)' }}>
              <strong>Phase 6 Active:</strong> Live Spring Boot REST API &amp; Dynamic ZXing QR Code Generation.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link to="/scan" className="btn btn-sm btn-outline" style={{ background: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.4rem', borderRadius: 'var(--radius-full)' }}>
              <QrCode size={15} />
              <span>Open QR Scanner</span>
            </Link>
            <span className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={13} /> REST &amp; QR Online
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '1rem', 
          marginBottom: '2.5rem' 
        }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1 1 300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search by name, brand, model, code, or material..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.75rem' }}
            />
          </div>

          {/* Category Filter Chips */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div style={{ 
              width: '36px', 
              height: '36px', 
              border: '3px solid var(--teal-100)', 
              borderTop: '3px solid var(--teal-600)', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem auto'
            }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Fetching verified product passports from Spring Boot backend...
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem',
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            <AlertCircle size={40} style={{ color: '#DC2626', margin: '0 auto 1rem auto' }} />
            <h3 style={{ color: '#991B1B', marginBottom: '0.5rem' }}>Backend Connection Error</h3>
            <p style={{ color: '#7F1D1D', fontSize: '0.95rem', marginBottom: '1.5rem', maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
              {error}. Please ensure Spring Boot is running on port 8081.
            </p>
            <button onClick={handleRetry} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <RefreshCw size={16} />
              <span>Retry Connection</span>
            </button>
          </div>
        )}

        {/* Products Grid (Loaded State) */}
        {!loading && !error && products.length > 0 && (
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-card-header">
                  <QrCode size={64} className="product-icon-large" />
                  <span className="badge badge-teal" style={{ position: 'absolute', top: '1rem', right: '1rem', fontFamily: 'monospace' }}>
                    {product.productCode}
                  </span>
                </div>
                <div className="product-card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span className="product-brand">{product.brand}</span>
                    <span className="badge badge-green" style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem' }}>
                      {product.category}
                    </span>
                  </div>
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-desc">{product.description}</p>
                  
                  <div className="product-meta-row">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={14} /> {product.countryOfOrigin}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={14} /> {product.mfgDate}
                    </span>
                  </div>

                  {product.repairCount > 0 && (
                    <div style={{ 
                      fontSize: '0.8rem', 
                      color: 'var(--teal-800)', 
                      background: 'var(--teal-50)', 
                      padding: '0.4rem 0.75rem', 
                      borderRadius: 'var(--radius-sm)', 
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}>
                      <Wrench size={14} />
                      <span>{product.repairCount} verified repair service record(s)</span>
                    </div>
                  )}

                  <div style={{ marginTop: 'auto' }}>
                    <Link to={`/products/${product.id}`} className="btn btn-secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <QrCode size={16} />
                      <span>View Digital Passport</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 1.5rem', 
            background: 'var(--bg-card)', 
            border: '1px solid var(--border-light)', 
            borderRadius: 'var(--radius-lg)' 
          }}>
            <Filter size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem auto' }} />
            <h3 style={{ color: 'var(--primary-900)', marginBottom: '0.5rem' }}>No Matching Passports Found</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', maxWidth: '450px', margin: '0 auto 1.5rem auto' }}>
              No digital product passports matched your search term "{searchTerm}" {selectedCategory !== 'All' ? `in category "${selectedCategory}"` : ''}.
            </p>
            <button onClick={handleResetFilters} className="btn btn-primary">
              Clear Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
