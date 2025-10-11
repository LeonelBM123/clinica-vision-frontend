import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/0x_GestionarMedico.css";
import { API_BASE_URL } from "../../config/api";

export default function CrearPaciente() {
  const [form, setForm] = useState({
    // Datos del usuario (se creará automáticamente)
    nombre: "",
    correo: "",
    password: "",
    sexo: "M",
    fecha_nacimiento: "",
    telefono: "",
    direccion: "",
    // Datos del paciente
    numero_historia_clinica: "",
    patologias: [], // Array de IDs de patologías
    agudeza_visual_derecho: "",
    agudeza_visual_izquierdo: "",
    presion_ocular_derecho: "",
    presion_ocular_izquierdo: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [patologias, setPatologias] = useState([]);
  const navigate = useNavigate();

  const sexoOpciones = [
    { value: "M", label: "Masculino" },
    { value: "F", label: "Femenino" }
  ];

  // Cargar patologías disponibles
  useEffect(() => {
    const fetchPatologias = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}api/acounts/patologias/`);
        if (res.ok) {
          const data = await res.json();
          setPatologias(data);
        }
      } catch (err) {
        console.error("Error cargando patologías:", err);
      }
    };
    fetchPatologias();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "patologias") {
      // Manejar selección múltiple de patologías
      const patologiaId = parseInt(value);
      setForm({
        ...form,
        patologias: checked 
          ? [...form.patologias, patologiaId]
          : form.patologias.filter(id => id !== patologiaId)
      });
    } else {
      setForm({
        ...form,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Paso 1: Crear el usuario con rol PACIENTE
      const usuarioPayload = {
        nombre: form.nombre,
        correo: form.correo,
        password: form.password,
        sexo: form.sexo,
        fecha_nacimiento: form.fecha_nacimiento,
        telefono: form.telefono,
        direccion: form.direccion,
        rol: 1, // Asumiendo que el rol PACIENTE tiene ID 1 (ajusta según tu BD)
        estado: true,
      };

      const usuarioRes = await fetch(`${API_BASE_URL}api/acounts/usuarios/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuarioPayload),
      });

      if (!usuarioRes.ok) {
        const txt = await usuarioRes.text();
        throw new Error(`Error creando usuario: ${txt}`);
      }

      const usuarioData = await usuarioRes.json();

      // Paso 2: Crear el paciente
      const pacientePayload = {
        usuario: usuarioData.id,
        numero_historia_clinica: form.numero_historia_clinica,
        patologias: form.patologias,
        agudeza_visual_derecho: form.agudeza_visual_derecho,
        agudeza_visual_izquierdo: form.agudeza_visual_izquierdo,
        presion_ocular_derecho: parseFloat(form.presion_ocular_derecho) || null,
        presion_ocular_izquierdo: parseFloat(form.presion_ocular_izquierdo) || null,
      };

      const pacienteRes = await fetch(`${API_BASE_URL}api/pacientes/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pacientePayload),
      });

      if (!pacienteRes.ok) {
        const txt = await pacienteRes.text();
        throw new Error(`Error creando paciente: ${txt}`);
      }

      navigate("/AdminLayout/pacientes");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


return (
  <div className="gestionar-medico-container">
    <div className="list-header">
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
          {/* Datos del usuario */}
          <div className="pf-field">
            <label htmlFor="nombre">Nombre Completo *</label>
            <input
              id="nombre"
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              placeholder="Nombre completo del paciente"
            />
          </div>

          <div className="pf-field">
            <label htmlFor="correo">Correo Electrónico *</label>
            <input
              id="correo"
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              required
              placeholder="ejemplo@clinica.com"
            />
          </div>

          <div className="pf-field">
            <label htmlFor="password">Contraseña *</label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Contraseña para el paciente"
            />
          </div>

          <div className="pf-field">
            <label htmlFor="sexo">Sexo *</label>
            <select
              id="sexo"
              name="sexo"
              value={form.sexo}
              onChange={handleChange}
              required
            >
              {sexoOpciones.map((opcion) => (
                <option key={opcion.value} value={opcion.value}>
                  {opcion.label}
                </option>
              ))}
            </select>
          </div>

          <div className="pf-field">
            <label htmlFor="fecha_nacimiento">Fecha de Nacimiento *</label>
            <input
              id="fecha_nacimiento"
              type="date"
              name="fecha_nacimiento"
              value={form.fecha_nacimiento}
              onChange={handleChange}
              required
            />
          </div>

          <div className="pf-field">
            <label htmlFor="telefono">Teléfono</label>
            <input
              id="telefono"
              type="text"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              maxLength={8}
              placeholder="12345678"
            />
          </div>

          <div className="pf-field pf-field-full">
            <label htmlFor="direccion">Dirección</label>
            <textarea
              id="direccion"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              rows={3}
              placeholder="Dirección completa"
            />
          </div>

          {/* Datos específicos del paciente */}
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
              placeholder="HC-2024-0001"
            />
          </div>

          {/* Patologías */}
          <div className="pf-field pf-field-full">
            <label>Patologías Asociadas</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '10px', marginTop: '10px' }}>
              {patologias.map((patologia) => (
                <label key={patologia.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    name="patologias"
                    value={patologia.id}
                    checked={form.patologias.includes(patologia.id)}
                    onChange={handleChange}
                  />
                  <span>{patologia.nombre}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Datos oftalmológicos */}
          <div className="pf-field">
            <label htmlFor="agudeza_visual_derecho">Agudeza Visual (Ojo Derecho)</label>
            <input
              id="agudeza_visual_derecho"
              type="text"
              name="agudeza_visual_derecho"
              value={form.agudeza_visual_derecho}
              onChange={handleChange}
              placeholder="20/20"
            />
          </div>

          <div className="pf-field">
            <label htmlFor="agudeza_visual_izquierdo">Agudeza Visual (Ojo Izquierdo)</label>
            <input
              id="agudeza_visual_izquierdo"
              type="text"
              name="agudeza_visual_izquierdo"
              value={form.agudeza_visual_izquierdo}
              onChange={handleChange}
              placeholder="20/20"
            />
          </div>

          <div className="pf-field">
            <label htmlFor="presion_ocular_derecho">Presión Ocular (Ojo Derecho)</label>
            <input
              id="presion_ocular_derecho"
              type="number"
              step="0.01"
              name="presion_ocular_derecho"
              value={form.presion_ocular_derecho}
              onChange={handleChange}
              placeholder="15.50"
            />
          </div>

          <div className="pf-field">
            <label htmlFor="presion_ocular_izquierdo">Presión Ocular (Ojo Izquierdo)</label>
            <input
              id="presion_ocular_izquierdo"
              type="number"
              step="0.01"
              name="presion_ocular_izquierdo"
              value={form.presion_ocular_izquierdo}
              onChange={handleChange}
              placeholder="15.50"
            />
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
            {loading ? "Guardando..." : "Registrar Paciente"}
          </button>
        </div>
      </form>
  </div>
);
}
