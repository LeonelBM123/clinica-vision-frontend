import { useEffect, useState } from "react";

export default function MedicoForm({
  initialMedico = null,
  especialidadesOptions = [],
  onSubmit,
  onCancel,
  loading = false,
}) {
  const editMode = !!initialMedico;
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    password: "",
    sexo: "M",
    fecha_nacimiento: "",
    telefono: "",
    direccion: "",
    numero_colegiado: "",
    especialidades: [],
  });
  const [touched, setTouched] = useState({});
  const [searchEspecialidad, setSearchEspecialidad] = useState("");

  const sexoOptions = [
    { value: "M", label: "Masculino" },
    { value: "F", label: "Femenino" },
  ];

  const especialidadesFormateadas = especialidadesOptions.map((esp) => ({
    value: esp.id,
    label: esp.nombre,
  }));

  const filteredEspecialidades = especialidadesFormateadas.filter((esp) =>
    esp.label.toLowerCase().includes(searchEspecialidad.toLowerCase())
  );

  useEffect(() => {
    if (initialMedico) {
      setForm({
        nombre: initialMedico.nombre || "",
        correo: initialMedico.correo || "",
        password: "",
        sexo: initialMedico.sexo || "M",
        fecha_nacimiento: initialMedico.fecha_nacimiento || "",
        telefono: initialMedico.telefono || "",
        direccion: initialMedico.direccion || "",
        numero_colegiado: initialMedico.numero_colegiado || "",
        especialidades: initialMedico.especialidades || [],
      });
    }
  }, [initialMedico]);

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  function toggleEspecialidad(espId) {
    setForm((f) => ({
      ...f,
      especialidades: f.especialidades.includes(espId)
        ? f.especialidades.filter((id) => id !== espId)
        : [...f.especialidades, espId],
    }));
  }

  function removeEspecialidad(espId) {
    setForm((f) => ({
      ...f,
      especialidades: f.especialidades.filter((id) => id !== espId),
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTouched({
      nombre: true,
      correo: true,
      numero_colegiado: true,
    });

    if (!form.nombre || !form.correo || !form.numero_colegiado) return;

    const payload = {
      nombre: form.nombre.trim(),
      correo: form.correo.trim(),
      sexo: form.sexo,
      fecha_nacimiento: form.fecha_nacimiento,
      telefono: form.telefono.trim(),
      direccion: form.direccion.trim(),
      numero_colegiado: form.numero_colegiado.trim(),
      especialidades: form.especialidades,
    };

    // Solo incluir contraseña si se está creando (no editando)
    if (!editMode) payload.password = form.password.trim();

    onSubmit(payload);
  }

  const invalid = {
    nombre: touched.nombre && !form.nombre,
    correo: touched.correo && !form.correo,
    numero_colegiado: touched.numero_colegiado && !form.numero_colegiado,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre */}
        <Field
          label="Nombre Completo *"
          error={invalid.nombre && "Este campo es requerido"}
        >
          <input
            value={form.nombre}
            onChange={(e) => setField("nombre", e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, nombre: true }))}
            required
            disabled={loading}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
              invalid.nombre ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Ingrese el nombre completo"
            maxLength={128}
          />
        </Field>

        {/* Correo */}
        <Field
          label="Correo Electrónico *"
          error={invalid.correo && "Este campo es requerido"}
        >
          <input
            type="email"
            value={form.correo}
            onChange={(e) => setField("correo", e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, correo: true }))}
            required
            disabled={loading || editMode}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
              invalid.correo ? "border-red-500" : "border-gray-300"
            } ${editMode ? "bg-gray-100" : ""}`}
            placeholder="correo@clinica.com"
          />
        </Field>

        {/* Contraseña (solo en creación) */}
        {!editMode && (
          <Field label="Contraseña *">
            <input
              type="password"
              value={form.password}
              onChange={(e) => setField("password", e.target.value)}
              disabled={loading}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Ingrese la contraseña"
            />
          </Field>
        )}

        {/* Número de Colegiado */}
        <Field
          label="Número de Colegiado *"
          error={invalid.numero_colegiado && "Este campo es requerido"}
        >
          <input
            value={form.numero_colegiado}
            onChange={(e) => setField("numero_colegiado", e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, numero_colegiado: true }))}
            required
            disabled={loading}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
              invalid.numero_colegiado ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Ej: COL-12345"
            maxLength={64}
          />
        </Field>

        {/* Sexo */}
        <Field label="Género">
          <select
            value={form.sexo}
            onChange={(e) => setField("sexo", e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            {sexoOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        {/* Fecha de Nacimiento */}
        <Field label="Fecha de Nacimiento">
          <input
            type="date"
            value={form.fecha_nacimiento}
            onChange={(e) => setField("fecha_nacimiento", e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </Field>

        {/* Teléfono */}
        <Field label="Teléfono">
          <input
            value={form.telefono}
            onChange={(e) => setField("telefono", e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="8 dígitos"
            maxLength={8}
          />
        </Field>
      </div>

      {/* Dirección */}
      <Field label="Dirección">
        <textarea
          value={form.direccion}
          onChange={(e) => setField("direccion", e.target.value)}
          disabled={loading}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
          placeholder="Dirección completa"
          rows={2}
          maxLength={256}
        />
      </Field>

      {/* Especialidades */}
      <Field label="Especialidades">
        <div className="space-y-3">
          {form.especialidades.length > 0 ? (
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border">
              {form.especialidades.map((espId) => {
                const esp = especialidadesFormateadas.find(
                  (e) => e.value === espId
                );
                return (
                  <span
                    key={espId}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                  >
                    {esp.label}
                    <button
                      type="button"
                      onClick={() => removeEspecialidad(espId)}
                      disabled={loading}
                      className="text-blue-600 hover:text-blue-800 text-lg leading-none"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg border text-gray-500 text-sm">
              No se han seleccionado especialidades
            </div>
          )}

          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="border-b border-gray-300">
              <input
                type="text"
                value={searchEspecialidad}
                onChange={(e) => setSearchEspecialidad(e.target.value)}
                placeholder="Buscar especialidades..."
                disabled={loading}
                className="w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="max-h-48 overflow-y-auto">
              {filteredEspecialidades.map((esp) => (
                <label
                  key={esp.value}
                  className={`flex items-center space-x-3 p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    form.especialidades.includes(esp.value) ? "bg-blue-50" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.especialidades.includes(esp.value)}
                    onChange={() => toggleEspecialidad(esp.value)}
                    disabled={loading}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{esp.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </Field>

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
            loading || !form.nombre || !form.correo || !form.numero_colegiado
          }
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
              Guardando...
            </>
          ) : editMode ? (
            "Guardar Cambios"
          ) : (
            "Crear Médico"
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
