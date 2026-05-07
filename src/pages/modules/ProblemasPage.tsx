import { useMemo, useState } from "react";
import Header from "../../components/layout/Header";
import { ListaRecurso } from "../../components/shared/ListaRecurso";
import API_ENDPOINTS from "../../config/api";
import type { Problema } from "../../types";
import type { CampoEsquema } from "../../types/editor";
import { Editor } from "../../components/shared/Editor";
import { getEditorToken } from "../../auth/session";
import { RemoteRelationMultiSelector } from "../../components/campos/RemoteRelationMultiSelector";

const PROBLEMA_FIELDS: CampoEsquema<Problema>[] = [
  { name: "description", label: "Problema", type: "textarea" },
];

export default function ProblemasPage() {
  const [modo, setModo] = useState<"listado" | "editor">("listado");
  const [idEdicion, setIdEdicion] = useState<number | string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const idProblemaActual = useMemo(() => {
      if (idEdicion === null) {
        return null;
      }
  
      const parsed = Number(idEdicion);
      return Number.isFinite(parsed) ? parsed : null;
    }, [idEdicion]);

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
    const confirmar = window.confirm("Vas a eliminar este problema. Esta accion no se puede deshacer. ¿Continuar?");
    if (!confirmar) {
      return;
    }

    const token = getEditorToken();
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const res = await fetch(`${API_ENDPOINTS.PROBLEMAS_EDITOR}/${id}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) {
        throw new Error("delete_failed");
      }

      setReloadKey((prev) => prev + 1);
    } catch {
      window.alert("No se pudo eliminar el problema.");
    }
  };

  return (
    <>
      <Header 
        title="Problemas" 
        subtitle={modo === "listado" ? "Gestion de problemas" : "Editor de problema"}
      />
      
      <main className="p-8">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
          {modo === "listado" ? (
            <ListaRecurso<Problema>
              endpoint={API_ENDPOINTS.PROBLEMAS}
              titleField="description"
              onAdd={abrirCrear}
              onEdit={abrirEditar}
              onDelete={onDelete}
              reloadKey={reloadKey}
            />
          ) : (
            <Editor<Problema>
              endpoint={API_ENDPOINTS.PROBLEMAS}
              saveEndpoint={API_ENDPOINTS.PROBLEMAS_EDITOR}
              fields={PROBLEMA_FIELDS}
              idEdicion={idEdicion}
              onCerrar={cerrarEditor}
              onGuardado={onGuardado}
              extraBeforeActions={(
                <div className="space-y-4">
                  <RemoteRelationMultiSelector
                  title="Soluciones relacionados"
                  description="Selecciona las soluciones que quieras asociar a este problema."
                  createModeMessage="Guarda el problema primero para poder relacionarlo con soluciones."
                  entityId={idProblemaActual}
                  catalogEndpoint={`${API_ENDPOINTS.SOLUCIONES_EDITOR_READ}/soluciones`}
                  relationEndpointBase={`${API_ENDPOINTS.PROBLEMAS_EDITOR}/soluciones`}
                  token={getEditorToken()}
                  optionIdField="id_solucion"
                  optionLabelField="description"
                  relationIdsField="id_soluciones"
                  createBodyField="id_solucion"
                  openLabel="Seleccionar soluciones"
                />

                  <RemoteRelationMultiSelector
                    title="Soluciones-Ámbitos asociadas"
                    description="Selecciona las soluciones por ámbito que aplican a este problema."
                    createModeMessage="Guarda el problema primero para poder relacionarlo con soluciones-ámbitos."
                    entityId={idProblemaActual}
                    catalogEndpoint={`${API_ENDPOINTS.SOLUCIONES_EDITOR_READ}/soluciones-ambitos`}
                    relationEndpointBase={`${API_ENDPOINTS.BENEFICIOS_EDITOR}/soluciones-ambitos`}
                    token={getEditorToken()}
                    relationIdsField="ids"
                    createBodyField="relationId"
                    optionResolver={(item) => {
                      const idSolucion = Number(item.id_solucion);
                      const idAmbito = Number(item.id_ambito);
                      if (!Number.isFinite(idSolucion) || !Number.isFinite(idAmbito)) {
                        return null;
                      }

                      const compositeId = `${idSolucion}-${idAmbito}`;
                      const nombre = String(item.description ?? "").trim();

                      return {
                        id: compositeId,
                        label: nombre ? `${compositeId} - ${nombre}` : compositeId,
                      };
                    }}
                    openLabel="Seleccionar soluciones-ámbitos"
                  />

                  <RemoteRelationMultiSelector
                    title="Soluciones-Ámbitos-Sectores asociadas"
                    description="Selecciona las soluciones por ámbito y sector que aplican a este problema."
                    createModeMessage="Guarda el problema primero para poder relacionarlo con soluciones-ámbitos-sectores."
                    entityId={idProblemaActual}
                    catalogEndpoint={`${API_ENDPOINTS.SOLUCIONES_EDITOR_READ}/soluciones-ambitos-sectores`}
                    relationEndpointBase={`${API_ENDPOINTS.BENEFICIOS_EDITOR}/soluciones-ambitos-sectores`}
                    token={getEditorToken()}
                    relationIdsField="ids"
                    createBodyField="relationId"
                    optionResolver={(item) => {
                      const idSolucion = Number(item.id_solucion);
                      const idAmbito = Number(item.id_ambito);
                      const idSector = Number(item.id_sector);
                      if (!Number.isFinite(idSolucion) || !Number.isFinite(idAmbito) || !Number.isFinite(idSector)) {
                        return null;
                      }

                      const compositeId = `${idSolucion}-${idAmbito}-${idSector}`;
                      const nombre = String(item.description ?? "").trim();

                      return {
                        id: compositeId,
                        label: nombre ? `${compositeId} - ${nombre}` : compositeId,
                      };
                    }}
                    openLabel="Seleccionar soluciones-ámbitos-sectores"
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