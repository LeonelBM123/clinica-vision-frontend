import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/form_patologias.css";

export default function CrearPaciente() {
  const [form, setForm] = useState({
    paciente: "", // ID del usuario relacionado
    numero_historia_clinica: "",
    alergias_medicamentos: "",
    antecedentes_oculares: "",
    agudeza_visual_derecho: "",
    agudeza_visual_izquierdo: "",
    presion_intraocular_derecho: "",
    presion_intraocular_izquierdo: "",
    diagnostico_ocular: "",
    estado: true,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/pacientes/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Error al registrar el paciente");
      }
      navigate("/AdminLayout/pacientes");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="paciente-form-page">
      <div className="pf-header">
        <h2>Registrar Nuevo Paciente</h2>
        <button
          type="button"
          className="pf-btn pf-btn-secondary"
          onClick={() => navigate(-1)}
        >
          Volver
        </button>
      </div>

      <form className="pf-form" onSubmit={handleSubmit} noValidate>
        <div className="pf-grid">
          <div className="pf-field">
            <label htmlFor="paciente">Usuario *</label>
            <input
              id="paciente"
              type="number"
              name="paciente"
              value={form.paciente}
              onChange={handleChange}
              required
              placeholder="ID del usuario"
            />
          </div>

          <div className="pf-field">
            <label htmlFor="numero_historia_clinica">N° Historia Clínica *</label>
            <input
              id="numero_historia_clinica"
              type="text"
              name="numero_historia_clinica"
              value={form.numero_historia_clinica}
              onChange={handleChange}
              required
              maxLength={64}
            />
          </div>

          <div className="pf-field pf-field-full">
            <label htmlFor="alergias_medicamentos">Alergias a medicamentos</label>
            <textarea
              id="alergias_medicamentos"
              name="alergias_medicamentos"
              value={form.alergias_medicamentos}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="pf-field pf-field-full">
            <label htmlFor="antecedentes_oculares">Antecedentes oftalmológicos</label>
            <textarea
              id="antecedentes_oculares"
              name="antecedentes_oculares"
              value={form.antecedentes_oculares}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="pf-field">
            <label htmlFor="agudeza_visual_derecho">Agudeza visual (derecho)</label>
            <input
              id="agudeza_visual_derecho"
              type="text"
              name="agudeza_visual_derecho"
              value={form.agudeza_visual_derecho}
              onChange={handleChange}
            />
          </div>

          <div className="pf-field">
            <label htmlFor="agudeza_visual_izquierdo">Agudeza visual (izquierdo)</label>
            <input
              id="agudeza_visual_izquierdo"
              type="text"
              name="agudeza_visual_izquierdo"
              value={form.agudeza_visual_izquierdo}
              onChange={handleChange}
            />
          </div>

          <div className="pf-field">
            <label htmlFor="presion_intraocular_derecho">Presión intraocular (derecho)</label>
            <input
              id="presion_intraocular_derecho"
              type="number"
              step="0.01"
              name="presion_intraocular_derecho"
              value={form.presion_intraocular_derecho}
              onChange={handleChange}
            />
          </div>

          <div className="pf-field">
            <label htmlFor="presion_intraocular_izquierdo">Presión intraocular (izquierdo)</label>
            <input
              id="presion_intraocular_izquierdo"
              type="number"
              step="0.01"
              name="presion_intraocular_izquierdo"
              value={form.presion_intraocular_izquierdo}
              onChange={handleChange}
            />
          </div>

          <div className="pf-field pf-field-full">
            <label htmlFor="diagnostico_ocular">Diagnóstico ocular</label>
            <textarea
              id="diagnostico_ocular"
              name="diagnostico_ocular"
              value={form.diagnostico_ocular}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="pf-field pf-field-checkbox">
            <label>
              <input
                type="checkbox"
                name="estado"
                checked={form.estado}
                onChange={handleChange}
              />
              Activo
            </label>
          </div>
        </div>

        {error && <div className="pf-alert pf-alert-error">{error}</div>}

        <div className="pf-actions">
          <button
            type="button"
            className="pf-btn pf-btn-secondary"
            onClick={() => navigate("/AdminLayout/pacientes")}
            disabled={loading}
          >
            Cancelar
          </button>
          <button type="submit" className="pf-btn" disabled={loading}>
            {loading ? "Guardando..." : "Registrar"}
          </button>
        </div>
      </form>
    </div>
  );
}
