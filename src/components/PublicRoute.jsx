import { Navigate } from 'react-router-dom';
import authService from '../services/auth';

const PublicRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();

  // Si está autenticado y tiene acceso, redirige al dashboard base
  if (isAuthenticated && authService.canAccessSystem()) {
    return <Navigate to="/dashboard" replace />;
  }

  // Si no está autenticado, muestra la ruta pública (home, login, etc.)
  return children;
};

export default PublicRoute;