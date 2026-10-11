/**
 * ProductLife API Client
 * Facilitates HTTP communication with the Spring Boot backend on port 8081.
 */

const API_HOST = (typeof window !== 'undefined' && window.location && window.location.hostname) ? window.location.hostname : 'localhost';
const API_BASE_URL = `http://${API_HOST}:8081/api`;

/**
 * Fetch all products with optional keyword and category filtering.
 * @param {string} keyword Optional search term
 * @param {string} category Optional category filter
 * @returns {Promise<Array>} List of product summaries
 */
export async function fetchProducts(keyword = '', category = '') {
  const params = new URLSearchParams();
  if (keyword && keyword.trim()) {
    params.append('keyword', keyword.trim());
  }
  if (category && category.trim() && category !== 'All') {
    params.append('category', category.trim());
  }

  const url = `${API_BASE_URL}/products${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch products (HTTP ${response.status})`);
  }
  
  return await response.json();
}

/**
 * Fetch the distinct list of product categories from MySQL.
 * @returns {Promise<Array<string>>}
 */
export async function fetchCategories() {
  const response = await fetch(`${API_BASE_URL}/products/categories`);
  if (!response.ok) {
    throw new Error(`Failed to fetch categories (HTTP ${response.status})`);
  }
  return await response.json();
}

/**
 * Fetch complete passport details for a product by its numeric database ID.
 * @param {string|number} id
 * @returns {Promise<Object>}
 */
export async function fetchProductById(id) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || `Product not found with ID: ${id}`);
    error.status = response.status;
    throw error;
  }
  return await response.json();
}

/**
 * Fetch complete passport details for a product by its unique passport code.
 * @param {string} code
 * @returns {Promise<Object>}
 */
