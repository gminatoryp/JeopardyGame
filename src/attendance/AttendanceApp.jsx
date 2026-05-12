import { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import CheckinPage from './CheckinPage';
import './attendance.css';

function getRoute() {
  const hash = window.location.hash;
  if (hash.startsWith('#/checkin')) return 'checkin';
  if (hash.startsWith('#/attendance')) return 'admin';
  return 'admin';
}

export default function AttendanceApp() {
  const [route, setRoute] = useState(getRoute);
  const [loggedIn, setLoggedIn] = useState(false);

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

  // Admin route
  if (!loggedIn) {
    return <AdminLogin onLogin={() => setLoggedIn(true)} />;
  }

  return <AdminDashboard onLogout={() => setLoggedIn(false)} />;
}
