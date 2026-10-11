import React, { useState, useEffect, useCallback } from 'react';
import {
  getAdminProductRepairs,
  createAdminRepair,
  updateAdminRepair,
  deleteAdminRepair
} from '../services/adminApi';

export const AdminRepairModal = ({ isOpen, onClose, product, onRepairsUpdated }) => {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Form State
  const [editingRepairId, setEditingRepairId] = useState(null);
  const [formData, setFormData] = useState({
    repairDate: new Date().toISOString().split('T')[0],
    serviceCenter: '',
    description: '',
    partsReplaced: '',
    technicianNotes: ''
  });

  const [fieldErrors, setFieldErrors] = useState({});

  const loadRepairs = useCallback(async () => {
    if (!product?.id) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await getAdminProductRepairs(product.id);
      setRepairs(data || []);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to load maintenance records.');
    } finally {
      setLoading(false);
    }
  }, [product?.id]);

  useEffect(() => {
    if (isOpen && product?.id) {
      loadRepairs();
      resetForm();
    }
  }, [isOpen, product?.id, loadRepairs]);

  const resetForm = () => {
    setEditingRepairId(null);
    setFormData({
      repairDate: new Date().toISOString().split('T')[0],
      serviceCenter: '',
      description: '',
      partsReplaced: '',
      technicianNotes: ''
    });
    setFieldErrors({});
    setErrorMsg(null);
  };

  const startEdit = (repair) => {
    setEditingRepairId(repair.id);
    setFormData({
      repairDate: repair.repairDate || '',
      serviceCenter: repair.serviceCenter || '',
      description: repair.description || '',
      partsReplaced: repair.partsReplaced || '',
      technicianNotes: repair.technicianNotes || ''
    });
    setFieldErrors({});
    setErrorMsg(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.repairDate) {
      errors.repairDate = 'Repair date is required.';
    }
    if (!formData.serviceCenter.trim()) {
      errors.serviceCenter = 'Service center / facility name is required.';
    }
    if (!formData.description.trim()) {
      errors.description = 'Repair description is required.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setErrorMsg(null);
    try {
      if (editingRepairId) {
        await updateAdminRepair(product.id, editingRepairId, formData);
        setSuccessMsg('Maintenance record updated successfully.');
      } else {
        await createAdminRepair(product.id, formData);
        setSuccessMsg('New maintenance event logged successfully.');
      }
      resetForm();
      await loadRepairs();
      if (onRepairsUpdated) onRepairsUpdated();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save maintenance record.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (repairId) => {
    if (!window.confirm('Are you sure you want to delete this maintenance record?')) return;

    setLoading(true);
    setErrorMsg(null);
    try {
      await deleteAdminRepair(product.id, repairId);
      setSuccessMsg('Maintenance record deleted successfully.');
      if (editingRepairId === repairId) resetForm();
      await loadRepairs();
      if (onRepairsUpdated) onRepairsUpdated();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete maintenance record.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '820px', width: '95%', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Modal Header */}
        <div className="modal-header" style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span className="product-code-cell">{product.productCode}</span>
                <span className="admin-badge">Maintenance Log</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-900)' }}>
                {product.name}
              </h3>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: 'var(--text-muted)'
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Alerts */}
        {successMsg && (
          <div className="admin-alert success" style={{ margin: '1rem 0' }}>
            <span>✅</span>
            <div style={{ flex: 1 }}>{successMsg}</div>
            <button
              onClick={() => setSuccessMsg(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
            >
              ×
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="admin-alert error" style={{ margin: '1rem 0' }}>
            <span>⚠️</span>
            <div style={{ flex: 1 }}>{errorMsg}</div>
            <button
              onClick={() => setErrorMsg(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
            >
              ×
            </button>
          </div>
        )}

        {/* Existing Repairs Timeline / Table */}
        <div style={{ margin: '1.25rem 0' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '0.75rem' }}>
            Logged Service History ({repairs.length} records)
          </h4>

          {loading && repairs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div className="spinner" style={{ margin: '0 auto 0.5rem auto' }}></div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Loading service logs...</p>
            </div>
          ) : repairs.length === 0 ? (
            <div style={{ padding: '1.25rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              No maintenance records logged yet. Log the first service intervention using the form below.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {repairs.map((r) => (
                <div
                  key={r.id}
                  style={{
                    background: editingRepairId === r.id ? '#EFF6FF' : '#FAFAFA',
                    border: editingRepairId === r.id ? '1px solid #3B82F6' : '1px solid #E2E8F0',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    transition: 'var(--transition)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 700, color: 'var(--teal-700)', fontSize: '0.88rem' }}>
                          📅 {r.repairDate}
                        </span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                          • {r.serviceCenter}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '0.35rem' }}>
                        {r.description}
                      </p>
                      {r.partsReplaced && (
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                          <strong>Parts:</strong> {r.partsReplaced}
                        </div>
                      )}
                      {r.technicianNotes && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.2rem' }}>
                          <strong>Diagnostic Notes:</strong> {r.technicianNotes}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        type="button"
                        className="action-btn"
                        onClick={() => startEdit(r)}
                        title="Edit record"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        type="button"
                        className="action-btn delete"
                        onClick={() => handleDelete(r.id)}
                        title="Delete record"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add / Edit Form */}
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-900)' }}>
              {editingRepairId ? '✏️ Edit Maintenance Record' : '➕ Log New Maintenance Event'}
            </h4>
            {editingRepairId && (
              <button
                type="button"
                onClick={resetForm}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '0.82rem', textDecoration: 'underline' }}
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid-2">
              <div className="form-group">
                <label htmlFor="repairDate">
                  Service Date <span className="required">*</span>
                </label>
                <input
                  id="repairDate"
                  name="repairDate"
                  type="date"
                  className={`form-control ${fieldErrors.repairDate ? 'has-error' : ''}`}
                  value={formData.repairDate}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
                {fieldErrors.repairDate && <div className="field-error-msg">{fieldErrors.repairDate}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="serviceCenter">
                  Service Center / Facility <span className="required">*</span>
                </label>
                <input
                  id="serviceCenter"
                  name="serviceCenter"
                  type="text"
                  placeholder="e.g. Stockholm Eco Diagnostics Lab"
                  className={`form-control ${fieldErrors.serviceCenter ? 'has-error' : ''}`}
                  value={formData.serviceCenter}
                  onChange={handleInputChange}
                  required
                />
                {fieldErrors.serviceCenter && <div className="field-error-msg">{fieldErrors.serviceCenter}</div>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">
                Intervention Description <span className="required">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows="2"
                placeholder="Describe diagnostics, maintenance procedures, or battery/cell replacements..."
                className={`form-control ${fieldErrors.description ? 'has-error' : ''}`}
                value={formData.description}
                onChange={handleInputChange}
                required
              />
              {fieldErrors.description && <div className="field-error-msg">{fieldErrors.description}</div>}
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label htmlFor="partsReplaced">Components / Parts Replaced</label>
                <input
                  id="partsReplaced"
                  name="partsReplaced"
                  type="text"
                  placeholder="e.g. Silicone O-Ring Gasket (Model GK-750)"
                  className="form-control"
                  value={formData.partsReplaced}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="technicianNotes">Technician Diagnostics & Validation Notes</label>
                <input
                  id="technicianNotes"
                  name="technicianNotes"
                  type="text"
                  placeholder="e.g. Thermal seal verified (keeps hot 18h)"
                  className="form-control"
                  value={formData.technicianNotes}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="button" className="btn-secondary" onClick={onClose}>
                Close
              </button>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : editingRepairId ? '💾 Update Service Record' : '✨ Save Maintenance Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminRepairModal;
