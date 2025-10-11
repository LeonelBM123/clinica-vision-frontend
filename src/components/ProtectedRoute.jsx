import { Navigate } from 'react-router-dom';
import authService from '../services/auth';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  const canAccess = authService.canAccessSystem();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!canAccess) {
    return <Navigate to="/subscription-status" replace />;
  }

  return children;
};

export default ProtectedRoute;