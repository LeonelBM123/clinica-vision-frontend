import { createBrowserRouter } from "react-router-dom";
import HomePage from "../home/HomePage";
import ResetPassword from "../pages/RecuperarPassword"
import Login from "../pages/Login.jsx";
import RegisterClinic from "../pages/RegisterClinic";

// Layout principal
import AdminLayout from "../layouts/Layout.jsx";

// Componentes de protección
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";

// Páginas principales
import AdminDashboard from "../pages/AdminDashboard.jsx";

// Páginas de gestión de patologías
import GestionarPatologias from "../pages/Gestionar_Patologias/index.jsx";
import CrearPatologia from "../pages/Gestionar_Patologias/create.jsx";
import EditarPatologia from "../pages/Gestionar_Patologias/edit.jsx";

// paginas de gestion tratamientos
import GestionarTratamientos from "../pages/Gestionar_Tratamientos/index.jsx";
import CrearTratamiento from "../pages/Gestionar_Tratamientos/create.jsx";
import EditarTratamiento from "../pages/Gestionar_Tratamientos/edit.jsx";

// Páginas de gestión de medicos
import GestionarMedicos from "../pages/Gestionar_Medicos/index.jsx";
import CrearMedico from "../pages/Gestionar_Medicos/create.jsx";
import EditarMedico from "../pages/Gestionar_Medicos/edit.jsx";

// Páginas de gestión de pacinetes 
import GestionarPacientes from "../pages/Gestionar_Pacientes/index.jsx";
import CrearPaciente from "../pages/Gestionar_Pacientes/create.jsx";
import EditarPaciente from "../pages/Gestionar_Pacientes/edit.jsx";


// Páginas de gestión de usuarios
import GestionarUsuarios from "../pages/Gestionar_Usuarios/index.jsx";
import CrearUsuario from "../pages/Gestionar_Usuarios/create.jsx";
import EditarUsuario from "../pages/Gestionar_Usuarios/edit.jsx";


// Páginas de gestión de bitácora
import GestionarBitacora from "../pages/Gestionar_Bitacora/index";

const router = createBrowserRouter([
  // Rutas públicas
  {
    path: "/",
    element: (
      <PublicRoute>
        <HomePage />
      </PublicRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/register-clinic",
    element: (
      <PublicRoute>
        <RegisterClinic />
      </PublicRoute>
    ),
  },
  {
    path: "recuperar-password",
    element:<PublicRoute><ResetPassword /></PublicRoute>,
  },
  // Layout principal - todas las rutas autenticadas usando AdminLayout

  // Layout principal - rutas autenticadas usando Layout
  {
    path: "/dashboard",
    element: <AdminLayout />,
    children: [
      {
        path: "",
        element: <AdminDashboard />,
      },

      // Gestión de Patologías (Admin y Doctor)
      {
        path: "patologias",
        element: <GestionarPatologias />,
        children: [
          { path: "nueva", element: <CrearPatologia /> },
          { path: ":id/editar", element: <EditarPatologia /> },
        ],
      },
      // Gestión de Tratamientos (Admin y Doctor)
      {
        path: "tratamientos",
        element: <GestionarTratamientos />,
        children: [
          { path: "nuevo", element: <CrearTratamiento /> },
          { path: ":id/editar", element: <EditarTratamiento /> },
        ],
      },

      // Gestión de Medicos (Admin)
      {
        path: "medicos",
        element: <GestionarMedicos />,
        children: [
          { path: "nuevo", element: <CrearMedico /> },
          { path: ":id/editar", element: <EditarMedico /> },
        ],
      },

      // Gestión de Pacientes (Medicos)
      {
        path: "pacientes",
        element: <GestionarPacientes />,
        children: [
          { path: "nuevo", element: <CrearPaciente /> },
          { path: ":id/editar", element: <EditarPaciente /> },
        ],
      },

      // Gestión de Usuarios ()
      {
        path: "usuarios",
        element: <GestionarUsuarios />,
        children: [
          { path: "nuevo", element: <CrearUsuario /> },
          { path: ":id/editar", element: <EditarUsuario /> },
        ],
      },

      // Gestión de Bitácora (Solo SuperAdmin y Admin)
      {
        path: "bitacora",
        element: <GestionarBitacora />,
      },
    ],
  },
]);

export default router;
