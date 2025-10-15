import React, { useState, useEffect } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import UniversalTable from "../../components/UniversalTable";
import ConfirmModal from "../../components/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/apiClient";
import { Outlet, useLocation } from "react-router-dom";

const GestionarPacientes = () =>  {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    paciente: null,
  });
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Definir columnas de la tabla para pacientes
  const columns = [
    { header: "Nombre", accessor: "nombre" },
    { header: "Correo", accessor: "correo" },
    { header: "Historia Clínica", accessor: "numero_historia_clinica" },
    {
      header: "Fecha Nacimiento",
      accessor: "fecha_nacimiento",
      render: (item) => (
        <span className="text-gray-700">
          {item.fecha_nacimiento ? new Date(item.fecha_nacimiento).toLocaleDateString() : "No especificado"}
        </span>
      ),
    },
    {
      header: "Agudeza Visual",
      accessor: "agudeza_visual",
      render: (item) => (
        <div className="text-sm">
          <div>OD: {item.agudeza_visual_derecho || "N/A"}</div>
          <div>OI: {item.agudeza_visual_izquierdo || "N/A"}</div>
        </div>
      ),
    },
    {
      header: "Presión Ocular",
      accessor: "presion_ocular",
      render: (item) => (
        <div className="text-sm">
          <div>OD: {item.presion_ocular_derecho || "N/A"}</div>
          <div>OI: {item.presion_ocular_izquierdo || "N/A"}</div>
        </div>
      ),
    },
  ];

  // Notificación
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Cargar pacientes
  const loadPacientes = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await api.get("/diagnosticos/pacientes/");
      setPacientes(Array.isArray(data) ? data : []);
    } catch (error) {
      setError(error.message || "Error al cargar pacientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPacientes();
  }, []);

  // Navegar a crear
  const handleAdd = () => {
    navigate("/dashboard/pacientes/nuevo");
  };

  // Navegar a editar
  const handleEdit = (paciente) => {
    navigate(`/dashboard/pacientes/${paciente.id}/editar`);
  };

  // Abrir modal de confirmación para eliminar
  const handleDelete = (paciente) => {
    setDeleteModal({
      isOpen: true,
      paciente: paciente,
    });
  };

  // Confirmar eliminación
  const confirmDelete = async () => {
    if (!deleteModal.paciente) return;

    try {
      setDeleting(true);
      await api.delete(`/diagnosticos/pacientes/${deleteModal.paciente.id}/`);
      showNotification("Paciente eliminado correctamente");
      await loadPacientes();
      setDeleteModal({ isOpen: false, paciente: null });
    } catch (error) {
      setError(error.message || "Error al eliminar paciente");
    } finally {
      setDeleting(false);
    }
  };

  // Cancelar eliminación
  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, paciente: null });
  };

  // Detecta si está en una ruta hija (crear/editar)
  const isFormRoute =
    location.pathname.includes("/dashboard/pacientes/nuevo") ||
    location.pathname.match(/\/dashboard\/pacientes\/\d+\/editar/);

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
            Gestión de Pacientes
          </h1>
          <p className="text-gray-600 mt-2">
            Administra los pacientes del sistema
          </p>
        </div>

        {/* Tabla Universal */}
        <UniversalTable
          title="Lista de Pacientes"
          data={pacientes}
          columns={columns}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          searchPlaceholder="Buscar pacientes..."
          addButtonText="Nuevo Paciente"
          showAddButton={true}
          emptyMessage="No hay pacientes registrados"
        />

        {/* Modal de confirmación para eliminar */}
        <ConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title="Eliminar Paciente"
          message={`¿Estás seguro de que deseas eliminar al paciente "${deleteModal.paciente?.nombre}"? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          type="danger"
          loading={deleting}
        />
      </div>
    </div>
  );
};

export default GestionarPacientes;
