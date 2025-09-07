import React, { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import "../styles/AdminLayaout.css"

function AdminLayout() {
    const navigate = useNavigate();
    const handleNavigation = (section) => {
        navigate(`/AdminLayout/${section}`);
        setActiveSection(section);
        setSidebarOpen(false);
    };
    return (
        <div className="container">
            <header>Clinica Visionex</header>
            <aside>
                <div className="menu-group">
                    <details>
                        <summary>Servicios de Fumigación</summary>
                        <button
                            onClick={() => handleNavigation("solicitar-servicio-fumigacion")}
                        >
                            Solicitar Servicio de Fumigación
                        </button>
                        <button onClick={() => handleNavigation("Calificaciones")}>
                            Calificar Servicio
                        </button>
                    </details>
                    <details>
                        <summary>Pago</summary>
                        <button onClick={() => handleNavigation("listar-pagos-cotizacion")}>
                            Pagar Cotizacion
                        </button>
                        <button onClick={() => handleNavigation("listar-pagos-sesion")}>
                            Pagar Sesion
                        </button>
                    </details>
                </div>
            </aside>
            <main className="main-content">
                <Outlet key={location.pathname} />
            </main>
            <footer></footer>
        </div>
    );
}


export default AdminLayout