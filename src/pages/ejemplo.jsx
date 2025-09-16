import React, { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";


function ejemplo() {
    const navigate = useNavigate();
    return (
        <div>
            <h1>Esto es un ejemplo</h1>
        </div>
    );
}

export default ejemplo