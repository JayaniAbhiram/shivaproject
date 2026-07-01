import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { api } from '../api';

const COLORS = ['#6366f1', '#10b981', '#0ea5e9', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.analytics.dashboard().then(setData).catch(() => setData(null)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading analytics...</div>;
  if (!data) return <div className="empty-state">Unable to load analytics. Create some events first.</div>;

  const categoryData = Object.entries(data.eventsByCategory || {}).map(([name, value]) => ({ name, value }));
  const { summary, revenueByEvent, recentBookings } = data;

  return (
    <div className="container">
      <h1 className="page-title">Analytics Dashboard</h1>
      <p className="page-subtitle">Track your events performance and revenue</p>

      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-light)' }}>{summary.totalEvents}</div>
          <div style={{ color: 'var(--text-muted)' }}>Total Events</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>${summary.totalRevenue?.toFixed(2)}</div>
          <div style={{ color: 'var(--text-muted)' }}>Total Revenue</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--secondary)' }}>{summary.totalTicketsSold}</div>
          <div style={{ color: 'var(--text-muted)' }}>Tickets Sold</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--warning)' }}>{summary.totalCheckIns}</div>
          <div style={{ color: 'var(--text-muted)' }}>Check-ins</div>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Revenue by Event</h3>
          {revenueByEvent.length === 0 ? (
            <p className="empty-state">No revenue data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueByEvent}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="title" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Events by Category</h3>
          {categoryData.length === 0 ? (
            <p className="empty-state">No category data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>Event Performance</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Event</th>
                <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Revenue</th>
                <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Tickets Sold</th>
                <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Check-ins</th>
              </tr>
            </thead>
            <tbody>
              {revenueByEvent.map((event) => (
                <tr key={event.eventId} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem' }}>{event.title}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--success)' }}>${event.revenue.toFixed(2)}</td>
                  <td style={{ padding: '0.75rem' }}>{event.ticketsSold}</td>
                  <td style={{ padding: '0.75rem' }}>{event.checkIns}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {recentBookings.length > 0 && (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Recent Bookings</h3>
          {recentBookings.map((booking) => (
            <div key={booking._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <strong>{booking.user?.name}</strong>
                <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>{booking.event?.title}</span>
              </div>
              <div style={{ color: 'var(--success)' }}>${booking.totalAmount}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
