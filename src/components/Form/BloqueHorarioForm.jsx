import { useEffect, useState } from "react";

export default function BloqueHorarioForm({
  initialBloque = null,
  medicosOptions = [],
  tiposAtencionOptions = [],
  onSubmit,
  onCancel,
  loading = false,
  isEditMode = false,
  puedeModificar = true,
}) {
  const [form, setForm] = useState({
    medico: "",
    dia_semana: "LUNES",
    hora_inicio: "",
    hora_fin: "",
    duracion_cita_minutos: 30,
    max_citas_por_bloque: 10,
    tipo_atencion: "",
  });
  const [touched, setTouched] = useState({});

  const diasSemana = [
    { value: "LUNES", label: "Lunes" },
    { value: "MARTES", label: "Martes" },
    { value: "MIERCOLES", label: "Miércoles" },
    { value: "JUEVES", label: "Jueves" },
    { value: "VIERNES", label: "Viernes" },
    { value: "SABADO", label: "Sábado" },
    { value: "DOMINGO", label: "Domingo" },
  ];

  const duracionesCita = [
    { value: 15, label: "15 minutos" },
    { value: 20, label: "20 minutos" },
    { value: 30, label: "30 minutos" },
    { value: 45, label: "45 minutos" },
    { value: 60, label: "1 hora" },
  ];

  // Filtrar médicos activos del mismo grupo
  const medicosFormateados = medicosOptions
    .filter((medico) => medico.estado)
    .map((medico) => ({
      value: medico.id,
      label: `${medico.nombre} - ${
        medico.especialidades_nombres?.join(", ") || "Sin especialidad"
      }`,
    }));

  // Filtrar tipos de atención activos del mismo grupo
  const tiposAtencionFormateados = tiposAtencionOptions
    .filter((tipo) => tipo.estado)
    .map((tipo) => ({
      value: tipo.id,
      label: tipo.nombre,
    }));

  useEffect(() => {
    if (initialBloque) {
      setForm({
        medico: initialBloque.medico || "",
        dia_semana: initialBloque.dia_semana || "LUNES",
        hora_inicio: initialBloque.hora_inicio || "",
        hora_fin: initialBloque.hora_fin || "",
        duracion_cita_minutos: initialBloque.duracion_cita_minutos || 30,
        max_citas_por_bloque: initialBloque.max_citas_por_bloque || 10,
        tipo_atencion: initialBloque.tipo_atencion || "",
      });
    }
  }, [initialBloque]);

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTouched({
      medico: true,
      hora_inicio: true,
      hora_fin: true,
    });

    if (!form.medico || !form.hora_inicio || !form.hora_fin) return;

    const payload = {
      medico: parseInt(form.medico),
      dia_semana: form.dia_semana,
      hora_inicio: form.hora_inicio,
      hora_fin: form.hora_fin,
      duracion_cita_minutos: parseInt(form.duracion_cita_minutos),
      max_citas_por_bloque: parseInt(form.max_citas_por_bloque),
    };

    // Solo incluir tipo_atencion si se seleccionó uno
    if (form.tipo_atencion) {
      payload.tipo_atencion = parseInt(form.tipo_atencion);
    }

    onSubmit(payload);
  }

  // Calcular duración total del bloque
  const calcularDuracionTotal = () => {
    if (!form.hora_inicio || !form.hora_fin) return 0;

    const [horaInicio, minutoInicio] = form.hora_inicio.split(":").map(Number);
    const [horaFin, minutoFin] = form.hora_fin.split(":").map(Number);

    const totalMinutos =
      horaFin * 60 + minutoFin - (horaInicio * 60 + minutoInicio);
    return totalMinutos;
  };

  // Calcular máximo de citas posible
  const calcularMaxCitasPosible = () => {
    const duracionTotal = calcularDuracionTotal();
    const duracionCita = parseInt(form.duracion_cita_minutos);

    if (duracionTotal <= 0 || duracionCita <= 0) return 0;

    return Math.floor(duracionTotal / duracionCita);
  };

  const duracionTotal = calcularDuracionTotal();
  const maxCitasPosible = calcularMaxCitasPosible();
  const maxCitasExcedido = form.max_citas_por_bloque > maxCitasPosible;

  const invalid = {
    medico: touched.medico && !form.medico,
    hora_inicio: touched.hora_inicio && !form.hora_inicio,
    hora_fin: touched.hora_fin && !form.hora_fin,
    duracion: duracionTotal < 30,
    max_citas: maxCitasExcedido,
  };

  const isDisabled = loading || (isEditMode && !puedeModificar);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información de contexto */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-600">
          <strong>Nota:</strong> Solo puedes asignar horarios a médicos de tu
          mismo grupo.
          {medicosFormateados.length === 0 && (
            <span className="text-orange-600 font-medium">
              {" "}
              No hay médicos disponibles en tu grupo.
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Médico */}
        <Field
          label="Médico *"
          error={invalid.medico && "Seleccione un médico de su grupo"}
        >
          <select
            value={form.medico}
            onChange={(e) => setField("medico", e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, medico: true }))}
            required
            disabled={isDisabled || medicosFormateados.length === 0}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
              invalid.medico ? "border-red-500" : "border-gray-300"
            } ${
              isDisabled || medicosFormateados.length === 0 ? "bg-gray-100" : ""
            }`}
          >
            <option value="">Seleccione un médico</option>
            {medicosFormateados.map((medico) => (
              <option key={medico.value} value={medico.value}>
                {medico.label}
              </option>
            ))}
          </select>
          {medicosFormateados.length === 0 && (
            <p className="text-sm text-orange-600 mt-1">
              No hay médicos activos en tu grupo
            </p>
          )}
        </Field>

        {/* Día de la semana */}
        <Field label="Día de la semana *">
          <select
            value={form.dia_semana}
            onChange={(e) => setField("dia_semana", e.target.value)}
            disabled={isDisabled}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            {diasSemana.map((dia) => (
              <option key={dia.value} value={dia.value}>
                {dia.label}
              </option>
            ))}
          </select>
        </Field>

        {/* Hora de inicio */}
        <Field
          label="Hora de inicio *"
          error={invalid.hora_inicio && "Este campo es requerido"}
        >
          <input
            type="time"
            value={form.hora_inicio}
            onChange={(e) => setField("hora_inicio", e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, hora_inicio: true }))}
            required
            disabled={isDisabled}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
              invalid.hora_inicio ? "border-red-500" : "border-gray-300"
            }`}
          />
        </Field>

        {/* Hora de fin */}
        <Field
          label="Hora de fin *"
          error={invalid.hora_fin && "Este campo es requerido"}
        >
          <input
            type="time"
            value={form.hora_fin}
            onChange={(e) => setField("hora_fin", e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, hora_fin: true }))}
            required
            disabled={isDisabled}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
              invalid.hora_fin ? "border-red-500" : "border-gray-300"
            }`}
          />
        </Field>

        {/* Duración de cita */}
        <Field label="Duración por cita *">
          <select
            value={form.duracion_cita_minutos}
            onChange={(e) => setField("duracion_cita_minutos", e.target.value)}
            disabled={isDisabled}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            {duracionesCita.map((duracion) => (
              <option key={duracion.value} value={duracion.value}>
                {duracion.label}
              </option>
            ))}
          </select>
        </Field>

        {/* Máximo de citas */}
        <Field
          label="Máximo de citas *"
          error={
            invalid.max_citas && `Máximo posible: ${maxCitasPosible} citas`
          }
        >
          <input
            type="number"
            min="1"
            max={maxCitasPosible}
            value={form.max_citas_por_bloque}
            onChange={(e) => setField("max_citas_por_bloque", e.target.value)}
            disabled={isDisabled}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
              invalid.max_citas ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Ej: 10"
          />
        </Field>

        {/* Tipo de atención */}
        <Field label="Tipo de atención (opcional)">
          <select
            value={form.tipo_atencion}
            onChange={(e) => setField("tipo_atencion", e.target.value)}
            disabled={isDisabled || tiposAtencionFormateados.length === 0}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            <option value="">Sin tipo específico</option>
            {tiposAtencionFormateados.map((tipo) => (
              <option key={tipo.value} value={tipo.value}>
                {tipo.label}
              </option>
            ))}
          </select>
          {tiposAtencionFormateados.length === 0 && (
            <p className="text-sm text-gray-500 mt-1">
              No hay tipos de atención configurados en tu grupo
            </p>
          )}
        </Field>
      </div>

      {/* Información del bloque */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">
          Resumen del bloque:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-700">Duración total:</span>
            <span
              className={`ml-2 ${
                invalid.duracion ? "text-red-600" : "text-blue-600"
              }`}
            >
              {duracionTotal > 0 ? `${duracionTotal} minutos` : "--"}
              {invalid.duracion && " (Mínimo 30 minutos)"}
            </span>
          </div>
          <div>
            <span className="font-medium text-blue-700">Citas posibles:</span>
            <span className="ml-2 text-blue-600">
              {maxCitasPosible > 0 ? maxCitasPosible : "--"}
            </span>
          </div>
          <div>
            <span className="font-medium text-blue-700">
              Citas configuradas:
            </span>
            <span
              className={`ml-2 ${
                invalid.max_citas ? "text-red-600" : "text-blue-600"
              }`}
            >
              {form.max_citas_por_bloque}
              {invalid.max_citas && " (Excede el máximo)"}
            </span>
          </div>
        </div>
      </div>

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
            !form.medico ||
            !form.hora_inicio ||
            !form.hora_fin ||
            invalid.duracion ||
            invalid.max_citas ||
            (isEditMode && !puedeModificar) ||
            medicosFormateados.length === 0
          }
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
              Guardando...
            </>
          ) : isEditMode ? (
            "Guardar Cambios"
          ) : (
            "Crear Bloque"
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
