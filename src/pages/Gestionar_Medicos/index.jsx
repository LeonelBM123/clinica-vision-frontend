import React, { useState, useEffect } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import UniversalTable from "../../components/UniversalTable";
import ConfirmModal from "../../components/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/apiClient";
import { Outlet, useLocation } from "react-router-dom";

const GestionarMedicos = () => {
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    medico: null,
  });
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Definir columnas de la tabla - Sin Grupo, con Teléfono
  const columns = [
    { header: "Nombre", accessor: "nombre" },
    { header: "Correo", accessor: "correo" },
    { header: "N° Colegiado", accessor: "numero_colegiado" },
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
      header: "Especialidades",
      accessor: "especialidades_nombres",
      render: (item) => (
        <div className="flex flex-wrap gap-1">
          {item.especialidades_nombres &&
          item.especialidades_nombres.length > 0 ? (
            item.especialidades_nombres.slice(0, 2).map((esp, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded-full"
              >
                {esp}
              </span>
            ))
          ) : (
            <span className="text-gray-500 text-sm">Sin especialidades</span>
          )}
          {item.especialidades_nombres &&
            item.especialidades_nombres.length > 2 && (
              <span className="bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded-full">
                +{item.especialidades_nombres.length - 2}
              </span>
            )}
        </div>
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
  ];

  // Notificación
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Cargar médicos
  const loadMedicos = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await api.get("/doctores/medicos/");
      setMedicos(Array.isArray(data) ? data : []);
    } catch (error) {
      setError(error.message || "Error al cargar médicos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedicos();
  }, []);

  // Navegar a crear
  const handleAdd = () => {
    navigate("/dashboard/medicos/nuevo");
  };

  // Navegar a editar
  const handleEdit = (medico) => {
    navigate(`/dashboard/medicos/${medico.id}/editar`);
  };

  // Abrir modal de confirmación para eliminar
  const handleDelete = (medico) => {
    setDeleteModal({
      isOpen: true,
      medico: medico,
    });
  };

  // Confirmar eliminación
  const confirmDelete = async () => {
    if (!deleteModal.medico) return;

    try {
      setDeleting(true);
      await api.delete(`/doctores/medicos/${deleteModal.medico.id}/`);
      showNotification("Médico eliminado correctamente");
      await loadMedicos();
      setDeleteModal({ isOpen: false, medico: null });
    } catch (error) {
      setError(error.message || "Error al eliminar médico");
    } finally {
      setDeleting(false);
    }
  };

  // Cancelar eliminación
  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, medico: null });
  };

  // Detecta si está en una ruta hija (crear/editar)
  const isFormRoute =
    location.pathname.includes("/dashboard/medicos/nuevo") ||
    location.pathname.match(/\/dashboard\/medicos\/\d+\/editar/);

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
            Gestión de Médicos
          </h1>
          <p className="text-gray-600 mt-2">
            Administra los médicos del sistema
          </p>
        </div>

        {/* Tabla Universal */}
        <UniversalTable
          title="Lista de Médicos"
          data={medicos}
          columns={columns}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          searchPlaceholder="Buscar médicos..."
          addButtonText="Nuevo Médico"
          showAddButton={true}
          emptyMessage="No hay médicos registrados"
        />

        {/* Modal de confirmación para eliminar */}
        <ConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title="Eliminar Médico"
          message={`¿Estás seguro de que deseas eliminar al médico "${deleteModal.medico?.nombre}"? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          type="danger"
          loading={deleting}
        />
      </div>
    </div>
  );
};

export default GestionarMedicos;
