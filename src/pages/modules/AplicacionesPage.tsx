import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import { ListaRecurso } from "../../components/shared/ListaRecurso";
import API_ENDPOINTS from "../../config/api";
import type { Aplicacion } from "../../types";
import type { CampoEsquema } from "../../types/editor";
import { Editor } from "../../components/shared/Editor";
import { getEditorToken } from "../../auth/session";

const APLICACION_FIELDS: CampoEsquema<Aplicacion>[] = [
  { name: "description", label: "Título", type: "text" },
  { name: "slug", label: "Slug", type: "text" },
  { name: "uriIcon", label: "Icono", type: "text" },
  { name: "shortDescription", label: "Descripción", type: "text" },
];

export default function AplicacionesPage() {
  const navigate = useNavigate();
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

  const abrirEditorContenido = () => {
    if (idEdicion === null) {
      window.alert("Primero crea y guarda la aplicacion. Luego podras editar su contenido.");
      return;
    }

    navigate(`/aplicaciones/${idEdicion}/contenido`);
  };

  const onDelete = async (id: number | string) => {
    const confirmar = window.confirm("Vas a eliminar esta aplicacion. Esta accion no se puede deshacer. ¿Continuar?");
    if (!confirmar) {
      return;
    }

    const token = getEditorToken();
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const res = await fetch(`${API_ENDPOINTS.APLICACIONES_EDITOR}/${id}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) {
        throw new Error("delete_failed");
      }

      setReloadKey((prev) => prev + 1);
    } catch {
      window.alert("No se pudo eliminar la aplicacion.");
    }
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
              onDelete={onDelete}
              reloadKey={reloadKey}
            />
          ) : (
            <Editor<Aplicacion>
              endpoint={API_ENDPOINTS.APLICACIONES}
              saveEndpoint={API_ENDPOINTS.APLICACIONES_EDITOR}
              fields={APLICACION_FIELDS}
              idEdicion={idEdicion}
              onCerrar={cerrarEditor}
              onGuardado={onGuardado}
              extraBeforeActions={(
                <div className="flex justify-start">
                  <button
                    type="button"
                    className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover"
                    onClick={abrirEditorContenido}
                  >
                    Editar contenido
                  </button>
                </div>
              )}
            />
          )}
        </div>
      </main>
    </>
  );
}