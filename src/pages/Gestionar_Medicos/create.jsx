import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import MedicoForm from "../../components/Form/MedicoForm.jsx";
import { api } from "../../services/apiClient.js";

export default function CrearMedico() {
  const [loading, setLoading] = useState(false);
  const [especialidades, setEspecialidades] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar especialidades al montar el componente
    api
      .get("/doctores/especialidades/") // Ajusta la URL según tu API
      .then((data) => setEspecialidades(Array.isArray(data) ? data : []))
      .catch((e) => console.error("Error cargando especialidades:", e));
  }, []);

  function handleSubmit(data) {
    setLoading(true);
    setError("");
    api
      .post("/doctores/medicos/", data)
      .then(() => {
        // Recarga automática y navegación
        navigate("/dashboard/medicos");
        window.location.reload();
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
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
              <h1 className="text-3xl font-bold text-gray-900">Nuevo Médico</h1>
              <p className="text-gray-600 mt-1">
                Registra un nuevo médico en el sistema
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
                Error al crear médico
              </h3>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-white border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Información del Médico
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Complete los datos requeridos
            </p>
          </div>

          <div className="p-6">
            <MedicoForm
              initialMedico={null}
              especialidadesOptions={especialidades}
              onSubmit={handleSubmit}
              onCancel={() => navigate("/dashboard/medicos")}
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
