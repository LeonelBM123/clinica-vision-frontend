import React, { useEffect, useState } from "react";

export default function PacienteForm({
  initialPaciente = null,
  usuariosOptions = [],
  patologiasOptions = [],
  onSubmit,
  onCancel,
  loading = false,
  isEditMode = false,
}) {
  const editMode = !!initialPaciente && isEditMode;

  const [form, setForm] = useState({
    usuario: null,
    numero_historia_clinica: "",
    patologias: [],
    agudeza_visual_derecho: "",
    agudeza_visual_izquierdo: "",
    presion_ocular_derecho: "",
    presion_ocular_izquierdo: "",
  });

  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialPaciente) {
      setForm({
        usuario: initialPaciente.usuario || null,
        numero_historia_clinica: initialPaciente.numero_historia_clinica || "",
        patologias: initialPaciente.patologias || [],
        agudeza_visual_derecho: initialPaciente.agudeza_visual_derecho || "",
        agudeza_visual_izquierdo: initialPaciente.agudeza_visual_izquierdo || "",
        presion_ocular_derecho: initialPaciente.presion_ocular_derecho || "",
        presion_ocular_izquierdo: initialPaciente.presion_ocular_izquierdo || "",
      });
    }
  }, [initialPaciente]);

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  function togglePatologia(id) {
    setForm((f) => ({
      ...f,
      patologias: f.patologias.includes(id)
        ? f.patologias.filter((x) => x !== id)
        : [...f.patologias, id],
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTouched({
      usuario: true,
    });

    if (!form.usuario) {
      alert("Debe seleccionar un usuario");
      return;
    }

    const payload = {
      usuario: form.usuario,
      numero_historia_clinica: form.numero_historia_clinica.trim() || undefined,
      patologias: form.patologias,
      agudeza_visual_derecho: form.agudeza_visual_derecho || undefined,
      agudeza_visual_izquierdo: form.agudeza_visual_izquierdo || undefined,
      presion_ocular_derecho: form.presion_ocular_derecho || undefined,
      presion_ocular_izquierdo: form.presion_ocular_izquierdo || undefined,
    };

    onSubmit(payload);
  }

  const invalid = {
    usuario: touched.usuario && !form.usuario,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Usuario */}
        <Field
          label="Usuario *"
          error={invalid.usuario && "Debe seleccionar un usuario"}
        >
          <select
            value={form.usuario || ""}
            onChange={(e) => setField("usuario", e.target.value || null)}
            onBlur={() => setTouched((t) => ({ ...t, usuario: true }))}
            disabled={loading || editMode}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
              invalid.usuario ? "border-red-500" : "border-gray-300"
            } ${editMode ? "bg-gray-100" : ""}`}
          >
            <option value="">-- Seleccionar usuario --</option>
            {usuariosOptions.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nombre} — {u.correo}
              </option>
            ))}
          </select>
          {editMode && (
            <p className="text-sm text-gray-500 mt-1">
              El usuario no se puede cambiar en modo edición
            </p>
          )}
        </Field>

        {/* N° Historia Clínica */}
        <Field label="N° Historia Clínica">
          <input
            value={form.numero_historia_clinica}
            onChange={(e) => setField("numero_historia_clinica", e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Ej: HC-2023-0001"
            maxLength={64}
          />
        </Field>

        {/* Agudeza Visual Derecho */}
        <Field label="Agudeza Visual Derecho">
          <input
            value={form.agudeza_visual_derecho}
            onChange={(e) => setField("agudeza_visual_derecho", e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Ej: 20/20"
            maxLength={20}
          />
        </Field>

        {/* Agudeza Visual Izquierdo */}
        <Field label="Agudeza Visual Izquierdo">
          <input
            value={form.agudeza_visual_izquierdo}
            onChange={(e) => setField("agudeza_visual_izquierdo", e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Ej: 20/20"
            maxLength={20}
          />
        </Field>

        {/* Presión Ocular Derecho */}
        <Field label="Presión Ocular Derecho">
          <input
            type="number"
            step="0.01"
            value={form.presion_ocular_derecho}
            onChange={(e) => setField("presion_ocular_derecho", e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Ej: 15.50"
          />
        </Field>

        {/* Presión Ocular Izquierdo */}
        <Field label="Presión Ocular Izquierdo">
          <input
            type="number"
            step="0.01"
            value={form.presion_ocular_izquierdo}
            onChange={(e) => setField("presion_ocular_izquierdo", e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Ej: 15.50"
          />
        </Field>
      </div>

      {/* Patologías */}
      <Field label="Patologías">
        <div className="space-y-3">
          {form.patologias.length > 0 ? (
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border">
              {form.patologias.map((patId) => {
                const patologia = patologiasOptions.find((p) => p.id === patId);
                return (
                  <span
                    key={patId}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                  >
                    {patologia?.nombre || `ID: ${patId}`}
                    <button
                      type="button"
                      onClick={() => togglePatologia(patId)}
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
              No se han seleccionado patologías
            </div>
          )}

          <div className="border border-gray-300 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
            {patologiasOptions.length === 0 ? (
              <div className="p-3 text-sm text-gray-500">No hay patologías disponibles</div>
            ) : (
              patologiasOptions.map((p) => (
                <label
                  key={p.id}
                  className={`flex items-center space-x-3 p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    form.patologias.includes(p.id) ? "bg-blue-50" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.patologias.includes(p.id)}
                    onChange={() => togglePatologia(p.id)}
                    disabled={loading}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-medium text-sm">{p.nombre}</span>
                    {p.gravedad && (
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        p.gravedad === 'CRITICA' ? 'bg-red-100 text-red-800' :
                        p.gravedad === 'GRAVE' ? 'bg-orange-100 text-orange-800' :
                        p.gravedad === 'MODERADA' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {p.gravedad}
                      </span>
                    )}
                  </div>
                </label>
              ))
            )}
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
          disabled={loading || !form.usuario}
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
            "Crear Paciente"
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
