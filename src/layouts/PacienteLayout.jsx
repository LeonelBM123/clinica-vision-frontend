import React, { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";


function PacienteLayout() {
    const navigate = useNavigate();
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <h1>Layout Paciente</h1>
        </div>
    );
}

export default PacienteLayout