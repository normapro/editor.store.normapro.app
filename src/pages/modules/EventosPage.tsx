import { useState } from "react";
import Header from "../../components/layout/Header";
import { ListaRecurso } from "../../components/shared/ListaRecurso";
import API_ENDPOINTS from "../../config/api";
import type { Evento } from "../../types";
import type { CampoEsquema } from "../../types/editor";
import { Editor } from "../../components/shared/Editor";

const EVENTO_FIELDS: CampoEsquema<Evento>[] = [
  { name: "title", label: "Título", type: "text" },
  { name: "description", label: "Descripción", type: "text" },
  { name: "fecha", label: "Fecha", type: "date" },
];

export default function EventosPage() {
  const [modo, setModo] = useState<"listado" | "editor">("listado");
  const [idEdicion, setIdEdicion] = useState<number | string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const abrirCrear = () => {
    setIdEdicion(null);
    setModo("editor");
  };

  const abrirEditar = (id: number | string) => {
    setIdEdicion(id);
    setModo("editor");
  };

  const cerrarEditor = () => {
    setModo("listado");
  };

  const onGuardado = () => {
    setReloadKey((prev) => prev + 1);
  };

  return (
    <>
      <Header 
        title="Eventos" 
        subtitle={modo === "listado" ? "Gestion de eventos" : "Editor de evento"}
      />
      
      <main className="p-8">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
          {modo === "listado" ? (
            <ListaRecurso<Evento>
              endpoint={API_ENDPOINTS.EVENTOS}  // Este filtra
              titleField="title"
              onAdd={abrirCrear}
              onEdit={abrirEditar}
              reloadKey={reloadKey}
            />
          ) : (
            <Editor<Evento>
              endpoint={API_ENDPOINTS.EVENTOS}  // Este filtra
              fields={EVENTO_FIELDS}
              idEdicion={idEdicion}
              onCerrar={cerrarEditor}
              onGuardado={onGuardado}
            />
          )}
        </div>
      </main>
    </>
  );
}