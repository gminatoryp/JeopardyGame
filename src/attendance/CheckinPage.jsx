import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { decodeToken, isTokenValid, formatWeekLabel } from './tokenUtils';
import { hasCheckedIn, addRecord } from './storage';

function getTokenFromUrl() {
  const hash = window.location.hash; // e.g. #/checkin?token=...
  const qIndex = hash.indexOf('?');
  if (qIndex === -1) return null;
  const params = new URLSearchParams(hash.slice(qIndex + 1));
  const encoded = params.get('token');
  return encoded ? decodeToken(encoded) : null;
}

// --- Camera scanner sub-component ---
function QRScanner({ onResult }) {
  const scannerRef = useRef(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const scanner = new Html5Qrcode('att-qr-reader');
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          onResult(decodedText);
        },
        () => {} // suppress per-frame errors
      )
      .catch(() => {
        setError('Camera access denied or not available. Please allow camera permissions.');
      });

    return () => {
      scanner.isRunning() && scanner.stop().catch(() => {});
    };
  }, [onResult]);

  return (
    <div className="att-scanner-wrap">
      <div id="att-qr-reader" style={{ width: '100%' }} />
      {error && <p className="att-error">{error}</p>}
      <p className="att-qr-hint">Point your camera at the QR code on the screen</p>
    </div>
  );
}

// --- Check-in form sub-component ---
function CheckinForm({ token, onSuccess }) {
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!name.trim() || !userId.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (hasCheckedIn(token.sessionId, userId.trim())) {
      setError('You have already checked in for this week.');
      return;
    }

    setSubmitting(true);
    addRecord({
      sessionId: token.sessionId,
      weekStart: token.weekStart,
      name: name.trim(),
      userId: userId.trim(),
      timestamp: Date.now(),
    });
    onSuccess({ name: name.trim(), weekStart: token.weekStart });
  }

  return (
    <div className="att-card att-checkin-card">
      <h2 className="att-checkin-title">Check In</h2>
      <p className="att-week-label">Week of {formatWeekLabel(token.weekStart)}</p>
      <form onSubmit={handleSubmit} className="att-form">
        <label className="att-label">Full Name</label>
        <input
          className="att-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Smith"
          autoFocus
          required
        />
        <label className="att-label">Student ID</label>
        <input
          className="att-input"
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="e.g. S123456"
          required
        />
        {error && <p className="att-error">{error}</p>}
        <button
          className="att-btn att-btn-primary"
          type="submit"
          disabled={submitting}
        >
          {submitting ? 'Submitting…' : 'Submit Attendance'}
        </button>
      </form>
    </div>
  );
}

// --- Success screen ---
function SuccessScreen({ info }) {
  return (
    <div className="att-card att-success-card">
      <div className="att-success-icon">✓</div>
      <h2 className="att-success-title">Attendance Recorded!</h2>
      <p className="att-success-name">{info.name}</p>
      <p className="att-week-label">Week of {formatWeekLabel(info.weekStart)}</p>
    </div>
  );
}

// --- Main check-in page ---
export default function CheckinPage() {
  const urlToken = getTokenFromUrl();
  const [scannedToken, setScannedToken] = useState(urlToken);
  const [scanError, setScanError] = useState('');
  const [success, setSuccess] = useState(null);

  const token = scannedToken;
  const tokenValid = token && isTokenValid(token);

  function handleScanResult(text) {
    // Extract token param from scanned URL
    try {
      const url = new URL(text);
      const hash = url.hash;
      const qIndex = hash.indexOf('?');
      if (qIndex !== -1) {
        const params = new URLSearchParams(hash.slice(qIndex + 1));
        const encoded = params.get('token');
        if (encoded) {
          const decoded = decodeToken(encoded);
          if (decoded && isTokenValid(decoded)) {
            setScannedToken(decoded);
            setScanError('');
            return;
          }
        }
      }
    } catch {
      // not a URL, try direct decode
      const decoded = decodeToken(text);
      if (decoded && isTokenValid(decoded)) {
        setScannedToken(decoded);
        setScanError('');
        return;
      }
    }
    setScanError('Invalid or expired QR code. Please ask your instructor to refresh it.');
  }

  if (success) {
    return (
      <div className="att-checkin-wrap">
        <SuccessScreen info={success} />
      </div>
    );
  }

  return (
    <div className="att-checkin-wrap">
      {!tokenValid && (
        <div className="att-card att-scanner-card">
          <h2 className="att-checkin-title">Scan Attendance QR Code</h2>
          <p className="att-qr-hint">
            {token && !isTokenValid(token)
              ? 'This QR code has expired. Please ask your instructor for the current one.'
              : 'Use your camera to scan the QR code displayed by your instructor.'}
          </p>
          {(!token || !isTokenValid(token)) && (
            <QRScanner onResult={handleScanResult} />
          )}
          {scanError && <p className="att-error">{scanError}</p>}
        </div>
      )}

      {tokenValid && (
        <CheckinForm token={token} onSuccess={setSuccess} />
      )}
    </div>
  );
}
