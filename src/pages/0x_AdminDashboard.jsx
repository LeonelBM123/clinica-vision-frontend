import React from 'react';
import "../styles/0x_AdminDashboard.css";

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <h1>Panel de Administración</h1>
      <p>Bienvenido al sistema de administración de la clínica.</p>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Médicos registrados</h3>
          <p className="stat-number">25</p>
        </div>
        <div className="stat-card">
          <h3>Pacientes activos</h3>
          <p className="stat-number">142</p>
        </div>
        <div className="stat-card">
          <h3>Citas hoy</h3>
          <p className="stat-number">18</p>
        </div>
      </div>
    </div>
  );
}