import React, { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Calendar } from "lucide-react";
import UniversalTable from "../../components/UniversalTable";
import ConfirmModal from "../../components/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/apiClient";
import { Outlet, useLocation } from "react-router-dom";

const BloqueHorario = () => {
  const [bloques, setBloques] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [tiposAtencion, setTiposAtencion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    bloque: null,
  });
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Definir columnas de la tabla
  const columns = [
    {
      header: "Médico",
      accessor: "medico_nombre",
      render: (item) => (
        <span className="font-medium text-gray-900">{item.medico_nombre}</span>
      ),
    },
    {
      header: "Día",
      accessor: "dia_semana",
      render: (item) => (
        <span className="text-gray-700 capitalize">
          {item.dia_semana.toLowerCase()}
        </span>
      ),
    },
    {
      header: "Horario",
      accessor: "horario",
      render: (item) => (
        <span className="font-mono text-gray-900">
          {item.hora_inicio} - {item.hora_fin}
        </span>
      ),
    },
    {
      header: "Duración Cita",
      accessor: "duracion_cita_minutos",
      render: (item) => (
        <span className="text-gray-700">{item.duracion_cita_minutos} min</span>
      ),
    },
    {
      header: "Máx. Citas",
      accessor: "max_citas_por_bloque",
      render: (item) => (
        <span className="text-gray-700">{item.max_citas_por_bloque}</span>
      ),
    },
    {
      header: "Tipo Atención",
      accessor: "tipo_atencion_nombre",
      render: (item) => (
        <span className="text-gray-700">
          {item.tipo_atencion_nombre || "No especificado"}
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
      header: "Modificable",
      accessor: "puede_modificar",
      render: (item) => (
        <span
          className={`px-2 py-1 text-xs font-bold rounded-full ${
            item.puede_modificar
              ? "bg-blue-100 text-blue-800"
              : "bg-orange-100 text-orange-800"
          }`}
        >
          {item.puede_modificar ? "Sí" : "No"}
        </span>
      ),
    },
  ];

  // Notificación
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Cargar bloques horarios (ya filtrados por grupo del backend)
  const loadBloquesHorarios = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await api.get("/doctores/bloques-horario/");

      // Si viene paginado, tomamos data.results, sino data directamente
      const bloquesData = Array.isArray(data) ? data : data.results || [];
      setBloques(bloquesData);
    } catch (error) {
      setError(error.message || "Error al cargar bloques horarios");
    } finally {
      setLoading(false);
    }
  };


  // Cargar médicos del mismo grupo para filtros
  const loadMedicosDelGrupo = async () => {
    try {
      const data = await api.get("/doctores/medicos/");
      // El backend ya filtra por grupo, pero aseguramos que sean médicos activos
      const medicosActivos = Array.isArray(data)
        ? data.filter((medico) => medico.estado)
        : [];
      setMedicos(medicosActivos);
    } catch (error) {
      console.error("Error cargando médicos del grupo:", error);
    }
  };

  // Cargar tipos de atención del mismo grupo
  const loadTiposAtencionDelGrupo = async () => {
    try {
      const data = await api.get("/doctores/tipos-atencion/");
      setTiposAtencion(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando tipos atención del grupo:", error);
    }
  };

  useEffect(() => {
    loadBloquesHorarios();
    loadMedicosDelGrupo();
    loadTiposAtencionDelGrupo();
  }, []);

  // Navegar a crear
  const handleAdd = () => {
    navigate("/dashboard/bloque-horario/nuevo");
  };

  // Navegar a editar
  const handleEdit = (bloque) => {
    if (!bloque.puede_modificar) {
      showNotification(
        `No se puede modificar este bloque. ${
          bloque.motivo_no_modificable || "Reglas del sistema"
        }`,
        "error"
      );
      return;
    }
    navigate(`/dashboard/bloque-horario/${bloque.id}/editar`);
  };

  // Abrir modal de confirmación para eliminar
  const handleDelete = (bloque) => {
    if (!bloque.puede_modificar) {
      showNotification(
        `No se puede eliminar este bloque. ${
          bloque.motivo_no_modificable || "Reglas del sistema"
        }`,
        "error"
      );
      return;
    }
    setDeleteModal({
      isOpen: true,
      bloque: bloque,
    });
  };

  // Confirmar eliminación
  const confirmDelete = async () => {
    if (!deleteModal.bloque) return;

    try {
      setDeleting(true);
      await api.delete(`/doctores/bloques-horarios/${deleteModal.bloque.id}/`);
      showNotification("Bloque horario eliminado correctamente");
      await loadBloquesHorarios();
      setDeleteModal({ isOpen: false, bloque: null });
    } catch (error) {
      setError(error.message || "Error al eliminar bloque horario");
    } finally {
      setDeleting(false);
    }
  };

  // Cancelar eliminación
  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, bloque: null });
  };

  // Detecta si está en una ruta hija (crear/editar)
  const isFormRoute =
    location.pathname.includes("/dashboard/bloque-horario/nuevo") ||
    location.pathname.match(/\/dashboard\/bloque-horario\/\d+\/editar/);

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
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="text-blue-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-900">
              Gestión de Bloques Horarios
            </h1>
          </div>
          <p className="text-gray-600">
            Administra los horarios de atención de los médicos de tu grupo
          </p>
        </div>

        {/* Tabla Universal */}
        <UniversalTable
          title="Bloques Horarios Registrados"
          data={bloques}
          columns={columns}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          searchPlaceholder="Buscar bloques horarios..."
          addButtonText="Nuevo Bloque"
          showAddButton={true}
          emptyMessage="No hay bloques horarios registrados"
        />

        {/* Modal de confirmación para eliminar */}
        <ConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title="Eliminar Bloque Horario"
          message={`¿Estás seguro de que deseas eliminar el bloque horario de ${deleteModal.bloque?.medico_nombre} (${deleteModal.bloque?.dia_semana} ${deleteModal.bloque?.hora_inicio}-${deleteModal.bloque?.hora_fin})?`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          type="danger"
          loading={deleting}
        />
      </div>
    </div>
  );
};

export default BloqueHorario;
