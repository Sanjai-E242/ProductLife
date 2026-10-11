import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getAdminProducts, deleteAdminProduct, downloadProductQrImage } from '../../services/adminApi';
import { downloadPassportComplianceExport } from '../../services/api';
import { AdminRepairModal } from '../../components/AdminRepairModal';
import { useAdminAuth } from '../../context/AdminAuthContext';
import './Admin.css';

export const AdminProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '0', 10));
  const [size, setSize] = useState(parseInt(searchParams.get('size') || '10', 10));
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [keyword, setKeyword] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Modals state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [qrModalProduct, setQrModalProduct] = useState(null);
  const [repairTargetProduct, setRepairTargetProduct] = useState(null);

  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  const fetchProducts = useCallback(async (targetPage = page) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminProducts(
        targetPage,
        size,
        keyword.trim() || null,
        category || null,
        status || null
      );
      setProducts(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
      setPage(data.page || 0);
    } catch (err) {
      if (err.status === 401) {
        navigate('/admin/login');
      } else {
        setError(err.message || 'Failed to retrieve products list.');
      }
    } finally {
      setLoading(false);
    }
  }, [page, size, keyword, category, status, navigate]);

  useEffect(() => {
    fetchProducts(0);
  }, [size, category, status]);

  // Handle Search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts(0);
  };

  // Handle Deletion
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteAdminProduct(deleteTarget.id);
      setSuccessMsg(`Product passport "${deleteTarget.name}" (${deleteTarget.productCode}) deleted successfully.`);
      setDeleteTarget(null);
      fetchProducts(page);
    } catch (err) {
      setError(err.message || 'Failed to delete product.');
    } finally {
      setDeleting(false);
    }
  };

  const handleDownloadQr = (p) => {
    downloadProductQrImage(p.id, p.productCode);
  };

  return (
    <div className="admin-layout">
      <div className="admin-container">
        {/* Header Bar */}
        <div className="admin-header-bar">
          <div className="admin-header-titles">
            <h1>
              Product Passport Management
              <span className="admin-badge">Admin Mode</span>
            </h1>
            <p>Manage, search, create, and update Digital Product Passports registered in ProductLife.</p>
          </div>
          <div className="admin-header-actions">
            <Link to="/admin/products/new" className="btn-primary">
              <span>+</span> New Product Passport
            </Link>
            <button onClick={logout} className="btn-secondary">
              Log Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="admin-tabs">
          <Link to="/admin" className="admin-tab">
            📊 Overview & Metrics
          </Link>
          <Link to="/admin/products" className="admin-tab active">
            📦 Manage Passports
          </Link>
          <Link to="/" className="admin-tab">
            🌐 Public Explorer
          </Link>
        </div>

        {/* Success and Error Alerts */}
        {successMsg && (
          <div className="admin-alert success">
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

        {error && (
          <div className="admin-alert error">
            <span>⚠️</span>
            <div style={{ flex: 1 }}>{error}</div>
            <button
              onClick={() => setError(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
            >
              ×
            </button>
          </div>
        )}

        {/* Filters & Search Toolbar */}
        <div className="admin-toolbar-card">
          <form onSubmit={handleSearchSubmit} className="admin-filters-group">
            <input
              type="text"
              className="admin-search-input"
              placeholder="Search by code, title, brand, materials..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="submit" className="btn-secondary btn-sm">
              🔍 Search
            </button>

            <select
              className="admin-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Drinkware">Drinkware</option>
              <option value="Footwear">Footwear</option>
              <option value="Electronics">Electronics</option>
              <option value="Gear">Gear</option>
            </select>

            <select
              className="admin-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="DRAFT">DRAFT</option>
              <option value="DISCONTINUED">DISCONTINUED</option>
              <option value="RECALLED">RECALLED</option>
            </select>

            {(keyword || category || status) && (
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => {
                  setKeyword('');
                  setCategory('');
                  setStatus('');
                }}
              >
                Clear Filters
              </button>
            )}
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Total: <strong>{totalElements}</strong>
            </span>
            <select
              className="admin-select"
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value, 10))}
              style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
            >
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="admin-table-card">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
              <div className="spinner" style={{ margin: '0 auto 1rem auto' }}></div>
              <p style={{ color: 'var(--text-secondary)' }}>Loading passport catalog...</p>
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                No product passports match the specified search or filter criteria.
              </p>
              <Link to="/admin/products/new" className="btn-primary">
                + Create New Passport
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Passport Code</th>
                    <th>Product Name & Brand</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Repairs</th>
                    <th>Origin</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <span className="product-code-cell">{p.productCode}</span>
                      </td>
                      <td>
                        <div className="product-title-cell">{p.name}</div>
                        <div className="product-brand-sub">{p.brand} • {p.model || 'Standard'}</div>
                      </td>
                      <td>{p.category}</td>
                      <td>
                        <span className={`status-pill ${(p.status || 'ACTIVE').toLowerCase()}`}>
                          {p.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: (p.repairCount || 0) > 0 ? 'var(--teal-700)' : 'var(--text-muted)' }}>
                          {p.repairCount || 0}
                        </span>
                      </td>
                      <td>{p.countryOfOrigin || '—'}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                          <Link
                            to={`/products/${p.id}`}
                            className="action-btn"
                            target="_blank"
                            rel="noreferrer"
                            title="View Public Passport in new tab"
                          >
                            👁️ View
                          </Link>
                          <button
                            type="button"
                            className="action-btn"
                            onClick={() => setQrModalProduct(p)}
                            title="Preview and Download QR Code"
                          >
                            📱 QR
                          </button>
                          <button
                            type="button"
                            className="action-btn"
                            onClick={() => setRepairTargetProduct(p)}
                            title="Manage Maintenance & Repair History"
                            style={{ color: '#0F766E', borderColor: '#CCFBF1', backgroundColor: '#F0FDFA' }}
                          >
                            🔧 Repairs ({p.repairCount || 0})
                          </button>
                          <button
                            type="button"
                            className="action-btn"
                            onClick={() => downloadPassportComplianceExport(p.id, p.productCode)}
                            title="Download EU DPP Compliance JSON Export"
                          >
                            📄 Export
                          </button>
                          <Link
                            to={`/admin/products/${p.id}/edit`}
                            className="action-btn"
                            title="Edit Product Passport"
                          >
                            ✏️ Edit
                          </Link>
                          <button
                            type="button"
                            className="action-btn delete"
                            onClick={() => setDeleteTarget(p)}
                            title="Delete Product Passport"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="admin-pagination-bar">
              <div className="pagination-info">
                Showing page <strong>{page + 1}</strong> of <strong>{totalPages}</strong> ({totalElements} total items)
              </div>
              <div className="pagination-controls">
                <button
                  type="button"
                  className="page-btn"
                  disabled={page === 0}
                  onClick={() => fetchProducts(page - 1)}
                >
                  ← Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`page-btn ${i === page ? 'active' : ''}`}
                    onClick={() => fetchProducts(i)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  type="button"
                  className="page-btn"
                  disabled={page >= totalPages - 1}
                  onClick={() => fetchProducts(page + 1)}
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteTarget && (
          <div className="modal-overlay" onClick={() => !deleting && setDeleteTarget(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Delete Product Passport</h3>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to permanently delete the Digital Product Passport for{' '}
                  <strong>{deleteTarget.name}</strong> (Code: <code>{deleteTarget.productCode}</code>)?
                </p>
                <p style={{ marginTop: '0.75rem', color: '#DC2626', fontSize: '0.85rem' }}>
                  ⚠️ This action will remove the passport record and associated repair history logs.
                </p>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={deleting}
                  onClick={() => setDeleteTarget(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-danger"
                  disabled={deleting}
                  onClick={confirmDelete}
                >
                  {deleting ? 'Deleting...' : 'Confirm Deletion'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* QR Code Preview Modal */}
        {qrModalProduct && (
          <div className="modal-overlay" onClick={() => setQrModalProduct(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Digital Passport QR Code</h3>
              </div>
              <div className="qr-modal-body">
                <img
                  src={`http://localhost:8081/api/products/${qrModalProduct.id}/qrcode?size=260`}
                  alt={`QR for ${qrModalProduct.name}`}
                  className="qr-preview-img"
                />
                <div style={{ fontWeight: 700, color: 'var(--primary-900)', marginBottom: '0.25rem' }}>
                  {qrModalProduct.name}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  Product Code: <code>{qrModalProduct.productCode}</code>
                </div>
                <div className="qr-target-url">
                  {qrModalProduct.passportUrl || `http://192.168.1.6:5174/products/${qrModalProduct.id}`}
                </div>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setQrModalProduct(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => handleDownloadQr(qrModalProduct)}
                >
                  📥 Download PNG
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Repair History Management Modal */}
        {repairTargetProduct && (
          <AdminRepairModal
            isOpen={Boolean(repairTargetProduct)}
            onClose={() => setRepairTargetProduct(null)}
            product={repairTargetProduct}
            onRepairsUpdated={() => fetchProducts(page)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminProductList;
