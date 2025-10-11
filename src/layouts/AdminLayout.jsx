import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer";
import authService from '../services/auth';

// Los mismos iconos, pero aumentaremos ligeramente su tamaño para mejor visibilidad
import { 
  Home, Users, FileText, Building, UserCircle, Stethoscope, 
  HeartPulse, ClipboardList, PieChart, Settings, Calendar,
  Pill, Box, CreditCard, Eye // Asegúrate de que Eye esté importado para el logo del sidebar
} from 'lucide-react';

const getMenuPackagesByRole = () => {
  const currentUser = authService.getCurrentUser();
  const rol = currentUser?.rol?.toLowerCase();
  const iconSize = 20; // Tamaño de icono consistente

  const baseMenu = [
    {
      name: "Dashboard",
      items: [
        { label: "Panel Principal", path: "", icon: <Home size={iconSize} /> },
      ]
    },
    {
      name: "Gestión de Pacientes",
      items: [
        { label: "Gestionar Pacientes", path: "pacientes", icon: <Users size={iconSize} /> },
        { label: "Historial Clínico", path: "historial-clinico", icon: <FileText size={iconSize} /> },
      ]
    }
  ];

  if (rol === 'superadmin') {
    return [
      ...baseMenu,
      {
        name: "Gestión del Sistema",
        items: [
          { label: "Gestionar Grupos", path: "grupos", icon: <Building size={iconSize} /> },
          { label: "Gestionar Usuarios", path: "usuarios", icon: <UserCircle size={iconSize} /> },
          { label: "Gestionar Médicos", path: "gestionar-medico", icon: <Stethoscope size={iconSize} /> },
          { label: "Gestionar Patologías", path: "patologias", icon: <HeartPulse size={iconSize} /> },
          { label: "Ver Bitácora", path: "bitacora", icon: <ClipboardList size={iconSize} /> },
        ]
      },
      {
        name: "Reportes y Configuración",
        items: [
          { label: "Reportes Globales", path: "reportes-globales", icon: <PieChart size={iconSize} /> },
          { label: "Configuración Global", path: "configuracion-global", icon: <Settings size={iconSize} /> },
        ]
      }
    ];
  } 
  else if (rol === 'administrador') {
    return [
      ...baseMenu,
      {
        name: "Gestión de Usuarios",
        items: [
          { label: "Gestionar Usuarios", path: "usuarios", icon: <UserCircle size={iconSize} /> },
          { label: "Gestionar Médicos", path: "gestionar-medico", icon: <Stethoscope size={iconSize} /> },
          { label: "Ver Bitácora", path: "bitacora", icon: <ClipboardList size={iconSize} /> },
        ]
      },
      {
        name: "Configuración Clínica",
        items: [
          { label: "Gestionar Patologías", path: "patologias", icon: <HeartPulse size={iconSize} /> },
          { label: "Solicitar Cita", path: "solicitar-cita", icon: <Calendar size={iconSize} /> },
        ]
      },
      {
        name: "Inventario",
        items: [
          { label: "Medicamentos", path: "medicamentos", icon: <Pill size={iconSize} /> },
          { label: "Equipos Médicos", path: "equipos-medicos", icon: <Stethoscope size={iconSize} /> },
          { label: "Suministros", path: "suministros", icon: <Box size={iconSize} /> },
        ]
      },
      {
        name: "Reportes",
        items: [
          { label: "Reporte de Citas", path: "reporte-citas", icon: <FileText size={iconSize} /> },
          { label: "Reporte Financiero", path: "reporte-financiero", icon: <CreditCard size={iconSize} /> },
        ]
      }
    ];
  } 
  else if (rol === 'medico') {
    return [
      ...baseMenu,
      {
        name: "Funciones Médicas",
        items: [
          { label: "Solicitar Cita", path: "solicitar-cita", icon: <Calendar size={iconSize} /> },
          { label: "Ver Bitácora", path: "bitacora", icon: <ClipboardList size={iconSize} /> },
        ]
      }
    ];
  }

  return baseMenu;
};

export default function AdminLayout() {
  const currentUser = authService.getCurrentUser();
  const menuPackages = getMenuPackagesByRole();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(open => !open);

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      <Sidebar
        menuPackages={menuPackages}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div className="flex flex-1 flex-col md:ml-64">
        <Header 
          title={currentUser?.grupo_nombre || "Dashboard"} 
          toggleSidebar={toggleSidebar}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}