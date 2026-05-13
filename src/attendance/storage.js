const KEY_PASSWORD = 'att_admin_password';
const KEY_TOKEN = 'att_current_token';
const KEY_RECORDS = 'att_records';
const KEY_MEMBERS = 'att_members';

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

// --- Member list ---

export function getMembers() {
  const raw = localStorage.getItem(KEY_MEMBERS);
  return raw ? JSON.parse(raw) : [];
}

export function setMembers(members) {
  localStorage.setItem(KEY_MEMBERS, JSON.stringify(members));
}

export function addMember(member) {
  const members = getMembers();
  members.push({
    firstName: member.firstName.trim(),
    lastName: member.lastName.trim(),
    email: member.email.trim().toLowerCase(),
  });
  localStorage.setItem(KEY_MEMBERS, JSON.stringify(members));
}

export function removeMember(index) {
  const members = getMembers();
  members.splice(index, 1);
  localStorage.setItem(KEY_MEMBERS, JSON.stringify(members));
}

// Returns the matching member object or null
export function findMember(firstName, lastName, email) {
  const members = getMembers();
  return (
    members.find(
      (m) =>
        m.firstName.toLowerCase() === firstName.trim().toLowerCase() &&
        m.lastName.toLowerCase() === lastName.trim().toLowerCase() &&
        m.email.toLowerCase() === email.trim().toLowerCase()
    ) || null
  );
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

// Duplicate check: one check-in per email per session
export function hasCheckedIn(sessionId, email) {
  return getRecords().some(
    (r) => r.sessionId === sessionId && r.email.toLowerCase() === email.trim().toLowerCase()
  );
}

export function getRecordsForSession(sessionId) {
  return getRecords().filter((r) => r.sessionId === sessionId);
}

export function exportRecordsCSV(records) {
  const header = 'First Name,Last Name,Email,Week Of,Check-in Time\n';
  const rows = records.map((r) =>
    [
      `"${r.firstName}"`,
      `"${r.lastName}"`,
      `"${r.email}"`,
      `"${r.weekStart}"`,
      `"${new Date(r.timestamp).toLocaleString()}"`,
    ].join(',')
  );
  return header + rows.join('\n');
}

// Parse a CSV string into member objects. Accepts with or without a header row.
export function parseMembersCSV(text) {
  const lines = text.trim().split(/\r?\n/).filter((l) => l.trim());
  const members = [];
  for (const line of lines) {
    const parts = line.split(',').map((p) => p.replace(/^"|"$/g, '').trim());
    if (parts.length < 3) continue;
    const [firstName, lastName, email] = parts;
    // Skip header row if present
    if (firstName.toLowerCase() === 'first name' || firstName.toLowerCase() === 'firstname') continue;
    if (!email.includes('@')) continue;
    members.push({ firstName, lastName, email: email.toLowerCase() });
  }
  return members;
}
