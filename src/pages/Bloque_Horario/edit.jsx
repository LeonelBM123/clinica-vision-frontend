import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, AlertCircle, Loader } from "lucide-react";
import BloqueHorarioForm from "../../components/Form/BloqueHorarioForm";
import { api } from "../../services/apiClient";

export default function EditarBloqueHorario() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialBloque, setInitialBloque] = useState(null);
  const [medicos, setMedicos] = useState([]);
  const [tiposAtencion, setTiposAtencion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    // Cargar datos en paralelo
    Promise.all([
      api.get(`/doctores/bloques-horarios/${id}/`),
      api.get("/doctores/medicos/"),
      api.get("/doctores/tipos-atencion/"),
    ])
      .then(([bloqueData, medicosData, tiposData]) => {
        setInitialBloque(bloqueData);

        // Filtrar médicos activos
        const medicosActivos = Array.isArray(medicosData)
          ? medicosData.filter((medico) => medico.estado)
          : [];
        setMedicos(medicosActivos);

        setTiposAtencion(Array.isArray(tiposData) ? tiposData : []);
      })
      .catch((e) => {
        console.error("Error cargando datos:", e);
        setError(e.message || "Error al cargar los datos del bloque horario");
      })
      .finally(() => setLoading(false));
  }, [id]);

  function handleSubmit(data) {
    setSaving(true);
    setError("");

    api
      .patch(`/doctores/bloques-horarios/${id}/`, data)
      .then(() => {
        // Navegar a la lista principal
        navigate("/dashboard/bloques-horarios");
      })
      .catch((e) => {
        console.error("Error actualizando bloque:", e);
        setError(e.message || "Error al actualizar el bloque horario");
      })
      .finally(() => setSaving(false));
  }

  function handleCancel() {
    navigate("/dashboard/bloque-horario");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Cargando bloque horario...
              </h3>
              <p className="text-gray-600">Por favor espere un momento</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si no se pudo cargar el bloque
  if (!initialBloque && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              >
                <ArrowLeft size={20} />
                <span className="hidden sm:inline">Volver</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Bloque No Encontrado
                </h1>
              </div>
            </div>
          </div>

          {/* Error */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center">
            <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Bloque horario no encontrado
            </h2>
            <p className="text-gray-600 mb-4">
              El bloque horario que intentas editar no existe o no tienes
              permisos para acceder a él.
            </p>
            <button
              onClick={handleCancel}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Volver a la lista
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header con botón de volver */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors font-medium"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Volver</span>
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Editar Bloque Horario
              </h1>
              <p className="text-gray-600 mt-1">
                Modificando bloque de{" "}
                <span className="font-medium">
                  {initialBloque?.medico_nombre || "Médico"}
                </span>{" "}
                - {initialBloque?.dia_semana} {initialBloque?.hora_inicio}-
                {initialBloque?.hora_fin}
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <div>
              <h3 className="text-red-800 font-semibold">
                Error al editar bloque horario
              </h3>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-amber-50 to-white border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Modificar Información del Bloque
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Actualice los datos del bloque horario - Solo se permiten
              modificaciones en bloques modificables
            </p>
          </div>

          <div className="p-6">
            <BloqueHorarioForm
              initialBloque={initialBloque}
              medicosOptions={medicos}
              tiposAtencionOptions={tiposAtencion}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={saving}
              isEditMode={true}
              puedeModificar={initialBloque?.puede_modificar || false}
            />
          </div>
        </div>

        {/* Footer informativo */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            {initialBloque?.puede_modificar
              ? "Puedes modificar este bloque horario"
              : "Este bloque horario no se puede modificar debido a reglas del sistema"}
          </p>
        </div>
      </div>
    </div>
  );
}
