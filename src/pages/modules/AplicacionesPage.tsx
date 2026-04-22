import { useState } from "react";
import Header from "../../components/layout/Header";
import { ListaRecurso } from "../../components/shared/ListaRecurso";
import API_ENDPOINTS from "../../config/api";
import type { Aplicacion } from "../../types";
import type { CampoEsquema } from "../../types/editor";
import { Editor } from "../../components/shared/Editor";

const APLICACION_FIELDS: CampoEsquema<Aplicacion>[] = [
  { name: "description", label: "Título", type: "text" },
  { name: "slug", label: "Slug", type: "text" },
  { name: "uriIcon", label: "Icono", type: "text" },
  { name: "shortDescription", label: "Descripción", type: "text" },
  { name: "contenidos", label: "Contenido", type: "textarea" },
];

export default function AplicacionesPage() {
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
        title="Aplicaciones" 
        subtitle={modo === "listado" ? "Gestion de aplicaciones" : "Editor de aplicación"}
      />
      
      <main className="p-8">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
          {modo === "listado" ? (
            <ListaRecurso<Aplicacion>
              endpoint={API_ENDPOINTS.APLICACIONES}
              titleField="description"
              onAdd={abrirCrear}
              onEdit={abrirEditar}
              reloadKey={reloadKey}
            />
          ) : (
            <Editor<Aplicacion>
              endpoint={API_ENDPOINTS.APLICACIONES}
              fields={APLICACION_FIELDS}
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