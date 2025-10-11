import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import Container from "../components/common/Container";
import Footer from "../components/common/Footer";
import authService from '../services/auth';
import "../styles/AdminLayout.css";

// Función para obtener el menú según el rol del usuario
const getMenuPackagesByRole = () => {
  const currentUser = authService.getCurrentUser();
  const rol = currentUser?.rol?.toLowerCase();

  // Menú base para todos
  const baseMenu = [
    {
      name: "Dashboard",
      items: [
        { label: "Panel Principal", path: "", icon: "🏠" },
      ]
    },
    {
      name: "Gestión de Pacientes",
      items: [
        { label: "Gestionar Pacientes", path: "pacientes", icon: "👥" },
        { label: "Historial Clínico", path: "historial-clinico", icon: "📋" },
      ]
    }
  ];

  // Menú específico según rol
  if (rol === 'superadmin') {
    // SuperAdmin ve todo
    return [
      ...baseMenu,
      {
        name: "Gestión del Sistema",
        items: [
          { label: "Gestionar Grupos", path: "grupos", icon: "🏢" },
          { label: "Gestionar Usuarios", path: "usuarios", icon: "👤" },
          { label: "Gestionar Médicos", path: "gestionar-medico", icon: "👩‍⚕️" },
          { label: "Gestionar Patologías", path: "patologias", icon: "🏥" },
          { label: "Ver Bitácora", path: "bitacora", icon: "📊" },
        ]
      },
      {
        name: "Reportes y Configuración",
        items: [
          { label: "Reportes Globales", path: "reportes-globales", icon: "📈" },
          { label: "Configuración Global", path: "configuracion-global", icon: "⚙️" },
        ]
      }
    ];
  } 
  else if (rol === 'administrador') {
    // Admin ve gestión de su grupo
    return [
      ...baseMenu,
      {
        name: "Gestión de Usuarios",
        items: [
          { label: "Gestionar Usuarios", path: "usuarios", icon: "👤" },
          { label: "Gestionar Médicos", path: "gestionar-medico", icon: "👩‍⚕️" },
          { label: "Ver Bitácora", path: "bitacora", icon: "📊" },
        ]
      },
      {
        name: "Configuración Clínica",
        items: [
          { label: "Gestionar Patologías", path: "patologias", icon: "🏥" },
          { label: "Solicitar Cita", path: "solicitar-cita", icon: "📅" },
        ]
      },
      {
        name: "Inventario",
        items: [
          { label: "Medicamentos", path: "medicamentos", icon: "💊" },
          { label: "Equipos Médicos", path: "equipos-medicos", icon: "🔬" },
          { label: "Suministros", path: "suministros", icon: "📦" },
        ]
      },
      {
        name: "Reportes",
        items: [
          { label: "Reporte de Citas", path: "reporte-citas", icon: "📋" },
          { label: "Reporte Financiero", path: "reporte-financiero", icon: "💰" },
        ]
      }
    ];
  } 
  else if (rol === 'medico') {
    // Médico solo ve funciones médicas
    return [
      ...baseMenu,
      {
        name: "Funciones Médicas",
        items: [
          { label: "Solicitar Cita", path: "solicitar-cita", icon: "📅" },
          { label: "Ver Bitácora", path: "bitacora", icon: "📊" },
        ]
      }
    ];
  }

  // Fallback para roles no definidos
  return baseMenu;
};

export default function AdminLayout() {
  const currentUser = authService.getCurrentUser();
  const menuPackages = getMenuPackagesByRole();

  return (
    <div className="AdminLayout-container">
      <Header 
        title={currentUser?.grupo_nombre || "Visionex"} 
        userName={currentUser?.correo || "Usuario"} 
      />
      <Sidebar menuPackages={menuPackages} />
      <Container>
        <Outlet />
      </Container>
      <Footer />
    </div>
  );
}