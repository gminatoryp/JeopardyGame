import { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import CheckinPage from './CheckinPage';
import './attendance.css';

function getRoute() {
  const hash = window.location.hash;
  if (hash.startsWith('#/checkin')) return 'checkin';
  return 'admin';
}

export default function AttendanceApp() {
  const [route, setRoute] = useState(getRoute);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    function onHashChange() {
      setRoute(getRoute());
    }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (route === 'checkin') {
    return <CheckinPage />;
  }

  if (!user) {
    return (
      <AdminLogin
        onLogin={(u, r) => {
          setUser(u);
          setRole(r);
        }}
      />
    );
  }

  return (
    <AdminDashboard
      user={user}
      role={role}
      onLogout={() => {
        setUser(null);
        setRole(null);
      }}
    />
  );
}
