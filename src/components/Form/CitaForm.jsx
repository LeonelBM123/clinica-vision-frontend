import { useEffect, useState } from "react";
import { Calendar, Clock, User, Stethoscope } from "lucide-react";

export default function CitaForm({
  initialCita = null,
  pacientesOptions = [],
  bloquesHorariosOptions = [],
  onSubmit,
  onCancel,
  loading = false,
}) {
  const editMode = !!initialCita;
  const [form, setForm] = useState({
    paciente: "",
    bloque_horario: "",
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
    notas: "",
  });
  const [touched, setTouched] = useState({});
  const [searchPaciente, setSearchPaciente] = useState("");
  const [bloquesFiltrados, setBloquesFiltrados] = useState([]);

  // Filtrar pacientes según búsqueda
  const filteredPacientes = pacientesOptions.filter((paciente) =>
    paciente.nombre.toLowerCase().includes(searchPaciente.toLowerCase())
  );

  // Cuando se selecciona un bloque horario, auto-completar fecha y horas
  useEffect(() => {
    if (form.bloque_horario) {
      const bloqueSeleccionado = bloquesHorariosOptions.find(
        (bloque) => bloque.id === parseInt(form.bloque_horario)
      );

      if (bloqueSeleccionado) {
        setForm((f) => ({
          ...f,
          // En un sistema real, aquí calcularías la fecha basada en el día de la semana
          // Por ahora lo dejamos para entrada manual
          hora_inicio: bloqueSeleccionado.hora_inicio,
          hora_fin: bloqueSeleccionado.hora_fin,
        }));
      }
    }
  }, [form.bloque_horario, bloquesHorariosOptions]);

  // Cargar datos iniciales si estamos editando
  useEffect(() => {
    if (initialCita) {
      setForm({
        paciente: initialCita.paciente?.id || initialCita.paciente || "",
        bloque_horario:
          initialCita.bloque_horario?.id || initialCita.bloque_horario || "",
        fecha: initialCita.fecha || "",
        hora_inicio: initialCita.hora_inicio || "",
        hora_fin: initialCita.hora_fin || "",
        notas: initialCita.notas || "",
      });
    }
  }, [initialCita]);

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTouched({
      paciente: true,
      bloque_horario: true,
      fecha: true,
      hora_inicio: true,
      hora_fin: true,
    });

    // Validaciones básicas
    if (
      !form.paciente ||
      !form.bloque_horario ||
      !form.fecha ||
      !form.hora_inicio ||
      !form.hora_fin
    ) {
      return;
    }

    const payload = {
      paciente: parseInt(form.paciente),
      bloque_horario: parseInt(form.bloque_horario),
      fecha: form.fecha,
      hora_inicio: form.hora_inicio,
      hora_fin: form.hora_fin,
      notas: form.notas.trim(),
    };

    onSubmit(payload);
  }

  const invalid = {
    paciente: touched.paciente && !form.paciente,
    bloque_horario: touched.bloque_horario && !form.bloque_horario,
    fecha: touched.fecha && !form.fecha,
    hora_inicio: touched.hora_inicio && !form.hora_inicio,
    hora_fin: touched.hora_fin && !form.hora_fin,
  };

  // Formatear bloques horarios para mostrar información útil
  const bloquesFormateados = bloquesHorariosOptions.map((bloque) => ({
    value: bloque.id,
    label: `${bloque.dia_semana} - ${bloque.hora_inicio} a ${bloque.hora_fin}`,
    tipo_atencion: bloque.tipo_atencion_nombre,
    medico: bloque.medico_nombre,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Paciente */}
        <Field
          label="Paciente *"
          error={invalid.paciente && "Seleccione un paciente"}
        >
          <div className="space-y-2">
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="border-b border-gray-300 bg-gray-50">
                <div className="flex items-center px-4 py-2">
                  <User size={16} className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    value={searchPaciente}
                    onChange={(e) => setSearchPaciente(e.target.value)}
                    placeholder="Buscar paciente..."
                    disabled={loading}
                    className="w-full bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div className="max-h-48 overflow-y-auto">
                {filteredPacientes.length > 0 ? (
                  filteredPacientes.map((paciente) => (
                    <label
                      key={paciente.id}
                      className={`flex items-center space-x-3 p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        form.paciente === paciente.id.toString()
                          ? "bg-blue-50"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="paciente"
                        value={paciente.id}
                        checked={form.paciente === paciente.id.toString()}
                        onChange={(e) => setField("paciente", e.target.value)}
                        disabled={loading}
                        className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {paciente.nombre}
                        </div>
                        {paciente.telefono && (
                          <div className="text-sm text-gray-500">
                            Tel: {paciente.telefono}
                          </div>
                        )}
                      </div>
                    </label>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No se encontraron pacientes
                  </div>
                )}
              </div>
            </div>

            {/* Paciente seleccionado */}
            {form.paciente && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-green-600" />
                    <span className="font-medium text-green-800">
                      {
                        pacientesOptions.find(
                          (p) => p.id === parseInt(form.paciente)
                        )?.nombre
                      }
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setField("paciente", "")}
                    disabled={loading}
                    className="text-green-600 hover:text-green-800 text-sm"
                  >
                    Cambiar
                  </button>
                </div>
              </div>
            )}
          </div>
        </Field>

        {/* Bloque Horario */}
        <Field
          label="Bloque Horario *"
          error={invalid.bloque_horario && "Seleccione un bloque horario"}
        >
          <select
            value={form.bloque_horario}
            onChange={(e) => setField("bloque_horario", e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, bloque_horario: true }))}
            required
            disabled={loading}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
              invalid.bloque_horario ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Seleccione un bloque horario</option>
            {bloquesFormateados.map((bloque) => (
              <option key={bloque.value} value={bloque.value}>
                {bloque.label} - {bloque.tipo_atencion} ({bloque.medico})
              </option>
            ))}
          </select>
        </Field>

        {/* Fecha */}
        <Field
          label="Fecha de la Cita *"
          error={invalid.fecha && "Seleccione una fecha"}
        >
          <div className="relative">
            <Calendar
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="date"
              value={form.fecha}
              onChange={(e) => setField("fecha", e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, fecha: true }))}
              required
              disabled={loading}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                invalid.fecha ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>
        </Field>

        {/* Hora Inicio */}
        <Field
          label="Hora de Inicio *"
          error={invalid.hora_inicio && "Ingrese la hora de inicio"}
        >
          <div className="relative">
            <Clock
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="time"
              value={form.hora_inicio}
              onChange={(e) => setField("hora_inicio", e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, hora_inicio: true }))}
              required
              disabled={loading}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                invalid.hora_inicio ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>
        </Field>

        {/* Hora Fin */}
        <Field
          label="Hora de Fin *"
          error={invalid.hora_fin && "Ingrese la hora de fin"}
        >
          <div className="relative">
            <Clock
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="time"
              value={form.hora_fin}
              onChange={(e) => setField("hora_fin", e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, hora_fin: true }))}
              required
              disabled={loading}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                invalid.hora_fin ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>
        </Field>
      </div>

      {/* Notas */}
      <Field label="Notas Adicionales">
        <textarea
          value={form.notas}
          onChange={(e) => setField("notas", e.target.value)}
          disabled={loading}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
          placeholder="Notas adicionales sobre la cita..."
          rows={3}
          maxLength={500}
        />
        <div className="text-xs text-gray-500 text-right mt-1">
          {form.notas.length}/500 caracteres
        </div>
      </Field>

      {/* Información de la Cita */}
      {form.paciente && form.bloque_horario && form.fecha && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Stethoscope size={18} />
            Resumen de la Cita
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-blue-800">Paciente:</span>
              <p className="text-blue-700">
                {
                  pacientesOptions.find((p) => p.id === parseInt(form.paciente))
                    ?.nombre
                }
              </p>
            </div>
            <div>
              <span className="font-medium text-blue-800">Fecha y Hora:</span>
              <p className="text-blue-700">
                {form.fecha} • {form.hora_inicio} - {form.hora_fin}
              </p>
            </div>
            <div>
              <span className="font-medium text-blue-800">Bloque Horario:</span>
              <p className="text-blue-700">
                {
                  bloquesFormateados.find(
                    (b) => b.value === parseInt(form.bloque_horario)
                  )?.label
                }
              </p>
            </div>
            <div>
              <span className="font-medium text-blue-800">Médico:</span>
              <p className="text-blue-700">
                {
                  bloquesFormateados.find(
                    (b) => b.value === parseInt(form.bloque_horario)
                  )?.medico
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Botones */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={
            loading ||
            !form.paciente ||
            !form.bloque_horario ||
            !form.fecha ||
            !form.hora_inicio ||
            !form.hora_fin
          }
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
              {editMode ? "Actualizando..." : "Creando..."}
            </>
          ) : editMode ? (
            "Actualizar Cita"
          ) : (
            "Crear Cita"
          )}
        </button>
      </div>
    </form>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <span className="w-1 h-1 bg-red-600 rounded-full"></span>
          {error}
        </p>
      )}
    </div>
  );
}
