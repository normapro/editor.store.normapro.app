import { useState } from "react";
import Header from "../../components/layout/Header";
import { ListaRecurso } from "../../components/shared/ListaRecurso";
import API_ENDPOINTS from "../../config/api";
import type { HistoriaCliente } from "../../types";
import type { CampoEsquema } from "../../types/editor";
import { Editor } from "../../components/shared/Editor";

const HISTORIACLIENTE_FIELDS: CampoEsquema<HistoriaCliente>[] = [
  { name: "nombre", label: "Nombre empresa", type: "text" },
  { name: "slug", label: "Slug", type: "text" },
  { name: "descripcion", label: "Descripción", type: "text" },
  { name: "imagen", label: "Imagen", type: "text" },
  { name: "componentes", label: "Contenido", type: "textarea" },
];

export default function HistoriasClientesPage() {
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
        title="Historia con Clientes" 
        subtitle={modo === "listado" ? "Gestion de historias con clientes" : "Editor de historia con cliente"}
      />
      
      <main className="p-8">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
          {modo === "listado" ? (
            <ListaRecurso<HistoriaCliente>
              endpoint={API_ENDPOINTS.HISTORIAS}
              titleField="nombre"
              onAdd={abrirCrear}
              onEdit={abrirEditar}
              reloadKey={reloadKey}
            />
          ) : (
            <Editor<HistoriaCliente>
              endpoint={API_ENDPOINTS.HISTORIAS}
              fields={HISTORIACLIENTE_FIELDS}
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