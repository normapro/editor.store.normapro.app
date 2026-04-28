import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isEditorAuthenticated } from '../../auth/session';

export default function RequireEditorAuth() {
  const location = useLocation();
  const [, setHeartbeat] = useState(0);

  useEffect(() => {
    const forceCheck = () => {
      setHeartbeat((prev) => prev + 1);
    };

    const intervalId = window.setInterval(forceCheck, 15000);
    window.addEventListener('focus', forceCheck);
    window.addEventListener('storage', forceCheck);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', forceCheck);
      window.removeEventListener('storage', forceCheck);
    };
  }, []);

  if (!isEditorAuthenticated()) {
    const fromPath = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to="/inicio-sesion" replace state={{ from: fromPath }} />;
  }

  return <Outlet />;
}
