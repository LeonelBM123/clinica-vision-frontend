import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, Users } from "lucide-react";
import BloqueHorarioForm from "../../components/Form/BloqueHorarioForm.jsx";
import { api } from "../../services/apiClient.js";

export default function CrearBloqueHorario() {
  const [loading, setLoading] = useState(false);
  const [medicos, setMedicos] = useState([]);
  const [tiposAtencion, setTiposAtencion] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar médicos y tipos de atención del mismo grupo
    Promise.all([
      api.get("/doctores/medicos/"),
      api.get("/doctores/tipos-atencion/"),
    ])
      .then(([medicosData, tiposData]) => {
        const medicosActivos = Array.isArray(medicosData)
          ? medicosData.filter((medico) => medico.estado)
          : [];
        setMedicos(medicosActivos);
        setTiposAtencion(Array.isArray(tiposData) ? tiposData : []);
      })
      .catch((e) => console.error("Error cargando datos del grupo:", e));
  }, []);

  function handleSubmit(data) {
    setLoading(true);
    setError("");
    api
      .post("/doctores/bloques-horarios/", data)
      .then(() => {
        // Recarga automática y navegación
        navigate("/dashboard/bloques-horarios");
        window.location.reload();
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  // Si no hay médicos en el grupo, mostrar mensaje
  if (medicos.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header con botón de volver */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              >
                <ArrowLeft size={20} />
                <span className="hidden sm:inline">Volver</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Nuevo Bloque Horario
                </h1>
                <p className="text-gray-600 mt-1">
                  Registra un nuevo horario de atención para médicos
                </p>
              </div>
            </div>
          </div>

          {/* Mensaje de no médicos disponibles */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-8 text-center">
              <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                No hay médicos disponibles
              </h2>
              <p className="text-gray-600 mb-4">
                No existen médicos activos en tu grupo para asignar horarios.
              </p>
              <p className="text-gray-500 text-sm">
                Contacta al administrador o crea médicos primero en la sección
                de gestión de médicos.
              </p>
            </div>
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
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors font-medium"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Volver</span>
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Nuevo Bloque Horario
              </h1>
              <p className="text-gray-600 mt-1">
                Registra un nuevo horario de atención para médicos de tu grupo
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
                Error al crear bloque horario
              </h3>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-white border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Información del Bloque Horario
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Complete los datos requeridos - Solo médicos de tu grupo
            </p>
          </div>

          <div className="p-6">
            <BloqueHorarioForm
              initialBloque={null}
              medicosOptions={medicos}
              tiposAtencionOptions={tiposAtencion}
              onSubmit={handleSubmit}
              onCancel={() => navigate("/dashboard/bloque-horario")}
              loading={loading}
            />
          </div>
        </div>

        {/* Footer informativo */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Los campos marcados con * son obligatorios</p>
        </div>
      </div>
    </div>
  );
}
