import Header from "../../components/layout/Header";
import { ListaRecurso } from "../../components/shared/ListaRecurso";
import API_ENDPOINTS from "../../config/api";
import type { Aplicacion } from "../../types";

export default function AplicacionesPage() {
  return (
    <>
      <Header 
        title="Aplicaciones" 
        subtitle="Gestión de aplicaciones" 
      />
      
      <main className="p-8">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
          <ListaRecurso<Aplicacion> endpoint={API_ENDPOINTS.APLICACIONES} titleField="description" />
        </div>
      </main>
    </>
  );
}
