import React, { useEffect, useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import UniversalTable from "../../components/UniversalTable";
import ConfirmModal from "../../components/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/apiClient";
import { Outlet, useLocation } from "react-router-dom";

export default function GestionarTratamientos() {
  const [tratamientos, setTratamientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    tratamiento: null,
  });
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Columnas de la tabla
  const columns = [
    { header: "Nombre", accessor: "nombre" },
    { header: "Duración (días)", accessor: "duracion_dias" },
    { header: "Descripción", accessor: "descripcion" },
    {
      header: "Patologías",
      accessor: "patologias_nombres",
      render: (item) => (
        <div className="flex flex-wrap gap-1">
          {item.patologias_nombres && item.patologias_nombres.length > 0 ? (
            item.patologias_nombres.slice(0, 2).map((nombre, idx) => (
              <span
                key={idx}
                className="bg-amber-100 text-amber-800 px-2 py-1 text-xs rounded-full"
              >
                {nombre}
              </span>
            ))
          ) : (
            <span className="text-gray-500 text-sm">Sin patologías</span>
          )}
          {item.patologias_nombres && item.patologias_nombres.length > 2 && (
            <span className="bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded-full">
              +{item.patologias_nombres.length - 2}
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Grupo",
      accessor: "grupo_nombre",
    },
    {
      header: "Fecha Creación",
      accessor: "fecha_creacion",
      render: (item) =>
        item.fecha_creacion
          ? new Date(item.fecha_creacion).toLocaleDateString("es-ES")
          : "—",
    },
  ];

  // Notificación
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Cargar tratamientos
  const loadTratamientos = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await api.get("/diagnosticos/tratamientos/");
      setTratamientos(Array.isArray(data) ? data : []);
    } catch (error) {
      setError(error.message || "Error al cargar tratamientos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTratamientos();
  }, []);

  // Navegar a crear
  const handleAdd = () => {
    navigate("/dashboard/tratamientos/nuevo");
  };

  // Navegar a editar
  const handleEdit = (tratamiento) => {
    navigate(`/dashboard/tratamientos/${tratamiento.id}/editar`);
  };

  // Abrir modal de confirmación para eliminar
  const handleDelete = (tratamiento) => {
    setDeleteModal({
      isOpen: true,
      tratamiento: tratamiento,
    });
  };

  // Confirmar eliminación
  const confirmDelete = async () => {
    if (!deleteModal.tratamiento) return;
    try {
      setDeleting(true);
      await api.delete(
        `/diagnosticos/tratamientos/${deleteModal.tratamiento.id}/`
      );
      showNotification("Tratamiento eliminado correctamente");
      await loadTratamientos();
      setDeleteModal({ isOpen: false, tratamiento: null });
    } catch (error) {
      setError(error.message || "Error al eliminar tratamiento");
    } finally {
      setDeleting(false);
    }
  };

  // Cancelar eliminación
  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, tratamiento: null });
  };

  // Detecta si está en una ruta hija (crear/editar)
  const isFormRoute =
    location.pathname.includes("/dashboard/tratamientos/nuevo") ||
    location.pathname.match(/\/dashboard\/tratamientos\/\d+\/editar/);

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
            Gestión de Tratamientos
          </h1>
          <p className="text-gray-600 mt-2">
            Administra los tratamientos del sistema
          </p>
        </div>

        {/* Tabla Universal */}
        <UniversalTable
          title="Lista de Tratamientos"
          data={tratamientos}
          columns={columns}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          searchPlaceholder="Buscar tratamientos..."
          addButtonText="Nuevo Tratamiento"
          showAddButton={true}
          emptyMessage="No hay tratamientos registrados"
        />

        {/* Modal de confirmación para eliminar */}
        <ConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title="Eliminar Tratamiento"
          message={`¿Estás seguro de que deseas eliminar el tratamiento "${deleteModal.tratamiento?.nombre}"? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          type="danger"
          loading={deleting}
        />
      </div>
    </div>
  );
}
