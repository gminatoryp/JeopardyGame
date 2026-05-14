import { useState, useEffect, useRef } from 'react';
import { signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { QRCodeSVG } from 'qrcode.react';
import { auth, secondaryAuth } from './firebase';
import { generateToken, isTokenValid, encodeToken, formatWeekLabel } from './tokenUtils';
import { getCurrentPosition, geoErrorMessage } from './geoUtils';
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
  getGeofenceConfig,
  saveGeofenceConfig,
  getAllUsers,
  createUserRecord,
  updateUserRole,
  removeUserRecord,
  updateMemberRole,
} from './storage';

const MEMBER_ROLES = ['Admin', 'Manager', 'User'];

const BASE_URL = `${window.location.origin}${import.meta.env.BASE_URL}`;

function buildCheckinUrl(token) {
  return `${BASE_URL}#/checkin?token=${encodeURIComponent(encodeToken(token))}`;
}

function friendlyAuthError(code) {
  switch (code) {
    case 'auth/email-already-in-use': return 'An account with this email already exists.';
    case 'auth/invalid-email': return 'Please enter a valid email address.';
    case 'auth/weak-password': return 'Password must be at least 6 characters.';
    default: return 'Something went wrong. Please try again.';
  }
}

// ── Users tab (admin only) ────────────────────────────────────
function UsersTab({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addEmail, setAddEmail] = useState('');
  const [addPassword, setAddPassword] = useState('');
  const [addRole, setAddRole] = useState('manager');
  const [addError, setAddError] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [addSuccess, setAddSuccess] = useState('');

  async function refresh() {
    const u = await getAllUsers();
    setUsers(u);
  }

  useEffect(() => {
    refresh().then(() => setLoading(false));
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setAddError('');
    setAddSuccess('');
    if (addPassword.length < 6) {
      setAddError('Password must be at least 6 characters.');
      return;
    }
    setAddLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(secondaryAuth, addEmail, addPassword);
      await createUserRecord(cred.user.uid, addEmail, addRole, currentUser.email);
      await signOut(secondaryAuth);
      setAddEmail('');
      setAddPassword('');
      setAddRole('manager');
      setAddSuccess(`Account created for ${addEmail}.`);
      await refresh();
    } catch (err) {
      setAddError(friendlyAuthError(err.code));
    }
    setAddLoading(false);
  }

  async function handleRoleChange(uid, newRole) {
    await updateUserRole(uid, newRole);
    await refresh();
  }

  async function handleRemove(uid, email) {
    if (!window.confirm(`Remove ${email}? They will lose dashboard access.`)) return;
    await removeUserRecord(uid);
    await refresh();
  }

  if (loading) return <div className="att-loading">Loading users…</div>;

  return (
    <div className="att-users-panel">
      <div className="att-card att-users-add-card">
        <h3 className="att-section-title">Add User</h3>
        <form onSubmit={handleAdd} className="att-users-form">
          <div className="att-users-form-row">
            <div className="att-users-field">
              <label className="att-label">Email</label>
              <input
                className="att-input"
                type="email"
                placeholder="user@example.com"
                value={addEmail}
                onChange={(e) => setAddEmail(e.target.value)}
                required
              />
            </div>
            <div className="att-users-field">
              <label className="att-label">Temporary Password</label>
              <input
                className="att-input"
                type="password"
                placeholder="Min. 6 characters"
                value={addPassword}
                onChange={(e) => setAddPassword(e.target.value)}
                required
              />
            </div>
            <div className="att-users-field att-users-role-field">
              <label className="att-label">Role</label>
              <select
                className="att-select"
                value={addRole}
                onChange={(e) => setAddRole(e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>
          {addError && <p className="att-error">{addError}</p>}
          {addSuccess && <p className="att-success-msg">{addSuccess}</p>}
          <button className="att-btn att-btn-primary" type="submit" disabled={addLoading}>
            {addLoading ? 'Creating…' : 'Create Account'}
          </button>
        </form>

        <div className="att-role-legend">
          <p><strong>Role permissions:</strong></p>
          <ul>
            <li><span className="att-role-badge att-role-admin">Admin</span> — QR Code, Dashboard, Members, Records, Settings, Users</li>
            <li><span className="att-role-badge att-role-manager">Manager</span> — QR Code, Dashboard, Members, Records</li>
            <li><span className="att-role-badge att-role-user">User</span> — Dashboard and Records only</li>
          </ul>
        </div>
      </div>

      <div className="att-users-list">
        <span className="att-members-count">{users.length} user{users.length !== 1 ? 's' : ''}</span>
        {users.length === 0 ? (
          <div className="att-empty">No users found.</div>
        ) : (
          <div className="att-table-wrap">
            <table className="att-table">
              <thead>
                <tr><th>Email</th><th>Role</th><th>Created</th><th></th></tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      {u.email}
                      {u.id === currentUser.uid && (
                        <span className="att-you-badge">you</span>
                      )}
                    </td>
                    <td>
                      {u.id === currentUser.uid ? (
                        <span className={`att-role-badge att-role-${u.role}`}>{u.role}</span>
                      ) : (
                        <select
                          className="att-select att-role-select"
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        >
                          <option value="admin">Admin</option>
                          <option value="manager">Manager</option>
                          <option value="user">User</option>
                        </select>
                      )}
                    </td>
                    <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                    <td>
                      {u.id !== currentUser.uid && (
                        <button
                          className="att-btn-remove"
                          onClick={() => handleRemove(u.id, u.email)}
                          title="Remove user"
                        >✕</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Settings tab ─────────────────────────────────────────────
function SettingsTab() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [locError, setLocError] = useState('');
  const [manualLat, setManualLat] = useState('');
  const [manualLon, setManualLon] = useState('');
  const [showManual, setShowManual] = useState(false);

  const DEFAULT_LAT = 34.242711;
  const DEFAULT_LON = -118.464373;

  useEffect(() => {
    getGeofenceConfig().then(async (c) => {
      const withDefaults = {
        ...c,
        lat: c.lat ?? DEFAULT_LAT,
        lon: c.lon ?? DEFAULT_LON,
      };
      setConfig(withDefaults);
      setManualLat(withDefaults.lat);
      setManualLon(withDefaults.lon);
      // Persist defaults on first run so geofencing works immediately
      if (c.lat == null) await saveGeofenceConfig(withDefaults);
      setLoading(false);
    });
  }, []);

  async function handleToggle() {
    const updated = { ...config, enabled: !config.enabled };
    setConfig(updated);
    await saveGeofenceConfig(updated);
    setSaveMsg(updated.enabled ? 'Geofencing enabled.' : 'Geofencing disabled.');
    setTimeout(() => setSaveMsg(''), 3000);
  }

  async function handleUseMyLocation() {
    if (
      !window.confirm(
        'This will overwrite the saved church location with this device\'s current GPS position. Only do this if you are physically at the church right now. Continue?'
      )
    ) return;
    setLocating(true);
    setLocError('');
    try {
      const pos = await getCurrentPosition();
      const { latitude, longitude } = pos.coords;
      const updated = {
        ...config,
        lat: parseFloat(latitude.toFixed(6)),
        lon: parseFloat(longitude.toFixed(6)),
      };
      setConfig(updated);
      setManualLat(updated.lat);
      setManualLon(updated.lon);
      await saveGeofenceConfig(updated);
      setSaveMsg("Location saved — this device's current position is now the check-in center.");
      setTimeout(() => setSaveMsg(''), 4000);
    } catch (err) {
      setLocError(geoErrorMessage(err));
      if (err.code === 1) setShowManual(true);
    }
    setLocating(false);
  }

  async function handleManualSave() {
    const lat = parseFloat(manualLat);
    const lon = parseFloat(manualLon);
    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      setLocError('Please enter valid coordinates. Latitude: -90 to 90, Longitude: -180 to 180.');
      return;
    }
    setLocError('');
    setSaving(true);
    const updated = { ...config, lat, lon };
    setConfig(updated);
    await saveGeofenceConfig(updated);
    setSaveMsg('Coordinates saved.');
    setTimeout(() => setSaveMsg(''), 3000);
    setSaving(false);
  }

  async function handleRadiusChange(val) {
    const updated = { ...config, radiusMiles: parseFloat(val) };
    setConfig(updated);
    await saveGeofenceConfig(updated);
  }

  if (loading) return <div className="att-loading">Loading settings…</div>;

  const hasLocation = config.lat != null && config.lon != null;

  return (
    <div className="att-settings-panel">
      <div className="att-card att-settings-card">
        <div className="att-settings-row">
          <div>
            <h3 className="att-section-title" style={{ margin: 0 }}>Location Check-in (Geofencing)</h3>
            <p className="att-settings-desc">
              When enabled, members must be within the set radius of your church to check in.
            </p>
          </div>
          <button
            className={`att-toggle ${config.enabled ? 'on' : 'off'}`}
            onClick={handleToggle}
            title={config.enabled ? 'Click to disable' : 'Click to enable'}
          >
            {config.enabled ? 'ON' : 'OFF'}
          </button>
        </div>

        {config.enabled && !hasLocation && (
          <div className="att-warn-banner" style={{ marginTop: '1rem' }}>
            ⚠ Geofencing is on but no location is set. Set a location below or members will be blocked from checking in.
          </div>
        )}
      </div>

      <div className="att-card att-settings-card">
        <h3 className="att-section-title">Church Location</h3>
        <p className="att-settings-desc">
          The church coordinates are pre-set. You can adjust them manually if needed.
          Only use "Use my current GPS location" if you are physically at the church.
        </p>

        <div className="att-geo-actions">
          <button
            className="att-btn att-btn-primary"
            onClick={() => setShowManual((v) => !v)}
          >
            {showManual ? 'Hide coordinates' : '✏️ Edit Coordinates'}
          </button>
          <button
            className="att-text-btn att-text-btn-small"
            onClick={handleUseMyLocation}
            disabled={locating}
            title="Only use this if you are physically at the church right now"
          >
            {locating ? 'Getting location…' : '📍 Use my current GPS location'}
          </button>
        </div>

        {showManual && (
          <div className="att-manual-coords">
            <div className="att-coord-row">
              <div>
                <label className="att-label">Latitude</label>
                <input
                  className="att-input"
                  type="number"
                  step="any"
                  placeholder="e.g. 34.2285"
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                />
              </div>
              <div>
                <label className="att-label">Longitude</label>
                <input
                  className="att-input"
                  type="number"
                  step="any"
                  placeholder="e.g. -118.4785"
                  value={manualLon}
                  onChange={(e) => setManualLon(e.target.value)}
                />
              </div>
            </div>
            <button
              className="att-btn att-btn-secondary"
              onClick={handleManualSave}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save Coordinates'}
            </button>
          </div>
        )}

        {locError && (
          <div className="att-loc-error-block" style={{ marginTop: '0.75rem' }}>
            <p className="att-error">{locError}</p>
            {locError.includes('denied') && (
              <p className="att-settings-desc" style={{ marginTop: '0.4rem' }}>
                <strong>To allow in Chrome:</strong> click the lock icon in the address bar → Site settings → Location → Allow, then try again.{' '}
                <strong>In Safari:</strong> Safari menu → Settings for This Website → Location → Allow.
                Or use the manual coordinates form above.
              </p>
            )}
          </div>
        )}
        {saveMsg && <p className="att-success-msg" style={{ marginTop: '0.75rem' }}>{saveMsg}</p>}

        {hasLocation && (
          <div className="att-coords-display">
            <span className="att-coords-label">Current location:</span>
            <span className="att-coords-value">{config.lat}, {config.lon}</span>
            <a
              className="att-coords-link"
              href={`https://www.google.com/maps?q=${config.lat},${config.lon}`}
              target="_blank"
              rel="noreferrer"
            >
              View on map ↗
            </a>
          </div>
        )}
      </div>

      <div className="att-card att-settings-card">
        <h3 className="att-section-title">Check-in Radius</h3>
        <p className="att-settings-desc">
          Members must be within this distance to check in.
        </p>
        <div className="att-radius-row">
          {[0.1, 0.25, 0.5, 1].map((r) => (
            <button
              key={r}
              className={`att-radius-btn ${config.radiusMiles === r ? 'active' : ''}`}
              onClick={() => handleRadiusChange(r)}
            >
              {r === 0.1 ? '528 ft' : r === 0.25 ? '¼ mile' : r === 0.5 ? '½ mile' : '1 mile'}
            </button>
          ))}
        </div>
        <p className="att-settings-desc" style={{ marginTop: '0.5rem' }}>
          Currently set to <strong>{config.radiusMiles === 0.5 ? '½ mile' : `${config.radiusMiles} mile${config.radiusMiles !== 1 ? 's' : ''}`}</strong>
          {' '}({Math.round(config.radiusMiles * 5280)} feet)
        </p>
      </div>
    </div>
  );
}

// ── Dashboard helpers ─────────────────────────────────────────

// Returns 'red', 'yellow', or null for a member's attendance status
// red   = missed >50% of Sundays in any rolling 13-week (≈3-month) window
// yellow = missed 4+ consecutive Sundays at any point
function getMemberStatus(email, weeks, lookup) {
  if (weeks.length === 0) return null;

  // Red: >50% missed in any 13-week window (or full period if < 13 weeks)
  const win = Math.min(13, weeks.length);
  for (let i = 0; i <= weeks.length - win; i++) {
    const slice = weeks.slice(i, i + win);
    const missed = slice.filter((w) => !lookup[email]?.[w]).length;
    if (missed > win / 2) return 'red';
  }

  // Yellow: 4+ consecutive misses
  let streak = 0;
  for (const w of weeks) {
    if (!lookup[email]?.[w]) {
      streak++;
      if (streak >= 4) return 'yellow';
    } else {
      streak = 0;
    }
  }

  return null;
}

// Returns the Sunday date for a given Monday weekStart
function getSundayDate(weekStart) {
  const [y, m, d] = weekStart.split('-').map(Number);
  const mon = new Date(y, m - 1, d);
  mon.setDate(mon.getDate() + 6);
  return mon;
}

// Short label for a Sunday column: "Jan 4"
function formatSundayLabel(weekStart) {
  return getSundayDate(weekStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// All Sunday weekStarts (Monday keys) from first Sunday of 2026 through the most recent past Sunday
function getAllSundayWeekStarts() {
  const result = [];
  // Find first Sunday of 2026 (Jan 4, 2026) and its Monday weekStart (Dec 29, 2025)
  const jan1 = new Date(2026, 0, 1);
  const daysToSunday = jan1.getDay() === 0 ? 0 : 7 - jan1.getDay();
  const firstSunday = new Date(2026, 0, 1 + daysToSunday); // Jan 4, 2026
  const firstMonday = new Date(firstSunday);
  firstMonday.setDate(firstMonday.getDate() - 6); // Dec 29, 2025

  const today = new Date();
  today.setHours(23, 59, 59, 0);
  let d = new Date(firstMonday);
  while (true) {
    const sunday = new Date(d);
    sunday.setDate(sunday.getDate() + 6);
    if (sunday > today) break;
    result.push(d.toISOString().split('T')[0]);
    d.setDate(d.getDate() + 7);
  }
  return result;
}

// ── Dashboard tab ─────────────────────────────────────────────
function DashboardTab({ members, records, loading }) {
  const [colorFilter, setColorFilter] = useState('all');

  // Always show all 2026 Sundays; merge with any extra weekStarts from actual records
  const sundayWeeks = getAllSundayWeekStarts();
  const recordWeeks = [...new Set(records.map((r) => r.weekStart))];
  const extraWeeks = recordWeeks.filter((w) => !sundayWeeks.includes(w));
  const weeks = [...sundayWeeks, ...extraWeeks].sort();

  const lookup = {};
  for (const r of records) {
    if (!lookup[r.email]) lookup[r.email] = {};
    lookup[r.email][r.weekStart] = r;
  }

  const filteredMembers = colorFilter === 'all'
    ? members
    : members.filter((m) => getMemberStatus(m.email, weeks, lookup) === (colorFilter === 'none' ? null : colorFilter));

  function handleExport() {
    const header = ['Member', 'Email', ...weeks.map((w) => formatSundayLabel(w)), 'Total', 'Attendance %'].join(',');
    const rows = filteredMembers.map((m) => {
      const attended = weeks.filter((w) => lookup[m.email]?.[w]).length;
      const pct = weeks.length > 0 ? Math.round((attended / weeks.length) * 100) : 0;
      const cells = weeks.map((w) => {
        const r = lookup[m.email]?.[w];
        return r ? `"${new Date(r.timestamp).toLocaleString()}"` : '""';
      });
      return [`"${m.firstName} ${m.lastName}"`, `"${m.email}"`, ...cells, attended, `${pct}%`].join(',');
    });
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance-2026.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return <div className="att-loading">Loading dashboard…</div>;

  if (members.length === 0) {
    return <div className="att-empty">No members yet. Add members in the Members tab.</div>;
  }

  const totalAttended = filteredMembers.reduce((sum, m) => sum + weeks.filter((w) => lookup[m.email]?.[w]).length, 0);
  const totalPossible = filteredMembers.length * weeks.length;
  const overallPct = totalPossible > 0 ? Math.round((totalAttended / totalPossible) * 100) : 0;

  return (
    <div className="att-dashboard-panel">
      <div className="att-records-toolbar">
        <span className="att-members-count">
          {filteredMembers.length} member{filteredMembers.length !== 1 ? 's' : ''} · {weeks.length} Sunday{weeks.length !== 1 ? 's' : ''} · {overallPct}% overall attendance
        </span>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <select
            className="att-select"
            style={{ minWidth: 'unset', flex: 'unset', width: 'auto' }}
            value={colorFilter}
            onChange={(e) => setColorFilter(e.target.value)}
          >
            <option value="all">All members</option>
            <option value="red">🔴 At-risk only</option>
            <option value="yellow">🟡 Streak misses only</option>
            <option value="none">✅ No alerts</option>
          </select>
          <button className="att-btn att-btn-secondary" onClick={handleExport}>
            Export CSV
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="att-legend">
        <span className="att-legend-item">
          <span className="att-legend-dot att-legend-dot-red" />
          <span>Missed &gt;50% of Sundays in any 3-month stretch</span>
        </span>
        <span className="att-legend-item">
          <span className="att-legend-dot att-legend-dot-yellow" />
          <span>Missed 4+ Sundays in a row</span>
        </span>
      </div>

      <div className="att-table-wrap">
        <table className="att-table att-matrix-table">
          <thead>
            <tr>
              <th className="att-name-th">Member</th>
              {weeks.map((w) => (
                <th key={w} className="att-week-th">
                  <div>{formatSundayLabel(w)}</div>
                </th>
              ))}
              <th className="att-total-th">Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((m) => {
              const attended = weeks.filter((w) => lookup[m.email]?.[w]).length;
              const pct = weeks.length > 0 ? Math.round((attended / weeks.length) * 100) : 0;
              const status = getMemberStatus(m.email, weeks, lookup);
              return (
                <tr key={m.id}>
                  <td className="att-name-cell">
                    <div className={`att-member-name ${status ? `att-status-${status}` : ''}`}>
                      {m.firstName} {m.lastName}
                    </div>
                    <div className="att-member-email">{m.email}</div>
                  </td>
                  {weeks.map((w) => {
                    const record = lookup[m.email]?.[w];
                    return (
                      <td key={w} className="att-check-cell">
                        {record ? (
                          <div className="att-check-wrap">
                            <span className="att-check">✓</span>
                            <span className="att-check-time">
                              {new Date(record.timestamp).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        ) : (
                          <span className="att-absent">—</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="att-total-cell">
                    <span className={attended === weeks.length ? 'att-total-perfect' : 'att-total-partial'}>
                      {attended}/{weeks.length}
                    </span>
                    <div style={{ fontSize: '0.7rem', color: '#a0aec0' }}>{pct}%</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="att-summary-row">
              <td className="att-name-cell"><strong>Present</strong></td>
              {weeks.map((w) => {
                const count = filteredMembers.filter((m) => lookup[m.email]?.[w]).length;
                const pct = filteredMembers.length > 0 ? Math.round((count / filteredMembers.length) * 100) : 0;
                return (
                  <td key={w} className="att-check-cell">
                    <strong>{count}</strong>
                    <div style={{ fontSize: '0.7rem', color: '#718096' }}>{pct}%</div>
                  </td>
                );
              })}
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

// ── Members tab ───────────────────────────────────────────────
function MembersTab({ members, setMembers }) {
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
    setMembers(m);
  }

  async function handleAdd(e) {
    e.preventDefault();
    setAddError('');
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setAddError('All fields are required.');
      return;
    }
    const duplicate = members.find((m) => m.email.toLowerCase() === email.trim().toLowerCase());
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
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } catch {
      alert('Failed to remove member. Please try again.');
    }
  }

  async function handleClearAll() {
    if (!window.confirm(`Remove all ${members.length} members? This cannot be undone.`)) return;
    try {
      await clearAllMembers();
      setMembers([]);
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

  return (
    <div className="att-members-panel">
      <div className="att-card att-members-add-card">
        <h3 className="att-section-title">Add Member</h3>
        <form onSubmit={handleAdd} className="att-inline-form">
          <input className="att-input" type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <input className="att-input" type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <input className="att-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button className="att-btn att-btn-primary" type="submit" disabled={addLoading}>
            {addLoading ? '…' : 'Add'}
          </button>
        </form>
        {addError && <p className="att-error" style={{ marginTop: '0.5rem' }}>{addError}</p>}
      </div>

      <div className="att-card att-members-csv-card">
        <button className="att-section-toggle" onClick={() => setShowCsvPanel((v) => !v)}>
          {showCsvPanel ? '▾' : '▸'} Import from CSV
        </button>
        {showCsvPanel && (
          <div className="att-csv-panel">
            <p className="att-csv-hint">
              Format: <code>First Name, Last Name, Email</code> — one member per line.
            </p>
            <div className="att-csv-actions">
              <button className="att-btn att-btn-secondary" onClick={() => fileRef.current.click()}>
                Upload CSV File
              </button>
              <input ref={fileRef} type="file" accept=".csv,text/csv" style={{ display: 'none' }} onChange={handleFileUpload} />
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
            <button className="att-btn att-btn-primary" onClick={handleCsvImport} disabled={!csvText.trim() || importLoading}>
              {importLoading ? 'Importing…' : 'Import'}
            </button>
          </div>
        )}
      </div>

      <div className="att-members-toolbar">
        <span className="att-members-count">{members.length} member{members.length !== 1 ? 's' : ''}</span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {members.length > 0 && (
            <>
              <button className="att-btn att-btn-secondary" onClick={handleExportMembers}>Export CSV</button>
              <button className="att-btn att-btn-danger" onClick={handleClearAll}>Clear All</button>
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
              <tr><th>#</th><th>First Name</th><th>Last Name</th><th>Email</th><th>Role</th><th></th></tr>
            </thead>
            <tbody>
              {members.map((m, i) => (
                <tr key={m.id}>
                  <td>{i + 1}</td>
                  <td>{m.firstName}</td>
                  <td>{m.lastName}</td>
                  <td>{m.email}</td>
                  <td>
                    <select
                      className="att-select att-role-select"
                      value={m.memberRole || 'User'}
                      onChange={async (e) => {
                        await updateMemberRole(m.id, e.target.value);
                        setMembers((prev) =>
                          prev.map((x) => x.id === m.id ? { ...x, memberRole: e.target.value } : x)
                        );
                      }}
                    >
                      {MEMBER_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td>
                    <button className="att-btn-remove" onClick={() => handleRemove(m.id)} title="Remove member">✕</button>
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

// ── Reports tab ───────────────────────────────────────────────
function ReportsTab({ members, records }) {
  const weeks = getAllSundayWeekStarts();

  // Weekly: unique attendees per Sunday
  const weeklyStats = weeks.map((w) => {
    const checkedIn = new Set(records.filter((r) => r.weekStart === w).map((r) => r.email)).size;
    const pct = members.length > 0 ? Math.round((checkedIn / members.length) * 100) : 0;
    return { weekStart: w, checkedIn, pct };
  });

  // Monthly: group weeks by calendar month
  const monthMap = new Map();
  weeks.forEach((w) => {
    const sunday = getSundayDate(w);
    const key = `${sunday.getFullYear()}-${String(sunday.getMonth() + 1).padStart(2, '0')}`;
    const label = sunday.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!monthMap.has(key)) monthMap.set(key, { label, weeks: [] });
    monthMap.get(key).weeks.push(w);
  });

  const monthlyStats = [...monthMap.values()].map((group) => {
    const sundayCount = group.weeks.length;
    const totalCheckins = group.weeks.reduce((sum, w) => {
      return sum + new Set(records.filter((r) => r.weekStart === w).map((r) => r.email)).size;
    }, 0);
    const avgPerSunday = sundayCount > 0 ? (totalCheckins / sundayCount).toFixed(1) : '0';
    const pct =
      members.length > 0 && sundayCount > 0
        ? Math.round((totalCheckins / (members.length * sundayCount)) * 100)
        : 0;
    return { label: group.label, sundayCount, totalCheckins, avgPerSunday, pct };
  });

  function handleExport() {
    const weekRows = weeklyStats
      .map((s) => `"${formatSundayLabel(s.weekStart)}",${s.checkedIn},${members.length},${s.pct}%`)
      .join('\n');
    const monthRows = monthlyStats
      .map((s) => `"${s.label}",${s.sundayCount},${s.totalCheckins},${s.avgPerSunday},${s.pct}%`)
      .join('\n');
    const csv =
      'Sunday,Members Present,Total Members,Attendance %\n' +
      weekRows +
      '\n\nMonth,Sundays,Total Check-ins,Avg / Sunday,Avg Attendance %\n' +
      monthRows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance-report-2026.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  if (members.length === 0) {
    return <div className="att-empty">No members yet. Add members in the Members tab.</div>;
  }

  return (
    <div className="att-reports-panel">
      <div className="att-records-toolbar">
        <span className="att-members-count">
          {members.length} members · {weeks.length} Sundays in 2026
        </span>
        <button className="att-btn att-btn-secondary" onClick={handleExport}>
          Export CSV
        </button>
      </div>

      {/* Monthly summary */}
      <div className="att-card att-reports-card">
        <h3 className="att-section-title">Monthly Summary</h3>
        <div className="att-table-wrap">
          <table className="att-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Sundays</th>
                <th>Total Check-ins</th>
                <th>Avg / Sunday</th>
                <th>Avg Attendance</th>
              </tr>
            </thead>
            <tbody>
              {monthlyStats.map((s) => (
                <tr key={s.label}>
                  <td><strong>{s.label}</strong></td>
                  <td>{s.sundayCount}</td>
                  <td>{s.totalCheckins}</td>
                  <td>{s.avgPerSunday}</td>
                  <td>
                    <div className="att-pct-bar-wrap">
                      <div className="att-pct-bar" style={{ width: `${s.pct}%` }} />
                      <span className="att-pct-label">{s.pct}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Weekly detail */}
      <div className="att-card att-reports-card">
        <h3 className="att-section-title">Weekly Attendance</h3>
        <div className="att-table-wrap">
          <table className="att-table">
            <thead>
              <tr>
                <th>Sunday</th>
                <th>Members Present</th>
                <th>Total Members</th>
                <th>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {weeklyStats.map((s) => (
                <tr key={s.weekStart}>
                  <td>{formatSundayLabel(s.weekStart)}</td>
                  <td><strong>{s.checkedIn}</strong></td>
                  <td>{members.length}</td>
                  <td>
                    <div className="att-pct-bar-wrap">
                      <div className="att-pct-bar" style={{ width: `${s.pct}%` }} />
                      <span className="att-pct-label">{s.pct}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Tab config by role ────────────────────────────────────────
const TABS_BY_ROLE = {
  admin:   ['qr', 'dashboard', 'members', 'records', 'reports', 'settings', 'users'],
  manager: ['qr', 'dashboard', 'members', 'records', 'reports'],
  user:    ['dashboard', 'records'],
};

// ── Main dashboard ────────────────────────────────────────────
export default function AdminDashboard({ user, role, onLogout }) {
  const allowedTabs = TABS_BY_ROLE[role] ?? TABS_BY_ROLE.user;

  const [token, setToken] = useState(null);
  const [tokenLoading, setTokenLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(allowedTabs[0]);
  const [copied, setCopied] = useState(false);
  const [imgCopied, setImgCopied] = useState(false);
  const [filterSession, setFilterSession] = useState('all');
  const qrRef = useRef(null);

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

  useEffect(() => {
    getMembers().then((m) => {
      setMembers(m);
      setMembersLoading(false);
    });
  }, []);

  useEffect(() => {
    return subscribeToRecords(setRecords);
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

  function getQRCanvas(size = 600) {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return null;
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        URL.revokeObjectURL(svgUrl);
        resolve(canvas);
      };
      img.src = svgUrl;
    });
  }

  async function handleDownloadPNG() {
    const canvas = await getQRCanvas(800);
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `attendance-qr-${token.weekStart}.png`;
    a.click();
  }

  async function handleCopyImage() {
    const canvas = await getQRCanvas(600);
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setImgCopied(true);
        setTimeout(() => setImgCopied(false), 2500);
      } catch {
        // Clipboard image API not supported — fall back to download
        handleDownloadPNG();
      }
    }, 'image/png');
  }

  async function handleExportRecords() {
    const toExport = filterSession === 'all' ? records : await getRecordsForSession(filterSession);
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
    filterSession === 'all' ? records : records.filter((r) => r.weekStart === filterSession);

  const TAB_LABELS = {
    qr: 'QR Code',
    dashboard: 'Dashboard',
    members: 'Members',
    records: `Records (${records.length})`,
    reports: 'Reports',
    settings: 'Settings',
    users: 'Users',
  };

  return (
    <div className="att-dashboard">
      <header className="att-header">
        <div className="att-header-left">
          <span className="att-header-title">Attendance Admin</span>
          <span className={`att-role-badge att-role-${role}`}>{role}</span>
        </div>
        <button className="att-btn att-btn-ghost" onClick={handleLogout}>Sign Out</button>
      </header>

      <nav className="att-tabs">
        {allowedTabs.map((tab) => (
          <button
            key={tab}
            className={`att-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </nav>

      {/* QR tab */}
      {activeTab === 'qr' && (
        <div className="att-qr-panel">
          {tokenLoading ? (
            <div className="att-loading">Generating QR code…</div>
          ) : (
            <div className="att-card att-qr-card">
              <p className="att-week-label">Week of {formatWeekLabel(token.weekStart)}</p>
              <div className="att-qr-wrap" ref={qrRef}>
                <QRCodeSVG value={buildCheckinUrl(token)} size={260} level="M" includeMargin />
              </div>
              <p className="att-qr-hint">Students scan this code to check in</p>

              <div className="att-qr-export-group">
                <p className="att-qr-export-label">Export for presentations</p>
                <div className="att-qr-actions">
                  <button className="att-btn att-btn-primary" onClick={handleDownloadPNG}>
                    Download PNG
                  </button>
                  <button className="att-btn att-btn-secondary" onClick={handleCopyImage}>
                    {imgCopied ? 'Image Copied!' : 'Copy Image'}
                  </button>
                </div>
              </div>

              <div className="att-qr-export-group">
                <p className="att-qr-export-label">Share check-in link</p>
                <div className="att-qr-actions">
                  <button className="att-btn att-btn-secondary" onClick={handleCopyUrl}>
                    {copied ? 'Copied!' : 'Copy Check-in URL'}
                  </button>
                  <button className="att-btn att-btn-danger" onClick={handleRegenerate}>
                    Regenerate Code
                  </button>
                </div>
              </div>

              <details className="att-url-details">
                <summary>Show check-in URL</summary>
                <p className="att-url-text">{buildCheckinUrl(token)}</p>
              </details>
            </div>
          )}
        </div>
      )}

      {/* Dashboard tab */}
      {activeTab === 'dashboard' && (
        <DashboardTab members={members} records={records} loading={membersLoading} />
      )}

      {/* Members tab */}
      {activeTab === 'members' && (
        <MembersTab members={members} setMembers={setMembers} />
      )}

      {/* Reports tab */}
      {activeTab === 'reports' && (
        <ReportsTab members={members} records={records} />
      )}

      {/* Settings tab */}
      {activeTab === 'settings' && <SettingsTab />}

      {/* Records tab */}
      {activeTab === 'records' && (
        <div className="att-records-panel">
          <div className="att-records-toolbar">
            <select className="att-select" value={filterSession} onChange={(e) => setFilterSession(e.target.value)}>
              <option value="all">All weeks</option>
              {sessions.map((s) => (
                <option key={s} value={s}>Week of {formatWeekLabel(s)}</option>
              ))}
            </select>
            <button className="att-btn att-btn-secondary" onClick={handleExportRecords}>Export CSV</button>
          </div>
          {displayedRecords.length === 0 ? (
            <div className="att-empty">No attendance records yet.</div>
          ) : (
            <div className="att-table-wrap">
              <table className="att-table">
                <thead>
                  <tr><th>#</th><th>First Name</th><th>Last Name</th><th>Email</th><th>Week Of</th><th>Check-in Time</th></tr>
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

      {/* Users tab (admin only) */}
      {activeTab === 'users' && <UsersTab currentUser={user} />}
    </div>
  );
}
