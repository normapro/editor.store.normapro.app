import { useState } from "react";
import Header from "../../components/layout/Header";
import { ListaRecurso } from "../../components/shared/ListaRecurso";
import API_ENDPOINTS from "../../config/api";
import type { Pack } from "../../types";
import type { CampoEsquema } from "../../types/editor";
import { Editor } from "../../components/shared/Editor";
import { getEditorToken } from "../../auth/session";

const PACK_FIELDS: CampoEsquema<Pack>[] = [
  { name: "description", label: "Nombre", type: "text" },
  { name: "shortDescription", label: "Descripción corta", type: "text" },
  { name: "slug", label: "Slug", type: "text" },
  { name: "uriIcon", label: "Icono", type: "text" },
  { name: "title", label: "Título", type: "text" },
  { name: "subtitle", label: "Subtítulo", type: "text" },
  { name: "titleweb", label: "Título web", type: "text" },
  { name: "descriptionForHighLight", label: "Descripción destacada", type: "textarea" },
  { name: "problemaTitle", label: "Título problema", type: "text" },
  { name: "problemaPragma", label: "Pragma problema", type: "textarea" },
  { name: "multimediaUri", label: "Multimedia URI", type: "text" },
  { name: "multimediaTypeId", label: "Tipo multimedia", type: "number" },
  { name: "solucionTitle", label: "Título solución", type: "text" },
  { name: "solucionPragma", label: "Pragma solución", type: "textarea" },
  { name: "caracteristicasTitle", label: "Título características", type: "text" },
  { name: "caracteristicasPragma", label: "Pragma características", type: "textarea" },
  { name: "casosdeusoTitle", label: "Título casos de uso", type: "text" },
  { name: "casosdeusoPragma", label: "Pragma casos de uso", type: "textarea" },
  { name: "beneficiosTitle", label: "Título beneficios", type: "text" },
  { name: "beneficiosPragma", label: "Pragma beneficios", type: "textarea" },
  { name: "firstCtaTitle", label: "Primer CTA título", type: "text" },
  { name: "firstCtaPragma", label: "Primer CTA pragma", type: "textarea" },
  { name: "secondCtaTitle", label: "Segundo CTA título", type: "text" },
  { name: "secondCtaPragma", label: "Segundo CTA pragma", type: "textarea" },
  { name: "consultoriaTitle", label: "Título consultoría", type: "text" },
  { name: "consultoriaDescription", label: "Descripción consultoría", type: "textarea" },
  { name: "fraseCierre", label: "Frase cierre", type: "textarea" },
  { name: "id_ambito", label: "ID ámbito", type: "number" },
];

export default function PacksPage() {
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
    const confirmar = window.confirm("Vas a eliminar este pack. Esta accion no se puede deshacer. ¿Continuar?");
    if (!confirmar) {
      return;
    }

    const token = getEditorToken();
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const res = await fetch(`${API_ENDPOINTS.PACKS_EDITOR}/${id}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) {
        throw new Error("delete_failed");
      }

      setReloadKey((prev) => prev + 1);
    } catch {
      window.alert("No se pudo eliminar el pack.");
    }
  };

  return (
    <>
      <Header
        title="Packs"
        subtitle={modo === "listado" ? "Gestion de packs" : "Editor de pack"}
      />
      <main className="p-8">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
          {modo === "listado" ? (
            <ListaRecurso<Pack>
              endpoint={API_ENDPOINTS.PACKS_EDITOR_READ}
              titleField="description"
              onAdd={abrirCrear}
              onEdit={abrirEditar}
              onDelete={onDelete}
              reloadKey={reloadKey}
            />
          ) : (
            <Editor<Pack>
              endpoint={API_ENDPOINTS.PACKS_EDITOR_READ}
              saveEndpoint={API_ENDPOINTS.PACKS_EDITOR}
              fields={PACK_FIELDS}
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
