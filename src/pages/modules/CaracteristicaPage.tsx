import { useMemo, useState } from "react";
import Header from "../../components/layout/Header";
import { ListaRecurso } from "../../components/shared/ListaRecurso";
import API_ENDPOINTS from "../../config/api";
import type { Caracteristica } from "../../types";
import type { CampoEsquema } from "../../types/editor";
import { Editor } from "../../components/shared/Editor";
import { getEditorToken } from "../../auth/session";
import { RemoteRelationMultiSelector } from "../../components/campos/RemoteRelationMultiSelector";

const CARACTERISTICA_FIELDS: CampoEsquema<Caracteristica>[] = [
  { name: "description", label: "Caracteristica", type: "textarea" },
];

export default function ProblemasPage() {
  const [modo, setModo] = useState<"listado" | "editor">("listado");
  const [idEdicion, setIdEdicion] = useState<number | string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const idCaracteristicaActual = useMemo(() => {
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
    const confirmar = window.confirm("Vas a eliminar esta caracteristica. Esta accion no se puede deshacer. ¿Continuar?");
    if (!confirmar) {
      return;
    }

    const token = getEditorToken();
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const res = await fetch(`${API_ENDPOINTS.CARACTERISTICAS_EDITOR}/${id}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) {
        throw new Error("delete_failed");
      }

      setReloadKey((prev) => prev + 1);
    } catch {
      window.alert("No se pudo eliminar el caracteristica.");
    }
  };

  return (
    <>
      <Header
        title="Caracteristica"
        subtitle={modo === "listado" ? "Gestion de caracteristica" : "Editor de caracteristica"}
      />

      <main className="p-8">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
          {modo === "listado" ? (
            <ListaRecurso<Caracteristica>
              endpoint={API_ENDPOINTS.CARACTERISTICAS}
              titleField="description"
              onAdd={abrirCrear}
              onEdit={abrirEditar}
              onDelete={onDelete}
              reloadKey={reloadKey}
            />
          ) : (
            <Editor<Caracteristica>
              endpoint={API_ENDPOINTS.CARACTERISTICAS}
              saveEndpoint={API_ENDPOINTS.CARACTERISTICAS_EDITOR}
              fields={CARACTERISTICA_FIELDS}
              idEdicion={idEdicion}
              onCerrar={cerrarEditor}
              onGuardado={onGuardado}
              extraBeforeActions={(
                <div className="space-y-4">
                  <RemoteRelationMultiSelector
                    title="Packs relacionados"
                    description="Selecciona los packs que quieras asociar a esta característica."
                    createModeMessage="Guarda la característica primero para poder relacionarlo con packs."
                    entityId={idCaracteristicaActual}
                    catalogEndpoint={`${API_ENDPOINTS.PACKS_EDITOR_READ}`}
                    relationEndpointBase={`${API_ENDPOINTS.CARACTERISTICAS_EDITOR}/packs`}
                    token={getEditorToken()}
                    optionIdField="id_pack"
                    optionLabelField="description"
                    relationIdsField="id_packs"
                    createBodyField="id_pack"
                    openLabel="Seleccionar packs"
                  />

                  <RemoteRelationMultiSelector
                    title="Soluciones-Ámbitos asociadas"
                    description="Selecciona las soluciones por ámbito que aplican a esta característica."
                    createModeMessage="Guarda la característica primero para poder relacionarlo con soluciones-ámbitos."
                    entityId={idCaracteristicaActual}
                    catalogEndpoint={`${API_ENDPOINTS.SOLUCIONES_EDITOR_READ}/soluciones-ambitos`}
                    relationEndpointBase={`${API_ENDPOINTS.CARACTERISTICAS_EDITOR}/soluciones-ambitos`}
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
                    description="Selecciona las soluciones por ámbito y sector que aplican a esta característica."
                    createModeMessage="Guarda la característica primero para poder relacionarlo con soluciones-ámbitos-sectores."
                    entityId={idCaracteristicaActual}
                    catalogEndpoint={`${API_ENDPOINTS.SOLUCIONES_EDITOR_READ}/soluciones-ambitos-sectores`}
                    relationEndpointBase={`${API_ENDPOINTS.CARACTERISTICAS_EDITOR}/soluciones-ambitos-sectores`}
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