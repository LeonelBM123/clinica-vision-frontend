import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import CitaForm from "../../components/Form/CitaForm.jsx";
import { api } from "../../services/apiClient.js";

export default function CrearCitaMedica() {
  const [loading, setLoading] = useState(false);
  const [pacientesOptions, setPacientesOptions] = useState([]);
  const [bloquesHorariosOptions, setBloquesHorariosOptions] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const cargarOpciones = async () => {
      try {
        const [pacientesData, bloquesData] = await Promise.all([
          api.get("/diagnosticos/pacientes/"),
          api.get("/doctores/bloques-horario/"),
        ]);

        setPacientesOptions(Array.isArray(pacientesData) ? pacientesData : []);
        setBloquesHorariosOptions(
          Array.isArray(bloquesData) ? bloquesData : []
        );
      } catch (e) {
        console.error("Error cargando opciones:", e);
        setError("Error al cargar los datos necesarios");
      }
    };

    cargarOpciones();
  }, []);

  function handleSubmit(data) {
    setLoading(true);
    setError("");
    api
      .post("/citas/citas-medicas/", data)
      .then(() => {
        // Recarga automática y navegación
        navigate("/dashboard/gestionar-citas");
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
              <h1 className="text-3xl font-bold text-gray-900">
                Nueva Cita Médica
              </h1>
              <p className="text-gray-600 mt-1">
                Agenda una nueva cita médica en el sistema
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
                Error al crear cita médica
              </h3>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-white border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Información de la Cita
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Complete los datos requeridos para la cita médica
            </p>
          </div>

          <div className="p-6">
            <CitaForm
              initialCita={null}
              pacientesOptions={pacientesOptions}
              bloquesHorariosOptions={bloquesHorariosOptions}
              onSubmit={handleSubmit}
              onCancel={() => navigate("/dashboard/gestionar-citas")}
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
