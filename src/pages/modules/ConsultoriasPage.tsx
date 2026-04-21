import Header from "../../components/layout/Header";
import { ListaRecurso } from "../../components/shared/ListaRecurso";
import API_ENDPOINTS from "../../config/api";
import type { Consultoria } from "../../types";

export default function ConsultoriasPage() {
  return (
    <>
      <Header 
        title="Consultorías" 
        subtitle="Gestión de consultorías" 
      />
      
      <main className="p-8">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
          <ListaRecurso<Consultoria> endpoint={API_ENDPOINTS.CONSULTORIA} titleField="description" />
        </div>
      </main>
    </>
  );
}
