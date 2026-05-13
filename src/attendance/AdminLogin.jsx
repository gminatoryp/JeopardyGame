import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

function friendlyError(code) {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please sign in.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait a few minutes and try again.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

export default function AdminLogin({ onLogin }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function switchMode(next) {
    setMode(next);
    setError('');
    setPassword('');
    setConfirm('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirm) {
        setError('Passwords do not match.');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'register') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onLogin();
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Please sign in instead.');
        setMode('login');
      } else {
        setError(friendlyError(err.code));
      }
    }
    setLoading(false);
  }

  return (
    <div className="att-login-wrap">
      <div className="att-card att-login-card">
        <h1 className="att-logo">Attendance Admin</h1>
        <p className="att-login-sub">
          {mode === 'register'
            ? 'Create your admin account to get started.'
            : 'Sign in to manage attendance.'}
        </p>

        <form onSubmit={handleSubmit} className="att-form">
          <label className="att-label">Email</label>
          <input
            className="att-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            autoFocus
            required
          />

          <label className="att-label">Password</label>
          <input
            className="att-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />

          {mode === 'register' && (
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
            {loading ? 'Please wait…' : mode === 'register' ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="att-login-footer">
          {mode === 'login' ? (
            <button className="att-text-btn" onClick={() => switchMode('register')}>
              First time? Create admin account
            </button>
          ) : (
            <button className="att-text-btn" onClick={() => switchMode('login')}>
              Already have an account? Sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
