import { useState, useEffect, useRef } from 'react';
import { signOut } from 'firebase/auth';
import { QRCodeSVG } from 'qrcode.react';
import { auth } from './firebase';
import { generateToken, isTokenValid, encodeToken, formatWeekLabel } from './tokenUtils';
import {
  getCurrentToken,
  saveCurrentToken,
  subscribeToRecords,
  getRecordsForSession,
  exportRecordsCSV,
  getMembers,
  addMember,
  removeMember,
  clearAllMembers,
  bulkAddMembers,
  parseMembersCSV,
} from './storage';

const BASE_URL = `${window.location.origin}${import.meta.env.BASE_URL}`;

function buildCheckinUrl(token) {
  return `${BASE_URL}#/checkin?token=${encodeURIComponent(encodeToken(token))}`;
}

// ── Members tab ───────────────────────────────────────────────
function MembersTab() {
  const [members, setMembersState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [addError, setAddError] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [csvError, setCsvError] = useState('');
  const [csvSuccess, setCsvSuccess] = useState('');
  const [importLoading, setImportLoading] = useState(false);
  const [showCsvPanel, setShowCsvPanel] = useState(false);
  const fileRef = useRef(null);

  async function refresh() {
    const m = await getMembers();
    setMembersState(m);
  }

  useEffect(() => {
    getMembers().then((m) => {
      setMembersState(m);
      setLoading(false);
    });
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setAddError('');
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setAddError('All fields are required.');
      return;
    }
    const duplicate = members.find(
      (m) => m.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (duplicate) {
      setAddError('A member with this email already exists.');
      return;
    }
    setAddLoading(true);
    try {
      await addMember({ firstName, lastName, email });
      setFirstName('');
      setLastName('');
      setEmail('');
      await refresh();
    } catch {
      setAddError('Failed to add member. Please try again.');
    }
    setAddLoading(false);
  }

  async function handleRemove(id) {
    if (!window.confirm('Remove this member?')) return;
    try {
      await removeMember(id);
      setMembersState((prev) => prev.filter((m) => m.id !== id));
    } catch {
      alert('Failed to remove member. Please try again.');
    }
  }

  async function handleClearAll() {
    if (!window.confirm(`Remove all ${members.length} members? This cannot be undone.`)) return;
    try {
      await clearAllMembers();
      setMembersState([]);
    } catch {
      alert('Failed to clear members. Please try again.');
    }
  }

  async function handleCsvImport() {
    setCsvError('');
    setCsvSuccess('');
    const parsed = parseMembersCSV(csvText);
    if (parsed.length === 0) {
      setCsvError('No valid rows found. Format: First Name, Last Name, Email — one per line.');
      return;
    }
    setImportLoading(true);
    try {
      const existingEmails = new Set(members.map((m) => m.email.toLowerCase()));
      const newOnes = parsed.filter((m) => !existingEmails.has(m.email.toLowerCase()));
      if (newOnes.length > 0) await bulkAddMembers(newOnes);
      await refresh();
      setCsvText('');
      setCsvSuccess(
        `Imported ${newOnes.length} new member(s). ${parsed.length - newOnes.length} duplicate(s) skipped.`
      );
    } catch {
      setCsvError('Import failed. Please try again.');
    }
    setImportLoading(false);
  }

  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCsvText(ev.target.result);
    reader.readAsText(file);
    e.target.value = '';
  }

  function handleExportMembers() {
    const csv =
      'First Name,Last Name,Email\n' +
      members.map((m) => `"${m.firstName}","${m.lastName}","${m.email}"`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'members.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return <div className="att-loading">Loading members…</div>;

  return (
    <div className="att-members-panel">
      {/* Add one member */}
      <div className="att-card att-members-add-card">
        <h3 className="att-section-title">Add Member</h3>
        <form onSubmit={handleAdd} className="att-inline-form">
          <input
            className="att-input"
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            className="att-input"
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            className="att-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="att-btn att-btn-primary" type="submit" disabled={addLoading}>
            {addLoading ? '…' : 'Add'}
          </button>
        </form>
        {addError && <p className="att-error" style={{ marginTop: '0.5rem' }}>{addError}</p>}
      </div>

      {/* CSV import */}
      <div className="att-card att-members-csv-card">
        <button className="att-section-toggle" onClick={() => setShowCsvPanel((v) => !v)}>
          {showCsvPanel ? '▾' : '▸'} Import from CSV
        </button>
        {showCsvPanel && (
          <div className="att-csv-panel">
            <p className="att-csv-hint">
              Format: <code>First Name, Last Name, Email</code> — one member per line.
              A header row is optional and will be skipped automatically.
            </p>
            <div className="att-csv-actions">
              <button className="att-btn att-btn-secondary" onClick={() => fileRef.current.click()}>
                Upload CSV File
              </button>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,text/csv"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
            </div>
            <textarea
              className="att-csv-textarea"
              placeholder={'John,Smith,john.smith@example.com\nJane,Doe,jane.doe@example.com'}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              rows={6}
            />
            {csvError && <p className="att-error">{csvError}</p>}
            {csvSuccess && <p className="att-success-msg">{csvSuccess}</p>}
            <button
              className="att-btn att-btn-primary"
              onClick={handleCsvImport}
              disabled={!csvText.trim() || importLoading}
            >
              {importLoading ? 'Importing…' : 'Import'}
            </button>
          </div>
        )}
      </div>

      {/* Member list */}
      <div className="att-members-toolbar">
        <span className="att-members-count">
          {members.length} member{members.length !== 1 ? 's' : ''}
        </span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {members.length > 0 && (
            <>
              <button className="att-btn att-btn-secondary" onClick={handleExportMembers}>
                Export CSV
              </button>
              <button className="att-btn att-btn-danger" onClick={handleClearAll}>
                Clear All
              </button>
            </>
          )}
        </div>
      </div>

      {members.length === 0 ? (
        <div className="att-empty">No members yet. Add members above or import a CSV.</div>
      ) : (
        <div className="att-table-wrap">
          <table className="att-table">
            <thead>
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {members.map((m, i) => (
                <tr key={m.id}>
                  <td>{i + 1}</td>
                  <td>{m.firstName}</td>
                  <td>{m.lastName}</td>
                  <td>{m.email}</td>
                  <td>
                    <button
                      className="att-btn-remove"
                      onClick={() => handleRemove(m.id)}
                      title="Remove member"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Main dashboard ────────────────────────────────────────────
export default function AdminDashboard({ onLogout }) {
  const [token, setToken] = useState(null);
  const [tokenLoading, setTokenLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [activeTab, setActiveTab] = useState('qr');
  const [copied, setCopied] = useState(false);
  const [filterSession, setFilterSession] = useState('all');

  // Load or generate QR token
  useEffect(() => {
    (async () => {
      let current = await getCurrentToken();
      if (!current || !isTokenValid(current)) {
        current = generateToken();
        await saveCurrentToken(current);
      }
      setToken(current);
      setTokenLoading(false);
    })();
  }, []);

  // Real-time attendance records listener
  useEffect(() => {
    const unsub = subscribeToRecords((recs) => setRecords(recs));
    return unsub;
  }, []);

  async function handleRegenerate() {
    if (!window.confirm('Generate a new QR code? The current code will no longer work.')) return;
    const newToken = generateToken();
    await saveCurrentToken(newToken);
    setToken(newToken);
  }

  function handleCopyUrl() {
    navigator.clipboard.writeText(buildCheckinUrl(token)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  async function handleExport() {
    const toExport =
      filterSession === 'all' ? records : await getRecordsForSession(filterSession);
    const csv = exportRecordsCSV(toExport);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${filterSession === 'all' ? 'all' : filterSession}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleLogout() {
    await signOut(auth);
    onLogout();
  }

  const sessions = [...new Set(records.map((r) => r.weekStart))].sort().reverse();
  const displayedRecords =
    filterSession === 'all'
      ? records
      : records.filter((r) => r.weekStart === filterSession);

  return (
    <div className="att-dashboard">
      <header className="att-header">
        <span className="att-header-title">Attendance Admin</span>
        <button className="att-btn att-btn-ghost" onClick={handleLogout}>
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
          className={`att-tab ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          Members
        </button>
        <button
          className={`att-tab ${activeTab === 'records' ? 'active' : ''}`}
          onClick={() => setActiveTab('records')}
        >
          Attendance ({records.length})
        </button>
      </nav>

      {/* QR tab */}
      {activeTab === 'qr' && (
        <div className="att-qr-panel">
          {tokenLoading ? (
            <div className="att-loading">Generating QR code…</div>
          ) : (
            <div className="att-card att-qr-card">
              <p className="att-week-label">Week of {formatWeekLabel(token.weekStart)}</p>
              <div className="att-qr-wrap">
                <QRCodeSVG value={buildCheckinUrl(token)} size={260} level="M" includeMargin />
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
                <p className="att-url-text">{buildCheckinUrl(token)}</p>
              </details>
            </div>
          )}
        </div>
      )}

      {/* Members tab */}
      {activeTab === 'members' && <MembersTab />}

      {/* Attendance tab */}
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
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Week Of</th>
                    <th>Check-in Time</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedRecords
                    .slice()
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .map((r, i) => (
                      <tr key={r.id}>
                        <td>{i + 1}</td>
                        <td>{r.firstName}</td>
                        <td>{r.lastName}</td>
                        <td>{r.email}</td>
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
