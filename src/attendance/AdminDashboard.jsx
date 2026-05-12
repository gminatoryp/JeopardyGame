import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  generateToken,
  isTokenValid,
  encodeToken,
  formatWeekLabel,
} from './tokenUtils';
import {
  getCurrentToken,
  saveCurrentToken,
  getRecords,
  getRecordsForSession,
  exportRecordsCSV,
} from './storage';

const BASE_URL = `${window.location.origin}${import.meta.env.BASE_URL}`;

function buildCheckinUrl(token) {
  const encoded = encodeToken(token);
  return `${BASE_URL}#/checkin?token=${encodeURIComponent(encoded)}`;
}

export default function AdminDashboard({ onLogout }) {
  const [token, setToken] = useState(null);
  const [records, setRecords] = useState([]);
  const [activeTab, setActiveTab] = useState('qr');
  const [copied, setCopied] = useState(false);
  const [filterSession, setFilterSession] = useState('all');

  useEffect(() => {
    let current = getCurrentToken();
    if (!current || !isTokenValid(current)) {
      current = generateToken();
      saveCurrentToken(current);
    }
    setToken(current);
    setRecords(getRecords());
  }, []);

  function handleRegenerate() {
    if (!window.confirm('Generate a new QR code? The current code will no longer work.')) return;
    const newToken = generateToken();
    saveCurrentToken(newToken);
    setToken(newToken);
  }

  function handleCopyUrl() {
    const url = buildCheckinUrl(token);
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleExport() {
    const toExport =
      filterSession === 'all' ? records : getRecordsForSession(filterSession);
    const csv = exportRecordsCSV(toExport);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${filterSession === 'all' ? 'all' : filterSession}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function refreshRecords() {
    setRecords(getRecords());
  }

  const sessions = [...new Set(records.map((r) => r.weekStart))].sort().reverse();
  const displayedRecords =
    filterSession === 'all' ? records : records.filter((r) => r.weekStart === filterSession);

  const checkinUrl = token ? buildCheckinUrl(token) : '';

  return (
    <div className="att-dashboard">
      <header className="att-header">
        <span className="att-header-title">Attendance Admin</span>
        <button className="att-btn att-btn-ghost" onClick={onLogout}>
          Sign Out
        </button>
      </header>

      <nav className="att-tabs">
        <button
          className={`att-tab ${activeTab === 'qr' ? 'active' : ''}`}
          onClick={() => setActiveTab('qr')}
        >
          QR Code
        </button>
        <button
          className={`att-tab ${activeTab === 'records' ? 'active' : ''}`}
          onClick={() => { setActiveTab('records'); refreshRecords(); }}
        >
          Attendance ({records.length})
        </button>
      </nav>

      {activeTab === 'qr' && token && (
        <div className="att-qr-panel">
          <div className="att-card att-qr-card">
            <p className="att-week-label">
              Week of {formatWeekLabel(token.weekStart)}
            </p>
            <div className="att-qr-wrap">
              <QRCodeSVG value={checkinUrl} size={260} level="M" includeMargin />
            </div>
            <p className="att-qr-hint">Students scan this code to check in</p>

            <div className="att-qr-actions">
              <button className="att-btn att-btn-secondary" onClick={handleCopyUrl}>
                {copied ? 'Copied!' : 'Copy Check-in URL'}
              </button>
              <button className="att-btn att-btn-danger" onClick={handleRegenerate}>
                Regenerate Code
              </button>
            </div>

            <details className="att-url-details">
              <summary>Show check-in URL</summary>
              <p className="att-url-text">{checkinUrl}</p>
            </details>

            {!isTokenValid(token) && (
              <p className="att-error">This token has expired. Please regenerate.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'records' && (
        <div className="att-records-panel">
          <div className="att-records-toolbar">
            <select
              className="att-select"
              value={filterSession}
              onChange={(e) => setFilterSession(e.target.value)}
            >
              <option value="all">All weeks</option>
              {sessions.map((s) => (
                <option key={s} value={s}>
                  Week of {formatWeekLabel(s)}
                </option>
              ))}
            </select>
            <button className="att-btn att-btn-secondary" onClick={handleExport}>
              Export CSV
            </button>
          </div>

          {displayedRecords.length === 0 ? (
            <div className="att-empty">No attendance records yet.</div>
          ) : (
            <div className="att-table-wrap">
              <table className="att-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Student ID</th>
                    <th>Week Of</th>
                    <th>Check-in Time</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedRecords.map((r, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{r.name}</td>
                      <td>{r.userId}</td>
                      <td>{formatWeekLabel(r.weekStart)}</td>
                      <td>{new Date(r.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
