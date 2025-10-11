import { useEffect, useState } from "react";

export default function PatologiaForm({
  initialPatologia = null,
  onSubmit,
  onCancel,
  loading = false
}) {
  const editMode = !!initialPatologia;
  const [form, setForm] = useState({
    nombre: "",
    alias: "",
    gravedad: "LEVE",
    descripcion: ""
  });
  const [touched, setTouched] = useState({});

  const gravedadOptions = [
    { value: "LEVE", label: "Leve" },
    { value: "MODERADA", label: "Moderada" },
    { value: "GRAVE", label: "Grave" },
    { value: "CRITICA", label: "Crítica" }
  ];

  useEffect(() => {
    if (initialPatologia) {
      setForm({
        nombre: initialPatologia.nombre || "",
        alias: initialPatologia.alias || "",
        gravedad: initialPatologia.gravedad || "LEVE",
        descripcion: initialPatologia.descripcion || ""
      });
    } else {
      setForm({
        nombre: "",
        alias: "",
        gravedad: "LEVE",
        descripcion: ""
      });
    }
  }, [initialPatologia]);

  function setField(name, value) {
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTouched({
      nombre: true,
      gravedad: true
    });
    if (!form.nombre || !form.gravedad) return;

    const payload = {
      nombre: form.nombre.trim(),
      alias: form.alias.trim(),
      gravedad: form.gravedad,
      descripcion: form.descripcion.trim(),
      isEdit: editMode,
      id: initialPatologia?.id
    };
    onSubmit(payload);
  }

  const invalid = {
    nombre: touched.nombre && !form.nombre,
    gravedad: touched.gravedad && !form.gravedad
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field
          label="Nombre *"
          error={invalid.nombre && "Este campo es requerido"}
          children={
            <input
              value={form.nombre}
              onChange={e => setField("nombre", e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, nombre: true }))}
              required
              disabled={loading}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                invalid.nombre ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ingrese el nombre de la patología"
              maxLength={120}
            />
          }
        />

        <Field
          label="Alias"
          children={
            <input
              value={form.alias}
              onChange={e => setField("alias", e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Nombre común o alternativo"
              maxLength={120}
            />
          }
        />

        <Field
          label="Gravedad *"
          error={invalid.gravedad && "Seleccione una gravedad"}
          children={
            <select
              value={form.gravedad}
              onChange={e => setField("gravedad", e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, gravedad: true }))}
              required
              disabled={loading}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                invalid.gravedad ? "border-red-500" : "border-gray-300"
              }`}
            >
              {gravedadOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          }
        />

        <Field
          label="Descripción"
          children={
            <textarea
              value={form.descripcion}
              onChange={e => setField("descripcion", e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
              placeholder="Descripción detallada de la patología"
              rows={3}
            />
          }
        />
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
          disabled={loading || !form.nombre || !form.gravedad}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
              Guardando...
            </>
          ) : editMode ? "Guardar Cambios" : "Crear Patología"}
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
