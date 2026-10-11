import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  getAdminProductById,
  createAdminProduct,
  updateAdminProduct
} from '../../services/adminApi';
import { AdminRepairModal } from '../../components/AdminRepairModal';
import { useAdminAuth } from '../../context/AdminAuthContext';
import './Admin.css';

export const AdminProductForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  const [formData, setFormData] = useState({
    productCode: '',
    name: '',
    brand: '',
    category: 'Drinkware',
    model: '',
    manufacturer: '',
    countryOfOrigin: '',
    mfgDate: new Date().toISOString().split('T')[0],
    description: '',
    materials: '',
    careInstructions: '',
    recyclingInstructions: '',
    imageUrl: '/images/flask.png',
    status: 'ACTIVE'
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [showRepairModal, setShowRepairModal] = useState(false);

  // Load existing product if in Edit mode
  useEffect(() => {
    if (!isEditMode) return;

    const loadProduct = async () => {
      setLoading(true);
      setGeneralError(null);
      try {
        const p = await getAdminProductById(id);
        setFormData({
          productCode: p.productCode || '',
          name: p.name || '',
          brand: p.brand || '',
          category: p.category || 'Drinkware',
          model: p.model || '',
          manufacturer: p.manufacturer || '',
          countryOfOrigin: p.countryOfOrigin || '',
          mfgDate: p.mfgDate ? p.mfgDate.split('T')[0] : '',
          description: p.description || '',
          materials: p.materials || '',
          careInstructions: p.careInstructions || '',
          recyclingInstructions: p.recyclingInstructions || '',
          imageUrl: p.imageUrl || '/images/flask.png',
          status: p.status || 'ACTIVE'
        });
      } catch (err) {
        if (err.status === 401) {
          navigate('/admin/login');
        } else {
          setGeneralError(err.message || 'Failed to load product details.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error on change
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.productCode.trim()) {
      errors.productCode = 'Product Passport Code is required (e.g. PL-ECO-005).';
    } else if (formData.productCode.length > 50) {
      errors.productCode = 'Product Code cannot exceed 50 characters.';
    }

    if (!formData.name.trim()) {
      errors.name = 'Product Name is required.';
    } else if (formData.name.length > 200) {
      errors.name = 'Product Name cannot exceed 200 characters.';
    }

    if (!formData.brand.trim()) {
      errors.brand = 'Brand / Brand Owner is required.';
    }

    if (!formData.category.trim()) {
      errors.category = 'Category is required.';
    }

    if (!formData.countryOfOrigin.trim()) {
      errors.countryOfOrigin = 'Country of Origin is required.';
    }

    if (!formData.mfgDate) {
      errors.mfgDate = 'Manufacturing Date is required.';
    }

    if (!formData.description.trim()) {
      errors.description = 'Product description is required.';
    }

    if (!formData.materials.trim()) {
      errors.materials = 'Material composition disclosure is required.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      if (isEditMode) {
        await updateAdminProduct(id, formData);
      } else {
        await createAdminProduct(formData);
      }
      navigate('/admin/products');
    } catch (err) {
      if (err.status === 409) {
        setFieldErrors((prev) => ({
          ...prev,
          productCode: err.message || 'Product code already exists. Please choose a unique code.'
        }));
        setGeneralError(`Conflict (HTTP 409): ${err.message}`);
      } else if (err.status === 401) {
        navigate('/admin/login');
      } else if (err.data && err.data.errors) {
        // Backend validation field errors
        setFieldErrors(err.data.errors);
        setGeneralError('Please correct the validation errors below.');
      } else {
        setGeneralError(err.message || 'Failed to save product passport.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <div className="admin-container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem auto' }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <div className="admin-container">
        {/* Header Bar */}
        <div className="admin-header-bar">
          <div className="admin-header-titles">
            <h1>
              {isEditMode ? 'Edit Product Passport' : 'Create New Product Passport'}
              <span className="admin-badge">Admin Mode</span>
            </h1>
            <p>
              {isEditMode
                ? `Updating digital passport for ${formData.name} (${formData.productCode})`
                : 'Register a new verified Digital Product Passport into the circular ecosystem.'}
            </p>
          </div>
          <div className="admin-header-actions">
            <Link to="/admin/products" className="btn-secondary">
              ← Back to Catalog
            </Link>
            <button onClick={logout} className="btn-secondary">
              Log Out
            </button>
          </div>
        </div>

        {generalError && (
          <div className="admin-alert error" role="alert">
            <span>⚠️</span>
            <div>{generalError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="admin-form-container">
            {/* Main Form Content */}
            <div className="admin-form-card">
              {/* Primary Identity Section */}
              <div className="form-section-title">1. Identification & Lifecycle Status</div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="productCode">
                    Passport Code <span className="required">*</span>
                  </label>
                  <input
                    id="productCode"
                    name="productCode"
                    type="text"
                    className={`form-control ${fieldErrors.productCode ? 'has-error' : ''}`}
                    placeholder="e.g. PL-ECO-005"
                    value={formData.productCode}
                    onChange={handleChange}
                  />
                  {fieldErrors.productCode && (
                    <div className="field-error-msg">{fieldErrors.productCode}</div>
                  )}
                  <div className="field-help-text">Unique uppercase identifier (e.g. PL-CAT-XXX)</div>
                </div>

                <div className="form-group">
                  <label htmlFor="status">
                    Lifecycle Status <span className="required">*</span>
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="form-control"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="ACTIVE">ACTIVE (Published & Public)</option>
                    <option value="DRAFT">DRAFT (Work in progress)</option>
                    <option value="DISCONTINUED">DISCONTINUED (End of Life)</option>
                    <option value="RECALLED">RECALLED (Safety Notice)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="name">
                  Product Commercial Name <span className="required">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className={`form-control ${fieldErrors.name ? 'has-error' : ''}`}
                  placeholder="e.g. UrbanFlow Recycled Commuter Helmet"
                  value={formData.name}
                  onChange={handleChange}
                />
                {fieldErrors.name && <div className="field-error-msg">{fieldErrors.name}</div>}
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="brand">
                    Brand Name <span className="required">*</span>
                  </label>
                  <input
                    id="brand"
                    name="brand"
                    type="text"
                    className={`form-control ${fieldErrors.brand ? 'has-error' : ''}`}
                    placeholder="e.g. CircuWear"
                    value={formData.brand}
                    onChange={handleChange}
                  />
                  {fieldErrors.brand && <div className="field-error-msg">{fieldErrors.brand}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="category">
                    Category <span className="required">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="form-control"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="Drinkware">Drinkware</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Gear">Gear</option>
                    <option value="Apparel">Apparel</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="model">Model Number / Variant</label>
                  <input
                    id="model"
                    name="model"
                    type="text"
                    className="form-control"
                    placeholder="e.g. UF-HLM-2024"
                    value={formData.model}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="manufacturer">Manufacturer Entity</label>
                  <input
                    id="manufacturer"
                    name="manufacturer"
                    type="text"
                    className="form-control"
                    placeholder="e.g. Nordic Sustainable Polymer AB"
                    value={formData.manufacturer}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="countryOfOrigin">
                    Country of Origin <span className="required">*</span>
                  </label>
                  <input
                    id="countryOfOrigin"
                    name="countryOfOrigin"
                    type="text"
                    className={`form-control ${fieldErrors.countryOfOrigin ? 'has-error' : ''}`}
                    placeholder="e.g. Portugal"
                    value={formData.countryOfOrigin}
                    onChange={handleChange}
                  />
                  {fieldErrors.countryOfOrigin && (
                    <div className="field-error-msg">{fieldErrors.countryOfOrigin}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="mfgDate">
                    Manufacturing Date <span className="required">*</span>
                  </label>
                  <input
                    id="mfgDate"
                    name="mfgDate"
                    type="date"
                    className={`form-control ${fieldErrors.mfgDate ? 'has-error' : ''}`}
                    value={formData.mfgDate}
                    onChange={handleChange}
                  />
                  {fieldErrors.mfgDate && (
                    <div className="field-error-msg">{fieldErrors.mfgDate}</div>
                  )}
                </div>
              </div>

              {/* Sustainability & Circularity Section */}
              <div className="form-section-title" style={{ marginTop: '1.5rem' }}>
                2. Circularity & Sustainability Specifications
              </div>

              <div className="form-group">
                <label htmlFor="description">
                  Product Overview & Story <span className="required">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  className={`form-control ${fieldErrors.description ? 'has-error' : ''}`}
                  placeholder="Detailed summary of the product's ecological design and purpose..."
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                />
                {fieldErrors.description && (
                  <div className="field-error-msg">{fieldErrors.description}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="materials">
                  Material Composition Disclosure <span className="required">*</span>
                </label>
                <textarea
                  id="materials"
                  name="materials"
                  className={`form-control ${fieldErrors.materials ? 'has-error' : ''}`}
                  placeholder="e.g. 85% Recycled Polycarbonate, 15% EPS Bio-Foam..."
                  rows="2"
                  value={formData.materials}
                  onChange={handleChange}
                />
                {fieldErrors.materials && (
                  <div className="field-error-msg">{fieldErrors.materials}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="careInstructions">Care & Maintenance Instructions</label>
                <textarea
                  id="careInstructions"
                  name="careInstructions"
                  className="form-control"
                  placeholder="Recommended upkeep to extend useful service life..."
                  rows="2"
                  value={formData.careInstructions}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="recyclingInstructions">End-of-Life & Recycling Procedures</label>
                <textarea
                  id="recyclingInstructions"
                  name="recyclingInstructions"
                  className="form-control"
                  placeholder="Disassembly instructions and circular take-back instructions..."
                  rows="2"
                  value={formData.recyclingInstructions}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="imageUrl">Product Image Asset Path</label>
                <input
                  id="imageUrl"
                  name="imageUrl"
                  type="text"
                  className="form-control"
                  placeholder="e.g. /images/flask.png, /images/sneaker.png"
                  value={formData.imageUrl}
                  onChange={handleChange}
                />
              </div>

              {/* Form Submission Actions */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                  style={{ minWidth: '160px', justifyContent: 'center' }}
                >
                  {submitting
                    ? 'Saving...'
                    : isEditMode
                    ? '💾 Update Passport'
                    : '✨ Create Passport'}
                </button>
                {isEditMode && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowRepairModal(true)}
                    style={{ borderColor: 'var(--teal-600)', color: 'var(--teal-700)', backgroundColor: '#F0FDFA' }}
                  >
                    🔧 Maintenance & Repairs
                  </button>
                )}
                <Link to="/admin/products" className="btn-secondary">
                  Cancel
                </Link>
              </div>
            </div>

            {/* Sidebar Live Passport Card Preview */}
            <div className="admin-preview-sidebar">
              <div className="preview-card">
                <div className="preview-header">
                  <span>Live Passport Preview</span>
                  <span className={`status-pill ${formData.status.toLowerCase()}`}>
                    {formData.status}
                  </span>
                </div>

                <div className="preview-image-box">
                  <img
                    src={formData.imageUrl || '/images/flask.png'}
                    alt="Preview"
                    onError={(e) => {
                      e.target.src = '/images/flask.png';
                    }}
                  />
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                  <span className="product-code-cell">{formData.productCode || 'PL-CODE-XXX'}</span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-900)', marginBottom: '0.25rem' }}>
                  {formData.name || 'Product Title Preview'}
                </h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  {formData.brand || 'Brand'} • {formData.category}
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '1rem' }}>
                  {formData.description || 'Product description will appear here...'}
                </p>

                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <div><strong>Origin:</strong> {formData.countryOfOrigin || '—'}</div>
                  <div style={{ marginTop: '0.25rem' }}>
                    <strong>Materials:</strong> {formData.materials || '—'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        {isEditMode && showRepairModal && (
          <AdminRepairModal
            isOpen={showRepairModal}
            onClose={() => setShowRepairModal(false)}
            product={{ id, name: formData.name, productCode: formData.productCode }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminProductForm;
