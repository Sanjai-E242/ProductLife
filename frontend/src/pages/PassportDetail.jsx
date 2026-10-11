import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  fetchProductById,
  getProductQrCodeUrl,
  downloadPassportComplianceExport
} from '../services/api';
import { 
  ArrowLeft, 
  QrCode, 
  MapPin, 
  Calendar, 
  Building2, 
  Layers, 
  Sparkles, 
  RotateCcw, 
  Wrench, 
  ShieldCheck, 
  AlertTriangle,
  FileText,
  Download,
  Copy,
  Check,
  Smartphone,
  Wifi,
  Laptop,
  Info
} from 'lucide-react';
import './Pages.css';

export default function PassportDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  
  // Host and network configuration state
  const currentBrowserHost = (typeof window !== 'undefined' && window.location && window.location.hostname) ? window.location.hostname : 'localhost';
  const currentBrowserPort = (typeof window !== 'undefined' && window.location && window.location.port) ? window.location.port : '5174';
  const isAlreadyOnLan = currentBrowserHost !== 'localhost' && currentBrowserHost !== '127.0.0.1';

  const [lanHostInput, setLanHostInput] = useState(() => localStorage.getItem('productlife_lan_host') || (isAlreadyOnLan ? currentBrowserHost : ''));
  const [appliedLanHost, setAppliedLanHost] = useState(() => localStorage.getItem('productlife_lan_host') || (isAlreadyOnLan ? currentBrowserHost : ''));
  const [scanMode, setScanMode] = useState('phone'); // 'phone' | 'local'
  const [showLanHelp, setShowLanHelp] = useState(false);
  const [editingLanHost, setEditingLanHost] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchProductById(id)
      .then(data => {
        if (isMounted) {
          setProduct(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err.message || 'Unable to load product passport details.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Determine if backend provided a public URL not containing localhost
  const backendHasPublicUrl = product?.passportUrl && 
    !product.passportUrl.includes('localhost') && 
    !product.passportUrl.includes('127.0.0.1');

  // Compute the exact URL to encode in the QR code
  let encodedUrl = '';
  if (product) {
    if (scanMode === 'phone') {
      if (backendHasPublicUrl) {
        encodedUrl = product.passportUrl;
      } else if (appliedLanHost && appliedLanHost.trim()) {
        const cleanHost = appliedLanHost.trim();
        encodedUrl = cleanHost.startsWith('http')
          ? `${cleanHost.replace(/\/+$/, '')}/products/${product.id}`
          : `http://${cleanHost}:${currentBrowserPort}/products/${product.id}`;
      } else {
        encodedUrl = `http://localhost:${currentBrowserPort}/products/${product.id}`;
      }
    } else {
      encodedUrl = `http://localhost:${currentBrowserPort}/products/${product.id}`;
    }
  }

  // Compute the live backend QR image endpoint URL
  let qrImageUrl = '';
  if (product) {
    if (scanMode === 'phone') {
      if (backendHasPublicUrl) {
        const baseUrlWithoutProducts = product.passportUrl.replace(/\/products\/[^\/]+$/, '');
        qrImageUrl = getProductQrCodeUrl(product.id, { size: 260, baseUrl: baseUrlWithoutProducts });
      } else if (appliedLanHost && appliedLanHost.trim()) {
        qrImageUrl = getProductQrCodeUrl(product.id, { size: 260, host: appliedLanHost.trim(), port: currentBrowserPort });
      } else {
        qrImageUrl = getProductQrCodeUrl(product.id, { size: 260 });
      }
    } else {
      qrImageUrl = getProductQrCodeUrl(product.id, { size: 260, host: 'localhost', port: currentBrowserPort });
    }
  }

  const handleSaveLanHost = (e) => {
    if (e) e.preventDefault();
    const trimmed = lanHostInput.trim();
    setAppliedLanHost(trimmed);
    if (trimmed) {
      localStorage.setItem('productlife_lan_host', trimmed);
    } else {
      localStorage.removeItem('productlife_lan_host');
    }
    setEditingLanHost(false);
  };

  const handleCopyLink = () => {
    if (!encodedUrl) return;
    navigator.clipboard.writeText(encodedUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadQr = () => {
    if (!product) return;
    let downloadQrUrl = '';
    if (scanMode === 'phone') {
      if (backendHasPublicUrl) {
        const baseUrlWithoutProducts = product.passportUrl.replace(/\/products\/[^\/]+$/, '');
        downloadQrUrl = getProductQrCodeUrl(product.id, { size: 500, baseUrl: baseUrlWithoutProducts });
      } else if (appliedLanHost && appliedLanHost.trim()) {
        downloadQrUrl = getProductQrCodeUrl(product.id, { size: 500, host: appliedLanHost.trim(), port: currentBrowserPort });
      } else {
        downloadQrUrl = getProductQrCodeUrl(product.id, { size: 500 });
      }
    } else {
      downloadQrUrl = getProductQrCodeUrl(product.id, { size: 500, host: 'localhost', port: currentBrowserPort });
    }

    const link = document.createElement('a');
    link.href = downloadQrUrl;
    link.download = `productlife-passport-${product.productCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadComplianceJson = () => {
    if (!product) return;
    downloadPassportComplianceExport(product.id, product.productCode);
  };

  if (loading) {
    return (
      <div className="page-wrapper container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', padding: '2rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
          <div className="spinner" style={{ 
            width: '40px', 
            height: '40px', 
            border: '3px solid var(--teal-100)', 
            borderTop: '3px solid var(--teal-600)', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1.5rem auto'
          }} />
          <h3 style={{ color: 'var(--primary-900)', marginBottom: '0.5rem' }}>Accessing Digital Passport</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Retrieving authenticated lifecycle records for ID #{id} from Spring Boot MySQL backend...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page-wrapper container" style={{ padding: '4rem 1.5rem', maxWidth: '640px' }}>
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid #FCA5A5',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
          textAlign: 'center',
          boxShadow: 'var(--shadow-md)'
        }}>
          <AlertTriangle size={48} style={{ color: '#DC2626', margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '1.75rem', color: 'var(--primary-900)', marginBottom: '0.75rem' }}>
            Passport Not Found
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.75rem', lineHeight: '1.6' }}>
            {error || `No digital product passport found matching ID: ${id}`}
          </p>
          <Link to="/products" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowLeft size={16} />
            <span>Back to Product Explorer</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      {/* Passport Header Bar */}
      <section className="page-hero" style={{ padding: '2.5rem 0 2rem 0' }}>
        <div className="container" style={{ textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <Link to="/products" style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              color: 'var(--teal-700)', 
              fontWeight: 600, 
              fontSize: '0.9rem'
            }}>
              <ArrowLeft size={16} /> Back to Catalog
            </Link>

            <Link to="/scan" className="btn btn-sm btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', borderRadius: 'var(--radius-full)' }}>
              <Smartphone size={15} />
              <span>Scan Another Passport</span>
            </Link>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span className="badge badge-teal">{product.category}</span>
                <span className="badge badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ShieldCheck size={14} /> Verified Passport
                </span>
              </div>
              <h1 style={{ fontSize: '2.25rem', margin: '0.25rem 0', color: 'var(--primary-900)' }}>
                {product.name}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', margin: 0 }}>
                Brand: <strong>{product.brand}</strong> &bull; Model: <strong>{product.model || 'N/A'}</strong>
              </p>
            </div>

            {/* Passport Identity Badge */}
            <div style={{ 
              background: 'var(--bg-card)', 
              border: '1px solid var(--border-light)', 
              borderRadius: 'var(--radius-md)', 
              padding: '0.85rem 1.25rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.85rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <QrCode size={36} style={{ color: 'var(--teal-700)' }} />
              <div>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                  Passport ID
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--teal-700)', fontFamily: 'monospace' }}>
                  {product.productCode}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Details Body */}
      <section className="container">
        
        {/* Top Feature: Interactive QR Code Card */}
        <div style={{
          background: 'linear-gradient(135deg, var(--teal-50) 0%, #FFFFFF 100%)',
          border: '1px solid var(--teal-200)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem 2rem',
          marginBottom: '2rem',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '2rem',
          alignItems: 'center',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {/* Real Generated QR Image */}
          <div style={{
            background: '#FFFFFF',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            border: '2px solid var(--teal-500)',
            boxShadow: 'var(--shadow-md)',
            display: 'inline-block',
            textAlign: 'center'
          }}>
            <img 
              src={qrImageUrl} 
              alt={`QR Code for ${product.productCode}`}
              width="150"
              height="150"
              style={{ display: 'block', borderRadius: '4px' }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--teal-800)', display: 'block', marginTop: '0.4rem', fontWeight: 600 }}>
              Live ZXing Graphic
            </span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-teal">Scan On Any Device</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                  ID: {product.productCode}
                </span>
              </div>

              {/* Mode Toggle: Phone Scan (Wi-Fi/LAN) vs This PC */}
              <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--bg-card)', padding: '3px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-light)' }}>
                <button
                  type="button"
                  onClick={() => setScanMode('phone')}
                  className={`btn btn-sm ${scanMode === 'phone' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ borderRadius: 'var(--radius-full)', fontSize: '0.75rem', padding: '0.25rem 0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Smartphone size={14} />
                  <span>Phone Scan (Wi-Fi)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setScanMode('local')}
                  className={`btn btn-sm ${scanMode === 'local' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ borderRadius: 'var(--radius-full)', fontSize: '0.75rem', padding: '0.25rem 0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Laptop size={14} />
                  <span>This PC (Localhost)</span>
                </button>
              </div>
            </div>

            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-900)', margin: '0 0 0.4rem 0' }}>
              Official Digital Product Passport QR
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 0.5rem 0' }}>
              Generated dynamically by our Spring Boot backend. Scan with your phone's camera app to instantly open this Digital Product Passport.
            </p>

            {/* If Phone Scan mode is active, display configurable LAN address toolbar */}
            {scanMode === 'phone' && (
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.6rem 0.85rem',
                marginBottom: '0.75rem',
                fontSize: '0.82rem'
              }}>
                {backendHasPublicUrl ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--teal-800)' }}>
                    <ShieldCheck size={16} style={{ color: 'var(--teal-600)' }} />
                    <span>Using environment-configured public passport URL: <strong>{product.passportUrl}</strong></span>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--teal-900)', fontWeight: 600 }}>
                        <Wifi size={15} style={{ color: 'var(--teal-600)' }} />
                        <span>Laptop Wi-Fi Address for Phone:</span>
                        <code style={{ background: '#E6FFFA', padding: '0.15rem 0.4rem', borderRadius: '4px', color: 'var(--teal-800)' }}>
                          {appliedLanHost ? `${appliedLanHost}:${currentBrowserPort}` : 'Not set yet (enter below)'}
                        </code>
                      </div>

                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          type="button"
                          onClick={() => setEditingLanHost(!editingLanHost)}
                          className="btn btn-sm btn-outline"
                          style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '4px' }}
                        >
                          {editingLanHost ? 'Close' : (appliedLanHost ? 'Edit IP' : 'Set Laptop IP')}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowLanHelp(!showLanHelp)}
                          className="btn btn-sm"
                          style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: 'transparent', color: 'var(--teal-700)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          <Info size={13} />
                          <span>How to find IP</span>
                        </button>
                      </div>
                    </div>

                    {(editingLanHost || !appliedLanHost) && (
                      <form onSubmit={handleSaveLanHost} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <input
                          type="text"
                          placeholder="e.g. 192.168.1.15"
                          value={lanHostInput}
                          onChange={(e) => setLanHostInput(e.target.value)}
                          style={{
                            padding: '0.3rem 0.6rem',
                            borderRadius: '4px',
                            border: '1px solid var(--border-light)',
                            fontSize: '0.82rem',
                            minWidth: '180px',
                            fontFamily: 'monospace'
                          }}
                        />
                        <button type="submit" className="btn btn-sm btn-primary" style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem' }}>
                          Apply & Update QR
                        </button>
                        {isAlreadyOnLan && (
                          <button
                            type="button"
                            onClick={() => { setLanHostInput(currentBrowserHost); setAppliedLanHost(currentBrowserHost); localStorage.setItem('productlife_lan_host', currentBrowserHost); setEditingLanHost(false); }}
                            className="btn btn-sm btn-outline"
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                          >
                            Use Current Host ({currentBrowserHost})
                          </button>
                        )}
                      </form>
                    )}

                    {showLanHelp && (
                      <div style={{ marginTop: '0.5rem', padding: '0.5rem 0.75rem', background: '#F0FDF4', borderRadius: '4px', border: '1px solid #BBF7D0', color: '#166534', fontSize: '0.78rem', lineHeight: '1.4' }}>
                        <strong>How to find your laptop's IP in Windows:</strong>
                        <ol style={{ margin: '0.3rem 0 0 1.2rem', padding: 0 }}>
                          <li>Open PowerShell or Command Prompt.</li>
                          <li>Type <code>ipconfig</code> and press Enter.</li>
                          <li>Look for <strong>Wireless LAN adapter Wi-Fi</strong> &rarr; <strong>IPv4 Address</strong> (e.g. <code>192.168.1.X</code>).</li>
                          <li>Enter that IP above and click <em>Apply & Update QR</em>.</li>
                          <li>Make sure your phone is connected to the same Wi-Fi network.</li>
                        </ol>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div style={{ 
              background: '#FFFFFF', 
              border: '1px solid var(--teal-200)', 
              borderRadius: 'var(--radius-sm)', 
              padding: '0.4rem 0.75rem', 
              marginBottom: '1rem', 
              fontSize: '0.8rem', 
              color: 'var(--teal-800)',
              fontFamily: 'monospace',
              wordBreak: 'break-all'
            }}>
              <strong>Encoded URL:</strong> {encodedUrl}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button 
                onClick={handleDownloadQr} 
                className="btn btn-sm btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Download size={15} />
                <span>Download QR (.PNG)</span>
              </button>

              <button 
                onClick={handleCopyLink} 
                className="btn btn-sm btn-outline"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                {copied ? <Check size={15} style={{ color: 'var(--primary-700)' }} /> : <Copy size={15} />}
                <span>{copied ? 'Link Copied!' : 'Copy Passport URL'}</span>
              </button>

              <button 
                onClick={handleDownloadComplianceJson} 
                className="btn btn-sm btn-outline"
                title="Download verified EU DPP compliant JSON record"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', borderColor: 'var(--teal-600)', color: 'var(--teal-700)' }}
              >
                <FileText size={15} />
                <span>Export DPP (.JSON)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Specifications & Circular Economy Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
          
          {/* Specification Card */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-900)' }}>
              <FileText size={20} style={{ color: 'var(--teal-600)' }} />
              Manufacturing & Origin
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Building2 size={16} /> Manufacturer
                </span>
                <span style={{ fontWeight: 600, color: 'var(--primary-900)' }}>{product.manufacturer}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={16} /> Country of Origin
                </span>
                <span style={{ fontWeight: 600, color: 'var(--primary-900)' }}>{product.countryOfOrigin}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Calendar size={16} /> Production Date
                </span>
                <span style={{ fontWeight: 600, color: 'var(--primary-900)' }}>{product.mfgDate}</span>
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
                  Product Description:
                </span>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                  {product.description}
                </p>
              </div>
            </div>
          </div>

          {/* Materials & Circularity Card */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-900)' }}>
              <Layers size={20} style={{ color: 'var(--teal-600)' }} />
              Materials & Circular Economy
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.95rem' }}>
              <div style={{ background: 'var(--teal-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--teal-100)' }}>
                <span style={{ fontWeight: 700, color: 'var(--teal-900)', display: 'block', marginBottom: '0.35rem' }}>
                  Materials Composition
                </span>
                <span style={{ color: 'var(--teal-800)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  {product.materials || 'Standard eco-certified circular components.'}
                </span>
              </div>

              <div>
                <span style={{ fontWeight: 600, color: 'var(--primary-900)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                  <Sparkles size={16} style={{ color: 'var(--teal-600)' }} /> Care & Maintenance
                </span>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
                  {product.careInstructions || 'Follow standard cleaning guidelines.'}
                </p>
              </div>

              <div>
                <span style={{ fontWeight: 600, color: 'var(--primary-900)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                  <RotateCcw size={16} style={{ color: 'var(--teal-600)' }} /> Recycling & End of Life
                </span>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
                  {product.recyclingInstructions || 'Return to certified collection hubs.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance and Repair History */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <h3 style={{ fontSize: '1.35rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-900)' }}>
              <Wrench size={22} style={{ color: 'var(--teal-600)' }} />
              Authorized Repair & Service History
            </h3>
            <span className="badge badge-teal">
              {product.repairHistory && product.repairHistory.length > 0
                ? `${product.repairHistory.length} Service Record(s)`
                : 'No Service Events Logged'}
            </span>
          </div>

          {product.repairHistory && product.repairHistory.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {product.repairHistory.map((repair, idx) => (
                <div key={repair.id || idx} style={{
                  border: '1px solid var(--border-light)',
                  borderLeft: '4px solid var(--teal-600)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  background: 'var(--bg-subtle)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--primary-900)', fontSize: '1rem' }}>
                      {repair.serviceCenter}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={14} /> Service Date: {repair.repairDate}
                    </div>
                  </div>
                  <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
                    <strong>Action:</strong> {repair.description}
                  </p>
                  {repair.partsReplaced && (
                    <p style={{ margin: '0 0 0.5rem 0', color: 'var(--teal-800)', fontSize: '0.875rem' }}>
                      <strong>Replaced Parts:</strong> {repair.partsReplaced}
                    </p>
                  )}
                  {repair.technicianNotes && (
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                      <strong>Technician Notes:</strong> "{repair.technicianNotes}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>
                This product remains in original factory condition with zero authorized service interventions.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
