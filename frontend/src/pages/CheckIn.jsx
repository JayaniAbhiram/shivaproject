import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { api } from '../api';

export default function CheckIn() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [manualId, setManualId] = useState('');
  const [loading, setLoading] = useState(false);
  const scannerRef = useRef(null);
  const scannerInstance = useRef(null);

  const processCheckIn = async (ticketId) => {
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const data = await api.tickets.checkin(ticketId);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!scannerRef.current) return;

    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );
    scannerInstance.current = scanner;

    scanner.render(
      async (decodedText) => {
        try {
          const parsed = JSON.parse(decodedText);
          if (parsed.ticketId) {
            scanner.clear().catch(() => {});
            await processCheckIn(parsed.ticketId);
          }
        } catch {
          await processCheckIn(decodedText);
        }
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  const handleManualCheckIn = (e) => {
    e.preventDefault();
    if (manualId.trim()) processCheckIn(manualId.trim());
  };

  return (
    <div className="container" style={{ maxWidth: '700px' }}>
      <h1 className="page-title">QR Check-in</h1>
      <p className="page-subtitle">Scan attendee QR codes or enter ticket ID manually</p>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div id="qr-reader" ref={scannerRef} style={{ width: '100%' }} />
      </div>

      <form className="card" onSubmit={handleManualCheckIn}>
        <h3 style={{ marginBottom: '1rem' }}>Manual Check-in</h3>
        <div className="form-group">
          <label>Ticket ID</label>
          <input
            value={manualId}
            onChange={(e) => setManualId(e.target.value)}
            placeholder="e.g. TKT-A1B2C3D4"
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Checking in...' : 'Check In'}
        </button>
      </form>

      {error && <div className="alert alert-error" style={{ marginTop: '1rem' }}>{error}</div>}

      {result && (
        <div className="alert alert-success" style={{ marginTop: '1rem' }}>
          <strong>✓ {result.message}</strong>
          <p style={{ marginTop: '0.5rem' }}>
            {result.ticket?.attendeeName} — {result.ticket?.event?.title || 'Event'}
          </p>
          <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            Ticket: {result.ticket?.ticketId} · Qty: {result.ticket?.quantity}
          </p>
        </div>
      )}
    </div>
  );
}
