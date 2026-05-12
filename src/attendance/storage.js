const KEY_PASSWORD = 'att_admin_password';
const KEY_TOKEN = 'att_current_token';
const KEY_RECORDS = 'att_records';

// --- Admin password ---

export function getStoredPasswordHash() {
  return localStorage.getItem(KEY_PASSWORD);
}

export function setStoredPasswordHash(hash) {
  localStorage.setItem(KEY_PASSWORD, hash);
}

export function isFirstRun() {
  return !localStorage.getItem(KEY_PASSWORD);
}

// --- QR token ---

export function getCurrentToken() {
  const raw = localStorage.getItem(KEY_TOKEN);
  return raw ? JSON.parse(raw) : null;
}

export function saveCurrentToken(token) {
  localStorage.setItem(KEY_TOKEN, JSON.stringify(token));
}

// --- Attendance records ---

export function getRecords() {
  const raw = localStorage.getItem(KEY_RECORDS);
  return raw ? JSON.parse(raw) : [];
}

export function addRecord(record) {
  const records = getRecords();
  records.push(record);
  localStorage.setItem(KEY_RECORDS, JSON.stringify(records));
}

export function hasCheckedIn(sessionId, userId) {
  return getRecords().some(
    (r) => r.sessionId === sessionId && r.userId.toLowerCase() === userId.toLowerCase()
  );
}

export function getRecordsForSession(sessionId) {
  return getRecords().filter((r) => r.sessionId === sessionId);
}

export function exportRecordsCSV(records) {
  const header = 'Name,Student ID,Week Of,Check-in Time\n';
  const rows = records.map((r) =>
    [
      `"${r.name}"`,
      `"${r.userId}"`,
      `"${r.weekStart}"`,
      `"${new Date(r.timestamp).toLocaleString()}"`,
    ].join(',')
  );
  return header + rows.join('\n');
}
