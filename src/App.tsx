import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import RequireEditorAuth from "./components/auth/RequireEditorAuth";
import WelcomePage from "./pages/WelcomePage";
import InicioSesionPage from "./pages/InicioSesionPage";
import Dashboard from "./pages/Dashboard";
import ActualidadPage from "./pages/modules/ActualidadPage";
import AplicacionesPage from "./pages/modules/AplicacionesPage";
import AplicacionContenidoPage from "./pages/modules/AplicacionContenidoPage";
import ConsultoriasPage from "./pages/modules/ConsultoriasPage";
import EventosPage from "./pages/modules/EventosPage";
import HistoriasPage from "./pages/modules/HistoriasPage";
import InformesPage from "./pages/modules/InformesPage";
import PacksPage from "./pages/modules/PacksPage";
import SolucionesPage from "./pages/modules/SolucionesPage";
import TestimoniosPage from "./pages/modules/TestimoniosPage";
import AmbitosPage from "./pages/modules/AmbitosPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/inicio-sesion" element={<InicioSesionPage />} />
      <Route element={<RequireEditorAuth />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/actualidad" element={<ActualidadPage />} />
          <Route path="/aplicaciones" element={<AplicacionesPage />} />
          <Route path="/aplicaciones/:id/contenido" element={<AplicacionContenidoPage />} />
          <Route path="/consultorias" element={<ConsultoriasPage />} />
          <Route path="/eventos" element={<EventosPage />} />
          <Route path="/historias" element={<HistoriasPage />} />
          <Route path="/informes" element={<InformesPage />} />
          <Route path="/packs" element={<PacksPage />} />
          <Route path="/soluciones" element={<SolucionesPage />} />
          <Route path="/testimonios" element={<TestimoniosPage />} />
          <Route path="/ambitos" element={<AmbitosPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
