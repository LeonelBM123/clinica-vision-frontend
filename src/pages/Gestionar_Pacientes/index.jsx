import React from "react";
import GestionarList from "../../components/GestionarList";
import "../../styles/0x_GestionarMedico.css";
import { useNavigate } from "react-router-dom";

export default function GestionarPacientes() {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = React.useState(0);

  const columns = [
    { key: "paciente", label: "ID Usuario", sortable: true, width: "80px" },
    { key: "numero_historia_clinica", label: "N° Historia Clínica", sortable: true },
    { key: "alergias_medicamentos", label: "Alergias", sortable: false },
    { key: "antecedentes_oculares", label: "Antecedentes Oculares", sortable: false },
    { key: "agudeza_visual_derecho", label: "Antecedentes Oculares", sortable: false },
    { key: "agudeza_visual_izquierdo", label: "Antecedentes Oculares", sortable: false },
    { key: "presion_intraocular_derecho", label: "Antecedentes Oculares", sortable: false },
    { key: "presion_intraocular_izquierdo", label: "Antecedentes Oculares", sortable: false },
  ];

  const handleEdit = (paciente) => {
    navigate(`/AdminLayout/pacientes/${paciente.id}/editar`);
  };

  const handleDelete = async (paciente) => {
    if (!window.confirm(`¿Eliminar al paciente ${paciente.numero_historia_clinica}?`)) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/pacientes/${paciente.id}/`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error eliminando paciente");
      // recargar lista
      setRefreshKey((k) => k + 1);
    } catch (e) {
      alert(e.message);
    }
  };

  const handleAdd = () => {
    navigate("/AdminLayout/pacientes/crear");
  };

  return (
    <div className="gestionar-pacientes-container">
      <GestionarList
        apiUrl="http://127.0.0.1:8000/api/pacientes"
        title="Gestión de Pacientes"
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        refreshKey={refreshKey}
      />
    </div>
  );
}
