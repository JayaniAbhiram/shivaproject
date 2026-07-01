const API_BASE = import.meta.env.VITE_API_URL || '/api';

const getToken = () => localStorage.getItem('token');

const request = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

export const api = {
  auth: {
    register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    me: () => request('/auth/me'),
  },
  events: {
    list: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/events${query ? `?${query}` : ''}`);
    },
    get: (id) => request(`/events/${id}`),
    create: (body) => request('/events', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => request(`/events/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id) => request(`/events/${id}`, { method: 'DELETE' }),
    mine: () => request('/events/organizer/mine'),
  },
  tickets: {
    book: (body) => request('/tickets/book', { method: 'POST', body: JSON.stringify(body) }),
    myTickets: () => request('/tickets/my-tickets'),
    get: (ticketId) => request(`/tickets/${ticketId}`),
    checkin: (ticketId) => request('/tickets/checkin', { method: 'POST', body: JSON.stringify({ ticketId }) }),
    byEvent: (eventId) => request(`/tickets/event/${eventId}`),
  },
  payments: {
    createCheckout: (ticketId) =>
      request('/payments/create-checkout', { method: 'POST', body: JSON.stringify({ ticketId }) }),
    verify: (ticketId) =>
      request('/payments/verify', { method: 'POST', body: JSON.stringify({ ticketId }) }),
    demoPay: (ticketId) =>
      request('/payments/demo-pay', { method: 'POST', body: JSON.stringify({ ticketId }) }),
  },
  analytics: {
    dashboard: () => request('/analytics/dashboard'),
    overview: () => request('/analytics/overview'),
  },
};
