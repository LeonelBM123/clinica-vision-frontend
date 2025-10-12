import { createBrowserRouter } from "react-router-dom";
import HomePage from "../home/HomePage";
<<<<<<< HEAD
import Login from "../pages/01_Login";
import RegisterUser from "../pages/02_RegisterUser";
import RegisterClinic from "../pages/03_RegisterClinic";
import ResetPassword from "../pages/RecuperarPassword"
=======
import Login from "../pages/Login.jsx";
import RegisterClinic from "../pages/RegisterClinic";
>>>>>>> origin/main

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

// Páginas de gestión de bitácora
import GestionarBitacora from "../pages/Gestionar_Bitacora/index";

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
    path: "/register-clinic",
    element: <PublicRoute><RegisterClinic /></PublicRoute>,
  },
<<<<<<< HEAD
  {
    path: "recuperar-password",
    element:<PublicRoute><ResetPassword /></PublicRoute>,
  },
  // Layout principal - todas las rutas autenticadas usando AdminLayout
=======

  // Layout principal - rutas autenticadas usando AdminLayout
>>>>>>> origin/main
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

      // Gestión de Bitácora (Solo SuperAdmin y Admin)
      {
        path: "bitacora",
        element: <GestionarBitacora />,
      },
    ],
  },
]);

export default router;
