import { useState } from "react";
import Header from "../../components/layout/Header";
import { ListaRecurso } from "../../components/shared/ListaRecurso";
import API_ENDPOINTS from "../../config/api";
import type { Solucion } from "../../types";
import type { CampoEsquema } from "../../types/editor";
import { Editor } from "../../components/shared/Editor";
import { getEditorToken } from "../../auth/session";

const SOLUCION_FIELDS: CampoEsquema<Solucion>[] = [
  { name: "description", label: "Nombre", type: "text" },
  { name: "title", label: "Título", type: "text" },
  { name: "subtitle", label: "Subtítulo", type: "text" },
  { name: "icon", label: "Ícono", type: "text" },
  { name: "slug", label: "Slug", type: "text"},
  { name: "titleweb", label: "Título web", type: "text" },
  { name: "multimediaUri", label: "Multimedia URI", type: "text" },
  { name: "multimediaTypeId", label: "Tipo de Multimedia", type: "number" },
  { name: "problemaTitle", label: "Título del problema", type: "text" },
  { name: "problemaPragma", label: "Pragma del problema", type: "textarea" },
  { name: "solucionTitle", label: "Título de la solución", type: "text" },
  { name: "solucionPragma", label: "Pragma de la solución", type: "textarea" },
  { name: "caracteristicasTitle", label: "Título de características", type: "text" },
  { name: "caracteristicasPragma", label: "Pragma de características", type: "textarea" },
  { name: "casosdeusoTitle", label: "Título de casos de uso", type: "text" },
  { name: "casosdeusoPragma", label: "Pragma de casos de uso", type: "textarea" },
  { name: "beneficiosTitle", label: "Título de beneficios", type: "text" },
  { name: "beneficiosPragma", label: "Pragma de beneficios", type: "textarea" },
  { name: "firstCtaTitle", label: "Título del primer CTA", type: "text" },
  { name: "firstCtaPragma", label: "Pragma del primer CTA", type: "textarea" },
];

export default function SolucionesPage() {
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

  const onDelete = async (id: number | string) => {
    const confirmar = window.confirm("Vas a eliminar esta solución. Esta accion no se puede deshacer y afectará a los recursos asociados. ¿Continuar?");
    if (!confirmar) {
      return;
    }

    const token = getEditorToken();
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const res = await fetch(`${API_ENDPOINTS.SOLUCIONES_EDITOR}/${id}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) {
        throw new Error("delete_failed");
      }

      setReloadKey((prev) => prev + 1);
    } catch {
      window.alert("No se pudo eliminar la solución.");
    }
  };

  return (
    <>
      <Header 
        title="Soluciones" 
        subtitle={modo === "listado" ? "Gestion de soluciones" : "Editor de solución"}
      />
      
      <main className="p-8">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
          {modo === "listado" ? (
            <ListaRecurso<Solucion>
              endpoint={API_ENDPOINTS.SOLUCIONES_EDITOR_READ + "/soluciones"}
              titleField="description"
              onAdd={abrirCrear}
              onEdit={abrirEditar}
              onDelete={onDelete}
              reloadKey={reloadKey}
            />
          ) : (
            <Editor<Solucion>
              endpoint={API_ENDPOINTS.SOLUCIONES_EDITOR_READ + "/soluciones"}
              saveEndpoint={API_ENDPOINTS.SOLUCIONES_EDITOR}
              fields={SOLUCION_FIELDS}
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