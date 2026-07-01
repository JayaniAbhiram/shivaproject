import { Link } from 'react-router-dom';

const CATEGORY_COLORS = {
  Music: '#6366f1',
  Sports: '#10b981',
  Tech: '#0ea5e9',
  Arts: '#f59e0b',
  Food: '#ef4444',
  Business: '#8b5cf6',
  Other: '#64748b',
};

export default function EventCard({ event }) {
  const available = event.totalTickets - event.ticketsSold;
  const color = CATEGORY_COLORS[event.category] || CATEGORY_COLORS.Other;

  return (
    <Link to={`/events/${event._id}`} className="event-card card">
      <div className="event-card-header" style={{ background: `linear-gradient(135deg, ${color}33, ${color}11)` }}>
        <span className="event-category" style={{ background: color }}>{event.category}</span>
        <span className={`badge badge-${event.status}`}>{event.status}</span>
      </div>
      <div className="event-card-body">
        <h3>{event.title}</h3>
        <p className="event-venue">📍 {event.venue}</p>
        <p className="event-date">
          📅 {new Date(event.date).toLocaleDateString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
          })} · {event.time}
        </p>
        <div className="event-card-footer">
          <span className="event-price">
            {event.ticketPrice === 0 ? 'Free' : `$${event.ticketPrice}`}
          </span>
          <span className="event-tickets">{available} left</span>
        </div>
      </div>
      <style>{`
        .event-card {
          display: block;
          text-decoration: none;
          color: inherit;
          transition: transform 0.2s, box-shadow 0.2s;
          overflow: hidden;
          padding: 0;
        }
        .event-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          text-decoration: none;
        }
        .event-card-header {
          padding: 1rem 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .event-category {
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .event-card-body { padding: 1.25rem; }
        .event-card-body h3 {
          font-size: 1.15rem;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }
        .event-venue, .event-date {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-bottom: 0.35rem;
        }
        .event-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
        }
        .event-price {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--primary-light);
        }
        .event-tickets {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
      `}</style>
    </Link>
  );
}
