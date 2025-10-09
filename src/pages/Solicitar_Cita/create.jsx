import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/0x_GestionarMedico.css";

export default function SolicitarCitaMedica() {
  const [form, setForm] = useState({
    paciente: "", // ID del paciente (puede venir de contexto o props)
    bloque_horario: "", // ID del bloque horario
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
    notas: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // TODO: Obtener paciente actual desde contexto/auth
  // TODO: Obtener lista de bloques horarios disponibles desde API
  // Aquí se simula con datos de ejemplo
  const bloquesHorarios = [
    { id: 1, label: "Lunes 08:00-10:00" },
    { id: 2, label: "Martes 10:00-12:00" },
    // ...
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Construimos el payload según el serializer
      const payload = {
        paciente: form.paciente, // ID
        bloque_horario: form.bloque_horario, // ID
        fecha: form.fecha,
        hora_inicio: form.hora_inicio,
        hora_fin: form.hora_fin,
        notas: form.notas,
      };
      const res = await fetch(`${API_BASE_URL}api/citas-medicas/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Error al solicitar la cita");
      }
      navigate("/PacienteLayout");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gestionar-medico-container">
      <div className="list-header">
        <h2>Solicitar Cita Médica</h2>
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
            <label htmlFor="paciente">ID Paciente</label>
            <input
              id="paciente"
              type="text"
              name="paciente"
              value={form.paciente}
              onChange={handleChange}
              required
              placeholder="ID del paciente"
            />
          </div>
          <div className="pf-field">
            <label htmlFor="bloque_horario">Bloque Horario</label>
            <select
              id="bloque_horario"
              name="bloque_horario"
              value={form.bloque_horario}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un bloque</option>
              {bloquesHorarios.map((b) => (
                <option key={b.id} value={b.id}>{b.label}</option>
              ))}
            </select>
          </div>
          <div className="pf-field">
            <label htmlFor="fecha">Fecha</label>
            <input
              id="fecha"
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              required
            />
          </div>
          <div className="pf-field">
            <label htmlFor="hora_inicio">Hora Inicio</label>
            <input
              id="hora_inicio"
              type="time"
              name="hora_inicio"
              value={form.hora_inicio}
              onChange={handleChange}
              required
            />
          </div>
          <div className="pf-field">
            <label htmlFor="hora_fin">Hora Fin</label>
            <input
              id="hora_fin"
              type="time"
              name="hora_fin"
              value={form.hora_fin}
              onChange={handleChange}
              required
            />
          </div>
          <div className="pf-field pf-field-full">
            <label htmlFor="notas">Notas</label>
            <textarea
              id="notas"
              name="notas"
              value={form.notas}
              onChange={handleChange}
              rows={3}
              placeholder="Notas adicionales"
            />
          </div>
        </div>
        {error && <div className="pf-alert pf-alert-error">{error}</div>}
        <div className="pf-actions">
          <button
            type="button"
            className="pf-btn pf-btn-secondary"
            onClick={() => navigate("/PacienteLayout")}
            disabled={loading}
          >
            Cancelar
          </button>
          <button type="submit" className="pf-btn" disabled={loading}>
            {loading ? "Solicitando..." : "Solicitar Cita"}
          </button>
        </div>
      </form>
    </div>
  );
}
