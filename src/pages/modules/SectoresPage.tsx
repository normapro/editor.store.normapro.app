import { useState } from "react";
import Header from "../../components/layout/Header";
import { ListaRecurso } from "../../components/shared/ListaRecurso";
import API_ENDPOINTS from "../../config/api";
import type { Sector } from "../../types";
import type { CampoEsquema } from "../../types/editor";
import { Editor } from "../../components/shared/Editor";
import { getEditorToken } from "../../auth/session";
import { RemoteRelationMultiSelector } from "../../components/campos/RemoteRelationMultiSelector";

const SECTOR_FIELDS: CampoEsquema<Sector>[] = [
  { name: "description", label: "Nombre", type: "text" },
  { name: "textoweb", label: "Texto Web", type: "textarea" },
  { name: "prefijo", label: "Prefijo", type: "text" },
  { name: "slug", label: "Slug", type: "text" },
  { name: "descriptionweb", label: "Descripción Web", type: "textarea" },
  { name: "titleweb", label: "Título Web", type: "text" },
  { name: "backgroundImage", label: "Imagen de Fondo", type: "text" },
];

export default function SectoresPage() {
  const [modo, setModo] = useState<"listado" | "editor">("listado");
  const [idEdicion, setIdEdicion] = useState<number | string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const idSectorActual = idEdicion;

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
    const confirmar = window.confirm("Vas a eliminar este sector. Esta accion no se puede deshacer y afectará a los recursos asociados. ¿Continuar?");
    if (!confirmar) {
      return;
    }

    const token = getEditorToken();
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const res = await fetch(`${API_ENDPOINTS.SECTORES_EDITOR}/${id}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) {
        throw new Error("delete_failed");
      }

      setReloadKey((prev) => prev + 1);
    } catch {
      window.alert("No se pudo eliminar el sector.");
    }
  };

  return (
    <>
      <Header 
        title="Sectores" 
        subtitle={modo === "listado" ? "Gestion de sectores" : "Editor de sector"}
      />
      
      <main className="p-8">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
          {modo === "listado" ? (
            <ListaRecurso<Sector>
              endpoint={API_ENDPOINTS.SECTORES}
              titleField="description"
              onAdd={abrirCrear}
              onEdit={abrirEditar}
              onDelete={onDelete}
              reloadKey={reloadKey}
            />
          ) : (
            <Editor<Sector>
              endpoint={API_ENDPOINTS.SECTORES}
              saveEndpoint={API_ENDPOINTS.SECTORES_EDITOR}
              fields={SECTOR_FIELDS}
              idEdicion={idEdicion}
              onCerrar={cerrarEditor}
              onGuardado={onGuardado}
              extraBeforeActions={(
                <div className="space-y-4">
                  <RemoteRelationMultiSelector
                    title="Packs relacionados"
                    description="Selecciona los packs asociados a este sector."
                    createModeMessage="Guarda el sector primero para poder relacionarlo con packs."
                    entityId={idSectorActual}
                    catalogEndpoint={API_ENDPOINTS.PACKS_EDITOR_READ}
                    relationEndpointBase={`${API_ENDPOINTS.SECTORES_EDITOR}/packs`}
                    token={getEditorToken()}
                    optionIdField="id_pack"
                    optionLabelField="description"
                    relationIdsField="id_packs"
                    createBodyField="id_pack"
                    openLabel="Seleccionar packs"
                  />
                  <RemoteRelationMultiSelector
                    title="Clientes relacionados"
                    description="Selecciona los clientes relacionados con este sector."
                    createModeMessage="Guarda el sector primero para poder relacionarlo con clientes."
                    entityId={idSectorActual}
                    catalogEndpoint={`${API_ENDPOINTS.CLIENTES}?maxItems=100`}
                    relationEndpointBase={`${API_ENDPOINTS.SECTORES_EDITOR}/clientes`}
                    token={getEditorToken()}
                    optionIdField="id_cliente"
                    optionLabelField="description"
                    relationIdsField="id_clientes"
                    createBodyField="id_cliente"
                    openLabel="Seleccionar clientes"
                  />
                </div>
              )}
            />
          )}
        </div>
      </main>
    </>
  );
}