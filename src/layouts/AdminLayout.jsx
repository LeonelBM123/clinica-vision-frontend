import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import Container from "../components/common/Container";
import Footer from "../components/common/Footer";
import "../styles/AdminLayout.css"

const menuPackages = [
    {
      name: "Gestionar Usuario",
      items: [
        { label: "Gestionar Médico", path: "gestionar-medico", icon: "👨‍⚕️" },
        { label: "Gestionar Paciente", path: "gestionar-paciente", icon: "👨" },
        { label: "Gestionar Administrador", path: "gestionar-admin", icon: "👔" },
      ]
    },
    {
      name: "Inventario",
      items: [
        { label: "Medicamentos", path: "medicamentos", icon: "💊" },
        { label: "Equipos Médicos", path: "equipos-medicos", icon: "🩺" },
        { label: "Suministros", path: "suministros", icon: "🧻" },
      ]
    },
    {
      name: "Reportes",
      items: [
        { label: "Reporte de Citas", path: "reporte-citas", icon: "📅" },
        { label: "Reporte Financiero", path: "reporte-financiero", icon: "💰" },
      ]
    }
  ];

export default function AdminLayout() {
  return (
    <div className="AdminLayout-container">
      <Header title="Clinica Visionex" userName="Juan" />
      <Sidebar menuPackages={menuPackages} />
      <Container>
        <Outlet />
      </Container>
      <Footer />
    </div>
  );
}