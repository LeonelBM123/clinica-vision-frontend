import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import { api } from "../../services/apiClient";
import authService from "../../services/auth";

// Componente helper para los campos del formulario
function Field({ label, error, children }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default function BloqueHorarioForm({
  initialBloque = null,
  onSubmit,
  onCancel,
  loading = false,
  isEditMode = false,
}) {
  const [tiposAtencion, setTiposAtencion] = useState([]);
  const [form, setForm] = useState({
    dia_semana: "LUNES",
    hora_inicio: "09:00",
    hora_fin: "10:00",
    duracion_cita_minutos: 30,
    max_citas_por_bloque: 2,
    tipo_atencion: "", // Valor inicial vacío
  });

  const [selectedMedico, setSelectedMedico] = useState(null);
  const [lastUserChange, setLastUserChange] = useState(null);

  const user = authService.getCurrentUser();
  const isUserMedico = authService.isMedico();

  // --- EFECTOS DE CARGA DE DATOS ---

  useEffect(() => {
    api
      .get("/doctores/tipos-atencion/")
      .then((data) => setTiposAtencion(Array.isArray(data) ? data : []))
      .catch((e) => console.error("Error cargando tipos de atención:", e));
  }, []);

  useEffect(() => {
    if (initialBloque) {
      setForm({
        dia_semana: initialBloque.dia_semana || "LUNES",
        hora_inicio: initialBloque.hora_inicio.substring(0, 5) || "09:00",
        hora_fin: initialBloque.hora_fin.substring(0, 5) || "10:00",
        duracion_cita_minutos: initialBloque.duracion_cita_minutos || 30,
        max_citas_por_bloque: initialBloque.max_citas_por_bloque || 2,
        tipo_atencion: initialBloque.tipo_atencion || "",
      });
      if (initialBloque.medico) {
        setSelectedMedico({
          label: initialBloque.medico_nombre,
          value: initialBloque.medico,
        });
      }
    }
  }, [initialBloque]);

  useEffect(() => {
    if (isUserMedico) {
      api
        .get(`/cuentas/usuarios/${user.usuario_id}/`)
        .then((medicoData) => {
          setSelectedMedico({ label: medicoData.nombre, value: medicoData.id });
        })
        .catch((e) =>
          console.error("Error cargando datos del médico logueado", e)
        );
    }
  }, [isUserMedico, user]);

  const loadMedicos = async (inputValue) => {
    const params = { search: inputValue };
    const data = await api.get("/doctores/medicos/", { params });
    return data.map((medico) => ({ label: medico.nombre, value: medico.id }));
  };

  // --- LÓGICA DE AUTOCALCULADO ---
  useEffect(() => {
    if (!lastUserChange) return;

    const {
      hora_inicio,
      hora_fin,
      duracion_cita_minutos,
      max_citas_por_bloque,
    } = form;
    const duracion = parseInt(duracion_cita_minutos, 10);
    const maxCitas = parseInt(max_citas_por_bloque, 10);

    const timeToMinutes = (timeStr) => {
      if (!timeStr || !timeStr.includes(":")) return NaN;
      const [h, m] = timeStr.split(":").map(Number);
      if (isNaN(h) || isNaN(m)) return NaN;
      return h * 60 + m;
    };

    const totalMinutosInicio = timeToMinutes(hora_inicio);
    const totalMinutosFin = timeToMinutes(hora_fin);

    if (
      ["hora_inicio", "hora_fin", "max_citas_por_bloque"].includes(
        lastUserChange
      )
    ) {
      if (
        !isNaN(totalMinutosInicio) &&
        !isNaN(totalMinutosFin) &&
        maxCitas > 0
      ) {
        const duracionTotalBloque = totalMinutosFin - totalMinutosInicio;
        if (duracionTotalBloque > 0) {
          const nuevaDuracion = Math.floor(duracionTotalBloque / maxCitas);
          if (nuevaDuracion > 0 && nuevaDuracion !== duracion) {
            setForm((prev) => ({
              ...prev,
              duracion_cita_minutos: nuevaDuracion,
            }));
          }
        }
      }
    } else if (lastUserChange === "duracion_cita_minutos") {
      if (
        !isNaN(totalMinutosInicio) &&
        !isNaN(totalMinutosFin) &&
        duracion > 0
      ) {
        const duracionTotalBloque = totalMinutosFin - totalMinutosInicio;
        if (duracionTotalBloque >= 0) {
          const nuevoMaxCitas = Math.floor(duracionTotalBloque / duracion);
          if (nuevoMaxCitas !== maxCitas) {
            setForm((prev) => ({
              ...prev,
              max_citas_por_bloque: nuevoMaxCitas >= 0 ? nuevoMaxCitas : "",
            }));
          }
        }
      }
    }
  }, [
    form.hora_inicio,
    form.hora_fin,
    form.duracion_cita_minutos,
    form.max_citas_por_bloque,
    lastUserChange,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLastUserChange(name);
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedMedico) {
      console.error("No se ha seleccionado un médico.");
      return;
    }
    const payload = { ...form, medico: selectedMedico.value };
    onSubmit(payload);
  };

  const diasOptions = [
    { value: "LUNES", label: "Lunes" },
    { value: "MARTES", label: "Martes" },
    { value: "MIERCOLES", label: "Miércoles" },
    { value: "JUEVES", label: "Jueves" },
    { value: "VIERNES", label: "Viernes" },
    { value: "SABADO", label: "Sábado" },
    { value: "DOMINGO", label: "Domingo" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Médico *">
          {isUserMedico ? (
            <input
              type="text"
              value={selectedMedico?.label || "Cargando..."}
              disabled
              className="w-full px-4 py-3 border rounded-lg bg-gray-100"
            />
          ) : (
            <AsyncSelect
              cacheOptions
              defaultOptions
              loadOptions={loadMedicos}
              value={selectedMedico}
              onChange={setSelectedMedico}
              placeholder="Buscar y seleccionar un médico..."
              isDisabled={loading || isEditMode}
              classNamePrefix="react-select"
            />
          )}
        </Field>

        <Field label="Día de la Semana *">
          <select
            name="dia_semana"
            value={form.dia_semana}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {diasOptions.map((dia) => (
              <option key={dia.value} value={dia.value}>
                {dia.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {/* ----- CAMBIOS AQUÍ ----- */}
      <Field label="Tipo de Atención *">
        <select
          name="tipo_atencion"
          value={form.tipo_atencion}
          onChange={handleChange}
          disabled={loading}
          required // <-- MODIFICACIÓN 1: Campo obligatorio
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          {/* MODIFICACIÓN 2: Cambiamos el texto y nos aseguramos que el valor sea vacío */}
          <option value="">Seleccione un tipo de atención</option>
          {tiposAtencion.map((tipo) => (
            <option key={tipo.id} value={tipo.id}>
              {tipo.nombre}
            </option>
          ))}
        </select>
      </Field>
      {/* ----- FIN DE LOS CAMBIOS ----- */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Hora de Inicio *">
          <input
            type="time"
            name="hora_inicio"
            value={form.hora_inicio}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </Field>
        <Field label="Hora de Fin (autocalculado) *">
          <input
            type="time"
            name="hora_fin"
            value={form.hora_fin}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full px-4 py-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Duración por Cita (minutos) *">
          <input
            type="number"
            name="duracion_cita_minutos"
            value={form.duracion_cita_minutos}
            onChange={handleChange}
            required
            min="1"
            disabled={loading}
            className="w-full px-4 py-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
          />
        </Field>
        <Field label="Máx. Citas en Bloque *">
          <input
            type="number"
            name="max_citas_por_bloque"
            value={form.max_citas_por_bloque}
            onChange={handleChange}
            required
            min="0"
            disabled={loading}
            className="w-full px-4 py-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
          />
        </Field>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
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
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
        >
          {loading
            ? "Guardando..."
            : isEditMode
            ? "Guardar Cambios"
            : "Crear Bloque"}
        </button>
      </div>
    </form>
  );
}
