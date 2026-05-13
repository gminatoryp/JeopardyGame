import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { decodeToken, isTokenValid, formatWeekLabel } from './tokenUtils';
import { hasCheckedIn, addRecord, findMember, getMembers } from './storage';

function getTokenFromUrl() {
  const hash = window.location.hash;
  const qIndex = hash.indexOf('?');
  if (qIndex === -1) return null;
  const params = new URLSearchParams(hash.slice(qIndex + 1));
  const encoded = params.get('token');
  return encoded ? decodeToken(encoded) : null;
}

// --- Camera scanner ---
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
        (decodedText) => onResult(decodedText),
        () => {}
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
      <p className="att-qr-hint">Point your camera at the QR code displayed by your instructor</p>
    </div>
  );
}

// --- Check-in form ---
function CheckinForm({ token, onSuccess }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const noMembers = getMembers().length === 0;

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    // Verify member exists in the list
    const member = findMember(firstName, lastName, email);
    if (!member) {
      setError('Your name and email were not found in the member list. Please contact your instructor.');
      return;
    }

    // Prevent duplicate check-ins
    if (hasCheckedIn(token.sessionId, email)) {
      setError('You have already checked in for this week.');
      return;
    }

    setSubmitting(true);
    addRecord({
      sessionId: token.sessionId,
      weekStart: token.weekStart,
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      timestamp: Date.now(),
    });
    onSuccess({ firstName: member.firstName, lastName: member.lastName, weekStart: token.weekStart });
  }

  return (
    <div className="att-card att-checkin-card">
      <h2 className="att-checkin-title">Check In</h2>
      <p className="att-week-label">Week of {formatWeekLabel(token.weekStart)}</p>

      {noMembers ? (
        <p className="att-error" style={{ marginTop: '1rem' }}>
          No member list has been set up yet. Please contact your instructor.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="att-form">
          <label className="att-label">First Name</label>
          <input
            className="att-input"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Jane"
            autoFocus
            required
          />
          <label className="att-label">Last Name</label>
          <input
            className="att-input"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Smith"
            required
          />
          <label className="att-label">Email Address</label>
          <input
            className="att-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane.smith@example.com"
            required
          />
          {error && <p className="att-error">{error}</p>}
          <button className="att-btn att-btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit Attendance'}
          </button>
        </form>
      )}
    </div>
  );
}

// --- Success screen ---
function SuccessScreen({ info }) {
  return (
    <div className="att-card att-success-card">
      <div className="att-success-icon">✓</div>
      <h2 className="att-success-title">Attendance Recorded!</h2>
      <p className="att-success-name">{info.firstName} {info.lastName}</p>
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
      {tokenValid && <CheckinForm token={token} onSuccess={setSuccess} />}
    </div>
  );
}
