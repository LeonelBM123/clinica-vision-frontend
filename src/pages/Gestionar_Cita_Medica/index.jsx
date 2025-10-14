import React, { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Calendar, Clock, User } from "lucide-react";
import UniversalTable from "../../components/UniversalTable";
import ConfirmModal from "../../components/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/apiClient";
import { Outlet, useLocation } from "react-router-dom";

const GestionarCitas = () => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    cita: null,
  });
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Definir columnas de la tabla para Citas Médicas
  const columns = [
    {
      header: "Paciente",
      accessor: "paciente_nombre",
      render: (item) => (
        <div className="flex items-center gap-2">
          <User size={16} className="text-gray-400" />
          <span className="font-medium text-gray-900">
            {item.paciente_nombre || "Sin nombre"}
          </span>
        </div>
      ),
    },
    {
      header: "Fecha y Hora",
      accessor: "fecha",
      render: (item) => (
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-400" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              {item.fecha}
            </span>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock size={12} />
              {item.hora_inicio} - {item.hora_fin}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Tipo de Atención",
      accessor: "tipo_atencion_nombre",
      render: (item) => (
        <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded-full">
          {item.tipo_atencion_nombre || "Consulta"}
        </span>
      ),
    },
    {
      header: "Día",
      accessor: "dia_semana",
      render: (item) => (
        <span className="text-gray-700 capitalize">
          {item.dia_semana?.toLowerCase()}
        </span>
      ),
    },
    {
      header: "Estado Cita",
      accessor: "estado_cita",
      render: (item) => {
        const estadoConfig = {
          PENDIENTE: {
            color: "bg-yellow-100 text-yellow-800",
            text: "Pendiente",
          },
          CONFIRMADA: {
            color: "bg-blue-100 text-blue-800",
            text: "Confirmada",
          },
          EN_PROCESO: {
            color: "bg-purple-100 text-purple-800",
            text: "En Proceso",
          },
          COMPLETADA: {
            color: "bg-green-100 text-green-800",
            text: "Completada",
          },
          CANCELADA: { color: "bg-red-100 text-red-800", text: "Cancelada" },
          NO_ASISTIO: {
            color: "bg-orange-100 text-orange-800",
            text: "No Asistió",
          },
        };

        const config = estadoConfig[item.estado_cita] || estadoConfig.PENDIENTE;

        return (
          <span
            className={`px-2 py-1 text-xs font-bold rounded-full ${config.color}`}
          >
            {config.text}
          </span>
        );
      },
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
  ];

  // Notificación
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Cargar citas
  const loadCitas = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await api.get("/citas/citas-medicas/");
      setCitas(Array.isArray(data) ? data : []);
    } catch (error) {
      setError(error.message || "Error al cargar citas médicas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCitas();
  }, []);

  // Navegar a crear
  const handleAdd = () => {
    navigate("/dashboard/gestionar-citas/nueva");
  };

  // Navegar a editar
  const handleEdit = (cita) => {
    navigate(`/dashboard/gestionar-citas/${cita.id}/editar`); 
  };

  // Abrir modal de confirmación para eliminar/cancelar
  const handleDelete = (cita) => {
    setDeleteModal({
      isOpen: true,
      cita: cita,
    });
  };

  // Confirmar eliminación/cancelación
  const confirmDelete = async () => {
    if (!deleteModal.cita) return;

    try {
      setDeleting(true);
      await api.delete(`/citas/citas-medicas/${deleteModal.cita.id}/`);
      showNotification("Cita cancelada correctamente");
      await loadCitas();
      setDeleteModal({ isOpen: false, cita: null });
    } catch (error) {
      setError(error.message || "Error al cancelar cita");
    } finally {
      setDeleting(false);
    }
  };

  // Cambiar estado de la cita
  const handleCambiarEstado = async (cita, nuevoEstado) => {
    try {
      await api.post(`/citas/citas-medicas/${cita.id}/cambiar_estado/`, {
        estado_cita: nuevoEstado,
      });
      showNotification(`Cita ${nuevoEstado.toLowerCase()} correctamente`);
      await loadCitas();
    } catch (error) {
      setError(error.message || "Error al cambiar estado de la cita");
    }
  };

  // Cancelar eliminación
  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, cita: null });
  };

  // Detecta si está en una ruta hija (crear/editar)
  const isFormRoute =
    location.pathname.includes("/dashboard/gestionar-citas/nueva") || 
    location.pathname.match(/\/dashboard\/gestionar-citas\/\d+\/editar/);

  // Si está en una ruta hija, muestra el Outlet (formulario)
  if (isFormRoute) {
    return <Outlet />;
  }

  // Acciones adicionales para las citas
  const additionalActions = (cita) => [
    {
      label: "Confirmar",
      onClick: () => handleCambiarEstado(cita, "CONFIRMADA"),
      condition: cita.estado_cita === "PENDIENTE",
      color: "blue",
    },
    {
      label: "En Proceso",
      onClick: () => handleCambiarEstado(cita, "EN_PROCESO"),
      condition: cita.estado_cita === "CONFIRMADA",
      color: "purple",
    },
    {
      label: "Completar",
      onClick: () => handleCambiarEstado(cita, "COMPLETADA"),
      condition: cita.estado_cita === "EN_PROCESO",
      color: "green",
    },
    {
      label: "No Asistió",
      onClick: () => handleCambiarEstado(cita, "NO_ASISTIO"),
      condition: ["PENDIENTE", "CONFIRMADA"].includes(cita.estado_cita),
      color: "orange",
    },
  ];

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
            Gestión de Citas Médicas
          </h1>
          <p className="text-gray-600 mt-2">
            Administra las citas médicas del sistema
          </p>
        </div>

        {/* Tabla Universal */}
        <UniversalTable
          title="Lista de Citas Médicas"
          data={citas}
          columns={columns}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          searchPlaceholder="Buscar citas..."
          addButtonText="Nueva Cita"
          showAddButton={true}
          emptyMessage="No hay citas médicas registradas"
          additionalActions={additionalActions}
        />

        {/* Modal de confirmación para cancelar cita */}
        <ConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title="Cancelar Cita"
          message={`¿Estás seguro de que deseas cancelar la cita del paciente "${deleteModal.cita?.paciente_nombre}"? Esta acción cambiará el estado a "Cancelada".`}
          confirmText="Cancelar Cita"
          cancelText="Mantener Cita"
          type="danger"
          loading={deleting}
        />
      </div>
    </div>
  );
};

export default GestionarCitas;
