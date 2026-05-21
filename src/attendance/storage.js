import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  writeBatch,
  onSnapshot,
  limit,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';

// ── Firestore refs ────────────────────────────────────────────
const TOKEN_REF = doc(db, 'tokens', 'current');
const GEOFENCE_REF = doc(db, 'config', 'geofence');
const MEMBERS_COL = collection(db, 'members');
const RECORDS_COL = collection(db, 'records');

// ── Users ─────────────────────────────────────────────────────
const USERS_COL = collection(db, 'users');

export async function hasAnyUsers() {
  const snap = await getDocs(query(USERS_COL, limit(1)));
  return !snap.empty;
}

export async function getUserData(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

export async function createUserRecord(uid, email, role, createdBy) {
  await setDoc(doc(db, 'users', uid), {
    email,
    role,
    createdAt: Date.now(),
    createdBy: createdBy ?? null,
  });
}

export async function getAllUsers() {
  const snap = await getDocs(USERS_COL);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateUserRole(uid, role) {
  await setDoc(doc(db, 'users', uid), { role }, { merge: true });
}

export async function removeUserRecord(uid) {
  await deleteDoc(doc(db, 'users', uid));
}

// ── Geofence config ───────────────────────────────────────────

export async function getGeofenceConfig() {
  const snap = await getDoc(GEOFENCE_REF);
  return snap.exists()
    ? snap.data()
    : { enabled: false, lat: null, lon: null, radiusMiles: 0.5, label: '' };
}

export async function saveGeofenceConfig(config) {
  await setDoc(GEOFENCE_REF, config);
}

// ── Token ─────────────────────────────────────────────────────

export async function getCurrentToken() {
  const snap = await getDoc(TOKEN_REF);
  return snap.exists() ? snap.data() : null;
}

export async function saveCurrentToken(token) {
  await setDoc(TOKEN_REF, token);
}

// ── Members ───────────────────────────────────────────────────

export async function getMembers() {
  const snap = await getDocs(MEMBERS_COL);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addMember(member) {
  await addDoc(MEMBERS_COL, {
    firstName: member.firstName.trim(),
    lastName: member.lastName.trim(),
    email: member.email.trim().toLowerCase(),
  });
}

export async function removeMember(id) {
  await deleteDoc(doc(db, 'members', id));
}

export async function updateMemberRole(id, memberRole) {
  await setDoc(doc(db, 'members', id), { memberRole }, { merge: true });
}

export async function clearAllMembers() {
  const snap = await getDocs(MEMBERS_COL);
  const batch = writeBatch(db);
  snap.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
}

export async function bulkAddMembers(members) {
  // Firestore batch limit is 500 per commit
  const chunks = [];
  for (let i = 0; i < members.length; i += 400) {
    chunks.push(members.slice(i, i + 400));
  }
  for (const chunk of chunks) {
    const batch = writeBatch(db);
    chunk.forEach((member) => {
      const ref = doc(MEMBERS_COL);
      batch.set(ref, {
        firstName: member.firstName.trim(),
        lastName: member.lastName.trim(),
        email: member.email.trim().toLowerCase(),
      });
    });
    await batch.commit();
  }
}

export async function updateMemberEmail(id, email) {
  await setDoc(doc(db, 'members', id), { email: email.trim().toLowerCase() }, { merge: true });
}

export async function findMemberByName(firstName, lastName) {
  const snap = await getDocs(MEMBERS_COL);
  const fn = firstName.trim().toLowerCase();
  const ln = lastName.trim().toLowerCase();
  const match = snap.docs.find((d) => {
    const data = d.data();
    return data.firstName.toLowerCase() === fn && data.lastName.toLowerCase() === ln;
  });
  return match ? { id: match.id, ...match.data() } : null;
}

// Match by email first (indexed), then verify first+last name
export async function findMember(firstName, lastName, email) {
  const q = query(MEMBERS_COL, where('email', '==', email.trim().toLowerCase()));
  const snap = await getDocs(q);
  const match = snap.docs.find((d) => {
    const data = d.data();
    return (
      data.firstName.toLowerCase() === firstName.trim().toLowerCase() &&
      data.lastName.toLowerCase() === lastName.trim().toLowerCase()
    );
  });
  return match ? { id: match.id, ...match.data() } : null;
}

// ── Records ───────────────────────────────────────────────────

export async function getRecords() {
  const snap = await getDocs(RECORDS_COL);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addRecord(record) {
  await addDoc(RECORDS_COL, record);
}

export async function hasCheckedIn(sessionId, email) {
  const q = query(
    RECORDS_COL,
    where('sessionId', '==', sessionId),
    where('email', '==', email.trim().toLowerCase())
  );
  const snap = await getDocs(q);
  return !snap.empty;
}

export async function getRecordsForSession(sessionId) {
  const q = query(RECORDS_COL, where('sessionId', '==', sessionId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Real-time listener — returns unsubscribe function
export function subscribeToRecords(callback) {
  return onSnapshot(RECORDS_COL, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

// ── CSV utilities (pure JS) ───────────────────────────────────

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

export function parseMembersCSV(text) {
  const lines = text.trim().split(/\r?\n/).filter((l) => l.trim());
  if (lines.length === 0) return [];

  // Parse one CSV line respecting quoted fields
  function parseLine(line) {
    const fields = [];
    let cur = '';
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuote = !inQuote;
      } else if (ch === ',' && !inQuote) {
        fields.push(cur.trim());
        cur = '';
      } else {
        cur += ch;
      }
    }
    fields.push(cur.trim());
    return fields;
  }

  // Detect header row by checking if first row contains no email addresses
  const firstRow = parseLine(lines[0]);
  const firstRowNorm = firstRow.map((f) => f.toLowerCase().replace(/\s+/g, ''));
  const hasHeader = firstRowNorm.every((f) => !f.includes('@'));

  let firstNameIdx = 0;
  let lastNameIdx = 1;
  let emailIdx = 2;

  if (hasHeader) {
    firstRowNorm.forEach((h, i) => {
      if (['firstname', 'first name', 'fname'].includes(h)) firstNameIdx = i;
      if (['lastname', 'last name', 'lname'].includes(h)) lastNameIdx = i;
      if (['email', 'homeemail', 'home email', 'emailaddress', 'e-mail'].includes(h)) emailIdx = i;
    });
  }

  const startLine = hasHeader ? 1 : 0;
  const members = [];

  for (let i = startLine; i < lines.length; i++) {
    const parts = parseLine(lines[i]);
    const maxIdx = Math.max(firstNameIdx, lastNameIdx, emailIdx);
    if (parts.length <= maxIdx) continue;

    const firstName = parts[firstNameIdx];
    const lastName = parts[lastNameIdx];
    // Strip trailing semicolons (common export artifact)
    const email = parts[emailIdx].replace(/[;\s]+$/, '');

    if (!firstName || !lastName || !email.includes('@')) continue;
    members.push({ firstName, lastName, email: email.toLowerCase() });
  }

  return members;
}

// ── Activity log ──────────────────────────────────────────────

const ACTIVITY_COL = collection(db, 'activityLog');

export async function logActivity(action, details, performedBy = 'system') {
  await addDoc(ACTIVITY_COL, {
    action,
    details,
    performedBy,
    timestamp: Date.now(),
  });
}

export function subscribeToActivityLog(callback) {
  return onSnapshot(
    query(ACTIVITY_COL, orderBy('timestamp', 'desc')),
    (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
}

// ── Headcount ─────────────────────────────────────────────────

export async function saveHeadcount(weekStart, count, recordedBy) {
  await setDoc(doc(db, 'headcount', weekStart), {
    weekStart,
    count,
    recordedBy,
    timestamp: Date.now(),
  });
}

export async function getHeadcount(weekStart) {
  const snap = await getDoc(doc(db, 'headcount', weekStart));
  return snap.exists() ? snap.data() : null;
}
