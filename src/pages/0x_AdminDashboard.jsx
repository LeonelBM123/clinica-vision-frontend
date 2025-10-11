import React from 'react';
import RoleGuard from '../components/RoleGuard';
import authService from '../services/auth';

const AdminDashboard = () => {
  const currentUser = authService.getCurrentUser();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Dashboard - {currentUser?.grupo_nombre || 'Visionex'}
      </h1>
      
      {/* Información general - Todos pueden ver */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Mi Información</h3>
          <p className="text-gray-600">Correo: {currentUser?.correo}</p>
          <p className="text-gray-600">Rol: {currentUser?.rol}</p>
          {currentUser?.grupo_nombre && (
            <p className="text-gray-600">Clínica: {currentUser.grupo_nombre}</p>
          )}
        </div>

        {/* Panel de pacientes - Todos */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Pacientes</h3>
          <p className="text-blue-600">Gestiona los pacientes de la clínica</p>
        </div>

        {/* Panel administrativo - Solo Admin y SuperAdmin */}
        <RoleGuard requireAdmin>
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800">Panel Administrativo</h3>
            <p className="text-green-600">Gestión de usuarios y configuración</p>
          </div>
        </RoleGuard>
      </div>

      {/* Panel SuperAdmin - Solo SuperAdmin */}
      <RoleGuard requireSuperAdmin>
        <div className="bg-purple-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-purple-800 mb-4">Panel Super Administrador</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold">Gestión de Grupos</h4>
              <p className="text-sm text-gray-600">Administra todas las clínicas del sistema</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold">Reportes Globales</h4>
              <p className="text-sm text-gray-600">Estadísticas de todo el sistema</p>
            </div>
          </div>
        </div>
      </RoleGuard>

      {/* Panel Médico - Solo si es médico */}
      <RoleGuard allowedRoles={['medico']}>
        <div className="bg-yellow-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-yellow-800 mb-4">Panel Médico</h2>
          <p className="text-yellow-700">Funciones específicas para médicos</p>
        </div>
      </RoleGuard>
    </div>
  );
};

export default AdminDashboard;