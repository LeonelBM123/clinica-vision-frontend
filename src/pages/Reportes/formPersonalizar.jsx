import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, Loader2, Calendar, List, FileDown } from "lucide-react"; 
import { api } from "../../services/apiClient.js"; 
import axios from "axios"; 
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const API_BASE_URL = "http://localhost:8000/api"; //import.meta.env.VITE_API_URL;

//funcion para fotmatear las fechas
const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

const getFechasDefault = () => {
  const fechaFin = new Date();
  const fechaInicio = new Date();
  fechaInicio.setDate(fechaFin.getDate() - 29); 
  return {
    inicio: formatDate(fechaInicio),
    fin: formatDate(fechaFin),
  };
};

export default function FormPersonalizar() {
  const navigate = useNavigate();
  
  //estado del componente cargando
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState("");
  
  const [datosGrafico, setDatosGrafico] = useState([]); 
  const [listaCitas, setListaCitas] = useState([]);     
  
  const [fechas, setFechas] = useState(getFechasDefault());
  
  //cargando del boton de descargar
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);
  


  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");

    const params = new URLSearchParams({
      fecha_inicio: fechas.inicio,
      fecha_fin: fechas.fin,
    }).toString();

    try {
      const responseData = await api.get(
        `/reportes/citas_dia/?${params}` 
      );
      
      if (responseData && responseData.datos_grafico && responseData.lista_citas) {
        setDatosGrafico(Array.isArray(responseData.datos_grafico) ? responseData.datos_grafico : []);
        setListaCitas(Array.isArray(responseData.lista_citas) ? responseData.lista_citas : []);
      } else {
        setDatosGrafico([]);
        setListaCitas([]);
      }
    } catch (e) {
      console.error("Error cargando datos del dashboard:", e);
      setError("No se pudieron cargar los datos: " + e.message);
      setDatosGrafico([]);
      setListaCitas([]);
    } finally {
      setLoading(false);
    }
  }, [fechas]); 

  //animacion para cargar datos al inicio y cuando las fechas cambian ---
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFechas((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDescargarExcel = async () => {
    setIsDownloadingExcel(true);
    setError(""); 

    const params = new URLSearchParams({
      fecha_inicio: fechas.inicio,
      fecha_fin: fechas.fin,
    }).toString();
    
    const token = localStorage.getItem("token");
    const url = `${API_BASE_URL}/reportes/citas-excel/?${params}`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: token ? `Token ${token}` : "",
        },
        responseType: "blob", 
      });

      // Crear el Blob
      const file = new Blob([response.data], { 
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
      });
      
      const fileURL = URL.createObjectURL(file);

      const link = document.createElement("a");
      link.href = fileURL;
      const fileName = `reporte_citas_${fechas.inicio}_a_${fechas.fin}.xlsx`;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      URL.revokeObjectURL(fileURL);

    } catch (e) {
      console.error("Error al descargar el Excel:", e);
      let errorMsg = e.message;
      if (e.response && e.response.data && e.response.data.toString() === '[object Blob]') {
        try {
          const errorBlobText = await e.response.data.text();
          errorMsg = errorBlobText;
        } catch(readError) {
          errorMsg = "Error indescifrable al descargar el archivo."
        }
      } else if(e.response && e.response.data) {
        errorMsg = e.response.data.detail || e.response.data.toString();
      }
      setError(`No se pudo generar el Excel: ${errorMsg}`);
    } finally {
      setIsDownloadingExcel(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
                Dashboard de Citas
              </h1>
              <p className="text-gray-600 mt-1">
                Reportes dinámicos de la actividad de la clínica.
              </p>
            </div>
          </div>
        </div>

        {/* Error (si existe) */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <div>
              <h3 className="text-red-800 font-semibold">
                Error al cargar el reporte
              </h3>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Tarjeta del Gráfico */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-white border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Citas por Día
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Volumen de citas registradas en el rango de fechas seleccionado.
            </p>
          </div>

          {/* Controles de Fecha */}
          <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="inicio" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Inicio
              </label>
              <input
                type="date"
                id="inicio"
                name="inicio"
                value={fechas.inicio}
                onChange={handleDateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="fin" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Fin
              </label>
              <input
                type="date"
                id="fin"
                name="fin"
                value={fechas.fin}
                onChange={handleDateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Área del Gráfico */}
          <div className="p-6 h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <Loader2 size={40} className="animate-spin" />
              </div>
            ) : datosGrafico.length > 0 ? ( 
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={datosGrafico} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="fecha" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" name="Total de Citas" stroke="#004A99" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <Calendar size={40} />
                <p className="ml-4 text-lg">No hay datos de citas para este rango de fechas.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header de la tabla con el botón de descarga */}
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Detalle de Citas en el Rango
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Mostrando las últimas {listaCitas.length} citas del rango seleccionado (de un total en el gráfico).
              </p>
            </div>
            
            {/*boton de descarga*/}
            <button
              onClick={handleDescargarExcel}
              disabled={isDownloadingExcel || loading}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-3 sm:mt-0"
            >
              {isDownloadingExcel ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <FileDown size={18} />
              )}
              <span>
                {isDownloadingExcel ? "Generando..." : "Descargar Excel"}
              </span>
            </button>
            
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-48 text-gray-500">
                <Loader2 size={32} className="animate-spin" />
              </div>
            ) : listaCitas.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {listaCitas.map((cita) => (
                      <tr key={cita.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{cita.fecha}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{cita.hora_inicio}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cita.paciente}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{cita.estado}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{cita.id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-500">
                <List size={32} />
                <p className="ml-4 text-lg">No se encontraron citas detalladas.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

