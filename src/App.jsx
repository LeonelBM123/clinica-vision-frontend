import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/01_Login";
import HomePage from "./pages/HomePage";
import AdminLayout from "./layouts/AdminLayout";
import PacienteLayout from "./layouts/PacienteLayout";
import MedicoLayout from "./layouts/MedicoLayout";
import ejemplo from "./pages/ejemplo";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/login" element={<Login/>} />
        {/* <Route path="/AdminLayout" element={<AdminLayout/>} /> */}
        <Route path="/MedicoLayout" element={<MedicoLayout/>} />
        <Route path="/PacienteLayout" element={<PacienteLayout/>} />

        <Route path="/AdminLayout" element={<AdminLayout />}>
          <Route path="ejemplo" element={<ejemplo />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;