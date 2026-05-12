// Returns the ISO date string (YYYY-MM-DD) for the Monday of the given date's week
export function getWeekStart(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun, 1=Mon...
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split('T')[0];
}

export function generateToken() {
  const weekStart = getWeekStart();
  const weekEndDate = new Date(weekStart);
  weekEndDate.setDate(weekEndDate.getDate() + 7);

  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const sessionId = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return {
    sessionId,
    weekStart,
    expires: weekEndDate.getTime(),
    createdAt: Date.now(),
  };
}

export function isTokenValid(token) {
  if (!token || !token.expires) return false;
  return Date.now() < token.expires;
}

export function encodeToken(token) {
  return btoa(JSON.stringify(token));
}

export function decodeToken(encoded) {
  try {
    return JSON.parse(atob(encoded));
  } catch {
    return null;
  }
}

export function formatWeekLabel(weekStart) {
  if (!weekStart) return '';
  const [y, m, d] = weekStart.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}
