import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, AlertCircle, Loader } from "lucide-react";
import BloqueHorarioForm from "../../components/Form/BloqueHorarioForm";
import { api } from "../../services/apiClient.js";

export default function EditarBloqueHorario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get(`/doctores/bloques-horarios/${id}/`)
      .then((data) => setInitialData(data))
      .catch((e) => setError(e.message || "Error al cargar el bloque."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = (data) => {
    setSaving(true);
    setError("");
    api
      .patch(`/doctores/bloques-horarios/${id}/`, data)
      .then(() => {
        navigate("/dashboard/bloques-horarios");
        window.location.reload();
      })
      .catch((e) =>
        setError(
          e.message || "Error al actualizar. Verifique las reglas de edición."
        )
      )
      .finally(() => setSaving(false));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

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
                Editar Bloque Horario #{id}
              </h1>
            </div>
          </div>
        </div>
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="text-red-600" size={20} />
            <div>
              <h3 className="text-red-800 font-semibold">Error</h3>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-lg border">
          <div className="p-6">
            {initialData && (
              <BloqueHorarioForm
                initialBloque={initialData}
                onSubmit={handleSubmit}
                onCancel={() => navigate("/dashboard/bloques-horarios")}
                loading={saving}
                isEditMode={true}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
