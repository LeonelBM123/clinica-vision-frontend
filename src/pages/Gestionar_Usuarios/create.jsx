import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/form_patologias.css";
import { API_BASE_URL } from "../../config/api";

export default function CrearUsuario() {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    password: "",
    sexo: "M",
    fecha_nacimiento: "",
    telefono: "",
    direccion: "",
    rol: "",
    estado: true,
  });
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sexoOpciones = [
    { value: "M", label: "Masculino" },
    { value: "F", label: "Femenino" }
  ];

  // Cargar roles disponibles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}api/acounts/roles/`);
        if (res.ok) {
          const data = await res.json();
          setRoles(data);
        }
      } catch (err) {
        console.error("Error cargando roles:", err);
      }
    };
    fetchRoles();
  }, []);

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
      const res = await fetch(`${API_BASE_URL}api/acounts/usuarios/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Error al registrar el usuario");
      }
      navigate("/AdminLayout/usuarios");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patologia-form-page">
      <div className="pf-header">
        <h2>Registrar Nuevo Usuario</h2>
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
            <label htmlFor="nombre">Nombre Completo *</label>
            <input
              id="nombre"
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              maxLength={128}
              placeholder="Ej: Juan Pérez García"
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
              placeholder="Mínimo 8 caracteres"
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

          <div className="pf-field">
            <label htmlFor="rol">Rol *</label>
            <select
              id="rol"
              name="rol"
              value={form.rol}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un rol</option>
              {roles.map((rol) => (
                <option key={rol.id} value={rol.id}>
                  {rol.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="pf-field pf-field-checkbox">
            <label>
              <input
                type="checkbox"
                name="estado"
                checked={form.estado}
                onChange={handleChange}
              />
              Usuario Activo
            </label>
          </div>
        </div>

        {error && <div className="pf-alert pf-alert-error">{error}</div>}

        <div className="pf-actions">
          <button
            type="button"
            className="pf-btn pf-btn-secondary"
            onClick={() => navigate("/AdminLayout/usuarios")}
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