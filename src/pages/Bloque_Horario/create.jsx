import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";
import BloqueHorarioForm from "../../components/Form/BloqueHorarioForm";
import { api } from "../../services/apiClient.js";

export default function CrearBloqueHorario() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (data) => {
    setSaving(true);
    setError("");
    api
      .post("/doctores/bloques-horarios/", data)
      .then(() => {
        navigate("/dashboard/bloques-horarios");
        window.location.reload();
      })
      .catch((e) =>
        setError(
          e.message ||
            "Error al crear el bloque. Verifique que no haya solapamiento de horarios."
        )
      )
      .finally(() => setSaving(false));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg"
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
                Define un nuevo espacio en tu agenda semanal.
              </p>
            </div>
          </div>
        </div>
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="text-red-600" size={20} />
            <div>
              <h3 className="text-red-800 font-semibold">Error al Crear</h3>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-lg border">
          <div className="p-6">
            <BloqueHorarioForm
              onSubmit={handleSubmit}
              onCancel={() => navigate("/dashboard/bloques-horarios")}
              loading={saving}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
