import React, { useState, useEffect } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import UniversalTable from "../../components/UniversalTable";
import ConfirmModal from "../../components/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/apiClient";
import { Outlet, useLocation } from "react-router-dom";

const GestionarUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    usuario: null,
  });
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Definir columnas de la tabla
  const columns = [
    { header: "Nombre", accessor: "nombre" },
    { header: "Correo", accessor: "correo" },
    {
      header: "Teléfono",
      accessor: "telefono",
      render: (item) => (
        <span className="text-gray-700">
          {item.telefono || "No especificado"}
        </span>
      ),
    },
    {
      header: "Rol",
      accessor: "rol_nombre",
      render: (item) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          item.rol_nombre === 'superAdmin' ? 'bg-purple-100 text-purple-800' :
          item.rol_nombre === 'administrador' ? 'bg-blue-100 text-blue-800' :
          item.rol_nombre === 'medico' ? 'bg-green-100 text-green-800' :
          item.rol_nombre === 'paciente' ? 'bg-gray-100 text-gray-800' :
          'bg-gray-100 text-gray-600'
        }`}>
          {item.rol_nombre || 'Sin rol'}
        </span>
      ),
    },
    {
      header: "Grupo",
      accessor: "grupo_nombre",
      render: (item) => (
        <span className="text-gray-700 text-sm">
          {item.grupo_nombre || "Sin grupo"}
        </span>
      ),
    },
    {
      header: "Estado",
      accessor: "estado",
      render: (item) => (
        <span
          className={`px-2 py-1 text-xs font-bold rounded-full ${
            item.estado
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {item.estado ? "Activo" : "Inactivo"}
        </span>
      ),
    },
    {
      header: "Fecha Registro",
      accessor: "fecha_registro",
      render: (item) => (
        <span className="text-gray-600 text-sm">
          {item.fecha_registro ? new Date(item.fecha_registro).toLocaleDateString() : "-"}
        </span>
      ),
    },
  ];

  // Notificación
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Cargar usuarios
  const loadUsuarios = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await api.get("/cuentas/usuarios/");
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {
      setError(error.message || "Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  // Navegar a crear
  const handleAdd = () => {
    navigate("/dashboard/usuarios/nuevo");
  };

  // Navegar a editar
  const handleEdit = (usuario) => {
    navigate(`/dashboard/usuarios/${usuario.id}/editar`);
  };

  // Abrir modal de confirmación para eliminar
  const handleDelete = (usuario) => {
    setDeleteModal({
      isOpen: true,
      usuario: usuario,
    });
  };

  // Confirmar eliminación
  const confirmDelete = async () => {
    if (!deleteModal.usuario) return;

    try {
      setDeleting(true);
      await api.delete(`/cuentas/usuarios/${deleteModal.usuario.id}/`);
      showNotification("Usuario eliminado correctamente");
      await loadUsuarios();
      setDeleteModal({ isOpen: false, usuario: null });
    } catch (error) {
      setError(error.message || "Error al eliminar usuario");
    } finally {
      setDeleting(false);
    }
  };

  // Cancelar eliminación
  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, usuario: null });
  };

  // Detecta si está en una ruta hija (crear/editar)
  const isFormRoute =
    location.pathname.includes("/dashboard/usuarios/nuevo") ||
    location.pathname.match(/\/dashboard\/usuarios\/\d+\/editar/);

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
          <div
            className={`fixed top-4 right-4 z-30 p-4 rounded-xl shadow-lg flex items-center gap-2 ${
              notification.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
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
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Usuarios
          </h1>
          <p className="text-gray-600 mt-2">
            Administra los usuarios del sistema
          </p>
        </div>

        {/* Tabla Universal */}
        <UniversalTable
          title="Lista de Usuarios"
          data={usuarios}
          columns={columns}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          searchPlaceholder="Buscar usuarios..."
          addButtonText="Nuevo Usuario"
          showAddButton={true}
          emptyMessage="No hay usuarios registrados"
        />

        {/* Modal de confirmación para eliminar */}
        <ConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title="Eliminar Usuario"
          message={`¿Estás seguro de que deseas eliminar al usuario "${deleteModal.usuario?.nombre}"? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          type="danger"
          loading={deleting}
        />
      </div>
    </div>
  );
};

export default GestionarUsuarios;