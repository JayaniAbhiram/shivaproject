import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../api';
import EventCard from '../components/EventCard';
import './Home.css';

export default function Home() {
  const [overview, setOverview] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.analytics.overview().then(setOverview).catch(() => {});
    api.events.list({ status: 'upcoming' }).then((data) => setEvents(data.slice(0, 6))).catch(() => {});
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <h1>Discover & Book Amazing Events</h1>
          <p>Create events, sell tickets, check-in with QR codes, and track analytics — all in one place.</p>
          <div className="hero-actions">
            <Link to="/events" className="btn btn-primary">Browse Events</Link>
            <Link to="/register" className="btn btn-secondary">Get Started</Link>
          </div>
        </div>
      </section>

      {overview && (
        <section className="container stats-section">
          <div className="grid grid-4">
            <div className="stat-card">
              <span className="stat-value">{overview.totalEvents}</span>
              <span className="stat-label">Total Events</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{overview.totalUsers}</span>
              <span className="stat-label">Registered Users</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{overview.totalTickets}</span>
              <span className="stat-label">Tickets Sold</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">${overview.totalRevenue?.toFixed(0) || 0}</span>
              <span className="stat-label">Total Revenue</span>
            </div>
          </div>
        </section>
      )}

      <section className="container">
        <h2 className="section-title">Upcoming Events</h2>
        {events.length === 0 ? (
          <p className="empty-state">No upcoming events yet. Be the first to create one!</p>
        ) : (
          <div className="grid grid-3">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/events" className="btn btn-secondary">View All Events</Link>
        </div>
      </section>

      <section className="features container">
        <h2 className="section-title">Platform Features</h2>
        <div className="grid grid-4">
          <div className="feature-card card">
            <span className="feature-icon">📅</span>
            <h3>Event Creation</h3>
            <p>Create and manage events with full details, pricing, and capacity.</p>
          </div>
          <div className="feature-card card">
            <span className="feature-icon">🎟️</span>
            <h3>Ticket Booking</h3>
            <p>Book tickets online with secure payment processing.</p>
          </div>
          <div className="feature-card card">
            <span className="feature-icon">📱</span>
            <h3>QR Check-in</h3>
            <p>Fast attendee check-in using QR code scanning.</p>
          </div>
          <div className="feature-card card">
            <span className="feature-icon">📊</span>
            <h3>Analytics Dashboard</h3>
            <p>Track revenue, ticket sales, and attendance in real-time.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
