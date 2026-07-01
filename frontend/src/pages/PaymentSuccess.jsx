import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const ticketId = searchParams.get('ticketId');
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    if (ticketId) {
      api.payments.verify(ticketId)
        .then(() => setStatus('success'))
        .catch(() => setStatus('error'));
    } else {
      setStatus('success');
    }
  }, [ticketId]);

  return (
    <div className="container" style={{ maxWidth: '500px', textAlign: 'center' }}>
      <div className="card">
        {status === 'verifying' && <div className="loading">Verifying payment...</div>}
        {status === 'success' && (
          <>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
            <h1 className="page-title">Payment Successful!</h1>
            <p className="page-subtitle">Your ticket has been confirmed. Check your tickets for the QR code.</p>
            <Link to="/my-tickets" className="btn btn-primary">View My Tickets</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
            <h1 className="page-title">Verification Pending</h1>
            <p className="page-subtitle">Payment may still be processing. Check My Tickets shortly.</p>
            <Link to="/my-tickets" className="btn btn-secondary">View My Tickets</Link>
          </>
        )}
      </div>
    </div>
  );
}
