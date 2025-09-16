import React, { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";


function MedicoLayout() {
    const navigate = useNavigate();
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <h1>Layout Medico</h1>
        </div>
    );
}

export default MedicoLayout