import { useEffect, useState } from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { api } from "../../services/apiClient";
import dayjs from "dayjs";

// Solución: Importamos tu servicio de autenticación directamente
import authService from "../../services/auth";

// Componente helper para los campos del formulario (sin cambios)
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

export default function CitaForm({
  initialCita = null,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const isEditMode = !!initialCita;

  // Solución: Obtenemos el usuario y su rol directamente de tu servicio
  const user = authService.getCurrentUser();
  const isUserMedico = authService.isMedico();

  // Estados del formulario
  const [pacientesOptions, setPacientesOptions] = useState([]);
  const [loadingPacientes, setLoadingPacientes] = useState(false);
  const [selectedMedico, setSelectedMedico] = useState(null);
  const [fecha, setFecha] = useState(
    initialCita?.fecha || dayjs().format("YYYY-MM-DD")
  );
  const [horarios, setHorarios] = useState([]);
  const [loadingHorarios, setLoadingHorarios] = useState(false);

  const [form, setForm] = useState({
    paciente: null,
    bloque_horario: initialCita?.bloque_horario || null,
    hora_inicio: initialCita?.hora_inicio || "",
    notas: initialCita?.notas || "",
    estado_cita: initialCita?.estado_cita || "PENDIENTE",
  });

  const [touched, setTouched] = useState({});

  // Cargar todos los pacientes al montar el componente
  useEffect(() => {
    setLoadingPacientes(true);
    api
      .get("/diagnosticos/pacientes/?busqueda_global=true")
      .then((data) => {
        const options = data.map((paciente) => ({
          label: `${paciente.nombre} (${paciente.numero_historia_clinica})`,
          value: paciente.id,
        }));
        setPacientesOptions(options);

        // Si estamos en modo edición, pre-seleccionamos el paciente
        if (isEditMode && initialCita) {
          const pacienteSeleccionado = options.find(
            (opt) => opt.value === initialCita.paciente
          );
          setForm((f) => ({ ...f, paciente: pacienteSeleccionado }));
        }
      })
      .catch((e) => console.error("Error cargando pacientes:", e))
      .finally(() => setLoadingPacientes(false));
  }, [isEditMode, initialCita]);

  // Si el usuario es médico, se autoselecciona
  useEffect(() => {
    if (isUserMedico) {
      // Tu API de login devuelve el usuario_id y correo. Necesitamos buscar los datos completos del médico.
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

  // Cargar médicos de forma asíncrona (solo para recepcionistas)
  const loadMedicos = async (inputValue) => {
    const params = { search: inputValue };
    const data = await api.get("/doctores/medicos/", { params });
    return data.map((medico) => ({ label: medico.nombre, value: medico.id }));
  };

  // Cargar horarios disponibles cuando cambia el médico o la fecha
  useEffect(() => {
    if (selectedMedico?.value && fecha) {
      setLoadingHorarios(true);
      setHorarios([]);
      setForm((f) => ({ ...f, hora_inicio: "", bloque_horario: null }));

      api
        .get(
          `/doctores/medicos/${selectedMedico.value}/horarios-disponibles/?fecha=${fecha}`
        )
        .then((data) => setHorarios(Array.isArray(data) ? data : []))
        .catch((e) => console.error("Error al cargar horarios:", e))
        .finally(() => setLoadingHorarios(false));
    } else {
      setHorarios([]);
    }
  }, [selectedMedico, fecha]);

  // Manejar cambios en campos de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleHorarioSelect = (horario) => {
    setForm((prev) => ({
      ...prev,
      hora_inicio: horario.hora_inicio,
      bloque_horario: horario.bloque_horario_id,
    }));
  };

  // Enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({
      paciente: true,
      medico: true,
      fecha: true,
      hora_inicio: true,
    });

    if (!form.paciente || !selectedMedico || !fecha || !form.hora_inicio) {
      return;
    }

    const payload = {
      paciente: form.paciente.value,
      bloque_horario: form.bloque_horario,
      fecha: fecha,
      hora_inicio: form.hora_inicio,
      notas: form.notas,
      estado_cita: form.estado_cita,
    };

    onSubmit(payload);
  };

  const invalid = {
    paciente: touched.paciente && !form.paciente,
    medico: touched.medico && !selectedMedico,
    hora_inicio: touched.hora_inicio && !form.hora_inicio,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Selector de Paciente con lista completa */}
        <Field
          label="Paciente *"
          error={invalid.paciente && "Seleccione un paciente"}
        >
          <Select
            options={pacientesOptions}
            value={form.paciente}
            onChange={(option) => setForm((f) => ({ ...f, paciente: option }))}
            onBlur={() => setTouched((t) => ({ ...t, paciente: true }))}
            placeholder="Seleccione o busque un paciente..."
            isLoading={loadingPacientes}
            isDisabled={loading || isEditMode}
            isSearchable
            classNamePrefix="react-select"
          />
        </Field>

        {/* Selector de Médico condicional */}
        <Field
          label="Médico *"
          error={invalid.medico && "Seleccione un médico"}
        >
          {isUserMedico ? (
            <input
              type="text"
              value={selectedMedico?.label || "Cargando..."}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
            />
          ) : (
            <AsyncSelect
              cacheOptions
              defaultOptions
              loadOptions={loadMedicos}
              value={selectedMedico}
              onChange={setSelectedMedico}
              onBlur={() => setTouched((t) => ({ ...t, medico: true }))}
              placeholder="Buscar médico..."
              isDisabled={loading || isEditMode}
              classNamePrefix="react-select"
            />
          )}
        </Field>
      </div>

      {/* Selector de Fecha */}
      <Field label="Fecha de la Cita *">
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          disabled={loading || isEditMode || !selectedMedico}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
        />
      </Field>

      {/* Selección de Horario */}
      {selectedMedico && fecha && (
        <Field
          label="Horario Disponible *"
          error={invalid.hora_inicio && "Seleccione un horario"}
        >
          {loadingHorarios ? (
            <div className="text-center p-4 text-sm text-gray-500">
              Cargando horarios...
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {horarios.length > 0 ? (
                horarios.map((h, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleHorarioSelect(h)}
                    disabled={loading || isEditMode}
                    className={`px-3 py-2 border rounded-lg text-sm font-medium transition ${
                      form.hora_inicio === h.hora_inicio
                        ? "bg-blue-600 text-white border-blue-600 shadow"
                        : "bg-white hover:bg-gray-50 border-gray-300"
                    } ${isEditMode ? "cursor-not-allowed" : ""}`}
                  >
                    {h.hora_inicio}
                  </button>
                ))
              ) : (
                <div className="col-span-full text-center p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                  No hay horarios disponibles para el médico en esta fecha.
                </div>
              )}
            </div>
          )}
        </Field>
      )}

      {/* Notas adicionales */}
      <Field label="Notas Adicionales">
        <textarea
          name="notas"
          value={form.notas}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          placeholder="Motivo de la consulta, recordatorios, etc."
        />
      </Field>

      {/* Botones */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border rounded-lg"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading || !form.paciente || !form.hora_inicio}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          {loading
            ? "Guardando..."
            : isEditMode
            ? "Guardar Cambios"
            : "Agendar Cita"}
        </button>
      </div>
    </form>
  );
}
