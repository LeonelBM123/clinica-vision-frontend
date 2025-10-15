import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/apiClient";

export default function PacienteCitas() {
  const { pacienteId } = useParams();
  const [citas, setCitas] = useState([]);
  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCitas() {
      try {
        const data = await api.get(`/citas/pacientes/${pacienteId}/citas/`);
        setCitas(data);
        if (data.length > 0) setPaciente(data[0].paciente || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCitas();
  }, [pacienteId]);

  if (loading)
    return (
      <div className="flex items-center justify-center py-10 text-blue-600">
        <div className="animate-spin h-6 w-6 border-t-2 border-blue-600 rounded-full mr-2"></div>
        Cargando citas...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 py-10">
        Error al cargar citas: {error}
      </div>
    );

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:underline mb-4 flex items-center gap-1"
      >
        ← Volver a lista de pacientes
      </button>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Historial de Citas {paciente ? `– ${paciente.nombre}` : ""}
      </h1>

      <div className="bg-white shadow rounded-xl overflow-hidden border border-gray-200">
        <table className="min-w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Fecha</th>
              <th className="py-3 px-4 text-left">Hora</th>
              <th className="py-3 px-4 text-left">Médico</th>
              <th className="py-3 px-4 text-left">Motivo</th>
            </tr>
          </thead>
          <tbody>
            {citas.length > 0 ? (
              citas.map((cita) => (
                <tr key={cita.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{cita.fecha || "—"}</td>
                  <td className="py-3 px-4">{cita.hora || "—"}</td>
                  <td className="py-3 px-4">{cita.medico?.nombre || "—"}</td>
                  <td className="py-3 px-4">{cita.motivo || "Sin descripción"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-6 text-gray-500 italic"
                >
                  Este paciente no tiene citas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
