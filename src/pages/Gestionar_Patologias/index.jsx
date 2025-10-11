import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import UniversalTable from '../../components/UniversalTable';
import ConfirmModal from '../../components/ConfirmModal';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/apiClient';
import { Outlet, useLocation } from "react-router-dom";

const GestionarPatologias = () => {
  const [patologias, setPatologias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, patologia: null });
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Definir columnas de la tabla
  const columns = [
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Alias', accessor: 'alias', render: (item) => item.alias || 'Sin alias' },
    {
      header: 'Gravedad',
      accessor: 'gravedad',
      render: (item) => {
        const colors = {
          'LEVE': 'bg-green-100 text-green-800',
          'MODERADA': 'bg-yellow-100 text-yellow-800',
          'GRAVE': 'bg-orange-100 text-orange-800',
          'CRITICA': 'bg-red-100 text-red-800'
        };
        const labels = {
          'LEVE': 'Leve', 'MODERADA': 'Moderada', 'GRAVE': 'Grave', 'CRITICA': 'Crítica'
        };
        return (
          <span className={`px-2 py-1 text-xs font-bold rounded-full ${colors[item.gravedad] || 'bg-gray-100 text-gray-800'}`}>
            {labels[item.gravedad] || item.gravedad}
          </span>
        );
      }
    },
    { header: 'Grupo', accessor: 'grupo_nombre' },
    { 
      header: 'Fecha Creación', 
      accessor: 'fecha_creacion',
      render: (item) => item.fecha_creacion ? new Date(item.fecha_creacion).toLocaleDateString('es-ES') : '—'
    }
  ];

  // Notificación
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Cargar patologías
  const loadPatologias = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.get('/diagnosticos/patologias/');
      setPatologias(Array.isArray(data) ? data : []);
    } catch (error) {
      setError(error.message || 'Error al cargar patologías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatologias();
  }, []);

  // Navegar a crear
  const handleAdd = () => {
    navigate('/dashboard/patologias/nueva');
  };

  // Navegar a editar
  const handleEdit = (patologia) => {
    navigate(`/dashboard/patologias/${patologia.id}/editar`);
  };

  // Abrir modal de confirmación para eliminar
  const handleDelete = (patologia) => {
    setDeleteModal({
      isOpen: true,
      patologia: patologia
    });
  };

  // Confirmar eliminación
  const confirmDelete = async () => {
    if (!deleteModal.patologia) return;
    
    try {
      setDeleting(true);
      await api.delete(`/diagnosticos/patologias/${deleteModal.patologia.id}/`);
      showNotification('Patología eliminada correctamente');
      await loadPatologias();
      setDeleteModal({ isOpen: false, patologia: null });
    } catch (error) {
      setError(error.message || 'Error al eliminar patología');
    } finally {
      setDeleting(false);
    }
  };

  // Cancelar eliminación
  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, patologia: null });
  };

  // Detecta si está en una ruta hija (crear/editar)
  const isFormRoute = location.pathname.includes("/dashboard/patologias/nueva") ||
                      location.pathname.match(/\/dashboard\/patologias\/\d+\/editar/);

  // Si está en una ruta hija, muestra el Outlet (formulario)
  if (isFormRoute) {
    return <Outlet />;
  }

  // Si no, muestra la tabla
  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Notificación */}
        {notification && (
          <div className={`fixed top-4 right-4 z-30 p-4 rounded-xl shadow-lg flex items-center gap-2 ${
            notification.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {notification.message}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
            {error}
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Patologías</h1>
          <p className="text-gray-600 mt-2">Administra las patologías del sistema</p>
        </div>

        {/* Tabla Universal */}
        <UniversalTable
          title="Lista de Patologías"
          data={patologias}
          columns={columns}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          searchPlaceholder="Buscar patologías..."
          addButtonText="Nueva Patología"
          showAddButton={true}
          emptyMessage="No hay patologías registradas"
        />

        {/* Modal de confirmación para eliminar */}
        <ConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title="Eliminar Patología"
          message={`¿Estás seguro de que deseas eliminar la patología "${deleteModal.patologia?.nombre}"? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          type="danger"
          loading={deleting}
        />
      </div>
    </div>
  );
};

export default GestionarPatologias;
