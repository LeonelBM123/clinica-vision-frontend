import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/form_patologias.css";
import { API_BASE_URL } from "../../config/api";

export default function EditarUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    sexo: "M",
    fecha_nacimiento: "",
    telefono: "",
    direccion: "",
    rol: "",
    estado: true,
  });
  const [roles, setRoles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

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

  // Cargar datos del usuario
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError("");
        const res = await fetch(`${API_BASE_URL}api/acounts/usuarios/${id}/`);
        if (!res.ok) throw new Error("No se pudo cargar el usuario");
        const data = await res.json();
        setForm({
          nombre: data.nombre || "",
          correo: data.correo || "",
          sexo: data.sexo || "M",
          fecha_nacimiento: data.fecha_nacimiento || "",
          telefono: data.telefono || "",
          direccion: data.direccion || "",
          rol: data.rol || "",
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
      const res = await fetch(`${API_BASE_URL}api/acounts/usuarios/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Error al actualizar");
      }
      navigate("/AdminLayout/usuarios");
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <div className="patologia-form-page"><p>Cargando...</p></div>;

  return (
    <div className="patologia-form-page">
      <div className="pf-header">
        <h2>Editar Usuario #{id}</h2>
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
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              maxLength={128}
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