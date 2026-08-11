import axios from 'axios';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({ baseURL: BASE });

// Attach access token to every request
api.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const { data: body } = await axios.post(`${BASE}/auth/refresh`, { refreshToken });
          localStorage.setItem('accessToken', body.data.accessToken);
          localStorage.setItem('refreshToken', body.data.refreshToken);
          original.headers.Authorization = `Bearer ${body.data.accessToken}`;
          return api(original);
        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  },
);

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  register: (name: string, email: string, password: string, referralCode?: string) =>
    api.post('/auth/register', { name, email, password, referralCode }),

  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  logout: (refreshToken?: string) =>
    api.post('/auth/logout', { refreshToken }),

  me: () => api.get('/auth/me'),

  referral: () => api.get('/auth/referral'),

  exchangeGoogleCode: (code: string) => api.post('/auth/google/exchange', { code }),
};

// ─── Scans ────────────────────────────────────────────────────────────────────

export const scanApi = {
  list: () => api.get('/scans'),

  discover: (url: string) =>
    api.post('/scans/discover', { url }),

  create: (url: string, confirm = false) =>
    api.post('/scans', { url, confirm }),

  get: (id: string) => api.get(`/scans/${id}`),

  getReport: (id: string) => api.get(`/scans/${id}/report`),

  reportUrl: (id: string) =>
    `${BASE}/scans/${id}/report`,
};

// ─── Admin ────────────────────────────────────────────────────────────────────

export const adminApi = {
  stats: () => api.get('/admin/stats'),

  listUsers: (page = 1, search = '') =>
    api.get('/admin/users', { params: { page, limit: 20, search } }),

  adjustCredits: (id: string, amount: number, reason?: string) =>
    api.patch(`/admin/users/${id}/credits`, { amount, reason }),

  changePlan: (id: string, plan: string) =>
    api.patch(`/admin/users/${id}/plan`, { plan }),

  deleteUser: (id: string) =>
    api.delete(`/admin/users/${id}`),

  listScans: (page = 1) =>
    api.get('/admin/scans', { params: { page, limit: 20 } }),

  listContacts: (page = 1) =>
    api.get('/admin/contacts', { params: { page, limit: 20 } }),

  deleteContact: (id: string) =>
    api.delete(`/admin/contacts/${id}`),
};

// ─── Contact ──────────────────────────────────────────────────────────────────

export const contactApi = {
  submit: (data: { name: string; email: string; subject: string; message: string }) =>
    api.post('/contact', data),
};

// ─── Tools (public, no auth) ───────────────────────────────────────────────────

export const toolsApi = {
  llmTxtCheck: (url: string) => api.post('/tools/llm-txt-check', { url }),
};
