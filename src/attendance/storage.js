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
} from 'firebase/firestore';
import { db } from './firebase';

// ── Firestore refs ────────────────────────────────────────────
const TOKEN_REF = doc(db, 'tokens', 'current');
const GEOFENCE_REF = doc(db, 'config', 'geofence');
const MEMBERS_COL = collection(db, 'members');
const RECORDS_COL = collection(db, 'records');

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
  const members = [];
  for (const line of lines) {
    const parts = line.split(',').map((p) => p.replace(/^"|"$/g, '').trim());
    if (parts.length < 3) continue;
    const [firstName, lastName, email] = parts;
    if (
      firstName.toLowerCase() === 'first name' ||
      firstName.toLowerCase() === 'firstname'
    )
      continue;
    if (!email.includes('@')) continue;
    members.push({ firstName, lastName, email: email.toLowerCase() });
  }
  return members;
}
