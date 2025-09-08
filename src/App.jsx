import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/01_Login";
import HomePage from "./home/HomePage";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/0x_AdminDashboard";
import GestionarMedico from "./pages/0x_GestionarMedico";

import PacienteLayout from "./layouts/PacienteLayout";
import MedicoLayout from "./layouts/MedicoLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/login" element={<Login/>} />
        {/* <Route path="/AdminLayout" element={<AdminLayout/>} /> */}
        <Route path="/MedicoLayout" element={<MedicoLayout/>} />
        <Route path="/PacienteLayout" element={<PacienteLayout/>} />

        {/* rutas con AdminLayout */}
        <Route path="/AdminLayout" element={<AdminLayout />}>
          {/* ruta por defecto del admin */}
          <Route index element={<AdminDashboard />} />

          {/* rutas hijas */}
          <Route path="gestionar-medico" element={<GestionarMedico />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;