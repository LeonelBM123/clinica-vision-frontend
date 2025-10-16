import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { api } from "../../services/apiClient";
import authService from "../../services/auth";

export default function HistorialConsultas() {
  const [pacientes, setPacientes] = useState([]); // siempre inicia como arreglo
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    async function fetchPacientes() {
      try {
        if (!currentUser) {
          setError("No hay usuario logueado");
          setLoading(false);
          return;
        }

        const grupoId = currentUser.grupo_id;
        const response = await api.get(`diagnosticos/pacientes/?grupo_id=${grupoId}`);

        // Asegurarnos que sea un arreglo aunque response sea inesperado
        const datos = response?.data ?? response ?? [];
        setPacientes(Array.isArray(datos) ? datos : []);
      } catch (err) {
        setError(err.message || "Error al cargar pacientes");
      } finally {
        setLoading(false);
      }
    }

    fetchPacientes();
  }, [currentUser]);

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
                      onClick={() =>
                        navigate(`/dashboard/pacientes/${p.id}/citas`)
                      }
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Ver Historial
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-500 italic">
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
