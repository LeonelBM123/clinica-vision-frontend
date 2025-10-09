import React from "react";
import GestionarList from "../../components/GestionarList";
import "../../styles/0x_GestionarMedico.css";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";

export default function GestionarUsuarios() {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = React.useState(0);

  const columns = [
    { key: "id", label: "ID", sortable: true, width: "80px" },
    { key: "nombre", label: "Nombre Completo", sortable: true },
    { key: "correo", label: "Correo", sortable: true },
    { key: "telefono", label: "Teléfono", sortable: false },
    { key: "rol_nombre", label: "Rol", sortable: false },
    { key: "estado", label: "Estado", sortable: true, render: (value) => value ? "Activo" : "Inactivo" },
    { key: "fecha_registro", label: "Fecha Registro", sortable: true, render: (value) => new Date(value).toLocaleDateString() },
  ];

  const handleEdit = (usuario) => {
    navigate(`/AdminLayout/usuarios/${usuario.id}/editar`);
  };

  const handleDelete = async (usuario) => {
    if (!window.confirm(`¿Eliminar al usuario ${usuario.nombre}?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}api/acounts/usuarios/${usuario.id}/`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error eliminando usuario");
      setRefreshKey(k => k + 1);
    } catch (e) {
      alert(e.message);
    }
  };

  const handleAdd = () => {
    navigate("/AdminLayout/usuarios/crear");
  };

  return (
    <div className="gestionar-usuario-container">
      <GestionarList
        apiUrl={`${API_BASE_URL}api/acounts/usuarios`}
        title="Gestión de Usuarios"
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        refreshKey={refreshKey}
      />
    </div>
  );
}