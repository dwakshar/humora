import { API_BASE } from './constants'

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('humora_auth_token')

  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && token !== '__mock__' && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || error.message || 'Request failed')
  }

  return response.json()
}

export const api = {
  get: (url) => request(url),
  post: (url, data) => request(url, { method: 'POST', body: JSON.stringify(data) }),
  put: (url, data) => request(url, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (url) => request(url, { method: 'DELETE' }),

  auth: {
    login: (email, pass) => api.post('/api/auth/login', { email, password: pass }),
    signup: (name, email, pass) => api.post('/api/auth/signup', { name, email, password: pass }),
    logout: () => api.post('/api/auth/logout', {}),
    me: async () => (await api.get('/api/auth/me')).user,
    exchangeSupabase: (accessToken) => api.post('/api/auth/oauth/supabase', { accessToken }),
  },

  verify: {
    token: (token, sitekey) => api.post('/api/verify', { token, sitekey }),
    register: (domain, email) => api.post('/api/register', { domain, email }),
  },

  dashboard: {
    overview: () => api.get('/api/dashboard'),
    analytics: (params) => api.get(`/api/dashboard/analytics?${new URLSearchParams(params)}`),
    sites: () => api.get('/api/sites'),
    addSite: (data) => api.post('/api/sites', data),
    deleteSite: (id) => api.delete(`/api/sites/${id}`),
  },

  billing: {
    current: () => api.get('/api/billing'),
    history: () => api.get('/api/billing/history'),
    checkout: (plan, period) => api.post('/api/billing/checkout', { plan, period }),
    cancel: () => api.post('/api/billing/cancel', {}),
    reactivate: () => api.post('/api/billing/reactivate', {}),
    portal: () => api.get('/api/billing/portal'),
  },
}
