import { useEffect, useState } from "react";

export default function TratamientoForm({
  initialTratamiento = null,
  patologiasOptions = [],
  onSubmit,
  onCancel,
  loading = false
}) {
  const editMode = !!initialTratamiento;
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    duracion_dias: "",
    patologias: []
  });
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialTratamiento) {
      setForm({
        nombre: initialTratamiento.nombre || "",
        descripcion: initialTratamiento.descripcion || "",
        duracion_dias: initialTratamiento.duracion_dias || "",
        patologias: (initialTratamiento.patologias || []).map(Number)
      });
    } else {
      setForm({
        nombre: "",
        descripcion: "",
        duracion_dias: "",
        patologias: []
      });
    }
  }, [initialTratamiento]);

  function setField(name, value) {
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTouched({
      nombre: true,
      duracion_dias: true
    });
    if (!form.nombre || !form.duracion_dias) return;

    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      duracion_dias: Number(form.duracion_dias),
      patologias: form.patologias.map(id => Number(id)),
      isEdit: editMode,
      id: initialTratamiento?.id
    };
    onSubmit(payload);
  }

  const invalid = {
    nombre: touched.nombre && !form.nombre,
    duracion_dias: touched.duracion_dias && !form.duracion_dias
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
              placeholder="Ingrese el nombre del tratamiento"
              maxLength={120}
            />
          }
        />

        <Field
          label="Duración (días) *"
          error={invalid.duracion_dias && "Este campo es requerido"}
          children={
            <input
              type="number"
              min={1}
              value={form.duracion_dias}
              onChange={e => setField("duracion_dias", e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, duracion_dias: true }))}
              required
              disabled={loading}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                invalid.duracion_dias ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ejemplo: 15"
            />
          }
        />

        <Field
          label="Patologías asociadas"
          children={
            patologiasOptions.length === 0 && loading ? (
              <div className="flex items-center gap-2 py-2 text-blue-600">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-blue-600"></div>
                <span>Cargando patologías...</span>
              </div>
            ) : (
              <div className="space-y-2">
                {patologiasOptions.map(p => {
                  const id = Number(p.id);
                  const checked = form.patologias.map(Number).includes(id);
                  return (
                    <label key={id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={id}
                        checked={checked}
                        onChange={e => {
                          let newPatologias = new Set(form.patologias.map(Number));
                          if (e.target.checked) {
                            newPatologias.add(id);
                          } else {
                            newPatologias.delete(id);
                          }
                          setField("patologias", Array.from(newPatologias));
                        }}
                        disabled={loading}
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <span className="text-gray-700">{p.nombre}</span>
                    </label>
                  );
                })}
              </div>
            )
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
              placeholder="Descripción detallada del tratamiento"
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
          disabled={loading || !form.nombre || !form.duracion_dias}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
              Guardando...
            </>
          ) : editMode ? "Guardar Cambios" : "Crear Tratamiento"}
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