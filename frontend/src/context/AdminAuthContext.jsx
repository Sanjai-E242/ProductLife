import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { adminLogin, adminLogout, getStoredAdminToken, getStoredAdminUsername, hasValidSession } from '../services/adminApi';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [token, setToken] = useState(getStoredAdminToken());
  const [username, setUsername] = useState(getStoredAdminUsername());
  const [isAuthenticated, setIsAuthenticated] = useState(hasValidSession());
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    setIsAuthenticated(hasValidSession());
  }, []);

  const login = useCallback(async (user, pass) => {
    setLoading(true);
    setAuthError(null);
    try {
      const data = await adminLogin(user, pass);
      setToken(data.token);
      setUsername(data.username);
      setIsAuthenticated(true);
      return data;
    } catch (err) {
      setAuthError(err.message || 'Login failed. Please check your credentials.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await adminLogout();
    } finally {
      setToken(null);
      setUsername(null);
      setIsAuthenticated(false);
      setLoading(false);
      setAuthError(null);
    }
  }, []);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{
        token,
        username,
        isAuthenticated,
        loading,
        authError,
        login,
        logout,
        clearAuthError,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
