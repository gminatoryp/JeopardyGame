import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import AttendanceApp from './attendance/AttendanceApp.jsx';
import './index.css';

function isAttendanceRoute() {
  const hash = window.location.hash;
  return hash.startsWith('#/attendance') || hash.startsWith('#/checkin');
}

function Root() {
  const [useAttendance, setUseAttendance] = useState(isAttendanceRoute);

  useEffect(() => {
    function onHashChange() {
      setUseAttendance(isAttendanceRoute());
    }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return useAttendance ? <AttendanceApp /> : <App />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
