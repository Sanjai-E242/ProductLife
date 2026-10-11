import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import './Admin.css';

export const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!username.trim() || !password) {
      setErrorMsg('Please enter both administrative username and password.');
      return;
    }

    setSubmitting(true);
    try {
      await login(username.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Invalid administrative credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="login-brand-header">
          <div className="login-icon">🛡️</div>
          <h2>Admin Authentication</h2>
          <p>ProductLife Digital Product Passport Platform</p>
        </div>

        {errorMsg && (
          <div className="admin-alert error" role="alert">
            <span>⚠️</span>
            <div>{errorMsg}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="admin-username">Administrator Username</label>
            <input
              id="admin-username"
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter administrator username"
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="admin-password">Password</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--teal-600)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  padding: 0
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
            disabled={submitting}
          >
            {submitting ? 'Authenticating...' : 'Sign In to Admin Portal'}
          </button>
        </form>

        <div className="login-hint-box">
          <p>🔒 Protected administration zone. Credentials are configured via server environment variables.</p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/" style={{ color: 'var(--teal-600)', fontSize: '0.88rem', textDecoration: 'none' }}>
            ← Return to Public Product Explorer
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
