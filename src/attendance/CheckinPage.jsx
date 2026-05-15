import { useState, useEffect, useRef, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { decodeToken, isTokenValid, formatWeekLabel } from './tokenUtils';
import { hasCheckedIn, addRecord, findMember, getMembers, getCurrentToken, getGeofenceConfig, logActivity } from './storage';
import { getCurrentPosition, getDistanceMiles, geoErrorMessage } from './geoUtils';

function getTokenFromUrl() {
  const hash = window.location.hash;
  const qIndex = hash.indexOf('?');
  if (qIndex === -1) return null;
  const params = new URLSearchParams(hash.slice(qIndex + 1));
  const encoded = params.get('token');
  return encoded ? decodeToken(encoded) : null;
}

// ── Camera QR scanner ─────────────────────────────────────────
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
        (text) => onResult(text),
        () => {}
      )
      .catch(() =>
        setError('Camera access denied. Please allow camera permissions and reload.')
      );

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

const STORAGE_KEY = 'ibc_checkin_info';

// ── Check-in form ─────────────────────────────────────────────
function CheckinForm({ token, onSuccess }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [geoStatus, setGeoStatus] = useState('');
  const [noMembers, setNoMembers] = useState(false);
  const [remembered, setRemembered] = useState(false);

  useEffect(() => {
    getMembers().then((m) => setNoMembers(m.length === 0));
    // Pre-fill from last successful check-in on this device
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved?.firstName) {
        setFirstName(saved.firstName);
        setLastName(saved.lastName);
        setEmail(saved.email);
        setRemembered(true);
      }
    } catch { /* ignore */ }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      // ── Geofence check ──────────────────────────────────────
      const geo = await getGeofenceConfig().catch(() => ({ enabled: false }));
      if (geo.enabled) {
        if (!geo.lat || !geo.lon) {
          setError('Location check is enabled but the church location has not been set. Please contact your instructor.');
          setLoading(false);
          return;
        }
        setGeoStatus('Checking your location…');
        let position;
        try {
          position = await getCurrentPosition();
        } catch (geoErr) {
          setGeoStatus('');
          setError(geoErrorMessage(geoErr));
          setLoading(false);
          return;
        }
        const { latitude, longitude } = position.coords;
        const distMiles = getDistanceMiles(latitude, longitude, geo.lat, geo.lon);
        setGeoStatus('');
        if (distMiles > geo.radiusMiles) {
          const feet = Math.round(distMiles * 5280);
          const limit = Math.round(geo.radiusMiles * 5280);
          setError(
            `You must be at the church to check in. You are approximately ${feet > 5280 ? `${(distMiles).toFixed(1)} miles` : `${feet} ft`} away (limit: ${limit} ft).`
          );
          setLoading(false);
          return;
        }
      }

      // ── Token still active? ─────────────────────────────────
      const current = await getCurrentToken().catch(() => null);
      if (!current || current.sessionId !== token.sessionId) {
        setError('This QR code is no longer active. Please scan the current one.');
        setLoading(false);
        return;
      }

      // ── Membership check ────────────────────────────────────
      const member = await findMember(firstName, lastName, email).catch(() => null);
      if (!member) {
        setError('Your name and email were not found in the member list. Please contact your instructor.');
        setLoading(false);
        return;
      }

      // ── Duplicate check (non-blocking — rules may restrict reads) ───
      try {
        const alreadyIn = await hasCheckedIn(token.sessionId, email);
        if (alreadyIn) {
          setError('You have already checked in for this week.');
          setLoading(false);
          return;
        }
      } catch {
        // If duplicate check fails due to rules, proceed — Firestore
        // will still create the record; adjust rules to fix duplicate detection.
      }

      // ── Record check-in ─────────────────────────────────────
      const ts = Date.now();
      await addRecord({
        sessionId: token.sessionId,
        weekStart: token.weekStart,
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        timestamp: ts,
      });

      // Save info for next visit so the form is pre-filled
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          firstName: member.firstName,
          lastName: member.lastName,
          email: member.email,
        }));
      } catch { /* ignore */ }

      // Signal success immediately before any optional logging
      onSuccess({ firstName: member.firstName, lastName: member.lastName, weekStart: token.weekStart, timestamp: ts });

      // Fire-and-forget activity log — runs after success, never blocks or throws
      setTimeout(() => {
        logActivity(
          'check_in',
          `${member.firstName} ${member.lastName} (${member.email}) checked in`,
          member.email
        ).catch(() => {});
      }, 0);
    } catch {
      setError('Something went wrong. Please check your connection and try again.');
    }
    setGeoStatus('');
    setLoading(false);
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
        <>
          {remembered && (
            <div className="att-remembered-bar">
              <span>Welcome back, {firstName}!</span>
              <button
                type="button"
                className="att-text-btn"
                style={{ fontSize: '0.8rem' }}
                onClick={() => {
                  localStorage.removeItem(STORAGE_KEY);
                  setFirstName(''); setLastName(''); setEmail('');
                  setRemembered(false);
                }}
              >
                Not you?
              </button>
            </div>
          )}
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
          {geoStatus && (
            <p className="att-geo-status">
              <span className="att-geo-spinner" /> {geoStatus}
            </p>
          )}
          {error && <p className="att-error">{error}</p>}
          <button className="att-btn att-btn-primary" type="submit" disabled={loading}>
            {loading ? 'Verifying…' : 'Submit Attendance'}
          </button>
          </form>
        </>
      )}
    </div>
  );
}

// ── Success screen ────────────────────────────────────────────
function SuccessScreen({ info }) {
  const checkinTime = new Date(info.timestamp).toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
  return (
    <div className="att-card att-success-card">
      <div className="att-success-icon">✓</div>
      <h2 className="att-success-title">Attendance Recorded!</h2>
      <p className="att-success-name">{info.firstName} {info.lastName}</p>
      <p className="att-week-label">Week of {formatWeekLabel(info.weekStart)}</p>
      <p className="att-checkin-timestamp">Checked in at {checkinTime}</p>
    </div>
  );
}

// ── Main check-in page ────────────────────────────────────────
export default function CheckinPage() {
  const urlToken = getTokenFromUrl();
  const [scannedToken, setScannedToken] = useState(urlToken);
  const [scanError, setScanError] = useState('');
  const [success, setSuccess] = useState(null);

  const token = scannedToken;
  const tokenValid = token && isTokenValid(token);

  const handleScanResult = useCallback((text) => {
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
  }, []);

  if (success) {
    return (
      <div className="att-checkin-wrap">
        <SuccessScreen info={success} />
      </div>
    );
  }

  return (
    <div className="att-checkin-wrap">
      {!tokenValid ? (
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
      ) : (
        <CheckinForm token={token} onSuccess={setSuccess} />
      )}
    </div>
  );
}
