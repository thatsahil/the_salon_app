/**
 * API Service for interacting with backend REST endpoints
 */

const rawApiUrl = import.meta.env.VITE_API_URL || '/api';
const API_BASE = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('salon_jwt_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }

    return data;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Auth
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  getMe: () => request('/auth/me'),

  // Dashboard
  getDashboard: () => request('/dashboard'),

  // Clients
  getClients: (query = '') => request(`/clients${query ? `?query=${encodeURIComponent(query)}` : ''}`),
  getClientById: (id) => request(`/clients/${id}`),
  createClient: (clientData) => request('/clients', { method: 'POST', body: JSON.stringify(clientData) }),
  updateClient: (id, clientData) => request(`/clients/${id}`, { method: 'PUT', body: JSON.stringify(clientData) }),

  // Visits
  createVisit: (customerId, visitData) =>
    request(`/clients/${customerId}/visits`, { method: 'POST', body: JSON.stringify(visitData) }),

  // Reports
  getRevenueReport: (period = 'monthly') => request(`/reports/revenue?period=${period}`),

  // Services
  getServices: () => request('/services'),
  createService: (serviceData) => request('/services', { method: 'POST', body: JSON.stringify(serviceData) }),
};
