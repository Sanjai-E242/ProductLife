/**
 * ProductLife Admin API Service
 * Facilitates authenticated communication with administrative REST endpoints on port 8081.
 */

const API_HOST = (typeof window !== 'undefined' && window.location && window.location.hostname) ? window.location.hostname : 'localhost';
const API_BASE_URL = `http://${API_HOST}:8081/api`;

const TOKEN_KEY = 'productlife_admin_token';
const USER_KEY = 'productlife_admin_user';

export function getAdminToken() {
  return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
}

export function getStoredAdminToken() {
  return getAdminToken();
}

export function getStoredAdminUsername() {
  return sessionStorage.getItem(USER_KEY) || localStorage.getItem(USER_KEY) || null;
}

export function hasValidSession() {
  const token = getAdminToken();
  return Boolean(token && token.startsWith('pl_adm_'));
}

export function setAdminSession(token, username, remember = false) {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(TOKEN_KEY, token);
  storage.setItem(USER_KEY, username);
}

export function clearAdminSession() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredAdminUser() {
  return getStoredAdminUsername();
}

/**
 * Common fetch helper that automatically injects Bearer authorization token.
 */
async function authFetch(url, options = {}) {
  const token = getAdminToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    clearAdminSession();
    const error = new Error('Admin session expired or unauthorized. Please log in.');
    error.status = 401;
    throw error;
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.message || `Request failed (HTTP ${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  return response.status === 204 ? null : await response.json();
}

/**
 * Authenticates administrator credentials.
 */
export async function adminLogin(username, password, remember = false) {
  const response = await fetch(`${API_BASE_URL}/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || 'Invalid administrator credentials');
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  const data = await response.json();
  setAdminSession(data.token, data.username, remember);
  return data;
}

/**
 * Verifies that the current session token remains active.
 */
export async function verifyAdminToken() {
  return await authFetch(`${API_BASE_URL}/admin/auth/verify`);
}

/**
 * Logs out the administrator.
 */
export async function adminLogout() {
  try {
    await authFetch(`${API_BASE_URL}/admin/auth/logout`, { method: 'POST' });
  } catch (e) {
    // ignore network errors on logout
  } finally {
    clearAdminSession();
  }
}

/**
 * Retrieves aggregated dashboard overview statistics.
 */
export async function fetchDashboardStats() {
  return await authFetch(`${API_BASE_URL}/admin/dashboard/stats`);
}

export async function getAdminDashboardStats() {
  return await fetchDashboardStats();
}

/**
 * Retrieves paginated products with filtering and sorting.
 */
export async function fetchAdminProducts({
  keyword = '',
  category = '',
  status = '',
  page = 0,
  size = 10,
  sortBy = 'updatedAt',
  sortDir = 'desc'
} = {}) {
  const params = new URLSearchParams();
  if (keyword && keyword.trim()) params.append('keyword', keyword.trim());
  if (category && category.trim() && category !== 'All') params.append('category', category.trim());
  if (status && status.trim() && status !== 'All') params.append('status', status.trim());
  params.append('page', page);
  params.append('size', size);
  params.append('sortBy', sortBy);
  params.append('sortDir', sortDir);

  return await authFetch(`${API_BASE_URL}/admin/products?${params.toString()}`);
}

export async function getAdminProducts(page = 0, size = 10, keyword = null, category = null, status = null) {
  return await fetchAdminProducts({ page, size, keyword, category, status });
}

/**
 * Retrieves full details of a product passport for editing.
 */
export async function fetchAdminProductById(id) {
  return await authFetch(`${API_BASE_URL}/admin/products/${id}`);
}

export async function getAdminProductById(id) {
  return await fetchAdminProductById(id);
}

/**
 * Registers a new Digital Product Passport.
 */
export async function createProductPassport(productData) {
  return await authFetch(`${API_BASE_URL}/admin/products`, {
    method: 'POST',
    body: JSON.stringify(productData)
  });
}

export async function createAdminProduct(productData) {
  return await createProductPassport(productData);
}

/**
 * Updates an existing Digital Product Passport.
 */
export async function updateProductPassport(id, productData) {
  return await authFetch(`${API_BASE_URL}/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData)
  });
}

export async function updateAdminProduct(id, productData) {
  return await updateProductPassport(id, productData);
}

/**
 * Deletes a product passport.
 */
export async function deleteProductPassport(id) {
  return await authFetch(`${API_BASE_URL}/admin/products/${id}`, {
    method: 'DELETE'
  });
}

export async function deleteAdminProduct(id) {
  return await deleteProductPassport(id);
}

/**
 * Downloads the QR code PNG image directly for a product.
 */
export function downloadProductQrImage(productId, productCode) {
  const url = `${API_BASE_URL}/products/${productId}/qrcode?size=320`;
  const link = document.createElement('a');
  link.href = url;
  link.download = `passport-qr-${productCode || productId}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Retrieves all maintenance/repair logs for a given product.
 */
export async function getAdminProductRepairs(productId) {
  return await authFetch(`${API_BASE_URL}/admin/products/${productId}/repairs`);
}

/**
 * Logs a new maintenance/repair event for a product.
 */
export async function createAdminRepair(productId, repairData) {
  return await authFetch(`${API_BASE_URL}/admin/products/${productId}/repairs`, {
    method: 'POST',
    body: JSON.stringify(repairData)
  });
}

/**
 * Updates an existing maintenance record.
 */
export async function updateAdminRepair(productId, repairId, repairData) {
  return await authFetch(`${API_BASE_URL}/admin/products/${productId}/repairs/${repairId}`, {
    method: 'PUT',
    body: JSON.stringify(repairData)
  });
}

/**
 * Deletes a maintenance record.
 */
export async function deleteAdminRepair(productId, repairId) {
  return await authFetch(`${API_BASE_URL}/admin/products/${productId}/repairs/${repairId}`, {
    method: 'DELETE'
  });
}

