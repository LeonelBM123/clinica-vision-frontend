import { createBrowserRouter } from "react-router-dom";
import HomePage from "../home/HomePage";
import Login from "../pages/01_Login";
import RegisterUser from "../pages/02_RegisterUser";
import RegisterClinic from "../pages/03_RegisterClinic";
import ResetPassword from "../pages/RecuperarPassword"

// Layout principal
import AdminLayout from "../layouts/AdminLayout";

// Componentes de protección
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";

// Páginas principales
import AdminDashboard from "../pages/0x_AdminDashboard";
import GestionarMedico from "../pages/0x_GestionarMedico";

// Páginas de gestión de usuarios
import GestionarUsuarios from "../pages/Gestionar_Usuarios/index";
import CreateUsuario from "../pages/Gestionar_Usuarios/create";
import EditUsuario from "../pages/Gestionar_Usuarios/edit";

// Páginas de gestión de pacientes
import GestionarPacientes from "../pages/Gestionar_Pacientes/index";
import CreatePaciente from "../pages/Gestionar_Pacientes/create";
import EditPaciente from "../pages/Gestionar_Pacientes/edit";

// Páginas de gestión de patologías
import GestionarPatologias from "../pages/Gestionar_Patologias/index";
import CreatePatologia from "../pages/Gestionar_Patologias/create";
import EditPatologia from "../pages/Gestionar_Patologias/edit";

// Páginas de gestión de bitácora
import GestionarBitacora from "../pages/Gestionar_Bitacora/index";

// Páginas de solicitar cita
import SolicitarCita from "../pages/Solicitar_Cita/create";

const router = createBrowserRouter([
  // Rutas públicas
  {
    path: "/",
    element: <PublicRoute><HomePage /></PublicRoute>,
  },
  {
    path: "/login",
    element: <PublicRoute><Login /></PublicRoute>,
  },
  {
    path: "/register-user",
    element: <PublicRoute><RegisterUser /></PublicRoute>,
  },
  {
    path: "/register-clinic",
    element: <PublicRoute><RegisterClinic /></PublicRoute>,
  },
  {
    path: "recuperar-password",
    element:<PublicRoute><ResetPassword /></PublicRoute>,
  },
  // Layout principal - todas las rutas autenticadas usando AdminLayout
  {
    path: "/dashboard",
    element: <ProtectedRoute><AdminLayout /></ProtectedRoute>,
    children: [
      {
        path: "",
        element: <AdminDashboard />,
      },
      
      // Gestión de Usuarios (Solo SuperAdmin y Admin)
      {
        path: "usuarios",
        element: <GestionarUsuarios />,
      },
      {
        path: "usuarios/create",
        element: <CreateUsuario />,
      },
      {
        path: "usuarios/edit/:id",
        element: <EditUsuario />,
      },
      
      // Gestión de Bitácora (Todos los roles)
      {
        path: "bitacora",
        element: <GestionarBitacora />,
      },
      
      // Solicitar Cita (Médicos y Admin)
      {
        path: "solicitar-cita",
        element: <SolicitarCita />,
      },
    ],
  },
]);

export default router;