export async function fetchProductByCode(code) {
  const response = await fetch(`${API_BASE_URL}/products/code/${encodeURIComponent(code)}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || `Product not found with code: ${code}`);
    error.status = response.status;
    throw error;
  }
  return await response.json();
}

/**
 * Builds the direct image URL for a product's generated PNG QR code.
 * Supports configurable public baseUrl, host, and port.
 * 
 * @param {string|number} id Product ID
 * @param {number|Object} sizeOrOptions Size in px or options object { size, host, baseUrl, port }
 * @param {boolean|string} legacyLan Backwards compatible LAN flag or host
 * @returns {string} Image endpoint URL
 */
export function getProductQrCodeUrl(id, sizeOrOptions = 300, legacyLan = false) {
  let size = 300;
  let host = null;
  let baseUrl = null;
  let port = null;

  if (typeof sizeOrOptions === 'object' && sizeOrOptions !== null) {
    size = sizeOrOptions.size || 300;
    host = sizeOrOptions.host || null;
    baseUrl = sizeOrOptions.baseUrl || null;
    port = sizeOrOptions.port || null;
  } else {
    size = sizeOrOptions || 300;
    if (typeof legacyLan === 'string') {
      host = legacyLan;
    } else if (legacyLan === true) {
      const params = new URLSearchParams();
      params.append('size', size);
      params.append('lan', 'true');
      return `${API_BASE_URL}/products/${id}/qrcode?${params.toString()}`;
    }
  }

  const params = new URLSearchParams();
  params.append('size', size);
  if (baseUrl && baseUrl.trim()) {
    params.append('baseUrl', baseUrl.trim());
  } else if (host && host.trim()) {
    params.append('host', host.trim());
    if (port) params.append('port', port);
  }

  return `${API_BASE_URL}/products/${id}/qrcode?${params.toString()}`;
}

/**
 * Builds the direct image URL for a product's generated PNG QR code by product code.
 */
export function getProductQrCodeByCodeUrl(code, sizeOrOptions = 300) {
  let size = 300;
  let host = null;
  let baseUrl = null;
  let port = null;

  if (typeof sizeOrOptions === 'object' && sizeOrOptions !== null) {
    size = sizeOrOptions.size || 300;
    host = sizeOrOptions.host || null;
    baseUrl = sizeOrOptions.baseUrl || null;
    port = sizeOrOptions.port || null;
  } else {
    size = sizeOrOptions || 300;
  }

  const params = new URLSearchParams();
  params.append('size', size);
  if (baseUrl && baseUrl.trim()) {
    params.append('baseUrl', baseUrl.trim());
  } else if (host && host.trim()) {
    params.append('host', host.trim());
    if (port) params.append('port', port);
  }

  return `${API_BASE_URL}/products/code/${encodeURIComponent(code)}/qrcode?${params.toString()}`;
}

/**
 * Validates and resolves a scanned QR string or user input to a verified product passport.
 * Prevents arbitrary external redirects and safely extracts IDs or public codes.
 * 
 * @param {string} scannedText Scanned content from QR code or manual input
 * @returns {Promise<{ id: number|string, product: Object }>}
 */
export async function resolveScannedPassport(scannedText) {
  if (!scannedText || typeof scannedText !== 'string' || !scannedText.trim()) {
    throw new Error('QR code content is empty.');
  }

  const trimmed = scannedText.trim();

  // Pattern 1: Canonical or relative ProductLife passport URL (e.g. "http://192.168.1.15:5174/products/1" or "/products/1")
  const urlMatch = trimmed.match(/(?:products\/)([A-Za-z0-9_-]+)(?:\/)?$/i);
  if (urlMatch) {
    const identifier = urlMatch[1];
    // If numeric ID
    if (/^\d+$/.test(identifier)) {
      const product = await fetchProductById(identifier);
      return { id: product.id, product };
    } else {
      // If code like PL-ECO-001
      const product = await fetchProductByCode(identifier);
      return { id: product.id, product };
    }
  }

  // Reject arbitrary external URLs to prevent open redirect vulnerabilities
  if (/^https?:\/\//i.test(trimmed)) {
    let hostname = '';
    try {
      hostname = new URL(trimmed).hostname;
    } catch {
      hostname = '';
    }
    const isLocalOrLan = 
      hostname === 'localhost' || 
      hostname === '127.0.0.1' || 
      hostname.endsWith('.local') ||
      /^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
      /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
      /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
      (typeof window !== 'undefined' && window.location && window.location.hostname === hostname);

    if (!isLocalOrLan) {
      throw new Error('Scanned QR code points to an external or untrusted domain. Only verified ProductLife passports are supported.');
    }
  }

  // Pattern 2: Pure numeric product ID (e.g. "1", "2")
  if (/^\d+$/.test(trimmed)) {
    const product = await fetchProductById(trimmed);
    return { id: product.id, product };
  }

  // Pattern 3: Standard ProductLife passport code (e.g. "PL-ECO-001", "PL-TEX-002")
  if (/^PL-[A-Z0-9_-]+$/i.test(trimmed) || trimmed.length <= 64) {
    try {
      const product = await fetchProductByCode(trimmed);
      return { id: product.id, product };
    } catch {
      // Fallback try as numeric if parsing differed
      throw new Error(`No product passport registered with code: "${trimmed}"`);
    }
  }

  throw new Error(`Unrecognized passport format: "${trimmed}". Expected a ProductLife QR code or product identifier.`);
}

/**
 * Fetch official EU DPP compliance JSON export payload for a product.
 */
export async function fetchPassportComplianceExport(id) {
  const response = await fetch(`${API_BASE_URL}/products/${id}/export/json`);
  if (!response.ok) {
    throw new Error(`Failed to export DPP compliance data (HTTP ${response.status})`);
  }
  return await response.json();
}

/**
 * Downloads the DPP compliance JSON document directly to user's computer.
 */
export async function downloadPassportComplianceExport(id, productCode = 'passport') {
  const data = await fetchPassportComplianceExport(id);
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `DPP-Compliance-${productCode || id}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  return data;
}

