import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isEditorAuthenticated } from '../../auth/session';

export default function RequireEditorAuth() {
  const location = useLocation();

  if (!isEditorAuthenticated()) {
    return <Navigate to="/inicio-sesion" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
