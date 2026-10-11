import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { 
  Camera, 
  CameraOff, 
  QrCode, 
  Upload, 
  Search, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  ShieldCheck, 
  Smartphone,
  ExternalLink
} from 'lucide-react';
import { resolveScannedPassport } from '../services/api';
import './Pages.css';

export default function QrScanner() {
  const navigate = useNavigate();

  // Scanner Modes: 'camera' | 'upload' | 'manual'
  const [activeTab, setActiveTab] = useState('camera');

  // Camera State
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [validationError, setValidationError] = useState(null);

  // Manual Input State
  const [manualInput, setManualInput] = useState('');

  // Refs
  const scannerRef = useRef(null);
  const isScanningRef = useRef(false);

  // Stop camera when unmounting or switching tabs
  const stopCameraScanner = async () => {
    if (scannerRef.current && isScanningRef.current) {
      try {
        await scannerRef.current.stop();
        isScanningRef.current = false;
        setCameraActive(false);
      } catch (err) {
        console.warn('Error stopping scanner:', err);
      }
    }
  };

  const startCameraScanner = async () => {
    setCameraError(null);
    setValidationError(null);
    setScanResult(null);

    // Initialize Html5Qrcode instance
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode('qr-reader');
      }

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };

      await scannerRef.current.start(
        { facingMode: 'environment' },
        config,
        handleSuccessfulScan,
        (errorMessage) => {
          // Standard scanning frame error (ignored while searching)
        }
      );

      isScanningRef.current = true;
      setCameraActive(true);
    } catch (err) {
      console.error('Camera start failure:', err);
      isScanningRef.current = false;
      setCameraActive(false);

      if (err.name === 'NotAllowedError' || String(err).includes('Permission')) {
        setCameraError('Camera access was denied. Please allow camera permissions in your browser or use the manual code entry below.');
      } else if (err.name === 'NotFoundError' || String(err).includes('NotFound')) {
        setCameraError('No video camera was detected on this device. You can upload a QR image or enter the passport code below.');
      } else {
        setCameraError(err.message || 'Unable to access camera feed.');
      }
    }
  };

  // Trigger on scan detected
  const handleSuccessfulScan = async (decodedText) => {
    // Prevent multiple concurrent scans
    if (isProcessing) return;

    setIsProcessing(true);
    await stopCameraScanner();

    processScannedIdentifier(decodedText);
  };

  // Securely validate and navigate to passport
  const processScannedIdentifier = async (rawText) => {
    setValidationError(null);
    setIsProcessing(true);

    try {
      const result = await resolveScannedPassport(rawText);
      setScanResult(result);

      // Brief success animation before redirect
      setTimeout(() => {
        navigate(`/products/${result.id}`);
      }, 900);
    } catch (err) {
      console.warn('Scan resolution rejected:', err);
      setValidationError(err.message || 'Scanned QR code does not match a valid ProductLife passport.');
      setIsProcessing(false);
    }
  };

  // File Upload QR Scan Handler
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setValidationError(null);
    setIsProcessing(true);

    try {
      const html5QrCode = new Html5Qrcode('qr-reader-file-temp');
      const decodedText = await html5QrCode.scanFile(file, true);
      html5QrCode.clear();

      await processScannedIdentifier(decodedText);
    } catch (err) {
      console.error('File scan error:', err);
      setValidationError('No valid QR code was detected in the selected image file. Please ensure the code is clear and well-lit.');
      setIsProcessing(false);
    }
  };

  // Manual Form Submission
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    processScannedIdentifier(manualInput.trim());
  };

  // Lifecycle for Tab Switch
  useEffect(() => {
    if (activeTab === 'camera') {
      startCameraScanner();
    } else {
      stopCameraScanner();
    }

    return () => {
      stopCameraScanner();
    };
  }, [activeTab]);

  return (
    <div className="page-wrapper">
      {/* Page Hero */}
      <section className="page-hero">
        <div className="container page-hero-content">
          <span className="badge badge-green">Optical Scanner</span>
          <h1>Scan Digital Product Passport</h1>
          <p>
            Scan a physical product's QR code with your camera or enter its passport ID
            to access authenticated circular lifecycle records.
          </p>
        </div>
      </section>

      <section className="container" style={{ maxWidth: '720px' }}>
        
        {/* Tab Selection */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.75rem',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setActiveTab('camera')}
            className={`btn ${activeTab === 'camera' ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: 'var(--radius-full)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Camera size={18} />
            <span>Camera Scanner</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`btn ${activeTab === 'upload' ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: 'var(--radius-full)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Upload size={18} />
            <span>Upload Image</span>
          </button>

          <button
            onClick={() => setActiveTab('manual')}
            className={`btn ${activeTab === 'manual' ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: 'var(--radius-full)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Search size={18} />
            <span>Manual Entry</span>
          </button>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem'
          }}>
            <AlertCircle size={24} style={{ color: '#DC2626', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <strong style={{ color: '#991B1B', display: 'block', marginBottom: '0.25rem' }}>
                Passport Verification Failed
              </strong>
              <p style={{ color: '#7F1D1D', fontSize: '0.925rem', margin: 0, lineHeight: '1.5' }}>
                {validationError}
              </p>
            </div>
          </div>
        )}

        {/* Successful Validation Banner */}
        {scanResult && (
          <div style={{
            background: 'var(--primary-50)',
            border: '1px solid var(--primary-200)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            <CheckCircle2 size={36} style={{ color: 'var(--primary-700)', margin: '0 auto 0.5rem auto' }} />
            <h3 style={{ color: 'var(--primary-900)', marginBottom: '0.25rem' }}>Passport Verified!</h3>
            <p style={{ color: 'var(--teal-800)', fontSize: '0.95rem', margin: 0 }}>
              Opening digital passport for <strong>{scanResult.product.name}</strong> ({scanResult.product.productCode})...
            </p>
          </div>
        )}

        {/* Scanner Panel Card */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          boxShadow: 'var(--shadow-md)',
          textAlign: 'center'
        }}>

          {/* TAB 1: Camera Scanner */}
          {activeTab === 'camera' && (
            <div>
              {cameraError ? (
                <div style={{ padding: '2rem 1rem' }}>
                  <CameraOff size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem auto' }} />
                  <h3 style={{ color: 'var(--primary-900)', marginBottom: '0.5rem' }}>Camera Unavailable</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    {cameraError}
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button onClick={startCameraScanner} className="btn btn-outline">
                      <RefreshCw size={16} /> Retry Camera
                    </button>
                    <button onClick={() => setActiveTab('manual')} className="btn btn-primary">
                      Use Manual Input
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ 
                    position: 'relative', 
                    borderRadius: 'var(--radius-md)', 
                    overflow: 'hidden', 
                    background: '#000000',
                    maxWidth: '400px',
                    margin: '0 auto 1.5rem auto'
                  }}>
                    <div id="qr-reader" style={{ width: '100%' }} />

                    {/* Scanning Target Visual Guide */}
                    {cameraActive && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        pointerEvents: 'none',
                        border: '2px dashed rgba(20, 184, 166, 0.6)',
                        margin: '35px',
                        borderRadius: '12px'
                      }} />
                    )}
                  </div>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>
                    Align the ProductLife QR code within the frame to scan automatically.
                  </p>

                  {cameraActive ? (
                    <button onClick={stopCameraScanner} className="btn btn-sm btn-outline">
                      <CameraOff size={16} /> Pause Camera
                    </button>
                  ) : (
                    <button onClick={startCameraScanner} className="btn btn-sm btn-primary">
                      <Camera size={16} /> Start Camera
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Image File Upload */}
          {activeTab === 'upload' && (
            <div style={{ padding: '2rem 1rem' }}>
              <div id="qr-reader-file-temp" style={{ display: 'none' }} />
              
              <div style={{
                border: '2px dashed var(--teal-300)',
                background: 'var(--teal-50)',
                borderRadius: 'var(--radius-lg)',
                padding: '3rem 2rem',
                cursor: 'pointer',
                marginBottom: '1.5rem',
                position: 'relative'
              }}>
                <Upload size={48} style={{ color: 'var(--teal-700)', margin: '0 auto 1rem auto' }} />
                <h3 style={{ color: 'var(--teal-900)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                  Upload QR Code Image
                </h3>
                <p style={{ color: 'var(--teal-700)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                  Select a PNG, JPEG, or WebP screenshot containing a ProductLife QR code.
                </p>
                
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  disabled={isProcessing}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                />

                <span className="btn btn-primary" style={{ pointerEvents: 'none' }}>
                  Choose Image File
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: Manual Code / ID Entry */}
          {activeTab === 'manual' && (
            <div style={{ padding: '1rem 0' }}>
              <QrCode size={40} style={{ color: 'var(--teal-700)', margin: '0 auto 1rem auto' }} />
              <h3 style={{ color: 'var(--primary-900)', marginBottom: '0.5rem' }}>Manual Passport Lookup</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
                Enter a database ID (e.g. <code>1</code>), passport code (e.g. <code>PL-ECO-001</code>), or paste the passport URL.
              </p>

              <form onSubmit={handleManualSubmit} style={{ maxWidth: '440px', margin: '0 auto' }}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <input
                    type="text"
                    placeholder="e.g. PL-ECO-001 or 1"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    className="form-control"
                    style={{ textAlign: 'center', fontSize: '1.1rem', letterSpacing: '0.02em', padding: '0.85rem' }}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '0.85rem' }}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Verifying Passport...' : 'Verify & Open Passport'}
                </button>
              </form>

              {/* Sample Quick-fill Badges for Easy Demonstration Testing */}
              <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                  Quick demonstration test codes:
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {['PL-ECO-001', 'PL-TEX-002', 'PL-ELE-003', 'PL-OUT-004'].map((demoCode) => (
                    <button
                      key={demoCode}
                      type="button"
                      onClick={() => setManualInput(demoCode)}
                      className="btn btn-sm btn-outline"
                      style={{ fontSize: '0.8rem', padding: '0.25rem 0.65rem' }}
                    >
                      {demoCode}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Security / Privacy Guarantee Banner */}
        <div style={{
          marginTop: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          color: 'var(--text-muted)',
          fontSize: '0.85rem'
        }}>
          <ShieldCheck size={16} style={{ color: 'var(--teal-600)' }} />
          <span>ProductLife camera scanning operates 100% locally in-browser without storing video streams.</span>
        </div>

      </section>
    </div>
  );
}
