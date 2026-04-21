import Header from "../../components/layout/Header";
import { ListaRecurso } from "../../components/shared/ListaRecurso";
import API_ENDPOINTS from "../../config/api";
import type { Actualidad } from "../../types/actualidad";

export default function ActualidadPage() {
  return (
    <>
      <Header 
        title="Actualidad" 
        subtitle="Gestión de noticias" 
      />
      
      <main className="p-8">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
          <ListaRecurso<Actualidad> endpoint={API_ENDPOINTS.ACTUALIDAD} titleField="title" />
        </div>
      </main>
    </>
  );
}