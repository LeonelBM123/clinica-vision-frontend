import React from 'react';
import "../styles/0x_GestionarMedico.css";

export default function GestionarMedico() {
  return (
    <div className="gestionar-medico-container">
      <h2>Gestión de Médicos</h2>
      <p>Esta es la pantalla para gestionar los médicos del sistema.</p>
      
      <div className="medico-actions">
        <button className="btn btn-primary">Agregar Médico</button>
        <button className="btn btn-secondary">Listar Médicos</button>
      </div>
    </div>
  );
}