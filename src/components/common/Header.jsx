import React, { useState } from 'react';
import './styles/Header.css';
import { useNavigate } from "react-router-dom";



export default function Header({ title, userName }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleEditProfile = () => {
    console.log("Editar perfil");
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
  try {
    const token = localStorage.getItem("token"); // o donde lo estés guardando
    if (!token) {
      console.error("No hay token disponible");
      return;
    }

    const response = await fetch("http://127.0.0.1:7000/api/usuarios/logout/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`,
      },  
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data.message);

      //Borra token e info de usuario
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      navigate("/");
    } else {
      const errorData = await response.json();
      console.error("Error en logout:", errorData);
    }
  } catch (error) {
    console.error("Error en conexión:", error);
  }

  setIsMenuOpen(false);
};


  return (
    <header className="header-container">
      <div className="header-left">
        <h1 className="header-title">{title}</h1>
      </div>
      
      <div className="header-right">
        <span className="welcome-text">Bienvenido {userName}</span>
        
        <div className="dropdown">
          <button className="header-button" onClick={toggleMenu}>
            Opciones
            <span className={`dropdown-arrow ${isMenuOpen ? 'open' : ''}`}>▼</span>
          </button>
          
          {isMenuOpen && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={handleEditProfile}>
                Editar perfil
              </button>
              <button className="dropdown-item" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}