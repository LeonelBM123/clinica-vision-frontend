import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/01_Login";
import HomePage from "./home/HomePage";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/0x_AdminDashboard";
import GestionarMedico from "./pages/0x_GestionarMedico";

import PacienteLayout from "./layouts/PacienteLayout";
import MedicoLayout from "./layouts/MedicoLayout";
import GestionarPatologias from "./pages/Gestionar_Patologias";
import CrearPatologia from "./pages/Gestionar_Patologias/create";
import EditarPatologia from "./pages/Gestionar_Patologias/edit";

import CrearPaciente from "./pages/Gestionar_Pacientes/create";
import EditarPaciente from "./pages/Gestionar_Pacientes/edit";
import GestionarPacientes from "./pages/Gestionar_Pacientes";

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

          {/*rutas para gestionar patologías */}
          <Route path="patologias" element={<GestionarPatologias />} /> 
          <Route path="patologias/crear" element={<CrearPatologia />} /> 
          <Route path="patologias/:id/editar" element={<EditarPatologia />} />             
          {/*<Route path="patologias/eliminadas" element={<PatologiasEliminadas />} />  */}
          
          {/*rutas para gestionar pacientes */}
          <Route path="pacientes" element={<GestionarPacientes/>} /> 
          <Route path="pacientes/crear" element={<CrearPaciente />} /> 
          <Route path="pacientes/:id/editar" element={<EditarPaciente />} /> 

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;