import React from "react";
import { Calendar, Clock, User, Tag, Edit, Trash2 } from "lucide-react";
import dayjs from "dayjs";

// Componente para mostrar un esqueleto de carga mejorado
const SkeletonCard = () => (
  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm min-h-[200px]">
    <div className="h-6 bg-gray-200 rounded-md w-1/2 mx-auto mb-4 animate-pulse"></div>
    <div className="space-y-3">
      <div className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
      <div className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
    </div>
  </div>
);

const DIAS_SEMANA = [
  "LUNES",
  "MARTES",
  "MIERCOLES",
  "JUEVES",
  "VIERNES",
  "SABADO",
  "DOMINGO",
];

export default function AgendaSemanal({
  citasPorDia,
  bloquesPorDia,
  loading,
  onEditBloque,
  onDeleteBloque,
}) {
  const hoy = dayjs();

  // Devuelve si un día de la semana corresponde al día de hoy
  const esHoy = (dia) => {
    const dayIndex = DIAS_SEMANA.indexOf(dia);
    const diaNumero = dayIndex === 6 ? 0 : dayIndex + 1; // Domingo=0, Lunes=1..
    return hoy.day() === diaNumero;
  };

  return (
    <>
      {/* --- Calendario 1: Horario de Citas (Semana Actual) --- */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-5 pb-2 border-b-2 border-gray-200 flex items-center gap-3">
          <Calendar className="text-green-600" /> Horario de Citas (Semana
          Actual)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-5">
          {loading
            ? Array.from({ length: 7 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            : DIAS_SEMANA.map((dia) => (
                <div
                  key={`citas-${dia}`}
                  className={`rounded-xl flex flex-col ${
                    esHoy(dia) ? "bg-green-50" : "bg-gray-100"
                  }`}
                >
                  <div
                    className={`font-bold text-center p-3 rounded-t-xl ${
                      esHoy(dia)
                        ? "bg-green-200 text-green-800"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    <p className="text-sm uppercase">{dia.substring(0, 3)}</p>
                    <p className="text-2xl">
                      {dayjs()
                        .day(DIAS_SEMANA.indexOf(dia) + 1)
                        .format("DD")}
                    </p>
                  </div>
                  <div className="p-3 space-y-3 flex-grow">
                    {(citasPorDia[dia] || []).length > 0 ? (
                      citasPorDia[dia].map((cita) => (
                        <div
                          key={cita.id}
                          className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-green-500"
                        >
                          <p className="font-bold text-gray-800 flex items-center gap-1.5 mb-1 text-sm">
                            <Clock size={14} />{" "}
                            {cita.hora_inicio.substring(0, 5)} -{" "}
                            {cita.hora_fin.substring(0, 5)}
                          </p>
                          <p className="text-gray-700 font-medium flex items-center gap-1.5 text-sm">
                            <User size={14} /> {cita.paciente_nombre}
                          </p>
                          {cita.tipo_atencion_nombre && (
                            <p className="text-gray-500 flex items-center gap-1.5 mt-1 text-xs">
                              <Tag size={12} /> {cita.tipo_atencion_nombre}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-full text-sm text-gray-400">
                        <p>Libre</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
        </div>
      </div>

      {/* --- Calendario 2: Modelo de Bloques Horarios (Plantilla) --- */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-5 pb-2 border-b-2 border-gray-200 flex items-center gap-3">
          <Calendar className="text-blue-600" /> Mi Horario Semanal (Plantilla)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-5">
          {loading
            ? Array.from({ length: 7 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            : DIAS_SEMANA.map((dia) => (
                <div
                  key={`bloques-${dia}`}
                  className={`rounded-xl flex flex-col ${
                    esHoy(dia) ? "bg-blue-50" : "bg-gray-100"
                  }`}
                >
                  <div
                    className={`font-bold text-center p-3 rounded-t-xl ${
                      esHoy(dia)
                        ? "bg-blue-200 text-blue-800"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    <p className="text-sm uppercase">{dia.substring(0, 3)}</p>
                    <p className="text-2xl">
                      {dayjs()
                        .day(DIAS_SEMANA.indexOf(dia) + 1)
                        .format("DD")}
                    </p>
                  </div>
                  <div className="p-3 space-y-3 flex-grow">
                    {(bloquesPorDia[dia] || []).length > 0 ? (
                      bloquesPorDia[dia].map((bloque) => (
                        <div
                          key={bloque.id}
                          className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-blue-500 relative group"
                        >
                          <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <button
                              onClick={() => onEditBloque(bloque)}
                              className="p-1.5 bg-white rounded-full shadow-md hover:bg-yellow-100 text-gray-600 hover:text-yellow-800 transition transform hover:scale-110"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => onDeleteBloque(bloque)}
                              className="p-1.5 bg-white rounded-full shadow-md hover:bg-red-100 text-gray-600 hover:text-red-800 transition transform hover:scale-110"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <p className="font-bold text-gray-800 flex items-center gap-1.5 mb-1 text-sm">
                            <Clock size={14} />{" "}
                            {bloque.hora_inicio.substring(0, 5)} -{" "}
                            {bloque.hora_fin.substring(0, 5)}
                          </p>
                          <p className="text-gray-600 text-xs">
                            Citas de {bloque.duracion_cita_minutos} min
                          </p>
                          {bloque.tipo_atencion_nombre && (
                            <p className="text-gray-500 flex items-center gap-1.5 mt-1 text-xs">
                              <Tag size={12} /> {bloque.tipo_atencion_nombre}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-full text-sm text-gray-400">
                        <p>No definido</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
        </div>
      </div>
    </>
  );
}
