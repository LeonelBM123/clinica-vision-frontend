import React from 'react';
import GestionarList from '../components/GestionarList';
import "../styles/0x_GestionarMedico.css";

export default function GestionarMedico() {
  const columns = [
    { 
      key: 'medico', 
      label: 'ID', 
      sortable: true,
      width: '80px'
    },
    { 
      key: 'info_medico.nombre', 
      label: 'Nombre', 
      sortable: true 
    },
    { 
      key: 'info_medico.correo', 
      label: 'Correo', 
      sortable: true 
    },
    { 
      key: 'info_medico.telefono', 
      label: 'Teléfono', 
      sortable: true 
    },
    { 
      key: 'especialidades_nombres', 
      label: 'Especialidades', 
      sortable: false,
      render: (value) => value?.join(', ') || 'Sin especialidades'
    }
  ];

  const handleEdit = (medico) => {
    console.log('Editar médico:', medico);
    // Tu lógica de edición aquí
  };

  const handleDelete = (medico) => {
    if (window.confirm(`¿Eliminar al médico ${medico.info_medico.nombre}?`)) {
      console.log('Eliminar médico:', medico);
      // Tu lógica de eliminación aquí
    }
  };

  const handleAdd = () => {
    console.log('Agregar nuevo médico');
    // Tu lógica para agregar aquí
  };

  return (
    <div className="gestionar-medico-container">
      <GestionarList
        apiUrl="http://127.0.0.1:8000/api/medicos"
        title="Gestión de Médicos"
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />
    </div>
  );
}