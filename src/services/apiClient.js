const API_BASE_URL = 'http://localhost:8000/api/';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('token');
    const noAuth = options.noAuth || false;

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token && !noAuth) {
      headers['Authorization'] = `Token ${token}`;
    }

    const config = {
      headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.detail || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Auth endpoints
  async login(correo, password) {
    return this.request('cuentas/usuarios/login/', {
      method: 'POST',
      body: JSON.stringify({ correo, password }),
      noAuth: true,
    });
  }

  async logout(){
    return this.request('cuentas/usuarios/logout/',{
      method:'POST',
      headers:{
        'Authorization': `Token ${localStorage.getItem('token')}`
      }
    });
  }

  async getToken2Reset(correo){
    return await this.request('cuentas/usuarios/solicitar_reset_token/',{
      method: 'POST',
      body : JSON.stringify({correo}),
      noAuth:true,
    });
  }

  async resetPassword(correo,reset_token,new_password){
    return await this.request('cuentas/usuarios/nueva_password/',{
      method:'POST',
      body:JSON.stringify({correo,reset_token,new_password}),
      noAuth:true,
    });
  }

  async register(userData) {
    return this.request('cuentas/usuarios/', {
      method: 'POST',
      body: JSON.stringify(userData),
      noAuth: true,
    });
  }

  // Grupos endpoints
  async getGrupos() {
    return this.request('cuentas/grupos/', { noAuth: true });
  }

  async createGrupo(grupoData) {
    return this.request('cuentas/grupos/', {
      method: 'POST',
      body: JSON.stringify(grupoData),
      noAuth: true,
    });
  }

  async updateGrupo(id, grupoData) {
    return this.request(`cuentas/grupos/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(grupoData),
    });
  }

  // Pagos endpoints
  async getPagos() {
    return this.request('cuentas/pagos/');
  }

  async createPago(pagoData) {
    return this.request('cuentas/pagos/', {
      method: 'POST',
      body: JSON.stringify(pagoData),
    });
  }

  async marcarPagoPagado(id) {
    return this.request(`cuentas/pagos/${id}/marcar_pagado/`, {
      method: 'POST',
    });
  }

  // Usuarios endpoints
  async getUsuarios() {
    return this.request('cuentas/usuarios/');
  }

  async getRoles() {
    return this.request('cuentas/roles/');
  }
}

export default new ApiClient();