import { useEffect, useState } from "react";

export default function UsuarioForm({
  initialUsuario = null,
  rolesOptions = [],
  gruposOptions = [],
  onSubmit,
  onCancel,
  loading = false,
  isEditMode = false,
}) {
  const editMode = !!initialUsuario && isEditMode;
  
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    password: "",
    sexo: "M",
    fecha_nacimiento: "",
    telefono: "",
    direccion: "",
    rol: null,
    grupo: null,
    estado: true,
  });
  
  const [touched, setTouched] = useState({});

  const sexoOptions = [
    { value: "M", label: "Masculino" },
    { value: "F", label: "Femenino" },
  ];

  useEffect(() => {
    if (initialUsuario) {
      setForm({
        nombre: initialUsuario.nombre || "",
        correo: initialUsuario.correo || "",
        password: "", // No mostrar password existente
        sexo: initialUsuario.sexo || "M",
        fecha_nacimiento: initialUsuario.fecha_nacimiento || "",
        telefono: initialUsuario.telefono || "",
        direccion: initialUsuario.direccion || "",
        rol: initialUsuario.rol || null,
        grupo: initialUsuario.grupo || null,
        estado: initialUsuario.estado ?? true,
      });
    }
  }, [initialUsuario]);

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTouched({
      nombre: true,
      correo: true,
      rol: true,
    });

    if (!form.nombre || !form.correo || !form.rol) return;

    const payload = {
      nombre: form.nombre.trim(),
      correo: form.correo.trim(),
      sexo: form.sexo,
      fecha_nacimiento: form.fecha_nacimiento || null,
      telefono: form.telefono.trim() || null,
      direccion: form.direccion.trim() || null,
      rol: form.rol,
      grupo: form.grupo,
      estado: form.estado,
    };

    // Solo incluir contraseña si se está creando (no editando) o si se cambió
    if (!editMode || form.password.trim()) {
      if (!form.password.trim()) {
        alert("La contraseña es requerida");
        return;
      }
      payload.password = form.password.trim();
    }

    onSubmit(payload);
  }

  const invalid = {
    nombre: touched.nombre && !form.nombre,
    correo: touched.correo && !form.correo,
    rol: touched.rol && !form.rol,
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
            placeholder="correo@ejemplo.com"
          />
          {editMode && (
            <p className="text-sm text-gray-500 mt-1">
              El correo no se puede modificar en modo edición
            </p>
          )}
        </Field>

        {/* Contraseña */}
        <Field label={editMode ? "Nueva Contraseña (opcional)" : "Contraseña *"}>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setField("password", e.target.value)}
            disabled={loading}
            required={!editMode}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder={editMode ? "Dejar vacío para no cambiar" : "Ingrese la contraseña"}
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

        {/* Rol */}
        <Field
          label="Rol *"
          error={invalid.rol && "Este campo es requerido"}
        >
          <select
            value={form.rol || ""}
            onChange={(e) => setField("rol", e.target.value || null)}
            onBlur={() => setTouched((t) => ({ ...t, rol: true }))}
            required
            disabled={loading}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
              invalid.rol ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">-- Seleccionar rol --</option>
            {rolesOptions.map((rol) => (
              <option key={rol.id} value={rol.id}>
                {rol.nombre}
              </option>
            ))}
          </select>
        </Field>

        {/* Grupo */}
        <Field label="Grupo/Clínica">
          <select
            value={form.grupo || ""}
            onChange={(e) => setField("grupo", e.target.value || null)}
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            <option value="">-- Sin grupo asignado --</option>
            {gruposOptions.map((grupo) => (
              <option key={grupo.id} value={grupo.id}>
                {grupo.nombre}
              </option>
            ))}
          </select>
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

      {/* Estado (solo en edición) */}
      {editMode && (
        <Field label="Estado">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={form.estado}
              onChange={(e) => setField("estado", e.target.checked)}
              disabled={loading}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Usuario activo</span>
          </label>
        </Field>
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
            loading || !form.nombre || !form.correo || !form.rol
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
            "Crear Usuario"
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