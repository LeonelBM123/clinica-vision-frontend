import authService from '../services/auth';

const RoleGuard = ({ 
  children, 
  allowedRoles = [], 
  requireSuperAdmin = false,
  requireAdmin = false,
  fallback = null 
}) => {
  const userRole = authService.getCurrentUser()?.rol; 

  // Verificar si tiene permisos
  let hasAccess = false;

  if (requireSuperAdmin && authService.isSuperAdmin()) {
    hasAccess = true;
  } else if (requireAdmin && (authService.isAdmin() || authService.isSuperAdmin())) {
    hasAccess = true;
  } else if (allowedRoles.length > 0 && allowedRoles.includes(userRole)) {
    hasAccess = true;
  } else if (allowedRoles.length === 0 && !requireSuperAdmin && !requireAdmin) {
    hasAccess = true; // Sin restricciones
  }

  if (!hasAccess) {
    return fallback || (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          Acceso Restringido
        </h3>
        <p className="text-yellow-700">
          No tienes permisos para acceder a esta sección.
        </p>
        <p className="text-sm text-yellow-600 mt-2">
          Tu rol actual: <span className="font-medium">{userRole}</span>
        </p>
      </div>
    );
  }

  return children;
};

export default RoleGuard;