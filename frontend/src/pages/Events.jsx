import { useEffect, useState } from 'react';
import { api } from '../api';
import EventCard from '../components/EventCard';

const CATEGORIES = ['All', 'Music', 'Sports', 'Tech', 'Arts', 'Food', 'Business', 'Other'];

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category !== 'All') params.category = category;
    if (search) params.search = search;
    api.events
      .list(params)
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [category, search]);

  return (
    <div className="container">
      <h1 className="page-title">All Events</h1>
      <p className="page-subtitle">Find and book tickets for upcoming events</p>

      <div className="filters card" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: '200px' }}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ minWidth: '150px' }}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="empty-state">No events found. Try a different search or category.</div>
      ) : (
        <div className="grid grid-3">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
