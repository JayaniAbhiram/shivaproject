import { Link, useSearchParams } from 'react-router-dom';

export default function PaymentCancel() {
  const [searchParams] = useSearchParams();
  const ticketId = searchParams.get('ticketId');

  return (
    <div className="container" style={{ maxWidth: '500px', textAlign: 'center' }}>
      <div className="card">
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
        <h1 className="page-title">Payment Cancelled</h1>
        <p className="page-subtitle">
          Your payment was not completed.
          {ticketId && ' You can retry from My Tickets.'}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/my-tickets" className="btn btn-primary">My Tickets</Link>
          <Link to="/events" className="btn btn-secondary">Browse Events</Link>
        </div>
      </div>
    </div>
  );
}
