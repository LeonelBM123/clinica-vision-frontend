import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/form_patologias.css";

export default function EditarPaciente() {
  const { id } = useParams(); // ID del paciente
  const navigate = useNavigate();

  const [form, setForm] = useState({
    paciente: "", // ID del usuario
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
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  // Cargar datos existentes del paciente
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError("");
        const res = await fetch(`http://127.0.0.1:8000/api/pacientes/${id}/`);
        if (!res.ok) throw new Error("No se pudo cargar el paciente");
        const data = await res.json();
        setForm({
          paciente: data.paciente || "",
          numero_historia_clinica: data.numero_historia_clinica || "",
          alergias_medicamentos: data.alergias_medicamentos || "",
          antecedentes_oculares: data.antecedentes_oculares || "",
          agudeza_visual_derecho: data.agudeza_visual_derecho || "",
          agudeza_visual_izquierdo: data.agudeza_visual_izquierdo || "",
          presion_intraocular_derecho: data.presion_intraocular_derecho || "",
          presion_intraocular_izquierdo: data.presion_intraocular_izquierdo || "",
          diagnostico_ocular: data.diagnostico_ocular || "",
          estado: data.estado ?? true,
        });
      } catch (e) {
        setError(e.message);
      } finally {
        setCargando(false);
      }
    };
    fetchData();
  }, [id]);

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
    setGuardando(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/pacientes/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Error al actualizar paciente");
      }
      navigate("/AdminLayout/pacientes");
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <div className="paciente-form-page"><p>Cargando...</p></div>;

  return (
    <div className="paciente-form-page">
      <div className="pf-header">
        <h2>Editar Paciente #{id}</h2>
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
            <label htmlFor="paciente">Usuario (ID)</label>
            <input
              id="paciente"
              name="paciente"
              type="number"
              value={form.paciente}
              onChange={handleChange}
              required
            />
          </div>

          <div className="pf-field">
            <label htmlFor="numero_historia_clinica">N° Historia Clínica *</label>
            <input
              id="numero_historia_clinica"
              name="numero_historia_clinica"
              type="text"
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
            />
          </div>

          <div className="pf-field pf-field-full">
            <label htmlFor="antecedentes_oculares">Antecedentes oftalmológicos</label>
            <textarea
              id="antecedentes_oculares"
              name="antecedentes_oculares"
              value={form.antecedentes_oculares}
              onChange={handleChange}
            />
          </div>

          <div className="pf-field">
            <label htmlFor="agudeza_visual_derecho">Agudeza ojo derecho</label>
            <input
              id="agudeza_visual_derecho"
              name="agudeza_visual_derecho"
              type="text"
              value={form.agudeza_visual_derecho}
              onChange={handleChange}
            />
          </div>

          <div className="pf-field">
            <label htmlFor="agudeza_visual_izquierdo">Agudeza ojo izquierdo</label>
            <input
              id="agudeza_visual_izquierdo"
              name="agudeza_visual_izquierdo"
              type="text"
              value={form.agudeza_visual_izquierdo}
              onChange={handleChange}
            />
          </div>

          <div className="pf-field">
            <label htmlFor="presion_intraocular_derecho">PIO ojo derecho</label>
            <input
              id="presion_intraocular_derecho"
              name="presion_intraocular_derecho"
              type="number"
              step="0.01"
              value={form.presion_intraocular_derecho}
              onChange={handleChange}
            />
          </div>

          <div className="pf-field">
            <label htmlFor="presion_intraocular_izquierdo">PIO ojo izquierdo</label>
            <input
              id="presion_intraocular_izquierdo"
              name="presion_intraocular_izquierdo"
              type="number"
              step="0.01"
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
            disabled={guardando}
          >
            Cancelar
          </button>
          <button type="submit" className="pf-btn" disabled={guardando}>
            {guardando ? "Guardando..." : "Actualizar"}
          </button>
        </div>
      </form>
    </div>
  );
}
