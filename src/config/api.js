// src/config/api.js
// Configuración de URL del backend

// 🔧 CAMBIA AQUÍ PARA USAR LOCAL O PRODUCCIÓN:

// Para desarrollo local: descomenta la línea de abajo
// const API_BASE_URL = "http://localhost:8000/";

// Para producción: usa esta línea


// const API_BASE_URL = "https://clinica-backend-b8m9.onrender.com/";
const API_BASE_URL = "http://127.0.0.1:8000/";


export { API_BASE_URL };

// 📝 INSTRUCCIONES DE USO:
// 1. Para usar tu backend local: descomenta la línea local y comenta la de producción
// 2. Para usar producción: mantén comentada la línea local y activa la de producción
// 
// Ejemplo de uso en tus componentes:
// import { API_BASE_URL } from '../config/api';
// fetch(`${API_BASE_URL}api/patologias/`)
// fetch(`${API_BASE_URL}api/pacientes/`)
// fetch(`${API_BASE_URL}api/citas-medicas/`)