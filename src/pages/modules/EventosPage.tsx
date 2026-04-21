import Header from "../../components/layout/Header";
import { ListaRecurso } from "../../components/shared/ListaRecurso";
import API_ENDPOINTS from "../../config/api";
import type { Informe } from "../../types";

export default function EventosPage() {
  return (
    <>
      <Header 
        title="Informes" 
        subtitle="Gestión de informes" 
      />
      
      <main className="p-8">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
          <ListaRecurso<Informe> endpoint={API_ENDPOINTS.INFORMES} titleField="titulo" />
        </div>
      </main>
    </>
  );
}
