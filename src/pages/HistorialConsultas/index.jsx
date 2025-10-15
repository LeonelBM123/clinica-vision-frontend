import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/apiClient";

export default function HistorialConsultas() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPacientes() {
      try {
        const data = await api.get("/citas/pacientes/");
        setPacientes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPacientes();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center py-10 text-blue-600">
        <div className="animate-spin h-6 w-6 border-t-2 border-blue-600 rounded-full mr-2"></div>
        Cargando pacientes...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 py-10">
        Error al cargar pacientes: {error}
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Historial Clínico – Pacientes
      </h1>
      <div className="bg-white shadow rounded-xl overflow-hidden border border-gray-200">
        <table className="min-w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Nombre</th>
              <th className="py-3 px-4 text-left">Correo</th>
              <th className="py-3 px-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.length > 0 ? (
              pacientes.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{p.nombre}</td>
                  <td className="py-3 px-4">{p.correo}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => navigate(`/dashboard/historial/${p.id}`)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Ver Historial
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No hay pacientes registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
