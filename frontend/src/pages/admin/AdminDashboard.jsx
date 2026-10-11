import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAdminDashboardStats } from '../../services/adminApi';
import { useAdminAuth } from '../../context/AdminAuthContext';
import './Admin.css';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { username, logout } = useAdminAuth();
  const navigate = useNavigate();

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminDashboardStats();
      setStats(data);
    } catch (err) {
      if (err.status === 401) {
        navigate('/admin/login');
      } else {
        setError(err.message || 'Failed to load administrator statistics.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="admin-layout">
      <div className="admin-container">
        {/* Header Bar */}
        <div className="admin-header-bar">
          <div className="admin-header-titles">
            <h1>
              Passport Control Center
              <span className="admin-badge">Admin Mode</span>
            </h1>
            <p>Welcome back, <strong>{username}</strong>. Overview of digital product passports, lifecycle states, and repair metrics.</p>
          </div>
          <div className="admin-header-actions">
            <Link to="/admin/products/new" className="btn-primary">
              <span>+</span> Create New Passport
            </Link>
            <button onClick={logout} className="btn-secondary" title="Sign out of administrative session">
              Log Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="admin-tabs">
          <Link to="/admin" className="admin-tab active">
            📊 Overview & Metrics
          </Link>
          <Link to="/admin/products" className="admin-tab">
            📦 Manage Passports
          </Link>
          <Link to="/" className="admin-tab">
            🌐 Public Explorer
          </Link>
        </div>

        {error && (
          <div className="admin-alert error">
            <span>⚠️</span>
            <div>
              <strong>Error loading dashboard:</strong> {error}
              <button
                onClick={fetchStats}
                style={{ marginLeft: '1rem', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem auto' }}></div>
            <p style={{ color: 'var(--text-secondary)' }}>Loading administrative metrics...</p>
          </div>
        ) : stats ? (
          <>
            {/* KPI Stat Cards */}
            <div className="admin-stats-grid">
              <div className="stat-card">
                <div className="stat-icon total">📦</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.totalProducts}</div>
                  <div className="stat-label">Total Passports</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon active">✅</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.activeProducts}</div>
                  <div className="stat-label">Active Passports</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon draft">📝</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.draftProducts}</div>
                  <div className="stat-label">Draft / Pending</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon discontinued">⛔</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.discontinuedProducts}</div>
                  <div className="stat-label">Discontinued / Recalled</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon repairs">🔧</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.totalRepairs}</div>
                  <div className="stat-label">Recorded Repairs</div>
                </div>
              </div>
            </div>

            {/* Category Breakdown & Quick Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="admin-table-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '1rem' }}>
                  Category Distribution ({stats.totalCategories} active)
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {Object.entries(stats.categoryBreakdown || {}).map(([cat, count]) => (
                    <div
                      key={cat}
                      style={{
                        padding: '0.4rem 0.85rem',
                        background: 'var(--bg-subtle)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: 'var(--primary-800)',
                        border: '1px solid var(--border-light)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <span>{cat}</span>
                      <span style={{ background: 'var(--teal-600)', color: '#fff', borderRadius: '50%', padding: '0.1rem 0.45rem', fontSize: '0.75rem' }}>
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="admin-table-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-900)', marginBottom: '1rem' }}>
                  Lifecycle Status Breakdown
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {Object.entries(stats.statusBreakdown || {}).map(([st, cnt]) => (
                    <div key={st} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className={`status-pill ${st.toLowerCase()}`}>{st}</span>
                      <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>{cnt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Product Passports Activity */}
            <div className="admin-table-card">
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-900)' }}>
                  Recently Updated Passports
                </h3>
                <Link to="/admin/products" style={{ fontSize: '0.88rem', color: 'var(--teal-600)', fontWeight: 600, textDecoration: 'none' }}>
                  View All Passports →
                </Link>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product Code</th>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Repairs</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(stats.recentProducts || []).map((p) => (
                      <tr key={p.id}>
                        <td>
                          <span className="product-code-cell">{p.productCode}</span>
                        </td>
                        <td>
                          <div className="product-title-cell">{p.name}</div>
                          <div className="product-brand-sub">{p.brand} • {p.model}</div>
                        </td>
                        <td>{p.category}</td>
                        <td>
                          <span className={`status-pill ${(p.status || 'ACTIVE').toLowerCase()}`}>
                            {p.status || 'ACTIVE'}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 600, color: p.repairCount > 0 ? 'var(--teal-700)' : 'var(--text-muted)' }}>
                            {p.repairCount} logs
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                            <Link to={`/products/${p.id}`} className="action-btn" target="_blank" rel="noreferrer" title="Open Public Passport">
                              👁️ View
                            </Link>
                            <Link to={`/admin/products/${p.id}/edit`} className="action-btn" title="Edit Passport">
                              ✏️ Edit
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default AdminDashboard;
