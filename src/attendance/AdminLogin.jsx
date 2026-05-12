import { useState } from 'react';
import { hashPassword, verifyPassword } from './crypto';
import { getStoredPasswordHash, setStoredPasswordHash, isFirstRun } from './storage';

export default function AdminLogin({ onLogin }) {
  const firstRun = isFirstRun();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (firstRun) {
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        setLoading(false);
        return;
      }
      if (password !== confirm) {
        setError('Passwords do not match.');
        setLoading(false);
        return;
      }
      const hash = await hashPassword(password);
      setStoredPasswordHash(hash);
      onLogin();
    } else {
      const stored = getStoredPasswordHash();
      const ok = await verifyPassword(password, stored);
      if (ok) {
        onLogin();
      } else {
        setError('Incorrect password.');
      }
    }

    setLoading(false);
  }

  return (
    <div className="att-login-wrap">
      <div className="att-card att-login-card">
        <h1 className="att-logo">Attendance Admin</h1>
        <p className="att-login-sub">
          {firstRun ? 'Set up your admin password to get started.' : 'Enter your admin password.'}
        </p>
        <form onSubmit={handleSubmit} className="att-form">
          <label className="att-label">Password</label>
          <input
            className="att-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            autoFocus
            required
          />
          {firstRun && (
            <>
              <label className="att-label">Confirm Password</label>
              <input
                className="att-input"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirm password"
                required
              />
            </>
          )}
          {error && <p className="att-error">{error}</p>}
          <button className="att-btn att-btn-primary" type="submit" disabled={loading}>
            {loading ? 'Please wait…' : firstRun ? 'Create Account' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
