import { useState } from "react";
import Header from "../../components/layout/Header";
import { ListaRecurso } from "../../components/shared/ListaRecurso";
import API_ENDPOINTS from "../../config/api";
import type { Informe } from "../../types";
import type { CampoEsquema } from "../../types/editor";
import { Editor } from "../../components/shared/Editor";

const INFORME_FIELDS: CampoEsquema<Informe>[] = [
  { name: "titulo", label: "Titulo", type: "text" },
  { name: "slug", label: "Slug", type: "text" },
  { name: "categoria", label: "Categoria", type: "text" },
  { name: "textoDescarga", label: "Texto descarga", type: "text" },
  { name: "img_portada", label: "Imagen portada", type: "text" },
  { name: "img_informe", label: "Imagen informe", type: "text" },
  { name: "prologo", label: "Texto", type: "textarea" },
  { name: "indice", label: "Indice", type: "textarea" },
  { name: "responsables", label: "Autores", type: "textarea" },
];

export default function InformesPage() {
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
        title="Informe" 
        subtitle={modo === "listado" ? "Gestion de informes" : "Editor de informe"}
      />
      
      <main className="p-8">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
          {modo === "listado" ? (
            <ListaRecurso<Informe>
              endpoint={API_ENDPOINTS.INFORMES}
              titleField="titulo"
              onAdd={abrirCrear}
              onEdit={abrirEditar}
              reloadKey={reloadKey}
            />
          ) : (
            <Editor<Informe>
              endpoint={API_ENDPOINTS.INFORMES}
              fields={INFORME_FIELDS}
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