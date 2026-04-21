import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import WelcomePage from "./pages/WelcomePage";
import InicioSesionPage from "./pages/InicioSesionPage";
import Dashboard from "./pages/Dashboard";
import ActualidadPage from "./pages/ActualidadPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/inicio-sesion" element={<InicioSesionPage />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/actualidad" element={<ActualidadPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
