import { useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from './firebase';
import { hasAnyUsers, createUserRecord, getUserData } from './storage';

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
      return 'An account with this email already exists.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait a few minutes and try again.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

export default function AdminLogin({ onLogin }) {
  // 'checking' | 'login' | 'firstSetup' | 'forgotPassword'
  const [mode, setMode] = useState('checking');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    hasAnyUsers()
      .then((exists) => setMode(exists ? 'login' : 'firstSetup'))
      .catch(() => setMode('login'));
  }, []);

  function switchMode(next) {
    setMode(next);
    setError('');
    setPassword('');
    setConfirm('');
    setResetSent(false);
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const userData = await getUserData(cred.user.uid);
      onLogin(cred.user, userData?.role ?? 'user');
    } catch (err) {
      setError(friendlyError(err.code));
    }
    setLoading(false);
  }

  async function handleFirstSetup(e) {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await createUserRecord(cred.user.uid, email, 'admin', null);
      onLogin(cred.user, 'admin');
    } catch (err) {
      setError(friendlyError(err.code));
    }
    setLoading(false);
  }

  async function handleForgotPassword(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      // Don't reveal whether an email exists — always show success
      if (err.code !== 'auth/user-not-found' && err.code !== 'auth/invalid-email') {
        setError(friendlyError(err.code));
        setLoading(false);
        return;
      }
    }
    setResetSent(true);
    setLoading(false);
  }

  if (mode === 'checking') {
    return (
      <div className="att-login-wrap">
        <div className="att-card att-login-card">
          <div className="att-loading">Loading…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="att-login-wrap">
      <div className="att-card att-login-card">
        <h1 className="att-logo">Attendance Admin</h1>

        {mode === 'forgotPassword' && (
          <>
            <p className="att-login-sub">Enter your email to receive a password reset link.</p>
            {resetSent ? (
              <div className="att-reset-sent">
                <p>If that email is registered, a reset link has been sent. Check your inbox.</p>
                <button className="att-text-btn" style={{ marginTop: '1rem' }} onClick={() => switchMode('login')}>
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="att-form">
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
                {error && <p className="att-error">{error}</p>}
                <button className="att-btn att-btn-primary" type="submit" disabled={loading}>
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </button>
                <button
                  type="button"
                  className="att-text-btn"
                  style={{ marginTop: '0.75rem' }}
                  onClick={() => switchMode('login')}
                >
                  Back to Sign In
                </button>
              </form>
            )}
          </>
        )}

        {mode === 'firstSetup' && (
          <>
            <p className="att-login-sub">No accounts found. Create the first admin account to get started.</p>
            <form onSubmit={handleFirstSetup} className="att-form">
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
                placeholder="At least 6 characters"
                required
              />
              <label className="att-label">Confirm Password</label>
              <input
                className="att-input"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirm password"
                required
              />
              {error && <p className="att-error">{error}</p>}
              <button className="att-btn att-btn-primary" type="submit" disabled={loading}>
                {loading ? 'Creating account…' : 'Create Admin Account'}
              </button>
            </form>
          </>
        )}

        {mode === 'login' && (
          <>
            <p className="att-login-sub">Sign in to manage attendance.</p>
            <form onSubmit={handleLogin} className="att-form">
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
              {error && <p className="att-error">{error}</p>}
              <button className="att-btn att-btn-primary" type="submit" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
            <div className="att-login-footer">
              <button className="att-text-btn" onClick={() => switchMode('forgotPassword')}>
                Forgot password?
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
