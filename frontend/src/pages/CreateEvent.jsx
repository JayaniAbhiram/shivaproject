import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const CATEGORIES = ['Music', 'Sports', 'Tech', 'Arts', 'Food', 'Business', 'Other'];

export default function CreateEvent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    category: 'Music',
    ticketPrice: '',
    totalTickets: '',
    status: 'upcoming',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const event = await api.events.create({
        ...form,
        ticketPrice: Number(form.ticketPrice),
        totalTickets: Number(form.totalTickets),
        date: new Date(form.date).toISOString(),
      });
      navigate(`/events/${event._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '700px' }}>
      <h1 className="page-title">Create Event</h1>
      <p className="page-subtitle">Fill in the details to publish your event</p>

      <form className="card" onSubmit={handleSubmit}>
        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-group">
          <label>Event Title</label>
          <input name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Summer Music Festival" />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} required rows={4} placeholder="Describe your event..." />
        </div>

        <div className="grid grid-2">
          <div className="form-group">
            <label>Date</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Time</label>
            <input type="time" name="time" value={form.time} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label>Venue</label>
          <input name="venue" value={form.venue} onChange={handleChange} required placeholder="e.g. Central Park, New York" />
        </div>

        <div className="grid grid-2">
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={form.category} onChange={handleChange}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="grid grid-2">
          <div className="form-group">
            <label>Ticket Price ($)</label>
            <input type="number" name="ticketPrice" value={form.ticketPrice} onChange={handleChange} required min="0" step="0.01" placeholder="0 for free" />
          </div>
          <div className="form-group">
            <label>Total Tickets</label>
            <input type="number" name="totalTickets" value={form.totalTickets} onChange={handleChange} required min="1" placeholder="100" />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Creating...' : 'Create Event'}
        </button>
      </form>
    </div>
  );
}
