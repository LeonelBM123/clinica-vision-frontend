import { Navigate } from 'react-router-dom';
import authService from '../services/auth';

const PublicRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  if (isAuthenticated && authService.canAccessSystem()) {
    if (authService.isSuperAdmin()) {
      return <Navigate to="/superadmin" replace />;
    } else if (authService.isAdmin()) {
      return <Navigate to="/adminlayout" replace />;
    } else {
      return <Navigate to="/userlayout" replace />;
    }
  }

  return children;
};

export default PublicRoute;