import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    api.events.get(id).then(setEvent).catch(() => setEvent(null)).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (user) {
      setAttendeeName(user.name || '');
      setAttendeeEmail(user.email || '');
    }
  }, [user]);

  const handleBook = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setError('');
    setBooking(true);
    try {
      const ticket = await api.tickets.book({
        eventId: id,
        quantity,
        attendeeName,
        attendeeEmail,
      });
      if (event.ticketPrice === 0 || ticket.paymentStatus === 'completed') {
        navigate('/my-tickets');
        return;
      }
      setPaying(true);
      const payment = await api.payments.createCheckout(ticket.ticketId);
      if (payment.demo) {
        navigate('/my-tickets');
      } else if (payment.url) {
        window.location.href = payment.url;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBooking(false);
      setPaying(false);
    }
  };

  const handleDemoPay = async () => {
    if (!user) return navigate('/login');
    setError('');
    setBooking(true);
    try {
      const ticket = await api.tickets.book({ eventId: id, quantity, attendeeName, attendeeEmail });
      await api.payments.demoPay(ticket.ticketId);
      navigate('/my-tickets');
    } catch (err) {
      setError(err.message);
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="loading">Loading event...</div>;
  if (!event) return <div className="container empty-state">Event not found.</div>;

  const available = event.totalTickets - event.ticketsSold;

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <span className={`badge badge-${event.status}`}>{event.status}</span>
            <span className="badge" style={{ marginLeft: '0.5rem', background: 'var(--bg-hover)' }}>{event.category}</span>
            <h1 className="page-title" style={{ marginTop: '0.75rem' }}>{event.title}</h1>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-light)' }}>
              {event.ticketPrice === 0 ? 'Free' : `$${event.ticketPrice}`}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{available} tickets available</div>
          </div>
        </div>

        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.7 }}>{event.description}</p>

        <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
          <div>
            <strong>📅 Date</strong>
            <p style={{ color: 'var(--text-muted)' }}>
              {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div>
            <strong>🕐 Time</strong>
            <p style={{ color: 'var(--text-muted)' }}>{event.time}</p>
          </div>
          <div>
            <strong>📍 Venue</strong>
            <p style={{ color: 'var(--text-muted)' }}>{event.venue}</p>
          </div>
          <div>
            <strong>👤 Organizer</strong>
            <p style={{ color: 'var(--text-muted)' }}>{event.organizer?.name || 'N/A'}</p>
          </div>
        </div>

        {available > 0 && event.status !== 'cancelled' && (
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Book Tickets</h3>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-group">
              <label>Quantity</label>
              <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
                {Array.from({ length: Math.min(available, 10) }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Attendee Name</label>
              <input value={attendeeName} onChange={(e) => setAttendeeName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Attendee Email</label>
              <input type="email" value={attendeeEmail} onChange={(e) => setAttendeeEmail(e.target.value)} required />
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={handleBook} disabled={booking || paying}>
                {booking || paying ? 'Processing...' : `Book — $${(event.ticketPrice * quantity).toFixed(2)}`}
              </button>
              {event.ticketPrice > 0 && (
                <button className="btn btn-secondary" onClick={handleDemoPay} disabled={booking}>
                  Demo Pay (No Stripe)
                </button>
              )}
            </div>
          </div>
        )}

        {available === 0 && (
          <div className="alert alert-info">This event is sold out.</div>
        )}
      </div>
    </div>
  );
}
