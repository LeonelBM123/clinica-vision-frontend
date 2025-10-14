import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import PacienteForm from "../../components/Form/PacienteForm";
import { api } from "../../services/apiClient";

export default function CrearPaciente() {
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [patologias, setPatologias] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar usuarios (rol paciente) y patologías
    api.get(`/cuentas/usuarios/?rol=paciente`).then((data) => setUsuarios(Array.isArray(data) ? data : [])).catch(() => {});
    api.get(`/diagnosticos/patologias/`).then((data) => setPatologias(Array.isArray(data) ? data : [])).catch(() => {});
  }, []);

  function handleSubmit(data) {
    setLoading(true);
    setError("");
    api.post(`/diagnosticos/pacientes/`, data)
      .then(() => {
        navigate(`/dashboard/pacientes`);
        window.location.reload();
      })
      .catch((e) => setError(e.message || "Error creando paciente"))
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
              <h1 className="text-3xl font-bold text-gray-900">Nuevo Paciente</h1>
              <p className="text-gray-600 mt-1">
                Registra un nuevo paciente en el sistema
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
                Error al crear Paciente
              </h3>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-white border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Información del Paciente
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Complete los datos requeridos
            </p>
          </div>

          <div className="p-6">
            <PacienteForm
              initialPaciente={null}
              usuariosOptions={usuarios}
              patologiasOptions={patologias}
              onSubmit={handleSubmit}
              onCancel={() => navigate("/dashboard/pacientes")}
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