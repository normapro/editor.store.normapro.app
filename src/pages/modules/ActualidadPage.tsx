import { useState } from "react";
import Header from "../../components/layout/Header";
import { ListaRecurso } from "../../components/shared/ListaRecurso";
import { Editor } from "../../components/shared/Editor";
import API_ENDPOINTS from "../../config/api";
import type { Actualidad } from "../../types/actualidad";
import type { CampoEsquema } from "../../types/editor";

const ACTUALIDAD_FIELDS: CampoEsquema<Actualidad>[] = [
  { name: "title", label: "Titulo", type: "text" },
  { name: "slug", label: "Slug", type: "text" },
  { name: "fecha", label: "Fecha", type: "date" },
  { name: "categoria", label: "Categoria", type: "multiselect", options: ["Destacadas", "Tecnología", "Salud", 'Mediambiente', 'Digitalizacion', 'Formación', 'Industria', 'Seguridad alimentaria'] },
  { name: "id_pack", label: "Id pack", type: "number" },
  { name: "id_soluciones", label: "Id soluciones", type: "text" },
  { name: "imagen", label: "Imagen", type: "text" },
  { name: "content", label: "Contenido", type: "paragraphs" },
];

export default function ActualidadPage() {
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
        title="Actualidad" 
        subtitle={modo === "listado" ? "Gestion de noticias" : "Editor de noticia"}
      />
      
      <main className="p-8">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
          {modo === "listado" ? (
            <ListaRecurso<Actualidad>
              endpoint={API_ENDPOINTS.ACTUALIDAD}
              titleField="title"
              onAdd={abrirCrear}
              onEdit={abrirEditar}
              reloadKey={reloadKey}
            />
          ) : (
            <Editor<Actualidad>
              endpoint={API_ENDPOINTS.ACTUALIDAD}
              fields={ACTUALIDAD_FIELDS}
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