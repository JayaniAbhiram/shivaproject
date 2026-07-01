import { useEffect, useState } from 'react';
import { api } from '../api';

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.tickets.myTickets().then(setTickets).catch(() => setTickets([])).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading your tickets...</div>;

  return (
    <div className="container">
      <h1 className="page-title">My Tickets</h1>
      <p className="page-subtitle">Your booked tickets with QR codes for check-in</p>

      {tickets.length === 0 ? (
        <div className="empty-state">You haven't booked any tickets yet.</div>
      ) : (
        <div className="grid grid-2">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontFamily: 'monospace', color: 'var(--primary-light)' }}>{ticket.ticketId}</span>
                <span className={`badge ${ticket.paymentStatus === 'completed' ? 'badge-ongoing' : 'badge-cancelled'}`}>
                  {ticket.paymentStatus}
                </span>
              </div>
              <h3>{ticket.event?.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.5rem 0' }}>
                📅 {ticket.event?.date ? new Date(ticket.event.date).toLocaleDateString() : 'N/A'} · {ticket.event?.time}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>📍 {ticket.event?.venue}</p>
              <p style={{ marginTop: '0.75rem' }}>Qty: {ticket.quantity} · ${ticket.totalAmount}</p>
              {ticket.checkedIn && (
                <div className="alert alert-success" style={{ marginTop: '1rem' }}>
                  ✓ Checked in at {new Date(ticket.checkedInAt).toLocaleString()}
                </div>
              )}
              {ticket.paymentStatus === 'completed' && ticket.qrCode && (
                <div style={{ textAlign: 'center', marginTop: '1rem', padding: '1rem', background: 'white', borderRadius: '8px' }}>
                  <img src={ticket.qrCode} alt="QR Code" style={{ width: '180px', height: '180px' }} />
                  <p style={{ color: '#333', fontSize: '0.8rem', marginTop: '0.5rem' }}>Show this QR at entry</p>
                </div>
              )}
              {ticket.paymentStatus === 'pending' && (
                <button
                  className="btn btn-primary"
                  style={{ marginTop: '1rem', width: '100%' }}
                  onClick={async () => {
                    try {
                      await api.payments.demoPay(ticket.ticketId);
                      const updated = await api.tickets.myTickets();
                      setTickets(updated);
                    } catch (err) {
                      alert(err.message);
                    }
                  }}
                >
                  Complete Demo Payment
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
