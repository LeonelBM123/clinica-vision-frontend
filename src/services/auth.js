import apiClient from './apiClient';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.loadUserFromStorage();
  }

  loadUserFromStorage() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }
  }

  saveUserToStorage(userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('token', userData.token);
    this.currentUser = userData;
  }

  clearUserFromStorage() {
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    this.currentUser = null;
  }

  async login(correo, password) {
    try {
      const response = await apiClient.login(correo, password);
      
      const userData = {
        usuario_id: response.usuario_id,
        token: response.token,
        rol: response.rol,
        grupo_id: response.grupo_id,
        grupo_nombre: response.grupo_nombre,
        puede_acceder: response.puede_acceder,
        correo: correo
      };

      this.saveUserToStorage(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  }

  logout() {
    this.clearUserFromStorage();
    window.location.href = '/'; 
  }

  isAuthenticated() {
    return !!this.currentUser && !!localStorage.getItem('token');
  }

  // Métodos basados en el modelo de roles que me pasaste
  isSuperAdmin() {
    return this.currentUser?.rol?.toLowerCase() === 'superAdmin';
  }

  isAdmin() {
    return this.currentUser?.rol?.toLowerCase() === 'administrador';
  }

  isMedico() {
    return this.currentUser?.rol?.toLowerCase() === 'medico';
  }

  canAccessSystem() {
    return this.currentUser?.puede_acceder === true;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  // Verificar permisos específicos
  canManageUsers() {
    return this.isSuperAdmin() || this.isAdmin();
  }

  canManageGroups() {
    return this.isSuperAdmin();
  }

  canViewReports() {
    return this.isSuperAdmin() || this.isAdmin();
  }

  canManageInventory() {
    return this.isSuperAdmin() || this.isAdmin();
  }
}

export default new AuthService();
